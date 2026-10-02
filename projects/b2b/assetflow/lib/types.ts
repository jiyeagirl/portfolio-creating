export type AssetCategory = "laptop" | "desktop" | "server" | "network" | "peripheral";

export type AssetStatus =
  | "draft" // 등록 중 (임시저장)
  | "quoted" // 자동 견적 완료
  | "bidding1" // 1차 입찰 진행
  | "inspecting" // 검수 진행
  | "bidding2" // 최종 입찰 진행
  | "confirmed" // 거래 확정
  | "settled" // 정산 완료
  | "canceled"; // 취소 / 유찰

export type Grade = "A" | "B" | "C" | "D";

export interface Asset {
  id: string;
  code: string;
  name: string;
  maker: string;
  model: string;
  category: AssetCategory;
  quantity: number;
  purchasedAt: string;
  usedMonths: number;
  grade: Grade;
  status: AssetStatus;
  /** 검증한 picsum id. 없으면 카테고리 글리프 타일로 대체한다. */
  photo?: number;
  registeredAt: string;
  spec: string;
  /** AI 자동 시세 (대당) */
  autoPrice: number;
  /** 신품가 (대당) */
  listPrice: number;
  /** 감가 요인 */
  factors: { label: string; impact: number; note: string }[];
  /** 시세 산출에 쓰인 근거 */
  basis: { label: string; value: string }[];
  /** 자동 시세 신뢰도 (0~100) */
  confidence: number;
}

export interface Bid {
  id: string;
  assetId: string;
  reseller: string;
  resellerGrade: "플래티넘" | "골드" | "실버";
  round: 1 | 2;
  unitPrice: number;
  submittedAt: string;
  pickupDays: number;
  note: string;
  /** 데이터 완전 파기 증명서 발급 여부 */
  certifiedWipe: boolean;
  selected?: boolean;
}

export interface InspectionItem {
  label: string;
  declared: string;
  observed: string;
  delta: "same" | "better" | "worse";
}

export interface Inspection {
  assetId: string;
  inspector: string;
  inspectedAt: string;
  site: string;
  gradeBefore: Grade;
  gradeAfter: Grade;
  priceBefore: number;
  priceAfter: number;
  summary: string;
  items: InspectionItem[];
  photos: number[];
}

export type DealStage =
  | "contract"
  | "wipe"
  | "pickup"
  | "settlement"
  | "done";

export interface Deal {
  id: string;
  code: string;
  assetId: string;
  assetName: string;
  quantity: number;
  reseller: string;
  amount: number;
  stage: DealStage;
  confirmedAt: string;
  expectedAt: string;
  documents: { name: string; kind: string; size: string; issuedAt: string }[];
  timeline: { label: string; at: string; done: boolean; note?: string }[];
}

export interface NoticeItem {
  id: string;
  kind: "bid" | "inspection" | "deal" | "notice";
  title: string;
  detail: string;
  at: string;
  unread: boolean;
}
