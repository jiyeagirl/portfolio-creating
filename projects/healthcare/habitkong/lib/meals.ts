/* 음식 사진은 내용을 직접 확인한 고정 id만 쓴다.
   493 딸기를 올린 오트밀 볼 / 292 도마 위 손질한 채소 / 488 구리 볼에 담긴 컬러 샐러드
   431 라떼 한 잔 / 1080 딸기 한 상자 / 429 컵에 담긴 라즈베리 / 835 접시에 담긴 오트 쿠키 */
function picsumId(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

export interface MealEntry {
  id: string;
  time: string;
  slot: "아침" | "점심" | "저녁" | "간식";
  name: string;
  kcal: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  image: string;
}

export const dailyCalorieGoal = 1800;

export const macroGoal = { carbsG: 225, proteinG: 90, fatG: 50 };

export const todayMeals: MealEntry[] = [
  {
    id: "m1",
    time: "08:20",
    slot: "아침",
    name: "그릭요거트 & 딸기 오트밀",
    kcal: 210,
    carbsG: 24,
    proteinG: 14,
    fatG: 6,
    image: picsumId(493, 240, 240),
  },
  {
    id: "m2",
    time: "12:40",
    slot: "점심",
    name: "제철 채소 한 접시",
    kcal: 480,
    carbsG: 58,
    proteinG: 22,
    fatG: 14,
    image: picsumId(292, 240, 240),
  },
];

export const scanResult = {
  name: "컬러 샐러드 볼",
  confidence: 0.94,
  kcalPerPortion: 320,
  carbsG: 18,
  proteinG: 29,
  fatG: 12,
  portionLabel: "1인분 (약 350g)",
  image: picsumId(488, 320, 320),
};

export const favoriteMeals = [
  { id: "f1", name: "카페라떼", kcal: 190, image: picsumId(431, 160, 160) },
  { id: "f2", name: "딸기 한 컵", kcal: 60, image: picsumId(1080, 160, 160) },
  { id: "f3", name: "라즈베리 요거트", kcal: 140, image: picsumId(429, 160, 160) },
  { id: "f4", name: "오트 쿠키 2개", kcal: 180, image: picsumId(835, 160, 160) },
];

/** 탄단지 비율이 권장 범위에 얼마나 가까운지로 계산한 균형 점수. */
export function nutritionBalanceScore(carbsG: number, proteinG: number, fatG: number) {
  const total = carbsG * 4 + proteinG * 4 + fatG * 9;
  if (total === 0) return 0;
  const ratios = {
    carbs: (carbsG * 4) / total,
    protein: (proteinG * 4) / total,
    fat: (fatG * 9) / total,
  };
  const ideal = { carbs: 0.5, protein: 0.25, fat: 0.25 };
  const gap =
    Math.abs(ratios.carbs - ideal.carbs) +
    Math.abs(ratios.protein - ideal.protein) +
    Math.abs(ratios.fat - ideal.fat);
  return Math.max(0, Math.min(100, Math.round(100 - gap * 150)));
}
