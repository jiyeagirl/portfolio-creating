"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CalendarBlank, ListBullets, MapPin, UsersThree } from "@phosphor-icons/react";
import { EVENTS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Badge,
  CONTAINER,
  OfficialBadge,
  PageHeader,
} from "@/projects/community/locly/components/site/ui";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMonthGrid(year: number, month: number) {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: startOffset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function EventsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [category, setCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(EVENTS.map((e) => e.category))), []);
  const filtered = category === "all" ? EVENTS : EVENTS.filter((e) => e.category === category);
  const cells = buildMonthGrid(2026, 7);

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof EVENTS> = {};
    for (const event of EVENTS) (map[event.date] ??= []).push(event);
    return map;
  }, []);

  const listed = selectedDate ? (eventsByDate[selectedDate] ?? []) : filtered;

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <PageHeader
            title="지역 행사"
            lead="나인구청이 여는 공식 행사와 주민이 직접 등록한 행사를 한곳에서 확인하세요."
          />
        </div>
        <div className="flex items-center gap-1 rounded-[8px] border border-[var(--lc-hairline)] p-1">
          {(["list", "calendar"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setView(mode);
                if (mode === "list") setSelectedDate(null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                view === mode ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
              }`}
            >
              {mode === "list" ? <ListBullets size={14} /> : <CalendarBlank size={14} />}
              {mode === "list" ? "목록" : "캘린더"}
            </button>
          ))}
        </div>
      </div>

      <div className="locly-scrollbar-none mt-8 flex items-center gap-1 overflow-x-auto">
        {[{ key: "all", label: "전체" }, ...categories.map((c) => ({ key: c, label: c }))].map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`shrink-0 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
              category === c.key ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {view === "calendar" && (
        <div className="mt-8 rounded-[12px] border border-[var(--lc-hairline)] p-6">
          <p className="locly-display text-[22px] text-[var(--lc-ink)]">2026년 8월</p>
          <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-[var(--lc-muted-soft)]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-2">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `2026-08-${String(day).padStart(2, "0")}`;
              const has = eventsByDate[dateStr]?.length;
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-[8px] text-[14px] transition-colors ${
                    isSelected
                      ? "bg-[var(--lc-ink)] text-[var(--lc-on-dark)]"
                      : has
                        ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                        : "text-[var(--lc-muted-soft)]"
                  }`}
                >
                  {day}
                  <span
                    className={`h-1 w-1 rounded-full ${
                      has ? (isSelected ? "bg-[var(--lc-on-dark)]" : "bg-[var(--lc-primary)]") : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <p className="mt-5 border-t border-[var(--lc-hairline)] pt-4 text-[13px] text-[var(--lc-muted)]">
              {selectedDate.replace(/-/g, ".")} 행사 {listed.length}건 · 다시 누르면 전체 목록으로 돌아갑니다
            </p>
          )}
        </div>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {listed.map((event) => (
          <button
            key={event.id}
            onClick={() => onNavigate("eventDetail", event.id)}
            className="group flex flex-col text-left"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 flex gap-2">
                {event.official ? <OfficialBadge /> : <Badge>주민 주최</Badge>}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-[13px] font-medium text-[var(--lc-primary)]">
                {event.date.slice(5).replace("-", ".")} · {event.time}
              </p>
              <p className="mt-2 text-[18px] font-medium leading-[1.4] text-[var(--lc-ink)]">{event.title}</p>
              <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                {event.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--lc-hairline)] pt-4 text-[13px] text-[var(--lc-muted)]">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <MapPin size={13} className="shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5">
                  <UsersThree size={13} />
                  {event.applied}/{event.capacity}
                </span>
              </div>
            </div>
          </button>
        ))}
        {listed.length === 0 && (
          <p className="col-span-full py-20 text-center text-[14px] text-[var(--lc-muted)]">
            선택한 날짜에 등록된 행사가 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
