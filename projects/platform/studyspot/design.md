# StudySpot — Design

## 적용 규칙

- 디자인시스템: spec.md에 값이 비어 있음 → `design-systems/`는 참조하지 않는다.
- 스타일: `minimalist-ui` — 웜 모노크롬(오프화이트 캔버스, 오프블랙 잉크) + 채도 낮춘 파스텔
  4색만 세만틱 태그에 쓰는 절제된 팔레트가 이 프로젝트의 최우선 색 출처. 색은 "희소 자원"으로
  취급하고, 주요 CTA도 컬러 액센트가 아니라 잉크 블랙 솔리드로 처리한다(스킬 §4~5 그대로).
  타이포는 CLAUDE.md 규칙이 우선이라 스킬이 제안하는 세리프(Newsreader 등)·Geist 대신
  Pretendard 하나로 통일하고, "타이포그래피 대비"는 굵기·자간·크기 스케일로만 표현한다.
  radius는 스킬 그대로: 카드 8~12px, 버튼/인풋 6px(필 금지), 배지만 `rounded-full`.
  그림자는 거의 없음(`<0.05` opacity) 원칙을 그대로 따른다.
- `_reference-design-system.md`(FILMATE)·`_reference-ui.tsx`/`_reference-admin-shell.tsx`
  (AssetFlow)는 구조적 값(8px 그리드, 안전 영역, 스프링 모션, 웹 콘솔 셸 베이스라인)만
  참고했고 색·톤 어휘는 가져오지 않았다.
- 다이얼: `DESIGN_VARIANCE` 낮음(미니멀 스킬 자체가 절제를 요구), `MOTION_INTENSITY` 낮음
  (스킬 §7 "invisible but present"), `VISUAL_DENSITY` 중간(좌석 배치도·장비 현황판은
  정보량이 실제로 많아야 신뢰가 감).

## 3개 화면군 — 사용자 App / 점주 관리자 Web / 본사 관리자 Web

spec.md가 세 플랫폼을 명시(`Mobile App` + `Web 점주 관리자` + `Web 본사 관리자`). `buildbid`의
선례를 따라 기기 패러다임이 같은 두 관리자(둘 다 웹 사이드바 셸)는 **이 프로젝트 안에** 얇은
엔트리로 URL만 분리하고, 사용자 앱과는 기기 패러다임 자체가 달라(PhoneFrame vs 사이드바)
자연히 URL도 분리된다.

- 사용자 App: `projects/platform/studyspot` (`/platform/studyspot`), `app` 프리셋,
  PhoneFrame 단일 기기.
- 점주 관리자: `projects/platform/studyspot-admin`(`/platform/studyspot-admin`)는 얇은
  엔트리, 실제 화면은 `components/admin/`. (`assetflow-admin`과 동일 관례)
- 본사 관리자: `projects/platform/studyspot-hq`(`/platform/studyspot-hq`)도 얇은 엔트리,
  실제 화면은 `components/hq/`. `buildbid`처럼 두 관리자가 기기 패러다임이 같으면 같은
  프로젝트 안에서 URL만 나누는 관례를 따른 것 — 별도 스캐폴드를 다시 돌리지 않고
  `--with-admin`이 이미 받아온 `_reference-ui.tsx`/`_reference-admin-shell.tsx`를 본사
  화면에도 구조 참고용으로 그대로 재사용한다.
- 세 콘솔 모두 이 문서의 `--ss-*` 토큰을 공유한다. `components/admin/admin-ui.tsx`(Badge,
  Button, Table 등)는 점주·본사 두 콘솔이 **함께** import한다 — 같은 워크스페이스 안에서
  두 콘솔이 완전히 다른 조직(가맹점 vs 본사)이라도 컴포넌트 어휘까지 두 벌로 복제할
  이유는 없고, 셸(사이드바 구성·내비게이션)만 `admin-shell.tsx` / `hq-shell.tsx`로 각자
  다르게 둔다.
- 사용자 앱 쪽에는 두 관리자 콘솔 어디로도 진입점을 두지 않는다. 실제 서비스처럼 주소도
  계정도 다르다.

## Tokens / 팔레트

`styles/studyspot.css`의 `.studyspot` 스코프에 정의.

| 역할 | 토큰 | 값 | 용도 |
| --- | --- | --- | --- |
| 잉크 | `--ss-ink` | `#111111` | 본문·주요 CTA 배경. 순수 블랙 금지 |
| 온-잉크 | `--ss-on-ink` | `#FFFFFF` | 잉크 배경 위 텍스트 |
| 바디 | `--ss-body` | `#2F3437` | 설명 텍스트 |
| 뮤트 | `--ss-mute` / `--ss-mute-soft` | `#787774` / `#A8A29B` | 보조 라벨, 캡션 |
| 캔버스 | `--ss-canvas` / `--ss-canvas-soft` / `--ss-surface` | `#FFFFFF` / `#F7F6F3` / `#F9F9F8` | 화이트 ↔ 웜 본(bone) 순환. 표면 대비 자체가 elevation |
| 헤어라인 | `--ss-hairline` / `--ss-hairline-strong` | `#EAEAEA` / `#D8D6D0` | 카드·구분선 1px 고정 |
| Positive | `--ss-positive` / `--ss-positive-soft` | `#346538` / `#EDF3EC` | 좌석 이용 가능, 장비 정상, 지점 정상운영 |
| Warning | `--ss-warning` / `--ss-warning-soft` | `#956400` / `#FBF3DB` | 임박(연장 필요, 만료 임박, 펌웨어 업데이트) |
| Negative | `--ss-negative` / `--ss-negative-soft` | `#9F2F2D` / `#FDEBEC` | 좌석 만석, 장비 장애, 지점 마감/휴점 |
| Info | `--ss-info` / `--ss-info-soft` | `#1F6C9F` / `#E1F3FE` | 선택 상태(좌석 선택, 예약 진행 중), 안내 배지 |

색은 세만틱 배지 4종에만 쓰고, 주요 CTA는 항상 `--ss-ink` 솔리드다 — "지금 눌러야 하는 것"과
"지금 상태가 어떤 것"을 색으로 뒤섞지 않는다(스킬의 "color is a scarce resource" 원칙).

## Shape

- 카드: `rounded-[12px]`, `border border-[var(--ss-hairline)]`, 그림자 없음(canvas ↔
  canvas-soft 대비로만 뜬다).
- 버튼/인풋: `rounded-[6px]` — **필(pill) 금지**, 큰 컨테이너에 `rounded-full` 쓰지 않는다.
- 배지/태그: `rounded-full`, 작은 텍스트, uppercase 없이(한글이라) 굵기로 강조.
- 그림자: `--ss-shadow-soft`(카드 hover-lift 전용) `0 2px 8px rgba(17,17,17,0.04)` 하나만.

## Typography

Pretendard 고정(스킬의 세리프/Geist 제안 대신).

| Role | Size / Line | Weight | 용도 |
| --- | --- | --- | --- |
| Display | 30 / 36 | 800 | 화면 히어로, 대시보드 KPI 숫자 |
| Title | 20 / 26 | 700 | 섹션 헤더, 카드 제목 |
| Subtitle | 16 / 22 | 600 | 리스트 아이템 제목 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Caption | 13 / 18 | 500 | 메타 정보 |
| Micro | 11 / 14 | 500 | 배지, 타임스탬프 라벨 |

좌석 번호, 금액, 남은 시간, 시리얼 번호는 `.ss-mono`(tabular-nums)로 자릿수를 고정한다.

## 사진 매핑

picsum은 스터디카페/코워킹 인테리어 적중률이 낮아, 이전 프로젝트 선례(pawfit, petlive)를
따라 `loremflickr.com`(키워드+lock 고정)으로 후보를 실제 다운로드해 확인한 뒤 채택했다.
"desk"/"workspace"/"library" 계열 키워드는 적중률이 낮아(인물 클로즈업·풍경·역사적
건축물이 대부분) 30여 장을 내려받아 걸러낸 뒤 "coworking"/"office"/"meetingroom"
계열에서 실제 지점·스터디룸에 쓸 만한 7장만 채택했다. 전부 `assets/`에 로컬 저장해
ES import로만 쓴다.

| 파일 | 키워드 / lock | 실제 내용 | 쓰이는 곳 |
| --- | --- | --- | --- |
| `coworking-colorful-lounge-windows.jpg` | coworking / 2 | 통유리창, 펜던트 조명, 오렌지/옐로 포인트 벽, 컬러 체어에서 일하는 사람들 | 강남 본점 지점 사진 |
| `coworking-brick-building-exterior.jpg` | coworking / 5 | "THE CONSORTIUM COWORKING" 간판이 걸린 붉은 벽돌 2층 건물 외관 | 홍대점 지점 사진 |
| `coworking-hexagon-pod-overhead.jpg` | coworking / 44 | 육각형 협업 데스크에서 노트북으로 작업하는 3인, 위에서 내려다본 구도 | 판교점 지점 사진 |
| `office-desk-laptop-plants.jpg` | office / 52 | 화분이 있는 밝은 오픈 오피스에서 헤드폰을 끼고 노트북 작업하는 사람 | 서면점 지점 사진 |
| `office-whiteboard-notes.jpg` | office / 8 | 화이트보드에 포스트잇을 붙이며 메모하는 사람, 모던 오피스 | 동성로점 지점 사진 |
| `studyroom-wood-table-whiteboard.jpg` | meetingroom / 11 | 원목 테이블, 그레이 체어 6석, 화이트보드, 창문이 있는 깔끔한 소형 스터디룸 | 스터디룸 예약 화면(2~4인실) |
| `studyroom-group-tv-screen.jpg` | meetingroom / 3 | TV 스크린과 큰 테이블이 있는 다인용 회의형 스터디룸, 7인 이용 중 | 스터디룸 예약 화면(대형/단체실) |

id·키워드를 바꾸면 문구와 사진이 어긋나므로, 교체할 때는 이 표도 같이 고친다. 관리자
콘솔(점주·본사)은 사진을 쓰지 않는다 — 회원/지점 아바타는 이니셜 원형, 장비는 종류
아이콘 + 상태 배지로 표현한다.

## 기기 프레임 안쪽 규칙 (사용자 앱, mobile only)

- 하단 탭바, 상단 헤더, QR 체크인/세션 화면의 오버레이 컨트롤 모두 불투명 표면만 쓰고
  `backdrop-blur`를 쓰지 않는다 — `PhoneFrame`의 `rounded-[50px]` 클립을 뚫고 모서리에
  흰 틈이 새는 문제를 피하기 위해서다.
- 엣지 고정 UI는 화면 박스 안쪽에 `absolute`로 둔다(음수 offset, `fixed` 금지).

## 셸 레이아웃 (점주 · 본사 관리자, web only)

- 사이드바 236px, `lg:` 미만에서는 숨기고 `fixed inset-0 z-50 lg:hidden` 드로어(패널
  264px)로 대체.
- 헤더 56px, `sticky top-0 z-30`, `border-b` + 캔버스 배경.
- 본문 `max-w-[1400px] mx-auto`, 패딩 `px-4 py-6 lg:px-8 lg:py-8`.
- 점주 콘솔 사이드바는 밝은 표면(단일 지점 운영자, 소규모 콘솔이라 다크 레일 대신
  `--ss-canvas-soft` 배경 + 헤어라인 구분). 본사 콘솔은 CLAUDE.md 웹 콘솔 구조
  베이스라인대로 **잉크 반전(다크)** — 전사 통제 콘솔이라는 신호. `--ss-rail-*` 전용
  토큰(잉크 베이스)을 쓴다.

## 표 밀도 · 컬럼 예산 (web only)

- `Table` 기본 `minWidth`는 640px — 1440px에서 사이드바(236px) + 패딩을 뺀 실제 컬럼 폭
  기준.
- 컬럼 상한 6열. 점주 콘솔(예약 현황: 좌석/이용자/시간/상태/요금/결제수단), 본사 콘솔
  (지점 관리: 지점명/지역/점주/좌석수/상태/이번달 매출). 넘칠 때는 부가 값을 보조 줄로
  내리고 열 수를 유지한다.
- 좌우 높이가 다른 그리드(대시보드 통계 + 최근 활동)에는 `items-start`.

## Motion

- 화면/섹션 진입: `translateY(12px)` + `opacity 0 → 1`, 600ms
  `cubic-bezier(0.16, 1, 0.3, 1)`(스킬 §7 그대로) — `.ss-enter`.
- 카드 hover: 그림자 `0 0 0 → 0 2px 8px rgba(17,17,17,.04)`, 200ms.
- 버튼 press: `active:scale-[0.98]`.
- 실시간 이용 세션의 잔여시간 표시에만 `--ss-info` 위 맥동 점(`ss-live-dot`)으로 "지금
  이용 중"을 표현.
- `prefers-reduced-motion: reduce`에서 전부 비활성화.

## Component Inventory

`components/shared/*`: `toggle.tsx`, `screen-header.tsx`, `phone-frame.tsx` — 색만
`--ss-*` className prop으로 전달해 재사용.

`projects/platform/studyspot/components/`: `bottom-nav.tsx`, `ui.tsx`(사용자 앱 전용),
`screens/*.tsx`.

`projects/platform/studyspot/components/admin/`: `admin-ui.tsx`(점주·본사 공유),
`admin-shell.tsx`(점주 전용), `admin-app.tsx`, `screens/*.tsx`(점주 화면).

`projects/platform/studyspot/components/hq/`: `hq-shell.tsx`(본사 전용), `hq-app.tsx`,
`screens/*.tsx`(본사 화면). `admin-ui.tsx`를 그대로 import.

`lib/types.ts`, `lib/navigation.ts`, `lib/mock-data.ts` — 세 콘솔이 공유하는 도메인
타입과 mock 데이터(지점·좌석·예약·장비·콘텐츠 등).
