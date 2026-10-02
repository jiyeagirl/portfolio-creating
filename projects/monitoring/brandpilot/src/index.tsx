"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "@/projects/monitoring/brandpilot/styles/brandpilot.css";
import { AppShell } from "@/projects/monitoring/brandpilot/components/layout/app-shell";
import { LoginScreen } from "@/projects/monitoring/brandpilot/components/screens/login-screen";
import { DashboardScreen } from "@/projects/monitoring/brandpilot/components/screens/dashboard-screen";
import { ReferencesScreen } from "@/projects/monitoring/brandpilot/components/screens/references-screen";
import { BrandGuideScreen } from "@/projects/monitoring/brandpilot/components/screens/brand-guide-screen";
import { GenerateScreen } from "@/projects/monitoring/brandpilot/components/screens/generate-screen";
import { EditorScreen } from "@/projects/monitoring/brandpilot/components/screens/editor-screen";
import { ApprovalsScreen } from "@/projects/monitoring/brandpilot/components/screens/approvals-screen";
import { PublishingScreen } from "@/projects/monitoring/brandpilot/components/screens/publishing-screen";
import { LibraryScreen } from "@/projects/monitoring/brandpilot/components/screens/library-screen";
import { CampaignsScreen } from "@/projects/monitoring/brandpilot/components/screens/campaigns-screen";
import { AnalyticsScreen } from "@/projects/monitoring/brandpilot/components/screens/analytics-screen";
import type { Navigate, Screen } from "@/projects/monitoring/brandpilot/lib/navigation";

export default function BrandPilotApp() {
  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [activeContentId, setActiveContentId] = useState("ct-1");
  const reduceMotion = useReducedMotion();

  const navigate: Navigate = (next, contentId) => {
    if (contentId) setActiveContentId(contentId);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (!authed) {
    return (
      <LoginScreen
        onLogin={() => {
          setAuthed(true);
          setScreen("dashboard");
        }}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return <DashboardScreen onNavigate={navigate} />;
      case "analytics":
        return <AnalyticsScreen onNavigate={navigate} />;
      case "generate":
        return <GenerateScreen onNavigate={navigate} />;
      case "editor":
        return <EditorScreen contentId={activeContentId} onNavigate={navigate} />;
      case "library":
        return <LibraryScreen onNavigate={navigate} />;
      case "approvals":
        return <ApprovalsScreen onNavigate={navigate} />;
      case "campaigns":
        return <CampaignsScreen onNavigate={navigate} />;
      case "publishing":
        return <PublishingScreen onNavigate={navigate} />;
      case "references":
        return <ReferencesScreen />;
      case "brandGuide":
        return <BrandGuideScreen />;
      default:
        return null;
    }
  };

  return (
    <AppShell screen={screen} onNavigate={navigate} onLogout={() => setAuthed(false)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${screen}-${screen === "editor" ? activeContentId : ""}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
