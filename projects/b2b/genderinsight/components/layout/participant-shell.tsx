"use client";

import { Mark } from "@/projects/b2b/genderinsight/components/layout/mark";

/**
 * 참여자 콘솔 셸. 사이드바 없이 가벼운 상단 헤더 + 좁은 본문 폭만 둔다 —
 * spec의 "최소한의 단계로 단순화" 지시를 레이아웃으로 표현한다.
 */
export function ParticipantShell({
  children,
  progress,
}: {
  children: React.ReactNode;
  progress?: number;
}) {
  return (
    <div className="genderinsight relative min-h-dvh bg-[var(--gi-canvas)]">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--gi-hairline)] bg-[var(--gi-canvas)] px-5">
        <Mark size={20} />
        <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--gi-ink)]">
          GenderInsight
        </span>
        {progress !== undefined && (
          <span className="gi-mono ml-auto text-[12px] text-[var(--gi-mute)]">{progress}%</span>
        )}
      </header>
      {progress !== undefined && (
        <div className="h-[3px] w-full bg-[var(--gi-soft-2)]">
          <div
            className="h-full bg-[var(--gi-accent)] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <main className="mx-auto max-w-[640px] px-5 py-10 sm:py-14">{children}</main>
    </div>
  );
}
