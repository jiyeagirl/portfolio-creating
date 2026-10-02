"use client";

import { Check } from "@phosphor-icons/react";
import type { Grade } from "@/projects/b2b/buildbid-inspector/lib/types";
import { GRADE_META } from "@/projects/b2b/buildbid-inspector/components/ui/grade-badge";

const GRADES: Grade[] = ["S", "A", "B", "C"];

export function GradeStep({
  grade,
  gradeComment,
  onSelectGrade,
  onCommentChange,
}: {
  grade: Grade | null;
  gradeComment: string;
  onSelectGrade: (grade: Grade) => void;
  onCommentChange: (value: string) => void;
}) {
  return (
    <div className="px-5 pb-4">
      <p className="px-0.5 text-[15px] font-semibold leading-[22px] text-[var(--bbi-ink)]">
        종합 점검 결과를 바탕으로 등급을 선택하세요
      </p>

      <div className="mt-3 flex flex-col gap-2.5">
        {GRADES.map((g) => {
          const meta = GRADE_META[g];
          const active = grade === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onSelectGrade(g)}
              className={`bbi-btn-press flex items-center gap-3.5 rounded-[18px] border p-3.5 text-left transition-colors duration-150 ${
                active
                  ? "border-[var(--bbi-accent)] bg-[var(--bbi-accent-soft)]"
                  : "border-[var(--bbi-border)] bg-[var(--bbi-surface)]"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[9999px] text-[18px] font-bold ${meta.style}`}
              >
                {meta.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold leading-[20px] text-[var(--bbi-ink)]">{meta.label} 등급</p>
                <p className="text-[12.5px] font-normal leading-[17px] text-[var(--bbi-muted)]">{meta.desc}</p>
              </div>
              {active && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[9999px] bg-[var(--bbi-accent)] text-white">
                  <Check size={14} weight="bold" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <p className="text-[13px] font-bold leading-[18px] text-[var(--bbi-ink)]">등급 산정 사유</p>
        <textarea
          value={gradeComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="예: 유압계통 정상, 외관 스크래치 다수로 B등급 산정"
          rows={4}
          className="mt-2 w-full resize-none rounded-[8px] border border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] px-3.5 py-3 text-[14px] font-normal leading-[20px] text-[var(--bbi-ink)] outline-none placeholder:text-[var(--bbi-muted-soft)] focus:border-[var(--bbi-accent)]"
        />
      </div>
    </div>
  );
}
