export const TODAY = new Date(2026, 6, 24); // 2026-07-24, Fri

export type Difficulty = "easy" | "normal" | "hard";

export const habit = {
  name: "아침 물 한 잔 마시기",
  description: "기상 직후 상온의 물 한 잔으로 몸을 깨우는, 가장 부담 없는 시작이에요.",
  durationMinutes: 1,
  streak: 12,
  bestStreak: 21,
  startedAt: "2026.06.10",
  difficulty: "easy" as Difficulty,
  reason: "최근 5일 중 4일은 기상 후 2시간 동안 물을 마시지 않았어요.",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "가볍게",
  normal: "보통",
  hard: "도전",
};

/** 난이도를 바꾸면 같은 습관을 강도만 달리해 제안한다. */
export const DIFFICULTY_VARIANT: Record<
  Difficulty,
  { name: string; description: string; durationMinutes: number }
> = {
  easy: {
    name: "아침 물 한 잔 마시기",
    description: "기상 직후 상온의 물 한 잔으로 몸을 깨우는, 가장 부담 없는 시작이에요.",
    durationMinutes: 1,
  },
  normal: {
    name: "아침 물 한 잔 + 창문 열고 3분 서 있기",
    description: "물을 마신 뒤 바깥 공기를 3분 쐬면 기상 후 졸음이 확실히 줄어요.",
    durationMinutes: 4,
  },
  hard: {
    name: "아침 물 한 잔 + 10분 스트레칭",
    description: "물 한 잔 뒤 목, 어깨, 종아리 순서로 10분. 앉아 있는 시간이 긴 날에 특히 효과가 있어요.",
    durationMinutes: 11,
  },
};

/** 루틴 교체 후보. 사용자가 고르면 오늘 루틴이 바뀐다. */
export const ROUTINE_ALTERNATIVES = [
  {
    id: "walk",
    name: "점심 후 10분 걷기",
    description: "식후 혈당이 완만해지고 오후 졸음이 줄어요.",
    durationMinutes: 10,
    tag: "활동",
  },
  {
    id: "stretch",
    name: "자기 전 목 스트레칭",
    description: "하루 종일 앉아 있던 목과 어깨를 풀고 잠들면 수면의 질이 올라가요.",
    durationMinutes: 5,
    tag: "수면",
  },
  {
    id: "protein",
    name: "저녁에 단백질 한 가지 추가",
    description: "최근 단백질 섭취가 권장량보다 적었어요.",
    durationMinutes: 0,
    tag: "식단",
  },
];

export const tomorrowRoutine = {
  name: "점심 후 10분 걷기",
  reason: "내일은 오후 일정이 비어 있어요. 걷기 루틴을 넣기 좋은 날입니다.",
  durationMinutes: 10,
};

const MISSED_DATES = new Set(["2026-07-03", "2026-07-09", "2026-07-12"]);

// Local calendar-day key. `toISOString()` converts to UTC first, which
// silently shifts to the previous day for any timezone ahead of UTC
// (e.g. KST) — use local Y/M/D components instead.
export function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isFuture(date: Date) {
  return date.getTime() > TODAY.getTime();
}

export type DayStatus = "done" | "missed" | "pending";

export function statusFor(date: Date): DayStatus {
  if (isFuture(date)) return "pending";
  return MISSED_DATES.has(toKey(date)) ? "missed" : "done";
}

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export type WeekDay = {
  label: string;
  date: Date;
  status: DayStatus;
  isToday: boolean;
};

export function getWeekLog(): WeekDay[] {
  const monday = new Date(TODAY);
  const mondayOffset = (TODAY.getDay() + 6) % 7;
  monday.setDate(TODAY.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      label: WEEKDAY_LABELS[i],
      date,
      status: statusFor(date),
      isToday: toKey(date) === toKey(TODAY),
    };
  });
}

export type MonthDay = {
  day: number;
  date: Date;
  status: DayStatus;
  isToday: boolean;
};

export function getMonthLog(): { leadingBlanks: number; days: MonthDay[] } {
  const year = TODAY.getFullYear();
  const month = TODAY.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon = 0

  const days: MonthDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      day: i + 1,
      date,
      status: statusFor(date),
      isToday: toKey(date) === toKey(TODAY),
    };
  });

  return { leadingBlanks: firstWeekday, days };
}

export function monthCompletionRate(): number {
  const { days } = getMonthLog();
  const elapsed = days.filter((d) => d.status !== "pending");
  const done = elapsed.filter((d) => d.status === "done");
  return Math.round((done.length / elapsed.length) * 100);
}

export function weekCompletionRate(): number {
  const week = getWeekLog();
  const elapsed = week.filter((d) => d.status !== "pending");
  const done = elapsed.filter((d) => d.status === "done");
  return Math.round((done.length / elapsed.length) * 100);
}
