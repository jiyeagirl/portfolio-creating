export type FloorId = "1F" | "2F" | "3F" | "4F" | "RF";

/* 인식 신뢰도: 높음 초록, 확인 필요 주황, 수동 수정됨 파랑 */
export type Confidence = "높음" | "확인 필요" | "수동 수정됨";

export type Side = "N" | "E" | "S" | "W";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/* 외벽 구간 (시스템비계 대상). from/to 는 해당 변을 따라가는 미터 좌표. region 이 있으면 수동 지정 영역 */
export interface WallItem {
  kind: "wall";
  id: string;
  floor: FloorId;
  label: string;
  side: Side;
  from: number;
  to: number;
  lengthM: number;
  heightM: number;
  areaM2: number;
  confidence: Confidence;
  region?: Rect;
}

/* 슬래브 구획 (시스템동바리 대상). rect 는 건물 좌상단 기준 미터 */
export interface SlabItem {
  kind: "slab";
  id: string;
  floor: FloorId;
  label: string;
  slabType: "RC" | "DECK";
  rect: Rect;
  areaM2: number;
  heightM: number;
  confidence: Confidence;
}

export type PlanItem = WallItem | SlabItem;

export type DrawingKind = "건축도면" | "구조도면";

export interface UploadedFile {
  name: string;
  sizeMb: number;
  floors: string;
  layers: number;
}

export type QuoteStatus = "신규" | "검토 중" | "견적 발송";

export interface QuoteRequest {
  id: string;
  company: string;
  site: string;
  manager: string;
  phone: string;
  email: string;
  startMonth: string;
  memo: string;
  requestedAt: string;
  fileName: string;
  scaffoldArea: number;
  rcVolume: number;
  deckVolume: number;
  status: QuoteStatus;
}

export interface UploadRecord {
  id: string;
  fileName: string;
  company: string;
  site: string;
  uploadedAt: string;
  sizeMb: number;
  result: "정상" | "수동 수정 포함";
  scaffoldArea: number;
  rcVolume: number;
  deckVolume: number;
}

export interface Totals {
  scaffoldLength: number;
  scaffoldArea: number;
  rcArea: number;
  rcVolume: number;
  deckArea: number;
  deckVolume: number;
  needCheck: number;
}

export interface Targets {
  scaffold: boolean;
  shoring: boolean;
}
