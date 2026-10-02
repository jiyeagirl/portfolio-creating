/** 사용자 앱 화면. spec.md 3.1의 8개 영역과 1:1로 대응한다. */
export type AppScreen =
  | "onboarding"
  | "home"
  | "fall"
  | "location"
  | "activity"
  | "sos"
  | "notifications"
  | "report";

/** 관리자 콘솔 화면. spec.md 3.2의 3개 영역. */
export type AdminScreen = "dashboard" | "users" | "monitoring";

export type AppNavigate = (screen: AppScreen) => void;

export type TabKey = "home" | "location" | "activity" | "notifications" | "report";

/** 탭 바를 숨기는 몰입 화면. 온보딩과 긴급 흐름은 전체 화면으로 전개된다. */
export const FULLSCREEN: AppScreen[] = ["onboarding", "fall", "sos"];

export const TAB_OF_SCREEN: Record<AppScreen, TabKey> = {
  onboarding: "home",
  home: "home",
  fall: "home",
  location: "location",
  activity: "activity",
  sos: "home",
  notifications: "notifications",
  report: "report",
};

export const APP_SCREENS: AppScreen[] = [
  "onboarding",
  "home",
  "fall",
  "location",
  "activity",
  "sos",
  "notifications",
  "report",
];

export const ADMIN_SCREENS: AdminScreen[] = ["dashboard", "users", "monitoring"];
