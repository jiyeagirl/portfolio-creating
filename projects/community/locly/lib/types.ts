export type BoardKey =
  | "free"
  | "town-news"
  | "question"
  | "food"
  | "tips"
  | "parenting"
  | "pet"
  | "lost"
  | "market"
  | "meetup-review";

export interface Board {
  key: BoardKey;
  label: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  board: BoardKey;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorBadge?: "official";
  createdAt: string;
  likes: number;
  comments: number;
  bookmarks: number;
  views: number;
  tags: string[];
  image?: string;
  isNotice?: boolean;
  isQuestion?: boolean;
  isAnswered?: boolean;
}

export interface LoclyEvent {
  id: string;
  title: string;
  description: string;
  organizer: string;
  official: boolean;
  category: string;
  location: string;
  date: string;
  endDate?: string;
  time: string;
  capacity: number;
  applied: number;
  image: string;
  pinned?: boolean;
  reviews: { author: string; rating: number; content: string }[];
}

export type StoreCategory =
  | "맛집"
  | "카페"
  | "병원"
  | "약국"
  | "미용실"
  | "학원"
  | "생활서비스";

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  rating: number;
  reviewCount: number;
  address: string;
  hours: string;
  phone: string;
  distance: string;
  image: string;
  tags: string[];
  promo?: string;
  favorited?: boolean;
  reviews: { author: string; rating: number; content: string; createdAt: string }[];
}

export interface Meetup {
  id: string;
  title: string;
  category: string;
  description: string;
  host: string;
  schedule: string;
  location: string;
  capacity: number;
  applied: number;
  status: "recruiting" | "closed" | "done";
  image: string;
  members: string[];
  reviews: { author: string; content: string }[];
}

export interface CivicProposal {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  status: "접수" | "검토중" | "답변완료";
  agree: number;
  timeline: { label: string; date: string; done: boolean }[];
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  deadline: string;
  totalVotes: number;
  options: { label: string; votes: number }[];
  voted?: boolean;
}

export interface Notification {
  id: string;
  type: "comment" | "like" | "event" | "meetup" | "notice";
  message: string;
  target: string;
  createdAt: string;
  read: boolean;
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "정상" | "제한" | "탈퇴";
  role: "주민" | "공식계정" | "운영자";
  posts: number;
}

export interface AdminReport {
  id: string;
  targetTitle: string;
  reason: string;
  reporter: string;
  createdAt: string;
  status: "대기" | "처리완료";
}

export interface AdminApproval {
  id: string;
  name: string;
  category: string;
  requester: string;
  requestedAt: string;
  status: "대기" | "승인" | "반려";
}
