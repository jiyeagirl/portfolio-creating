import type {
  Challenge,
  HealthConnection,
  HistoryDay,
  MealEntry,
  NudgeNotification,
  RhythmEntry,
  UserProfile,
  WeeklyReport,
} from "@/projects/healthcare/welllog/lib/types";

export const currentUser: UserProfile = {
  name: "김서연",
  nickname: "서연",
  goal: "가벼운 아침 루틴 만들기",
  joinedAt: "2026-05-12",
  height: 164,
  weight: 54,
};

export const healthConnections: HealthConnection[] = [
  { platform: "Apple Health", connected: true, lastSyncAt: "2026-07-29 07:12" },
  { platform: "Google Fit", connected: false },
];

export const todayRhythm: RhythmEntry = {
  date: "2026-07-29",
  sleepHours: 6.8,
  sleepGoalHours: 8,
  sleepScore: 78,
  steps: 6482,
  stepsGoal: 8000,
  activityMinutes: 34,
  activityGoalMinutes: 45,
  moodEmoji: "🙂",
  moodNote: "아침에 커피 한 잔 하니 개운했어요",
  habitsChecked: ["물 마시기", "아침 스트레칭"],
  habitsTotal: ["물 마시기", "아침 스트레칭", "10분 명상", "비타민 챙기기"],
  aiSuggestion: "어제보다 수면이 1시간 짧아요. 오늘은 카페인을 오후 2시 이전에 마셔보는 건 어떨까요?",
};

export const meals: MealEntry[] = [
  {
    id: "ml-1",
    date: "2026-07-29",
    time: "08:20",
    mealType: "아침",
    name: "딸기 오트밀 볼",
    calories: 320,
    carbsG: 52,
    proteinG: 11,
    fatG: 7,
    photo: 493,
    source: "photo",
    aiConfidence: 94,
  },
  {
    id: "ml-2",
    date: "2026-07-29",
    time: "12:45",
    mealType: "점심",
    name: "적양배추 샐러드 볼",
    calories: 410,
    carbsG: 38,
    proteinG: 18,
    fatG: 19,
    photo: 488,
    source: "photo",
    aiConfidence: 89,
  },
  {
    id: "ml-3",
    date: "2026-07-29",
    time: "15:30",
    mealType: "간식",
    name: "귀리 쿠키 2개",
    calories: 180,
    carbsG: 24,
    proteinG: 3,
    fatG: 8,
    photo: 835,
    source: "photo",
    aiConfidence: 81,
  },
  {
    id: "ml-4",
    date: "2026-07-28",
    time: "19:10",
    mealType: "저녁",
    name: "채소 볶음과 현미밥",
    calories: 520,
    carbsG: 68,
    proteinG: 22,
    fatG: 14,
    photo: 292,
    source: "photo",
    aiConfidence: 87,
  },
  {
    id: "ml-5",
    date: "2026-07-28",
    time: "08:05",
    mealType: "아침",
    name: "그릭요거트 오트밀",
    calories: 290,
    carbsG: 41,
    proteinG: 16,
    fatG: 6,
    photo: 999,
    source: "photo",
    aiConfidence: 92,
  },
  {
    id: "ml-6",
    date: "2026-07-27",
    time: "13:00",
    mealType: "점심",
    name: "닭가슴살 샐러드",
    calories: 380,
    carbsG: 20,
    proteinG: 34,
    fatG: 15,
    source: "search",
  },
];

export const challenges: Challenge[] = [
  {
    id: "ch-1",
    title: "아침 리듬 만들기",
    description: "기상 후 30분 안에 스트레칭하고 체크하는 30일 챌린지",
    icon: "Sun",
    daysTotal: 30,
    daysElapsed: 18,
    myCompletionRate: 72,
    myStreak: 4,
    todayDone: true,
    friends: [
      { id: "fr-1", name: "이지안", completionRate: 88, streak: 9, todayDone: true },
      { id: "fr-2", name: "박현우", completionRate: 76, streak: 2, todayDone: false },
      { id: "fr-3", name: "최서아", completionRate: 95, streak: 15, todayDone: true },
    ],
  },
  {
    id: "ch-2",
    title: "하루 물 8잔 마시기",
    description: "수분 섭취 알림에 맞춰 체크하는 21일 챌린지",
    icon: "Drop",
    daysTotal: 21,
    daysElapsed: 6,
    myCompletionRate: 58,
    myStreak: 1,
    todayDone: false,
    friends: [
      { id: "fr-1", name: "이지안", completionRate: 71, streak: 3, todayDone: true },
      { id: "fr-4", name: "한도윤", completionRate: 64, streak: 0, todayDone: false },
    ],
  },
];

export const weeklyReport: WeeklyReport = {
  weekLabel: "이번 주",
  rangeLabel: "7월 21일 - 7월 27일",
  avgSleepHours: 7.1,
  sleepDeltaPct: -8.2,
  avgSteps: 7240,
  stepsDeltaPct: 12.4,
  avgActivityMinutes: 38,
  activityDeltaPct: 5.1,
  dietScore: 82,
  dietDeltaPct: 3.0,
  sleepTrend: [
    { label: "월", value: 7.8 },
    { label: "화", value: 7.2 },
    { label: "수", value: 6.4 },
    { label: "목", value: 7.6 },
    { label: "금", value: 6.1 },
    { label: "토", value: 7.9 },
    { label: "일", value: 6.7 },
  ],
  stepsTrend: [
    { label: "월", value: 6200 },
    { label: "화", value: 8400 },
    { label: "수", value: 5100 },
    { label: "목", value: 9200 },
    { label: "금", value: 7600 },
    { label: "토", value: 9800 },
    { label: "일", value: 4400 },
  ],
  aiSummary:
    "이번 주는 지난주보다 걸음 수가 12% 늘었지만 수면 시간은 살짝 줄었어요. 금요일과 일요일에 유독 늦게 잠든 것으로 보여요. 다음 주는 취침 알림을 30분 당겨보는 건 어떨까요?",
};

const MOODS = ["😊", "🙂", "😴", "😌", "🥱", "😅"];

export const historyDays: HistoryDay[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const hasEntry = day <= 29 && (day % 7 !== 3 || day > 21);
  return {
    date: `2026-07-${String(day).padStart(2, "0")}`,
    day,
    moodEmoji: hasEntry ? MOODS[day % MOODS.length] : undefined,
    hasEntry,
    hasMeal: hasEntry && day % 4 !== 0,
    note: day === 27 ? "친구들과 등산, 뿌듯한 하루" : day === 15 ? "야근으로 늦게 잠든 날" : undefined,
  };
});

export const notifications: NudgeNotification[] = [
  {
    id: "nu-1",
    type: "ai",
    title: "오늘의 AI 제안",
    body: "어제보다 수면이 짧았어요. 오후엔 가벼운 산책으로 컨디션을 채워보세요.",
    at: "07:15",
    read: false,
  },
  {
    id: "nu-2",
    type: "hydration",
    title: "수분 섭취 알림",
    body: "물 마신 지 3시간이 지났어요. 한 잔 어떠세요?",
    at: "10:30",
    read: false,
  },
  {
    id: "nu-3",
    type: "exercise",
    title: "활동 리마인드",
    body: "오늘 활동 목표까지 11분 남았어요. 짧은 산책은 어때요?",
    at: "13:00",
    read: true,
  },
  {
    id: "nu-4",
    type: "challenge",
    title: "아침 리듬 만들기",
    body: "이지안 님이 오늘의 체크를 완료했어요. 서연 님도 화이팅!",
    at: "08:02",
    read: true,
  },
  {
    id: "nu-5",
    type: "sleep",
    title: "취침 준비 알림",
    body: "목표 수면 시간을 지키려면 지금부터 30분 안에 잠자리에 드는 게 좋아요.",
    at: "어제 23:00",
    read: true,
  },
  {
    id: "nu-6",
    type: "ai",
    title: "이번 주 리포트가 도착했어요",
    body: "지난주보다 걸음 수가 12% 늘었어요. 자세한 내용을 확인해 보세요.",
    at: "월요일 09:00",
    read: true,
  },
];
