"use client";

import { CheckCircle, ClipboardText, ListChecks } from "@phosphor-icons/react";
import { JOBS, INSPECTOR_NAME, TODAY_LABEL } from "@/projects/b2b/buildbid-inspector/lib/mock-data";
import { JobCard } from "@/projects/b2b/buildbid-inspector/components/schedule/job-card";

export function ScheduleScreen({
  onSelectJob,
}: {
  onSelectJob: (jobId: string) => void;
}) {
  const total = JOBS.length;
  const done = JOBS.filter((j) => j.status === "완료").length;
  const remaining = total - done;

  return (
    <div className="relative h-full w-full overflow-y-auto bbi-scroll-hidden bg-[var(--bbi-canvas)] pb-10 pt-[59px]">
      <div className="px-5 pb-5 pt-5">
        <p className="text-[13px] font-semibold leading-[18px] text-[var(--bbi-muted)]">
          {TODAY_LABEL}
        </p>
        <h1 className="mt-1 text-[28px] font-bold leading-[34px] text-[var(--bbi-ink)]">
          안녕하세요, {INSPECTOR_NAME}님
        </h1>
        <p className="mt-1 text-[15px] font-normal leading-[22px] text-[var(--bbi-body)]">
          오늘 배정된 현장 검수 일정입니다
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <StatChip icon={<ClipboardText size={16} weight="bold" />} label="전체" value={total} />
          <StatChip icon={<ListChecks size={16} weight="bold" />} label="남은 일정" value={remaining} tone="accent" />
          <StatChip icon={<CheckCircle size={16} weight="bold" />} label="완료" value={done} tone="success" />
        </div>
      </div>

      <div className="px-5">
        <div className="flex flex-col gap-3">
          {JOBS.map((job) => (
            <JobCard key={job.id} job={job} onSelect={() => onSelectJob(job.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "neutral" | "accent" | "success";
}) {
  const toneStyle =
    tone === "accent"
      ? "text-[var(--bbi-accent)]"
      : tone === "success"
        ? "text-[var(--bbi-success)]"
        : "text-[var(--bbi-ink)]";

  return (
    <div className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] px-3 py-3">
      <div className={`flex items-center gap-1.5 ${toneStyle}`}>
        {icon}
        <span className="bbi-tabular text-[18px] font-bold leading-[22px]">{value}</span>
      </div>
      <p className="mt-1 text-[11px] font-semibold leading-[14px] text-[var(--bbi-muted)]">{label}</p>
    </div>
  );
}
