/** 관리자 백오피스 전용 mock. 기업용 화면과 데이터 소스를 분리해 둔다. */

export const adminKpis = [
  { label: "진행 중 거래", value: "48건", delta: "+6", note: "어제 대비", href: "trades" as const },
  { label: "진행 중 입찰", value: "23건", delta: "+4", note: "마감 24시간 내 7건", href: "trades" as const },
  { label: "검수 대기", value: "11건", delta: "+2", note: "배정 필요 4건", href: "inspections" as const },
  { label: "이번 달 거래액", value: "3.9억원", delta: "+18.2%", note: "전월 대비", href: "trades" as const },
];

export const adminDailyVolume = [
  { day: "07. 22", amount: 21400000 },
  { day: "07. 23", amount: 34800000 },
  { day: "07. 24", amount: 28100000 },
  { day: "07. 25", amount: 41600000 },
  { day: "07. 26", amount: 12900000 },
  { day: "07. 27", amount: 38200000 },
  { day: "07. 28", amount: 46300000 },
];

export const adminFunnel = [
  { label: "자산 등록", count: 412, share: 100 },
  { label: "자동 견적", count: 386, share: 93.7 },
  { label: "1차 입찰", count: 291, share: 70.6 },
  { label: "검수 완료", count: 214, share: 51.9 },
  { label: "최종 입찰", count: 198, share: 48.1 },
  { label: "거래 확정", count: 176, share: 42.7 },
];

export const adminInspectionStatus = [
  { label: "배정 대기", count: 4, tone: "warn" as const },
  { label: "방문 예정", count: 5, tone: "info" as const },
  { label: "리포트 작성 중", count: 2, tone: "info" as const },
  { label: "승인 대기", count: 3, tone: "warn" as const },
  { label: "이번 주 승인 완료", count: 19, tone: "ink" as const },
];

export const adminAlerts = [
  { id: "al1", level: "danger" as const, title: "분쟁 접수 | DL-2607-0029", detail: "B소재 ↔ G디바이스 | 회수 수량 불일치 12대", at: "34분 전" },
  { id: "al2", level: "warn" as const, title: "검수 배정 지연 | AS-2607-0188", detail: "등록 후 72시간 경과, 담당 검수원 미배정", at: "2시간 전" },
  { id: "al3", level: "warn" as const, title: "리셀러 입찰 이상 패턴", detail: "G디바이스 | 최근 5건 연속 낙찰 후 3건 철회", at: "5시간 전" },
  { id: "al4", level: "info" as const, title: "감가 기준표 v4.3 검토 요청", detail: "노트북 배터리 사이클 반영 비중 조정안", at: "어제" },
];

export type MemberKind = "기업" | "리셀러";

export const adminMembers = [
  { id: "c1", kind: "기업" as MemberKind, name: "A테크놀로지", biz: "214-88-01925", tier: "Enterprise", joinedAt: "2024. 03. 11", deals: 34, amount: 151400000, state: "정상", manager: "윤도현" },
  { id: "c2", kind: "기업" as MemberKind, name: "B소재", biz: "138-86-40217", tier: "Business", joinedAt: "2024. 09. 02", deals: 21, amount: 88200000, state: "정상", manager: "임세라" },
  { id: "c3", kind: "기업" as MemberKind, name: "C페이", biz: "220-87-33104", tier: "Business", joinedAt: "2025. 01. 20", deals: 12, amount: 41600000, state: "정상", manager: "권지훈" },
  { id: "c4", kind: "기업" as MemberKind, name: "K로지스", biz: "312-81-99820", tier: "Standard", joinedAt: "2026. 07. 26", deals: 0, amount: 0, state: "승인 대기", manager: "오하람" },
  { id: "c5", kind: "기업" as MemberKind, name: "L바이오", biz: "504-88-12073", tier: "Standard", joinedAt: "2026. 07. 24", deals: 0, amount: 0, state: "승인 대기", manager: "천유진" },
  { id: "r1", kind: "리셀러" as MemberKind, name: "D리커머스", biz: "119-85-27431", tier: "플래티넘", joinedAt: "2023. 11. 08", deals: 96, amount: 412800000, state: "정상", manager: "신재호" },
  { id: "r2", kind: "리셀러" as MemberKind, name: "J글로벌트레이드", biz: "402-86-55190", tier: "플래티넘", joinedAt: "2024. 02. 14", deals: 78, amount: 366200000, state: "정상", manager: "마동현" },
  { id: "r3", kind: "리셀러" as MemberKind, name: "F아이티리퍼브", biz: "211-87-60328", tier: "골드", joinedAt: "2024. 06. 30", deals: 64, amount: 224500000, state: "정상", manager: "구예원" },
  { id: "r4", kind: "리셀러" as MemberKind, name: "E테크사이클", biz: "617-81-40056", tier: "골드", joinedAt: "2024. 08. 19", deals: 51, amount: 187300000, state: "정상", manager: "표성민" },
  { id: "r5", kind: "리셀러" as MemberKind, name: "H리유즈", biz: "305-86-71284", tier: "실버", joinedAt: "2025. 04. 07", deals: 28, amount: 64100000, state: "정상", manager: "남주하" },
  { id: "r6", kind: "리셀러" as MemberKind, name: "G디바이스", biz: "128-88-90417", tier: "실버", joinedAt: "2025. 06. 22", deals: 19, amount: 38900000, state: "이용 제한", manager: "허강우" },
];

export const memberActivity = [
  { at: "2026. 07. 28 09:12", actor: "운영자 박채린", action: "이용 제한 적용", target: "G디바이스", note: "입찰 후 철회 3회 | 30일 제한" },
  { at: "2026. 07. 26 16:40", actor: "운영자 박채린", action: "가입 신청 접수", target: "K로지스", note: "사업자등록증 검토 대기" },
  { at: "2026. 07. 24 11:08", actor: "운영자 문시온", action: "등급 상향", target: "F아이티리퍼브", note: "실버 → 골드 | 분기 거래액 기준 충족" },
  { at: "2026. 07. 21 14:22", actor: "운영자 문시온", action: "정산 계좌 변경 승인", target: "E테크사이클", note: "법인 명의 확인 완료" },
];

export const adminInspections = [
  { id: "i1", code: "AS-2607-0188", company: "B소재", asset: "업무용 노트북 15형", qty: 68, site: "인천 남동공단 물류센터", requestedAt: "07. 25", state: "배정 대기", inspector: "-", due: "07. 29" },
  { id: "i2", code: "AS-2607-0184", company: "A테크놀로지", asset: "개발용 노트북 16형", qty: 18, site: "판교 R&D센터 B1", requestedAt: "07. 24", state: "리포트 작성 중", inspector: "한지후", due: "07. 29" },
  { id: "i3", code: "AS-2607-0179", company: "A테크놀로지", asset: "회의실 노트북 15형", qty: 14, site: "본사 12층", requestedAt: "07. 23", state: "승인 대기", inspector: "서민재", due: "07. 28" },
  { id: "i4", code: "AS-2607-0176", company: "C페이", asset: "올인원 데스크탑 24형", qty: 40, site: "여의도 본사 7층", requestedAt: "07. 22", state: "방문 예정", inspector: "류가온", due: "07. 30" },
  { id: "i5", code: "AS-2607-0171", company: "A테크놀로지", asset: "랙 서버 2U", qty: 6, site: "본사 3층 전산실", requestedAt: "07. 20", state: "승인 완료", inspector: "서민재", due: "07. 26" },
  { id: "i6", code: "AS-2607-0168", company: "B소재", asset: "L2 스위치 24포트", qty: 22, site: "인천 남동공단 전산실", requestedAt: "07. 19", state: "승인 완료", inspector: "한지후", due: "07. 25" },
  { id: "i7", code: "AS-2607-0165", company: "C페이", asset: "27형 모니터", qty: 90, site: "여의도 본사 창고", requestedAt: "07. 18", state: "배정 대기", inspector: "-", due: "07. 29" },
  { id: "i8", code: "AS-2606-0159", company: "L바이오", asset: "워크스테이션", qty: 11, site: "대전 연구소 2층", requestedAt: "07. 17", state: "방문 예정", inspector: "류가온", due: "07. 31" },
];

export const inspectors = [
  { name: "서민재", region: "서울 | 경기남부", load: 4, capacity: 6 },
  { name: "한지후", region: "서울 | 인천", load: 5, capacity: 6 },
  { name: "류가온", region: "충청 | 대전", load: 2, capacity: 5 },
  { name: "명하늘", region: "영남", load: 3, capacity: 5 },
];

export const gradeChangeLog = [
  { at: "07. 26 17:20", code: "AS-2607-0171", from: "C", to: "B", by: "서민재", reason: "메모리 전량 정상 인식, 이중화 파워 이상 없음" },
  { at: "07. 25 15:44", code: "AS-2607-0168", from: "B", to: "B", by: "한지후", reason: "신고 내용과 일치" },
  { at: "07. 24 10:12", code: "AS-2607-0162", from: "B", to: "C", by: "류가온", reason: "액정 멍 4대 추가 확인" },
  { at: "07. 22 13:38", code: "AS-2607-0157", from: "A", to: "B", by: "명하늘", reason: "상판 눌림 다수" },
];

export const adminTrades = [
  { id: "t1", code: "DL-2607-0033", company: "A테크놀로지", reseller: "J글로벌트레이드", asset: "랙 서버 2U", qty: 6, amount: 8292000, round: 2, state: "계약 진행", closesAt: "-", flag: "" },
  { id: "t2", code: "DL-2607-0031", company: "A테크놀로지", reseller: "D리커머스", asset: "올인원 데스크탑 24형", qty: 24, amount: 9048000, round: 2, state: "회수 대기", closesAt: "-", flag: "" },
  { id: "t3", code: "DL-2607-0029", company: "B소재", reseller: "G디바이스", asset: "업무용 노트북 14형", qty: 54, amount: 21600000, round: 2, state: "분쟁", closesAt: "-", flag: "회수 수량 불일치 12대" },
  { id: "t4", code: "BD-2607-0092", company: "A테크놀로지", reseller: "-", asset: "경량 노트북 13형", qty: 35, amount: 27860000, round: 1, state: "입찰 진행", closesAt: "07. 28 18:00", flag: "마감 6시간 전" },
  { id: "t5", code: "BD-2607-0090", company: "A테크놀로지", reseller: "-", asset: "업무용 노트북 14형", qty: 42, amount: 18816000, round: 1, state: "입찰 진행", closesAt: "07. 29 18:00", flag: "" },
  { id: "t6", code: "BD-2607-0088", company: "C페이", reseller: "-", asset: "27형 모니터", qty: 90, amount: 11250000, round: 1, state: "입찰 진행", closesAt: "07. 30 12:00", flag: "" },
  { id: "t7", code: "DL-2607-0026", company: "C페이", reseller: "F아이티리퍼브", asset: "올인원 데스크탑 24형", qty: 40, amount: 14200000, round: 2, state: "정산 대기", closesAt: "-", flag: "" },
  { id: "t8", code: "DL-2606-0021", company: "B소재", reseller: "E테크사이클", asset: "L2 스위치 24포트", qty: 22, amount: 6820000, round: 2, state: "거래 완료", closesAt: "-", flag: "" },
];

export const disputes = [
  {
    id: "dp1",
    code: "DL-2607-0029",
    opened: "2026. 07. 27 18:20",
    company: "B소재",
    reseller: "G디바이스",
    reason: "회수 수량 불일치",
    detail: "계약 수량 54대 중 42대만 회수됐다는 기업 신고. 리셀러는 12대가 등급 D로 회수 대상에서 제외됐다고 주장.",
    state: "조사 중",
    owner: "운영자 박채린",
    log: [
      { at: "07. 27 18:20", who: "B소재", text: "회수 확인서 수량이 계약과 다릅니다. 12대 미회수." },
      { at: "07. 27 20:05", who: "G디바이스", text: "현장에서 액정 파손 12대 확인, 등급 D로 회수 제외 협의했습니다." },
      { at: "07. 28 09:40", who: "운영자 박채린", text: "검수 리포트와 회수 확인서 대조 중. 양측 사진 자료 요청." },
    ],
  },
];

export const pricingPolicies = [
  { category: "노트북", version: "v4.2", updatedAt: "2026. 06. 01", baseCurve: "3년 기준 잔존 32%", factors: 7, active: true },
  { category: "데스크탑", version: "v4.0", updatedAt: "2026. 04. 20", baseCurve: "3년 기준 잔존 29%", factors: 6, active: true },
  { category: "서버", version: "v3.8", updatedAt: "2026. 04. 15", baseCurve: "5년 기준 잔존 14%", factors: 8, active: true },
  { category: "네트워크", version: "v3.1", updatedAt: "2026. 02. 28", baseCurve: "4년 기준 잔존 19%", factors: 5, active: true },
  { category: "주변기기", version: "v2.6", updatedAt: "2025. 11. 12", baseCurve: "3년 기준 잔존 24%", factors: 4, active: true },
  { category: "노트북", version: "v4.3 (초안)", updatedAt: "2026. 07. 22", baseCurve: "3년 기준 잔존 34%", factors: 8, active: false },
];

export const depreciationFactors = [
  { label: "사용 기간", weight: 42, range: "0 ~ -68%", note: "카테고리별 잔존가치 곡선" },
  { label: "외관 등급", weight: 21, range: "+5 ~ -22%", note: "A/B/C/D 4단계" },
  { label: "부속 완비", weight: 12, range: "+3 ~ -9%", note: "충전기, 브래킷, 케이블" },
  { label: "수량 규모", weight: 11, range: "+2 ~ +12%", note: "일괄 매각 물류 절감분" },
  { label: "수요 지수", weight: 9, range: "-6 ~ +11%", note: "최근 30일 조회 | 입찰 참여" },
  { label: "제조사 지원", weight: 5, range: "0 ~ -14%", note: "EOL 공지 여부" },
];

export const feePolicies = [
  { tier: "Enterprise", sellerFee: "2.4%", resellerFee: "3.2%", inspectionFee: "무료 (월 8회)", settlement: "회수 확인 후 3영업일" },
  { tier: "Business", sellerFee: "3.1%", resellerFee: "3.6%", inspectionFee: "건당 80,000원", settlement: "회수 확인 후 5영업일" },
  { tier: "Standard", sellerFee: "3.8%", resellerFee: "4.0%", inspectionFee: "건당 120,000원", settlement: "회수 확인 후 7영업일" },
];

export const policyChangeLog = [
  { at: "2026. 07. 22 11:05", who: "운영자 문시온", what: "노트북 v4.3 초안 등록", note: "배터리 사이클 가중치 6% → 9%" },
  { at: "2026. 06. 01 09:00", who: "운영자 박채린", what: "노트북 v4.2 배포", note: "3년 잔존율 30% → 32% 상향" },
  { at: "2026. 04. 20 15:30", who: "운영자 문시온", what: "데스크탑 v4.0 배포", note: "일체형 물류 계수 신설" },
  { at: "2026. 04. 15 10:12", who: "운영자 박채린", what: "서버 v3.8 배포", note: "EOL 공지 반영 계수 추가" },
];
