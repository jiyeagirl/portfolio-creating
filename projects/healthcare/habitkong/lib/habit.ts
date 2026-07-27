export const TODAY = new Date(2026, 6, 24); // 2026-07-24, Fri

export const habit = {
  name: "아침 물 한 잔 마시기",
  streak: 12,
  bestStreak: 21,
  startedAt: "2026.06.10",
};

const MISSED_DATES = new Set(["2026-07-03", "2026-07-09", "2026-07-12"]);

function toKey(date: Date) {
  return date.toISOString().slice(0, 10);
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
