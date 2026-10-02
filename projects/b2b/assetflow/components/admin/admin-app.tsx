"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/assetflow/styles/assetflow.css";
import { AdminShell } from "@/projects/b2b/assetflow/components/admin/admin-shell";
import { AdminDashboard } from "@/projects/b2b/assetflow/components/admin/admin-dashboard";
import { AdminMembers } from "@/projects/b2b/assetflow/components/admin/admin-members";
import { AdminInspections } from "@/projects/b2b/assetflow/components/admin/admin-inspections";
import { AdminTrades } from "@/projects/b2b/assetflow/components/admin/admin-trades";
import { AdminPolicy } from "@/projects/b2b/assetflow/components/admin/admin-policy";
import { ADMIN_SCREENS, type AdminScreen } from "@/projects/b2b/assetflow/lib/navigation";

const subscribeToNothing = () => () => {};

export function AdminApp() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo<AdminScreen>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return ADMIN_SCREENS.includes(requested as AdminScreen)
      ? (requested as AdminScreen)
      : "dashboard";
  }, [search]);

  const [screen, setScreen] = useState<AdminScreen | null>(null);
  const active = screen ?? initial;

  return (
    <AdminShell screen={active} onNavigate={setScreen}>
      {active === "dashboard" && <AdminDashboard onNavigate={setScreen} />}
      {active === "members" && <AdminMembers />}
      {active === "inspections" && <AdminInspections />}
      {active === "trades" && <AdminTrades />}
      {active === "policy" && <AdminPolicy />}
    </AdminShell>
  );
}
