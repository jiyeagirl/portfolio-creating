export type TabKey = "home" | "diet" | "challenge" | "report" | "mypage";

export type WelllogScreen = TabKey | "onboarding" | "history" | "notifications";

export type Navigate = (screen: WelllogScreen) => void;

/** 탭이 없는 풀스크린 화면. habitkong의 FULLSCREEN 패턴과 동일. */
export const FULLSCREEN: WelllogScreen[] = ["onboarding", "history", "notifications"];

export const TABS: { key: TabKey; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "diet", label: "식단" },
  { key: "challenge", label: "챌린지" },
  { key: "report", label: "리포트" },
  { key: "mypage", label: "마이" },
];

export type Tone = "neutral" | "sage" | "amber" | "coral" | "periwinkle";

export function formatSteps(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatKcal(value: number): string {
  return `${value.toLocaleString("ko-KR")}kcal`;
}
