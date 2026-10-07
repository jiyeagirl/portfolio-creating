export type Region = "경기" | "강원" | "충청" | "영남" | "호남" | "제주";

export type LoginKind = "일반" | "보안문자";

/* 골프장 수집 상태: 정상 초록, 점검 필요 주황, 오류 빨강, 인증 필요 파랑 */
export type CollectStatus = "정상" | "점검 필요" | "오류" | "인증 필요";

export type CourseLayout = "레이크" | "힐" | "밸리";

export interface Course {
  id: string;
  name: string;
  region: Region;
  layouts: CourseLayout[];
  loginKind: LoginKind;
  status: CollectStatus;
  domain: string;
  /* 24시간 수집 성공률 (%) */
  successRate: number;
  lastSuccess: string;
}

/* 티타임 상태: 예약 가능 초록, 마감 회색, 취소티 파랑 강조 */
export type SlotStatus = "예약 가능" | "마감" | "취소티";

export interface TeeTime {
  courseId: string;
  date: string;
  time: string;
  layout: CourseLayout;
  fee: number;
  status: SlotStatus;
}

/* 회원 상태: 승인 대기 주황, 정상 초록, 반려 빨강, 이용 정지 회색 */
export type MemberStatus = "정상" | "승인 대기" | "반려" | "이용 정지";

export interface Member {
  id: string;
  name: string;
  phone: string;
  membershipNo: string;
  membershipLabel: string;
  joinedAt: string;
  status: MemberStatus;
  rejectReason?: string;
  suspendReason?: string;
  favoriteCourseIds: string[];
}

export type AccountStatus = "정상" | "로그인 실패" | "인증 필요";

export interface CourseAccount {
  courseId: string;
  loginId: string;
  password: string;
  status: AccountStatus;
}

export interface AlertCondition {
  id: string;
  courseId: string;
  date: string;
  timeBand: "오전" | "오후" | "전체";
  maxFee: number;
  enabled: boolean;
}

export interface InboxItem {
  id: string;
  kind: "취소티" | "공지";
  title: string;
  body: string;
  at: string;
  read: boolean;
  /* 취소티 중복 방지 키: 골프장 + 날짜 + 시간 */
  slotKey?: string;
  courseId?: string;
  date?: string;
  time?: string;
}

export interface MonitorLog {
  id: string;
  at: string;
  courseId: string;
  level: "오류" | "경고";
  message: string;
}

export interface PushRecord {
  id: string;
  at: string;
  target: string;
  title: string;
  body: string;
  recipients: number;
}

export interface ConfigHistory {
  at: string;
  courseId: string;
  note: string;
}

export interface CourseConfig {
  name: string;
  region: Region;
  layouts: string;
  domain: string;
  loginKind: LoginKind;
  selId: string;
  selPw: string;
  selBtn: string;
  apiDate: string;
  apiTime: string;
  apiCourse: string;
  apiFee: string;
  bookingPattern: string;
}

export type AppTab = "home" | "courses" | "alerts" | "profile";

export type AppView =
  | { kind: "tab"; tab: AppTab }
  | { kind: "course"; courseId: string }
  | { kind: "webview"; courseId: string; date: string; time: string; layout: CourseLayout };

export type AdminScreen =
  | "approvals"
  | "members"
  | "course-config"
  | "monitoring"
  | "push";
