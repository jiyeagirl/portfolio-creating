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

export function getMemo(date: Date): string {
  return dayMemos[toKey(date)] ?? "";
}

export function getConditionScore(date: Date): number | null {
  return dayConditionScore[toKey(date)] ?? null;
}

export { toKey };

