# PetLive — Design

## 아키타입

**A5 — 라이브 모니터 캔버스** (`ARCHETYPES.md`). 셸 C1(관리자), 팔레트 구성 2(다크 우선)
+ 부분적으로 6(글로우 표면, 라이브 영상 위 비네트/상태 글로우에 한정).

이 앱의 본체는 라이브 영상이다. 이전 구현은 A1(섹션 스택)으로 영상을
`DeviceThumb h-[64px] w-[64px]` 썸네일 리스트에 눌러 담고 그 위에 요약 카드와
`SectionHead`를 쌓았다. 그 결과 `platform/studyspot`의 홈과 구분이 안 됐다 —
스크롤 컨테이너 클래스가
`flex-1 overflow-y-auto px-5 pb-[140px] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`
로 **문자 단위까지 같았다.** spec의 `스타일: high-end-visual-design`과 studyspot의
`스타일: minimalist-ui`라는 반대 방향의 두 스킬이 같은 화면을 냈다는 뜻이다.

실제 상용 관제 앱(Ring, Nest, Wyze, 헤이홈)은 전부 풀블리드 피드 + 오버레이 컨트롤이다.
A5로 바꾸면서 영상이 화면을 지배하고, 상태는 카드 행이 아니라 영상 위 앰비언트 표시가 됐다.

**배제한 후보 2개**

- **A4(맵 캔버스)** — 카메라가 위치를 갖는다는 점에서 후보였으나, 집 안 4대의 상대 위치는
  정보가 아니다. 반경 10m 지도는 아무것도 알려주지 않는다. 위치가 1차 필터인 도메인의
  아키타입이다.
- **A6(오늘 하나)** — 대표 카메라 한 대 + 주 액션 하나로 갈 수도 있었지만, 이 제품의 가치는
  "여러 대를 동시에 지켜본다"에 있다. 카메라 4대 중 2대가 온라인이고 1대가 불안정한 상태를
  한 화면에서 읽을 수 없으면 관제가 아니다.

**이 아키타입에서 쓰지 않는 부품**

- **하단 탭바** — `components/bottom-nav.tsx` 삭제. `lib/navigation.ts`의 `BottomNavScreen` /
  `BOTTOM_NAV`도 함께 제거했다. 카메라 전환은 캔버스 하단 **가로 필름스트립**이 맡고,
  캔버스를 떠나는 진입점(알림/기기/내 정보)은 영상 위 **코너 컨트롤**에 모인다.
- **`SectionHead` / `Card` / `StatusPill`** — 홈에서 쓰지 않는다. 텔레메트리는 카드에 담지
  않고 라벨 옆 한 줄 계기판으로 둔다. (시트가 아닌 하위 화면들은 아직 쓰므로 `ui.tsx`에는 남는다.)
- **세로 이벤트 리스트** — 이력은 `TimelineScrubber`의 **가로 시간축**이다. "언제 무슨 일이
  있었나"를 훑는 것이지 항목을 하나씩 고르는 화면이 아니다.
- **`pb-[140px]` 탭바 여백** — 탭바가 없으므로 `pb-10`.

**지배적 스크롤 축이 가로다.** 필름스트립과 타임라인이 가로이고, 세로 스크롤은 캔버스
아래 한 화면 분량뿐이다. 이 점이 A1과 가장 크게 갈리는 지점이다.

## 적용 규칙

- 디자인시스템: `design-systems/wise_compact.md` — 색 토큰·컴포넌트 스펙·elevation 철학(색 대비
  우선, 그림자 희소)의 최우선 출처. 실제 헥스값은 wise의 라임그린을 그대로 쓰지 않고
  반려동물 모니터링 도메인에 맞춰 독립적으로 설계했다(아래 팔레트). radius-xl(24px) 시그니처,
  단일 액센트 원칙, canvas/canvas-soft 순환은 구조 그대로 가져왔다.
- 스타일: `high-end-visual-design` — 프리미엄 타이포 스케일 감각·매크로 여백·정교한
  이징(custom cubic-bezier)·"뜬 요소"에 대한 절제된 이중 표면(Double-Bezel) 감각을
  참고했다. 단, 이 스킬이 지정하는 폰트(Geist/Clash Display 등)·무거운 blur/glow·
  `py-24~40` 수준의 웹 랜딩페이지 여백은 CLAUDE.md(Pretendard 고정, iPhone 16 Pro 프레임,
  8px 그리드)와 wise_compact의 elevation 철학이 우선이라 적용하지 않았다 — 모바일 393px
  캔버스에 맞게 스케일을 낮춰 재해석했다.
- 구조 레퍼런스는 `projects/camera/filmate/`(모바일 골격)와
  `projects/b2b/assetflow/`(웹 콘솔 셸)의 **원본을 직접 읽어** 참고했다. 가져온 것은 8px
  그리드, 안전 영역(top 59 / bottom 34), 44×44pt 터치 타깃, 웹 콘솔 셸 베이스라인 같은
  **규약**뿐이다. **수치는 가져오지 않았다** — 이 문서의 초기 버전은 filmate의 스프링
  `stiffness 300 / damping 30`을 그대로 재사용한다고 적혀 있었고, 그것이 이 워크스페이스의
  모션이 12개 파일에서 동일해진 경로다. 지금 값은 Motion 절 참고.
- 다이얼: `DESIGN_VARIANCE 7`(A5 전환 — 다크 풀블리드 캔버스 + 탭바 없음은 워크스페이스에서
  유일한 골격이다), `MOTION_INTENSITY 3`(관제 화면은 움직이면 안 된다. 지속 모션은 라이브
  점 하나뿐), `VISUAL_DENSITY 4`(영상이 화면을 지배하므로 텍스트 밀도는 낮되, 텔레메트리는
  한 줄에 세 값을 붙여 계기판처럼 읽히게 한다).

## Tokens / 팔레트

`styles/petlive.css`에 **두 스코프**로 정의한다. 워크스페이스 전역 토큰은 건드리지 않는다.

### 스코프가 둘인 이유 (A5 전환의 핵심 결정)

| 스코프 | 쓰는 곳 | 기조 |
| --- | --- | --- |
| `.petlive` | **관리자 콘솔** (`components/admin/`) | 웜 오프화이트 라이트 (아래 표) |
| `.petlive` + `.petlive-app` | **모바일 앱** (`src/index.tsx`의 `screenClassName`) | 다크 (팔레트 구성 2) |

앱은 라이브 영상 캔버스라 캔버스가 잉크여야 하고, 야간에 반려동물을 확인하는 사용이
실제로 가장 잦다. 관리자 콘솔은 표를 읽는 도구라 정확히 반대 요구를 갖는다.

**`--pl-canvas`를 그냥 뒤집으면 안 된다** — `components/admin/admin-shell.tsx`가
`bg-[var(--pl-canvas)]`를 쓰고 있어 관리자 본문까지 함께 어두워진다. 그래서 라이트
토큰은 `.petlive`에 그대로 두고, 앱에만 `.petlive-app` 오버라이드 스코프를 얹었다.

### 앱 다크 스코프 (`.petlive-app`)

| 역할 | 값 | 비고 |
| --- | --- | --- |
| 캔버스 | `#0B0C0E` / soft `#14161A` / strong `#1C1F24` | 쿨 니어블랙 — 영상 위 UI가 모니터처럼 읽히게 |
| 잉크 / 바디 / 뮤트 | `#F2F4F6` / `#B8BDC4` / `#7C838C` | |
| 헤어라인 | `#24282E` / strong `#333941` | |
| 액센트 | `#FF7D4F` (active `#FF9268`) | 웜 탠저린 유지, 다크 위에서 한 단 밝힘 |
| positive / warning / negative / info | `#45D17F` / `#F5B757` / `#FF6B6F` / `#5AA2FF` | 다크 대비로 재조정 |
| **오버레이** | `--pl-overlay` `rgba(11,12,14,.72)` / `--pl-overlay-strong` `rgba(11,12,14,.88)` | 영상 위 컨트롤 표면. **불투명 채움만, `backdrop-blur` 금지** |
| **비네트** | `--pl-vignette` (하단 그라디언트) | 팔레트 구성 6이 허용되는 유일한 지점 — 장식이 아니라 "여기는 컨트롤 영역"을 읽히게 하는 기능 |
| 라이브 글로우 | `--pl-live-glow` | 스트리밍 중 타일 링 |

### 관리자 라이트 스코프 (`.petlive`)

| 역할 | 토큰 | 값 | 용도 |
| --- | --- | --- | --- |
| 액센트 | `--pl-accent` | `#FF6F3C` | 웜 탠저린. 주요 CTA·선택 상태 전용 (실시간 점, 등록 버튼 등) |
| 액센트 · press | `--pl-accent-active` | `#E85A28` | 버튼 press 상태 |
| 액센트 · 옅음 | `--pl-accent-pale` | `#FFE4D6` | 배지/칩 배경 |
| 잉크 | `--pl-ink` | `#201A14` | 본문 텍스트, 관리자 다크 레일 배경(`--pl-rail-bg`)의 베이스 |
| 바디 | `--pl-body` | `#5B5347` | 설명 텍스트 |
| 뮤트 | `--pl-mute` / `--pl-mute-soft` | `#948C7E` / `#B7B0A2` | 보조 라벨, 캡션 |
| 캔버스 | `--pl-canvas` / `--pl-canvas-soft` / `--pl-canvas-strong` | `#FFFCF8` / `#F6F1E9` / `#EFE7D8` | 웜 오프화이트 3단. 섹션마다 canvas → canvas-soft 순환(표면 대비 자체가 elevation) |
| 헤어라인 | `--pl-hairline` / `--pl-hairline-strong` | `#EAE3D6` / `#D8CFBE` | 구분선 |
| Positive | `--pl-positive` 계열 | `#2E9E5B` | 온라인 · 정상 상태. 액센트와 절대 겹치지 않음 |
| Warning | `--pl-warning` 계열 | `#F2A93E` | 배터리 부족, 펌웨어 업데이트 필요 등 주의 |
| Negative | `--pl-negative` 계열 | `#E5484D` | 오프라인 · 연결 오류 · 삭제 |
| Info | `--pl-info` 계열 | `#3E8FF2` | 안내성 배지(드묾) |
| 관리자 레일 | `--pl-rail-bg/-surface/-active/-text/-text-mute/-border` | 잉크 베이스 다크 | 관리자 콘솔 사이드바 전용 반전 표면 |

액센트는 CTA·라이브 인디케이터에만 쓰고, "온라인=positive 초록"과 절대 혼용하지 않는다
(wise_compact의 "브랜드 그린을 success로 재사용 금지" 규칙과 동일한 이유 — 액센트가 상태
의미까지 가지면 "지금 눌러야 하는 것"과 "지금 정상인 것"이 시각적으로 구분되지 않는다).

## Shape

- 버튼 · 주요 카드(펫캠 라이브 카드, 등록 완료 카드): `rounded-[24px]` — wise 시그니처 radius
  그대로 재사용.
- 리스트 아이템 · 인풋: `rounded-[14px]`.
- 칩 · 작은 컨트롤: `rounded-[8px]`.
- 배지 · 상태 필: `rounded-full`.
- 그림자: `--pl-shadow-soft`(라이브 영상 카드, 플로팅 컨트롤)만 쓰고, 그 외 표면은
  `--pl-canvas` ↔ `--pl-canvas-soft` 대비만으로 뜬다. 단일 두꺼운 drop-shadow 금지.

## Typography

Pretendard 고정.

**앞선 프로젝트와 다르게 한 것**: 다크 캔버스 위 텔레메트리는 라벨을 11px 대문자 +
`tracking-[0.12~0.14em]`으로 벌리고 값만 `.pl-mono` 15px로 세운다. 7개 프로젝트가 쓰는
`Micro 11/14` 소문자 캡션을 그대로 쓰지 않았다 — 계기판은 라벨이 작고 값이 커야 읽힌다.

| Role | Size / Line | Weight | 용도 |
| --- | --- | --- | --- |
| Display | 28 / 34 | 700 | 반려동물 이름, 화면 히어로 숫자 |
| Title | 20 / 26 | 700 | 섹션 헤더, 카드 제목 |
| Subtitle | 17 / 22 | 600 | 리스트 아이템 제목 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Caption | 13 / 18 | 500 | 메타 정보, 타임스탬프 라벨 |
| Micro | 11 / 14 | 500 | 상태 배지, 신호 강도 |

배터리 %, Wi-Fi 신호, 타임스탬프는 `.pl-mono`(tabular-nums)로 자릿수를 고정한다. 본문에는
쓰지 않는다.

## 사진 매핑

`picsum.photos`는 반려동물 사진 적중률이 낮아(대부분 풍경/건축/인물), `pawfit` 프로젝트의
선례를 따라 키워드+`lock`으로 결과가 고정되는 `loremflickr.com`을 대신 썼다. 후보를
`curl -L`로 실제 내려받아 하나씩 눈으로 확인한 뒤 반려동물·실내 공간이 선명하게 나온 사진만
채택했고, 전부 `assets/pets/`에 로컬 저장해 ES import로만 쓴다(런타임에 외부 서비스에
의존하지 않는다).

| 파일 | 키워드 / lock | 실제 내용 | 쓰이는 곳 |
| --- | --- | --- | --- |
| `dog-portrait-tan-harness.jpg` | dog / 47 | 콘크리트 벽 앞, 하네스를 착용하고 정면을 보는 갈색 믹스견 | 반려동물 프로필 "코코" 아바타 |
| `cat-peeking-blue-blanket.jpg` | bedroom / 4 | 파란 담요 밑에서 얼굴만 내밀고 카메라를 보는 회색 고양이 | 반려동물 프로필 "나비" 아바타, 침실 이벤트 스냅샷 |
| `cat-eating-rug-bowl.jpg` | livingroom / 9 | 사료 그릇 옆 러그 위, 밥그릇 쪽으로 다가가는 회색 고양이(위에서 내려다본 구도) | 거실캠 라이브뷰 썸네일, 거실 움직임 감지 이벤트 |
| `cat-closeup-tag-carpet.jpg` | livingroom / 3 | 카펫 위에 앉아 인식표를 단 채 정면을 보는 회색 고양이 클로즈업 | 거실 움직임 감지 이벤트(대체 컷) |
| `kitchen-cozy-pendant-lights.jpg` | kitchen / 21 | 펜던트 조명과 원목 하부장, 화이트 상부장을 갖춘 아늑한 모던 주방, 반려동물 없음 | 주방캠 라이브뷰 썸네일(대기 상태), 주방 소리 감지 이벤트 |
| `dog-resting-rug-bookshelf.jpg` | dog / 200 | 책장 앞 러그에 엎드려 쉬는 비글 계열 갈색, 흰색 개 | 침실캠 라이브뷰 썸네일, 코코 소리/야간 이벤트 |
| `hallway-empty-warm-light.jpg` | hallway / 2 | 따뜻한 조명의 모던 복도, 반려동물 없음 | 복도캠 라이브뷰 썸네일, 복도 오탐지 이벤트 |
| `bedroom-canopy-night-dim.jpg` | bedroom / 12 | 어두운 조명 속 캐노피 침대, 반려동물 없음 | 야간 무동작 이벤트 스냅샷(나이트비전 느낌) |

id·키워드를 바꾸면 문구와 사진이 어긋나므로, 교체할 때는 이 표도 같이 고친다. 관리자
콘솔은 사진을 쓰지 않는다 — 회원 아바타는 이니셜 원형(AssetFlow 관례와 동일), 디바이스는
모델명 + 상태 배지로 표현한다.

## 기기 프레임 안쪽 규칙

A5에는 하단 탭바가 없다. 엣지/영상 위에 얹히는 것은 오버레이 컨트롤(`--pl-overlay-strong`),
코너 컨트롤, 비네트 셋이고 **전부 불투명 채움 또는 순수 그라디언트**다. `backdrop-blur`를
쓰지 않는다 — Chromium에서 backdrop filter는 조상의 라운드 코너 클립을 벗어나 PhoneFrame
모서리 밖으로 흰 틈을 만든다. 비네트도 `backdrop-filter`가 아니라 `linear-gradient`다.

- 하단 탭바(`components/bottom-nav.tsx`), 상단 `ScreenHeader`, 라이브 모니터링 화면의 하단
  컨트롤 바 모두 **불투명 표면**(`--pl-canvas` 또는 `--pl-ink`)만 쓰고 `backdrop-blur`를
  쓰지 않는다 — `PhoneFrame`의 `overflow-hidden` + `rounded-[50px]` 클립을 배경 필터가
  뚫고 나가 모서리에 흰 틈이 남는 문제를 피하기 위해서다.
  - 예외 없음: 라이브 모니터링 화면의 전체화면 오버레이 컨트롤도 반투명 대신 짙은
    `rgba(32,26,20,.72)` **고정 불투명도** 그라디언트로 처리해 스크롤/재생 콘텐츠가
    비쳐 보이지 않게 한다(반투명 배경 자체는 허용되나 blur는 금지).
- 모든 엣지 고정 UI는 화면 박스 안쪽에 `absolute`로 둔다(음수 offset·`fixed` 금지).

## Motion

**앞선 프로젝트와 다르게 한 것** (CLAUDE.md `## Motion` → "스케일 복제 금지"):

- **진입에서 `translateY`와 420ms를 뺐다.** 이전 값은 `420ms cubic-bezier(0.22, 1, 0.36, 1)`
  + `translateY(10px)`로, 워크스페이스 CSS 11개가 쓰는 "떠오르는 진입"과 같은 계열이었다.
  관제 화면은 그렇게 움직이지 않는다 — 피드는 컷인된다. **`180ms cubic-bezier(0.4, 0, 0.2, 1)`
  opacity-only**로 바꿨다(`.pl-enter`).
- **카메라 전환용 크로스페이드를 별도로 뒀다.** `.pl-feed-cut` `320ms`. 진입(180ms)보다
  느려서 "화면이 바뀐 것"이 아니라 "같은 화면에서 소스가 갈린 것"으로 읽힌다.
- **버튼 press를 `active:scale-[0.97]`에서 `active:opacity-70~80`으로 바꿨다.** 영상 타일이
  축소되면 라이브 피드가 흔들리는 것처럼 보인다 — 관제 화면에서 가장 피해야 할 인상이다.
  (관리자 콘솔은 셸 C1의 별도 규칙이라 그대로 둔다.)
- 지속 애니메이션은 `pl-live-dot` 맥동(1.6s) 하나뿐이다 — "지금 스트리밍 중"이라는 실제
  상태를 뜻한다.
- `prefers-reduced-motion: reduce`에서 `.pl-enter`, `.pl-feed-cut`, `pl-live-dot` 모두 정지.

## 관리자 콘솔 — 별도 프로젝트로 분리

관리자 백오피스는 사용자 앱과 완전히 분리된 프로젝트 엔트리
`projects/monitoring/petlive-admin`(`/monitoring/petlive-admin`)을 갖는다. 실제 화면
코드는 이 프로젝트의 `components/admin/` 안에 있고, `petlive-admin/src/index.tsx`는
라우트 등록용 엔트리일 뿐이다(`pawfit`/`veli`와 동일한 워크스페이스 관례). 사용자 앱
쪽에는 관리자 진입점(내비 항목, 로그인 역할 선택지)을 두지 않는다 — 실제 서비스처럼
주소도 계정도 다르다. `petlive-admin` 프로젝트에는 `styles/`·자체 `design.md`를 두지
않고, 이 문서의 토큰을 그대로 상속한다.

같은 토큰을 쓰되 사이드바는 CLAUDE.md 웹 콘솔 구조 베이스라인대로 **잉크 반전(다크)** —
`--pl-rail-*` 전용 토큰(위 팔레트 표 참고)을 쓴다. `components/admin/admin-ui.tsx`에서
표/배지/통계 카드 등 엔터프라이즈 프리미티브를 새로 정의하며, `_reference-ui.tsx`는
구조 참고용으로만 쓰고 `--af-*` 값은 가져오지 않는다.

### 셸 레이아웃

- 사이드바 236px, `lg:` 미만에서는 숨기고 `fixed inset-0 z-50 lg:hidden` 드로어(패널
  264px)로 대체.
- 헤더 56px, `sticky top-0 z-30`, `border-b` + 캔버스 배경.
- 본문 `max-w-[1400px] mx-auto`, 패딩 `px-4 py-6 lg:px-8 lg:py-8`.
- 사용자 콘솔 셸(밝은 사이드바)은 없음 — 관리자 전용 단일 콘솔이라 다크 레일 하나만 쓴다.

### 표 밀도 · 컬럼 예산

- `Table` 기본 `minWidth`는 640px — 1440px 데스크탑에서 사이드바(236px) + 본문 패딩을
  뺀 실제 컬럼 폭 기준.
- 컬럼 상한 6열(사용자 관리: 이름/이메일/가입일/상태/펫·디바이스/최근 로그인,
  웹캠 관리: 시리얼/모델/소유자/위치/상태/최근 접속). 넘칠 때는 부가 값(전화번호,
  펌웨어 버전 등)을 보조 줄로 내리고 열 수를 유지한다.
- 좌우 높이가 다른 그리드(대시보드 통계 + 최근 이벤트)에는 `items-start`를 준다.

## Component Inventory

`components/shared/`(워크스페이스 공용): `toggle.tsx`, `screen-header.tsx`, `phone-frame.tsx`
— 색만 `--pl-*` className prop으로 전달해 그대로 재사용.

`projects/monitoring/petlive/components/`(PetLive 전용): `bottom-nav.tsx`, `ui.tsx`(Badge,
Button, Card, StatusPill, DeviceThumb 등), `screens/*.tsx`.

`projects/monitoring/petlive/components/admin/`: `admin-ui.tsx`, `admin-shell.tsx`,
`admin-app.tsx`, `screens/*.tsx`.

`lib/types.ts`, `lib/navigation.ts`, `lib/mock-data.ts` — mock 데이터 및 도메인 타입.
