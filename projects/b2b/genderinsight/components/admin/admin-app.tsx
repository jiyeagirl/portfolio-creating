"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/genderinsight/styles/genderinsight.css";
import { AdminShell } from "@/projects/b2b/genderinsight/components/admin/admin-shell";
import { AdminLoginScreen } from "@/projects/b2b/genderinsight/components/admin/admin-login-screen";
import { AdminDashboard } from "@/projects/b2b/genderinsight/components/admin/admin-dashboard";
import { AdminAssessments } from "@/projects/b2b/genderinsight/components/admin/admin-assessments";
import { AdminQuestions } from "@/projects/b2b/genderinsight/components/admin/admin-questions";
import { AdminParticipants } from "@/projects/b2b/genderinsight/components/admin/admin-participants";
import { AdminResponses } from "@/projects/b2b/genderinsight/components/admin/admin-responses";
import { AdminAnalysis } from "@/projects/b2b/genderinsight/components/admin/admin-analysis";
import { AdminReports } from "@/projects/b2b/genderinsight/components/admin/admin-reports";
import { AdminSettings } from "@/projects/b2b/genderinsight/components/admin/admin-settings";
import { ADMIN_SCREENS, type AdminScreen } from "@/projects/b2b/genderinsight/lib/navigation";

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

  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState<AdminScreen | null>(null);
  const active = screen ?? initial;

  if (!authed) {
    return <AdminLoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminShell screen={active} onNavigate={setScreen}>
      {active === "dashboard" && <AdminDashboard onNavigate={setScreen} />}
      {active === "assessments" && <AdminAssessments />}
      {active === "questions" && <AdminQuestions />}
      {active === "participants" && <AdminParticipants />}
      {active === "responses" && <AdminResponses />}
      {active === "analysis" && <AdminAnalysis />}
      {active === "reports" && <AdminReports />}
      {active === "settings" && <AdminSettings />}
    </AdminShell>
  );
}
