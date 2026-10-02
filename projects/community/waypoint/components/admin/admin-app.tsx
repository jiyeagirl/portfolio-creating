"use client";

import { useState } from "react";
import "@/projects/community/waypoint/styles/waypoint.css";
import { AdminShell } from "@/projects/community/waypoint/components/admin/admin-shell";
import { DashboardScreen } from "@/projects/community/waypoint/components/admin/dashboard-screen";
import { MembersScreen } from "@/projects/community/waypoint/components/admin/members-screen";
import { PostsScreen } from "@/projects/community/waypoint/components/admin/posts-screen";
import { ReportsScreen } from "@/projects/community/waypoint/components/admin/reports-screen";
import { OpsScreen } from "@/projects/community/waypoint/components/admin/ops-screen";
import type { AdminScreen } from "@/projects/community/waypoint/lib/navigation";

export function AdminApp() {
  const [screen, setScreen] = useState<AdminScreen>("dashboard");

  return (
    <AdminShell screen={screen} onNavigate={setScreen}>
      {screen === "dashboard" && <DashboardScreen onOpenReports={() => setScreen("reports")} />}
      {screen === "members" && <MembersScreen />}
      {screen === "posts" && <PostsScreen />}
      {screen === "reports" && <ReportsScreen />}
      {screen === "ops" && <OpsScreen />}
    </AdminShell>
  );
}
