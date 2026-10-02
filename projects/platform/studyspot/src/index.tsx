"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/platform/studyspot/styles/studyspot.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { AUTH_SCREENS, type StudyspotScreen } from "@/projects/platform/studyspot/lib/navigation";
import { LoginScreen } from "@/projects/platform/studyspot/components/screens/login-screen";
import { HomeScreen } from "@/projects/platform/studyspot/components/screens/home-screen";
import { BranchDetailScreen } from "@/projects/platform/studyspot/components/screens/branch-detail-screen";
import { SeatBookingScreen } from "@/projects/platform/studyspot/components/screens/seat-booking-screen";
import { RoomBookingScreen } from "@/projects/platform/studyspot/components/screens/room-booking-screen";
import { FixedSeatScreen } from "@/projects/platform/studyspot/components/screens/fixed-seat-screen";
import { PaymentScreen } from "@/projects/platform/studyspot/components/screens/payment-screen";
import { QrCheckinScreen } from "@/projects/platform/studyspot/components/screens/qr-checkin-screen";
import { SessionScreen } from "@/projects/platform/studyspot/components/screens/session-screen";
import { MyPageScreen } from "@/projects/platform/studyspot/components/screens/my-page-screen";

const SCREENS: StudyspotScreen[] = [
  "login",
  "home",
  "branchDetail",
  "seatBooking",
  "roomBooking",
  "fixedSeat",
  "payment",
  "qrCheckin",
  "session",
  "myPage",
];

// 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 마운트 시 한 번만 반영하고
// 이후 내비게이션은 내부 state가 담당한다.
function getInitialScreen(param: string | null): StudyspotScreen {
  return SCREENS.includes(param as StudyspotScreen) ? (param as StudyspotScreen) : "login";
}

export default function StudySpot() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<StudyspotScreen>(() => getInitialScreen(searchParams.get("screen")));
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  function navigate(next: StudyspotScreen, id?: string) {
    if (id) setSelectedId(id);
    setScreen(next);
  }

  const isAuthScreen = AUTH_SCREENS.includes(screen);

  return (
    <PhoneFrame
      screenClassName={`studyspot relative bg-[var(--ss-canvas)] text-[var(--ss-ink)] ${isAuthScreen ? "" : "flex flex-col"}`}
      statusBarClassName="text-[var(--ss-ink)]"
      homeIndicatorClassName="bg-[var(--ss-ink)]/70"
    >
      {screen === "login" && <LoginScreen onNavigate={navigate} />}
      {screen === "home" && <HomeScreen onNavigate={navigate} />}
      {screen === "branchDetail" && <BranchDetailScreen branchId={selectedId} onNavigate={navigate} />}
      {screen === "seatBooking" && <SeatBookingScreen branchId={selectedId} onNavigate={navigate} />}
      {screen === "roomBooking" && <RoomBookingScreen roomId={selectedId} onNavigate={navigate} />}
      {screen === "fixedSeat" && <FixedSeatScreen branchId={selectedId} onNavigate={navigate} />}
      {screen === "payment" && <PaymentScreen branchId={selectedId} onNavigate={navigate} />}
      {screen === "qrCheckin" && <QrCheckinScreen onNavigate={navigate} />}
      {screen === "session" && <SessionScreen onNavigate={navigate} />}
      {screen === "myPage" && <MyPageScreen onNavigate={navigate} />}
    </PhoneFrame>
  );
}
