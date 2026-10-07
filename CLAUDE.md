# 반복 버그 체크리스트 (매 프로젝트 작업 전 한 번 훑기)

과거 세션에서 실제로 반복됐던 실패. 빠르게 훑는 용도이고, 맥락과 이유는 각 상세 절에 있다.

- [ ] **공유 컴파일 단위 500** — 리프 먼저, 배럴/엔트리 마지막. 상세: `app/` 절 "공유 컴파일 단위".
- [ ] **기기 프레임 흰 틈** — 엣지 고정 바에 `backdrop-blur` 금지. 상세: "Device edge integrity".
- [ ] **em dash(—)/중간점(·) 금지** — 렌더링되는 모든 텍스트. 상세: `UI Generation Rules` Typography.
- [ ] **아키타입 중복** — 새 프로젝트가 `SectionHead` + 가로스크롤 + `absolute inset-x-0
      bottom-0` 탭바로 시작하고 있으면 멈춘다. A1은 이미 12개다. 상세: `ARCHETYPES.md`.
- [ ] **아무도 화면을 안 봄** — `tsc`/`curl 200` 통과는 완성이 아니다. `npm run visual` 캡처와
      별도 리뷰 에이전트 판정까지 끝내야 완성. 상세: "Batch Build" 5단계.

---

# Workspace Architecture

- This repo is not a single Next.js service. It is a **workspace** hosting multiple independent portfolio mockup projects in one Next.js app.
- Never create a new Next.js project for a new mockup — always add under `projects/`.

## `app/` — exactly two responsibilities

1. **Root entry**: `layout.tsx`, `globals.css`, `page.tsx` (workspace landing / project list), `favicon.ico`.
   `page.tsx` auto-discovers projects by scanning `projects/*/*/src/` at request time — never hardcode a project list.
2. **One dynamic route for every project**: `app/[category]/[project]/page.tsx`.
   Dynamically imports `projects/<category>/<project>/src/index`, renders its default export. The only route file for every project, forever.

- Never create a per-project folder under `app/` (no `app/filmate`, `app/shoppingmall`).
- File count in `app/` never grows as projects are added. About to add a project-specific file under `app/`? Stop — it belongs in `projects/<category>/<project>/`.

### 공유 컴파일 단위 (recurring 500 — check before committing an entry)

프로젝트 라우트의 dynamic import는 경로가 템플릿 리터럴이라 번들러가 개별 모듈을 고르지 못하고 `projects/*/*/src/`에 매칭되는 **전부를 하나의 context 모듈로 묶는다.** URL은 프로젝트마다 달라도 **컴파일 단위는 이 라우트 하나뿐이다.**

따라서 **어떤 프로젝트든 `src/` 아래에서 존재하지 않는 모듈을 import하면 워크스페이스의 모든 프로젝트 URL이 500이 난다** — 방금 만든 프로젝트만이 아니다. `page.tsx`의 `loadComponent` `try/catch`는 도움이 안 된다. 런타임 throw가 아니라 빌드 타임 resolve 실패라 catch에 도달하기 전에 컴파일이 죽는다.

실무 규칙: **참조하는 파일을 먼저 만들고 엔트리를 쓴다.** 특히 `<project>-admin/src/index.tsx`처럼 형제 프로젝트를 가리키는 얇은 엔트리는 대상 파일 없이 두지 않는다 (`/scaffold --with-admin`이 시드 `admin-app.tsx`를 함께 만드는 이유). 갑자기 무관한 프로젝트가 500이면 dev 서버 로그에서 **다른 프로젝트의** module-not-found를 먼저 찾는다.

## Projects live in `projects/<category>/<project-name>/`

```
projects/
  camera/filmate/
  healthcare/habitkong/
  commerce/shoppingmall/
```

- Inside a project, create freely: `src/`, `components/`, `hooks/`, `lib/`, `styles/`, `assets/`, `spec.md`, `design.md`.
- Only hard requirement: `src/index.tsx` (or `.ts`) with a **default export** — that is what the route renders.
- Optional browser-tab title: a **separate** `src/meta.ts` exporting `meta: { title, description }`.
  - No `"use client"` directive; must not live in `src/index.tsx`.
  - Why: a dynamically-imported client module's named exports don't carry real data across the server/client boundary when read from `generateMetadata`. Only plain `meta.ts`-style modules do.
- **One URL per project** — `/<category>/<project>`.
  - Multiple internal screens (a camera app's screens, a storefront's home/mypage) → internal component state in `src/index.tsx`. No extra Next routes, no `next/link` to other paths.
  - Screens take an `onNavigate` callback prop instead of an `href`.
  - A project behaves like a single-page interactive prototype; deep-linkable sub-routes are intentionally out of scope.
- Local images/assets → `assets/`, used via normal ES module import (`import hero from "@/projects/<category>/<project>/assets/hero.jpg"`). Never copy into `public/`. No bundler config needed.

## `components/shared/` — cross-project primitives only

- Only components with no project-specific branding, copy, or domain data (`PhoneFrame`, `StatusBar`, `HomeIndicator`, `WatchFrame`, `ResponsiveSite`).
- Never move a project-specific component here "just in case." Promote only once a **second** project actually reuses it — one usage is not a pattern.
- Never move a shared component into a project folder to special-case it. Needs project-specific behavior → add a prop, don't fork.
- Visual-effect components expressing a project's unique concept or mood (e.g. a film-camera-only `FilmGrain`) stay in that project's folder. Generalize with a generic name + prop interface and promote only once a second project needs the same effect.
- Already promoted: `Toggle` (`toggle.tsx`) and the mobile `ScreenHeader` (`screen-header.tsx`, sticky app bar with back button, clears the status bar via `pt-[59px]`). Colors/typography go in via className props, same pattern as `PhoneFrame`. Import these instead of rewriting them.
- Don't over-promote by function name. Per-project `Badge`/`Button`/`Card`/`StatTile`/`ProgressBar`/`EmptyState` only *look* like duplicates — their tone vocabularies, radius grammar, and press-feedback conventions are that project's visual identity (`mockup-craft`'s `DESIGN_VARIANCE`). Promote only when the **structure**, not the name, is identical across two projects.

## 아키타입 배정 (카탈로그: 루트 `ARCHETYPES.md`)

프로젝트들이 "다 비슷해 보이는" 원인은 색이 아니다. 색은 전부 다르다. 같은 것은
**골격**이다. 모바일 홈 아키타입 A1(섹션 스택)과 관리자 셸 C1(236px 다크 레일)이 각각 10개 넘게
점유했다.

- **배정은 `spec.md`를 읽고 직접 한다 — 사용자에게 A번호를 묻지 않는다.** 도메인, `플랫폼:`,
  Key Focus에 이미 판별 근거가 있다(waypoint를 A4로 배정한 근거는 그 spec의 "'내 동선 홈'을
  핵심 차별점으로 가장 강조"였다). `ARCHETYPES.md`는 사용자가 읽는 문서가 아니라 배정할 때
  펼치는 카탈로그다. 팔레트 구성(아래 `## Color` 1~6)과 관리자 셸(C1~C4)도 같은 방식으로 정한다.
- `spec.md`에 `아키타입:` / `셸:` / `팔레트:` 줄이 이미 있으면 **그것이 이긴다.** 사용자가
  의견을 밝힌 것이므로 재배정하지 않는다. 없는 것이 정상이고, 새로 쓰라고 요구하지 않는다.
  spec이 `아키타입: A1`을 직접 적었어도 따른다 (아래 A1 금지는 Claude가 스스로 배정할 때의 규칙이다).
  이때 최종 요약에 "A1은 이미 포화" 한 줄을 남긴다.
- 배정 결과는 `_reference.md`의 "이번 프로젝트 배정"에 한 줄씩(스캐폴드 중복 검사가 여기를 읽는다),
  근거는 `design.md`의 "아키타입" 절에 적는다.
- **A1은 신규 배정 금지.** 새 프로젝트가 `SectionHead` + 가로스크롤 + 하단 탭바로 시작하려
  하면 멈추고 `ARCHETYPES.md`에서 다른 것을 고른다. 맞는 것이 없으면 그 문서에 새 아키타입을
  **먼저 추가**한다.
- 같은 `projects/<category>/` 안에서 같은 아키타입 2개 금지.
- `design.md`의 "아키타입" 절에 고른 것 / 배제한 후보 2개와 이유 / **이 아키타입에서 쓰지
  않기로 한 부품**(예: A4는 `SectionHead` 없음, A5는 하단 탭바 없음)을 적는다.

## Checklist: adding a new project

Steps run in this order. Every file a later file imports is written first (Batch Build step 2).

1. **Scaffold.** `/scaffold <category>/<project-name> [app|web|console] [--with-admin] [--with-mobile]`
   (or `mkdir -p projects/<category>/<project-name>/src` by hand).
   The `--archetype A<n>` / `--shell C<n>` / `--palette <1-6>` flags are **optional overrides**;
   omitting them is the normal path, and the assignment is made in step 2 by reading `spec.md`.
   Pick the preset by platform:
   - `app` (default) → structure reference `projects/camera/filmate/`. Mobile app in the iPhone frame.
   - `web` → `projects/community/locly/`. **Customer-facing responsive website** (shop, booking,
     community). One site that works at desktop and mobile widths; see "Responsive Web Output".
   - `console` → `projects/b2b/assetflow/`. Admin or business web console. Shell precedents:
     C2 `projects/platform/studyspot/components/admin/admin-shell.tsx`, C3/C4 listed in `_reference.md`.
     (Before 2026-09 `web` meant this preset.)
   - `--with-admin` also creates the thin `<project>-admin/src/` entry (`index.tsx` + `meta.ts`) and a seed `components/admin/admin-app.tsx` in the main project, so the tree compiles right after scaffolding. Admin screens live in the main project and `-admin` exists only to claim a second URL. Replace the seed; never delete it. The replacement `AdminApp` reads its initial screen from `?screen=` (precedent: `projects/b2b/assetflow/components/admin/admin-app.tsx`). Replace the placeholder title/description in `<project>-admin/src/meta.ts` too.
   - `--with-mobile` (`console` preset only) creates a fully independent `<project>-mobile/` scaffold on the `app` preset, with its own `spec.md` / `design.md`.
   - The scaffold also drops a `.visual-pending` marker in the project (see Batch Build step 5), and records `- 프리셋: app|web|console` in `_reference.md`, which the hooks read.

   **The scaffold does not copy reference files.** It writes one `_reference.md` naming the
   originals, and you read those originals directly. `filmate.css` / `assetflow.css` are, despite
   the name, **color files** — `filmate.css` is 13 lines and all of them are color, with zero
   spacing/radius tokens. Spacing, radius and type scale live in the original's `design.md` prose
   and its component files (`filmate/components/screens/`, `locly/components/site/`,
   `assetflow/components/ui.tsx`), not in CSS.

   What you take from a reference is **structure and a completeness bar, never numbers** — pick
   numbers fresh per `## Motion` → "스케일 복제 금지". Never take: colors, tone vocabularies,
   mock people or timestamps (`박채린`, `09:41`), or `@/projects/<reference>/...` absolute imports.
2. **Read and assign.** Read `spec.md` and assign the archetype (app: `ARCHETYPES.md` A2~A8;
   web: 홈 골격 from `mockup-craft` web.md; console: 사용자 화면 셸), admin shell and palette
   composition yourself from its domain (`## 아키타입 배정`). Write each into `_reference.md`'s
   "이번 프로젝트 배정", then grep the same category's `_reference.md` files for the same number
   (the scaffold's own duplicate check only runs when `--archetype` is passed).
   Check for three optional lines; note in the final summary which were applied:
   - `스타일: <skill-name>` — style-variant skill (see Skill Usage Policy).
   - `디자인시스템: <filename>` — a doc under `design-systems/` (see Design Systems). A missing file is a spec bug: stop and ask the user for it.
   - `프리미엄디테일: soft-skill` — layers `supanova-premium-aesthetic` on top of the default (see Skill Usage Policy).
   - Missing → none applied; use only this file's UI Generation Rules + the workspace skill `mockup-craft`.
   - Then **Read in full**: `.claude/skills/mockup-craft/SKILL.md`, its `references/anti-slop.md`, the platform reference (`app.md`, `web.md` or `console.md`; `--with-admin` adds `console.md`), plus the `스타일:` skill and `supanova-premium-aesthetic` when named. `.claude/hooks/pre-write-skill-gate.mjs` blocks new UI files until this is done.
3. **Write `design.md` before the first UI file.** Required for every project with its own `styles/`. Skip only for thin `-admin` / route-only wrapper projects that import a sibling project's components and inherit its tokens (note that inheritance in the **main** project's `spec.md` / `design.md`; `-admin` has no docs of its own). Sections, in this order, omitting any that don't apply:
   아키타입 / 적용 규칙 / Tokens, 팔레트 / Shape / Typography / 사진 매핑 / then by preset: 기기 프레임 안쪽 규칙 *(app)*, 반응형 기준 *(web)*, 셸 레이아웃 + 표 밀도, 컬럼 예산 *(console, and any project scaffolded `--with-admin`)* / Motion, plus a section for any project-specific asset system (mascot, hand-drawn marks). Section contents: 아키타입, 셸 레이아웃, 표 밀도 in scaffold.md step 4; 반응형 기준 in `mockup-craft` web.md; 적용 규칙 below and in `mockup-craft` section 1; Typography and Motion in `## Motion` → "스케일 복제 금지"; 사진 매핑 in `## Images`.
   In **적용 규칙**, start with `mockup-craft`'s one-line reading (`해석: <화면 종류> for <누구>. 다이얼 V/M/D.`), name only skills whose `SKILL.md` you actually read this session, and justify the `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY` values against `mockup-craft` section 2's definitions and presets. A skill name or dial value copied without reading the skill is the failure this rule exists for.
4. **Fill `styles/`** from design.md, with values picked fresh.
5. **Build the UI** under the project's own `lib/` → `components/` (ui, screens) → shell / `admin-app.tsx`. Order of authority: **UI Generation Rules → applicable Design System → `스타일:` skill (direction only) → `mockup-craft` for anything left**. Reuse `components/shared/*` where it already fits; never create shared components speculatively.
6. **Write `src/index.tsx` last** (default export, plus an optional separate `src/meta.ts`), after every screen it imports exists. It reads the initial screen from `?screen=` (`projects/camera/filmate/src/index.tsx` `getInitialScreen`). A `web` project wraps its site in `<ResponsiveSite>` (`components/shared/responsive-site.tsx`).
7. Do **not** touch anything under `app/` — the existing `[category]/[project]/page.tsx` and the auto-discovering landing page already pick it up.
8. Build every screen in `spec.md` in one continuous pass, then verify once at the end (see Batch Build). Don't stop for confirmation between screens.

---

# Skill Usage Policy

- **`mockup-craft` is this workspace's own skill, committed at `.claude/skills/mockup-craft/`.** It distills the external skills below down to what applies to Korean mobile app screens, customer-facing responsive websites and admin consoles, merged with the user's recurring corrections. It is the default for every project.
- External skills come from `https://github.com/Leonxlnx/taste-skill`, live at `~/.agents/skills/`, **installed per machine, not committed to this repo**. **Disabled since 2026-09-18:** their links were moved from `~/.claude/skills/` to `~/.claude/skills-backup/` at the user's request, so Claude Code no longer loads them. Everything below about external skills applies only if the user moves a link back; until then a `스타일:` or `프리미엄디테일:` line finds no installed skill and is skipped (the next bullet), and `mockup-craft` alone carries the design judgment. All of them target landing pages or marketing sites; several prescribe exactly what this workspace bans (uppercase eyebrow pills in `supanova-premium-aesthetic` and `high-end-visual-design`, HTML + CDN output, Iconify).
- The `supanova-*` skills (`supanova-design-engine`, `supanova-redesign-engine`, `supanova-premium-aesthetic`, `supanova-full-output`) come from `https://github.com/uxjoseph/supanova-design-skill` — a Korean-first, Pretendard-tuned sibling of the same taste-skill lineage, installed the same way (same `~/.agents/skills/` + symlink convention).
- A referenced skill not present on this machine → skip silently, fall back to this file's UI Generation Rules. Never fail or block on a missing skill.

## Precedence (on conflict; applies to skills and design systems alike)

1. **This file's UI Generation Rules always win** — Pretendard typography, iPhone 16 Pro device frame (single device, white background), 8px spacing grid. These beat any skill or design-systems doc, even one naming a different font (e.g. SF Pro) or spacing system.
2. Then: color tokens, spacing, component specs, and elevation/shadow philosophy from `design-systems/<filename>.md` (or its `-compact` variant), if `spec.md` names one.
3. Then the `스타일:` skill, for direction only. Its landing-page mechanics (eyebrow pills, double-bezel cards on everything, `py-32` sections, HTML output) never apply.
4. Anything not covered: `mockup-craft`.

Every project is a React/TSX component at `src/index.tsx` styled with the project's own Tailwind build, with Phosphor icons (`@phosphor-icons/react`). No external skill's output format (raw HTML, Tailwind CDN, Iconify Solar) applies here.

## Design Systems

- Top-level `design-systems/` holds complete design system docs (color tokens, type scale, spacing, component specs, elevation philosophy).
- **Apply one only when `spec.md` names it** (`디자인시스템: apple_compact`). Both the bare name and the path form (`디자인시스템: design-systems/apple_compact.md`) are valid. If absent, don't reference `design-systems/` at all.
- **Filenames use an underscore**: `apple_compact.md`, `vercel_compact.md`, `claude_design_compact.md`, `clay_compact.md`, `wise_compact.md`, `farrari_compact.md`, `airbnb_compact.md`. Every doc in the folder is a `_compact` variant — there are no full versions to fall back to. A `spec.md` naming a file that isn't there is a bug in that `spec.md`, not a reason to improvise.
- Never apply a design system by default across projects — it clashes with projects needing their own concept (film-camera app, mascot-based healthcare app, etc).

## Which skill, per task

- **Default for every new project, always**: `mockup-craft` (SKILL.md + `references/anti-slop.md` + `references/app.md` or `console.md`). Read it before writing any UI code, even alongside a style-variant skill or design system.
- **`supanova-design-engine`, `design-taste-frontend`(-v1)**: reference only. Consult them only for a genuinely landing-page-like screen (a marketing intro inside a project) or when explicitly instructed. Their useful parts are already in `mockup-craft`.
- **Style-variant skills are mutually exclusive** — `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` are incompatible directions. Use only the one named on `spec.md`'s `스타일:` line. If absent, apply none of the three.
- **`supanova-premium-aesthetic`**: an additive finishing layer on top of the default, not a replacement for it. Apply only when `spec.md` has an optional `프리미엄디테일: soft-skill` line; combinable with a style-variant skill if both are named. Its eyebrow-pill and "everything animates in" rules do not apply (see `mockup-craft/references/anti-slop.md`).
- **`supanova-redesign-engine`, `redesign-existing-projects`**: only when modifying an existing project's UI, never greenfield. Use their audit order (scan, diagnose, fix without rewriting); judge against `mockup-craft`.
- **`image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`**: generate reference images, not code. Only when explicitly asked for visual reference / comp / brand board. Never automatically during component building.
- **`supanova-full-output`**: safe any time output risks truncation or placeholders/TODOs (reinforces Code Quality below).
- **`find-skills`**: general-purpose, safe any time, to check what's installed.

---

# Batch Build & Single Verification Pass

Default to one continuous pass; don't stop for confirmation after each screen or each check:

1. Read all of `spec.md` up front; build every listed screen in the same pass.
2. **아래에서 위로 쓴다.** 리프 모듈(`lib/types.ts` → `lib/mock-data.ts` → `components/ui.tsx` → 개별 화면)을 먼저 쓰고, **남을 import하는 파일**(`components/layout/app-shell.tsx`, `components/admin/admin-app.tsx`, `src/index.tsx`)을 **마지막에** 쓴다. 순서를 뒤집으면 그 사이 내내 워크스페이스의 **모든** 프로젝트 URL이 500이다 (`app/` 절의 "공유 컴파일 단위"). 화면을 하나 추가할 때도 같다 — 배럴/앱 파일에 import 줄을 먼저 넣지 말고, 파일을 만든 다음에 넣는다. `--with-admin` 시드를 교체할 때도 관리자 화면들을 먼저 쓰고 `admin-app.tsx`를 마지막에 교체한다.
3. Run `tsc --noEmit`, `eslint`, and a route check (`curl` the project's URL for a 200) **once, after all screens are built** — not per screen.
4. On failure, fix and re-run only that check, not the full build.
5. **시각 검증 루프** (새 프로젝트 필수. 코드 검사만으로는 렌더링 결과를 아무도 보지 않는다):
   1. dev 서버를 띄우고 spec의 **모든** 화면을 캡처한다:
      `npm run visual -- <category> <project> <screen...>` 에 프리셋별 장치를 붙인다:
      `app`은 없음(기본 phone), `web`은 `--device=web`(데스크톱 1440과 프레임 안 모바일 393을 둘 다),
      `console`은 `--device=console`.
      `--with-admin` 프로젝트는 관리자 화면을 `-admin` URL로 따로 캡처한다:
      `npm run visual -- <category> <project>-admin <screen...> --device=console`.
      화면 이름은 `src/index.tsx`의 `?screen=` 목록이고, 모달, 탭, 위저드 단계처럼 스크린샷이
      필요한 내부 상태는 `name:key=value` 토큰으로 넘긴다. 결과는 `.visual/`(gitignore)에 쌓인다.
   2. 출력의 `[error]`(금지 문자, 영어 아이브로우, backdrop-filter 엣지 바, Pretendard 누락,
      깨진 이미지, 가로 넘침, 모서리 흰 틈, 콘솔 에러, 콘솔 화면의 단위 붙은 큰 숫자)는 **리뷰 전에**
      고치고 해당 화면만 다시 돌린다.
   3. **별도 리뷰 에이전트**(Agent, general-purpose) 1개를 띄워 `.claude/visual-review.md`의
      리뷰어 프롬프트로 판정받는다. 판정 기준은 `mockup-craft`의 anti-slop.md와 점검표다.
      리뷰어에게 코드는 주지 않는다.
   4. high와 mid를 고친 뒤 바뀐 화면만 다시 캡처하고, **같은 리뷰어**에게 SendMessage로 재판정받는다.
   5. **최대 2라운드.** 그 뒤에도 남은 지적은 고치지 말고 최종 요약의 "미해결" 목록으로 넘긴다.
   6. 빌더 본인도 수정한 화면의 PNG는 Read로 직접 열어 확인한다. 리뷰어의 "통과"만 믿지 않는다.
   7. 루프를 마치면 프로젝트의 `.visual-pending` 마커를 삭제한다. 이번 세션에서 작업한 프로젝트에
      마커가 남아 있으면 Stop hook이 턴을 끝낼 때마다 한 번 상기시킨다.
6. Report one final summary (screens built, checks passed, 시각 검증 라운드별 지적 수와 해결 여부, 미해결 목록, **사진 요청 목록** (`## Images`), anything applied from `spec.md` such as style/design-system). Don't narrate intermediate steps turn-by-turn.

**Hooks** (`.claude/hooks/`, registered in `.claude/settings.json`) enforce the machine-checkable parts of this file:
- `post-edit-check.mjs`: after each edit under `projects/`, blocks em dash/interpunct in the code just written (comments exempt), imports that don't resolve (the workspace-wide 500) and new `@iconify/react` imports; notes `backdrop-blur` just written into a screen shown in the phone frame (app, and web's mobile view).
- `pre-write-skill-gate.mjs`: blocks each new `.tsx` under a project's `src/` or `components/` until `mockup-craft` (SKILL.md, anti-slop.md, and the platform reference) plus any `스타일:` / `프리미엄디테일:` skill were read. Platform is decided per file: `components/admin/` and `-admin` need `console.md`; otherwise `_reference.md`'s `- 프리셋:` line picks `app.md`, `web.md` or `console.md`. Reads are recorded per project in `.skill-read` for 12 hours so parallel subagents don't re-read.
- `stop-visual-gate.mjs`: at the end of a turn, if a project written to in this session still has `.visual-pending` (and screens exist), blocks once with what is missing, including the `-admin` capture.

A hook message is feedback to act on, not an error to route around.

Skip batching only when the user explicitly asks to review a single screen first, or when the task is a small edit to an existing screen rather than a new build.

---

# UI Generation Rules

## Role
Senior Product Designer and Frontend Engineer. Product planning, IA, and feature definition are already done — turn the given requirements into premium production-quality UI. Do not redesign the product, invent business features, or question requirements. Interface quality only.

## Primary Goal
Interfaces that look like real commercial software suitable for portfolio presentation. Every page must be screenshot-ready and feel like a product already in production.

## Workflow
Read requirements → implement every requested feature → improve only visual hierarchy and usability → generate production-ready code.
Never ask for additional business requirements; the provided requirements are final.

## Design Style
- Apple / Linear / Stripe / Vercel / Notion are a **floor for craft**, not the default visual
  language. It means match their alignment, whitespace and state handling — not look like them.
- The visual language comes from the domain in `spec.md`. The reference doesn't have to be SaaS:
  a camera app references camera apps, a map app references map apps, a monitoring screen
  references control rooms.
- Avoid generic AI-generated layouts and template-looking pages.

## Design Principles
- Prioritize hierarchy, whitespace, typography, alignment, consistency, readability.
- Never decorate for decoration's sake.
- Good typography beats fancy effects.

## Typography
- Always **Pretendard**. Never Inter, Geist, Roboto, or System UI. The only exception is a monospace face for codes, IDs and hashes (never for prices, dates or body text, which use Pretendard with `tabular-nums`).
- Hierarchy: Display → Heading → Title → Body → Caption.
- Generous line height, readable paragraph spacing, large section titles.
- **No 중간점(·, interpunct) and no em dash(—) in any rendered/user-facing text** — screen copy, labels, mock data, `meta.ts` titles/descriptions. This is a recurring generation tic across projects in this workspace and must stop. Use instead, by context:
  - Prose lists inside a sentence ("블로그·카드뉴스·숏폼") → comma (`블로그, 카드뉴스, 숏폼`).
  - Short compound section/tab/nav labels naming one combined concept ("사용자 · 권한", "에디터 · 승인") → slash (`사용자 / 권한`).
  - Inline metadata strips combining heterogeneous fields (name/type/assignee, name/phone, version/author) → pipe (`김지은 | 블로그 | A테크`).
  - A plain numeric range (`1–10 / 42`) may still use an en dash(–) — that's a distinct, typographically correct case, not the tic being banned.
  - Code comments are exempt (not rendered), but avoid the habit there too.

## Layout
- 8px spacing system.
- Prefer asymmetric layouts; avoid repetitive section structures.
- Avoid putting everything in identical cards, excessive borders, unnecessary dividers.
- Maintain proper visual rhythm.

## Components
- Stack: Tailwind CSS, Phosphor icons (`@phosphor-icons/react`). No shadcn/ui; each project writes its own `components/ui.tsx`. `@iconify/react` remains only in a few older projects; don't use it in new ones.
- Cards 12–16px radius. Buttons modern SaaS. Tables enterprise. Forms minimal. Badges simple. Charts professional.

## Color

색값을 다르게 고르는 것으로는 부족하다 — **팔레트의 구성 방식**을 프로젝트마다 고른다.
기존 프로젝트 대부분이 "라이트 뉴트럴 캔버스 + 액센트 1개 + 상태 5단"이라, 색이 전부 달라도
같은 인상을 준다. 다크 우선은 소수(filmate, colorrecipe, safesense 등)뿐이다.

아래 중 하나를 Claude가 spec의 도메인을 읽고 배정해 `_reference.md`와 design.md에 적는다
(spec에 `팔레트:` 줄이 있으면 그것이 이긴다). 같은 카테고리 안에서 연속 2개 금지:

1. **단일 액센트 / 라이트 뉴트럴** — 기본값이지만 포화(기존 대부분). 고르려면 이유를 `design.md`에 적는다.
2. **다크 우선** — 캔버스가 잉크. 라이브 미디어, 야간 사용, 촬영/관제 도메인.
3. **듀오톤** — 대등한 액센트 2개가 경쟁한다(브랜드 + 상태, 출발 + 도착). 지도/경로/대조 도메인.
4. **틴티드 뉴트럴** — 무채색이 아니라 색을 머금은 뉴트럴 전 계열(웜 샌드, 콜드 슬레이트).
   액센트를 거의 쓰지 않고 명도만으로 계층을 만든다.
5. **하이컨트라스트 / 무액센트** — 잉크와 종이 두 색 + 상태색만. 강조는 크기와 굵기로 한다.
6. **그라데이션 / 글로우 표면** — 라이브·미디어 도메인 한정. `Completeness`가 금지한 것은
   "장식용" 그라데이션이고, 라이브 영상 위 비네트나 상태 글로우는 기능이다.

어느 방식이든 유지: 상태색의 의미는 고정, 대비는 WCAG AA 이상, 페이지 전체에서 일관.

### 관리자/콘솔 색 배치 (사용자 지정, 모든 `console` 프리셋과 `-admin` 프로젝트)

**관리자 셸은 항상 좌측 사이드바 구조다 (사용자 지정, 2026-10-07).** 새 프로젝트의 관리자는 C1, C2, C4(좌측 아이콘 레일 + 섹션 리스트) 중에서 고른다. 상단 바 내비(C3)는 신규 배정하지 않는다. 메뉴가 2~3개뿐이어도 사이드바를 쓴다. 모바일(`lg` 미만)에서는 사이드바가 상단 가로 스크롤 탭이나 드로어로 접힌다.

**셸의 내비 면만 프로젝트 디자인 컬러를 갖고, 내용 영역은 흰색이다.** 팔레트 구성 번호(1~6)와
셸 아키타입이 무엇이든 이 배치가 우선한다.

- 좌측 사이드바(C1, C2)는 브랜드 컬러에서 뽑은 **짙은 면**(`--프로젝트접두-side` 등 토큰)이다. 활성 항목은 한 톤
  밝은 면 + 흰 글자, 배지는 상태색 면. C2도 더 이상 밝은 레일이 아니다.
- 사이드바가 없는 셸은 같은 역할의 면 하나만 칠한다: C3는 상단 커맨드 바, C4는 아이콘 레일.
- **헤더, 본문, 카드, 표는 흰색(`--프로젝트접두-surface`, #FFFFFF).** 회색 캔버스 배경을 깔지 않는다.
  표 헤더 행과 행 hover의 옅은 틴트, 1px 헤어라인은 유지한다.
- 구현 주의: `.<project>` 루트 클래스의 CSS `background`가 Tailwind `bg-*`를 이긴다. 셸 래퍼에는
  느낌표 접두(important) bg 유틸에 surface 토큰을 넘긴다. 문서에 클래스 문자열을 그대로 적지 않는다: Tailwind가 `.md`도 스캔해 `<p>` 같은 자리표시자가 든 가짜 클래스를 CSS로 뽑으면 `globals.css` 파싱이 깨진다 (`projects/b2b/teefinder/components/admin/admin-shell.tsx`).
- 레일의 짙은 면은 `ARCHETYPES.md`의 "C1 다크 레일 포화" 판정과 별개다. C1은 구조(236px 풀하이트
  레일 + 드로어 + 전폭 헤더)가 포화인 것이고, 색 배치는 여기서 모든 셸에 통일한다.
- 선례: `projects/b2b/teefinder` (C2 구조 + 다크 그린 레일 + 흰 본문).


`spec.md`가 `디자인시스템:`을 지정하면 그 문서의 팔레트가 곧 선택이다. 구성 번호(대개 1)를 적고 이유는
"디자인시스템 지정"으로 쓴다.

## Motion
Use the `motion` package (`motion/react`). Motion supports usability; never overanimate. Support `prefers-reduced-motion`. The concrete menu (press feedback, durations, easing) lives in `mockup-craft` SKILL.md section 6; this section only sets the rule that each project picks differently.

### 스케일 복제 금지 (recurring — 매 프로젝트 확인)

`_reference.md`가 가리키는 원본이나 다른 프로젝트에서 **수치를 그대로 옮기지 않는다.**
현재 번져 있는 값:

| 값 | 번진 범위 |
| --- | --- |
| 진입 `420ms cubic-bezier(.16, 1, .3, 1)` + `translateY(8px)` | 실 프로젝트 CSS 11개 |
| spring `{ stiffness: 300, damping: 30 }` | 12개 파일 |
| 하단 탭 라벨 `text-[10.5px]` | 96개 파일 |
| 본문 `15px / 22px / 400` | 13개 프로젝트 |

프로젝트마다 최소 아래 3개는 **앞선 프로젝트와 다르게 고른다** (`디자인시스템:`이 지정되면 1번은
그 문서의 타입 스케일을 따르고 "디자인시스템 지정"이라고 적는다. 2, 3번은 그래도 새로 고른다):

1. 본문 크기/행간 한 쌍 (15/22, 14/21, 16/24, 13.5/20 …). 직전 프로젝트와 동일 금지.
2. 진입 트랜지션의 **duration과 easing 계열**. `mockup-craft` SKILL.md 6절 표에서 고른다.
   표의 `420ms expo-out`은 이미 번진 값이라 선택지에 없다.
3. 눌림 피드백. SKILL.md 6절의 네 가지(`scale(0.97~0.98)` / `translateY(1px)` / 배경 톤 / 없음) 중 하나.

`design.md`의 Typography, Motion 절에 "앞선 어느 프로젝트와 무엇을 다르게 했는지" 한 줄로 적는다.

## Images
Every screen needs real images — a page with no photography looks unfinished, not minimal. The rule is **no photo that doesn't match what the screen says**: a random seed dropping a desert photo onto a recycling-collaboration post is the failure case, not photography itself.

1. Image generation (`imagegen-*`, `image-to-code`) only when the user asked for it (see Skill Usage Policy).
2. Otherwise use a stock source with a **fixed, hand-verified id** (`https://picsum.photos/id/<id>/<w>/<h>`), and actually look at each photo before mapping it to a caption. Never a random or hash-based seed for content-bearing images.
3. Keep a comment next to the id table saying what each photo shows, so later edits don't break the pairing.
4. **No matching photo → ask the user.** Never drop in a near-miss photo. Leave a tinted tile in that slot for now, keep building, and put a **사진 요청** list in the final summary: screen, slot, what the photo must show, aspect ratio / size, and the path to save it to (`projects/<c>/<p>/assets/<name>.jpg`). The user supplies the file; wire it in with a normal ES import.

Images support the interface, never dominate the layout. Placeholders (tinted tiles, monogram marks, date chips) are for avatars, logos, and empty slots — not a substitute for photography a screen needs.

## Enterprise UI
Admin pages should feel like software real companies use. Prefer: search, filter, status badge, tabs, pagination, data table, drawer, modal, timeline, activity log, charts, statistics, detail panels, master-detail layout.

## Completeness
Every screen complete and screenshot-ready: no empty sections, placeholder boxes, missing images, TODO, "Coming Soon," or Lorem Ipsum. Generate whole pages, never isolated components unless asked. Realistic names, dates, tables, charts, statistics, status, tags — convincing enough that a recruiter can't tell it from production. Avoid the AI tells: repetitive card grids, identical section layouts, fake dashboards, decorative labels, meaningless badges, unnecessary gradients, excessive glassmorphism.

**Company names in mockups are anonymized on purpose.** Use letter-based names (`A테크`, `B소재`, `C페이`) rather than invented brand names that read as real companies. People, institutions, phone numbers, and registration numbers stay believable but fictional. This workspace convention overrides the "invent premium-sounding brand names" instinct.

Output implementation immediately. Keep explanations short; don't explain obvious UI decisions.

## Portfolio Mobile Output
Applies to `app` projects, and to the mobile view of `web` projects.
- Keep the iPhone 16 Pro device frame. Render exactly ONE device.
- No presentation page. Plain white (#FFFFFF) background — no black/dark showcase backgrounds, decorative text, gradients, floating cards, or background graphics.
- Center the device horizontally and vertically; ~75–80% of the viewport, with enough white margin for a clean screenshot.
- Optimize the page for direct screenshot export.

## Responsive Web Output
Applies to `web` projects (customer-facing responsive sites).
- One site, one URL, written with ordinary Tailwind breakpoints (`sm:` `md:` `lg:`), mobile first. No separate mobile build.
- `src/index.tsx` wraps the site in `<ResponsiveSite>` (`components/shared/responsive-site.tsx`):
  - the plain URL shows the desktop page, full width on a white page;
  - `?view=mobile` shows the same URL inside the iPhone frame as a 393px iframe. The iframe has its own viewport, so the breakpoints switch exactly as on a phone. The "Portfolio Mobile Output" rules above apply to that view.
- Both views are verified: `npm run visual -- <c> <p> <screens> --device=web` writes `-desktop.png` (1440) and `-mobile.png` (framed) per screen, and fails on horizontal page scroll in either.
- Portfolio exports: the framed mobile cutout via `npm run capture -- <c> <p> <screens> --device=web` (`mobile-<screen>.png`); the desktop shot is the `-desktop.png` capture.

### Device edge integrity (recurring bug — check every time)

The screen is clipped by `overflow-hidden` + `rounded-[50px]` on `PhoneFrame`. Two things break that clip and leak a white edge outside the black chassis at the bottom/top corners:

- **`backdrop-blur` / `backdrop-filter` on any bar spanning the screen edge.** In Chromium, an element with a backdrop filter escapes its ancestor's rounded-corner clipping. **Never use `backdrop-blur` on bottom tab bars, sticky CTA bars, or app bars inside the device.** Use a fully opaque surface color — semi-transparent fills (`bg-white/95`) let scrolled content ghost through and read as a rendering bug in a screenshot.
- **Elements positioned outside the screen box** (negative offsets, `fixed` inside the frame). Keep edge-anchored UI `absolute` to the screen and inside it.

Before declaring a mobile project done, confirm no white pokes past the black chassis at the bottom corners. `npm run visual` does this automatically: it writes `<screen>-corners.png` on a magenta backdrop and fails with `edge-leak` when white pixels touch the backdrop. Open the corners PNG yourself as well, since faint gaps can slip under the pixel threshold.