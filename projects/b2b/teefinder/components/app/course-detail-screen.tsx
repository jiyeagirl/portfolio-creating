"use client";

import { useMemo, useState } from "react";
import { Bell, ArrowSquareOut } from "@phosphor-icons/react";
import { getCourse, getTeeTimes } from "@/projects/b2b/teefinder/lib/mock-data";
import { addDays, dayNumber, formatFee, isWeekend, TODAY, weekdayLabel } from "@/projects/b2b/teefinder/lib/format";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { AppBar, GhostButton, HeartButton, PrimaryButton, Segmented } from "@/projects/b2b/teefinder/components/app/app-ui";
import { Badge, slotTone } from "@/projects/b2b/teefinder/components/ui";
import type { CourseLayout, TeeTime } from "@/projects/b2b/teefinder/lib/types";

const DATES = Array.from({ length: 14 }, (_, i) => addDays(TODAY, i));

export function CourseDetailScreen({
  courseId,
  initialDate,
  onBack,
  onAlert,
  onBook,
}: {
  courseId: string;
  initialDate: string;
  onBack: () => void;
  onAlert: (slot: TeeTime | null) => void;
  onBook: (slot: TeeTime) => void;
}) {
  const { favorites, toggleFavorite, courses } = useStore();
  const course = courses.find((c) => c.id === courseId) ?? getCourse(courseId);
  const [date, setDate] = useState(initialDate);
  const [layout, setLayout] = useState<CourseLayout | "전체">("전체");
  const [picked, setPicked] = useState<string | null>(null);

  const slots = useMemo(
    () => getTeeTimes(course.id, date).filter((s) => layout === "전체" || s.layout === layout),
    [course.id, date, layout],
  );
  const firstOpen = slots.find((s) => s.status !== "마감") ?? null;
  const selected = slots.find((s) => s.time === picked && s.status !== "마감") ?? firstOpen;
  const openCount = slots.filter((s) => s.status !== "마감").length;

  return (
    <div className="tf-enter flex h-full flex-col bg-[var(--tf-canvas)]">
      <AppBar
        title={course.name}
        onBack={onBack}
        right={
          <HeartButton
            active={favorites.includes(course.id)}
            onToggle={() => toggleFavorite(course.id)}
            name={course.name}
          />
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="bg-[var(--tf-surface)] px-5 pb-4 pt-4">
          <p className="text-[14px] text-[var(--tf-ink-2)]">
            {course.region} | 코스 {course.layouts.join(", ")} | {course.loginKind} 로그인
          </p>
        </section>

        <div className="tf-scroll-x flex overflow-x-auto border-b border-[var(--tf-line)] bg-[var(--tf-surface)] px-5">
          {DATES.map((d) => {
            const active = d === date;
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDate(d);
                  setPicked(null);
                }}
                aria-pressed={active}
                className="tf-press flex w-[50.4px] shrink-0 flex-col items-center gap-1 pb-2.5 pt-1"
              >
                <span
                  className={`text-[13px] font-medium ${
                    isWeekend(d) && !active ? "text-[var(--tf-red-fg)]" : "text-[var(--tf-ink-3)]"
                  }`}
                >
                  {weekdayLabel(d)}
                </span>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[17px] font-semibold ${
                    active ? "bg-[var(--tf-brand)] text-white" : "text-[var(--tf-ink)]"
                  }`}
                >
                  {dayNumber(d)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-5 pb-3 pt-4">
          <Segmented
            value={layout}
            onChange={(v) => {
              setLayout(v);
              setPicked(null);
            }}
            options={[
              { value: "전체", label: "전체" },
              ...course.layouts.map((l) => ({ value: l, label: l })),
            ]}
          />
        </div>

        <div className="flex items-baseline justify-between px-5 pb-1">
          <h2 className="text-[17px] font-semibold">티타임</h2>
          <span className="text-[14px] text-[var(--tf-ink-3)]">예약 가능 {openCount}</span>
        </div>

        <div className="mb-6 bg-[var(--tf-surface)]">
          <div className="flex h-9 items-center border-y border-[var(--tf-line)] bg-[var(--tf-canvas)] px-5 text-[13px] font-medium text-[var(--tf-ink-3)]">
            <span className="w-[72px]">시간</span>
            <span className="w-[64px]">코스</span>
            <span className="flex-1 text-right">그린피</span>
            <span className="w-[92px] text-right">상태</span>
          </div>
          {slots.length === 0 ? (
            <p className="px-5 py-10 text-center text-[16px] text-[var(--tf-ink-2)]">이 날짜의 티타임이 없어요</p>
          ) : (
            <ul className="divide-y divide-[var(--tf-line)]">
              {slots.map((s) => {
                const closed = s.status === "마감";
                const active = selected?.time === s.time;
                return (
                  <li key={s.time}>
                    <button
                      type="button"
                      disabled={closed}
                      onClick={() => setPicked(s.time)}
                      aria-pressed={active}
                      className={`tf-press flex min-h-[56px] w-full items-center px-5 text-left ${
                        active ? "bg-[var(--tf-soft)] shadow-[inset_3px_0_0_var(--tf-brand)]" : ""
                      } ${closed ? "cursor-not-allowed" : "active:bg-[var(--tf-soft)]"}`}
                    >
                      <span
                        className={`w-[72px] text-[17px] font-semibold ${closed ? "text-[var(--tf-ink-3)]" : ""}`}
                      >
                        {s.time}
                      </span>
                      <span className={`w-[64px] text-[15px] ${closed ? "text-[var(--tf-ink-3)]" : "text-[var(--tf-ink-2)]"}`}>
                        {s.layout}
                      </span>
                      <span
                        className={`flex-1 whitespace-nowrap text-right text-[15px] ${
                          closed ? "text-[var(--tf-ink-3)]" : "font-medium"
                        }`}
                      >
                        {formatFee(s.fee)}
                      </span>
                      <span className="flex w-[92px] justify-end">
                        <Badge tone={slotTone(s.status)} compact>
                          {s.status}
                        </Badge>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-3 border-t border-[var(--tf-line)] bg-[var(--tf-surface)] px-5 pb-[46px] pt-3">
        <GhostButton onClick={() => onAlert(selected)} className="flex-1">
          <Bell size={20} />
          이 자리 알림 받기
        </GhostButton>
        <PrimaryButton
          onClick={() => selected && onBook(selected)}
          disabled={!selected}
          className="flex-1"
        >
          <ArrowSquareOut size={20} />
          예약하러 가기
        </PrimaryButton>
      </div>
    </div>
  );
}
