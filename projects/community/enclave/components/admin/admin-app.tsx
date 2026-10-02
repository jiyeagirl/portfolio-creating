"use client";

import { useState } from "react";
import "@/projects/community/enclave/styles/enclave.css";
import { AdminShell } from "@/projects/community/enclave/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/community/enclave/components/admin/dashboard-screen";
import { MembersReportsScreen } from "@/projects/community/enclave/components/admin/members-reports-screen";
import { ComplexesPostsScreen } from "@/projects/community/enclave/components/admin/complexes-posts-screen";
import type { AdminScreen } from "@/projects/community/enclave/lib/navigation";

export function AdminApp() {
  const [screen, setScreen] = useState<AdminScreen>("dashboard");

  return (
    <AdminShell screen={screen} onNavigate={setScreen}>
      {screen === "dashboard" && <DashboardScreen onOpenReports={() => setScreen("members")} />}
      {screen === "members" && <MembersReportsScreen />}
      {screen === "complexes" && <ComplexesPostsScreen />}
    </AdminShell>
  );
}
