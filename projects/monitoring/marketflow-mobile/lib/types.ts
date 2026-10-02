/* MarketFlow Mobile — domain types.
   승인/알림 전용 모바일 앱이라 콘텐츠 생성·편집 관련 필드는 두지 않는다
   (에디터는 웹 콘솔 전용, spec.md 2. Non-goals). */

export type ContentType = "blog" | "card-news" | "short-form";

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  blog: "블로그",
  "card-news": "카드뉴스",
  "short-form": "숏폼",
};

export type ChannelId =
  | "naver-blog"
  | "instagram"
  | "youtube-shorts"
  | "facebook"
  | "kakao-channel";

export const CHANNEL_LABEL: Record<ChannelId, string> = {
  "naver-blog": "네이버 블로그",
  instagram: "인스타그램",
  "youtube-shorts": "유튜브 숏츠",
  facebook: "페이스북",
  "kakao-channel": "카카오 채널",
};

export type ApprovalStatus = "pending" | "changes-requested" | "rejected" | "approved";

export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  pending: "승인대기",
  "changes-requested": "수정요청",
  rejected: "반려",
  approved: "승인완료",
};

export type NotificationType = "approval-request" | "publish-complete" | "publish-error";

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  "approval-request": "승인 요청",
  "publish-complete": "발행 완료",
  "publish-error": "발행 오류",
};

export type Brand = {
  id: string;
  name: string;
  industry: string;
  /** 브랜드 태그/모노그램에 쓰는 단일 이니셜 */
  initial: string;
};

export type Assignee = {
  id: string;
  name: string;
  role: string;
};

export type CommentKind = "rejection" | "change-request";

export type ReviewComment = {
  id: string;
  author: string;
  createdAt: string;
  body: string;
  kind: CommentKind;
};

export type CardNewsSlide = {
  id: string;
  imageId: number;
  heading: string;
  body: string;
};

export type ChannelPreview = {
  channel: ChannelId;
  caption: string;
  hashtags: string[];
};

export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  brandId: string;
  channelIds: ChannelId[];
  assigneeId: string;
  status: ApprovalStatus;
  createdAt: string;
  scheduledAt: string;
  /** 블로그 히어로 / 숏폼 대표 프레임 등 대표 이미지 */
  heroImageId: number;
  copy: string;
  cardNewsSlides?: CardNewsSlide[];
  shortFormDurationSec?: number;
  channelPreviews: ChannelPreview[];
  comments: ReviewComment[];
};

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  contentId?: string;
  read: boolean;
  createdAt: string;
};

export type NotificationSettings = {
  approvalRequest: boolean;
  publishComplete: boolean;
  publishError: boolean;
};

export type AdminProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  assignedBrandIds: string[];
  notificationSettings: NotificationSettings;
};
