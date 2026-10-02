"use client";

import { useState } from "react";
import {
  Buildings,
  Files,
  HardDrives,
  List,
  MagnifyingGlass,
  Sparkle,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import { HQ_NAV, type HqScreen } from "@/projects/platform/studyspot/lib/navigation";

const NAV_ICON: Record<HqScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  branches: Buildings,
  devices: HardDrives,
  content: Files,
  aiContent: Sparkle,
};

/**
 * 본사 관리자 셸. 전 지점을 통제하는 콘솔이라는 신호로 CLAUDE.md 웹 콘솔 베이스라인대로
 * 사이드바를 잉크 반전(다크, --ss-rail-*)으로 둔다 — 점주 콘솔(admin-shell.tsx)의 밝은
 * 표면과 의도적으로 대비시켰다.
 */
export function HqShell({
  screen,
  onNavigate,
  children,
}: {
  screen: HqScreen;
  onNavigate: (next: HqScreen) => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (
    <ul className="space-y-px">
      {HQ_NAV.map((item) => {
        const Icon = NAV_ICON[item.key];
        const active = item.key === screen;
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => {
                onNavigate(item.key);
                setMenuOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-[13.5px] transition-colors ${
                active
                  ? "bg-[var(--ss-rail-active)] font-medium text-[var(--ss-rail-text)]"
                  : "text-[var(--ss-rail-text-mute)] hover:bg-[var(--ss-rail-surface)] hover:text-[var(--ss-rail-text)]"
              }`}
            >
              <Icon size={15} weight={active ? "fill" : "bold"} />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="studyspot flex min-h-dvh">
      {/* 데스크탑 사이드바 */}
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[var(--ss-rail-bg)] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--ss-on-ink)] text-[var(--ss-ink)]">
            <Buildings size={18} weight="fill" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.03em] text-[var(--ss-rail-text)]">StudySpot</p>
            <p className="ss-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ss-rail-text-mute)]">HQ Console</p>
          </div>
        </div>
        {nav}
        <div className="mt-8 rounded-[8px] border border-[var(--ss-rail-border)] bg-[var(--ss-rail-surface)] p-4">
          <p className="text-[12.5px] font-medium text-[var(--ss-rail-text)]">전국 지점</p>
          <p className="mt-1 text-[12px] text-[var(--ss-rail-text-mute)]">5개 지점 | 4개 운영 중</p>
        </div>
        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--ss-rail-border)] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ss-rail-active)] text-[12px] font-medium text-[var(--ss-rail-text)]">
            오
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-[var(--ss-rail-text)]">오세훈</p>
            <p className="truncate text-[11px] text-[var(--ss-rail-text-mute)]">운영본부 | 슈퍼관리자</p>
          </div>
        </div>
      </aside>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[rgba(17,17,17,0.5)]"
          />
          <div className="ss-enter relative h-full w-[264px] overflow-y-auto bg-[var(--ss-rail-bg)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--ss-on-ink)] text-[var(--ss-ink)]">
                  <Buildings size={16} weight="fill" />
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--ss-rail-text)]">StudySpot HQ</span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-rail-border)] text-[var(--ss-rail-text)]"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--ss-hairline)] bg-[var(--ss-canvas)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-hairline)] text-[var(--ss-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--ss-ink)]">
            {HQ_NAV.find((item) => item.key === screen)?.label}
          </p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ss-mute)]" />
            <input
              placeholder="지점, 장비, 콘텐츠 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--ss-mute)] focus:border-[var(--ss-ink)] focus:bg-[var(--ss-canvas)]"
            />
          </div>

          <span className="ss-mono ml-auto shrink-0 text-[12px] text-[var(--ss-mute)] md:ml-0">2025. 06. 15 14:20</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
