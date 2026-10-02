import type {
  AdminUser,
  AreaScore,
  Assessment,
  AuditLogEntry,
  BusinessUnit,
  Department,
  Notice,
  Participant,
  PersonalResult,
  PrivacySettings,
  QuestionArea,
  QuestionTemplate,
  Question,
  Rank,
  ReportItem,
  ResponseTrendPoint,
} from "@/projects/b2b/genderinsight/lib/types";

export const DEPARTMENTS: Department[] = [
  "경영지원팀",
  "인사팀",
  "홍보협력팀",
  "기술연구팀",
  "현장운영팀",
  "감사팀",
];

export const RANKS: Rank[] = ["사원", "주임", "대리", "과장", "차장", "부장"];

export const BUSINESS_UNITS: BusinessUnit[] = ["본원", "서부지사", "동부지사", "인재개발원"];

export const QUESTION_AREAS: QuestionArea[] = [
  {
    id: "stereotype",
    label: "성별 고정관념 인식",
    description: "성별에 따른 역할 기대와 편견을 스스로 인지하는 정도",
  },
  {
    id: "harassment",
    label: "성희롱 / 성차별 민감도",
    description: "성희롱, 성차별 상황을 식별하고 대응하는 민감도",
  },
  {
    id: "culture",
    label: "포용적 조직문화",
    description: "성별과 무관하게 존중받는 조직 분위기에 대한 인식",
  },
  {
    id: "decision",
    label: "의사결정 참여 형평성",
    description: "주요 의사결정 과정에 성별 균형이 반영되는 정도",
  },
  {
    id: "balance",
    label: "일 / 생활 균형 지원",
    description: "돌봄, 휴가 등 일과 삶의 균형을 지원하는 제도 체감도",
  },
];

export const AREA_LABEL: Record<string, string> = Object.fromEntries(
  QUESTION_AREAS.map((area) => [area.id, area.label]),
);

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    areaId: "stereotype",
    type: "scale",
    order: 1,
    required: true,
    prompt: "우리 조직에서는 특정 업무가 특정 성별에게 더 적합하다는 인식이 존재하지 않는다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q2",
    areaId: "stereotype",
    type: "scale",
    order: 2,
    required: true,
    prompt: "채용, 배치, 승진 과정에서 성별에 따른 기대치 차이를 느낀 적이 없다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q3",
    areaId: "stereotype",
    type: "choice",
    order: 3,
    required: true,
    prompt: "다음 중 우리 조직에서 가장 자주 접하는 성별 고정관념 표현에 가까운 것은?",
    choices: [
      "여성은 꼼꼼한 업무에, 남성은 대외 업무에 어울린다는 말",
      "육아휴직은 여성이 쓰는 것이 자연스럽다는 말",
      "리더십은 남성에게 더 어울린다는 말",
      "특별히 접한 적 없다",
    ],
  },
  {
    id: "q4",
    areaId: "stereotype",
    type: "scale",
    order: 4,
    required: false,
    prompt: "회의나 보고 자리에서 성별에 따라 발언 기회가 다르게 주어지지 않는다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q5",
    areaId: "harassment",
    type: "scale",
    order: 1,
    required: true,
    prompt: "성희롱 예방 교육 내용을 실제 업무 상황에 적용할 수 있다고 생각한다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q6",
    areaId: "harassment",
    type: "scale",
    order: 2,
    required: true,
    prompt: "성희롱 발생 시 신고 절차와 처리 기준을 명확히 알고 있다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q7",
    areaId: "harassment",
    type: "choice",
    order: 3,
    required: true,
    prompt: "성희롱 신고 후 가장 우려되는 점은 무엇인가?",
    choices: [
      "인사상 불이익",
      "비밀 보장이 안 될 것 같은 불안",
      "가해자와의 관계 유지 부담",
      "특별히 우려하지 않는다",
    ],
  },
  {
    id: "q8",
    areaId: "harassment",
    type: "scale",
    order: 4,
    required: false,
    prompt: "동료가 불편한 언행을 겪는 것을 목격하면 개입하거나 신고할 의향이 있다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q9",
    areaId: "culture",
    type: "scale",
    order: 1,
    required: true,
    prompt: "우리 조직은 성별과 무관하게 의견을 동등하게 존중한다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q10",
    areaId: "culture",
    type: "scale",
    order: 2,
    required: true,
    prompt: "육아휴직, 배우자 출산휴가 등 제도를 성별에 관계없이 자유롭게 사용할 수 있다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q11",
    areaId: "culture",
    type: "choice",
    order: 3,
    required: false,
    prompt: "우리 조직의 포용적 문화 수준을 가장 잘 나타내는 항목은?",
    choices: [
      "성별 무관 동등한 업무 배분",
      "다양성 관련 사내 소통 채널 운영",
      "리더의 포용적 언행",
      "아직 개선이 더 필요하다",
    ],
  },
  {
    id: "q12",
    areaId: "culture",
    type: "scale",
    order: 4,
    required: false,
    prompt: "회식, 워크숍 등 조직 행사에서 성별에 따른 소외감을 느낀 적이 없다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q13",
    areaId: "decision",
    type: "scale",
    order: 1,
    required: true,
    prompt: "주요 의사결정 회의에 성별 균형 있게 참여하고 있다고 생각한다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q14",
    areaId: "decision",
    type: "scale",
    order: 2,
    required: true,
    prompt: "승진, 보직 인사에서 성별에 따른 유불리를 느낀 적이 없다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q15",
    areaId: "decision",
    type: "choice",
    order: 3,
    required: false,
    prompt: "의사결정 참여 형평성을 높이기 위해 가장 필요한 조치는?",
    choices: [
      "여성 관리자 비율 목표 설정",
      "공정한 평가 기준 공개",
      "멘토링, 스폰서십 프로그램",
      "이미 충분히 형평적이다",
    ],
  },
  {
    id: "q16",
    areaId: "balance",
    type: "scale",
    order: 1,
    required: true,
    prompt: "탄력근무, 재택근무 등 유연근무 제도를 성별에 관계없이 눈치 보지 않고 사용한다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q17",
    areaId: "balance",
    type: "scale",
    order: 2,
    required: true,
    prompt: "돌봄이 필요한 상황에서 상사, 동료의 지지를 받을 수 있다고 느낀다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q18",
    areaId: "balance",
    type: "choice",
    order: 3,
    required: false,
    prompt: "일과 생활의 균형을 위해 가장 개선이 필요한 제도는?",
    choices: ["유연근무 확대", "돌봄 휴가 확대", "업무량 조정", "현재도 충분하다"],
  },
  {
    id: "q19",
    areaId: "balance",
    type: "scale",
    order: 4,
    required: false,
    prompt: "장시간 근로 문화가 성별에 관계없이 개선되고 있다고 느낀다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
  {
    id: "q20",
    areaId: "balance",
    type: "scale",
    order: 5,
    required: false,
    prompt: "일과 삶의 균형에 대한 조직의 관심과 지원에 만족한다",
    scaleLabels: ["전혀 그렇지 않다", "매우 그렇다"],
  },
];

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: "t1",
    name: "기본형",
    description: "5개 영역을 균등 구성한 정기 진단 표준 템플릿",
    questionCount: 20,
    areaIds: ["stereotype", "harassment", "culture", "decision", "balance"],
    usedByAssessments: 2,
    updatedAt: "2025-10-12",
  },
  {
    id: "t2",
    name: "간편형",
    description: "영역별 2문항으로 축약한 단축 버전, 온보딩 / 특별 진단용",
    questionCount: 10,
    areaIds: ["stereotype", "harassment", "culture", "decision", "balance"],
    usedByAssessments: 1,
    updatedAt: "2025-12-20",
  },
  {
    id: "t3",
    name: "관리자 리더십형",
    description: "과장급 이상 대상, 의사결정 / 조직문화 영역 문항 비중을 확대",
    questionCount: 20,
    areaIds: ["stereotype", "harassment", "culture", "decision", "balance"],
    usedByAssessments: 1,
    updatedAt: "2026-01-08",
  },
];

/** 참여자 콘솔 설문 데모용 축약 세트(t2 간편형, 영역별 2문항). */
export const SURVEY_FLOW_QUESTIONS: Question[] = [
  QUESTIONS[0],
  QUESTIONS[2],
  QUESTIONS[4],
  QUESTIONS[6],
  QUESTIONS[8],
  QUESTIONS[10],
  QUESTIONS[12],
  QUESTIONS[14],
  QUESTIONS[15],
  QUESTIONS[17],
];

export const ASSESSMENTS: Assessment[] = [
  {
    id: "a1",
    name: "2025년 하반기 정기 성인지감수성 진단",
    description: "전 임직원 대상 연 2회 정기 진단, 부서 / 직급별 비교 분석 포함",
    status: "종료",
    visibility: "공개",
    startDate: "2025-11-03",
    endDate: "2025-11-21",
    targetUnits: ["본원", "서부지사", "동부지사", "인재개발원"],
    targetCount: 428,
    responseCount: 402,
    templateId: "t1",
    createdAt: "2025-10-20",
    createdBy: "박서연",
  },
  {
    id: "a2",
    name: "신규 입사자 온보딩 성인지 진단",
    description: "입사 3개월 이내 신규 입사자 대상 단축형 온보딩 진단",
    status: "진행중",
    visibility: "비공개",
    startDate: "2026-01-05",
    endDate: "2026-02-02",
    targetUnits: ["본원", "서부지사"],
    targetCount: 34,
    responseCount: 21,
    templateId: "t2",
    createdAt: "2025-12-28",
    createdBy: "박서연",
  },
  {
    id: "a3",
    name: "관리자급 성인지 리더십 진단",
    description: "과장급 이상 관리자 대상, 의사결정 참여 형평성 영역 강화",
    status: "진행중",
    visibility: "공개",
    startDate: "2026-01-20",
    endDate: "2026-02-06",
    targetUnits: ["본원", "서부지사"],
    targetCount: 96,
    responseCount: 58,
    templateId: "t3",
    createdAt: "2026-01-10",
    createdBy: "박서연",
  },
  {
    id: "a4",
    name: "인재개발원 특별 진단",
    description: "재직자 만족도 조사와 연계한 인재개발원 단독 진단",
    status: "준비중",
    visibility: "공개",
    startDate: "2026-02-10",
    endDate: "2026-02-24",
    targetUnits: ["인재개발원"],
    targetCount: 52,
    responseCount: 0,
    templateId: "t1",
    createdAt: "2026-01-25",
    createdBy: "김지훈",
  },
];

type ParticipantSeed = {
  name: string;
  department: Department;
  rank: Rank;
  unit: BusinessUnit;
  assessmentId: string;
  responded: boolean;
  invited: boolean;
};

const PARTICIPANT_SEEDS: ParticipantSeed[] = [
  { name: "이서연", department: "인사팀", rank: "대리", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "김도윤", department: "기술연구팀", rank: "과장", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "박준서", department: "현장운영팀", rank: "사원", unit: "서부지사", assessmentId: "a1", responded: true, invited: true },
  { name: "최지우", department: "홍보협력팀", rank: "주임", unit: "본원", assessmentId: "a1", responded: false, invited: true },
  { name: "정하윤", department: "경영지원팀", rank: "차장", unit: "동부지사", assessmentId: "a1", responded: true, invited: true },
  { name: "강민준", department: "감사팀", rank: "부장", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "조서윤", department: "기술연구팀", rank: "대리", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "윤도현", department: "현장운영팀", rank: "과장", unit: "동부지사", assessmentId: "a1", responded: false, invited: true },
  { name: "장하은", department: "인사팀", rank: "사원", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "임지호", department: "홍보협력팀", rank: "차장", unit: "서부지사", assessmentId: "a1", responded: true, invited: true },
  { name: "한소율", department: "경영지원팀", rank: "주임", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "오은우", department: "기술연구팀", rank: "부장", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "서지안", department: "현장운영팀", rank: "대리", unit: "인재개발원", assessmentId: "a1", responded: false, invited: true },
  { name: "신유진", department: "감사팀", rank: "과장", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "권태윤", department: "인사팀", rank: "차장", unit: "서부지사", assessmentId: "a1", responded: true, invited: true },
  { name: "황서준", department: "기술연구팀", rank: "사원", unit: "동부지사", assessmentId: "a1", responded: true, invited: true },
  { name: "안다은", department: "홍보협력팀", rank: "대리", unit: "본원", assessmentId: "a1", responded: false, invited: true },
  { name: "송민서", department: "경영지원팀", rank: "부장", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "전예린", department: "현장운영팀", rank: "주임", unit: "서부지사", assessmentId: "a1", responded: true, invited: true },
  { name: "홍시우", department: "기술연구팀", rank: "차장", unit: "본원", assessmentId: "a1", responded: true, invited: true },
  { name: "문가은", department: "인사팀", rank: "과장", unit: "인재개발원", assessmentId: "a2", responded: true, invited: true },
  { name: "양준혁", department: "현장운영팀", rank: "사원", unit: "본원", assessmentId: "a2", responded: true, invited: true },
  { name: "배수아", department: "기술연구팀", rank: "사원", unit: "서부지사", assessmentId: "a2", responded: false, invited: true },
  { name: "노현우", department: "홍보협력팀", rank: "주임", unit: "본원", assessmentId: "a2", responded: true, invited: true },
  { name: "백지민", department: "경영지원팀", rank: "사원", unit: "본원", assessmentId: "a2", responded: false, invited: true },
  { name: "우서현", department: "감사팀", rank: "차장", unit: "서부지사", assessmentId: "a3", responded: true, invited: true },
  { name: "진하람", department: "기술연구팀", rank: "과장", unit: "본원", assessmentId: "a3", responded: true, invited: true },
  { name: "곽민재", department: "현장운영팀", rank: "부장", unit: "본원", assessmentId: "a3", responded: false, invited: true },
  { name: "류지안", department: "인사팀", rank: "과장", unit: "동부지사", assessmentId: "a3", responded: true, invited: true },
  { name: "표승우", department: "경영지원팀", rank: "부장", unit: "본원", assessmentId: "a3", responded: false, invited: true },
];

export const PARTICIPANTS: Participant[] = PARTICIPANT_SEEDS.map((seed, index) => {
  const id = `p${index + 1}`;
  const pin = String(300000 + index * 5137).slice(0, 6);
  const status = seed.responded ? "응답완료" : seed.invited ? "발송완료" : "미발송";
  return {
    id,
    name: seed.name,
    department: seed.department,
    rank: seed.rank,
    unit: seed.unit,
    email: `${id}.${seed.name === "이서연" ? "seoyeon" : "member"}@company.kr`,
    phone: `010-${String(2000 + index * 37).padStart(4, "0")}-${String(4000 + index * 91).padStart(4, "0")}`,
    pin,
    status,
    invitedAt: seed.invited ? "2025-10-27" : undefined,
    respondedAt: seed.responded ? "2025-11-1" + String(2 + (index % 8)) : undefined,
    assessmentId: seed.assessmentId,
  };
});

export const PARTICIPANT_DEMO = PARTICIPANTS[0];

export const AREA_SCORES: AreaScore[] = [
  { areaId: "stereotype", score: 3.8 },
  { areaId: "harassment", score: 4.1 },
  { areaId: "culture", score: 3.6 },
  { areaId: "decision", score: 3.2 },
  { areaId: "balance", score: 3.9 },
];

export const DEPARTMENT_RESPONSE = [
  { department: "인사팀", target: 42, responded: 40 },
  { department: "경영지원팀", target: 58, responded: 55 },
  { department: "홍보협력팀", target: 31, responded: 26 },
  { department: "기술연구팀", target: 96, responded: 92 },
  { department: "현장운영팀", target: 152, responded: 138 },
  { department: "감사팀", target: 18, responded: 17 },
];

export const RANK_RESPONSE = [
  { rank: "사원", target: 118, responded: 108 },
  { rank: "주임", target: 86, responded: 79 },
  { rank: "대리", target: 94, responded: 89 },
  { rank: "과장", target: 74, responded: 71 },
  { rank: "차장", target: 38, responded: 36 },
  { rank: "부장", target: 18, responded: 17 },
];

export const DEPARTMENT_AREA_SCORES: { department: Department; scores: Record<string, number> }[] = [
  {
    department: "인사팀",
    scores: { stereotype: 4.0, harassment: 4.3, culture: 3.9, decision: 3.6, balance: 4.1 },
  },
  {
    department: "기술연구팀",
    scores: { stereotype: 3.6, harassment: 3.9, culture: 3.4, decision: 2.9, balance: 3.6 },
  },
  {
    department: "현장운영팀",
    scores: { stereotype: 3.5, harassment: 3.8, culture: 3.3, decision: 2.8, balance: 3.5 },
  },
  {
    department: "경영지원팀",
    scores: { stereotype: 3.9, harassment: 4.2, culture: 3.8, decision: 3.5, balance: 4.0 },
  },
];

export const RANK_AREA_SCORES: { rank: Rank; scores: Record<string, number> }[] = [
  { rank: "사원", scores: { stereotype: 3.9, harassment: 4.2, culture: 3.8, decision: 3.5, balance: 4.0 } },
  { rank: "대리", scores: { stereotype: 3.7, harassment: 4.0, culture: 3.6, decision: 3.2, balance: 3.8 } },
  { rank: "과장", scores: { stereotype: 3.6, harassment: 3.9, culture: 3.4, decision: 2.9, balance: 3.6 } },
  { rank: "차장", scores: { stereotype: 3.8, harassment: 4.1, culture: 3.7, decision: 3.1, balance: 3.9 } },
  { rank: "부장", scores: { stereotype: 3.9, harassment: 4.3, culture: 3.9, decision: 3.4, balance: 4.1 } },
];

export const RESPONSE_TREND: ResponseTrendPoint[] = [
  { date: "11.03", count: 18 },
  { date: "11.05", count: 34 },
  { date: "11.07", count: 29 },
  { date: "11.09", count: 41 },
  { date: "11.11", count: 52 },
  { date: "11.13", count: 38 },
  { date: "11.15", count: 47 },
  { date: "11.17", count: 61 },
  { date: "11.19", count: 55 },
  { date: "11.21", count: 27 },
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "adm1",
    name: "박서연",
    department: "인사팀",
    role: "슈퍼관리자",
    email: "seoyeon.park@company.kr",
    lastActiveAt: "2026-01-28 09:14",
  },
  {
    id: "adm2",
    name: "김지훈",
    department: "인사팀",
    role: "운영자",
    email: "jihoon.kim@company.kr",
    lastActiveAt: "2026-01-27 17:42",
  },
  {
    id: "adm3",
    name: "이하늘",
    department: "경영지원팀",
    role: "뷰어",
    email: "haneul.lee@company.kr",
    lastActiveAt: "2026-01-22 11:03",
  },
];

export const REPORTS: ReportItem[] = [
  { id: "r1", kind: "조직", targetName: "전사 종합", assessmentId: "a1", status: "생성완료", aiSummary: true, downloadCount: 12, generatedAt: "2025-11-24" },
  { id: "r2", kind: "조직", targetName: "기술연구팀", assessmentId: "a1", status: "생성완료", aiSummary: true, downloadCount: 6, generatedAt: "2025-11-24" },
  { id: "r3", kind: "조직", targetName: "현장운영팀", assessmentId: "a1", status: "생성완료", aiSummary: true, downloadCount: 4, generatedAt: "2025-11-24" },
  { id: "r4", kind: "개인", targetName: "이서연 (인사팀 / 대리)", assessmentId: "a1", status: "생성완료", aiSummary: true, downloadCount: 2, generatedAt: "2025-11-24" },
  { id: "r5", kind: "개인", targetName: "김도윤 (기술연구팀 / 과장)", assessmentId: "a1", status: "생성완료", aiSummary: true, downloadCount: 1, generatedAt: "2025-11-24" },
  { id: "r6", kind: "개인", targetName: "정하윤 (경영지원팀 / 차장)", assessmentId: "a1", status: "생성완료", aiSummary: false, downloadCount: 1, generatedAt: "2025-11-24" },
  { id: "r7", kind: "조직", targetName: "인재개발원", assessmentId: "a1", status: "생성완료", aiSummary: true, downloadCount: 3, generatedAt: "2025-11-24" },
  { id: "r8", kind: "개인", targetName: "문가은 (인사팀 / 과장)", assessmentId: "a2", status: "생성중", aiSummary: true, downloadCount: 0 },
  { id: "r9", kind: "조직", targetName: "온보딩 전체", assessmentId: "a2", status: "대기", aiSummary: false, downloadCount: 0 },
  { id: "r10", kind: "조직", targetName: "관리자 리더십 종합", assessmentId: "a3", status: "대기", aiSummary: false, downloadCount: 0 },
];

export const AUDIT_LOG: AuditLogEntry[] = [
  { id: "al1", actor: "박서연", action: "관리자 권한 변경", target: "김지훈 → 운영자", at: "2026-01-27 14:02" },
  { id: "al2", actor: "박서연", action: "진단 생성", target: "관리자급 성인지 리더십 진단", at: "2026-01-10 10:31" },
  { id: "al3", actor: "김지훈", action: "참여자 PIN 재발급", target: "배수아 (기술연구팀)", at: "2026-01-24 16:18" },
  { id: "al4", actor: "시스템", action: "개별 응답 조회 시도 차단", target: "이하늘 (뷰어 권한)", at: "2026-01-22 11:04" },
  { id: "al5", actor: "박서연", action: "리마인드 이메일 발송", target: "신규 입사자 온보딩 진단 미응답자 13명", at: "2026-01-21 09:00" },
  { id: "al6", actor: "김지훈", action: "문항 템플릿 수정", target: "관리자 리더십형", at: "2026-01-08 13:47" },
  { id: "al7", actor: "박서연", action: "조직 리포트 일괄 생성", target: "2025년 하반기 정기 진단", at: "2025-11-24 08:15" },
  { id: "al8", actor: "박서연", action: "익명 응답 정책 변경", target: "최소 응답 인원 기준 5명 → 5명 유지", at: "2025-10-18 15:22" },
];

export const NOTICES: Notice[] = [
  { id: "n1", title: "마감 임박", detail: "온보딩 진단이 5일 후 마감됩니다 (미응답 13명)", at: "2시간 전", unread: true },
  { id: "n2", title: "리마인드 발송 완료", detail: "관리자급 리더십 진단 미응답자 38명에게 발송했습니다", at: "어제", unread: true },
  { id: "n3", title: "리포트 생성 완료", detail: "2025년 하반기 정기 진단 조직 리포트 7건이 생성됐습니다", at: "2025.11.24", unread: false },
  { id: "n4", title: "신규 진단 승인 대기", detail: "인재개발원 특별 진단이 준비중 상태로 대기 중입니다", at: "2026.01.25", unread: false },
];

export const PRIVACY_SETTINGS: PrivacySettings = {
  anonymousResponse: true,
  minResponseCount: 5,
  orgStatDisclosure: true,
  restrictPersonalAccess: true,
  blockIndividualLookup: true,
};

export const PERSONAL_RESULT: PersonalResult = {
  participantName: "이서연",
  department: "인사팀",
  rank: "대리",
  assessmentName: "2025년 하반기 정기 성인지감수성 진단",
  submittedAt: "2025-11-15",
  areaScores: [
    { areaId: "stereotype", score: 4.0 },
    { areaId: "harassment", score: 4.4 },
    { areaId: "culture", score: 3.9 },
    { areaId: "decision", score: 3.6 },
    { areaId: "balance", score: 4.2 },
  ],
  overallScore: 4.0,
  aiSummary:
    "전반적으로 조직 내 성인지감수성 수준이 평균보다 높게 나타났습니다. 특히 성희롱, 성차별 민감도와 일 / 생활 균형 지원 체감도가 높아 예방 교육과 유연근무 제도의 효과가 반영된 것으로 보입니다. 의사결정 참여 형평성 영역은 상대적으로 낮아, 향후 주요 회의체의 성별 균형에 대한 관심이 더 필요합니다.",
  feedback: [
    "의사결정 회의 참여 기회를 정기적으로 점검해보는 것을 권장합니다",
    "예방 교육에서 습득한 대응 절차를 팀 내 사례로 공유해보세요",
    "유연근무 제도를 눈치 보지 않고 계속 활용해주세요",
  ],
};
