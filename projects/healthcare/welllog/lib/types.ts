export type RingKind = "sleep" | "steps" | "activity";

export interface RhythmEntry {
  date: string;
  sleepHours: number;
  sleepGoalHours: number;
  sleepScore: number;
  steps: number;
  stepsGoal: number;
  activityMinutes: number;
  activityGoalMinutes: number;
  moodEmoji: string;
  moodNote?: string;
  habitsChecked: string[];
  habitsTotal: string[];
  aiSuggestion: string;
}

export type MealType = "아침" | "점심" | "저녁" | "간식";

export interface MealEntry {
  id: string;
  date: string;
  time: string;
  mealType: MealType;
  name: string;
  calories: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  photo?: number;
  source: "photo" | "search";
  aiConfidence?: number;
}

export interface ChallengeFriend {
  id: string;
  name: string;
  completionRate: number;
  streak: number;
  todayDone: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  daysTotal: number;
  daysElapsed: number;
  myCompletionRate: number;
  myStreak: number;
  todayDone: boolean;
  friends: ChallengeFriend[];
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface WeeklyReport {
  weekLabel: string;
  rangeLabel: string;
  avgSleepHours: number;
  sleepDeltaPct: number;
  avgSteps: number;
  stepsDeltaPct: number;
  avgActivityMinutes: number;
  activityDeltaPct: number;
  dietScore: number;
  dietDeltaPct: number;
  sleepTrend: TrendPoint[];
  stepsTrend: TrendPoint[];
  aiSummary: string;
}

export interface HistoryDay {
  date: string;
  day: number;
  moodEmoji?: string;
  hasEntry: boolean;
  hasMeal: boolean;
  note?: string;
}

export type NudgeType = "ai" | "exercise" | "hydration" | "challenge" | "sleep";

export interface NudgeNotification {
  id: string;
  type: NudgeType;
  title: string;
  body: string;
  at: string;
  read: boolean;
}

export interface HealthConnection {
  platform: "Apple Health" | "Google Fit";
  connected: boolean;
  lastSyncAt?: string;
}

export interface UserProfile {
  name: string;
  nickname: string;
  goal: string;
  joinedAt: string;
  height: number;
  weight: number;
}
