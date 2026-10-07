import { addDays, isWeekend, TODAY } from "@/projects/b2b/teefinder/lib/format";
import type {
  AlertCondition,
  Course,
  CourseAccount,
  CourseConfig,
  CourseLayout,
  InboxItem,
  Member,
  MonitorLog,
  PushRecord,
  Region,
  TeeTime,
} from "@/projects/b2b/teefinder/lib/types";

export const TOTAL_COURSE_COUNT = 70;
export const DEMO_MEMBER_ID = "m01";
export const REGIONS: Region[] = ["경기", "강원", "충청", "영남", "호남", "제주"];

function course(
  id: string,
  name: string,
  region: Region,
  layouts: CourseLayout[],
  loginKind: Course["loginKind"],
  status: Course["status"],
  successRate: number,
  lastSuccess: string,
  slug: string,
): Course {
  return {
    id,
    name,
    region,
    layouts,
    loginKind,
    status,
    successRate,
    lastSuccess,
    domain: `https://reserve.${slug}.test`,
  };
}

export const COURSES: Course[] = [
  course("c01", "블루힐 CC", "경기", ["레이크", "힐"], "일반", "정상", 98.7, "10-07 09:42", "bluehill-cc"),
  course("c02", "솔밭 레이크 CC", "강원", ["레이크", "밸리"], "일반", "정상", 97.9, "10-07 09:41", "solbat-lake"),
  course("c03", "한라 파인 CC", "제주", ["힐", "밸리", "레이크"], "일반", "정상", 96.3, "10-07 09:40", "halla-pine"),
  course("c04", "청솔 밸리 CC", "충청", ["밸리", "힐"], "보안문자", "인증 필요", 94.2, "10-07 09:38", "cheongsol-valley"),
  course("c05", "은행나무 CC", "경기", ["레이크", "힐"], "일반", "정상", 99.1, "10-07 09:42", "eunhaeng-cc"),
  course("c06", "달빛 레이크 CC", "충청", ["레이크", "밸리"], "보안문자", "인증 필요", 95.6, "10-07 09:37", "dalbit-lake"),
  course("c07", "송림 힐스 CC", "영남", ["힐", "밸리"], "일반", "정상", 97.2, "10-07 09:41", "songrim-hills"),
  course("c08", "가온 파크 CC", "경기", ["레이크", "힐", "밸리"], "일반", "정상", 98.3, "10-07 09:42", "gaon-park"),
  course("c09", "바람재 CC", "강원", ["힐", "밸리"], "일반", "점검 필요", 82.4, "10-07 08:57", "baramjae-cc"),
  course("c10", "새벽들 CC", "호남", ["레이크", "힐"], "일반", "정상", 96.8, "10-07 09:40", "saebyeokdeul"),
  course("c11", "노을 비치 CC", "제주", ["레이크", "힐"], "보안문자", "인증 필요", 93.7, "10-07 09:36", "noeul-beach"),
  course("c12", "두메 마운틴 CC", "강원", ["힐", "밸리", "레이크"], "일반", "오류", 12.5, "10-06 21:14", "dume-mountain"),
  course("c13", "하늬 CC", "호남", ["밸리", "힐"], "일반", "오류", 8.3, "10-06 18:03", "hanui-cc"),
  course("c14", "여울 밸리 CC", "영남", ["밸리", "레이크"], "일반", "정상", 97.6, "10-07 09:41", "yeoul-valley"),
  course("c15", "소나무 언덕 CC", "충청", ["힐", "레이크"], "일반", "점검 필요", 71.9, "10-07 07:48", "sonamu-hill"),
  course("c16", "백운 파인 CC", "경기", ["힐", "밸리"], "일반", "정상", 98.0, "10-07 09:42", "baegun-pine"),
  course("c17", "다온 레이크 CC", "영남", ["레이크", "힐"], "일반", "점검 필요", 88.6, "10-07 09:12", "daon-lake"),
  course("c18", "초원 힐 CC", "호남", ["힐", "밸리"], "일반", "정상", 95.4, "10-07 09:39", "chowon-hill"),
];

export function getCourse(id: string): Course {
  return COURSES.find((c) => c.id === id) ?? COURSES[0];
}

/* ---------- 티타임 ---------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKDAY_FEES = [126000, 138000, 147000, 152000, 164000, 172000];
const WEEKEND_FEES = [218000, 226000, 238000, 248000, 258000, 268000];

/* 취소티로 고정하는 자리. 알림함 카드와 시연 푸시가 같은 자리를 가리킨다. */
interface ForcedSlot {
  courseId: string;
  date: string;
  time: string;
  layout: CourseLayout;
  fee: number;
}

export const FORCED_CANCEL_SLOTS: ForcedSlot[] = [
  { courseId: "c01", date: "2026-10-11", time: "07:36", layout: "힐", fee: 248000 },
  { courseId: "c02", date: "2026-10-10", time: "09:04", layout: "레이크", fee: 158000 },
  { courseId: "c03", date: "2026-10-12", time: "12:48", layout: "밸리", fee: 238000 },
  { courseId: "c08", date: "2026-10-09", time: "11:20", layout: "레이크", fee: 164000 },
  { courseId: "c05", date: "2026-10-10", time: "08:40", layout: "레이크", fee: 172000 },
  { courseId: "c08", date: "2026-10-11", time: "13:06", layout: "밸리", fee: 226000 },
  { courseId: "c01", date: "2026-10-13", time: "06:48", layout: "레이크", fee: 138000 },
];

const cache = new Map<string, TeeTime[]>();

export function getTeeTimes(courseId: string, date: string): TeeTime[] {
  const key = `${courseId}|${date}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const c = getCourse(courseId);
  const idx = COURSES.findIndex((x) => x.id === courseId);
  const dayOffset = Math.round(
    (new Date(date).getTime() - new Date(TODAY).getTime()) / 86400000,
  );
  const rand = mulberry32(idx * 977 + dayOffset * 131 + 7);
  const weekend = isWeekend(date);
  const fees = weekend ? WEEKEND_FEES : WEEKDAY_FEES;
  const count = 5 + Math.floor(rand() * 8);
  /* 오류 골프장은 최신 데이터가 없어 표본이 적다 */
  const total = c.status === "오류" ? Math.min(count, 5) : count;

  const slots: TeeTime[] = [];
  const startMinute = (idx * 7) % 12;
  let minutes = 6 * 60 + startMinute + Math.floor(rand() * 40);
  for (let i = 0; i < total; i++) {
    if (minutes > 15 * 60) break;
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    const roll = rand();
    const status: TeeTime["status"] = roll < 0.4 ? "마감" : roll < 0.45 ? "취소티" : "예약 가능";
    slots.push({
      courseId,
      date,
      time: `${hh}:${mm}`,
      layout: c.layouts[Math.floor(rand() * c.layouts.length)],
      fee: fees[Math.floor(rand() * fees.length)],
      status,
    });
    minutes += 38 + Math.floor(rand() * 88);
  }

  for (const f of FORCED_CANCEL_SLOTS) {
    if (f.courseId === courseId && f.date === date) {
      const without = slots.filter((s) => s.time !== f.time);
      without.push({
        courseId,
        date,
        time: f.time,
        layout: f.layout,
        fee: f.fee,
        status: "취소티",
      });
      slots.length = 0;
      slots.push(...without);
    }
  }

  slots.sort((a, b) => a.time.localeCompare(b.time));
  cache.set(key, slots);
  return slots;
}

export function openSlotCount(courseId: string, date: string): number {
  return getTeeTimes(courseId, date).filter((s) => s.status !== "마감").length;
}

export function weekDates(start: string, length = 7): string[] {
  return Array.from({ length }, (_, i) => addDays(start, i));
}

/* ---------- 회원 ---------- */

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "m01",
    name: "김회원",
    phone: "010-0000-1204",
    membershipNo: "TF-2291-0417",
    membershipLabel: "개인 정회원 1구좌",
    joinedAt: "2026-06-12",
    status: "정상",
    favoriteCourseIds: ["c01", "c02", "c03", "c08"],
  },
  {
    id: "m02",
    name: "서태윤",
    phone: "010-0000-3381",
    membershipNo: "TF-2304-1186",
    membershipLabel: "개인 정회원 1구좌",
    joinedAt: "2026-10-06",
    status: "승인 대기",
    favoriteCourseIds: [],
  },
  {
    id: "m03",
    name: "문하람",
    phone: "010-0000-5527",
    membershipNo: "TF-2304-1203",
    membershipLabel: "가족 회원권 2인",
    joinedAt: "2026-10-06",
    status: "승인 대기",
    favoriteCourseIds: [],
  },
  {
    id: "m04",
    name: "연우진",
    phone: "010-0000-7710",
    membershipNo: "TF-2298-0852",
    membershipLabel: "법인 회원권 1구좌",
    joinedAt: "2026-10-05",
    status: "승인 대기",
    favoriteCourseIds: [],
  },
  {
    id: "m05",
    name: "류시안",
    phone: "010-0000-2046",
    membershipNo: "TF-2287-0311",
    membershipLabel: "법인 회원권 2구좌",
    joinedAt: "2026-05-28",
    status: "정상",
    favoriteCourseIds: ["c01", "c05"],
  },
  {
    id: "m06",
    name: "맹준호",
    phone: "010-0000-9132",
    membershipNo: "TF-2279-0094",
    membershipLabel: "개인 정회원 1구좌",
    joinedAt: "2026-04-17",
    status: "정상",
    favoriteCourseIds: ["c02", "c09"],
  },
  {
    id: "m07",
    name: "석지후",
    phone: "010-0000-4408",
    membershipNo: "TF-2281-0166",
    membershipLabel: "주중 회원권",
    joinedAt: "2026-04-30",
    status: "정상",
    favoriteCourseIds: ["c03", "c11"],
  },
  {
    id: "m08",
    name: "편서린",
    phone: "010-0000-6615",
    membershipNo: "TF-2301-1077",
    membershipLabel: "개인 정회원 1구좌",
    joinedAt: "2026-10-02",
    status: "반려",
    rejectReason: "회원권 번호가 명부와 일치하지 않습니다. 번호를 확인해 다시 신청해 주세요.",
    favoriteCourseIds: [],
  },
  {
    id: "m09",
    name: "구본혁",
    phone: "010-0000-1873",
    membershipNo: "TF-2266-0029",
    membershipLabel: "법인 회원권 1구좌",
    joinedAt: "2026-03-09",
    status: "이용 정지",
    suspendReason: "골프장 예약 사이트 약관 위반 신고가 접수되었습니다.",
    favoriteCourseIds: ["c07"],
  },
  {
    id: "m10",
    name: "나해원",
    phone: "010-0000-3059",
    membershipNo: "TF-2290-0402",
    membershipLabel: "가족 회원권 2인",
    joinedAt: "2026-06-03",
    status: "정상",
    favoriteCourseIds: ["c08", "c16"],
  },
  {
    id: "m11",
    name: "하종민",
    phone: "010-0000-8264",
    membershipNo: "TF-2293-0538",
    membershipLabel: "개인 정회원 1구좌",
    joinedAt: "2026-07-21",
    status: "정상",
    favoriteCourseIds: ["c01", "c14"],
  },
  {
    id: "m12",
    name: "소유라",
    phone: "010-0000-0792",
    membershipNo: "TF-2296-0679",
    membershipLabel: "주중 회원권",
    joinedAt: "2026-08-14",
    status: "정상",
    favoriteCourseIds: ["c05", "c10"],
  },
];

export const INITIAL_ACCOUNTS: CourseAccount[] = [
  { courseId: "c01", loginId: "kimhoe0417", password: "teeTime!2291", status: "정상" },
  { courseId: "c02", loginId: "kimhoe_sb", password: "sbLake#4417", status: "정상" },
  { courseId: "c03", loginId: "kimhoe41", password: "halla2291pw", status: "로그인 실패" },
  { courseId: "c04", loginId: "kimhoe0417", password: "cheongsol77", status: "인증 필요" },
];

export const INITIAL_CONDITIONS: AlertCondition[] = [
  { id: "a1", courseId: "c01", date: "2026-10-11", timeBand: "오전", maxFee: 252000, enabled: true },
  { id: "a2", courseId: "c02", date: "2026-10-10", timeBand: "전체", maxFee: 168000, enabled: true },
  { id: "a3", courseId: "c03", date: "2026-10-12", timeBand: "오후", maxFee: 246000, enabled: false },
];

export const INITIAL_INBOX: InboxItem[] = [
  {
    id: "i1",
    kind: "취소티",
    title: "블루힐 CC 취소티",
    body: "10월 11일 (일) 07:36 힐 코스, 248,000원",
    at: "10-07 09:18",
    read: false,
    slotKey: "c01|2026-10-11|07:36",
    courseId: "c01",
    date: "2026-10-11",
    time: "07:36",
  },
  {
    id: "i2",
    kind: "공지",
    title: "10월 14일 수집 서버 점검 안내",
    body: "10월 14일 02:00부터 04:00까지 수집이 중단됩니다. 점검 중에는 티타임이 갱신되지 않습니다.",
    at: "10-07 08:30",
    read: false,
  },
  {
    id: "i3",
    kind: "취소티",
    title: "한라 파인 CC 취소티",
    body: "10월 12일 (월) 12:48 밸리 코스, 238,000원",
    at: "10-06 17:52",
    read: false,
    slotKey: "c03|2026-10-12|12:48",
    courseId: "c03",
    date: "2026-10-12",
    time: "12:48",
  },
  {
    id: "i4",
    kind: "취소티",
    title: "솔밭 레이크 CC 취소티",
    body: "10월 10일 (토) 09:04 레이크 코스, 158,000원",
    at: "10-06 11:07",
    read: true,
    slotKey: "c02|2026-10-10|09:04",
    courseId: "c02",
    date: "2026-10-10",
    time: "09:04",
  },
  {
    id: "i5",
    kind: "공지",
    title: "골프장 계정 보관 정책 안내",
    body: "등록한 골프장 계정은 암호화되어 보관되며 탈퇴 시 즉시 파기됩니다.",
    at: "10-04 10:00",
    read: true,
  },
  {
    id: "i6",
    kind: "취소티",
    title: "가온 파크 CC 취소티",
    body: "10월 9일 (금) 11:20 레이크 코스, 164,000원",
    at: "10-03 15:41",
    read: true,
    slotKey: "c08|2026-10-09|11:20",
    courseId: "c08",
    date: "2026-10-09",
    time: "11:20",
  },
];

/* 시연 푸시로 도착하는 취소티. 이미 알림함에 있는 자리는 다시 추가하지 않는다. */
export const DEMO_PUSH_POOL: Array<Omit<InboxItem, "id" | "at" | "read">> = [
  {
    kind: "취소티",
    title: "은행나무 CC 취소티",
    body: "10월 10일 (토) 08:40 레이크 코스, 172,000원",
    slotKey: "c05|2026-10-10|08:40",
    courseId: "c05",
    date: "2026-10-10",
    time: "08:40",
  },
  {
    kind: "취소티",
    title: "가온 파크 CC 취소티",
    body: "10월 11일 (일) 13:06 밸리 코스, 226,000원",
    slotKey: "c08|2026-10-11|13:06",
    courseId: "c08",
    date: "2026-10-11",
    time: "13:06",
  },
  {
    kind: "취소티",
    title: "블루힐 CC 취소티",
    body: "10월 13일 (화) 06:48 레이크 코스, 138,000원",
    slotKey: "c01|2026-10-13|06:48",
    courseId: "c01",
    date: "2026-10-13",
    time: "06:48",
  },
];

/* ---------- 관리자 ---------- */

export const MONITOR_LOGS: MonitorLog[] = [
  { id: "l1", at: "10-07 09:40", courseId: "c12", level: "오류", message: "로그인 선택자 불일치 (#userId 요소 없음). 홈페이지 개편 의심" },
  { id: "l2", at: "10-07 09:35", courseId: "c13", level: "오류", message: "로그인 후 세션 쿠키 미발급. 로그인 버튼 선택자 확인 필요" },
  { id: "l3", at: "10-07 09:20", courseId: "c15", level: "경고", message: "티타임 조회 응답 지연 (12.4초). 프록시 교체 후 재시도" },
  { id: "l4", at: "10-07 09:05", courseId: "c09", level: "경고", message: "시간 필드 형식 변경 (HHmm 에서 HH:mm). 파싱 3건 누락" },
  { id: "l5", at: "10-07 08:50", courseId: "c12", level: "오류", message: "로그인 선택자 불일치 (#userId 요소 없음). 연속 14회 실패" },
  { id: "l6", at: "10-07 08:35", courseId: "c17", level: "경고", message: "그린피 필드 비어 있음. 코스 단위 파라미터 누락 2건" },
  { id: "l7", at: "10-07 08:10", courseId: "c13", level: "오류", message: "로그인 후 세션 쿠키 미발급. 연속 9회 실패" },
  { id: "l8", at: "10-07 07:48", courseId: "c15", level: "경고", message: "티타임 조회 타임아웃 (30초). 재시도 2회 후 성공" },
  { id: "l9", at: "10-07 06:55", courseId: "c09", level: "경고", message: "예약 마감 표기가 이미지로 변경되어 마감 판별 불가 4건" },
  { id: "l10", at: "10-06 21:14", courseId: "c12", level: "오류", message: "마지막 정상 수집. 이후 로그인 단계에서 반복 실패" },
];

export const PROXY_SUMMARY = {
  availability: 97.0,
  pools: [
    { name: "수도권 풀", healthy: 15, total: 15 },
    { name: "영남 풀", healthy: 10, total: 10 },
    { name: "호남 제주 풀", healthy: 7, total: 8 },
  ],
};

export const INTERVAL_OPTIONS = [
  { minutes: 5, cost: 384000 },
  { minutes: 2, cost: 812000 },
  { minutes: 1, cost: 1436000 },
];

export const INITIAL_PUSH_HISTORY: PushRecord[] = [
  { id: "p1", at: "10-04 10:00", target: "전체", title: "골프장 계정 보관 정책 안내", body: "등록한 골프장 계정은 암호화되어 보관되며 탈퇴 시 즉시 파기됩니다.", recipients: 7 },
  { id: "p2", at: "10-02 17:30", target: "경기 즐겨찾기", title: "경기권 취소티 알림 개선", body: "경기 지역 골프장의 취소티 감지 주기를 단축했습니다.", recipients: 4 },
  { id: "p3", at: "09-26 09:00", target: "블루힐 CC 즐겨찾기", title: "블루힐 CC 예약 사이트 개편 안내", body: "예약 사이트 개편으로 일부 티타임이 늦게 반영될 수 있습니다.", recipients: 3 },
  { id: "p4", at: "09-19 14:20", target: "전체", title: "추석 연휴 티타임 오픈 일정", body: "연휴 기간 티타임은 골프장별 오픈 일정에 따라 순차 반영됩니다.", recipients: 7 },
  { id: "p5", at: "09-08 11:05", target: "강원 즐겨찾기", title: "강원권 수집 지연 안내", body: "바람재 CC의 수집이 지연되고 있어 복구 중입니다.", recipients: 2 },
];

/* ---------- 골프장 설정 ---------- */

export function defaultConfig(c: Course): CourseConfig {
  const broken = c.status === "오류";
  return {
    name: c.name,
    region: c.region,
    layouts: c.layouts.join(", "),
    domain: c.domain,
    loginKind: c.loginKind,
    selId: broken ? "input[name=usr_id]" : "#userId",
    selPw: broken ? "input[name=usr_pw]" : "#userPw",
    selBtn: broken ? "a.btn-signin" : "button.btn-login",
    apiDate: "playDate",
    apiTime: c.status === "점검 필요" ? "teeTm" : "teeTime",
    apiCourse: "courseCd",
    apiFee: "greenFee",
    bookingPattern: "/reserve/step2?date={date}&time={time}&course={course}",
  };
}

export interface TestStep {
  label: string;
  ok: boolean;
  message: string;
}

export interface TestResult {
  steps: TestStep[];
  preview: Array<{ time: string; layout: string; fee: string; status: string }>;
}

export function runConfigTest(c: Course, config?: CourseConfig): TestResult {
  /* 오류 골프장은 선택자를 올바른 값으로 고치면 시험 실행이 통과한다 */
  const fixed = (c.id === "c12" || c.id === "c13") && config?.selId === "#userId" && config?.selBtn === "button.btn-login";
  const blank = config ? [config.selId, config.selPw, config.selBtn].some((v) => v.trim() === "") : false;
  const okLogin: TestStep = { label: "로그인", ok: true, message: "로그인 성공 (412ms)" };
  const rows = getTeeTimes(c.id, addDays(TODAY, 1))
    .slice(0, 4)
    .map((s) => ({ time: s.time, layout: s.layout, fee: s.fee.toLocaleString("ko-KR"), status: s.status }));

  if (blank) {
    return {
      steps: [
        { label: "로그인", ok: false, message: "로그인 Form Selector가 비어 있습니다" },
        { label: "티타임 조회", ok: false, message: "이전 단계 실패로 건너뜀" },
        { label: "파싱 결과", ok: false, message: "조회된 데이터 없음" },
      ],
      preview: [],
    };
  }
  if ((c.id === "c12" || c.id === "c13") && !fixed) {
    return {
      steps: [
        {
          label: "로그인",
          ok: false,
          message:
            c.id === "c12"
              ? "선택자 input[name=usr_id] 요소를 찾을 수 없습니다"
              : "로그인 후 세션 쿠키가 발급되지 않았습니다",
        },
        { label: "티타임 조회", ok: false, message: "이전 단계 실패로 건너뜀" },
        { label: "파싱 결과", ok: false, message: "조회된 데이터 없음" },
      ],
      preview: [],
    };
  }
  if (c.id === "c15") {
    return {
      steps: [
        okLogin,
        { label: "티타임 조회", ok: false, message: "응답 시간 초과 (30초). 프록시 지연 의심" },
        { label: "파싱 결과", ok: false, message: "조회된 데이터 없음" },
      ],
      preview: [],
    };
  }
  if (c.id === "c09") {
    return {
      steps: [
        okLogin,
        { label: "티타임 조회", ok: true, message: "응답 200 (1.8초), 9건" },
        { label: "파싱 결과", ok: false, message: "time 필드 형식 불일치 3건 (HHmm)" },
      ],
      preview: rows.slice(0, 2),
    };
  }
  return {
    steps: [
      okLogin,
      { label: "티타임 조회", ok: true, message: `응답 200 (1.${(c.id.charCodeAt(2) % 7) + 2}초), ${rows.length + 5}건` },
      { label: "파싱 결과", ok: true, message: `${rows.length + 5}건 파싱 완료` },
    ],
    preview: rows,
  };
}
