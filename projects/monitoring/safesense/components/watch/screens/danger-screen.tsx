"use client";

import { useEffect, useState } from "react";
import type { WatchNavigate } from "@/projects/monitoring/safesense/lib/navigation";

const RING_RADIUS = 58;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const COUNTDOWN_SECONDS = 12;

export function WatchDangerScreen({ onNavigate }: { onNavigate: WatchNavigate }) {
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((v) => {
        if (v <= 1) {
          window.clearInterval(timer);
          onNavigate("sos");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [onNavigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
      <p className="ss-mono text-[9.5px] font-bold text-[var(--ss-accent)]">낙상 감지</p>

      <div className="relative mt-3 flex h-[132px] w-[132px] items-center justify-center">
        <svg viewBox="0 0 132 132" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="66" cy="66" r={RING_RADIUS} fill="none" stroke="var(--ss-border)" strokeWidth="4" />
          <circle
            cx="66"
            cy="66"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--ss-accent)"
            strokeWidth="4"
            strokeDasharray={RING_LENGTH}
            className="ss-ring-drain"
            style={{ "--ss-ring-length": `${RING_LENGTH}`, "--ss-ring-duration": `${COUNTDOWN_SECONDS}s` } as React.CSSProperties}
          />
        </svg>
        <p className="ss-mono text-[34px] font-bold text-[var(--ss-foreground)]">{remaining}</p>
      </div>

      <p className="ss-mono mt-2 text-[8.5px] leading-[1.6] text-[var(--ss-muted)]">
        응답이 없으면 자동으로 SOS가 전송됩니다
      </p>

      <div className="mt-3 flex w-full flex-col gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate("sos")}
          className="ss-press ss-focusable rounded-[6px] border border-[var(--ss-accent)] bg-[var(--ss-accent)] py-2 text-[11px] font-bold text-[#0a0a0a]"
        >
          긴급 신고
        </button>
        <button
          type="button"
          onClick={() => onNavigate("status")}
          className="ss-press ss-focusable rounded-[6px] border border-[var(--ss-border-strong)] py-2 text-[10.5px] font-bold text-[var(--ss-foreground)]"
        >
          신고 취소
        </button>
      </div>
    </div>
  );
}
