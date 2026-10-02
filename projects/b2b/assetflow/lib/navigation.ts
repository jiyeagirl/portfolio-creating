import type { AssetCategory, AssetStatus, DealStage, Grade } from "@/projects/b2b/assetflow/lib/types";

export type SellerScreen =
  | "dashboard"
  | "register"
  | "assetDetail"
  | "bidding"
  | "inspection"
  | "deals"
  | "reports"
  | "account";

export type AdminScreen = "dashboard" | "members" | "inspections" | "trades" | "policy";

export const SELLER_SCREENS: SellerScreen[] = [
  "dashboard",
  "register",
  "assetDetail",
  "bidding",
  "inspection",
  "deals",
  "reports",
  "account",
];

export const ADMIN_SCREENS: AdminScreen[] = [
  "dashboard",
  "members",
  "inspections",
  "trades",
  "policy",
];

export const SELLER_NAV: { key: SellerScreen; label: string; group: string }[] = [
  { key: "dashboard", label: "대시보드", group: "현황" },
  { key: "register", label: "자산 등록", group: "자산" },
  { key: "assetDetail", label: "자산 상세 | 자동 견적", group: "자산" },
  { key: "bidding", label: "1차 입찰", group: "거래" },
  { key: "inspection", label: "검수 결과 | 최종 입찰", group: "거래" },
  { key: "deals", label: "거래 관리", group: "거래" },
  { key: "reports", label: "리포트 | 거래 분석", group: "분석" },
  { key: "account", label: "기업 정보", group: "설정" },
];

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "members", label: "기업 | 리셀러 관리" },
  { key: "inspections", label: "자산 | 검수 관리" },
  { key: "trades", label: "입찰 | 거래 관리" },
  { key: "policy", label: "시세 | 운영 정책" },
];

export type Navigate = (screen: SellerScreen, assetId?: string) => void;

/* ── 표시용 라벨 ── */

export const CATEGORY_LABEL: Record<AssetCategory, string> = {
  laptop: "노트북",
  desktop: "데스크탑",
  server: "서버",
  network: "네트워크",
  peripheral: "주변기기",
};

export const STATUS_LABEL: Record<AssetStatus, string> = {
  draft: "작성 중",
  quoted: "견적 완료",
  bidding1: "1차 입찰",
  inspecting: "검수 중",
  bidding2: "최종 입찰",
  confirmed: "거래 확정",
  settled: "정산 완료",
  canceled: "취소",
};

/**
 * 상태 → 배지 톤. vercel_compact가 정의한 색만 쓴다.
 * neutral 회색(대기), info 파랑(진행), warn 앰버(조치 필요), ink 검정(완료), danger 빨강(중단).
 */
export type Tone = "neutral" | "info" | "warn" | "ink" | "danger";

export const STATUS_TONE: Record<AssetStatus, Tone> = {
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
  wipe: "데이터 파기",
  pickup: "회수 대기",
  settlement: "정산 대기",
  done: "거래 완료",
};

export const STAGE_TONE: Record<DealStage, Tone> = {
  contract: "warn",
  wipe: "warn",
  pickup: "info",
  settlement: "info",
  done: "ink",
};

export const STAGE_ORDER: DealStage[] = ["contract", "wipe", "pickup", "settlement", "done"];

export const GRADE_NOTE: Record<Grade, string> = {
  A: "미세 사용감, 기능 이상 없음",
  B: "생활 스크래치, 기능 이상 없음",
  C: "외관 손상 또는 부속 누락",
  D: "기능 이상, 부품 회수 대상",
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
