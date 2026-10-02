/* 용인 보행길 제보 — 도메인 타입. spec.md의 IA 3종을 그대로 옮긴다. */

export type ScreenKey = "map" | "report" | "status";

/** 위험 유형 7종. spec.md 2-1의 목록과 1:1로 대응한다. */
export type HazardType =
  | "sidewalk"
  | "walkway"
  | "mobility"
  | "obstruction"
  | "streetlight"
  | "schoolzone"
  | "etc";

/** 처리 상태 4단계. 이 순서가 곧 진행 순서이고, 단계 트래커의 인덱스로 쓴다. */
export type ReportStatus = "received" | "reviewing" | "working" | "done";

export const STATUS_ORDER: ReportStatus[] = ["received", "reviewing", "working", "done"];

export type TimelineStep = {
  status: ReportStatus;
  /** 완료된 단계만 시각이 있다. 아직 오지 않은 단계는 null이다. */
  at: string | null;
  note: string;
};

export type Report = {
  id: string;
  /** 시민에게 보여 주는 접수번호. */
  code: string;
  type: HazardType;
  status: ReportStatus;
  title: string;
  /** 도로명 주소. */
  address: string;
  /** 주소만으로는 위치가 안 잡히는 제보가 많아 랜드마크를 같이 적는다. */
  landmark: string;
  /** 지도 좌표. city-map.tsx와 같은 viewBox 0 0 393 852 계에서 정의한다. */
  x: number;
  y: number;
  reportedAt: string;
  /** 목록의 상대 시각 표기. */
  reportedAgo: string;
  photo: string;
  detail: string;
  department: string;
  /** 승인된 제보에만 지급된다. 미승인 제보는 0이다. */
  points: number;
  /** 같은 위치를 함께 겪었다고 눌러 준 시민 수. */
  agrees: number;
  /** 내가 올린 제보인지. 내 제보 목록과 지도 마커 강조에 쓴다. */
  mine: boolean;
  timeline: TimelineStep[];
};
