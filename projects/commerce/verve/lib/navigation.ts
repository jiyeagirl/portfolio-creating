export type VerveView =
  | "home"
  | "shop"
  | "productDetail"
  | "sizeRecommendation"
  | "cart"
  | "checkout"
  | "orderComplete"
  | "mypage"
  | "reviews"
  | "brand"
  | "login"
  | "signup"
  | "support";

export type NavigateFn = (view: VerveView, id?: string) => void;

export const ALL_VIEWS: VerveView[] = [
  "home",
  "shop",
  "productDetail",
  "sizeRecommendation",
  "cart",
  "checkout",
  "orderComplete",
  "mypage",
  "reviews",
  "brand",
  "login",
  "signup",
  "support",
];

/** 다크 캔버스(시네마틱) vs 라이트 캔버스(에디토리얼/유틸리티) — Farrari 톤 규칙. */
export const DARK_VIEWS: VerveView[] = ["home", "productDetail", "brand", "sizeRecommendation"];
