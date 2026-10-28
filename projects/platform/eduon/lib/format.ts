import type { Course } from "@/projects/platform/eduon/lib/types";

export const won = (n: number) => n.toLocaleString("ko-KR");

/** 754 → "12:34", 3725 → "1:02:05" */
export function clock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export function courseSeconds(course: Course) {
  return course.episodes.reduce((sum, e) => sum + e.seconds, 0);
}

/** 강좌 전체 길이 "1시간 21분" */
export function courseLength(course: Course) {
  const minutes = Math.round(courseSeconds(course) / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

export function pct(n: number) {
  return `${Math.round(n)}%`;
}
