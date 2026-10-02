# BuildBid Inspector — Design

## 적용 규칙

- 디자인시스템: `design-systems/apple_compact.md` (spec.md 1행 지정) — 색 토큰, 컴포넌트 스펙,
  라운드 문법, 그림자 철학의 1차 소스.
- CLAUDE.md 규칙이 항상 우선하는 항목: Pretendard 타이포그래피, iPhone 16 Pro 단일 기기 프레임
  (흰 배경), 8px 스페이싱 그리드. apple_compact의 `spacing` 토큰(17px 등 8배수가 아닌 값)은
  채택하지 않고, 8px 배수 스케일(4/8/12/16/24/32/40/48)로 재해석했다.
- 그 외(라운드 스케일, 그림자 정책, 굵기 사다리, 액센트 단일화 원칙)는 apple_compact를 그대로 따름.
- `스타일:` 라인이 spec.md에 없으므로 `high-end-visual-design` / `minimalist-ui` /
  `industrial-brutalist-ui` 중 어느 것도 적용하지 않음. 나머지는 `design-taste-frontend`
  (v2, `DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY` 다이얼 확인됨) 기본기로 보완했다 —
  단, 이 스킬은 랜딩페이지/포트폴리오 전제(문서 0줄 "Not dashboards, not multi-step product UI")라
  히어로·마퀴·bento 관련 규칙은 적용 대상이 아니고, 색 캘리브레이션(액센트 1개, 채도<80%),
  타이포 굵기 원칙, 대비/터치타깃 체크, 이미지 진위성 규칙만 가져왔다.
- 다이얼: `DESIGN_VARIANCE: 4` (현장 단일 손 조작 리스트/폼 중심이라 비대칭 실험보다 예측 가능한
  구조 우선) · `MOTION_INTENSITY: 4` (스텝 전환에만 명확한 목적성 모션, 장식적 모션 없음) ·
  `VISUAL_DENSITY: 5` (체크리스트·사진 그리드가 있는 현장 업무 도구라 포트폴리오 랜딩보다 밀도 높음).
- `projects/b2b/buildbid` 웹 콘솔(다른 에이전트가 병행 작업)과 색 토큰·브랜드를 공유하지 않는다.
  이 문서의 팔레트는 `--bbi-*` 컴포넌트 스코프 변수로, 해당 프로젝트가 무엇을 쓰든 충돌하지 않는다.

## Tokens / 팔레트

컴포넌트 스코프 CSS 변수(`.buildbid-inspector` 클래스 아래), 필름메이트의 다크/앰버 팔레트와
값을 공유하지 않는 독자 팔레트. 컨셉: 강한 실외 채광에서도 읽히는 라이트 UI + 중장비 현장의
"녹슨 강철·흙먼지" 톤 액센트 하나. 안전주황 남발 대신 절제된 러스트 앰버 한 가지만 쓴다.

| Token | Value | 용도 |
|---|---|---|
| `--bbi-canvas` | `#F2F3EF` | 앱 배경 (쿨 스틸 오프화이트) |
| `--bbi-surface` | `#FFFFFF` | 카드/시트 표면 |
| `--bbi-surface-sunken` | `#E9EBE6` | 체크리스트 행, 인풋, 눌린 상태 배경 |
| `--bbi-ink` | `#14181A` | 주요 텍스트 (그래파이트 블랙) |
| `--bbi-body` | `#3C4245` | 본문 |
| `--bbi-muted` | `#6E7478` | 보조 텍스트 |
| `--bbi-muted-soft` | `#9AA0A3` | placeholder, 비활성 |
| `--bbi-border` | `#DBDEDA` | 카드/구분선 |
| `--bbi-border-strong` | `#C5C9C4` | 인풋 외곽선, 강조 구분선 |
| `--bbi-accent` | `#C2740F` | 러스트 앰버 — 유일한 브랜드 액센트 (주요 버튼/진행률/선택 상태) |
| `--bbi-accent-soft` | `#F4E3C4` | 액센트 틴트 배경 (선택 칩, 배지) |
| `--bbi-on-accent` | `#FFFFFF` | 액센트 위 텍스트 |
| `--bbi-danger` | `#C1402E` | 불량/삭제/심각 손상 |
| `--bbi-danger-soft` | `#F7E0DA` | 불량 배지 배경 |
| `--bbi-success` | `#3D7A56` | 정상/A등급/제출 완료 |
| `--bbi-success-soft` | `#DEEDE2` | 정상 배지 배경 |
| `--bbi-warning` | `#B9860F` | 주의/B등급 (액센트와 가까운 계열 — 현장 "주의" 컬러군을 의도적으로 통일) |
| `--bbi-warning-soft` | `#F3E7C9` | 주의 배지 배경 |

액센트는 `--bbi-accent` 한 가지만 UI 크롬(주요 버튼, 진행 바, 선택된 스텝, 체크된 항목)에
쓰고, 등급/상태 배지는 별도 시맨틱 토큰(success/warning/danger)을 쓴다. 그라데이션 없음,
카드/버튼 그림자 없음 — apple_compact의 "그림자는 제품 이미지 전용" 규칙을 따라 카드는
1px 보더로만 구분한다.

## Shape

- 라운드 스케일(apple_compact 문법 그대로 채택): `none`=0(풀블리드 사진 스트립),
  `sm`=8px(유틸리티 아이콘 버튼, 소형 태그), `lg`=18px(카드, 시트, 모달), `pill`=9999px
  (버튼/인풋/칩/배지 — 액션 요소 전용). 문법을 섞지 않는다: 카드에 pill을 쓰거나 버튼에
  18px를 쓰지 않는다.
- 그림자 정책: 시스템 전체 그림자 없음. 카드 구분은 `1px solid var(--bbi-border)`로만.
  유일한 예외는 하단 고정 CTA 바 위쪽 1px 보더(엣지 정합성 규칙과 충돌하지 않는 불투명 보더).
- 버튼 active 상태: `transform: scale(0.95)` 공통 적용 (apple_compact 규칙).

## Typography

Pretendard 전용(워크스페이스 규칙). apple_compact의 굵기 사다리를 그대로 따름 —
**300 / 400 / 600 / 700만 사용, 500은 쓰지 않는다.**

| Role | Size / Line | Weight | 용도 |
|---|---|---|---|
| Display | 28 / 34 | 700 | 화면 타이틀 ("오늘의 검수") |
| Title 1 | 20 / 26 | 700 | 업체명, 섹션 헤더 |
| Title 2 | 16 / 22 | 600 | 카드 제목, 스텝 헤더 |
| Body | 15 / 22 | 400 | 본문, 설명 |
| Callout | 13 / 18 | 600 | 캡션, 메타 정보, 배지 라벨 |
| Micro | 11 / 14 | 700 | 상태 배지, 스텝 인디케이터 숫자 |

숫자(시간, 진행률 "3/6", 전화번호)는 tabular-nums로 정렬 고정.

## 사진 매핑

Picsum은 중장비 사진을 보유하지 않는다(일반 라이프스타일/자연 사진 위주) — 실제로 각 id를
다운로드해 눈으로 확인한 뒤, "그럴듯한 장비 사진"으로 오인시키지 않는 두 용도로만 썼다:
(1) 위치 확인 화면의 지도 썸네일은 항공뷰 텍스처에 그리드 오버레이 + 틴트를 얹어 "스타일드
맵 타일 목업"으로 명확히 표현(실제 좌표 사진이라 주장하지 않음), (2) 사진 촬영 스텝의 "촬영된
사진"은 실제로 금속/기계 질감이 보이는 근접 컷만 골라 그 내용에 맞는 라벨을 붙였다(예: 눈에
보이는 게 독수리인데 "엔진룸"이라고 우기는 식의 불일치 없음).

| id | 실제 내용(육안 확인) | 화면에서의 용도/캡션 |
|---|---|---|
| 1058 | 초록 잔디 구장 항공뷰(위에서 촬영) | 지도 썸네일 A — 도심 녹지 항공 텍스처 |
| 1050 | 해안 절벽 지형 항공뷰 | 지도 썸네일 B — 외곽 지형 항공 텍스처 |
| 88 | 고속도로 교차로 항공뷰(흑백톤) | 지도 썸네일 C — 도로망 항공 텍스처 |
| 1079 | 원형 금속 링에 빛 반사(추상 매크로) | 유압 실린더 로드 클로즈업 |
| 23 | 스테인리스 식기 어두운 반사 근접컷 | 금속 표면 마모/스크래치 클로즈업 |
| 96 | 어두운 반사면 위 드론 하부(기계 부품 느낌) | 계기판/센서 유닛 클로즈업 |
| 1031 | 유리·철골 건물 모서리(기하학적 구조) | 차체 프레임 구조 클로즈업 |
| 1081 | 흰색 주름진 건축 표면 | 외관 패널 라인 클로즈업 |
| 1028 | 먼지 낀 벌판의 마른 나무들 | 작업 현장 전경(외부 환경) |

지도 썸네일은 `filter: saturate(.7) hue-rotate(...) + 반투명 그리드 오버레이`로 통일 처리해
"위성사진처럼 보이는 실사"가 아니라 "맵 타일 스타일 목업"이라는 톤을 명확히 한다.

### 장비 대표 사진 — 아이콘 결정 번복 (2026-07-30)

위 표의 "스케줄 리스트의 장비 종류 표시는 사진 대신 Phosphor 아이콘 칩을 쓴다"는 결정은
**폐기한다.** 실사용 리뷰에서 아이콘 칩이 "신뢰성이 떨어져 보인다"는 피드백을 받았고,
장비 매매 실사(inspection) 앱에서 장비 목록의 대표 이미지가 카테고리 아이콘인 것은
포트폴리오 완성도 기준에 못 미친다고 판단했다. 사진이 필요한 이유는 그대로였다 —
picsum.photos는 중장비 사진을 보유하지 않음(전체 id 범위 약 330개 샘플링으로 확인). 대신
Wikimedia Commons에서 CC 라이선스 실사를 소싱, 각 장비 종류·가급적 job의 모델명과 실제로
일치하는 사진을 하나씩 눈으로 확인 후 채택했다(`assets/equipment/*.jpg`). 스케줄 리스트
(`JobCard`)와 상세 화면(`JobDetailScreen`)의 장비 대표 타일은 이제 `next/image` 정적 임포트로
불러온 실사를 `object-cover`로 채운다(48px / 56px, `rounded-[12px]`, 기존 원형 아이콘 칩의
`--bbi-accent-soft` 배경을 사진 로드 전 스켈레톤 톤인 `--bbi-surface-sunken`으로 교체).
검수 위저드의 "사진 촬영" 스텝(현장에서 찍는 목업 사진, picsum 소스)은 이 결정과 무관 —
그 스텝은 의도적으로 "검수원이 그 자리에서 찍는 사진"이라는 별개의 목업이라 그대로 둔다.
`EquipmentIcon` 컴포넌트(`components/ui/equipment-icon.tsx`)는 두 화면 모두에서 대체되어
더 이상 참조하는 곳이 없어 파일을 삭제했다.

| 파일 | 실제 내용(육안 확인) | 매칭 job | 출처 · 라이선스 · 저작자 |
|---|---|---|---|
| `bulldozer-1.jpg` | 캐터필러 D6K2 XL 불도저, 현장 촬영 | job-1 (불도저 · 캐터필러 D6) | Wikimedia Commons, *"Caterpillar D6K2 XL bulldozer on a job site.jpg"*, Grendelkhan, CC BY-SA 4.0 |
| `excavator-3.jpg` | JCB 소형 굴삭기, 도로변 현장 | job-2 (굴삭기 · 볼보 EC220DL) | Wikimedia Commons, *"JCB compact excavator.JPG"*, High Contrast, CC BY 3.0 de |
| `forklift-2.jpg` | 노란색 지게차가 파란 해상 컨테이너를 하역 중, 야외 산업 현장 | job-3 (지게차 · 현대 25D-9) | Wikimedia Commons, *"Container loading with forklift at warehouse in Thailand.jpg"*, Goterrestrial, CC BY 4.0 |
| `crane-mobile-2.jpg` | 리프헤르 LTM 1500-8.1 이동식 크레인이 지니 S-85 리프트를 인양 중 | job-4 (크레인 · 콜롬 NK500B, 이동식) | Wikimedia Commons, *"A Liebherr LTM 1500-8.1 crane truck lifting a Genie S-85 Lift Crane.jpg"*, Tbatb, CC BY-SA 4.0 |
| `dumptruck-4.jpg` | 모래를 적재한 덤프 티퍼 트럭 | job-5 (덤프트럭 · 현대 엑시언트 15톤) | Wikimedia Commons, *"Sand Dump Tipper (Tipper Truck).jpg"*, SAgbley, CC BY-SA 4.0 |
| `loader-2.jpg` | 아틀라스 52E 휠로더, 도로변 | job-6 (로더 · 현대 955L) | Wikimedia Commons, *"Atlas 52E loader 2.jpg"*, Rami Tarawneh, CC BY-SA 2.5 |

(참고: `job-4`의 모델명 "콜롬 NK500B"는 가상 브랜드이므로 사진은 동급 대형 이동식 크레인의
리프트 장면으로 매칭했다 — 브랜드 로고 일치가 아니라 장비 종류·형태 일치가 기준.)

## 기기 프레임 안쪽 규칙

- 하단 고정 CTA 바(위저드 스텝 이동, "검수 시작", "검수 완료 제출")와 상단 `ScreenHeader`는
  전부 **불투명** 표면(`--bbi-surface` 고정값)만 사용, `backdrop-blur`/`backdrop-filter`
  없음 — Chromium에서 backdrop-filter가 `PhoneFrame`의 `rounded-[50px]` 클립을 뚫고 나가
  하단 모서리에 흰 틈이 새는 반복 버그를 원천 차단.
  - 모든 edge-anchored 요소는 화면 박스 내부에 `absolute`로만 배치, `fixed`나 음수 오프셋 없음.
  - 빌드 완료 후 하단 모서리를 확대해 검은 섀시 밖으로 흰 틈이 새지 않는지 확인함.

## Motion

- `motion/react` 사용. 위저드 스텝 전환: `x: 24→0` + fade, `duration .28, ease [0.16,1,0.3,1]`
  (스프링 대신 절제된 easing — 스텝형 폼이라 튕기는 느낌보다 확정적인 전환이 맞다고 판단).
  뒤로 갈 때는 반대 방향(-24→0)으로 대칭 처리.
  - 체크리스트 항목 선택(정상/주의/불량) 시 배경색 전환 `duration .15`.
  - 사진 캡처 그리드에 새 사진 추가 시 `scale .9→1` + fade, `duration .2`.
  - 진행률 바는 `width` 트랜지션 `duration .3 ease-out`.
- `prefers-reduced-motion` 존중 — 워크스페이스 전역 CSS 규칙 상속, 추가 스텝 전환도
  `useReducedMotion()`으로 즉시 전환(트랜지션 생략)하도록 처리.
