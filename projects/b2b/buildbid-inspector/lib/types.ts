import type { StaticImageData } from "next/image";

export type EquipmentType = "굴삭기" | "크레인" | "지게차" | "덤프트럭" | "로더" | "불도저";

export type JobStatus = "예정" | "진행중" | "완료";

export interface InspectionJob {
  id: string;
  scheduledTime: string;
  equipmentType: EquipmentType;
  equipmentModel: string;
  equipmentYear: number;
  equipmentHours: number;
  photo: StaticImageData;
  companyName: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  address: string;
  addressDetail: string;
  mapTileId: string;
  status: JobStatus;
  requestNote?: string;
}

export type ChecklistCategory = "엔진" | "유압" | "전기" | "외관" | "하부주행체" | "안전장치";

export type ChecklistResult = "정상" | "주의" | "불량" | null;

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
  result: ChecklistResult;
  memo: string;
}

export interface CapturedPhoto {
  id: string;
  picsumId: string;
  label: string;
  capturedAt: string;
}

export type DamageSeverity = "경미" | "중간" | "심각";

export interface DamageRecord {
  id: string;
  location: string;
  severity: DamageSeverity;
  memo: string;
}

export type Grade = "S" | "A" | "B" | "C";

export interface InspectionReport {
  checklist: ChecklistItem[];
  photos: CapturedPhoto[];
  damages: DamageRecord[];
  notes: string;
  grade: Grade | null;
  gradeComment: string;
}

export function createEmptyReport(checklist: ChecklistItem[]): InspectionReport {
  return {
    checklist,
    photos: [],
    damages: [],
    notes: "",
    grade: null,
    gradeComment: "",
  };
}
