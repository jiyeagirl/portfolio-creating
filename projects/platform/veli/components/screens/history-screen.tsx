"use client";

import { useState } from "react";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  PhoneIncoming,
  PhoneOutgoing,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import type { CallLog } from "@/projects/platform/veli/lib/types";
import { CALL_LOGS } from "@/projects/platform/veli/lib/mock-data";
import { Badge, CallResultBadge, EmptyState, inputClass } from "@/projects/platform/veli/components/ui";

type Period = "all" | "week" | "month";

const PERIODS: { key: Period; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "week", label: "이번주" },
  { key: "month", label: "이번달" },
];

/** 목업 데이터의 최신 통화 날짜(2026-07-29)를 기준일로 삼는다. */
const TODAY = new Date("2026-07-30T00:00:00");

function formatDuration(sec: number) {
  if (sec <= 0) return "-";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function matchesPeriod(log: CallLog, period: Period): boolean {
  if (period === "all") return true;
  const d = new Date(`${log.date}T00:00:00`);
  if (period === "week") {
    const diffDays = (TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays < 7;
  }
  return d.getFullYear() === TODAY.getFullYear() && d.getMonth() === TODAY.getMonth();
}

export function HistoryScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<Period>("all");

  const q = query.trim().toLowerCase();
  const list = CALL_LOGS.filter((log) => {
    if (!matchesPeriod(log, period)) return false;
    if (!q) return true;
    return log.date.toLowerCase().includes(q) || log.safeNumber.toLowerCase().includes(q);
  });

  return (
    <div className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)] pb-10">
      {/* 시트 안에서는 상태바를 시트가 이미 비켜 있고 제목도 시트 헤더가 갖는다.
          여기서는 검색과 필터만 sticky로 남긴다. */}
      <header className="sticky top-0 z-20 border-b border-[var(--vl-border)] bg-[var(--vl-elevated)] pb-3 pt-1">
        <div className="px-5">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--vl-muted)]"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="날짜 또는 안심번호로 검색"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2 px-5">
          {PERIODS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setPeriod(item.key)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                period === item.key
                  ? "bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]"
                  : "bg-[var(--vl-surface)] text-[var(--vl-muted)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {list.length === 0 ? (
        <EmptyState
          icon={<ClockCounterClockwise size={26} />}
          title="해당하는 통화가 없어요"
          body="검색어나 기간 조건을 바꿔서 다시 확인해 보세요."
        />
      ) : (
        <div className="space-y-2.5 p-5">
          {list.map((log) => (
            <button
              key={log.id}
              type="button"
              onClick={() => onNavigate("callDetail", log.id)}
              className="flex w-full items-center gap-3 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 py-3.5 text-left"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  log.direction === "incoming"
                    ? "bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]"
                    : "bg-[var(--vl-surface)] text-[var(--vl-muted)]"
                }`}
              >
                {log.direction === "incoming" ? (
                  <PhoneIncoming size={18} weight="fill" />
                ) : (
                  <PhoneOutgoing size={18} weight="fill" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[14.5px] font-bold">
                    {log.direction === "incoming" ? "수신" : "발신"}
                  </span>
                  <CallResultBadge result={log.result} />
                  {log.reported && <Badge tone="danger">신고함</Badge>}
                </span>
                <span className="vl-num mt-1 block text-[12.5px] text-[var(--vl-muted)]">
                  {log.date} {log.time} | {log.safeNumber}
                </span>
              </span>

              <span className="vl-num shrink-0 text-[13px] font-semibold text-[var(--vl-muted)]">
                {formatDuration(log.durationSec)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
