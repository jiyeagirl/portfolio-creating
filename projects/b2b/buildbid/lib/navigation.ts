import type {
  DealStage,
  EquipmentCategory,
  EquipmentStatus,
  Grade,
} from "@/projects/b2b/buildbid/lib/types";

/**
 * BuildBid는 판매자/바이어 두 역할이 한 URL(/b2b/buildbid) 안에 공존한다.
 * 랜딩 화면에서 역할을 고르면 그 역할의 화면 목록만 내비게이션에 노출된다.
 * 관리자(/b2b/buildbid-admin)는 완전히 별도 앱이라 이 role 개념에 들어가지 않는다.
 */
export type Role = "seller" | "buyer";

export type SellerScreen = "dashboard" | "register" | "bidding" | "dealDone";
export type BuyerScreen = "listings" | "detail" | "dealManage";
export type AdminScreen = "dashboard" | "approvals" | "bidding" | "trades";

export const SELLER_SCREENS: SellerScreen[] = ["dashboard", "register", "bidding", "dealDone"];
export const BUYER_SCREENS: BuyerScreen[] = ["listings", "detail", "dealManage"];
export const ADMIN_SCREENS: AdminScreen[] = ["dashboard", "approvals", "bidding", "trades"];

export const SELLER_NAV: { key: SellerScreen; label: string; group: string }[] = [
  { key: "dashboard", label: "대시보드", group: "현황" },
  { key: "register", label: "장비 등록", group: "장비" },
  { key: "bidding", label: "입찰 관리", group: "거래" },
  { key: "dealDone", label: "거래 완료", group: "거래" },
];

export const BUYER_NAV: { key: BuyerScreen; label: string; group: string }[] = [
  { key: "listings", label: "장비 목록", group: "탐색" },
  { key: "detail", label: "장비 상세 | 입찰", group: "탐색" },
  { key: "dealManage", label: "낙찰 | 거래 관리", group: "거래" },
];

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "approvals", label: "등록 승인 | 검수 배정" },
  { key: "bidding", label: "입찰 진행 | 낙찰 처리" },
  { key: "trades", label: "거래 | 분쟁 관리" },
];

export type Navigate = (screen: SellerScreen | BuyerScreen, equipmentId?: string) => void;

/* ── 표시용 라벨 ── */

export const CATEGORY_LABEL: Record<EquipmentCategory, string> = {
  excavator: "굴착기",
  crane: "크레인",
  loader: "휠로더",
  dumpTruck: "덤프트럭",
  forklift: "지게차",
  roller: "롤러",
};

export const STATUS_LABEL: Record<EquipmentStatus, string> = {
  draft: "등록 대기",
  quoted: "견적 완료",
  bidding1: "1차 입찰",
  inspecting: "검수 중",
  bidding2: "최종 입찰",
  confirmed: "낙찰 확정",
  settled: "거래 완료",
  canceled: "취소",
};

/**
 * 상태 → 배지 톤. apple_compact는 단일 액센트만 허용하지만(핵심 규칙: 액센트는
 * primary 하나만) 그건 브랜드 장식색 얘기고, 엔터프라이즈 상태 배지는 별도로
 * 최소 확장한 5단계 색만 쓴다(assetflow와 같은 관례, 색상표는 buildbid 전용 값).
 */
export type Tone = "neutral" | "info" | "warn" | "ink" | "danger";

export const STATUS_TONE: Record<EquipmentStatus, Tone> = {
  draft: "neutral",
  quoted: "neutral",
  bidding1: "info",
  inspecting: "warn",
  bidding2: "info",
  confirmed: "ink",
  settled: "ink",
  canceled: "danger",
};

export const STAGE_LABEL: Record<DealStage, string> = {
  contract: "계약 진행",
  transport: "운송 준비",
  settlement: "정산 대기",
  done: "거래 완료",
};

export const STAGE_TONE: Record<DealStage, Tone> = {
  contract: "warn",
  transport: "info",
  settlement: "info",
  done: "ink",
};

export const STAGE_ORDER: DealStage[] = ["contract", "transport", "settlement", "done"];

export const GRADE_NOTE: Record<Grade, string> = {
  A: "가동 이상 없음, 외관 상태 우수",
  B: "생활 마모 있음, 가동 이상 없음",
  C: "부식/누유 등 외관 손상, 정비 권장",
  D: "가동 이상, 대수리 또는 부품 회수 대상",
};

/* ── 숫자 포맷 ── */

export const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export const manwon = (value: number) => {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억원`;
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
};

export const percent = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

export const remainLabel = (minutes: number) => {
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  if (d > 0) return `${d}일 ${h}시간`;
  if (h > 0) return `${h}시간 ${m}분`;
  return `${m}분`;
};

export const hours = (value: number) => `${value.toLocaleString("ko-KR")}시간`;
