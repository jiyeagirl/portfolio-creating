# LUMI — Design Notes

## Design read

소비자용 모바일 프로덕트 UI(단일 페이지 프로토타입) + 운영자용 엔터프라이즈 콘솔.
"밤하늘·달빛"의 신비로운 정서를 쓰되, 결제와 예약이 오가는 서비스이므로 신뢰감 있는
프로덕트 UI 문법을 우선한다. 점술 앱이 쉽게 빠지는 보라색 네온·글로우·별가루 장식은
쓰지 않는다.

Dials: `DESIGN_VARIANCE 6` / `MOTION_INTENSITY 4` / `VISUAL_DENSITY 5`
(모바일 앱 화면은 랜딩페이지보다 조밀하다. 모션은 화면 전환 진입 페이드와 통화 타이머
같이 상태를 설명하는 곳에만 쓴다.)

## Tokens (`styles/lumi.css`)

| 역할 | Light | Dark |
| --- | --- | --- |
| canvas | `#f5f5f8` | `#121120` |
| surface | `#ebeaf1` | `#1a1930` |
| elevated | `#ffffff` | `#211f39` |
| ink | `#191730` | `#eceaf5` |
| muted | `#6b6885` | `#9c98b5` |
| border | `#e2e0ea` | `#2c2a47` |
| accent | `#4b3ba9` | `#a396ff` |
| live (즉시 상담) | `#b06a12` | `#e0a458` |

- 액센트는 하나(`--lm-accent`)만 쓴다. 주황 계열은 "즉시 상담 가능 / 통화 중"이라는
  실제 상태에만 쓰는 상태색이고 장식으로 쓰지 않는다.
- 그라디언트는 사진 위 가독성 확보용 스크림에만 쓴다.

## Shape

- 카드 16px, 인풋·버튼 12px, 칩·필터·상태 배지는 full pill. 이 규칙 밖의 반경은 쓰지
  않는다.
- 그림자는 배경 색상 계열로 틴트한 `--lm-shadow` 하나만 쓴다.

## Typography

Pretendard 고정(워크스페이스 규칙). 숫자는 `.lm-num`으로 tabular-nums를 강제해서
잔여 시간·금액·평점이 흔들리지 않게 한다.

## 상담사 아바타

실존 인물로 오인될 얼굴 사진 대신, 상담사마다 **고정된 상징 이미지 한 장**을
`assets/avatars/`에 두고 원형으로 쓴다. 46px 원형에서도 서로 구분되도록 지배 색상이
겹치지 않게 골랐다.

| 상담사 | 파일 | picsum id | 실제 내용 |
| --- | --- | --- | --- |
| 백담 (사주) | `baekdam.jpg` | 24 | 펼쳐진 낡은 책 |
| 하람 (사주) | `haram.jpg` | 943 | 황금빛 안개 속 사슴 |
| 강월 (사주) | `gangwol.jpg` | 765 | 별 하나 뜬 어두운 지평선 |
| 도현 (사주) | `dohyeon.jpg` | 826 | 안개 낀 운하 |
| 유안 (사주) | `yuan.jpg` | 1032 | 붉은 협곡 |
| 소윤 (타로) | `soyun.jpg` | 950 | 보랏빛 바다 수평선 |
| 서린 (타로) | `seorin.jpg` | 1079 | 어둠 속 빛의 고리 |
| 이설 (타로) | `iseol.jpg` | 888 | 분홍 보라 구름 |
| 태오 (타로) | `taeo.jpg` | 407 | 손에 든 스파클러 |
| 청연 (신점) | `cheongyeon.jpg` | 953 | 붉은 벽돌 원형 천장의 빛 |
| 무영 (신점) | `muyeong.jpg` | 738 | 짙은 녹색 배경의 흰 칼라 |
| 연화 (신점) | `yeonhwa.jpg` | 306 | 검은 물 위의 흰 수련 |

## 사진 매핑 (직접 확인한 고정 id, `assets/`에 로컬 저장)

| 파일 | picsum id | 실제 내용 | 쓰이는 곳 |
| --- | --- | --- | --- |
| `hero-moonlit-desert.jpg` | 884 | 달이 뜬 밤의 사막 바위 | 홈 히어로 |
| `cat-saju-books.jpg` | 998 | 끈으로 묶은 고서와 만년필, 잉크병 | 사주 카테고리 |
| `cat-tarot-dreamcatcher.jpg` | 104 | 깃털 달린 드림캐처 | 타로 카테고리 |
| `cat-sinjeom-lantern.jpg` | 460 | 한자 적힌 한지 등 | 신점 카테고리 |
| `promo-milkyway-figure.jpg` | 903 | 은하수 아래 선 사람 | 이벤트 배너 |
| `pass-startrail.jpg` | 981 | 바위 위 별 궤적 | 상담권 라인업 헤더 |
| `mood-phone-sunset.jpg` | 816 | 노을 앞에서 휴대폰을 든 손 | 전화 상담 안내 |
| `theme-heart-sunset.jpg` | 815 | 노을을 감싼 하트 손 모양 | 연애·궁합 테마 |
| `theme-sea-view.jpg` | 1005 | 바다를 바라보는 뒷모습 | 직장·진로 테마 |
| `theme-lotus.jpg` | 306 | 연못 위 하얀 수련 | 신년·운세 테마 |
| `cover-arcade.jpg` | 546 | 따뜻한 빛이 든 석조 회랑 | 상담사 상세 커버 |
| `mood-clock.jpg` | 357 | 아날로그 탁상시계 | 상담 시간 안내 |
| `mood-reading.jpg` | 832 | 어두운 실내에서 책을 읽는 사람 | 후기 섹션 |
| `call-tunnel-light.jpg` | 137 | 끝에 빛이 보이는 나선 터널 | 통화 연결 화면 |
| `mood-horizon-blue.jpg` | 774 | 푸른 바다 수평선 | 마이페이지 헤더 |
| `mood-morning-mug.jpg` | 691 | 침대 곁 머그컵 | 오늘의 운세 카드 |

id를 바꾸면 문구와 사진이 어긋나므로, 교체할 때는 이 표도 같이 고친다.

## 기기 프레임 안쪽 규칙

하단 탭바, 스티키 CTA 바, 앱바는 모두 **불투명 배경**을 쓴다. `backdrop-blur`를 걸면
Chromium에서 기기 화면의 `overflow-hidden` + 둥근 모서리 클리핑을 벗어나 흰색이
섀시 밖으로 삐져나온다. 워크스페이스 `CLAUDE.md`의 "Portfolio Mobile Output" 항목과
같은 규칙이다.

## Motion

- 화면 전환: 6px 상승 + 페이드 220ms. 그 이상은 쓰지 않는다.
- 통화 화면의 링 펄스와 타이머만 지속 애니메이션을 갖는다. 상태를 설명하는 모션이다.
- 전부 `prefers-reduced-motion`에서 즉시 정지한다(`styles/lumi.css`).

## 관리자 콘솔

같은 토큰을 쓰되 밀도를 올린다(VISUAL_DENSITY 7). 카드 남용 대신 1px 라인과
데이터 테이블, 마스터-디테일 레이아웃을 쓴다. 사진은 쓰지 않는다.
