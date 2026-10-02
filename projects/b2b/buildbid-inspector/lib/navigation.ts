export type InspectorScreen = "schedule" | "jobDetail" | "wizard" | "submitted";

export type WizardStep = "checklist" | "photos" | "damage" | "notes" | "grade" | "review";

export const WIZARD_STEPS: WizardStep[] = [
  "checklist",
  "photos",
  "damage",
  "notes",
  "grade",
  "review",
];

export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  checklist: "항목 체크",
  photos: "사진 촬영",
  damage: "손상 기록",
  notes: "특이사항",
  grade: "상태 등급",
  review: "최종 확인",
};

export type InspectorNavigate = (screen: InspectorScreen, jobId?: string) => void;
