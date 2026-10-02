"use client";

import { CheckCircle, MapPin, Waveform } from "@phosphor-icons/react";
import type { WatchNavigate } from "@/projects/monitoring/safesense/lib/navigation";

export function WatchSosScreen({ onNavigate }: { onNavigate: WatchNavigate }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
      <span className="ss-blink flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 border-[var(--ss-accent)]">
        <Waveform size={26} weight="bold" className="text-[var(--ss-accent)]" />
      </span>
      <p className="ss-mono mt-3 text-[13px] font-bold text-[var(--ss-accent)]">SOS 전송됨</p>

      <div className="ss-mono mt-3 flex w-full items-center justify-between border-t border-[var(--ss-border)] pt-2.5 text-[8.5px] text-[var(--ss-muted)]">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          위치 전송
        </span>
        <span className="flex items-center gap-1 text-[var(--ss-safe)]">
          <CheckCircle size={11} weight="fill" />
          완료
        </span>
      </div>
      <div className="ss-mono mt-1.5 flex w-full items-center justify-between text-[8.5px] text-[var(--ss-muted)]">
        <span>관리자 통보</span>
        <span className="text-[var(--ss-safe)]">완료</span>
      </div>
      <div className="ss-mono mt-1.5 flex w-full items-center justify-between text-[8.5px] text-[var(--ss-muted)]">
        <span>진동 / 경고음</span>
        <span className="text-[var(--ss-accent)]">작동 중</span>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("status")}
        className="ss-press ss-focusable mt-4 w-full rounded-[6px] border border-[var(--ss-border-strong)] py-2 text-[10.5px] font-bold text-[var(--ss-foreground)]"
      >
        상태로 돌아가기
      </button>
    </div>
  );
}
