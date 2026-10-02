/** spec.md 3.1~3.3 전역에서 쓰는 핵심 도메인 타입. */

export type SafetyStatus = "safe" | "danger";

export type EventType = "fall" | "impact" | "stationary";

export type EventStatus = "active" | "acknowledged" | "resolved";

export type Worker = {
  id: string;
  name: string;
  role: string;
  siteId: string;
  status: SafetyStatus;
  battery: number;
  lastSignalMinAgo: number;
  todayEvents: number;
};

export type SiteEvent = {
  id: string;
  workerId: string;
  workerName: string;
  type: EventType;
  status: EventStatus;
  at: string;
  siteName: string;
  location: string;
  detail: string;
};

export type Site = {
  id: string;
  name: string;
  address: string;
  managerName: string;
  workerCount: number;
  activeEventCount: number;
  photoId: number;
};
