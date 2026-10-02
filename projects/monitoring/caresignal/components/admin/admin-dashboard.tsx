"use client";

import { ArrowRight, Broadcast, Warning } from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import { Metric, Panel, StatusTag, Tag } from "@/projects/monitoring/caresignal/components/admin/ui";
import {
  KIND_LABEL,
  agency,
  eventTrend,
  events,
  hourlyDistribution,
  liveFeed,
  summary,
  users,
} from "@/projects/monitoring/caresignal/lib/admin-data";
import type { AdminTab } from "@/projects/monitoring/caresignal/components/admin/admin-app";

const KIND_COLOR: Record<string, string> = {
  fall: "#ff3b30",
  sos: "#d70015",
  geofence: "#ff9500",
  inactivity: "#c7c7cc",
};

const KIND_ORDER = ["fall", "sos", "geofence", "inactivity"] as const;

export function AdminDashboard({ onGo }: { onGo: (tab: AdminTab) => void }) {
  const trendMax = Math.max(
    ...eventTrend.map((d) => d.fall + d.geofence + d.inactivity + d.sos),
  );
  const hourlyMax = Math.max(...hourlyDistribution.map((h) => h.count));
  const activeEvents = events.filter((e) => e.state === "detecting" || e.state === "responding");
  const dangerUsers = users.filter((u) => u.status === "danger");

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-normal leading-none text-[#7a7a7a]">
            {agency.todayLabel} · {agency.shiftLabel}
          </p>
          <h1 className="mt-3 text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#1d1d1f]">
            운영 현황
          </h1>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-[#eaf6ee] px-3 py-1.5 text-[12.5px] font-semibold text-[#248a3d]">
          <Broadcast size={14} weight="fill" />
          신호 수신율 {summary.signalRate}%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="전체 등록 사용자"
          value={String(summary.totalUsers)}
          unit="명"
          delta={`+${summary.newThisMonth}`}
          deltaGood
          note="이번 달 신규"
        />
        <Metric
          label="오늘 발생 위험 이벤트"
          value={String(summary.todayEvents)}
          unit="건"
          delta={`+${summary.todayEventsDelta}`}
          deltaGood={false}
          note="어제 대비"
        />
        <Metric
          label="미처리 이벤트"
          value={String(summary.unhandled)}
          unit="건"
          note="즉시 확인 필요"
        />
        <Metric
          label="평균 대응 시간"
          value={summary.avgResponse}
          delta={summary.avgResponseDelta}
          deltaGood
          note="지난 7일 평균"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel title="최근 7일 위험 이벤트" note="유형별 발생 건수" className="xl:col-span-2" padded>
          <div className="flex h-[168px] gap-3">
            {eventTrend.map((day) => {
              const dayTotal = day.fall + day.geofence + day.inactivity + day.sos;
              return (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold tabular-nums text-[#7a7a7a]">
                    {dayTotal}
                  </span>
                  <div className="flex w-full flex-1 flex-col justify-end gap-[2px]">
                    {KIND_ORDER.map((kind) => {
                      const value = day[kind];
                      if (!value) return null;
                      const ratio = (value / trendMax) * 100;
                      return (
                        <div
                          key={kind}
                          style={{ height: `${ratio}%`, background: KIND_COLOR[kind] }}
                          className="w-full rounded-[2px] first:rounded-t-[3px]"
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10.5px] font-normal leading-none text-[#7a7a7a]">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#f0f0f0] pt-3.5">
            {KIND_ORDER.map((kind) => (
              <span key={kind} className="flex items-center gap-1.5 text-[12px] font-normal text-[#7a7a7a]">
                <span className="h-[8px] w-[8px] rounded-[2px]" style={{ background: KIND_COLOR[kind] }} />
                {KIND_LABEL[kind]}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="실시간 알림" note="발생 순" actions={
          <button
            type="button"
            onClick={() => onGo("monitoring")}
            className="flex items-center gap-1 text-[12.5px] font-semibold text-[#0066cc]"
          >
            모니터링 <ArrowRight size={12} weight="bold" />
          </button>
        }>
          <ul className="max-h-[236px] overflow-y-auto px-5 py-3">
            {liveFeed.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5 py-2">
                <span
                  className={`mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full ${
                    item.tone === "danger"
                      ? "bg-[#ff3b30]"
                      : item.tone === "caution"
                        ? "bg-[#ff9500]"
                        : "bg-[#248a3d]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-normal leading-[1.45] text-[#333333]">{item.text}</p>
                  <p className="mt-0.5 text-[11.5px] font-normal tabular-nums text-[#a1a1a6]">
                    {item.at}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel title="사용자 안전 상태 요약" className="xl:col-span-1" padded>
          <div className="space-y-4">
            <StatusRow label="안전" count={summary.statusCounts.safe} total={summary.totalUsers} tone="safe" />
            <StatusRow label="주의" count={summary.statusCounts.caution} total={summary.totalUsers} tone="caution" />
            <StatusRow label="위험" count={summary.statusCounts.danger} total={summary.totalUsers} tone="danger" />
          </div>
          <button
            type="button"
            onClick={() => onGo("users")}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#d2d2d7] py-2.5 text-[13px] font-semibold text-[#1d1d1f]"
          >
            사용자 관리로 이동 <ArrowRight size={13} weight="bold" />
          </button>
        </Panel>

        <Panel title="시간대별 발생 분포" note="최근 7일 합산" className="xl:col-span-1" padded>
          <div className="flex h-[132px] gap-2">
            {hourlyDistribution.map((h) => (
              <div key={h.hour} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-[4px] bg-[#0066cc]"
                    style={{ height: `${Math.max((h.count / hourlyMax) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-[10.5px] font-normal leading-none text-[#7a7a7a]">{h.hour}시</span>
              </div>
            ))}
          </div>
          <p className="mt-3.5 border-t border-[#f0f0f0] pt-3 text-[12.5px] font-normal leading-[1.5] text-[#7a7a7a]">
            오후 3시대 발생이 가장 많아 해당 시간대 인력을 우선 배치하고 있습니다.
          </p>
        </Panel>

        <Panel title="실시간 위치 스냅샷" className="xl:col-span-1" padded>
          <MiniMap
            className="h-[132px] w-full"
            markers={dangerUsers.map((u) => ({
              id: u.id,
              x: u.x,
              y: u.y,
              kind: "user",
              status: u.status,
              pulse: true,
            }))}
            showLabels={false}
            rounded="rounded-[11px]"
          />
          <p className="mt-3.5 border-t border-[#f0f0f0] pt-3 text-[12.5px] font-normal leading-[1.5] text-[#7a7a7a]">
            위험 상태 {dangerUsers.length}명이 지도에 표시됩니다.
          </p>
        </Panel>
      </div>

      <Panel
        title="처리 대기 중인 이벤트"
        note={`${activeEvents.length}건이 대응 중이거나 확인을 기다리고 있습니다`}
        actions={
          <button
            type="button"
            onClick={() => onGo("monitoring")}
            className="flex items-center gap-1 text-[12.5px] font-semibold text-[#0066cc]"
          >
            전체 보기 <ArrowRight size={12} weight="bold" />
          </button>
        }
        className="mt-3"
      >
        <ul className="divide-y divide-[#f0f0f0]">
          {activeEvents.map((event) => (
            <li key={event.id} className="flex items-center gap-4 px-5 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fdecea]">
                <Warning size={17} weight="fill" className="text-[#d70015]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[#1d1d1f]">
                  {event.userName} · {KIND_LABEL[event.kind]}
                </p>
                <p className="mt-0.5 truncate text-[12.5px] font-normal text-[#7a7a7a]">
                  {event.place} · {event.note}
                </p>
              </div>
              <Tag tone="neutral">{event.elapsed}</Tag>
              <StatusTag status={event.status} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function StatusRow({
  label,
  count,
  total,
  tone,
}: {
  label: string;
  count: number;
  total: number;
  tone: "safe" | "caution" | "danger";
}) {
  const ratio = Math.round((count / total) * 100);
  const fill = tone === "safe" ? "bg-[#248a3d]" : tone === "caution" ? "bg-[#ff9500]" : "bg-[#ff3b30]";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[13.5px] font-semibold text-[#1d1d1f]">{label}</span>
        <span className="text-[13px] font-normal tabular-nums text-[#7a7a7a]">
          {count}명 · {ratio}%
        </span>
      </div>
      <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full bg-[#f0f0f0]">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}
