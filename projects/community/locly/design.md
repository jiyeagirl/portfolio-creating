# LOCLY — Design System

워크스페이스 `CLAUDE.md`의 규칙(Pretendard, 8px 그리드, Phosphor Icons, Tailwind,
Motion)을 상속한다. 새 디자인 시스템을 만들지 않고 기존 토큰을 재사용하되, LOCLY
고유의 팔레트를 컴포넌트 스코프 CSS 변수(`styles/locly.css`)로 얹는다.

## 0. Design Read

Reading this as: a multi-screen local-community + civic-participation web product
(not a marketing landing page) for residents and municipal staff, with a
trustworthy-civic-meets-neighborhood language, leaning toward Tailwind utilities +
Pretendard + hand-rolled components. The admin surface follows the workspace's own
"Enterprise UI" list (search, filter, status badge, tabs, data table, drawer,
timeline, statistics) rather than a marketing-page skeleton.

**Dials**: `DESIGN_VARIANCE: 6` (asymmetric bento on home, but every screen stays
scannable and usable — not artsy chaos) · `MOTION_INTENSITY: 5` (fluid CSS/Motion
transitions, scroll-reveal, tab switches; no scroll-hijack, this is a daily-use
product not a cinematic launch page) · `VISUAL_DENSITY: 5` on consumer screens,
`7` on the admin screen (cockpit-style tables, `font-mono` for figures).

## 1. Concept

- 당근마켓의 동네 밀착감 + 정부 서비스 특유의 신뢰감을 함께 담는다.
- 장식이 아니라 정보 위계로 화면을 구성한다 — 게시판형 서비스이므로 카드 남용을
  피하고 리스트/행 구분을 적극 활용한다.
- 공식 계정(구청)과 주민 콘텐츠는 시각적으로 명확히 구분한다 (배지 색상 분리).

## 2. Color

컴포넌트 스코프 CSS 변수, 워크스페이스 전역 토큰(`--accent` 등)은 건드리지 않는다.
`.locly` 클래스 아래에서만 유효하다.

| Token | Light | Dark | 용도 |
|---|---|---|---|
| `--locly-bg` | `#F5F5F1` | `#101114` | 페이지 배경 |
| `--locly-surface` | `#ECEDE6` | `#17181C` | 보조 배경 (섹션 구분) |
| `--locly-surface-elevated` | `#FFFFFF` | `#1D1F24` | 카드/입력 배경 |
| `--locly-ink` | `#16181A` | `#EDEEF0` | 본문 텍스트 |
| `--locly-muted` | `#6B6F72` | `#9A9CA3` | 보조 텍스트 |
| `--locly-border` | `#E1E2DB` | `#2A2C31` | 테두리/구분선 |
| `--locly-accent` | `#2E4FD9` | `#6E8CFF` | 단일 브랜드 액센트 (Civic Blue) |
| `--locly-accent-foreground` | `#FFFFFF` | `#0B1220` | 액센트 위 텍스트 |
| `--locly-accent-soft` | `#E7ECFB` | `#1C2440` | 액센트 배경 (배지/hover) |
| `--locly-success` | `#17824F` | `#3FBE85` | 공식 인증/승인 상태 |
| `--locly-success-soft` | `#E4F3EA` | `#123024` | 공식 배지 배경 |
| `--locly-warning` | `#A9690E` | `#E3A03C` | 검토중/대기 상태 |
| `--locly-warning-soft` | `#FBEEDD` | `#33260F` | 대기 배지 배경 |
| `--locly-danger` | `#C13B33` | `#E86B60` | 신고/마감 상태 |
| `--locly-danger-soft` | `#FBE9E7` | `#341815` | 위험 배지 배경 |

브랜드 액센트(Civic Blue)는 CTA·링크·활성 탭에만 사용한다. success/warning/danger는
상태 배지 전용 semantic color로, 페이지의 "단일 액센트" 원칙을 깨지 않는다.

## 3. Typography

Pretendard 고정 (워크스페이스 전역 `--font-sans` 상속, 별도 폰트 지정 없음).

| Role | Size / Weight |
|---|---|
| Display (홈 환영 헤드라인) | 28-34px / 700 / tracking-tight |
| Heading (섹션 타이틀) | 20-22px / 700 |
| Title (카드/행 제목) | 15-16px / 600 |
| Body | 14-15px / 400, leading-relaxed |
| Caption (메타 정보) | 12-13px / 500, `--locly-muted` |

## 4. Layout & Shape

- 8px 그리드, 컨테이너 `max-w-[1360px] mx-auto px-6 lg:px-10`.
- **corner radius lock**: 카드/섹션 16px(`rounded-2xl`), 입력창 8px(`rounded-lg`),
  배지/필/버튼(소형) full(`rounded-full`). 예외 없음.
- 홈 화면은 8개 섹션에 서로 다른 레이아웃 패밀리를 사용한다 (split header → 대표
  카드+리스트 → 랭크드 리스트 → 가로 스크롤 카드 → 벤토 그리드 → 카드 그리드 →
  콤팩트 리스트 → 공지 스트립) — 동일 패밀리 3연속 금지 규칙 준수.

## 5. Icons & Motion

- Phosphor Icons, `weight="regular"`(기본) / `weight="fill"`(active 상태), 고정
  `strokeWidth` 없음(Phosphor는 weight로 대체).
- Motion(`motion/react`)의 `whileInView`로 섹션 진입 리빌, 탭 전환에 `layoutId`
  사용. `prefers-reduced-motion` 시 정적으로 축소.
- 마퀴/스크롤 하이재킹 없음 — 목록형 제품이므로 스크롤 유인 요소 불필요.

## 6. Admin Surface

주민용 화면과 팔레트/타이포는 공유하되 밀도는 다르게 간다: 데이터 테이블 + 상태
배지 + 검색/필터 + 탭 + 드로어(상세) + 타임라인(주민참여 처리 현황) + 통계 카드.
카드 남용 금지, 얇은 구분선(`divide-y`)로 표 형태 목록을 구성한다.
