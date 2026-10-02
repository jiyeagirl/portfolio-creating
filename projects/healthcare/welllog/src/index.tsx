"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/healthcare/welllog/styles/welllog.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/projects/healthcare/welllog/components/bottom-nav";
import { OnboardingScreen } from "@/projects/healthcare/welllog/components/screens/onboarding-screen";
import { HomeScreen } from "@/projects/healthcare/welllog/components/screens/home-screen";
import { DietScreen } from "@/projects/healthcare/welllog/components/screens/diet-screen";
import { ChallengeScreen } from "@/projects/healthcare/welllog/components/screens/challenge-screen";
import { ReportScreen } from "@/projects/healthcare/welllog/components/screens/report-screen";
import { MypageScreen } from "@/projects/healthcare/welllog/components/screens/mypage-screen";
import { HistoryScreen } from "@/projects/healthcare/welllog/components/screens/history-screen";
import { NotificationsScreen } from "@/projects/healthcare/welllog/components/screens/notifications-screen";
import type { Navigate, TabKey } from "@/projects/healthcare/welllog/lib/navigation";
import { TABS } from "@/projects/healthcare/welllog/lib/navigation";

type Overlay = "history" | "notifications" | null;

const TAB_KEYS = TABS.map((t) => t.key);
const OVERLAY_KEYS: Overlay[] = ["history", "notifications"];

interface InitialState {
  onboarded: boolean;
  tab: TabKey;
  overlay: Overlay;
  onboardingStep: number;
}

// Lets screenshot tooling (scripts/capture-screenshot.ts) request a specific
// screen via `?screen=<name>`, e.g. /healthcare/welllog?screen=diet. Read
// once at mount; in-app navigation still drives state afterwards. A
// tab/overlay name skips onboarding so the requested screen actually renders.
// `onboarding-<n>` (n = 0..4) instead lands directly on that onboarding step.
function getInitialState(param: string | null): InitialState {
  if (param && (TAB_KEYS as string[]).includes(param)) {
    return { onboarded: true, tab: param as TabKey, overlay: null, onboardingStep: 0 };
  }
  if (param && (OVERLAY_KEYS as string[]).includes(param)) {
    return { onboarded: true, tab: "home", overlay: param as Overlay, onboardingStep: 0 };
  }
  const stepMatch = param?.match(/^onboarding-(\d)$/);
  if (stepMatch) {
    return { onboarded: false, tab: "home", overlay: null, onboardingStep: Number(stepMatch[1]) };
  }
  return { onboarded: false, tab: "home", overlay: null, onboardingStep: 0 };
}

export default function WelllogApp() {
  const searchParams = useSearchParams();
  const initial = getInitialState(searchParams.get("screen"));
  const [onboarded, setOnboarded] = useState(initial.onboarded);
  const [tab, setTab] = useState<TabKey>(initial.tab);
  const [overlay, setOverlay] = useState<Overlay>(initial.overlay);

  const navigate: Navigate = (screen) => {
    if (screen === "history" || screen === "notifications") {
      setOverlay(screen);
      return;
    }
    if (screen === "onboarding") return;
    setOverlay(null);
    setTab(screen);
  };

  if (!onboarded) {
    return (
      <PhoneFrame screenClassName="welllog bg-[var(--wl-canvas)] text-[var(--wl-ink)]">
        <OnboardingScreen onComplete={() => setOnboarded(true)} initialStep={initial.onboardingStep} />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame screenClassName="welllog bg-[var(--wl-canvas)] text-[var(--wl-ink)]">
      <div className="relative h-full w-full">
        {tab === "home" && <HomeScreen onNavigate={navigate} onOpenDiet={() => navigate("diet")} />}
        {tab === "diet" && <DietScreen />}
        {tab === "challenge" && <ChallengeScreen />}
        {tab === "report" && <ReportScreen />}
        {tab === "mypage" && <MypageScreen />}

        {overlay && (
          <div className="wl-enter absolute inset-0 z-30 bg-[var(--wl-canvas)]">
            {overlay === "history" && <HistoryScreen onBack={() => setOverlay(null)} />}
            {overlay === "notifications" && <NotificationsScreen onBack={() => setOverlay(null)} />}
          </div>
        )}

        {!overlay && <BottomNav active={tab} onNavigate={navigate} />}
      </div>
    </PhoneFrame>
  );
}
