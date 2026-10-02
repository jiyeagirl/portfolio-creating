export type Channel = "instagram" | "tiktok" | "youtube" | "blog";

export type ContentStatus =
  | "draft"
  | "generating"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected";

export type CampaignStatus = "active" | "upcoming" | "ended";

export type ApprovalAction = "requested" | "approved" | "rejected" | "comment" | "revised";

export interface Person {
  id: string;
  name: string;
  role: string;
  initial: string;
}

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: CampaignStatus;
  owner: string;
  startsAt: string;
  endsAt: string;
  channels: Channel[];
  contentCount: number;
  budgetLabel: string;
  progress: number;
}

export interface ContentItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  channel: Channel;
  status: ContentStatus;
  campaignId: string;
  campaignName: string;
  productLine: string;
  photo: number;
  author: string;
  aiGenerated: boolean;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  version: number;
  guideIssues: number;
  reach?: number;
  saves?: number;
  engagementRate?: number;
}

export interface ApprovalEvent {
  id: string;
  contentId: string;
  action: ApprovalAction;
  actor: string;
  at: string;
  body?: string;
  version: number;
}

/** connected: 토큰 발급 완료 · review: 접근 신청 검수 중 · manual: 조회 API가 없어 담당자가 등록 */
export type SourceState = "connected" | "review" | "manual";

/**
 * 수집 소스. 각 플랫폼이 공개한 API로만 가져온다 - 스크래핑도, 특정 브랜드 계정을
 * 지목한 수집도 하지 않는다. `endpoint`에 실제 호출하는 API를 적어 두어야
 * "어디서 어떻게 가져오는지"가 화면에서 드러난다.
 */
export interface RefSource {
  id: string;
  name: string;
  platform: "Meta" | "TikTok" | "Instagram" | "YouTube" | "Naver";
  /** API 이름과 경로를 나눠 둔다. 화면에서 가운뎃점 없이 공백으로만 띄워 보여준다. */
  api: string;
  path: string;
  scope: string;
  /** 권한·할당량·범위 제약. 이게 있어야 기술적으로 말이 된다. */
  note: string;
  state: SourceState;
  lastSyncAt: string;
  weekly: number;
  enabled: boolean;
}

export interface RefCategory {
  id: string;
  label: string;
}

export interface Reference {
  id: string;
  categoryId: string;
  categoryLabel: string;
  sourceName: string;
  title: string;
  channel: Channel;
  photo: number;
  collectedAt: string;
  engagement: string;
  keywords: string[];
  styleNotes: string;
  bookmarked: boolean;
}

export interface GuideRule {
  id: string;
  category: "톤앤매너" | "금지 표현" | "필수 표기";
  label: string;
  detail: string;
  enabled: boolean;
}

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  line: string;
  keyIngredient: string;
  claim: string;
  photo: number;
}

export interface ScheduledPost {
  id: string;
  contentId: string;
  title: string;
  channel: Channel;
  at: string;
  status: "scheduled" | "published" | "failed";
  photo: number;
}

export interface ChannelStat {
  channel: Channel;
  reach: number;
  engagement: number;
  delta: string;
  posts: number;
}
