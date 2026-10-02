/** Public resident-facing website views. */
export type SiteView =
  | "home"
  | "community"
  | "postDetail"
  | "postWrite"
  | "events"
  | "eventDetail"
  | "stores"
  | "storeDetail"
  | "meetups"
  | "meetupDetail"
  | "civic"
  | "search"
  | "notifications"
  | "mypage";

export type NavigateFn = (view: SiteView, id?: string) => void;

export const PRIMARY_NAV: { view: SiteView; label: string }[] = [
  { view: "community", label: "커뮤니티" },
  { view: "events", label: "지역행사" },
  { view: "stores", label: "동네가게" },
  { view: "meetups", label: "모임" },
  { view: "civic", label: "주민참여" },
];
