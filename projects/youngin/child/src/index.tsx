"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/youngin/child/styles/child.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { CHILDREN, getFacility } from "@/projects/youngin/child/lib/mock-data";
import type { ChildScreen } from "@/projects/youngin/child/lib/navigation";
import { TAB_SCREENS } from "@/projects/youngin/child/lib/navigation";
import { BottomNav } from "@/projects/youngin/child/components/bottom-nav";
import { HomeScreen } from "@/projects/youngin/child/components/screens/home-screen";
import { FacilityDetailScreen } from "@/projects/youngin/child/components/screens/facility-detail-screen";
import { MissionScreen } from "@/projects/youngin/child/components/screens/mission-screen";
import { RecordScreen } from "@/projects/youngin/child/components/screens/record-screen";

const SCREENS: ChildScreen[] = ["home", "facility", "mission", "record"];

// 스크린샷 도구(scripts/capture-screenshot.ts)가 `?screen=<name>` 으로 특정 화면을
// 요청할 수 있게 한다. 예: /youngin/child?screen=facility
// 마운트 시 한 번만 읽고, 이후 화면 전환은 in-app 내비게이션이 담당한다.
function getInitialScreen(param: string | null): ChildScreen {
  return SCREENS.includes(param as ChildScreen) ? (param as ChildScreen) : "home";
}

export default function YonginChild() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<ChildScreen>(() =>
    getInitialScreen(searchParams.get("screen")),
  );
  const [childId, setChildId] = useState(CHILDREN[0].id);
  // `?facility=<id>` 와 `?qr=1` 은 스크린샷 도구가 시설 상세의 특정 상태를 잡을 때 쓴다.
  // 예: npm run capture youngin child "facility:qr=1"
  const [facilityId, setFacilityId] = useState(searchParams.get("facility"));
  const [qrOpen, setQrOpen] = useState(searchParams.get("qr") === "1");

  const child = CHILDREN.find((item) => item.id === childId) ?? CHILDREN[0];
  const facility = getFacility(facilityId);

  function navigate(
    next: ChildScreen,
    options?: { facilityId?: string; openQr?: boolean },
  ) {
    if (options?.facilityId) setFacilityId(options.facilityId);
    setQrOpen(options?.openQr ?? false);
    setScreen(next);
  }

  return (
    <PhoneFrame
      screenClassName="yongin-child bg-[var(--yc-canvas)] text-[var(--yc-ink)]"
      statusBarClassName={screen === "home" ? "text-white" : "text-[var(--yc-ink)]"}
      homeIndicatorClassName="bg-[var(--yc-ink)]/35"
    >
      {screen === "home" && (
        <HomeScreen child={child} onSelectChild={setChildId} onNavigate={navigate} />
      )}
      {screen === "facility" && (
        <FacilityDetailScreen
          key={`${facility.id}-${qrOpen}`}
          facility={facility}
          child={child}
          autoOpenQr={qrOpen}
          onNavigate={navigate}
        />
      )}
      {screen === "mission" && <MissionScreen child={child} onNavigate={navigate} />}
      {screen === "record" && <RecordScreen child={child} onNavigate={navigate} />}

      {/* 시설 상세는 푸시로 열리는 화면이라 탭바를 감춘다(하단에 인증 바가 들어간다). */}
      {TAB_SCREENS.includes(screen) && <BottomNav active={screen} onNavigate={navigate} />}
    </PhoneFrame>
  );
}
