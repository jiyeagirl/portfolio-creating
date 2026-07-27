# FILMATE — Design System

CLAUDE.md의 워크스페이스 규칙을 상속한다. 새로운 디자인 시스템을 만들지 않고
기존 토큰(Pretendard, 8px 그리드, Phosphor Icons, Motion)을 재사용하되,
FILMATE 고유의 다크/필름 팔레트를 컴포넌트 스코프로 얹는다.

## 1. Concept

- Apple Human Interface Guidelines의 정직한 컨트롤 배치
- Leica FOTOS / Fujifilm X App의 절제된 다크 UI
- 아날로그 필름의 물성(그레인, 스프로킷 홀, 인덱스 프린트)을 디지털 UI에 은은하게 인용
- Glassmorphism 최소화 — 블러는 카메라 오버레이 컨트롤에만 절제해서 사용
- 장식이 아니라 기능인 디테일만 남긴다

## 2. Color

FILMATE 전용 다크 스케일 (컴포넌트 스코프 CSS 변수, 워크스페이스 전역 토큰은 건드리지 않음):

| Token | Value | 용도 |
|---|---|---|
| `--fm-bg` | `#0B0B0A` | 앱 배경 (거의 블랙) |
| `--fm-surface` | `#1A1917` | 카드/시트 표면 |
| `--fm-surface-raised` | `#242220` | 떠 있는 컨트롤 (버튼, 칩) |
| `--fm-warm-gray` | `#8A8378` | 보조 텍스트, 아이콘 |
| `--fm-warm-gray-soft` | `#5A554C` | 비활성 상태 |
| `--fm-foreground` | `#F5F2EA` | 주요 텍스트 (따뜻한 화이트) |
| `--fm-border` | `#302D28` | 미세한 구분선 |
| `--fm-accent` | `#E8A33D` | 필름 앰버 — 셔터/선택 상태 전용 포인트 |
| `--fm-danger` | `#C4573F` | 삭제/경고 |

배경은 순수 블랙이 아닌 따뜻한 블랙(Black + Warm Gray)으로 통일한다. 포인트 컬러는
`--fm-accent` 한 가지만 사용하고, 필름별 색은 오직 프리뷰/스와치 안에서만 등장시켜
UI 크롬과 "촬영 결과"를 시각적으로 분리한다.

## 3. Typography (Pretendard, 워크스페이스 폰트 재사용)

Apple HIG 스케일을 Pretendard로 재해석:

| Role | Size / Line | Weight | 용도 |
|---|---|---|---|
| Display | 34 / 40 | 700 | Contact Sheet "오늘 촬영" 등 화면 타이틀 |
| Title 1 | 24 / 30 | 700 | 필름명, 섹션 헤더 |
| Title 2 | 19 / 24 | 600 | 카드 제목 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Callout | 13 / 18 | 500 | 캡션, 메타 정보 |
| Micro | 11 / 14 | 500 | 상태바, 프레임 번호, 배지 |

숫자(해상도, 컷 수, 시간)는 tabular-nums로 정렬을 고정한다.

## 4. Layout & Grid

- 8px 스페이싱 시스템 유지
- 캔버스: **iPhone 16 Pro — 393×852pt**, 안전 영역: top 59pt(Dynamic Island), bottom 34pt(Home Indicator)
- 컨트롤 터치 타깃 최소 44×44pt
- 카메라 오버레이 컨트롤만 `backdrop-blur`(8~12px) 허용, 그 외 화면은 불투명 서페이스 사용

## 5. Phone Frame

포트폴리오 캡처용 실물 프레임 컴포넌트 `PhoneFrame`:

- 외곽 393×852 + 베젤 12px, 코너 반경 62px(HW), 새틴 블랙 바디 + 상단 하이라이트 1px
- Dynamic Island: 126×37px, 상단 중앙, `rgba(0,0,0,1)` 필 캡슐
- 사이드 버튼(음소거 스위치, 볼륨 업/다운, 전원) — 순수 장식용 미세 디테일
- 프레임 바깥은 스튜디오 배경(따뜻한 회색 그라데이션 + 소프트 스팟라이트)에 중앙 배치
- 데스크톱 뷰포트에서는 프레임을 화면 중앙에 고정, 좌우 여백에 화면명 라벨(선택)

## 6. Film LUT Simulation

실제 이미지 처리 대신 CSS `filter` + 블렌드 오버레이로 5개 필름의 색감을 근사한다.
`projects/camera/filmate/lib/films.ts`의 `colorGrade`로 정의:

| Film | filter | Overlay | 특징 |
|---|---|---|---|
| Kodak Gold | `saturate(1.15) contrast(1.05) brightness(1.02) sepia(.12) hue-rotate(-6deg)` | amber `soft-light` 8% | 따뜻한 골든아워 톤 |
| Portra 400 | `saturate(.9) contrast(.92) brightness(1.04) sepia(.08)` | peach `soft-light` 6% | 낮은 대비, 크리미한 인물톤 |
| Fuji Classic | `saturate(1.1) contrast(1.08) hue-rotate(4deg) brightness(.98)` | teal-green `multiply` 6% | 시원한 그린/틸 |
| Mono 400 | `grayscale(1) contrast(1.25) brightness(1.03)` | — | 하이 콘트라스트 흑백, 그레인 강조 |
| Cinema Warm | `saturate(1.1) contrast(1.12)` | 스플릿톤: 쉐도우 틸 / 하이라이트 오렌지 (`linear-gradient` `soft-light` 10%) | 시네마틱 룩 |

공통 `FilmGrain` 컴포넌트: SVG `feTurbulence`(baseFrequency .8, opacity 5~7%, `mix-blend-mode: overlay`)로
필름별 강도만 다르게(Mono 400 최대) 적용. 비네트는 radial-gradient 블랙, `multiply`, 모서리 12% 불투명도.

각 필름 팔레트(디테일 화면 스와치 5색)는 `films.ts`에 정의.

## 7. Iconography & Motion

- Phosphor Icons, `duotone` 또는 `regular` weight 통일 (워크스페이스 기존 사용 패턴과 동일)
- Motion(`motion/react`)으로 iOS 스타일 전환: 화면 진입 시 `x: 32→0` + fade, 스프링(`stiffness 300, damping 30`)
- 셔터 버튼: press 시 `scale 0.92`, release 시 화면 전체에 40ms 화이트 플래시 오버레이(촬영 피드백)
- 필름 캐러셀: 스크롤 스냅 + 중앙 아이템 `scale 1.08`, 그 외 `opacity .6`
- `prefers-reduced-motion` 존중 (워크스페이스 전역 CSS에 이미 정의됨)

## 8. Component Inventory (재사용 대상)

`components/shared/` (워크스페이스 공용, 카메라 앱에 종속되지 않는 범용 모바일 목업 프리미티브):

- `phone-frame.tsx` — 목업 프레임 셸
- `status-bar.tsx` — iOS 상태바 (라이트/다크 variant)
- `home-indicator.tsx` — 하단 홈 인디케이터 바

`projects/camera/filmate/components/` (FILMATE 전용):

- `film-grain.tsx` — SVG 노이즈 오버레이. 필름 그레인 감성은 FILMATE 고유의 표현이라 공용으로 두지 않음
- `graded-photo.tsx` — 필름 LUT 컬러 그레이딩 합성 (`film-grain.tsx` 재사용)
- `screens/camera-screen.tsx`
- `screens/film-roll-screen.tsx`
- `screens/film-detail-screen.tsx`
- `screens/contact-sheet-screen.tsx`
- `screens/settings-screen.tsx`

`projects/camera/filmate/pages/` — 라우트별 메타데이터·데이터 로딩 (`app/filmate/**`는 이 모듈들을 재수출만 함).

`projects/camera/filmate/lib/films.ts`, `lib/shots.ts` — mock 데이터.
