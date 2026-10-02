"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/assetflow/styles/assetflow.css";
import { AppShell } from "@/projects/b2b/assetflow/components/layout/app-shell";
import { DashboardScreen } from "@/projects/b2b/assetflow/components/screens/dashboard-screen";
import { RegisterScreen } from "@/projects/b2b/assetflow/components/screens/register-screen";
import { AssetDetailScreen } from "@/projects/b2b/assetflow/components/screens/asset-detail-screen";
import { BiddingScreen } from "@/projects/b2b/assetflow/components/screens/bidding-screen";
import { InspectionScreen } from "@/projects/b2b/assetflow/components/screens/inspection-screen";
import { DealsScreen } from "@/projects/b2b/assetflow/components/screens/deals-screen";
import { ReportsScreen } from "@/projects/b2b/assetflow/components/screens/reports-screen";
import { AccountScreen } from "@/projects/b2b/assetflow/components/screens/account-screen";
import { SELLER_SCREENS, type SellerScreen } from "@/projects/b2b/assetflow/lib/navigation";

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function AssetFlow() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const requested = params.get("screen");
    return {
      screen: SELLER_SCREENS.includes(requested as SellerScreen)
        ? (requested as SellerScreen)
        : ("dashboard" as SellerScreen),
      assetId: params.get("id") ?? undefined,
    };
  }, [search]);

  const [nav, setNav] = useState<{ screen: SellerScreen; assetId?: string } | null>(null);
  const screen = nav?.screen ?? initial.screen;
  const assetId = nav?.assetId ?? initial.assetId;

  const onNavigate = (next: SellerScreen, id?: string) => setNav({ screen: next, assetId: id });

  return (
    <AppShell screen={screen} onNavigate={onNavigate}>
      {screen === "dashboard" && <DashboardScreen onNavigate={onNavigate} />}
      {screen === "register" && <RegisterScreen onNavigate={onNavigate} />}
      {screen === "assetDetail" && <AssetDetailScreen assetId={assetId} onNavigate={onNavigate} />}
      {screen === "bidding" && <BiddingScreen assetId={assetId} onNavigate={onNavigate} />}
      {screen === "inspection" && <InspectionScreen assetId={assetId} onNavigate={onNavigate} />}
      {screen === "deals" && <DealsScreen onNavigate={onNavigate} />}
      {screen === "reports" && <ReportsScreen onNavigate={onNavigate} />}
      {screen === "account" && <AccountScreen onNavigate={onNavigate} />}
    </AppShell>
  );
}
