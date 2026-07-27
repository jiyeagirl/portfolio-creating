"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Image as ImageIcon, Lightbulb, Minus, Plus, Sparkle, X } from "@phosphor-icons/react";
import { dailyCalorieGoal, scanResult, todayMeals, type MealEntry } from "@/projects/healthcare/habitkong/lib/meals";

export function DietScreen() {
  const [meals, setMeals] = useState<MealEntry[]>(todayMeals);
  const [scanned, setScanned] = useState(false);
  const [portions, setPortions] = useState(1);

  const kcalToday = meals.reduce((sum, m) => sum + m.kcal, 0);
  const carbsToday = meals.reduce((sum, m) => sum + m.carbsG, 0);
  const proteinToday = meals.reduce((sum, m) => sum + m.proteinG, 0);
  const fatToday = meals.reduce((sum, m) => sum + m.fatG, 0);

  const macroKcal = carbsToday * 4 + proteinToday * 4 + fatToday * 9;
  const carbsRatio = macroKcal > 0 ? carbsToday * 4 / macroKcal : 0;
  const proteinRatio = macroKcal > 0 ? proteinToday * 4 / macroKcal : 0;
  const insight =
    carbsRatio > 0.55
      ? "탄수화물 비중이 조금 높아요. 다음 식사는 단백질 위주로 구성해보면 어때요?"
      : proteinRatio >= 0.25
        ? "단백질 균형이 좋아요. 이 페이스를 오늘 저녁까지 이어가보세요."
        : "골고루 잘 드시고 있어요. 이대로 습관을 이어가볼까요?";

  function saveScan() {
    setMeals((prev) => [
      ...prev,
      {
        id: `scan-${Date.now()}`,
        time: "지금",
        name: scanResult.name,
        kcal: Math.round(scanResult.kcalPerPortion * portions),
        carbsG: Math.round(scanResult.carbsG * portions),
        proteinG: Math.round(scanResult.proteinG * portions),
        fatG: Math.round(scanResult.fatG * portions),
        image: scanResult.image,
      },
    ]);
    setScanned(false);
    setPortions(1);
  }

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">AI 식단 분석</h1>
      <p className="mt-1 text-[13px] tabular-nums text-[#8A8377]">
        오늘 {kcalToday.toLocaleString()} / {dailyCalorieGoal.toLocaleString()} kcal 섭취
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F0EEE9]">
        <div
          className="h-full rounded-full bg-[#17140F]"
          style={{ width: `${Math.min(100, (kcalToday / dailyCalorieGoal) * 100)}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
        <NutrientTile label="칼로리" value={`${kcalToday}`} unit="kcal" />
        <NutrientTile label="탄수" value={`${carbsToday}`} unit="g" />
        <NutrientTile label="단백" value={`${proteinToday}`} unit="g" />
        <NutrientTile label="지방" value={`${fatToday}`} unit="g" />
      </div>

      {!scanned && (
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setScanned(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-[12px] border border-[#EAEAEA] bg-white py-6 transition-transform active:scale-[0.98]"
          >
            <Camera size={22} weight="bold" className="text-[#17140F]" />
            <span className="text-[12.5px] font-semibold text-[#17140F]">사진으로 촬영</span>
          </button>
          <button
            type="button"
            onClick={() => setScanned(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-[12px] border border-[#EAEAEA] bg-white py-6 transition-transform active:scale-[0.98]"
          >
            <ImageIcon size={22} weight="bold" className="text-[#17140F]" />
            <span className="text-[12.5px] font-semibold text-[#17140F]">갤러리에서 선택</span>
          </button>
        </div>
      )}

      {scanned && (
        <div className="mt-5 rounded-[12px] border border-[#EAEAEA] bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E1F3FE] px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.02em] text-[#1F6C9F]">
              <Sparkle size={11} weight="fill" />
              AI 인식 {Math.round(scanResult.confidence * 100)}%
            </span>
            <button type="button" onClick={() => setScanned(false)} className="text-[#B5AEA4]" aria-label="취소">
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px]">
              <Image src={scanResult.image} alt={scanResult.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#17140F]">{scanResult.name}</p>
              <p className="mt-0.5 text-[12px] text-[#8A8377]">{scanResult.portionLabel}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
            <NutrientTile label="칼로리" value={`${Math.round(scanResult.kcalPerPortion * portions)}`} unit="kcal" />
            <NutrientTile label="탄수" value={`${Math.round(scanResult.carbsG * portions)}`} unit="g" />
            <NutrientTile label="단백" value={`${Math.round(scanResult.proteinG * portions)}`} unit="g" />
            <NutrientTile label="지방" value={`${Math.round(scanResult.fatG * portions)}`} unit="g" />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[8px] bg-[#F7F6F3] px-3 py-2.5">
            <span className="text-[12.5px] font-medium text-[#4A443C]">섭취량</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPortions((p) => Math.max(0.5, p - 0.5))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAEA] bg-white text-[#17140F]"
                aria-label="섭취량 줄이기"
              >
                <Minus size={12} weight="bold" />
              </button>
              <span className="w-10 text-center text-[13px] font-semibold tabular-nums text-[#17140F]">
                {portions}인분
              </span>
              <button
                type="button"
                onClick={() => setPortions((p) => Math.min(3, p + 0.5))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAEA] bg-white text-[#17140F]"
                aria-label="섭취량 늘리기"
              >
                <Plus size={12} weight="bold" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={saveScan}
            className="mt-3 w-full rounded-[8px] bg-[#17140F] py-3 text-[13.5px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            기록에 저장
          </button>
        </div>
      )}

      <section className="mt-6">
        <h2 className="text-[13.5px] font-semibold text-[#17140F]">오늘 기록한 식사</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center gap-3 rounded-[12px] border border-[#EAEAEA] bg-white p-3"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px]">
                <Image src={meal.image} alt={meal.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-[#17140F]">{meal.name}</p>
                <p className="mt-0.5 text-[11.5px] text-[#8A8377]">{meal.time}</p>
              </div>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#17140F]">
                {meal.kcal}kcal
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-[#EAEAEA] bg-[#F7F6F3] p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E1F3FE]">
          <Lightbulb size={16} weight="bold" className="text-[#1F6C9F]" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.02em] text-[#8A8377]">오늘의 식단 인사이트</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#4A443C]">{insight}</p>
        </div>
      </div>
    </div>
  );
}

function NutrientTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-[8px] bg-[#F7F6F3] py-2.5">
      <p className="text-[13px] font-bold tabular-nums text-[#17140F]">
        {value}
        <span className="text-[10px] font-medium text-[#8A8377]">{unit}</span>
      </p>
      <p className="mt-0.5 text-[10px] text-[#8A8377]">{label}</p>
    </div>
  );
}
