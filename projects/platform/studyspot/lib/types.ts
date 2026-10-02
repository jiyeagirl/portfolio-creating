import type { StaticImageData } from "next/image";

/* ── 사용자 ── */

export interface StudyspotUser {
  name: string;
  email: string;
  phone: string;
  point: number;
  couponCount: number;
}

/* ── 지점 ── */

export type BranchStatus = "operating" | "preparing" | "closed";

export interface Branch {
  id: string;
  name: string;
  region: string;
  address: string;
  openTime: string;
  closeTime: string;
  isOpenNow: boolean;
  hasFreeSeat: boolean;
  hasFixedSeat: boolean;
  hasStudyRoom: boolean;
  freeSeatTotal: number;
  freeSeatAvailable: number;
  favorited: boolean;
  /** assets/ 로컬 이미지 import 값 */
  photo: StaticImageData;
  ownerName: string;
  monthlyRevenue: number;
  status: BranchStatus;
}

/* ── 좌석 · 룸 ── */

export type SeatStatus = "available" | "occupied" | "reserved";

export interface FreeSeat {
  id: string;
  branchId: string;
  label: string;
  zone: string;
  status: SeatStatus;
  hasPower: boolean;
  hasMonitor: boolean;
}

export interface StudyRoom {
  id: string;
  branchId: string;
  name: string;
  capacity: number;
  hourlyPrice: number;
  /** assets/ 로컬 이미지 import 값 */
  photo: StaticImageData;
}

export type FixedSeatStatus = "available" | "occupied";

export interface FixedSeat {
  id: string;
  branchId: string;
  label: string;
  zone: string;
  status: FixedSeatStatus;
  monthlyPrice: number;
}

export type ContractStatus = "active" | "expiringSoon" | "ended";

export interface FixedSeatContract {
  id: string;
  branchId: string;
  seatLabel: string;
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  remainingDays: number;
  status: ContractStatus;
}

/* ── 이용권 · 예약 · 결제 ── */

export type PassType = "time" | "period";

export interface Pass {
  id: string;
  name: string;
  type: PassType;
  remainingHours?: number;
  remainingDays?: number;
  purchasedAt: string;
  expiresAt: string;
}

export type ReservationKind = "freeSeat" | "studyRoom" | "fixedSeat";
export type ReservationStatus = "upcoming" | "inUse" | "completed" | "canceled";

export interface Reservation {
  id: string;
  kind: ReservationKind;
  branchId: string;
  label: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: ReservationStatus;
}

export interface PaymentRecord {
  id: string;
  item: string;
  amount: number;
  method: string;
  couponDiscount: number;
  pointsUsed: number;
  paidAt: string;
}

export interface UsageSession {
  branchId: string;
  seatLabel: string;
  kind: ReservationKind;
  checkedInAt: string;
  plannedEndAt: string;
}

/* ── CMS (점주 · 본사 공유) ── */

export type ContentKind = "notice" | "event" | "banner" | "faq" | "popup";
export type ContentStatus = "scheduled" | "published" | "ended";

export interface ContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  body: string;
  /** "all" = 본사가 전 지점 배포, 그 외에는 지점명 */
  branchScope: string;
  startAt: string;
  endAt: string;
  status: ContentStatus;
  visible: boolean;
}

/* ── IoT 장비 ── */

export type DeviceKind = "door" | "hvac" | "light" | "cctv" | "airQuality";
export type DeviceStatus = "normal" | "warning" | "error" | "offline";

export interface IotDevice {
  id: string;
  branchId: string;
  kind: DeviceKind;
  name: string;
  status: DeviceStatus;
  reading: string;
  lastCheckedAt: string;
  firmwareVersion?: string;
  firmwareLatest?: string;
}

export interface FaultLog {
  id: string;
  deviceId: string;
  branchId: string;
  message: string;
  occurredAt: string;
  resolvedAt?: string;
  severity: "info" | "warn" | "critical";
}

export interface AutomationRule {
  id: string;
  branchId: string;
  name: string;
  kind: DeviceKind;
  schedule: string;
  active: boolean;
  description: string;
}

/* ── 본사 전용 ── */

export interface AiContentDraft {
  id: string;
  kind: ContentKind;
  tone: string;
  sourceTitle: string;
  sourceBody: string;
  targetLanguages: string[];
  translations: { language: string; title: string; body: string }[];
  createdAt: string;
}
