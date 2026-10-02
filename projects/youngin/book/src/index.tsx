"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/youngin/book/styles/book.css";
import { BottomNav } from "@/projects/youngin/book/components/bottom-nav";
import { HomeScreen } from "@/projects/youngin/book/components/screens/home-screen";
import { LibrariesScreen } from "@/projects/youngin/book/components/screens/libraries-screen";
import { LibraryDetailScreen } from "@/projects/youngin/book/components/screens/library-detail-screen";
import { CertifyScreen } from "@/projects/youngin/book/components/screens/certify-screen";
import { ScanScreen } from "@/projects/youngin/book/components/screens/scan-screen";
import { BookCertifyScreen } from "@/projects/youngin/book/components/screens/book-certify-screen";
import { CertifyDoneScreen } from "@/projects/youngin/book/components/screens/certify-done-screen";
import { MissionDetailScreen } from "@/projects/youngin/book/components/screens/mission-detail-screen";
import { RecordScreen } from "@/projects/youngin/book/components/screens/record-screen";
import { CollectionScreen } from "@/projects/youngin/book/components/screens/collection-screen";
import { RewardsScreen } from "@/projects/youngin/book/components/screens/rewards-screen";
import { ShareScreen } from "@/projects/youngin/book/components/screens/share-screen";
import {
  DARK_BOTTOM,
  DARK_STATUS_BAR,
  FULLSCREEN,
  TAB_OF_SCREEN,
  type BookScreen,
} from "@/projects/youngin/book/lib/navigation";

const SCREEN_KEYS = Object.keys(TAB_OF_SCREEN) as BookScreen[];

/* 스크린샷 도구가 넘기는 `?screen=`, `?id=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다 (habitkong과 동일한 패턴). */
const subscribeToNothing = () => () => {};

export default function Book() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const requested = params.get("screen");
    return {
      screen: SCREEN_KEYS.includes(requested as BookScreen)
        ? (requested as BookScreen)
        : ("home" as BookScreen),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [state, setState] = useState<{ screen: BookScreen; id?: string } | null>(null);
  const active = state ?? initial;
  const showTabs = !FULLSCREEN.includes(active.screen);

  const navigate = (screen: BookScreen, id?: string) => setState({ screen, id });

  return (
    <PhoneFrame
      screenClassName="book bg-[var(--bk-canvas)] text-[var(--bk-body)]"
      statusBarClassName={
        DARK_STATUS_BAR.includes(active.screen) ? "text-[#F0EEE4]" : "text-[#1A1D19]"
      }
      homeIndicatorClassName={DARK_BOTTOM.includes(active.screen) ? "bg-[#F0EEE4]" : undefined}
    >
      {active.screen === "home" && <HomeScreen onNavigate={navigate} />}
      {active.screen === "libraries" && <LibrariesScreen onNavigate={navigate} />}
      {active.screen === "libraryDetail" && (
        <LibraryDetailScreen libraryId={active.id} onNavigate={navigate} />
      )}
      {active.screen === "certify" && <CertifyScreen onNavigate={navigate} />}
      {active.screen === "scan" && <ScanScreen libraryId={active.id} onNavigate={navigate} />}
      {active.screen === "bookCertify" && <BookCertifyScreen onNavigate={navigate} />}
      {active.screen === "certifyDone" && (
        <CertifyDoneScreen kind={active.id} onNavigate={navigate} />
      )}
      {active.screen === "missionDetail" && (
        <MissionDetailScreen missionId={active.id} onNavigate={navigate} />
      )}
      {active.screen === "record" && <RecordScreen onNavigate={navigate} />}
      {active.screen === "collection" && <CollectionScreen onNavigate={navigate} />}
      {active.screen === "rewards" && <RewardsScreen onNavigate={navigate} />}
      {active.screen === "share" && <ShareScreen onNavigate={navigate} />}

      {showTabs && <BottomNav active={TAB_OF_SCREEN[active.screen]} onNavigate={navigate} />}
    </PhoneFrame>
  );
}
