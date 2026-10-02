"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowsClockwise, Check, Clock, Drop, Flame, Sun, Trophy } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_VARIANT,
  ROUTINE_ALTERNATIVES,
  getWeekLog,
  habit,
  tomorrowRoutine,
  weekCompletionRate,
  type Difficulty,
} from "@/projects/healthcare/habitkong/lib/habit";
import { Card, ProgressBar, SectionTitle, Tag } from "@/projects/healthcare/habitkong/components/ui";

export function RoutineScreen() {
  const week = getWeekLog();
  const [done, setDone] = useState(week.find((d) => d.isToday)?.status === "done");
  const [difficulty, setDifficulty] = useState<Difficulty>(habit.difficulty);
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapped, setSwapped] = useState<(typeof ROUTINE_ALTERNATIVES)[number] | null>(null);
  const reduce = useReducedMotion();

  const variant = DIFFICULTY_VARIANT[difficulty];
  const current = swapped
    ? { name: swapped.name, description: swapped.description, durationMinutes: swapped.durationMinutes }
    : variant;
  const weekRate = weekCompletionRate();

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">오늘의 루틴</h1>
      <p className="mt-1 text-[13px] text-[#8A8377]">매일 하나씩, 부담 없이 이어가요</p>

      <Card className="mt-5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#E1F3FE]">
            <Drop size={20} weight="fill" className="text-[#1F6C9F]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold text-[#17140F]">{current.name}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#4A443C]">{current.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Tag>
                <Clock size={12} weight="bold" />
                예상 소요 {current.durationMinutes}분
              </Tag>
              <Tag tone="blue">AI 추천</Tag>
            </div>
          </div>
        </div>

        <p className="mt-3.5 rounded-[8px] bg-[#F7F6F3] px-3.5 py-2.5 text-[12px] leading-relaxed text-[#8A8377]">
          {habit.reason}
        </p>

        <button
          type="button"
          onClick={() => setDone((v) => !v)}
          aria-pressed={done}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[6px] py-3.5 text-[14px] font-semibold transition-colors ${
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
                <div>
                  <p className="text-[12.5px] leading-relaxed text-[#4A443C]">
                    콩이가 기뻐해요. 오늘도 해냈어요, {habit.streak + 1}일째 이어가는 중이에요!
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium text-[#346538]">
                    경험치 +20 · 다음 레벨까지 140
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 난이도 조절과 루틴 교체. 같은 습관을 강도만 바꿔 이어갈 수 있게 한다. */}
      <Card className="mt-2.5 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-semibold text-[#17140F]">난이도</p>
          <button
            type="button"
            onClick={() => setSwapOpen((v) => !v)}
            className="flex items-center gap-1 text-[11.5px] font-medium text-[#8A8377] transition-colors hover:text-[#17140F]"
          >
            <ArrowsClockwise size={12} weight="bold" />
            루틴 교체
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setDifficulty(key);
                setSwapped(null);
              }}
              aria-pressed={difficulty === key && !swapped}
              className={`rounded-[8px] border py-2 text-[12px] font-semibold transition-colors ${
                difficulty === key && !swapped
                  ? "border-[#17140F] bg-[#17140F] text-white"
                  : "border-[#EAEAEA] bg-white text-[#8A8377]"
              }`}
            >
              {DIFFICULTY_LABEL[key]}
            </button>
          ))}
        </div>

        {swapOpen && (
          <div className="mt-3 border-t border-[#EAEAEA] pt-3">
            <p className="text-[11.5px] font-medium text-[#8A8377]">다른 루틴으로 바꾸기</p>
            <div className="mt-2 flex flex-col gap-2">
              {ROUTINE_ALTERNATIVES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSwapped(item);
                    setSwapOpen(false);
                  }}
                  className="flex items-start gap-2.5 rounded-[8px] border border-[#EAEAEA] px-3 py-2.5 text-left transition-colors hover:bg-[#FBFBFA]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold text-[#17140F]">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[#8A8377]">
                      {item.description}
                    </span>
                  </span>
                  <Tag>{item.tag}</Tag>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <Card className="p-3.5">
          <div className="flex items-center gap-1.5 text-[#8A8377]">
            <Flame size={13} weight="bold" className="text-[#FF6F4D]" />
            <span className="text-[11px] font-medium">연속</span>
          </div>
          <p className="mt-1.5 text-[19px] font-bold tabular-nums text-[#17140F]">{habit.streak}일</p>
        </Card>
        <Card className="p-3.5">
          <div className="flex items-center gap-1.5 text-[#8A8377]">
            <Trophy size={13} weight="bold" className="text-[#FF6F4D]" />
            <span className="text-[11px] font-medium">최고</span>
          </div>
          <p className="mt-1.5 text-[19px] font-bold tabular-nums text-[#17140F]">
            {habit.bestStreak}일
          </p>
        </Card>
        <Card className="p-3.5">
          <div className="flex items-center gap-1.5 text-[#8A8377]">
            <Check size={13} weight="bold" className="text-[#346538]" />
            <span className="text-[11px] font-medium">주간</span>
          </div>
          <p className="mt-1.5 text-[19px] font-bold tabular-nums text-[#17140F]">{weekRate}%</p>
        </Card>
      </div>

      <section className="mt-6">
        <SectionTitle title="이번 주 진행 상황" />
        <Card className="mt-2.5 px-4 py-4">
          <div className="flex items-center justify-between">
            {week.map((day) => (
              <div key={day.label} className="flex flex-col items-center gap-1.5">
                <span
                  className={`text-[11px] font-medium ${
                    day.isToday ? "text-[#17140F]" : "text-[#B5AEA4]"
                  }`}
                >
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
          <div className="mt-3.5 border-t border-[#EAEAEA] pt-3">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-[#8A8377]">주간 달성률</span>
              <span className="font-semibold tabular-nums text-[#17140F]">{weekRate}%</span>
            </div>
            <div className="mt-1.5">
              <ProgressBar value={weekRate / 100} height={5} />
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <SectionTitle title="내일의 추천 루틴" />
        <Card className="mt-2.5 flex items-start gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#FBF3DB]">
            <Sun size={17} weight="bold" className="text-[#956400]" />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-[#17140F]">{tomorrowRoutine.name}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#8A8377]">
              {tomorrowRoutine.reason}
            </p>
            <p className="mt-1.5 text-[11px] tabular-nums text-[#B5AEA4]">
              예상 소요 {tomorrowRoutine.durationMinutes}분
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
