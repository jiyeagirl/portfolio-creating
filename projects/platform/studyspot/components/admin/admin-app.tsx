"use client";

import { useState } from "react";
import "@/projects/platform/studyspot/styles/studyspot.css";
import { AdminShell } from "@/projects/platform/studyspot/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/platform/studyspot/components/admin/screens/dashboard-screen";
import { ContentScreen } from "@/projects/platform/studyspot/components/admin/screens/content-screen";
import { DevicesScreen } from "@/projects/platform/studyspot/components/admin/screens/devices-screen";
import { AutomationScreen } from "@/projects/platform/studyspot/components/admin/screens/automation-screen";
import type { AdminScreen } from "@/projects/platform/studyspot/lib/navigation";

export function AdminApp() {
  const [screen, setScreen] = useState<AdminScreen>("dashboard");

  const onNavigate = (next: AdminScreen) => setScreen(next);

  return (
    <AdminShell screen={screen} onNavigate={onNavigate}>
      {screen === "dashboard" && <DashboardScreen onNavigate={onNavigate} />}
      {screen === "content" && <ContentScreen onNavigate={onNavigate} />}
      {screen === "devices" && <DevicesScreen onNavigate={onNavigate} />}
      {screen === "automation" && <AutomationScreen onNavigate={onNavigate} />}
    </AdminShell>
  );
}
