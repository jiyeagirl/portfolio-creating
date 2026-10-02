export type Tone = "neutral" | "info" | "warn" | "ink" | "danger";

export type Department =
  | "경영지원팀"
  | "인사팀"
  | "홍보협력팀"
  | "기술연구팀"
  | "현장운영팀"
  | "감사팀";

export type Rank = "사원" | "주임" | "대리" | "과장" | "차장" | "부장";

export type BusinessUnit = "본원" | "서부지사" | "동부지사" | "인재개발원";

export type AssessmentStatus = "준비중" | "진행중" | "종료";

export type Assessment = {
  id: string;
  name: string;
  description: string;
  status: AssessmentStatus;
  visibility: "공개" | "비공개";
  startDate: string;
  endDate: string;
  targetUnits: BusinessUnit[];
  targetCount: number;
  responseCount: number;
  templateId: string;
  createdAt: string;
  createdBy: string;
};

export type QuestionAreaId = "stereotype" | "harassment" | "culture" | "decision" | "balance";

export type QuestionArea = {
  id: QuestionAreaId;
  label: string;
  description: string;
};

export type QuestionType = "scale" | "choice";

export type Question = {
  id: string;
  areaId: QuestionAreaId;
  type: QuestionType;
  order: number;
  required: boolean;
  prompt: string;
  choices?: string[];
  scaleLabels?: [string, string];
};

export type QuestionTemplate = {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  areaIds: QuestionAreaId[];
  usedByAssessments: number;
  updatedAt: string;
};

export type ParticipantStatus = "미발송" | "발송완료" | "응답완료" | "미응답";

export type Participant = {
  id: string;
  name: string;
  department: Department;
  rank: Rank;
  unit: BusinessUnit;
  email: string;
  phone: string;
  pin: string;
  status: ParticipantStatus;
  invitedAt?: string;
  respondedAt?: string;
  assessmentId: string;
};

export type AreaScore = {
  areaId: QuestionAreaId;
  score: number;
};

export type ResponseTrendPoint = {
  date: string;
  count: number;
};

export type AdminRole = "슈퍼관리자" | "운영자" | "뷰어";

export type AdminUser = {
  id: string;
  name: string;
  department: Department;
  role: AdminRole;
  email: string;
  lastActiveAt: string;
};

export type ReportKind = "개인" | "조직";

export type ReportStatus = "대기" | "생성중" | "생성완료";

export type ReportItem = {
  id: string;
  kind: ReportKind;
  targetName: string;
  assessmentId: string;
  status: ReportStatus;
  aiSummary: boolean;
  downloadCount: number;
  generatedAt?: string;
};

export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
};

export type Notice = {
  id: string;
  title: string;
  detail: string;
  at: string;
  unread: boolean;
};

export type PrivacySettings = {
  anonymousResponse: boolean;
  minResponseCount: number;
  orgStatDisclosure: boolean;
  restrictPersonalAccess: boolean;
  blockIndividualLookup: boolean;
};

export type SurveyAnswer = {
  questionId: string;
  value: number | string | null;
};

export type PersonalResult = {
  participantName: string;
  department: Department;
  rank: Rank;
  assessmentName: string;
  submittedAt: string;
  areaScores: AreaScore[];
  overallScore: number;
  aiSummary: string;
  feedback: string[];
};
