export const SITE_SCREENS = ["upload", "review", "result", "quote"] as const;
export type SiteScreen = (typeof SITE_SCREENS)[number];

export const ADMIN_SCREENS = ["quotes", "drawings"] as const;
export type AdminScreenName = (typeof ADMIN_SCREENS)[number];

export const STEPS: Array<{ key: SiteScreen; label: string }> = [
  { key: "upload", label: "도면 업로드" },
  { key: "review", label: "인식 확인, 수정" },
  { key: "result", label: "물량 결과" },
  { key: "quote", label: "견적 요청" },
];

export function isSiteScreen(value: string | null): value is SiteScreen {
  return SITE_SCREENS.includes(value as SiteScreen);
}

export function isAdminScreen(value: string | null): value is AdminScreenName {
  return ADMIN_SCREENS.includes(value as AdminScreenName);
}
