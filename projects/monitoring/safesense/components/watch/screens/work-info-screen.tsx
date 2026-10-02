"use client";

import { CaretLeft } from "@phosphor-icons/react";
import type { WatchNavigate } from "@/projects/monitoring/safesense/lib/navigation";

const ROWS = [
  { label: "작업 시간", value: "4:12" },
  { label: "이동 거리", value: "2.8 KM" },
  { label: "걸음 수", value: "5,214" },
  { label: "마지막 동기화", value: "방금 전" },
];

export function WatchWorkInfoScreen({ onNavigate }: { onNavigate: WatchNavigate }) {
  return (
    <div className="flex h-full w-full flex-col px-4 pt-4">
      <button
        type="button"
        onClick={() => onNavigate("status")}
        aria-label="뒤로"
        className="ss-focusable -ml-1 flex h-6 w-6 items-center justify-center text-[var(--ss-muted)]"
      >
        <CaretLeft size={14} weight="bold" />
      </button>
      <p className="ss-mono mt-1 text-[10px] font-bold text-[var(--ss-foreground)]">작업 정보</p>

      <div className="mt-3 flex-1 space-y-2.5">
        {ROWS.map((row) => (
          <div key={row.label} className="border-b border-[var(--ss-border)] pb-2">
            <p className="ss-mono text-[7.5px] text-[var(--ss-muted)]">{row.label}</p>
            <p className="ss-mono mt-0.5 text-[13px] text-[var(--ss-foreground)]">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
