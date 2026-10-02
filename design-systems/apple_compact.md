<design-context> --- version: alpha name: Apple-design-analysis-compact

colors: primary: "
#0066cc" primary-focus: "
#0071e3" primary-on-dark: "
#2997ff" ink: "
#1d1d1f" body: "
#1d1d1f" body-on-dark: "
#ffffff" body-muted: "
#cccccc" ink-muted-80: "
#333333" ink-muted-48: "
#7a7a7a" divider-soft: "
#f0f0f0" hairline: "
#e0e0e0" canvas: "
#ffffff" canvas-parchment: "
#f5f5f7" surface-pearl: "
#fafafc" surface-tile-1: "
#272729" surface-tile-2: "
#2a2a2c" surface-tile-3: "
#252527" surface-black: "
#000000" surface-chip-translucent: "
#d2d2d7" on-primary: "
#ffffff" on-dark: "
#ffffff"

typography: hero-display: { fontFamily: "Pretendard", fontSize: 56px, fontWeight: 600, lineHeight: 1.07, letterSpacing: -0.28px } display-lg: { fontFamily: "Pretendard", fontSize: 40px, fontWeight: 600, lineHeight: 1.1, letterSpacing: 0 } display-md: { fontFamily: "Pretendard", fontSize: 34px, fontWeight: 600, lineHeight: 1.47, letterSpacing: -0.374px } lead: { fontFamily: "Pretendard", fontSize: 28px, fontWeight: 400, lineHeight: 1.14, letterSpacing: 0.196px } lead-airy: { fontFamily: "Pretendard", fontSize: 24px, fontWeight: 300, lineHeight: 1.5, letterSpacing: 0 } tagline: { fontFamily: "Pretendard", fontSize: 21px, fontWeight: 600, lineHeight: 1.19, letterSpacing: 0.231px } body-strong: { fontFamily: "Pretendard", fontSize: 17px, fontWeight: 600, lineHeight: 1.24, letterSpacing: -0.374px } body: { fontFamily: "Pretendard", fontSize: 17px, fontWeight: 400, lineHeight: 1.47, letterSpacing: -0.374px } dense-link: { fontFamily: "Pretendard", fontSize: 17px, fontWeight: 400, lineHeight: 2.41, letterSpacing: 0 } caption: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 1.43, letterSpacing: -0.224px } caption-strong: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 600, lineHeight: 1.29, letterSpacing: -0.224px } button-large: { fontFamily: "Pretendard", fontSize: 18px, fontWeight: 300, lineHeight: 1.0, letterSpacing: 0 } button-utility: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 1.29, letterSpacing: -0.224px } fine-print: { fontFamily: "Pretendard", fontSize: 12px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -0.12px } micro-legal: { fontFamily: "Pretendard", fontSize: 10px, fontWeight: 400, lineHeight: 1.3, letterSpacing: -0.08px } nav-link: { fontFamily: "Pretendard", fontSize: 12px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -0.12px }

원본은 SF Pro Display/Text 지정이지만 CLAUDE.md 규칙상 항상 Pretendard로 대체함 (한글 서비스)

rounded: none: 0px xs: 5px sm: 8px md: 11px lg: 18px pill: 9999px full: 9999px

spacing: xxs: 4px xs: 8px sm: 12px md: 17px lg: 24px xl: 32px xxl: 48px section: 80px

components: button-primary: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.body}", rounded: "{rounded.pill}", padding: "11px 22px", active: "scale(0.95)", focus: "2px solid {colors.primary-focus}" } button-secondary-pill: { bg: transparent, text: "{colors.primary}", border: "1px solid {colors.primary}", rounded: "{rounded.pill}", padding: "11px 22px" } button-dark-utility: { bg: "{colors.ink}", text: "{colors.on-dark}", type: "{typography.button-utility}", rounded: "{rounded.sm}", padding: "8px 15px" } button-pearl-capsule: { bg: "{colors.surface-pearl}", text: "{colors.ink-muted-80}", type: "{typography.caption}", border: "3px solid {colors.divider-soft}", rounded: "{rounded.md}", padding: "8px 14px" } button-store-hero: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button-large}", rounded: "{rounded.pill}", padding: "14px 28px" } button-icon-circular: { bg: "{colors.surface-chip-translucent}@64%", text: "{colors.ink}", rounded: "{rounded.full}", size: 44px } text-link: { text: "{colors.primary}", type: "{typography.body}" } text-link-on-dark: { text: "{colors.primary-on-dark}", type: "{typography.body}" } global-nav: { bg: "{colors.surface-black}", text: "{colors.on-dark}", type: "{typography.nav-link}", height: 44px } sub-nav-frosted: { bg: "{colors.canvas-parchment}@80%+blur", text: "{colors.ink}", type: "{typography.tagline}", height: 52px } product-tile-light: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.display-lg}", rounded: "{rounded.none}", padding: "{spacing.section}" } product-tile-parchment: { bg: "{colors.canvas-parchment}", text: "{colors.ink}", rounded: "{rounded.none}", padding: "{spacing.section}" } product-tile-dark: { bg: "{colors.surface-tile-1}", text: "{colors.on-dark}", rounded: "{rounded.none}", padding: "{spacing.section}" } product-tile-dark-2: { bg: "{colors.surface-tile-2}", text: "{colors.on-dark}", rounded: "{rounded.none}" } product-tile-dark-3: { bg: "{colors.surface-tile-3}", text: "{colors.on-dark}", rounded: "{rounded.none}" } store-utility-card: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.hairline}", rounded: "{rounded.lg}", padding: "{spacing.lg}" } configurator-option-chip: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.caption}", rounded: "{rounded.pill}", padding: "12px 16px" } configurator-option-chip-selected: { border: "2px solid {colors.primary-focus}" } search-input: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body}", border: "1px solid rgba(0,0,0,.08)", rounded: "{rounded.pill}", padding: "12px 20px", height: 44px } floating-sticky-bar: { bg: "{colors.canvas-parchment}@80%+blur", height: 64px, padding: "12px 32px" } environment-quote-card: { bg: "{colors.surface-tile-1}", text: "{colors.on-dark}", type: "{typography.display-lg}", rounded: "{rounded.none}", padding: "{spacing.section}" } footer: { bg: "{colors.canvas-parchment}", text: "{colors.ink-muted-80}", type: "{typography.fine-print}", padding: 64px }
핵심 규칙 (Do)
액센트는 {colors.primary} 단 하나만. 다른 브랜드 컬러 추가 금지.
그림자는 시스템 전체에서 딱 하나: rgba(0,0,0,.22) 3px 5px 30px — 제품 이미지에만 사용, 카드/버튼/텍스트엔 금지.
그라데이션 없음. 장식적 배경 그라데이션 절대 금지.
폰트 굵기 사다리: 300 / 400 / 600 / 700만 사용, 500은 절대 없음. 본문은 항상 400.
full-bleed 타일은 라운드 0 ({rounded.none}), 색 전환 자체가 섹션 구분선 역할.
radius 문법: sm=유틸리티 버튼, lg=카드, pill=액션(버튼/인풋/칩), 그 외 섞지 않기.
버튼 active 상태는 공통으로 transform: scale(0.95).
다크 타일에서 인라인 링크는 text-link-on-dark(Sky Blue) 사용, text-link(Action Blue)는 라이트 표면 전용.
Breakpoints (요약)

1440(콘텐츠 고정) · 1068(스몰데스크탑) · 833(태블릿 가로) · 734(태블릿 세로) · 640(폰) · 480(스몰폰)

히어로 타이포: 56px → 40px(1068) → 34px(640) → 28px(419)
유틸리티 그리드: 5col → 4col(1440) → 3col(1068) → 2col(834) → 1col(640)
터치 타겟 최소 44×44px