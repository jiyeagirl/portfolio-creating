"use client";

import { useState } from "react";
import "@/projects/commerce/baseballmarket/styles/baseballmarket.css";
import { AdminShell } from "@/projects/commerce/baseballmarket/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/commerce/baseballmarket/components/admin/screens/dashboard-screen";
import {
  BannedItemsScreen,
  ListingTableScreen,
  MasterDataScreen,
  OverPriceScreen,
  PriceRulesScreen,
} from "@/projects/commerce/baseballmarket/components/admin/screens/listings-screens";
import {
  DisputesScreen,
  MemberTableScreen,
  SettlementsScreen,
  TradeHistoryScreen,
} from "@/projects/commerce/baseballmarket/components/admin/screens/members-screens";
import {
  BannedWordsScreen,
  FraudPatternScreen,
  InquiriesScreen,
  PostTableScreen,
  ReportQueueScreen,
} from "@/projects/commerce/baseballmarket/components/admin/screens/community-screens";
import type { AdminView } from "@/projects/commerce/baseballmarket/lib/navigation";

export function AdminApp() {
  const [view, setView] = useState<AdminView>("overview");

  return (
    <AdminShell view={view} onNavigate={setView}>
      <div key={view} className="bm-rise">
        {view === "overview" && <DashboardScreen />}

        {view === "listingTable" && <ListingTableScreen />}
        {view === "overPrice" && <OverPriceScreen />}
        {view === "priceRules" && <PriceRulesScreen />}
        {view === "masterData" && <MasterDataScreen />}
        {view === "bannedItems" && <BannedItemsScreen />}

        {view === "memberTable" && <MemberTableScreen />}
        {view === "tradeHistory" && <TradeHistoryScreen />}
        {view === "settlements" && <SettlementsScreen />}
        {view === "disputes" && <DisputesScreen />}

        {view === "reportQueue" && <ReportQueueScreen />}
        {view === "postTable" && <PostTableScreen />}
        {view === "fraudPattern" && <FraudPatternScreen />}
        {view === "bannedWords" && <BannedWordsScreen />}
        {view === "inquiries" && <InquiriesScreen />}
      </div>
    </AdminShell>
  );
}
