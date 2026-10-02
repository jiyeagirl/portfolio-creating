import type {
  AdminCallRow,
  AdminEvent,
  AdminInquiry,
  AdminMember,
  AdminNotice,
  AdminPaymentRow,
  AdminSafeNumberRow,
  CallLog,
  FaqItem,
  Incident,
  PassProduct,
  PaymentMethod,
  PaymentRecord,
  SafeNumber,
  Subscription,
  UserProfile,
} from "@/projects/platform/veli/lib/types";

/* ---------- 사용자 앱 ---------- */

export const CURRENT_USER: UserProfile = {
  name: "김도윤",
  phoneMasked: "010-****-2481",
  email: "doyun.k****@gmail.com",
  joinedAt: "2025-03-12",
};

export const MY_SAFE_NUMBERS: SafeNumber[] = [
  {
    id: "sn-1",
    number: "070-4512-8830",
    vehicle: {
      number: "24가 7745",
      model: "아반떼 CN7",
      color: "미드나잇 블랙",
      registeredAt: "2025-03-12",
    },
    status: "사용중",
    issuedAt: "2025-03-12",
    expiresAt: "2026-09-11",
    ctiStatus: "정상",
    callCountThisMonth: 14,
  },
  {
    id: "sn-2",
    number: "070-2281-9034",
    vehicle: {
      number: "38바 1029",
      model: "쏘렌토 MQ4",
      color: "스노우 화이트 펄",
      registeredAt: "2025-11-02",
    },
    status: "만료예정",
    issuedAt: "2025-11-02",
    expiresAt: "2026-08-05",
    ctiStatus: "정상",
    callCountThisMonth: 3,
  },
];

export const CALL_LOGS: CallLog[] = [
  {
    id: "call-1",
    direction: "incoming",
    safeNumber: "070-4512-8830",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-29",
    time: "14:21",
    durationSec: 47,
    result: "connected",
    reported: false,
  },
  {
    id: "call-2",
    direction: "incoming",
    safeNumber: "070-4512-8830",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-28",
    time: "09:03",
    durationSec: 0,
    result: "missed",
    reported: false,
  },
  {
    id: "call-3",
    direction: "outgoing",
    safeNumber: "070-2281-9034",
    counterpartLabel: "차량 소유주",
    date: "2026-07-27",
    time: "19:47",
    durationSec: 132,
    result: "connected",
    reported: false,
  },
  {
    id: "call-4",
    direction: "incoming",
    safeNumber: "070-4512-8830",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-25",
    time: "11:12",
    durationSec: 0,
    result: "failed",
    reported: false,
    memo: "CTI 서버 응답 지연으로 연결 실패",
  },
  {
    id: "call-5",
    direction: "incoming",
    safeNumber: "070-4512-8830",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-22",
    time: "22:56",
    durationSec: 18,
    result: "connected",
    reported: true,
    memo: "차량 이동 요청 스팸으로 신고 접수",
  },
  {
    id: "call-6",
    direction: "outgoing",
    safeNumber: "070-2281-9034",
    counterpartLabel: "차량 소유주",
    date: "2026-07-20",
    time: "08:31",
    durationSec: 64,
    result: "connected",
    reported: false,
  },
  {
    id: "call-7",
    direction: "incoming",
    safeNumber: "070-4512-8830",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-18",
    time: "17:40",
    durationSec: 0,
    result: "missed",
    reported: false,
  },
  {
    id: "call-8",
    direction: "incoming",
    safeNumber: "070-2281-9034",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-14",
    time: "13:05",
    durationSec: 89,
    result: "connected",
    reported: false,
  },
  {
    id: "call-9",
    direction: "incoming",
    safeNumber: "070-4512-8830",
    counterpartLabel: "발신자 비공개",
    date: "2026-07-09",
    time: "20:18",
    durationSec: 0,
    result: "missed",
    reported: false,
  },
  {
    id: "call-10",
    direction: "outgoing",
    safeNumber: "070-4512-8830",
    counterpartLabel: "차량 소유주",
    date: "2026-07-03",
    time: "10:44",
    durationSec: 41,
    result: "connected",
    reported: false,
  },
];

export const PASS_PRODUCTS: PassProduct[] = [
  {
    tier: "lite",
    name: "라이트",
    priceMonthly: 3900,
    safeNumberCount: 1,
    features: ["안심번호 1개 발급", "통화 연결 무제한", "통화내역 30일 보관", "기본 스팸 차단"],
    bestFor: "차량 1대만 등록하는 경우",
  },
  {
    tier: "standard",
    name: "스탠다드",
    priceMonthly: 6900,
    safeNumberCount: 2,
    features: [
      "안심번호 2개 발급 (차량 2대)",
      "통화 시작 안내 멘트 재생",
      "통화내역 90일 보관",
      "스팸 자동 차단 강화",
    ],
    bestFor: "차량 2대를 함께 관리하는 경우",
    recommended: true,
  },
  {
    tier: "premium",
    name: "프리미엄",
    priceMonthly: 9900,
    safeNumberCount: 3,
    features: [
      "안심번호 3개 발급 (차량 3대)",
      "우선 연결 (대기 없이 즉시 CTI 요청)",
      "통화내역 1년 보관",
      "스팸 즉시 차단 및 신고 우선 처리",
    ],
    bestFor: "여러 대의 차량, 빠른 연결이 중요한 경우",
  },
];

export const PASS_BY_TIER: Record<string, PassProduct> = Object.fromEntries(
  PASS_PRODUCTS.map((p) => [p.tier, p]),
);

export const MY_SUBSCRIPTION: Subscription = {
  tier: "standard",
  startedAt: "2025-08-06",
  expiresAt: "2026-08-06",
  autoRenew: true,
  status: "expiring",
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm-1", brand: "A카드", last4: "4821", isDefault: true },
  { id: "pm-2", brand: "B페이", last4: "0092", isDefault: false },
];

export const PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: "pay-1",
    item: "스탠다드 이용권 정기 결제",
    tier: "standard",
    amount: 6900,
    method: "A카드 ****4821",
    paidAt: "2026-07-06",
    status: "완료",
    receiptId: "R-20260706-3381",
  },
  {
    id: "pay-2",
    item: "스탠다드 이용권 정기 결제",
    tier: "standard",
    amount: 6900,
    method: "A카드 ****4821",
    paidAt: "2026-06-06",
    status: "완료",
    receiptId: "R-20260606-2074",
  },
  {
    id: "pay-3",
    item: "라이트 → 스탠다드 변경 차액",
    tier: "standard",
    amount: 3000,
    method: "B페이",
    paidAt: "2026-05-11",
    status: "완료",
    receiptId: "R-20260511-9910",
  },
  {
    id: "pay-4",
    item: "스탠다드 이용권 정기 결제",
    tier: "standard",
    amount: 6900,
    method: "A카드 ****4821",
    paidAt: "2026-04-06",
    status: "실패",
    receiptId: "R-20260406-1123",
  },
  {
    id: "pay-5",
    item: "라이트 이용권 정기 결제",
    tier: "lite",
    amount: 3900,
    method: "A카드 ****4821",
    paidAt: "2026-03-06",
    status: "환불",
    receiptId: "R-20260306-0087",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "안심번호",
    question: "안심번호는 어떻게 발급되나요",
    answer:
      "차량번호를 등록하면 070으로 시작하는 안심번호가 자동으로 발급됩니다. 실제 휴대폰 번호는 상대방에게 노출되지 않습니다.",
  },
  {
    id: "faq-2",
    category: "안심번호",
    question: "안심번호가 만료되면 어떻게 되나요",
    answer:
      "만료 7일 전부터 만료예정 상태로 표시되며, 이용권이 갱신되면 같은 번호로 자동 재발급됩니다. 갱신하지 않으면 번호가 회수됩니다.",
  },
  {
    id: "faq-3",
    category: "통화",
    question: "부재중 전화는 어떻게 확인하나요",
    answer: "통화내역에서 부재중으로 표시되며, 발신자가 남긴 요청 내용이 있다면 상세 화면에서 확인할 수 있습니다.",
  },
  {
    id: "faq-4",
    category: "통화",
    question: "스팸 전화는 어떻게 신고하나요",
    answer: "통화 종료 후 신고 버튼을 누르면 해당 번호가 즉시 차단 목록에 등록되고 재연결이 제한됩니다.",
  },
  {
    id: "faq-5",
    category: "이용권",
    question: "이용권 등급은 언제든 변경할 수 있나요",
    answer: "다음 결제일 기준으로 변경되며, 즉시 변경을 선택하면 차액만 정산되어 결제됩니다.",
  },
  {
    id: "faq-6",
    category: "이용권",
    question: "자동 연장을 끄면 어떻게 되나요",
    answer: "만료일까지 서비스는 그대로 이용할 수 있고, 만료일 이후 안심번호가 회수됩니다.",
  },
  {
    id: "faq-7",
    category: "계정",
    question: "휴대폰 번호를 변경하고 싶어요",
    answer: "프로필과 설정 메뉴에서 본인인증 후 휴대폰 번호를 변경할 수 있습니다.",
  },
  {
    id: "faq-8",
    category: "계정",
    question: "통화 기록 삭제를 요청할 수 있나요",
    answer: "개인정보 처리방침에 따라 설정 메뉴에서 통화 기록 삭제를 요청하면 영업일 기준 3일 이내 처리됩니다.",
  },
];

/* ---------- 관리자 콘솔 ---------- */

export const ADMIN_MEMBERS: AdminMember[] = [
  { id: "m-1", name: "김도윤", phoneMasked: "010-****-2481", vehicleNumber: "24가 7745", safeNumber: "070-4512-8830", passTier: "standard", status: "정상", joinedAt: "2025-03-12", lastActiveAt: "2026-07-29" },
  { id: "m-2", name: "이서연", phoneMasked: "010-****-5567", vehicleNumber: "12나 3321", safeNumber: "070-8823-1102", passTier: "premium", status: "정상", joinedAt: "2025-01-08", lastActiveAt: "2026-07-30" },
  { id: "m-3", name: "박지훈", phoneMasked: "010-****-9012", vehicleNumber: "45다 8890", safeNumber: "070-3390-4471", passTier: "lite", status: "정상", joinedAt: "2025-06-21", lastActiveAt: "2026-07-27" },
  { id: "m-4", name: "최민서", phoneMasked: "010-****-2200", vehicleNumber: "77라 1234", safeNumber: "070-1029-8845", passTier: "standard", status: "정지", joinedAt: "2024-11-30", lastActiveAt: "2026-06-02" },
  { id: "m-5", name: "정하윤", phoneMasked: "010-****-7781", vehicleNumber: "88마 5567", safeNumber: "070-5567-2231", passTier: "lite", status: "정상", joinedAt: "2025-09-14", lastActiveAt: "2026-07-30" },
  { id: "m-6", name: "강수현", phoneMasked: "010-****-3345", vehicleNumber: "19바 9021", safeNumber: "070-9021-6634", passTier: "premium", status: "정상", joinedAt: "2025-02-19", lastActiveAt: "2026-07-28" },
  { id: "m-7", name: "윤재민", phoneMasked: "010-****-4432", vehicleNumber: "63사 4432", safeNumber: "070-4432-7719", passTier: "standard", status: "정상", joinedAt: "2025-05-02", lastActiveAt: "2026-07-25" },
  { id: "m-8", name: "임서준", phoneMasked: "010-****-8890", vehicleNumber: "27아 6650", safeNumber: "070-6650-3312", passTier: "lite", status: "탈퇴예정", joinedAt: "2024-08-11", lastActiveAt: "2026-05-30" },
  { id: "m-9", name: "한지민", phoneMasked: "010-****-1123", vehicleNumber: "34자 7789", safeNumber: "070-7789-9034", passTier: "standard", status: "정상", joinedAt: "2025-10-07", lastActiveAt: "2026-07-29" },
  { id: "m-10", name: "오세훈", phoneMasked: "010-****-6654", vehicleNumber: "56차 2245", safeNumber: "070-2245-5501", passTier: "premium", status: "정상", joinedAt: "2025-04-25", lastActiveAt: "2026-07-30" },
  { id: "m-11", name: "신유진", phoneMasked: "010-****-9987", vehicleNumber: "91카 8834", safeNumber: "070-8834-2210", passTier: "lite", status: "정상", joinedAt: "2025-12-01", lastActiveAt: "2026-07-24" },
  { id: "m-12", name: "배현우", phoneMasked: "010-****-3321", vehicleNumber: "40타 1198", safeNumber: "070-1198-6672", passTier: "standard", status: "정지", joinedAt: "2024-07-19", lastActiveAt: "2026-04-11" },
];

export const ADMIN_SAFE_NUMBERS: AdminSafeNumberRow[] = [
  { number: "070-4512-8830", assignedTo: "김도윤", vehicleNumber: "24가 7745", status: "사용중", ctiStatus: "정상", issuedAt: "2025-03-12", totalCalls: 214 },
  { number: "070-8823-1102", assignedTo: "이서연", vehicleNumber: "12나 3321", status: "사용중", ctiStatus: "정상", issuedAt: "2025-01-08", totalCalls: 341 },
  { number: "070-3390-4471", assignedTo: "박지훈", vehicleNumber: "45다 8890", status: "사용중", ctiStatus: "정상", issuedAt: "2025-06-21", totalCalls: 88 },
  { number: "070-1029-8845", assignedTo: "최민서", vehicleNumber: "77라 1234", status: "사용중", ctiStatus: "지연", issuedAt: "2024-11-30", totalCalls: 502 },
  { number: "070-5567-2231", assignedTo: "정하윤", vehicleNumber: "88마 5567", status: "사용중", ctiStatus: "정상", issuedAt: "2025-09-14", totalCalls: 46 },
  { number: "070-9021-6634", assignedTo: "강수현", vehicleNumber: "19바 9021", status: "사용중", ctiStatus: "정상", issuedAt: "2025-02-19", totalCalls: 277 },
  { number: "070-4432-7719", assignedTo: "윤재민", vehicleNumber: "63사 4432", status: "사용중", ctiStatus: "정상", issuedAt: "2025-05-02", totalCalls: 129 },
  { number: "070-6650-3312", assignedTo: "임서준", vehicleNumber: "27아 6650", status: "회수됨", ctiStatus: "정상", issuedAt: "2024-08-11", totalCalls: 61 },
  { number: "070-7789-9034", assignedTo: "한지민", vehicleNumber: "34자 7789", status: "사용중", ctiStatus: "정상", issuedAt: "2025-10-07", totalCalls: 33 },
  { number: "070-2245-5501", assignedTo: "오세훈", vehicleNumber: "56차 2245", status: "사용중", ctiStatus: "점검중", issuedAt: "2025-04-25", totalCalls: 190 },
  { number: "070-8834-2210", assignedTo: "신유진", vehicleNumber: "91카 8834", status: "사용중", ctiStatus: "정상", issuedAt: "2025-12-01", totalCalls: 12 },
  { number: "070-1198-6672", assignedTo: "배현우", vehicleNumber: "40타 1198", status: "사용중", ctiStatus: "정상", issuedAt: "2024-07-19", totalCalls: 398 },
  { number: "070-6601-2247", assignedTo: null, vehicleNumber: null, status: "미사용", ctiStatus: "정상", issuedAt: null, totalCalls: 0 },
  { number: "070-6601-2248", assignedTo: null, vehicleNumber: null, status: "미사용", ctiStatus: "정상", issuedAt: null, totalCalls: 0 },
  { number: "070-6601-2249", assignedTo: null, vehicleNumber: null, status: "미사용", ctiStatus: "정상", issuedAt: null, totalCalls: 0 },
];

export const ADMIN_CALLS: AdminCallRow[] = [
  { id: "ac-1", safeNumber: "070-4512-8830", member: "김도윤", direction: "incoming", date: "2026-07-29", time: "14:21", durationSec: 47, result: "connected", reported: false },
  { id: "ac-2", safeNumber: "070-8823-1102", member: "이서연", direction: "incoming", date: "2026-07-29", time: "11:05", durationSec: 0, result: "missed", reported: false },
  { id: "ac-3", safeNumber: "070-1029-8845", member: "최민서", direction: "incoming", date: "2026-07-29", time: "09:40", durationSec: 0, result: "failed", reported: false },
  { id: "ac-4", safeNumber: "070-4512-8830", member: "김도윤", direction: "incoming", date: "2026-07-22", time: "22:56", durationSec: 18, result: "connected", reported: true },
  { id: "ac-5", safeNumber: "070-9021-6634", member: "강수현", direction: "outgoing", date: "2026-07-28", time: "08:12", durationSec: 96, result: "connected", reported: false },
  { id: "ac-6", safeNumber: "070-2245-5501", member: "오세훈", direction: "incoming", date: "2026-07-28", time: "20:33", durationSec: 0, result: "failed", reported: false },
  { id: "ac-7", safeNumber: "070-3390-4471", member: "박지훈", direction: "incoming", date: "2026-07-27", time: "16:47", durationSec: 61, result: "connected", reported: false },
  { id: "ac-8", safeNumber: "070-4432-7719", member: "윤재민", direction: "incoming", date: "2026-07-27", time: "13:02", durationSec: 0, result: "missed", reported: false },
  { id: "ac-9", safeNumber: "070-1198-6672", member: "배현우", direction: "incoming", date: "2026-07-26", time: "19:18", durationSec: 133, result: "connected", reported: true },
  { id: "ac-10", safeNumber: "070-7789-9034", member: "한지민", direction: "outgoing", date: "2026-07-26", time: "10:24", durationSec: 42, result: "connected", reported: false },
  { id: "ac-11", safeNumber: "070-5567-2231", member: "정하윤", direction: "incoming", date: "2026-07-25", time: "07:51", durationSec: 0, result: "missed", reported: false },
  { id: "ac-12", safeNumber: "070-8834-2210", member: "신유진", direction: "incoming", date: "2026-07-24", time: "15:36", durationSec: 28, result: "connected", reported: false },
];

export const ADMIN_PAYMENTS: AdminPaymentRow[] = [
  { id: "ap-1", member: "김도윤", item: "스탠다드 정기 결제", amount: 6900, date: "2026-07-06", method: "A카드", status: "완료" },
  { id: "ap-2", member: "이서연", item: "프리미엄 정기 결제", amount: 9900, date: "2026-07-08", method: "B페이", status: "완료" },
  { id: "ap-3", member: "박지훈", item: "라이트 정기 결제", amount: 3900, date: "2026-07-21", method: "A카드", status: "완료" },
  { id: "ap-4", member: "최민서", item: "스탠다드 정기 결제", amount: 6900, date: "2026-07-06", method: "A카드", status: "실패" },
  { id: "ap-5", member: "정하윤", item: "라이트 최초 결제", amount: 3900, date: "2026-07-14", method: "B페이", status: "완료" },
  { id: "ap-6", member: "강수현", item: "프리미엄 정기 결제", amount: 9900, date: "2026-07-19", method: "A카드", status: "완료" },
  { id: "ap-7", member: "임서준", item: "라이트 정기 결제", amount: 3900, date: "2026-05-11", method: "A카드", status: "환불" },
  { id: "ap-8", member: "한지민", item: "스탠다드 최초 결제", amount: 6900, date: "2026-07-07", method: "B페이", status: "완료" },
  { id: "ap-9", member: "오세훈", item: "프리미엄 정기 결제", amount: 9900, date: "2026-07-25", method: "A카드", status: "완료" },
  { id: "ap-10", member: "배현우", item: "스탠다드 정기 결제", amount: 6900, date: "2026-07-19", method: "A카드", status: "완료" },
];

export const ADMIN_INCIDENTS: Incident[] = [
  { id: "inc-1", title: "070-1029-8845 CTI 연결 지연 감지", level: "경고", occurredAt: "2026-07-29 09:41", resolved: false },
  { id: "inc-2", title: "070-2245-5501 회선 점검 진행 중", level: "정보", occurredAt: "2026-07-28 20:10", resolved: false },
  { id: "inc-3", title: "결제사 B페이 정기결제 실패율 상승", level: "경고", occurredAt: "2026-07-27 06:00", resolved: true },
  { id: "inc-4", title: "CTI 서버 야간 점검 완료", level: "정보", occurredAt: "2026-07-25 03:30", resolved: true },
];

export const ADMIN_NOTICES: AdminNotice[] = [
  { id: "no-1", title: "여름철 CTI 회선 증설 안내", category: "공지", publishedAt: "2026-07-20", state: "게시중" },
  { id: "no-2", title: "8월 정기 점검 사전 안내", category: "점검", publishedAt: "2026-08-03", state: "예약" },
  { id: "no-3", title: "프리미엄 이용권 여름 프로모션", category: "이벤트", publishedAt: "2026-07-15", state: "게시중" },
  { id: "no-4", title: "개인정보 처리방침 개정 안내", category: "공지", publishedAt: "2026-06-01", state: "종료" },
];

export const ADMIN_INQUIRIES: AdminInquiry[] = [
  { id: "iq-1", member: "최민서", subject: "정기 결제가 실패했는데 이용권이 유지되나요", category: "결제", status: "대기", createdAt: "2026-07-29" },
  { id: "iq-2", member: "임서준", subject: "탈퇴 처리 후 안심번호 회수 시점 문의", category: "계정", status: "대기", createdAt: "2026-07-28" },
  { id: "iq-3", member: "배현우", subject: "신고한 스팸 번호가 계속 연결됩니다", category: "통화", status: "답변완료", createdAt: "2026-07-26" },
  { id: "iq-4", member: "정하윤", subject: "차량번호를 변경하고 싶어요", category: "안심번호", status: "답변완료", createdAt: "2026-07-22" },
  { id: "iq-5", member: "한지민", subject: "환불 처리 기간이 궁금합니다", category: "결제", status: "종료", createdAt: "2026-07-10" },
  { id: "iq-6", member: "신유진", subject: "안심번호 재발급 요청", category: "안심번호", status: "대기", createdAt: "2026-07-30" },
];

export const ADMIN_EVENTS: AdminEvent[] = [
  { id: "ev-1", title: "여름 휴가철 프리미엄 30% 할인", period: "2026-07-15 ~ 2026-08-15", benefit: "프리미엄 첫 달 30% 할인", state: "진행중", joined: 412 },
  { id: "ev-2", title: "차량 2대 등록 이벤트", period: "2026-08-01 ~ 2026-08-31", benefit: "스탠다드 1개월 무료", state: "예정", joined: 0 },
  { id: "ev-3", title: "신규 가입 웰컴 쿠폰", period: "2026-05-01 ~ 2026-06-30", benefit: "첫 달 이용권 50% 할인", state: "종료", joined: 1288 },
];

export function formatWon(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

export const ADMIN_HOURLY_CALLS: { hour: string; calls: number }[] = [
  { hour: "00", calls: 12 }, { hour: "02", calls: 6 }, { hour: "04", calls: 4 },
  { hour: "06", calls: 18 }, { hour: "08", calls: 61 }, { hour: "10", calls: 84 },
  { hour: "12", calls: 77 }, { hour: "14", calls: 92 }, { hour: "16", calls: 88 },
  { hour: "18", calls: 104 }, { hour: "20", calls: 73 }, { hour: "22", calls: 34 },
];

export const PASS_TIER_SHARE: { label: string; share: number; note: string }[] = [
  { label: "라이트", share: 38, note: "3,121명" },
  { label: "스탠다드", share: 44, note: "3,614명" },
  { label: "프리미엄", share: 18, note: "1,479명" },
];

export const SIGNUP_TREND: { label: string; value: number; caption: string }[] = [
  { label: "3월", value: 512, caption: "512명" },
  { label: "4월", value: 588, caption: "588명" },
  { label: "5월", value: 641, caption: "641명" },
  { label: "6월", value: 703, caption: "703명" },
  { label: "7월", value: 799, caption: "799명" },
];

export const REVENUE_TREND: { label: string; value: number; caption: string }[] = [
  { label: "3월", value: 32400000, caption: "3,240만원" },
  { label: "4월", value: 35100000, caption: "3,510만원" },
  { label: "5월", value: 37800000, caption: "3,780만원" },
  { label: "6월", value: 39600000, caption: "3,960만원" },
  { label: "7월", value: 41280000, caption: "4,128만원" },
];

export const SYSTEM_LOGS: { id: string; message: string; occurredAt: string }[] = [
  { id: "log-1", message: "CTI 벤더 C텔레콤 회선 상태 점검 스크립트 정상 종료", occurredAt: "2026-07-30 03:00" },
  { id: "log-2", message: "안심번호 3개 자동 회수 처리 (만료 후 7일 경과)", occurredAt: "2026-07-29 04:00" },
  { id: "log-3", message: "정기 결제 배치 실행, 성공 1,842건 / 실패 12건", occurredAt: "2026-07-29 01:00" },
  { id: "log-4", message: "스팸 신고 3건 접수, 자동 차단 규칙 갱신", occurredAt: "2026-07-28 22:14" },
  { id: "log-5", message: "관리자 한서진 회원 계정 정지 처리 (m-4)", occurredAt: "2026-07-28 17:02" },
];

export const DASHBOARD_STATS = {
  totalMembers: 8214,
  issuedNumbers: 7940,
  activeNumbers: 7605,
  unassignedNumbers: 335,
  todayCalls: 1042,
  newSignupsToday: 37,
  callSuccessRate: 96.4,
  passSalesThisMonth: 41280000,
  ctiVendor: "C텔레콤",
  ctiStatus: "정상" as const,
  liveCallsNow: 18,
  pendingConnections: 4,
};
