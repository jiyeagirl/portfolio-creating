export type ProductCategory =
  | "전자기기"
  | "가구/인테리어"
  | "패션/잡화"
  | "취미/악기"
  | "생활가전"
  | "스포츠/레저";

export type ProductStatus = "판매중" | "예약중" | "거래완료";

export type WaypointSpotType = "지하철역" | "편의점" | "카페" | "스터디카페";

export interface WaypointSpot {
  id: string;
  name: string;
  type: WaypointSpotType;
  address: string;
  distanceM: number;
  safetyScore: number; // 0-100, 높을수록 안전(밝고 혼잡도 낮음)
  crowdLevel: "여유" | "보통" | "혼잡";
  hours: string;
  favorite: boolean;
  photoId?: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  condition: "새상품" | "거의새것" | "사용감있음";
  status: ProductStatus;
  photoId: number;
  sellerId: string;
  postedAt: string; // YYYY.MM.DD
  distanceM: number; // 내 동네 홈 기준
  nearestStation: string; // 내 동선 홈 기준
  etaMin: number; // 퇴근 동선 기준 도달 예상 시간(분)
  waypointSpotId?: string; // 웨이스팟 거래 가능 상품이면 지정
  likeCount: number;
  viewCount: number;
  chatCount: number;
  description: string;
  tags: string[];
}

export interface Seller {
  id: string;
  nickname: string;
  avatarInitial: string;
  homeDong: string;
  workDong: string;
  trustScore: number;
  dealCount: number;
  reviewCount: number;
  onTimeRate: number;
  responseRate: number;
  dualVerified: boolean;
}

export type ChatMessageType = "text" | "image" | "waypointShare" | "system";

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  from: "me" | "them";
  text?: string;
  waypointSpotId?: string;
  at: string; // HH:mm
}

export interface ChatThread {
  id: string;
  productId: string;
  counterpartId: string;
  dealStatus: "거래중" | "예약중" | "거래완료";
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string; // YYYY.MM.DD HH:mm
  messages: ChatMessage[];
}

export interface MyVerification {
  phoneVerified: boolean;
  homeVerified: boolean;
  homeAddress: string;
  homeVerifiedAt: string;
  workVerified: boolean;
  workAddress: string;
  workVerifiedAt: string;
  loginDevices: { device: string; location: string; at: string; current: boolean }[];
  blockedUsers: { id: string; nickname: string; blockedAt: string }[];
}

/* ── 관리자 ── */

export type ReportType = "허위매물" | "사기의심" | "욕설/비매너" | "개인정보노출" | "웨이스팟오남용";
export type ReportStatus = "대기" | "처리중" | "완료";

export interface Report {
  id: string;
  type: ReportType;
  targetType: "상품" | "회원" | "채팅";
  targetLabel: string;
  reporterNickname: string;
  reportedNickname: string;
  status: ReportStatus;
  createdAt: string;
  memo?: string;
  penalty?: "경고" | "7일 정지" | "30일 정지" | "영구정지" | "조치없음";
}

export interface AdminMember {
  id: string;
  nickname: string;
  joinedAt: string;
  phoneVerified: boolean;
  homeVerified: boolean;
  workVerified: boolean;
  trustScore: number;
  dealCount: number;
  reportCount: number;
  status: "정상" | "주의" | "정지";
}

export interface AdminPost {
  id: string;
  title: string;
  photoId: number;
  sellerNickname: string;
  price: number;
  status: ProductStatus | "숨김처리" | "신고접수";
  reportCount: number;
  postedAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  pinned: boolean;
}

export interface PushLog {
  id: string;
  title: string;
  segment: string;
  sentAt: string;
  openRate: number;
}
