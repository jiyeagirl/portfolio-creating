export type AdminScreen =
  | "dashboard"
  | "assessments"
  | "questions"
  | "participants"
  | "responses"
  | "analysis"
  | "reports"
  | "settings";

export const ADMIN_SCREENS: AdminScreen[] = [
  "dashboard",
  "assessments",
  "questions",
  "participants",
  "responses",
  "analysis",
  "reports",
  "settings",
];

export const ADMIN_GROUPS = ["운영", "분석", "설정"] as const;

export const ADMIN_NAV: { key: AdminScreen; label: string; group: (typeof ADMIN_GROUPS)[number] }[] = [
  { key: "dashboard", label: "대시보드", group: "운영" },
  { key: "assessments", label: "진단 관리", group: "운영" },
  { key: "questions", label: "문항 관리", group: "운영" },
  { key: "participants", label: "참여자 관리", group: "운영" },
  { key: "responses", label: "응답 현황", group: "운영" },
  { key: "analysis", label: "결과 분석", group: "분석" },
  { key: "reports", label: "리포트 관리", group: "분석" },
  { key: "settings", label: "권한 / 개인정보", group: "설정" },
];

export type ParticipantScreen = "login" | "survey" | "complete" | "result";
