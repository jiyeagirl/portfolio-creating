"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Camera,
  CheckCircle,
  Fire,
  MagnifyingGlass,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Button, Chip, ProgressBar } from "@/projects/healthcare/welllog/components/ui";
import { meals as initialMeals, todayRhythm } from "@/projects/healthcare/welllog/lib/mock-data";
import { formatKcal } from "@/projects/healthcare/welllog/lib/navigation";
import type { MealEntry, MealType } from "@/projects/healthcare/welllog/lib/types";

const CAPTURED_RESULT: MealEntry = {
  id: "ml-scan",
  date: todayRhythm.date,
  time: "18:40",
  mealType: "저녁",
  name: "그릭요거트 그래놀라 볼",
  calories: 340,
  carbsG: 45,
  proteinG: 14,
  fatG: 9,
  photo: 999,
  source: "photo",
  aiConfidence: 91,
};

const MEAL_TYPES: MealType[] = ["아침", "점심", "저녁", "간식"];

type FlowStep = "list" | "capture" | "analyzing" | "result";

const ANALYZE_STAGES = ["사진을 살펴보고 있어요", "음식을 인식하고 있어요", "칼로리를 계산하고 있어요"];

export function DietScreen({ onBack }: { onBack?: () => void }) {
  const [meals, setMeals] = useState<MealEntry[]>(initialMeals);
  const [step, setStep] = useState<FlowStep>("list");
  const [stageIndex, setStageIndex] = useState(0);
  const [draft, setDraft] = useState(CAPTURED_RESULT);

  useEffect(() => {
    if (step !== "analyzing") return;
    const tick = setInterval(() => setStageIndex((i) => Math.min(ANALYZE_STAGES.length - 1, i + 1)), 550);
    const done = setTimeout(() => setStep("result"), 1800);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [step]);

  const todayMeals = meals.filter((m) => m.date === todayRhythm.date);
  const todayCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const byDate = meals.reduce<Record<string, MealEntry[]>>((acc, m) => {
    (acc[m.date] ??= []).push(m);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort((a, b) => (a < b ? 1 : -1));

  const saveDraft = () => {
    setMeals((prev) => [{ ...draft, id: `ml-${prev.length + 1}` }, ...prev]);
    setStep("list");
    setDraft(CAPTURED_RESULT);
  };

  if (step === "capture") {
    return (
      <div className="relative flex h-full flex-col bg-black pt-[59px]">
        <div className="flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setStep("list")}
            aria-label="닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <X size={16} />
          </button>
          <p className="text-[13px] font-medium text-white/90">음식 사진 촬영</p>
          <span className="w-9" />
        </div>
        <div className="relative mx-6 mt-6 flex-1 overflow-hidden rounded-[20px] border-2 border-white/25">
          <Image src={`https://picsum.photos/id/${CAPTURED_RESULT.photo}/700/900`} alt="촬영 프리뷰" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/10" />
          <p className="absolute inset-x-0 top-4 text-center text-[12.5px] text-white/85">
            음식이 프레임 안에 잘 보이도록 맞춰주세요
          </p>
        </div>
        <div className="flex items-center justify-center gap-8 py-8">
          <button
            type="button"
            onClick={() => {
              setStageIndex(0);
              setStep("analyzing");
            }}
            aria-label="촬영"
            className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white/80 bg-white/20"
          >
            <span className="h-[54px] w-[54px] rounded-full bg-white" />
          </button>
        </div>
      </div>
    );
  }

  if (step === "analyzing") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center bg-black px-8 pt-[59px] text-center">
        <div className="wl-pulse relative h-28 w-28 overflow-hidden rounded-full">
          <Image src={`https://picsum.photos/id/${CAPTURED_RESULT.photo}/300/300`} alt="분석 중인 음식 사진" fill className="object-cover" />
        </div>
        <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-white">
          <Sparkle size={16} weight="fill" color="var(--wl-dawn-b)" />
          AI가 분석하고 있어요
        </p>
        <p className="mt-2 text-[13px] text-white/70">{ANALYZE_STAGES[stageIndex]}</p>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-8 pt-[59px]">
        <div className="relative h-[260px] w-full">
          <Image src={`https://picsum.photos/id/${draft.photo}/700/700`} alt={draft.name} fill className="object-cover" />
          <button
            type="button"
            onClick={() => setStep("list")}
            aria-label="닫기"
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="relative -mt-6 rounded-t-[20px] bg-[var(--wl-canvas)] px-5 pt-5">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} weight="fill" color="var(--wl-accent)" />
            <p className="text-[13px] font-medium text-[var(--wl-accent-deep)]">AI 인식 완료 / 신뢰도 {draft.aiConfidence}%</p>
          </div>
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="mt-2 w-full bg-transparent text-[22px] font-bold text-[var(--wl-ink)] outline-none"
          />
          <div className="mt-3 flex gap-2">
            {MEAL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, mealType: type }))}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  draft.mealType === type ? "bg-[var(--wl-accent)] text-white" : "bg-[var(--wl-surface-soft)] text-[var(--wl-body)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[13px] text-[var(--wl-mute)]">
                <Fire size={14} weight="fill" color="var(--wl-coral)" />
                예상 칼로리
              </span>
              <span className="wl-num text-[20px] font-bold text-[var(--wl-ink)]">{formatKcal(draft.calories)}</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: "탄수화물", value: draft.carbsG, max: 80, tone: "amber" as const },
                { label: "단백질", value: draft.proteinG, max: 40, tone: "sage" as const },
                { label: "지방", value: draft.fatG, max: 30, tone: "coral" as const },
              ].map((n) => (
                <div key={n.label}>
                  <div className="mb-1 flex items-center justify-between text-[12.5px]">
                    <span className="text-[var(--wl-body)]">{n.label}</span>
                    <span className="wl-num font-medium text-[var(--wl-ink)]">{n.value}g</span>
                  </div>
                  <ProgressBar value={(n.value / n.max) * 100} tone={n.tone} />
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-[12.5px] leading-5 text-[var(--wl-mute)]">
            AI가 사진 한 장으로 추정한 값이라 실제 영양 성분과 차이가 있을 수 있어요. 필요하면
            음식 이름과 끼니를 직접 수정해서 저장하세요.
          </p>

          <div className="mt-6">
            <Button full size="lg" onClick={saveDraft}>
              식단 기록에 저장
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-[130px]">
      <ScreenHeader
        title="식단 기록"
        subtitle="사진 한 장으로 칼로리와 영양소를 계산해요"
        onBack={onBack}
        className="bg-[var(--wl-canvas)] border-[var(--wl-hairline)]"
        backButtonClassName="text-[var(--wl-ink)] hover:bg-[var(--wl-surface-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wl-ink)]"
        subtitleClassName="text-[11px] text-[var(--wl-mute)]"
      />

      <div className="px-5 pt-4">
        <div className="rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[var(--wl-mute)]">오늘 섭취 칼로리</p>
            <Chip tone="sage">{todayMeals.length}끼 기록</Chip>
          </div>
          <p className="wl-num mt-1 text-[26px] font-bold text-[var(--wl-ink)]">{formatKcal(todayCalories)}</p>
        </div>

        <button
          type="button"
          onClick={() => setStep("capture")}
          className="mt-4 flex w-full items-center gap-3 rounded-[20px] p-4 text-left text-white transition-transform active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, var(--wl-dawn-a), var(--wl-dawn-b))" }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Camera size={20} weight="fill" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] font-semibold">사진으로 식단 기록하기</span>
            <span className="block text-[12px] text-white/85">AI가 음식과 칼로리를 자동으로 인식해요</span>
          </span>
        </button>

        <button
          type="button"
          className="mt-2.5 flex w-full items-center gap-2.5 rounded-full border border-[var(--wl-hairline)] bg-[var(--wl-surface)] px-4 py-3 text-[13.5px] text-[var(--wl-body)]"
        >
          <MagnifyingGlass size={15} />
          검색해서 직접 입력하기
        </button>
      </div>

      <div className="mt-6 px-5">
        {dates.map((date) => (
          <div key={date} className="mb-5">
            <p className="mb-2 text-[13px] font-medium text-[var(--wl-mute)]">
              {date === todayRhythm.date ? "오늘" : date.slice(5).replace("-", "월 ") + "일"}
            </p>
            <div className="space-y-2.5">
              {byDate[date].map((meal) => (
                <div key={meal.id} className="flex items-center gap-3 rounded-[20px] bg-[var(--wl-surface)] p-3 shadow-[var(--wl-shadow)]">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-[var(--wl-surface-soft)]">
                    {meal.photo !== undefined ? (
                      <Image src={`https://picsum.photos/id/${meal.photo}/160/160`} alt={meal.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--wl-mute)]">
                        <MagnifyingGlass size={16} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Chip tone="neutral">{meal.mealType}</Chip>
                      <span className="text-[11px] text-[var(--wl-mute)]">{meal.time}</span>
                    </div>
                    <p className="mt-1 truncate text-[14px] font-medium text-[var(--wl-ink)]">{meal.name}</p>
                  </div>
                  <p className="wl-num shrink-0 text-[13.5px] font-semibold text-[var(--wl-ink)]">{formatKcal(meal.calories)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
