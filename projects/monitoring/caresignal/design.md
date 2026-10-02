# CareSignal — Design Notes

## 적용 규칙

`디자인시스템: design-systems/apple_compact.md` (spec.md 지정) + 워크스페이스 `CLAUDE.md`의
UI Generation Rules. 디자인시스템이 지정되어 있으므로 `스타일:` 계열 skill은 적용하지 않고,
`design-taste-frontend`도 이 문서가 다루지 않는 부분(사진 소싱, 카피 톤 등)에만 보조로 쓴다.

## Tokens / 팔레트 (`styles/caresignal.css`)

| 역할 | 값 |
| --- | --- |
| accent (primary) | `#0066cc` |
| accent focus ring | `#0071e3` |
| accent on dark | `#2997ff` |
| accent wash | `#eef4fb` |
| ink | `#1d1d1f` |
| ink 80% | `#333333` |
| ink 48% (muted) | `#7a7a7a` |
| canvas | `#ffffff` |
| parchment (보조 배경) | `#f5f5f7` |
| pearl (아주 옅은 배경) | `#fafafc` |
| dark surface (낙상 감지 전체화면) | `#272729` / `#2a2a2c` / `#252527` |
| hairline | `#e0e0e0` (다크에서는 `#3a3a3c`) |
| divider | `#f0f0f0` |

- 액센트는 `--cs-primary` 하나만 쓴다(Apple 시스템의 "액센트는 primary 단 하나만" 규칙).
- 안전 상태(안전/주의/위험) 색은 두 번째 브랜드 컬러가 아니라 기능색이다. 70대 사용자가
  한눈에 구분해야 하므로 색상(hue)만으로 구분되게 하고, 텍스트 톤은 흰 배경에서 WCAG AA를
  넘기도록 어둡게 뺐다: `safe #248a3d`(wash `#eaf6ee`) / `caution #9a5b00`(dot `#ff9500`,
  wash `#fdf2e3`) / `danger #d70015`(dot `#ff3b30`, wash `#fdecea`).

## Shape

`components/app/ui.tsx` 상단 주석이 반경 문법의 원본이다: **lg(18px) = 카드, md(11px) = 카드
안쪽 타일, pill = 액션 버튼, sm(8px) = 유틸리티 버튼.** 이 네 값 밖의 반경은 쓰지 않는다.

그림자는 시스템 전체에서 `.cs-image-shadow` 레시피(`rgba(0,0,0,0.22) 3px 5px 30px`) 하나뿐이고,
지도·사진 타일에만 쓴다. 카드/버튼/텍스트에는 그림자를 쓰지 않는다.

## Typography

Pretendard 고정(워크스페이스 규칙). `font-feature-settings: "tnum" off`로 기본 숫자 자간을
유지한다 — 걸음 수·거리 같은 큰 수치가 등장하는 화면이 많아 tabular-nums로 고정하면 자릿수가
바뀔 때 레이아웃이 오히려 부자연스럽게 흔들린다는 판단.

## 공용 컴포넌트

`Toggle`은 `components/shared/toggle.tsx`를 그대로 감싸 쓴다(`size="lg"`,
on `#248a3d`/off `#e8e8ed`, `cs-focusable` 포커스링 추가). 이 프로젝트의 `ScreenHeader`는
lumi/habitkong의 sticky 모바일 앱바와 다른 패턴(비-sticky, `pt-[72px]`, 페이지 상단 제목용)이라
공유 컴포넌트로 승격하지 않았다.

## 사진 매핑 (직접 확인한 고정 id, `lib/photos.ts`)

| 이름 | id | 실제 내용 | 쓰이는 곳 |
| --- | --- | --- | --- |
| benchCouple | 129 | 노을 지는 공원 벤치에 두 사람이 등을 보이고 앉아 있는 사진 | 온보딩 |
| parkPath | 255 | 큰 나무가 줄지어 선 넓은 흙길 산책로 (근린공원) | 위치/활동 |
| parkBench | 553 | 낙엽이 두껍게 쌓인 숲길의 나무 벤치 두 개 (공원 쉼터) | 위치/활동 |
| walking | 858 | 포장 보도를 걷는 사람의 다리와 신발 클로즈업 (걷기) | 활동 |
| alley | 405 | 낮은 벽돌 주택이 이어진 좁은 골목과 1층 상점 (주택가) | 위치 |
| shopStreet | 437 | 붉은 벽돌 코너 건물, 차양과 파라솔이 늘어선 상가 (동네 상가) | 위치 |
| mainStreet | 342 | 버스와 오토바이가 지나는 번화한 거리, 배낭 멘 보행자 (대로변) | 위치 |

id를 바꾸면 캡션과 사진이 어긋나므로, 교체할 때는 `lib/photos.ts`의 표도 같이 고친다.

## 기기 프레임 안쪽 규칙

하단 탭바(`components/app/bottom-nav.tsx`)는 불투명 흰 배경이며 `backdrop-blur`를 쓰지 않는다.
CLAUDE.md의 "Device edge integrity" 규칙과 같은 이유다.

낙상 감지 화면(`fall-screen.tsx`)의 카운트다운 단계만 다크 배경(`#1d1d1f`)이다. 이 다크 상태는
`FallScreen`이 `onDarkChange` 콜백으로 `src/index.tsx`에 올려 보내고, `src/index.tsx`가 그 값을
받아 `PhoneFrame`의 `statusBarClassName`/`homeIndicatorClassName`과 화면 wrapper의 배경색을
함께 바꾼다. **wrapper 배경도 반드시 같이 바꿔야 한다** — `FallScreen` 내부 div만 `min-h-full`로
어둡게 칠하면, `min-height`는 percentage 자식에게 확정된 높이를 물려주지 못하는 CSS 특성 때문에
실제 콘텐츠 높이까지만 검정이 채워지고 그 아래 화면 하단이 흰 배경(wrapper 기본값)으로 남는
버그가 재현된다(실제로 겪었던 버그).

## Motion

- 낙상 감지 카운트다운 링: `cs-ring-drain`, `--cs-ring-duration`(기본 25s) 동안 stroke가
  선형으로 빠진다. 숫자를 읽지 않아도 남은 시간을 감으로 알 수 있게 하는 상태 표현 모션.
- SOS 버튼·모니터링 지도의 실시간 마커: `cs-pulse`, 2.4s 반복. "지금 신호를 보내고 있는 대상"
  하나만 표시하는 상태 모션이며 장식이 아니다.
- 진입 등장: `cs-rise`(420ms, 10px 상승 + 페이드).
- 버튼 프레스: `cs-press`(160ms, active 시 `scale(0.95)`).
- 전부 `prefers-reduced-motion: reduce`에서 애니메이션과 프레스 스케일이 즉시 꺼진다
  (`styles/caresignal.css` 하단).
