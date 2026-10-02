# habitkong — Design Notes

## 적용 규칙

- `스타일: minimalist-ui` (spec.md 지정) + 워크스페이스 `CLAUDE.md`의 UI Generation Rules.
- 타이포는 CLAUDE.md 우선이라 Pretendard 고정. minimalist-ui가 제안하는 SF Pro나
  에디토리얼 세리프는 쓰지 않는다.
- 디자인시스템 문서(`design-systems/`)는 지정 없음이라 미적용.

## 팔레트 (고정)

minimalist-ui의 warm monochrome + muted pastel 규격을 그대로 쓴다. 값은 모든 화면에서
동일하며 새 색을 추가하지 않는다.

| 역할 | 값 |
| --- | --- |
| ink (본문 강조) | `#17140F` |
| body | `#4A443C` |
| muted | `#8A8377` |
| faint | `#B5AEA4` |
| border | `#EAEAEA` (1px 고정) |
| surface | `#F7F6F3` / `#FBFBFA` |
| pastel red | `#FDEBEC` · 텍스트 `#9F2F2D` |
| pastel blue | `#E1F3FE` · 텍스트 `#1F6C9F` |
| pastel green | `#EDF3EC` · 텍스트 `#346538` |
| pastel yellow | `#FBF3DB` · 텍스트 `#956400` |
| 콩이 오렌지 | `#FF6F4D` (마스코트와 소수의 아이콘에만) |

- 카드 반경 12px, 버튼 6~8px, 태그만 pill. 그림자는 쓰지 않는다(세그먼트 컨트롤의
  1px 수준 제외).
- 숫자는 전부 `tabular-nums`.

## 콩이 (마스코트)

`components/mascot.tsx` **하나만** 쓴다. 형태, 비율, 눈/입 조형, 새싹, 색상 로직은
확정본이다. 화면에서 바꾸는 것은 `size`와 `mood`(great / good / tired) 뿐이고,
형태 변경은 "콩이 디자인을 바꿔줘"라는 명시적 요청이 있을 때만 한다.

**얼굴은 `size`에 비례한다.** 컴포넌트 안의 모든 px 값(새싹, 눈, 눈 간격, 볼, 입,
그림자)은 `size / 108`로 스케일한다. 예전에는 몸통만 `size`를 따르고 얼굴은 고정
px이라, `size=52`인 루틴 화면의 콩이 얼굴이 `size=72`인 홈 화면과 눈에 띄게 달랐다.
새 요소를 추가할 때도 반드시 `px()` 헬퍼를 거친다.

콩이가 등장하는 곳: 홈 점수 카드(size 72), 루틴 완료 리액션(52), 다이어리 날짜별
컨디션(54), 리포트 건강 레벨(56), 마이페이지 프로필(58), 온보딩 루틴 생성(96).

## 화면 구성

| 화면 | 파일 | 진입 |
| --- | --- | --- |
| 온보딩 | `screens/onboarding-screen.tsx` | 최초 진입 (6스텝) |
| 홈 | `screens/home-screen.tsx` | 탭 |
| AI 식단 분석 | `screens/diet-screen.tsx` | 탭 |
| AI 식단 촬영 인식 | `screens/food-scan-screen.tsx` | AI 식단 분석의 촬영/갤러리 버튼에서 진입 |
| 오늘의 루틴 | `screens/routine-screen.tsx` | 탭 |
| 건강 리포트 | `screens/report-screen.tsx` | 탭 |
| 콩이 다이어리 | `screens/diary-screen.tsx` | 홈·리포트·마이에서 진입 |
| 목표 관리 | `screens/goals-screen.tsx` | 홈·마이에서 진입 |
| 마이페이지 | `screens/mypage-screen.tsx` | 탭 |

하단 탭은 5개(홈·식단·루틴·리포트·마이). 온보딩, 다이어리, 목표는 탭을 감추고 뒤로가기
헤더를 쓴다(`lib/navigation.ts`의 `FULLSCREEN`).

`food-scan-screen`은 카메라 뷰파인더가 화면 상단을 꽉 채우는 몰입형 레이아웃이라 예외적으로
`ScreenHeader`(뒤로가기 헤더) 대신 사진 위에 오버레이한 X 버튼으로 닫는다. 상태바 글자색도
이 화면에서만 흰색으로 바꾼다(`src/index.tsx`의 `statusBarClassName` 분기, `lumi`/`caresignal`
프로젝트와 같은 패턴). 촬영 전(`frame`) → 분석 중(`scanning`) → 인식 결과(`done`) 3단계 상태로
"촬영하면 인식 결과가 나타나는" 흐름을 표현한다.

## 사진 (직접 확인한 고정 id)

| id | 실제 내용 | 쓰이는 곳 |
| --- | --- | --- |
| 493 | 딸기를 올린 오트밀 볼 | 아침 식사 기록 |
| 292 | 도마 위 손질한 채소 | 점심 식사 기록 |
| 488 | 구리 볼에 담긴 컬러 샐러드 | AI 인식 결과 (`food-scan-screen`의 카메라 피드 · 결과 카드) |
| 431 | 라떼 한 잔 | 자주 먹는 음식 |
| 1080 | 딸기 한 상자 | 자주 먹는 음식 |
| 429 | 컵에 담긴 라즈베리 | 자주 먹는 음식 |
| 835 | 접시에 담긴 오트 쿠키 | 자주 먹는 음식 |

id를 바꾸면 음식명과 사진이 어긋난다. 교체할 때 이 표도 같이 고친다.

## 제휴 서비스 로고

`components/brand-logos.tsx`의 `AppleHealthLogo` / `GoogleFitLogo`는 실제 마크다.
Phosphor에도 simple-icons에도 없어서 직접 그렸고, 근거는 다음과 같다.

| 로고 | 출처 |
| --- | --- |
| Apple Health | 실제 1024px 앱 아이콘에서 샘플링. 하트 바운딩 박스 229×212, 중심 61.4% / 36.5%, 그라디언트 `#FF3297` → `#FF041D`, 타일 `#FFFFFF` → `#ECECEC` |
| Google Fit | 2018년 공식 마크 path 4개 원본 그대로. `#EA4335` / `#FBBC04` / `#34A853` / `#4285F4` |

둘 다 iOS 스퀘어클(반경 = 크기의 22.37%) 앱 아이콘 타일까지 포함해서 렌더링하므로
바깥에 별도 컨테이너를 두지 않는다. 흰 타일이라 흰 배경 위에서는 `ring-1
ring-[#EAEAEA]`로 경계를 준다. 여기에 콩이 팔레트를 입히지 않는다 — 제휴 로고는
브랜드 색 그대로 두는 것이 실제 제품의 관행이다.

## 차트

계열이 하나뿐이라 범례 없이 제목이 계열을 설명한다. 강조 막대만 ink, 나머지는
`#EAEAEA`. 목표선은 점선 1px. 이중 축은 쓰지 않는다.

## 기기 프레임

하단 탭바는 불투명 흰색이며 `backdrop-blur`를 쓰지 않는다. CLAUDE.md의 "Device edge
integrity" 규칙과 같은 이유다. 온보딩은 CTA를 항상 화면 하단에 붙이려고 루트에
`min-h-[852px]`(기기 화면 높이)을 준다.
