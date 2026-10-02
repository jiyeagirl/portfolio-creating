import type { DeviceStatus, EventKind, LogKind } from "@/projects/monitoring/petlive/lib/types";

/* ── 사용자 앱 ── */

export type PetliveScreen =
  | "login"
  | "signup"
  | "forgotPassword"
  | "home"
  | "monitoring"
  | "deviceRegister"
  | "deviceManage"
  | "notifications"
  | "myPage"
  | "eventHistory";

export const AUTH_SCREENS: PetliveScreen[] = ["login", "signup", "forgotPassword"];

/* 아키타입 A5(라이브 모니터 캔버스)에는 하단 탭바가 없다. 카메라 전환은 캔버스 하단의
   가로 필름스트립이 맡고, 캔버스를 떠나는 진입점(알림/기기/내 정보)은 영상 위 코너
   컨트롤에 모인다. `BottomNavScreen` / `BOTTOM_NAV`는 그래서 제거했다. */

export type Navigate = (screen: PetliveScreen, id?: string) => void;

/* ── 관리자 콘솔 ── */

export type AdminScreen = "dashboard" | "members" | "devices" | "logs";

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "members", label: "사용자 관리" },
  { key: "devices", label: "웹캠 관리" },
  { key: "logs", label: "로그 | ERP 연동" },
];

export type AdminNavigate = (screen: AdminScreen, id?: string) => void;

/* ── 톤 / 라벨 ── */

export type Tone = "neutral" | "positive" | "warning" | "negative" | "info";

export const DEVICE_STATUS_LABEL: Record<DeviceStatus, string> = {
  online: "온라인",
  offline: "오프라인",
  error: "연결 오류",
};

export const DEVICE_STATUS_TONE: Record<DeviceStatus, Tone> = {
  online: "positive",
  offline: "neutral",
  error: "negative",
};

export const EVENT_KIND_LABEL: Record<EventKind, string> = {
  motion: "움직임 감지",
  sound: "소리 감지",
};

export const LOG_KIND_LABEL: Record<LogKind, string> = {
  event: "이벤트",
  login: "로그인",
  connection: "디바이스 연결",
  error: "장애 | 오류",
};

/* ── 포맷터 ── */

export const percent = (value: number) => `${value}%`;

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

export const durationLabel = (sec: number) => {
  if (sec < 60) return `${sec}초`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}분 ${s}초` : `${m}분`;
};
