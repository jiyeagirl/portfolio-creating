"use client";

import { useState } from "react";
import { Check, Drop, Flame } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import { habit, getWeekLog } from "@/projects/healthcare/habitkong/lib/habit";

const DATE_LABEL = "7월 24일 금요일";

export function HomeScreen() {
  const week = getWeekLog();
  const [doneToday, setDoneToday] = useState(
    week.find((d) => d.isToday)?.status === "done",
  );

  return (
    <div className="flex h-full w-full flex-col px-6 pb-[110px] pt-[76px]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#A79E96]">{DATE_LABEL}</p>
        <div className="flex items-center gap-1 rounded-full bg-[#FFF1EC] px-3 py-1.5">
          <Flame size={14} weight="fill" className="text-[#FF6F4D]" />
          <span className="text-[12px] font-bold tabular-nums text-[#FF6F4D]">
            {habit.streak}일 연속
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <Mascot size={116} />
        <p className="mt-5 text-[17px] font-semibold tracking-tight text-[#2B231F]">
          잘하고 있어요, 콩!
        </p>
        <p className="mt-1 text-[13px] text-[#A79E96]">오늘도 습관을 이어가볼까요?</p>
      </div>

      <div className="rounded-[24px] border border-[#F1E7DF] bg-white p-5 shadow-[0_20px_40px_-24px_rgba(43,35,31,0.25)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1EC]">
              <Drop size={20} weight="fill" className="text-[#FF6F4D]" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#2B231F]">{habit.name}</p>
              <p className="mt-0.5 text-[12px] text-[#A79E96]">
                {habit.startedAt}부터 · {habit.streak}일째
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDoneToday((v) => !v)}
            aria-pressed={doneToday}
            aria-label="오늘 완료 체크"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              doneToday
                ? "border-[#FF6F4D] bg-[#FF6F4D] text-white"
                : "border-[#EFE6DD] bg-white text-transparent"
            }`}
          >
            <Check size={20} weight="bold" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#F5EEE7] pt-4">
          {week.map((day) => (
            <div key={day.label} className="flex flex-col items-center gap-1.5">
              <span
                className={`text-[11px] font-medium ${
                  day.isToday ? "text-[#FF6F4D]" : "text-[#C9C0B8]"
                }`}
              >
                {day.label}
              </span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                  day.status === "done"
                    ? "bg-[#FF6F4D] text-white"
                    : day.status === "missed"
                      ? "bg-[#F5EEE7] text-[#C9C0B8]"
                      : "border border-dashed border-[#EFE6DD] text-[#EFE6DD]"
                }`}
              >
                {day.status === "done" && <Check size={13} weight="bold" />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
