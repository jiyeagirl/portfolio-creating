# MarketFlow(marketflow) — Design Notes

## 적용 규칙

- `디자인시스템: design-systems/claude_compact.md` (spec.md 지정) — 색·타이포 굵기/크기·컴포넌트
  스펙의 최우선 출처.
- `스타일: high-end-visual-design` (spec.md 지정) — 카드의 이중 테두리(Double-Bezel) 감각,
  버튼 프레스 피드백, 진입 모션의 커스텀 큐빅베지어, 여백을 넉넉히 두는 리듬을 폴리시 레이어로
  얹었다. 다만 이 스킬은 마케팅 랜딩 지향(“Ethereal Glass” 라디얼 그라디언트, 헤비 블러,
  해머버거 모프 내비 등)이라 **엔터프라이즈 콘솔 맥락에 맞게 절제해 적용**했다 — 실제로 반영한 것은
  ① 카드 라운드(8px) 안쪽에 hairline+soft 배경으로 미세한 단차를 주는 정도의 절제된 이중 레이어,
  ② `active:scale-[0.99]` 프레스 피드백, ③ `cubic-bezier(0.16,1,0.3,1)` 진입 트랜지션,
  ④ 섹션 사이 여백을 촘촘한 어드민 그리드보다 한 단계 넉넉하게(`gap-6`~`gap-8`, 카드 패딩 `p-5`)
  둔 것. 라디얼 메시 배경, 헤비 `backdrop-blur`, 네온 그라디언트 CTA 등 랜딩 전용 장치는
  가져오지 않았다 — CLAUDE.md의 Enterprise UI 원칙(검색·필터·상태배지·표·드로어 중심)이 우선한다.
- `design-taste-frontend`(v2)는 모든 프로젝트에 기본 적용되지만, 이 스킬 자체가 대시보드류는
  scope 밖으로 명시한다. 실질적으로 적용한 것은 anti-slop 원칙(로렘 입숨 금지, 가짜 브랜드명
  금지, em-dash 남용 금지, 반복적인 동일 카드 그리드 지양) 정도이며 세부 컴포넌트 스펙은
  claude_compact.md와 CLAUDE.md UI Generation Rules를 따른다.
- 워크스페이스 `CLAUDE.md`가 항상 최우선이라 타이포는 Pretendard 고정(claude_compact 원본의
  Copernicus/StyreneB 대체), radius는 web 콘솔 구조 베이스라인(6px 버튼·입력 / 8px 카드 / full
  배지)을 claude_compact 자체 반경표 대신 그대로 썼다.
- 이 프로젝트는 **단일 통합 콘솔**이다(spec.md IA에 사용자용/관리자용 역할 분리가 없음) — 그래서
  assetflow처럼 기업용 밝은 셸과 관리자용 다크 셸을 나누지 않고, 전역에 다크 반전 사이드바 한
  종류만 쓴다(CLAUDE.md 웹 콘솔 베이스라인의 "관리자 사이드바는 잉크 반전" 규칙을 콘솔 전체에
  적용한 것).
- 모바일 승인/알림 화면은 `projects/monitoring/marketflow-mobile/`로 완전히 분리되어 있다
  (spec.md 참고). 이 프로젝트에는 그쪽으로의 내비게이션 진입점을 두지 않았다.

## Tokens · 팔레트

claude_compact의 색을 새로 옮겨 쓰되(레퍼런스 assetflow/vercel_compact의 흑백톤을 베이스로 톤만
바꾸지 않았다), `.marketflow` 스코프(`styles/marketflow.css`)에 담았다.

| 역할 | 값 | 비고 |
| --- | --- | --- |
| primary(코랄) | `#cc785c` · active `#a9583e` · soft `#f3e3da` | CTA, 발행완료 배지, 강조 막대 |
| ink | `#141413` | 본문 헤딩 |
| body | `#3d3d3a` | 본문 텍스트 |
| mute / mute-soft | `#6c6a64` / `#8e8b82` | 보조 텍스트, 캡션 |
| hairline / hairline-strong | `#e6dfd8` / `#cdc2b4` | 테두리, 포커스 |
| canvas | `#faf9f5` (따뜻한 크림) | 본문 배경. 순백/쿨그레이 쓰지 않는다 |
| soft / soft-2 | `#f5f0e8` / `#efe9de` | 카드 보조 배경, 배지 배경 |
| surface-dark 계열 | `#181715` / elevated `#252320` / soft `#1f1e1b` | 사이드바 전용 |
| info(청록) | `#3f8f80`, soft `#dcefeb`, deep `#2c6659` | 예약/진행 상태 |
| warn(앰버) | `#b9790f`, soft `#f7e7c9`, deep `#8f5c0a` | 승인대기/조치필요 |
| danger(빨강) | `#c64545`, soft `#f6dcdc`, deep `#a13333` | 반려/오류 |

**상태 배지 5단계 (구조 재사용 — 색은 이 프로젝트 값)**: `neutral` 회색(초안/대기) ·
`info` 청록(예약/진행중) · `warn` 앰버(승인대기/조치필요) · `ink` 코랄 채움(발행완료/확정) ·
`danger` 빨강(반려/오류). 코랄은 개별 텍스트에 흩뿌리지 않고 CTA 버튼과 "완료" 등급 배지,
차트 강조 막대에만 과감하게 쓴다(claude_compact 핵심 규칙).

차트 램프는 코랄 단일 색조의 명도 단계만 쓴다: `--mf-chart-1 #a9583e` → `--mf-chart-5 #f3d8c0`,
나머지 막대는 `--mf-chart-rest`(hairline). 새 색조를 계열마다 늘리지 않는다.

## Shape

- 반경: 6px(버튼·입력) / 8px(카드) / full(배지, 토글) — web 콘솔 구조 베이스라인을 claude_compact
  자체 반경표 대신 그대로 재사용했다(scaffold.md 구조적 값 규칙).
- 그림자: 단일 두꺼운 drop-shadow 금지, 미세 3단 스택만(`--mf-shadow`, `--mf-shadow-pop`).
  claude_compact의 "그림자 최소화, 표면색 대비로 위계 표현" 원칙과 일치.
- 카드는 대부분 `border + canvas/soft` 대비만으로 구분하고, 팝오버·드로어처럼 캔버스 위에 뜨는
  요소에만 `--mf-shadow-pop`을 쓴다.

## Typography

- Pretendard 고정(CLAUDE.md 규칙). claude_compact의 weight/size/tracking 위계만 그대로 가져왔다.
- 페이지 타이틀(`PageHead`)은 claude_compact의 title-lg(22~24px/500)를 기준으로 썼다 —
  claude_compact의 "헤드라인은 항상 weight 400(bold 금지)" 규칙은 마케팅 히어로(display-*)
  전용이라 어드민 셸의 페이지 타이틀에는 적용하지 않았다(제목 위계가 title 티어이기 때문).
  본문/라벨은 원칙대로 weight 400~500 상한을 지켰고 600 이상은 쓰지 않았다.
- 콘텐츠 코드성 값(발행 일시, 계약 기간, API 키 마스킹, 수치)에는 `.mf-mono`
  (JetBrains Mono, `tabular-nums`)를 쓰고 본문에는 쓰지 않는다.
- 한글 줄바꿈: `word-break: keep-all; overflow-wrap: break-word` 전역 적용(anywhere 금지).

## 사진 매핑

picsum 고정 id는 워크스페이스 내 `projects/b2b/assetflow`가 이미 육안으로 확인해 둔 데스크·
노트북·플랫레이 계열 id를 재사용했다(이 세션은 원격 이미지를 직접 렌더링해 재검증할 도구가
없어 사진 내용이 이미 문서화된 검증 이력을 신뢰함). 전부 "책상 위 노트북/커피/모니터/키보드"
계열의 무드 사진이라 여러 산업군 고객사의 블로그·카드뉴스 커버로 두루 쓰기에 무리가 없고,
"엉뚱한 사진이 붙는" 실패 케이스(사막 사진에 재활용 협업 포스트)에 해당하지 않는다.

| id | 실제 내용 | 이 프로젝트에서 쓰는 곳 |
| --- | --- | --- |
| 0 | 책상 위 맥북과 커피 | 배송/공지형 블로그 커버 (A테크, F푸드 창업 가이드) |
| 2 | 원목 테이블 위 맥북 에어 | 여름 휴가철 배송 안내 블로그 |
| 8 | 맥북 + 노트 + 휴대폰 | 업무 자동화·트렌드 요약 블로그 |
| 9 | 맥북과 휴대폰 | 모바일 송금 기능 소개 블로그 |
| 48 | 덮은 맥북 프로 | 보안/구독 서비스 안내 블로그 |
| 180 | 위에서 본 맥북과 노트 | 신제품 라인업 카드뉴스, 환절기 건강 카드뉴스 |
| 370 | 위에서 본 맥북 (원목) | 임원 인터뷰형 카드뉴스, 인테리어 컬러 트렌드 |
| 668 | 아이맥과 키보드 | 1분기 성과 리포트 블로그 |
| 60 | 모니터·키보드·태블릿 플랫레이 | 홈오피스 가이드, 절세 카드뉴스 |
| 532 | 키보드·헤드폰·마우스 플랫레이 | 안전관리 카드뉴스, 클렌징 숏폼, 체험단 모집 |

고객사 로고/담당자 아바타는 사진 대신 이니셜 모노그램 타일(`BrandTile`/`Avatar`, 6가지 톤
순환)을 쓴다 — 가상 기업에 실존 로고를 붙일 수 없기 때문이며, CRM 성격상 사진보다 명확하다.

## 셸 레이아웃

- 데스크탑 사이드바 240px, `lg:` 미만에서 숨김 → `fixed inset-0 z-50 lg:hidden` 드로어(264px
  패널, 스크림은 `<button aria-label>`).
- 헤더 56px(`h-14`), `sticky top-0 z-30`, `border-b` + 캔버스 배경. 알림 팝오버·"새 콘텐츠
  생성" CTA·현재 시각을 얹었다.
- 본문 `px-4 py-6 → lg:px-8 lg:py-8`, `mx-auto max-w-[1400px]`.
- 내비 아이콘 15px, active 시 `weight` bold→fill + `bg-[var(--mf-surface-dark-elevated)]`,
  `rounded-[6px] px-3 py-2`. 그룹 라벨(현황/콘텐츠/고객/자동화/설정)로 9개 화면을 5개 그룹으로
  묶었다.
- 이 프로젝트는 셸이 하나뿐이다: 사용자 콘솔/관리자 콘솔 구분이 없는 단일 마케팅 운영 콘솔이라,
  사이드바를 시작부터 다크 반전(`--mf-surface-dark`)으로 고정했다 — CLAUDE.md 베이스라인의
  "관리자 사이드바는 잉크 반전, 밝은 사이드바는 사용자 콘솔에만"을 이 콘솔 전체가 운영자용이라는
  전제로 해석해 전역 적용했다. 사이드바 하단에는 로그인 계정 카드와 "조치 필요"(승인대기/
  워크플로우 오류/수집 오류 카운트) 요약 카드를 상시 노출한다.

## 표 밀도 · 컬럼 예산

`Table`은 `overflow-x-auto` 안에 있어 컬럼 폭 합이 `minWidth`를 넘으면 마지막 열이 조용히
잘린다. 1440px에서 사이드바(240px)를 뺀 본문 실폭이 약 1120px, `max-w-[1400px]` 안에서도
카드 패딩(`p-5`×2=40px)을 빼면 표가 놓이는 실제 폭은 넉넉잡아 600~680px 구간이라
**기본 `minWidth`를 620px**로 잡았다(CRM/데이터 소스처럼 열이 6개인 표는 680px).

- 열 상한 6개(고객 목록: 고객사/플랜/상태/사용량/담당자/계약종료). 이미 6개에 닿아 있어 열을
  더 늘리지 않고, 넘칠 위험이 있는 값(사용량)은 값+미터 바를 같은 셀 안에서 세로로 쌓아
  폭을 아꼈다.
- 팀 계정(5열), API Key(6열, 마지막 열은 액션 텍스트라 우선순위 낮음 — 잘려도 치명적이지 않음),
  운영 로그(4열), 데이터 소스(6열), 프롬프트(5열)는 모두 상한 안에 있다.
- 표가 잘릴 위험이 큰 화면(고객 사용량, 데이터 소스 오늘/누적)은 숫자를 보조 줄로 내리기보다
  한 셀에 라벨+값을 묶어 열 자체를 늘리지 않는 방향을 택했다.
- 좌우 카드 높이가 다른 그리드(대시보드의 승인 대기 현황 vs 최근 활동 로그, CRM 필터 바)에는
  `items-start`를 준다.

## Motion

- 진입 트랜지션 420ms `cubic-bezier(0.16,1,0.3,1)`(`.mf-enter`) — 페이지 전환, 드로어/모달
  진입에 사용.
- 워크플로우 "실행중" 상태 점은 `mf-live-dot`으로 1.8s 맥동(색이 아니라 움직임으로 "지금
  진행 중"을 전달, claude_compact/assetflow 공통 패턴 재사용).
- 버튼은 `active:scale-[0.99]`로 눌림 피드백만 준다(high-end-visual-design의 마그네틱 호버는
  랜딩 전용이라 가져오지 않았고, 엔터프라이즈 콘솔에 맞게 절제).
- AI 생성 로딩은 `animate-spin` 스피너 + 상태 텍스트로 표현(과도한 스켈레톤 애니메이션 대신
  최소한의 로딩 신호).
- `prefers-reduced-motion: reduce`에서 `.mf-enter`, `.mf-live-dot::after` 애니메이션을 모두
  끈다(`styles/marketflow.css` 하단).
