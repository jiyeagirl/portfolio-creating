"use client";

import Image from "next/image";
import { Warning } from "@phosphor-icons/react";
import { BarChart, Card, CardHead, PageHead, Stat } from "@/projects/monitoring/safesense/components/admin/ui";
import { events, sites, workers, eventLabel } from "@/projects/monitoring/safesense/lib/mock-data";
import type { AdminTab } from "@/projects/monitoring/safesense/components/admin/admin-app";

const TREND = [
  { label: "07/23", value: 4 },
  { label: "07/24", value: 6 },
  { label: "07/25", value: 3 },
  { label: "07/26", value: 5 },
  { label: "07/27", value: 2 },
  { label: "07/28", value: 4 },
  { label: "07/29", value: 2, emphasis: true },
];

export function AdminDashboard({ onGo }: { onGo: (tab: AdminTab) => void }) {
  const activeEvents = events.filter((e) => e.status === "active");
  const dangerWorkers = workers.filter((w) => w.status === "danger").length;
  const totalWorkers = workers.length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="MAIN DASHBOARD"
        title="오늘 현장 운영 현황"
        desc="2026년 7월 29일 수요일, 3개 현장, 실시간 데이터는 15초마다 갱신됩니다."
      />

      <div className="relative h-[168px] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
        <Image
          src="https://picsum.photos/id/1048/1200/400"
          alt="올려다본 각도의 고층 철골 건축물"
          fill
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-[var(--ss-bg)]/70" />
        <div className="ss-mono absolute bottom-4 left-5 text-[11px] text-[var(--ss-foreground)]">
          &gt;&gt;&gt; UNIT / SITE-MONITOR 3개 현장 동시 관제 중
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="오늘 근무 인원" value={`${totalWorkers}명`} delta="+3" note="어제 대비" />
        <Stat label="오늘 발생 위험 이벤트" value={String(events.length)} delta="+1" note="어제 대비" emphasis />
        <Stat label="진행 중 이벤트" value={String(activeEvents.length)} note="즉시 확인 필요" emphasis={activeEvents.length > 0} />
        <Stat label="현재 위험 상태" value={`${dangerWorkers}명`} note={`전체 ${totalWorkers}명 중`} />
      </div>

      <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHead title="최근 7일 위험 이벤트 추이" desc="유형 구분 없이 일별 총 발생 건수" />
          <div className="p-5 pt-0">
            <BarChart data={TREND} />
          </div>
        </Card>
        <Card>
          <CardHead
            title="긴급 알림 현황"
            action={
              <button onClick={() => onGo("monitoring")} className="ss-mono text-[10.5px] font-semibold text-[var(--ss-accent)]">
                관제로 이동 →
              </button>
            }
          />
          <div className="divide-y divide-[var(--ss-border)] px-5 pb-5">
            {activeEvents.length === 0 ? (
              <p className="ss-mono py-6 text-center text-[11px] text-[var(--ss-muted)]">
                진행 중인 긴급 이벤트가 없습니다
              </p>
            ) : (
              activeEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5 py-3">
                  <Warning size={15} weight="fill" className="mt-0.5 shrink-0 text-[var(--ss-accent)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[var(--ss-foreground)]">
                      {ev.workerName} / {eventLabel(ev.type)}
                    </p>
                    <p className="ss-mono mt-0.5 text-[10px] text-[var(--ss-muted)]">{ev.location}</p>
                  </div>
                  <span className="ss-mono shrink-0 text-[10px] text-[var(--ss-muted)]">{ev.at}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHead title="현장별 상태 요약" />
        <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] p-5 pt-0 sm:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="rounded-[6px] bg-[var(--ss-panel)] p-4">
              <p className="text-[12.5px] font-semibold text-[var(--ss-foreground)]">{site.name}</p>
              <p className="ss-mono mt-1 text-[10px] text-[var(--ss-muted)]">근로자 {site.workerCount}명</p>
              <p
                className={`ss-mono mt-2 text-[11px] font-semibold ${
                  site.activeEventCount > 0 ? "text-[var(--ss-accent)]" : "text-[var(--ss-safe)]"
                }`}
              >
                진행 중 이벤트 {site.activeEventCount}건
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
