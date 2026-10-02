export type Role = "master" | "buyer" | "supplier" | "vendor";

export type OrderStatus = "draft" | "in_progress" | "review" | "approved" | "delayed" | "canceled";

export type RiskLevel = "low" | "medium" | "high";

export type Severity = "normal" | "caution" | "urgent";

export type Channel = "kakao" | "sms" | "push";

export interface Company {
  id: string;
  name: string;
  role: Role;
  bizNo: string;
  tier: "핵심" | "일반" | "관찰";
}

export interface Person {
  id: string;
  name: string;
  role: Role;
  companyName: string;
  title: string;
}

export interface ItemCategory {
  large: string;
  medium: string;
  small: string;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  unit: string;
  currentPrice: number;
  scheduledPrice?: number;
  effectiveDate?: string;
  affectedOrders: number;
  photo?: number;
  updatedAt: string;
}

export interface PriceSnapshot {
  id: string;
  itemId: string;
  itemName: string;
  fromPrice: number;
  toPrice: number;
  effectiveDate: string;
  createdBy: string;
  createdAt: string;
  affectedOrders: number;
  status: "예약됨" | "적용됨" | "취소됨";
}

export interface Order {
  id: string;
  code: string;
  title: string;
  buyer: string;
  supplier: string;
  vendor: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  snapshotPrice: number;
  amount: number;
  status: OrderStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  riskLevel: RiskLevel;
  assignee: string;
  unreadEvents: number;
}

export type ThreadEventType =
  | "order_created"
  | "comment"
  | "due_change_request"
  | "due_change_response"
  | "attachment"
  | "approval_request"
  | "approval_done"
  | "assignee_change"
  | "ai_alert";

export interface Attachment {
  name: string;
  size: string;
  kind: "pdf" | "xlsx" | "image";
  photo?: number;
}

export interface ThreadEvent {
  id: string;
  orderId: string;
  type: ThreadEventType;
  actor: string;
  actorRole: Role;
  at: string;
  body?: string;
  meta?: Record<string, string>;
  attachment?: Attachment;
}

export interface Anomaly {
  id: string;
  orderId: string;
  orderCode: string;
  kind: "duplicate" | "price_spike" | "permission";
  title: string;
  detail: string;
  riskLevel: RiskLevel;
  companyName: string;
  itemName: string;
  detectedAt: string;
  reviewed: boolean;
  reviewer?: string;
  scoreDelta: string;
}

export interface NotificationLog {
  id: string;
  title: string;
  detail: string;
  channel: Channel;
  severity: Severity;
  target: string;
  sentAt: string;
  status: "발송완료" | "발송실패" | "대기중";
  unread: boolean;
}

export interface AdminAccount {
  id: string;
  companyName: string;
  role: Role;
  manager: string;
  lastLoginAt: string;
  status: "활성" | "정지" | "초대중";
}

export interface AiRule {
  id: string;
  name: string;
  description: string;
  kind: "duplicate" | "price_spike" | "permission";
  threshold: string;
  enabled: boolean;
  triggeredCount: number;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  ip: string;
}

export interface LoginHistoryItem {
  id: string;
  device: string;
  location: string;
  at: string;
  current: boolean;
}
