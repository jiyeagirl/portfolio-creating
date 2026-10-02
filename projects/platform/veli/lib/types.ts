export type PassTier = "lite" | "standard" | "premium";

export type SafeNumberStatus = "사용중" | "만료예정" | "만료" | "회수됨";

export type CtiStatus = "정상" | "지연" | "점검중";

export type CallDirection = "incoming" | "outgoing";

export type CallResult = "connected" | "missed" | "failed";

/** 통화 연결 플로우 화면의 진행 단계. */
export type CallStage =
  | "scan"
  | "requesting"
  | "connecting"
  | "onCall"
  | "ended"
  | "missed"
  | "failed"
  | "spamBlocked";

export type Vehicle = {
  number: string;
  model: string;
  color: string;
  registeredAt: string;
};

export type SafeNumber = {
  id: string;
  number: string;
  vehicle: Vehicle;
  status: SafeNumberStatus;
  issuedAt: string;
  expiresAt: string;
  ctiStatus: CtiStatus;
  callCountThisMonth: number;
};

export type CallLog = {
  id: string;
  direction: CallDirection;
  safeNumber: string;
  counterpartLabel: string;
  date: string;
  time: string;
  durationSec: number;
  result: CallResult;
  reported: boolean;
  memo?: string;
};

export type PassProduct = {
  tier: PassTier;
  name: string;
  priceMonthly: number;
  safeNumberCount: number;
  features: string[];
  bestFor: string;
  recommended?: boolean;
};

export type Subscription = {
  tier: PassTier;
  startedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  status: "active" | "expiring" | "expired";
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  isDefault: boolean;
};

export type PaymentRecord = {
  id: string;
  item: string;
  tier: PassTier;
  amount: number;
  method: string;
  paidAt: string;
  status: "완료" | "실패" | "환불";
  receiptId: string;
};

export type FaqItem = {
  id: string;
  category: "이용권" | "안심번호" | "통화" | "계정";
  question: string;
  answer: string;
};

export type UserProfile = {
  name: string;
  phoneMasked: string;
  email: string;
  joinedAt: string;
};

/* ---------- 관리자 콘솔 ---------- */

export type AdminMemberStatus = "정상" | "정지" | "탈퇴예정";

export type AdminMember = {
  id: string;
  name: string;
  phoneMasked: string;
  vehicleNumber: string;
  safeNumber: string;
  passTier: PassTier;
  status: AdminMemberStatus;
  joinedAt: string;
  lastActiveAt: string;
};

export type AdminNumberStatus = "사용중" | "미사용" | "회수됨";

export type AdminSafeNumberRow = {
  number: string;
  assignedTo: string | null;
  vehicleNumber: string | null;
  status: AdminNumberStatus;
  ctiStatus: CtiStatus;
  issuedAt: string | null;
  totalCalls: number;
};

export type AdminCallRow = {
  id: string;
  safeNumber: string;
  member: string;
  direction: CallDirection;
  date: string;
  time: string;
  durationSec: number;
  result: CallResult;
  reported: boolean;
};

export type AdminPaymentRow = {
  id: string;
  member: string;
  item: string;
  amount: number;
  date: string;
  method: string;
  status: "완료" | "환불" | "실패";
};

export type Incident = {
  id: string;
  title: string;
  level: "정보" | "경고" | "심각";
  occurredAt: string;
  resolved: boolean;
};

export type AdminNotice = {
  id: string;
  title: string;
  category: "공지" | "이벤트" | "점검";
  publishedAt: string;
  state: "게시중" | "예약" | "종료";
};

export type AdminInquiry = {
  id: string;
  member: string;
  subject: string;
  category: "결제" | "안심번호" | "통화" | "계정" | "기타";
  status: "대기" | "답변완료" | "종료";
  createdAt: string;
};

export type AdminEvent = {
  id: string;
  title: string;
  period: string;
  benefit: string;
  state: "진행중" | "예정" | "종료";
  joined: number;
};
