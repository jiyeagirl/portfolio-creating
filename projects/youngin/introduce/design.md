# 용인 청사안내 — Design System

`projects/youngin/introduce`. QR 스캔으로 진입하는 공공청사 스마트 안내 모바일웹.
워크스페이스 `CLAUDE.md`의 UI Generation Rules를 상속하고, 구조적 값(spacing / type scale /
radius / shadow / motion / 안전영역)은 `_reference-design-system.md`(filmate)에서 그대로
가져온다. 색상과 무드만 이 프로젝트의 도메인에 맞게 새로 정의했다.

## 적용 규칙

| 항목 | 값 | 출처 |
| --- | --- | --- |
| 스타일 스킬 | 없음 (`spec.md`에 `스타일:` 줄 없음) | — |
| 디자인 시스템 | 없음 (`spec.md`에 `디자인시스템:` 줄 없음) | — |
| 프리미엄 디테일 | 없음 | — |
| 기본 판단 | `supanova-design-engine` | CLAUDE.md Skill Usage Policy |
| 프리셋 | `app` (모바일, PhoneFrame 393×852) | `/scaffold youngin/introduce app` |
| 색상 방향 | 용인시 CI 계열 딥블루 (사용자 확인) | 대화 중 확정 |
| 지도 표현 | 픽토그램 배치도 (정밀 SVG 평면도 아님, 사용자 확인) | 대화 중 확정 |

다이얼 값:

- `DESIGN_VARIANCE`: **낮음**. 공공 안내 서비스라 화면 간 시각 문법이 흔들리면 안 된다.
  카드 radius, 배지 톤, 아이콘 weight를 3개 화면에서 동일하게 유지한다.
- `MOTION_INTENSITY`: **낮음**. 화면 전환과 시트 슬라이드까지만. 장식 모션 없음.
- `VISUAL_DENSITY`: **중간~낮음**. 고령 방문객이 서서 읽는 화면이라 본문 15px 아래로
  내려가는 정보는 캡션/메타로만 쓴다.

## Tokens / 팔레트

`.yi` 스코프 CSS 변수 (`styles/introduce.css`). 워크스페이스 전역 토큰은 건드리지 않는다.

| Token | Value | 역할 |
| --- | --- | --- |
| `--yi-canvas` | `#F4F7FB` | 앱 배경 (차가운 오프화이트) |
| `--yi-surface` | `#FFFFFF` | 카드 / 시트 / 바 표면 |
| `--yi-surface-soft` | `#EDF3FA` | 보조 표면, 선택 안 된 칩 |
| `--yi-surface-sunken` | `#E2EAF4` | 배치도 바닥면, 복도 |
| `--yi-ink` | `#0F2338` | 제목 |
| `--yi-body` | `#33465C` | 본문 |
| `--yi-muted` | `#6A7B90` | 캡션, 메타 |
| `--yi-muted-soft` | `#93A2B4` | 비활성 |
| `--yi-border` | `#DCE5EF` | 기본 구분선 |
| `--yi-border-strong` | `#C3D1E0` | 강조 테두리, 배치도 외벽 |
| `--yi-primary` | `#0B4DA2` | **단일 강조색** |
| `--yi-primary-strong` | `#08386F` | 프레스 상태, 딥 표면 |
| `--yi-primary-soft` | `#E6F0FC` | 강조색 배경 틴트 |
| `--yi-on-primary` | `#FFFFFF` | 강조색 위 텍스트 |
| `--yi-success` | `#12734A` | 대기 없음, 운영 중 |
| `--yi-warning` | `#A85F09` | 혼잡, 마감 임박 |
| `--yi-danger` | `#B23A2E` | 휴무, 이용 불가 |

강조색 사용 규칙: `--yi-primary`는 **한 화면에 면(fill)으로 한 번만** 쓴다. 주요 CTA
(번호표 발급, 길찾기) 하나에만 채우고, 나머지 강조는 `--yi-primary-soft` 배경 + primary
텍스트로 처리한다. 이 규칙이 있어야 "다음에 눌러야 할 것"이 화면마다 하나로 읽힌다.

### 배치도 범례 색 (기능색, 장식 아님)

픽토그램 배치도에서 시설 종류를 구분하는 색이다. 범례가 있는 지도에서 색은 정보이므로
"단일 강조색" 규칙의 예외로 두되, 모두 채도를 낮춰 primary보다 앞으로 튀지 않게 한다.

| 종류 | Token | Value |
| --- | --- | --- |
| 민원 창구 | `--yi-cat-counter` | `#0B4DA2` |
| 부서 사무실 | `--yi-cat-dept` | `#4A5C72` |
| 번호표 / 무인발급기 | `--yi-cat-kiosk` | `#5B4BC4` |
| 안내데스크 | `--yi-cat-info` | `#0E7C6B` |
| 편의시설 (화장실 / 수유실 / 카페) | `--yi-cat-amenity` | `#B06A16` |
| 이동 (엘리베이터 / 계단 / 출입구 / 주차) | `--yi-cat-move` | `#2E7BB5` |

## Shape

- Radius 스케일: `4` 칩 내부 마커 / `8` 배치도 타일 · 작은 컨트롤 / `12` 버튼 · 입력 /
  `16` 카드 / `20` 히어로 · 바텀시트 상단 / `full` 배지 · 필터 칩.
- Shadow 정책: **미세한 2단 스택만.** 카드는 기본적으로 그림자 없이 `--yi-border` 1px로
  분리하고, 실제로 떠 있는 요소(바텀시트, 하단 CTA 바, 선택된 배치도 타일)에만
  `0 1px 2px rgba(15,35,56,.06), 0 8px 24px -12px rgba(15,35,56,.18)`을 준다.
  단일 두꺼운 drop-shadow 금지.

## Typography

Pretendard 고정. 스케일은 `_reference-design-system.md`(filmate)의 HIG 재해석을 그대로 쓴다.

| Role | Size / Line | Weight | 용도 |
| --- | --- | --- | --- |
| Display | 28 / 36 | 700 | 청사명 히어로 |
| Title 1 | 22 / 30 | 700 | 화면 타이틀, 민원명 |
| Title 2 | 17 / 24 | 600 | 카드 제목, 섹션 헤더 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Callout | 13 / 18 | 500 | 캡션, 메타, 배치도 타일명 |
| Micro | 11 / 15 | 600 | 배지, 창구 번호, 범례 |

- 층수 / 창구 번호 / 대기 인원 / 수수료 / 소요 시간은 `.yi-num`(`tabular-nums`)으로 고정.
- `word-break: keep-all`로 한글이 어절 단위로만 끊기게 한다. `overflow-wrap: anywhere`는
  `keep-all`을 무력화하므로 쓰지 않는다.
- em dash(—)와 중간점(·)은 렌더링 텍스트에 쓰지 않는다. 복합 라벨은 슬래시,
  메타 스트립은 파이프, 문장 안 나열은 콤마.

## 사진 매핑

picsum 고정 id만 쓴다. **두 장 모두 원본 크기로 직접 열어 내용을 확인한 뒤 캡션을 붙였다.**
후보였던 `348`은 썸네일에서 실내 대형 홀로 보였으나 원본에서 "London Travel Information"
간판과 런던 지하철 로고가 드러나 탈락시켰다. 아래 매핑을 바꿀 때도 반드시 원본을 다시 연다.

| id | 실제 사진 내용 | 이 서비스에서의 캡션 | 사용처 |
| --- | --- | --- | --- |
| `1076` | 하늘을 배경으로 아래에서 올려다본 각진 건물 코너. 브론즈색 수평 루버 파사드, 간판이나 문자 없음 | 용인시청 본관 외관 | 청사 메인 히어로, 민원 상세의 처리 장소 카드 |
| `42` | 카페 실내. 창가 긴 원목 공용 테이블 위 커피 두 잔과 휴대폰, 창밖으로 거리 | 2층 시민 휴게 카페 | 청사 메인 편의시설 섹션, 층별 안내 시설 상세 시트 |

picsum에는 국내 공공청사 실내에 대응하는 사진이 없다. 창구 / 번호표기 / 무인민원발급기는
사진 대신 배치도 픽토그램과 아이콘으로 표현한다 (없는 장면을 다른 사진으로 대체하지 않는다).

## 기기 프레임 안쪽 규칙

`PhoneFrame`의 `overflow-hidden` + `rounded-[50px]` 클립을 깨지 않기 위해:

- **하단 탭바, 하단 CTA 바, 상단 앱바, 바텀시트에 `backdrop-blur` / `backdrop-filter`를
  쓰지 않는다.** Chromium에서 backdrop filter를 가진 요소는 조상의 라운드 코너 클리핑을
  벗어나 모서리에 흰 틈을 만든다. 전부 불투명 `--yi-surface`로 채운다.
- 반투명 채움(`bg-white/95`)도 쓰지 않는다. 스크롤된 콘텐츠가 비쳐 캡처에서 렌더링
  버그처럼 읽힌다.
- 엣지 고정 UI는 전부 화면 박스 안쪽 `absolute` / `sticky`다. 음수 offset과 `fixed` 금지.
- 하단 탭바와 CTA 바는 `pb-[34px]`로 홈 인디케이터를 피하고, 상단 앱바는 공용
  `ScreenHeader`의 `pt-[59px]`로 상태바를 피한다.

### z-index 순서 (한 번 틀렸던 부분)

셸은 `flex flex-col`이고 하단 바는 스크롤 영역의 **flex 형제**라 겹치지 않는다. 따라서
**하단 탭바와 CTA 바에는 z-index를 주지 않는다.** `z-30`을 줬더니 `BottomSheet`(`z-20`)
위로 올라와 시트의 자체 footer 버튼을 가렸다. 순서는 이렇게 고정한다:

| 요소 | z | 이유 |
| --- | --- | --- |
| 하단 탭바 / CTA 바 | 없음 | flex 형제, 겹치지 않음 |
| `ScreenHeader` | 20 (공용 컴포넌트 값) | 스크롤 콘텐츠 위 |
| `BottomSheet` | 20 + DOM 순서상 뒤 | 헤더와 하단 바 위 |
| `PhoneFrame`의 `StatusBar` | 30 | 시트 스크림 위에서도 시계가 보이게 |

시트가 열리면 `src/index.tsx`가 상태바 글리프를 흰색으로 바꾼다 (스크림 위 가독성).

### `Photo`는 자체적으로 `relative`다

`Photo`는 `next/image`의 `fill`을 쓰므로 래퍼에 `relative`가 붙어 있다. 여기에
`className="absolute inset-0"`를 넘기면 Tailwind에서 `relative`가 뒤에 출력돼 이기고,
박스 높이가 0이 되어 **사진이 조용히 사라진다.** 히어로처럼 채워야 할 때는 `Photo`를
`absolute inset-0` div로 감싸고 `Photo`에는 `h-full w-full`만 준다.

## Motion

`motion/react` 사용. 값은 filmate 레퍼런스와 동일하게 유지한다.

- 화면 전환: `x: 24 → 0` + `opacity: 0 → 1`, 스프링 `stiffness 300 / damping 30`.
- 바텀시트: `y: 100% → 0`, 같은 스프링. 스크림은 `opacity` 페이드 180ms.
- 탭 / 버튼 프레스: `scale 0.97`, `transition: transform 120ms ease-out`.
- 배치도 타일 선택: 테두리 색과 배경만 `160ms ease-out`으로 전환. 크기 변화 없음
  (배치도에서 타일이 커지면 위치 정보가 왜곡된다).
- `prefers-reduced-motion: reduce`에서 위 트랜지션을 전부 0s로 내리는 블록을
  `styles/introduce.css`에 둔다.
