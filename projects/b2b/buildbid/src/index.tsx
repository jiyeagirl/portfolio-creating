"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/buildbid/styles/buildbid.css";
import { AppShell } from "@/projects/b2b/buildbid/components/layout/app-shell";
import { LandingScreen } from "@/projects/b2b/buildbid/components/screens/landing-screen";
import { SellerDashboardScreen } from "@/projects/b2b/buildbid/components/screens/seller-dashboard-screen";
import { RegisterScreen } from "@/projects/b2b/buildbid/components/screens/seller-register-screen";
import { BiddingScreen } from "@/projects/b2b/buildbid/components/screens/seller-bidding-screen";
import { DealDoneScreen } from "@/projects/b2b/buildbid/components/screens/seller-deal-done-screen";
import { ListingsScreen } from "@/projects/b2b/buildbid/components/screens/buyer-listings-screen";
import { EquipmentDetailScreen } from "@/projects/b2b/buildbid/components/screens/buyer-detail-screen";
import { DealManageScreen } from "@/projects/b2b/buildbid/components/screens/buyer-deal-manage-screen";
import {
  BUYER_SCREENS,
  SELLER_SCREENS,
  type BuyerScreen,
  type Role,
  type SellerScreen,
} from "@/projects/b2b/buildbid/lib/navigation";

/* BuildBid는 판매자/바이어가 한 URL(/b2b/buildbid) 안에 공존한다. 랜딩 화면에서
   역할을 고르면 ?role=seller|buyer 로 스코프가 갈리고, 그 안에서 ?screen= 이
   화면을 고른다. 관리자(/b2b/buildbid-admin)는 완전히 별도 앱이라 여기 없다. */
const subscribeToNothing = () => () => {};

type AppState = { role: Role | null; screen?: SellerScreen | BuyerScreen; equipmentId?: string };

export default function BuildBid() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo<AppState>(() => {
    const params = new URLSearchParams(search);
    const requestedRole = params.get("role");
    const role: Role | null = requestedRole === "seller" || requestedRole === "buyer" ? requestedRole : null;
    const requestedScreen = params.get("screen");
    const equipmentId = params.get("id") ?? undefined;

    if (role === "seller") {
      const screen = SELLER_SCREENS.includes(requestedScreen as SellerScreen) ? (requestedScreen as SellerScreen) : "dashboard";
      return { role, screen, equipmentId };
    }
    if (role === "buyer") {
      const screen = BUYER_SCREENS.includes(requestedScreen as BuyerScreen) ? (requestedScreen as BuyerScreen) : "listings";
      return { role, screen, equipmentId };
    }
    return { role: null, equipmentId };
  }, [search]);

  const [state, setState] = useState<AppState | null>(null);
  const role = state?.role ?? initial.role;
  const screen = state ? state.screen : initial.screen;
  const equipmentId = state ? state.equipmentId : initial.equipmentId;

  const onSelectRole = (nextRole: Role) => setState({ role: nextRole, screen: nextRole === "seller" ? "dashboard" : "listings" });
  const onSwitchRole = () => setState({ role: null });
  const onNavigate = (nextScreen: SellerScreen | BuyerScreen, id?: string) => setState({ role, screen: nextScreen, equipmentId: id });

  if (!role) {
    return <LandingScreen onSelectRole={onSelectRole} />;
  }

  if (role === "seller") {
    const sellerScreen = (screen as SellerScreen) ?? "dashboard";
    return (
      <AppShell role="seller" screen={sellerScreen} onNavigate={onNavigate} onSwitchRole={onSwitchRole}>
        {sellerScreen === "dashboard" && <SellerDashboardScreen onNavigate={onNavigate} />}
        {sellerScreen === "register" && <RegisterScreen onNavigate={onNavigate} />}
        {sellerScreen === "bidding" && <BiddingScreen equipmentId={equipmentId} onNavigate={onNavigate} />}
        {sellerScreen === "dealDone" && <DealDoneScreen equipmentId={equipmentId} onNavigate={onNavigate} />}
      </AppShell>
    );
  }

  const buyerScreen = (screen as BuyerScreen) ?? "listings";
  return (
    <AppShell role="buyer" screen={buyerScreen} onNavigate={onNavigate} onSwitchRole={onSwitchRole}>
      {buyerScreen === "listings" && <ListingsScreen onNavigate={onNavigate} />}
      {buyerScreen === "detail" && <EquipmentDetailScreen equipmentId={equipmentId} onNavigate={onNavigate} />}
      {buyerScreen === "dealManage" && <DealManageScreen onNavigate={onNavigate} />}
    </AppShell>
  );
}
