import coworkingColorful from "@/projects/platform/studyspot/assets/coworking-colorful-lounge-windows.jpg";
import coworkingBrick from "@/projects/platform/studyspot/assets/coworking-brick-building-exterior.jpg";
import coworkingHexagon from "@/projects/platform/studyspot/assets/coworking-hexagon-pod-overhead.jpg";
import officeDesk from "@/projects/platform/studyspot/assets/office-desk-laptop-plants.jpg";
import officeWhiteboard from "@/projects/platform/studyspot/assets/office-whiteboard-notes.jpg";
import studyroomWood from "@/projects/platform/studyspot/assets/studyroom-wood-table-whiteboard.jpg";
import studyroomGroup from "@/projects/platform/studyspot/assets/studyroom-group-tv-screen.jpg";
import type {
  AiContentDraft,
  AutomationRule,
  Branch,
  ContentItem,
  FaultLog,
  FixedSeat,
  FixedSeatContract,
  FreeSeat,
  IotDevice,
  Pass,
  PaymentRecord,
  Reservation,
  StudyRoom,
  StudyspotUser,
  UsageSession,
} from "@/projects/platform/studyspot/lib/types";

/* ── 사용자 ── */

export const CURRENT_USER: StudyspotUser = {
  name: "한지원",
  email: "jiwon.han@gmail.com",
  phone: "010-8823-4471",
  point: 4200,
  couponCount: 2,
};

/* ── 지점 ── */

export const BRANCHES: Branch[] = [
  {
    id: "gangnam",
    name: "StudySpot 강남 본점",
    region: "서울",
    address: "서울 강남구 테헤란로 123",
    openTime: "07:00",
    closeTime: "24:00",
    isOpenNow: true,
    hasFreeSeat: true,
    hasFixedSeat: true,
    hasStudyRoom: true,
    freeSeatTotal: 84,
    freeSeatAvailable: 22,
    favorited: true,
    photo: coworkingColorful,
    ownerName: "김도현",
    monthlyRevenue: 18500000,
    status: "operating",
  },
  {
    id: "hongdae",
    name: "StudySpot 홍대점",
    region: "서울",
    address: "서울 마포구 양화로 45",
    openTime: "00:00",
    closeTime: "24:00",
    isOpenNow: true,
    hasFreeSeat: true,
    hasFixedSeat: true,
    hasStudyRoom: true,
    freeSeatTotal: 62,
    freeSeatAvailable: 5,
    favorited: false,
    photo: coworkingBrick,
    ownerName: "이서준",
    monthlyRevenue: 14200000,
    status: "operating",
  },
  {
    id: "pangyo",
    name: "StudySpot 판교점",
    region: "경기",
    address: "경기 성남시 분당구 판교역로 231",
    openTime: "08:00",
    closeTime: "23:00",
    isOpenNow: true,
    hasFreeSeat: true,
    hasFixedSeat: false,
    hasStudyRoom: true,
    freeSeatTotal: 48,
    freeSeatAvailable: 31,
    favorited: true,
    photo: coworkingHexagon,
    ownerName: "박지민",
    monthlyRevenue: 9800000,
    status: "operating",
  },
  {
    id: "seomyeon",
    name: "StudySpot 부산 서면점",
    region: "부산",
    address: "부산 부산진구 서면로 12",
    openTime: "09:00",
    closeTime: "22:00",
    isOpenNow: false,
    hasFreeSeat: true,
    hasFixedSeat: true,
    hasStudyRoom: false,
    freeSeatTotal: 40,
    freeSeatAvailable: 0,
    favorited: false,
    photo: officeDesk,
    ownerName: "최윤아",
    monthlyRevenue: 7600000,
    status: "operating",
  },
  {
    id: "dongseongno",
    name: "StudySpot 대구 동성로점",
    region: "대구",
    address: "대구 중구 동성로 88",
    openTime: "09:00",
    closeTime: "22:00",
    isOpenNow: false,
    hasFreeSeat: true,
    hasFixedSeat: false,
    hasStudyRoom: false,
    freeSeatTotal: 0,
    freeSeatAvailable: 0,
    favorited: false,
    photo: officeWhiteboard,
    ownerName: "정하람",
    monthlyRevenue: 0,
    status: "preparing",
  },
];

export const branchById = (id: string) => BRANCHES.find((b) => b.id === id);

/* ── 자유석 (강남 본점 배치도 기준) ── */

export const FREE_SEATS: FreeSeat[] = [
  { id: "a1", branchId: "gangnam", label: "A-01", zone: "1층 창가석", status: "available", hasPower: true, hasMonitor: false },
  { id: "a2", branchId: "gangnam", label: "A-02", zone: "1층 창가석", status: "occupied", hasPower: true, hasMonitor: false },
  { id: "a3", branchId: "gangnam", label: "A-03", zone: "1층 창가석", status: "occupied", hasPower: true, hasMonitor: true },
  { id: "a4", branchId: "gangnam", label: "A-04", zone: "1층 창가석", status: "available", hasPower: true, hasMonitor: false },
  { id: "a5", branchId: "gangnam", label: "A-05", zone: "1층 창가석", status: "reserved", hasPower: true, hasMonitor: false },
  { id: "a6", branchId: "gangnam", label: "A-06", zone: "1층 창가석", status: "available", hasPower: false, hasMonitor: false },
  { id: "b1", branchId: "gangnam", label: "B-01", zone: "1층 중앙 테이블", status: "available", hasPower: true, hasMonitor: true },
  { id: "b2", branchId: "gangnam", label: "B-02", zone: "1층 중앙 테이블", status: "occupied", hasPower: true, hasMonitor: true },
  { id: "b3", branchId: "gangnam", label: "B-03", zone: "1층 중앙 테이블", status: "available", hasPower: true, hasMonitor: false },
  { id: "b4", branchId: "gangnam", label: "B-04", zone: "1층 중앙 테이블", status: "reserved", hasPower: false, hasMonitor: false },
];

/* ── 스터디룸 ── */

export const STUDY_ROOMS: StudyRoom[] = [
  { id: "room-gangnam-1", branchId: "gangnam", name: "스터디룸 A", capacity: 4, hourlyPrice: 12000, photo: studyroomWood },
  { id: "room-gangnam-2", branchId: "gangnam", name: "스터디룸 B (대형)", capacity: 8, hourlyPrice: 20000, photo: studyroomGroup },
  { id: "room-hongdae-1", branchId: "hongdae", name: "스터디룸 1", capacity: 4, hourlyPrice: 11000, photo: studyroomWood },
  { id: "room-pangyo-1", branchId: "pangyo", name: "스터디룸 1", capacity: 6, hourlyPrice: 15000, photo: studyroomGroup },
];

/* ── 고정석 ── */

export const FIXED_SEATS: FixedSeat[] = [
  { id: "f1", branchId: "gangnam", label: "F-01", zone: "2층 고정석 존", status: "occupied", monthlyPrice: 189000 },
  { id: "f2", branchId: "gangnam", label: "F-02", zone: "2층 고정석 존", status: "occupied", monthlyPrice: 189000 },
  { id: "f3", branchId: "gangnam", label: "F-03", zone: "2층 고정석 존", status: "occupied", monthlyPrice: 189000 },
  { id: "f4", branchId: "gangnam", label: "F-04", zone: "2층 고정석 존", status: "available", monthlyPrice: 189000 },
  { id: "f5", branchId: "gangnam", label: "F-05", zone: "2층 고정석 존", status: "available", monthlyPrice: 199000 },
  { id: "f6", branchId: "gangnam", label: "F-06", zone: "2층 창가 고정석", status: "available", monthlyPrice: 219000 },
];

export const FIXED_SEAT_CONTRACTS: FixedSeatContract[] = [
  {
    id: "contract1",
    branchId: "gangnam",
    seatLabel: "F-03",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    monthlyPrice: 189000,
    remainingDays: 15,
    status: "expiringSoon",
  },
];

/* ── 이용권 ── */

export const PASSES: Pass[] = [
  {
    id: "pass4",
    name: "1시간 이용권",
    type: "time",
    remainingHours: 1,
    purchasedAt: "2025-06-14T00:00:00",
    expiresAt: "2025-06-30T00:00:00",
  },
  {
    id: "pass5",
    name: "2시간 이용권",
    type: "time",
    remainingHours: 2,
    purchasedAt: "2025-06-10T00:00:00",
    expiresAt: "2025-06-30T00:00:00",
  },
  {
    id: "pass1",
    name: "10시간 이용권",
    type: "time",
    remainingHours: 4,
    purchasedAt: "2025-05-20T00:00:00",
    expiresAt: "2025-06-30T00:00:00",
  },
  {
    id: "pass2",
    name: "1개월 자유석 정기권",
    type: "period",
    remainingDays: 12,
    purchasedAt: "2025-05-15T00:00:00",
    expiresAt: "2025-06-15T00:00:00",
  },
  {
    id: "pass3",
    name: "5시간 이용권",
    type: "time",
    remainingHours: 0,
    purchasedAt: "2025-02-10T00:00:00",
    expiresAt: "2025-03-10T00:00:00",
  },
];

/* ── 예약 · 결제 · 세션 ── */

export const RESERVATIONS: Reservation[] = [
  {
    id: "r1",
    kind: "studyRoom",
    branchId: "gangnam",
    label: "스터디룸 A",
    date: "2025-06-18",
    startTime: "19:00",
    endTime: "21:00",
    price: 24000,
    status: "upcoming",
  },
  {
    id: "r2",
    kind: "freeSeat",
    branchId: "gangnam",
    label: "A-03",
    date: "2025-06-15",
    startTime: "14:20",
    endTime: "18:20",
    price: 0,
    status: "inUse",
  },
  {
    id: "r3",
    kind: "studyRoom",
    branchId: "hongdae",
    label: "스터디룸 1",
    date: "2025-06-08",
    startTime: "10:00",
    endTime: "12:00",
    price: 22000,
    status: "completed",
  },
  {
    id: "r4",
    kind: "freeSeat",
    branchId: "pangyo",
    label: "P-14",
    date: "2025-05-30",
    startTime: "09:00",
    endTime: "13:00",
    price: 0,
    status: "completed",
  },
  {
    id: "r5",
    kind: "fixedSeat",
    branchId: "gangnam",
    label: "F-03",
    date: "2025-04-01",
    startTime: "00:00",
    endTime: "24:00",
    price: 189000,
    status: "completed",
  },
  {
    id: "r6",
    kind: "studyRoom",
    branchId: "gangnam",
    label: "스터디룸 B (대형)",
    date: "2025-03-22",
    startTime: "13:00",
    endTime: "15:00",
    price: 40000,
    status: "canceled",
  },
];

export const PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: "p1",
    item: "10시간 이용권",
    amount: 39000,
    method: "카카오페이",
    couponDiscount: 0,
    pointsUsed: 0,
    paidAt: "2025-05-20T11:12:00",
  },
  {
    id: "p2",
    item: "1개월 자유석 정기권",
    amount: 89000,
    method: "신용카드",
    couponDiscount: 5000,
    pointsUsed: 2000,
    paidAt: "2025-05-15T09:03:00",
  },
  {
    id: "p3",
    item: "스터디룸 A 2시간",
    amount: 24000,
    method: "네이버페이",
    couponDiscount: 0,
    pointsUsed: 0,
    paidAt: "2025-06-08T09:58:00",
  },
  {
    id: "p4",
    item: "고정석 F-03 (4월)",
    amount: 189000,
    method: "신용카드",
    couponDiscount: 10000,
    pointsUsed: 0,
    paidAt: "2025-04-01T08:30:00",
  },
  {
    id: "p5",
    item: "스터디룸 B 2시간",
    amount: 40000,
    method: "카카오페이",
    couponDiscount: 0,
    pointsUsed: 1500,
    paidAt: "2025-03-22T12:40:00",
  },
  {
    id: "p6",
    item: "5시간 이용권",
    amount: 19500,
    method: "신용카드",
    couponDiscount: 0,
    pointsUsed: 0,
    paidAt: "2025-02-10T15:20:00",
  },
];

export const CURRENT_SESSION: UsageSession = {
  branchId: "gangnam",
  seatLabel: "A-03",
  kind: "freeSeat",
  checkedInAt: "2025-06-15T14:20:00",
  plannedEndAt: "2025-06-15T18:20:00",
};

/* ── 점주 콘텐츠 관리 (강남 본점) ── */

export const CONTENT_ITEMS: ContentItem[] = [
  {
    id: "c1",
    kind: "notice",
    title: "6월 정기 소독 안내",
    body: "6월 20일(금) 새벽 2시부터 4시까지 정기 소독으로 일시 이용이 제한됩니다.",
    branchScope: "gangnam",
    startAt: "2025-06-12T00:00:00",
    endAt: "2025-06-21T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "c2",
    kind: "event",
    title: "여름맞이 자유석 정기권 15% 할인",
    body: "6월 한 달간 1개월 자유석 정기권을 15% 할인된 가격에 만나보세요.",
    branchScope: "gangnam",
    startAt: "2025-06-01T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "c3",
    kind: "banner",
    title: "신규 스터디룸 B 오픈",
    body: "8인실 대형 스터디룸 B가 새롭게 문을 열었습니다.",
    branchScope: "gangnam",
    startAt: "2025-05-01T00:00:00",
    endAt: "2025-05-31T00:00:00",
    status: "ended",
    visible: false,
  },
  {
    id: "c4",
    kind: "faq",
    title: "고정석 연장은 언제까지 신청해야 하나요?",
    body: "이용 종료일 7일 전까지 앱에서 연장 신청이 가능합니다.",
    branchScope: "gangnam",
    startAt: "2025-02-01T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "c5",
    kind: "faq",
    title: "이용권 환불은 어떻게 하나요?",
    body: "미사용 시간이 남은 이용권은 마이페이지에서 부분 환불 신청이 가능합니다.",
    branchScope: "gangnam",
    startAt: "2025-02-01T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "c6",
    kind: "popup",
    title: "7월 리뉴얼 공사 예고",
    body: "7월 첫째 주 1층 좌석 리뉴얼 공사가 예정되어 있습니다. 자세한 일정은 추후 안내됩니다.",
    branchScope: "gangnam",
    startAt: "2025-06-20T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "scheduled",
    visible: false,
  },
];

/* ── 점주 IoT 장비 (강남 본점) ── */

export const IOT_DEVICES: IotDevice[] = [
  { id: "d1", branchId: "gangnam", kind: "door", name: "정문 출입 게이트", status: "normal", reading: "정상 개폐", lastCheckedAt: "2025-06-15T14:00:00" },
  { id: "d2", branchId: "gangnam", kind: "hvac", name: "1층 냉난방기", status: "normal", reading: "24도 유지 중", lastCheckedAt: "2025-06-15T14:00:00" },
  { id: "d3", branchId: "gangnam", kind: "hvac", name: "2층 냉난방기", status: "warning", reading: "26도 (목표 24도)", lastCheckedAt: "2025-06-15T13:40:00" },
  { id: "d4", branchId: "gangnam", kind: "light", name: "1층 조명 그룹", status: "normal", reading: "자동 모드 켜짐", lastCheckedAt: "2025-06-15T14:00:00" },
  { id: "d5", branchId: "gangnam", kind: "cctv", name: "출입구 CCTV", status: "normal", reading: "녹화 중", lastCheckedAt: "2025-06-15T14:00:00" },
  { id: "d6", branchId: "gangnam", kind: "cctv", name: "2층 CCTV", status: "offline", reading: "연결 끊김", lastCheckedAt: "2025-06-15T09:12:00", firmwareVersion: "1.8.2", firmwareLatest: "2.0.0" },
  { id: "d7", branchId: "gangnam", kind: "airQuality", name: "공기질 센서", status: "warning", reading: "CO2 1120ppm (환기 권장)", lastCheckedAt: "2025-06-15T13:55:00" },
];

export const FAULT_LOGS: FaultLog[] = [
  { id: "fl1", deviceId: "d6", branchId: "gangnam", message: "2층 CCTV 연결 끊김", occurredAt: "2025-06-15T09:12:00", severity: "critical" },
  { id: "fl2", deviceId: "d3", branchId: "gangnam", message: "2층 냉난방기 목표 온도 미도달", occurredAt: "2025-06-15T13:40:00", severity: "warn" },
  { id: "fl3", deviceId: "d7", branchId: "gangnam", message: "공기질 센서 CO2 수치 상승", occurredAt: "2025-06-15T13:55:00", severity: "warn" },
  { id: "fl4", deviceId: "d2", branchId: "gangnam", message: "1층 냉난방기 필터 교체 알림", occurredAt: "2025-05-28T10:00:00", resolvedAt: "2025-05-29T11:00:00", severity: "info" },
  { id: "fl5", deviceId: "d1", branchId: "gangnam", message: "정문 게이트 일시 오작동", occurredAt: "2025-04-14T22:10:00", resolvedAt: "2025-04-14T22:40:00", severity: "critical" },
];

export const AUTOMATION_RULES: AutomationRule[] = [
  { id: "au1", branchId: "gangnam", name: "영업시간 자동 운영", kind: "door", schedule: "매일 07:00 개방 / 24:00 잠금", active: true, description: "영업 시작·종료 시간에 맞춰 출입문을 자동으로 개방·잠금합니다." },
  { id: "au2", branchId: "gangnam", name: "야간 조명 절전", kind: "light", schedule: "매일 24:00 ~ 06:00", active: true, description: "심야 시간대 공용 구역 조명을 50%로 낮춥니다." },
  { id: "au3", branchId: "gangnam", name: "혼잡 시간 냉방 강화", kind: "hvac", schedule: "평일 13:00 ~ 18:00", active: true, description: "좌석 이용률이 높은 시간대에 냉방 세기를 자동으로 높입니다." },
  { id: "au4", branchId: "gangnam", name: "예약 기반 스터디룸 조명", kind: "light", schedule: "예약 시작 10분 전 자동 점등", active: true, description: "스터디룸 예약 시작 10분 전 해당 룸 조명을 미리 켭니다." },
  { id: "au5", branchId: "gangnam", name: "긴급 전체 잠금", kind: "door", schedule: "수동 트리거 전용", active: false, description: "이상 상황 발생 시 전 출입문을 즉시 잠그는 긴급 제어입니다." },
];

/* ── 본사: 지점 통합 장비 (강남 IOT_DEVICES + 타 지점) ── */

export const HQ_DEVICES: IotDevice[] = [
  ...IOT_DEVICES,
  { id: "d8", branchId: "hongdae", kind: "door", name: "정문 출입 게이트", status: "normal", reading: "정상 개폐", lastCheckedAt: "2025-06-15T14:05:00" },
  { id: "d9", branchId: "hongdae", kind: "hvac", name: "냉난방기", status: "error", reading: "센서 응답 없음", lastCheckedAt: "2025-06-15T11:20:00", firmwareVersion: "1.6.0", firmwareLatest: "2.0.0" },
  { id: "d10", branchId: "hongdae", kind: "cctv", name: "출입구 CCTV", status: "normal", reading: "녹화 중", lastCheckedAt: "2025-06-15T14:05:00" },
  { id: "d11", branchId: "pangyo", kind: "door", name: "정문 출입 게이트", status: "normal", reading: "정상 개폐", lastCheckedAt: "2025-06-15T13:50:00" },
  { id: "d12", branchId: "pangyo", kind: "airQuality", name: "공기질 센서", status: "normal", reading: "CO2 620ppm", lastCheckedAt: "2025-06-15T13:50:00" },
  { id: "d13", branchId: "seomyeon", kind: "hvac", name: "냉난방기", status: "warning", reading: "23도 (목표 22도)", lastCheckedAt: "2025-06-15T12:30:00" },
  { id: "d14", branchId: "seomyeon", kind: "light", name: "조명 그룹", status: "normal", reading: "자동 모드 켜짐", lastCheckedAt: "2025-06-15T12:30:00" },
];

/* ── 본사: 통합 콘텐츠 배포 ── */

export const HQ_CONTENT: ContentItem[] = [
  {
    id: "hc1",
    kind: "notice",
    title: "전 지점 여름철 냉방 운영 기준 안내",
    body: "6월 한 달간 전 지점 실내 온도를 24도로 통일 운영합니다.",
    branchScope: "all",
    startAt: "2025-06-01T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "hc2",
    kind: "event",
    title: "전 지점 신규 회원 첫 결제 20% 할인",
    body: "StudySpot를 처음 이용하는 회원 대상 첫 결제 20% 할인 프로모션입니다.",
    branchScope: "all",
    startAt: "2025-05-01T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "hc3",
    kind: "banner",
    title: "대구 동성로점 7월 오픈 예정",
    body: "대구 첫 지점인 동성로점이 7월 오픈을 준비하고 있습니다.",
    branchScope: "dongseongno",
    startAt: "2025-06-10T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
  {
    id: "hc4",
    kind: "notice",
    title: "개인정보 처리방침 개정 안내",
    body: "이용자 위치정보 수집 범위가 2025.03.10자로 개정되었습니다.",
    branchScope: "all",
    startAt: "2025-03-10T00:00:00",
    endAt: "2025-06-30T00:00:00",
    status: "published",
    visible: true,
  },
];

/* ── 본사: AI 다국어 콘텐츠 초안 ── */

export const AI_DRAFTS: AiContentDraft[] = [
  {
    id: "ai1",
    kind: "event",
    tone: "친근한",
    sourceTitle: "여름맞이 자유석 정기권 15% 할인",
    sourceBody: "6월 한 달간 1개월 자유석 정기권을 15% 할인된 가격에 만나보세요.",
    targetLanguages: ["영어", "중국어(간체)", "일본어"],
    translations: [
      { language: "영어", title: "15% Off Monthly Free-Seat Pass This Summer", body: "Get 15% off the 1-month free-seat pass throughout June." },
      { language: "중국어(간체)", title: "夏季自由座位月卡8.5折优惠", body: "6月期间，自由座位月卡享受15%的折扣。" },
      { language: "일본어", title: "夏の月額フリー席パス15%オフ", body: "6月の1ヶ月間、フリー席月額パスを15%割引価格でご利用いただけます。" },
    ],
    createdAt: "2025-05-30T10:00:00",
  },
  {
    id: "ai2",
    kind: "notice",
    tone: "공식적인",
    sourceTitle: "전 지점 여름철 냉방 운영 기준 안내",
    sourceBody: "6월부터 8월까지 전 지점 실내 온도를 24도로 통일 운영합니다.",
    targetLanguages: ["영어", "중국어(간체)"],
    translations: [
      { language: "영어", title: "Summer Cooling Policy for All Branches", body: "From June to August, all branches will maintain an indoor temperature of 24°C." },
      { language: "중국어(간체)", title: "全门店夏季空调运营标准通知", body: "6月至8月，所有门店室内温度统一保持在24摄氏度。" },
    ],
    createdAt: "2025-05-28T15:20:00",
  },
  {
    id: "ai3",
    kind: "banner",
    tone: "활기찬",
    sourceTitle: "대구 동성로점 7월 오픈 예정",
    sourceBody: "대구 첫 지점인 동성로점이 7월 오픈을 준비하고 있습니다.",
    targetLanguages: ["영어"],
    translations: [
      { language: "영어", title: "Daegu Dongseongno Branch Opening in July", body: "Our first Daegu location is getting ready to open this July." },
    ],
    createdAt: "2025-06-10T09:30:00",
  },
];
