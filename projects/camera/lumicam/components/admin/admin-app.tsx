"use client";

import { useState } from "react";
import "@/projects/camera/lumicam/styles/lumicam.css";
import { AdminShell } from "@/projects/camera/lumicam/components/admin/admin-shell";
import { LutsScreen } from "@/projects/camera/lumicam/components/admin/luts-screen";
import { EngineScreen } from "@/projects/camera/lumicam/components/admin/engine-screen";
import { OpsScreen } from "@/projects/camera/lumicam/components/admin/ops-screen";
import type { AdminScreen as AdminScreenKey } from "@/projects/camera/lumicam/lib/navigation";

export function AdminApp() {
  const [screen, setScreen] = useState<AdminScreenKey>("luts");

  return (
    <AdminShell screen={screen} onNavigate={setScreen}>
      {screen === "luts" && <LutsScreen />}
      {screen === "engine" && <EngineScreen />}
      {screen === "ops" && <OpsScreen />}
    </AdminShell>
  );
}
