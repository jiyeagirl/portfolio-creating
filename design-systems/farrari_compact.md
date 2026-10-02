---
version: alpha
name: Ferrari-design-analysis-compact
---

colors:
  primary: "#da291c"
  primary-active: "#b01e0a"
  primary-hover: "#9d2211"
  accent-yellow-hypersail: "#fff200"
  accent-yellow: "#f6e500"
  canvas: "#181818"
  canvas-elevated: "#303030"
  canvas-light: "#ffffff"
  surface-card: "#303030"
  surface-soft-light: "#f7f7f7"
  surface-strong-light: "#ebebeb"
  hairline: "#303030"
  hairline-on-light: "#d2d2d2"
  hairline-soft: "#ebebeb"
  ink: "#ffffff"
  body: "#969696"
  body-strong: "#ffffff"
  body-on-light: "#181818"
  muted: "#666666"
  muted-soft: "#8f8f8f"
  on-primary: "#ffffff"
  semantic-info: "#4c98b9"
  semantic-success: "#03904a"
  semantic-warning: "#f13a2c"

typography:
  display-mega: { fontFamily: "Pretendard", fontSize: 80px, fontWeight: 500, lineHeight: 1.05, letterSpacing: -1.6px }
  display-xl: { fontFamily: "Pretendard", fontSize: 56px, fontWeight: 500, lineHeight: 1.1, letterSpacing: -1.12px }
  display-lg: { fontFamily: "Pretendard", fontSize: 36px, fontWeight: 500, lineHeight: 1.2, letterSpacing: -0.36px }
  display-md: { fontFamily: "Pretendard", fontSize: 26px, fontWeight: 500, lineHeight: 1.5, letterSpacing: 0.195px }
  title-md: { fontFamily: "Pretendard", fontSize: 18px, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0 }
  title-sm: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0.08px }
  body-md: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 }
  body-sm: { fontFamily: "Pretendard", fontSize: 13px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 }
  caption: { fontFamily: "Pretendard", fontSize: 12px, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0 }
  caption-uppercase: { fontFamily: "Pretendard", fontSize: 11px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 1.1px, textTransform: uppercase }
  button: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 700, lineHeight: 1.0, letterSpacing: 1.4px, textTransform: uppercase }
  nav-link: { fontFamily: "Pretendard", fontSize: 13px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.65px, textTransform: uppercase }
  number-display: { fontFamily: "Pretendard", fontSize: 80px, fontWeight: 700, lineHeight: 1.0, letterSpacing: -1.6px }

> 원본은 FerrariSans(라이선스 폰트) 지정이며 문서상 대체 폰트는 Inter 500이지만, CLAUDE.md 규칙상 항상 Pretendard로 대체함 (한글 서비스)

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px

spacing:
  xxxs: 4px
  xxs: 8px
  xs: 16px
  sm: 24px
  md: 32px
  lg: 48px
  xl: 64px
  xxl: 96px
  super: 128px

components:
  top-nav-on-dark: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.nav-link}", height: 64px }
  top-nav-on-light: { bg: "{colors.canvas-light}", text: "{colors.body-on-light}", type: "{typography.nav-link}", height: 64px }
  button-primary: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button}", rounded: "{rounded.none}", padding: "14px 32px", height: 48px }
  button-primary-active: { bg: "{colors.primary-active}" }
  button-outline-on-dark: { bg: transparent, text: "{colors.ink}", border: "1px solid {colors.ink}", type: "{typography.button}", rounded: "{rounded.none}", padding: "14px 32px", height: 48px }
  button-outline-on-light: { bg: transparent, text: "{colors.body-on-light}", border: "1px solid {colors.body-on-light}", rounded: "{rounded.none}", padding: "14px 32px", height: 48px }
  button-tertiary-text: { bg: transparent, text: "{colors.ink}", type: "{typography.button}" }
  hero-band-cinema: { bg: "{colors.canvas}", image: full-bleed-photo, text: "{colors.ink}", type: "{typography.display-mega}", rounded: "{rounded.none}", padding: 0 }
  hero-band-light: { bg: "{colors.canvas-light}", text: "{colors.body-on-light}", type: "{typography.display-xl}", rounded: "{rounded.none}", padding: "{spacing.xxl}" }
  feature-card-photo: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.title-md}", rounded: "{rounded.none}", image: top-edge-to-edge }
  feature-card-light: { bg: "{colors.canvas-light}", text: "{colors.body-on-light}", rounded: "{rounded.none}", padding: "{spacing.md}" }
  driver-card: { bg: "{colors.canvas-elevated}", text: "{colors.ink}", rounded: "{rounded.none}", padding: "{spacing.sm}" }
  livery-band: { bg: "{colors.primary}", text: "{colors.ink}", type: "{typography.display-lg}", rounded: "{rounded.none}", padding: "{spacing.xxl}" }
  preowned-listing-card: { bg: "{colors.canvas-light}", text: "{colors.body-on-light}", rounded: "{rounded.none}", padding: "{spacing.sm}" }
  spec-cell: { bg: transparent, value: "{typography.number-display}", valueColor: "{colors.ink}", label: "{typography.caption-uppercase}" }
  race-position-cell: { bg: transparent, value: "{typography.number-display}", valueColor: "{colors.primary}", label: "{typography.caption-uppercase}" }
  race-calendar-row: { bg: transparent, text: "{colors.body}", type: "{typography.body-md}", borderBottom: "1px solid {colors.hairline}" }
  text-input-on-dark: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.hairline}", rounded: "{rounded.sm}", padding: "14px 16px", height: 48px }
  text-input-on-light: { bg: "{colors.canvas-light}", text: "{colors.body-on-light}", border: "1px solid {colors.hairline-on-light}", rounded: "{rounded.sm}", padding: "14px 16px", height: 48px }
  badge-pill: { bg: "{colors.canvas-elevated}", text: "{colors.ink}", type: "{typography.caption-uppercase}", rounded: "{rounded.full}", padding: "4px 12px" }
  newsletter-input-band: { bg: "{colors.canvas-elevated}", rounded: "{rounded.sm}", padding: "{spacing.md}" }
  cta-band-dark: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.display-lg}", align: center, padding: "{spacing.xxl}" }
  footer-dark: { bg: "{colors.canvas}", text: "{colors.body}", type: "{typography.body-sm}", padding: "64px 48px" }
  footer-link: { bg: transparent, text: "{colors.body}", type: "{typography.body-sm}" }

## 핵심 규칙 (Do)

- 액센트는 `{colors.primary}` Rosso Corsa 단 하나. 사용처는 **primary CTA / Cavallino 마크 / F1 순위 하이라이트**뿐이며 아껴 쓴다.
- 캔버스는 순수 검정 금지. `{colors.canvas}` #181818(살짝 따뜻한 근사 검정)이 페이지 바닥. 흰 밴드는 preowned·pricing 같은 에디토리얼 문맥에서만.
- CTA·카드·밴드는 전부 `{rounded.none}` (0px 샤프). 알약 형태는 `badge-pill` 하나만 예외.
- display는 항상 weight 500. **절대 bold 금지** — 시각적 무게는 시네마틱 사진이 담당.
- CTA는 uppercase + 1.4px 트래킹(`{typography.button}`), 내비는 uppercase + 0.65px 트래킹.
- 네거티브 자간은 display 전용(-0.36 ~ -1.6px). 본문은 0 유지.
- 히어로에는 반드시 full-bleed 시네마틱 사진 — 사진 자체가 깊이이자 페이지 크롬. 히어로 padding 0.
- 그림자 단계 만들지 않기. 딱 하나 `0 4px 8px rgba(0,0,0,.1)` (카드 hover)만 허용, 나머지는 밝기 단계(#181818 → #303030 → #ffffff)로 표현.
- 그라데이션은 2개만: 브랜드 레드 `linear-gradient(180deg,#a00c01,#da291c 64%)`, 다크 그레이 `linear-gradient(180deg,#3c3c3c,#030303 64%)`.
- 여백은 8px 네이밍 사다리(xxxs~super)만 사용, 임의 px 금지. 주요 밴드 96px, 히어로 128px.
- Hypersail 옐로우는 세일링 프로그램 문맥 + 포커스 링 외 사용 금지.
- 서드파티 위젯(쿠키 배너 등)에서 CTA 색을 추출하지 않기.
- hover 상태는 문서화하지 않음(no-hover 정책). active만 정의.

## Breakpoints (요약)

1280+(에디토리얼 1280px 캡, 히어로는 계속 full-bleed) · 1024–1280(데스크탑) · 640–1024(태블릿) · <640(모바일)

- 히어로 h1: 80px → 56px(태블릿) → 32px(모바일)
- 피처 카드 그리드: 4col → 3col → 2col → 1col
- preowned 리스팅: 4col → 2col(태블릿) → 1col(모바일)
- F1 드라이버 카드: 2col(데스크탑) → 1col(모바일)
- 768px 미만에서 상단 내비 → 햄버거
- 히어로 사진은 아트디렉션으로 리프레임(데스크탑 와이드 / 모바일 세로 크롭)
- 터치 타겟: primary CTA 48px 높이 (WCAG AAA 44×44 충족)