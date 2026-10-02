/* CIVICPIN mock 도메인 타입. spec.md 5절 Data Model 을 그대로 옮기고, 목업에 필요한
   표시용 필드(거리/도보시간/좌표)만 덧붙였다. 좌표는 실제 좌표계가 아니라 추상화 지도
   캔버스(0~100 정규화) 위의 위치값이다 — 실제 지역과 매핑되지 않는다. */

export type FacilityType = "AED" | "화장실" | "쉼터" | "대피소";

export type Point = { x: number; y: number };

export interface Facility {
  id: string;
  type: FacilityType;
  /** 가명: "△△동 주민센터 AED" 형태 */
  displayName: string;
  /** 도로명 주소. 행정동만 익명 표기(△△동)하고 도로명과 건물번호는 실주소처럼 쓴다.
      위치를 보여주는 자리에는 항상 이 값이 들어간다 — 상대 위치만 쓰지 않는다. */
  address: string;
  /** 주소로도 찾기 어려운 건물 안 위치를 보조로 설명한다 ("1층 로비 안내데스크 옆") */
  relativeLocation: string;
  /** 상세 설명(설치 위치, 개방 시간 등) */
  detail: string;
  /** QR 지점 기준 직선거리(m) */
  distance: number;
  /** 도보 소요(분) */
  walkMinutes: number;
  /** 추상화 지도 캔버스상의 가상 좌표 */
  coordinates: Point;
  /** 24시간 개방 여부 */
  alwaysOpen: boolean;
  /** 데이터 기준일 */
  updatedAt: string;
}

export type StoreCategory =
  | "음식"
  | "카페"
  | "농수산"
  | "생활"
  | "미용"
  | "의료"
  | "교육";

export interface Store {
  id: string;
  districtId: string;
  /** 가명: 유형 + 위치 조합 */
  name: string;
  category: StoreCategory;
  /** 세부 업종 */
  subCategory: string;
  onnuriAccepted: boolean;
  /** 도로명 주소. 동 이름은 익명 표기(△△동)를 유지하되 도로명과 건물번호는
      실제 주소처럼 쓴다. "3구역"만으로는 어디인지 감이 오지 않아 상세 화면의
      위치 첫 줄로 쓴다. */
  address: string;
  /** 주소를 보고도 찾기 어려운 골목 안 위치를 보조로 설명한다 ("3구역, 카페 옆") */
  relativeLocation: string;
  distance: number;
  walkMinutes: number;
  coordinates: Point;
  hours: string;
  /** 하드 검증한 picsum id. 없으면 업종 아이콘 타일로 대체한다. */
  photo?: number;
  photoAlt?: string;
  /** 카드 한 줄 소개 */
  blurb?: string;
}

export interface District {
  id: string;
  /** 가명: "A 골목형 상점가" */
  name: string;
  /** 구역 코드 — 실지명 대신 노출하는 유일한 식별자 */
  zoneCode: string;
  mainCategories: StoreCategory[];
  storeCount: number;
  onnuriCount: number;
  distance: number;
  walkMinutes: number;
  /** 소개 카피 */
  intro: string;
  /** 추상화 지도 위 구역 경계 폴리곤 (정규화 좌표) */
  polygon: Point[];
  center: Point;
  /** 내용이 맞는 사진이 있을 때만 쓴다. 없으면 상세 화면이 구역 지도를 히어로로 쓴다. */
  photo?: number;
  photoAlt?: string;
  /** 업종 비중 (합계 100) */
  mix: { label: StoreCategory; ratio: number }[];
  /** 추천 동선 */
  course: { label: string; note: string }[];
  facilityIds: string[];
}

export type FestivalStatus = "진행중" | "예정" | "종료";

export interface Festival {
  id: string;
  districtId: string;
  /** 가명: "A 골목상권 초여름 축제" */
  name: string;
  status: FestivalStatus;
  period: string;
  time: string;
  /** 행사장 이름 ("A 골목형 상점가 중앙로 일원") */
  venue: string;
  /** 행사장 도로명 주소. 장소 이름만으로는 어디인지 알 수 없어 함께 보여준다. */
  address: string;
  distance: number;
  summary: string;
  photo: number;
  photoAlt: string;
  programs: { time: string; title: string; detail: string }[];
  booths: { label: string; count: string }[];
}

export type ReportStatus = "접수" | "검토" | "반영" | "완료";

export type ReportTargetType = "Facility" | "Store" | "Festival";

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  status: ReportStatus;
  /** 신고 유형 */
  kind: string;
  reportedAt: string;
  note: string;
  reporter: string;
  channel: "QR 화면" | "상점가 상세" | "매장 상세" | "축제 상세";
  history: { status: ReportStatus; at: string; by: string; note: string }[];
}

/** 관리자 데이터 관리 표에 올라가는 통합 레코드 */
export interface DataRecord {
  id: string;
  kind: "시설" | "매장";
  name: string;
  category: string;
  zoneCode: string;
  /** 도로명 주소 (사용자 화면과 같은 값) */
  address: string;
  relativeLocation: string;
  onnuri: boolean;
  source: "공공데이터포털" | "상인회 제출" | "현장 실사" | "사용자 신고 반영";
  baseDate: string;
  verified: boolean;
}

/** 공공데이터 보정 이력 로그 한 줄 */
export interface CorrectionLog {
  id: string;
  at: string;
  target: string;
  field: string;
  before: string;
  after: string;
  by: string;
  source: DataRecord["source"];
}
