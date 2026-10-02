<design-context> --- version: alpha name: Claude-design-analysis-compact

colors: primary: "
#cc785c" primary-active: "
#a9583e" primary-disabled: "
#e6dfd8" ink: "
#141413" body: "
#3d3d3a" body-strong: "
#252523" muted: "
#6c6a64" muted-soft: "
#8e8b82" hairline: "
#e6dfd8" hairline-soft: "
#ebe6df" canvas: "
#faf9f5" surface-soft: "
#f5f0e8" surface-card: "
#efe9de" surface-cream-strong: "
#e8e0d2" surface-dark: "
#181715" surface-dark-elevated: "
#252320" surface-dark-soft: "
#1f1e1b" on-primary: "
#ffffff" on-dark: "
#faf9f5" on-dark-soft: "
#a09d96" accent-teal: "
#5db8a6" accent-amber: "
#e8a55a" success: "
#5db872" warning: "
#d4a017" error: "
#c64545"

typography:

원본은 display=Copernicus(세리프) / body=StyreneB(산세리프) 이원 구조지만
CLAUDE.md 규칙상 항상 Pretendard로 대체함 (한글 서비스, 세리프체 미보유).
weight/size/tracking 값만 그대로 가져와 위계만 재현한다.

display-xl: { fontFamily: "Pretendard", fontSize: 64px, fontWeight: 400, lineHeight: 1.05, letterSpacing: -1.5px } display-lg: { fontFamily: "Pretendard", fontSize: 48px, fontWeight: 400, lineHeight: 1.1, letterSpacing: -1px } display-md: { fontFamily: "Pretendard", fontSize: 36px, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5px } display-sm: { fontFamily: "Pretendard", fontSize: 28px, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.3px } title-lg: { fontFamily: "Pretendard", fontSize: 22px, fontWeight: 500, lineHeight: 1.3, letterSpacing: 0 } title-md: { fontFamily: "Pretendard", fontSize: 18px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 } title-sm: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 } body-md: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 } body-sm: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 } caption: { fontFamily: "Pretendard", fontSize: 13px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 } caption-uppercase: { fontFamily: "Pretendard", fontSize: 12px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 1.5px } code: { fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 14px, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0 } button: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 1.0, letterSpacing: 0 } nav-link: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 }

rounded: xs: 4px sm: 6px md: 8px lg: 12px xl: 16px pill: 9999px full: 9999px

spacing: xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px

components: button-primary: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button}", rounded: "{rounded.md}", padding: "12px 20px", height: 40px, active-bg: "{colors.primary-active}" } button-secondary: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.button}", rounded: "{rounded.md}", padding: "12px 20px", height: 40px, border: "1px solid {colors.hairline}" } button-secondary-on-dark: { bg: "{colors.surface-dark-elevated}", text: "{colors.on-dark}", type: "{typography.button}", rounded: "{rounded.md}", padding: "12px 20px" } button-text-link: { bg: transparent, text: "{colors.ink}", type: "{typography.button}" } button-icon-circular: { bg: "{colors.canvas}", text: "{colors.ink}", rounded: "{rounded.full}", size: 36px, border: "1px solid {colors.hairline}" } text-link: { text: "{colors.primary}", type: "{typography.body-md}" } top-nav: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.nav-link}", height: 64px } hero-band: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.display-xl}", padding: "{spacing.section}" } hero-illustration-card: { bg: "{colors.canvas} 또는 {colors.surface-dark}", rounded: "{rounded.xl}" } feature-card: { bg: "{colors.surface-card}", text: "{colors.ink}", type: "{typography.title-md}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } product-mockup-card-dark: { bg: "{colors.surface-dark}", text: "{colors.on-dark}", type: "{typography.title-md}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } code-window-card: { bg: "{colors.surface-dark}", inner-bg: "{colors.surface-dark-soft}", text: "{colors.on-dark}", type: "{typography.code}", rounded: "{rounded.lg}", padding: "{spacing.lg}" } model-comparison-card: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", text: "{colors.ink}", type: "{typography.title-md}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } pricing-tier-card: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", text: "{colors.ink}", type: "{typography.title-lg}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } pricing-tier-card-featured: { bg: "{colors.surface-dark}", text: "{colors.on-dark}", type: "{typography.title-lg}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } callout-card-coral: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.title-md}", rounded: "{rounded.lg}", padding: "{spacing.xxl}" } connector-tile: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", text: "{colors.ink}", type: "{typography.title-sm}", rounded: "{rounded.lg}", padding: 20px } text-input: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-md}", border: "1px solid {colors.hairline}", rounded: "{rounded.md}", padding: "10px 14px", height: 40px } text-input-focused: { border: "{colors.primary} + 3px coral@15% ring" } cookie-consent-card: { bg: "{colors.surface-dark}", text: "{colors.on-dark}", type: "{typography.body-sm}", rounded: "{rounded.lg}", padding: "{spacing.lg}" } category-tab: { bg: transparent, text: "{colors.muted}", type: "{typography.nav-link}", padding: "8px 14px", rounded: "{rounded.md}" } category-tab-active: { bg: "{colors.surface-card}", text: "{colors.ink}", type: "{typography.nav-link}", rounded: "{rounded.md}" } badge-pill: { bg: "{colors.surface-card}", text: "{colors.ink}", type: "{typography.caption}", rounded: "{rounded.pill}", padding: "4px 12px" } badge-coral: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.caption-uppercase}", rounded: "{rounded.pill}", padding: "4px 12px" } cta-band-coral: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.display-sm}", rounded: "{rounded.lg}", padding: 64px } cta-band-dark: { bg: "{colors.surface-dark}", text: "{colors.on-dark}", type: "{typography.display-sm}", rounded: "{rounded.lg}", padding: 64px } footer: { bg: "{colors.surface-dark}", text: "{colors.on-dark-soft}", type: "{typography.body-sm}", padding: 64px }
핵심 규칙 (Do)
캔버스는 항상 따뜻한 크림({colors.canvas} 
#faf9f5), 순백/쿨그레이 사용 금지.
코랄({colors.primary})은 개별 요소엔 아껴 쓰고, full-bleed 콜아웃 카드(callout-card-coral, cta-band-coral)에만 과감하게.
헤드라인은 항상 weight 400 (bold 금지). 본문 라벨은 weight 500.
크림(라이트) ↔ 다크 네이비(surface-dark) 표면을 밴드마다 번갈아 배치 — 이 색 전환 자체가 페이지 리듬.
코드/터미널 UI는 실제 제품 크롬(code-window-card)으로 보여준다 — 추상적인 마케팅 일러스트 대체 금지.
그림자는 최소화, 표면색 대비로 위계를 표현 (섀도우 쓸 땐 0 1px 3px rgba(20,20,19,.08) 정도로 아주 미세하게).
같은 표면 모드(크림/다크)를 연속 두 밴드에 반복하지 않는다.
radius 위계: md=버튼/인풋/탭, lg=콘텐츠 카드, xl=히어로 일러스트 컨테이너, pill=배지.
Breakpoints (요약)

768(모바일↔태블릿) · 1024(태블릿↔데스크탑) · 1440(와이드)

히어로 타이포: 64px → 32px(모바일)
카드 그리드: feature 3→2→1 · connector 4~6→3→2 · pricing 3→2→1
터치 타겟: 버튼 40×40 최소, 아이콘 원형 버튼 36×36