import type {
  Asset,
  Bid,
  Deal,
  Inspection,
  NoticeItem,
} from "@/projects/b2b/assetflow/lib/types";

/**
 * 전부 mock. 실제 인증, 결제, AI 시세 산출, 백엔드 연동은 구현하지 않는다.
 *
 * 기업/리셀러명은 워크스페이스 규칙에 따라 알파벳 기반으로 익명화했다.
 * 제조사도 같은 규칙을 따른다(K전자, M테크, N시스템즈, P네트웍스, S디스플레이).
 *
 * 사진은 직접 확인한 picsum 고정 id만 쓴다. 표는 design.md에도 있다.
 *   0   책상 위 맥북과 커피      → 노트북
 *   2   원목 테이블 위 맥북 에어  → 노트북
 *   48  덮은 맥북 프로           → 노트북
 *   180 위에서 본 맥북과 노트     → 노트북
 *   370 위에서 본 맥북 (원목)     → 노트북
 *   668 아이맥과 키보드          → 데스크탑
 *   60  모니터/키보드/태블릿 플랫레이 → 모니터
 *   532 키보드/헤드폰/마우스 플랫레이 → 주변기기
 * 서버/네트워크 장비에 맞는 사진이 없어서 해당 자산은 photo를 비우고
 * 카테고리 글리프 타일로 대체한다. 맞지 않는 사진을 붙이지 않는다.
 */

export const TODAY = "2026. 07. 28";

export const company = {
  name: "A테크놀로지",
  bizNumber: "214-88-01925",
  ceo: "정한결",
  address: "서울특별시 강남구 테헤란로 152, 18층",
  industry: "소프트웨어 개발 및 공급업",
  employees: "412명",
  joinedAt: "2024. 03. 11",
  tier: "Enterprise",
  manager: { name: "윤도현", role: "IT인프라팀 자산관리 파트장", email: "dohyun.yoon@atech-hq.co.kr", phone: "02-3478-2210" },
};

export const assets: Asset[] = [
  {
    id: "a1",
    code: "AF-2607-0142",
    name: "업무용 노트북 14형",
    maker: "K전자",
    model: "KB-1440U",
    category: "laptop",
    quantity: 42,
    purchasedAt: "2023. 03",
    usedMonths: 40,
    grade: "B",
    status: "bidding1",
    photo: 0,
    registeredAt: "2026. 07. 24",
    spec: "i5-1235U / 16GB / SSD 512GB / 14형 FHD",
    autoPrice: 412000,
    listPrice: 1480000,
    confidence: 92,
    factors: [
      { label: "사용 기간 40개월", impact: -38, note: "동일 모델 잔존가치 곡선상 3년 경과 구간" },
      { label: "외관 등급 B", impact: -9, note: "상판 미세 스크래치 다수, 파손 없음" },
      { label: "배터리 사이클 평균 412회", impact: -6, note: "잔여 용량 82% 추정" },
      { label: "대량 수량 42대", impact: 7, note: "동일 사양 일괄 매각 시 리셀러 물류비 절감분" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 428,000원 | 17건" },
      { label: "동일 사양 시장 매물가", value: "489,000 ~ 552,000원" },
      { label: "적용 감가 기준표", value: "노트북 v4.2 (2026. 06. 01 개정)" },
      { label: "수요 지수", value: "높음 | 최근 30일 조회 214회" },
    ],
  },
  {
    id: "a2",
    code: "AF-2607-0138",
    name: "개발용 노트북 16형",
    maker: "M테크",
    model: "MX-16 Pro",
    category: "laptop",
    quantity: 18,
    purchasedAt: "2023. 09",
    usedMonths: 46,
    grade: "C",
    status: "inspecting",
    photo: 48,
    registeredAt: "2026. 07. 21",
    spec: "i7-11800H / 32GB / SSD 1TB / 16형 QHD / 외장 GPU",
    autoPrice: 735000,
    listPrice: 2890000,
    confidence: 78,
    factors: [
      { label: "사용 기간 46개월", impact: -44, note: "고사양 모델 감가 곡선 4년 구간" },
      { label: "외관 등급 C", impact: -18, note: "힌지 유격 신고 3건, 하판 찍힘" },
      { label: "외장 GPU 탑재", impact: 12, note: "학습/렌더링 수요로 잔존가치 방어" },
      { label: "충전기 미포함 6대", impact: -3, note: "부속 누락분 차감" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 762,000원 | 9건" },
      { label: "동일 사양 시장 매물가", value: "880,000 ~ 1,040,000원" },
      { label: "적용 감가 기준표", value: "노트북(고사양) v4.2" },
      { label: "수요 지수", value: "보통 | 최근 30일 조회 86회" },
    ],
  },
  {
    id: "a3",
    code: "AF-2607-0131",
    name: "랙 서버 2U",
    maker: "N시스템즈",
    model: "NR-2200",
    category: "server",
    quantity: 6,
    purchasedAt: "2021. 11",
    usedMonths: 56,
    grade: "C",
    status: "bidding2",
    registeredAt: "2026. 07. 18",
    spec: "Xeon Silver 4210 ×2 / 128GB / SAS 1.2TB ×4 / 이중화 파워",
    autoPrice: 1240000,
    listPrice: 8600000,
    confidence: 71,
    factors: [
      { label: "사용 기간 56개월", impact: -61, note: "서버 감가 기준표상 5년 경과" },
      { label: "제조사 지원 종료 예정", impact: -14, note: "2027. 03 펌웨어 지원 종료 공지" },
      { label: "메모리 128GB 구성", impact: 9, note: "메모리 단품 회수 가치 반영" },
      { label: "이중화 파워 정상", impact: 4, note: "검수 전 자가 점검 결과" },
    ],
    basis: [
      { label: "최근 180일 동일 계열 낙찰가", value: "평균 1,180,000원 | 5건" },
      { label: "부품 단위 회수 추정가", value: "1,020,000원" },
      { label: "적용 감가 기준표", value: "서버 v3.8 (2026. 04. 15 개정)" },
      { label: "수요 지수", value: "낮음 | 최근 30일 조회 31회" },
    ],
  },
  {
    id: "a4",
    code: "AF-2607-0127",
    name: "L3 스위치 48포트",
    maker: "P네트웍스",
    model: "PS-4800",
    category: "network",
    quantity: 12,
    purchasedAt: "2022. 05",
    usedMonths: 50,
    grade: "B",
    status: "quoted",
    registeredAt: "2026. 07. 26",
    spec: "48×1G + 4×10G SFP+ / 스택 지원 / 이중 전원",
    autoPrice: 610000,
    listPrice: 3200000,
    confidence: 84,
    factors: [
      { label: "사용 기간 50개월", impact: -52, note: "네트워크 장비 감가 곡선 4년 구간" },
      { label: "외관 등급 B", impact: -7, note: "랙 마운트 자국, 포트 이상 없음" },
      { label: "스택 케이블 전량 포함", impact: 5, note: "부속 완비" },
      { label: "라이선스 이전 가능", impact: 6, note: "L3 기능 라이선스 승계 확인" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 596,000원 | 11건" },
      { label: "동일 사양 시장 매물가", value: "690,000 ~ 780,000원" },
      { label: "적용 감가 기준표", value: "네트워크 v3.1" },
      { label: "수요 지수", value: "높음 | 최근 30일 조회 178회" },
    ],
  },
  {
    id: "a5",
    code: "AF-2607-0119",
    name: "올인원 데스크탑 24형",
    maker: "K전자",
    model: "KA-2400",
    category: "desktop",
    quantity: 24,
    purchasedAt: "2023. 07",
    usedMonths: 36,
    grade: "B",
    status: "confirmed",
    photo: 668,
    registeredAt: "2026. 07. 12",
    spec: "i5-12400 / 16GB / SSD 512GB / 24형 일체형",
    autoPrice: 348000,
    listPrice: 1190000,
    confidence: 89,
    factors: [
      { label: "사용 기간 36개월", impact: -34, note: "일체형 감가 곡선 3년 구간" },
      { label: "외관 등급 B", impact: -8, note: "베젤 변색 일부" },
      { label: "일체형 물류 난이도", impact: -5, note: "포장/운송 비용 반영" },
      { label: "동일 사양 24대", impact: 6, note: "일괄 매각 프리미엄" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 341,000원 | 22건" },
      { label: "동일 사양 시장 매물가", value: "395,000 ~ 440,000원" },
      { label: "적용 감가 기준표", value: "데스크탑 v4.0" },
      { label: "수요 지수", value: "보통 | 최근 30일 조회 97회" },
    ],
  },
  {
    id: "a6",
    code: "AF-2607-0115",
    name: "27형 모니터",
    maker: "S디스플레이",
    model: "SD-2712",
    category: "peripheral",
    quantity: 60,
    purchasedAt: "2022. 12",
    usedMonths: 43,
    grade: "A",
    status: "settled",
    photo: 60,
    registeredAt: "2026. 07. 03",
    spec: "27형 QHD / IPS / 75Hz / 높이조절 스탠드",
    autoPrice: 118000,
    listPrice: 420000,
    confidence: 94,
    factors: [
      { label: "사용 기간 43개월", impact: -46, note: "모니터 감가 곡선 3.5년 구간" },
      { label: "외관 등급 A", impact: 4, note: "불량 화소 없음, 스탠드 완비" },
      { label: "수량 60대", impact: 9, note: "대량 일괄 매각 프리미엄" },
      { label: "포장재 미보유", impact: -3, note: "리셀러 재포장 비용" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 122,000원 | 34건" },
      { label: "동일 사양 시장 매물가", value: "145,000 ~ 168,000원" },
      { label: "적용 감가 기준표", value: "주변기기 v2.6" },
      { label: "수요 지수", value: "매우 높음 | 최근 30일 조회 402회" },
    ],
  },
  {
    id: "a7",
    code: "AF-2607-0108",
    name: "경량 노트북 13형",
    maker: "M테크",
    model: "MA-1330",
    category: "laptop",
    quantity: 35,
    purchasedAt: "2024. 02",
    usedMonths: 29,
    grade: "A",
    status: "bidding1",
    photo: 2,
    registeredAt: "2026. 07. 20",
    spec: "i5-1340P / 16GB / SSD 512GB / 13형 WUXGA / 1.05kg",
    autoPrice: 742000,
    listPrice: 1690000,
    confidence: 95,
    factors: [
      { label: "사용 기간 29개월", impact: -27, note: "2년 경과 구간, 감가 완만" },
      { label: "외관 등급 A", impact: 5, note: "전량 필름 부착 상태 유지" },
      { label: "배터리 사이클 평균 186회", impact: 3, note: "잔여 용량 94% 추정" },
      { label: "수량 35대", impact: 6, note: "동일 사양 일괄 매각" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 728,000원 | 26건" },
      { label: "동일 사양 시장 매물가", value: "830,000 ~ 910,000원" },
      { label: "적용 감가 기준표", value: "노트북 v4.2" },
      { label: "수요 지수", value: "매우 높음 | 최근 30일 조회 388회" },
    ],
  },
  {
    id: "a8",
    code: "AF-2607-0102",
    name: "워크스테이션",
    maker: "N시스템즈",
    model: "NW-7000",
    category: "desktop",
    quantity: 8,
    purchasedAt: "2021. 06",
    usedMonths: 61,
    grade: "C",
    status: "quoted",
    registeredAt: "2026. 07. 25",
    spec: "Xeon W-2245 / 64GB / SSD 1TB + HDD 4TB / 전문가용 GPU",
    autoPrice: 1180000,
    listPrice: 5400000,
    confidence: 69,
    factors: [
      { label: "사용 기간 61개월", impact: -63, note: "5년 초과, 잔존가치 하한 구간 진입" },
      { label: "전문가용 GPU 탑재", impact: 16, note: "GPU 단품 회수 가치 반영" },
      { label: "외관 등급 C", impact: -12, note: "측면 패널 변형 2대" },
      { label: "HDD 데이터 파기 필요", impact: -4, note: "물리 파기 비용 차감" },
    ],
    basis: [
      { label: "최근 180일 동일 계열 낙찰가", value: "평균 1,240,000원 | 4건" },
      { label: "부품 단위 회수 추정가", value: "1,090,000원" },
      { label: "적용 감가 기준표", value: "데스크탑(워크스테이션) v4.0" },
      { label: "수요 지수", value: "보통 | 최근 30일 조회 64회" },
    ],
  },
  {
    id: "a9",
    code: "AF-2606-0098",
    name: "회의실 노트북 15형",
    maker: "K전자",
    model: "KB-1520",
    category: "laptop",
    quantity: 14,
    purchasedAt: "2023. 01",
    usedMonths: 42,
    grade: "B",
    status: "inspecting",
    photo: 180,
    registeredAt: "2026. 06. 29",
    spec: "i5-1235U / 8GB / SSD 256GB / 15형 FHD",
    autoPrice: 356000,
    listPrice: 1320000,
    confidence: 87,
    factors: [
      { label: "사용 기간 42개월", impact: -41, note: "3.5년 경과 구간" },
      { label: "메모리 8GB 구성", impact: -8, note: "현행 업무 사양 대비 낮음" },
      { label: "외관 등급 B", impact: -7, note: "팜레스트 마모" },
      { label: "충전기 전량 포함", impact: 3, note: "부속 완비" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 362,000원 | 13건" },
      { label: "동일 사양 시장 매물가", value: "410,000 ~ 468,000원" },
      { label: "적용 감가 기준표", value: "노트북 v4.2" },
      { label: "수요 지수", value: "보통 | 최근 30일 조회 118회" },
    ],
  },
  {
    id: "a10",
    code: "AF-2606-0091",
    name: "무선 AP",
    maker: "P네트웍스",
    model: "PW-620",
    category: "network",
    quantity: 30,
    purchasedAt: "2022. 09",
    usedMonths: 34,
    grade: "A",
    status: "bidding1",
    registeredAt: "2026. 06. 24",
    spec: "Wi-Fi 6 / 2.4G+5G 듀얼밴드 / PoE+ / 천장 마운트",
    autoPrice: 94000,
    listPrice: 380000,
    confidence: 91,
    factors: [
      { label: "사용 기간 34개월", impact: -49, note: "무선 장비 감가 곡선 3년 구간" },
      { label: "Wi-Fi 6 지원", impact: 11, note: "현행 규격, 재판매 수요 유지" },
      { label: "외관 등급 A", impact: 4, note: "천장 설치분, 외관 손상 없음" },
      { label: "마운트 브래킷 포함", impact: 2, note: "부속 완비" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 91,000원 | 19건" },
      { label: "동일 사양 시장 매물가", value: "112,000 ~ 130,000원" },
      { label: "적용 감가 기준표", value: "네트워크 v3.1" },
      { label: "수요 지수", value: "높음 | 최근 30일 조회 231회" },
    ],
  },
  {
    id: "a11",
    code: "AF-2606-0084",
    name: "무선 키보드 마우스 세트",
    maker: "K전자",
    model: "KM-200",
    category: "peripheral",
    quantity: 120,
    purchasedAt: "2023. 04",
    usedMonths: 39,
    grade: "B",
    status: "settled",
    photo: 532,
    registeredAt: "2026. 06. 18",
    spec: "무선 2.4GHz 세트 / 팬터그래프 / USB 리시버 포함",
    autoPrice: 12000,
    listPrice: 89000,
    confidence: 96,
    factors: [
      { label: "사용 기간 39개월", impact: -71, note: "소모성 주변기기 감가" },
      { label: "수량 120세트", impact: 12, note: "대량 일괄 매각 프리미엄" },
      { label: "리시버 누락 9세트", impact: -5, note: "부속 누락분 차감" },
      { label: "외관 등급 B", impact: -6, note: "키캡 마모" },
    ],
    basis: [
      { label: "최근 90일 동일 계열 낙찰가", value: "평균 11,600원 | 41건" },
      { label: "동일 사양 시장 매물가", value: "16,000 ~ 21,000원" },
      { label: "적용 감가 기준표", value: "주변기기 v2.6" },
      { label: "수요 지수", value: "보통 | 최근 30일 조회 73회" },
    ],
  },
  {
    id: "a12",
    code: "AF-2607-0146",
    name: "임원용 노트북 14형",
    maker: "M테크",
    model: "MA-1450",
    category: "laptop",
    quantity: 6,
    purchasedAt: "2024. 08",
    usedMonths: 23,
    grade: "A",
    status: "draft",
    photo: 370,
    registeredAt: "2026. 07. 28",
    spec: "i7-1360P / 32GB / SSD 1TB / 14형 2.8K OLED",
    autoPrice: 968000,
    listPrice: 1880000,
    confidence: 93,
    factors: [
      { label: "사용 기간 23개월", impact: -22, note: "2년 미만, 감가 초기 구간" },
      { label: "OLED 패널", impact: 8, note: "상위 사양 프리미엄" },
      { label: "외관 등급 A", impact: 5, note: "케이스 상시 사용, 손상 없음" },
      { label: "수량 6대", impact: -2, note: "소량 매각 물류비 반영" },
    ],
    basis: [
      { label: "최근 90일 동일 모델 낙찰가", value: "평균 951,000원 | 8건" },
      { label: "동일 사양 시장 매물가", value: "1,080,000 ~ 1,190,000원" },
      { label: "적용 감가 기준표", value: "노트북 v4.2" },
      { label: "수요 지수", value: "높음 | 최근 30일 조회 166회" },
    ],
  },
];

export const getAsset = (id: string) => assets.find((a) => a.id === id) ?? assets[0];

export const bids: Bid[] = [
  // a1 — 1차 입찰 진행 중
  { id: "b1", assetId: "a1", reseller: "D리커머스", resellerGrade: "플래티넘", round: 1, unitPrice: 448000, submittedAt: "07. 27 14:22", pickupDays: 3, note: "전량 일괄 인수, 파기 증명서 발급", certifiedWipe: true },
  { id: "b2", assetId: "a1", reseller: "E테크사이클", resellerGrade: "골드", round: 1, unitPrice: 436000, submittedAt: "07. 27 11:05", pickupDays: 5, note: "충전기 미포함분 개당 8,000원 차감 조건", certifiedWipe: true },
  { id: "b3", assetId: "a1", reseller: "F아이티리퍼브", resellerGrade: "골드", round: 1, unitPrice: 421000, submittedAt: "07. 26 17:48", pickupDays: 4, note: "현장 검수 후 최종가 조정 희망", certifiedWipe: false },
  { id: "b4", assetId: "a1", reseller: "G디바이스", resellerGrade: "실버", round: 1, unitPrice: 405000, submittedAt: "07. 26 09:31", pickupDays: 7, note: "30대 이상 분할 인수 가능", certifiedWipe: true },
  { id: "b5", assetId: "a1", reseller: "H리유즈", resellerGrade: "실버", round: 1, unitPrice: 392000, submittedAt: "07. 25 16:12", pickupDays: 6, note: "등급 B 이하 반품 조건", certifiedWipe: false },

  // a7 — 1차 입찰 진행 중
  { id: "b6", assetId: "a7", reseller: "D리커머스", resellerGrade: "플래티넘", round: 1, unitPrice: 796000, submittedAt: "07. 27 10:40", pickupDays: 2, note: "전량 즉시 인수", certifiedWipe: true },
  { id: "b7", assetId: "a7", reseller: "J글로벌트레이드", resellerGrade: "플래티넘", round: 1, unitPrice: 781000, submittedAt: "07. 26 19:02", pickupDays: 4, note: "해외 수출 물량, 통관 서류 자체 처리", certifiedWipe: true },
  { id: "b8", assetId: "a7", reseller: "E테크사이클", resellerGrade: "골드", round: 1, unitPrice: 768000, submittedAt: "07. 26 13:55", pickupDays: 5, note: "필름 부착 상태 유지 조건", certifiedWipe: true },
  { id: "b9", assetId: "a7", reseller: "F아이티리퍼브", resellerGrade: "골드", round: 1, unitPrice: 754000, submittedAt: "07. 25 15:20", pickupDays: 6, note: "", certifiedWipe: false },

  // a10 — 1차 입찰 진행 중
  { id: "b10", assetId: "a10", reseller: "F아이티리퍼브", resellerGrade: "골드", round: 1, unitPrice: 103000, submittedAt: "07. 27 09:14", pickupDays: 5, note: "마운트 브래킷 포함 조건", certifiedWipe: true },
  { id: "b11", assetId: "a10", reseller: "G디바이스", resellerGrade: "실버", round: 1, unitPrice: 98000, submittedAt: "07. 26 14:36", pickupDays: 7, note: "", certifiedWipe: true },
  { id: "b12", assetId: "a10", reseller: "H리유즈", resellerGrade: "실버", round: 1, unitPrice: 92000, submittedAt: "07. 25 11:48", pickupDays: 8, note: "20대 단위 분할 인수", certifiedWipe: false },

  // a3 — 검수 후 2차 최종 입찰
  { id: "b13", assetId: "a3", reseller: "J글로벌트레이드", resellerGrade: "플래티넘", round: 1, unitPrice: 1310000, submittedAt: "07. 20 10:02", pickupDays: 6, note: "검수 전 예비 견적", certifiedWipe: true },
  { id: "b14", assetId: "a3", reseller: "D리커머스", resellerGrade: "플래티넘", round: 1, unitPrice: 1268000, submittedAt: "07. 19 16:44", pickupDays: 5, note: "검수 전 예비 견적", certifiedWipe: true },
  { id: "b15", assetId: "a3", reseller: "E테크사이클", resellerGrade: "골드", round: 1, unitPrice: 1195000, submittedAt: "07. 19 09:21", pickupDays: 7, note: "검수 전 예비 견적", certifiedWipe: false },
  { id: "b16", assetId: "a3", reseller: "J글로벌트레이드", resellerGrade: "플래티넘", round: 2, unitPrice: 1382000, submittedAt: "07. 27 15:30", pickupDays: 6, note: "메모리 128GB 정상 확인, 상향 제시", certifiedWipe: true, selected: true },
  { id: "b17", assetId: "a3", reseller: "D리커머스", resellerGrade: "플래티넘", round: 2, unitPrice: 1344000, submittedAt: "07. 27 13:12", pickupDays: 5, note: "파워 이중화 정상 확인분 반영", certifiedWipe: true },
  { id: "b18", assetId: "a3", reseller: "E테크사이클", resellerGrade: "골드", round: 2, unitPrice: 1201000, submittedAt: "07. 27 10:58", pickupDays: 7, note: "지원 종료 리스크 반영, 소폭 상향", certifiedWipe: false },
];

export const bidsOf = (assetId: string, round: 1 | 2) =>
  bids.filter((b) => b.assetId === assetId && b.round === round).sort((x, y) => y.unitPrice - x.unitPrice);

/** 1차 입찰이 열려 있는 자산과 마감까지 남은 시간. */
export const biddingDeadlines: Record<string, { closesAt: string; remainMinutes: number; watchers: number }> = {
  a1: { closesAt: "07. 29 18:00", remainMinutes: 1832, watchers: 14 },
  a7: { closesAt: "07. 28 18:00", remainMinutes: 392, watchers: 22 },
  a10: { closesAt: "07. 30 12:00", remainMinutes: 2792, watchers: 9 },
  a3: { closesAt: "07. 28 17:00", remainMinutes: 332, watchers: 6 },
};

export const inspections: Inspection[] = [
  {
    assetId: "a3",
    inspector: "검수원 서민재",
    inspectedAt: "2026. 07. 26 14:00",
    site: "본사 3층 전산실",
    gradeBefore: "C",
    gradeAfter: "B",
    priceBefore: 1240000,
    priceAfter: 1356000,
    summary:
      "신고 등급보다 실제 상태가 양호합니다. 메모리 128GB 전량 정상 인식되고 이중화 파워도 문제 없어 등급을 B로 상향했습니다. 다만 3번 장비의 디스크 베이 1개는 인식되지 않아 해당 장비만 별도 표기했습니다.",
    items: [
      { label: "외관 상태", declared: "C | 랙 자국 다수", observed: "B | 전면 베젤 양호", delta: "better" },
      { label: "메모리", declared: "128GB (미검증)", observed: "128GB 전량 정상 인식", delta: "better" },
      { label: "디스크 베이", declared: "4베이 정상", observed: "3번 장비 1베이 미인식", delta: "worse" },
      { label: "이중화 파워", declared: "정상", observed: "6대 전량 정상", delta: "same" },
      { label: "펌웨어", declared: "미기재", observed: "최신 버전 대비 2단계 하위", delta: "same" },
      { label: "데이터 잔존", declared: "전량 초기화 완료", observed: "전량 초기화 확인", delta: "same" },
    ],
    // 랙 서버에 맞는 사진이 없다. 노트북/데스크탑 사진을 붙이면 캡션과 어긋나므로 비운다.
    photos: [],
  },
  {
    assetId: "a2",
    inspector: "검수원 한지후",
    inspectedAt: "2026. 07. 28 10:30",
    site: "판교 R&D센터 B1 창고",
    gradeBefore: "C",
    gradeAfter: "C",
    priceBefore: 735000,
    priceAfter: 712000,
    summary:
      "힌지 유격은 신고된 3대 외에 2대가 추가로 확인됐습니다. 외장 GPU는 전량 정상 동작하나 충전기 누락이 6대에서 8대로 늘어 자동 시세 대비 소폭 하향했습니다.",
    items: [
      { label: "외관 상태", declared: "C | 하판 찍힘", observed: "C | 하판 찍힘 + 상판 눌림", delta: "worse" },
      { label: "힌지 유격", declared: "3대", observed: "5대", delta: "worse" },
      { label: "외장 GPU", declared: "정상", observed: "18대 전량 정상", delta: "same" },
      { label: "충전기", declared: "6대 누락", observed: "8대 누락", delta: "worse" },
      { label: "배터리", declared: "미기재", observed: "잔여 용량 평균 71%", delta: "same" },
      { label: "데이터 잔존", declared: "전량 초기화 완료", observed: "전량 초기화 확인", delta: "same" },
    ],
    photos: [48, 180],
  },
  {
    assetId: "a9",
    inspector: "검수원 서민재",
    inspectedAt: "2026. 07. 28 15:00",
    site: "본사 12층 회의실 구역",
    gradeBefore: "B",
    gradeAfter: "B",
    priceBefore: 356000,
    priceAfter: 361000,
    summary: "신고 내용과 실물이 거의 일치합니다. 충전기 전량 포함 확인되어 자동 시세를 소폭 상향했습니다.",
    items: [
      { label: "외관 상태", declared: "B | 팜레스트 마모", observed: "B | 팜레스트 마모", delta: "same" },
      { label: "메모리", declared: "8GB", observed: "8GB 전량 확인", delta: "same" },
      { label: "충전기", declared: "전량 포함", observed: "14대 전량 확인", delta: "same" },
      { label: "액정", declared: "미기재", observed: "불량 화소 없음", delta: "better" },
      { label: "데이터 잔존", declared: "전량 초기화 완료", observed: "전량 초기화 확인", delta: "same" },
      { label: "부속", declared: "파우치 없음", observed: "파우치 없음", delta: "same" },
    ],
    photos: [180, 0],
  },
];

export const inspectionOf = (assetId: string) => inspections.find((i) => i.assetId === assetId);

export const deals: Deal[] = [
  {
    id: "d1",
    code: "DL-2607-0031",
    assetId: "a5",
    assetName: "올인원 데스크탑 24형",
    quantity: 24,
    reseller: "D리커머스",
    amount: 9048000,
    stage: "pickup",
    confirmedAt: "2026. 07. 22",
    expectedAt: "2026. 07. 31",
    documents: [
      { name: "매각 계약서", kind: "PDF", size: "412KB", issuedAt: "2026. 07. 22" },
      { name: "자산 목록 명세", kind: "XLSX", size: "88KB", issuedAt: "2026. 07. 22" },
      { name: "데이터 파기 증명서", kind: "PDF", size: "204KB", issuedAt: "2026. 07. 26" },
    ],
    timeline: [
      { label: "거래 확정", at: "07. 22 16:10", done: true },
      { label: "계약서 서명", at: "07. 23 11:24", done: true, note: "전자서명 완료 | 양측" },
      { label: "데이터 파기", at: "07. 26 09:00", done: true, note: "3패스 덮어쓰기 | 증명서 발급" },
      { label: "장비 회수", at: "07. 31 14:00", done: false, note: "본사 지하 1층 하역장" },
      { label: "정산", at: "08. 05 예정", done: false, note: "회수 확인 후 3영업일" },
    ],
  },
  {
    id: "d2",
    code: "DL-2607-0028",
    assetId: "a6",
    assetName: "27형 모니터",
    quantity: 60,
    reseller: "F아이티리퍼브",
    amount: 7320000,
    stage: "done",
    confirmedAt: "2026. 07. 08",
    expectedAt: "2026. 07. 21",
    documents: [
      { name: "매각 계약서", kind: "PDF", size: "398KB", issuedAt: "2026. 07. 08" },
      { name: "자산 목록 명세", kind: "XLSX", size: "104KB", issuedAt: "2026. 07. 08" },
      { name: "인수인계 확인서", kind: "PDF", size: "156KB", issuedAt: "2026. 07. 17" },
      { name: "세금계산서", kind: "PDF", size: "92KB", issuedAt: "2026. 07. 21" },
    ],
    timeline: [
      { label: "거래 확정", at: "07. 08 10:02", done: true },
      { label: "계약서 서명", at: "07. 09 14:30", done: true, note: "전자서명 완료 | 양측" },
      { label: "데이터 파기", at: "07. 14 09:00", done: true, note: "해당 없음 | 저장장치 미포함" },
      { label: "장비 회수", at: "07. 17 13:00", done: true, note: "60대 전량 인수 확인" },
      { label: "정산", at: "07. 21 16:40", done: true, note: "입금 완료 | 7,320,000원" },
    ],
  },
  {
    id: "d3",
    code: "DL-2606-0024",
    assetId: "a11",
    assetName: "무선 키보드 마우스 세트",
    quantity: 120,
    reseller: "H리유즈",
    amount: 1476000,
    stage: "done",
    confirmedAt: "2026. 06. 23",
    expectedAt: "2026. 07. 04",
    documents: [
      { name: "매각 계약서", kind: "PDF", size: "356KB", issuedAt: "2026. 06. 23" },
      { name: "자산 목록 명세", kind: "XLSX", size: "142KB", issuedAt: "2026. 06. 23" },
      { name: "인수인계 확인서", kind: "PDF", size: "148KB", issuedAt: "2026. 07. 01" },
      { name: "세금계산서", kind: "PDF", size: "90KB", issuedAt: "2026. 07. 04" },
    ],
    timeline: [
      { label: "거래 확정", at: "06. 23 09:40", done: true },
      { label: "계약서 서명", at: "06. 24 10:12", done: true, note: "전자서명 완료 | 양측" },
      { label: "데이터 파기", at: "06. 27 09:00", done: true, note: "해당 없음 | 저장장치 미포함" },
      { label: "장비 회수", at: "07. 01 11:00", done: true, note: "111세트 인수 | 9세트 리시버 누락 차감" },
      { label: "정산", at: "07. 04 15:20", done: true, note: "입금 완료 | 1,476,000원" },
    ],
  },
  {
    id: "d4",
    code: "DL-2607-0033",
    assetId: "a3",
    assetName: "랙 서버 2U",
    quantity: 6,
    reseller: "J글로벌트레이드",
    amount: 8292000,
    stage: "contract",
    confirmedAt: "2026. 07. 28",
    expectedAt: "2026. 08. 08",
    documents: [
      { name: "매각 계약서", kind: "PDF", size: "428KB", issuedAt: "2026. 07. 28" },
      { name: "검수 리포트", kind: "PDF", size: "1.2MB", issuedAt: "2026. 07. 26" },
    ],
    timeline: [
      { label: "거래 확정", at: "07. 28 09:15", done: true },
      { label: "계약서 서명", at: "07. 29 예정", done: false, note: "리셀러 서명 대기" },
      { label: "데이터 파기", at: "08. 03 예정", done: false, note: "SAS 디스크 물리 파기 입회 필요" },
      { label: "장비 회수", at: "08. 06 예정", done: false, note: "본사 3층 전산실" },
      { label: "정산", at: "08. 08 예정", done: false, note: "회수 확인 후 3영업일" },
    ],
  },
  {
    id: "d5",
    code: "DL-2606-0019",
    assetId: "a9",
    assetName: "회의실 노트북 15형",
    quantity: 14,
    reseller: "E테크사이클",
    amount: 5054000,
    stage: "settlement",
    confirmedAt: "2026. 06. 30",
    expectedAt: "2026. 07. 29",
    documents: [
      { name: "매각 계약서", kind: "PDF", size: "404KB", issuedAt: "2026. 06. 30" },
      { name: "자산 목록 명세", kind: "XLSX", size: "76KB", issuedAt: "2026. 06. 30" },
      { name: "데이터 파기 증명서", kind: "PDF", size: "198KB", issuedAt: "2026. 07. 18" },
      { name: "인수인계 확인서", kind: "PDF", size: "152KB", issuedAt: "2026. 07. 24" },
    ],
    timeline: [
      { label: "거래 확정", at: "06. 30 13:20", done: true },
      { label: "계약서 서명", at: "07. 01 09:50", done: true, note: "전자서명 완료 | 양측" },
      { label: "데이터 파기", at: "07. 18 10:00", done: true, note: "3패스 덮어쓰기 | 증명서 발급" },
      { label: "장비 회수", at: "07. 24 15:00", done: true, note: "14대 전량 인수 확인" },
      { label: "정산", at: "07. 29 예정", done: false, note: "세금계산서 발행 대기" },
    ],
  },
  {
    id: "d6",
    code: "DL-2605-0011",
    assetId: "a4",
    assetName: "L3 스위치 48포트",
    quantity: 12,
    reseller: "D리커머스",
    amount: 7104000,
    stage: "done",
    confirmedAt: "2026. 05. 19",
    expectedAt: "2026. 06. 02",
    documents: [
      { name: "매각 계약서", kind: "PDF", size: "386KB", issuedAt: "2026. 05. 19" },
      { name: "자산 목록 명세", kind: "XLSX", size: "68KB", issuedAt: "2026. 05. 19" },
      { name: "인수인계 확인서", kind: "PDF", size: "144KB", issuedAt: "2026. 05. 29" },
      { name: "세금계산서", kind: "PDF", size: "88KB", issuedAt: "2026. 06. 02" },
    ],
    timeline: [
      { label: "거래 확정", at: "05. 19 11:05", done: true },
      { label: "계약서 서명", at: "05. 20 16:22", done: true, note: "전자서명 완료 | 양측" },
      { label: "데이터 파기", at: "05. 25 09:00", done: true, note: "설정 초기화 확인" },
      { label: "장비 회수", at: "05. 29 10:30", done: true, note: "12대 전량 인수 확인" },
      { label: "정산", at: "06. 02 14:10", done: true, note: "입금 완료 | 7,104,000원" },
    ],
  },
];

export const notices: NoticeItem[] = [
  { id: "n1", kind: "bid", title: "경량 노트북 13형 입찰 마감 6시간 전", detail: "현재 최고가 796,000원 | 4개사 참여", at: "12분 전", unread: true },
  { id: "n2", kind: "inspection", title: "랙 서버 2U 검수 리포트가 도착했습니다", detail: "등급 C → B 상향 | 예상가 +9.4%", at: "1시간 전", unread: true },
  { id: "n3", kind: "deal", title: "올인원 데스크탑 24형 회수 일정 확정", detail: "07. 31 14:00 | 본사 지하 1층 하역장", at: "3시간 전", unread: true },
  { id: "n4", kind: "bid", title: "랙 서버 2U 최종 입찰에 3개사가 참여했습니다", detail: "최고가 1,382,000원 | J글로벌트레이드", at: "어제", unread: false },
  { id: "n5", kind: "notice", title: "노트북 감가 기준표 v4.2 적용 안내", detail: "2026. 06. 01부터 배터리 사이클 반영 비중이 조정됩니다", at: "07. 24", unread: false },
];

/* ── 리포트 ── */

export const monthlyTrade = [
  { month: "2월", amount: 18400000, count: 4 },
  { month: "3월", amount: 24100000, count: 6 },
  { month: "4월", amount: 15800000, count: 3 },
  { month: "5월", amount: 31200000, count: 7 },
  { month: "6월", amount: 27600000, count: 5 },
  { month: "7월", amount: 38900000, count: 8 },
];

export const categoryShare = [
  { label: "노트북", amount: 62400000, count: 115, share: 41.2 },
  { label: "데스크탑", amount: 38100000, count: 32, share: 25.2 },
  { label: "서버", amount: 24800000, count: 14, share: 16.4 },
  { label: "네트워크", amount: 16300000, count: 42, share: 10.8 },
  { label: "주변기기", amount: 9800000, count: 180, share: 6.4 },
];

export const winRateSeries = [
  { month: "2월", auto: 386000, won: 402000 },
  { month: "3월", auto: 402000, won: 431000 },
  { month: "4월", auto: 371000, won: 388000 },
  { month: "5월", auto: 418000, won: 462000 },
  { month: "6월", auto: 425000, won: 458000 },
  { month: "7월", auto: 441000, won: 496000 },
];

export const reportHighlights = [
  { label: "누적 매각 금액", value: "151,400,000원", delta: "+18.2%", note: "전년 동기 대비" },
  { label: "평균 낙찰률", value: "자동 시세의 108.4%", delta: "+3.1%p", note: "최근 6개월 평균" },
  { label: "평균 거래 소요", value: "11.4일", delta: "-2.6일", note: "등록에서 정산까지" },
  { label: "검수 후 상향 비율", value: "63.2%", delta: "+7.4%p", note: "검수 완료 건 기준" },
];

export const resellerPerformance = [
  { name: "D리커머스", deals: 9, amount: 42800000, avgRate: 112.4, grade: "플래티넘" },
  { name: "J글로벌트레이드", deals: 6, amount: 33100000, avgRate: 109.8, grade: "플래티넘" },
  { name: "F아이티리퍼브", deals: 7, amount: 28600000, avgRate: 106.2, grade: "골드" },
  { name: "E테크사이클", deals: 5, amount: 24900000, avgRate: 104.1, grade: "골드" },
  { name: "H리유즈", deals: 4, amount: 12300000, avgRate: 98.6, grade: "실버" },
  { name: "G디바이스", deals: 3, amount: 9700000, avgRate: 96.2, grade: "실버" },
];

/* ── 마이페이지 ── */

export const members = [
  { id: "m1", name: "윤도현", role: "자산관리 파트장", dept: "IT인프라팀", email: "dohyun.yoon@atech-hq.co.kr", permission: "관리자", lastLogin: "07. 28 09:12", active: true },
  { id: "m2", name: "배수연", role: "인프라 엔지니어", dept: "IT인프라팀", email: "sooyeon.bae@atech-hq.co.kr", permission: "자산 등록", lastLogin: "07. 27 18:40", active: true },
  { id: "m3", name: "장태윤", role: "구매 담당", dept: "경영지원팀", email: "taeyoon.jang@atech-hq.co.kr", permission: "거래 승인", lastLogin: "07. 26 14:05", active: true },
  { id: "m4", name: "고은비", role: "회계 담당", dept: "재무팀", email: "eunbi.ko@atech-hq.co.kr", permission: "정산 조회", lastLogin: "07. 22 11:33", active: true },
  { id: "m5", name: "노시현", role: "인프라 엔지니어", dept: "IT인프라팀", email: "sihyun.noh@atech-hq.co.kr", permission: "자산 등록", lastLogin: "05. 30 16:20", active: false },
];

export const certifications = [
  { label: "사업자등록증", status: "인증 완료", at: "2024. 03. 11", note: "214-88-01925" },
  { label: "법인 인감증명서", status: "인증 완료", at: "2024. 03. 11", note: "발급 6개월 이내 서류 확인" },
  { label: "정산 계좌", status: "인증 완료", at: "2024. 03. 14", note: "기업은행 03X-XXXXXX-01-018" },
  { label: "전자세금계산서 담당자", status: "갱신 필요", at: "2025. 08. 02", note: "담당자 변경 후 재등록 필요" },
];

export const notificationPrefs = [
  { id: "bid", label: "입찰 알림", detail: "새 입찰, 최고가 변동, 마감 임박", email: true, sms: true },
  { id: "inspection", label: "검수 알림", detail: "검수 일정 확정, 리포트 발행", email: true, sms: false },
  { id: "deal", label: "거래 알림", detail: "계약, 회수, 정산 단계 변경", email: true, sms: true },
  { id: "report", label: "월간 리포트", detail: "매월 1일 전월 거래 분석 발송", email: true, sms: false },
  { id: "policy", label: "정책 변경 안내", detail: "감가 기준표, 수수료 정책 개정", email: false, sms: false },
];

/* ── 자산 등록 폼 ── */

export const makerSuggestions = [
  { maker: "K전자", model: "KB-1440U", spec: "i5-1235U / 16GB / SSD 512GB / 14형 FHD", listPrice: 1480000 },
  { maker: "K전자", model: "KB-1520", spec: "i5-1235U / 8GB / SSD 256GB / 15형 FHD", listPrice: 1320000 },
  { maker: "K전자", model: "KB-1460P", spec: "i7-1260P / 16GB / SSD 512GB / 14형 WUXGA", listPrice: 1740000 },
  { maker: "M테크", model: "MA-1330", spec: "i5-1340P / 16GB / SSD 512GB / 13형 WUXGA", listPrice: 1690000 },
  { maker: "M테크", model: "MA-1450", spec: "i7-1360P / 32GB / SSD 1TB / 14형 2.8K OLED", listPrice: 1880000 },
];

export const bulkRows = [
  { row: 2, code: "AF-TMP-001", name: "업무용 노트북 14형", maker: "K전자", model: "KB-1440U", qty: 42, ok: true, message: "정상" },
  { row: 3, code: "AF-TMP-002", name: "경량 노트북 13형", maker: "M테크", model: "MA-1330", qty: 35, ok: true, message: "정상" },
  { row: 4, code: "AF-TMP-003", name: "27형 모니터", maker: "S디스플레이", model: "SD-2712", qty: 60, ok: true, message: "정상" },
  { row: 5, code: "AF-TMP-004", name: "L3 스위치", maker: "P네트웍스", model: "PS-480", qty: 12, ok: false, message: "모델명을 찾을 수 없습니다. PS-4800 아닌가요?" },
  { row: 6, code: "AF-TMP-005", name: "무선 AP", maker: "P네트웍스", model: "PW-620", qty: 0, ok: false, message: "수량은 1 이상이어야 합니다" },
  { row: 7, code: "AF-TMP-006", name: "올인원 데스크탑", maker: "K전자", model: "KA-2400", qty: 24, ok: true, message: "정상" },
];
