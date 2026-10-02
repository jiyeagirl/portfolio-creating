import type {
  CampaignStatus,
  Channel,
  ContentStatus,
  SourceState,
} from "@/projects/monitoring/brandpilot/lib/types";

export type Screen =
  | "dashboard"
  | "analytics"
  | "generate"
  | "editor"
  | "library"
  | "approvals"
  | "campaigns"
  | "publishing"
  | "references"
  | "brandGuide";

export type Navigate = (screen: Screen, contentId?: string) => void;

export type Tone = "neutral" | "accent" | "warn" | "success" | "danger";

export const NAV_GROUPS = ["현황", "콘텐츠", "운영", "브랜드"] as const;

export type NavGroup = (typeof NAV_GROUPS)[number];

export const NAV_ITEMS: { key: Screen; label: string; group: NavGroup }[] = [
  { key: "dashboard", label: "대시보드", group: "현황" },
  { key: "analytics", label: "성과 분석", group: "현황" },
  { key: "generate", label: "AI 콘텐츠 생성", group: "콘텐츠" },
  { key: "editor", label: "콘텐츠 편집기", group: "콘텐츠" },
  { key: "library", label: "콘텐츠 라이브러리", group: "콘텐츠" },
  { key: "approvals", label: "승인 워크플로우", group: "콘텐츠" },
  { key: "campaigns", label: "캠페인 관리", group: "운영" },
  { key: "publishing", label: "SNS 게시 관리", group: "운영" },
  { key: "references", label: "레퍼런스 탐색", group: "브랜드" },
  { key: "brandGuide", label: "브랜드 가이드", group: "브랜드" },
];

export const CHANNEL_LABEL: Record<Channel, string> = {
  instagram: "인스타그램",
  tiktok: "틱톡",
  youtube: "유튜브 쇼츠",
  blog: "네이버 블로그",
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "초안",
  generating: "생성 중",
  review: "승인 대기",
  approved: "승인 완료",
  scheduled: "예약됨",
  published: "게시 완료",
  rejected: "반려",
};

export const STATUS_TONE: Record<ContentStatus, Tone> = {
  draft: "neutral",
  generating: "accent",
  review: "warn",
  approved: "success",
  scheduled: "warn",
  published: "success",
  rejected: "danger",
};

export const SOURCE_STATE_LABEL: Record<SourceState, string> = {
  connected: "연동됨",
  review: "검수 대기",
  manual: "수동 등록",
};

export const SOURCE_STATE_TONE: Record<SourceState, Tone> = {
  connected: "success",
  review: "warn",
  manual: "neutral",
};

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  active: "진행중",
  upcoming: "예정",
  ended: "종료",
};

export const CAMPAIGN_STATUS_TONE: Record<CampaignStatus, Tone> = {
  active: "accent",
  upcoming: "warn",
  ended: "neutral",
};

/** 12,400 -> "1.2만". 조회수/도달수처럼 자릿수가 큰 값에만 쓴다. */
export function compact(value: number): string {
  if (value >= 10000) {
    const man = value / 10000;
    return `${man >= 10 ? Math.round(man) : man.toFixed(1)}만`;
  }
  return value.toLocaleString("ko-KR");
}

export function num(value: number): string {
  return value.toLocaleString("ko-KR");
}

/** "2026-04-22 14:20" -> "04/22 14:20" */
export function shortAt(at: string): string {
  const [date, time] = at.split(" ");
  const [, m, d] = date.split("-");
  return time ? `${m}/${d} ${time}` : `${m}/${d}`;
}
