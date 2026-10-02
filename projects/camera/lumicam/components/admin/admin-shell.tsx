"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/camera/lumicam/lib/navigation";

const NAV_ICON: Record<AdminScreen, { active: string; inactive: string }> = {
  luts: { active: "solar:clapperboard-open-bold", inactive: "solar:clapperboard-open-linear" },
  engine: { active: "solar:tuning-2-bold", inactive: "solar:tuning-2-linear" },
  ops: { active: "solar:pulse-2-bold", inactive: "solar:pulse-2-linear" },
};

/**
 * 관리자 백오피스 셸. 사용자 앱과 완전히 분리된 영역이라는 신호로 사이드바를
 * 잉크 블랙으로 반전시킨다(scaffold의 "관리자 사이드바는 다크" 관례). 토큰은
 * 사용자 앱과 동일한 --lc-*를 그대로 쓴다.
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
              className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-[13px] transition-colors ${
                active ? "bg-[#2c2820] font-medium text-white" : "text-[#a39c8c] hover:bg-[#221f18] hover:text-white"
              }`}
            >
              <Icon icon={active ? NAV_ICON[item.key].active : NAV_ICON[item.key].inactive} width={15} />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const brand = (
    <div className="flex items-center gap-2 px-3 pb-6">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--lc-accent)] text-[13px] font-bold text-white">
        L
      </span>
      <div>
        <p className="text-[13.5px] font-semibold leading-4 tracking-[-0.02em] text-white">LUMI CAM</p>
        <p className="text-[10.5px] uppercase tracking-[0.1em] text-[#8f8878]">Admin Console</p>
      </div>
    </div>
  );

  return (
    <div className="lumicam flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[#18150f] px-3 py-5 lg:flex">
        {brand}
        {nav}
        <div className="mt-8 rounded-[8px] border border-[#2c2820] bg-[#1f1c15] p-4">
          <p className="text-[12px] font-medium text-white">GPU 렌더 상태</p>
          <p className="mt-2 text-[11px] text-[#a39c8c]">렌더 큐 3건, 프레임 드롭률 1.8%</p>
        </div>
        <div className="mt-auto flex items-center gap-2.5 border-t border-[#2c2820] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2c2820] text-[12px] font-medium text-white">
            도윤
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-white">김도윤</p>
            <p className="truncate text-[11px] text-[#8f8878]">엔진팀 | 슈퍼관리자</p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="relative h-full w-[264px] overflow-y-auto bg-[#18150f] px-3 py-5">
            <div className="mb-2 flex items-center justify-between">
              {brand}
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#2c2820] text-white"
              >
                <Icon icon="solar:close-circle-linear" width={13} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--lc-border)] bg-[var(--lc-canvas)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--lc-border)] text-[var(--lc-body)] lg:hidden"
          >
            <Icon icon="solar:hamburger-menu-linear" width={14} />
          </button>
          <p className="text-[13px] font-medium text-[var(--lc-ink)]">{ADMIN_NAV.find((i) => i.key === screen)?.label}</p>
          <div className="relative ml-auto hidden w-[280px] md:block">
            <Icon icon="solar:magnifer-linear" width={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lc-mute)]" />
            <input
              placeholder="LUT, 필름, 로그 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--lc-border)] bg-[var(--lc-surface-soft)] pl-9 pr-3 text-[12.5px] outline-none placeholder:text-[var(--lc-mute)]"
            />
          </div>
          <span className="ml-auto shrink-0 text-[11.5px] tabular-nums text-[var(--lc-mute)] md:ml-0">2022. 07. 09 21:20</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
