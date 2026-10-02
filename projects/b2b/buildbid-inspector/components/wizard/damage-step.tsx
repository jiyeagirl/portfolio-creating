"use client";

import { useState } from "react";
import { MapPinLine, Plus, Warning, TrashSimple } from "@phosphor-icons/react";
import type { DamageRecord, DamageSeverity } from "@/projects/b2b/buildbid-inspector/lib/types";

const SEVERITIES: DamageSeverity[] = ["경미", "중간", "심각"];
const QUICK_LOCATIONS = ["붐 실린더", "버킷", "하부롤러", "캐빈 내부", "타이어/트랙", "적재함", "미러/유리"];

const SEVERITY_STYLE: Record<DamageSeverity, string> = {
  경미: "bg-[var(--bbi-warning-soft)] text-[var(--bbi-warning)]",
  중간: "bg-[var(--bbi-accent-soft)] text-[var(--bbi-accent)]",
  심각: "bg-[var(--bbi-danger-soft)] text-[var(--bbi-danger)]",
};

export function DamageStep({
  damages,
  onAdd,
  onRemove,
}: {
  damages: DamageRecord[];
  onAdd: (record: Omit<DamageRecord, "id">) => void;
  onRemove: (id: string) => void;
}) {
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState<DamageSeverity>("경미");
  const [memo, setMemo] = useState("");

  function submit() {
    if (!location.trim()) return;
    onAdd({ location: location.trim(), severity, memo: memo.trim() });
    setLocation("");
    setSeverity("경미");
    setMemo("");
  }

  return (
    <div className="px-5 pb-4">
      <div className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9999px] bg-[var(--bbi-danger-soft)]">
            <Warning size={18} weight="bold" className="text-[var(--bbi-danger)]" />
          </div>
          <p className="text-[15px] font-semibold leading-[22px] text-[var(--bbi-ink)]">
            손상 부위를 기록하세요
          </p>
        </div>

        <p className="mt-3 text-[12px] font-bold leading-[16px] text-[var(--bbi-muted)]">부위</p>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="예: 붐 실린더 좌측"
          className="mt-1.5 h-11 w-full rounded-[8px] border border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] px-3 text-[14px] font-normal text-[var(--bbi-ink)] outline-none placeholder:text-[var(--bbi-muted-soft)] focus:border-[var(--bbi-accent)]"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              className="bbi-btn-press rounded-[9999px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--bbi-muted)]"
            >
              {loc}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[12px] font-bold leading-[16px] text-[var(--bbi-muted)]">심각도</p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              className={`bbi-btn-press flex h-9 items-center justify-center rounded-[9999px] border text-[13px] font-bold transition-colors duration-150 ${
                severity === s
                  ? `border-transparent ${SEVERITY_STYLE[s]}`
                  : "border-[var(--bbi-border)] bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[12px] font-bold leading-[16px] text-[var(--bbi-muted)]">메모</p>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="손상 상태를 구체적으로 적어주세요"
          rows={2}
          className="mt-1.5 w-full resize-none rounded-[8px] border border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] px-3 py-2.5 text-[14px] font-normal leading-[20px] text-[var(--bbi-ink)] outline-none placeholder:text-[var(--bbi-muted-soft)] focus:border-[var(--bbi-accent)]"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!location.trim()}
          className={`bbi-btn-press mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-[9999px] text-[13px] font-bold ${
            location.trim()
              ? "bg-[var(--bbi-ink)] text-white"
              : "bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted-soft)]"
          }`}
        >
          <Plus size={15} weight="bold" />
          손상 기록 추가
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-2 px-0.5 text-[13px] font-bold leading-[18px] text-[var(--bbi-muted)]">
          기록된 손상 ({damages.length})
        </p>
        {damages.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] px-4 py-6 text-center">
            <p className="text-[13px] font-semibold text-[var(--bbi-muted)]">발견된 손상이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {damages.map((d) => (
              <div
                key={d.id}
                className="flex items-start gap-3 rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-3.5"
              >
                <MapPinLine size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--bbi-muted)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] font-semibold leading-[20px] text-[var(--bbi-ink)]">
                      {d.location}
                    </p>
                    <span
                      className={`shrink-0 rounded-[9999px] px-2 py-0.5 text-[10px] font-bold ${SEVERITY_STYLE[d.severity]}`}
                    >
                      {d.severity}
                    </span>
                  </div>
                  {d.memo && (
                    <p className="mt-0.5 text-[12px] font-normal leading-[16px] text-[var(--bbi-muted)]">{d.memo}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(d.id)}
                  aria-label="삭제"
                  className="bbi-btn-press flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[var(--bbi-muted-soft)] hover:bg-[var(--bbi-surface-sunken)]"
                >
                  <TrashSimple size={15} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
