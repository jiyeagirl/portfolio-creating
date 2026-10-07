export const TODAY = "2026-10-07";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

export function weekdayIndex(iso: string): number {
  return parseDate(iso).getDay();
}

export function weekdayLabel(iso: string): string {
  return WEEKDAYS[weekdayIndex(iso)];
}

export function isWeekend(iso: string): boolean {
  const w = weekdayIndex(iso);
  return w === 0 || w === 6;
}

export function dayNumber(iso: string): number {
  return parseDate(iso).getDate();
}

/* 10월 11일 (토) */
export function formatLongDate(iso: string): string {
  const date = parseDate(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdayLabel(iso)})`;
}

export function formatWon(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatFee(value: number): string {
  return `${formatWon(value)}원`;
}

export function maskPassword(password: string): string {
  return "•".repeat(Math.max(password.length, 8));
}
