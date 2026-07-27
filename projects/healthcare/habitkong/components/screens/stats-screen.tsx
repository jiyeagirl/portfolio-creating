"use client";

import { Flame, Trophy } from "@phosphor-icons/react";
import {
  habit,
  getWeekLog,
  getMonthLog,
  monthCompletionRate,
} from "@/projects/healthcare/habitkong/lib/habit";

const BAR_HEIGHT = 96;

export function StatsScreen() {
  const week = getWeekLog();
  const { leadingBlanks, days } = getMonthLog();
  const monthRate = monthCompletionRate();

  return (
    <div className="h-full w-full px-6 pb-[110px] pt-[76px]">
      <h1 className="text-[24px] font-bold tracking-tight text-[#2B231F]">통계</h1>
      <p className="mt-1 text-[13px] text-[#A79E96]">{habit.name}</p>

      <div className="mt-7">
        <p className="text-[13px] font-medium text-[#A79E96]">이번 달 달성률</p>
        <p className="mt-1 text-[48px] font-bold leading-none tracking-tight text-[#2B231F]">
          {monthRate}
          <span className="text-[24px] text-[#C9C0B8]">%</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#F1E7DF] bg-white p-4">
          <div className="flex items-center gap-1.5 text-[#FF6F4D]">
            <Flame size={15} weight="fill" />
            <span className="text-[12px] font-medium text-[#A79E96]">연속 기록</span>
          </div>
          <p className="mt-1.5 text-[22px] font-bold tabular-nums text-[#2B231F]">
            {habit.streak}일
          </p>
        </div>
        <div className="rounded-2xl border border-[#F1E7DF] bg-white p-4">
          <div className="flex items-center gap-1.5 text-[#FF6F4D]">
            <Trophy size={15} weight="fill" />
            <span className="text-[12px] font-medium text-[#A79E96]">최고 기록</span>
          </div>
          <p className="mt-1.5 text-[22px] font-bold tabular-nums text-[#2B231F]">
            {habit.bestStreak}일
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-[15px] font-semibold text-[#2B231F]">이번 주</h2>
        <div
          className="mt-4 flex items-end justify-between gap-2"
          style={{ height: BAR_HEIGHT }}
        >
          {week.map((day) => {
            const barHeight =
              day.status === "done" ? BAR_HEIGHT : day.status === "missed" ? 6 : 14;
            return (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  {day.status === "pending" ? (
                    <div
                      className="w-[22px] rounded-t-[4px] border border-dashed border-[#EFE6DD]"
                      style={{ height: barHeight }}
                    />
                  ) : (
                    <div
                      className={`w-[22px] rounded-t-[4px] ${
                        day.status === "done" ? "bg-[#FF6F4D]" : "bg-[#F0E6DD]"
                      }`}
                      style={{ height: barHeight }}
                    />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    day.isToday ? "text-[#FF6F4D]" : "text-[#C9C0B8]"
                  }`}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[15px] font-semibold text-[#2B231F]">이번 달</h2>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {["월", "화", "수", "목", "금", "토", "일"].map((label) => (
            <span
              key={label}
              className="text-center text-[10px] font-medium text-[#C9C0B8]"
            >
              {label}
            </span>
          ))}
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map((day) => (
            <span
              key={day.day}
              className={`flex aspect-square items-center justify-center rounded-[7px] text-[10px] font-semibold tabular-nums ${
                day.status === "done"
                  ? "bg-[#FF6F4D] text-white"
                  : day.status === "missed"
                    ? "bg-[#F5EEE7] text-[#C9C0B8]"
                    : "border border-dashed border-[#EFE6DD] text-[#EFE6DD]"
              } ${day.isToday ? "ring-2 ring-[#FF6F4D] ring-offset-1" : ""}`}
            >
              {day.day}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
