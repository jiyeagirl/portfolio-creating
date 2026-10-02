export const TODAY_LABEL = "7월 24일 금요일";

export type Mood = "great" | "good" | "tired";

export const condition = {
  score: 82,
  yesterdayScore: 76,
  mood: "good" as Mood,
  feedback: "어제보다 수면이 늘었어요. 오늘은 가볍게 15분만 걸어볼까요?",
};

export const MOOD_LABEL: Record<Mood, string> = {
  great: "컨디션 최고",
  good: "컨디션 좋음",
  tired: "컨디션 저조",
};

export const appleHealthSummary = {
  steps: 6420,
  stepGoal: 8000,
  sleepHours: 6.8,
  sleepGoal: 7.5,
  activeKcal: 312,
  activeKcalGoal: 400,
  heartRateAvg: 68,
  source: "Apple Health 연동",
  syncedAt: "10분 전 동기화",
};

/** 오늘 목표 진행률. 걸음, 수면, 활동, 물 네 가지를 같은 기준으로 본다. */
export const todayGoals = [
  { key: "steps", label: "걸음", current: 6420, target: 8000, unit: "보" },
  { key: "sleep", label: "수면", current: 6.8, target: 7.5, unit: "시간" },
  { key: "active", label: "활동", current: 312, target: 400, unit: "kcal" },
  { key: "water", label: "물", current: 5, target: 8, unit: "잔" },
];

export function goalAchievementRate() {
  const sum = todayGoals.reduce((acc, g) => acc + Math.min(1, g.current / g.target), 0);
  return Math.round((sum / todayGoals.length) * 100);
}

export const weatherTip = {
  location: "서울 성동구",
  summary: "흐리고 습함",
  tempC: 29,
  humidity: 78,
  tip: "습도가 높은 날이에요. 야외 러닝보다 실내 스트레칭 10분이 몸에 덜 부담돼요.",
};

export const sleepDetail = {
  bedTime: "01:10",
  wakeTime: "07:55",
  deepHours: 1.4,
  remHours: 1.1,
  awakeMinutes: 22,
};
