export const TODAY_LABEL = "7월 24일 금요일";

export type Mood = "great" | "good" | "tired";

export const condition = {
  score: 82,
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
  heartRateAvg: 68,
  source: "Apple Health 연동",
};
