"use client";

import { useState } from "react";
import { AppShell } from "@/projects/monitoring/marketflow/components/layout/app-shell";
import { CalendarScreen } from "@/projects/monitoring/marketflow/components/screens/calendar-screen";
import { CollectionScreen } from "@/projects/monitoring/marketflow/components/screens/collection-screen";
import { CrmScreen } from "@/projects/monitoring/marketflow/components/screens/crm-screen";
import { DashboardScreen } from "@/projects/monitoring/marketflow/components/screens/dashboard-screen";
import { EditorScreen } from "@/projects/monitoring/marketflow/components/screens/editor-screen";
import { GenerateScreen } from "@/projects/monitoring/marketflow/components/screens/generate-screen";
import { PromptScreen } from "@/projects/monitoring/marketflow/components/screens/prompt-screen";
import { SettingsScreen } from "@/projects/monitoring/marketflow/components/screens/settings-screen";
import { WorkflowScreen } from "@/projects/monitoring/marketflow/components/screens/workflow-screen";
import type { Screen } from "@/projects/monitoring/marketflow/lib/navigation";
import "@/projects/monitoring/marketflow/styles/marketflow.css";

export default function MarketflowApp() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  return (
    <AppShell screen={screen} onNavigate={setScreen}>
      {screen === "dashboard" && <DashboardScreen onNavigate={setScreen} />}
      {screen === "generate" && <GenerateScreen onNavigate={setScreen} />}
      {screen === "calendar" && <CalendarScreen />}
      {screen === "editor" && <EditorScreen />}
      {screen === "crm" && <CrmScreen />}
      {screen === "workflow" && <WorkflowScreen />}
      {screen === "prompts" && <PromptScreen />}
      {screen === "collection" && <CollectionScreen />}
      {screen === "settings" && <SettingsScreen />}
    </AppShell>
  );
}
