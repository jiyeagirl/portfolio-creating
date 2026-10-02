"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/youngin/festival/styles/festival.css";
import { BottomNav } from "@/projects/youngin/festival/components/bottom-nav";
import { HomeScreen } from "@/projects/youngin/festival/components/screens/home-screen";
import { MapScreen } from "@/projects/youngin/festival/components/screens/map-screen";
import { MissionScreen } from "@/projects/youngin/festival/components/screens/mission-screen";
import { MissionDoneScreen } from "@/projects/youngin/festival/components/screens/mission-done-screen";
import { ScanScreen } from "@/projects/youngin/festival/components/screens/scan-screen";
import { MISSIONS } from "@/projects/youngin/festival/lib/mock-data";
import {
  DARK_BOTTOM,
  DARK_STATUS_BAR,
  FULLSCREEN,
  TAB_OF_SCREEN,
  type FestivalScreen,
} from "@/projects/youngin/festival/lib/navigation";

const SCREEN_KEYS = Object.keys(TAB_OF_SCREEN) as FestivalScreen[];

/* 스크린샷 도구가 넘기는 `?screen=`, `?id=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다 (book, habitkong과 동일한 패턴). */
const subscribeToNothing = () => () => {};

export default function Festival() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const requested = params.get("screen");
    return {
      screen: SCREEN_KEYS.includes(requested as FestivalScreen)
        ? (requested as FestivalScreen)
        : ("home" as FestivalScreen),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [state, setState] = useState<{ screen: FestivalScreen; id?: string } | null>(null);
  const active = state ?? initial;
  const showTabs = !FULLSCREEN.includes(active.screen);

  /* 미션 완료 상태는 QR 인증 화면을 오가며 유지돼야 하므로 여기서 들고 있는다. */
  const [doneIds, setDoneIds] = useState<string[]>(() =>
    MISSIONS.filter((m) => m.done).map((m) => m.id),
  );

  const navigate = (screen: FestivalScreen, id?: string) => setState({ screen, id });
  const complete = (id: string) =>
    setDoneIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

  return (
    <PhoneFrame
      screenClassName="festival bg-[var(--fs-canvas)] text-[var(--fs-body)]"
      statusBarClassName={
        DARK_STATUS_BAR.includes(active.screen) ? "text-[#F5F1E9]" : "text-[#1C1A17]"
      }
      homeIndicatorClassName={DARK_BOTTOM.includes(active.screen) ? "bg-[#F5F1E9]" : undefined}
    >
      {active.screen === "home" && <HomeScreen doneIds={doneIds} onNavigate={navigate} />}
      {active.screen === "map" && <MapScreen facilityId={active.id} onNavigate={navigate} />}
      {active.screen === "mission" && (
        <MissionScreen doneIds={doneIds} onComplete={complete} onNavigate={navigate} />
      )}
      {active.screen === "scan" && (
        <ScanScreen missionId={active.id} onComplete={complete} onNavigate={navigate} />
      )}
      {active.screen === "missionDone" && (
        <MissionDoneScreen missionId={active.id} doneIds={doneIds} onNavigate={navigate} />
      )}

      {showTabs && <BottomNav active={TAB_OF_SCREEN[active.screen]} onNavigate={navigate} />}
    </PhoneFrame>
  );
}
