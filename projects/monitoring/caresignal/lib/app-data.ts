import { PHOTO } from "@/projects/monitoring/caresignal/lib/photos";
import type {
  AppNotification,
  Guardian,
  RiskEvent,
  SafetyStatus,
  VisitRecord,
} from "@/projects/monitoring/caresignal/lib/types";

export const TODAY_LABEL = "2026년 7월 28일 화요일";
export const TODAY_SHORT = "7월 28일";

export const user = {
  name: "김순자",
  age: 78,
  dong: "성북구 정릉2동",
  address: "성북구 정릉로 148, 한빛아파트 3동 502호",
  phone: "010-4471-2938",
  joinedAt: "2025년 11월 12일",
  agency: "한빛종합사회복지관",
  manager: "정다은 사회복지사",
  managerPhone: "02-914-3370",
  carryPosition: "바지 앞주머니",
};

export const guardians: Guardian[] = [
  {
    id: "g1",
    name: "김미경",
    relation: "장녀",
    phone: "010-3428-7712",
    order: 1,
    sharing: true,
  },
  {
    id: "g2",
    name: "김성호",
    relation: "차남",
    phone: "010-2287-4106",
    order: 2,
    sharing: true,
  },
  {
    id: "g3",
    name: "정다은",
    relation: "복지관 담당자",
    phone: "02-914-3370",
    order: 3,
    sharing: false,
  },
];

export const safety = {
  status: "safe" as SafetyStatus,
  headline: "지금은 안전합니다",
  detail: "2분 전 정상 신호를 받았습니다. 오늘 감지된 위험 신호는 없습니다.",
  since: "오전 6시 20분부터 연속 감지 중",
  lastSignal: "2분 전",
};

export const todayActivity = {
  steps: 3482,
  stepGoal: 5000,
  distanceKm: 2.4,
  activeMinutes: 112,
  restMinutes: 386,
  /** 시간대별 걸음 수. 06시부터 21시까지. */
  hourly: [
    { hour: 6, steps: 120 },
    { hour: 7, steps: 486 },
    { hour: 8, steps: 640 },
    { hour: 9, steps: 812 },
    { hour: 10, steps: 305 },
    { hour: 11, steps: 88 },
    { hour: 12, steps: 210 },
    { hour: 13, steps: 46 },
    { hour: 14, steps: 0 },
    { hour: 15, steps: 0 },
    { hour: 16, steps: 394 },
    { hour: 17, steps: 381 },
    { hour: 18, steps: 0 },
    { hour: 19, steps: 0 },
    { hour: 20, steps: 0 },
    { hour: 21, steps: 0 },
  ],
};

export const weekSteps = [
  { day: "월", date: "7/20", steps: 4210 },
  { day: "화", date: "7/21", steps: 3880 },
  { day: "수", date: "7/22", steps: 2140 },
  { day: "목", date: "7/23", steps: 4620 },
  { day: "금", date: "7/24", steps: 5180 },
  { day: "토", date: "7/25", steps: 2960 },
  { day: "일", date: "7/26", steps: 1740 },
];

export const monthSteps = [
  { label: "6월 1주", steps: 26400 },
  { label: "6월 2주", steps: 24180 },
  { label: "6월 3주", steps: 21960 },
  { label: "6월 4주", steps: 23540 },
  { label: "7월 1주", steps: 25120 },
  { label: "7월 2주", steps: 22380 },
  { label: "7월 3주", steps: 24730 },
  { label: "7월 4주", steps: 20260 },
];

export const sensors = [
  { key: "accel", label: "가속도 센서", state: "정상", ok: true },
  { key: "gyro", label: "자이로 센서", state: "정상", ok: true },
  { key: "gps", label: "위치 정보", state: "정상", ok: true },
  { key: "battery", label: "배터리", state: "68%", ok: true },
];

/** 홈 화면 지도와 위치 화면이 공유하는 현재 위치 요약. */
export const location = {
  place: "한빛근린공원 동문",
  detail: "자택에서 340m",
  updated: "12분 전",
  inSafeZone: true,
  safeZoneName: "정릉2동 생활권",
  safeZoneRadius: "반경 800m",
  todayDistanceKm: 2.4,
  todayPlaces: 4,
};

export const visits: VisitRecord[] = [
  {
    id: "v1",
    place: "한빛근린공원",
    category: "산책",
    timeLabel: "오전 9시 12분",
    stayLabel: "42분 머무름",
    distanceLabel: "자택에서 340m",
    photoId: PHOTO.parkPath,
    photoAlt: "큰 나무가 줄지어 선 근린공원 산책로",
  },
  {
    id: "v2",
    place: "정릉시장 입구",
    category: "장보기",
    timeLabel: "오전 10시 40분",
    stayLabel: "28분 머무름",
    distanceLabel: "자택에서 620m",
    photoId: PHOTO.shopStreet,
    photoAlt: "차양과 파라솔이 늘어선 동네 상가 거리",
  },
  {
    id: "v3",
    place: "정릉로 골목길",
    category: "이동",
    timeLabel: "오전 11시 24분",
    stayLabel: "지나감",
    distanceLabel: "자택에서 180m",
    photoId: PHOTO.alley,
    photoAlt: "낮은 주택이 이어진 좁은 골목과 1층 상점",
  },
  {
    id: "v4",
    place: "정릉2동 경로당",
    category: "모임",
    timeLabel: "오후 4시 05분",
    stayLabel: "1시간 12분 머무름",
    distanceLabel: "자택에서 240m",
    photoId: PHOTO.parkBench,
    photoAlt: "나무 그늘 아래 벤치 두 개가 놓인 쉼터",
  },
];

export const fallEvent = {
  detectedAt: "오후 2시 22분",
  place: "정릉로 12길 인도",
  detail: "자택에서 210m 지점",
  impact: "충격 3.4G, 이후 8초간 움직임 없음",
  countdownSeconds: 25,
  notifyTargets: ["김미경 (장녀)", "김성호 (차남)", "한빛종합사회복지관"],
};

export const riskEvents: RiskEvent[] = [
  {
    id: "e1",
    kind: "fall",
    at: "07-26 14:22",
    dayLabel: "7월 26일",
    timeLabel: "오후 2시 22분",
    place: "정릉로 12길 인도",
    detail: "낙상 의심 신호를 감지했고 본인 확인으로 종료했습니다.",
    state: "dismissed",
    status: "caution",
  },
  {
    id: "e2",
    kind: "geofence",
    at: "07-24 16:48",
    dayLabel: "7월 24일",
    timeLabel: "오후 4시 48분",
    place: "정릉역 3번 출구",
    detail: "생활권 경계에서 1.2km 벗어나 보호자에게 알렸습니다.",
    state: "resolved",
    status: "caution",
  },
  {
    id: "e3",
    kind: "inactivity",
    at: "07-21 13:10",
    dayLabel: "7월 21일",
    timeLabel: "오후 1시 10분",
    place: "자택",
    detail: "4시간 동안 움직임이 없어 확인 알림을 보냈습니다.",
    state: "resolved",
    status: "caution",
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    kind: "inactivity",
    title: "2시간째 움직임이 없습니다",
    body: "오후 1시 이후 활동이 감지되지 않았습니다. 가벼운 스트레칭을 권해 드립니다.",
    dayLabel: "오늘",
    timeLabel: "오후 3시 04분",
    read: false,
  },
  {
    id: "n2",
    kind: "report",
    title: "7월 넷째 주 건강 리포트가 도착했습니다",
    body: "지난주보다 걸음 수가 12% 줄었습니다. 활동 패턴 변화를 확인해 보세요.",
    dayLabel: "오늘",
    timeLabel: "오전 8시 00분",
    read: false,
  },
  {
    id: "n3",
    kind: "geofence",
    title: "생활권으로 돌아왔습니다",
    body: "정릉2동 생활권 안으로 복귀했습니다. 보호자에게 복귀 알림이 발송되었습니다.",
    dayLabel: "오늘",
    timeLabel: "오전 11시 52분",
    read: true,
    sentToGuardian: "김미경",
  },
  {
    id: "n4",
    kind: "fall",
    title: "낙상 의심 신호를 확인했습니다",
    body: "본인 확인으로 종료되어 긴급 연락은 발송되지 않았습니다.",
    dayLabel: "7월 26일",
    timeLabel: "오후 2시 23분",
    read: true,
  },
  {
    id: "n5",
    kind: "geofence",
    title: "생활권을 벗어났습니다",
    body: "정릉역 3번 출구에서 경계 밖 1.2km 지점이 확인되어 보호자 2명에게 알렸습니다.",
    dayLabel: "7월 24일",
    timeLabel: "오후 4시 48분",
    read: true,
    sentToGuardian: "김미경, 김성호",
  },
  {
    id: "n6",
    kind: "sos",
    title: "긴급 도움 요청이 접수되었습니다",
    body: "복지관 담당자가 12분 만에 현장에 도착해 상황이 종료되었습니다.",
    dayLabel: "7월 22일",
    timeLabel: "오후 6시 31분",
    read: true,
    sentToGuardian: "김미경, 한빛종합사회복지관",
  },
  {
    id: "n7",
    kind: "inactivity",
    title: "4시간 동안 움직임이 없었습니다",
    body: "확인 알림에 응답이 없어 보호자에게 안부 확인을 요청했습니다.",
    dayLabel: "7월 21일",
    timeLabel: "오후 1시 10분",
    read: true,
    sentToGuardian: "김미경",
  },
  {
    id: "n8",
    kind: "system",
    title: "휴대 위치 설정이 저장되었습니다",
    body: "스마트폰 휴대 위치를 바지 앞주머니로 저장했습니다. 감지 정확도가 조정됩니다.",
    dayLabel: "7월 20일",
    timeLabel: "오전 9시 41분",
    read: true,
  },
];

export const sosHistory = [
  {
    id: "s1",
    dayLabel: "7월 22일",
    timeLabel: "오후 6시 31분",
    place: "정릉로 12길 인도",
    result: "복지관 담당자 현장 확인",
    elapsed: "12분 만에 도착",
  },
  {
    id: "s2",
    dayLabel: "5월 9일",
    timeLabel: "오전 11시 07분",
    place: "정릉시장 앞",
    result: "장녀 김미경 통화 후 종료",
    elapsed: "3분 만에 통화",
  },
];

export const sosContacts = [
  { id: "c1", name: "김미경", relation: "장녀", phone: "010-3428-7712" },
  { id: "c2", name: "김성호", relation: "차남", phone: "010-2287-4106" },
  { id: "c3", name: "한빛종합사회복지관", relation: "담당 기관", phone: "02-914-3370" },
  { id: "c4", name: "119 안전신고센터", relation: "긴급 신고", phone: "119" },
];

/** 건강 리포트 — 주간/월간 두 벌의 완성된 데이터. */
export const report = {
  weekly: {
    rangeLabel: "7월 20일 - 7월 26일",
    score: 74,
    scoreDelta: -6,
    summary:
      "걸음 수가 지난주보다 12% 줄었고, 오후 시간대 활동이 특히 짧아졌습니다. 낙상 의심 1건은 본인 확인으로 종료되었습니다.",
    stats: [
      { label: "일평균 걸음", value: "3,533", unit: "보", delta: "-478보" },
      { label: "일평균 이동", value: "2.3", unit: "km", delta: "-0.4km" },
      { label: "일평균 활동", value: "1시간 54분", unit: "", delta: "-22분" },
      { label: "외출한 날", value: "6", unit: "일", delta: "-1일" },
    ],
    events: [
      { label: "낙상 의심", count: 1, tone: "caution" as const },
      { label: "생활권 이탈", count: 1, tone: "caution" as const },
      { label: "장시간 미활동", count: 2, tone: "caution" as const },
      { label: "긴급 요청", count: 0, tone: "safe" as const },
    ],
    trend: [
      { label: "6월 4주", value: 24 },
      { label: "7월 1주", value: 25 },
      { label: "7월 2주", value: 22 },
      { label: "7월 3주", value: 25 },
      { label: "7월 4주", value: 20 },
    ],
    pattern: [
      { label: "오전 (6-12시)", ratio: 62, note: "산책 시간대 유지" },
      { label: "오후 (12-18시)", ratio: 27, note: "지난주보다 18% 감소" },
      { label: "저녁 (18-24시)", ratio: 11, note: "이전과 비슷" },
    ],
    comment:
      "지난 4주 중 이번 주 활동량이 가장 낮습니다. 오후 시간대에 짧은 산책을 한 번 더 넣으면 지난달 평균을 회복할 수 있습니다. 낙상 의심 신호가 있었던 정릉로 12길은 노면이 고르지 않아 우회 경로를 권해 드립니다.",
  },
  monthly: {
    rangeLabel: "2026년 7월",
    score: 79,
    scoreDelta: 2,
    summary:
      "7월 전체로는 6월보다 활동량이 3% 늘었습니다. 다만 마지막 주에 감소 폭이 커 다음 주 초 확인이 필요합니다.",
    stats: [
      { label: "일평균 걸음", value: "3,318", unit: "보", delta: "+96보" },
      { label: "일평균 이동", value: "2.2", unit: "km", delta: "+0.1km" },
      { label: "일평균 활동", value: "1시간 47분", unit: "", delta: "+4분" },
      { label: "외출한 날", value: "26", unit: "일", delta: "+2일" },
    ],
    events: [
      { label: "낙상 의심", count: 2, tone: "caution" as const },
      { label: "생활권 이탈", count: 3, tone: "caution" as const },
      { label: "장시간 미활동", count: 5, tone: "caution" as const },
      { label: "긴급 요청", count: 1, tone: "danger" as const },
    ],
    trend: [
      { label: "3월", value: 21 },
      { label: "4월", value: 23 },
      { label: "5월", value: 22 },
      { label: "6월", value: 24 },
      { label: "7월", value: 25 },
    ],
    pattern: [
      { label: "오전 (6-12시)", ratio: 58, note: "가장 안정적인 시간대" },
      { label: "오후 (12-18시)", ratio: 31, note: "6월 대비 4% 증가" },
      { label: "저녁 (18-24시)", ratio: 11, note: "일몰 후 외출은 거의 없음" },
    ],
    comment:
      "6월보다 외출한 날이 2일 늘었고 오후 활동 비중도 회복되는 흐름입니다. 긴급 요청 1건은 현장 확인 후 종료되었으며, 같은 시간대에 반복되는 신호는 없었습니다.",
  },
};

export const onboardingPermissions = [
  {
    key: "location",
    label: "위치 정보",
    body: "생활권 이탈과 긴급 상황 위치 전송에 사용합니다.",
    required: true,
  },
  {
    key: "motion",
    label: "동작 및 피트니스",
    body: "가속도, 자이로 값으로 낙상과 활동량을 감지합니다.",
    required: true,
  },
  {
    key: "notification",
    label: "알림",
    body: "위험 감지 확인과 보호자 발송 결과를 알려 드립니다.",
    required: true,
  },
  {
    key: "contacts",
    label: "연락처",
    body: "비상 연락처를 빠르게 등록할 때만 사용합니다.",
    required: false,
  },
];

export const carryPositions = [
  { key: "pocket", label: "바지 앞주머니", note: "가장 정확도가 높습니다" },
  { key: "bag", label: "가방 안", note: "충격 감지가 약해질 수 있습니다" },
  { key: "jacket", label: "겉옷 안주머니", note: "정확도가 보통입니다" },
  { key: "hand", label: "손에 들고 다님", note: "오감지가 늘 수 있습니다" },
];

export const terms = [
  { key: "service", label: "서비스 이용약관", required: true },
  { key: "privacy", label: "개인정보 수집 및 이용 동의", required: true },
  { key: "location", label: "위치기반서비스 이용약관", required: true },
  { key: "guardian", label: "보호자 정보 제3자 제공 동의", required: true },
  { key: "marketing", label: "복지 소식 및 프로그램 안내 수신", required: false },
];
