# SnowPeak — Design Notes

## 적용 규칙

- 디자인시스템 지정 없음(spec.md) — `design-systems/`는 참조하지 않는다. 색상/무드는 이 문서에서 스키 리조트 컨셉에 맞춰 직접 설계.
- 스타일: `high-end-visual-design` skill 적용. 다만 CLAUDE.md 우선순위 규칙에 따라 폰트(Pretendard 고정)·기기 프레임(iPhone 16 Pro 단일)·8px 그리드는 skill보다 이 워크스페이스 규칙이 우선한다. skill에서는 아래만 차용: Soft Structuralism 아카이브(에어리한 화이트/그레이 베이스 + 볼드 타이포 + 디퓨즈 섀도), 매크로 화이트스페이스, 버튼-인-버튼 트레일링 아이콘(주요 CTA), 스크롤 진입 시 fade-up 리빌.
- 나머지는 `design-taste-frontend`(v2) 기본값 + CLAUDE.md UI Generation Rules를 따른다.
- Dial: `DESIGN_VARIANCE 7 / MOTION_INTENSITY 6 / VISUAL_DENSITY 4` — 프리미엄 여행/호스피탈리티 예약 플로우, 정보 밀도는 중간(가격·재고 표시는 필요하지만 카탈로그 앱 수준의 여백 유지).
- `--with-admin`: 관리자 콘솔은 별도 프로젝트 `commerce/snowpeak-admin`(URL: `/commerce/snowpeak-admin`)으로 분리. 실제 화면 코드는 본 프로젝트 `components/admin/`에 있고, `-admin`은 URL만 담당하는 얇은 엔트리다. 사용자 콘솔에는 관리자 진입점(내비 항목, 로그인 역할 선택)을 두지 않는다. `-admin` 프로젝트는 자체 `styles/`·`design.md` 없이 본 프로젝트 토큰을 그대로 상속한다.
- **날짜 기준일(중요, 수정 시 반드시 확인)**: 이 프로젝트의 목업 "오늘"은 **2023-10-15**로 고정한다(포트폴리오 프로젝트 진행 기간 2023.03~2023.10에 맞춤). 가입일/결제일/공지사항/알림/ERP 로그 등 과거성 날짜는 전부 2023-03-01~2023-10-15 안에 들어가고, 체크인/체크아웃처럼 미래를 향하는 예약 날짜만 다가오는 겨울 시즌(2023-12-01~2024-02-29)으로 자연스럽게 이어진다. `admin-shell.tsx` 헤더의 `2023. 10. 15` 표시, `admin-dashboard.tsx`/`admin-inventory.tsx`/`admin-members.tsx`/`admin-products.tsx`의 기준일 비교, `wallet-screen.tsx`의 `isCouponExpired` 비교값이 전부 이 기준일과 일치해야 한다. 새 목업 날짜를 추가할 때 임의로 2025~2027년대를 쓰지 않는다 — 과거성이면 이 창 안에서, 예약/시즌권처럼 미래형이면 다가오는 겨울 시즌 범위 안에서 고른다.

## Tokens / 팔레트

컨셉: **알파인 프로스트(Alpine Frost)** — 설산의 차가운 화이트/그레이 뉴트럴 위에, 빙하 크레바스를 연상시키는 코발트 블루 한 가지만 포인트로 얹는다(2026-08-03, 기존 알펜글로우 오렌지에서 블루 계열로 리브랜드). 프리미엄 여행 예약 서비스답게 라벤더/퍼플 계열 AI 톤은 배제.

컴포넌트 스코프 CSS 변수(`--sp-*`), 워크스페이스 전역 토큰은 건드리지 않음:

| Token | Value | 용도 |
|---|---|---|
| `--sp-bg` | `#F6F7F9` | 앱 배경 (차가운 프로스트 화이트) |
| `--sp-surface` | `#FFFFFF` | 카드/시트 표면 |
| `--sp-surface-soft` | `#EEF1F4` | 인풋/칩 등 리세스 표면 |
| `--sp-ink` | `#131A22` | 주요 텍스트 (알파인 나이트 네이비블랙) |
| `--sp-body` | `#4B5563` | 본문 보조 텍스트 |
| `--sp-mute` | `#8A94A3` | 3차 텍스트, placeholder |
| `--sp-border` | `#E3E7EC` | 미세 구분선 |
| `--sp-border-strong` | `#CBD2DA` | 강조 구분선, 포커스 링 |
| `--sp-accent` | `#2F63D6` | 알파인 프로스트 코발트블루 — CTA, 가격 강조, active 상태 전용 포인트 |
| `--sp-accent-soft` | `#E1E8FB` | 포인트 틴트 배경(배지 등) |
| `--sp-accent-deep` | `#1D3F99` | 포인트 hover/press |
| `--sp-info` | `#0E9C8E` | 정보/확정 상태(accent와 같은 계열이 되지 않도록 틸로 분리) |
| `--sp-info-soft` | `#DEF3EF` | " |
| `--sp-success` | `#1F9D6C` | 결제완료/체크인 상태 |
| `--sp-success-soft` | `#E1F5EC` | " |
| `--sp-warn` | `#C98A16` | 대기/재고부족 상태 |
| `--sp-warn-soft` | `#FBF0D9` | " |
| `--sp-danger` | `#D14343` | 취소/환불/오류 상태 |
| `--sp-danger-soft` | `#FBE4E4` | " |

포인트 컬러는 `--sp-accent` 한 가지만 사용. 상태 배지는 5단계 톤(neutral/info/success/warn/danger) 구조로 고정하고 색을 임의로 늘리지 않는다.

**관리자 콘솔**은 `assetflow` 구조 관례(잉크 반전 다크 사이드바)를 그대로 따르되, `--sp-ink`(#131A22)를 다크 레일 배경으로 재사용해 "야간 산장" 톤을 연결한다:

| Token | Value | 용도 |
|---|---|---|
| `--sp-rail` | `#131A22` | 관리자 사이드바 배경 |
| `--sp-rail-hover` | `#1D252F` | 사이드바 hover |
| `--sp-rail-active` | `#232D39` | 사이드바 active 아이템 |
| `--sp-rail-border` | `#232A33` | 사이드바 내부 구분선 |
| `--sp-rail-mute` | `#8A94A3` | 사이드바 비활성 텍스트 |
| `--sp-rail-fg` | `#F5F7FA` | 사이드바 활성/강조 텍스트 |

차트 램프(단일 색조 5단계, 라이브러리 없이 직접 구현):

| Token | Value |
|---|---|
| `--sp-chart-1` | `#D6E3FB` |
| `--sp-chart-2` | `#A9C4F5` |
| `--sp-chart-3` | `#6E96EC` |
| `--sp-chart-4` | `#2F63D6` |
| `--sp-chart-5` | `#1D3F99` |

## Shape

- 모바일: 카드 16px, 리스트 아이템/작은 카드 12px, 인풋 12px, 버튼·칩·배지는 `full`(필 형태 — 프리미엄 여행 예약 앱 관례).
- 관리자(web): `_reference-ui.tsx` 구조 그대로 재사용 — 버튼/인풋 6px, 카드 8px, 배지 `full`. 단일 두꺼운 drop-shadow 금지, 미세 3단 섀도 스택만.
- 모바일 섀도(디퓨즈, high-end-visual-design의 Soft Structuralism 반영): 카드 `0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)`. 리스트 로우처럼 얕은 요소는 `0 1px 2px rgba(19,26,34,.05)`만.

## Typography

- Pretendard 고정, filmate 레퍼런스 스케일 그대로 재사용(구조적 값): Display 34/40·700, Title1 24/30·700, Title2 19/24·600, Body 15/22·400, Callout 13/18·500, Micro 11/14·500.
- 가격·날짜·재고 수량·예약번호는 `tabular-nums` 유틸로 정렬 고정.
- 이모지/중간점(·)/em dash 금지 — CLAUDE.md 규칙 그대로. 짧은 복합 라벨은 슬래시(`리프트권 / 시즌권`), 문장 내 나열은 쉼표, 이질적 메타 스트립은 파이프(`|`).

## 사진 매핑

Lorem Picsum 고정 id, 실제 다운로드 후 육안 검증(2회 서브에이전트 조사). **중요한 판단**: Picsum 세트 전체(약 0–1080)를 폭넓게 훑어봤지만 호텔 객실/욕실/스파 인테리어, 스키 장비 클로즈업에 정확히 부합하는 사진이 존재하지 않았다. 억지로 끼워맞추지 않고, 객실 카드의 대표 이미지는 **"객실에서 보이는 뷰"(마운틴뷰/레이크뷰) 사진**으로 설계했다 — 실제 리조트 예약 서비스에서도 흔한 패턴이라 정직하고 자연스럽다. 시설/편의(조식 포함, 벽난로, 스파 등) 속성은 사진 대신 Phosphor 아이콘 칩으로 표기(CLAUDE.md의 "사진이 필요한 화면"이 아니라 속성 태그이므로 아이콘 사용이 정당함).

Picsum 세트에는 곤돌라/리프트, 실제 스키·보드 액션, 야간 리조트 빌리지처럼 "타는 사람"이 있는 사진이 없다. 이 항목은 **Pexels / Unsplash**에서 별도로 조사해 채웠다(둘 다 상업적 이용 무료, 저작자 표시 불필요). 후보를 실제로 다운로드해 육안 검증했고, 특정 실명 리조트를 식별할 수 있는 로고·간판·독자적 건축물이 찍힌 사진은 제외했다(예: `BURTON` 바인딩 로고가 선명한 클로즈업 컷, 리지/쿨름 같은 특정 정상 건물이 뚜렷하게 잡힌 파노라마는 후보에서 탈락).

| URL | 실제 내용 | 사용처 |
|---|---|---|
| `https://images.pexels.com/photos/29952995/pexels-photo-29952995.jpeg` | 붉은 곤돌라 캐빈 여러 대가 설사면 위 케이블을 타고 이동, 맑은 하늘 (Pexels, Tahir Osman) | 메인 배너 1 / 리프트권 탭 히어로 |
| `https://images.pexels.com/photos/5699888/pexels-photo-5699888.jpeg` | 스노보더가 파우더 눈을 튀기며 활강하는 액션 컷 (Pexels, Bert Christiaens) | 메인 배너 2 |
| `https://images.unsplash.com/photo-1764067656521-ed9d4994f3d9` | 눈 덮인 알파인 마을 항공뷰, 해질 녘 조명이 켜진 샬레들 (Unsplash, Livia) | 메인 배너 3 |
| `https://images.pexels.com/photos/19771985/pexels-photo-19771985.jpeg` | 체어리프트 라인이 여러 봉우리를 가로지르는 리조트 슬로프 항공뷰, 스키어들이 점점이 활강 (Pexels) | 시즌권 탭 히어로 |

Pexels/Unsplash 무료 라이선스, 실명 리조트 비식별 확인 완료. 위 사진들이 대체한 자리 외에 id 41/599/128/249/79는 다른 화면(객실 히어로, 패키지, 장비 렌탈 등)에서 계속 쓰이므로 그대로 둔다.

**2차 추가(현재 패스)**: "객실 카드가 빈 배경처럼 보인다", "장비 렌탈 카드가 실제 장비를 안 보여준다", "시즌권 탭 사진이 흐린 하늘의 미니멀 구도라 빈 배경 같다"는 피드백에 따라 아래 사진을 추가 조사했다. 위 시즌권 탭 행(`30667511`, 흐린 하늘 체어리프트 단독 실루엣)은 이번 패스로 교체되어 더 이상 코드에서 쓰이지 않는다 — 표에는 새 사진으로 갱신해 반영했다.

객실/렌탈 히어로/렌탈 장비 후보 중 실명 로고·간판이 선명하게 잡힌 사진은 기존 `BURTON` 케이스와 같은 기준으로 탈락시켰다: 스키 표면에 `ATOMIC` 로고가 선명한 컷, 스키 부츠에 `LANGE` 로고가 선명한 컷, 헬멧에 `TSG`/`BOLLÉ` 로고가 선명한 컷, 팬츠에 `MILLET` 로고가 보이는 컷, 스노보드에 `VÖLKL` 로고와 `THE GONDOLA`라는 특정 리프트 명칭 간판이 함께 잡힌 컷, 스키에 `NORDWAY` 로고가 선명한 컷, 렌탈샵 앞 스키 랙 컷(`ATOMIC` 로고 + `BIGLIETTERIA`/`TICKET OFFICE` 간판)이 모두 탈락 목록이다. 이탈리아 돌로미티 지역으로 추정되는, 정상에 특정 종탑 성당 건물이 뚜렷하게 잡힌 파노라마도 리지/쿨름 케이스와 같은 이유로 탈락시켰다.

| URL | 실제 내용 | 사용처 |
|---|---|---|
| `https://images.pexels.com/photos/30018600/pexels-photo-30018600.jpeg` | 다채로운 색상의 스키복을 입은 스키어들과 만석 체어리프트, 겹겹의 설산 능선 (Pexels) | 디럭스 마운틴뷰 객실 카드 |
| `https://images.pexels.com/photos/19771980/pexels-photo-19771980.jpeg` | 알파인 리조트 마을과 다수의 스키어가 흩어져 활강하는 슬로프, 눈 쌓인 샬레 건물들 (Pexels) | 스위트 레이크뷰 객실 카드 |
| `https://images.pexels.com/photos/21235823/pexels-photo-21235823.jpeg` | 체어리프트와 베이스 구역 마켓 부스, 다수의 인파, 겹겹의 설산 배경 (Pexels) | 프리미어 스위트 객실 카드 |
| `https://images.pexels.com/photos/35923083/pexels-photo-35923083.jpeg` | 체어리프트 아래 슬로프를 함께 이동하는 스키어 그룹, 흐린 하늘 (Pexels) | 온돌 패밀리룸 객실 카드 |
| `https://images.pexels.com/photos/937692/pexels-photo-937692.jpeg` | 곤돌라 캐빈 두 대가 지나가는 슬로프를 활강하는 스키어, 파우더 스프레이, 맑은 하늘 (Pexels) | 장비 렌탈 화면 상단 배너 |
| `https://images.pexels.com/photos/10692419/pexels-photo-10692419.jpeg` | 초록/검정 바인딩의 스키 한 쌍이 눈 둔덕에 세워진 모습, 뒤로 침엽수림 (Pexels) | 장비 렌탈(올라운드 스키 세트) |
| `https://images.pexels.com/photos/6141665/pexels-photo-6141665.jpeg` | 스노보드를 옆구리에 끼고 걷는 스노보더, 산 능선 배경 (Pexels) | 장비 렌탈(파크 스노보드 세트) |
| `https://images.pexels.com/photos/20146487/pexels-photo-20146487.jpeg` | 스노보드 부츠를 신은 발과 바인딩에 고정된 보드를 위에서 내려다본 구도 (Pexels) | 장비 렌탈(스키/보드 겸용 부츠) |
| `https://images.pexels.com/photos/6699212/pexels-photo-6699212.jpeg` | 검정 헬멧과 고글을 쓴 스키어 옆모습, 핑크 재킷, 배경에 흐릿한 스노보더 (Pexels) | 장비 렌탈(세이프티 헬멧) |
| `https://images.pexels.com/photos/14653036/pexels-photo-14653036.jpeg` | 청록색 스키 재킷과 흰 팬츠, 흰 헬멧을 착용하고 슬로프를 활강하는 스키어 (Pexels) | 장비 렌탈(방한 상하의 세트) |

**주의 — 소스 오브 트루스 분리**: 아래 picsum id 표의 `41`/`575`/`128`/`599`(객실 `viewPhoto`)와 `249`/`925`/`1044`/`79`/`95`(장비 렌탈 `photo`)는 `lib/mock-data.ts`에는 여전히 값이 남아 있지만, 위 2차 추가 이후로는 각 화면 파일에 정의된 로컬 override map(`room-list-screen.tsx`의 `ROOM_PHOTO`, `rental-screen.tsx`의 `GEAR_PHOTO`/`RENTAL_HERO_PHOTO`)이 실제 렌더링에 쓰인다. 즉 화면에는 이 표의 picsum 사진이 아니라 위 Pexels 표의 사진이 보인다 — mock-data의 값 자체는 타입 요구사항(필드 존재) 때문에 남아있을 뿐 더 이상 live 소스가 아니다. 나중에 이 화면들을 편집할 때 mock-data의 picsum id를 고치는 것이 아니라 각 화면 파일의 override map을 고쳐야 한다.

**정정(2026-08-03)**: 아래 표의 id 41은 실제로는 물방울 클로즈업 사진이다(라벨 오기, 육안 재검증으로 발견). 검증된 Pexels 사진으로 교체:
- 로그인 배경 → `https://images.pexels.com/photos/8412637/pexels-photo-8412637.jpeg`(스키 리조트 정상 스테이션과 리프트가 보이는 설산 파노라마, 맑은 하늘)
- 예약 허브 객실 히어로 카드(`book-hub-screen.tsx`) → `https://images.pexels.com/photos/8412597/pexels-photo-8412597.jpeg`(침엽수림 사이 곤돌라 리프트와 설산 슬로프, 리조트 베이스 스테이션)

둘 다 식별 가능한 로고/간판 없음 확인. **디럭스룸 갤러리**(`room-detail-screen.tsx`의 `galleryPhotos`)는 여전히 id 41(물방울)을 mock-data에서 직접 참조 중 — 이번 요청 범위 밖이라 손대지 않았지만 같은 오류이므로 다음 편집 때 함께 고칠 것.

**버그(2026-08-03, 함께 발견 및 수정)**: `PhotoTile`은 자체 클래스에 `relative`를 항상 포함한다. 호출부에서 `className="absolute inset-0"`만 주면 Tailwind의 position 유틸 순서상 `relative`가 `absolute`를 항상 이긴다(같은 명시도에서 소스 순서가 아니라 코어 플러그인 정의 순서로 캐스케이드가 결정됨) — 즉 `inset-0`이 있어도 실제로는 `position: relative`로 렌더되어 크기 기준이 없어지고, `fill` 이미지의 부모 높이가 0이 되어 사진이 통째로 안 보인다. `book-hub-screen.tsx`(객실 히어로), `lift-season-screen.tsx`(탭 히어로), `rental-screen.tsx`(렌탈 히어로) 세 곳이 이 패턴이었다 — 물방울 사진(id 41)이 아니라 애초에 어떤 사진을 넣어도 안 보였을 구조적 버그. `className="absolute inset-0 h-full w-full"`처럼 명시적 `h-full w-full`을 항상 같이 줘서 해결(로그인 배경 히어로와 `home-screen.tsx`의 기존 패턴과 동일). 앞으로 `PhotoTile`에 `absolute inset-0`만 단독으로 주지 않는다.

| id | 실제 내용 | 사용처 |
|---|---|---|
| 41 | 물방울 클로즈업(라벨은 "눈 덮인 산맥 파노라마"였으나 오기) | 디럭스룸(마운틴뷰) 갤러리 — 로그인 배경 / 예약 허브 객실 히어로는 위 Pexels 사진으로 교체됨 |
| 599 | 안개 낀 호수 위 만년설 봉우리, 여명 | 온돌·패밀리룸(레이크뷰) 대표컷 |
| 128 | 유럽풍 대형 고성, 잔디 진입로 | 예약 허브 패키지 카드 / 프리미어 스위트 대표컷 / 프리미엄 패키지 |
| 575 | 눈 덮인 산맥이 고산 호수에 반영 | 스위트 레이크뷰 대표컷 / 패키지 상품 |
| 365 | 흰 침구 위 티컵·노트·마른꽃, 아침 햇살 (침구 디테일) | 객실 상세 페이지 보조 컷(침구 무드) |
| 475 | 안개에 반쯤 가린 눈줄기 산봉우리, 극적 분위기 | 이벤트/공지 배너 |
| 232 | 밤에 눈 내리는 가로등, 리본 장식 | 공지사항 배너(시즌 이벤트) |
| 188 | 눈 쌓인 마을 지붕, 해질녘 | 마을/리조트 소개 배너 |
| 510 | 흰 벽 빨간 지붕 교회, 뒤로 설산 | 커플/허니문 패키지 |
| 1004 | 눈밭에서 포옹하는 커플 실루엣, 야간 | 커플 패키지 상세 |
| 249 | 안개 낀 설산, 전경 침엽수 | 장비 렌탈(올라운드 스키 세트) |
| 79 | 흑백, 능선 트레커 + 설산 배경 | 장비 렌탈(세이프티 헬멧) |
| 925 | 안개 자욱한 침엽수림 | 장비 렌탈 화면 배경 |
| 1044 | 안개 낀 침엽수 협곡 계류 | 장비 렌탈 상세 배경 |
| 192 | 통유리 라운지, 실루엣, 펜던트 조명 (흑백) | 부대시설 - 라운지 |
| 649 | 미니멀 원목 다이닝룸, 큰 창 | 부대시설 - 다이닝 |
| 43 | 러스틱 원목 카페 테이블, 에스프레소 | 부대시설 - 카페 |
| 95 | 안개 속 겨울나무, 저채도 | 마이페이지/공지 리스트 헤더 배경 |
| 66 | 초록 계곡의 산악 마을 (여름) | 관리자 로그인 화면(선택적 배경 무드) |

## 기기 프레임 안쪽 규칙

- `PhoneFrame`이 `overflow-hidden` + `rounded-[50px]`로 화면을 클립한다. 하단 탭바, 상단 스티키 헤더, 하단 통합 장바구니 요약 바 등 화면 가장자리에 걸치는 바는 **항상 불투명 서페이스**(`bg-[var(--sp-surface)]`)를 쓰고 `backdrop-blur`는 절대 사용하지 않는다(코너 클리핑을 뚫고 흰 테두리가 새어나오는 크로미움 버그 방지).
- 가장자리 고정 UI는 화면 박스 안쪽에 `absolute`로만 배치, `fixed`나 음수 오프셋 금지.

## Motion

- 화면 전환: filmate 레퍼런스 그대로 재사용 — `x: 32→0` + fade, 스프링(stiffness 300 / damping 30).
- 홈/카탈로그 섹션 스크롤 리빌: `translate-y-6 opacity-0` → `translate-y-0 opacity-100`, `whileInView`, 500ms, `cubic-bezier(.16,1,.3,1)`. `IntersectionObserver` 기반(Motion `whileInView`), `window.scroll` 리스너 금지.
- 주요 CTA(예약하기/결제하기)는 버튼-인-버튼 트레일링 아이콘 패턴(원형 아이콘 캡슐)을 필 버튼 안에 적용, press 시 `scale .97`.
- 관리자(web) 진입 트랜지션: `_reference-ui.tsx` 관례 그대로 `420ms cubic-bezier(.16,1,.3,1)`.
- 전부 `transform`/`opacity`만 애니메이션(GPU-safe), `prefers-reduced-motion`은 워크스페이스 전역 CSS로 이미 처리됨.
