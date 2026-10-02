/** 목표 관리 화면 mock. 주간과 월간 목표를 같은 구조로 관리한다. */

export type GoalPeriod = "week" | "month";

export type Goal = {
  id: string;
  label: string;
  unit: string;
  current: number;
  target: number;
  options: number[];
  note: string;
};

export const GOALS: Record<GoalPeriod, Goal[]> = {
  week: [
    {
      id: "steps",
      label: "걸음 수",
      unit: "보",
      current: 42600,
      target: 56000,
      options: [42000, 49000, 56000, 63000],
      note: "하루 평균 8,000보 기준",
    },
    {
      id: "sleep",
      label: "수면 시간",
      unit: "시간",
      current: 48.7,
      target: 52.5,
      options: [45.5, 49, 52.5, 56],
      note: "하루 평균 7시간 30분 기준",
    },
    {
      id: "exercise",
      label: "운동 시간",
      unit: "분",
      current: 199,
      target: 210,
      options: [150, 180, 210, 240],
      note: "주 5회 30분 기준",
    },
    {
      id: "weight",
      label: "체중",
      unit: "kg",
      current: 63.4,
      target: 62.5,
      options: [63.5, 63, 62.5, 62],
      note: "주당 0.3kg 감량 속도",
    },
  ],
  month: [
    {
      id: "steps",
      label: "걸음 수",
      unit: "보",
      current: 168400,
      target: 240000,
      options: [180000, 210000, 240000, 270000],
      note: "하루 평균 8,000보 기준",
    },
    {
      id: "sleep",
      label: "수면 시간",
      unit: "시간",
      current: 194.2,
      target: 225,
      options: [195, 210, 225, 240],
      note: "하루 평균 7시간 30분 기준",
    },
    {
      id: "exercise",
      label: "운동 시간",
      unit: "분",
      current: 742,
      target: 900,
      options: [600, 750, 900, 1050],
      note: "주 5회 30분 기준",
    },
    {
      id: "weight",
      label: "체중",
      unit: "kg",
      current: 63.4,
      target: 61.5,
      options: [63, 62.5, 61.5, 61],
      note: "월 2kg 이내 권장",
    },
  ],
};

export const BADGES = [
  { id: "b1", label: "2주 연속 루틴", detail: "7월 10일 획득", earned: true },
  { id: "b2", label: "수면 7시간 5일", detail: "7월 21일 획득", earned: true },
  { id: "b3", label: "월간 걸음 20만보", detail: "7월 18일 획득", earned: true },
  { id: "b4", label: "식단 기록 30일", detail: "24일 남음", earned: false },
  { id: "b5", label: "30일 연속 루틴", detail: "18일 남음", earned: false },
  { id: "b6", label: "체중 목표 달성", detail: "0.9kg 남음", earned: false },
];

export const aiGoalSuggestion = {
  title: "걸음 수 목표를 주 49,000보로 낮춰 볼까요",
  detail:
    "최근 3주 달성률이 76%로 떨어졌어요. 목표를 한 단계 낮추면 달성 경험이 이어지고, 2주 뒤 다시 올릴 수 있습니다.",
  from: "56,000보",
  to: "49,000보",
};
