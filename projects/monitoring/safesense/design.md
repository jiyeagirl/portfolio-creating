# SafeSense — Design Notes

## 적용 규칙

`스타일: industrial-brutalist-ui` (spec.md 지정) + 워크스페이스 `CLAUDE.md`의 UI Generation
Rules. `디자인시스템:` 지정은 없으므로 `design-systems/`는 참조하지 않는다.

industrial-brutalist-ui는 두 가지 모드(Swiss Industrial Print / Tactical Telemetry) 중 하나를
프로젝트 전체에서 일관되게 써야 한다고 명시한다 — **이 프로젝트는 Tactical Telemetry(다크,
군용/항공 HUD 톤)를 선택한다.** 실시간 위험 감지·SOS·관제라는 소재가 "관제실 터미널" 컨셉과
직접 맞아떨어지고, 근로자 앱·워치·관리자 관제 3개 채널 모두 같은 다크 텔레메트리 톤을 유지한다.

skill이 추천하는 서체(Neue Haas Grotesk, JetBrains Mono 등)는 CLAUDE.md의 Pretendard 고정
규칙이 우선이라 쓰지 않는다. 대신 skill이 요구하는 "매크로 타이포(구조) vs 마이크로 타이포
(텔레메트리 데이터)"라는 대비 구조는 Pretendard 굵은 웨이트 + 모노스페이스 유틸리티 클래스
조합으로 재현한다(assetflow의 `.af-mono` 선례와 동일 패턴).

border-radius 0(직각 코너)은 skill의 핵심 정체성이라 CLAUDE.md의 범용 "카드 12–16px" 기본값보다
우선한다 — Precedence 규칙상 skill이 명시적으로 다루는 항목이기 때문이다.

`DESIGN_VARIANCE 7` / `MOTION_INTENSITY 3` / `VISUAL_DENSITY 8` — 이 스타일 자체가 이미 강한
시각적 정체성이라 추가 장식은 자제하고(모션 최소), 텔레메트리 특성상 밀도는 높게 간다.

## Tokens / 팔레트 (`styles/safesense.css`)

| 역할 | 값 |
| --- | --- |
| canvas (앱 배경) | `#0a0a0a` |
| panel (카드/패널 표면) | `#121212` |
| panel-2 (패널 안쪽 타일) | `#1a1a1a` |
| foreground ("white phosphor") | `#eaeaea` |
| muted (보조/메타 텍스트) | `#6e6e6e` |
| border (구조 구분선, 1px) | `#262626` |
| border-strong (강조 구분선) | `#3a3a3a` |
| accent — hazard red (유일한 브랜드 액센트) | `#ff2a2a` |
| accent wash (경고 배경 틴트) | `rgba(255,42,42,0.12)` |
| safe — terminal green (단일 용도) | `#4af626` |

- 액센트는 `--ss-accent` 하나뿐이고, 이게 곧 "위험/경고"색이다. 별도 danger 토큰을 만들지
  않는다 — skill 규칙상 액센트=경고색이 자연스럽게 일치한다.
- `--ss-safe`(터미널 그린)는 "현재 안전" 상태 표시 딱 한 군데(상태 배지의 점 + 값)에만 쓰고,
  절대 일반 텍스트나 두 번째 브랜드 컬러로 확장하지 않는다(skill의 명시적 제약).
- 그라디언트, 소프트 드롭섀도, 반투명 글래스모피즘은 전부 금지. 표면 구분은 오직 1px/2px
  솔리드 보더로만 한다.

## Shape

- **반경 0은 실사용 화면에서 지나치게 각져 보인다는 피드백을 받아 완화했다.** skill 원문은
  직각을 요구하지만, 이 항목은 CLAUDE.md Precedence상 "UI Generation Rules가 최우선"이라는
  원칙과 "실제 프로덕션 소프트웨어처럼 보여야 한다"는 Portfolio Quality 기준이 skill의 장식적
  규칙보다 앞선다고 재해석한다. 카드/패널 10px, 버튼·스탯 타일 8px, 배지·태그·토글·프로그레스는
  pill(`rounded-full`)을 쓴다.
- 표면 구분은 `border: 1px solid var(--ss-border)`가 기본, 경고/위험 패널은 상단
  `border-top: 2px solid var(--ss-accent)`로 강조.
- 데이터 밀집 표(관리자 화면)는 `display:grid; gap:1px` + 배경색 대비로 얇은 격자선을 만드는
  기법을 쓴다(skill의 "Grid Determinism" 엔지니어링 지침). 격자 내부 셀은 반경 없이 맞물리게
  두고, 그 격자를 감싸는 바깥 `Card`에만 10px 반경을 준다 — 밀집 데이터 표는 실제 엔터프라이즈
  대시보드(Stripe, Linear 등)에서도 흔한 문법이라 이 부분은 그대로 유지한다.

## Typography

Pretendard 고정(워크스페이스 규칙). 두 축으로 대비를 만든다:

| 축 | 용도 | 처리 |
| --- | --- | --- |
| 매크로 (구조) | 화면 타이틀, 큰 상태 텍스트 | Pretendard 800~900, 자간 `-0.03em`, leading 0.9~0.95 |
| 마이크로 (텔레메트리) | 라벨, 타임스탬프, 좌표, ID | `.ss-mono` 유틸리티 — `"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`, 자간 `0.06em`, 대문자, `tabular-nums` |

섹션 라벨은 `[ 안전 상태 ]`처럼 ASCII 대괄호로 감싸고, 진행 중 표시는 `>>>` 접두사를 쓴다
(skill의 Syntax Decoration 규칙, 한글 라벨에 그대로 적용).

## 공용 컴포넌트

- 모바일 앱은 `components/shared/phone-frame.tsx`(iPhone 16 Pro)를 쓴다.
- 스마트워치는 이 프로젝트에서 신설한 `components/shared/watch-frame.tsx`를 쓴다 — Apple Watch
  스타일 둥근 사각 케이스 하나로 통일하고(Wear OS는 카피에서만 언급, 별도 원형 프레임은 만들지
  않는다 — 두 폼팩터를 동시에 만들면 범위가 배로 늘어나고 포트폴리오 스크린샷 목적상 하나로
  충분하다), `PhoneFrame`과 동일하게 `screenClassName`/`backdropClassName` 등 prop으로 색만
  주입받는다.
- `ScreenHeader`(`components/shared/screen-header.tsx`)는 구조가 그대로 맞아 이 프로젝트의
  다크 톤 className을 넘겨서 재사용한다.
- `Toggle`(`components/shared/toggle.tsx`)은 재사용한다 — 반경 0 규칙을 완화하면서
  `rounded-full` 트랙·손잡이가 더는 충돌하지 않는다. 색상만 `onClassName`/`offClassName`으로
  이 프로젝트 톤을 주입한다.
- `Badge`/`Card`/`Button`/`StatTile`/`ProgressBar`/`EmptyState`/`SectionTitle`은 이름이 같아도
  프로젝트마다 실제 디자인 정체성이 달라 공유하지 않는다는 워크스페이스 규칙에 따라
  `components/app/ui.tsx`에 이 프로젝트 전용으로 새로 만든다(직각 코너, 브래킷 라벨, 모노 텔레메트리
  값이 이 프로젝트만의 문법).

## 기기 프레임 안쪽 규칙

하단 탭바/앱바 등 기기 화면 가장자리에 걸치는 요소는 전부 불투명 배경(`--ss-panel`)이며
`backdrop-blur`를 쓰지 않는다. CLAUDE.md의 "Device edge integrity" 규칙과 동일한 이유 —
`WatchFrame`에도 동일하게 적용한다.

## Motion

- `MOTION_INTENSITY 3` — 이 스타일은 장식적 모션을 지양한다.
- 화면 전환: 120ms 페이드만(상승/스프링 없음) — 기계적으로 전환되는 느낌을 유지한다.
- "LIVE" 표시(실시간 이벤트/관제 화면)는 부드러운 pulse-scale 대신 800ms 간격의 단순 on/off
  블링크로 처리한다 — 상태등(LED)에 더 가까운 표현.
- 전부 `prefers-reduced-motion: reduce`에서 즉시 정지.

## 사진 매핑 (직접 확인한 고정 id)

이 스타일은 "이미지보다 타이포/데이터가 우선"이라는 원칙이라 사진 사용을 의도적으로 최소화한다.
근로자 아바타는 사진 대신 이니셜 모노그램(직각, 보더만)을 쓴다. 실제 사진이 필요한 곳만 아래에
기록한다.

| id | 실제 내용 | 쓰이는 곳 |
| --- | --- | --- |
| 1048 | 올려다본 각도의 유리·철골 고층 빌딩 군집, 흐린 하늘 | 관리자 웹 메인 대시보드 히어로 |
| 1033 | 콘크리트 골조의 어두운 인프라 통로와 에스컬레이터 | 현장 관리(사이트) 목록 카드 배경 |

id를 바꾸면 캡션과 어긋나므로, 교체할 때는 이 표도 같이 고친다.
