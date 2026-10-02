"use client";

/* 운영 콘솔 셸 — F자형. 다크 레일이 전체 높이를 차지하고 헤더는 본문 쪽에만 붙는다.
   사용자 앱과 완전히 분리된 영역이라는 신호로 사이드바만 잉크를 반전시킨다.
   토큰은 사용자 앱과 같은 --cp-* 를 그대로 상속한다. */

import { useState } from "react";
import {
  ArrowsClockwise,
  Bell,
  Database,
  Flag,
  List,
  MagnifyingGlass,
  SignOut,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Emblem } from "@/projects/youngin/real/components/emblem";
import { ADMIN_NAV, type AdminScreen } from "@/projects/youngin/real/lib/navigation";
import { ADMIN_SUMMARY, REPORT_COUNTS } from "@/projects/youngin/real/lib/mock-data";

const NAV_ICON: Record<AdminScreen, Icon> = {
  dashboard: SquaresFour,
  data: Database,
  reports: Flag,
};

export function AdminShell({
  screen,
  onNavigate,
  onSignOut,
  children,
}: {
  screen: AdminScreen;
  onNavigate: (next: AdminScreen) => void;
  onSignOut: () => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = REPORT_COUNTS.filter((r) => r.status === "접수" || r.status === "검토").reduce(
    (sum, r) => sum + r.count,
    0,
  );

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
              className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2.5 text-left text-[13.5px] transition-colors ${
                active
                  ? "bg-[var(--cp-rail-raised)] font-medium text-[var(--cp-rail-ink)]"
                  : "text-[var(--cp-rail-mute)] hover:bg-[var(--cp-rail-raised)] hover:text-[var(--cp-rail-ink)]"
              }`}
            >
              <Icon size={16} weight={active ? "fill" : "bold"} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.key === "reports" && pending > 0 && (
                <span className="cp-num shrink-0 rounded-full bg-[var(--cp-danger)] px-1.5 py-[1px] text-[11px] font-bold text-white">
                  {pending}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const railFoot = (
    <div className="mt-8 rounded-[8px] border border-[var(--cp-rail-line)] bg-[var(--cp-rail-raised)] p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--cp-rail-ink)]">
        <ArrowsClockwise size={13} weight="bold" />
        데이터 동기화
      </p>
      <ul className="mt-2.5 space-y-1.5">
        {[
          { label: "공공데이터 기준일", value: ADMIN_SUMMARY.baseDate },
          { label: "마지막 대조", value: ADMIN_SUMMARY.syncedAt },
          { label: "검수 대기", value: `${pending}건` },
        ].map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-2 text-[12px]">
            <span className="shrink-0 text-[var(--cp-rail-mute)]">{item.label}</span>
            <span className="cp-num min-w-0 truncate text-right font-medium text-[var(--cp-rail-ink)]">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="civicpin flex min-h-dvh bg-[var(--cp-canvas)]">
      {/* 데스크탑 레일 */}
      <aside className="sticky top-0 hidden h-dvh w-[244px] shrink-0 flex-col overflow-y-auto bg-[var(--cp-rail)] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <Emblem size={24} tone="light" />
          <div className="min-w-0">
            <p className="text-[14px] font-bold leading-4 tracking-[-0.03em] text-[var(--cp-rail-ink)]">
              CIVICPIN
            </p>
            <p className="cp-num text-[10.5px] uppercase tracking-[0.1em] text-[var(--cp-rail-mute)]">
              Operator Console
            </p>
          </div>
        </div>
        {nav}
        {railFoot}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--cp-rail-line)] px-3 pt-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cp-rail-raised)] text-[12px] font-medium text-[var(--cp-rail-ink)]">
            하윤
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium text-[var(--cp-rail-ink)]">정하윤</p>
            <p className="truncate text-[11px] text-[var(--cp-rail-mute)]">운영팀 | 데이터 관리자</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="로그아웃"
            className="shrink-0 rounded-[6px] p-1.5 text-[var(--cp-rail-mute)] transition-colors hover:bg-[var(--cp-rail-raised)] hover:text-[var(--cp-rail-ink)]"
          >
            <SignOut size={14} weight="bold" />
          </button>
        </div>
      </aside>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[rgba(20,24,30,0.5)]"
          />
          <div className="cp-enter relative h-full w-[264px] overflow-y-auto bg-[var(--cp-rail)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <Emblem size={20} tone="light" />
                <span className="text-[14px] font-bold tracking-[-0.03em] text-[var(--cp-rail-ink)]">
                  CIVICPIN 콘솔
                </span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--cp-rail-line)] text-[var(--cp-rail-ink)]"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
            {railFoot}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--cp-hairline)] text-[var(--cp-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--cp-ink)]">
            {ADMIN_NAV.find((item) => item.key === screen)?.label}
          </p>

          <div className="relative ml-auto hidden w-[300px] md:block">
            <MagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cp-mute)]"
            />
            <input
              placeholder="시설명, 매장명, 신고번호 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--cp-faint)] focus:border-[var(--cp-accent)] focus:bg-[var(--cp-surface)]"
            />
          </div>

          <button
            type="button"
            aria-label="알림"
            className="relative ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--cp-hairline)] text-[var(--cp-body)] transition-colors hover:bg-[var(--cp-soft)] md:ml-0"
          >
            <Bell size={14} weight="bold" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--cp-danger)] px-1 text-[10px] font-bold text-white">
              {pending}
            </span>
          </button>

          <span className="cp-num hidden shrink-0 text-[12px] text-[var(--cp-mute)] sm:block">
            2026. 06. 12 09:41 KST
          </span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
