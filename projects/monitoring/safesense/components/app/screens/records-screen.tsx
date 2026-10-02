"use client";

import { Fragment, useState } from "react";
import { Warning } from "@phosphor-icons/react";
import { Card, SectionTitle, StatTile } from "@/projects/monitoring/safesense/components/app/ui";
import { events, eventLabel } from "@/projects/monitoring/safesense/lib/mock-data";
import { currentWorker } from "@/projects/monitoring/safesense/lib/mock-data";

const RANGE = ["오늘", "이번 주", "이번 달"] as const;

const DAILY_HISTORY = [
  { date: "07.29 (수)", hours: "4:12", km: "2.8", events: 0 },
  { date: "07.28 (화)", hours: "8:30", km: "5.1", events: 0 },
  { date: "07.27 (월)", hours: "8:15", km: "4.7", events: 1 },
  { date: "07.26 (금)", hours: "7:50", km: "4.2", events: 0 },
  { date: "07.25 (목)", hours: "8:05", km: "4.9", events: 0 },
];

export function RecordsScreen() {
  const [range, setRange] = useState<(typeof RANGE)[number]>("오늘");
  const myEvents = events.filter((e) => e.workerId === currentWorker.id || e.workerId === "w-4");

  return (
    <div className="min-h-full w-full px-5 pb-32 pt-[78px]">
      <h1 className="ss-display text-[22px] text-[var(--ss-foreground)]">작업 기록</h1>
      <p className="ss-mono mt-1 text-[10px] text-[var(--ss-muted)]">
        이동 경로와 이벤트 발생 이력을 확인합니다
      </p>

      <div className="mt-4 grid grid-cols-3 gap-[1px] overflow-hidden rounded-[8px] bg-[var(--ss-border)]">
        {RANGE.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`ss-mono ss-press border-0 bg-[var(--ss-panel)] py-2.5 text-[11px] ${
              range === r ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <SectionTitle className="mt-6">이동 경로</SectionTitle>
      <div className="ss-mono relative mt-2 flex h-[164px] items-center justify-center overflow-hidden rounded-[10px] border border-[var(--ss-border)] bg-[var(--ss-panel)] text-[10px] text-[var(--ss-muted)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--ss-border) 1px, transparent 1px), linear-gradient(90deg, var(--ss-border) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <svg viewBox="0 0 240 130" className="relative h-full w-full">
          <polyline
            points="20,110 60,80 90,85 120,50 160,45 210,20"
            fill="none"
            stroke="var(--ss-accent)"
            strokeWidth="2"
          />
          <circle cx="20" cy="110" r="4" fill="var(--ss-muted)" />
          <circle cx="210" cy="20" r="4" fill="var(--ss-accent)" />
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-[1px] bg-[var(--ss-border)]">
        <StatTile label="작업 시간" value="4:12" className="border-0" />
        <StatTile label="이동 거리" value="2.8" unit="KM" className="border-0" />
      </div>

      <SectionTitle className="mt-7" action={<span className="ss-mono text-[10px] text-[var(--ss-muted)]">{myEvents.length}건</span>}>
        이벤트 발생 기록
      </SectionTitle>
      <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
        {myEvents.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
            <Warning size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--ss-accent)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-[var(--ss-foreground)]">
                {eventLabel(ev.type)}
              </p>
              <p className="ss-mono mt-0.5 text-[10px] text-[var(--ss-muted)]">{ev.detail}</p>
            </div>
            <span className="ss-mono shrink-0 text-[10px] text-[var(--ss-muted)]">{ev.at}</span>
          </div>
        ))}
      </div>

      <SectionTitle className="mt-7">일별 작업 이력</SectionTitle>
      <Card className="mt-2 p-0">
        <div className="ss-mono grid grid-cols-4 gap-[1px] bg-[var(--ss-border)] text-[10px] text-[var(--ss-muted)]">
          <span className="bg-[var(--ss-panel-2)] px-3 py-2">날짜</span>
          <span className="bg-[var(--ss-panel-2)] px-3 py-2 text-right">작업시간</span>
          <span className="bg-[var(--ss-panel-2)] px-3 py-2 text-right">이동거리</span>
          <span className="bg-[var(--ss-panel-2)] px-3 py-2 text-right">이벤트</span>
          {DAILY_HISTORY.map((d) => (
            <Fragment key={d.date}>
              <span className="ss-mono bg-[var(--ss-panel)] px-3 py-2.5 text-[10.5px] text-[var(--ss-foreground)]">
                {d.date}
              </span>
              <span className="ss-mono bg-[var(--ss-panel)] px-3 py-2.5 text-right text-[10.5px] text-[var(--ss-foreground)]">
                {d.hours}
              </span>
              <span className="ss-mono bg-[var(--ss-panel)] px-3 py-2.5 text-right text-[10.5px] text-[var(--ss-foreground)]">
                {d.km}
              </span>
              <span
                className={`ss-mono bg-[var(--ss-panel)] px-3 py-2.5 text-right text-[10.5px] ${
                  d.events > 0 ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"
                }`}
              >
                {d.events}
              </span>
            </Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}
