"use client";

import Image from "next/image";
import { CaretRight } from "@phosphor-icons/react";
import type { InspectionJob } from "@/projects/b2b/buildbid-inspector/lib/types";
import { formatUsage } from "@/projects/b2b/buildbid-inspector/lib/mock-data";
import { JobStatusBadge } from "@/projects/b2b/buildbid-inspector/components/ui/status-badge";

export function JobCard({ job, onSelect }: { job: InspectionJob; onSelect: () => void }) {
  const done = job.status === "완료";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`bbi-btn-press flex w-full flex-col gap-3 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4 text-left ${
        done ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="bbi-tabular text-[15px] font-bold leading-[20px] text-[var(--bbi-ink)]">
            {job.scheduledTime}
          </span>
          <span className="text-[11px] font-semibold leading-[14px] text-[var(--bbi-muted-soft)]">
            {job.equipmentYear}년식
          </span>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[var(--bbi-surface-sunken)]">
          <Image
            src={job.photo}
            alt={`${job.equipmentType} ${job.equipmentModel} 실물 사진`}
            placeholder="blur"
            className="h-full w-full object-cover"
            sizes="48px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="shrink-0 text-[16px] font-bold leading-[22px] text-[var(--bbi-ink)]">
              {job.equipmentType}
            </span>
            <span className="truncate text-[13px] font-normal leading-[18px] text-[var(--bbi-muted)]">
              {job.equipmentModel}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[13px] font-normal leading-[18px] text-[var(--bbi-muted)]">
            <span className="font-semibold text-[var(--bbi-body)]">{job.companyName}</span>
            <span className="mx-1.5 text-[var(--bbi-border-strong)]">|</span>
            {formatUsage(job.equipmentType, job.equipmentHours)}
          </p>
        </div>

        <CaretRight size={16} weight="bold" className="shrink-0 text-[var(--bbi-muted-soft)]" />
      </div>
    </button>
  );
}
