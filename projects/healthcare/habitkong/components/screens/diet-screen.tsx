"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera,
  Check,
  Image as ImageIcon,
  Lightbulb,
  Minus,
  PencilSimple,
  Plus,
  Star,
} from "@phosphor-icons/react";
import {
  dailyCalorieGoal,
  favoriteMeals,
  macroGoal,
  nutritionBalanceScore,
  todayMeals,
  type MealEntry,
} from "@/projects/healthcare/habitkong/lib/meals";
import { Card, ProgressBar, SectionTitle } from "@/projects/healthcare/habitkong/components/ui";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";

export function DietScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const [meals, setMeals] = useState<MealEntry[]>(todayMeals);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedFavorite, setSavedFavorite] = useState<string | null>(null);

  const kcalToday = meals.reduce((sum, m) => sum + m.kcal, 0);
  const carbsToday = meals.reduce((sum, m) => sum + m.carbsG, 0);
  const proteinToday = meals.reduce((sum, m) => sum + m.proteinG, 0);
  const fatToday = meals.reduce((sum, m) => sum + m.fatG, 0);
  const balance = nutritionBalanceScore(carbsToday, proteinToday, fatToday);

  const macroKcal = carbsToday * 4 + proteinToday * 4 + fatToday * 9;
  const carbsRatio = macroKcal > 0 ? (carbsToday * 4) / macroKcal : 0;
  const proteinRatio = macroKcal > 0 ? (proteinToday * 4) / macroKcal : 0;
  const insight =
    carbsRatio > 0.55
      ? "탄수화물 비중이 조금 높아요. 다음 식사는 단백질 위주로 구성해보면 어때요?"
      : proteinRatio >= 0.25
        ? "단백질 균형이 좋아요. 이 페이스를 오늘 저녁까지 이어가보세요."
        : "골고루 잘 드시고 있어요. 이대로 습관을 이어가볼까요?";

  const shortage =
    proteinToday < macroGoal.proteinG * 0.5
      ? `단백질이 목표 ${macroGoal.proteinG}g 중 ${proteinToday}g이에요. 저녁에 두부나 달걀을 한 가지 더해보세요.`
      : `남은 칼로리는 ${(dailyCalorieGoal - kcalToday).toLocaleString()}kcal이에요. 저녁 한 끼로 충분한 양이에요.`;

  function addFavorite(fav: (typeof favoriteMeals)[number]) {
    setMeals((prev) => [
      ...prev,
      {
        id: `${fav.id}-${prev.length + 1}`,
        time: "지금",
        slot: "간식",
        name: fav.name,
        kcal: fav.kcal,
        carbsG: Math.round(fav.kcal * 0.13),
        proteinG: Math.round(fav.kcal * 0.04),
        fatG: Math.round(fav.kcal * 0.03),
        image: fav.image,
      },
    ]);
    setSavedFavorite(fav.id);
    window.setTimeout(() => setSavedFavorite(null), 1200);
  }

  function updateKcal(id: string, delta: number) {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, kcal: Math.max(50, meal.kcal + delta) } : meal,
      ),
    );
  }

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">AI 식단 분석</h1>
      <p className="mt-1 text-[13px] tabular-nums text-[#8A8377]">
        오늘 {kcalToday.toLocaleString()} / {dailyCalorieGoal.toLocaleString()} kcal 섭취
      </p>
      <div className="mt-2">
        <ProgressBar value={kcalToday / dailyCalorieGoal} />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
        <NutrientTile label="칼로리" value={`${kcalToday}`} unit="kcal" />
        <NutrientTile label="탄수" value={`${carbsToday}`} unit="g" />
        <NutrientTile label="단백" value={`${proteinToday}`} unit="g" />
        <NutrientTile label="지방" value={`${fatToday}`} unit="g" />
      </div>

      <Card className="mt-2.5 flex items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-medium text-[#8A8377]">영양 균형 점수</p>
          <p className="mt-1 text-[24px] font-bold leading-none tabular-nums text-[#17140F]">
            {balance}
            <span className="ml-1 text-[12px] font-medium text-[#8A8377]">/ 100</span>
          </p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-[#8A8377]">
            탄수 {Math.round(carbsRatio * 100)}% · 단백 {Math.round(proteinRatio * 100)}% · 지방{" "}
            {Math.round(100 - carbsRatio * 100 - proteinRatio * 100)}%
          </p>
        </div>
        <div className="w-[86px] shrink-0">
          <MacroRow label="탄수" value={carbsToday} goal={macroGoal.carbsG} />
          <MacroRow label="단백" value={proteinToday} goal={macroGoal.proteinG} />
          <MacroRow label="지방" value={fatToday} goal={macroGoal.fatG} />
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Card as="button" onClick={() => onNavigate("scan")} className="flex flex-col items-center justify-center gap-2 py-6">
          <Camera size={22} weight="bold" className="text-[#17140F]" />
          <span className="text-[12.5px] font-semibold text-[#17140F]">사진으로 촬영</span>
        </Card>
        <Card as="button" onClick={() => onNavigate("scan")} className="flex flex-col items-center justify-center gap-2 py-6">
          <ImageIcon size={22} weight="bold" className="text-[#17140F]" />
          <span className="text-[12.5px] font-semibold text-[#17140F]">갤러리에서 선택</span>
        </Card>
      </div>

      <section className="mt-6">
        <SectionTitle title="자주 먹는 음식" />
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {favoriteMeals.map((fav) => (
            <button
              key={fav.id}
              type="button"
              onClick={() => addFavorite(fav)}
              className="w-[92px] shrink-0 rounded-[12px] border border-[#EAEAEA] bg-white p-2 text-left transition-transform active:scale-[0.98]"
            >
              <div className="relative h-[68px] w-full overflow-hidden rounded-[8px]">
                <Image src={fav.image} alt={fav.name} fill sizes="92px" className="object-cover" />
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#956400]">
                  {savedFavorite === fav.id ? (
                    <Check size={11} weight="bold" className="text-[#346538]" />
                  ) : (
                    <Star size={11} weight="fill" />
                  )}
                </span>
              </div>
              <p className="mt-1.5 truncate text-[11.5px] font-medium text-[#17140F]">{fav.name}</p>
              <p className="text-[10.5px] tabular-nums text-[#8A8377]">{fav.kcal}kcal</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle title="오늘 기록한 식사" />
        <div className="mt-3 flex flex-col gap-2.5">
          {meals.map((meal) => (
            <Card key={meal.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px]">
                  <Image src={meal.image} alt={meal.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-[#17140F]">{meal.name}</p>
                  <p className="mt-0.5 text-[11.5px] tabular-nums text-[#8A8377]">
                    {meal.slot} · {meal.time}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#17140F]">
                  {meal.kcal}kcal
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === meal.id ? null : meal.id)}
                  aria-label={`${meal.name} 수정`}
                  className="shrink-0 text-[#B5AEA4] transition-colors hover:text-[#17140F]"
                >
                  <PencilSimple size={14} />
                </button>
              </div>

              {editingId === meal.id && (
                <div className="mt-3 flex items-center justify-between border-t border-[#EAEAEA] pt-3">
                  <span className="text-[12px] font-medium text-[#4A443C]">섭취 칼로리 수정</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateKcal(meal.id, -50)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAEA] text-[#17140F]"
                      aria-label="50kcal 줄이기"
                    >
                      <Minus size={12} weight="bold" />
                    </button>
                    <span className="w-14 text-center text-[13px] font-semibold tabular-nums text-[#17140F]">
                      {meal.kcal}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateKcal(meal.id, 50)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAEA] text-[#17140F]"
                      aria-label="50kcal 늘리기"
                    >
                      <Plus size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-[#EAEAEA] bg-[#F7F6F3] p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E1F3FE]">
          <Lightbulb size={16} weight="bold" className="text-[#1F6C9F]" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.02em] text-[#8A8377]">
            오늘의 식단 인사이트
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#4A443C]">{insight}</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#8A8377]">{shortage}</p>
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

function MacroRow({ label, value, goal }: { label: string; value: number; goal: number }) {
  return (
    <div className="mb-1.5 last:mb-0">
      <div className="flex items-center justify-between text-[10px] text-[#8A8377]">
        <span>{label}</span>
        <span className="tabular-nums">
          {value}/{goal}g
        </span>
      </div>
      <div className="mt-1">
        <ProgressBar value={value / goal} height={3} tone={value / goal >= 0.5 ? "ink" : "muted"} />
      </div>
    </div>
  );
}
