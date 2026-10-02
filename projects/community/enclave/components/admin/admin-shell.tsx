"use client";

import { useState } from "react";
import { Buildings, House, List, MagnifyingGlass, SquaresFour, UsersThree, X } from "@phosphor-icons/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/community/enclave/lib/navigation";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  members: UsersThree,
  complexes: Buildings,
};

/**
 * 관리자 백오피스 셸. 사용자 앱과 완전히 분리된 영역이라는 신호로 사이드바를
 * 잉크 블랙(--ec-ink 계열 하드코딩, AssetFlow/Waypoint와 동일한 패턴)으로 반전시킨다.
 * 나머지 토큰은 사용자 앱과 동일한 --ec-* 를 그대로 쓴다.
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
                active ? "bg-[#26301f] font-medium text-white" : "text-[#9aa392] hover:bg-[#1c2417] hover:text-white"
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
    <div className="enclave flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[#12160f] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--ec-accent)] text-white">
            <House size={16} weight="fill" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.02em] text-white">Enclave</p>
            <p className="ec-mono text-[10.5px] uppercase tracking-[0.1em] text-[#8b9384]">Admin Console</p>
          </div>
        </div>
        {nav}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[#242c1d] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#242c1d] text-[12px] font-medium text-white">
            관
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-white">이관리</p>
            <p className="truncate text-[11px] text-[#8b9384]">운영팀 | 슈퍼관리자</p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="ec-enter relative h-full w-[264px] overflow-y-auto bg-[#12160f] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--ec-accent)] text-white">
                  <House size={14} weight="fill" />
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.02em] text-white">Enclave Admin</span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#242c1d] text-white"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--ec-border)] bg-[var(--ec-surface)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ec-border)] text-[var(--ec-body)] lg:hidden"
          >
            <List size={14} />
          </button>
          <p className="text-[13.5px] font-medium text-[var(--ec-ink)]">{ADMIN_NAV.find((item) => item.key === screen)?.label}</p>
          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ec-muted)]" />
            <input
              placeholder="회원, 단지, 게시글 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-border-strong)] focus:bg-[var(--ec-surface)]"
            />
          </div>
          <span className="ec-mono ml-auto shrink-0 text-[12px] text-[var(--ec-muted)] md:ml-0">2025. 06. 13 16:48 KST</span>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
