export const SITE_SCREENS = ["apply", "documents", "sign", "status", "kakao"] as const;

export type SiteScreen = (typeof SITE_SCREENS)[number];

export function isSiteScreen(v: string | null): v is SiteScreen {
  return SITE_SCREENS.includes(v as SiteScreen);
}

/** 신청 흐름 3단계. 증빙과 의뢰 확인은 메뉴가 아니라 이 흐름으로만 들어간다 */
export const FLOW: { screen: SiteScreen; label: string }[] = [
  { screen: "apply", label: "신청서" },
  { screen: "documents", label: "증빙 제출" },
  { screen: "sign", label: "의뢰 확인, 결제" },
];
