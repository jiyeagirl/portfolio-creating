# GenderInsight — Design Notes

## 적용 규칙

- `스타일: minimalist-ui` (spec.md 지정). 워크스페이스 `CLAUDE.md`의 UI Generation Rules가
  항상 먼저다 — 타이포는 Pretendard 고정, minimalist-ui가 제안하는 SF Pro / Geist / 세리프
  에디토리얼 폰트는 쓰지 않는다. minimalist-ui에서 실제로 가져온 것은 웜 모노크롬 팔레트,
  옅은 파스텔 스팟 액센트, 플랫 벤토 그리드, 얇은 보더, 무거운 그림자/그라디언트 금지 방향이다.
- `디자인시스템:` 지정 없음 — `design-systems/`는 참조하지 않는다.
- 반응형 Web(관리자 콘솔 + 참여자 콘솔) 프로젝트라 `web` 프리셋. `PhoneFrame`은 쓰지 않는다.
- `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`: 중간값. 관리자 콘솔은 표·통계
  밀도가 높은 엔터프라이즈 화면이라 밀도를 낮추지 않고, 참여자 콘솔은 스펙의 "최소한의 단계로
  단순화" 지시에 맞춰 밀도를 의도적으로 낮춘다(레이아웃 상 별개 취급, 토큰은 공유).

### 관리자 분리

관리자 화면은 `projects/b2b/genderinsight/components/admin/` 안에 있고,
`projects/b2b/genderinsight-admin/src/index.tsx`는 `/b2b/genderinsight-admin` URL을 하나 더
얻기 위한 얇은 엔트리다(assetflow/assetflow-admin, orderlog/orderlog-admin과 동일 구조).
사용자(참여자) 콘솔 쪽에는 관리자 진입점을 두지 않는다 — 주소도 계정도 실제로 분리되어 있다.
`-admin` 프로젝트는 `styles/`·`design.md`를 따로 두지 않고 본 프로젝트의 토큰을 그대로
상속한다.

### 조직 설정

가상의 공공기관 인사팀이 GenderInsight를 도입해 자체 임직원 대상 성인지감수성 진단을
운영하는 시나리오로 잡았다. 기관명은 화면 어디에도 노출하지 않는다(관리자 콘솔 헤더, 로그인
화면 모두 기관명 없이 노출). spec의 "대상 조직 선택"은 멀티테넌트 고객사 관리(스펙에 없는
화면)가 아니라, 진단 생성 시 이 기관 산하 사업장(본원 / 서부지사 / 동부지사 / 인재개발원) 중
대상 범위를 고르는 것으로 해석했다 — 부서/직급 단위 집계와 자연스럽게 이어진다. 참여자 메일
도메인은 `company.kr`처럼 완전히 중립적인 값만 쓴다.

## Tokens / 팔레트 (`styles/genderinsight.css`, `.genderinsight` 스코프)

| 역할 | 값 |
| --- | --- |
| ink (primary) | `#221B1D` |
| on-primary | `#FFFFFF` |
| body | `#5B5457` |
| mute | `#9C9396` |
| hairline | `#EDE9E6` · hairline-strong `#C7C0BE` |
| canvas | `#FFFFFF` · soft `#FAF8F6` · soft-2 `#F3EFEC` |
| accent (primary 액션) | `#6E4C63` (뮤트 오키드) · deep `#4E3346` · soft `#F3E7EE` |
| info | `#1F6C9F` · soft `#E1F0FE` |
| warn | `#956400` · soft `#FBF3DB` |
| danger | `#9F2F2D` · soft `#FDEBEC` |

액센트(`#6E4C63`)는 주요 CTA(제출, 진단 생성, 초대 발송)와 진행률/차트 강조에만 쓰고, 큰
배경면에는 절대 쓰지 않는다. 성별 이분법적 색(핑크/블루)을 의도적으로 피하고 중성적인
오키드 톤 하나로 통일했다.

- 반경: 6px(버튼·입력) / 8px(카드) / full(배지, 진행률 바). `rounded-full`을 카드처럼 큰
  컨테이너에 쓰지 않는다.
- 그림자: `--gi-shadow`(미세 3단, 최대 알파 0.04) / `--gi-shadow-pop`(드로어·팝오버 전용).
  단일 두꺼운 drop-shadow 금지 — minimalist-ui의 "거의 안 보일 정도" 지침을 그대로 따른다.
- 보더: `1px solid var(--gi-hairline)` 고정.

### 상태 배지 (5단계 고정)

| 톤 | 쓰이는 상태 |
| --- | --- |
| `neutral` | 준비중, 미배정, 임시저장 |
| `info` | 진행중, 발송완료, 검토중 |
| `warn` | 마감임박, 미응답 다수, 재발송 필요 |
| `ink`(액센트 채움) | 종료, 제출완료, 생성완료 |
| `danger` | 잠금, 기간만료, 미제출 |

`Stat`의 delta는 `+`/`-`로 시작할 때만 색을 준다.

## Shape

카드 12px 이내(8px 기본), 버튼/인풋 6px, 배지·진행률 바 full. 벤토형 비대칭 그리드를
대시보드·결과 분석에 쓴다(동일 크기 카드 반복 금지).

## Typography

Pretendard 고정. 자릿수를 맞춰 읽는 값(PIN 코드, 날짜/시각, 참여율 %, 문항 번호, 사번)에만
`.gi-mono` 유틸(모노스페이스, `tabular-nums`)을 쓰고 본문에는 쓰지 않는다.

## 사진 매핑

관리자 콘솔은 표·통계 밀도가 높은 엔터프라이즈 데이터 화면이라 assetflow의 서버랙 사례와
같은 이유로 인물 사진을 강제하지 않는다 — picsum에 "성인지감수성 진단", "다양성 회의" 같은
내용에 정확히 맞는 사진이 없고, 억지로 붙이면 캡션과 어긋나는 실패 사례(사막 사진 + 재활용
캠페인)를 반복하게 된다. 대신:

- 아바타는 전부 이니셜 원형 배지(관리자 셸의 기존 관례와 동일).
- 참여자 로그인 · 제출 완료 화면은 옅은 파스텔 라디얼 스팟 + 얇은 라인 도형으로 시각적
  깊이를 준다(minimalist-ui 6절의 "subtle full-width background imagery... 또는 soft
  radial light spots" 대안 조항). 사진을 억지로 넣지 않는다.
- 이 결정 때문에 워크스페이스 전역 사진 id 표는 이 프로젝트에 없다. 추후 실제 사진이
  필요해지면(예: 조직 소개 배너) 이 절에 id/내용/쓰이는 곳을 추가한다.

## 셸 레이아웃

- **참여자 콘솔** (`components/layout/participant-shell.tsx`): 사이드바 없음. 56px 높이의
  가벼운 상단 헤더(마크 + 진단명, 설문 중엔 진행률 바)만 두고 본문은 `max-w-[640px]
  mx-auto`로 좁게 잡아 스펙의 "최소한의 단계로 단순화"를 레이아웃으로 표현한다. 모바일
  드로어 없음(내비 항목이 없어서 필요 없음).
- **관리자 콘솔** (`components/admin/admin-shell.tsx`): F자형 — 잉크 반전(다크, `#1C1417`
  계열로 accent-deep과 맞춤) 사이드바 236px가 전체 높이, `lg:` 미만에서 숨김. 헤더는 56px
  `sticky top-0 z-30`. 모바일 드로어 `fixed inset-0 z-50 lg:hidden`, 패널 264px.
  본문 `px-4/5 py-6/8 → lg:px-8 lg:py-8/10`, `mx-auto max-w-[1400px]`.
  관리자 로그인 화면(`admin-login-screen.tsx`)은 셸 밖의 별도 풀스크린 화면이다.

## 표 밀도 · 컬럼 예산

`Table`은 `overflow-x-auto` 안에 있어 컬럼 폭 합이 넘치면 마지막 열이 조용히 잘린다. 1440px
에서 사이드바(236px)를 뺀 좁은 컬럼이 약 600px라 기본 `minWidth`를 **560**으로 잡았다(참여자
관리·응답 현황처럼 6열까지 쓰는 표 기준). 열이 6개를 넘으면 값을 보조 줄로 내리고 열 수를
줄인다 — 참여자 관리 표는 "이름 / 부서·직급"을 한 셀에 두 줄로 묶어 6열을 유지했다. 넘칠 때
가장 먼저 사라지는 정보가 PIN 재발급 같은 액션 버튼이라, 액션 열은 항상 맨 오른쪽에 두고
폭을 줄이지 않는다. 좌우 카드 높이가 다른 그리드(대시보드 요약 + 최근 진단 목록)에는
`items-start`를 준다.

## Motion

진입 트랜지션 `420ms cubic-bezier(.16,1,.3,1)`(`.gi-enter`), 리스트/그리드 스태거는
`animation-delay: calc(var(--index) * 60ms)`. `prefers-reduced-motion: reduce`에서 전부
`animation: none`. 미응답자 배지의 점멸(`gi-live-dot`)도 동일하게 존중.
