# LUMI CAM — Design System

CLAUDE.md의 워크스페이스 규칙을 상속한다(Pretendard, 8px 그리드, iPhone 16 Pro 프레임,
Iconify Solar icons). 구조적 값은 `_reference-design-system.md`(filmate 원본)를 그대로
재사용하고, 색상/톤 어휘만 이 문서에서 새로 정의한다.

**2026-08-04 재조정**: `supanova-redesign-engine` 스킬 기준으로 아이콘 라이브러리를
Phosphor Icons → Iconify Solar(`@iconify/react`, `solar:*`)로 전면 교체(`lumicam` +
`lumicam-admin` + `lumicam-ipad` 전체, `_reference-*` 문서는 read-only라 대상 제외).
on/off·active/inactive 같은 상태 토글이 있던 아이콘(플래시, 그리드, 카메라 전환, 관리자
nav, 체크/저장 확인 배지 등)은 Phosphor의 `weight="fill"|"regular"` 대신 Solar의
`-bold`/`-linear` 변형 쌍으로 표현한다. 인스타그램 공유 타깃 하나만 브랜드 로고 예외로
`simple-icons:instagram`을 함께 쓴다(§공유 시트, iOS 시스템 크롬 취급과 같은 예외).
타이포/컬러/모션/한국어 카피는 감사 결과 기존 minimalist-ui 톤이 이미 기준을 만족해
변경하지 않았다.

## 적용 규칙

- `스타일: minimalist-ui` — 색상 토큰, 컴포넌트 스펙(카드 테두리 1px, 반경, 그림자 정책),
  탭/뱃지 형태는 minimalist-ui 스킬이 최우선 출처.
- `디자인시스템:` 지정 없음 — `design-systems/`는 참조하지 않는다.
- `design-taste-frontend`(v2) 다이얼: `DESIGN_VARIANCE 6 / MOTION_INTENSITY 5 / VISUAL_DENSITY 4`
  — 다이얼은 대시보드/멀티스텝 프로덕트 UI(Section 13, 이 프로젝트의 모바일 화면들과
  관리자 콘솔 전부 해당)에는 원칙적으로 적용 범위 밖이지만, em-dash 금지·아이콘 라이브러리
  단일화·모션 절제 원칙은 그대로 따른다.
- 관리자 분리: 관리자 콘솔은 별도 프로젝트 `camera/lumicam-admin`(URL: `/camera/lumicam-admin`)
  이고, 실제 화면은 이 프로젝트의 `components/admin/`에 있다. `lumicam-admin`에는
  `styles/`·`design.md`를 두지 않고 이 프로젝트의 토큰을 그대로 상속한다.
- iPad 스튜디오 분리: 편집 스튜디오도 관리자와 같은 이유로 별도 프로젝트
  `camera/lumicam-ipad`(URL: `/camera/lumicam-ipad`)로 분리했다 — "같은 제품, 다른
  플랫폼"은 이 워크스페이스에서 URL이 다른 별도 프로젝트로 표현한다. 실제 화면
  (`components/screens/studio-screen.tsx`)과 전용 기기 프레임(`components/ipad-frame.tsx`)
  은 이 프로젝트 소유로 그대로 두고, `lumicam-ipad`는 그걸 가져다 렌더링만 하는 얇은
  엔트리다(`styles/`·`design.md` 없음, 토큰 상속). 사용자 앱(iPhone) 쪽에는 스튜디오로
  가는 인앱 진입점을 두지 않는다 — 별도 URL의 별도 제품이기 때문.
- `IpadFrame`은 워크스페이스 공용 컴포넌트가 아니라 이 프로젝트에만 있는 두 번째 기기
  프레임이다(첫 사용이라 `components/shared/`로 승격하지 않음, `watch-frame.tsx`와
  동일한 선례).

## 1. Concept

FILMATE(다크, 따뜻한 블랙)의 자매 프로젝트지만 반대 방향의 필름 감성을 택한다:
**따뜻한 종이(bone paper) 위의 편집실.** 국내외 필름 사진 커뮤니티의 라이트 테마 아카이브
앱, 인화지·라이트박스의 물성을 인용한다. 카메라 크롬은 절제된 종이 질감의 미니멀
UI이고, "촬영된 필름 색"만 프리뷰/스와치 안에서 화려하게 등장시켜 UI와 결과물을
분리한다(FILMATE와 동일한 원칙, 반대 색 방향).

- Kinfolk / VSCO 아카이브 탭의 정직한 여백
- Apple HIG의 컨트롤 배치, 라이브 프리뷰 위 오버레이 컨트롤만 절제된 `backdrop-blur`
- 장식 없는 얇은 보더(1px), 그림자는 사실상 없음(minimalist-ui 정책)
- Glassmorphism 없음 — 카메라 라이브 프리뷰 위 원형 아이콘 칩만 예외(사진 위 가독성 목적)

## 2. Tokens · 팔레트

컴포넌트 스코프 CSS 변수(`--lc-*`), 워크스페이스 전역 토큰은 건드리지 않는다.

| Token | Value | 용도 |
|---|---|---|
| `--lc-canvas` | `#FAF8F3` | 앱 배경(따뜻한 본지) |
| `--lc-surface` | `#FFFFFF` | 카드/시트 표면 |
| `--lc-surface-soft` | `#F2EEE3` | 선택된 칩/보조 필 |
| `--lc-ink` | `#18140D` | 주요 텍스트/아이콘, 솔리드 버튼 배경 |
| `--lc-on-ink` | `#FBF8F1` | 솔리드 버튼(잉크 배경) 위 텍스트 |
| `--lc-body` | `#4E4839` | 본문 텍스트 |
| `--lc-mute` | `#948C77` | 보조/placeholder 텍스트 |
| `--lc-border` | `#E7E1D1` | 미세 구분선(1px 고정) |
| `--lc-accent` | `#1FAE5C` | 유일한 포인트 컬러(그린) — 선택 상태, 라이브 인디케이터, 슬라이더, 탭 밑줄 전용 |
| `--lc-accent-soft` | `#E2F5E9` | 포인트 컬러의 파스텔 배경(뱃지/태그 필) |
| `--lc-accent-soft-ink` | `#1C7D47` | 파스텔 배경 위 텍스트 |
| `--lc-danger-soft` | `#FDEBEC` | 경고/삭제 파스텔 배경 |
| `--lc-danger-ink` | `#9F2F2D` | 경고 텍스트 |

색상 잠금 규칙(design-taste-frontend Color Consistency Lock 준용): `--lc-accent` 한 가지만
전 화면에서 상태/선택 표시에 쓴다. 필름별 색(팔레트 스와치, LUT 미리보기)은 프리뷰
합성물 안에서만 등장하고 UI 크롬에는 절대 새지 않는다.

## 3. Shape

- 카드/시트: `rounded-[12px]`, 보더 `1px solid var(--lc-border)`, 그림자 없음(또는
  `0 1px 2px rgba(24,20,13,0.03)` 수준의 초저채도 그림자만 hover에 한해 사용).
  minimalist-ui 반경 상한(12px) 준수 — FILMATE의 `rounded-2xl`(16px)보다 한 단계 낮음.
  `rounded-full`은 원형 터치 타깃(아이콘 버튼, 셔터)과 태그/배지 필에만 쓰고 카드류에는
  쓰지 않는다.
- 버튼: 프라이머리 `rounded-[6px]` 솔리드 잉크, 세컨더리는 보더만.
- 인풋/셀렉트: `rounded-[6px]`.
- 태그/배지: `rounded-full`, `--lc-accent-soft` 배경.

## 4. Typography (Pretendard 고정)

FILMATE와 동일한 Apple HIG 스케일 재사용:

| Role | Size / Line | Weight | 용도 |
|---|---|---|---|
| Display | 34 / 40 | 700 | 온보딩 타이틀, 콘택트 시트 날짜 헤더 |
| Title 1 | 24 / 30 | 700 | 필름명, 섹션 헤더, 스튜디오 화면 타이틀 |
| Title 2 | 19 / 24 | 600 | 카드 제목 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Callout | 13 / 18 | 500 | 캡션, 메타 정보 |
| Micro | 11 / 14 | 500 | 상태바, 프레임 번호, 배지 |

숫자(ISO, 해상도, 프레임 번호, 히스토그램 축)는 `tabular-nums` 고정.

## 5. Film LUT Simulation

실제 3D LUT 대신 CSS `filter` + 블렌드 오버레이로 5개 필름의 색감을 근사한다
(`lib/films.ts`의 `colorGrade`). FILMATE와 구조는 같지만 값은 독립적으로 새로 설계:

| Film | filter | Overlay | 특징 |
|---|---|---|---|
| Sunlit Gold | `saturate(1.18) contrast(1.04) brightness(1.03) sepia(.14) hue-rotate(-8deg)` | amber `soft-light` 9% | 따뜻한 골든아워 |
| Cream Portrait | `saturate(.86) contrast(.9) brightness(1.06) sepia(.07)` | 피치 `soft-light` 6% | 낮은 대비, 크리미한 인물톤 |
| Harbor Teal | `saturate(1.08) contrast(1.06) hue-rotate(6deg) brightness(.97)` | 틸 `multiply` 6% | 쿨 그린/틸 해안 |
| Slate Mono | `grayscale(1) contrast(1.3) brightness(1.02)` | — | 하이 콘트라스트 흑백 |
| Dusk Cinema | `saturate(1.14) contrast(1.16)` | 스플릿톤(쉐도우 틸/하이라이트 앰버) `soft-light` 11% | 시네마틱 해질녘 |

공통 `FilmGrain`(SVG `feTurbulence`)과 비네트(`radial` 블랙 `multiply`)는 FILMATE와 동일한
구조, 이 프로젝트 소유 컴포넌트로 새로 작성(`components/film-grain.tsx`, 공용 승격 대상 아님
— 필름 그레인은 카메라 프로젝트 고유 표현).

## 6. 사진 매핑

Picsum `id` 고정, 실제로 열람해 캡션과 맞춘 것만 사용(랜덤 seed 금지).

| id | 실제 내용 | 배정 |
|---|---|---|
| 64 | 선글라스 쓰고 데이지 꽃다발 든 여성, 초원 골든아워 | Sunlit Gold 히어로 |
| 1080 | 딸기 클로즈업(마켓 진열) | Sunlit Gold 샷 |
| 1040 | 초록 숲 언덕 위 성(노이슈반슈타인풍) | Sunlit Gold 샷 |
| 1027 | 여성 얼굴 클로즈업, 웜톤 실내광 | Cream Portrait 히어로 |
| 1060 | 바리스타 융드립 커피 추출 장면 | Cream Portrait 샷 |
| 1059 | 옷걸이·액자 있는 부티크 실내 정물 | Cream Portrait 샷 |
| 1050 | 틸 색 해안 절벽, 파도 | Harbor Teal 히어로 |
| 1015 | 피오르 절벽 위에서 내려다본 협만 | Harbor Teal 샷 |
| 1063 | 숲 터널 도로 항공뷰 | Harbor Teal 샷 |
| 1074 | 사자(암사자) 클로즈업 초상 | Slate Mono 히어로 |
| 1047 | 벽돌 골목길(도심) | Slate Mono 샷 |
| 91 | 빈티지 TLR 카메라 든 사람(흑백) | Slate Mono 샷 |
| 1019 | 폭풍 전 어두운 해변 하늘 | Slate Mono 샷 |
| 1067 | 시카고 스카이라인 항공뷰, 노을 | Dusk Cinema 히어로 |
| 1005 | 스카프 두른 사람 뒷모습, 노을 해변 | Dusk Cinema 샷 |
| 1016 | 붉은 협곡 바위, 노을 | Dusk Cinema 샷 |
| 823 | 빨간 비니, 빈티지 카메라 든 여성(숲) | 온보딩 히어로 |
| 1043 | 요세미티풍 계곡, 화강암 절벽, 숲과 강 | iPad 편집 스튜디오 데모 이미지(범용 톤) |
| 1070 | 빈티지 자동차 계기판(틸 색 인테리어) | 필터 스토어 "Vintage Drive" 팩 |
| 1018 | 초록 언덕 도로(스코틀랜드풍) | 필터 스토어 "Forest Trail" 팩 |
| 1041 | 파도 클로즈업 | 필터 스토어 "Tide" 팩 |

## 7. 기기 프레임 안쪽 규칙 (모바일)

`PhoneFrame`의 `overflow-hidden` + `rounded-[50px]` 클립을 뚫지 않도록:

- 하단 탭/셔터 컨트롤 스트립은 항상 불투명 표면(`--lc-canvas` 또는 사진 위 그라데이션)
  이고 `backdrop-blur`를 쓰지 않는다.
- 카메라 라이브 프리뷰 위의 **원형 아이콘 칩(플래시/설정/전환, 44×44pt)만** 예외로
  `bg-black/35 backdrop-blur-md`를 쓴다 — 화면 모서리(둥근 클립 구역)에서 떨어진
  위치에만 배치하고, 가장자리에 꽉 차는 바 형태로는 절대 쓰지 않는다.
- 하단 셔터 스트립 배경은 `bg-gradient-to-t from-black/60`(불투명 그라데이션, 블러 아님)
  으로 처리해 클립 경계에 닿아도 흰 틈이 새지 않는다.

## 8. iPad 편집 스튜디오 프레임

`components/ipad-frame.tsx` — iPad Pro 11인치 가로 모드 근사(1194×834pt 캔버스,
베젤 20px, 코너 반경 40px, 실버 알루미늄 바디). `PhoneFrame`과 동일한 className-prop
패턴(배경/스크린 색만 주입, 색은 baked-in 하지 않음)을 따르되 사이드 버튼 대신
상단 베젤 중앙에 전면 카메라 핀홀 하나, 홈 인디케이터는 화면 하단 중앙 얇은 바로
표현한다. 데스크톱 뷰포트에서 `PhoneFrame`과 마찬가지로 화면 중앙, 순백 배경 위에
단독 렌더링된다. `/camera/lumicam`(iPhone, `PhoneFrame`)과 `/camera/lumicam-ipad`
(iPad, `IpadFrame`)가 URL이 다른 별도 페이지라 애초에 같은 화면에서 둘을 동시에
그릴 상황 자체가 없다(§적용 규칙 "iPad 스튜디오 분리").

## 9. Motion

FILMATE 구조값 재사용: 화면 진입 `x: 32→0` + fade, 스프링(`stiffness 300, damping 30`).
셔터 프레스 `scale 0.92` + 40ms 화이트 플래시. `prefers-reduced-motion` 존중(전역 CSS).

## 10. Component Inventory

`projects/camera/lumicam/components/` (프로젝트 전용):

- `film-grain.tsx`, `graded-photo.tsx` — LUT 합성
- `adjustment-controls.tsx` — 필터 조정 슬라이더 프리미티브(`BipolarSlider`/`UnipolarSlider`/
  `OpticalEffectRow`). 모바일 필터 조정, iPad 스튜디오, 관리자 필터 엔진이 전부 공유한다
  (같은 프로젝트 내부 공유라 `components/shared/`로 승격할 필요 없음).
- `ipad-frame.tsx` — iPad 기기 프레임(§8), `camera/lumicam-ipad`에서 가져다 씀
- `screens/onboarding-screen.tsx`, `camera-screen.tsx`, `filter-settings-screen.tsx`,
  `result-screen.tsx`, `filter-store-screen.tsx`, `share-screen.tsx` — iPhone 화면
  (`camera/lumicam`, `PhoneFrame`)
- `screens/studio-screen.tsx` — iPad 화면, `camera/lumicam-ipad`에서 가져다 씀(§적용 규칙)
- `admin/admin-app.tsx`, `admin/*-screen.tsx` — 관리자 콘솔(§적용 규칙 참고)

`lib/films.ts`, `lib/mock-data.ts`, `lib/navigation.ts`, `lib/types.ts` — mock 데이터/타입.
`lib/adjustments.ts` — 조정 파라미터 10종(양방향 7 + 단방향 3)과 광학 효과 6종의 기본값/
라벨/그룹 정의. 데이터 모델은 `types.ts`의 `Adjustments`/`OpticalEffects`/`EditToggles`/
`FilterState` 참고. `Shot.filterState`에 원본 + 프리셋 + 파라미터 전체가 저장되어 비파괴
편집(§UI 재편집 시 그대로 복원)을 데이터로 뒷받침한다.
