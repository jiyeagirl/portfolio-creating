# BuildBid Design Notes

## 적용 규칙

- `디자인시스템: design-systems/apple_compact.md` (spec.md 지정). 색 토큰, 반경 문법,
  폰트 굵기 사다리(300/400/600/700, 본문은 항상 400), 단일 그림자 규칙을
  `apple_compact`에서 그대로 가져왔다.
- 워크스페이스 `CLAUDE.md`의 UI Generation Rules가 항상 먼저다. 타이포는 Pretendard
  고정(`apple_compact` 원본은 SF Pro 지정이지만 그 문서 자체가 "한글 서비스는
  Pretendard로 대체"라고 명시함). 간격도 `apple_compact`의 `md: 17px`처럼 8px
  그리드를 벗어나는 값 대신 CLAUDE.md의 8px 배수(4/8/12/16/24/32/48)만 썼다.
- `스타일:` 지정이 없어서 style-variant 스킬(minimalist-ui 등)은 적용하지 않았다.
  `design-taste-frontend`(v2)는 읽었지만, 그 스킬 자체가 13장에서 "대시보드/밀도
  높은 제품 UI는 범위 밖(Fluent, Carbon, Atlassian 등을 쓰라)"이라고 명시한다.
  BuildBid는 assetflow와 같은 엔터프라이즈 웹 콘솔이라 히어로/모션 안무 같은
  랜딩페이지 규칙은 적용하지 않고, 어디서나 적용되는 일반 원칙만 가져왔다:
  이모지 금지, Phosphor 아이콘 단일 패밀리, 실제감 있는 이름/데이터, 액센트
  하나만, 그리고 em-dash 금지(9.G), 이 두 가지는 이 문서와 카피 전체에서 지켰다.
- assetflow(`design-systems/vercel_compact.md` 기반)와는 다른 `apple_compact` 고유
  색/반경 값을 쓴다. 두 프로젝트가 같은 `web` 스캐폴드 구조를 공유하지만 팔레트는
  독립적이다.

### 판매자 · 바이어 역할 접근 방식 (이 프로젝트가 assetflow와 다른 지점)

assetflow는 판매자(자산 보유 기업) 단면만 있는 콘솔이라 로그인하면 바로
대시보드였다. BuildBid는 판매자와 바이어 양면이 같은 URL(`/b2b/buildbid`) 안에
공존해야 해서 역할 차원을 하나 더 얹었다.

- 진입하면 `role` 쿼리 파라미터가 없을 때 **랜딩/역할 선택 화면**
  (`components/screens/landing-screen.tsx`)이 뜬다. "판매자로 시작" · "바이어로
  시작" 카드 중 하나를 고르면 `?role=seller` 또는 `?role=buyer`로 전환되고, 그
  안에서 `?screen=`이 화면을 고른다(assetflow의 `lib/navigation.ts` +
  `src/index.tsx` 상태 패턴을 그대로 확장).
  - 판매자: `/b2b/buildbid?role=seller&screen=dashboard|register|bidding|dealDone`
  - 바이어: `/b2b/buildbid?role=buyer&screen=listings|detail|dealManage`
- `components/layout/app-shell.tsx`는 `role` prop 하나로 판매자/바이어 내비게이션
  항목과 헤더 문구를 스위칭하는 **단일 셸**이다. CLAUDE.md의 "역할별로 필요하면
  prop을 추가하라, 포크하지 마라" 원칙을 프로젝트 내부 셸에도 그대로 적용했다.
  헤더의 좌우 화살표 아이콘 버튼(`역할 전환`)을 누르면 역할 상태가 초기화되어
  랜딩으로 돌아간다.
- 관리자에는 이 role 개념이 아예 없다. `components/admin/admin-shell.tsx`는
  판매자/바이어 role 스위처를 갖지 않는 완전히 별도의 셸이다.

### 검수원 Mobile, 관리자 Web 분리 (spec.md 원문 그대로)

- 검수원 Mobile은 이 프로젝트 밖의 `projects/b2b/buildbid-inspector/`
  (`/b2b/buildbid-inspector`)로 완전히 분리되어 있다. PhoneFrame 단일 기기
  캔버스(app 프리셋)와 사이드바 웹 셸(web 프리셋)은 기기 패러다임이 근본적으로
  달라 한 프로젝트에 둘 수 없다. 다른 에이전트가 병행 작업 중이라 이 저장소에서는
  손대지 않았다.
- 관리자 Web은 이 프로젝트 안(`components/admin/`)에 있지만 별도 URL이다.
  `projects/b2b/buildbid-admin/src/index.tsx`는 URL을 하나 더 얻기 위한 얇은
  엔트리이고 `AdminApp`을 import만 한다(assetflow-admin과 같은 구조). scaffold가
  만들어 둔 `components/admin/admin-app.tsx`의 자리표시자(placeholder) 주석
  ("교체하되 named export는 유지")을 그대로 따라 실제 화면으로 교체했다.

## Tokens / 팔레트 (`styles/buildbid.css`, `.buildbid` 스코프)

`apple_compact`의 색을 그대로 옮겼다(assetflow의 vercel_compact 색과는 다른
독립 팔레트).

| 역할 | 값 |
| --- | --- |
| primary | `#0066cc` · focus `#0071e3` · on-dark `#2997ff` |
| ink (제목) | `#1d1d1f` |
| body (본문) | `#333333` (ink-muted-80) |
| mute (보조) | `#7a7a7a` (ink-muted-48) |
| hairline | `#e0e0e0` · divider-soft `#f0f0f0` |
| canvas | `#ffffff` · parchment `#f5f5f7` · pearl `#fafafc` |
| surface-black (관리자 사이드바) | `#000000` 근방(`#0b0b0c`) |

`apple_compact`의 핵심 규칙은 "액센트는 primary 단 하나만, 장식색 추가 금지"다.
이건 마케팅 페이지의 브랜드 액센트 얘기라, 상태 배지처럼 엔터프라이즈 UI에 꼭
필요한 최소 확장은 assetflow와 동일한 방식으로(그러나 다른 hex로) 했다:

| 톤 | 값 | 쓰이는 상태 |
| --- | --- | --- |
| `neutral` | `#f0f0f0` 배경 | 등록 대기, 견적 완료 |
| `info` | `#0066cc` 계열 | 1차 입찰, 최종 입찰, 운송 준비, 정산 대기 |
| `warn` | `#b4650a` 계열 | 검수 중, 계약 진행 |
| `ink` | 잉크 채움(`#1d1d1f`) | 낙찰 확정, 거래 완료 |
| `danger` | `#c92a2a` 계열 | 취소, 유찰, 분쟁 |

액센트는 `--bb-primary` 하나만 화면 전체에서 일관되게 쓴다(입찰 강조 막대, 선택된
탭, 낙찰 배너, CTA 버튼 모두 같은 블루). 두 번째 브랜드색을 추가하지 않았다.

## Shape

- 반경 문법은 `apple_compact`의 "sm=유틸리티, lg=카드, pill=액션, 섞지 않기"를
  그대로 따른다: 버튼·인풋·칩·배지는 전부 `pill`(9999px), 카드·드로어는
  `18px`(`rounded-[18px]`, apple_compact의 `lg` 토큰), 작은 유틸리티 아이콘
  버튼만 `sm`에 해당하는 정사각형 pill(작은 원형)을 쓴다.
  assetflow(vercel_compact, 6/8/12px)보다 훨씬 둥글어서 같은 `web` 프리셋이어도
  두 프로젝트가 시각적으로 뚜렷이 구분된다.
- 그림자: apple_compact 규칙상 시스템 전체 단일 그림자(`rgba(0,0,0,.22) 3px 5px
  30px`)는 "제품 이미지 전용, 카드/버튼/텍스트 금지"다. BuildBid는 이후 장비
  실사진을 도입했지만(사진 매핑 참고) 전부 목록·표 안의 작은 인라인 썸네일이지
  이 규칙이 겨냥하는 대형 마케팅 히어로 컷이 아니라서, 이 그림자를 쓸 자리는
  여전히 없다. 대신 드로어 같은 기능성 오버레이에만 별도로 아주 옅은
  `--bb-shadow-overlay`를 뒀다. 마케팅 그림자 규칙과 분리된 pragmatic 확장이라는
  점을 명시해 둔다.
- 굵기 사다리는 300/400/600/700만 쓰고 500(`font-medium`)은 `components/ui.tsx`
  어디에도 없다(강조는 `font-semibold`=600).

## 표 밀도 · 컬럼 예산

`Table`은 `overflow-x-auto` 안에 있어 컬럼 폭을 넘기면 마지막 열이 조용히
잘린다. 사이드바(232px) + 본문 패딩을 뺀 1440px 기준 좁은 컬럼이 약 600~680px
정도라 화면별로 `minWidth`를 그 범위 안에서 잡았다(520~680, 표 3~6열 기준).
6열을 넘는 표(1차 입찰 현황, 최종 입찰 결과)는 바이어명·등급·가격·시각까지만
최우선 열로 두고 즉시인수 여부는 아이콘 한 칸으로 압축했다. 열이 더 필요하면
값을 보조 줄로 내리거나 열을 줄인다.

## Typography

`apple_compact` 토큰(56/40/34/28/21/17/14/12px, 굵기 300/400/600/700)은 마케팅
스케일이라 콘솔 밀도에 맞게 축소했다: 페이지 제목 26px/600, 카드 제목
15~17px/600, 본문 13~15px/400, 캡션 11~12px/400. 헤딩에는 `apple_compact`가
쓰는 음수 letter-spacing(-0.02~-0.03em) 감각을 유지했다. 장비 코드·거래
번호·금액처럼 자릿수를 맞춰 읽는 값에만 `.bb-mono`를 쓰고 본문에는 쓰지 않는다
(assetflow와 같은 규칙, 클래스명만 `af-` → `bb-`로 바꿨다).

## 사진 매핑

**(2026-07-30 갱신 — 아래가 이전 결정을 대체한다)** 이전에는 이 섹션에서
picsum(id 4~1084 사이 51개 표본, 풍경·사무실 데스크·도시 야경·동물·빈티지
자동차·카메라 위주, 중장비 사진 0건 확인) 에 건설장비 사진이 전혀 없다는
이유로 **전 카테고리를 아이콘 글리프 타일로 대체**했었다. 이후 포트폴리오
리뷰에서 "아이콘으로 들어가니까 신뢰성이 떨어진다"는 피드백을 받아, picsum이
이 소재를 갖고 있지 않다는 사실 자체는 여전히 유효하지만(330여 개 표본으로
재확인, 여전히 0건) **대체 수단으로 아이콘 대신 Wikimedia Commons의 CC
라이선스 실사진을 개별 확인 후 사용**하는 쪽으로 바꿨다. `assets/equipment/`에
저장해 `next/image` 정적 임포트로 불러오고(`lib/mock-data.ts`에서
`Equipment.photo`로 연결), `components/ui.tsx`의 `EquipmentThumb`이 이 사진을
`object-cover`로 렌더링한다. 각 사진은 표시되는 장비와 실제로 일치하는지
육안으로 확인했다.

| id | 장비명 | 카테고리 | 파일 | 내용 | 저작자 · 라이선스 |
| --- | --- | --- | --- | --- | --- |
| e1 | 0.7m³급 굴착기 | 굴착기 | `excavator-1.jpg` | 도심 도로변의 Caterpillar 302.7D 굴착기 | Grendelkhan · CC BY-SA 4.0 |
| e2 | 5톤급 지게차 | 지게차 | `forklift-1.jpg` | 창고 내부의 빨간 리치트럭형 지게차(저해상도 379×365, 카드/썸네일 크기에서만 사용) | Excel23 · CC BY-SA 4.0 |
| e3 | 25톤급 크롤러 크레인 | 크레인 | `crane-crawler.jpg` | 영국 철도 공사 현장의 Kobelco CKG900G 래티스 크롤러 크레인 | Steve Knight · CC BY 4.0 |
| e4 | 8톤급 덤프트럭 | 덤프트럭 | `dumptruck-1.jpg` | 먼지 날리는 현장의 소형 덤프트럭 + 굴착기(트럭은 화면 중경) | Neb · CC BY-SA 4.0 |
| e5 | 1.6m³급 휠로더 | 휠로더 | `loader-1.jpg` | 자갈 채취장의 Komatsu WA500 휠로더 | Syced · CC0 |
| e6 | 10톤급 진동롤러 | 롤러 | `roller-1.jpg` | 흙마당의 Caterpillar CB54B 롤러, 선명한 측면 프로필 | Grendelkhan · CC BY-SA 4.0 |
| e7 | 0.45m³급 미니 굴착기 | 굴착기 | `excavator-2.jpg` | 주택가 도로의 Case 미니 굴착기 | Daderot · CC0 |
| e8 | 5톤급 카고 크레인 | 크레인 | `crane-mobile.jpg` | 중층 건설현장의 초록색 Liebherr 계열 이동식 텔레스코픽 크레인 | sludgegulper · CC BY-SA 2.0 |
| e9 | 15톤급 덤프트럭 | 덤프트럭 | `dumptruck-2.jpg` | 배경에 굴착기가 보이는 밝은 노란색 관절식 덤프트럭들, 깔끔하고 현대적 | Bill Nicholls · CC BY-SA 2.0 |
| e10 | 11톤급 덤프트럭 | 덤프트럭 | `dumptruck-3.jpg` | 흙을 하역 중인 Tatra 815 원웨이 틸팅 덤프트럭 | Oto Zapletal · CC BY 4.0 |

목록 필터 칩·`CategoryTag` 같은 "이 사진이 이 장비다"가 아니라 "이 항목의
카테고리 라벨"을 나타내는 자리에는 여전히 아이콘 글리프를 쓴다(위 표와 같은
Phosphor 아이콘 세트: `Shovel`/`CraneTower`/`Tractor`/`TruckTrailer`/
`Truck`/`RoadHorizon`, `components/ui.tsx`의 `CATEGORY_ICON`). 신규 등록 폼
(`seller-register-screen.tsx`)의 "장비 사진 업로드" 단계도 아직 촬영된 사진이
없는 새 매물이라 스톡 사진을 억지로 넣지 않고 카테고리 아이콘 placeholder를
그대로 둔다(`CategoryPlaceholderTile`).

검수 리포트는 여전히 실사진 대신 점검 항목별 신고값/실측값/판정 표로만
구성했다(`Inspection.items`) — 이건 사진 유무 문제가 아니라 검수 데이터
모델의 의도적 설계라 이번 변경과 무관하다. 랜딩 화면의 "거래 가능 장비
카테고리" 패널도 사진이 아니라 6개 글리프를 duotone 타일 그리드로 배치한
일러스트레이션으로, 이 역시 개별 장비 사진이 아니라 카테고리 전체를
안내하는 구성 요소라 그대로 유지한다.

## 셸 레이아웃

- 판매자/바이어 콘솔(`components/layout/app-shell.tsx`): 데스크탑 사이드바
  232px, 헤더 64px, 본문 `max-w-[1400px]`, `lg:`(1024px) 브레이크포인트 아래로는
  사이드바가 사라지고 좌측에서 슬라이드하는 모바일 드로어로 바뀐다(assetflow와
  동일 기법). 헤더에 역할 배지("판매자"/"바이어")와 역할 전환 버튼이 있다는 점이
  단면 콘솔인 assetflow와 다르다.
- 관리자 콘솔(`components/admin/admin-shell.tsx`): 잉크 블랙(`#0b0b0c`) 사이드바
  236px 고정, 상단 검색 헤더 56px, 본문 `max-w-[1400px]`. 판매자/바이어 콘솔과
  같은 `--bb-*` 토큰을 쓰되 사이드바만 반전시켜 "여기는 운영자 전용 백오피스"
  라는 신호를 준다(assetflow-admin과 동일한 관례). role 스위처는 없다.

## Motion

`bb-enter`(420ms cubic-bezier 페이드+슬라이드)를 드로어, 모바일 메뉴에 쓰고,
`bb-live-dot`으로 입찰 진행 중 상태를 점 맥동으로 표현했다(assetflow의
`af-enter`/`af-live-dot`과 동일 타이밍, 클래스명만 스코프 변경). 두 애니메이션
모두 `prefers-reduced-motion: reduce`에서 완전히 꺼진다(`styles/buildbid.css`
마지막 블록). 그 외 카드/탭 전환은 `transition-colors`뿐이고 스크롤 훅이나
GSAP는 쓰지 않는다. 엔터프라이즈 콘솔이라 `design-taste-frontend`의 모션
안무 규칙(히어로 스크롤텔링 등)은 적용 대상이 아니다.

## 익명화

판매자·바이어·제조사 모두 알파벳 기반 가상 회사명이다(판매자 A건설기계·
C개발·D중장비임대·E인프라·F현장기계·G토건·H건설, 바이어 J중고기계·
K글로벌기계상사·L기계유통·M해외수출상사·N장비몰·P기계무역·Q리퍼비시·
R중장비컴퍼니, 제조사 S중공업·T산업기계·U중공업·V모터스·W기계). 개인 판매자
두 곳(김도현, 박서준)은 실존하지 않는 가상 인물이다. 검수원 이름(정민석,
한지훈, 오세영 등)과 관리자(김규리) 역시 가상이다.

## 구현 범위

mock 데이터만 쓴다. 인증, 결제, 실제 AI 시세 산출 엔진, 위치 기반 검수원 배정
로직, 서버 푸시 알림은 구현하지 않았다(spec.md Non-goals). 장비 등록 화면의
실시간 시세 계산(`components/screens/seller-register-screen.tsx`)은 연식·
가동시간·상태등급에 반응하는 mock 계수(연식 감가 6.8%/년, 가동시간 감가,
등급 계수 A 1.0~D 0.55) 곱이다. 낙찰자 선택(판매자 화면·관리자 화면 모두)과
입찰 제출(바이어 화면)은 로컬 상태로만 반영되고 새로고침하면 초기 mock
데이터로 돌아간다.
