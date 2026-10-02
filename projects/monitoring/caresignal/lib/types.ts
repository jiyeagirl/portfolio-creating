export type SafetyStatus = "safe" | "caution" | "danger";

/** 서비스가 감지하는 위험 이벤트 4종. */
export type EventKind = "fall" | "geofence" | "inactivity" | "sos";

/** 이벤트 처리 상태. 관리자 콘솔과 사용자 앱이 같은 값을 공유한다. */
export type EventState = "detecting" | "notified" | "responding" | "resolved" | "dismissed";

export interface RiskEvent {
  id: string;
  kind: EventKind;
  /** "07-28 14:22" 형태의 표시용 값. mock 데이터라 Date 객체를 쓰지 않는다. */
  at: string;
  dayLabel: string;
  timeLabel: string;
  place: string;
  detail: string;
  state: EventState;
  status: SafetyStatus;
}

export interface Guardian {
  id: string;
  name: string;
  relation: string;
  phone: string;
  /** 알림 우선순위. 1이 1차 수신자. */
  order: number;
  sharing: boolean;
}

export interface VisitRecord {
  id: string;
  place: string;
  category: string;
  timeLabel: string;
  stayLabel: string;
  distanceLabel: string;
  photoId: number;
  photoAlt: string;
}

export interface AppNotification {
  id: string;
  kind: EventKind | "report" | "system";
  title: string;
  body: string;
  timeLabel: string;
  dayLabel: string;
  read: boolean;
  /** 보호자에게 발송된 알림인지 여부. 발송 이력 필터에 쓰인다. */
  sentToGuardian?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  age: number;
  gender: "남" | "여";
  dong: string;
  address: string;
  phone: string;
  guardian: string;
  guardianRelation: string;
  guardianPhone: string;
  status: SafetyStatus;
  account: "active" | "paused" | "pending";
  lastSignal: string;
  battery: number;
  todaySteps: number;
  weekEvents: number;
  safeZone: string;
  joinedAt: string;
  manager: string;
  /** 지도 마커 좌표(0-100 정규화). 실제 위경도 대신 mock 좌표를 쓴다. */
  x: number;
  y: number;
}

export interface AdminEvent {
  id: string;
  userId: string;
  userName: string;
  kind: EventKind;
  at: string;
  place: string;
  state: EventState;
  status: SafetyStatus;
  responder: string;
  elapsed: string;
  note: string;
}
