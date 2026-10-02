export type SnowPeakView =
  | "login"
  | "signup"
  | "findAccount"
  | "home"
  | "bookHub"
  | "roomList"
  | "roomDetail"
  | "liftSeason"
  | "rental"
  | "package"
  | "cart"
  | "payment"
  | "bookingComplete"
  | "mypage"
  | "reservationList"
  | "reservationDetail"
  | "wallet"
  | "profileEdit"
  | "notifications"
  | "support";

/** 두 번째 인자는 화면이 필요로 하는 대상 id(객실/렌탈/패키지/예약 id 등). */
export type NavigateFn = (view: SnowPeakView, id?: string) => void;

export type TabKey = "home" | "bookHub" | "cart" | "mypage";

/** 하단 탭이 보이는 허브 화면만 매핑한다. 나머지는 몰입형 하위 플로우라 탭이 없다. */
export const TAB_OF_VIEW: Partial<Record<SnowPeakView, TabKey>> = {
  home: "home",
  bookHub: "bookHub",
  cart: "cart",
  mypage: "mypage",
};

export const TAB_ROOTS: SnowPeakView[] = ["home", "bookHub", "cart", "mypage"];

/** `?screen=` 스크린샷 캡처 파라미터 검증용 전체 화면 목록. */
export const ALL_VIEWS: SnowPeakView[] = [
  "login",
  "signup",
  "findAccount",
  "home",
  "bookHub",
  "roomList",
  "roomDetail",
  "liftSeason",
  "rental",
  "package",
  "cart",
  "payment",
  "bookingComplete",
  "mypage",
  "reservationList",
  "reservationDetail",
  "wallet",
  "profileEdit",
  "notifications",
  "support",
];

/* ---------- 관리자 콘솔 ---------- */

export type AdminScreen = "dashboard" | "reservations" | "products" | "members" | "inventory" | "erp";

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "reservations", label: "예약 관리" },
  { key: "products", label: "상품 관리" },
  { key: "members", label: "회원 관리" },
  { key: "inventory", label: "재고 관리" },
  { key: "erp", label: "ERP 연동" },
];

export type Tone = "neutral" | "info" | "success" | "warn" | "danger" | "ink";
