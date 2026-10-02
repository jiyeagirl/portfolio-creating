"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import "@/projects/b2b/genderinsight/styles/genderinsight.css";
import { LoginScreen } from "@/projects/b2b/genderinsight/components/screens/login-screen";
import { SurveyScreen } from "@/projects/b2b/genderinsight/components/screens/survey-screen";
import { CompleteScreen } from "@/projects/b2b/genderinsight/components/screens/complete-screen";
import { ResultScreen } from "@/projects/b2b/genderinsight/components/screens/result-screen";

const PARTICIPANT_SCREENS = ["login", "survey", "complete", "result"] as const;
type ParticipantScreen = (typeof PARTICIPANT_SCREENS)[number];

const subscribeToNothing = () => () => {};

export default function GenderInsight() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo<ParticipantScreen>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return (PARTICIPANT_SCREENS as readonly string[]).includes(requested ?? "")
      ? (requested as ParticipantScreen)
      : "login";
  }, [search]);

  const [screen, setScreen] = useState<ParticipantScreen | null>(null);
  const active = screen ?? initial;

  if (active === "survey") return <SurveyScreen onNavigate={setScreen} />;
  if (active === "complete") return <CompleteScreen onNavigate={setScreen} />;
  if (active === "result") return <ResultScreen onNavigate={setScreen} />;
  return <LoginScreen onNavigate={setScreen} />;
}
