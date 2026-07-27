"use client";

import { useState } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/projects/healthcare/habitkong/components/bottom-nav";
import { HomeScreen } from "@/projects/healthcare/habitkong/components/screens/home-screen";
import { StatsScreen } from "@/projects/healthcare/habitkong/components/screens/stats-screen";
import type { HabitkongScreen } from "@/projects/healthcare/habitkong/lib/navigation";

export default function Habitkong() {
  const [screen, setScreen] = useState<HabitkongScreen>("home");

  return (
    <PhoneFrame>
      <div className="relative h-full w-full">
        {screen === "home" && <HomeScreen />}
        {screen === "stats" && <StatsScreen />}
      </div>
      <BottomNav active={screen} onNavigate={setScreen} />
    </PhoneFrame>
  );
}
