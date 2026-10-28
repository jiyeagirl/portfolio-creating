// 사용자 웹 목업 데이터. 기준 시점은 2026-01-14(수), 2025년 2기 확정신고 기한 2026-01-26(월) D-12.
// 관리자 목록의 TD-26-0118 건이 이 고객이다 (lib/admin-data.ts).

import type { EvidenceState, FilingStage, PaymentState } from "@/projects/monitoring/taxdesk/lib/status";

export const CUSTOMER = {
  owner: "류정민",
  business: "D베이커리 망원점",
  bizNo: "214-38-90517",
  openedAt: "2021.04.12",
  taxType: "일반과세자",
  address: "서울특별시 마포구 망원로 74, 1층",
  phone: "010-4826-3051",
  email: "jm.ryu@dbakery.kr",
  industry: "제과점업",
  industryCode: "552107",
  channels: ["오프라인 매장", "배달앱"],
  staff: "직원 있음 (2명)",
  annualSales: "1억 5천만원 초과 3억원 이하",
};

export const FILING = {
  id: "TD-26-0118",
  kind: "확정신고",
  period: "2025년 2기",
  range: "2025.07.01 ~ 2025.12.31",
  deadline: "2026.01.26 (월)",
  dday: 12,
  receivedAt: "2026.01.08 14:22",
};

export const AGENT = {
  name: "문지후",
  title: "세무사",
  office: "E세무회계",
  regNo: "제14672호",
  managerNo: "M-30418",
  bizNo: "105-87-22391",
  phone: "02-3142-6870",
  address: "서울특별시 마포구 양화로 156, 7층",
  initial: "문",
  career: "부가세 신고 1,284건 | 음식, 제과 업종 담당",
};

export const FEE = {
  base: 49500,
  salesTier: 22000,
  salesTierLabel: "매출 1억 5천만원 초과 3억원 이하",
  options: [{ label: "배달앱 매출 대사", amount: 11000 }],
  get total() {
    return this.base + this.salesTier + this.options.reduce((s, o) => s + o.amount, 0);
  },
};

export const VIRTUAL_ACCOUNT = {
  bank: "F은행",
  number: "562-910482-37105",
  holder: "E세무회계(태스크데스크)",
  dueAt: "2026.01.10 (토) 23:59",
};

export type EvidenceSlot = {
  id: string;
  group: "매출" | "매입" | "카드 내역" | "기타 증빙";
  title: string;
  hint: string;
  state: EvidenceState;
  files: { name: string; size: string; pages?: number }[];
  required: boolean;
};

export const EVIDENCE_SLOTS: EvidenceSlot[] = [
  {
    id: "pos",
    group: "매출",
    title: "POS 매출 집계표",
    hint: "2025.07 ~ 12 월별 합계",
    state: "제출",
    files: [{ name: "POS_매출집계_2025하반기.pdf", size: "1.2MB", pages: 6 }],
    required: true,
  },
  {
    id: "delivery",
    group: "매출",
    title: "배달앱 정산 내역",
    hint: "배달앱 2곳 정산서",
    state: "보완 요청",
    files: [{ name: "배달앱A_정산_2025H2.xlsx", size: "284KB" }],
    required: true,
  },
  {
    id: "invoice-buy",
    group: "매입",
    title: "매입 세금계산서",
    hint: "밀가루, 버터 등 원재료",
    state: "제출",
    files: [
      { name: "세금계산서_G제분_1207.jpg", size: "620KB" },
      { name: "세금계산서_H유업_1215.jpg", size: "584KB" },
    ],
    required: true,
  },
  {
    id: "receipt",
    group: "매입",
    title: "현금영수증 (지출증빙)",
    hint: "포장재, 소모품",
    state: "읽기 오류",
    files: [{ name: "IMG_4021.jpg", size: "3.8MB" }],
    required: false,
  },
  {
    id: "card",
    group: "카드 내역",
    title: "사업용 카드 사용내역",
    hint: "홈택스 등록 카드 2장",
    state: "제출",
    files: [{ name: "사업용카드_사용내역_2025H2.xlsx", size: "196KB" }],
    required: true,
  },
  {
    id: "rent",
    group: "기타 증빙",
    title: "임대료 세금계산서",
    hint: "매장 임대인 발행분",
    state: "미제출",
    files: [],
    required: false,
  },
];

/** 읽기 오류 슬롯의 OCR 인식값. 일부 칸만 신뢰도가 낮다 */
export const OCR_FIELDS = [
  { label: "거래일자", value: "2025.11.18", confidence: 98 },
  { label: "공급자", value: "I포장산업", confidence: 94 },
  { label: "사업자번호", value: "318-2?-60415", confidence: 41 },
  { label: "공급가액 (원)", value: "286,000", confidence: 91 },
  { label: "부가세 (원)", value: "28,600", confidence: 89 },
];

export type ChatMessage =
  | { from: "user"; text: string; at: string }
  | {
      from: "ai";
      at: string;
      text: string;
      bullets?: string[];
      sources?: { title: string; date: string }[];
      needsReview?: boolean;
      industryPick?: { code: string; name: string; reason: string; selected?: boolean }[];
    };

export const CHAT: ChatMessage[] = [
  {
    from: "ai",
    at: "14:31",
    text: "제과점업, 오프라인 매장과 배달앱 매출, 직원 2명 기준으로 준비자료 6가지를 골랐어요.",
    bullets: [
      "매출: POS 집계표, 배달앱 정산 내역",
      "매입: 원재료 세금계산서, 지출증빙 현금영수증",
      "카드 내역: 홈택스에 등록한 사업용 카드",
      "기타: 매장 임대료 세금계산서 (있으면)",
    ],
    sources: [
      { title: "부가가치세 신고 안내 (개인 일반과세자)", date: "2025.12.20 기준" },
      { title: "사업용 신용카드 등록 및 매입세액 공제", date: "2025.07.01 기준" },
    ],
  },
  {
    from: "user",
    at: "14:33",
    text: "배달앱 수수료도 매입세액 공제가 되나요?",
  },
  {
    from: "ai",
    at: "14:33",
    text: "배달앱이 발행한 수수료 세금계산서가 있으면 매입세액으로 공제받을 수 있어요. 정산서와 함께 앱의 세금계산서 메뉴에서 받은 파일을 올려 주세요.",
    sources: [{ title: "전자상거래 중개수수료 매입세액 공제 사례", date: "2025.10.02 기준" }],
    needsReview: true,
  },
  {
    from: "ai",
    at: "14:34",
    text: "등록된 업종과 판매 방식으로 업종코드 후보를 찾았어요.",
    sources: [{ title: "업종코드 분류표 (귀속 2025)", date: "2025.03.31 기준" }],
    industryPick: [
      { code: "552107", name: "제과점업", reason: "사업자등록 업태와 일치, 매장 제조 판매", selected: true },
      { code: "525101", name: "전자상거래 소매업", reason: "배달앱 매출 비중 31.4%로 주업종 아님" },
    ],
  },
];

export const TIMELINE: { stage: FilingStage; at?: string; note?: string }[] = [
  { stage: "접수", at: "01.08 14:22", note: "신청서와 증빙 6건 접수" },
  { stage: "검토 중", at: "01.09 10:05", note: "문지후 세무사 배정" },
  { stage: "보완 요청", at: "01.12 16:48", note: "정산서, 수수료 세금계산서 2건" },
  { stage: "신고서 확정" },
  { stage: "제출 중" },
  { stage: "접수 완료" },
];

export const TIMELINE_DONE: { stage: FilingStage; at?: string; note?: string }[] = [
  { stage: "접수", at: "01.08 14:22", note: "신청서와 증빙 6건 접수" },
  { stage: "검토 중", at: "01.09 10:05", note: "문지후 세무사 배정" },
  { stage: "보완 요청", at: "01.12 16:48", note: "정산서, 수수료 세금계산서 2건, 01.13 제출" },
  { stage: "신고서 확정", at: "01.19 11:40", note: "세무사 승인" },
  { stage: "제출 중", at: "01.20 09:12", note: "홈택스 자동 제출" },
  { stage: "접수 완료", at: "01.20 09:16", note: "접수번호 수신" },
];

export const SUPPLEMENT = {
  requestedAt: "2026.01.12 16:48",
  dueAt: "2026.01.15 (목)",
  by: "문지후 세무사",
  slot: "배달앱 정산 내역",
  message:
    "배달앱A 정산서만 올라와 있어요. 매출 집계상 배달앱B 매출(11월, 12월)이 있어 그 기간 정산서가 필요합니다. 수수료 세금계산서도 함께 올려 주세요.",
  items: ["배달앱B 정산서 (11월, 12월)", "배달앱A, B 중개수수료 세금계산서"],
};

export const CONFIRMED = {
  receiptNo: "2026-01-20-1-047-31862",
  salesSupply: 164382000,
  salesTax: 16438200,
  purchaseTax: 9812340,
  credit: 1000000,
  get payable() {
    return this.salesTax - this.purchaseTax - this.credit;
  },
  payDue: "2026.01.26 (월)",
  payAccount: "국세 납부 가상계좌 (홈택스 발급)",
};

export const PAYMENTS: { at: string; item: string; method: string; amount: number; state: PaymentState }[] = [
  { at: "2026.01.09 11:27", item: "2025년 2기 확정신고 대리 수수료", method: "가상계좌 F은행", amount: 82500, state: "결제 완료" },
  { at: "2025.07.15 15:02", item: "2025년 1기 확정신고 대리 수수료", method: "신용카드 J카드", amount: 77000, state: "결제 완료" },
  { at: "2025.01.13 10:12", item: "2024년 2기 확정신고 대리 수수료", method: "신용카드 J카드", amount: 77000, state: "결제 완료" },
];

/** 신고 현황 목록. 첫 행이 진행 중인 FILING, 나머지는 접수가 끝난 지난 신고 */
export type FilingRecord = {
  id: string;
  period: string;
  kind: string;
  range: string;
  deadline: string;
  receivedAt: string;
  doneAt: string;
  confirmedAt: string;
  receiptNo: string;
  salesTax: number;
  purchaseTax: number;
  credit: number;
  payDue: string;
  timeline: { stage: FilingStage; at?: string; note?: string }[];
};

export const FILING_RECORDS: FilingRecord[] = [
  {
    id: FILING.id,
    period: FILING.period,
    kind: FILING.kind,
    range: FILING.range,
    deadline: FILING.deadline,
    receivedAt: FILING.receivedAt,
    doneAt: "2026.01.20 09:16",
    confirmedAt: "01.19 11:40",
    receiptNo: CONFIRMED.receiptNo,
    salesTax: CONFIRMED.salesTax,
    purchaseTax: CONFIRMED.purchaseTax,
    credit: CONFIRMED.credit,
    payDue: CONFIRMED.payDue,
    timeline: TIMELINE_DONE,
  },
  {
    id: "TD-25-0742",
    period: "2025년 1기",
    kind: "확정신고",
    range: "2025.01.01 ~ 2025.06.30",
    deadline: "2025.07.25 (금)",
    receivedAt: "2025.07.14 10:31",
    doneAt: "2025.07.22 14:05",
    confirmedAt: "07.21 17:20",
    receiptNo: "2025-07-22-1-047-11408",
    salesTax: 14210500,
    purchaseTax: 8603120,
    credit: 1000000,
    payDue: "2025.07.25 (금)",
    timeline: [
      { stage: "접수", at: "07.14 10:31", note: "신청서와 증빙 5건 접수" },
      { stage: "검토 중", at: "07.15 09:40", note: "문지후 세무사 배정" },
      { stage: "보완 요청", note: "요청 없음" },
      { stage: "신고서 확정", at: "07.21 17:20", note: "세무사 승인" },
      { stage: "제출 중", at: "07.22 14:01", note: "홈택스 자동 제출" },
      { stage: "접수 완료", at: "07.22 14:05", note: "접수번호 수신" },
    ],
  },
  {
    id: "TD-25-0103",
    period: "2024년 2기",
    kind: "확정신고",
    range: "2024.07.01 ~ 2024.12.31",
    deadline: "2025.01.31 (금)",
    receivedAt: "2025.01.12 16:08",
    doneAt: "2025.01.21 11:32",
    confirmedAt: "01.20 15:10",
    receiptNo: "2025-01-21-1-047-08215",
    salesTax: 13876400,
    purchaseTax: 8920310,
    credit: 1000000,
    payDue: "2025.01.31 (금)",
    timeline: [
      { stage: "접수", at: "01.12 16:08", note: "신청서와 증빙 6건 접수" },
      { stage: "검토 중", at: "01.13 10:22", note: "문지후 세무사 배정" },
      { stage: "보완 요청", at: "01.14 13:05", note: "카드매출 정산서 1건, 01.15 제출" },
      { stage: "신고서 확정", at: "01.20 15:10", note: "세무사 승인" },
      { stage: "제출 중", at: "01.21 11:28", note: "홈택스 자동 제출" },
      { stage: "접수 완료", at: "01.21 11:32", note: "접수번호 수신" },
    ],
  },
];

export const NEXT_SCHEDULE = {
  title: "2026년 1기 확정신고",
  range: "2026.01.01 ~ 2026.06.30",
  deadline: "2026.07.27 (월)",
  note: "4월 예정고지 세액이 나오면 알림톡으로 알려 드려요.",
};

export type KakaoMessage = {
  id: string;
  at: string;
  title: string;
  lines: { label: string; value: string }[];
  body: string;
  button: { label: string; screen: "documents" | "sign" | "status" };
  buttonState?: string;
};

/** 잠금화면 알림. 최신이 위. 기준 시각 2026.01.20(화) 10:27 */
export const KAKAO: KakaoMessage[] = [
  {
    id: "k6",
    at: "09:16",
    title: "신고 접수 완료",
    lines: [
      { label: "과세기간", value: "2025년 2기 확정" },
      { label: "접수번호", value: "2026-01-20-1-047-31862" },
      { label: "납부 예정액", value: "5,625,860원" },
    ],
    body: "류정민 님, D베이커리 망원점 부가세 신고가 홈택스에 접수됐어요. 납부 기한은 1월 26일(월)이에요.",
    button: { label: "접수증 보기", screen: "status" },
    buttonState: "done",
  },
  {
    id: "k5",
    at: "1월 19일",
    title: "신고 기한 D-7",
    lines: [
      { label: "신고 기한", value: "2026.01.26 (월)" },
      { label: "진행 상태", value: "신고서 확정 대기" },
    ],
    body: "D베이커리 망원점의 부가세 신고 기한이 7일 남았어요. 세무사 확정 후 자동으로 제출돼요.",
    button: { label: "진행 상황 보기", screen: "status" },
  },
  {
    id: "k4",
    at: "1월 12일",
    title: "보완 요청",
    lines: [
      { label: "요청 자료", value: "정산서, 수수료 세금계산서 2건" },
      { label: "보완 기한", value: "2026.01.15 (목)" },
    ],
    body: "문지후 세무사가 배달앱B 정산서(11~12월)와 중개수수료 세금계산서를 요청했어요.",
    button: { label: "자료 올리기", screen: "documents" },
  },
  {
    id: "k3",
    at: "1월 9일",
    title: "결제 완료",
    lines: [
      { label: "결제 금액", value: "82,500원" },
      { label: "결제 수단", value: "가상계좌 입금" },
    ],
    body: "류정민 님, 2025년 2기 확정신고 대리 수수료 입금이 확인됐어요.",
    button: { label: "결제 내역 보기", screen: "status" },
  },
  {
    id: "k2",
    at: "1월 9일",
    title: "입금 기한 임박",
    lines: [
      { label: "입금 계좌", value: "F은행 562-910482-37105" },
      { label: "입금 기한", value: "2026.01.10 (토) 23:59" },
    ],
    body: "가상계좌 입금 기한이 하루 남았어요. 기한이 지나면 신청이 자동 취소돼요.",
    button: { label: "계좌 확인", screen: "sign" },
  },
  {
    id: "k1",
    at: "1월 8일",
    title: "가상계좌 발급",
    lines: [
      { label: "입금 금액", value: "82,500원" },
      { label: "예금주", value: "E세무회계(태스크데스크)" },
    ],
    body: "D베이커리 망원점 신고 대리 수수료 가상계좌가 발급됐어요.",
    button: { label: "계좌 확인", screen: "sign" },
  },
];

export function won(n: number) {
  return n.toLocaleString("ko-KR");
}
