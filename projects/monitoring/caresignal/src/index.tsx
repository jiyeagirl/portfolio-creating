"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/monitoring/caresignal/styles/caresignal.css";
import { BottomNav } from "@/projects/monitoring/caresignal/components/app/bottom-nav";
import { OnboardingScreen } from "@/projects/monitoring/caresignal/components/app/screens/onboarding-screen";
import { HomeScreen } from "@/projects/monitoring/caresignal/components/app/screens/home-screen";
import { FallScreen } from "@/projects/monitoring/caresignal/components/app/screens/fall-screen";
import { LocationScreen } from "@/projects/monitoring/caresignal/components/app/screens/location-screen";
import { ActivityScreen } from "@/projects/monitoring/caresignal/components/app/screens/activity-screen";
import { SosScreen } from "@/projects/monitoring/caresignal/components/app/screens/sos-screen";
import { NotificationsScreen } from "@/projects/monitoring/caresignal/components/app/screens/notifications-screen";
import { ReportScreen } from "@/projects/monitoring/caresignal/components/app/screens/report-screen";
import { notifications } from "@/projects/monitoring/caresignal/lib/app-data";
import {
  APP_SCREENS,
  FULLSCREEN,
  TAB_OF_SCREEN,
  type AppScreen,
} from "@/projects/monitoring/caresignal/lib/navigation";

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function CareSignal() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initialScreen = useMemo<AppScreen>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return APP_SCREENS.includes(requested as AppScreen) ? (requested as AppScreen) : "home";
  }, [search]);

  const [screen, setScreen] = useState<AppScreen | null>(null);
  const active = screen ?? initialScreen;
  const showTabs = !FULLSCREEN.includes(active);
  const unread = notifications.filter((n) => !n.read).length;
  const [fallDark, setFallDark] = useState(true);
  const isFallDark = active === "fall" && fallDark;

  return (
    <PhoneFrame
      statusBarClassName={isFallDark ? "text-white" : "text-neutral-900"}
      homeIndicatorClassName={isFallDark ? "bg-white/70" : "bg-neutral-900/80"}
    >
      <div className={`caresignal min-h-full w-full ${isFallDark ? "bg-[#1d1d1f]" : "bg-white"}`}>
        {active === "onboarding" && <OnboardingScreen onNavigate={setScreen} />}
        {active === "home" && <HomeScreen onNavigate={setScreen} />}
        {active === "fall" && <FallScreen onNavigate={setScreen} onDarkChange={setFallDark} />}
        {active === "location" && <LocationScreen />}
        {active === "activity" && <ActivityScreen />}
        {active === "sos" && <SosScreen onNavigate={setScreen} />}
        {active === "notifications" && <NotificationsScreen />}
        {active === "report" && <ReportScreen />}
      </div>

      {showTabs && (
        <BottomNav active={TAB_OF_SCREEN[active]} unread={unread} onNavigate={setScreen} />
      )}
    </PhoneFrame>
  );
}
