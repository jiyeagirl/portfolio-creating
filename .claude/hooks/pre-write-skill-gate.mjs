#!/usr/bin/env node
// PreToolUse (Write): before the first new UI file of a project, the design
// skills CLAUDE.md requires must actually have been read in this session.
//
// Required: the workspace skill .claude/skills/mockup-craft (SKILL.md,
// references/anti-slop.md, and references/app.md, web.md or console.md by
// platform), plus the skill on spec.md's `스타일:` line, plus
// supanova-premium-aesthetic when spec.md says `프리미엄디테일: soft-skill`.
// A user-level skill not installed on this machine is skipped (CLAUDE.md:
// missing skill → skip silently).
//
// Once satisfied, projects/<c>/<p>/.skill-read records it for 12 hours so
// parallel screen-building subagents don't each have to re-read the skills.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const TTL_MS = 12 * 60 * 60 * 1000;
const USER_SKILLS_DIR = path.join(os.homedir(), ".claude", "skills");

const input = JSON.parse(readFileSync(0, "utf8"));
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const filePath = input.tool_input?.file_path;
if (!filePath || existsSync(filePath)) process.exit(0);

const rel = path.relative(root, filePath);
const match = rel.match(/^projects\/([^/]+)\/([^/]+)\/(src|components)\/.+\.tsx$/);
if (!match) process.exit(0);

const [, category, project] = match;
const projectDir = path.join(root, "projects", category, project);

let specPath = path.join(projectDir, "spec.md");
if (!existsSync(specPath) && project.endsWith("-admin")) {
  specPath = path.join(root, "projects", category, project.replace(/-admin$/, ""), "spec.md");
}
const spec = existsSync(specPath) ? readFileSync(specPath, "utf8") : "";

// Which platform reference this file needs: app (mobile app in the phone
// frame), web (customer-facing responsive site) or console (admin / business
// console). Decided per file, because a project scaffolded with --with-admin
// keeps its admin console under the main project's components/admin/.
function platformOf() {
  if (project.endsWith("-admin") || rel.includes("/components/admin/")) return "console";
  const reference = path.join(projectDir, "_reference.md");
  if (existsSync(reference)) {
    const preset = readFileSync(reference, "utf8").match(/^- 프리셋: *(app|web|console)/m);
    if (preset) return preset[1];
  }
  const index = path.join(projectDir, "src", "index.tsx");
  if (existsSync(index)) {
    const source = readFileSync(index, "utf8");
    if (source.includes("ResponsiveSite")) return "web";
    if (source.includes("PhoneFrame")) return "app";
  }
  // Projects scaffolded before the preset line: read spec's "플랫폼:" line, main
  // (user-facing) part only, e.g. "고객용 반응형 Web(PC, 모바일), 관리자 Web".
  const line = spec.match(/\**플랫폼\**\s*:\s*([^\n]*)/);
  if (line) {
    const main = line[1].split(/[+,]/)[0];
    if (/반응형|고객|사용자|responsive/i.test(main)) return "web";
    if (/mobile|모바일|\bapp\b|앱/i.test(main)) return "app";
    if (/관리|콘솔|대시보드|admin|console|web|웹/i.test(main)) return "console";
  }
  return "app";
}

// Keys are `<skill>` for its SKILL.md or `<skill>/<ref>` for references/<ref>.md.
// Each entry is a list of acceptable alternatives.
const required = [["mockup-craft"], ["mockup-craft/anti-slop"], [`mockup-craft/${platformOf()}`]];
const style = spec.match(/\**스타일\**\s*:\s*`?([a-z0-9-]+)/);
if (style) required.push([style[1]]);
if (/\**프리미엄디테일\**\s*:\s*`?soft-skill/.test(spec)) required.push(["supanova-premium-aesthetic"]);

const skillFile = (key) => {
  const [name, ref] = key.split("/");
  const base = name === "mockup-craft" ? path.join(root, ".claude", "skills") : USER_SKILLS_DIR;
  return path.join(base, name, ref ? path.join("references", `${ref}.md`) : "SKILL.md");
};
const installed = (key) => existsSync(skillFile(key));
const needed = required
  .map((alts) => alts.filter(installed))
  .filter((alts) => alts.length > 0);
if (needed.length === 0) process.exit(0);

const markerPath = path.join(projectDir, ".skill-read");
let marker = null;
try {
  marker = JSON.parse(readFileSync(markerPath, "utf8"));
} catch {}
const fresh = marker && Date.now() - marker.at < TTL_MS;
const inMarker = (alts) => fresh && alts.some((a) => marker.skills?.includes(a));

// Skills read in this session: Read of .../<name>/SKILL.md, a Bash cat/sed of
// it, or a Skill tool call.
const readInSession = new Set();
if (input.transcript_path && existsSync(input.transcript_path)) {
  for (const line of readFileSync(input.transcript_path, "utf8").split("\n")) {
    if (!line.includes('"tool_use"') || !(line.includes("skills/") || line.includes('"Skill"'))) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.type !== "assistant") continue;
    for (const c of entry.message?.content ?? []) {
      if (c.type !== "tool_use") continue;
      if (c.name === "Skill" && c.input?.skill) readInSession.add(c.input.skill);
      const target = c.name === "Read" ? c.input?.file_path : c.name === "Bash" ? c.input?.command : null;
      if (!target) continue;
      for (const m of target.matchAll(/skills\/([a-z0-9-]+)\/(?:SKILL\.md|references\/([a-z0-9-]+)\.md)/g)) {
        readInSession.add(m[2] ? `${m[1]}/${m[2]}` : m[1]);
      }
    }
  }
}

const missing = needed.filter((alts) => !inMarker(alts) && !alts.some((a) => readInSession.has(a)));
if (missing.length === 0) {
  const skills = new Set(fresh ? marker.skills : []);
  for (const alts of needed) for (const a of alts) if (readInSession.has(a)) skills.add(a);
  if (!fresh || skills.size !== marker.skills.length) {
    writeFileSync(markerPath, JSON.stringify({ skills: [...skills], at: fresh ? marker.at : Date.now() }));
  }
  process.exit(0);
}

const shown = (file) => (file.startsWith(root) ? path.relative(root, file) : file.replace(os.homedir(), "~"));
const lines = missing.map((alts) => `  - ${shown(skillFile(alts[0]))}`);
console.error(
  [
    `[skill-gate] ${category}/${project}의 첫 UI 파일을 쓰기 전에 아래 skill을 Read 도구로 끝까지 읽는다:`,
    ...lines,
    "mockup-craft는 이 워크스페이스 전용 기본 skill이다. 스타일 skill은 방향만 가져오고 랜딩 페이지 규칙" +
      "(대문자 아이브로우 필, HTML/CDN 출력)은 따르지 않는다. 읽은 뒤 design.md 적용 규칙 절에 해석 한 줄과 다이얼 값을 적는다.",
  ].join("\n"),
);
process.exit(2);
