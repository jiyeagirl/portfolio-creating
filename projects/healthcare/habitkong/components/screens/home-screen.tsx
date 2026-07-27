"use client";

import Image from "next/image";
import { CaretRight, Flame, Footprints, Moon } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import { habit, getWeekLog } from "@/projects/healthcare/habitkong/lib/habit";
import { MOOD_LABEL, TODAY_LABEL, appleHealthSummary, condition } from "@/projects/healthcare/habitkong/lib/health";
import { getConditionScore } from "@/projects/healthcare/habitkong/lib/diary";
import { dailyCalorieGoal, todayMeals } from "@/projects/healthcare/habitkong/lib/meals";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";

const TREND_MAX = 40;

export function HomeScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const week = getWeekLog();
  const routineDoneToday = week.find((d) => d.isToday)?.status === "done";
  const kcalToday = todayMeals.reduce((sum, m) => sum + m.kcal, 0);

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px] pt-[76px]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#8A8377]">{TODAY_LABEL}</p>
        <span className="rounded-full bg-[#FBF3DB] px-3 py-1 text-[11px] font-semibold tracking-[0.02em] text-[#956400]">
          {MOOD_LABEL[condition.mood]}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[12px] border border-[#EAEAEA] bg-white p-4">
        <div className="flex-1">
          <p className="text-[11.5px] font-medium text-[#8A8377]">오늘의 건강 점수</p>
          <p className="mt-1 text-[38px] font-bold leading-none tracking-tight tabular-nums text-[#17140F]">
            {condition.score}
          </p>
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#4A443C]">{condition.feedback}</p>
        </div>
        <Mascot size={72} mood={condition.mood} />
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <StatTile icon={<Footprints size={16} weight="bold" />} label="걸음" value={appleHealthSummary.steps.toLocaleString()} />
        <StatTile icon={<Moon size={16} weight="bold" />} label="수면" value={`${appleHealthSummary.sleepHours}h`} />
        <StatTile icon={<Flame size={16} weight="bold" />} label="활동" value={`${appleHealthSummary.activeKcal}kcal`} />
      </div>
      <p className="mt-1.5 text-[11px] text-[#B5AEA4]">{appleHealthSummary.source}</p>

      <button
        type="button"
        onClick={() => onNavigate("diary")}
        className="mt-3 rounded-[12px] border border-[#EAEAEA] bg-white p-3.5 text-left transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[12.5px] font-semibold text-[#17140F]">이번 주 컨디션</h2>
          <CaretRight size={14} className="text-[#B5AEA4]" />
        </div>
        {/* Bar track is a fixed-height row with exactly one child per column
            (shrink-0), so nothing competes with the labels below for space —
            a label sharing this flex column with the bar previously forced
            every bar to the same clamped height regardless of its score. */}
        <div className="mt-2.5 flex items-end gap-2" style={{ height: TREND_MAX }}>
          {week.map((day) => {
            const score = getConditionScore(day.date);
            return (
              <div key={day.label} className="flex h-full flex-1 flex-col justify-end">
                {score ? (
                  <div
                    className={`w-full shrink-0 rounded-[3px] ${day.isToday ? "bg-[#17140F]" : "bg-[#EAEAEA]"}`}
                    style={{ height: (score / 100) * TREND_MAX }}
                  />
                ) : (
                  <div className="w-full flex-1 rounded-[3px] border border-dashed border-[#EAEAEA]" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-2">
          {week.map((day) => (
            <span
              key={day.label}
              className={`flex-1 text-center text-[10px] font-medium ${
                day.isToday ? "text-[#17140F]" : "text-[#B5AEA4]"
              }`}
            >
              {day.label}
            </span>
          ))}
        </div>
      </button>

      <button
        type="button"
        onClick={() => onNavigate("routine")}
        className="mt-2.5 flex items-center gap-3 rounded-[12px] border border-[#EAEAEA] bg-white p-3.5 text-left transition-transform active:scale-[0.98]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#F7F6F3]">
          <Flame size={18} weight="bold" className="text-[#FF6F4D]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-[#8A8377]">오늘의 마이크로 루틴</p>
          <p className="mt-0.5 truncate text-[14px] font-semibold text-[#17140F]">{habit.name}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.02em] ${
            routineDoneToday ? "bg-[#EDF3EC] text-[#346538]" : "bg-[#FBF3DB] text-[#956400]"
          }`}
        >
          {routineDoneToday ? "완료" : "진행 전"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate("diet")}
        className="mt-2.5 rounded-[12px] border border-[#EAEAEA] bg-[#F7F6F3] p-3.5 text-left transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-[#8A8377]">오늘의 식단 및 활동</p>
            <p className="mt-0.5 text-[14px] font-semibold tabular-nums text-[#17140F]">
              {kcalToday.toLocaleString()} / {dailyCalorieGoal.toLocaleString()} kcal
            </p>
          </div>
          <CaretRight size={16} className="shrink-0 text-[#B5AEA4]" />
        </div>

        <div className="mt-2.5 flex gap-2 border-t border-[#EAEAEA] pt-2.5">
          {todayMeals.map((meal) => (
            <div key={meal.id} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[7px]">
                <Image src={meal.image} alt={meal.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium text-[#17140F]">{meal.name}</p>
                <p className="text-[10.5px] text-[#8A8377]">{meal.kcal}kcal</p>
              </div>
            </div>
          ))}
        </div>
      </button>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-[#EAEAEA] bg-white px-3 py-3">
      <span className="text-[#8A8377]">{icon}</span>
      <div>
        <p className="text-[13px] font-bold tabular-nums text-[#17140F]">{value}</p>
        <p className="text-[10.5px] text-[#8A8377]">{label}</p>
      </div>
    </div>
  );
}
