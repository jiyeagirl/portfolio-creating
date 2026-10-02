---
version: alpha
name: Airbnb-design-analysis-compact
---

colors:
  primary: "#ff385c"
  primary-active: "#e00b41"
  primary-disabled: "#ffd1da"
  luxe: "#460479"
  plus: "#92174d"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-strong: "#f2f2f2"
  hairline: "#dddddd"
  hairline-soft: "#ebebeb"
  border-strong: "#c1c1c1"
  ink: "#222222"
  body: "#3f3f3f"
  muted: "#6a6a6a"
  muted-soft: "#929292"
  star-rating: "#222222"
  on-primary: "#ffffff"
  primary-error-text: "#c13515"
  primary-error-text-hover: "#b32505"
  legal-link: "#428bff"
  scrim: "rgba(0,0,0,0.5)"

typography:
  rating-display: { fontFamily: "Pretendard", fontSize: 64px, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1px }
  display-xl: { fontFamily: "Pretendard", fontSize: 28px, fontWeight: 700, lineHeight: 1.43, letterSpacing: 0 }
  display-lg: { fontFamily: "Pretendard", fontSize: 22px, fontWeight: 500, lineHeight: 1.18, letterSpacing: -0.44px }
  display-md: { fontFamily: "Pretendard", fontSize: 21px, fontWeight: 700, lineHeight: 1.43, letterSpacing: 0 }
  display-sm: { fontFamily: "Pretendard", fontSize: 20px, fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.18px }
  title-md: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 600, lineHeight: 1.25, letterSpacing: 0 }
  title-sm: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 1.25, letterSpacing: 0 }
  body-md: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 }
  body-sm: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 1.43, letterSpacing: 0 }
  caption: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 1.29, letterSpacing: 0 }
  caption-sm: { fontFamily: "Pretendard", fontSize: 13px, fontWeight: 400, lineHeight: 1.23, letterSpacing: 0 }
  badge: { fontFamily: "Pretendard", fontSize: 11px, fontWeight: 600, lineHeight: 1.18, letterSpacing: 0 }
  micro-label: { fontFamily: "Pretendard", fontSize: 12px, fontWeight: 700, lineHeight: 1.33, letterSpacing: 0 }
  uppercase-tag: { fontFamily: "Pretendard", fontSize: 8px, fontWeight: 700, lineHeight: 1.25, letterSpacing: 0.32px, textTransform: uppercase }
  button-md: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 1.25, letterSpacing: 0 }
  button-sm: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 1.29, letterSpacing: 0 }
  link: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 1.43, letterSpacing: 0 }
  nav-link: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 600, lineHeight: 1.25, letterSpacing: 0 }

> 원본은 Airbnb Cereal VF(라이선스 폰트) 지정이며 문서상 대체 폰트는 Inter이지만, CLAUDE.md 규칙상 항상 Pretendard로 대체함 (한글 서비스)

rounded:
  none: 0px
  sm: 8px
  md: 14px
  lg: 16px
  xl: 32px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

elevation:
  flat: none
  card-float: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0"
  scrim: "{colors.scrim}"

components:
  top-nav: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.nav-link}", height: 80px, borderBottom: "1px solid {colors.hairline}" }
  product-tab-active: { text: "{colors.ink}", type: "{typography.nav-link}", icon: 32px, underline: "2px solid {colors.ink}" }
  product-tab-inactive: { text: "{colors.muted}", type: "{typography.nav-link}", icon: 32px, underline: none }
  new-tag: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.uppercase-tag}", rounded: "{rounded.full}", anchor: icon-top-right }
  search-bar-pill: { bg: "{colors.canvas}", rounded: "{rounded.full}", height: 64px, border: "1px solid {colors.hairline}", shadow: "{elevation.card-float}", divider: "1px {colors.hairline}" }
  search-field-segment: { label: "{typography.caption}", placeholder: "{typography.body-md}", placeholderColor: "{colors.muted}" }
  search-orb: { bg: "{colors.primary}", icon: "{colors.on-primary}", rounded: "{rounded.full}", size: 48px }
  button-primary: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button-md}", rounded: "{rounded.sm}", padding: "14px 24px", height: 48px }
  button-primary-active: { bg: "{colors.primary-active}" }
  button-primary-disabled: { bg: "{colors.primary-disabled}", text: "{colors.on-primary}", cursor: not-allowed }
  button-secondary: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.ink}", rounded: "{rounded.sm}", padding: "14px 24px", height: 48px }
  button-tertiary-text: { bg: transparent, text: "{colors.ink}", type: "{typography.button-sm}", textDecoration: underline-on-hover }
  button-pill-rausch: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button-sm}", rounded: "{rounded.full}", padding: "10px 20px" }
  property-card: { bg: transparent, image: "1:1", rounded: "{rounded.md}", title: "{typography.title-md}", meta: "{typography.body-sm}", metaColor: "{colors.muted}", padding: "{spacing.base}" }
  property-card-photo: { rounded: "{rounded.md}", aspect: "1:1", carousel: dots-overlay }
  experience-card: { image: "4:5", rounded: "{rounded.md}", title: "{typography.title-md}" }
  guest-favorite-badge: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.badge}", rounded: "{rounded.full}", shadow: "{elevation.card-float}", anchor: photo-top-left }
  icon-button-circle: { bg: "{colors.surface-strong}", rounded: "{rounded.full}", size: 32px, activeColor: "{colors.primary}" }
  rating-display-card: { value: "{typography.rating-display}", valueColor: "{colors.ink}", label: "{typography.body-sm}", ornament: laurel-svg-both-sides }
  amenity-row: { text: "{colors.ink}", type: "{typography.body-md}", padding: "12px 0", divider: "1px solid {colors.hairline} (섹션 상·하단만)" }
  reviews-card: { grid: 2col, author: "{typography.title-md}", excerpt: "{typography.body-sm}", more: "{component.button-tertiary-text}" }
  host-card: { bg: "{colors.canvas}", rounded: "{rounded.md}", padding: "{spacing.lg}", text: "{colors.ink}" }
  reservation-card: { bg: "{colors.canvas}", rounded: "{rounded.md}", border: "1px solid {colors.hairline}", shadow: "{elevation.card-float}", padding: "{spacing.lg}", price: "{typography.display-md}", fees: "{typography.body-sm}", cta: "{component.button-primary} (full-width)" }
  date-picker-day: { bg: transparent, text: "{colors.ink}", type: "{typography.body-sm}", rounded: "{rounded.full}", size: 40px }
  date-picker-day-selected: { bg: "{colors.ink}", text: "{colors.canvas}", rounded: "{rounded.full}", rangeFill: "{colors.surface-soft}" }
  text-input: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", focusBorder: "2px solid {colors.ink}", rounded: "{rounded.sm}", padding: "14px 12px", height: 56px, label: "{typography.caption}", labelColor: "{colors.muted}" }
  footer-light: { bg: "{colors.canvas}", padding: "48px 80px", columns: 3, gutter: "{spacing.lg}", heading: "{typography.title-sm}", link: "{typography.body-sm}", text: "{colors.ink}" }
  footer-link: { bg: transparent, text: "{colors.ink}", type: "{typography.body-sm}" }
  legal-band: { bg: "{colors.canvas}", text: "{colors.muted}", type: "{typography.caption-sm}", link: "{colors.legal-link}" }

## 핵심 규칙 (Do)

- 액센트는 `{colors.primary}` Rausch 단 하나. 사용처는 **primary CTA / search orb / 하트 저장 상태 / 브랜드 워드마크·인라인 링크**뿐이며 아껴 쓴다. 페이지의 90%는 화이트 + 잉크.
- 캔버스는 항상 순백 `#ffffff`. 다크모드 없음. 푸터도 대비 배경 없이 캔버스와 동일.
- 텍스트는 순수 블랙 금지. `{colors.ink}` #222222가 기본 잉크.
- 별점 아이콘·평점 숫자는 골드/옐로우 금지 — `{colors.star-rating}`(잉크)로 렌더. 여행 문맥에서 노란 별은 싸구려로 보임.
- 모든 인터랙티브 요소는 라운드. 하드 코너는 body 그리드 외 사실상 없음 — 버튼 8px, 카드 14px, 검색바·하트·orb는 `{rounded.full}`, 카테고리 스트립 32px.
- display weight는 500~700의 절제된 범위. 시각적 무게는 **사진**이 담당(홈 h1이 28px인 이유).
- 타이포가 단독으로 위계를 만드는 곳은 `{typography.rating-display}`(64px/700) 하나뿐. 다른 곳에 64px 쓰지 않기.
- 그림자 단계 만들지 않기. 딱 하나 `{elevation.card-float}`만 허용(카드 hover, 검색바 rest, 드롭다운). 깊이는 사진 · 화이트 온 화이트 · 라운드 클리핑으로 표현.
- 에러 레드는 `{colors.primary-error-text}` #c13515 — Rausch와 절대 혼용 금지.
- `{colors.legal-link}` 블루는 법적 고지 밴드 내부에서만 사용.
- Luxe(`{colors.luxe}`) · Plus(`{colors.plus}`)는 해당 서브브랜드 문맥 외 메인 마케팅에 절대 노출 금지.
- 여백은 4px 사다리(xxs~section)만 사용. 주요 밴드 64px, 카드 그리드 간격은 16px로 압축 — "열린 히어로 + 조밀한 마켓플레이스" 대비를 의도적으로 유지.
- 푸터/언어 선택 같은 에디토리얼 드롭다운은 카드 서피스·그림자 없이 텍스트 컬럼만.
- 인풋 포커스는 글로우·링 금지. 보더만 2px 잉크로 두껍게.
- hover 상태는 문서화하지 않음(no-hover 정책). active만 정의.

## Breakpoints (요약)

1440+(에디토리얼 1280px 캡, 리스팅/검색 1440px 캡) · 1128–1440(데스크탑) · 744–1128(태블릿) · <744(모바일)

- 프로퍼티 카드 그리드: 4col → 2col(태블릿) → 1col(모바일)
- 도시 링크 그리드: 6col → 2~3col(태블릿) → 1col(모바일)
- 그리드는 행 리플로우 금지 — 항상 컬럼 수만 감소
- 744px 미만에서 상단 제품 탭 → 햄버거 시트, 검색바 3분할 → 단일 탭 풀스크린 오버레이
- 리스팅 상세: 데스크탑 2col(본문 64% / 예약 카드 sticky 32%) → 모바일 하단 sticky 바(가격 + Reserve CTA)
- 터치 타겟: primary CTA 48px, search orb 48×48, 날짜 셀 40×40, 하트 32×32(사진 내부 12px 패딩으로 보완)