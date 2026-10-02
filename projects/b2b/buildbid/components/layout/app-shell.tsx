"use client";

import { useState } from "react";
import {
  ArrowsLeftRight,
  Bell,
  ClipboardText,
  Gavel,
  Handshake,
  List,
  MagnifyingGlass,
  Plus,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import { Badge, Button } from "@/projects/b2b/buildbid/components/ui";
import { notices, sellerCompany, buyerCompany } from "@/projects/b2b/buildbid/lib/mock-data";
import {
  SELLER_NAV,
  BUYER_NAV,
  type BuyerScreen,
  type Navigate,
  type Role,
  type SellerScreen,
} from "@/projects/b2b/buildbid/lib/navigation";
import { Mark } from "@/projects/b2b/buildbid/components/layout/mark";

type NavIcon = React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>;

const NAV_ICON: Record<SellerScreen | BuyerScreen, NavIcon> = {
  dashboard: SquaresFour,
  register: Plus,
  bidding: Gavel,
  dealDone: Handshake,
  listings: SquaresFour,
  detail: ClipboardText,
  dealManage: Handshake,
};

export function AppShell({
  role,
  screen,
  onNavigate,
  onSwitchRole,
  children,
}: {
  role: Role;
  screen: SellerScreen | BuyerScreen;
  onNavigate: Navigate;
  onSwitchRole: () => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const unread = notices.filter((n) => n.unread).length;

  const isSeller = role === "seller";
  const navItems: { key: SellerScreen | BuyerScreen; label: string; group: string }[] = isSeller ? SELLER_NAV : BUYER_NAV;
  const groups = Array.from(new Set(navItems.map((item) => item.group)));
  const company = isSeller ? sellerCompany : buyerCompany;
  const homeScreen: SellerScreen | BuyerScreen = isSeller ? "dashboard" : "listings";

  const nav = (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group}>
          <p className="bb-mono px-3 text-[11px] uppercase tracking-[0.08em] text-[var(--bb-mute)]">{group}</p>
          <ul className="mt-2 space-y-px">
            {navItems
              .filter((item) => item.group === group)
              .map((item) => {
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
                        active
                          ? "bg-[var(--bb-canvas-parchment)] font-semibold text-[var(--bb-ink)]"
                          : "text-[var(--bb-body)] hover:bg-[var(--bb-canvas-parchment)] hover:text-[var(--bb-ink)]"
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
    <div className="buildbid min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--bb-hairline)] bg-[var(--bb-canvas)]">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] lg:hidden"
          >
            <List size={15} />
          </button>

          <button type="button" onClick={() => onNavigate(homeScreen)} className="flex items-center gap-2">
            <Mark size={22} />
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--bb-ink)]">BuildBid</span>
            <Badge tone={isSeller ? "info" : "neutral"}>{isSeller ? "판매자" : "바이어"}</Badge>
          </button>

          <span className="hidden h-4 w-px bg-[var(--bb-hairline)] sm:block" />
          <span className="hidden items-center gap-1.5 px-2 py-1 text-[13px] text-[var(--bb-body)] sm:flex">
            {company.name}
            <Badge tone="neutral">{company.tier}</Badge>
          </span>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden w-[220px] xl:block">
              <MagnifyingGlass size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--bb-mute)]" />
              <input
                placeholder="장비 코드, 모델명 검색"
                className="h-9 w-full rounded-full border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] pl-10 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--bb-mute)] focus:border-[var(--bb-primary-focus)] focus:bg-[var(--bb-canvas)]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={`알림 ${unread}건`}
                onClick={() => setNoticeOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] transition-colors hover:bg-[var(--bb-canvas-parchment)]"
              >
                <Bell size={15} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--bb-danger)] px-1 bb-mono text-[10px] font-semibold text-white">
                    {unread}
                  </span>
                )}
              </button>

              {noticeOpen && (
                <>
                  <button type="button" aria-label="알림 닫기" onClick={() => setNoticeOpen(false)} className="fixed inset-0 z-40 cursor-default" />
                  <div className="bb-enter absolute right-0 top-11 z-50 w-[340px] overflow-hidden rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas)] shadow-[var(--bb-shadow-overlay)]">
                    <p className="border-b border-[var(--bb-hairline)] px-4 py-3 text-[13px] font-semibold text-[var(--bb-ink)]">알림 {unread}건</p>
                    <ul className="max-h-[320px] overflow-y-auto">
                      {notices.map((notice) => (
                        <li key={notice.id} className="border-b border-[var(--bb-hairline)] px-4 py-3 last:border-b-0">
                          <div className="flex items-start gap-2">
                            {notice.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bb-info)]" />}
                            <div className={notice.unread ? "" : "pl-3.5"}>
                              <p className="text-[13px] font-semibold leading-5 text-[var(--bb-ink)]">{notice.title}</p>
                              <p className="mt-0.5 text-[12px] leading-4 text-[var(--bb-body)]">{notice.detail}</p>
                              <p className="mt-1 bb-mono text-[11px] text-[var(--bb-mute)]">{notice.at}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {isSeller && (
              <Button size="sm" icon={<Plus size={13} weight="bold" />} onClick={() => onNavigate("register")}>
                장비 등록
              </Button>
            )}

            <button
              type="button"
              onClick={onSwitchRole}
              aria-label="역할 전환"
              title="역할 전환"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] transition-colors hover:bg-[var(--bb-canvas-parchment)]"
            >
              <ArrowsLeftRight size={15} />
            </button>

            <span className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--bb-primary)] text-[12px] font-semibold text-white sm:flex">
              {company.manager.name.slice(1)}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-64px)] w-[232px] shrink-0 overflow-y-auto border-r border-[var(--bb-hairline)] px-3 py-6 lg:block">
          {nav}
          <div className="mt-8 rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] p-4">
            <p className="text-[13px] font-semibold text-[var(--bb-ink)]">{isSeller ? "이번 달 예상 매각액" : "이번 달 입찰 참여액"}</p>
            <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.03em] text-[var(--bb-ink)]">
              {isSeller ? "2억 1,840만원" : "1억 6,200만원"}
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[var(--bb-mute)]">
              {isSeller ? "진행 중 입찰 3건과 확정 거래 2건 합계" : "1차 입찰 2건, 최종 입찰 참여 1건 합계"}
            </p>
          </div>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-[rgba(0,0,0,0.32)]" />
            <div className="bb-enter relative h-full w-[264px] overflow-y-auto border-r border-[var(--bb-hairline)] bg-[var(--bb-canvas)] px-3 py-5">
              <div className="mb-5 flex items-center justify-between px-3">
                <span className="flex items-center gap-2">
                  <Mark size={20} />
                  <span className="text-[14px] font-semibold tracking-[-0.03em]">BuildBid</span>
                </span>
                <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bb-hairline)]">
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
