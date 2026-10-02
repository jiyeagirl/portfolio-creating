<design-context> --- version: alpha name: Vercel-Inspired-design-analysis-compact

colors: primary: "
#171717" on-primary: "
#ffffff" ink: "
#171717" body: "
#4d4d4d" mute: "
#888888" hairline: "
#ebebeb" hairline-strong: "
#a1a1a1" canvas: "
#ffffff" canvas-soft: "
#fafafa" canvas-soft-2: "
#f5f5f5" link: "
#0070f3" link-deep: "
#0761d1" link-bg-soft: "
#d3e5ff" success: "
#0070f3" error: "
#ee0000" error-soft: "
#f7d4d6" error-deep: "
#c50000" warning: "
#f5a623" warning-soft: "
#ffefcf" warning-deep: "
#ab570a" violet: "
#7928ca" cyan: "
#50e3c2" highlight-pink: "
#ff0080" gradient-develop-start: "
#007cf0" gradient-develop-end: "
#00dfd8" gradient-preview-start: "
#7928ca" gradient-preview-end: "
#ff0080" gradient-ship-start: "
#ff4d4d" gradient-ship-end: "
#f9cb28" selection-bg: "
#171717" selection-fg: "
#f2f2f2"

typography:

원본은 Geist(디스플레이/본문) + Geist Mono(코드) 조합.
CLAUDE.md 규칙상 Geist는 금지 폰트라 디스플레이/본문은 Pretendard로 대체.
코드/터미널용 모노스페이스(Geist Mono)는 UI 폰트 금지 규칙 대상이 아니므로 그대로 유지.

display-xl: { fontFamily: "Pretendard", fontSize: 48px, fontWeight: 600, lineHeight: 48px, letterSpacing: -2.4px } display-lg: { fontFamily: "Pretendard", fontSize: 32px, fontWeight: 600, lineHeight: 40px, letterSpacing: -1.28px } display-md: { fontFamily: "Pretendard", fontSize: 24px, fontWeight: 600, lineHeight: 32px, letterSpacing: -0.96px } display-sm: { fontFamily: "Pretendard", fontSize: 20px, fontWeight: 600, lineHeight: 28px, letterSpacing: -0.6px } body-lg: { fontFamily: "Pretendard", fontSize: 18px, fontWeight: 400, lineHeight: 28px } body-md: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 400, lineHeight: 24px } body-md-strong: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 24px } body-sm: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 400, lineHeight: 20px, letterSpacing: -0.28px } body-sm-strong: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 20px, letterSpacing: -0.28px } caption: { fontFamily: "Pretendard", fontSize: 12px, fontWeight: 400, lineHeight: 16px } caption-mono: { fontFamily: "Geist Mono, ui-monospace, monospace", fontSize: 12px, fontWeight: 400, lineHeight: 16px } code: { fontFamily: "Geist Mono, ui-monospace, monospace", fontSize: 13px, fontWeight: 400, lineHeight: 20px } button-md: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 20px } button-lg: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 24px }

rounded: none: 0px xs: 4px sm: 6px md: 8px lg: 12px xl: 16px pill-sm: 64px pill: 100px full: 9999px

spacing: xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px 2xl: 40px 3xl: 48px 4xl: 64px 5xl: 96px 6xl: 128px section: 192px

components: nav-bar: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-sm}", height: 64px, padding: "{spacing.sm} {spacing.lg}" } nav-link: { text: "{colors.body}", type: "{typography.body-sm}", rounded: "{rounded.full}", padding: "{spacing.xs} {spacing.sm}" } nav-cta-signup: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.body-sm-strong}", rounded: "{rounded.sm}", padding: "0 {spacing.xs}", height: 28px } nav-cta-login: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-sm-strong}", rounded: "{rounded.sm}", padding: "0 {spacing.xs}", height: 28px } nav-cta-ask-ai: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.hairline}", type: "{typography.body-sm-strong}", rounded: "{rounded.sm}", padding: "0 {spacing.xs}", height: 28px } button-primary: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button-lg}", rounded: "{rounded.pill}", padding: "0 {spacing.sm}" } button-secondary: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.button-lg}", rounded: "{rounded.pill}", padding: "0 {spacing.sm}" } button-primary-sm: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button-md}", rounded: "{rounded.pill}", padding: "0 {spacing.xs}" } button-secondary-sm: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.button-md}", rounded: "{rounded.pill}", padding: "0 {spacing.xs}" } tab-ghost: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-sm}", rounded: "{rounded.pill-sm}", padding: "0 {spacing.md}" } icon-button-circular: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.hairline}", rounded: "{rounded.full}" } card-marketing: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-md}", rounded: "{rounded.md}", padding: "{spacing.lg}", shadow: "level3" } card-marketing-large: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-md}", rounded: "{rounded.lg}", padding: "{spacing.xl}", shadow: "level4" } card-soft: { bg: "{colors.canvas-soft}", text: "{colors.ink}", type: "{typography.body-md}", rounded: "{rounded.md}", padding: "{spacing.lg}" } template-card: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-md}", rounded: "{rounded.md}", padding: "{spacing.md}" } code-editor-mockup: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.code}", rounded: "{rounded.md}", padding: "{spacing.lg}" } form-input: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.hairline}", type: "{typography.body-sm}", rounded: "{rounded.sm}", padding: "0 {spacing.sm}", height: 40px } form-input-sm: { height: 32px } form-input-lg: { height: 48px, type: "{typography.body-md}" } badge-secondary: { bg: "{colors.canvas-soft}", text: "{colors.body}", type: "{typography.caption}", rounded: "{rounded.full}", padding: "0 {spacing.xs}" } pricing-card: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-md}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } pricing-card-featured: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.body-md}", rounded: "{rounded.lg}", padding: "{spacing.xl}" } logo-strip: { bg: "{colors.canvas}", text: "{colors.body}", type: "{typography.body-sm}", padding: "{spacing.lg} {spacing.xl}" } hero-band: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.display-xl}", padding: "{spacing.4xl} {spacing.lg}" } feature-mesh-band: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.display-lg}", padding: "{spacing.5xl} {spacing.lg}" } showcase-band-light: { bg: "{colors.canvas-soft}", text: "{colors.ink}", type: "{typography.display-lg}", padding: "{spacing.5xl} {spacing.lg}" } showcase-band-dark: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.display-lg}", padding: "{spacing.5xl} {spacing.lg}" } footer: { bg: "{colors.canvas}", text: "{colors.body}", type: "{typography.body-sm}", padding: "{spacing.4xl} {spacing.lg}" } link-inline: { text: "{colors.link}", type: "{typography.body-md}" } banner-marketing: { bg: "{colors.canvas-soft}", text: "{colors.body}", type: "{typography.body-sm}", rounded: "{rounded.full}", padding: "{spacing.xs} {spacing.sm}" }
핵심 규칙 (Do)
액센트는 {colors.primary}(잉크 블랙) 하나만, 모든 주요 CTA에 사용.
브랜드 메시 그라데이션(develop/preview/ship 3쌍)은 히어로 스케일에서만, 절대 아이콘 크기로 축소하거나 단색으로 자르지 않기.
헤드라인은 문장체(Sentence case), 마침표로 끝내는 경우 많음, 항상 강한 음수 letter-spacing.
폰트 굵기 천장은 600 — 700/800 절대 사용 금지.
그림자는 여러 겹 쌓은 미세한 스택(예: 0 1px 1px rgba(0,0,0,.02), 0 2px 2px rgba(0,0,0,.04) + inset hairline). 단일 두꺼운 drop-shadow 금지.
페이지 표면은 canvas-soft → canvas → primary(다크 반전) 순으로 밴드마다 순환.
코드블록/터미널/섹션 eyebrow는 항상 모노스페이스(code, caption-mono), 본문은 절대 모노 금지.
pill 스케일 두 가지: 마케팅 CTA는 {rounded.pill}(100px), 네비 버튼은 {rounded.sm}(6px) — 한 화면에서 섞어 쓰지 않기.
Breakpoints (요약)

600(모바일) · 960(태블릿→데스크탑) · 1200(와이드) · 1400(콘텐츠 고정)

3-up 그리드: 데스크탑 3 → 태블릿 2 → 모바일 1
템플릿 그리드: 5 → 3 → 2 → 1
프라이싱: 3-up, featured 카드 항상 가운데 유지(모바일은 세로 스택)

원본의 ex-* (illustrative examples, auto-derived) 섹션은 TO_FILL 마커가 포함된 참고용 파생 예시라 압축판에서 제외했다.