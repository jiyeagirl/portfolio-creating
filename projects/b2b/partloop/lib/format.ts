import { TODAY } from "@/projects/b2b/partloop/lib/mock-data";
import type { Order, OrderItem } from "@/projects/b2b/partloop/lib/types";

export function formatWon(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function itemAmount(item: OrderItem): number {
  return item.qty * item.unitPrice;
}

export function orderSupply(order: Pick<Order, "items">): number {
  return order.items.reduce((sum, item) => sum + itemAmount(item), 0);
}

/* 부가세는 공급가액의 10%, 원 단위 미만은 버린다. */
export function vatOf(supply: number): number {
  return Math.floor(supply * 0.1);
}

export function orderTotal(order: Pick<Order, "items">): number {
  const supply = orderSupply(order);
  return supply + vatOf(supply);
}

/* "골판지 박스 대 외 1건" 형태의 목록용 요약. */
export function itemsSummary(order: Pick<Order, "items">): string {
  const [first, ...rest] = order.items;
  if (!first) return "품목 없음";
  return rest.length === 0 ? first.name : `${first.name} 외 ${rest.length}건`;
}

/* "2026-10-14 15:08"을 다른 날짜 표기와 같은 "2026.10.14 15:08"로 맞춘다. */
export function formatStamp(stamp: string): string {
  const [date, time] = stamp.split(" ");
  return `${date.replaceAll("-", ".")} ${time}`;
}

/* 납기일이 오늘보다 며칠 지났는지. 지연 건의 표시에 쓴다. */
export function daysLate(dueDate: string): number {
  return Math.round((Date.parse(TODAY) - Date.parse(dueDate)) / 86_400_000);
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}
