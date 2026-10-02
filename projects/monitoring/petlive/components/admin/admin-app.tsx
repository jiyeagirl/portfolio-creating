"use client";

import { useState } from "react";
import "@/projects/monitoring/petlive/styles/petlive.css";
import { AdminShell } from "@/projects/monitoring/petlive/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/monitoring/petlive/components/admin/screens/dashboard-screen";
import { MembersScreen } from "@/projects/monitoring/petlive/components/admin/screens/members-screen";
import { DevicesScreen } from "@/projects/monitoring/petlive/components/admin/screens/devices-screen";
import { LogsScreen } from "@/projects/monitoring/petlive/components/admin/screens/logs-screen";
import type { AdminScreen } from "@/projects/monitoring/petlive/lib/navigation";

export function AdminApp() {
  const [screen, setScreen] = useState<AdminScreen>("dashboard");

  const onNavigate = (next: AdminScreen) => setScreen(next);

  return (
    <AdminShell screen={screen} onNavigate={onNavigate}>
      {screen === "dashboard" && <DashboardScreen onNavigate={onNavigate} />}
      {screen === "members" && <MembersScreen onNavigate={onNavigate} />}
      {screen === "devices" && <DevicesScreen onNavigate={onNavigate} />}
      {screen === "logs" && <LogsScreen onNavigate={onNavigate} />}
    </AdminShell>
  );
}
