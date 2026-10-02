"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/projects/healthcare/habitkong/components/bottom-nav";
import { OnboardingScreen } from "@/projects/healthcare/habitkong/components/screens/onboarding-screen";
import { HomeScreen } from "@/projects/healthcare/habitkong/components/screens/home-screen";
import { DietScreen } from "@/projects/healthcare/habitkong/components/screens/diet-screen";
import { FoodScanScreen } from "@/projects/healthcare/habitkong/components/screens/food-scan-screen";
import { RoutineScreen } from "@/projects/healthcare/habitkong/components/screens/routine-screen";
import { ReportScreen } from "@/projects/healthcare/habitkong/components/screens/report-screen";
import { DiaryScreen } from "@/projects/healthcare/habitkong/components/screens/diary-screen";
import { GoalsScreen } from "@/projects/healthcare/habitkong/components/screens/goals-screen";
import { MypageScreen } from "@/projects/healthcare/habitkong/components/screens/mypage-screen";
import {
  FULLSCREEN,
  TAB_OF_SCREEN,
  type HabitkongScreen,
} from "@/projects/healthcare/habitkong/lib/navigation";

const SCREEN_KEYS: HabitkongScreen[] = [
  "onboarding",
  "home",
  "diet",
  "scan",
  "routine",
  "report",
  "diary",
  "goals",
  "mypage",
];

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function Habitkong() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initialScreen = useMemo<HabitkongScreen>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return SCREEN_KEYS.includes(requested as HabitkongScreen)
      ? (requested as HabitkongScreen)
      : "onboarding";
  }, [search]);

  const [screen, setScreen] = useState<HabitkongScreen | null>(null);
  const active = screen ?? initialScreen;
  const showTabs = !FULLSCREEN.includes(active);

  return (
    <PhoneFrame statusBarClassName={active === "scan" ? "text-white" : "text-[#17140F]"}>
      <div className="min-h-full bg-white">
        {active === "onboarding" && <OnboardingScreen onDone={setScreen} />}
        {active === "home" && <HomeScreen onNavigate={setScreen} />}
        {active === "diet" && <DietScreen onNavigate={setScreen} />}
        {active === "scan" && <FoodScanScreen onNavigate={setScreen} />}
        {active === "routine" && <RoutineScreen />}
        {active === "report" && <ReportScreen onNavigate={setScreen} />}
        {active === "diary" && <DiaryScreen onNavigate={setScreen} />}
        {active === "goals" && <GoalsScreen onNavigate={setScreen} />}
        {active === "mypage" && <MypageScreen onNavigate={setScreen} />}
      </div>

      {showTabs && <BottomNav active={TAB_OF_SCREEN[active]} onNavigate={setScreen} />}
    </PhoneFrame>
  );
}
