export type Industry =
  | "AI·데이터"
  | "헬스케어"
  | "핀테크"
  | "모빌리티"
  | "푸드테크"
  | "친환경·에너지"
  | "에듀테크"
  | "커머스"
  | "제조·하드웨어"
  | "콘텐츠";

export type CompanyStage = "예비창업" | "시드" | "프리A" | "시리즈A" | "시리즈B";

export type CollabStatus = "협업 가능" | "협업 진행중" | "모집 마감";

export type MarkTone = "accent" | "ink" | "neutral";

export type LogoShape =
  | "grid"
  | "leaf"
  | "arc"
  | "cross"
  | "bolt"
  | "wave"
  | "stack"
  | "notch"
  | "orbit"
  | "ring"
  | "prism"
  | "chevron";

export interface BrandLogo {
  shape: LogoShape;
  color: string;
}

export interface Company {
  id: string;
  name: string;
  enName: string;
  mark: string;
  tone: MarkTone;
  logo: BrandLogo;
  cover: string;
  industry: Industry;
  oneLiner: string;
  description: string;
  services: string[];
  keywords: string[];
  region: string;
  employees: number;
  foundedYear: number;
  stage: CompanyStage;
  invested: boolean;
  investment?: string;
  collabStatus: CollabStatus;
  ceo: string;
  manager: { name: string; role: string; email: string; phone: string };
  institution: string;
  program: string;
  verifiedAt: string;
  tech: { label: string; detail: string }[];
  projects: { title: string; period: string; partner: string; result: string }[];
  openCollabs: { title: string; need: string; deadline: string; applicants: number }[];
  joinedAt: string;
}

export type FeedCategory =
  | "협업 모집"
  | "투자 이야기"
  | "창업 후기"
  | "정부지원사업"
  | "행사 후기";

export interface FeedComment {
  id: string;
  companyId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  companyId: string;
  author: string;
  category: FeedCategory;
  content: string;
  tags: string[];
  image?: string;
  attachment?: { name: string; size: string };
  likes: number;
  saves: number;
  createdAt: string;
  recruiting?: { role: string; deadline: string; positions: number };
  comments: FeedComment[];
  liked?: boolean;
}

export type BoardCategory =
  | "지원사업"
  | "공지사항"
  | "투자 정보"
  | "교육 프로그램"
  | "창업 자료실";

export interface BoardPost {
  id: string;
  category: BoardCategory;
  title: string;
  summary: string;
  content: string[];
  author: string;
  authorOrg: string;
  official: boolean;
  createdAt: string;
  deadline?: string;
  views: number;
  bookmarks: number;
  tags: string[];
  attachments: { name: string; size: string }[];
  comments: { author: string; content: string; createdAt: string }[];
  pinned?: boolean;
}

export type QnaCategory = "투자" | "법률" | "특허" | "마케팅" | "세무" | "정부지원사업";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  org: string;
  fields: QnaCategory[];
  career: string[];
  answerCount: number;
  satisfaction: number;
  tone: MarkTone;
  mark: string;
}

export interface Answer {
  id: string;
  mentorId: string;
  content: string;
  createdAt: string;
  likes: number;
  accepted: boolean;
  followUps: { author: string; content: string; createdAt: string }[];
}

export interface Question {
  id: string;
  category: QnaCategory;
  title: string;
  content: string;
  askerCompanyId: string;
  askerLabel: string;
  createdAt: string;
  views: number;
  likes: number;
  attachments: { name: string; size: string }[];
  answers: Answer[];
}

export type MessageKind = "text" | "image" | "file" | "namecard" | "companyCard" | "proposal";

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  kind: MessageKind;
  text?: string;
  fileName?: string;
  fileSize?: string;
  image?: string;
  companyId?: string;
  proposal?: { title: string; budget: string; period: string };
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  companyId: string;
  unread: number;
  lastAt: string;
  messages: ChatMessage[];
}

export interface EventItem {
  id: string;
  title: string;
  type: "네트워킹" | "IR" | "세미나" | "교육";
  host: string;
  date: string;
  time: string;
  place: string;
  capacity: number;
  applied: number;
  status: "모집중" | "모집마감" | "진행완료";
  image: string;
  applicantsAttended?: number;
  myStatus?: "신청완료" | "참석확정";
}

export interface ProgramItem {
  id: string;
  title: string;
  period: string;
  target: string;
  applied: number;
  capacity: number;
  status: "모집중" | "운영중" | "종료";
}

export interface AppNotification {
  id: string;
  kind: "collab" | "chat" | "notice" | "answer";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface AdminMember {
  id: string;
  companyId?: string;
  company: string;
  contact: string;
  email: string;
  role: "기업 담당자" | "기업 대표" | "기관 운영자";
  industry: Industry | "기관";
  joinedAt: string;
  status: "활성" | "승인대기" | "반려" | "비활성";
  lastActive: string;
}

export interface CertRequest {
  id: string;
  company: string;
  bizNumber: string;
  ceo: string;
  institution: string;
  program: string;
  type: "입주기업" | "지원사업";
  submittedAt: string;
  manager: { name: string; role: string; phone: string; email: string };
  documents: { name: string; size: string; kind: "사업자등록증" | "선정 증빙" | "기타" }[];
  status: "심사대기" | "보완요청" | "승인" | "반려";
}

export interface AdminReport {
  id: string;
  target: string;
  targetType: "게시글" | "댓글" | "채팅";
  reporter: string;
  reason: string;
  createdAt: string;
  status: "처리대기" | "처리완료" | "반려";
}

export interface CollabRequest {
  id: string;
  from: string;
  to: string;
  topic: string;
  createdAt: string;
  status: "제안" | "논의중" | "성사" | "종료";
}
