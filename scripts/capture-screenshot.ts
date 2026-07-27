/**
 * Captures a project's <PhoneFrame> as a transparent PNG cutout — chassis,
 * screen, notch and side buttons, with fully transparent corners (no white
 * square behind the rounded body). Requires the dev server to be running.
 *
 * Usage:
 *   npx tsx scripts/capture-screenshot.ts <category> <project> [screen...]
 *   node --import tsx scripts/capture-screenshot.ts <category> <project>
 *
 * Examples:
 *   npx tsx scripts/capture-screenshot.ts camera filmate
 *   npx tsx scripts/capture-screenshot.ts camera filmate camera films settings
 *   npx tsx scripts/capture-screenshot.ts camera filmate --base-url=http://localhost:3001
 *
 * Multi-screen capture relies on an opt-in convention: a project's
 * src/index.tsx may read the initial screen from a `?screen=` query param
 * (see the "Multi-screen capture" section in the project README / PR notes
 * for the exact pattern). When one or more screen names are passed on the
 * CLI, each is requested as `?screen=<name>` and saved as `<name>.png`.
 * Projects that haven't adopted the convention simply ignore the unknown
 * query param and always render their default screen.
 */

import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

interface Args {
  category: string;
  project: string;
  screens: string[];
  baseUrl: string;
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  let baseUrl = "http://localhost:3000";

  for (const arg of argv) {
    if (arg.startsWith("--base-url=")) {
      baseUrl = arg.slice("--base-url=".length);
    } else {
      positional.push(arg);
    }
  }

  const [category, project, ...screens] = positional;
  if (!category || !project) {
    console.error(
      "Usage: npx tsx scripts/capture-screenshot.ts <category> <project> [screen...] [--base-url=http://localhost:3000]",
    );
    process.exit(1);
  }

  return { category, project, screens, baseUrl };
}

async function assertDevServerRunning(baseUrl: string) {
  try {
    await fetch(baseUrl, { method: "HEAD" });
  } catch {
    console.error(
      `Could not reach ${baseUrl}. Start the dev server first (npm run dev) and try again.`,
    );
    process.exit(1);
  }
}

/**
 * Neutralizes every opaque background between the document root and the
 * phone frame's own chassis paint. The chassis already clips its own
 * background to its rounded corners (border-radius does that regardless of
 * overflow), so once nothing opaque sits behind it, `omitBackground: true`
 * leaves the corners genuinely transparent instead of showing the studio
 * backdrop color (white, or a project's dark override) through them.
 */
async function neutralizeBackgroundsForCapture(page: import("playwright").Page) {
  await page.evaluate(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";

    const backdrop = document.querySelector<HTMLElement>("[data-phone-frame-backdrop]");
    if (backdrop) backdrop.style.background = "transparent";

    const glow = document.querySelector<HTMLElement>("[data-phone-frame-glow]");
    if (glow) glow.style.display = "none";
  });
}

/**
 * The phone frame's root element (`[data-phone-frame]`) is sized by normal
 * flow — it's always exactly chassis size (fixed 393x852 screen + fixed
 * padding), regardless of what a given screen renders, because the screen
 * surface scrolls internally instead of growing. So its own
 * getBoundingClientRect() is already stable across every screen/project.
 *
 * The only pixels that legitimately sit outside that box are the four
 * side-button nubs (`-left-[2px]` / `-right-[2px]`), each marked with
 * `data-phone-frame-button`. Union with *those specifically* — not with
 * `querySelectorAll("*")` — because screen content can include elements
 * that are visually clipped by `overflow-hidden`/scroll but still report a
 * large, unclipped getBoundingClientRect() (e.g. an unconstrained image, or
 * a long scrollable list). Unioning with every descendant let that leak
 * into the clip rect and made the exported canvas size vary screen to
 * screen; unioning with only the known button nubs keeps it constant.
 */
async function getPhoneFrameClipRect(page: import("playwright").Page) {
  const rect = await page.evaluate(() => {
    const root = document.querySelector("[data-phone-frame]");
    if (!root) return null;

    let { left, top, right, bottom } = root.getBoundingClientRect();
    for (const el of root.querySelectorAll("[data-phone-frame-button]")) {
      const r = el.getBoundingClientRect();
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    }
    return { x: left, y: top, width: right - left, height: bottom - top };
  });

  if (!rect) {
    throw new Error(
      "No [data-phone-frame] element found on the page. Is this project built on components/shared/phone-frame.tsx?",
    );
  }
  return rect;
}

async function main() {
  const { category, project, screens, baseUrl } = parseArgs(process.argv.slice(2));
  await assertDevServerRunning(baseUrl);

  const outDir = path.join(process.cwd(), "projects", category, project, "screenshots");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const runs = screens.length > 0 ? screens : [null];

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  await page.emulateMedia({ reducedMotion: "reduce" });

  try {
    for (const screen of runs) {
      const url = screen
        ? `${baseUrl}/${category}/${project}?screen=${encodeURIComponent(screen)}`
        : `${baseUrl}/${category}/${project}`;

      console.log(`Navigating to ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-phone-frame]", { timeout: 15_000 });
      await page.waitForTimeout(300); // let entrance transitions/animations settle

      await neutralizeBackgroundsForCapture(page);
      const clip = await getPhoneFrameClipRect(page);

      const fileName = screen ? `${screen}.png` : `${Date.now()}.png`;
      const outPath = path.join(outDir, fileName);

      await page.screenshot({ path: outPath, clip, omitBackground: true });
      console.log(`Saved ${path.relative(process.cwd(), outPath)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
