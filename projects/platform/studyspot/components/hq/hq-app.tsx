"use client";

import { useState } from "react";
import "@/projects/platform/studyspot/styles/studyspot.css";
import { HqShell } from "@/projects/platform/studyspot/components/hq/hq-shell";
import { DashboardScreen } from "@/projects/platform/studyspot/components/hq/screens/dashboard-screen";
import { BranchesScreen } from "@/projects/platform/studyspot/components/hq/screens/branches-screen";
import { DevicesScreen } from "@/projects/platform/studyspot/components/hq/screens/devices-screen";
import { ContentScreen } from "@/projects/platform/studyspot/components/hq/screens/content-screen";
import { AiContentScreen } from "@/projects/platform/studyspot/components/hq/screens/ai-content-screen";
import type { HqScreen } from "@/projects/platform/studyspot/lib/navigation";

export function HqApp() {
  const [screen, setScreen] = useState<HqScreen>("dashboard");

  const onNavigate = (next: HqScreen) => setScreen(next);

  return (
    <HqShell screen={screen} onNavigate={onNavigate}>
      {screen === "dashboard" && <DashboardScreen onNavigate={onNavigate} />}
      {screen === "branches" && <BranchesScreen onNavigate={onNavigate} />}
      {screen === "devices" && <DevicesScreen onNavigate={onNavigate} />}
      {screen === "content" && <ContentScreen onNavigate={onNavigate} />}
      {screen === "aiContent" && <AiContentScreen onNavigate={onNavigate} />}
    </HqShell>
  );
}
