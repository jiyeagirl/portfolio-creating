# LinkON — Design System

워크스페이스 `CLAUDE.md`의 규칙(Pretendard, 8px 그리드, Phosphor Icons, Tailwind v4,
Motion)을 상속한다. 전역 토큰은 건드리지 않고 LinkON 고유 팔레트를 컴포넌트 스코프
CSS 변수(`styles/linkon.css`)로 얹는다.

## 0. Design Read

Reading this as: a closed, verification-gated B2B networking product for startup
founders plus an operator back-office, with a "verified trust" language, leaning
toward Tailwind utilities + Pretendard + hand-rolled components. 랜딩 페이지가 아니라
매일 쓰는 제품 UI이므로 마케팅 페이지 스켈레톤이 아닌 워크스페이스의 Enterprise UI
목록(검색·필터·상태 배지·탭·데이터 테이블·드로어·타임라인·통계)을 따른다.

**Dials**: `DESIGN_VARIANCE: 6` (홈은 비대칭 벤토, 목록형 화면은 스캔 가능성 우선)
· `MOTION_INTENSITY: 4` (섹션 진입 리빌, 탭·드로어 전환, 호버 피드백까지. 스크롤
하이재킹 없음) · `VISUAL_DENSITY: 5` (회원 화면) / `7` (관리자 화면, 수치는 `tabular-nums`).

## 1. Concept

- 폐쇄형·인증 기반 커뮤니티이므로 **"인증됨"이 가장 중요한 시각 신호**다.
  기업 인증 배지(SealCheck)는 어디서나 동일한 형태·동일한 색으로만 등장한다.
- 창업 생태계 제품이므로 화려한 장식 대신 정보 위계로 승부한다. 카드 남용 대신
  `divide-y` 행 구분과 여백으로 그룹핑한다.
- 회원 화면과 관리자 화면은 팔레트·타이포를 공유하되 밀도만 다르게 간다.

## 2. Color

`.linkon` 스코프 안에서만 유효한 CSS 변수. 단일 액센트는 Deep Teal이며 CTA·활성 탭·
링크·인증 배지에만 쓴다. success/warning/danger는 상태 배지 전용 semantic color로
"단일 액센트" 원칙을 깨지 않는다.

| Token | Light | Dark | 용도 |
|---|---|---|---|
| `--lk-bg` | `#F5F7F8` | `#0E1113` | 페이지 배경 |
| `--lk-surface` | `#EAEEF0` | `#161A1D` | 보조 배경 |
| `--lk-elevated` | `#FFFFFF` | `#1C2126` | 카드/입력 배경 |
| `--lk-ink` | `#14181C` | `#E9EDF0` | 본문 텍스트 |
| `--lk-muted` | `#646D77` | `#97A1AB` | 보조 텍스트 |
| `--lk-border` | `#DFE4E8` | `#282F35` | 테두리/구분선 |
| `--lk-accent` | `#0B5F58` | `#4FC9B4` | 단일 브랜드 액센트 (Deep Teal) |
| `--lk-accent-fg` | `#FFFFFF` | `#04221E` | 액센트 위 텍스트 |
| `--lk-accent-soft` | `#DDEBE8` | `#123430` | 액센트 배경 (배지/활성 탭) |
| `--lk-success` | `#1A7F4B` | `#46C98A` | 승인/인증 완료 |
| `--lk-warning` | `#96620F` | `#DFA24C` | 심사 대기/보류 |
| `--lk-danger` | `#B4402F` | `#DF7A6C` | 반려/신고/마감 |

라이트 모드 액센트는 흰 배경 대비 7:1 이상, 다크 모드 액센트는 어두운 배경 대비
AA를 만족한다.

## 3. Typography

Pretendard 고정 (전역 `--font-sans` 상속).

| Role | Size / Weight |
|---|---|
| Display (온보딩·홈 헤드라인) | 28-34px / 700 / tracking-tight |
| Heading (섹션 타이틀) | 20-22px / 700 |
| Title (카드·행 제목) | 15-16px / 600 |
| Body | 14-15px / 400, leading-relaxed |
| Caption (메타) | 12-13px / 500, `--lk-muted` |
| Figure (통계 수치) | 24-30px / 700, `tabular-nums` |

## 4. Layout & Shape

- 8px 그리드, 컨테이너 `max-w-[1400px] mx-auto px-6 lg:px-10`.
- **corner radius lock**: 카드/섹션 16px(`rounded-2xl`), 내부 타일/썸네일 12px
  (`rounded-xl`), 입력창 8px(`rounded-lg`), 배지·버튼 full(`rounded-full`). 예외 없음.
- 홈은 섹션마다 다른 레이아웃 패밀리를 쓴다: 비대칭 인사+인증 상태 → 벤토 배너 →
  가로 스크롤 추천 → 2컬럼 랭크드 리스트 → 타임라인 + 퀵메뉴 그리드.
- 그림자는 배경 색조에 맞춘 얕은 그림자만 사용하고, 대부분은 1px 보더로 대체한다.

## 5. Icons & Motion

- Phosphor Icons 단일 패밀리. 기본 `weight="regular"`, 활성 상태 `weight="fill"`.
- Motion(`motion/react`)의 `whileInView`로 섹션 진입 리빌(한 번만), 탭 활성 표시에
  `layoutId`. `prefers-reduced-motion`이면 정적으로 축소한다.
- 마퀴, 스크롤 하이재킹, 커스텀 커서, 무한 루프 애니메이션 없음.

## 6. Admin Surface

운영기관 관리자 화면은 별도 프로젝트 `projects/community/linkon-admin/`
(`/community/linkon-admin`)로 분리했고, 아래 원칙을 그대로 이어받는다.
회원 화면과 팔레트·타이포는 공유하되 밀도만 올린다: 통계 타일 + 데이터 테이블 +
상태 배지 + 검색/필터 + 탭 + 드로어(인증 서류 심사) + 타임라인(협업 요청 내역).
표는 카드로 감싸되 행 사이는 `divide-y` 얇은 선만 사용한다.
