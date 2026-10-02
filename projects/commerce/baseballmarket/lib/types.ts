export type TeamId =
  | "graiders"
  | "harbors"
  | "comets"
  | "pines"
  | "cranes"
  | "breeze"
  | "embers"
  | "tide"
  | "rhinos"
  | "mills";

export interface Team {
  id: TeamId;
  city: string;
  name: string;
  /** 모노그램 원에 들어가는 한 글자 */
  mark: string;
  stadium: string;
}

export type Category = "유니폼" | "굿즈" | "티켓";

/** 템플릿 그리드에서의 순번. 모노스페이스 01~06 표기로만 쓰이고 색을 뜻하지 않는다.
    (vercel_compact은 액센트가 잉크 하나뿐이라 카테고리별 색이 없다.) */
export type TileIndex = 1 | 2 | 3 | 4 | 5 | 6;

export type Condition = "미착용" | "최상" | "상" | "중";

export type UniformKind = "홈" | "원정" | "서드" | "올드";

export type TradeMethod = "택배" | "직거래" | "안전거래";

export type ListingStatus = "판매중" | "예약중" | "거래중" | "거래완료" | "노출중단";

export interface SellerProfile {
  id: string;
  nickname: string;
  mannerScore: number;
  responseRate: number;
  responseMin: number;
  tradeCount: number;
  joinedAt: string;
  homeTeam: TeamId;
  dong: string;
}

/** 유니폼/굿즈 공통 매물 */
export interface Listing {
  id: string;
  title: string;
  category: Category;
  team: TeamId;
  price: number;
  /** 정가 또는 발매가. 티켓에서는 좌석 정가다. */
  facePrice?: number;
  condition: Condition;
  photoId: number;
  createdAt: string;
  dong: string;
  distanceKm: number;
  likes: number;
  chats: number;
  status: ListingStatus;
  method: TradeMethod[];
  sellerId: string;
  negotiable: boolean;
  /** 유니폼 전용 */
  uniform?: {
    kind: UniformKind;
    season: number;
    player: string;
    backNumber: number;
    size: string;
    /** 실측 (cm) */
    chest: number;
    length: number;
    shoulder: number;
    authentic: boolean;
    flaws: string[];
  };
  /** 티켓 전용 */
  ticket?: {
    gameDate: string;
    gameTime: string;
    stadium: string;
    homeTeam: TeamId;
    awayTeam: TeamId;
    zone: string;
    row: string;
    seats: number;
    transfer: "모바일 양도" | "현장 수령" | "실물 배송";
  };
  desc: string;
}

export interface ChatThread {
  id: string;
  listingId: string;
  peerId: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  stage: "문의" | "가격제안" | "예약중" | "결제완료" | "배송중" | "거래완료";
  offer?: number;
}

export interface ChatMessage {
  id: string;
  from: "me" | "peer" | "system";
  text: string;
  at: string;
  kind?: "text" | "offer" | "listing" | "payment";
  amount?: number;
}

export type BoardKey = "team" | "free" | "review" | "goods" | "live";

export interface Post {
  id: string;
  board: BoardKey;
  team?: TeamId;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  photoId?: number;
  /** 게시글에 연결된 내 판매 매물 */
  linkedListingId?: string;
  hot?: boolean;
}

/* ---------- 관리자 ---------- */

export type ReportReason =
  | "정가 초과"
  | "허위 매물"
  | "사기 의심"
  | "금지 품목"
  | "욕설 / 비방"
  | "도배";

export type ReportState = "미처리" | "검토중" | "처리완료" | "반려";

export interface Report {
  id: string;
  target: "매물" | "게시글" | "댓글" | "회원";
  targetLabel: string;
  reason: ReportReason;
  reporter: string;
  createdAt: string;
  state: ReportState;
  memo?: string;
}

export interface AdminMember {
  id: string;
  nickname: string;
  realName: string;
  phone: string;
  joinedAt: string;
  team: TeamId;
  trades: number;
  mannerScore: number;
  sanction: "없음" | "경고" | "7일 정지" | "영구 정지";
  reports: number;
}

export interface Settlement {
  id: string;
  listingLabel: string;
  buyer: string;
  seller: string;
  amount: number;
  fee: number;
  requestedAt: string;
  state: "정산대기" | "정산완료" | "보류" | "환불";
}

export interface Dispute {
  id: string;
  listingLabel: string;
  filedBy: string;
  against: string;
  reason: string;
  amount: number;
  filedAt: string;
  state: "접수" | "조정중" | "환불완료" | "종결";
}

/** 티켓 정가 기준표 — 정가 초과 자동 탐지의 기준 데이터 */
export interface PriceRule {
  id: string;
  stadium: string;
  zone: string;
  weekday: number;
  weekend: number;
  updatedAt: string;
  version: string;
}

export interface OverPriceHit {
  id: string;
  listingLabel: string;
  stadium: string;
  zone: string;
  face: number;
  asking: number;
  seller: string;
  detectedAt: string;
  state: "미처리" | "노출중단" | "허용";
}

export interface BannedKeyword {
  id: string;
  word: string;
  scope: "매물" | "게시글" | "전체";
  hits: number;
  addedAt: string;
  addedBy: string;
}
