"use client";

import { useState } from "react";
import {
  Bell,
  CaretDown,
  ChartBar,
  List,
  MagnifyingGlass,
  Package,
  Robot,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import { Badge, InitialAvatar } from "@/projects/b2b/orderlog/components/ui";
import { Mark } from "@/projects/b2b/orderlog/components/layout/mark";
import { currentUser, notifications } from "@/projects/b2b/orderlog/lib/mock-data";
import {
  CONSOLE_ROLES,
  NAV_ITEMS,
  ROLE_LABEL,
  type Navigate,
  type Screen,
} from "@/projects/b2b/orderlog/lib/navigation";
import type { Role } from "@/projects/b2b/orderlog/lib/types";

const NAV_ICON: Record<Screen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  thread: SquaresFour,
  items: Package,
  anomaly: Robot,
  stats: ChartBar,
  notifications: Bell,
};

export function AppShell({
  screen,
  role,
  onNavigate,
  onRoleChange,
  onLogout,
  children,
}: {
  screen: Screen;
  role: Role;
  onNavigate: Navigate;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = NAV_ICON[item.key];
        const active = item.key === screen;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              onNavigate(item.key);
              setMenuOpen(false);
            }}
            aria-current={active ? "page" : undefined}
            className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2.5 text-left text-[13.5px] transition-colors ${
              active
                ? "bg-[var(--ot-nav-surface)] font-medium text-[var(--ot-nav-fg)]"
                : "text-[var(--ot-nav-mute)] hover:bg-[var(--ot-nav-surface)] hover:text-[var(--ot-nav-fg)]"
            }`}
          >
            <Icon size={16} weight={active ? "fill" : "bold"} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="orderlog min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--ot-hairline)] bg-[var(--ot-surface)]">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--ot-hairline)] text-[var(--ot-body)] lg:hidden"
          >
            <List size={15} />
          </button>

          <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-2">
            <Mark size={22} />
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--ot-ink)]">
              OrderLog
            </span>
          </button>

          <span className="hidden h-4 w-px bg-[var(--ot-hairline)] sm:block" />

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setRoleMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-[6px] px-2 py-1 text-[13px] text-[var(--ot-body)] transition-colors hover:bg-[var(--ot-surface-soft)]"
            >
              <Badge tone="info">{ROLE_LABEL[role]}</Badge>
              <span className="text-[var(--ot-mute)]">보기 전환</span>
              <CaretDown size={11} />
            </button>
            {roleMenuOpen && (
              <>
                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => setRoleMenuOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div className="ot-enter absolute left-0 top-11 z-50 w-[200px] overflow-hidden rounded-[8px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] p-1 shadow-[var(--ot-shadow-pop)]">
                  {CONSOLE_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        onRoleChange(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-[13px] transition-colors hover:bg-[var(--ot-surface-soft)] ${
                        r === role ? "font-medium text-[var(--ot-ink)]" : "text-[var(--ot-body)]"
                      }`}
                    >
                      {ROLE_LABEL[r]}
                      {r === role && <span className="h-1.5 w-1.5 rounded-full bg-[var(--ot-accent)]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden w-[240px] xl:block">
              <MagnifyingGlass
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ot-mute)]"
              />
              <input
                placeholder="발주번호, 품목명 검색"
                className="h-9 w-full rounded-[6px] border border-[var(--ot-hairline)] bg-[var(--ot-surface-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--ot-mute)] focus:border-[var(--ot-accent)] focus:bg-[var(--ot-surface)]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={`알림 ${unread}건`}
                onClick={() => setNoticeOpen((v) => !v)}
                className="relative flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--ot-hairline)] text-[var(--ot-body)] transition-colors hover:bg-[var(--ot-surface-soft)]"
              >
                <Bell size={15} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ot-danger)] px-1 ot-mono text-[10px] font-medium text-white">
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
                  <div className="ot-enter absolute right-0 top-11 z-50 w-[340px] overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow-pop)]">
                    <div className="flex items-center justify-between border-b border-[var(--ot-hairline)] px-4 py-3">
                      <p className="text-[13px] font-medium text-[var(--ot-ink)]">알림 {unread}건</p>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate("notifications");
                          setNoticeOpen(false);
                        }}
                        className="text-[12px] text-[var(--ot-accent)]"
                      >
                        전체 보기
                      </button>
                    </div>
                    <ul className="max-h-[320px] overflow-y-auto">
                      {notifications.slice(0, 5).map((n) => (
                        <li key={n.id} className="border-b border-[var(--ot-hairline)] px-4 py-3 last:border-b-0">
                          <div className="flex items-start gap-2">
                            {n.unread && (
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ot-accent)]" />
                            )}
                            <div className={n.unread ? "" : "pl-3.5"}>
                              <p className="text-[13px] font-medium leading-5 text-[var(--ot-ink)]">{n.title}</p>
                              <p className="mt-0.5 text-[12px] leading-4 text-[var(--ot-body)]">{n.detail}</p>
                              <p className="ot-mono mt-1 text-[11px] text-[var(--ot-mute)]">{n.sentAt}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="hidden items-center gap-2 rounded-[6px] px-2 py-1 text-[13px] text-[var(--ot-body)] transition-colors hover:bg-[var(--ot-surface-soft)] sm:flex"
            >
              <InitialAvatar name={currentUser.name} size={28} tone="ink" />
              <span className="hidden text-left leading-tight md:block">
                <span className="block font-medium text-[var(--ot-ink)]">{currentUser.name}</span>
                <span className="block text-[11px] text-[var(--ot-mute)]">{currentUser.companyName}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-64px)] w-[228px] shrink-0 overflow-y-auto border-r border-[var(--ot-nav-border)] bg-[var(--ot-nav-bg)] px-3 py-6 lg:block">
          {nav}
          <div className="mt-8 rounded-[10px] border border-[var(--ot-nav-border)] bg-[var(--ot-nav-surface)] p-4">
            <p className="text-[13px] font-medium text-[var(--ot-nav-fg)]">이번 달 거래 금액</p>
            <p className="ot-mono mt-1.5 text-[20px] font-semibold tracking-[-0.02em] text-[var(--ot-nav-fg)]">
              1억 9,840만원
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[var(--ot-nav-mute)]">
              진행중 발주 5건, 승인대기 2건 합계
            </p>
          </div>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-[rgba(10,15,34,0.5)]"
            />
            <div className="ot-enter relative h-full w-[264px] overflow-y-auto bg-[var(--ot-nav-bg)] px-3 py-5">
              <div className="mb-5 flex items-center justify-between px-3">
                <span className="flex items-center gap-2">
                  <Mark size={20} inverted />
                  <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--ot-nav-fg)]">
                    OrderLog
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="메뉴 닫기"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ot-nav-border)] text-[var(--ot-nav-fg)]"
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
