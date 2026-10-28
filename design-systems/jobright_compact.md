---
version: alpha
name: Jobright-design-analysis-compact
---

colors:
  primary: "#00f0a0"
  on-primary: "#000000"
  canvas: "#ffffff"
  canvas-mint: "#ecffe0"
  surface-soft: "#f2f4f5"
  hairline: "#e5e7eb"
  ink: "#000000"
  muted: "#86909c"
  on-dark: "#ffffff"
  inset-line: "rgba(0,0,0,0.5)"

typography:
  display: { fontFamily: "Pretendard", fontSize: 80px, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1px }
  heading-1: { fontFamily: "Pretendard", fontSize: 60px, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.5px }
  heading-2: { fontFamily: "Pretendard", fontSize: 48px, fontWeight: 700, lineHeight: 1.15, letterSpacing: 0 }
  heading-3: { fontFamily: "Pretendard", fontSize: 38px, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0 }
  heading-4: { fontFamily: "Pretendard", fontSize: 32px, fontWeight: 600, lineHeight: 1.25, letterSpacing: 0 }
  body-lg: { fontFamily: "Pretendard", fontSize: 18px, fontWeight: 300, lineHeight: 1.6, letterSpacing: 0 }
  body-md: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 500, lineHeight: 1.6, letterSpacing: 0 }
  body-sm: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 500, lineHeight: 1.5, letterSpacing: 0 }
  button: { fontFamily: "Pretendard", fontSize: 16px, fontWeight: 600, lineHeight: 1, letterSpacing: 0 }
  nav-link: { fontFamily: "Pretendard", fontSize: 14px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 }
  caption: { fontFamily: "Pretendard", fontSize: 13px, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0 }

> 원본은 display에 Titillium Web(굵은 콘덴스드), 본문과 UI에 Inter 지정이지만, CLAUDE.md 규칙상 항상 Pretendard로 대체함 (한글 서비스). 헤드라인과 본문의 대비는 weight 차이(700 대 300~500)로 유지함

rounded:
  sm: 12px
  md: 16px
  lg: 24px
  cta: 28px
  nav: 18px
  pill: 36px
  card: 40px
  full: 9999px

> 원본 표에 `rounded.lg`가 24px, 28px로 중복 표기됨. 24px는 lg(콘텐츠 카드), 28px는 cta(대형 블랙 필)로 분리함

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

elevation:
  flat: "none 또는 1px solid {colors.hairline}"
  hairline: "{colors.inset-line} 0 0 0 0.5px inset"
  soft-float: "rgba(0,0,0,0.06) 0 4px 16px 0"

> soft-float 수치는 원본에 없음("whisper-soft"로만 기술). 위 값은 근사치로 둔 것임

components:
  nav-bar: { bg: "{colors.canvas}", text: "{colors.ink}", type: "{typography.nav-link}", padding: "{spacing.md}", layout: "로고 좌, 링크 중앙, Sign In + {component.button-primary-sm} 우" }
  button-primary: { bg: "{colors.ink}", text: "{colors.on-dark}", type: "{typography.button}", rounded: "{rounded.cta}", padding: "12px 96px" }
  button-primary-sm: { bg: "{colors.ink}", text: "{colors.on-dark}", type: "{typography.nav-link}", rounded: "{rounded.nav}", padding: "4px 16px" }
  button-green: { bg: "{colors.primary}", text: "{colors.on-primary}", border: "1px solid {colors.ink}", type: "{typography.button}", rounded: "{rounded.pill}", padding: "12px 48px" }
  button-dark-square: { bg: "{colors.ink}", text: "{colors.on-dark}", type: "{typography.button}", rounded: "{rounded.sm}", padding: "12px 16px" }
  hero: { bg: "{colors.canvas-mint}", headline: "{typography.display}", padding: "{spacing.section}", media: "{component.video-card}", cta: "{component.button-primary}" }
  video-card: { bg: "{colors.canvas}", border: "1px solid {colors.ink}", rounded: "{rounded.md}" }
  stat-item: { bg: "{colors.canvas-mint}", value: "{typography.heading-3}", valueColor: "{colors.ink}", label: "{typography.caption}", icon: line-small }
  job-ticker: { bg: "{colors.ink}", text: "{colors.on-dark}", type: "{typography.body-sm}", padding: "{spacing.md}", motion: marquee-loop, mark: "{colors.primary}" }
  feature-band: { bg: "{colors.canvas-mint}", headline: "{typography.heading-2}", padding: "{spacing.section}", grid: "2col (카피 + CTA / feature-card), 행마다 좌우 교차" }
  feature-card: { bg: "{colors.canvas}", type: "{typography.body-md}", rounded: "0 40px 40px 40px", padding: "{spacing.lg}", shadow: "{elevation.soft-float}" }
  score-ring: { bg: "{colors.canvas}", value: "{typography.heading-4}", valueColor: "{colors.primary}", rounded: "{rounded.full}", size: 64px }
  testimonial-card: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", rounded: "{rounded.lg}", padding: "{spacing.lg}", grid: 3col, parts: "아바타, 이름, 인용문" }
  testimonial-band-dark: { bg: "{colors.ink}", quote: "{typography.heading-4}", text: "{colors.on-dark}", padding: "{spacing.section}", parts: "아바타, 직함" }
  faq-item: { bg: "{colors.canvas-mint}", question: "{typography.body-md}", text: "{colors.ink}", divider: "1px solid {colors.hairline}", padding: "{spacing.md}", toggle: plus }
  cta-band: { bg: "{colors.canvas-mint}", headline: "{typography.heading-2}", padding: "{spacing.section}", cta: "{component.button-green}", ornament: hand-drawn-illust }
  text-input: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", text: "{colors.ink}", type: "{typography.body-md}", rounded: "{rounded.sm}", padding: "12px 16px" }
  job-search-bar: { bg: "{colors.canvas}", border: "1px solid {colors.hairline}", rounded: "{rounded.full}", padding: "8px 16px", parts: "셀렉트 3개(Work Model, Location, Experience) + 제출" }
  footer: { bg: "{colors.canvas}", link: "{typography.body-sm}", linkColor: "{colors.muted}", padding: "{spacing.section}", columns: multi, top: "{component.job-search-bar}" }

## 핵심 규칙 (Do)

- 액센트는 `{colors.primary}` 스프링 민트 단 하나. 사용처는 **로고 / 링크 / 그린 필 버튼 / 점수와 하이라이트**뿐임. 나머지는 민트 밴드, 화이트, 블랙으로만 구성함
- 페이지 리듬은 밴드 교차로 만듦. 민트 히어로 > 민트 통계 > 화이트 잡허브 > 블랙 티커 > 민트 기능 밴드(반복) > 화이트 후기 > 블랙 인용 > 민트 FAQ > 민트 CTA > 화이트 푸터
- 주요 밴드 배경은 `{colors.canvas-mint}`가 기본임. 밴드는 모든 폭에서 풀블리드 유지
- 기본 primary CTA는 **블랙 필** `{component.button-primary}`임. 민트 그린 필 `{component.button-green}`은 시그니처 액션 1곳(마무리 CTA)에만 사용함
- 버튼은 항상 필 형태와 고대비(민트 위 블랙, 블랙 위 화이트) 유지. 각진 버튼은 유틸리티 `{component.button-dark-square}` 하나뿐임
- 헤드라인은 크고 무겁게(700), 본문은 가볍고 여유 있게(300~500). 위계는 크기와 weight 대비로 만듦
- 제품 목업 카드는 40px 비대칭 라운드(좌상단만 직각)로 민트 밴드 위에 띄움. 이 실루엣이 브랜드 핵심임
- 깊이는 밴드 색 대비와 카드 형태로 표현함. 그림자는 hairline 또는 `{elevation.soft-float}` 하나만 허용
- 장식은 이모지, 핑크 하트, 손그림 마크 정도로 가볍게 사용함
- 여백은 8px 기반 사다리만 사용. 기능 카드 24px, 밴드 상하 96px

## 금지 (Don't)

- 제품 UI의 태그와 점수용 파스텔 팔레트를 브랜드 크롬에 쓰지 않음
- primary CTA 기본값을 민트로 채우지 않음
- 그라디언트, 무거운 그림자, 큰 블러 금지
- 민트 밴드를 차갑거나 푸른 쪽으로 틀지 않음
- 필과 40px 카드 라운드를 각지게 바꾸지 않음

## Breakpoints (요약)

1200+(데스크탑, 1200px 중앙 컨테이너) / 992~1199(랩탑) / 576~991(태블릿) / <576(모바일)

- 기능 밴드: 2col 좌우 교차 → 태블릿부터 세로 스택(카피 위, 이미지 아래)
- 후기 그리드: 3col → 1~2col
- 768px 미만에서 상단 내비 → 햄버거. 블랙 "Join Now" 필은 계속 노출
- 모바일에서 필 버튼은 전체 폭
- 푸터 검색바는 셀렉트가 줄바꿈되며 접힘
- 터치 타겟: 필 버튼 높이 44px 이상