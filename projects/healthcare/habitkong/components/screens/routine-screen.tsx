"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Clock, Drop, Flame, Trophy } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import { habit, getWeekLog } from "@/projects/healthcare/habitkong/lib/habit";

export function RoutineScreen() {
  const week = getWeekLog();
  const [done, setDone] = useState(week.find((d) => d.isToday)?.status === "done");
  const reduce = useReducedMotion();

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">오늘의 루틴</h1>
      <p className="mt-1 text-[13px] text-[#8A8377]">매일 하나씩, 부담 없이 이어가요</p>

      <div className="mt-5 rounded-[12px] border border-[#EAEAEA] bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#E1F3FE]">
            <Drop size={20} weight="fill" className="text-[#1F6C9F]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold text-[#17140F]">{habit.name}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#4A443C]">{habit.description}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#F7F6F3] px-2.5 py-1 text-[10.5px] font-medium text-[#8A8377]">
              <Clock size={12} weight="bold" />
              예상 소요 {habit.durationMinutes}분
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDone((v) => !v)}
          aria-pressed={done}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] py-3.5 text-[14px] font-semibold transition-colors ${
            done ? "bg-[#EDF3EC] text-[#346538]" : "bg-[#17140F] text-white"
          }`}
        >
          <Check size={16} weight="bold" />
          {done ? "오늘 완료했어요" : "완료 체크하기"}
        </button>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center gap-3 rounded-[12px] bg-[#F7F6F3] p-4">
                <Mascot size={52} mood="great" />
                <p className="text-[12.5px] leading-relaxed text-[#4A443C]">
                  콩이가 기뻐해요. 오늘도 해냈어요, {habit.streak + 1}일째 이어가는 중이에요!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-4">
          <div className="flex items-center gap-1.5 text-[#8A8377]">
            <Flame size={14} weight="bold" className="text-[#FF6F4D]" />
            <span className="text-[11.5px] font-medium">연속 기록</span>
          </div>
          <p className="mt-1.5 text-[21px] font-bold tabular-nums text-[#17140F]">{habit.streak}일</p>
        </div>
        <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-4">
          <div className="flex items-center gap-1.5 text-[#8A8377]">
            <Trophy size={14} weight="bold" className="text-[#FF6F4D]" />
            <span className="text-[11.5px] font-medium">최고 기록</span>
          </div>
          <p className="mt-1.5 text-[21px] font-bold tabular-nums text-[#17140F]">{habit.bestStreak}일</p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-[13.5px] font-semibold text-[#17140F]">이번 주 진행 상황</h2>
        <div className="mt-3 flex items-center justify-between rounded-[12px] border border-[#EAEAEA] bg-white px-4 py-4">
          {week.map((day) => (
            <div key={day.label} className="flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-medium ${day.isToday ? "text-[#17140F]" : "text-[#B5AEA4]"}`}>
                {day.label}
              </span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                  day.status === "done"
                    ? "bg-[#17140F] text-white"
                    : day.status === "missed"
                      ? "bg-[#FDEBEC] text-[#9F2F2D]"
                      : "border border-dashed border-[#EAEAEA] text-[#EAEAEA]"
                }`}
              >
                {day.status === "done" && <Check size={13} weight="bold" />}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
