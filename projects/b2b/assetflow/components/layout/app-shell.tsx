"use client";

import { useState } from "react";
import {
  Bell,
  ChartLineUp,
  Buildings,
  CaretDown,
  ClipboardText,
  FileMagnifyingGlass,
  Gavel,
  Handshake,
  List,
  MagnifyingGlass,
  Plus,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import { Badge, Button } from "@/projects/b2b/assetflow/components/ui";
import { notices } from "@/projects/b2b/assetflow/lib/mock-data";
import { company } from "@/projects/b2b/assetflow/lib/mock-data";
import { SELLER_NAV, type Navigate, type SellerScreen } from "@/projects/b2b/assetflow/lib/navigation";
import { Mark } from "@/projects/b2b/assetflow/components/layout/mark";

const NAV_ICON: Record<SellerScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  register: Plus,
  assetDetail: ClipboardText,
  bidding: Gavel,
  inspection: FileMagnifyingGlass,
  deals: Handshake,
  reports: ChartLineUp,
  account: Buildings,
};

const GROUPS = ["현황", "자산", "거래", "분석", "설정"];

export function AppShell({
  screen,
  onNavigate,
  children,
}: {
  screen: SellerScreen;
  onNavigate: Navigate;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const unread = notices.filter((n) => n.unread).length;

  const nav = (
    <nav className="flex flex-col gap-6">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="af-mono px-3 text-[11px] uppercase tracking-[0.08em] text-[var(--af-mute)]">
            {group}
          </p>
          <ul className="mt-2 space-y-px">
            {SELLER_NAV.filter((item) => item.group === group).map((item) => {
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
                        ? "bg-[var(--af-soft-2)] font-medium text-[var(--af-ink)]"
                        : "text-[var(--af-body)] hover:bg-[var(--af-soft)] hover:text-[var(--af-ink)]"
                    }`}
                  >
                    <Icon size={15} weight={active ? "fill" : "bold"} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="assetflow min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--af-hairline)] bg-[var(--af-canvas)]">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] text-[var(--af-body)] lg:hidden"
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2"
          >
            <Mark size={22} />
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--af-ink)]">
              AssetFlow
            </span>
          </button>

          <span className="hidden h-4 w-px bg-[var(--af-hairline)] sm:block" />
          <button
            type="button"
            onClick={() => onNavigate("account")}
            className="hidden items-center gap-1.5 rounded-[6px] px-2 py-1 text-[13px] text-[var(--af-body)] transition-colors hover:bg-[var(--af-soft)] sm:flex"
          >
            {company.name}
            <Badge tone="neutral">{company.tier}</Badge>
            <CaretDown size={11} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden w-[240px] xl:block">
              <MagnifyingGlass
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--af-mute)]"
              />
              <input
                placeholder="자산 코드, 모델명 검색"
                className="h-9 w-full rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--af-mute)] focus:border-[var(--af-hairline-strong)] focus:bg-[var(--af-canvas)]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={`알림 ${unread}건`}
                onClick={() => setNoticeOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] text-[var(--af-body)] transition-colors hover:bg-[var(--af-soft)]"
              >
                <Bell size={15} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--af-error)] px-1 af-mono text-[10px] font-medium text-white">
                    {unread}
                  </span>
                )}
              </button>

              {noticeOpen && (
                <>
                  <button
                    type="button"
                    aria-label="알림 닫기"
                    onClick={() => setNoticeOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="af-enter absolute right-0 top-11 z-50 w-[340px] overflow-hidden rounded-[8px] border border-[var(--af-hairline)] bg-[var(--af-canvas)] shadow-[var(--af-shadow-pop)]">
                    <p className="border-b border-[var(--af-hairline)] px-4 py-3 text-[13px] font-medium text-[var(--af-ink)]">
                      알림 {unread}건
                    </p>
                    <ul className="max-h-[320px] overflow-y-auto">
                      {notices.map((notice) => (
                        <li
                          key={notice.id}
                          className="border-b border-[var(--af-hairline)] px-4 py-3 last:border-b-0"
                        >
                          <div className="flex items-start gap-2">
                            {notice.unread && (
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--af-link)]" />
                            )}
                            <div className={notice.unread ? "" : "pl-3.5"}>
                              <p className="text-[13px] font-medium leading-5 text-[var(--af-ink)]">
                                {notice.title}
                              </p>
                              <p className="mt-0.5 text-[12px] leading-4 text-[var(--af-body)]">
                                {notice.detail}
                              </p>
                              <p className="mt-1 af-mono text-[11px] text-[var(--af-mute)]">
                                {notice.at}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <Button size="sm" icon={<Plus size={13} weight="bold" />} onClick={() => onNavigate("register")}>
              자산 등록
            </Button>

            <span className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--af-primary)] text-[12px] font-medium text-[var(--af-on-primary)] sm:flex">
              {company.manager.name.slice(1)}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-64px)] w-[232px] shrink-0 overflow-y-auto border-r border-[var(--af-hairline)] px-3 py-6 lg:block">
          {nav}
          <div className="mt-8 rounded-[8px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
            <p className="text-[13px] font-medium text-[var(--af-ink)]">이번 달 예상 매각액</p>
            <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.03em] text-[var(--af-ink)]">
              5,842만원
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[var(--af-mute)]">
              진행 중 입찰 3건과 확정 거래 2건 합계
            </p>
          </div>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-[rgba(0,0,0,0.32)]"
            />
            <div className="af-enter relative h-full w-[264px] overflow-y-auto border-r border-[var(--af-hairline)] bg-[var(--af-canvas)] px-3 py-5">
              <div className="mb-5 flex items-center justify-between px-3">
                <span className="flex items-center gap-2">
                  <Mark size={20} />
                  <span className="text-[14px] font-semibold tracking-[-0.03em]">AssetFlow</span>
                </span>
                <button
                  type="button"
                  aria-label="메뉴 닫기"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--af-hairline)]"
                >
                  <X size={13} />
                </button>
              </div>
              {nav}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
