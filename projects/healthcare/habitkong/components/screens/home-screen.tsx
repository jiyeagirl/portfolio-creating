"use client";

import Image from "next/image";
import { CaretRight, CloudSun, Flame, Footprints, Moon, Target } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import { AppleHealthLogo } from "@/projects/healthcare/habitkong/components/brand-logos";
import { getWeekLog, habit } from "@/projects/healthcare/habitkong/lib/habit";
import {
  MOOD_LABEL,
  TODAY_LABEL,
  appleHealthSummary,
  condition,
  goalAchievementRate,
  todayGoals,
  weatherTip,
} from "@/projects/healthcare/habitkong/lib/health";
import { getConditionScore } from "@/projects/healthcare/habitkong/lib/diary";
import { dailyCalorieGoal, todayMeals } from "@/projects/healthcare/habitkong/lib/meals";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";
import {
  Card,
  ProgressBar,
  SectionTitle,
  StatTile,
  Tag,
} from "@/projects/healthcare/habitkong/components/ui";

const TREND_MAX = 40;
const RING = 2 * Math.PI * 26;

export function HomeScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const week = getWeekLog();
  const routineDoneToday = week.find((d) => d.isToday)?.status === "done";
  const kcalToday = todayMeals.reduce((sum, m) => sum + m.kcal, 0);
  const achievement = goalAchievementRate();
  const scoreDelta = condition.score - condition.yesterdayScore;

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px] pt-[76px]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#8A8377]">{TODAY_LABEL}</p>
        <Tag tone="yellow">{MOOD_LABEL[condition.mood]}</Tag>
      </div>

      <Card className="mt-4 flex items-center gap-3 p-4">
        <div className="flex-1">
          <p className="text-[11.5px] font-medium text-[#8A8377]">오늘의 건강 점수</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-[38px] font-bold leading-none tracking-tight tabular-nums text-[#17140F]">
              {condition.score}
            </p>
            <span className="text-[11.5px] font-semibold tabular-nums text-[#346538]">
              어제보다 +{scoreDelta}
            </span>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#4A443C]">{condition.feedback}</p>
        </div>
        <Mascot size={72} mood={condition.mood} />
      </Card>

      {/* 오늘 목표 달성률. 네 가지 목표를 하나의 비율로 합쳐서 먼저 보여 준다. */}
      <Card as="button" onClick={() => onNavigate("goals")} className="mt-2.5 p-4">
        <div className="flex items-center gap-4">
          <span className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center">
            <svg className="absolute -rotate-90" width={68} height={68} viewBox="0 0 68 68" aria-hidden>
              <circle cx="34" cy="34" r="26" fill="none" stroke="#F0EEE9" strokeWidth="7" />
              <circle
                cx="34"
                cy="34"
                r="26"
                fill="none"
                stroke="#17140F"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={RING}
                strokeDashoffset={RING * (1 - achievement / 100)}
              />
            </svg>
            <span className="text-[15px] font-bold tabular-nums text-[#17140F]">{achievement}%</span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-semibold text-[#17140F]">오늘 목표 달성률</p>
              <CaretRight size={14} className="text-[#B5AEA4]" />
            </div>
            <ul className="mt-2 space-y-1.5">
              {todayGoals.slice(0, 3).map((goal) => (
                <li key={goal.key} className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[10.5px] text-[#8A8377]">{goal.label}</span>
                  <span className="flex-1">
                    <ProgressBar value={goal.current / goal.target} height={4} />
                  </span>
                  <span className="w-16 shrink-0 text-right text-[10px] tabular-nums text-[#8A8377]">
                    {goal.current.toLocaleString()}/{goal.target.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <StatTile
          icon={<Footprints size={16} weight="bold" />}
          label="걸음"
          value={appleHealthSummary.steps.toLocaleString()}
          sub={`목표 ${appleHealthSummary.stepGoal.toLocaleString()}`}
        />
        <StatTile
          icon={<Moon size={16} weight="bold" />}
          label="수면"
          value={`${appleHealthSummary.sleepHours}h`}
          sub={`목표 ${appleHealthSummary.sleepGoal}h`}
        />
        <StatTile
          icon={<Flame size={16} weight="bold" />}
          label="활동"
          value={`${appleHealthSummary.activeKcal}kcal`}
          sub={`목표 ${appleHealthSummary.activeKcalGoal}`}
        />
      </div>
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#B5AEA4]">
        <AppleHealthLogo size={13} />
        {appleHealthSummary.source} · {appleHealthSummary.syncedAt}
      </p>

      <Card as="button" onClick={() => onNavigate("routine")} className="mt-3 flex items-center gap-3 p-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#F7F6F3]">
          <Flame size={18} weight="bold" className="text-[#FF6F4D]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-[#8A8377]">오늘의 마이크로 루틴</p>
          <p className="mt-0.5 truncate text-[14px] font-semibold text-[#17140F]">{habit.name}</p>
        </div>
        {routineDoneToday ? <Tag tone="green">완료</Tag> : <Tag tone="yellow">진행 전</Tag>}
      </Card>

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
                <Image src={meal.image} alt={meal.name} fill sizes="36px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium text-[#17140F]">{meal.name}</p>
                <p className="text-[10.5px] tabular-nums text-[#8A8377]">{meal.kcal}kcal</p>
              </div>
            </div>
          ))}
        </div>
      </button>

      {/* 날씨 기반 팁. 오늘 조건에서 무엇을 대신할 수 있는지까지 말한다. */}
      <div className="mt-2.5 flex items-start gap-3 rounded-[12px] border border-[#EAEAEA] bg-white p-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#E1F3FE]">
          <CloudSun size={17} weight="bold" className="text-[#1F6C9F]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium tabular-nums text-[#8A8377]">
            {weatherTip.location} · {weatherTip.summary} {weatherTip.tempC}도 · 습도{" "}
            {weatherTip.humidity}%
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#4A443C]">{weatherTip.tip}</p>
        </div>
      </div>

      <section className="mt-5">
        <SectionTitle title="이번 주 컨디션" action="다이어리" onAction={() => onNavigate("diary")} />
        <Card className="mt-2.5 p-3.5">
          {/* 막대 트랙은 컬럼마다 자식 하나만 두어, 라벨이 높이를 잠식하지 않게 한다. */}
          <div className="flex items-end gap-2" style={{ height: TREND_MAX }}>
            {week.map((day) => {
              const score = getConditionScore(day.date);
              return (
                <div key={day.label} className="flex h-full flex-1 flex-col justify-end">
                  {score ? (
                    <div
                      className={`w-full shrink-0 rounded-[3px] ${
                        day.isToday ? "bg-[#17140F]" : "bg-[#EAEAEA]"
                      }`}
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
        </Card>
      </section>

      <button
        type="button"
        onClick={() => onNavigate("goals")}
        className="mt-2.5 flex items-center gap-2 self-start text-[12px] font-medium text-[#8A8377] transition-colors hover:text-[#17140F]"
      >
        <Target size={13} weight="bold" />
        주간 목표 관리하기
      </button>
    </div>
  );
}
