import type { Size, Tone } from "@/projects/platform/dressday/lib/types";

// 기준 시각: 2026-09-18 (금) 16:48. 관리자 콘솔(lib/admin-data.ts)과 같은 날, 같은 예약을 본다.

export const ME = {
  name: "권나율",
  phone: "010-4821-7730",
  email: "nayul.kwon@mailbox.kr",
  since: "2025년 11월",
  rentals: 5,
  coupon: { name: "첫 가을 대여 3,000원 할인", amount: 3000, until: "9월 30일" },
};

export const ADDRESSES = [
  { id: "home", label: "집", line: "서울 성동구 성수이로 118", detail: "3층 302호, 공동현관 1847#", primary: true },
  { id: "office", label: "회사", line: "서울 마포구 양화로 45", detail: "8층 안내데스크", primary: false },
];

/** 당일 배송 가능 지역. 마감 = 그날 받으려면 주문해야 하는 시각 */
export const REGIONS: { gu: string; cutoff: string; window: string; note?: string }[] = [
  { gu: "성동구", cutoff: "18:00", window: "16:00~21:00" },
  { gu: "광진구", cutoff: "18:00", window: "16:00~21:00" },
  { gu: "마포구", cutoff: "18:00", window: "16:30~21:30" },
  { gu: "용산구", cutoff: "18:00", window: "16:30~21:30" },
  { gu: "강남구", cutoff: "18:00", window: "16:00~21:00" },
  { gu: "서초구", cutoff: "18:00", window: "16:00~21:00" },
  { gu: "송파구", cutoff: "17:00", window: "17:00~21:30", note: "잠실동, 신천동" },
  { gu: "영등포구", cutoff: "17:00", window: "17:00~21:30", note: "여의도동, 당산동" },
];

/** 오늘 수령 시간대. 16:48 기준, 준비에 1시간이 걸려 18:00 전 시간대는 마감 */
export const DELIVERY_SLOTS = [
  { time: "17:00~17:30", left: 0 },
  { time: "17:30~18:00", left: 0 },
  { time: "18:00~18:30", left: 2 },
  { time: "18:30~19:00", left: 4 },
  { time: "19:00~19:30", left: 3 },
  { time: "19:30~20:00", left: 6 },
  { time: "20:00~20:30", left: 5 },
  { time: "20:30~21:00", left: 1 },
];

export const RETURN_SLOTS = [
  { time: "19:00~20:00", left: 2 },
  { time: "20:00~21:00", left: 5 },
  { time: "21:00~22:00", left: 3 },
];

/** 레이스 헴 미니 원피스 실측 (cm) */
export const MEASURES: { size: Size; length: number; chest: number; waist: number; hem: number }[] = [
  { size: "XS", length: 82.5, chest: 41, waist: 33.5, hem: 52 },
  { size: "S", length: 84, chest: 43, waist: 35.5, hem: 54 },
  { size: "M", length: 85.5, chest: 45, waist: 37.5, hem: 56 },
  { size: "L", length: 87, chest: 47.5, waist: 40, hem: 58.5 },
];

/** 9월 대여 가능 일정 (레이스 헴 미니 원피스, S). 18일이 오늘 */
export const SEPT_AVAILABILITY: Record<number, "open" | "few" | "full"> = {
  18: "few", 19: "open", 20: "full", 21: "full", 22: "open", 23: "open", 24: "few", 25: "open",
  26: "full", 27: "full", 28: "open", 29: "open", 30: "open",
};

export type Step = { key: string; label: string; at?: string; tone: Tone };

/** 진행 중인 예약. 관리자 콘솔 DD-0918-2471과 같다 */
export const LIVE = {
  code: "DD-0918-2471",
  productId: "lace-mini",
  size: "S" as Size,
  receive: { date: "9월 18일 (금)", window: "17:00~17:30" },
  giveBack: { date: "9월 19일 (토)", window: "20:00~21:00" },
  address: ADDRESSES[0],
  rider: { name: "탁민호", vehicle: "전기 스쿠터", phone: "050-7120-4418", done: 1284 },
  eta: "17:04~17:14",
  steps: [
    { key: "paid", label: "예약 확정", at: "12:37", tone: "done" },
    { key: "packed", label: "검수, 포장 완료", at: "15:52", tone: "done" },
    { key: "assigned", label: "라이더 배정", at: "16:09", tone: "done" },
    { key: "pickup", label: "라이더 픽업", at: "16:31", tone: "done" },
    { key: "moving", label: "배송 중", tone: "live" },
    { key: "arrived", label: "도착, 수령", tone: "wait" },
    { key: "return", label: "회수 예정", tone: "wait" },
  ] as Step[],
  pay: { rent: 28900, delivery: 3500, deposit: 50000, discount: 3000, method: "신용카드 (A카드 5**1)" },
};

/** 오늘 반납할 대여. 관리자 콘솔 DD-0916-1983과 같다 */
export const RETURNING = {
  code: "DD-0916-1983",
  productId: "wool-blazer",
  size: "L" as Size,
  period: "9월 16일 (수) ~ 9월 18일 (금)",
  endsAt: "오늘 22:00까지 회수",
  requestedWindow: "20:00~21:00",
  steps: [
    { key: "request", label: "회수 요청", at: "11:24", tone: "done" },
    { key: "assign", label: "라이더 배정", tone: "live" },
    { key: "pickup", label: "회수", tone: "wait" },
    { key: "inspect", label: "검수", tone: "wait" },
    { key: "refund", label: "보증금 환불", tone: "wait" },
  ] as Step[],
  deposit: 80000,
};

export const HISTORY: {
  code: string;
  productId: string;
  size: Size;
  period: string;
  total: number;
  status: string;
  tone: Tone;
}[] = [
  { code: "DD-0918-2471", productId: "lace-mini", size: "S", period: "9월 18일 ~ 9월 19일", total: 79400, status: "배송 중", tone: "live" },
  { code: "DD-0916-1983", productId: "wool-blazer", size: "L", period: "9월 16일 ~ 9월 18일", total: 145900, status: "회수 요청", tone: "wait" },
  { code: "DD-0831-0746", productId: "wrap-midi", size: "M", period: "8월 31일 ~ 9월 1일", total: 95900, status: "반납 완료", tone: "done" },
  { code: "DD-0809-0312", productId: "summer-knit", size: "M", period: "8월 9일 ~ 8월 11일", total: 67100, status: "반납 완료", tone: "done" },
  { code: "DD-0722-1150", productId: "tweed-setup", size: "S", period: "7월 22일 ~ 7월 23일", total: 170200, status: "반납 완료", tone: "done" },
];

export const CANCELLED = [
  { code: "DD-0904-0529", productId: "sequin-dress", size: "S" as Size, when: "9월 4일 취소", reason: "일정 변경", refund: 206400, tone: "stop" as Tone },
];

export const PAY_METHODS = [
  { id: "card", label: "신용, 체크카드", sub: "A카드 5**1 저장됨" },
  { id: "easy", label: "간편결제", sub: "A페이, B페이" },
  { id: "bank", label: "계좌이체", sub: "실시간 이체" },
];

export const NOTIFY = [
  { key: "delivery", label: "배송, 회수 알림", sub: "라이더 배정, 도착 10분 전, 회수 완료", on: true },
  { key: "return", label: "반납 일정 알림", sub: "회수 전날 20:00, 당일 2시간 전", on: true },
  { key: "restock", label: "저장한 옷 대여 가능 알림", sub: "저장 3벌", on: true },
  { key: "marketing", label: "혜택, 이벤트 소식", sub: "문자, 이메일", on: false },
];
