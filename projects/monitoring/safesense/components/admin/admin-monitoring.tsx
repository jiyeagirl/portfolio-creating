"use client";

import { PersonSimpleWalk } from "@phosphor-icons/react";
import { Card, CardHead, PageHead, StatusBadge, Tabs } from "@/projects/monitoring/safesense/components/admin/ui";
import { events, sites, workers, eventLabel } from "@/projects/monitoring/safesense/lib/mock-data";
import { useState } from "react";

const MAP_POSITIONS: Record<string, { top: string; left: string }> = {
  "worker-me": { top: "62%", left: "22%" },
  "w-2": { top: "30%", left: "38%" },
  "w-3": { top: "48%", left: "58%" },
  "w-4": { top: "70%", left: "48%" },
  "w-5": { top: "20%", left: "70%" },
};

export function AdminMonitoring() {
  const [siteFilter, setSiteFilter] = useState<"all" | string>("all");
  const activeEvents = events.filter((e) => e.status === "active");
  const site1Workers = workers.filter((w) => w.siteId === "site-1");

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="LIVE MONITORING"
        title="실시간 관제"
        desc="담당 근로자의 위치와 안전 상태를 지도에서 확인하고, 발생한 위험 이벤트를 처리합니다."
      />

      <Tabs
        value={siteFilter}
        items={[{ key: "all", label: "전체 현장" }, ...sites.map((s) => ({ key: s.id, label: s.name }))]}
        onChange={setSiteFilter}
      />

      <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHead title="A건설 강남 현장 실시간 위치" desc="34명 표시 중, 마커를 누르면 오른쪽에서 확인합니다" />
          <div className="ss-mono relative mx-5 mb-5 h-[360px] overflow-hidden rounded-[10px] border border-[var(--ss-border)] bg-[var(--ss-bg)] text-[10px] text-[var(--ss-muted)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(var(--ss-border) 1px, transparent 1px), linear-gradient(90deg, var(--ss-border) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {site1Workers.map((w) => {
              const pos = MAP_POSITIONS[w.id] ?? { top: "50%", left: "50%" };
              const color = w.status === "danger" ? "var(--ss-accent)" : "var(--ss-safe)";
              return (
                <div key={w.id} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={pos}>
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    <span
                      className={`absolute h-3 w-3 rounded-full ${w.status === "danger" ? "ss-blink" : ""}`}
                      style={{ background: color }}
                    />
                  </span>
                  <span className="mt-1 rounded-[3px] bg-[var(--ss-panel)] px-1.5 py-0.5 text-[9px]" style={{ color }}>
                    {w.name}
                  </span>
                </div>
              );
            })}
            <div className="ss-mono absolute bottom-3 left-3 flex gap-3 text-[9px]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[var(--ss-safe)]" />
                안전
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[var(--ss-accent)]" />
                위험 / 실시간
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="위험 이벤트 발생 현황" desc={`진행 중 ${activeEvents.length}건`} />
          <div className="divide-y divide-[var(--ss-border)] px-5 pb-5">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2.5 py-3">
                <PersonSimpleWalk size={15} weight="bold" className="mt-0.5 shrink-0 text-[var(--ss-muted)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[var(--ss-foreground)]">
                    {ev.workerName} / {eventLabel(ev.type)}
                  </p>
                  <p className="ss-mono mt-0.5 text-[10px] text-[var(--ss-muted)]">{ev.location}</p>
                  <p className="ss-mono mt-1 text-[9.5px] text-[var(--ss-muted)]">{ev.at}</p>
                </div>
                <StatusBadge status={ev.status === "resolved" ? "safe" : "danger"} live={ev.status === "active"} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
