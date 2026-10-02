import type { StaticImageData } from "next/image";

export type CategoryKey = "saju" | "tarot" | "sinjeom";

export type PassTier = "lite" | "standard" | "premium";

export type ExpertStatus = "available" | "inCall" | "reserveOnly" | "offline";

export type Expert = {
  id: string;
  /** 활동명. 실존 인물과 무관한 가명이다. */
  name: string;
  headline: string;
  category: CategoryKey;
  alsoHandles: CategoryKey[];
  /** 상담사 프로필 사진. 실존 인물 사진 대신 상담 분위기를 담은 상징 이미지를 쓴다. */
  avatar: StaticImageData;
  rating: number;
  reviewCount: number;
  sessionCount: number;
  years: number;
  responseRate: number;
  repeatRate: number;
  status: ExpertStatus;
  waitMinutes: number;
  joinedAt: string;
  isNew: boolean;
  specialties: string[];
  styleTags: string[];
  intro: string;
  career: string[];
  ratingBreakdown: { stars: number; count: number }[];
  slots: { date: string; label: string; times: { time: string; taken: boolean }[] }[];
  tiers: PassTier[];
};

export type Review = {
  id: string;
  expertId: string;
  author: string;
  rating: number;
  tier: PassTier;
  createdAt: string;
  body: string;
  tags: string[];
  helpful: number;
};

export type PassProduct = {
  tier: PassTier;
  name: string;
  minutes: number;
  price: number;
  listPrice: number;
  perMinute: number;
  summary: string;
  includes: string[];
  bestFor: string;
};

export type OwnedPass = {
  tier: PassTier;
  count: number;
  expiresAt: string;
};

export type ConsultStatus = "upcoming" | "done" | "canceled" | "noshow";

export type Consultation = {
  id: string;
  expertId: string;
  tier: PassTier;
  status: ConsultStatus;
  scheduledAt: string;
  dateLabel: string;
  timeLabel: string;
  usedMinutes: number;
  topic: string;
  reviewed: boolean;
  memo?: string;
  canceledReason?: string;
};

export type Payment = {
  id: string;
  label: string;
  tier: PassTier | "coupon";
  quantity: number;
  amount: number;
  method: string;
  paidAt: string;
  status: "완료" | "환불" | "부분환불";
};

export type ConcernTheme = {
  id: string;
  label: string;
  copy: string;
  image: StaticImageData;
  count: number;
};

/* ---------- 관리자 콘솔 ---------- */

export type AdminReservation = {
  id: string;
  memberName: string;
  memberPhone: string;
  expertId: string;
  tier: PassTier;
  scheduledAt: string;
  channel: "예약" | "즉시";
  state: "대기" | "진행중" | "완료" | "취소" | "노쇼";
  amount: number;
  usedMinutes: number;
  note: string;
};

export type AdminApplicant = {
  id: string;
  name: string;
  category: CategoryKey;
  years: number;
  appliedAt: string;
  documents: { label: string; state: "확인" | "미제출" | "재요청" }[];
  screeningNote: string;
  interviewScore: number;
};

export type AdminExpertRow = {
  id: string;
  grade: "루미 마스터" | "정회원" | "신규";
  state: "활동중" | "상담중" | "휴식" | "정지";
  monthSessions: number;
  monthRevenue: number;
  cancelRate: number;
  settlementBank: string;
  settlementAccount: string;
  feeRate: number;
};

export type Settlement = {
  id: string;
  expertId: string;
  period: string;
  sessions: number;
  gross: number;
  feeRate: number;
  fee: number;
  adjust: number;
  payout: number;
  state: "지급대기" | "검토중" | "지급완료";
  dueAt: string;
};

export type Notice = {
  id: string;
  title: string;
  channel: "앱 공지" | "푸시" | "상담사 공지";
  publishedAt: string;
  state: "게시중" | "예약" | "종료";
  views: number;
};

export type EventItem = {
  id: string;
  title: string;
  period: string;
  discount: string;
  target: string;
  state: "진행중" | "예정" | "종료";
  joined: number;
  budgetUsed: number;
};

export type FaqItem = {
  id: string;
  category: "상담권" | "예약" | "결제" | "상담사";
  question: string;
  answer: string;
  updatedAt: string;
  exposed: boolean;
};
