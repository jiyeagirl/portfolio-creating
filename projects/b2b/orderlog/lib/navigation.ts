import type { OrderStatus, RiskLevel, Role, Severity } from "@/projects/b2b/orderlog/lib/types";

export type Screen =
  | "dashboard"
  | "thread"
  | "items"
  | "anomaly"
  | "stats"
  | "notifications";

export type Navigate = (screen: Screen, orderId?: string) => void;

export type Tone = "neutral" | "info" | "warn" | "success" | "danger";

export const NAV_ITEMS: { key: Screen; label: string }[] = [
  { key: "dashboard", label: "통합 대시보드" },
  { key: "items", label: "품목/단가 스냅샷" },
  { key: "anomaly", label: "AI 이상 발주 센터" },
  { key: "stats", label: "거래 통계" },
  { key: "notifications", label: "알림 센터" },
];

export const ROLE_LABEL: Record<Role, string> = {
  master: "마스터",
  buyer: "원청",
  supplier: "납품처",
  vendor: "거래처",
};

// 원청/납품처/거래처 콘솔에서 실제로 로그인·역할 전환이 가능한 역할.
// 마스터(관리자)는 별도 서비스(orderlog-admin)의 전용 로그인으로만 접근한다.
export const CONSOLE_ROLES: Role[] = ["buyer", "supplier", "vendor"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  draft: "작성중",
  in_progress: "진행중",
  review: "승인대기",
  approved: "승인완료",
  delayed: "납기지연",
  canceled: "취소",
};

export const STATUS_TONE: Record<OrderStatus, Tone> = {
  draft: "neutral",
  in_progress: "info",
  review: "warn",
  approved: "success",
  delayed: "danger",
  canceled: "neutral",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

export const RISK_TONE: Record<RiskLevel, Tone> = {
  low: "neutral",
  medium: "warn",
  high: "danger",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  normal: "일반",
  caution: "주의",
  urgent: "긴급",
};

export const SEVERITY_TONE: Record<Severity, Tone> = {
  normal: "neutral",
  caution: "warn",
  urgent: "danger",
};

export function won(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function manwon(value: number): string {
  const man = Math.round(value / 10000);
  return `${man.toLocaleString("ko-KR")}만원`;
}
