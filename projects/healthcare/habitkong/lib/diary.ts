import { toKey } from "./habit";

export const dayMemos: Record<string, string> = {
  "2026-07-20": "주말이라 늦잠을 잤더니 컨디션이 한결 가벼웠다.",
  "2026-07-22": "야근해서 피곤했지만 그래도 물 마시기는 챙겼다.",
  "2026-07-24": "오늘은 컨디션 좋음. 아침 루틴도 성공!",
};

export const dayConditionScore: Record<string, number> = {
  "2026-07-18": 71,
  "2026-07-19": 76,
  "2026-07-20": 88,
  "2026-07-21": 74,
  "2026-07-22": 65,
  "2026-07-23": 79,
  "2026-07-24": 82,
};

export type DayRecord = {
  steps: number;
  sleepHours: number;
  exerciseMinutes: number;
  kcal: number;
  meals: string[];
};

export const dayRecords: Record<string, DayRecord> = {
  "2026-07-18": {
    steps: 5210,
    sleepHours: 6.1,
    exerciseMinutes: 12,
    kcal: 1720,
    meals: ["샌드위치", "김치찌개", "사과"],
  },
  "2026-07-19": {
    steps: 7840,
    sleepHours: 6.4,
    exerciseMinutes: 24,
    kcal: 1640,
    meals: ["오트밀", "비빔밥"],
  },
  "2026-07-20": {
    steps: 11240,
    sleepHours: 7.8,
    exerciseMinutes: 41,
    kcal: 1880,
    meals: ["그릭요거트", "연어 포케", "두부조림"],
  },
  "2026-07-21": {
    steps: 4980,
    sleepHours: 6.2,
    exerciseMinutes: 18,
    kcal: 1930,
    meals: ["아메리카노", "돈까스", "떡볶이"],
  },
  "2026-07-22": {
    steps: 6120,
    sleepHours: 5.9,
    exerciseMinutes: 0,
    kcal: 1580,
    meals: ["샐러드", "국수"],
  },
  "2026-07-23": {
    steps: 8930,
    sleepHours: 7.2,
    exerciseMinutes: 45,
    kcal: 1760,
    meals: ["토스트", "닭가슴살 도시락", "구운 채소"],
  },
  "2026-07-24": {
    steps: 6420,
    sleepHours: 6.8,
    exerciseMinutes: 26,
    kcal: 690,
    meals: ["그릭요거트 & 딸기 오트밀", "제철 채소 한 접시"],
  },
};

export function getMemo(date: Date): string {
  return dayMemos[toKey(date)] ?? "";
}

export function getConditionScore(date: Date): number | null {
  return dayConditionScore[toKey(date)] ?? null;
}

export function getDayRecord(date: Date): DayRecord | null {
  return dayRecords[toKey(date)] ?? null;
}

export { toKey };
