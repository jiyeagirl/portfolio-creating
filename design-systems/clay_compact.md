<design-context>
---
version: alpha
name: Clay-design-analysis-compact

colors:
primary: "#0a0a0a"
brand-pink: "#ff4d8b"
brand-teal: "#1a3a3a"
brand-lavender: "#b8a4ed"
brand-peach: "#ffb084"
brand-ochre: "#e8b94a"
brand-mint: "#a4d4c5"
brand-coral: "#ff6b5a"
canvas: "#fffaf0"
surface-soft: "#faf5e8"
surface-card: "#f5f0e0"
surface-strong: "#ebe6d6"
surface-dark: "#0a1a1a"
surface-dark-elevated: "#1a2a2a"
hairline: "#e5e5e5"
ink: "#0a0a0a"
body-strong: "#1a1a1a"
body: "#3a3a3a"
muted: "#6a6a6a"
muted-soft: "#9a9a9a"
on-primary: "#ffffff"
on-dark: "#ffffff"
success: "#22c55e"
warning: "#f59e0b"
error: "#ef4444"

typography:
display-xl: { fontFamily: "Plain Black", fontSize: 72px, fontWeight: 500, lineHeight: 1.0, letterSpacing: -2.5px }
display-lg: { fontFamily: "Plain Black", fontSize: 56px, fontWeight: 500, lineHeight: 1.05, letterSpacing: -2px }
display-md: { fontFamily: "Plain Black", fontSize: 40px, fontWeight: 500, lineHeight: 1.1, letterSpacing: -1px }
display-sm: { fontFamily: "Plain Black", fontSize: 32px, fontWeight: 500, lineHeight: 1.15, letterSpacing: -0.5px }
title-lg: { fontFamily: "Inter", fontSize: 24px, fontWeight: 600, lineHeight: 1.3, letterSpacing: -0.3px }
title-md: { fontFamily: "Inter", fontSize: 18px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 }
title-sm: { fontFamily: "Inter", fontSize: 16px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 }
body-md: { fontFamily: "Inter", fontSize: 16px, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 }
body-sm: { fontFamily: "Inter", fontSize: 14px, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 }
caption: { fontFamily: "Inter", fontSize: 13px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 }
caption-uppercase: { fontFamily: "Inter", fontSize: 12px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 1.5px }
button: { fontFamily: "Inter", fontSize: 14px, fontWeight: 600, lineHeight: 1.0, letterSpacing: 0 }
nav-link: { fontFamily: "Inter", fontSize: 14px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 }

원본은 Plain Black(커스텀 라운드 디스플레이체) 지정이지만 CLAUDE.md 규칙상 항상 Pretendard로 대체함 (한글 서비스). display 계열은 Pretendard 500 -0.05em, body 계열은 Pretendard 400.

rounded:
xs: 6px
sm: 8px
md: 12px
lg: 16px
xl: 24px
pill: 9999px
full: 9999px

spacing:
xxs: 4px
xs: 8px
sm: 12px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
section: 96px

components:
top-nav: { bg: "{colors.canvas}", type: "{typography.nav-link}", height: 64px }
button-primary: { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button}", rounded: "{rounded.md}", padding: "12px 20px", height: 44px }
button-secondary: { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.hairline}", rounded: "{rounded.md}" }
button-on-color: { bg: "#ffffff", text: "{colors.ink}", rounded: "{rounded.md}" }
button-text-link: { bg: transparent, type: "{typography.button}" }
text-link: { text: "{colors.ink}", decoration: underline }
hero-band: { bg: "{colors.canvas}", grid: "7-5", padding: "{spacing.section}" }
hero-illustration-card: { bg: "{colors.surface-soft}", rounded: "{rounded.xl}", content: "3D claymation illustration" }
feature-card-pink: { bg: "{colors.brand-pink}", text: "{colors.on-dark}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
feature-card-teal: { bg: "{colors.brand-teal}", text: "{colors.on-dark}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
feature-card-lavender: { bg: "{colors.brand-lavender}", text: "{colors.ink}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
feature-card-peach: { bg: "{colors.brand-peach}", text: "{colors.ink}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
feature-card-ochre: { bg: "{colors.brand-ochre}", text: "{colors.ink}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
feature-card-cream: { bg: "{colors.surface-card}", text: "{colors.ink}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
product-mockup-card: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", rounded: "{rounded.lg}", padding: "{spacing.lg}" }
testimonial-card: { bg: "{colors.surface-card}", rounded: "{rounded.lg}", padding: "{spacing.lg}" }
pricing-tier-card: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", rounded: "{rounded.lg}", padding: "{spacing.xl}" }
pricing-tier-card-featured: { bg: "{colors.brand-teal}", text: "{colors.on-dark}", rounded: "{rounded.lg}", padding: "{spacing.xl}" }
expert-card: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", rounded: "{rounded.lg}", padding: "{spacing.lg}" }
text-input: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.body-md}", border: "1px solid {colors.hairline}", rounded: "{rounded.md}", padding: "12px 16px", height: 44px }
text-input-focused: { border: "1px solid {colors.ink}" }
category-tab: { bg: transparent, text: "{colors.muted}", rounded: "{rounded.pill}", padding: "8px 16px" }
category-tab-active: { bg: "{colors.surface-card}", text: "{colors.ink}", rounded: "{rounded.pill}", padding: "8px 16px" }
badge-pill: { bg: "{colors.surface-card}", type: "{typography.caption}", rounded: "{rounded.pill}" }
cta-band-illustrated: { bg: "{colors.surface-soft}", rounded: "{rounded.xl}", padding: 80px }
footer: { bg: "{colors.surface-soft}", text: "{colors.body}", columns: 4, padding: 80px }

핵심 규칙 (Do)
캔버스는 항상 크림틴트({colors.canvas} #fffaf0). 쿨그레이 금지.
피처카드는 pink→teal→lavender→peach→ochre→cream 순환. 같은 색 연속 배치 금지.
디스플레이 타이포는 항상 500 웨이트 + 네거티브 letter-spacing. 700 이상 금지.
7번째 브랜드 컬러 카드 추가 금지. 6색 팔레트로 고정.
피처카드 안에 실제 제품 UI 프래그먼트(에이전트 실행 로그, 시퀀서 플로우 등) 삽입.
푸터는 항상 크림({colors.surface-soft}), 다크 푸터 금지.
섹션 간격은 항상 {spacing.section}(96px) 고정.
클레이메이션 일러스트를 플랫 벡터로 대체 금지 — 손으로 빚은 듯한 3D가 브랜드 보이스.
그림자 없음. 크림 캔버스와 채도 높은 카드의 색 대비로만 깊이 표현.
hover 스타일 추가 금지(시스템에 명시된 것 외).

Breakpoints (요약)
< 768(Mobile) · 768-1024(Tablet) · 1024-1440(Desktop) · > 1440(Wide)

콘텐츠 최대폭 1280px 고정
히어로 타이포: 72px → 36px(Mobile)
피처카드 그리드: 3-up(Desktop) → 2-up(Tablet) → 1-up(Mobile)
프라이싱 그리드: 3-4up(Desktop) → 2up(Tablet) → 1up(Mobile)
터치 타겟 최소 44×44px
</design-context>