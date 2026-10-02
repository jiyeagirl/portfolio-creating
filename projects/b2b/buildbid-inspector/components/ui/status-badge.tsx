import type { ChecklistResult, JobStatus } from "@/projects/b2b/buildbid-inspector/lib/types";

const JOB_STATUS_STYLE: Record<JobStatus, string> = {
  예정: "bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted)]",
  진행중: "bg-[var(--bbi-accent-soft)] text-[var(--bbi-accent)]",
  완료: "bg-[var(--bbi-success-soft)] text-[var(--bbi-success)]",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-[9999px] px-2.5 py-1 text-[11px] font-bold leading-[14px] ${JOB_STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

const RESULT_STYLE: Record<Exclude<ChecklistResult, null>, string> = {
  정상: "bg-[var(--bbi-success-soft)] text-[var(--bbi-success)]",
  주의: "bg-[var(--bbi-warning-soft)] text-[var(--bbi-warning)]",
  불량: "bg-[var(--bbi-danger-soft)] text-[var(--bbi-danger)]",
};

export function ResultBadge({ result }: { result: Exclude<ChecklistResult, null> }) {
  return (
    <span
      className={`inline-flex items-center rounded-[9999px] px-2.5 py-1 text-[11px] font-bold leading-[14px] ${RESULT_STYLE[result]}`}
    >
      {result}
    </span>
  );
}
