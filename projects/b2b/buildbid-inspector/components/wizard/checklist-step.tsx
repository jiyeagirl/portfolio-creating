"use client";

import { CHECKLIST_CATEGORIES } from "@/projects/b2b/buildbid-inspector/lib/mock-data";
import type { ChecklistItem, ChecklistResult } from "@/projects/b2b/buildbid-inspector/lib/types";

const RESULT_OPTIONS: Exclude<ChecklistResult, null>[] = ["정상", "주의", "불량"];

const RESULT_STYLE: Record<Exclude<ChecklistResult, null>, string> = {
  정상: "bg-[var(--bbi-success)] text-white border-[var(--bbi-success)]",
  주의: "bg-[var(--bbi-warning)] text-white border-[var(--bbi-warning)]",
  불량: "bg-[var(--bbi-danger)] text-white border-[var(--bbi-danger)]",
};

export function ChecklistStep({
  checklist,
  onUpdate,
}: {
  checklist: ChecklistItem[];
  onUpdate: (id: string, patch: Partial<ChecklistItem>) => void;
}) {
  const completed = checklist.filter((c) => c.result !== null).length;

  return (
    <div className="px-5 pb-4">
      <div className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold leading-[22px] text-[var(--bbi-ink)]">
            항목별 점검 결과를 선택하세요
          </p>
          <span className="bbi-tabular text-[13px] font-bold text-[var(--bbi-accent)]">
            {completed}/{checklist.length}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-[9999px] bg-[var(--bbi-surface-sunken)]">
          <div
            className="h-full rounded-[9999px] bg-[var(--bbi-accent)] transition-[width] duration-300 ease-out"
            style={{ width: `${(completed / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-5">
        {CHECKLIST_CATEGORIES.map((category) => {
          const items = checklist.filter((c) => c.category === category);
          const catDone = items.filter((c) => c.result !== null).length;
          return (
            <div key={category}>
              <div className="mb-2 flex items-center justify-between px-0.5">
                <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bbi-ink)]">{category}</h3>
                <span className="bbi-tabular text-[11px] font-bold text-[var(--bbi-muted)]">
                  {catDone}/{items.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-3.5"
                  >
                    <p className="text-[14px] font-semibold leading-[20px] text-[var(--bbi-ink)]">{item.label}</p>
                    <div className="mt-2.5 grid grid-cols-3 gap-2">
                      {RESULT_OPTIONS.map((opt) => {
                        const active = item.result === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => onUpdate(item.id, { result: opt })}
                            className={`bbi-btn-press flex h-9 items-center justify-center rounded-[9999px] border text-[13px] font-bold transition-colors duration-150 ${
                              active
                                ? RESULT_STYLE[opt]
                                : "border-[var(--bbi-border)] bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted)]"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {(item.result === "주의" || item.result === "불량") && (
                      <input
                        value={item.memo}
                        onChange={(e) => onUpdate(item.id, { memo: e.target.value })}
                        placeholder="증상을 간단히 메모하세요"
                        className="mt-2.5 h-10 w-full rounded-[8px] border border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] px-3 text-[13px] font-normal text-[var(--bbi-ink)] outline-none placeholder:text-[var(--bbi-muted-soft)] focus:border-[var(--bbi-accent)]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
