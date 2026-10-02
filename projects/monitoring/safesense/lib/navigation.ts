/** 근로자 Android 앱 화면. spec.md 3.1의 6개 영역과 1:1로 대응한다. */
export type AppScreen =
  | "home"
  | "work-start"
  | "event"
  | "records"
  | "notifications"
  | "mypage";

/** 스마트워치 화면. spec.md 3.2의 4개 영역. */
export type WatchScreen = "status" | "danger" | "sos" | "work-info";

/** 관리자 콘솔 화면. spec.md 3.3의 6개 영역. */
export type AdminScreen =
  | "dashboard"
  | "monitoring"
  | "events"
  | "workers"
  | "stats"
  | "sites";

export type AppNavigate = (screen: AppScreen) => void;
export type WatchNavigate = (screen: WatchScreen) => void;

export type TabKey = "home" | "records" | "notifications" | "mypage";

/** 탭 바를 숨기는 몰입 화면. */
export const FULLSCREEN: AppScreen[] = ["work-start", "event"];

export const TAB_OF_SCREEN: Record<AppScreen, TabKey> = {
  home: "home",
  "work-start": "home",
  event: "home",
  records: "records",
  notifications: "notifications",
  mypage: "mypage",
};

export const APP_SCREENS: AppScreen[] = [
  "home",
  "work-start",
  "event",
  "records",
  "notifications",
  "mypage",
];

export const WATCH_SCREENS: WatchScreen[] = ["status", "danger", "sos", "work-info"];

export const ADMIN_SCREENS: AdminScreen[] = [
  "dashboard",
  "monitoring",
  "events",
  "workers",
  "stats",
  "sites",
];
