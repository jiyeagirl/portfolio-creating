"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/camera/lumicam/styles/lumicam.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { shots, getShot } from "@/projects/camera/lumicam/lib/shots";
import type { LumicamScreen } from "@/projects/camera/lumicam/lib/navigation";
import { OnboardingScreen } from "@/projects/camera/lumicam/components/screens/onboarding-screen";
import { CameraScreen } from "@/projects/camera/lumicam/components/screens/camera-screen";
import { FilterSettingsScreen } from "@/projects/camera/lumicam/components/screens/filter-settings-screen";
import { ResultScreen } from "@/projects/camera/lumicam/components/screens/result-screen";
import { FilterStoreScreen } from "@/projects/camera/lumicam/components/screens/filter-store-screen";
import { ShareScreen } from "@/projects/camera/lumicam/components/screens/share-screen";

const SCREENS: LumicamScreen[] = [
  "onboarding",
  "camera",
  "filterSettings",
  "result",
  "filterStore",
  "share",
];

// 스크린샷 도구(scripts/capture-screenshot.ts)가 `?screen=<name>`으로 특정 화면을
// 바로 열 수 있게 한다. 마운트 시 한 번만 읽고 이후 화면 전환은 인앱 내비게이션이 담당.
function getInitialScreen(param: string | null): LumicamScreen {
  return SCREENS.includes(param as LumicamScreen) ? (param as LumicamScreen) : "onboarding";
}

export default function Lumicam() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<LumicamScreen>(() => getInitialScreen(searchParams.get("screen")));
  const [selectedShotId, setSelectedShotId] = useState(shots[shots.length - 1].id);

  function navigate(next: LumicamScreen, shotId?: string) {
    if (shotId) setSelectedShotId(shotId);
    setScreen(next);
  }

  // 카메라 화면은 라이브 프리뷰가, 공유 화면은 흐린 배경 사진이 상태바 아래까지 꽉
  // 채우는 어두운 화면이라 상태바를 흰색으로 반전한다(iOS의 다크 콘텐츠 적응과 동일한
  // 원리). 다만 공유 화면은 하단이 밝은 시트라 홈 인디케이터는 어두운 쪽을 유지한다.
  const darkStatusBar = screen === "camera" || screen === "share";
  const darkContentAtBottom = screen === "camera";
  const selectedShot = getShot(selectedShotId) ?? shots[shots.length - 1];

  return (
    <PhoneFrame
      screenClassName="lumicam bg-[var(--lc-canvas)] text-[var(--lc-ink)]"
      statusBarClassName={darkStatusBar ? "text-white" : "text-neutral-900"}
      homeIndicatorClassName={darkContentAtBottom ? "bg-white/85" : "bg-neutral-900/80"}
    >
      {screen === "onboarding" && <OnboardingScreen onNavigate={navigate} />}
      {screen === "camera" && <CameraScreen onNavigate={navigate} />}
      {screen === "filterSettings" && <FilterSettingsScreen shot={selectedShot} onNavigate={navigate} />}
      {screen === "result" && <ResultScreen shot={selectedShot} onNavigate={navigate} />}
      {screen === "filterStore" && <FilterStoreScreen onNavigate={navigate} />}
      {screen === "share" && <ShareScreen onNavigate={navigate} />}
    </PhoneFrame>
  );
}
