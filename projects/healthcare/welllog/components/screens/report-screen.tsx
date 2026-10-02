"use client";

import Image from "next/image";
import { ForkKnife, Moon, PersonSimpleWalk, Sparkle, SneakerMove, TrendDown, TrendUp } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { weeklyReport } from "@/projects/healthcare/welllog/lib/mock-data";
import { formatSteps } from "@/projects/healthcare/welllog/lib/navigation";
import type { TrendPoint } from "@/projects/healthcare/welllog/lib/types";

function StatCard({
  icon,
  label,
  value,
  deltaPct,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  deltaPct: number;
  tone: string;
}) {
  const up = deltaPct >= 0;
  return (
    <div className="rounded-[20px] bg-[var(--wl-surface)] p-3.5 shadow-[var(--wl-shadow)]">
      <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: tone }}>
        {icon}
      </span>
      <p className="mt-2.5 text-[12px] text-[var(--wl-mute)]">{label}</p>
      <p className="wl-num mt-0.5 text-[17px] font-bold text-[var(--wl-ink)]">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-[11.5px] font-medium ${up ? "text-[var(--wl-accent-deep)]" : "text-[var(--wl-coral)]"}`}>
        {up ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
        지난주 대비 {Math.abs(deltaPct)}%
      </p>
    </div>
  );
}

function WeekBars({ data, format, color }: { data: TrendPoint[]; format: (v: number) => string; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2.5" style={{ height: 132 }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1.5">
          <span className="wl-num text-[10.5px] text-[var(--wl-mute)]">{format(d.value)}</span>
          <div
            className="w-full rounded-full"
            style={{ height: `${Math.max(6, (d.value / max) * 82)}px`, background: color }}
          />
          <span className="text-[11px] text-[var(--wl-mute)]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ReportScreen() {
  const r = weeklyReport;
  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-[110px]">
      <ScreenHeader
        title="리포트"
        subtitle="주간 트렌드"
        className="bg-[var(--wl-canvas)] border-[var(--wl-hairline)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wl-ink)]"
        subtitleClassName="text-[11px] text-[var(--wl-mute)]"
      />

      <div className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[20px]">
          <div className="relative h-[132px] w-full">
            <Image src="https://picsum.photos/id/957/700/420" alt="숲 사이로 비치는 햇살" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[12px] font-medium text-white/80">{r.weekLabel} / {r.rangeLabel}</p>
            <p className="mt-1 text-[16px] font-semibold text-white">이번 주 리듬을 돌아봤어요</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Moon size={15} weight="fill" color="var(--wl-periwinkle)" />}
            label="평균 수면"
            value={`${r.avgSleepHours}시간`}
            deltaPct={r.sleepDeltaPct}
            tone="var(--wl-periwinkle-soft)"
          />
          <StatCard
            icon={<PersonSimpleWalk size={15} weight="fill" color="var(--wl-accent-deep)" />}
            label="평균 걸음"
            value={formatSteps(r.avgSteps)}
            deltaPct={r.stepsDeltaPct}
            tone="var(--wl-accent-soft)"
          />
          <StatCard
            icon={<SneakerMove size={15} weight="fill" color="var(--wl-coral)" />}
            label="평균 활동"
            value={`${r.avgActivityMinutes}분`}
            deltaPct={r.activityDeltaPct}
            tone="var(--wl-coral-soft)"
          />
          <StatCard
            icon={<ForkKnife size={15} weight="fill" color="var(--wl-amber)" />}
            label="식단 점수"
            value={`${r.dietScore}점`}
            deltaPct={r.dietDeltaPct}
            tone="var(--wl-amber-soft)"
          />
        </div>

        <div className="mt-4 rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
          <p className="text-[14px] font-semibold text-[var(--wl-ink)]">수면 추이</p>
          <p className="mt-0.5 text-[11.5px] text-[var(--wl-mute)]">일별 수면 시간(시간)</p>
          <div className="mt-3">
            <WeekBars data={r.sleepTrend} format={(v) => `${v}h`} color="var(--wl-periwinkle)" />
          </div>
        </div>

        <div className="mt-4 rounded-[20px] bg-[var(--wl-surface)] p-4 shadow-[var(--wl-shadow)]">
          <p className="text-[14px] font-semibold text-[var(--wl-ink)]">걸음 추이</p>
          <p className="mt-0.5 text-[11.5px] text-[var(--wl-mute)]">일별 걸음 수</p>
          <div className="mt-3">
            <WeekBars data={r.stepsTrend} format={(v) => `${Math.round(v / 1000)}k`} color="var(--wl-accent)" />
          </div>
        </div>

        <div className="mt-4 rounded-[20px] bg-[var(--wl-accent-soft)] p-4">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--wl-accent)]">
              <Sparkle size={14} weight="fill" color="white" />
            </span>
            <div>
              <p className="text-[13px] font-medium text-[var(--wl-accent-deep)]">AI 주간 요약</p>
              <p className="mt-1 text-[13.5px] leading-5 text-[var(--wl-ink)]">{r.aiSummary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
