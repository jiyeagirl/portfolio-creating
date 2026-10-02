"use client";

import { useState } from "react";
import { Buildings, Files, HardDrives, List, MagnifyingGlass, SlidersHorizontal, SquaresFour, X } from "@phosphor-icons/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/platform/studyspot/lib/navigation";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  content: Files,
  devices: HardDrives,
  automation: SlidersHorizontal,
};

/**
 * 점주 관리자 셸. 단일 지점을 운영하는 소규모 콘솔이라 CLAUDE.md 웹 콘솔 베이스라인의
 * 다크 레일 대신 밝은 표면(--ss-canvas-soft) + 헤어라인 구분을 쓴다 — 본사(hq-shell.tsx)의
 * 잉크 반전 다크 레일과 대비시켜 "전사 통제 콘솔이 아니다"는 신호를 준다.
 */
export function AdminShell({
  screen,
  onNavigate,
  children,
}: {
  screen: AdminScreen;
  onNavigate: (next: AdminScreen) => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (
    <ul className="space-y-px">
      {ADMIN_NAV.map((item) => {
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
                  ? "bg-[var(--ss-ink)] font-medium text-[var(--ss-on-ink)]"
                  : "text-[var(--ss-body)] hover:bg-[var(--ss-surface)]"
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
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto border-r border-[var(--ss-hairline)] bg-[var(--ss-canvas-soft)] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]">
            <Buildings size={18} weight="fill" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.03em] text-[var(--ss-ink)]">StudySpot</p>
            <p className="ss-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ss-mute)]">Owner Console</p>
          </div>
        </div>
        {nav}
        <div className="mt-8 rounded-[8px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)] p-4">
          <p className="text-[12.5px] font-medium text-[var(--ss-ink)]">StudySpot 강남 본점</p>
          <p className="mt-1 text-[12px] text-[var(--ss-mute)]">서울 강남구 테헤란로 123</p>
        </div>
        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--ss-hairline)] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ss-surface)] text-[12px] font-medium text-[var(--ss-ink)]">
            김
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-[var(--ss-ink)]">김도현</p>
            <p className="truncate text-[11px] text-[var(--ss-mute)]">점주 계정</p>
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
            className="absolute inset-0 bg-[rgba(17,17,17,0.4)]"
          />
          <div className="ss-enter relative h-full w-[264px] overflow-y-auto bg-[var(--ss-canvas)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]">
                  <Buildings size={16} weight="fill" />
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--ss-ink)]">StudySpot Owner</span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-hairline)] text-[var(--ss-ink)]"
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
            {ADMIN_NAV.find((item) => item.key === screen)?.label}
          </p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ss-mute)]" />
            <input
              placeholder="콘텐츠, 장비, 좌석 검색"
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
