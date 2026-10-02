export type ProductCategory =
  | "전자기기"
  | "가구/인테리어"
  | "패션/잡화"
  | "취미/악기"
  | "생활가전"
  | "스포츠/레저";

export type ProductStatus = "판매중" | "예약중" | "거래완료";
export type ProductCondition = "새상품" | "거의새것" | "사용감있음";

export interface Complex {
  id: string;
  name: string;
  address: string;
  householdCount: number;
  verifiedResidentCount: number;
  lockerCount: number;
}

export interface Resident {
  id: string;
  nickname: string;
  dong: string;
  ho: string;
  complexId: string;
  reputationScore: number; // 0-100, 거래 완료율/응답 속도 기반 이웃평판 점수
  dealCount: number;
  reviewCount: number;
  verifiedAt: string; // YYYY.MM.DD
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  photoId: number;
  sellerId: string;
  postedAt: string; // YYYY.MM.DD
  likeCount: number;
  viewCount: number;
  chatCount: number;
  description: string;
  tags: string[];
  lockerAvailable: boolean;
}

export type ChatMessageType = "text" | "image" | "priceOffer" | "system" | "lockerShare";

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  from: "me" | "them";
  text?: string;
  offerPrice?: number;
  lockerLabel?: string;
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

export type LockerStatus = "픽업대기" | "픽업완료" | "회수예정";

export interface LockerSlot {
  id: string;
  label: string; // 예: A동 1층 3번함
  size: "소형" | "중형" | "대형";
  status: LockerStatus;
  productId: string;
  pin: string; // 4자리
  storedAt: string; // YYYY.MM.DD HH:mm
  expiresAt: string; // YYYY.MM.DD HH:mm
}

export interface Review {
  id: string;
  reviewerNickname: string;
  keyword: string;
  createdAt: string;
}

export interface MyVerification {
  emailVerified: boolean;
  phoneVerified: boolean;
  complexId: string;
  dong: string;
  ho: string;
  verifiedAt: string;
  verifyStatus: "완료" | "대기";
  interests: ProductCategory[];
  dealWindow: string;
}

/* ── 관리자 ── */

export type ReportType = "허위매물" | "사기의심" | "욕설/비매너" | "무인택배함오남용" | "개인정보노출";
export type ReportStatus = "대기" | "처리중" | "완료";
export type ReportPenalty = "경고" | "7일 정지" | "30일 정지" | "영구정지" | "조치없음";

export interface Report {
  id: string;
  type: ReportType;
  targetType: "게시글" | "회원" | "채팅";
  targetLabel: string;
  reporterNickname: string;
  reportedNickname: string;
  status: ReportStatus;
  createdAt: string;
  memo?: string;
  penalty?: ReportPenalty;
}

export type MemberStatus = "정상" | "주의" | "정지";

export interface AdminMember {
  id: string;
  nickname: string;
  dong: string;
  ho: string;
  complexName: string;
  joinedAt: string;
  emailVerified: boolean;
  complexVerified: boolean;
  reputationScore: number;
  dealCount: number;
  reportCount: number;
  status: MemberStatus;
}

export type AdminPostStatus = ProductStatus | "숨김처리" | "신고접수";

export interface AdminPost {
  id: string;
  title: string;
  photoId: number;
  sellerNickname: string;
  complexName: string;
  price: number;
  status: AdminPostStatus;
  reportCount: number;
  postedAt: string;
}

export type ComplexVerifyStatus = "승인완료" | "승인대기" | "반려";

export interface AdminComplex {
  id: string;
  name: string;
  address: string;
  householdCount: number;
  residentCount: number;
  verifyStatus: ComplexVerifyStatus;
  requestedAt: string;
  lockerCount: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  pinned: boolean;
}
