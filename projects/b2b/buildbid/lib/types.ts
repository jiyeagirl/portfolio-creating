import type { StaticImageData } from "next/image";

export type EquipmentCategory =
  | "excavator" // 굴착기
  | "crane" // 크레인
  | "loader" // 휠로더
  | "dumpTruck" // 덤프트럭
  | "forklift" // 지게차
  | "roller"; // 롤러(다짐장비)

export type EquipmentStatus =
  | "draft" // 등록 대기 (관리자 승인 전)
  | "quoted" // AI 견적 완료 (승인 후 활성)
  | "bidding1" // 1차 입찰 진행
  | "inspecting" // 현장 검수 진행
  | "bidding2" // 최종(2차) 입찰 진행
  | "confirmed" // 낙찰 확정, 계약 진행
  | "settled" // 거래 완료, 정산 완료
  | "canceled"; // 취소 / 유찰

export type Grade = "A" | "B" | "C" | "D";

export interface Equipment {
  id: string;
  code: string;
  name: string;
  maker: string;
  model: string;
  category: EquipmentCategory;
  quantity: number;
  manufacturedYear: number;
  usedHours: number;
  grade: Grade;
  status: EquipmentStatus;
  registeredAt: string;
  region: string;
  seller: string;
  spec: string;
  /** 실제 장비 사진(Wikimedia Commons CC 라이선스, design.md 사진 매핑 참고) */
  photo: StaticImageData;
  /** AI 자동 예상 거래가 (대당) */
  autoPrice: number;
  /** 신품 참고가 (대당) */
  listPrice: number;
  /** 감가 요인 */
  factors: { label: string; impact: number; note: string }[];
  /** 시세 산출에 쓰인 근거 */
  basis: { label: string; value: string }[];
  /** 자동 시세 신뢰도 (0~100) */
  confidence: number;
  /** 바이어의 관심 등록 여부 (mock) */
  watched?: boolean;
}

export interface Bid {
  id: string;
  equipmentId: string;
  buyer: string;
  buyerTier: "공식파트너" | "우수바이어" | "일반바이어";
  round: 1 | 2;
  unitPrice: number;
  submittedAt: string;
  transportDays: number;
  note: string;
  /** 낙찰 시 즉시 인수 가능 여부 */
  immediatePickup: boolean;
  selected?: boolean;
}

export interface InspectionItem {
  label: string;
  declared: string;
  observed: string;
  delta: "same" | "better" | "worse";
}

export interface Inspection {
  equipmentId: string;
  inspector: string;
  inspectedAt: string;
  site: string;
  gradeBefore: Grade;
  gradeAfter: Grade;
  priceBefore: number;
  priceAfter: number;
  summary: string;
  items: InspectionItem[];
}

export type DealStage =
  | "contract" // 계약 진행
  | "transport" // 운송 준비 / 인도
  | "settlement" // 정산 대기
  | "done"; // 거래 완료

export interface Deal {
  id: string;
  code: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  buyer: string;
  seller: string;
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

export interface DisputeItem {
  id: string;
  dealCode: string;
  equipmentName: string;
  raisedBy: string;
  reason: string;
  status: "open" | "reviewing" | "resolved";
  raisedAt: string;
}
