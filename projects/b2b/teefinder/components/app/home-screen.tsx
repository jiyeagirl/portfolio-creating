"use client";

import { useMemo, useState } from "react";
import { getTeeTimes, openSlotCount } from "@/projects/b2b/teefinder/lib/mock-data";
import { addDays, dayNumber, formatLongDate, formatWon, isWeekend, TODAY, weekdayLabel } from "@/projects/b2b/teefinder/lib/format";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { EmptyLine, HeartButton } from "@/projects/b2b/teefinder/components/app/app-ui";
import type { Region } from "@/projects/b2b/teefinder/lib/types";

const DATES = Array.from({ length: 14 }, (_, i) => addDays(TODAY, i));

const PRICE_OPTIONS = [
  { value: "0", label: "가격대 전체" },
  { value: "160000", label: "16만원 이하" },
  { value: "230000", label: "23만원 이하" },
  { value: "270000", label: "27만원 이하" },
];

export function HomeScreen({
  onOpenCourse,
}: {
  onOpenCourse: (courseId: string, date: string) => void;
}) {
  const { favorites, toggleFavorite, courses } = useStore();
  const [date, setDate] = useState(TODAY);
  const [region, setRegion] = useState<Region | "전체">("전체");
  const [maxFee, setMaxFee] = useState("0");

  const regionOptions: Array<Region | "전체"> = ["전체", "경기", "강원", "충청", "영남", "호남", "제주"];

  const filtered = useMemo(() => {
    const limit = Number(maxFee);
    return courses
      .filter((c) => region === "전체" || c.region === region)
      .map((c) => ({
        course: c,
        slots: getTeeTimes(c.id, date).filter((s) => s.status !== "마감" && (limit === 0 || s.fee <= limit)),
      }))
      .filter((x) => x.slots.length > 0)
      .sort((a, b) => {
        const fa = favorites.includes(a.course.id) ? 0 : 1;
        const fb = favorites.includes(b.course.id) ? 0 : 1;
        return fa - fb;
      });
  }, [courses, region, maxFee, date, favorites]);

  /* 날짜 스트립의 숫자는 지금 지역 필터가 적용된 빈 티타임 합계 */
  const dayCounts = useMemo(
    () =>
      DATES.map((d) =>
        courses
          .filter((c) => region === "전체" || c.region === region)
          .reduce((sum, c) => sum + openSlotCount(c.id, d), 0),
      ),
    [courses, region],
  );

  return (
    <div className="flex h-full flex-col bg-[var(--tf-canvas)]">
      <header className="border-b border-[var(--tf-line)] bg-[var(--tf-surface)] pt-[59px]">
        <div className="flex h-[60px] items-center gap-2 px-5">
          <h1 className="mr-auto text-[24px] font-bold tracking-[-0.02em]">빈 티타임</h1>
          <label className="w-[104px]">
            <span className="sr-only">지역</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region | "전체")}
              className="h-10 w-full rounded-[10px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-2.5 text-[14px] font-medium"
            >
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r === "전체" ? "지역 전체" : r}
                </option>
              ))}
            </select>
          </label>
          <label className="w-[116px]">
            <span className="sr-only">가격대</span>
            <select
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="h-10 w-full rounded-[10px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-2.5 text-[14px] font-medium"
            >
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="tf-scroll-x flex snap-x overflow-x-auto px-5">
          {DATES.map((d, i) => {
            const active = d === date;
            const weekend = isWeekend(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDate(d)}
                aria-pressed={active}
                aria-label={`${formatLongDate(d)} 빈 자리 ${dayCounts[i]}`}
                className="tf-press flex w-[50.4px] shrink-0 snap-start flex-col items-center gap-1 pb-2.5 pt-1"
              >
                <span
                  className={`text-[13px] font-medium ${
                    weekend && !active ? "text-[var(--tf-red-fg)]" : "text-[var(--tf-ink-3)]"
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
                <span className="text-[12.5px] font-medium text-[var(--tf-ink-3)]">{dayCounts[i]}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyLine
            text="조건에 맞는 빈 티타임이 없어요"
            action="필터 초기화"
            onAction={() => {
              setRegion("전체");
              setMaxFee("0");
            }}
          />
        ) : (
          <ul className="divide-y divide-[var(--tf-line)]">
            {filtered.map(({ course, slots }) => (
              <li key={course.id} className="bg-[var(--tf-surface)] pb-5 pt-1">
                <div className="flex items-center gap-1 pl-5 pr-2">
                  <button
                    type="button"
                    onClick={() => onOpenCourse(course.id, date)}
                    className="tf-press flex min-h-[52px] min-w-0 flex-1 flex-col justify-center text-left"
                  >
                    <span className="truncate text-[17px] font-semibold tracking-[-0.01em]">{course.name}</span>
                    <span className="truncate text-[13px] text-[var(--tf-ink-3)]">
                      {course.region} | {course.layouts.join(", ")} | 빈 자리 {slots.length}
                    </span>
                  </button>
                  <HeartButton
                    active={favorites.includes(course.id)}
                    onToggle={() => toggleFavorite(course.id)}
                    name={course.name}
                  />
                </div>
                <div className="tf-scroll-x flex gap-2 overflow-x-auto px-5 pt-1">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() => onOpenCourse(course.id, date)}
                      className={`tf-press flex h-[68px] w-[112px] shrink-0 flex-col items-start justify-center gap-0.5 rounded-[10px] px-3 text-left ${
                        s.status === "취소티"
                          ? "border border-[var(--tf-blue)] bg-[var(--tf-blue-bg)] active:bg-[#cfe3f5]"
                          : "bg-[var(--tf-soft)] active:bg-[var(--tf-pressed)]"
                      }`}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className="text-[18px] font-semibold leading-6 tracking-[-0.01em]">{s.time}</span>
                        {s.status === "취소티" && (
                          <span className="text-[12px] font-semibold text-[var(--tf-blue-fg)]">취소티</span>
                        )}
                      </span>
                      <span className="text-[12.5px] leading-4 text-[var(--tf-ink-2)]">
                        {s.layout} {formatWon(s.fee)}
                      </span>
                    </button>
                  ))}
                </div>
                              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
