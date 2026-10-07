/* 면적, 체적, 길이, 높이는 소수점 1자리와 천 단위 구분 */
export function fmt(value: number): string {
  return value.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function fmtSize(mb: number): string {
  return `${mb.toFixed(1)} MB`;
}

export const TODAY = "2026-10-07";
export const NOW_LABEL = "2026-10-07 10:12";

export function receiptNo(seq: number): string {
  return `DQ-20261007-${String(seq).padStart(3, "0")}`;
}
