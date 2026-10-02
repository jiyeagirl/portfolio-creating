import type { Product, Size, Tone } from "@/projects/platform/dressday/lib/types";
import { PRODUCTS, getProduct } from "@/projects/platform/dressday/lib/catalog";

/*
 * 관리자 콘솔 mock 데이터. 기준 시각 2026-09-18 (금) 16:48.
 * 고객 사이트(lib/site-data.ts)와 같은 예약을 본다: DD-0918-2471(배송 중), DD-0916-1983(회수 요청, 미배차).
 * 건수, 합계는 전부 아래 배열에서 계산한다. 화면에 숫자를 따로 적지 않는다.
 */

export const NOW = { date: "09-18", time: "16:48", minutes: 16 * 60 + 48, label: "9월 18일 (금) 16:48" };
export const OPERATOR = { name: "심하람", team: "운영팀", initial: "심" };
export const CENTER = "성수 센터";

export const SERVICE_AREAS: { gu: string; cutoff: string }[] = [
  { gu: "성동구", cutoff: "18:00" },
  { gu: "광진구", cutoff: "18:00" },
  { gu: "마포구", cutoff: "18:00" },
  { gu: "용산구", cutoff: "18:00" },
  { gu: "강남구", cutoff: "18:00" },
  { gu: "서초구", cutoff: "18:00" },
  { gu: "송파구", cutoff: "17:00" },
  { gu: "영등포구", cutoff: "17:00" },
];

/* ── 날짜 ── */

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

/** "09-18" → "9/18 (금)" */
export function day(md: string) {
  const [m, d] = md.split("-").map(Number);
  const w = new Date(2026, m - 1, d).getDay();
  return `${m}/${d} (${WEEK[w]})`;
}

/** "09-18" → "9/18" */
export function short(md: string) {
  const [m, d] = md.split("-").map(Number);
  return `${m}/${d}`;
}

function diffDays(a: string, b: string) {
  const [am, ad] = a.split("-").map(Number);
  const [bm, bd] = b.split("-").map(Number);
  const ms = new Date(2026, bm - 1, bd).getTime() - new Date(2026, am - 1, ad).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

function addDays(md: string, n: number) {
  const [m, d] = md.split("-").map(Number);
  const dt = new Date(2026, m - 1, d + n);
  return `${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

/* ── 라이더 ── */

export interface Rider {
  id: string;
  name: string;
  phone: string;
  zones: string[];
  vehicle: "전기 스쿠터" | "오토바이";
  shift: string;
  off: boolean;
  /** 누적 완료 (건) */
  lifetime: number;
  /** 9/12 ~ 9/17 일별 완료 (건) */
  week: number[];
  /** 이번 달 지연 (건) */
  monthDelays: number;
}

export const WEEK_DAYS = ["09-12", "09-13", "09-14", "09-15", "09-16", "09-17"];

export const RIDERS: Rider[] = [
  { id: "r1", name: "탁민호", phone: "010-5520-3187", zones: ["성동구", "광진구"], vehicle: "전기 스쿠터", shift: "15:00~22:00", off: false, lifetime: 1284, week: [7, 8, 0, 6, 7, 9], monthDelays: 2 },
  { id: "r2", name: "염재윤", phone: "010-7731-4402", zones: ["마포구", "용산구"], vehicle: "오토바이", shift: "13:00~22:00", off: false, lifetime: 2071, week: [9, 11, 8, 0, 8, 10], monthDelays: 3 },
  { id: "r3", name: "우태경", phone: "010-2284-6613", zones: ["강남구", "서초구"], vehicle: "오토바이", shift: "10:00~19:00", off: false, lifetime: 1736, week: [10, 12, 9, 8, 0, 11], monthDelays: 4 },
  { id: "r4", name: "채도겸", phone: "010-9148-2075", zones: ["송파구", "강남구"], vehicle: "전기 스쿠터", shift: "11:00~20:00", off: false, lifetime: 948, week: [8, 9, 7, 9, 8, 0], monthDelays: 2 },
  { id: "r5", name: "국승현", phone: "010-4476-9320", zones: ["영등포구", "마포구"], vehicle: "오토바이", shift: "10:00~19:00", off: false, lifetime: 1159, week: [0, 7, 8, 6, 9, 7], monthDelays: 5 },
  { id: "r6", name: "반지오", phone: "010-3065-7718", zones: ["광진구", "성동구"], vehicle: "전기 스쿠터", shift: "10:00~19:00", off: false, lifetime: 612, week: [6, 0, 7, 7, 6, 8], monthDelays: 3 },
  { id: "r7", name: "목현서", phone: "010-8813-5046", zones: ["서초구", "용산구"], vehicle: "오토바이", shift: "13:00~22:00", off: false, lifetime: 1493, week: [9, 10, 0, 8, 9, 8], monthDelays: 1 },
  { id: "r8", name: "설은호", phone: "010-6392-0851", zones: ["영등포구", "용산구"], vehicle: "전기 스쿠터", shift: "휴무", off: true, lifetime: 427, week: [7, 8, 6, 0, 7, 6], monthDelays: 1 },
];

export function getRider(id: string | null | undefined) {
  return RIDERS.find((r) => r.id === id);
}

/* ── 예약 ── */

export type ResStatus = "예약 확정" | "배송 중" | "이용 중" | "회수 요청" | "회수 중" | "반납 완료" | "취소";
export const RES_STATUSES: ResStatus[] = ["예약 확정", "배송 중", "이용 중", "회수 요청", "회수 중", "반납 완료", "취소"];
export const RES_TONE: Record<ResStatus, Tone> = {
  "예약 확정": "wait",
  "배송 중": "live",
  "이용 중": "live",
  "회수 요청": "wait",
  "회수 중": "live",
  "반납 완료": "done",
  취소: "stop",
};

export type JobState = "배차 대기" | "배정" | "이동 중" | "완료" | "지연";
export const JOB_TONE: Record<JobState, Tone> = {
  "배차 대기": "act",
  배정: "wait",
  "이동 중": "live",
  완료: "done",
  지연: "stop",
};

export interface Leg {
  date: string;
  window: string;
  jobId: string;
  riderId: string | null;
  state: JobState;
  assignedAt?: string;
  departedAt?: string;
  doneAt?: string;
  issue?: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  productId: string;
  size: Size;
  unit: string;
  status: ResStatus;
  createdDate: string;
  createdTime: string;
  start: string;
  end: string;
  days: number;
  gu: string;
  address: string;
  delivery: Leg;
  pickup: Leg;
  rent: number;
  ship: number;
  deposit: number;
  coupon: number;
  total: number;
  method: string;
  packedAt?: string;
  returnRequestedAt?: string;
  cancelReason?: string;
}

type LegTuple = [window: string, jobId: string, riderId: string, state: JobState, extra?: Partial<Leg>];
type ResTuple = [
  id: string,
  customerId: string,
  productId: string,
  size: Size,
  status: ResStatus,
  created: string,
  start: string,
  end: string,
  gu: string,
  address: string,
  delivery: LegTuple,
  pickup: LegTuple,
  coupon: number,
  method: string,
  extra?: { unit?: string; packedAt?: string; returnRequestedAt?: string; cancelReason?: string },
];

const SHIP = 3500;

/* 오늘(09-18) 당일 주문은 구별 시작 시각(16:00~17:00) 이후 시간대만 받는다. 낮 시간대는 전날까지 들어온 예약이다. */
const RES_RAW: ResTuple[] = [
  // 오늘 배송
  ["DD-0918-2471", "c1", "lace-mini", "S", "배송 중", "09-18 12:37", "09-18", "09-19", "성동구", "성수이로 118, 3층 302호", ["17:00~17:30", "J-1709", "r1", "이동 중", { assignedAt: "16:09", departedAt: "16:31" }], ["20:00~21:00", "J-1788", "", "배차 대기"], 3000, "A카드 5**1", { unit: "WD-0231-03", packedAt: "15:52" }],
  ["DD-0917-2291", "c3", "tweed-setup", "S", "이용 중", "09-17 21:14", "09-18", "09-19", "강남구", "테헤란로 427, 8층", ["10:00~10:30", "J-1688", "r3", "완료", { assignedAt: "09:12", departedAt: "09:41", doneAt: "10:21" }], ["19:00~20:00", "J-1790", "", "배차 대기"], 5000, "B카드 2**4"],
  ["DD-0917-2366", "c9", "wrap-midi", "M", "이용 중", "09-17 18:52", "09-18", "09-20", "성동구", "왕십리로 83-21, 1104호", ["11:00~11:30", "J-1693", "r6", "완료", { assignedAt: "10:07", departedAt: "10:49", doneAt: "11:18" }], ["19:00~20:00", "J-1812", "", "배차 대기"], 0, "A페이"],
  ["DD-0916-2012", "c6", "ribbon-blouse", "S", "이용 중", "09-16 20:33", "09-18", "09-19", "서초구", "서초대로77길 54, 203동 1502호", ["13:00~13:30", "J-1698", "r7", "완료", { assignedAt: "12:18", departedAt: "12:52", doneAt: "13:24" }], ["19:00~20:00", "J-1792", "", "배차 대기"], 0, "B페이"],
  ["DD-0917-2317", "c12", "wool-blazer", "S", "이용 중", "09-17 16:05", "09-18", "09-19", "서초구", "반포대로 58, 11층", ["14:00~14:30", "J-1700", "r7", "완료", { assignedAt: "13:31", departedAt: "13:48", doneAt: "14:17" }], ["19:00~20:00", "J-1802", "", "배차 대기"], 0, "C카드 7**3"],
  ["DD-0917-2349", "c13", "wrap-midi", "S", "이용 중", "09-17 17:48", "09-18", "09-20", "송파구", "송파대로 570, 1403호", ["15:00~15:30", "J-1702", "r4", "완료", { assignedAt: "14:22", departedAt: "14:51", doneAt: "15:26" }], ["18:00~19:00", "J-1819", "", "배차 대기"], 0, "B페이"],
  ["DD-0917-2402", "c10", "flower-maxi", "M", "배송 중", "09-17 19:26", "09-18", "09-20", "마포구", "월드컵북로 396, 804호", ["15:30~16:00", "J-1704", "r5", "지연", { assignedAt: "14:40", departedAt: "15:12", issue: "신촌로 정체, 도착 예정 16:58" }], ["20:00~21:00", "J-1817", "", "배차 대기"], 0, "A카드 8**2"],
  ["DD-0918-2461", "c16", "fringe-shawl", "M", "배송 중", "09-18 09:31", "09-18", "09-19", "광진구", "능동로 209, 102호", ["16:00~16:30", "J-1706", "r6", "지연", { assignedAt: "15:08", departedAt: "15:41", issue: "고객 부재, 연락 2회 시도" }], ["18:00~19:00", "J-1800", "", "배차 대기"], 0, "B카드 6**0"],
  ["DD-0918-2475", "c2", "satin-slip", "M", "배송 중", "09-18 12:51", "09-18", "09-19", "마포구", "양화로 45, 8층 안내데스크", ["17:30~18:00", "J-1711", "r2", "이동 중", { assignedAt: "16:15", departedAt: "16:44" }], ["20:00~21:00", "J-1794", "", "배차 대기"], 0, "A카드 1**9"],
  ["DD-0918-2480", "c11", "tailored-suit", "M", "예약 확정", "09-18 13:15", "09-18", "09-20", "강남구", "선릉로 551, 1207호", ["18:00~18:30", "J-1712", "", "배차 대기"], ["20:00~21:00", "J-1815", "", "배차 대기"], 0, "C카드 3**5", { packedAt: "16:22" }],
  ["DD-0918-2483", "c5", "pleats-skirt", "S", "예약 확정", "09-18 13:26", "09-18", "09-19", "송파구", "올림픽로 300, 3204호", ["18:30~19:00", "J-1714", "r4", "배정", { assignedAt: "16:27" }], ["19:00~20:00", "J-1796", "", "배차 대기"], 3000, "B페이", { packedAt: "16:05" }],
  ["DD-0918-2486", "c7", "wide-slacks", "M", "예약 확정", "09-18 13:39", "09-18", "09-21", "영등포구", "여의대로 108, 2층", ["19:00~19:30", "J-1716", "", "배차 대기"], ["20:00~21:00", "J-1841", "", "배차 대기"], 0, "A카드 4**6"],
  ["DD-0918-2490", "c14", "summer-knit", "M", "예약 확정", "09-18 14:06", "09-18", "09-19", "용산구", "한강대로23길 55, 1709호", ["19:30~20:00", "J-1719", "", "배차 대기"], ["19:00~20:00", "J-1798", "", "배차 대기"], 0, "A페이"],
  ["DD-0918-2493", "c4", "ribbon-blouse", "M", "예약 확정", "09-18 14:31", "09-18", "09-19", "용산구", "이태원로 177, 3층", ["20:00~20:30", "J-1721", "r2", "배정", { assignedAt: "16:40" }], ["20:00~21:00", "J-1804", "", "배차 대기"], 0, "B카드 9**1"],

  // 오늘 회수
  ["DD-0916-1983", "c1", "wool-blazer", "L", "회수 요청", "09-16 10:44", "09-16", "09-18", "성동구", "성수이로 118, 3층 302호", ["18:00~18:30", "J-1541", "r1", "완료", { doneAt: "18:12" }], ["20:00~21:00", "J-1724", "", "배차 대기"], 0, "A카드 5**1", { returnRequestedAt: "11:24" }],
  ["DD-0915-1920", "c8", "sequin-dress", "S", "반납 완료", "09-15 11:26", "09-16", "09-18", "광진구", "아차산로 272, 1502호", ["17:00~17:30", "J-1536", "r6", "완료", { doneAt: "17:19" }], ["10:00~11:00", "J-1690", "r6", "완료", { departedAt: "10:02", doneAt: "10:37" }], 0, "B카드 2**7"],
  ["DD-0916-1977", "c13", "pleats-skirt", "S", "반납 완료", "09-16 10:15", "09-16", "09-18", "송파구", "송파대로 570, 1403호", ["16:00~16:30", "J-1560", "r4", "완료", { doneAt: "16:21" }], ["10:00~11:00", "J-1689", "r4", "완료", { departedAt: "10:18", doneAt: "10:52" }], 0, "B페이"],
  ["DD-0916-1971", "c3", "satin-slip", "S", "반납 완료", "09-16 09:52", "09-16", "09-18", "강남구", "테헤란로 427, 8층", ["15:00~15:30", "J-1558", "r3", "완료", { doneAt: "15:17" }], ["11:00~12:00", "J-1694", "r3", "완료", { departedAt: "11:09", doneAt: "11:42" }], 0, "B카드 2**4"],
  ["DD-0917-2204", "c15", "lace-mini", "M", "반납 완료", "09-17 09:18", "09-17", "09-18", "영등포구", "영중로 46, 704호", ["17:00~17:30", "J-1612", "r5", "완료", { doneAt: "17:26" }], ["12:00~13:00", "J-1696", "r5", "완료", { departedAt: "11:58", doneAt: "12:26" }], 0, "A페이"],
  ["DD-0917-2219", "c6", "tweed-setup", "M", "반납 완료", "09-17 10:26", "09-17", "09-18", "서초구", "서초대로77길 54, 203동 1502호", ["16:30~17:00", "J-1618", "r7", "완료", { doneAt: "16:44" }], ["14:00~15:00", "J-1701", "r7", "완료", { departedAt: "14:05", doneAt: "14:33" }], 0, "B페이"],
  ["DD-0916-1990", "c10", "wide-slacks", "S", "반납 완료", "09-16 12:18", "09-16", "09-18", "마포구", "월드컵북로 396, 804호", ["17:30~18:00", "J-1563", "r2", "완료", { doneAt: "17:52" }], ["15:00~16:00", "J-1703", "r2", "완료", { departedAt: "15:14", doneAt: "15:48" }], 0, "A카드 8**2"],
  ["DD-0917-2231", "c12", "tailored-suit", "S", "회수 중", "09-17 11:20", "09-17", "09-18", "서초구", "반포대로 58, 11층", ["17:00~17:30", "J-1624", "r7", "완료", { doneAt: "17:08" }], ["16:00~17:00", "J-1707", "r3", "이동 중", { assignedAt: "15:34", departedAt: "16:39" }], 0, "C카드 7**3"],
  ["DD-0917-2240", "c2", "summer-knit", "S", "회수 중", "09-17 12:05", "09-17", "09-18", "마포구", "양화로 45, 8층 안내데스크", ["17:30~18:00", "J-1629", "r5", "완료", { doneAt: "17:47" }], ["16:30~17:30", "J-1708", "r5", "이동 중", { assignedAt: "15:50", departedAt: "16:36" }], 0, "A카드 1**9"],
  ["DD-0917-2246", "c11", "flower-maxi", "S", "회수 요청", "09-17 12:22", "09-17", "09-18", "강남구", "선릉로 551, 1207호", ["18:00~18:30", "J-1633", "r3", "완료", { doneAt: "18:09" }], ["17:00~18:00", "J-1710", "r4", "배정", { assignedAt: "16:02" }], 0, "C카드 3**5", { returnRequestedAt: "09:40" }],
  ["DD-0916-1995", "c5", "ribbon-blouse", "XS", "회수 요청", "09-16 12:47", "09-16", "09-18", "송파구", "올림픽로 300, 3204호", ["18:00~18:30", "J-1571", "r4", "완료", { doneAt: "18:20" }], ["18:00~19:00", "J-1713", "r4", "배정", { assignedAt: "16:02" }], 0, "B페이", { returnRequestedAt: "10:12" }],
  ["DD-0917-2252", "c7", "pleats-skirt", "M", "회수 요청", "09-17 12:53", "09-17", "09-18", "영등포구", "여의대로 108, 2층", ["18:30~19:00", "J-1641", "r5", "완료", { doneAt: "18:41" }], ["19:00~20:00", "J-1717", "", "배차 대기"], 0, "A카드 4**6", { returnRequestedAt: "13:05" }],
  ["DD-0917-2258", "c4", "wrap-midi", "L", "회수 요청", "09-17 13:31", "09-17", "09-18", "용산구", "이태원로 177, 3층", ["19:00~19:30", "J-1646", "r7", "완료", { doneAt: "19:16" }], ["20:00~21:00", "J-1725", "r7", "배정", { assignedAt: "15:57" }], 0, "B카드 9**1", { returnRequestedAt: "12:48" }],
  ["DD-0917-2263", "c9", "crop-cardigan", "S", "회수 요청", "09-17 13:47", "09-17", "09-18", "성동구", "왕십리로 83-21, 1104호", ["19:30~20:00", "J-1650", "r1", "완료", { doneAt: "19:44" }], ["20:30~21:30", "J-1726", "", "배차 대기"], 0, "A페이", { returnRequestedAt: "14:26" }],

  // 이용 중 (회수는 내일 이후)
  ["DD-0917-2227", "c8", "single-trench", "M", "이용 중", "09-17 10:58", "09-17", "09-20", "광진구", "아차산로 272, 1502호", ["17:00~17:30", "J-1620", "r6", "완료", { doneAt: "17:14" }], ["19:00~20:00", "J-1843", "", "배차 대기"], 0, "B카드 2**7"],
  ["DD-0916-1968", "c16", "chambray-shirt", "S", "이용 중", "09-16 09:38", "09-16", "09-19", "광진구", "능동로 209, 102호", ["16:00~16:30", "J-1552", "r6", "완료", { doneAt: "16:18" }], ["18:00~19:00", "J-1806", "", "배차 대기"], 0, "B카드 6**0"],
  ["DD-0917-2236", "c13", "tailored-suit", "L", "이용 중", "09-17 11:52", "09-17", "09-19", "송파구", "송파대로 570, 1403호", ["17:00~17:30", "J-1627", "r4", "완료", { doneAt: "17:22" }], ["20:00~21:00", "J-1808", "", "배차 대기"], 0, "B페이"],
  ["DD-0917-2249", "c17", "lace-mini", "XS", "이용 중", "09-17 12:41", "09-17", "09-19", "마포구", "망원로 94, 402호", ["18:00~18:30", "J-1637", "r2", "완료", { doneAt: "18:26" }], ["19:00~20:00", "J-1810", "", "배차 대기"], 0, "A카드 7**0"],

  // 내일 이후 배송
  ["DD-0918-2468", "c3", "satin-slip", "M", "예약 확정", "09-18 10:05", "09-19", "09-20", "강남구", "테헤란로 427, 8층", ["12:00~12:30", "J-1822", "", "배차 대기"], ["19:00~20:00", "J-1860", "", "배차 대기"], 0, "B카드 2**4"],
  ["DD-0918-2477", "c10", "sequin-dress", "S", "예약 확정", "09-18 13:02", "09-19", "09-20", "마포구", "월드컵북로 396, 804호", ["18:00~18:30", "J-1827", "", "배차 대기"], ["20:00~21:00", "J-1863", "", "배차 대기"], 0, "A카드 8**2"],
  ["DD-0918-2488", "c12", "single-trench", "M", "예약 확정", "09-18 13:52", "09-19", "09-21", "서초구", "반포대로 58, 11층", ["10:00~10:30", "J-1830", "", "배차 대기"], ["19:00~20:00", "J-1872", "", "배차 대기"], 0, "C카드 7**3"],
  ["DD-0918-2495", "c2", "tweed-setup", "S", "예약 확정", "09-18 15:12", "09-20", "09-21", "마포구", "양화로 45, 8층 안내데스크", ["17:00~17:30", "J-1851", "", "배차 대기"], ["20:00~21:00", "J-1880", "", "배차 대기"], 0, "A카드 1**9"],
  ["DD-0918-2498", "c11", "fringe-shawl", "M", "예약 확정", "09-18 16:20", "09-19", "09-20", "강남구", "선릉로 551, 1207호", ["13:00~13:30", "J-1835", "", "배차 대기"], ["19:00~20:00", "J-1866", "", "배차 대기"], 0, "C카드 3**5"],

  // 취소
  ["DD-0918-2470", "c7", "satin-slip", "S", "취소", "09-18 10:48", "09-18", "09-19", "영등포구", "여의대로 108, 2층", ["19:00~19:30", "", "", "배차 대기"], ["20:00~21:00", "", "", "배차 대기"], 0, "A카드 4**6", { cancelReason: "일정 변경, 고객 요청 11:32" }],
  ["DD-0917-2215", "c14", "wrap-midi", "M", "취소", "09-17 09:44", "09-18", "09-19", "용산구", "한강대로23길 55, 1709호", ["18:00~18:30", "", "", "배차 대기"], ["19:00~20:00", "", "", "배차 대기"], 0, "A페이", { cancelReason: "사이즈 변경 후 재예약" }],

  // 어제 반납 완료
  ["DD-0915-1934", "c5", "summer-knit", "L", "반납 완료", "09-15 12:34", "09-15", "09-17", "송파구", "올림픽로 300, 3204호", ["18:30~19:00", "J-1508", "r4", "완료", { doneAt: "18:47" }], ["19:00~20:00", "J-1664", "r4", "완료", { doneAt: "19:31" }], 0, "B페이"],
  ["DD-0916-1962", "c9", "lace-mini", "S", "반납 완료", "09-16 09:14", "09-16", "09-17", "성동구", "왕십리로 83-21, 1104호", ["16:00~16:30", "J-1547", "r1", "완료", { doneAt: "16:12" }], ["20:00~21:00", "J-1671", "r1", "완료", { doneAt: "20:38" }], 0, "A페이"],
];

/* 상품별 재고 태그 앞자리. 예) 레이스 헴 미니 원피스 = WD-0231 */
export const TAG_PREFIX: Record<string, string> = {
  "lace-mini": "WD-0231",
  "satin-slip": "WD-0244",
  "wrap-midi": "WD-0259",
  "flower-maxi": "WD-0272",
  "sequin-dress": "WD-0286",
  "chambray-shirt": "WB-0412",
  "ribbon-blouse": "WB-0425",
  "summer-knit": "WN-0307",
  "crop-cardigan": "WN-0319",
  "fringe-shawl": "WO-0118",
  "wool-blazer": "WO-0152",
  "single-trench": "WO-0167",
  "pleats-skirt": "WS-0603",
  "wide-slacks": "WP-0701",
  "tweed-setup": "WU-0506",
  "tailored-suit": "WU-0518",
};

/* 태그 일련번호: 명시한 태그를 먼저 잡고, 나머지는 상품별로 빈 번호를 앞에서부터 채운다 */
const usedSeq: Record<string, Set<number>> = {};
function takeSeq(productId: string, fixed?: string) {
  const set = (usedSeq[productId] ??= new Set());
  if (fixed) {
    set.add(Number(fixed.slice(-2)));
    return fixed;
  }
  let n = 1;
  while (set.has(n)) n++;
  set.add(n);
  return `${TAG_PREFIX[productId]}-${String(n).padStart(2, "0")}`;
}
for (const t of RES_RAW) if (t[14]?.unit) takeSeq(t[2], t[14].unit);

function leg(date: string, t: LegTuple): Leg {
  const [window, jobId, riderId, state, extra] = t;
  return { date, window, jobId, riderId: riderId || null, state, ...extra };
}

export const RESERVATIONS: Reservation[] = RES_RAW.map((t) => {
  const [id, customerId, productId, size, status, created, start, end, gu, address, d, p, coupon, method, extra] = t;
  const product = getProduct(productId);
  const days = diffDays(start, end);
  const rent = product.price * days;
  const [createdDate, createdTime] = created.split(" ");
  return {
    id,
    customerId,
    productId,
    size,
    unit: status === "취소" ? "" : extra?.unit ?? takeSeq(productId),
    status,
    createdDate,
    createdTime,
    start,
    end,
    days,
    gu,
    address,
    delivery: leg(start, d),
    pickup: leg(end, p),
    rent,
    ship: SHIP,
    deposit: product.deposit,
    coupon,
    total: rent + SHIP + product.deposit - coupon,
    method,
    packedAt: extra?.packedAt,
    returnRequestedAt: extra?.returnRequestedAt,
    cancelReason: extra?.cancelReason,
  };
});

export function getReservation(id: string | null | undefined) {
  return RESERVATIONS.find((r) => r.id === id);
}

/** 매출 = 대여료 + 배송비 - 쿠폰 (보증금 제외) */
export function revenueOf(r: Reservation) {
  return r.rent + r.ship - r.coupon;
}

/* ── 오늘 배차 ── */

export interface Job extends Leg {
  kind: "배송" | "회수";
  reservation: Reservation;
}

export const TODAY_JOBS: Job[] = RESERVATIONS.filter((r) => r.status !== "취소")
  .flatMap((r) => {
    const out: Job[] = [];
    if (r.delivery.date === NOW.date) out.push({ ...r.delivery, kind: "배송", reservation: r });
    if (r.pickup.date === NOW.date) out.push({ ...r.pickup, kind: "회수", reservation: r });
    return out;
  })
  .sort((a, b) => a.window.localeCompare(b.window) || a.jobId.localeCompare(b.jobId));

export function getJob(id: string | null | undefined) {
  return TODAY_JOBS.find((j) => j.jobId === id);
}

export const UNASSIGNED = TODAY_JOBS.filter((j) => j.riderId === null && j.state !== "완료");
export const DELAYED = TODAY_JOBS.filter((j) => j.state === "지연");

export function riderJobs(riderId: string) {
  return TODAY_JOBS.filter((j) => j.riderId === riderId);
}

export type RiderStatus = "운행 중" | "대기" | "업무 종료" | "휴무";
export const RIDER_TONE: Record<RiderStatus, Tone> = { "운행 중": "live", 대기: "wait", "업무 종료": "done", 휴무: "wait" };

export function riderStatus(r: Rider): RiderStatus {
  if (r.off) return "휴무";
  const jobs = riderJobs(r.id);
  if (jobs.some((j) => j.state === "이동 중" || j.state === "지연")) return "운행 중";
  if (jobs.some((j) => j.state === "배정")) return "대기";
  return "업무 종료";
}

/* ── 재고 (개별 의류) ── */

export type UnitStatus = "대여 가능" | "예약" | "대여 중" | "회수" | "검수" | "세탁" | "수선";
export const UNIT_STATUSES: UnitStatus[] = ["대여 가능", "예약", "대여 중", "회수", "검수", "세탁", "수선"];
export const UNIT_TONE: Record<UnitStatus, Tone> = {
  "대여 가능": "done",
  예약: "wait",
  "대여 중": "live",
  회수: "live",
  검수: "act",
  세탁: "wait",
  수선: "wait",
};

export interface Unit {
  tag: string;
  productId: string;
  size: Size;
  status: UnitStatus;
  location: string;
  updated: string;
  reservationId?: string;
}

/* ── 반납 검수 ── */

export type CheckValue = "없음" | "있음" | "미확인";
export type InspectionStatus = "검수 대기" | "추가 비용 청구" | "세탁 이관" | "수선 이관";
export const INSPECTION_TONE: Record<InspectionStatus, Tone> = {
  "검수 대기": "act",
  "추가 비용 청구": "act",
  "세탁 이관": "done",
  "수선 이관": "done",
};
export const CHECK_KEYS = ["오염", "훼손", "분실", "수선"] as const;
export type CheckKey = (typeof CHECK_KEYS)[number];

export interface Inspection {
  id: string;
  reservationId: string;
  receivedAt: string;
  status: InspectionStatus;
  checks: Record<CheckKey, CheckValue>;
  notes: Partial<Record<CheckKey, string>>;
  costs: { label: string; amount: number }[];
  inspector?: string;
  closedAt?: string;
}

const PENDING: Record<CheckKey, CheckValue> = { 오염: "미확인", 훼손: "미확인", 분실: "미확인", 수선: "미확인" };
const CLEAN: Record<CheckKey, CheckValue> = { 오염: "없음", 훼손: "없음", 분실: "없음", 수선: "없음" };

export const INSPECTIONS: Inspection[] = [
  {
    id: "RT-0918-04",
    reservationId: "DD-0917-2204",
    receivedAt: "9/18 13:07",
    status: "추가 비용 청구",
    checks: { ...CLEAN, 오염: "있음" },
    notes: { 오염: "앞판 허리선 아래 레드 와인 얼룩 약 3cm, 일반 세탁으로 지워지지 않음" },
    costs: [{ label: "특수 세탁 (얼룩 제거)", amount: 18700 }],
    inspector: "심하람",
    closedAt: "9/18 13:40",
  },
  {
    id: "RT-0918-01",
    reservationId: "DD-0915-1920",
    receivedAt: "9/18 11:14",
    status: "검수 대기",
    checks: PENDING,
    notes: {},
    costs: [],
  },
  {
    id: "RT-0918-02",
    reservationId: "DD-0916-1977",
    receivedAt: "9/18 11:31",
    status: "검수 대기",
    checks: PENDING,
    notes: {},
    costs: [],
  },
  {
    id: "RT-0918-03",
    reservationId: "DD-0916-1971",
    receivedAt: "9/18 12:23",
    status: "검수 대기",
    checks: PENDING,
    notes: {},
    costs: [],
  },
  {
    id: "RT-0918-06",
    reservationId: "DD-0916-1990",
    receivedAt: "9/18 16:29",
    status: "검수 대기",
    checks: PENDING,
    notes: {},
    costs: [],
  },
  {
    id: "RT-0918-05",
    reservationId: "DD-0917-2219",
    receivedAt: "9/18 15:16",
    status: "추가 비용 청구",
    checks: { ...CLEAN, 분실: "있음" },
    notes: { 분실: "셋업 구성품 체인 벨트 미반납, 고객 확인 결과 분실" },
    costs: [{ label: "체인 벨트 대체", amount: 24500 }],
    inspector: "심하람",
    closedAt: "9/18 15:52",
  },
  {
    id: "RT-0917-11",
    reservationId: "DD-0916-1962",
    receivedAt: "9/17 21:26",
    status: "수선 이관",
    checks: { ...CLEAN, 수선: "있음" },
    notes: { 수선: "밑단 레이스 2cm 풀림, 자연 마모로 판단" },
    costs: [],
    inspector: "노경민",
    closedAt: "9/18 09:48",
  },
  {
    id: "RT-0917-09",
    reservationId: "DD-0915-1934",
    receivedAt: "9/17 20:14",
    status: "세탁 이관",
    checks: CLEAN,
    notes: {},
    costs: [],
    inspector: "노경민",
    closedAt: "9/18 09:21",
  },
];

export function getInspection(id: string | null | undefined) {
  return INSPECTIONS.find((i) => i.id === id);
}

export const INSPECTION_PENDING = INSPECTIONS.filter((i) => i.status === "검수 대기");

function inspectionUnitStatus(i: Inspection): UnitStatus {
  if (i.status === "검수 대기") return "검수";
  if (i.status === "수선 이관") return "수선";
  if (i.status === "세탁 이관") return "세탁";
  return i.checks.분실 === "있음" ? "수선" : "세탁";
}

const SHELVES = ["A-03", "A-07", "A-12", "B-02", "B-05", "B-09", "C-01", "C-04", "C-11"];
const SHELF_TIMES = ["9/17 21:48", "9/18 09:12", "9/16 20:31", "9/18 10:26", "9/17 22:05", "9/15 19:44", "9/18 11:58"];

function buildUnits(): Unit[] {
  const out: Unit[] = [];
  for (const r of RESERVATIONS) {
    if (r.status === "취소") continue;
    let status: UnitStatus;
    let location: string;
    let updated: string;
    const ins = INSPECTIONS.find((i) => i.reservationId === r.id);
    const customer = getCustomerName(r.customerId);
    if (r.status === "예약 확정") {
      status = "예약";
      location = r.start === NOW.date ? `${CENTER} 출고대` : `${CENTER} 예약 선반`;
      updated = r.packedAt ? `9/18 ${r.packedAt}` : `${short(r.createdDate)} ${r.createdTime}`;
    } else if (r.status === "배송 중" || r.status === "이용 중" || r.status === "회수 요청") {
      status = "대여 중";
      location = `고객 ${customer}`;
      updated = `${short(r.start)} ${r.delivery.doneAt ?? r.delivery.departedAt ?? r.createdTime}`;
    } else if (r.status === "회수 중") {
      status = "회수";
      location = `라이더 ${getRider(r.pickup.riderId)?.name ?? ""}`;
      updated = `9/18 ${r.pickup.departedAt}`;
    } else if (ins) {
      status = inspectionUnitStatus(ins);
      location = status === "검수" ? `${CENTER} 검수대` : status === "세탁" ? "B클린 (외주 세탁)" : `${CENTER} 수선실`;
      updated = ins.closedAt ?? ins.receivedAt;
    } else {
      status = "세탁";
      location = "B클린 (외주 세탁)";
      updated = `${short(addDays(r.end, 0))} 21:40`;
    }
    out.push({ tag: r.unit, productId: r.productId, size: r.size, status, location, updated, reservationId: r.id });
  }

  // 대여 가능 재고: 고객 사이트의 사이즈별 재고 수와 같다
  let k = 0;
  for (const p of PRODUCTS) {
    for (const [size, count] of Object.entries(p.stock) as [Size, number][]) {
      for (let i = 0; i < count; i++) {
        out.push({
          tag: takeSeq(p.id),
          productId: p.id,
          size,
          status: "대여 가능",
          location: `${CENTER} ${SHELVES[k % SHELVES.length]}`,
          updated: SHELF_TIMES[k % SHELF_TIMES.length],
        });
        k++;
      }
    }
  }

  // 세탁, 수선 중인 여분
  const extra: [string, Size, UnitStatus, string, string][] = [
    ["wrap-midi", "M", "세탁", "B클린 (외주 세탁)", "9/17 22:12"],
    ["tweed-setup", "S", "세탁", "B클린 (외주 세탁)", "9/17 22:12"],
    ["wool-blazer", "M", "수선", `${CENTER} 수선실`, "9/16 14:05"],
    ["sequin-dress", "M", "수선", `${CENTER} 수선실`, "9/15 11:37"],
    ["single-trench", "S", "세탁", "B클린 (외주 세탁)", "9/17 22:12"],
    ["satin-slip", "XS", "세탁", "B클린 (외주 세탁)", "9/18 09:30"],
  ];
  for (const [pid, size, status, location, updated] of extra) {
    out.push({ tag: takeSeq(pid), productId: pid, size, status, location, updated });
  }
  return out.sort((a, b) => a.tag.localeCompare(b.tag));
}

/* ── 고객 ── */

export type CustomerStatus = "이용 중" | "예약 확정" | "정상" | "이용 제한";
export const CUSTOMER_TONE: Record<CustomerStatus, Tone> = { "이용 중": "live", "예약 확정": "wait", 정상: "done", "이용 제한": "stop" };

/** 지난 대여. [예약번호, 상품, 사이즈, 시작일, 일수, 추가 비용] */
type PastTuple = [string, string, Size, string, number, number?];

interface CustomerRaw {
  id: string;
  name: string;
  phone: string;
  gu: string;
  joined: string;
  past: PastTuple[];
  cancelled?: [string, string, Size, string, string][];
  restricted?: string;
}

const CUSTOMERS_RAW: CustomerRaw[] = [
  {
    id: "c1", name: "권나율", phone: "010-4821-7730", gu: "성동구", joined: "2025-11-03",
    past: [["DD-0831-0746", "wrap-midi", "M", "08-31", 1], ["DD-0809-0312", "summer-knit", "M", "08-09", 2], ["DD-0722-1150", "tweed-setup", "S", "07-22", 1]],
    cancelled: [["DD-0904-0529", "sequin-dress", "S", "09-04", "일정 변경"]],
  },
  { id: "c2", name: "도예린", phone: "010-3317-5092", gu: "마포구", joined: "2026-02-14", past: [["DD-0809-0612", "satin-slip", "S", "08-09", 1]] },
  { id: "c3", name: "석가윤", phone: "010-9024-1168", gu: "강남구", joined: "2025-08-27", past: [["DD-0910-1703", "tweed-setup", "S", "09-10", 1], ["DD-0829-1102", "tailored-suit", "S", "08-29", 1], ["DD-0718-0233", "wool-blazer", "M", "07-18", 2]] },
  { id: "c4", name: "명수빈", phone: "010-2279-8841", gu: "용산구", joined: "2026-05-30", past: [] },
  { id: "c5", name: "엄다인", phone: "010-6653-0417", gu: "송파구", joined: "2026-03-08", past: [["DD-0826-1011", "ribbon-blouse", "XS", "08-26", 1]] },
  { id: "c6", name: "봉채원", phone: "010-7140-2386", gu: "서초구", joined: "2025-12-19", past: [["DD-0902-1319", "lace-mini", "XS", "09-02", 1], ["DD-0815-0788", "wrap-midi", "S", "08-15", 2]] },
  { id: "c7", name: "추민경", phone: "010-5582-9913", gu: "영등포구", joined: "2026-07-02", past: [] },
  { id: "c8", name: "옥세아", phone: "010-8836-4051", gu: "광진구", joined: "2026-01-25", past: [["DD-0831-1204", "flower-maxi", "S", "08-31", 3]] },
  { id: "c9", name: "제윤슬", phone: "010-4107-6628", gu: "성동구", joined: "2026-04-11", past: [["DD-0907-1560", "summer-knit", "S", "09-07", 1]] },
  { id: "c10", name: "방지유", phone: "010-2961-3375", gu: "마포구", joined: "2025-10-06", past: [["DD-0824-0963", "wide-slacks", "S", "08-24", 2], ["DD-0803-0540", "pleats-skirt", "M", "08-03", 1]] },
  { id: "c11", name: "함소율", phone: "010-7792-1804", gu: "강남구", joined: "2026-06-17", past: [] },
  { id: "c12", name: "표은재", phone: "010-3408-5519", gu: "서초구", joined: "2025-09-30", past: [["DD-0909-1644", "wool-blazer", "S", "09-09", 1], ["DD-0812-0701", "tailored-suit", "S", "08-12", 1]] },
  { id: "c13", name: "경아린", phone: "010-6215-7740", gu: "송파구", joined: "2026-08-02", past: [] },
  { id: "c14", name: "편다빈", phone: "010-9357-2263", gu: "용산구", joined: "2026-04-28", past: [["DD-0828-1076", "ribbon-blouse", "M", "08-28", 1]] },
  { id: "c15", name: "곽서하", phone: "010-5043-8127", gu: "영등포구", joined: "2026-07-21", past: [] },
  { id: "c16", name: "진나연", phone: "010-8174-6690", gu: "광진구", joined: "2026-03-19", past: [["DD-0820-0874", "fringe-shawl", "M", "08-20", 2]] },
  { id: "c17", name: "라은서", phone: "010-2140-9973", gu: "마포구", joined: "2026-05-09", past: [["DD-0911-1759", "lace-mini", "XS", "09-11", 1]] },
  { id: "c18", name: "모시은", phone: "010-4471-2208", gu: "강남구", joined: "2025-07-14", past: [["DD-0726-0391", "satin-slip", "M", "07-26", 1], ["DD-0614-0288", "sequin-dress", "S", "06-14", 1]] },
  { id: "c19", name: "차예나", phone: "010-9906-3114", gu: "서초구", joined: "2026-01-08", past: [["DD-0819-0842", "tailored-suit", "M", "08-19", 2]] },
  {
    id: "c20", name: "인소라", phone: "010-3582-6647", gu: "광진구", joined: "2025-11-21",
    past: [["DD-0802-0455", "tweed-setup", "M", "08-02", 1, 24500], ["DD-0705-0154", "fringe-shawl", "M", "07-05", 2, 38000]],
    restricted: "구성품 분실 2회, 9/1부터 이용 제한",
  },
];

function getCustomerName(id: string) {
  return CUSTOMERS_RAW.find((c) => c.id === id)?.name ?? "";
}

export interface HistoryRow {
  id: string;
  productId: string;
  size: Size;
  period: string;
  start: string;
  status: ResStatus;
  total: number;
  revenue: number;
}

export interface PaymentRow {
  date: string;
  sort: string;
  kind: "결제" | "보증금 환불" | "취소 환불" | "추가 비용";
  id: string;
  amount: number;
  method: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gu: string;
  joined: string;
  status: CustomerStatus;
  restricted?: string;
  history: HistoryRow[];
  payments: PaymentRow[];
  rentals: number;
  revenue: number;
  lastUse: string;
}

/** "9/18 13:40" → "09-18 13:40" (정렬용) */
function sortKey(label: string) {
  const [md, t] = label.split(" ");
  const [m, d] = md.split("/");
  return `${m.padStart(2, "0")}-${d.padStart(2, "0")} ${t}`;
}

function periodOf(start: string, end: string) {
  return `${short(start)} ~ ${short(end)}`;
}

export const CUSTOMERS: Customer[] = CUSTOMERS_RAW.map((c) => {
  const current = RESERVATIONS.filter((r) => r.customerId === c.id);
  const methodOf = current[0]?.method ?? (c.id === "c1" ? "A카드 5**1" : "B카드 3**8");
  const history: HistoryRow[] = [];
  const payments: PaymentRow[] = [];

  for (const r of current) {
    history.push({ id: r.id, productId: r.productId, size: r.size, period: periodOf(r.start, r.end), start: r.start, status: r.status, total: r.total, revenue: r.status === "취소" ? 0 : revenueOf(r) });
    payments.push({ date: `${short(r.createdDate)} ${r.createdTime}`, sort: `${r.createdDate} ${r.createdTime}`, kind: "결제", id: r.id, amount: r.total, method: r.method });
    if (r.status === "취소") {
      payments.push({ date: `${short(r.createdDate)} ${r.cancelReason?.match(/\d{2}:\d{2}/)?.[0] ?? "11:32"}`, sort: `${r.createdDate} ${r.cancelReason?.match(/\d{2}:\d{2}/)?.[0] ?? "11:32"}`, kind: "취소 환불", id: r.id, amount: -r.total, method: r.method });
    }
    const ins = INSPECTIONS.find((i) => i.reservationId === r.id);
    if (ins && ins.closedAt) {
      const extra = ins.costs.reduce((a, b) => a + b.amount, 0);
      if (extra > 0) payments.push({ date: ins.closedAt, sort: `${sortKey(ins.closedAt)}:00`, kind: "추가 비용", id: r.id, amount: extra, method: "보증금 차감" });
      payments.push({ date: ins.closedAt, sort: `${sortKey(ins.closedAt)}:01`, kind: "보증금 환불", id: r.id, amount: -(r.deposit - extra), method: r.method });
    }
  }

  for (const [id, pid, size, start, days, extra = 0] of c.past) {
    const p = getProduct(pid);
    const end = addDays(start, days);
    const rent = p.price * days;
    const total = rent + SHIP + p.deposit;
    history.push({ id, productId: pid, size, period: periodOf(start, end), start, status: "반납 완료", total, revenue: rent + SHIP });
    payments.push({ date: `${short(start)} 10:14`, sort: `${start} 10:14`, kind: "결제", id, amount: total, method: methodOf });
    if (extra > 0) payments.push({ date: `${short(addDays(end, 1))} 11:05`, sort: `${addDays(end, 1)} 11:05`, kind: "추가 비용", id, amount: extra, method: "보증금 차감" });
    payments.push({ date: `${short(addDays(end, 1))} 11:20`, sort: `${addDays(end, 1)} 11:20`, kind: "보증금 환불", id, amount: -(p.deposit - extra), method: methodOf });
  }

  for (const [id, pid, size, start, reason] of c.cancelled ?? []) {
    const p = getProduct(pid);
    const total = p.price + SHIP + p.deposit;
    history.push({ id, productId: pid, size, period: periodOf(start, addDays(start, 1)), start, status: "취소", total, revenue: 0 });
    payments.push({ date: `${short(addDays(start, -3))} 21:08`, sort: `${addDays(start, -3)} 21:08`, kind: "결제", id, amount: total, method: methodOf });
    payments.push({ date: `${short(addDays(start, -2))} 09:37`, sort: `${addDays(start, -2)} 09:37`, kind: "취소 환불", id, amount: -total, method: `${methodOf} | ${reason}` });
  }

  history.sort((a, b) => b.start.localeCompare(a.start) || b.id.localeCompare(a.id));
  payments.sort((a, b) => b.sort.localeCompare(a.sort));

  const active = current.filter((r) => r.status !== "취소");
  let status: CustomerStatus = "정상";
  if (c.restricted) status = "이용 제한";
  else if (active.some((r) => ["배송 중", "이용 중", "회수 요청", "회수 중"].includes(r.status))) status = "이용 중";
  else if (active.some((r) => r.status === "예약 확정")) status = "예약 확정";

  const done = history.filter((h) => h.status !== "취소");
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    gu: c.gu,
    joined: c.joined,
    status,
    restricted: c.restricted,
    history,
    payments,
    rentals: done.length,
    revenue: done.reduce((a, b) => a + b.revenue, 0),
    lastUse: history[0]?.start ?? "",
  };
});

export function getCustomer(id: string | null | undefined) {
  return CUSTOMERS.find((c) => c.id === id);
}

export const UNITS: Unit[] = buildUnits();

/* ── 상품 상태 ── */

export type ProductStatus = "노출 중" | "재고 부족" | "숨김";
export const PRODUCT_TONE: Record<ProductStatus, Tone> = { "노출 중": "done", "재고 부족": "wait", 숨김: "wait" };

const HIDDEN = new Set(["chambray-shirt", "crop-cardigan"]);

export function productStatus(p: Product): ProductStatus {
  if (HIDDEN.has(p.id)) return "숨김";
  const avail = Object.values(p.stock).reduce((a, b) => a + (b ?? 0), 0);
  return avail <= 1 ? "재고 부족" : "노출 중";
}

export function unitsOf(productId: string) {
  return UNITS.filter((u) => u.productId === productId);
}

/* ── 정산 ── */

/** 9/1 ~ 9/17 일별 매출 (원). 9/18은 오늘 들어온 예약에서 계산한다 */
const DAILY_PAST = [
  612400, 587900, 704300, 931800, 1146200, 868500, 553700, 629100, 671400, 742600, 978300, 1208900, 902700, 581200,
  648800, 690500, 756100,
];

export const TODAY_ORDERS = RESERVATIONS.filter((r) => r.createdDate === NOW.date && r.status !== "취소");
export const TODAY_CANCELLED = RESERVATIONS.filter((r) => r.createdDate === NOW.date && r.status === "취소");

export const DAILY_REVENUE: { date: string; value: number; partial?: boolean }[] = [
  ...DAILY_PAST.map((value, i) => ({ date: `09-${String(i + 1).padStart(2, "0")}`, value })),
  { date: NOW.date, value: TODAY_ORDERS.reduce((a, r) => a + revenueOf(r), 0), partial: true },
];

export const MONTH_REVENUE_TO_DATE = DAILY_REVENUE.reduce((a, b) => a + b.value, 0);

export const MONTHLY_REVENUE: { month: string; value: number; partial?: boolean }[] = [
  { month: "4월", value: 14826400 },
  { month: "5월", value: 17392800 },
  { month: "6월", value: 18905300 },
  { month: "7월", value: 21448700 },
  { month: "8월", value: 23016900 },
  { month: "9월", value: MONTH_REVENUE_TO_DATE, partial: true },
];

/** 8/1 ~ 8/18 매출 (원). 전월 동기 비교용 */
export const AUGUST_TO_18 = 12874600;

/** 이번 달 상품별 대여 횟수 (배송 완료 기준) */
export const MONTH_RENTALS_BY_PRODUCT: Record<string, number> = {
  "lace-mini": 40,
  "wool-blazer": 36,
  "tweed-setup": 32,
  "wrap-midi": 29,
  "satin-slip": 24,
  "summer-knit": 22,
  "tailored-suit": 21,
  "wide-slacks": 19,
  "ribbon-blouse": 18,
  "flower-maxi": 14,
  "pleats-skirt": 12,
  "fringe-shawl": 11,
  "chambray-shirt": 9,
  "crop-cardigan": 8,
  "single-trench": 6,
  "sequin-dress": 5,
};

/** 이번 달 구별 배송, 회수 처리 (건). 배송 합계 = 상품별 대여 합계 */
export const DISTRICT_OPS: { gu: string; delivered: number; picked: number; delays: number }[] = [
  { gu: "성동구", delivered: 50, picked: 49, delays: 3 },
  { gu: "광진구", delivered: 31, picked: 29, delays: 3 },
  { gu: "마포구", delivered: 47, picked: 44, delays: 4 },
  { gu: "용산구", delivered: 29, picked: 27, delays: 1 },
  { gu: "강남구", delivered: 57, picked: 55, delays: 7 },
  { gu: "서초구", delivered: 39, picked: 36, delays: 2 },
  { gu: "송파구", delivered: 28, picked: 26, delays: 4 },
  { gu: "영등포구", delivered: 25, picked: 23, delays: 3 },
];

export const MONTH_CANCELLED = 14;

/* ── 공용 계산 ── */

export function countBy<T, K extends string>(rows: T[], key: (r: T) => K) {
  const out = {} as Record<K, number>;
  for (const r of rows) {
    const k = key(r);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export const DASHBOARD = {
  todayOrders: TODAY_ORDERS.length,
  deliveries: TODAY_JOBS.filter((j) => j.kind === "배송" && j.state !== "완료").length,
  pickups: TODAY_JOBS.filter((j) => j.kind === "회수" && j.state !== "완료").length,
  inUse: RESERVATIONS.filter((r) => r.status === "이용 중").length,
  unassigned: UNASSIGNED.length,
  inspection: INSPECTION_PENDING.length,
};
