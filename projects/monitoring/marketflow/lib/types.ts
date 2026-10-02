/** MarketFlow 도메인 타입. 전부 mock 데이터 전용이며 백엔드 연동은 없다. */

export type ContentType = "blog" | "cardnews" | "short";

export type ContentStatus = "draft" | "pending" | "scheduled" | "published" | "rejected";

export type CustomerTier = "스타터" | "프로" | "엔터프라이즈";

export type CustomerStatus = "active" | "trial" | "paused" | "churned";

export interface ConsultationNote {
  id: string;
  at: string;
  author: string;
  content: string;
}

export interface Customer {
  id: string;
  name: string;
  industry: string;
  tier: CustomerTier;
  status: CustomerStatus;
  contractStart: string;
  contractEnd: string;
  monthlyQuota: number;
  usedThisMonth: number;
  manager: { name: string; email: string; phone: string };
  brandTone: string;
  channels: string[];
  notes: ConsultationNote[];
  createdAt: string;
}

export interface ContentVersion {
  id: string;
  label: string;
  at: string;
  author: string;
  summary: string;
}

export interface ContentComment {
  id: string;
  author: string;
  at: string;
  action: "comment" | "approve" | "reject" | "request-changes";
  text: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  customerId: string;
  status: ContentStatus;
  channels: string[];
  keywords: string[];
  thumbnail?: number;
  assignee: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  excerpt: string;
  body: string[];
  aiScore: number;
  rejectReason?: string;
  versions: ContentVersion[];
  comments: ContentComment[];
}

export type WorkflowStepType = "collect" | "generate" | "approve" | "publish" | "notify";

export interface WorkflowStep {
  id: string;
  label: string;
  type: WorkflowStepType;
  detail: string;
}

export interface WorkflowRun {
  id: string;
  at: string;
  status: "success" | "failed" | "running";
  duration: string;
  detail: string;
}

export type WorkflowStatus = "active" | "paused" | "error";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: string;
  customerId?: string;
  steps: WorkflowStep[];
  successRate: number;
  lastRunAt: string;
  runsToday: number;
  history: WorkflowRun[];
}

export interface PromptVersion {
  id: string;
  version: string;
  at: string;
  author: string;
  changelog: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  customerId?: string;
  contentType: ContentType;
  model: string;
  systemPrompt: string;
  tone: string;
  temperature: number;
  versions: PromptVersion[];
  updatedAt: string;
}

export type DataSourceType = "rss" | "api" | "news";

export interface CollectionRun {
  id: string;
  at: string;
  itemsCollected: number;
  status: "success" | "failed";
  note?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  url: string;
  category: string;
  keywords: string[];
  interval: string;
  status: "active" | "paused" | "error";
  lastCollectedAt: string;
  itemsToday: number;
  itemsTotal: number;
  history: CollectionRun[];
}

export interface ActivityLogEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
}

export type TeamRole = "슈퍼관리자" | "운영관리자" | "에디터" | "뷰어";

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "active" | "invited" | "disabled";
  lastActiveAt: string;
}

export interface ChannelIntegration {
  id: string;
  platform: string;
  accountName: string;
  connected: boolean;
  status: "정상" | "재인증 필요" | "연동 안 됨";
  lastSyncAt?: string;
  followers?: number;
}

export interface ApiKeyEntry {
  id: string;
  service: string;
  keyMasked: string;
  createdAt: string;
  lastUsedAt: string;
  status: "active" | "revoked";
}

export interface KpiPoint {
  label: string;
  value: number;
}
