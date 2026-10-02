<design-context>
---
version: alpha
name: Wise-Inspired-design-analysis-compact

colors:
  primary: "#9fe870"
  primary-active: "#cdffad"
  primary-neutral: "#c5edab"
  primary-pale: "#e2f6d5"
  on-primary: "#0e0f0c"
  ink: "#0e0f0c"
  ink-deep: "#163300"
  body: "#454745"
  mute: "#868685"
  canvas: "#ffffff"
  canvas-soft: "#e8ebe6"
  positive: "#2ead4b"
  positive-deep: "#054d28"
  warning: "#ffd11a"
  warning-deep: "#b86700"
  warning-content: "#4a3b1c"
  negative: "#d03238"
  negative-deep: "#a72027"
  negative-darkest: "#a7000d"
  negative-bg: "#320707"
  accent-orange: "#ffc091"
  accent-cyan: "#38c8ff"

typography:
# Wise Sans(proprietary, weight 900)는 히어로 전용. 오픈소스 대체: Inter 900 또는 Manrope 800/900 (Geist 800도 차선).
# 서브디스플레이+본문은 Inter(weight 600)가 브랜드 실제 2nd 페이스.
  display-mega:  { fontFamily: "Wise Sans", fontSize: 126px, fontWeight: 900, lineHeight: 107.1px, letterSpacing: 0 }
  display-xxl:   { fontFamily: "Wise Sans", fontSize: 96px,  fontWeight: 900, lineHeight: 81.6px,  letterSpacing: 0 }
  display-xl:    { fontFamily: "Wise Sans", fontSize: 64px,  fontWeight: 900, lineHeight: 54.4px,  letterSpacing: 0 }
  display-lg:    { fontFamily: "Inter",     fontSize: 47px,  fontWeight: 400, lineHeight: 70.5px,  letterSpacing: -0.108px }
  display-md:    { fontFamily: "Wise Sans", fontSize: 40px,  fontWeight: 900, lineHeight: 34px,    letterSpacing: 0 }
  display-sm:    { fontFamily: "Inter",     fontSize: 32px,  fontWeight: 600, lineHeight: 38.4px,  letterSpacing: -0.96px }
  display-xs:    { fontFamily: "Inter",     fontSize: 24px,  fontWeight: 600, lineHeight: 31.2px,  letterSpacing: -0.48px }
  body-lg:       { fontFamily: "Inter", fontSize: 20px, fontWeight: 400, lineHeight: 30px }
  body-md:       { fontFamily: "Inter", fontSize: 16px, fontWeight: 400, lineHeight: 24px }
  body-md-strong:{ fontFamily: "Inter", fontSize: 16px, fontWeight: 600, lineHeight: 24px }
  body-sm:       { fontFamily: "Inter", fontSize: 14px, fontWeight: 400, lineHeight: 20px }
  body-sm-strong:{ fontFamily: "Inter", fontSize: 14px, fontWeight: 600, lineHeight: 20px }
  caption:       { fontFamily: "Inter", fontSize: 12px, fontWeight: 400, lineHeight: 16px }
  button-md:     { fontFamily: "Inter", fontSize: 16px, fontWeight: 600, lineHeight: 24px }

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  button-primary:        { bg: "{colors.primary}", text: "{colors.on-primary}", type: "{typography.button-md}", rounded: "{rounded.xl}", padding: "{spacing.md} {spacing.xl}" }
  button-secondary:       { bg: "{colors.canvas-soft}", text: "{colors.ink}", type: "{typography.button-md}", rounded: "{rounded.xl}", padding: "{spacing.md} {spacing.xl}" }
  button-tertiary:        { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.ink}", type: "{typography.button-md}", rounded: "{rounded.xl}", padding: "{spacing.md} {spacing.xl}" }
  button-icon-circular:   { bg: "{colors.canvas}", text: "{colors.ink}", rounded: "{rounded.full}" }
  card-content:           { bg: "{colors.canvas}", text: "{colors.ink}", padding: "{spacing.xl}", rounded: "{rounded.xl}" }
  card-feature-sage:      { bg: "{colors.canvas-soft}", text: "{colors.ink}", padding: "{spacing.xl}", rounded: "{rounded.xl}" }
  card-feature-green:     { bg: "{colors.primary-pale}", text: "{colors.ink}", padding: "{spacing.xl}", rounded: "{rounded.xl}" }
  card-feature-dark:      { bg: "{colors.ink}", text: "{colors.primary}", padding: "{spacing.xl}", rounded: "{rounded.xl}" }
  currency-converter-card:{ bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.ink}", padding: "{spacing.xl}", rounded: "{rounded.xl}" }
  text-input:             { bg: "{colors.canvas}", text: "{colors.ink}", border: "1px solid {colors.ink}", type: "{typography.body-md}", padding: "{spacing.md} {spacing.lg}", rounded: "{rounded.md}" }
  nav-bar:                { bg: "{colors.canvas}", text: "{colors.ink}", padding: "{spacing.md} {spacing.xl}" }
  nav-link:               { text: "{colors.ink}", type: "{typography.body-sm-strong}" }
  footer:                 { bg: "{colors.ink}", text: "{colors.canvas-soft}", type: "{typography.body-sm}", padding: "{spacing.3xl} {spacing.xl}" }
  hero-band:              { bg: "{colors.canvas-soft}", text: "{colors.ink}", type: "{typography.display-mega}", padding: "{spacing.3xl} {spacing.xl}" }
  hero-band-dark:         { bg: "{colors.ink}", text: "{colors.primary}", type: "{typography.display-mega}", padding: "{spacing.3xl} {spacing.xl}" }
  content-band:           { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.display-md}", padding: "{spacing.3xl} {spacing.xl}" }
  badge-positive:         { bg: "{colors.primary-pale}", text: "{colors.positive-deep}", type: "{typography.body-sm-strong}", padding: "{spacing.xs} {spacing.md}", rounded: "{rounded.pill}" }
  badge-negative:         { bg: "{colors.negative-bg}", text: "#ffffff", type: "{typography.body-sm-strong}", padding: "{spacing.xs} {spacing.md}", rounded: "{rounded.pill}" }

핵심 규칙 (Do)
- 액센트는 {colors.primary}(라임그린) 하나만, 모든 주요 CTA에 사용 — 세컨드 브랜드 컬러 금지.
- 히어로 헤드라인은 Wise Sans weight 900 고정(display-mega/xxl/xl/md) — 700 이하로 절대 낮추지 않기.
- Inter는 서브디스플레이(600)·본문·라벨 전용 — Wise Sans와 역할 절대 혼용 금지.
- 버튼·카드 radius는 {rounded.xl}(24px) 고정 — 브랜드 유일 시그니처 radius, 각진 사각형 금지.
- 페이지 표면은 canvas-soft(sage) → canvas(white) 순으로 밴드마다 순환, 표면 대비 자체가 elevation.
- 세만틱 팔레트(positive/warning/negative)는 상태 표시 전용 — Wise green을 success로 재사용 금지(브랜드 CTA와 충돌).
- Wise green CTA는 항상 중립 표면(sage/white/ink) 위에만, green-on-green 배치 금지.

Breakpoints (요약)
768(모바일→태블릿) · 1024(태블릿→데스크탑)
그리드: 데스크탑 2-up/3-up → 태블릿 2-up → 모바일 1-up
히어로: 데스크탑 split(헤드라인+컨버터 카드) → 모바일 stacked, 컨버터 카드 full-width

원본의 ex-* (illustrative examples, auto-derived) 섹션은 TO_FILL 마커 포함 참고용 파생 예시라 압축판에서 제외. 필요시 원본 wise.md 참고.