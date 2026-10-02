import type { ComponentType } from "react";
import { ChatCircleDots, House, MapPinLine, UserCircle } from "@phosphor-icons/react";

export type WaypointScreen =
  | "onboarding"
  | "home"
  | "waypoint"
  | "chatList"
  | "chatDetail"
  | "productDetail"
  | "transactions"
  | "settings"
  | "mypage";

export type HomeTab = "neighborhood" | "route";

export type BottomNavKey = "home" | "waypoint" | "chatList" | "mypage";

export const BOTTOM_NAV: {
  key: BottomNavKey;
  screen: WaypointScreen;
  label: string;
  icon: ComponentType<{ size?: number; weight?: "regular" | "fill"; className?: string }>;
}[] = [
  { key: "home", screen: "home", label: "홈", icon: House },
  { key: "waypoint", screen: "waypoint", label: "웨이스팟", icon: MapPinLine },
  { key: "chatList", screen: "chatList", label: "채팅", icon: ChatCircleDots },
  { key: "mypage", screen: "mypage", label: "마이", icon: UserCircle },
];

export type Tone = "neutral" | "accent" | "success" | "warn" | "danger";

/* ── 관리자 ── */

export type AdminScreen = "dashboard" | "members" | "posts" | "reports" | "ops";

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "members", label: "회원 관리" },
  { key: "posts", label: "게시글 관리" },
  { key: "reports", label: "신고 관리" },
  { key: "ops", label: "운영 관리" },
];
