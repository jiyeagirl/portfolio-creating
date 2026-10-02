"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import type { InspectionJob, InspectionReport } from "@/projects/b2b/buildbid-inspector/lib/types";
import { GradeBadge, GRADE_META } from "@/projects/b2b/buildbid-inspector/components/ui/grade-badge";

export function SubmittedScreen({
  job,
  report,
  submittedAt,
  onDone,
}: {
  job: InspectionJob;
  report: InspectionReport;
  submittedAt: string;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[var(--bbi-canvas)] px-6">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-[9999px] bg-[var(--bbi-success-soft)]"
      >
        <CheckCircle size={40} weight="fill" className="text-[var(--bbi-success)]" />
      </motion.div>

      <h1 className="mt-5 text-[24px] font-bold leading-[30px] text-[var(--bbi-ink)]">검수가 제출되었습니다</h1>
      <p className="mt-1.5 text-center text-[14px] font-normal leading-[20px] text-[var(--bbi-muted)]">
        검수 리포트가 BuildBid 담당자에게 전달되었습니다
      </p>

      <div className="mt-6 w-full rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold leading-[22px] text-[var(--bbi-ink)]">
              {job.equipmentType} | {job.equipmentModel}
            </p>
            <p className="truncate text-[13px] font-normal leading-[18px] text-[var(--bbi-muted)]">
              {job.companyName}
            </p>
          </div>
          {report.grade && <GradeBadge grade={report.grade} />}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[var(--bbi-border)] pt-3">
          <span className="text-[12px] font-semibold text-[var(--bbi-muted)]">제출 시각</span>
          <span className="bbi-tabular text-[13px] font-bold text-[var(--bbi-ink)]">{submittedAt}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[var(--bbi-muted)]">촬영 사진</span>
          <span className="bbi-tabular text-[13px] font-bold text-[var(--bbi-ink)]">{report.photos.length}장</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[var(--bbi-muted)]">손상 기록</span>
          <span className="bbi-tabular text-[13px] font-bold text-[var(--bbi-ink)]">{report.damages.length}건</span>
        </div>
        {report.grade && (
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--bbi-muted)]">종합 등급</span>
            <span className="text-[13px] font-bold text-[var(--bbi-ink)]">
              {report.grade} | {GRADE_META[report.grade].desc}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onDone}
        className="bbi-btn-press mt-8 flex h-[52px] w-full items-center justify-center rounded-[9999px] bg-[var(--bbi-accent)] text-[15px] font-bold text-[var(--bbi-on-accent)]"
      >
        일정으로 돌아가기
      </button>
    </div>
  );
}
