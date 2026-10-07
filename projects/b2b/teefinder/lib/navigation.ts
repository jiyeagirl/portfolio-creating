export const APP_SCREENS = [
  "login",
  "signup",
  "pending",
  "rejected",
  "home",
  "courses",
  "course",
  "webview",
  "webview-captcha",
  "alerts",
  "inbox",
  "profile",
  "withdraw",
] as const;

export type AppScreen = (typeof APP_SCREENS)[number];

export const ADMIN_SCREENS = ["approvals", "members", "course-config", "monitoring", "push"] as const;

export type AdminScreenName = (typeof ADMIN_SCREENS)[number];

export function isAppScreen(value: string | null): value is AppScreen {
  return APP_SCREENS.includes(value as AppScreen);
}

export function isAdminScreen(value: string | null): value is AdminScreenName {
  return ADMIN_SCREENS.includes(value as AdminScreenName);
}
