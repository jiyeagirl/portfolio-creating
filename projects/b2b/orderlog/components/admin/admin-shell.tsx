"use client";

import { SignOut } from "@phosphor-icons/react";
import { InitialAvatar } from "@/projects/b2b/orderlog/components/ui";
import { Mark } from "@/projects/b2b/orderlog/components/layout/mark";

const OPERATOR = { name: "강태민", title: "마스터 관리자" };

export function AdminShell({ onLogout, children }: { onLogout: () => void; children: React.ReactNode }) {
  return (
    <div className="orderlog min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--ot-nav-border)] bg-[var(--ot-nav-bg)]">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 lg:px-8">
          <Mark size={22} inverted />
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--ot-nav-fg)]">
            OrderLog
          </span>
          <span className="rounded-full bg-[var(--ot-nav-surface)] px-2.5 py-[3px] text-[12px] font-medium text-[var(--ot-nav-mute)]">
            관리자 콘솔
          </span>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-right leading-tight sm:block">
              <span className="block text-[13px] font-medium text-[var(--ot-nav-fg)]">{OPERATOR.name}</span>
              <span className="block text-[11px] text-[var(--ot-nav-mute)]">{OPERATOR.title}</span>
            </span>
            <InitialAvatar name={OPERATOR.name} size={30} tone="accent" />
            <button
              type="button"
              onClick={onLogout}
              aria-label="로그아웃"
              className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--ot-nav-border)] text-[var(--ot-nav-mute)] transition-colors hover:bg-[var(--ot-nav-surface)] hover:text-[var(--ot-nav-fg)]"
            >
              <SignOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
