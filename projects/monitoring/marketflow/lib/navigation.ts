import type { ContentStatus, ContentType, CustomerStatus, CustomerTier, WorkflowStatus } from "@/projects/monitoring/marketflow/lib/types";

export type Screen =
  | "dashboard"
  | "generate"
  | "calendar"
  | "editor"
  | "crm"
  | "workflow"
  | "prompts"
  | "collection"
  | "settings";

export const SCREENS: Screen[] = [
  "dashboard",
  "generate",
  "calendar",
  "editor",
  "crm",
  "workflow",
  "prompts",
  "collection",
  "settings",
];

export type Navigate = (screen: Screen, id?: string) => void;

export const NAV: { key: Screen; label: string; group: string }[] = [
  { key: "dashboard", label: "대시보드", group: "현황" },
  { key: "generate", label: "AI 콘텐츠 생성", group: "콘텐츠" },
  { key: "calendar", label: "콘텐츠 캘린더", group: "콘텐츠" },
  { key: "editor", label: "에디터 / 승인", group: "콘텐츠" },
  { key: "crm", label: "고객 관리", group: "고객" },
  { key: "workflow", label: "자동화 워크플로우", group: "자동화" },
  { key: "prompts", label: "AI 프롬프트 관리", group: "자동화" },
  { key: "collection", label: "데이터 수집 관리", group: "자동화" },
  { key: "settings", label: "시스템 설정", group: "설정" },
];

export const NAV_GROUPS = ["현황", "콘텐츠", "고객", "자동화", "설정"];

/* ── 톤 시스템 ──
   claude_compact 팔레트 안에서만 5단계로 고정한다.
   neutral 회색(대기/초안), info 청록(예약/진행), warn 앰버(승인 대기/조치 필요),
   ink 코랄 채움(발행완료/확정), danger 빨강(반려/오류). */
export type Tone = "neutral" | "info" | "warn" | "ink" | "danger";

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  blog: "블로그",
  cardnews: "카드뉴스",
  short: "숏폼",
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "초안",
  pending: "승인대기",
  scheduled: "예약",
  published: "발행완료",
  rejected: "반려",
};

export const STATUS_TONE: Record<ContentStatus, Tone> = {
  draft: "neutral",
  pending: "warn",
  scheduled: "info",
  published: "ink",
  rejected: "danger",
};

export const CUSTOMER_TIER_TONE: Record<CustomerTier, Tone> = {
  스타터: "neutral",
  프로: "info",
  엔터프라이즈: "ink",
};

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  active: "이용중",
  trial: "체험중",
  paused: "일시중지",
  churned: "이탈",
};

export const CUSTOMER_STATUS_TONE: Record<CustomerStatus, Tone> = {
  active: "ink",
  trial: "info",
  paused: "warn",
  churned: "danger",
};

export const WORKFLOW_STATUS_LABEL: Record<WorkflowStatus, string> = {
  active: "실행중",
  paused: "일시중지",
  error: "오류",
};

export const WORKFLOW_STATUS_TONE: Record<WorkflowStatus, Tone> = {
  active: "ink",
  paused: "neutral",
  error: "danger",
};

/* ── 포맷 헬퍼 ── */

export const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export const count = (value: number, unit: string) => `${value.toLocaleString("ko-KR")}${unit}`;

export const percent = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

export const compactNumber = (value: number) => {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만`;
  return value.toLocaleString("ko-KR");
};
