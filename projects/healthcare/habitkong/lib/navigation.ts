export type HabitkongScreen =
  | "onboarding"
  | "home"
  | "diet"
  | "scan"
  | "routine"
  | "report"
  | "diary"
  | "goals"
  | "mypage";

export type HabitkongNavigate = (screen: HabitkongScreen) => void;

export type TabKey = "home" | "diet" | "routine" | "report" | "mypage";

/** 하단 탭이 활성으로 보여야 하는 화면 묶음. 다이어리와 목표는 탭 없이 진입한다. */
export const TAB_OF_SCREEN: Record<HabitkongScreen, TabKey> = {
  onboarding: "home",
  home: "home",
  diet: "diet",
  scan: "diet",
  routine: "routine",
  report: "report",
  diary: "report",
  goals: "home",
  mypage: "mypage",
};

/** 하단 탭을 감추는 화면. 온보딩과 뒤로가기 헤더를 가진 화면들, 그리고 카메라 촬영 화면(scan). */
export const FULLSCREEN: HabitkongScreen[] = ["onboarding", "diary", "goals", "scan"];
