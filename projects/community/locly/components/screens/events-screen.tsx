"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CalendarBlank, ListBullets, MapPin, UsersThree } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { EVENTS } from "@/projects/community/locly/lib/mock-data";
import { Badge, OfficialBadge } from "@/projects/community/locly/components/layout/ui";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function EventsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [category, setCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(EVENTS.map((e) => e.category))), []);
  const filtered = category === "all" ? EVENTS : EVENTS.filter((e) => e.category === category);

  const year = 2026;
  const month = 7; // August, 0-indexed
  const cells = buildMonthGrid(year, month);

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof EVENTS> = {};
    for (const event of EVENTS) {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, []);

  const dayEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : filtered;

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--locly-ink)]">지역 행사</h1>
          <p className="mt-1 text-[13.5px] text-[var(--locly-muted)]">
            지자체 공식 행사와 주민이 직접 등록한 행사를 함께 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-[var(--locly-border)] p-1">
          <button
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
              view === "list" ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "text-[var(--locly-muted)]"
            }`}
          >
            <ListBullets size={14} /> 목록
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
              view === "calendar" ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "text-[var(--locly-muted)]"
            }`}
          >
            <CalendarBlank size={14} /> 캘린더
          </button>
        </div>
      </div>

      <div className="locly-scrollbar-none mt-6 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            category === "all" ? "bg-[var(--locly-ink)] text-[var(--locly-bg)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
          }`}
        >
          전체
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              category === c ? "bg-[var(--locly-ink)] text-[var(--locly-bg)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {view === "calendar" && (
        <div className="mt-6 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
          <p className="text-[15px] font-bold text-[var(--locly-ink)]">2026년 8월</p>
          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[12px] font-semibold text-[var(--locly-muted)]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `2026-08-${String(day).padStart(2, "0")}`;
              const hasEvents = eventsByDate[dateStr]?.length;
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-[13px] transition-colors ${
                    isSelected
                      ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]"
                      : "text-[var(--locly-ink)] hover:bg-[var(--locly-surface)]"
                  }`}
                >
                  {day}
                  {hasEvents ? (
                    <span
                      className={`h-1 w-1 rounded-full ${isSelected ? "bg-[var(--locly-accent-foreground)]" : "bg-[var(--locly-accent)]"}`}
                    />
                  ) : (
                    <span className="h-1 w-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dayEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => onNavigate("eventDetail", event.id)}
            className="flex flex-col overflow-hidden rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] text-left transition-colors hover:border-[var(--locly-accent)]/50"
          >
            <div className="relative h-[150px] w-full">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
              <span className="absolute left-3 top-3">
                {event.official ? <OfficialBadge /> : <Badge tone="neutral">주민 주최</Badge>}
              </span>
              {event.pinned && (
                <span className="absolute right-3 top-3">
                  <Badge tone="warning">상단고정</Badge>
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="text-[12px] font-semibold text-[var(--locly-accent)]">
                {event.date.slice(5).replace("-", ".")} · {event.time}
              </span>
              <p className="line-clamp-2 text-[15px] font-semibold text-[var(--locly-ink)]">{event.title}</p>
              <p className="line-clamp-2 text-[12.5px] leading-relaxed text-[var(--locly-muted)]">
                {event.description}
              </p>
              <div className="mt-auto flex items-center justify-between pt-1 text-[12px] text-[var(--locly-muted)]">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <UsersThree size={13} />
                  {event.applied}/{event.capacity}
                </span>
              </div>
            </div>
          </button>
        ))}
        {dayEvents.length === 0 && (
          <p className="col-span-full py-16 text-center text-[13.5px] text-[var(--locly-muted)]">
            선택한 날짜에 등록된 행사가 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
