---
description: 새 목업 프로젝트의 폴더 스켈레톤과 구조 레퍼런스 포인터를 즉시 생성하고, 배정된 아키타입을 바탕으로 design.md를 작성. app 프리셋은 filmate(모바일 앱), web 프리셋은 locly(고객용 반응형 웹), console 프리셋은 assetflow(웹 콘솔/관리자 대시보드) 기준.
argument-hint: <카테고리>/<새프로젝트명> [app|web|console] [--with-admin] [--with-mobile] (아키타입/셸/팔레트는 spec.md를 읽고 자동 배정 — 필요하면 --archetype/--shell/--palette로 덮어쓴다)
---

1. `bash scripts/scaffold.sh $ARGUMENTS` 를 실행해 뼈대(빈 components/, lib/, src/, styles/,
   빈 design.md, 원본 경로를 적은 `_reference.md`)를 `projects/<카테고리>/<새프로젝트명>`
   경로에 생성한다. 이 단계는 순수 파일 생성이므로 별도 작업을 하지 않는다.

   대상 경로에 `spec.md`(또는 `design.md`)가 이미 존재해도 실행된다 — 스캐폴드 전에
   spec.md를 미리 써두는 것은 정상 관례이며 내용은 그대로 보존된다. 그 외 파일/폴더
   (`components/`, `src/` 등 실제 스캐폴드 산출물)가 이미 있으면 기존 프로젝트로 간주해
   실패한다.

   **프리셋** — 2번째 인자로 이번 프로젝트가 어떤 종류인지 고른다 (생략 시 `app`):

   | 프리셋 | 원본 | 언제 |
   | --- | --- | --- |
   | `app` (기본) | `projects/camera/filmate` | 모바일 앱. PhoneFrame, 393×852 캔버스 |
   | `web` | `projects/community/locly` | 고객용 반응형 웹 (쇼핑, 예약, 커뮤니티). 데스크톱 1440 + 모바일 393(iPhone 프레임 안) |
   | `console` | `projects/b2b/assetflow` | 웹 콘솔 / 관리자 대시보드. 셸은 C1~C4 중 배정, 표 중심 |

   2026-09 이전에는 `web`이 콘솔을 뜻했다. 콘솔은 이제 `console`이다.

   **레퍼런스 파일은 복사하지 않는다.** 스캐폴드는 `_reference.md` **한 장**만 만들고,
   거기에 원본 경로를 적는다. 원본은 항상 워크스페이스 안에 있으므로 그 경로에서 직접 읽는다.
   (예전에는 `_reference-ui.tsx` 28KB를 포함해 파일 81개를 복사했다. 전부 원본과 바이트
   동일한 사본이었고, assetflow의 하드코딩 hex와 절대 import까지 함께 번졌다.)

   **아키타입 인자는 선택이다** — `--archetype A<n>`(모바일 홈), `--shell C<n>`(관리자 콘솔),
   `--palette <1-6>`(팔레트 구성). **생략이 기본 경로다.** 생략하면 `_reference.md`에
   `<미정>`으로 남고 2단계에서 `spec.md`를 읽고 배정한다. 사용자가 골격에 대해 이미 의견을
   밝혔을 때만 인자로 넘긴다. 카탈로그는 루트 `ARCHETYPES.md`, 팔레트 구성은 CLAUDE.md
   `## Color`. `--archetype A1`은 거부된다 (이미 12개 점유).

   2번째 인자에 `/`가 들어간 경로를 주면 임의 소스 프로젝트를 구조 레퍼런스로 쓴다(하위 호환).

   `--with-admin`을 주면 `projects/<카테고리>/<이름>-admin/src/`에 얇은 엔트리
   (`index.tsx` + `meta.ts`)를 만들고, 본 프로젝트에 `components/admin/admin-app.tsx`
   **시드**까지 만들어 **스캐폴드 직후에도 트리가 컴파일되는 상태**로 둔다. 이 워크스페이스의
   관례대로 **관리자 화면 코드는 본 프로젝트의 `components/admin/` 안에** 두고,
   `-admin` 프로젝트는 URL을 하나 더 얻기 위한 엔트리로만 쓴다
   (`assetflow-admin`, `lumi-admin`, `orderlog-admin`과 동일한 구성).

   `--with-mobile`은 **`console` 프리셋에서만** 쓴다 (`web`은 모바일 화면을 이미 포함한다). `-admin`과 달리 얇은 엔트리가 아니라
   `projects/<카테고리>/<이름>-mobile/`에 **완전히 독립된** 스캐폴드(자체 `_reference.md`,
   빈 `styles/`·`design.md`)를 `filmate` 기준으로 만든다 (`marketflow` + `marketflow-mobile`과 동일한 구성 — "같은
   제품, 다른 플랫폼"은 이 워크스페이스에서 URL이 다른 완전한 별도 프로젝트로 표현한다).
   웹 콘솔 + 관리자 + 모바일을 한 번에 원하면 `console --with-admin --with-mobile`처럼
   같이 쓴다.

   공용 컴포넌트(`components/shared/*`)와 워크스페이스 `app/`은 복사 대상이 아니다 —
   전자는 항상 `@/components/shared/*`로 직접 import하고, 후자는 워크스페이스 루트에 하나뿐이라
   프로젝트 폴더 안에 만들지 않는다. `lib/`도 프로젝트마다 도메인이 전부 달라 복사하지 않고
   spec.md 기반으로 새로 쓴다.

2. `spec.md`를 먼저 읽는다.
   - **`플랫폼:` 줄**을 보고 1단계에서 고른 프리셋이 맞는지 교차 확인한다. 고객용 (반응형) 웹이면
     `web`, 관리자나 업무용 웹만 있으면 `console`, 모바일 앱이면 `app`이다. 고객 웹과 관리자 웹이
     둘 다면 `web --with-admin`이다.
     프리셋을 잘못 골랐으면 다시 만든다. 이때 `spec.md`는 남기고, `-admin/`이 있으면 그것부터 지운 뒤
     (본 프로젝트의 시드 `admin-app.tsx`를 먼저 지우면 워크스페이스 전체가 500) 나머지 산출물
     (`components/ lib/ src/ styles/ design.md _reference.md .visual-pending`, `-mobile/`)을 지운다.
   - **`스타일:` / `디자인시스템:` 줄**이 있는지 확인한다 (워크스페이스 `CLAUDE.md`의
     Skill Usage Policy, Design Systems 절 기준). 적용 순서는 CLAUDE.md Precedence와 같다:
     UI Generation Rules → 디자인시스템 → 스타일 skill(방향만) → `mockup-craft`.
     - `디자인시스템: <name>` 지정 시 → `design-systems/<name>.md`가 색상, 타이포, 컴포넌트
       스펙의 출처다 (UI Generation Rules 다음 순위). 폴더의 파일명은 전부 언더스코어 `_compact` 형식이다
       (`apple_compact.md`, `claude_design_compact.md` 등). 없는 파일을 가리키면 그건
       `spec.md`의 오류이니 임의로 대체하지 말고 **멈추고 사용자에게 파일을 요청한다.**
     - `스타일: <skill-name>` 지정 시 → 해당 style-variant skill(`high-end-visual-design`,
       `minimalist-ui`, `industrial-brutalist-ui` 중 하나)의 **방향**을 따른다. 디자인시스템과
       겹치면 디자인시스템이 이긴다.
     - 어느 경우든 나머지 판단은 워크스페이스 skill `mockup-craft`가 채운다 (CLAUDE.md
       Skill Usage Policy. `supanova-design-engine`, `design-taste-frontend`는 랜딩 페이지용
       참고 자료이고 기본값이 아니다).
   - **skill 파일을 Read 도구로 끝까지 읽는다.** 화면 코드를 쓰기 전에 반드시 한다.
     - 항상: `.claude/skills/mockup-craft/SKILL.md`, `references/anti-slop.md`
     - 플랫폼별: 모바일 앱은 `references/app.md`, 고객용 반응형 웹은 `references/web.md`,
       웹 콘솔과 관리자 화면(`components/admin/`, `-admin`)은 `references/console.md`
     - `스타일:` 줄의 skill, `프리미엄디테일: soft-skill`이면 `supanova-premium-aesthetic`
       (`~/.claude/skills/<name>/SKILL.md`, 이 기기에 없으면 건너뛴다. 2026-09-18부터 외부 skill은
       비활성이라 보통 건너뛴다. CLAUDE.md Skill Usage Policy)

     안 읽고 첫 화면 파일을 쓰면 `.claude/hooks/pre-write-skill-gate.mjs`가 쓰기를 막는다.
     스타일 skill은 방향만 가져오고 랜딩 규칙(대문자 아이브로우 필, HTML 출력)은 따르지 않는다.
     4단계 design.md "적용 규칙" 절 맨 위에 `mockup-craft`의 해석 한 줄과 다이얼 값을 적는다.
     읽지 않은 skill 이름이나 다이얼 값을 적지 않는다.
   - **골격을 배정한다.** 이게 기본 경로다 — 사용자에게 A번호를 묻지 않는다. `spec.md`의
     도메인, `플랫폼:`, Key Focus를 읽고 `ARCHETYPES.md`에서 홈 아키타입을 고르고(A1은 금지,
     같은 `projects/<카테고리>/` 안에서 중복 금지), 관리자 콘솔이 있으면 셸 C1~C4 중 하나를,
     CLAUDE.md `## Color`에서 팔레트 구성 1~6을 고른 뒤 `_reference.md`의 `<미정>` 자리를
     채운다. 배정 근거는 4단계 design.md의 "아키타입" 절에 적는다.
     `spec.md`에 `아키타입:` / `셸:` / `팔레트:` 줄이 이미 있거나 1단계에서 인자로 넘어왔으면
     **`spec.md`가 이긴다** — 그 경우 재배정하지 않는다.
   `_reference.md`가 가리키는 원본은 이 우선순위와 무관하게 **구조와 완성도 기준**으로만 쓴다
   — 색상·무드·수치의 출처로 쓰지 않는다.

3. `_reference.md`가 가리키는 **원본 파일들을 그 경로에서 직접 읽는다.** 가져올 것과 새로
   만들 것을 명확히 구분한다.

   **공통 — 새로 정의 (도메인 종속 값)**: 색상 팔레트 전체, 강조색, 톤 어휘, 차트 램프의 색조,
   브랜드 마크, 이미지/아이콘 무드. 2단계에서 정한 출처를 따르며, 레퍼런스의 색을 베이스로
   톤만 바꾸지 말고 독립적으로 설계한다.

   **`app` 프리셋 — 그대로 재사용 (규약)**: 8px spacing 그리드, 안전 영역(top 59 / bottom 34),
   44×44pt 터치 타깃, 레이아웃 그리드, 인터랙션이 존재한다는 사실(탭 피드백, 화면 전환).

   **`web` 프리셋 — 그대로 재사용 (규약)**: 헤더/푸터/화면을 `components/site/`에 두는 폴더 구성,
   모바일 우선 Tailwind 반응형, `keep-all` 한글 줄바꿈, `prefers-reduced-motion` 블록의 **존재**.
   반응형 기준 폭과 패턴은 `mockup-craft` web.md. locly는 `<ResponsiveSite>`와 `?screen=`이 생기기 전에
   만들어져서 둘 다 없다. `src/index.tsx`는 locly가 아니라 `components/shared/responsive-site.tsx`와
   filmate의 `getInitialScreen`을 따른다. locly의 문구에는 금지 문자(`·`, `—`)가 남아 있으니 카피를
   참고하지 않는다.

   **`console` 프리셋 — 그대로 재사용 (규약)**: shadow 정책(미세 3단 스택 — 단일 두꺼운
   drop-shadow 금지), 상태 배지 5단계 톤 **구조**(색이 아니라 "5단계로 고정한다"는 규약),
   표/드로어/페이지네이션 구조, `word-break: keep-all; overflow-wrap: break-word`(한글 줄바꿈
   — `anywhere`는 `keep-all`을 무력화하므로 금지), 코드, ID, 해시 전용 모노 유틸(금액과 일시는
   Pretendard + `tabular-nums`, `mockup-craft` console.md), `prefers-reduced-motion` 블록의
   **존재**, 그리고 아래 **웹 콘솔 구조 규약**.

   ⚠️ **수치는 재사용 대상이 아니다.** 타이밍·이징·타입 스케일·radius 값은 CLAUDE.md
   `## Motion`의 "스케일 복제 금지"에 따라 **새로 고른다** — 레퍼런스에서 옮기지 않는다.
   이 문서가 예전에 `spring stiffness 300 / damping 30`과 `420ms cubic-bezier(.16,1,.3,1)`을
   "그대로 재사용"하라고 지시했고, 그 결과 두 값이 각각 12개·11개 프로젝트로 번졌다.

   웹 콘솔 구조 규약. **구조만 고정하고 치수는 셸마다 새로 고른다.** 기존 콘솔의 236px 레일,
   264px 드로어, `h-14` 헤더, `max-w-[1400px]`, `rounded-[6px] px-3 py-2` 내비는 `ARCHETYPES.md`가
   복제 사례로 지목한 값이라 그대로 쓰지 않는다.

   | 항목 | 고정하는 구조 | 치수 |
   | --- | --- | --- |
   | 관리자 셸 | C1~C4 중 배정. 다크 레일(C1)은 기본값이 아니다. 색 배치는 공통: 내비 면만 브랜드 짙은 색, 헤더와 본문은 흰색 (CLAUDE.md "관리자/콘솔 색 배치") | `ARCHETYPES.md` 해당 C절 |
   | 헤더 | `sticky top-0`, 하단 경계선, 캔버스와 같은 배경 | 높이 새로 고름 |
   | 모바일 드로어 | `lg:` 미만에서 레일 대신 드로어, 스크림은 `<button aria-label>` | 패널 폭 새로 고름 |
   | 본문 폭 | 고정 폭이면 `mx-auto max-w-[...]`, 워크벤치형은 풀블리드 | 값 새로 고름 |
   | 내비 항목 | 활성 시 아이콘 weight regular→fill + 배경 | radius, 패딩 새로 고름 |
   | 차트 | 라이브러리 없이 직접 구현 | |

4. spec.md를 읽고, 2~3단계의 구분에 따라 `design.md`를 작성한다. 섹션 구성은 워크스페이스
   `CLAUDE.md`의 "Checklist: adding a new project" 3번 항목을 따르되 프리셋별로 분기한다:
   - **`app`**: **아키타입** / 적용 규칙 / Tokens, 팔레트 / Shape / Typography / 사진 매핑 /
     **기기 프레임 안쪽 규칙** / Motion
   - **`web`**: **아키타입** (홈 골격) / 적용 규칙 / Tokens, 팔레트 / Shape / Typography / 사진 매핑 /
     **반응형 기준** / Motion
   - **`console`**: **아키타입** / 적용 규칙 / Tokens, 팔레트 / Shape / Typography / 사진 매핑 /
     **셸 레이아웃** / **표 밀도, 컬럼 예산** / Motion
   - **`app` 또는 `web` + `--with-admin`**: 위 구성에 **셸 레이아웃**과 **표 밀도, 컬럼 예산**을 더한다
     (관리자 콘솔도 셸 배정과 컬럼 예산이 필요하다).
     - *아키타입* — 고른 것(A/C 번호와 이름)과 이유, 배제한 후보 2개와 각각의 이유, 그리고
       **이 아키타입에서 쓰지 않기로 한 부품** 목록. 마지막 항목이 제일 중요하다 — 그게
       없으면 다음 세션이 습관대로 `SectionHead`와 하단 탭바를 다시 넣는다.
     - *셸 레이아웃* — 사이드바 폭, 헤더 높이, 본문 max-width, `lg:` 분기점, 모바일 드로어 방식,
       사용자 콘솔과 관리자 콘솔의 셸 차이.
     - *표 밀도, 컬럼 예산* — `Table`이 `overflow-x-auto` 안에 있어 컬럼 폭 합이 넘치면
       **마지막 열이 조용히 잘린다.** 기본 `minWidth` 값과 그 근거(1440px에서 사이드바를 뺀
       실제 컬럼 폭), 열 상한(6열), 넘칠 때의 대처(값을 보조 줄로 내리고 열 수를 줄인다)를 적는다.
       좌우 높이가 다른 그리드에는 `items-start`를 준다.
   - 구조적 원칙은 레퍼런스 기준을 유지해 "같은 완성도"를 담보한다.
   - 색상/무드는 2단계의 적용 순서(디자인시스템 → 스타일 skill)를 따라 spec.md 도메인에 맞게 정의한다.

5. design.md가 확정되면 그 내용을 바탕으로 실제 `styles/` 파일들을 채운다.
   - **원본 `styles/*.css`는 사실상 색상 파일이다.** `filmate.css`는 13줄 전부 색이고
     spacing/radius 토큰이 하나도 없다. 여기서 가져올 구조 값은 없다.
   - spacing/radius/타입 스케일은 원본의 `design.md` 산문과 컴포넌트 파일에 있다
     (`app`: `filmate/components/screens/`, 공용 `ui.tsx`는 없다. `web`: `locly/components/site/`. `console`: `assetflow/components/ui.tsx`).
     거기서 **읽되 그대로 옮기지 않는다** — CLAUDE.md `## Motion`의 "스케일 복제 금지"에
     따라 이 프로젝트의 값을 새로 고르고, 4단계 design.md에 근거와 함께 적은 뒤 적용한다.
   - 색상 토큰은 2단계에서 정한 출처 + `팔레트:` 구성에 따라 전부 새로 쓴다.

6. `_reference.md`는 삭제하지 말고 그대로 둔다. 추후 컴포넌트를 추가/수정할 때도 원본 경로와
   이번 프로젝트의 아키타입/셸/팔레트 배정을 확인하는 기준점으로 계속 쓴다.

7. 화면을 만들 때:
   - **공통**: `Toggle`(`components/shared/toggle.tsx`)이 필요하면 새로 만들지 말고 임포트한다
     (웹 콘솔에서도 마찬가지 — assetflow도 그렇게 한다). 색상/타이포는 이 프로젝트의 CSS
     변수를 담은 `className` 계열 prop으로 넘긴다.
   - **`app`**: 상태바를 피하는 모바일 상단 헤더가 필요하면
     `components/shared/screen-header.tsx`의 `ScreenHeader`를 임포트한다.
   - **`web`**: 사이트는 `components/site/`(헤더, 푸터, `ui.tsx`, `screens/`)에 둔다.
     `src/index.tsx`는 사이트를 `components/shared/responsive-site.tsx`의 `<ResponsiveSite>`로
     감싼다. `PhoneFrame`을 직접 쓰지 않는다 (모바일 보기는 ResponsiveSite가 만든다).
     구조 참고는 `projects/community/locly/components/site/`다. 수치와 색은 가져오지 않는다.
   - **`console`** 과 관리자 화면: `PhoneFrame`/`ScreenHeader`는 쓰지 않는다. 대신 아래를 **구조 기준으로만**
     참조해 이 프로젝트의 `components/ui.tsx`와 셸을 새로 작성한다 — 파일을 복사하지 않는다.
     - 엔터프라이즈 프리미티브: `projects/b2b/assetflow/components/ui.tsx`
     - 셸 C1(다크 레일): `projects/b2b/assetflow/components/admin/admin-shell.tsx`
     - 셸 C2(라이트 워크벤치): `projects/platform/studyspot/components/admin/admin-shell.tsx`
     - 셸 C3(상단 커맨드 바): `projects/community/waypoint/components/admin/admin-shell.tsx`
     - 셸 C4(아이콘 레일 + 섹션 리스트): `projects/b2b/logisync/components/shell.tsx`
       (logisync는 `@iconify/react`를 쓴다. 아이콘은 따라 하지 않는다)
     - 사용자 콘솔 T자형(관리자 셸과 다른 축): `projects/b2b/assetflow/components/layout/app-shell.tsx`
   - `Badge`/`Button`/`Card`/`Table`/`Drawer`/`StatTile`/`ProgressBar`/`EmptyState`는 이름이
     같아 보여도 프로젝트마다 톤 어휘·radius 문법·프레스 피드백이 실제로 다른 디자인
     정체성이므로 공유하지 않는다 — 새로 만든다(CLAUDE.md의 `components/shared/` 절 참고).
   - **`?screen=` 필수.** `src/index.tsx`는 초기 화면을 `?screen=<name>`에서 읽는다
     (`projects/camera/filmate/src/index.tsx`의 `getInitialScreen` 패턴: `useSearchParams` +
     화면 목록 검증, 모르는 값은 기본 화면). 시각 검증 루프가 모든 화면을 캡처하려면 필요하다.
     스크린샷으로 확인해야 할 내부 상태(모달, 드로어, 탭, 위저드 단계)는 해당 컴포넌트가
     `?step=` 같은 파라미터를 읽게 해서 `name:key=value` 토큰으로 열 수 있게 한다
     (habitkong 온보딩의 `?step=` 선례).
   - 모든 화면을 만든 뒤 CLAUDE.md "Batch Build" 5단계의 **시각 검증 루프**
     (`npm run visual` → 별도 리뷰 에이전트 → 수정, 최대 2라운드)까지 마쳐야 완료다.

8. `--with-admin`으로 생성했다면:
   - 본 프로젝트 `components/admin/admin-app.tsx`는 **시드**다. 관리자 화면을 만들면서
     실제 `AdminApp`으로 **교체한다** — 교체하지 않으면 시드 화면이 그대로 URL에 남는다.
     단 **지우지는 않는다.** 프로젝트 라우트가 공유 컴파일 단위라, 이 파일이 없으면
     이 프로젝트만이 아니라 워크스페이스의 모든 프로젝트 URL이 500이 난다
     (CLAUDE.md `app/` 절의 "공유 컴파일 단위" 참고).
   - 사용자 콘솔 화면에는 **관리자 진입점(내비 항목, 로그인 역할 선택지)을 두지 않는다** —
     실제 서비스처럼 주소도 계정도 다르다.
   - 본 프로젝트 `spec.md`와 `design.md`에 관리자 분리 사실을 기록한다
     (`locly`/`orderlog`가 쓰는 "관리자는 별도 프로젝트" 절 패턴을 따른다).
   - `-admin` 프로젝트에는 `styles/`, `design.md`, `spec.md`를 만들지 않는다. 본 프로젝트의
     토큰을 그대로 상속하며, 그 사실만 본 프로젝트 문서에 적는다.
   - `<이름>-admin/src/meta.ts`의 자리표시 title과 description을 spec 기준으로 교체한다
     (탭 제목과 메타 설명으로 렌더된다).
   - 교체한 `AdminApp`은 초기 화면을 `?screen=`에서 읽는다
     (선례: `projects/b2b/assetflow/components/admin/admin-app.tsx`). 시각 검증은 관리자 URL로
     따로 한다: `npm run visual -- <카테고리> <이름>-admin <화면...> --device=console`.
     리뷰어에게는 본 프로젝트의 spec.md, design.md와 `<이름>-admin/.visual/`을 준다.

9. `--with-mobile`으로 생성했다면:
   - `-mobile` 프로젝트는 `-admin`과 달리 **완전히 독립된 프로젝트**다. 본 프로젝트의
     화면/토큰을 상속하지 않고, `-mobile` 자신의 `spec.md`(본 프로젝트 spec.md를 참고해
     모바일 IA로 새로 정리)와 `design.md`를 이 문서의 1~7단계 그대로 (`app` 프리셋 기준)
     처음부터 밟아서 작성한다.
   - 같은 제품이면 색상 팔레트·톤 어휘는 본 프로젝트와 일관되게 맞추되, 레이아웃/셸은
     `app` 프리셋(PhoneFrame) 구조로 새로 설계한다 — 웹 콘솔 셸을 그대로 축소해 쓰지 않는다.
   - 본 프로젝트 `spec.md`/`design.md`에 모바일이 별도 프로젝트로 분리되어 있다는 사실을
     기록한다 (`marketflow`가 쓰는 패턴을 따른다).
