"use client";

import { useMemo, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { getCourse, getTeeTimes, openSlotCount } from "@/projects/b2b/teefinder/lib/mock-data";
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
  const { favorites, toggleFavorite, courses, session, conditions } = useStore();
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

  /* 대시보드 집계는 지역 필터와 무관한 전체 골프장 기준 */
  const summary = useMemo(() => {
    const week = DATES.slice(0, 7);
    const weekend = week.filter(isWeekend);
    let today = 0;
    let weekendOpen = 0;
    const cancels: Array<{ courseId: string; date: string; time: string; layout: string; fee: number }> = [];
    for (const c of courses) {
      today += openSlotCount(c.id, TODAY);
      for (const d of weekend) weekendOpen += openSlotCount(c.id, d);
      for (const d of week) {
        for (const s of getTeeTimes(c.id, d)) {
          if (s.status === "취소티") cancels.push({ courseId: c.id, date: d, time: s.time, layout: s.layout, fee: s.fee });
        }
      }
    }
    return { today, weekendOpen, cancelTotal: cancels.length, cancels };
  }, [courses]);

  const myCancels = useMemo(
    () =>
      summary.cancels
        .filter((x) => favorites.includes(x.courseId))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 3),
    [summary, favorites],
  );

  const favoriteRows = useMemo(
    () =>
      favorites.slice(0, 3).map((id) => {
        const open = getTeeTimes(id, TODAY).filter((s) => s.status !== "마감");
        return { course: getCourse(id), count: open.length, first: open[0]?.time };
      }),
    [favorites],
  );

  const watching = conditions.filter((c) => c.enabled).length;

  return (
    <div className="flex h-full flex-col bg-[var(--tf-canvas)]">
      <header className="border-b border-[var(--tf-line)] bg-[var(--tf-surface)] pt-[59px]">
        <div className="flex h-[64px] flex-col justify-center px-5">
          <span className="text-[13px] text-[var(--tf-ink-3)]">{formatLongDate(TODAY)}</span>
          <h1 className="text-[22px] font-bold leading-7 tracking-[-0.02em]">{session?.name ?? "회원"}님의 홈</h1>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="bg-[var(--tf-surface)] pb-5">
          <dl className="flex divide-x divide-[var(--tf-line)] px-5 pt-5">
            <div className="flex-1 pr-4">
              <dt className="text-[13px] text-[var(--tf-ink-3)]">오늘 빈 자리</dt>
              <dd className="mt-1 text-[28px] font-bold leading-8 tracking-[-0.02em] tabular-nums">{summary.today}</dd>
            </div>
            <div className="flex-1 px-4">
              <dt className="text-[13px] text-[var(--tf-ink-3)]">이번 주말</dt>
              <dd className="mt-1 text-[28px] font-bold leading-8 tracking-[-0.02em] tabular-nums">{summary.weekendOpen}</dd>
            </div>
            <div className="flex-1 pl-4">
              <dt className="text-[13px] text-[var(--tf-ink-3)]">7일 내 취소티</dt>
              <dd className="mt-1 text-[28px] font-bold leading-8 tracking-[-0.02em] tabular-nums text-[var(--tf-blue-fg)]">
                {summary.cancelTotal}
              </dd>
            </div>
          </dl>

          <div className="mx-5 mt-4 flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[var(--tf-soft)] px-3.5 text-[14px] text-[var(--tf-ink-2)]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--tf-green)]" />
            <span className="min-w-0 flex-1 truncate">알림 조건 {watching}개 감시 중</span>
            <span className="shrink-0 text-[13px] text-[var(--tf-ink-3)]">09:42 갱신</span>
          </div>

          {myCancels.length > 0 && (
            <div className="mt-5">
              <h2 className="px-5 text-[15px] font-semibold text-[var(--tf-ink-2)]">즐겨찾기 골프장 취소티</h2>
              <ul className="mt-1 divide-y divide-[var(--tf-line)]">
                {myCancels.map((x) => (
                  <li key={`${x.courseId}${x.date}${x.time}`}>
                    <button
                      type="button"
                      onClick={() => onOpenCourse(x.courseId, x.date)}
                      className="tf-press flex min-h-[60px] w-full items-center gap-3 px-5 text-left active:bg-[var(--tf-soft)]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] font-semibold tracking-[-0.01em]">
                          {getCourse(x.courseId).name}
                        </span>
                        <span className="block truncate text-[13px] text-[var(--tf-ink-3)]">
                          {formatLongDate(x.date)} {x.time} | {x.layout} {formatWon(x.fee)}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold text-[var(--tf-blue-fg)]">취소티</span>
                      <CaretRight size={16} className="shrink-0 text-[var(--tf-ink-3)]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {favoriteRows.length > 0 && (
            <div className="mt-4">
              <h2 className="px-5 text-[15px] font-semibold text-[var(--tf-ink-2)]">내 골프장 오늘 현황</h2>
              <ul className="mt-1 divide-y divide-[var(--tf-line)]">
                {favoriteRows.map(({ course, count, first }) => (
                  <li key={course.id}>
                    <button
                      type="button"
                      onClick={() => onOpenCourse(course.id, TODAY)}
                      className="tf-press flex min-h-[52px] w-full items-center gap-3 px-5 text-left active:bg-[var(--tf-soft)]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[16px] font-medium">{course.name}</span>
                      <span className="shrink-0 text-[14px] text-[var(--tf-ink-2)]">
                        {count > 0 ? `빈 자리 ${count}, ${first}부터` : "오늘은 마감"}
                      </span>
                      <CaretRight size={16} className="shrink-0 text-[var(--tf-ink-3)]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <div className="sticky top-0 z-10 mt-2 border-y border-[var(--tf-line)] bg-[var(--tf-surface)]">
          <div className="flex h-[60px] items-center gap-2 px-5">
            <h2 className="mr-auto text-[20px] font-bold tracking-[-0.02em]">빈 티타임</h2>
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
            {DATES.map((d) => {
              const active = d === date;
              const weekend = isWeekend(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  aria-pressed={active}
                  aria-label={formatLongDate(d)}
                  className="tf-press flex w-[50.4px] shrink-0 snap-start flex-col items-center gap-1 pb-3 pt-1"
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
                </button>
              );
            })}
          </div>
        </div>

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
