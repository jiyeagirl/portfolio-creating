"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/buildbid/styles/buildbid.css";
import { AdminShell } from "@/projects/b2b/buildbid/components/admin/admin-shell";
import { AdminDashboard } from "@/projects/b2b/buildbid/components/admin/admin-dashboard";
import { AdminApprovals } from "@/projects/b2b/buildbid/components/admin/admin-approvals";
import { AdminBidding } from "@/projects/b2b/buildbid/components/admin/admin-bidding";
import { AdminTrades } from "@/projects/b2b/buildbid/components/admin/admin-trades";
import { ADMIN_SCREENS, type AdminScreen } from "@/projects/b2b/buildbid/lib/navigation";

const subscribeToNothing = () => () => {};

export function AdminApp() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo<AdminScreen>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return ADMIN_SCREENS.includes(requested as AdminScreen) ? (requested as AdminScreen) : "dashboard";
  }, [search]);

  const [screen, setScreen] = useState<AdminScreen | null>(null);
  const active = screen ?? initial;

  return (
    <AdminShell screen={active} onNavigate={setScreen}>
      {active === "dashboard" && <AdminDashboard onNavigate={setScreen} />}
      {active === "approvals" && <AdminApprovals />}
      {active === "bidding" && <AdminBidding />}
      {active === "trades" && <AdminTrades />}
    </AdminShell>
  );
}
