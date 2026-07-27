function picsumId(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

export interface MealEntry {
  id: string;
  time: string;
  name: string;
  kcal: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  image: string;
}

export const dailyCalorieGoal = 1800;

export const todayMeals: MealEntry[] = [
  {
    id: "m1",
    time: "08:20",
    name: "그릭요거트 & 블루베리",
    kcal: 210,
    carbsG: 24,
    proteinG: 14,
    fatG: 6,
    image: picsumId(493, 200, 200),
  },
  {
    id: "m2",
    time: "12:40",
    name: "채소 볶음 현미 볼",
    kcal: 480,
    carbsG: 58,
    proteinG: 22,
    fatG: 14,
    image: picsumId(292, 200, 200),
  },
];

export const scanResult = {
  name: "닭가슴살 샐러드",
  confidence: 0.94,
  kcalPerPortion: 320,
  carbsG: 18,
  proteinG: 29,
  fatG: 12,
  portionLabel: "1인분 (약 350g)",
  image: picsumId(488, 300, 300),
};
