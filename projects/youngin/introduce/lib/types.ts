export type FloorId = 1 | 2 | 3;

export type ZoneId = "west" | "center" | "east";

/** Physical thing placed on a floor plan. `kind` drives both the pictogram and
 *  the legend color; `category` is the coarser grouping the filter chips use. */
export type FacilityKind =
  | "counter"
  | "dept"
  | "ticket"
  | "kiosk"
  | "info"
  | "restroom"
  | "restroomAccessible"
  | "nursing"
  | "cafe"
  | "water"
  | "atm"
  | "elevator"
  | "stairs"
  | "entrance"
  | "parking";

export type FacilityCategory = "counter" | "dept" | "kiosk" | "info" | "amenity" | "move";

export interface Facility {
  id: string;
  floor: FloorId;
  zone: ZoneId;
  kind: FacilityKind;
  name: string;
  /** Counter number, department suffix, or a one-word qualifier. */
  sub?: string;
  /** Tile width in the 4-column zone grid. */
  span: 1 | 2 | 4;
  detail: string;
  /** Walking direction from the QR entry point, in 동선 terms. */
  route: string;
  distance?: string;
  hours?: string;
  /** Live queue length. Only counters carry it. */
  queue?: number;
  /** picsum id, hand-verified. See design.md 사진 매핑. */
  photoId?: number;
  photoCaption?: string;
  tags?: string[];
}

export interface FloorZone {
  id: ZoneId;
  label: string;
}

export interface Floor {
  id: FloorId;
  label: string;
  name: string;
  summary: string;
  zones: FloorZone[];
  /** Sentence shown on the corridor spine between the west and east zones. */
  corridor: string;
}

export interface ServiceDoc {
  label: string;
  required: boolean;
  note?: string;
}

export interface ServiceStep {
  title: string;
  desc: string;
}

export type ServiceIcon =
  | "resident"
  | "family"
  | "passport"
  | "seal"
  | "land"
  | "car"
  | "welfare"
  | "tax";

export interface Service {
  id: string;
  name: string;
  short: string;
  category: string;
  icon: ServiceIcon;
  desc: string;
  /** Facility this is processed at, so the detail screen can reuse the map. */
  facilityId: string;
  place: string;
  floor: FloorId;
  hours: string;
  closed: string;
  docs: ServiceDoc[];
  steps: ServiceStep[];
  duration: string;
  fee: string;
  feeNote?: string;
  kiosk: { available: boolean; note: string };
  related: string[];
  rating: { avg: number; count: number };
  popular: boolean;
  keywords: string[];
}

export interface Notice {
  id: string;
  tone: "info" | "warning";
  title: string;
  body: string;
}
