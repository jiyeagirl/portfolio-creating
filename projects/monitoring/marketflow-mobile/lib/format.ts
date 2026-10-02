/* 날짜 포맷 유틸. "현재" 기준 시각은 mock-data.ts의 TODAY(2025-09-18)와 같은 날 저녁으로 고정해
   알림 센터의 "n시간 전" 표기가 항상 같은 스크린샷 결과를 내도록 한다. */
const NOW = new Date("2025-09-18T19:30:00+09:00").getTime();

export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatDateDot(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${formatDateDot(iso)} ${h}:${m}`;
}

export function daysAgo(iso: string): number {
  return Math.floor((NOW - new Date(iso).getTime()) / 86400000);
}

export function formatRelative(iso: string): string {
  const diffMs = NOW - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return formatDateShort(iso);
}
