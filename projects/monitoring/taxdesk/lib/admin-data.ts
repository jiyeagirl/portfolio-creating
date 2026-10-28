// 관리자 웹 목업 데이터. 관리자 기준 시각은 2026-01-20(화) 10:27, 신고 기한 01.26(월) D-6.
// TD-26-0118 D베이커리 망원점은 사용자 웹(lib/mock-data.ts)의 그 고객이다. 09:16 접수 완료.

import type {
  EvidenceState,
  FailReason,
  FilingStage,
  JobMode,
  JobState,
  PaymentState,
} from "@/projects/monitoring/taxdesk/lib/status";
import { JOB_STEPS } from "@/projects/monitoring/taxdesk/lib/status";

export const ADMIN_NOW = { date: "2026.01.20 (화)", time: "10:27", deadline: "01.26 (월)", dday: 6 };

export const STAFF = { name: "문지후", role: "세무사", office: "E세무회계" };

/* ------------------------------------------------------------------ 신고 접수 */

export type Filing = {
  id: string;
  business: string;
  owner: string;
  bizNo: string;
  industry: string;
  taxType: "일반과세자" | "간이과세자";
  channels: string;
  stage: FilingStage;
  payment: PaymentState;
  receivedAt: string;
  assignee: string;
  jobId?: string;
  flags: ("신규 고객" | "보완 이력" | "검토 메모")[];
  memo?: string;
  consent: { at: string; label: string; done: boolean }[];
  phone: string;
  email: string;
  openedAt: string;
  staffCount: string;
};

function consent(signAt: string, reqAt: string, okAt?: string) {
  return [
    { at: signAt, label: "위임장 서명", done: true },
    { at: reqAt, label: "홈택스 수임동의 요청", done: true },
    { at: okAt ?? "", label: okAt ? "납세자 동의 완료" : "납세자 동의 대기", done: Boolean(okAt) },
  ];
}

export const FILINGS: Filing[] = [
  { id: "TD-26-0160", business: "T요가 합정", owner: "마서진", bizNo: "117-42-80316", industry: "요가 교습", taxType: "일반과세자", channels: "오프라인", stage: "접수", payment: "결제 완료", receivedAt: "01.20 09:48", assignee: "미배정", flags: ["신규 고객"], consent: consent("01.20 09:51", "01.20 09:52"), phone: "010-7731-2048", email: "sj.ma@tyoga.kr", openedAt: "2024.03.02", staffCount: "없음" },
  { id: "TD-26-0157", business: "S수제화", owner: "길예린", bizNo: "209-17-55128", industry: "신발 제조", taxType: "일반과세자", channels: "오프라인, 온라인 쇼핑몰", stage: "검토 중", payment: "결제 완료", receivedAt: "01.20 08:31", assignee: "문지후", flags: ["신규 고객"], consent: consent("01.20 08:36", "01.20 08:37", "01.20 09:14"), phone: "010-2284-6617", email: "yr.gil@sshoes.kr", openedAt: "2019.11.18", staffCount: "있음 (1명)" },
  { id: "TD-26-0155", business: "R세탁 상수점", owner: "엄태준", bizNo: "105-33-91742", industry: "세탁업", taxType: "간이과세자", channels: "오프라인", stage: "반려", payment: "환불", receivedAt: "01.19 17:05", assignee: "문지후", flags: ["검토 메모"], memo: "간이과세자 납부면제 대상 확인, 신고 대리 불필요 안내 후 환불", consent: consent("01.19 17:09", "01.19 17:10", "01.19 18:22"), phone: "010-5520-1873", email: "tj.um@rlaundry.kr", openedAt: "2022.06.07", staffCount: "없음" },
  { id: "TD-26-0152", business: "Q반찬가게", owner: "노경아", bizNo: "313-26-40581", industry: "반찬 소매", taxType: "일반과세자", channels: "오프라인, 배달앱", stage: "접수", payment: "기한 임박", receivedAt: "01.19 13:20", assignee: "미배정", flags: [], consent: consent("01.19 13:26", "01.19 13:27"), phone: "010-9142-3306", email: "ka.noh@qbanchan.kr", openedAt: "2020.09.21", staffCount: "있음 (1명)" },
  { id: "TD-26-0150", business: "P인테리어", owner: "하지석", bizNo: "128-51-77403", industry: "실내 건축 공사", taxType: "일반과세자", channels: "오프라인", stage: "보완 요청", payment: "결제 완료", receivedAt: "01.18 15:42", assignee: "문지후", flags: ["보완 이력"], memo: "자재 매입 세금계산서 3건 공급가액 누락, 재요청", consent: consent("01.18 15:47", "01.18 15:48", "01.18 19:03"), phone: "010-3378-5129", email: "js.ha@pinterior.kr", openedAt: "2017.02.14", staffCount: "있음 (4명)" },
  { id: "TD-26-0140", business: "K스튜디오", owner: "장민혁", bizNo: "220-48-13957", industry: "사진 촬영업", taxType: "일반과세자", channels: "오프라인, 온라인 쇼핑몰", stage: "접수", payment: "입금 대기", receivedAt: "01.17 21:14", assignee: "미배정", flags: ["신규 고객"], consent: consent("01.17 21:19", "01.17 21:20"), phone: "010-6604-8812", email: "mh.jang@kstudio.kr", openedAt: "2025.05.30", staffCount: "없음" },
  { id: "TD-26-0136", business: "W공방", owner: "여채윤", bizNo: "406-19-62084", industry: "가죽 공예품 제조", taxType: "일반과세자", channels: "온라인 쇼핑몰", stage: "신고서 확정", payment: "결제 완료", receivedAt: "01.16 11:08", assignee: "문지후", jobId: "J-0120-13", flags: [], consent: consent("01.16 11:12", "01.16 11:13", "01.16 13:40"), phone: "010-4417-9035", email: "cy.yeo@wgongbang.kr", openedAt: "2021.08.03", staffCount: "없음" },
  { id: "TD-26-0134", business: "C꽃집", owner: "서다인", bizNo: "215-07-38841", industry: "화초 소매", taxType: "일반과세자", channels: "오프라인, 배달앱", stage: "보완 요청", payment: "결제 완료", receivedAt: "01.15 10:26", assignee: "문지후", flags: ["보완 이력"], memo: "11월 카드 매출 집계표 누락", consent: consent("01.15 10:31", "01.15 10:32", "01.15 12:58"), phone: "010-8826-0447", email: "di.seo@cflower.kr", openedAt: "2018.04.19", staffCount: "있음 (1명)" },
  { id: "TD-26-0132", business: "U안경 신촌점", owner: "탁지안", bizNo: "110-62-40975", industry: "안경 소매", taxType: "일반과세자", channels: "오프라인", stage: "제출 중", payment: "결제 완료", receivedAt: "01.14 16:51", assignee: "문지후", jobId: "J-0120-09", flags: ["보완 이력"], consent: consent("01.14 16:55", "01.14 16:56", "01.14 18:30"), phone: "010-2051-7748", email: "ja.tak@uglass.kr", openedAt: "2016.10.10", staffCount: "있음 (2명)" },
  { id: "TD-26-0131", business: "B치킨 성수점", owner: "오태건", bizNo: "206-25-71360", industry: "치킨 전문점", taxType: "일반과세자", channels: "오프라인, 배달앱", stage: "검토 중", payment: "결제 완료", receivedAt: "01.14 14:03", assignee: "문지후", flags: ["검토 메모"], memo: "배달앱 매출 비중 62.8%, 신용카드 발행공제 한도 확인 필요", consent: consent("01.14 14:08", "01.14 14:09", "01.14 15:22"), phone: "010-7193-2460", email: "tg.oh@bchicken.kr", openedAt: "2020.01.06", staffCount: "있음 (3명)" },
  { id: "TD-26-0130", business: "J서점", owner: "도가온", bizNo: "101-38-29514", industry: "서적 소매", taxType: "일반과세자", channels: "오프라인, 온라인 쇼핑몰", stage: "제출 중", payment: "결제 완료", receivedAt: "01.13 18:40", assignee: "문지후", jobId: "J-0120-02", flags: [], consent: consent("01.13 18:44", "01.13 18:45", "01.13 20:11"), phone: "010-5832-1094", email: "go.do@jbooks.kr", openedAt: "2015.07.22", staffCount: "있음 (1명)" },
  { id: "TD-26-0129", business: "Y분식", owner: "진하람", bizNo: "312-44-08267", industry: "분식점", taxType: "일반과세자", channels: "오프라인, 배달앱", stage: "제출 중", payment: "결제 완료", receivedAt: "01.13 11:55", assignee: "문지후", jobId: "J-0120-06", flags: [], consent: consent("01.13 11:59", "01.13 12:00", "01.13 12:47"), phone: "010-6627-3581", email: "hr.jin@ybunsik.kr", openedAt: "2022.12.01", staffCount: "있음 (1명)" },
  { id: "TD-26-0128", business: "X카페 연희점", owner: "한소율", bizNo: "105-91-36720", industry: "커피 전문점", taxType: "일반과세자", channels: "오프라인", stage: "제출 중", payment: "결제 완료", receivedAt: "01.12 20:17", assignee: "문지후", jobId: "J-0120-08", flags: ["신규 고객"], consent: consent("01.12 20:21", "01.12 20:22", "01.13 08:05"), phone: "010-4490-6215", email: "sy.han@xcafe.kr", openedAt: "2025.09.15", staffCount: "있음 (2명)" },
  { id: "TD-26-0127", business: "V정육점", owner: "석태호", bizNo: "131-27-58403", industry: "육류 소매", taxType: "일반과세자", channels: "오프라인, 온라인 쇼핑몰", stage: "제출 중", payment: "결제 완료", receivedAt: "01.12 09:34", assignee: "문지후", jobId: "J-0120-10", flags: [], consent: consent("01.12 09:38", "01.12 09:39", "01.12 10:52"), phone: "010-3014-8867", email: "th.seok@vmeat.kr", openedAt: "2014.03.27", staffCount: "있음 (3명)" },
  { id: "TD-26-0126", business: "M커피랩", owner: "권도윤", bizNo: "264-80-11539", industry: "커피 원두 제조", taxType: "일반과세자", channels: "오프라인, 온라인 쇼핑몰", stage: "제출 중", payment: "결제 완료", receivedAt: "01.11 15:22", assignee: "문지후", jobId: "J-0120-11", flags: [], consent: consent("01.11 15:26", "01.11 15:27", "01.11 16:10"), phone: "010-8251-4730", email: "dy.kwon@mcoffeelab.kr", openedAt: "2019.05.13", staffCount: "있음 (2명)" },
  { id: "TD-26-0125", business: "N문구", owner: "표은재", bizNo: "119-36-74205", industry: "문구 소매", taxType: "일반과세자", channels: "오프라인", stage: "제출 중", payment: "결제 완료", receivedAt: "01.10 13:47", assignee: "문지후", jobId: "J-0120-12", flags: [], consent: consent("01.10 13:51", "01.10 13:52", "01.10 14:30"), phone: "010-1739-5402", email: "ej.pyo@nmungu.kr", openedAt: "2013.08.30", staffCount: "없음" },
  { id: "TD-26-0124", business: "O철물", owner: "경민재", bizNo: "502-14-60938", industry: "철물 소매", taxType: "일반과세자", channels: "오프라인", stage: "제출 중", payment: "결제 완료", receivedAt: "01.10 10:02", assignee: "문지후", jobId: "J-0120-04", flags: [], consent: consent("01.10 10:06", "01.10 10:07", "01.10 11:45"), phone: "010-9306-2817", email: "mj.kyung@ohardware.kr", openedAt: "2011.11.11", staffCount: "있음 (1명)" },
  { id: "TD-26-0123", business: "Z헤어살롱", owner: "남희재", bizNo: "211-53-84176", industry: "미용업", taxType: "일반과세자", channels: "오프라인", stage: "접수 완료", payment: "결제 완료", receivedAt: "01.09 19:28", assignee: "문지후", jobId: "J-0120-05", flags: [], consent: consent("01.09 19:32", "01.09 19:33", "01.09 21:07"), phone: "010-2675-9043", email: "hj.nam@zhair.kr", openedAt: "2018.02.26", staffCount: "있음 (2명)" },
  { id: "TD-26-0121", business: "H수산 노량진점", owner: "차승우", bizNo: "108-22-95318", industry: "수산물 소매", taxType: "일반과세자", channels: "오프라인, 온라인 쇼핑몰", stage: "접수 완료", payment: "결제 완료", receivedAt: "01.09 08:16", assignee: "문지후", jobId: "J-0120-03", flags: [], consent: consent("01.09 08:20", "01.09 08:21", "01.09 09:44"), phone: "010-4183-7726", email: "sw.cha@hsusan.kr", openedAt: "2012.06.15", staffCount: "있음 (4명)" },
  { id: "TD-26-0119", business: "G한식당", owner: "모하늘", bizNo: "214-71-30652", industry: "한식 음식점", taxType: "일반과세자", channels: "오프라인, 배달앱", stage: "제출 중", payment: "결제 완료", receivedAt: "01.08 17:39", assignee: "문지후", jobId: "J-0120-01", flags: [], consent: consent("01.08 17:43", "01.08 17:44", "01.08 18:58"), phone: "010-7048-3159", email: "hn.mo@gkorean.kr", openedAt: "2016.04.04", staffCount: "있음 (5명)" },
  { id: "TD-26-0118", business: "D베이커리 망원점", owner: "류정민", bizNo: "214-38-90517", industry: "제과점업", taxType: "일반과세자", channels: "오프라인, 배달앱", stage: "접수 완료", payment: "결제 완료", receivedAt: "01.08 14:22", assignee: "문지후", jobId: "J-0120-07", flags: ["보완 이력"], consent: consent("01.08 14:40", "01.08 14:41", "01.09 09:02"), phone: "010-4826-3051", email: "jm.ryu@dbakery.kr", openedAt: "2021.04.12", staffCount: "있음 (2명)" },
];

export const POA_FILING_ID = "TD-26-0118";

/** 접수 건별 증빙. D베이커리는 사용자 웹의 EVIDENCE_SLOTS를 쓴다 (review 화면) */
export type AdminEvidence = { title: string; group: string; file: string; state: EvidenceState; note?: string };

const GENERIC_EVIDENCE: AdminEvidence[] = [
  { group: "매출", title: "POS 매출 집계표", file: "POS_매출_2025H2.pdf", state: "제출" },
  { group: "매출", title: "배달앱 정산 내역", file: "배달앱_정산_2025H2.xlsx", state: "제출" },
  { group: "매입", title: "매입 세금계산서", file: "세금계산서_원재료_14건.zip", state: "제출" },
  { group: "매입", title: "현금영수증 (지출증빙)", file: "IMG_2208.jpg", state: "읽기 오류", note: "기울어짐 18도, 하단 금액 영역 잘림" },
  { group: "카드 내역", title: "사업용 카드 사용내역", file: "사업용카드_2025H2.xlsx", state: "제출" },
  { group: "기타 증빙", title: "임대료 세금계산서", file: "", state: "미제출" },
];

export function evidenceFor(f: Filing): AdminEvidence[] {
  if (f.stage === "보완 요청") {
    return GENERIC_EVIDENCE.map((e, i) => (i === 2 ? { ...e, state: "보완 요청" as const, note: f.memo } : e));
  }
  return GENERIC_EVIDENCE;
}

/** 근거 탭: RAG 검색 결과와 고객 자료를 나란히 */
export const RAG_EVIDENCE = [
  {
    query: "배달앱 중개수수료 매입세액 공제",
    doc: "전자상거래 중개수수료 매입세액 공제 사례",
    date: "2025.10.02 기준",
    score: 0.91,
    excerpt: "통신판매중개자가 발급한 수수료 세금계산서는 사업 관련 매입으로 보아 매입세액 공제 대상이다.",
    customer: "배달앱A, B 수수료 세금계산서 12건 | 공급가액 합계 4,186,300원",
    review: true,
  },
  {
    query: "신용카드매출전표 발행세액공제 한도",
    doc: "부가가치세 신고 안내 (개인 일반과세자)",
    date: "2025.12.20 기준",
    score: 0.88,
    excerpt: "직전연도 공급가액 10억원 이하 개인사업자는 발행금액의 1.3%, 연간 1,000만원 한도로 공제한다.",
    customer: "카드, 현금영수증 매출 128,904,200원 | 산출 공제 1,675,754원",
    review: false,
  },
  {
    query: "업종코드 주업종 판단 기준",
    doc: "업종코드 분류표 (귀속 2025)",
    date: "2025.03.31 기준",
    score: 0.79,
    excerpt: "둘 이상의 업종을 겸영하는 경우 수입금액이 가장 큰 업종을 주업종으로 한다.",
    customer: "매장 매출 37.2% | 배달앱 매출 62.8%",
    review: true,
  },
];

/* ------------------------------------------------------------------ 자동 신고 작업 */

export type LogLine = { at: string; level: "info" | "warn" | "error"; text: string };

export type Job = {
  id: string;
  filingId: string;
  business: string;
  owner: string;
  bizNo: string;
  mode: JobMode;
  state: JobState;
  /** 현재 단계, 실패 단계, 또는 멈춘 단계의 인덱스 (0~7). 접수 완료는 8 */
  step: number;
  startedAt: string;
  updatedAt: string;
  failReason?: FailReason;
  failDetail?: string;
  failAction?: string;
  converted?: boolean;
  waitReason?: string;
  receiptNo?: string;
  amounts: { sales: number; purchaseTax: number; cardPurchase: number; credit: number };
  /** 입력값 대조에서 홈택스 값이 달라진 행 라벨 */
  mismatch?: { label: string; hometax: string };
  /** 단계별 소요 초. 지터를 주어 시각이 정각에 몰리지 않게 */
  durations: number[];
};

export const JOBS: Job[] = [
  {
    id: "J-0120-13", filingId: "TD-26-0136", business: "W공방", owner: "여채윤", bizNo: "406-19-62084",
    mode: "자동", state: "실행 전", step: 0, startedAt: "10:31 예정", updatedAt: "10:26:41",
    amounts: { sales: 44180000, purchaseTax: 2106370, cardPurchase: 812400, credit: 213500 },
    durations: [6, 9, 7, 47, 19, 5, 4, 3],
  },
  {
    id: "J-0120-12", filingId: "TD-26-0125", business: "N문구", owner: "표은재", bizNo: "119-36-74205",
    mode: "자동", state: "진행 중", step: 6, startedAt: "10:25:12", updatedAt: "10:27:03",
    amounts: { sales: 69215000, purchaseTax: 4387640, cardPurchase: 1306180, credit: 318900 },
    durations: [5, 8, 6, 51, 23, 4, 4, 3],
  },
  {
    id: "J-0120-11", filingId: "TD-26-0126", business: "M커피랩", owner: "권도윤", bizNo: "264-80-11539",
    mode: "자동", state: "진행 중", step: 3, startedAt: "10:24:08", updatedAt: "10:26:58",
    amounts: { sales: 120774000, purchaseTax: 6630850, cardPurchase: 2418090, credit: 942000 },
    durations: [7, 10, 6, 49, 22, 5, 4, 3],
  },
  {
    id: "J-0120-10", filingId: "TD-26-0127", business: "V정육점", owner: "석태호", bizNo: "131-27-58403",
    mode: "자동", state: "실패", step: 4, startedAt: "10:02:17", updatedAt: "10:03:46",
    failReason: "첨부 실패",
    failDetail: "신용카드매출전표등 수령명세서 PDF가 12.4MB로 홈택스 첨부 한도 10MB를 넘었습니다. 3회 재시도 후 중단했습니다.",
    failAction: "증빙 처리본을 다시 압축해 9.1MB로 만들었습니다. 부속서류 첨부 단계부터 재처리하면 됩니다.",
    amounts: { sales: 187605000, purchaseTax: 13944180, cardPurchase: 3184200, credit: 1000000 },
    durations: [6, 9, 8, 52, 61, 5, 4, 3],
  },
  {
    id: "J-0120-09", filingId: "TD-26-0132", business: "U안경 신촌점", owner: "탁지안", bizNo: "110-62-40975",
    mode: "대기", state: "인증 대기", step: 5, startedAt: "09:51:30", updatedAt: "09:53:02",
    waitReason: "보완 이력",
    amounts: { sales: 133920000, purchaseTax: 8710460, cardPurchase: 1972510, credit: 595200 },
    durations: [6, 8, 7, 50, 21, 0, 0, 0],
  },
  {
    id: "J-0120-08", filingId: "TD-26-0128", business: "X카페 연희점", owner: "한소율", bizNo: "105-91-36720",
    mode: "대기", state: "인증 대기", step: 5, startedAt: "09:40:05", updatedAt: "09:41:39",
    waitReason: "신규 고객",
    amounts: { sales: 102548000, purchaseTax: 6047930, cardPurchase: 2210840, credit: 861300 },
    durations: [5, 9, 7, 48, 25, 0, 0, 0],
  },
  {
    id: "J-0120-07", filingId: "TD-26-0118", business: "D베이커리 망원점", owner: "류정민", bizNo: "214-38-90517",
    mode: "자동", state: "접수 완료", step: 8, startedAt: "09:12:07", updatedAt: "09:16:02",
    receiptNo: "2026-01-20-1-047-31862",
    amounts: { sales: 164382000, purchaseTax: 9812340, cardPurchase: 2864150, credit: 1000000 },
    durations: [6, 9, 7, 118, 52, 5, 26, 12],
  },
  {
    id: "J-0120-06", filingId: "TD-26-0129", business: "Y분식", owner: "진하람", bizNo: "312-44-08267",
    mode: "자동", state: "인증 대기", step: 5, startedAt: "09:03:44", updatedAt: "09:06:31",
    converted: true, failReason: "인증 실패",
    failDetail: "세무대리인 공동인증서 서명 요청에 응답이 없어 60초 후 시간 초과됐습니다.",
    failAction: "실패 시 대기 자동 전환 규칙으로 인증 대기에 넣었습니다.",
    amounts: { sales: 81337000, purchaseTax: 4918260, cardPurchase: 1588730, credit: 702400 },
    durations: [5, 8, 6, 46, 20, 63, 0, 0],
  },
  {
    id: "J-0120-05", filingId: "TD-26-0123", business: "Z헤어살롱", owner: "남희재", bizNo: "211-53-84176",
    mode: "자동", state: "접수 완료", step: 8, startedAt: "08:54:21", updatedAt: "08:58:14",
    receiptNo: "2026-01-20-1-047-29417",
    amounts: { sales: 58904000, purchaseTax: 1842150, cardPurchase: 640220, credit: 507600 },
    durations: [5, 9, 6, 97, 48, 5, 31, 11],
  },
  {
    id: "J-0120-04", filingId: "TD-26-0124", business: "O철물", owner: "경민재", bizNo: "502-14-60938",
    mode: "자동", state: "실패", step: 3, startedAt: "08:47:52", updatedAt: "08:49:20",
    failReason: "입력 오류",
    failDetail: "신고서 (14)란 그 밖의 공제매입세액 합계가 신용카드매출전표등 수령명세서 합계와 다릅니다.",
    failAction: "필드 매핑의 카드 매입 공급가액 형식(천 단위 구분 기호)을 확인한 뒤 항목 입력 단계부터 재처리합니다.",
    mismatch: { label: "신용카드 매입 공급가액 (원)", hometax: "31,842" },
    amounts: { sales: 76281000, purchaseTax: 5130720, cardPurchase: 3184200, credit: 412800 },
    durations: [6, 8, 7, 61, 0, 0, 0, 0],
  },
  {
    id: "J-0120-03", filingId: "TD-26-0121", business: "H수산 노량진점", owner: "차승우", bizNo: "108-22-95318",
    mode: "자동", state: "접수 완료", step: 8, startedAt: "08:36:40", updatedAt: "08:41:09",
    receiptNo: "2026-01-20-1-047-27703",
    amounts: { sales: 212640500, purchaseTax: 15882410, cardPurchase: 4027360, credit: 1000000 },
    durations: [7, 9, 7, 131, 64, 5, 29, 14],
  },
  {
    id: "J-0120-02", filingId: "TD-26-0130", business: "J서점", owner: "도가온", bizNo: "101-38-29514",
    mode: "자동", state: "실패", step: 7, startedAt: "08:21:15", updatedAt: "08:29:47",
    failReason: "결과 미확인",
    failDetail: "제출 응답은 받았지만 5분 동안 접수번호가 조회되지 않았습니다. 중복 제출 위험이 있어 자동 재시도를 막았습니다.",
    failAction: "홈택스 신고서 조회에서 접수 여부를 먼저 확인합니다. 접수돼 있으면 접수번호만 수신합니다.",
    amounts: { sales: 98412000, purchaseTax: 7204880, cardPurchase: 1440170, credit: 640300 },
    durations: [6, 9, 7, 58, 24, 5, 27, 300],
  },
  {
    id: "J-0120-01", filingId: "TD-26-0119", business: "G한식당", owner: "모하늘", bizNo: "214-71-30652",
    mode: "자동", state: "실패", step: 2, startedAt: "08:05:33", updatedAt: "08:06:58",
    failReason: "세션 만료",
    failDetail: "신고 메뉴로 이동하는 중 홈택스 세션이 만료됐습니다. 에이전트 PC가 07:58에 절전에서 복귀한 직후입니다.",
    failAction: "에이전트가 다시 로그인한 뒤 홈택스 로그인 단계부터 재처리합니다.",
    amounts: { sales: 142316000, purchaseTax: 9480210, cardPurchase: 2952600, credit: 1000000 },
    durations: [6, 9, 70, 0, 0, 0, 0, 0],
  },
];

export const DEFAULT_JOB_ID = "J-0120-10";

export function jobTax(job: Job) {
  const salesTax = Math.round(job.amounts.sales * 0.1);
  const cardTax = Math.round(job.amounts.cardPurchase * 0.1);
  // purchaseTax는 매입세액 합계(세금계산서분 + 카드분)다. 사용자 웹의 매입세액과 같은 값
  const invoiceTax = job.amounts.purchaseTax - cardTax;
  const payable = salesTax - job.amounts.purchaseTax - job.amounts.credit;
  return { salesTax, cardTax, invoiceTax, payable };
}

/** 입력값 대조표: 플랫폼 값과 홈택스에 입력된 값 */
export function reconcile(job: Job) {
  const t = jobTax(job);
  const rows = [
    { label: "과세 매출 공급가액 (원)", field: "(1)란", value: job.amounts.sales },
    { label: "매출세액 (원)", field: "(1)란 세액", value: t.salesTax },
    { label: "세금계산서 매입세액 (원)", field: "(10)란 세액", value: t.invoiceTax },
    { label: "신용카드 매입 공급가액 (원)", field: "(14)란", value: job.amounts.cardPurchase },
    { label: "신용카드 매입세액 (원)", field: "(14)란 세액", value: t.cardTax },
    { label: "신용카드매출전표 발행공제 (원)", field: "(19)란", value: job.amounts.credit },
    { label: "납부할 세액 (원)", field: "(27)란", value: t.payable },
  ];
  const entered = job.step >= 4 || (job.step === 3 && job.state === "실패");
  return rows.map((r) => {
    const platform = r.value.toLocaleString("ko-KR");
    let hometax: string | null = entered ? platform : null;
    if (job.mismatch && r.label === job.mismatch.label) hometax = job.mismatch.hometax;
    if (job.state === "진행 중" && job.step === 3) hometax = ["(1)란", "(1)란 세액", "(10)란 세액"].includes(r.field) ? platform : null;
    return { ...r, platform, hometax, ok: hometax === null ? null : hometax === platform };
  });
}

/** 단계별로 홈택스에서 처리되는 내용 */
export const STEP_EXPLAIN: { title: string; body: string; items: string[] }[] = [
  { title: "신고 데이터 생성", body: "세무사가 확정한 신고 내용을 홈택스 입력 순서대로 정리합니다.", items: ["확정 금액 34개 항목 생성", "부속서류 처리본을 PDF로 변환", "필드 매핑 규칙 v12 적용"] },
  { title: "홈택스 로그인", body: "사무소 PC의 실행 에이전트가 세무대리인 계정으로 로그인합니다.", items: ["세무대리인 아이디 로그인", "세션 유지 시간 60분", "인증서는 에이전트 PC 밖으로 나가지 않음"] },
  { title: "신고 메뉴 이동", body: "수임 납세자를 조회하고 부가가치세 신고서 작성 화면으로 들어갑니다.", items: ["신고/납부 > 부가가치세 > 일반과세자 확정신고", "수임 납세자 사업자번호 조회", "과세기간 2025년 2기 선택"] },
  { title: "항목 입력", body: "신고서 기본정보, 과세표준과 매출세액, 매입세액, 공제세액을 순서대로 채웁니다.", items: ["기본정보와 업종코드", "과세표준 및 매출세액 (1)~(9)란", "매입세액 (10)~(17)란, 경감공제 (18)~(21)란"] },
  { title: "부속서류 첨부", body: "신고서에 필요한 명세서를 홈택스 서식으로 작성하거나 파일로 첨부합니다.", items: ["신용카드매출전표등 수령명세서", "매출처, 매입처별 세금계산서 합계표", "파일 한도 10MB, PDF만 허용"] },
  { title: "인증", body: "제출 전에 세무대리인 공동인증서로 전자서명합니다. 인증 대기 모드에서는 여기서 멈춥니다.", items: ["에이전트 PC의 인증서로 서명", "대기 모드는 담당 세무사가 직접 인증", "60초 응답 없으면 인증 실패"] },
  { title: "제출", body: "서명된 신고서를 제출하고 홈택스의 제출 응답을 기다립니다.", items: ["신고서 제출 요청", "제출 응답 코드 확인", "중복 제출 방지 잠금"] },
  { title: "접수번호 수신", body: "신고서 조회 화면에서 접수번호를 찾아 저장하고 접수증 PDF를 내려받습니다.", items: ["접수번호 조회 (최대 5분)", "접수증 PDF 저장 후 고객에게 전달", "알림톡 신고 접수 완료 발송"] },
];

const STEP_LOGS: string[][] = [
  ["확정 신고 데이터 34개 항목 생성", "부속서류 3건 PDF 변환 완료"],
  ["세무대리인 계정 로그인 요청 (에이전트 PC-02)", "세션 발급 완료"],
  ["부가가치세 일반과세자 확정신고 메뉴 진입", "수임 납세자 조회 완료"],
  ["기본정보 입력 완료", "과세표준 및 매출세액 6개 항목 입력", "매입세액 4개 항목 입력", "입력값 대조 34/34 일치"],
  ["신용카드매출전표등 수령명세서 첨부", "세금계산서 합계표 첨부 완료"],
  ["공동인증서 서명 요청", "서명 완료"],
  ["신고서 제출 요청", "제출 응답 수신 (정상)"],
  ["접수번호 조회", "접수증 PDF 저장"],
];

function addSeconds(hms: string, sec: number) {
  const [h, m, s] = hms.split(":").map(Number);
  const t = h * 3600 + m * 60 + s + sec;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)}`;
}

export type StepStatus = "done" | "run" | "wait" | "fail" | "pending";

export function stepStatuses(job: Job): StepStatus[] {
  return JOB_STEPS.map((_, i) => {
    if (job.state === "접수 완료") return "done";
    if (i < job.step) return "done";
    if (i > job.step) return "pending";
    if (job.state === "실패") return "fail";
    if (job.state === "인증 대기") return "wait";
    if (job.state === "진행 중") return "run";
    return "pending";
  });
}

/** 단계별 실행 로그. 단계 시작 시각은 startedAt에 소요 초를 누적해 만든다 */
export function stepLogs(job: Job): LogLine[][] {
  const statuses = stepStatuses(job);
  const base = job.startedAt.includes(":") && job.startedAt.split(":").length === 3 ? job.startedAt : "10:31:00";
  let cursor = base;
  return JOB_STEPS.map((_, i) => {
    const st = statuses[i];
    const start = cursor;
    const dur = job.durations[i] || 0;
    cursor = addSeconds(cursor, dur);
    if (st === "pending") return [];
    const lines = STEP_LOGS[i];
    const out: LogLine[] = [];
    const n = st === "done" ? lines.length : Math.max(1, lines.length - 1);
    for (let k = 0; k < n; k++) {
      const at = addSeconds(start, Math.round(((k + 1) / (lines.length + 1)) * Math.max(dur, 2)));
      let text = lines[k];
      if (i === 7 && k === 0 && job.receiptNo) text = `접수번호 ${job.receiptNo} 수신`;
      out.push({ at, level: "info", text });
    }
    if (st === "fail") {
      if (job.failReason === "첨부 실패") {
        out.push({ at: addSeconds(start, 22), level: "warn", text: "첨부 업로드 거부 (파일 크기 12.4MB), 1회 재시도" });
        out.push({ at: addSeconds(start, 41), level: "warn", text: "첨부 업로드 거부, 2회 재시도" });
        out.push({ at: addSeconds(start, 61), level: "error", text: "첨부 실패: 홈택스 첨부 한도 10MB 초과, 3회 재시도 후 중단" });
      } else if (job.failReason === "입력 오류") {
        out.push({ at: addSeconds(start, 58), level: "error", text: "입력 오류: (14)란 31,842 입력, 명세서 합계 3,184,200과 불일치" });
      } else if (job.failReason === "결과 미확인") {
        out.push({ at: addSeconds(start, 120), level: "warn", text: "접수번호 조회 결과 없음, 3분 후 재조회" });
        out.push({ at: addSeconds(start, 300), level: "error", text: "결과 미확인: 5분 동안 접수번호 미조회, 자동 재시도 중단" });
      } else if (job.failReason === "세션 만료") {
        out.push({ at: addSeconds(start, 70), level: "error", text: "세션 만료: 메뉴 이동 중 로그인 화면으로 돌아감" });
      }
    }
    if (st === "wait") {
      if (job.converted) {
        out.push({ at: addSeconds(start, 61), level: "error", text: "인증 실패: 서명 응답 시간 초과 (60초)" });
        out.push({ at: addSeconds(start, 63), level: "warn", text: "실패 시 대기 자동 전환, 인증 대기로 이동" });
      } else {
        out.push({ at: addSeconds(start, 1), level: "info", text: `인증 대기 모드 (${job.waitReason}), 담당 세무사 인증까지 멈춤` });
      }
    }
    if (st === "run") out.push({ at: addSeconds(start, Math.max(1, dur - 3)), level: "info", text: "진행 중" });
    return out;
  });
}

export const JOB_SUMMARY = {
  running: JOBS.filter((j) => j.state === "진행 중").length,
  waiting: JOBS.filter((j) => j.state === "인증 대기").length,
  failed: JOBS.filter((j) => j.state === "실패").length,
  doneToday: JOBS.filter((j) => j.state === "접수 완료").length,
  queued: JOBS.filter((j) => j.state === "실행 전").length,
};

/* ------------------------------------------------------------------ 실행 에이전트, 자동화 설정 */

export const AGENT_STATUS = {
  connected: true,
  pc: "E세무회계 3층 신고 PC-02",
  version: "2.4.1",
  heartbeat: "10:27:04",
  latency: "38ms",
  cert: { owner: "문지후 세무사", issuer: "K인증", expires: "2026.09.14" },
  concurrency: 2,
};

export const AGENT_HISTORY = [
  { at: "01.20 08:01:47", kind: "재연결" as const, note: "PC 절전 복귀, 인증서 확인 완료" },
  { at: "01.20 07:58:12", kind: "연결 끊김" as const, note: "응답 없음 90초, 진행 작업 1건 일시 중지" },
  { at: "01.19 19:02:33", kind: "재연결" as const, note: "에이전트 2.4.1 업데이트 후 재시작" },
  { at: "01.19 18:59:05", kind: "연결 끊김" as const, note: "업데이트 설치" },
  { at: "01.17 08:00:21", kind: "재연결" as const, note: "사무소 PC 부팅" },
];

export const AUTOMATION_DEFAULTS = {
  defaultMode: "자동" as JobMode,
  rules: [
    { id: "new", label: "신규 고객", desc: "첫 신고 고객은 인증 대기", on: true, matched: 3 },
    { id: "supp", label: "보완 이력", desc: "보완 요청이 1회 이상 있었던 건은 인증 대기", on: true, matched: 4 },
    { id: "memo", label: "검토 메모", desc: "세무사 검토 메모가 남은 건은 인증 대기", on: false, matched: 2 },
  ],
  fallbackToWait: true,
  emergencyStop: false,
};

/* ------------------------------------------------------------------ 필드 매핑 */

export type MapState = "정상" | "누락" | "형식 불일치";

export const FIELD_MAP: { platform: string; key: string; form: string; field: string; format: string; state: MapState }[] = [
  { platform: "사업자등록번호", key: "biz.no", form: "기본정보", field: "사업자등록번호", format: "000-00-00000", state: "정상" },
  { platform: "과세기간", key: "filing.period", form: "기본정보", field: "과세기간", format: "YYYY년 N기", state: "정상" },
  { platform: "주업종 코드", key: "biz.industryCode", form: "기본정보", field: "업종코드", format: "숫자 6자리", state: "정상" },
  { platform: "과세 매출 공급가액", key: "sales.taxable", form: "일반과세자 신고서", field: "(1)란 금액", format: "정수, 구분 기호 없음", state: "정상" },
  { platform: "카드, 현금영수증 매출", key: "sales.card", form: "일반과세자 신고서", field: "(3)란 금액", format: "정수, 구분 기호 없음", state: "정상" },
  { platform: "세금계산서 매입 공급가액", key: "purchase.invoice", form: "일반과세자 신고서", field: "(10)란 금액", format: "정수, 구분 기호 없음", state: "정상" },
  { platform: "신용카드 매입 공급가액", key: "purchase.card", form: "일반과세자 신고서", field: "(14)란 금액", format: "정수, 구분 기호 없음", state: "형식 불일치" },
  { platform: "의제매입세액", key: "purchase.deemed", form: "일반과세자 신고서", field: "(14)란 의제매입", format: "정수", state: "누락" },
  { platform: "신용카드매출전표 발행공제", key: "credit.cardIssue", form: "일반과세자 신고서", field: "(19)란 금액", format: "정수, 한도 1,000만원", state: "정상" },
  { platform: "전자신고세액공제", key: "credit.efile", form: "일반과세자 신고서", field: "(20)란", format: "고정 10,000", state: "정상" },
  { platform: "수령명세서 카드별 합계", key: "attach.cardList", form: "신용카드매출전표등 수령명세서", field: "카드별 합계", format: "정수", state: "정상" },
  { platform: "매입처 사업자번호", key: "attach.vendorBizNo", form: "매입처별 세금계산서 합계표", field: "공급자 등록번호", format: "숫자 10자리", state: "누락" },
];

export const ATTACH_RULES = [
  { slot: "매출 (POS, 배달앱 정산)", target: "매출처별 세금계산서 합계표 참고자료", format: "PDF", limit: "10MB", convert: "엑셀은 PDF 변환, 시트별 1쪽" },
  { slot: "매입 세금계산서", target: "매입처별 세금계산서 합계표", format: "서식 입력", limit: "", convert: "OCR 값을 서식 칸으로 입력" },
  { slot: "카드 내역", target: "신용카드매출전표등 수령명세서", format: "PDF", limit: "10MB", convert: "8MB 초과 시 이미지 해상도 150dpi로 압축" },
  { slot: "현금영수증", target: "신용카드매출전표등 수령명세서", format: "PDF", limit: "10MB", convert: "회전 보정, 여백 자르기 후 병합" },
  { slot: "기타 증빙", target: "기타 첨부서류", format: "PDF", limit: "10MB", convert: "건별 PDF, 파일명에 증빙 종류" },
];

export const MAP_CHECKS = [
  { level: "형식 불일치" as MapState, title: "신용카드 매입 공급가액", detail: "플랫폼 값에 천 단위 구분 기호가 남아 홈택스에서 앞 5자리만 입력됨. O철물 작업 실패 원인", jobs: 1 },
  { level: "누락" as MapState, title: "의제매입세액", detail: "음식점, 제과점 업종에서 값이 있는데 매핑 대상 칸이 없음", jobs: 3 },
  { level: "누락" as MapState, title: "매입처 사업자번호", detail: "OCR 신뢰도 60% 미만인 행은 빈 값으로 넘어감", jobs: 2 },
];

/* ------------------------------------------------------------------ 회원, 결제, 지식자료 */

export const MEMBERS = [
  { id: "U-20418", name: "류*민", business: "D베이커리 망원점", phone: "010-****-3051", joined: "카카오", filings: 3, last: "2025년 2기 접수 완료", consult: "신청" as const },
  { id: "U-21307", name: "마*진", business: "T요가 합정", phone: "010-****-2048", joined: "네이버", filings: 1, last: "2025년 2기 접수", consult: "미신청" as const },
  { id: "U-21296", name: "길*린", business: "S수제화", phone: "010-****-6617", joined: "이메일", filings: 1, last: "2025년 2기 검토 중", consult: "미신청" as const },
  { id: "U-19842", name: "오*건", business: "B치킨 성수점", phone: "010-****-2460", joined: "카카오", filings: 4, last: "2025년 2기 검토 중", consult: "상담 완료" as const },
  { id: "U-20977", name: "서*인", business: "C꽃집", phone: "010-****-0447", joined: "카카오", filings: 2, last: "2025년 2기 보완 요청", consult: "미신청" as const },
  { id: "U-18315", name: "차*우", business: "H수산 노량진점", phone: "010-****-7726", joined: "네이버", filings: 5, last: "2025년 2기 접수 완료", consult: "신청" as const },
  { id: "U-21140", name: "장*혁", business: "K스튜디오", phone: "010-****-8812", joined: "카카오", filings: 1, last: "2025년 2기 입금 대기", consult: "미신청" as const },
  { id: "U-19066", name: "석*호", business: "V정육점", phone: "010-****-8867", joined: "이메일", filings: 4, last: "2025년 2기 제출 중", consult: "상담 완료" as const },
  { id: "U-20653", name: "권*윤", business: "M커피랩", phone: "010-****-4730", joined: "카카오", filings: 2, last: "2025년 2기 제출 중", consult: "신청" as const },
  { id: "U-20112", name: "엄*준", business: "R세탁 상수점", phone: "010-****-1873", joined: "네이버", filings: 2, last: "2025년 2기 반려", consult: "미신청" as const },
];

export const MEMBER_TOTALS = { total: 1284, newThisPeriod: 212, consultRequested: 47, consultDone: 19 };

export const PAYMENT_ROWS: {
  id: string;
  business: string;
  method: "신용카드" | "가상계좌";
  detail: string;
  amount: number;
  state: PaymentState;
  at: string;
  due?: string;
}[] = [
  { id: "P-270120-0412", business: "T요가 합정", method: "신용카드", detail: "J카드 일시불", amount: 49500, state: "결제 완료", at: "01.20 09:50" },
  { id: "P-270120-0408", business: "S수제화", method: "신용카드", detail: "L카드 3개월", amount: 82500, state: "결제 완료", at: "01.20 08:34" },
  { id: "P-270119-0397", business: "R세탁 상수점", method: "신용카드", detail: "J카드 일시불", amount: 49500, state: "환불", at: "01.19 18:31" },
  { id: "P-270119-0391", business: "Q반찬가게", method: "가상계좌", detail: "F은행 562-910771-20438", amount: 71500, state: "기한 임박", at: "01.19 13:24", due: "01.21 23:59" },
  { id: "P-270118-0377", business: "E족발", method: "가상계좌", detail: "F은행 562-910733-58126", amount: 82500, state: "기한 경과", at: "01.16 10:12", due: "01.18 23:59" },
  { id: "P-270117-0362", business: "K스튜디오", method: "가상계좌", detail: "F은행 562-910706-14592", amount: 60500, state: "입금 대기", at: "01.17 21:16", due: "01.22 23:59" },
  { id: "P-270116-0349", business: "W공방", method: "신용카드", detail: "M카드 일시불", amount: 60500, state: "결제 완료", at: "01.16 11:10" },
  { id: "P-270115-0333", business: "C꽃집", method: "신용카드", detail: "J카드 일시불", amount: 71500, state: "결제 실패", at: "01.15 10:29" },
  { id: "P-270115-0334", business: "C꽃집", method: "가상계좌", detail: "F은행 562-910658-30217", amount: 71500, state: "결제 완료", at: "01.15 10:41" },
  { id: "P-270109-0281", business: "D베이커리 망원점", method: "가상계좌", detail: "F은행 562-910482-37105", amount: 82500, state: "결제 완료", at: "01.09 11:27" },
];

export const PAYMENT_TOTALS = { count: 168, paid: 11926500, pending: 2, overdue: 1, refunded: 3 };

export const KNOWLEDGE_DOCS = [
  { id: "KB-014", title: "부가가치세 신고 안내 (개인 일반과세자)", category: "신고 안내", version: "v7", date: "2025.12.20", chunks: 214, state: "적용" as const },
  { id: "KB-013", title: "전자상거래 중개수수료 매입세액 공제 사례", category: "공제 사례", version: "v3", date: "2025.10.02", chunks: 38, state: "적용" as const },
  { id: "KB-012", title: "사업용 신용카드 등록 및 매입세액 공제", category: "공제 사례", version: "v4", date: "2025.07.01", chunks: 61, state: "적용" as const },
  { id: "KB-011", title: "업종코드 분류표 (귀속 2025)", category: "기준표", version: "v2", date: "2025.03.31", chunks: 1342, state: "적용" as const },
  { id: "KB-010", title: "의제매입세액 공제율 및 한도", category: "공제 사례", version: "v5", date: "2025.07.01", chunks: 27, state: "적용" as const },
  { id: "KB-015", title: "부가가치세 신고 안내 (개인 일반과세자)", category: "신고 안내", version: "v8", date: "2026.01.15", chunks: 219, state: "검토 중" as const },
  { id: "KB-009", title: "간이과세자 납부면제 기준", category: "신고 안내", version: "v3", date: "2025.07.01", chunks: 19, state: "적용" as const },
];

export const SEARCH_TEST = {
  query: "배달앱 수수료 매입세액 공제 되나요",
  results: [
    { doc: "전자상거래 중개수수료 매입세액 공제 사례", version: "v3", date: "2025.10.02", score: 0.91, excerpt: "통신판매중개자가 발급한 수수료 세금계산서는 사업 관련 매입으로 보아 매입세액 공제 대상이다." },
    { doc: "사업용 신용카드 등록 및 매입세액 공제", version: "v4", date: "2025.07.01", score: 0.74, excerpt: "카드로 결제한 중개수수료는 신용카드매출전표등 수령명세서를 제출해 공제받는다." },
    { doc: "부가가치세 신고 안내 (개인 일반과세자)", version: "v7", date: "2025.12.20", score: 0.62, excerpt: "매입세액은 세금계산서, 신용카드매출전표 등 적격증빙을 받은 경우에만 공제한다." },
  ],
};
