import type { EventType, Site, SiteEvent, Worker } from "./types";

/* 회사명은 워크스페이스 컨벤션에 따라 익명화한다(A건설, B산업 등). */

export const sites: Site[] = [
  {
    id: "site-1",
    name: "A건설 강남 현장",
    address: "서울특별시 강남구 테헤란로 421",
    managerName: "한지훈",
    workerCount: 34,
    activeEventCount: 1,
    photoId: 1033,
  },
  {
    id: "site-2",
    name: "B산업 인천 물류센터 신축",
    address: "인천광역시 서구 백범로 780",
    managerName: "오세연",
    workerCount: 21,
    activeEventCount: 0,
    photoId: 1048,
  },
  {
    id: "site-3",
    name: "C중공업 부산 조선소 2블록",
    address: "부산광역시 영도구 태종로 727",
    managerName: "배준혁",
    workerCount: 18,
    activeEventCount: 1,
    photoId: 1033,
  },
];

export const currentWorker: Worker = {
  id: "worker-me",
  name: "김도윤",
  role: "철골 설치공",
  siteId: "site-1",
  status: "safe",
  battery: 68,
  lastSignalMinAgo: 1,
  todayEvents: 0,
};

export const workers: Worker[] = [
  currentWorker,
  { id: "w-2", name: "박성민", role: "용접공", siteId: "site-1", status: "danger", battery: 41, lastSignalMinAgo: 0, todayEvents: 2 },
  { id: "w-3", name: "이하늘", role: "타워크레인 기사", siteId: "site-1", status: "safe", battery: 82, lastSignalMinAgo: 3, todayEvents: 0 },
  { id: "w-4", name: "정우진", role: "형틀목공", siteId: "site-1", status: "safe", battery: 55, lastSignalMinAgo: 6, todayEvents: 1 },
  { id: "w-5", name: "최서연", role: "안전관리자", siteId: "site-1", status: "safe", battery: 91, lastSignalMinAgo: 2, todayEvents: 0 },
  { id: "w-6", name: "강태민", role: "지게차 운전원", siteId: "site-2", status: "safe", battery: 76, lastSignalMinAgo: 4, todayEvents: 0 },
  { id: "w-7", name: "윤지호", role: "전기설비공", siteId: "site-2", status: "safe", battery: 63, lastSignalMinAgo: 5, todayEvents: 0 },
  { id: "w-8", name: "임서준", role: "용접공", siteId: "site-3", status: "danger", battery: 29, lastSignalMinAgo: 0, todayEvents: 3 },
  { id: "w-9", name: "한소율", role: "도장공", siteId: "site-3", status: "safe", battery: 88, lastSignalMinAgo: 7, todayEvents: 0 },
];

const EVENT_LABEL: Record<EventType, string> = {
  fall: "낙상 감지",
  impact: "강한 충격 감지",
  stationary: "장시간 정지 감지",
};

export function eventLabel(type: EventType) {
  return EVENT_LABEL[type];
}

export const events: SiteEvent[] = [
  {
    id: "ev-1",
    workerId: "w-2",
    workerName: "박성민",
    type: "fall",
    status: "active",
    at: "14:22:04",
    siteName: "A건설 강남 현장",
    location: "3층 철골 구조부 / B동 인근",
    detail: "충격 4.3G 감지 후 9초간 움직임 없음",
  },
  {
    id: "ev-2",
    workerId: "w-8",
    workerName: "임서준",
    type: "impact",
    status: "active",
    at: "14:09:31",
    siteName: "C중공업 부산 조선소 2블록",
    location: "2블록 선체 외판 작업대",
    detail: "충격 3.1G 감지, 본인 확인 대기 중",
  },
  {
    id: "ev-3",
    workerId: "w-4",
    workerName: "정우진",
    type: "stationary",
    status: "acknowledged",
    at: "13:40:12",
    siteName: "A건설 강남 현장",
    location: "지하 2층 형틀 작업 구역",
    detail: "18분간 이동 없음, 관리자 확인 완료",
  },
  {
    id: "ev-4",
    workerId: "w-8",
    workerName: "임서준",
    type: "fall",
    status: "resolved",
    at: "11:02:47",
    siteName: "C중공업 부산 조선소 2블록",
    location: "1블록 도크 계단",
    detail: "오감지로 본인이 취소, 5초 만에 종료",
  },
  {
    id: "ev-5",
    workerId: "w-3",
    workerName: "이하늘",
    type: "impact",
    status: "resolved",
    at: "10:15:03",
    siteName: "A건설 강남 현장",
    location: "타워크레인 조종실 진입로",
    detail: "충격 2.4G, 본인 확인으로 5초 내 종료",
  },
  {
    id: "ev-6",
    workerId: "w-6",
    workerName: "강태민",
    type: "stationary",
    status: "resolved",
    at: "09:48:20",
    siteName: "B산업 인천 물류센터 신축",
    location: "지게차 대기 구역",
    detail: "휴식 중으로 확인, 22분 후 정상 종료",
  },
];

export const notifications = [
  { id: "n-1", title: "박성민 님 낙상 의심 신호 감지", body: "3층 철골 구조부, 관리자에게 자동 통보됨", at: "14:22", read: false, type: "danger" as const },
  { id: "n-2", title: "오늘 안전 점검 일정 안내", body: "A건설 강남 현장, 오후 4시 정기 안전 점검", at: "13:00", read: false, type: "system" as const },
  { id: "n-3", title: "정우진 님 장시간 미활동 확인 완료", body: "관리자 최서연 님이 현장 확인 처리", at: "13:41", read: true, type: "notice" as const },
  { id: "n-4", title: "센서 캘리브레이션 완료", body: "스마트폰 거치 위치 기준으로 재보정됨", at: "08:31", read: true, type: "system" as const },
  { id: "n-5", title: "이번 주 무사고 현황", body: "A건설 강남 현장, 6일 연속 위험 이벤트 0건", at: "월요일 09:00", read: true, type: "notice" as const },
];
