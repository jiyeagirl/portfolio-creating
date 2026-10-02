"use client";

import { useState } from "react";
import {
  Bell,
  HardDrives,
  List,
  MagnifyingGlass,
  PawPrint,
  SquaresFour,
  Users,
  X,
} from "@phosphor-icons/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/monitoring/petlive/lib/navigation";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  members: Users,
  devices: HardDrives,
  logs: Bell,
};

/**
 * 관리자 백오피스 셸. 사용자 앱과 완전히 분리된 영역이라는 신호로
 * 사이드바를 잉크 반전(다크, --pl-rail-*)으로 둔다. 토큰은 사용자 앱과 동일한
 * --pl-* 를 그대로 쓴다.
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
                  ? "bg-[var(--pl-rail-active)] font-medium text-[var(--pl-rail-text)]"
                  : "text-[var(--pl-rail-text-mute)] hover:bg-[var(--pl-rail-surface)] hover:text-[var(--pl-rail-text)]"
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
    <div className="petlive flex min-h-dvh">
      {/* 데스크탑 사이드바 */}
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[var(--pl-rail-bg)] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--pl-accent)] text-[var(--pl-on-accent)]">
            <PawPrint size={18} weight="fill" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.03em] text-[var(--pl-rail-text)]">
              PetLive
            </p>
            <p className="pl-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--pl-rail-text-mute)]">
              Admin Console
            </p>
          </div>
        </div>
        {nav}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--pl-rail-border)] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pl-rail-active)] text-[12px] font-medium text-[var(--pl-rail-text)]">
            윤하
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-[var(--pl-rail-text)]">정윤하</p>
            <p className="truncate text-[11px] text-[var(--pl-rail-text-mute)]">디바이스운영팀 | 관제 담당</p>
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
            className="absolute inset-0 bg-[rgba(32,26,20,0.5)]"
          />
          <div className="pl-enter relative h-full w-[264px] overflow-y-auto bg-[var(--pl-rail-bg)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--pl-accent)] text-[var(--pl-on-accent)]">
                  <PawPrint size={16} weight="fill" />
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--pl-rail-text)]">
                  PetLive Admin
                </span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--pl-rail-border)] text-[var(--pl-rail-text)]"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--pl-hairline)] bg-[var(--pl-canvas)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--pl-hairline)] text-[var(--pl-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--pl-ink)]">
            {ADMIN_NAV.find((item) => item.key === screen)?.label}
          </p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pl-mute)]"
            />
            <input
              placeholder="회원, 디바이스, 시리얼 번호 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--pl-hairline)] bg-[var(--pl-canvas-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--pl-mute)] focus:border-[var(--pl-accent)] focus:bg-[var(--pl-canvas)]"
            />
          </div>

          <span className="pl-mono ml-auto shrink-0 text-[12px] text-[var(--pl-mute)] md:ml-0">
            2026. 02. 28 18:00 KST
          </span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
