import type { ComponentType } from "react";
import { ChatCircleDots, House, MagnifyingGlass, Package, UserCircle } from "@phosphor-icons/react";

export type EnclaveScreen =
  | "onboarding"
  | "home"
  | "explore"
  | "productDetail"
  | "postCreate"
  | "chatList"
  | "chatDetail"
  | "locker"
  | "myActivity"
  | "mypage";

export type BottomNavKey = "home" | "explore" | "locker" | "chatList" | "mypage";

export const BOTTOM_NAV: {
  key: BottomNavKey;
  screen: EnclaveScreen;
  label: string;
  icon: ComponentType<{ size?: number; weight?: "regular" | "fill"; className?: string }>;
}[] = [
  { key: "home", screen: "home", label: "홈", icon: House },
  { key: "explore", screen: "explore", label: "탐색", icon: MagnifyingGlass },
  { key: "locker", screen: "locker", label: "무인택배함", icon: Package },
  { key: "chatList", screen: "chatList", label: "채팅", icon: ChatCircleDots },
  { key: "mypage", screen: "mypage", label: "마이", icon: UserCircle },
];

export type Tone = "neutral" | "accent" | "warn" | "danger";

/* ── 관리자 ── */

export type AdminScreen = "dashboard" | "members" | "complexes";

export const ADMIN_NAV: { key: AdminScreen; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "members", label: "회원 / 신고" },
  { key: "complexes", label: "단지 / 게시글" },
];
