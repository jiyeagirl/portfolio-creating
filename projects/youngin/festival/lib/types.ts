/** 시설 대분류. 지도 필터 3종과 1:1로 대응한다. */
export type FacilityCategory = "program" | "convenience" | "safety";

/** 시설 세부 종류. 핀 아이콘과 글리프 타일이 이 값으로 갈린다. */
export type FacilityKind =
  // program
  | "stage"
  | "hall"
  | "experience"
  | "tea"
  | "exhibit"
  | "food"
  | "heritage"
  // convenience
  | "toilet"
  | "parking"
  | "nursing"
  | "rest"
  | "lost"
  | "shuttle"
  | "accessible"
  // safety
  | "info"
  | "aed"
  | "medical";

/** 운영 상태. 색만으로 구분하지 않고 항상 라벨을 함께 붙인다. */
export type OperationStatus = "open" | "busy" | "closed";

export interface Facility {
  id: string;
  name: string;
  kind: FacilityKind;
  category: FacilityCategory;
  /** 구역 코드. 지도 라벨과 같은 값을 쓴다. */
  zone: ZoneCode;
  hours: string;
  desc: string;
  status: OperationStatus;
  /** 현재 위치(어울마당 남측 진입로) 기준 도보 분. */
  walkMin: number;
  /** SVG viewBox(720×980) 좌표. */
  x: number;
  y: number;
}

export type ZoneCode = "A" | "B" | "C" | "D" | "E" | "P";

export interface Zone {
  code: ZoneCode;
  name: string;
  /** 라벨 배지가 놓이는 SVG 좌표. */
  x: number;
  y: number;
}

export type ProgramKind = "공연" | "체험" | "전시" | "의례";

export interface Program {
  id: string;
  title: string;
  kind: ProgramKind;
  facilityId: string;
  /** "14:00" 24시간 표기. 오늘(9/19) 기준. */
  start: string;
  end: string;
  host: string;
  note: string;
  photoId: number;
  /** 사전 접수가 마감된 프로그램. */
  full?: boolean;
  /** 오늘 조회 수. 인기 프로그램 정렬 근거. */
  views: number;
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  facilityId: string;
  icon: string;
  done: boolean;
  /** "09.19 11:24" 완료 시각. */
  doneAt?: string;
  /** 현장 QR 인증이 필요한 미션인지. false면 위치 도착만으로 완료된다. */
  needsQr: boolean;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  /** 이 배지를 받는 데 필요한 완료 미션 수. */
  require: number;
}

export type NoticeKind = "운영" | "안전" | "교통";

export interface Notice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  /** "09.19 13:40" */
  at: string;
}
