"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, CalendarBlank, Moon, PersonSimpleWalk, Sparkle, SneakerMove } from "@phosphor-icons/react";
import { CheckRow, Ring } from "@/projects/healthcare/welllog/components/ui";
import { currentUser, meals, notifications, todayRhythm } from "@/projects/healthcare/welllog/lib/mock-data";
import { formatKcal, formatSteps, type Navigate } from "@/projects/healthcare/welllog/lib/navigation";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDateLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`;
}

export function HomeScreen({ onNavigate, onOpenDiet }: { onNavigate: Navigate; onOpenDiet: () => void }) {
  const [habits, setHabits] = useState(todayRhythm.habitsChecked);
  const unread = notifications.filter((n) => !n.read).length;
  const todayMeals = meals.filter((m) => m.date === todayRhythm.date);

  const toggleHabit = (habit: string) => {
    setHabits((prev) => (prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]));
  };

  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-[110px] pt-[59px]">
      <header className="flex items-start justify-between px-5 pt-4">
        <div>
          <p className="text-[13px] text-[var(--wl-mute)]">{formatDateLabel(todayRhythm.date)}</p>
          <h1 className="mt-1 text-[22px] font-bold leading-7 text-[var(--wl-ink)]">
            좋은 아침이에요, {currentUser.nickname}님
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("history")}
            aria-label="리듬 히스토리"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--wl-surface)] shadow-[var(--wl-shadow)]"
          >
            <CalendarBlank size={17} color="var(--wl-body)" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            aria-label={`알림 ${unread}건`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--wl-surface)] shadow-[var(--wl-shadow)]"
          >
            <Bell size={17} color="var(--wl-body)" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--wl-coral)]" />
            )}
          </button>
        </div>
      </header>

      <section
        className="wl-enter relative mx-5 mt-5 overflow-hidden rounded-[20px] p-5 text-white shadow-[var(--wl-shadow-pop)]"
        style={{ background: "linear-gradient(135deg, var(--wl-dawn-a), var(--wl-dawn-b))" }}
      >
        <p className="text-[12.5px] font-medium text-white/80">오늘의 리듬 카드</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Ring percent={(todayRhythm.sleepHours / todayRhythm.sleepGoalHours) * 100} size={68} stroke={7} color="#E3E7FB" track="rgba(255,255,255,0.25)">
            <Moon size={16} weight="fill" color="#ffffff" />
          </Ring>
          <Ring percent={(todayRhythm.steps / todayRhythm.stepsGoal) * 100} size={68} stroke={7} color="#ffffff" track="rgba(255,255,255,0.25)">
            <PersonSimpleWalk size={16} weight="fill" color="#ffffff" />
          </Ring>
          <Ring percent={(todayRhythm.activityMinutes / todayRhythm.activityGoalMinutes) * 100} size={68} stroke={7} color="#FCE3D6" track="rgba(255,255,255,0.25)">
            <SneakerMove size={16} weight="fill" color="#ffffff" />
          </Ring>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="wl-num text-[15px] font-semibold">{todayRhythm.sleepHours}시간</p>
            <p className="text-[11px] text-white/75">수면 {Math.round((todayRhythm.sleepHours / todayRhythm.sleepGoalHours) * 100)}%</p>
          </div>
          <div>
            <p className="wl-num text-[15px] font-semibold">{formatSteps(todayRhythm.steps)}</p>
            <p className="text-[11px] text-white/75">걸음 {Math.round((todayRhythm.steps / todayRhythm.stepsGoal) * 100)}%</p>
          </div>
          <div>
            <p className="wl-num text-[15px] font-semibold">{todayRhythm.activityMinutes}분</p>
            <p className="text-[11px] text-white/75">활동 {Math.round((todayRhythm.activityMinutes / todayRhythm.activityGoalMinutes) * 100)}%</p>
          </div>
        </div>
      </section>

      <section className="mx-5 mt-4 rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
        <p className="text-[13px] font-medium text-[var(--wl-mute)]">오늘 컨디션</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[26px] leading-none">{todayRhythm.moodEmoji}</span>
          <p className="text-[14px] leading-5 text-[var(--wl-ink)]">{todayRhythm.moodNote}</p>
        </div>
      </section>

      <section className="mx-5 mt-4">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[16px] font-semibold text-[var(--wl-ink)]">오늘의 습관 체크</p>
          <span className="text-[12.5px] text-[var(--wl-mute)]">
            {habits.length}/{todayRhythm.habitsTotal.length}
          </span>
        </div>
        <div className="space-y-2">
          {todayRhythm.habitsTotal.map((habit) => (
            <CheckRow key={habit} label={habit} checked={habits.includes(habit)} onToggle={() => toggleHabit(habit)} />
          ))}
        </div>
      </section>

      <section className="mx-5 mt-4 rounded-[20px] bg-[var(--wl-accent-soft)] p-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--wl-accent)]">
            <Sparkle size={14} weight="fill" color="white" />
          </span>
          <div>
            <p className="text-[13px] font-medium text-[var(--wl-accent-deep)]">오늘의 AI 제안</p>
            <p className="mt-1 text-[13.5px] leading-5 text-[var(--wl-ink)]">{todayRhythm.aiSuggestion}</p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-2.5 flex items-center justify-between px-5">
          <p className="text-[16px] font-semibold text-[var(--wl-ink)]">오늘 식사</p>
          <button type="button" onClick={onOpenDiet} className="text-[12.5px] font-medium text-[var(--wl-accent-deep)]">
            전체 보기
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {todayMeals.map((meal) => (
            <button
              key={meal.id}
              type="button"
              onClick={onOpenDiet}
              className="w-[132px] shrink-0 overflow-hidden rounded-[20px] bg-[var(--wl-surface)] text-left shadow-[var(--wl-shadow)]"
            >
              <div className="relative h-[88px] w-full">
                {meal.photo !== undefined ? (
                  <Image src={`https://picsum.photos/id/${meal.photo}/300/220`} alt={meal.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--wl-surface-soft)] text-[var(--wl-mute)]">
                    <Sparkle size={18} />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-[12.5px] font-medium text-[var(--wl-ink)]">{meal.name}</p>
                <p className="wl-num mt-0.5 text-[11.5px] text-[var(--wl-mute)]">
                  {meal.mealType} / {formatKcal(meal.calories)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
