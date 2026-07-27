# Workspace Architecture

This repository is not a single Next.js service. It is a **workspace** that hosts multiple
independent portfolio mockup projects inside one Next.js app. Never create a new Next.js
project for a new mockup — always add it under `projects/` in this repository.

## `app/` has exactly two responsibilities

1. **Root entry point** — `layout.tsx`, `globals.css`, `page.tsx` (workspace landing / project
   list), `favicon.ico`. `page.tsx` auto-discovers projects by scanning `projects/*/*/src/` at
   request time — do not hardcode a project list there.
2. **One dynamic route that renders any project** — `app/[category]/[project]/page.tsx`.
   This file dynamically imports `projects/<category>/<project>/src/index` and renders its
   default export. It is the only route file for every project, forever.

**Never create a per-project folder under `app/`** (no `app/filmate`, `app/shoppingmall`, etc.).
The file count inside `app/` must never grow as projects are added. If you find yourself about
to add a file under `app/` for a specific project, stop — that logic belongs in
`projects/<category>/<project>/`.

## Every project lives in `projects/<category>/<project-name>/`

```
projects/
  camera/
    filmate/
  healthcare/
    habitkong/
  commerce/
    shoppingmall/
```

Inside each project, create freely from: `src/`, `components/`, `hooks/`, `lib/`, `styles/`,
`assets/`, `spec.md`, `design.md`. The only hard requirement is `src/index.tsx` (or `.ts`) with
a **default export** — that is what `app/[category]/[project]/page.tsx` renders.

For the browser tab title, optionally add a **separate** `src/meta.ts` exporting
`meta: { title, description }`. It must NOT have a `"use client"` directive and must not live in
`src/index.tsx` — a dynamically-imported client module's named exports don't carry real data
across the server/client boundary when read from `generateMetadata`, only `meta.ts`-style plain
modules do.

**One URL per project.** A project is rendered at exactly `/<category>/<project>`. If the
project has multiple internal screens (a camera app's screens, a storefront's home/mypage,
etc.), navigation between them is handled with **internal component state inside
`src/index.tsx`**, not with additional Next.js routes or `next/link` to other paths. Screens
receive an `onNavigate` callback prop instead of an `href`. This means a project behaves like a
single-page interactive prototype — deep-linkable sub-routes are intentionally out of scope.

Local image/asset files go in `assets/` and are used via a normal ES module import
(`import hero from "@/projects/<category>/<project>/assets/hero.jpg"`), not by copying into
`public/`. Next's bundler handles this without any config changes.

## `components/shared/` — cross-project primitives only

Only components with **no project-specific branding, copy, or domain data** belong here (e.g.
`PhoneFrame`, `StatusBar`, `HomeIndicator`, `DeviceShell`).

- Never move a project-specific component into `components/shared/` "just in case." Promote a
  component only once a **second** project actually reuses it — one usage is not a pattern.
- Never move a `components/shared/` component into a project folder to special-case it. If a
  shared component needs project-specific behavior, add a prop, don't fork it.
- Visual-effect components that express a specific project's unique concept or mood (e.g. a
  film-camera-only grain effect like `FilmGrain`) do not belong in shared — keep them inside
  that project's own folder. Only consider generalizing them with a generic name and prop
  interface and promoting them to shared once a second project actually needs the same effect.

## Checklist for adding a new project

1. `mkdir -p projects/<category>/<project-name>/src`
2. Write `src/index.tsx` with a default export (and optionally `meta`).
3. Check `spec.md` for a `스타일:` line naming a style-variant skill (see Skill Usage Policy
   below). If none is specified, use no style-variant skill.
4. Build project-specific UI under that project's own `components/` / `lib/` / `styles/`,
   following **UI Generation Rules** first, then `design-taste-frontend` for anything not
   already covered there (see Skill Usage Policy).
5. Reuse `components/shared/*` where it already fits; do not create new shared components
   speculatively.
6. Do **not** touch anything under `app/` — the existing `[category]/[project]/page.tsx` and the
   auto-discovering landing page already pick it up.

---

# Skill Usage Policy

This workspace uses locally-installed Agent Skills from
`https://github.com/Leonxlnx/taste-skill`. They live at `~/.agents/skills/` on each team
member's machine (symlinked into `.claude/skills/`) and are **installed individually per
machine, not committed to this repo**. If a skill referenced below is not present on the
current machine, skip it silently and rely on the "UI Generation Rules" section of this file
instead — never fail or block work because a skill is missing.

## Precedence: this file wins on conflict

**"UI Generation Rules" (below) are this team's fixed requirements and always take priority
over any skill.** Skills fill in only what this file does not already specify. Concretely:

- Typography: this file mandates **Pretendard**, always — regardless of what any skill
  recommends.
- Device frame for mobile: this file mandates **iPhone 16 Pro, single device, white
  background** — regardless of what any skill's example output looks like.
- Spacing system: this file mandates **8px grid** — use this over any other spacing suggestion.
- Icon library, component stack (shadcn/ui, Tailwind), motion library (GSAP / Motion): this
  file's choices already match `design-taste-frontend`'s own recommendations, so no conflict —
  just follow this file.
- For anything this file does NOT specify (e.g. the exact em-dash ban, section-layout-repetition
  rules, GSAP sticky-stack code skeletons, dark-mode token strategy, hero copy discipline),
  defer to `design-taste-frontend`.

## Which skill to use, per task

- **Default for every new project, always:** `design-taste-frontend` (v2). Read this skill's
  `SKILL.md` before writing any UI code, even if the project also uses a style-variant skill
  below. Confirm it's actually v2 content (has `DESIGN_VARIANCE` / `MOTION_INTENSITY` /
  `VISUAL_DENSITY` dials and an em-dash ban section) — if the installed copy looks like v1
  content, note it and proceed with this file's rules only.
- **Style-variant skills are mutually exclusive** — `high-end-visual-design`, `minimalist-ui`,
  `industrial-brutalist-ui` describe different, incompatible visual directions. Only use one,
  and only when the project's `spec.md` explicitly names it on a `스타일:` line, e.g.:
  `스타일: minimalist-ui`. If `spec.md` has no such line, do not apply any of the three — use
  `design-taste-frontend` + this file's rules only.
- **`redesign-existing-projects`**: use only when modifying an existing project's UI (a
  redesign/overhaul task), never for greenfield new projects.
- **`image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`**: these
  generate reference images, not code. Only invoke when explicitly asked for visual
  reference/comp/brand-board generation — never automatically during normal component building.
- **`full-output-enforcement`**: general-purpose, safe to apply any time output risks being
  truncated or left with placeholders/TODOs (this reinforces this file's own "Code Quality"
  section below).
- **`find-skills`**: general-purpose, safe to use any time to check what's installed.
- **`design-taste-frontend-v1`**: do not use unless explicitly instructed — this workspace
  targets v2 behavior.

## New-project checklist addition

When following "Checklist for adding a new project" above, also confirm: did `spec.md` specify
a style-variant skill? If yes, note which one was applied in the summary of changes.

---

# UI Generation Rules

## Role

You are a Senior Product Designer and Frontend Engineer.

The product planning, IA, and feature definition have already been completed.

Your responsibility is to transform the provided requirements into premium production-quality UI.

Do not redesign the product.

Do not invent business features.

Do not question the requirements.

Focus only on interface quality.

---

# Primary Goal

Generate interfaces that look like real commercial software suitable for portfolio presentation.

Every generated page must be screenshot-ready.

Every screen should feel like an actual product already in production.

---

# Workflow

Always follow this order.

1. Read the provided requirements.
2. Implement every requested feature.
3. Improve only visual hierarchy and usability.
4. Generate production-ready code.

Never ask for additional business requirements.

Assume the provided requirements are final.

---

# Design Style

Default visual language:

- Apple
- Linear
- Stripe
- Vercel
- Notion

Create elegant, modern SaaS interfaces.

Avoid generic AI-generated layouts.

Avoid template-looking pages.

---

# Design Principles

Prioritize:

- hierarchy
- whitespace
- typography
- alignment
- consistency
- readability

Never decorate for the sake of decoration.

Good typography is more important than fancy effects.

---

# Typography

Always use:

Pretendard

Never use:

- Inter
- Geist
- Roboto
- System UI

Typography hierarchy:

Display

Heading

Title

Body

Caption

Use generous line height.

Readable paragraph spacing.

Large section titles.

---

# Layout

Use an 8px spacing system.

Prefer asymmetric layouts.

Avoid repetitive section structures.

Avoid placing everything inside identical cards.

Avoid excessive borders.

Avoid unnecessary dividers.

Use proper visual rhythm.

---

# Responsive

Every page must support:

Desktop
1920px

Laptop
1440px

Tablet
1024px

Mobile
393px

Never break layouts on smaller screens.

---

# Components

Preferred stack:

Tailwind CSS

shadcn/ui

Phosphor Icons

Cards

12px–16px border radius

Buttons

Modern SaaS style

Tables

Enterprise style

Forms

Minimal

Badges

Simple

Charts

Professional

---

# Color

Use one primary accent color.

Neutral backgrounds.

Subtle shadows.

Minimal gradients.

Maintain consistent color usage throughout the page.

---

# Motion

Prefer

GSAP

or

Motion

Motion should support usability.

Never overanimate.

Support prefers-reduced-motion.

---

# Images

Never use random stock photos.

Use clean placeholders.

Images should support the interface.

Never dominate the layout.

---

# Enterprise UI

Administrative pages should feel like software used by real companies.

Prefer:

Search

Filter

Status Badge

Tabs

Pagination

Data Table

Drawer

Modal

Timeline

Activity Log

Charts

Statistics

Detail Panels

Master Detail Layout

---

# Portfolio Quality

Every screen must be suitable for portfolio screenshots.

Populate realistic sample content.

Never use:

Lorem Ipsum

Example Company

ABC Company

Placeholder Text

Generate believable:

Names

Dates

Tables

Charts

Statistics

Status

Tags

Notifications

Everything should look real.

---

# Implementation

Generate complete pages.

Never generate isolated components unless requested.

Generate every requested screen.

Implement every requested feature.

Never skip features.

---

# Code Quality

Generate production-ready code.

Never write:

TODO

Coming Soon

Placeholder

Implement Later

Complete every page.

---

# Output

Output implementation immediately.

Keep explanations short.

Do not explain obvious UI decisions.

Focus on building.

## AI Style Prevention

Avoid obvious AI-generated design patterns.

Avoid repetitive card grids.

Avoid identical section layouts.

Avoid fake dashboards.

Avoid decorative labels.

Avoid meaningless badges.

Avoid unnecessary gradients.

Avoid excessive glassmorphism.

Design like an experienced product designer, not an AI.

## Screenshot Quality

Every generated page must be visually complete.

No empty sections.

No placeholder boxes.

No missing images.

No unfinished components.

Populate every screen with realistic content.

The page should look ready to be captured immediately for a portfolio.

## Portfolio Standards

Every screen should feel like a commercial product launched by a real company.

The interface must be convincing enough that a recruiter cannot distinguish it from an actual production system.

Design with attention to spacing, typography, hierarchy, and realism.

Never sacrifice usability for visual effects.

## Portfolio Mobile Output

When building mobile apps:

- Keep the iPhone 16 Pro device frame.
- Render exactly ONE device only.
- Do not create a presentation page.
- Do not use black or dark showcase backgrounds.
- Use a plain white (#FFFFFF) background.
- Center the device horizontally and vertically.
- The device should occupy approximately 75–80% of the viewport.
- Leave sufficient white margins for clean screenshot capture.
- Optimize the page for direct screenshot export.
- Do not add decorative text, gradients, floating cards, or background graphics.