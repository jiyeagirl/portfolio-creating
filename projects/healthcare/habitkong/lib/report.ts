/** 건강 리포트 화면이 쓰는 집계 데이터. 모두 mock이며 기준일은 2026-07-24. */

export type Range = "week" | "month";

export const scoreSeries: Record<Range, { label: string; score: number }[]> = {
  week: [
    { label: "월", score: 71 },
    { label: "화", score: 76 },
    { label: "수", score: 88 },
    { label: "목", score: 74 },
    { label: "금", score: 82 },
    { label: "토", score: 79 },
    { label: "일", score: 84 },
  ],
  month: [
    { label: "1주", score: 68 },
    { label: "2주", score: 74 },
    { label: "3주", score: 77 },
    { label: "4주", score: 81 },
  ],
};

export const scoreSummary: Record<Range, { average: number; delta: number; best: string }> = {
  week: { average: 79, delta: 4, best: "수요일 88점" },
  month: { average: 75, delta: 7, best: "4주차 81점" },
};

/** 수면, 운동, 식단 세 축의 변화. 한 화면에 세 계열을 겹치지 않고 나눠 그린다. */
export const habitSeries: Record<
  Range,
  { key: string; label: string; unit: string; goal: number; points: number[] }[]
> = {
  week: [
    { key: "sleep", label: "수면", unit: "시간", goal: 7.5, points: [6.1, 6.4, 7.8, 6.2, 6.8, 7.9, 7.4] },
    { key: "exercise", label: "운동", unit: "분", goal: 30, points: [12, 24, 41, 18, 26, 45, 33] },
    { key: "diet", label: "식단 점수", unit: "점", goal: 80, points: [72, 68, 84, 70, 78, 81, 86] },
  ],
  month: [
    { key: "sleep", label: "수면", unit: "시간", goal: 7.5, points: [6.2, 6.6, 6.9, 7.1] },
    { key: "exercise", label: "운동", unit: "분", goal: 30, points: [18, 22, 27, 31] },
    { key: "diet", label: "식단 점수", unit: "점", goal: 80, points: [69, 73, 76, 80] },
  ],
};

export const streakAnalysis = {
  current: 12,
  best: 21,
  monthRate: 87,
  missedDays: ["7월 3일", "7월 9일", "7월 12일"],
  pattern: "수요일과 목요일에 가장 자주 놓쳤어요. 이 요일만 알림을 1시간 앞당겨 볼까요?",
};

export const aiReport = {
  headline: "수면이 회복되면서 컨디션 점수가 4점 올랐어요",
  body:
    "이번 주 평균 수면은 6시간 56분으로 지난주보다 32분 늘었습니다. 수면이 7시간을 넘긴 날은 컨디션 점수가 평균 86점, 6시간대인 날은 74점이었어요. 반면 운동 시간은 주 3회에서 2회로 줄었습니다.",
  updatedAt: "오늘 오전 8:00 분석",
};

export const improvements = [
  {
    title: "취침 시각을 30분 앞당기기",
    detail: "이번 주 평균 취침이 새벽 1시 10분이에요. 12시 40분으로 옮기면 목표 수면에 닿습니다.",
    impact: "예상 점수 +5",
  },
  {
    title: "점심 이후 10분 걷기",
    detail: "오후 활동량이 적은 날 걸음 수가 평균 2,100보 낮았어요.",
    impact: "예상 점수 +3",
  },
  {
    title: "저녁 단백질 한 가지 추가",
    detail: "최근 5일 중 4일이 단백질 권장량에 미달했습니다.",
    impact: "식단 점수 +6",
  },
];

export const healthLevel = {
  level: 7,
  name: "꾸준한 새싹",
  exp: 640,
  nextExp: 800,
  nextName: "튼튼한 줄기",
  gainedThisWeek: 120,
};
