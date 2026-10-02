export type LumicamScreen =
  | "onboarding"
  | "camera"
  | "filterSettings"
  | "result"
  | "filterStore"
  | "share";

export type LumicamNavigate = (screen: LumicamScreen, shotId?: string) => void;

export const ADMIN_NAV = [
  { key: "luts", label: "3D LUT 라이브러리" },
  { key: "engine", label: "필터 엔진 관리" },
  { key: "ops", label: "시스템 운영" },
] as const;

export type AdminScreen = (typeof ADMIN_NAV)[number]["key"];
