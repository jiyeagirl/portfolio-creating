# COLORRECIPE — Design System

CLAUDE.md 워크스페이스 규칙을 상속한다. `_reference-design-system.md`(FILMATE 원본)의 구조적 값
(spacing, 8px 그리드, radius, motion 타이밍, 안전 영역, 44×44pt 터치 타깃)은 그대로 재사용하고,
색상/무드/타이포 표현은 이 프로젝트 전용으로 새로 정의한다.

## 적용 규칙

- 스타일: `high-end-visual-design` (spec.md 지정) — "Ethereal Glass" 무드 아카이브: 딥 옵시디언
  배경, 은은한 라디얼 메시 글로우, 헤어라인 보더 + 이너 하이라이트를 쓰는 유리 표면, 더블베젤
  (외곽 쉘 + 이너 코어) 카드 구조. 단, CLAUDE.md의 UI Generation Rules가 항상 우선한다 — 폰트는
  Pretendard 고정(스킬이 제안하는 Grotesk/Display 서체 미적용), 기기 프레임은 iPhone 16 Pro
  단일 프레임, 8px 그리드 유지, 엣지 앵커 바에는 `backdrop-blur` 금지(기기 프레임 안쪽 규칙 참고).
- 디자인시스템: 지정 없음 (`design-systems/` 미참조).
- `DESIGN_VARIANCE: 6` (인물/카드형 화면은 비대칭 여지가 있으나 카메라 프리뷰·에디터는 기능성 우선이라
  중간값) / `MOTION_INTENSITY: 5` (스프링 트랜지션 + 진입 페이드, 과도한 초이스그래피는 배제) /
  `VISUAL_DENSITY: 5` (프로 컬러 툴 인상을 위해 슬라이더·수치 밀도를 다소 높임, 단 카드 그리드는
  숨 쉴 공간 유지).
- FILMATE와 동일한 도메인(카메라 앱)이지만 무드는 의도적으로 반대 축에 둔다 — FILMATE가 "따뜻한
  아날로그 필름"이라면 COLORRECIPE는 "차가운 디지털 컬러 사이언스 툴"(DaVinci/Lightroom 다크
  UI에 가까운 정밀 계측기 인상). 팔레트가 겹치지 않도록 앰버 대신 시안 계열 단일 액센트를 쓴다.

## Tokens / 팔레트

컴포넌트 스코프 CSS 변수 (`.colorrecipe` 클래스 아래, 워크스페이스 전역 토큰은 건드리지 않음):

| Token | Value | 용도 |
|---|---|---|
| `--cr-bg` | `#0A0B0D` | 앱 배경 (딥 옵시디언, 순수 블랙 아님) |
| `--cr-surface` | `#15171B` | 카드/시트 표면 (이너 코어) |
| `--cr-surface-raised` | `#1D2025` | 떠 있는 컨트롤, 더블베젤 아우터 쉘 |
| `--cr-cool-gray` | `#8B93A1` | 보조 텍스트, 아이콘 |
| `--cr-cool-gray-soft` | `#565C66` | 비활성 상태, 트랙 배경 |
| `--cr-foreground` | `#F2F4F6` | 주요 텍스트 (쿨 화이트) |
| `--cr-border` | `#262A31` | 헤어라인 구분선 |
| `--cr-accent` | `#4DE8FF` | 시그널 시안 — 슬라이더 채움/선택 상태/셔터 전용 포인트 |
| `--cr-accent-dim` | `rgba(77,232,255,0.14)` | 액센트 글로우, 카드 이너 하이라이트 |
| `--cr-danger` | `#FF5470` | 삭제/경고 |

배경은 쿨 톤 딥 옵시디언으로 통일하고, 포인트 컬러는 `--cr-accent` 시안 한 가지만 사용한다.
레시피별 색감(필터 그레이딩 결과)은 오직 프리뷰/스와치 안에서만 등장시켜 UI 크롬과 "촬영/보정
결과"를 시각적으로 분리한다 (FILMATE와 동일 원칙).

더블베젤 표면: 아우터 쉘 `bg-[var(--cr-surface-raised)]/60` + `ring-1 ring-white/[0.06]` +
`rounded-[20px] p-1.5`, 이너 코어 `bg-[var(--cr-surface)]` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`
+ `rounded-[14px]` (아우터 radius - 6px로 동심원 유지).

## Shape

- 8px 스페이싱 시스템 유지 (FILMATE와 동일).
- Radius 스케일: 카드/시트 20px(아우터)·14px(이너, 더블베젤), 버튼/칩 pill(`rounded-full`),
  슬라이더 트랙 `rounded-full`, 입력 필드 12px.
- Shadow: 순수 블랙 드롭섀도 금지. 액센트 틴트 섀도(`shadow-[0_8px_24px_rgba(77,232,255,0.08)]`)를
  선택된 레시피 카드/활성 탭에만 제한적으로 사용.

## Typography

Pretendard 고정 (워크스페이스 규칙, high-end-visual-design의 서체 제안 미적용). FILMATE와 동일한
스케일을 재사용:

| Role | Size / Line | Weight | 용도 |
|---|---|---|---|
| Display | 34 / 40 | 700 | 온보딩 타이틀 |
| Title 1 | 24 / 30 | 700 | 화면 타이틀 |
| Title 2 | 19 / 24 | 600 | 카드/섹션 제목 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Callout | 13 / 18 | 500 | 캡션, 메타 정보 |
| Micro | 11 / 14 | 500 | 상태바, 슬라이더 수치, 배지 |

슬라이더 수치, ISO/셔터스피드/EXIF/파일 크기 등 숫자는 전부 `tabular-nums`로 고정.

## 사진 매핑

`lib/recipes.ts`의 `heroSeed`와 `lib/photos.ts`의 `seed`에 매핑된 picsum ID. 각 사진은 실제
장면을 확인 후 레시피 무드에 맞춰 배정(파일 옆 주석 참고):

| Seed | 장면 | 매핑된 레시피 |
|---|---|---|
| `colorrecipe-city-dusk-avenue` | 해질녘 도심 대로, 차량 라이트 트레일 | 시네마 틸앤오렌지 |
| `colorrecipe-portrait-window-light` | 창가 역광 인물 클로즈업 | 소프트 포트레이트 |
| `colorrecipe-cafe-morning-flatlay` | 카페 테이블 모닝 플랫레이 | 클린 데일리 |
| `colorrecipe-neon-alley-night` | 네온 간판이 있는 야간 골목 | 네온 나잇 |
| `colorrecipe-mountain-pine-forest` | 침엽수 산림, 안개 낀 능선 | 딥 포레스트 |
| `colorrecipe-flower-field-pastel` | 연분홍 들꽃밭 | 파스텔 드림 |
| `colorrecipe-old-town-brick-street` | 유럽풍 구시가 벽돌 골목 | 빈티지 페이퍼 |
| `colorrecipe-street-portrait-mono` | 흑백 다큐 스타일 거리 인물 | 모노 콘트라스트 |

각 레시피는 `heroSeed` 하나 + 상세 화면용 샘플 컷 2~3장을 위 목록에서 자기 카테고리와 어울리는
추가 seed를 재사용(동일 무드의 다른 장면)한다. `lib/photos.ts`의 갤러리 목업도 이 표의 8개 seed만
사용해 사진마다 실제로 본 장면과 적용 레시피가 어긋나지 않게 고정한다.

## 기기 프레임 안쪽 규칙

`PhoneFrame`의 `overflow-hidden` + `rounded-[50px]` 클립을 깨는 두 요소를 금지한다:

- 엣지 앵커 바(하단 탭바, 카메라 하단 컨트롤 바)에는 `backdrop-blur`를 쓰지 않는다 — 불투명
  서페이스(`bg-[var(--cr-bg)]` 또는 그라디언트)로 대체. 카메라 화면의 **플로팅 칩**(플래시/설정/
  줌/타이머처럼 화면 중앙부에 떠 있는 원형 버튼)은 화면 가장자리에 붙지 않으므로 FILMATE와 동일하게
  `backdrop-blur-md` 허용.
- `fixed`/음수 오프셋으로 화면 박스 밖에 배치되는 요소 금지. 모든 엣지 UI는 화면에 `absolute`.
- 하단 탭바(홈/레시피/설정 화면에서 노출)는 불투명 `bg-[var(--cr-bg)]` + 상단 헤어라인(`border-t
  border-[var(--cr-border)]`)으로 처리, 블러 없이 완전 불투명.

## Motion

- 스프링 트랜지션(`stiffness 300, damping 30`) — 화면 진입 시 FILMATE와 동일 패턴(`x: 32→0` + fade).
- 셔터 버튼: press 시 `scale 0.92`, release 시 40ms 화이트 플래시 오버레이.
- 슬라이더 드래그: 값 변경은 즉시 반영(스프링 없음), 트랙 채움만 `transition-[width] duration-150`.
- 커브 에디터 포인트 드래그: 포인터 이동에 직접 바인딩(스프링 없음, 손 떨림 없는 즉시 반응 요구).
- 레시피 카드 그리드 진입: `opacity/translate-y` 스태거 페이드 (`whileInView`, `duration 0.4`,
  `delay: i * 0.05`).
- `prefers-reduced-motion` 존중 (워크스페이스 전역 CSS에 이미 정의됨).
