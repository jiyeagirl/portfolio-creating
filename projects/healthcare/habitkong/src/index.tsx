"use client";

import { useState } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/projects/healthcare/habitkong/components/bottom-nav";
import { HomeScreen } from "@/projects/healthcare/habitkong/components/screens/home-screen";
import { DietScreen } from "@/projects/healthcare/habitkong/components/screens/diet-screen";
import { RoutineScreen } from "@/projects/healthcare/habitkong/components/screens/routine-screen";
import { DiaryScreen } from "@/projects/healthcare/habitkong/components/screens/diary-screen";
import type { HabitkongScreen } from "@/projects/healthcare/habitkong/lib/navigation";

export default function Habitkong() {
  const [screen, setScreen] = useState<HabitkongScreen>("home");

  return (
    <PhoneFrame>
      <div className="relative h-full w-full">
        {screen === "home" && <HomeScreen onNavigate={setScreen} />}
        {screen === "diet" && <DietScreen />}
        {screen === "routine" && <RoutineScreen />}
        {screen === "diary" && <DiaryScreen />}
      </div>
      <BottomNav active={screen} onNavigate={setScreen} />
    </PhoneFrame>
  );
}
