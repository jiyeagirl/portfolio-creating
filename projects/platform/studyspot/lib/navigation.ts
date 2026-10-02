import type {
  BranchStatus,
  ContentStatus,
  ContractStatus,
  DeviceKind,
  DeviceStatus,
  ReservationStatus,
  SeatStatus,
  ContentKind,
} from "@/projects/platform/studyspot/lib/types";

/* ── 사용자 앱 ── */

export type StudyspotScreen =
  | "login"
  | "home"
  | "branchDetail"
  | "seatBooking"
  | "roomBooking"
  | "fixedSeat"
  | "payment"
  | "qrCheckin"
  | "session"
  | "myPage";

export const AUTH_SCREENS: StudyspotScreen[] = ["login"];

export type BottomNavScreen = "home" | "session" | "myPage";

export const BOTTOM_NAV: { key: BottomNavScreen; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "session", label: "이용중" },
  { key: "myPage", label: "마이페이지" },
];

export type Navigate = (screen: StudyspotScreen, id?: string) => void;

/* ── 점주 관리자 ── */

export type AdminScreen = "dashboard" | "content" | "devices" | "automation";

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "운영 대시보드" },
  { key: "content", label: "콘텐츠 관리" },
  { key: "devices", label: "장비 현황" },
  { key: "automation", label: "자동화 | 원격제어" },
];

export type AdminNavigate = (screen: AdminScreen, id?: string) => void;

/* ── 본사 관리자 ── */

export type HqScreen = "dashboard" | "branches" | "devices" | "content" | "aiContent";

export const HQ_NAV: { key: HqScreen; label: string }[] = [
  { key: "dashboard", label: "통합 대시보드" },
  { key: "branches", label: "지점 관리" },
  { key: "devices", label: "장비 통합 관리" },
  { key: "content", label: "콘텐츠 관리" },
  { key: "aiContent", label: "AI 콘텐츠 작성" },
];

export type HqNavigate = (screen: HqScreen, id?: string) => void;

/* ── 톤 / 라벨 ── */

export type Tone = "neutral" | "positive" | "warning" | "negative" | "info";

export const SEAT_STATUS_LABEL: Record<SeatStatus, string> = {
  available: "이용 가능",
  occupied: "이용 중",
  reserved: "예약됨",
};

export const SEAT_STATUS_TONE: Record<SeatStatus, Tone> = {
  available: "positive",
  occupied: "negative",
  reserved: "info",
};

export const DEVICE_STATUS_LABEL: Record<DeviceStatus, string> = {
  normal: "정상",
  warning: "주의",
  error: "장애",
  offline: "오프라인",
};

export const DEVICE_STATUS_TONE: Record<DeviceStatus, Tone> = {
  normal: "positive",
  warning: "warning",
  error: "negative",
  offline: "neutral",
};

export const DEVICE_KIND_LABEL: Record<DeviceKind, string> = {
  door: "출입문",
  hvac: "냉난방",
  light: "조명",
  cctv: "CCTV",
  airQuality: "공기질 센서",
};

export const CONTENT_KIND_LABEL: Record<ContentKind, string> = {
  notice: "공지사항",
  event: "이벤트",
  banner: "배너",
  faq: "FAQ",
  popup: "팝업",
};

export const CONTENT_STATUS_LABEL: Record<ContentStatus, string> = {
  scheduled: "게시 예정",
  published: "게시 중",
  ended: "게시 종료",
};

export const CONTENT_STATUS_TONE: Record<ContentStatus, Tone> = {
  scheduled: "info",
  published: "positive",
  ended: "neutral",
};

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  upcoming: "예약 확정",
  inUse: "이용 중",
  completed: "이용 완료",
  canceled: "취소됨",
};

export const RESERVATION_STATUS_TONE: Record<ReservationStatus, Tone> = {
  upcoming: "info",
  inUse: "positive",
  completed: "neutral",
  canceled: "negative",
};

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  active: "이용 중",
  expiringSoon: "만료 임박",
  ended: "만료됨",
};

export const CONTRACT_STATUS_TONE: Record<ContractStatus, Tone> = {
  active: "positive",
  expiringSoon: "warning",
  ended: "neutral",
};

export const BRANCH_STATUS_LABEL: Record<BranchStatus, string> = {
  operating: "정상 운영",
  preparing: "오픈 준비",
  closed: "휴점",
};

export const BRANCH_STATUS_TONE: Record<BranchStatus, Tone> = {
  operating: "positive",
  preparing: "info",
  closed: "negative",
};

/* ── 포맷터 ── */

export const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export const dateTime = (iso: string) => {
  const d = new Date(iso);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yy}.${mm}.${dd} ${hh}:${mi}`;
};

export const dateOnly = (iso: string) => {
  const d = new Date(iso);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

export const timeOnly = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
};

export const percent = (value: number) => `${value}%`;
