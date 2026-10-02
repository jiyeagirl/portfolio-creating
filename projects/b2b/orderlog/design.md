# OrderLog — Design Notes

## 적용 규칙

- `스타일:` / `디자인시스템:` 지정이 spec.md에 없다 → `design-taste-frontend`(v2)의 판단에
  맡기고, 이 스킬 자체는 "OUT OF SCOPE: 대시보드 / 고밀도 제품 UI / 관리자 패널"이라고
  명시하므로 랜딩페이지형 규칙(히어로, 마퀴, 아이브로우 카운트 등)은 적용하지 않는다.
  대신 스킬의 범용 판단 기준(단일 액센트, AI 티가 나는 패턴 금지, 실제 이미지, 폼/버튼
  대비, em dash 금지, 다크/라이트 모드 일관성)만 가져오고, 화면 구조 자체는 워크스페이스
  `CLAUDE.md`의 "Enterprise UI" 절(검색/필터/상태배지/탭/페이지네이션/데이터테이블/
  드로어/모달/타임라인/활동로그/차트)을 따른다.
- `DESIGN_VARIANCE 4 / MOTION_INTENSITY 4 / VISUAL_DENSITY 6` — 금융 거래 데이터를 다루는
  B2B 콘솔이라 레이아웃은 예측 가능한 그리드(비대칭 실험 최소화), 모션은 상태 전환/피드백
  목적에 한정, 밀도는 "일반 업무용 앱" 수준(카드 여백은 확보하되 표는 촘촘하게).
- 플랫폼이 Web(관리자/원청/납품처/거래처 통합 콘솔)이라 `components/shared/phone-frame.tsx`는
  쓰지 않는다. 모바일 기기 프레임, "Portfolio Mobile Output" 규칙은 이 프로젝트에 해당하지
  않는다.
- `_reference-design-system.md`/`_reference-styles/`(filmate)는 색상 출처로 쓰지 않았다
  (필름 카메라 앱의 다크/앰버 톤은 이 프로젝트의 도메인과 무관). 구조적으로는 filmate의
  스프링 모션 철학(진입 시 `x/opacity` + spring stiffness 300 / damping 30,
  `prefers-reduced-motion` 존중)만 화면 전환/타임라인 항목 등장에 재사용했다. 8px 그리드는
  CLAUDE.md 기본 규칙에서 직접 가져왔다.
- assetflow(같은 b2b 카테고리)와 구조적 완성도(Badge/Button/Card/Table/Timeline/Chart
  프리미티브 세트, PageHead/CardHead 패턴, 표 `overflow-x-auto` 처리)는 동일한 수준으로
  맞추되, 톤 어휘/색/반경 스케일/프레스 피드백은 새로 설계했다(CLAUDE.md
  `components/shared/` 절 — 이름이 같아도 실제 정체성은 다르게).

## Tokens / 팔레트 (`styles/orderlog.css`, `.orderlog` 스코프)

금융 신뢰감을 위해 딥 네이비 잉크 + 단일 일렉트릭 인디고 액센트를 쓰고, 사이드바를
잉크 네이비로 반전시켜 콘텐츠 영역(라이트)과 시각적으로 분리한다.

| 역할 | 토큰 | 값 | 용도 |
| --- | --- | --- | --- |
| 캔버스 | `--ot-canvas` | `#F5F6FA` | 콘텐츠 영역 배경 |
| 서페이스 | `--ot-surface` | `#FFFFFF` | 카드, 표, 패널 |
| 서페이스(연) | `--ot-surface-soft` | `#EEF0F7` | 강조 없는 보조 블록 |
| 잉크 | `--ot-ink` | `#10152A` | 주요 텍스트, 헤딩 |
| 본문 | `--ot-body` | `#4A5170` | 본문, 라벨 |
| 보조 | `--ot-mute` | `#8991AC` | 캡션, 플레이스홀더 |
| 헤어라인 | `--ot-hairline` | `#E2E5F0` | 구분선 (강조: `--ot-hairline-strong` `#C6CBDD`) |
| 액센트 | `--ot-accent` | `#3B54F5` | 주요 버튼, 활성 상태, 링크, 포커스 링 |
| 액센트(연) | `--ot-accent-soft` | `#E8EAFE` | 액센트 배지, 선택 배경 |
| 액센트(짙) | `--ot-accent-deep` | `#2740C4` | hover, 강조 텍스트 |
| 사이드바 배경 | `--ot-nav-bg` | `#0A0F22` | 좌측 내비게이션 (반전 표면) |
| 사이드바 서페이스 | `--ot-nav-surface` | `#141A34` | 활성/hover 항목 |
| 사이드바 전경 | `--ot-nav-fg` | `#EEF0FA` | 사이드바 텍스트 |
| 사이드바 보조 | `--ot-nav-mute` | `#7C86AC` | 사이드바 캡션 |
| 사이드바 테두리 | `--ot-nav-border` | `#232A4C` | 사이드바 내부 구분선 |

상태 배지(장식이 아니라 발주/알림/AI 위험도의 실제 상태를 나타내는 기능색이므로
CLAUDE.md의 "1 primary accent" 규칙과 별도로 고정 5단계만 허용):

| 톤 | 색 | 쓰이는 상태 |
| --- | --- | --- |
| `neutral` | 회색 (`--ot-mute` 위 `--ot-surface-soft`) | 작성 중, 보류 |
| `info` | 액센트 인디고 | 진행중, 신규 발주, 일반 알림 |
| `warn` | 앰버 `#B4740E` / soft `#FBEACB` / deep `#8A5709` | 승인 대기, 납기 변경 요청, 주의 알림 |
| `success` | 그린 `#12875A` / soft `#DCF3E7` / deep `#0C6A44` | 승인 완료, 정상, 검토 완료 |
| `danger` | 레드 `#C22A3E` / soft `#FBE0E4` / deep `#971F30` | 긴급 알림, AI 고위험, 중복 발주 |

차트는 단일 색조(액센트 인디고)의 명도 단계 램프만 쓴다: `--ot-chart-1` `#2740C4` →
`--ot-chart-5` `#D6DBFC`, 그 외 계열은 `--ot-chart-rest` `#E2E5F0`. 이중 축을 쓰지 않는다.

숫자(금액, 단가, 사업자번호, 일시)는 `.ot-mono`(`"Geist Mono"` 등 모노스페이스)로
자릿수를 맞춘다. 본문에는 모노를 쓰지 않는다 — CLAUDE.md 폰트 고정 규칙(Pretendard)은
UI 서체에 대한 것이고, 자릿수 정렬용 모노는 그 예외로 이미 assetflow에서도 쓰인 패턴이다.

## Shape

- 반경: 인풋/버튼/작은 배지 컨테이너 `6px`, 카드/패널/드로어 `10px`, 완전한 pill(배지,
  아바타, 세그먼트 액티브)만 `9999px`. 세 단계 외에는 쓰지 않는다.
- 그림자: 단일 두꺼운 drop-shadow 금지. `--ot-shadow`(미세 3단 스택)와
  `--ot-shadow-pop`(드로어/팝오버용, 살짝 더 진하게)만 사용, 배경색에 맞춰 잉크 틴트.
- 폰트 굵기 천장 600(타이틀도 600). 700/800은 로그인 화면의 로고 워드마크에만 예외.

## Typography

Pretendard 고정(워크스페이스 폰트, `next/font` 없이 이미 `app/globals.css`에 등록됨).
Display/Heading/Title/Body/Caption 위계를 B2B 콘솔 밀도에 맞게 축소:

| Role | Size / Line | Weight | 용도 |
| --- | --- | --- | --- |
| Page Title | 24 / 32 | 600 | PageHead 타이틀 |
| Section Title | 15 / 22 | 600 | CardHead, 패널 제목 |
| Body | 14 / 22 | 400 | 본문, 설명 |
| Label | 13 / 20 | 500 | 폼 라벨, 배지, 테이블 헤더 |
| Caption | 12 / 16 | 500 | 보조 정보, 타임스탬프 |

`word-break: keep-all; overflow-wrap: break-word;`를 루트에 걸어 한글 어절 중간 줄바꿈을
막는다(assetflow와 동일 이유).

## 사진 매핑

picsum.photos는 인물/풍경/데스크테리어 위주라 알루미늄 환봉/스테인리스 파이프/골판지
박스처럼 구체적인 원자재/포장재 사진과 정확히 맞는 id가 없다(id 24, 60, 106, 341, 431,
1074 등 여러 후보를 실제로 열어 확인했지만 각각 오래된 책, 데스크 플랫레이, 분홍 꽃,
태블릿 터치, 커피잔, 암사자 얼굴이었다 — 전부 폐기). assetflow의 랙서버 사진 부재 사례와
동일한 상황이라 같은 규칙을 따른다: **맞는 사진이 없는 자리는 사진을 비우고 카테고리
글리프 타일(`PhotoThumb`의 fallback)로 대체한다.**

| id | 실제 내용(손으로 확인) | 쓰이는 곳 |
| --- | --- | --- |
| 1048 | 아래에서 올려다본 유리 오피스 타워 | 로그인 화면 우측 브랜드 패널(신뢰감 있는 기업 이미지로 사용, 실제 컨테이너 야적장이 아님을 명시) |

품목 목록(알루미늄 환봉, STS304 파이프, 골판지 박스)과 스레드 첨부파일은 모두 사진 없이
`Cube`/`FileText` 글리프 타일로 표시한다. 발주 스레드의 이미지 첨부 예시("1차
출고사진")는 실제로 매칭되는 사진이 없어 이미지 첨부 대신 `xlsx` 출고확인서 문서
첨부로 바꿨다. 로고, 아바타, 빈 상태도 사진 대신 이니셜 모노그램/카테고리 글리프
타일을 쓴다.

## 기기 프레임 안쪽 규칙

해당 없음 — Web 콘솔이라 모바일 기기 프레임을 쓰지 않는다.

## Motion

- `MOTION_INTENSITY 4`: 화면 전환은 filmate 철학을 재사용해 `opacity + y:6→0`,
  spring(stiffness 300, damping 30). 스레드 타임라인 항목은 등장 시 같은 스프링으로
  8ms씩 stagger.
- 인터랙션 피드백은 `transform`/`opacity`만 애니메이션(‑translate‑y-[1px] 또는
  scale-[0.99] on active). 무한 루프 모션은 알림 배지의 실시간 점(`ot-live-dot`) 하나뿐이고
  실제 상태(안읽음)를 의미할 때만 쓴다.
- `prefers-reduced-motion: reduce`에서 모든 진입 애니메이션과 live-dot pulse를 끈다.

## 정보 구조 요약

사이드바 5개 섹션(원청 관점 통합 뷰로 구성, 역할 스위처로 표시만 전환):
통합 대시보드, 품목/단가, AI 이상 발주, 거래 통계, 알림 센터. 발주 상세(스레드)는
사이드바 항목이 아니라 대시보드/알림/AI 센터에서 특정 발주를 클릭해 진입하는 상세 화면이다
(뒤로가기로 원래 화면에 복귀). 로그인 화면은 역할 3종(원청/납품처/거래처) 중 하나를
선택해 들어가고, 이후 화면은 선택한 역할에 따라 상단 배지만 바뀌고 동일한 콘솔을 보여준다
(포트폴리오 목업 범위 — 역할별 완전히 분리된 권한 렌더링은 구현하지 않음, `spec.md`
Non-goals에 준해 mock 데이터로 화면 완성도 우선).

## 관리자(CMS) 분리 (`orderlog-admin`)

마스터(관리자) 권한은 이 콘솔의 로그인 옵션에도, 사이드바에도 없다. `spec.md`의
"관리자(CMS)는 별도 프로젝트" 절대로 `projects/b2b/orderlog-admin/`
(`/b2b/orderlog-admin`)라는 별도 URL·별도 로그인으로 완전히 분리했다 — 같은 b2b
카테고리의 `assetflow` / `assetflow-admin`과 동일한 얇은-엔트리 구성이다.

- 실제 화면(로그인, 셸, 계정/거래처/AI 룰/로그 CMS)은 전부
  `projects/b2b/orderlog/components/admin/`에 있고, `orderlog-admin/src/index.tsx`는
  URL을 하나 더 얻기 위한 엔트리일 뿐이다. `lib/mock-data.ts`·`lib/types.ts`·
  `components/ui.tsx`·`styles/orderlog.css`는 이 프로젝트 것을 그대로 가져다 쓴다
  (데이터를 두 벌로 복제하지 않기 위한 의도적인 의존이며, 반대 방향 의존은 없다).
- 관리자 콘솔은 원청/납품처/거래처 로그인과 다른 자체 로그인 화면
  (`admin-login.tsx`, 자격증명 + SMS 인증 2단계)을 쓴다 — "로그인한 사람도 다를
  수 있다"는 요구사항대로 마스터 계정은 이 콘솔의 세션과 완전히 분리된 세션을 가진다.
- 관리자 셸(`admin-shell.tsx`)은 사이드바 없이 `--ot-nav-*` 다크 톤 헤더 하나로
  구성했다 — CMS 콘텐츠 자체가 이미 탭(계정/권한, 거래처, AI 룰, 로그 조회) 4개로
  나뉜 단일 화면이라 별도의 좌측 섹션 내비게이션은 불필요한 중복이었다.
- 관리자 콘솔에서 원청 콘솔의 다른 화면(예: 품목 관리)으로 이동하는 버튼은 두지
  않는다 — 별도 서비스라는 신호를 유지하기 위해 역방향 진입점을 만들지 않는다
  (locly/locly-admin과 동일한 원칙).
