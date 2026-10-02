"use client";

import { useState } from "react";
import { Check, Medal, Sparkle } from "@phosphor-icons/react";
import {
  BADGES,
  GOALS,
  aiGoalSuggestion,
  type GoalPeriod,
} from "@/projects/healthcare/habitkong/lib/goals";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";
import {
  Card,
  ProgressBar,
  ScreenHeader,
  SectionTitle,
  Segmented,
  Tag,
} from "@/projects/healthcare/habitkong/components/ui";

export function GoalsScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const [period, setPeriod] = useState<GoalPeriod>("week");
  const [targets, setTargets] = useState<Record<string, number>>({});
  const [applied, setApplied] = useState(false);

  const goals = GOALS[period];
  const targetOf = (id: string, fallback: number) => targets[`${period}-${id}`] ?? fallback;

  const overall = Math.round(
    (goals.reduce((sum, goal) => {
      const target = targetOf(goal.id, goal.target);
      const rate =
        goal.id === "weight"
          ? Math.min(1, target / goal.current)
          : Math.min(1, goal.current / target);
      return sum + rate;
    }, 0) /
      goals.length) *
      100,
  );

  const earned = BADGES.filter((b) => b.earned);

  return (
    <div className="min-h-full w-full pb-10">
      <ScreenHeader title="목표 관리" subtitle="7월 4주차" onBack={() => onNavigate("home")} />

      <div className="px-5 pt-5">
        <Segmented<GoalPeriod>
          value={period}
          onChange={setPeriod}
          options={[
            { key: "week", label: "주간 목표" },
            { key: "month", label: "월간 목표" },
          ]}
        />

        <Card className="mt-4 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[11.5px] font-medium text-[#8A8377]">
              {period === "week" ? "이번 주" : "이번 달"} 전체 달성률
            </p>
            <p className="text-[24px] font-bold leading-none tabular-nums text-[#17140F]">
              {overall}%
            </p>
          </div>
          <div className="mt-3">
            <ProgressBar value={overall / 100} height={6} />
          </div>
          <p className="mt-2.5 text-[11.5px] text-[#8A8377]">
            {period === "week" ? "남은 2일" : "남은 7일"} 동안 지금 속도를 유지하면 목표에 닿아요
          </p>
        </Card>
      </div>

      <section className="mt-5 px-5">
        <SectionTitle title="목표 설정" />
        <div className="mt-2.5 flex flex-col gap-2">
          {goals.map((goal) => {
            const target = targetOf(goal.id, goal.target);
            const rate =
              goal.id === "weight"
                ? Math.min(1, target / goal.current)
                : Math.min(1, goal.current / target);
            return (
              <Card key={goal.id} className="p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] font-semibold text-[#17140F]">{goal.label}</p>
                  <p className="text-[12px] tabular-nums text-[#8A8377]">
                    <span className="font-semibold text-[#17140F]">
                      {goal.current.toLocaleString()}
                    </span>{" "}
                    / {target.toLocaleString()}
                    {goal.unit}
                  </p>
                </div>

                <div className="mt-2.5">
                  <ProgressBar value={rate} height={5} />
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {goal.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setTargets((prev) => ({ ...prev, [`${period}-${goal.id}`]: option }))
                      }
                      aria-pressed={target === option}
                      className={`flex-1 rounded-[6px] border py-1.5 text-[11.5px] font-semibold tabular-nums transition-colors ${
                        target === option
                          ? "border-[#17140F] bg-[#17140F] text-white"
                          : "border-[#EAEAEA] bg-white text-[#8A8377]"
                      }`}
                    >
                      {option.toLocaleString()}
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-[11px] text-[#B5AEA4]">{goal.note}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-5 px-5">
        <SectionTitle title="AI 목표 추천" />
        <Card className="mt-2.5 p-4">
          <Tag tone="blue">
            <Sparkle size={11} weight="fill" />
            난이도 자동 조정
          </Tag>
          <p className="mt-2.5 text-[13.5px] font-semibold leading-snug text-[#17140F]">
            {aiGoalSuggestion.title}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#8A8377]">
            {aiGoalSuggestion.detail}
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[#F7F6F3] px-3.5 py-2.5 text-[12px] tabular-nums">
            <span className="text-[#8A8377] line-through">{aiGoalSuggestion.from}</span>
            <span className="text-[#B5AEA4]">to</span>
            <span className="font-semibold text-[#17140F]">{aiGoalSuggestion.to}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setTargets((prev) => ({ ...prev, "week-steps": 49000 }));
              setApplied(true);
            }}
            disabled={applied}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-[6px] py-2.5 text-[13px] font-semibold transition-transform active:scale-[0.98] ${
              applied ? "bg-[#EDF3EC] text-[#346538]" : "bg-[#17140F] text-white"
            }`}
          >
            {applied && <Check size={13} weight="bold" />}
            {applied ? "추천 목표를 적용했어요" : "추천 목표로 조정하기"}
          </button>
        </Card>
      </section>

      <section className="mt-5 px-5">
        <SectionTitle title={`배지 ${earned.length}개 획득`} />
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-[12px] border p-3 text-center ${
                badge.earned ? "border-[#EAEAEA] bg-white" : "border-dashed border-[#EAEAEA] bg-[#FBFBFA]"
              }`}
            >
              <span
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                  badge.earned ? "bg-[#FBF3DB] text-[#956400]" : "bg-[#F0EEE9] text-[#C9C0B8]"
                }`}
              >
                <Medal size={17} weight={badge.earned ? "fill" : "regular"} />
              </span>
              <p
                className={`mt-2 text-[11px] font-semibold leading-snug ${
                  badge.earned ? "text-[#17140F]" : "text-[#B5AEA4]"
                }`}
              >
                {badge.label}
              </p>
              <p className="mt-0.5 text-[10px] text-[#B5AEA4]">{badge.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
