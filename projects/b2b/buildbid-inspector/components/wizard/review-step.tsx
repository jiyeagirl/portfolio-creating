"use client";

import Image from "next/image";
import { CaretRight, CheckCircle, PencilSimple, Warning } from "@phosphor-icons/react";
import type { InspectionJob, InspectionReport } from "@/projects/b2b/buildbid-inspector/lib/types";
import type { WizardStep } from "@/projects/b2b/buildbid-inspector/lib/navigation";
import { GradeBadge, GRADE_META } from "@/projects/b2b/buildbid-inspector/components/ui/grade-badge";

export function ReviewStep({
  job,
  report,
  onJump,
}: {
  job: InspectionJob;
  report: InspectionReport;
  onJump: (step: WizardStep) => void;
}) {
  const unratedCount = report.checklist.filter((c) => c.result === null).length;
  const normalCount = report.checklist.filter((c) => c.result === "정상").length;
  const cautionCount = report.checklist.filter((c) => c.result === "주의").length;
  const failCount = report.checklist.filter((c) => c.result === "불량").length;

  const missing: { label: string; step: WizardStep }[] = [];
  if (unratedCount > 0) missing.push({ label: `미입력 체크리스트 ${unratedCount}개`, step: "checklist" });
  if (report.photos.length === 0) missing.push({ label: "촬영된 사진 없음", step: "photos" });
  if (!report.grade) missing.push({ label: "장비 상태 등급 미선택", step: "grade" });

  return (
    <div className="px-5 pb-4">
      {missing.length > 0 ? (
        <div className="rounded-[18px] border border-[var(--bbi-danger)]/30 bg-[var(--bbi-danger-soft)] p-4">
          <div className="flex items-center gap-2">
            <Warning size={18} weight="bold" className="text-[var(--bbi-danger)]" />
            <p className="text-[14px] font-bold leading-[20px] text-[var(--bbi-danger)]">
              제출 전 확인이 필요합니다
            </p>
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5">
            {missing.map((m) => (
              <button
                key={m.step + m.label}
                type="button"
                onClick={() => onJump(m.step)}
                className="bbi-btn-press flex items-center justify-between rounded-[12px] bg-white/60 px-3 py-2 text-left"
              >
                <span className="text-[13px] font-semibold text-[var(--bbi-ink)]">{m.label}</span>
                <CaretRight size={14} weight="bold" className="text-[var(--bbi-danger)]" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-[18px] border border-[var(--bbi-success)]/30 bg-[var(--bbi-success-soft)] p-4">
          <CheckCircle size={20} weight="fill" className="text-[var(--bbi-success)]" />
          <p className="text-[14px] font-bold leading-[20px] text-[var(--bbi-success)]">
            모든 항목이 입력되었습니다 — 제출 준비 완료
          </p>
        </div>
      )}

      {/* Equipment recap */}
      <div className="mt-4 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <p className="text-[13px] font-semibold leading-[18px] text-[var(--bbi-muted)]">검수 대상</p>
        <p className="mt-0.5 text-[17px] font-bold leading-[22px] text-[var(--bbi-ink)]">
          {job.equipmentType} | {job.equipmentModel}
        </p>
        <p className="text-[13px] font-normal leading-[18px] text-[var(--bbi-muted)]">
          {job.companyName} | {job.equipmentYear}년식
        </p>
      </div>

      {/* Checklist summary */}
      <SummarySection title="항목별 체크리스트" step="checklist" onJump={onJump}>
        <div className="grid grid-cols-4 gap-2">
          <MiniStat label="정상" value={normalCount} tone="success" />
          <MiniStat label="주의" value={cautionCount} tone="warning" />
          <MiniStat label="불량" value={failCount} tone="danger" />
          <MiniStat label="미입력" value={unratedCount} tone="neutral" />
        </div>
      </SummarySection>

      {/* Photos summary */}
      <SummarySection title="장비 사진" step="photos" onJump={onJump}>
        {report.photos.length === 0 ? (
          <p className="text-[13px] font-normal text-[var(--bbi-muted-soft)]">촬영된 사진이 없습니다</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto bbi-scroll-hidden">
            {report.photos.map((p) => (
              <div key={p.id} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] border border-[var(--bbi-border)]">
                <Image src={`https://picsum.photos/id/${p.picsumId}/120/120`} alt={p.label} fill sizes="56px" className="object-cover" />
              </div>
            ))}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-[var(--bbi-surface-sunken)]">
              <span className="bbi-tabular text-[13px] font-bold text-[var(--bbi-muted)]">{report.photos.length}장</span>
            </div>
          </div>
        )}
      </SummarySection>

      {/* Damage summary */}
      <SummarySection title="손상 부위 기록" step="damage" onJump={onJump}>
        {report.damages.length === 0 ? (
          <p className="text-[13px] font-normal text-[var(--bbi-muted-soft)]">발견된 손상이 없습니다</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {report.damages.map((d) => (
              <span
                key={d.id}
                className="rounded-[9999px] border border-[var(--bbi-border)] bg-[var(--bbi-surface-sunken)] px-2.5 py-1 text-[11px] font-semibold text-[var(--bbi-body)]"
              >
                {d.location} | {d.severity}
              </span>
            ))}
          </div>
        )}
      </SummarySection>

      {/* Notes summary */}
      <SummarySection title="특이사항" step="notes" onJump={onJump}>
        <p className="line-clamp-3 whitespace-pre-line text-[13px] font-normal leading-[18px] text-[var(--bbi-body)]">
          {report.notes.trim().length > 0 ? report.notes : "작성된 특이사항이 없습니다"}
        </p>
      </SummarySection>

      {/* Grade summary */}
      <SummarySection title="장비 상태 등급" step="grade" onJump={onJump}>
        {report.grade ? (
          <div className="flex items-center gap-3">
            <GradeBadge grade={report.grade} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-[18px] text-[var(--bbi-ink)]">{GRADE_META[report.grade].desc}</p>
              {report.gradeComment && (
                <p className="mt-0.5 truncate text-[12px] font-normal leading-[16px] text-[var(--bbi-muted)]">
                  {report.gradeComment}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[13px] font-normal text-[var(--bbi-muted-soft)]">등급이 선택되지 않았습니다</p>
        )}
      </SummarySection>
    </div>
  );
}

function SummarySection({
  title,
  step,
  onJump,
  children,
}: {
  title: string;
  step: WizardStep;
  onJump: (step: WizardStep) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold leading-[20px] text-[var(--bbi-ink)]">{title}</h3>
        <button
          type="button"
          onClick={() => onJump(step)}
          className="bbi-btn-press flex items-center gap-1 rounded-[8px] px-2 py-1 text-[12px] font-bold text-[var(--bbi-accent)]"
        >
          <PencilSimple size={13} weight="bold" />
          수정
        </button>
      </div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  const toneStyle = {
    success: "text-[var(--bbi-success)]",
    warning: "text-[var(--bbi-warning)]",
    danger: "text-[var(--bbi-danger)]",
    neutral: "text-[var(--bbi-muted)]",
  }[tone];

  return (
    <div className="rounded-[12px] bg-[var(--bbi-surface-sunken)] py-2.5 text-center">
      <p className={`bbi-tabular text-[17px] font-bold leading-[22px] ${toneStyle}`}>{value}</p>
      <p className="text-[10.5px] font-semibold leading-[14px] text-[var(--bbi-muted)]">{label}</p>
    </div>
  );
}
