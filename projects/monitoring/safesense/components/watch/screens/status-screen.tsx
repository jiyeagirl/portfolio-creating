"use client";

import { Broadcast } from "@phosphor-icons/react";
import { currentWorker } from "@/projects/monitoring/safesense/lib/mock-data";
import type { WatchNavigate } from "@/projects/monitoring/safesense/lib/navigation";

export function WatchStatusScreen({ onNavigate }: { onNavigate: WatchNavigate }) {
  const safe = currentWorker.status === "safe";
  const color = safe ? "var(--ss-safe)" : "var(--ss-accent)";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
      <p className="ss-mono text-[9px] text-[var(--ss-muted)]">09:41</p>

      <span className="relative mt-3 flex h-3.5 w-3.5 items-center justify-center">
        <span className="ss-blink absolute h-3.5 w-3.5 rounded-full" style={{ background: color }} />
      </span>
      <p className="ss-display mt-2 text-[17px]" style={{ color }}>
        {safe ? "안전" : "위험"}
      </p>
      <p className="ss-mono mt-1 text-[8.5px] text-[var(--ss-muted)]">
        마지막 신호 {currentWorker.lastSignalMinAgo}분 전
      </p>

      <div className="mt-4 flex w-full items-center justify-between border-t border-[var(--ss-border)] pt-3">
        <div className="text-left">
          <p className="ss-mono text-[8px] text-[var(--ss-muted)]">작업 시간</p>
          <p className="ss-mono text-[12px] text-[var(--ss-foreground)]">4:12</p>
        </div>
        <div className="text-right">
          <p className="ss-mono text-[8px] text-[var(--ss-muted)]">배터리</p>
          <p className="ss-mono text-[12px] text-[var(--ss-foreground)]">{currentWorker.battery}%</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("work-info")}
        className="ss-mono ss-press mt-3 flex items-center gap-1.5 rounded-full border border-[var(--ss-border-strong)] px-2.5 py-1.5 text-[8.5px] text-[var(--ss-muted)]"
      >
        <Broadcast size={11} weight="bold" />
        센서 연결됨
      </button>

      <button
        type="button"
        onClick={() => onNavigate("sos")}
        className="ss-press ss-focusable mt-3 flex w-full items-center justify-center rounded-[6px] border border-[var(--ss-accent)] bg-[var(--ss-accent)] py-2.5 text-[12px] font-bold text-[#0a0a0a]"
      >
        SOS
      </button>
    </div>
  );
}
