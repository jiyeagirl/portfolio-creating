"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/monitoring/petlive/styles/petlive.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { AUTH_SCREENS, type PetliveScreen } from "@/projects/monitoring/petlive/lib/navigation";
import { LoginScreen } from "@/projects/monitoring/petlive/components/screens/login-screen";
import { SignupScreen } from "@/projects/monitoring/petlive/components/screens/signup-screen";
import { ForgotPasswordScreen } from "@/projects/monitoring/petlive/components/screens/forgot-password-screen";
import { HomeScreen } from "@/projects/monitoring/petlive/components/screens/home-screen";
import { MonitoringScreen } from "@/projects/monitoring/petlive/components/screens/monitoring-screen";
import { DeviceRegisterScreen } from "@/projects/monitoring/petlive/components/screens/device-register-screen";
import { DeviceManageScreen } from "@/projects/monitoring/petlive/components/screens/device-manage-screen";
import { NotificationsScreen } from "@/projects/monitoring/petlive/components/screens/notifications-screen";
import { MyPageScreen } from "@/projects/monitoring/petlive/components/screens/my-page-screen";
import { EventHistoryScreen } from "@/projects/monitoring/petlive/components/screens/event-history-screen";

const SCREENS: PetliveScreen[] = [
  "login",
  "signup",
  "forgotPassword",
  "home",
  "monitoring",
  "deviceRegister",
  "deviceManage",
  "notifications",
  "myPage",
  "eventHistory",
];

// 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 마운트 시 한 번만 반영하고
// 이후 내비게이션은 내부 state가 담당한다.
function getInitialScreen(param: string | null): PetliveScreen {
  return SCREENS.includes(param as PetliveScreen) ? (param as PetliveScreen) : "login";
}

export default function PetLive() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<PetliveScreen>(() => getInitialScreen(searchParams.get("screen")));
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

  function navigate(next: PetliveScreen, id?: string) {
    if (id) setSelectedDeviceId(id);
    setScreen(next);
  }

  const isAuthScreen = AUTH_SCREENS.includes(screen);

  return (
    <PhoneFrame
      /* `petlive-app`은 모바일 앱 전용 다크 스코프다(아키타입 A5, 팔레트 구성 2).
         관리자 콘솔은 `.petlive` 웜 라이트를 그대로 쓴다 — 표를 읽는 도구라
         반대 요구를 갖는다. 자세한 이유는 styles/petlive.css 주석 참고. */
      screenClassName={`petlive petlive-app relative bg-[var(--pl-canvas)] text-[var(--pl-ink)] ${isAuthScreen ? "" : "flex flex-col"}`}
      statusBarClassName="text-[var(--pl-ink)]"
      homeIndicatorClassName="bg-[var(--pl-ink)]/70"
    >
      {screen === "login" && <LoginScreen onNavigate={navigate} />}
      {screen === "signup" && <SignupScreen onNavigate={navigate} />}
      {screen === "forgotPassword" && <ForgotPasswordScreen onNavigate={navigate} />}
      {screen === "home" && <HomeScreen onNavigate={navigate} />}
      {screen === "monitoring" && <MonitoringScreen deviceId={selectedDeviceId} onNavigate={navigate} />}
      {screen === "deviceRegister" && <DeviceRegisterScreen onNavigate={navigate} />}
      {screen === "deviceManage" && <DeviceManageScreen onNavigate={navigate} />}
      {screen === "notifications" && <NotificationsScreen onNavigate={navigate} />}
      {screen === "myPage" && <MyPageScreen onNavigate={navigate} />}
      {screen === "eventHistory" && <EventHistoryScreen onNavigate={navigate} />}
    </PhoneFrame>
  );
}
