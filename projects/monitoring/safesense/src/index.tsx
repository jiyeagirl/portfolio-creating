"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { WatchFrame } from "@/components/shared/watch-frame";
import "@/projects/monitoring/safesense/styles/safesense.css";
import { BottomNav } from "@/projects/monitoring/safesense/components/app/bottom-nav";
import { HomeScreen } from "@/projects/monitoring/safesense/components/app/screens/home-screen";
import { WorkStartScreen } from "@/projects/monitoring/safesense/components/app/screens/work-start-screen";
import { EventScreen } from "@/projects/monitoring/safesense/components/app/screens/event-screen";
import { RecordsScreen } from "@/projects/monitoring/safesense/components/app/screens/records-screen";
import { NotificationsScreen } from "@/projects/monitoring/safesense/components/app/screens/notifications-screen";
import { MypageScreen } from "@/projects/monitoring/safesense/components/app/screens/mypage-screen";
import { WatchStatusScreen } from "@/projects/monitoring/safesense/components/watch/screens/status-screen";
import { WatchDangerScreen } from "@/projects/monitoring/safesense/components/watch/screens/danger-screen";
import { WatchSosScreen } from "@/projects/monitoring/safesense/components/watch/screens/sos-screen";
import { WatchWorkInfoScreen } from "@/projects/monitoring/safesense/components/watch/screens/work-info-screen";
import { notifications } from "@/projects/monitoring/safesense/lib/mock-data";
import {
  APP_SCREENS,
  FULLSCREEN,
  TAB_OF_SCREEN,
  WATCH_SCREENS,
  type AppScreen,
  type WatchScreen,
} from "@/projects/monitoring/safesense/lib/navigation";

type Device = "phone" | "watch";

/* 스크린샷 도구가 넘기는 `?device=`/`?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로
   두면 hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function SafeSense() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const device: Device = params.get("device") === "watch" ? "watch" : "phone";
    const requestedScreen = params.get("screen");
    const appScreen = APP_SCREENS.includes(requestedScreen as AppScreen)
      ? (requestedScreen as AppScreen)
      : "home";
    const watchScreen = WATCH_SCREENS.includes(requestedScreen as WatchScreen)
      ? (requestedScreen as WatchScreen)
      : "status";
    return { device, appScreen, watchScreen };
  }, [search]);

  const [device, setDevice] = useState<Device | null>(null);
  const [appScreen, setAppScreen] = useState<AppScreen | null>(null);
  const [watchScreen, setWatchScreen] = useState<WatchScreen | null>(null);

  const activeDevice = device ?? initial.device;
  const activeAppScreen = appScreen ?? initial.appScreen;
  const activeWatchScreen = watchScreen ?? initial.watchScreen;

  const showTabs = !FULLSCREEN.includes(activeAppScreen);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative min-h-dvh bg-white">
      <div className="ss-mono absolute left-1/2 top-6 z-30 flex -translate-x-1/2 gap-[1px] bg-[#e0e0e0] text-[10px] font-semibold">
        {(["phone", "watch"] as Device[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDevice(d)}
            className={`px-3.5 py-1.5 ${
              activeDevice === d ? "bg-[#0a0a0a] text-white" : "bg-white text-[#8a8a8a]"
            }`}
          >
            {d === "phone" ? "폰" : "워치"}
          </button>
        ))}
      </div>

      {activeDevice === "phone" ? (
        <PhoneFrame
          screenClassName="safesense bg-[#0a0a0a] text-[#eaeaea]"
          statusBarClassName="text-neutral-50"
          homeIndicatorClassName="bg-white/70"
        >
          <div className="min-h-full w-full">
            {activeAppScreen === "home" && <HomeScreen onNavigate={setAppScreen} />}
            {activeAppScreen === "work-start" && <WorkStartScreen onNavigate={setAppScreen} />}
            {activeAppScreen === "event" && <EventScreen onNavigate={setAppScreen} />}
            {activeAppScreen === "records" && <RecordsScreen />}
            {activeAppScreen === "notifications" && <NotificationsScreen />}
            {activeAppScreen === "mypage" && <MypageScreen />}
          </div>

          {showTabs && (
            <BottomNav
              active={TAB_OF_SCREEN[activeAppScreen]}
              unread={unread}
              onNavigate={setAppScreen}
            />
          )}
        </PhoneFrame>
      ) : (
        <WatchFrame screenClassName="safesense bg-[#0a0a0a] text-[#eaeaea]">
          <div className="h-full w-full">
            {activeWatchScreen === "status" && <WatchStatusScreen onNavigate={setWatchScreen} />}
            {activeWatchScreen === "danger" && <WatchDangerScreen onNavigate={setWatchScreen} />}
            {activeWatchScreen === "sos" && <WatchSosScreen onNavigate={setWatchScreen} />}
            {activeWatchScreen === "work-info" && (
              <WatchWorkInfoScreen onNavigate={setWatchScreen} />
            )}
          </div>
        </WatchFrame>
      )}
    </div>
  );
}
