"use client";

import { useState } from "react";
import { Gavel, Handshake, List, MagnifyingGlass, ShieldWarning, SquaresFour, X } from "@phosphor-icons/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/b2b/buildbid/lib/navigation";
import { adminStats } from "@/projects/b2b/buildbid/lib/mock-data";
import { Mark } from "@/projects/b2b/buildbid/components/layout/mark";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  approvals: ShieldWarning,
  bidding: Gavel,
  trades: Handshake,
};

/**
 * 관리자 백오피스 셸. 판매자/바이어 콘솔과 완전히 분리된 영역이라는 신호로
 * 사이드바를 apple_compact의 surface-black으로 반전시킨다. 토큰은 판매자/바이어
 * 콘솔과 동일한 --bb-* 를 그대로 쓴다. 역할 전환 UI는 여기에 없다(관리자는
 * role 개념 밖의 완전히 별도 앱).
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
              className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-left text-[13.5px] transition-colors ${
                active ? "bg-[#2a2a2a] font-semibold text-white" : "text-[#a1a1a1] hover:bg-[#212121] hover:text-white"
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

  const sideFoot = (
    <div className="mt-8 rounded-[18px] border border-[#2a2a2a] bg-[#151515] p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white">
        <ShieldWarning size={13} weight="bold" />
        조치 필요
      </p>
      <ul className="mt-2.5 space-y-1.5">
        {[
          { label: "등록 승인 대기", count: adminStats.pendingApprovals },
          { label: "검수원 배정 대기", count: adminStats.pendingInspectorAssign },
          { label: "분쟁 처리", count: adminStats.openDisputes },
        ].map((item) => (
          <li key={item.label} className="flex items-center justify-between text-[12px]">
            <span className="text-[#a1a1a1]">{item.label}</span>
            <span className="bb-mono font-semibold text-white">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="buildbid flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[#0b0b0c] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <Mark size={22} tone="light" />
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.03em] text-white">BuildBid</p>
            <p className="bb-mono text-[10.5px] uppercase tracking-[0.1em] text-[#888888]">Admin Console</p>
          </div>
        </div>
        {nav}
        {sideFoot}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[#2a2a2a] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a] text-[12px] font-semibold text-white">규</span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-white">김규리</p>
            <p className="truncate text-[11px] text-[#888888]">운영팀 | 슈퍼관리자</p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="bb-enter relative h-full w-[264px] overflow-y-auto bg-[#0b0b0c] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <Mark size={20} tone="light" />
                <span className="text-[14px] font-semibold tracking-[-0.03em] text-white">BuildBid Admin</span>
              </span>
              <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a2a] text-white">
                <X size={13} />
              </button>
            </div>
            {nav}
            {sideFoot}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--bb-hairline)] bg-[var(--bb-canvas)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-semibold text-[var(--bb-ink)]">{ADMIN_NAV.find((item) => item.key === screen)?.label}</p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--bb-mute)]" />
            <input
              placeholder="회원, 장비, 거래 번호 검색"
              className="h-8 w-full rounded-full border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] pl-10 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--bb-mute)] focus:border-[var(--bb-primary-focus)] focus:bg-[var(--bb-canvas)]"
            />
          </div>

          <span className="bb-mono ml-auto shrink-0 text-[12px] text-[var(--bb-mute)] md:ml-0">2024. 07. 28 11:07 KST</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
