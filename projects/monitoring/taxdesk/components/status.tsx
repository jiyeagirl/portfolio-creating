import type { ReactNode } from "react";
import type { JobMode, Tone } from "@/projects/monitoring/taxdesk/lib/status";

/* 사용자 웹과 관리자 웹이 같이 쓰는 상태 칩과 모드 배지. 고정 폭, 가운데 정렬, 라벨 5자 이내. */

const TONE_CLASS: Record<Tone, string> = {
  wait: "bg-[var(--td-wait-bg)] text-[var(--td-wait-fg)]",
  run: "bg-[var(--td-run-bg)] text-[var(--td-run-fg)]",
  act: "bg-[var(--td-act-bg)] text-[var(--td-act-fg)]",
  done: "bg-[var(--td-done-bg)] text-[var(--td-done-fg)]",
  stop: "bg-[var(--td-stop-bg)] text-[var(--td-stop-fg)]",
};

export const TONE_DOT: Record<Tone, string> = {
  wait: "bg-[var(--td-wait-fg)]",
  run: "bg-[var(--td-run-fg)]",
  act: "bg-[var(--td-act-fg)]",
  done: "bg-[var(--td-done-fg)]",
  stop: "bg-[var(--td-stop-fg)]",
};

export function StatusChip({
  tone,
  children,
  compact = false,
}: {
  tone: Tone;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full text-center font-semibold ${TONE_CLASS[tone]} ${
        compact ? "h-[22px] w-[64px] text-[11.5px]" : "h-6 w-[72px] text-[12px]"
      }`}
    >
      {children}
    </span>
  );
}

export function ModeBadge({ mode, compact = false }: { mode: JobMode; compact?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border text-center font-semibold ${
        mode === "자동" ? "border-[var(--td-blue)] text-[var(--td-blue)]" : "border-[var(--td-ink-2)] text-[var(--td-ink-2)]"
      } ${compact ? "h-[22px] w-[40px] text-[11.5px]" : "h-6 w-[44px] text-[12px]"}`}
    >
      {mode}
    </span>
  );
}
