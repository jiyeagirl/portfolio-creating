# 용인 아이놀이터 — Design

`/scaffold youngin/child app --with-admin` 로 생성. 사용자용은 모바일웹(PhoneFrame),
관리자 콘솔은 같은 토큰을 쓰는 웹 백오피스라 이 문서에 **기기 프레임 규칙과 셸 규칙이 함께** 있다.

## 적용 규칙

- 워크스페이스 `CLAUDE.md`의 UI Generation Rules (Pretendard, 8px 그리드, iPhone 16 Pro 단일
  프레임, 흰 배경, em dash / 중간점 금지, 고정 picsum id).
- `spec.md`에 `스타일:` / `디자인시스템:` / `프리미엄디테일:` 줄이 **없다.** 따라서
  style-variant skill과 `design-systems/`는 적용하지 않고, 기본값인 `supanova-design-engine`의
  **디자인 판단만** 가져왔다 (한국어 카피 기준, 단일 액센트, 채도 상한, `word-break: keep-all`,
  둥근 숫자 금지). 이 스킬의 출력 형식 규칙(standalone HTML + Tailwind CDN)은 이 워크스페이스와
  충돌하므로 따르지 않는다.
- `_reference-*`(filmate / assetflow)는 **구조적 값만** 참조했다. 색은 전부 새로 설계했다.
- 다이얼: `DESIGN_VARIANCE 6` (공공 서비스라 8은 과함. 비대칭은 히어로에 걸치는 빠른 메뉴 카드와
  가로 스크롤 시설 레일에서만 쓴다) / `MOTION_INTENSITY 3` / `VISUAL_DENSITY 4` (모바일),
  `6` (관리자 콘솔).
- 화면 범위: 사용자용은 `spec.md`의 IA 4개를 모두 만들었다(홈, 시설 상세 / QR 인증, 미션,
  나들이 기록). 관리자 콘솔은 요청대로 **대시보드 1개**만 만들었고, 나머지 항목(배너 / 미션 /
  시설 / 통계)은 내비게이션 라벨로만 남기고 이동시키지 않는다. 빈 화면이나 "준비 중" 페이지는
  만들지 않는다.

## 화면 구성과 내비게이션

프로젝트는 URL 하나만 쓴다(`/youngin/child`). 화면 전환은 `src/index.tsx`가 들고 있는
`screen` 상태와 `onNavigate` 콜백으로만 하고, `next/link`나 추가 라우트는 쓰지 않는다.

| 화면 | 키 | 진입 경로 |
| --- | --- | --- |
| 홈 | `home` | 탭바, QR 진입 기본 화면 |
| 시설 상세 / QR 인증 | `facility` | 홈 시설 카드, 최근 나들이 행, 미션 카드, 기록 타임라인 |
| 미션 | `mission` | 탭바, 홈 시즌 미션 카드, 홈 잠금 미션 카드 |
| 나들이 기록 | `record` | 탭바, 홈 빠른 메뉴 / 타임라인 버튼, 인증 완료 시트 |

- 하단 탭바는 **홈 / 미션 / 기록** 3개다. 시설 상세는 푸시로 열리는 화면이라 탭바를 감추고
  하단에 QR 인증 바를 넣는다.
- 아이 프로필(서아 / 도윤) 상태는 `src/index.tsx`가 들고 있어 화면을 옮겨도 유지된다.
  아이를 바꾸면 시설, 미션, 배너, 기록이 한꺼번에 다시 매칭된다.
- 조사(은/는, 이/가, 와/과)는 아이 이름과 연령대 라벨이 데이터라 문장에 박아 둘 수 없다.
  `lib/navigation.ts`의 `withTopic` / `withSubject` / `withCompanion`이 받침을 보고 붙인다
  ("서아는 / 도윤은"). 새 문장을 쓸 때 조사를 직접 타이핑하지 말 것.

### 스크린샷 (`?screen=` 규약)

`src/index.tsx`가 마운트 시 한 번 쿼리 파라미터를 읽는다. `screen` 외에 `facility`(시설 id),
`qr`(=1이면 인증 시트를 연 상태로 시작)도 받는다.

```
npm run capture youngin child home facility "facility:qr=1" mission record
```

## Tokens / 팔레트

`styles/child.css`의 `.yongin-child` 스코프. 사용자 모바일웹과 관리자 콘솔이 **같은 토큰을
공유**하고, `child-admin` 프로젝트는 별도 `styles/`를 두지 않고 이걸 상속한다.

| 역할 | 토큰 | 값 |
| --- | --- | --- |
| 캔버스 | `--yc-canvas` | `#f7f4ee` |
| 표면 | `--yc-surface` | `#ffffff` |
| 보조 표면 | `--yc-surface-soft` | `#efeade` |
| 헤어라인 | `--yc-hairline` / `--yc-hairline-strong` | `#e4dfd2` / `#cec7b6` |
| 잉크 | `--yc-ink` / `--yc-body` / `--yc-mute` | `#1c201c` / `#4c534c` / `#8a918a` |
| 액센트 | `--yc-accent` / `--yc-accent-deep` / `--yc-accent-soft` | `#2e6b4f` / `#22523c` / `#dcebe1` |
| 액센트 위 텍스트 | `--yc-on-accent` | `#ffffff` |
| 도장 잉크 | `--yc-stamp` / `--yc-stamp-soft` | `#b5702a` / `#f6e7d3` |
| 잠금 | `--yc-lock` / `--yc-lock-soft` | `#9b9384` / `#eee9dd` |
| 관리자 레일 | `--yc-rail` / `--yc-rail-soft` / `--yc-rail-line` / `--yc-rail-mute` | `#1f241f` / `#2b312b` / `#363c35` / `#98a096` |
| 차트 | `--yc-chart-1..5`, `--yc-chart-rest` | `#22523c` → `#cfe3d6`, rest `#e7e1d4` |

- **액센트는 숲 초록 하나뿐이다.** CTA, 진행률, 활성 탭, 배지, 차트 강조 막대가 전부 이 색조
  안에서 해결된다. 아동 서비스의 기본값인 빨강/노랑/파랑 3원색 조합은 쓰지 않았다.
- `--yc-stamp`(웜 브라운)는 **도장과 리워드 전용 보조 톤**이다. 두 번째 액센트가 아니므로
  버튼, 링크, 활성 상태에는 절대 쓰지 않는다. 도장판이 종이 스탬프처럼 읽히게 하는 역할만 한다.
- 순수 흰 배경 대신 웜 페이퍼 캔버스를 써서 흰 카드가 배경에서 분리되게 했다.

## Shape

- 모바일: 칩 `full` / 작은 타일 12px / 카드 16px / 히어로 하단 라운드 28px.
- 관리자 콘솔: 버튼과 입력 6px / 카드 8px / 배지 `full` (레퍼런스의 콘솔 반경 문법 그대로).
- 그림자는 단일 두꺼운 drop-shadow 금지. `--yc-shadow`(3단 미세 스택)만 쓰고, 실제로 얹은 곳은
  히어로에 걸치는 빠른 메뉴 카드 **한 곳**뿐이다. 나머지 카드는 1px 헤어라인으로 분리한다.

## Typography

Pretendard 고정(워크스페이스 규칙). 레퍼런스의 HIG 스케일을 393px 캔버스에 맞게 좁혔다.

| Role | Size / Line | Weight | 용도 |
| --- | --- | --- | --- |
| Display | 27 / 32 | 700 | 히어로 "OO는 지금 OO기예요" |
| Title 1 | 24 / 32 | 600 | 콘솔 `PageHead` 제목 |
| Title 2 | 16 - 17 / 20 - 24 | 700 | 섹션 헤드, 카드 제목 |
| Body | 13 - 15 / 20 - 22 | 400 - 500 | 본문, 표 셀 |
| Caption | 12 - 12.5 / 16 - 18 | 500 | 메타 정보, 배지 |
| Micro | 11 - 11.5 / 14 - 16 | 500 - 600 | 날짜, 부서명, 푸터 |

- 숫자는 `.yc-num`(`font-variant-numeric: tabular-nums`)으로만 자릿수를 맞춘다. 모노 폰트는
  쓰지 않는다 (한글 본문과 섞이면 톤이 깨진다).
- 한글 줄바꿈은 루트에 `word-break: keep-all; overflow-wrap: break-word`. `anywhere`는
  `keep-all`을 무력화하므로 쓰지 않는다.
- 중간점(·)과 em dash(—)는 쓰지 않는다. 메타 정보 나열은 파이프(`처인구 포곡읍 | 3.2km | 09:30 - 17:30`),
  문장 안 나열은 콤마를 쓴다.

## 사진 매핑

picsum id는 전부 직접 열어보고 고른 고정 값이다(`lib/mock-data.ts` 상단 사진 대장과 동일).
seed 방식은 쓰지 않는다. 캡션을 바꿀 때는 사진을 다시 열어보고 짝을 확인한다.

| id | 사진 내용 | 쓰이는 곳 |
| --- | --- | --- |
| 28 | 초록 활엽수림 사이 바위 계곡 | 용인어린이상상의숲 카드, 시설 상세 첫 사진, 07.30 방문 기록 |
| 1043 | 침엽수림과 화강암 절벽, 강 | 상상의숲 시설 상세 두 번째 사진, 여름 숲 프로그램 배너, 06.21 방문 기록 |
| 24 | 나무 탁자에 펼쳐진 두꺼운 책 | 기흥어린이도서관 카드, 시설 상세, 07.24 / 06.07 방문 기록 |
| 128 | 갈대밭 너머 새벽 호수와 산자락 | 죽전 호수공원 유아놀이터 카드, 시설 상세, 08.01 / 07.18 방문 기록 |
| 434 | 맑은 여름 호수와 물가 나무 데크 | 여름 시즌 미션 카드(물놀이), 신갈천 물놀이장 카드, 08.05 방문 기록 |

**수지 장난감도서관은 사진을 쓰지 않는다.** 내용이 맞는 사진이 없어서 `FacilityThumb`의
카테고리 글리프 타일(아이콘 + 카테고리명)로 대체했다. 맞지 않는 사진을 붙이는 것보다 글리프가
낫다는 판단이며, 사진을 넣고 싶으면 먼저 사진부터 확인한다. 사진 없이 QR 인증만 한 방문 기록
(도윤의 07.12 장난감도서관)도 같은 글리프 타일로 표시되고, 기록 화면의 "추억 보기" 그리드에서는
제외된다.

## 기기 프레임 안쪽 규칙 (모바일)

- 화면은 `PhoneFrame`의 `overflow-hidden` + `rounded-[50px]`으로 잘린다. **엣지에 닿는 어떤
  요소에도 `backdrop-blur` / `backdrop-filter`를 쓰지 않는다.** Chromium에서 backdrop filter가
  조상의 라운드 코너 클립을 뚫고 모서리에 흰 틈을 만든다.
- 상태바 뒤에 깔리는 액센트 스트립(`absolute inset-x-0 top-0 h-[59px] z-20`)은 **불투명 면**이다.
  반투명(`bg-white/95`)이나 블러를 쓰지 않는다. 이 스트립이 있어야 스크롤한 뒤에도 흰 상태바
  글자가 밝은 캔버스 위에서 사라지지 않는다.
- 엣지 고정 요소는 화면 박스 안쪽 `absolute`로만 둔다. `fixed`와 음수 offset은 쓰지 않는다.
- 하단 탭바(`components/bottom-nav.tsx`)와 시설 상세의 QR 인증 바는 둘 다 화면 박스 안쪽
  `absolute inset-x-0 bottom-0`이고 **불투명 표면 + `pb-8`**(홈 인디케이터 회피)이다.
  블러도, `fixed`도 쓰지 않는다.
- 탭바/인증 바가 있는 화면의 본문은 `pb-[104px]`로 가려짐을 피한다.
- QR 인증 시트는 화면 박스 안쪽 `absolute inset-0`이라 프레임의 라운드 코너 클립을 그대로
  따른다. 스크림은 `rgba(28,32,28,0.72)` 불투명 색이고 `backdrop-blur`가 아니다.
- 상태바 글자색은 화면마다 다르다. 홈은 초록 히어로 위라 흰색, 나머지 세 화면은 흰
  `ScreenHeader` 위라 잉크색이다(`src/index.tsx`의 `statusBarClassName`).

## 테두리 색 주의 (워크스페이스 이슈)

`app/globals.css`의 `* { border-color: var(--border) }`는 `@layer` 밖에 있는 규칙이라
레이어에 들어간 Tailwind의 `border-<color>` 유틸리티를 **전부 이긴다**(언레이어드 CSS가
레이어드 CSS를 이기는 캐스케이드 규칙). 그래서 `border-[var(--yc-accent)]` 같은 클래스는
조용히 무시되고 전역 기본값 `#e3e0d5`로 그려진다. 헤어라인은 색이 비슷해 티가 안 나지만
액센트/도장/다크 레일 테두리는 회색으로 죽는다.

전역 파일을 고치면 워크스페이스의 다른 프로젝트 렌더링까지 바뀌므로 손대지 않고,
`styles/child.css`에 스코프 클래스를 두어 되살린다. 테두리에 토큰 색을 쓸 때는 이 클래스를 쓴다.

| 클래스 | 색 |
| --- | --- |
| `.yc-b-accent` | `--yc-accent` |
| `.yc-b-stamp` | `--yc-stamp` |
| `.yc-b-strong` | `--yc-hairline-strong` |
| `.yc-b-rail` | `--yc-rail-line` |

## 셸 레이아웃 (관리자 콘솔)

| 항목 | 값 |
| --- | --- |
| 사이드바 | 236px, `lg:` 미만 숨김, `--yc-rail` 다크 반전 |
| 헤더 | 56px, `sticky top-0 z-30`, `border-b` + `--yc-surface` |
| 모바일 드로어 | `fixed inset-0 z-50 lg:hidden`, 패널 264px, 스크림은 `<button aria-label>` |
| 본문 패딩 | `px-4 py-6` → `lg:px-8 lg:py-10` |
| 본문 max-width | `mx-auto max-w-[1400px]` |
| 내비 항목 | 아이콘 15px, active 시 `weight` bold → fill, `rounded-[6px] px-3 py-2` |

사용자 콘솔 셸은 만들지 않았다. 이 제품의 사용자 화면은 모바일웹(PhoneFrame)이고, 웹 셸은
관리자 백오피스 하나뿐이다. 그래서 레퍼런스 두 셸 중 **F자형(다크 레일 전체 높이)만** 썼다.

## 표 밀도 · 컬럼 예산

- `Table`은 `overflow-x-auto` 안에 있어 컬럼 폭 합이 `minWidth`를 넘으면 **마지막 열이 조용히
  잘린다.** 잘림은 에러를 내지 않으므로 폭 예산을 먼저 정한다.
- 기본 `minWidth = 720`, 대시보드의 두 표는 `760`. 1440px에서 사이드바 236px과 본문 좌우 패딩
  64px을 빼면 실제 컬럼 폭이 약 1140px이라 760은 충분히 안쪽이다.
- **열 상한 6개.** 두 표 모두 6열(배너명 / 분류 / 노출 연령대 / 노출수 / 탭 전환율 / 상태,
  시설명 / 카테고리 / 대상 연령대 / QR 인증 / 최근 동기화 / 상태).
- 넘칠 때는 열을 늘리지 말고 값을 보조 줄로 내린다. 지금도 부서·기간과 소재지는 첫 열의
  보조 줄에 들어가 있다.
- 좌우 높이가 다른 그리드에는 `items-start`를 준다(차트 카드 + 연령대별 이용 카드, 타임라인 +
  노출 규칙 카드).

## Motion

- 콘솔 진입: `.yc-enter` = `420ms cubic-bezier(.16,1,.3,1)`, `opacity` + `translateY(6px)`.
- 진행률 바: `transition-[width] 500ms ease-out`. 아이를 바꾸면 밴드 진행률이 다시 그려진다.
- 프레스 피드백: 모바일은 `active:scale-[0.99]`와 표면 색 전환, 콘솔은 `active:scale-[0.99]`.
- 가로 스크롤 시설 레일은 `scroll-snap-type: x mandatory`, 스크롤바는 숨긴다.
- QR 스캔 진행 바는 `.yc-scan`(2000ms). 스캔이 끝나 인증 완료로 넘어가는 시점과 폭이 차는
  시점을 맞추려고 `Progress`의 500ms 전환 대신 전용 키프레임을 쓴다.
- `prefers-reduced-motion: reduce`에서 `.yc-enter`를 끄고, `.yc-scan`은 **끝 상태(폭 100%)로
  고정**한다. 애니메이션만 끄면 폭 0에 멈춰 진행 상태를 못 읽는다.

## 도장 시스템

이 프로젝트 고유 자산은 마스코트가 아니라 **도장판**이다.

- `StampSlot`: 획득한 자리는 `--yc-stamp` 2.5px 테두리 + `--yc-stamp-soft` 채움에 홀수/짝수로
  `-8deg` / `6deg` 회전을 줘서 손으로 찍은 고무도장처럼 어긋나게 둔다.
- 빈 자리는 2px 점선 원. 채워진 자리와 같은 크기(36px)라 남은 개수가 한눈에 보인다.
- 도장 관련 수치(도장 2, 27개)는 전부 `--yc-stamp` 톤 배지로만 표시하고 초록 액센트와 섞지 않는다.

## 관리자 분리

- 관리자 콘솔은 `/youngin/child-admin`으로 URL이 분리된다. 화면 코드는 워크스페이스 관례대로
  본 프로젝트 `components/admin/` 안에 있고, `child-admin`은 URL을 하나 더 얻기 위한 얇은
  엔트리(`src/index.tsx` + `src/meta.ts`)일 뿐이다.
- `child-admin`에는 `styles/`와 `design.md`를 두지 않는다. 위 토큰을 그대로 상속한다.
- **사용자 화면에는 관리자 진입점을 두지 않는다.** 실제 서비스처럼 주소도 계정도 다르다.
- `components/admin/admin-app.tsx`는 지우지 않는다. 프로젝트 라우트가 공유 컴파일 단위라
  이 파일이 사라지면 워크스페이스의 모든 프로젝트 URL이 500이 난다.
