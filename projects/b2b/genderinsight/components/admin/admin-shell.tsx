"use client";

import { useState } from "react";
import {
  Bell,
  ChartLineUp,
  ClipboardText,
  FileText,
  List,
  ListChecks,
  MagnifyingGlass,
  ShieldCheck,
  SquaresFour,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { Avatar, Badge } from "@/projects/b2b/genderinsight/components/ui";
import { ADMIN_GROUPS, ADMIN_NAV, type AdminScreen } from "@/projects/b2b/genderinsight/lib/navigation";
import { ADMIN_USERS, NOTICES } from "@/projects/b2b/genderinsight/lib/mock-data";
import { Mark } from "@/projects/b2b/genderinsight/components/layout/mark";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  assessments: ClipboardText,
  questions: ListChecks,
  participants: UsersThree,
  responses: ChartLineUp,
  analysis: ChartLineUp,
  reports: FileText,
  settings: ShieldCheck,
};

const currentAdmin = ADMIN_USERS[0];

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
  const [noticeOpen, setNoticeOpen] = useState(false);
  const unread = NOTICES.filter((n) => n.unread).length;

  const nav = (
    <nav className="flex flex-col gap-6">
      {ADMIN_GROUPS.map((group) => (
        <div key={group}>
          <p className="gi-mono px-3 text-[11px] uppercase tracking-[0.08em] text-[#a08d99]">
            {group}
          </p>
          <ul className="mt-2 space-y-px">
            {ADMIN_NAV.filter((item) => item.group === group).map((item) => {
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
                        ? "bg-[#33272e] font-medium text-white"
                        : "text-[#c7b9c1] hover:bg-[#291f25] hover:text-white"
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
    <div className="genderinsight flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[#1c1418] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <Mark size={22} tone="light" />
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.03em] text-white">
              GenderInsight
            </p>
            <p className="gi-mono text-[10.5px] uppercase tracking-[0.1em] text-[#a08d99]">
              Admin Console
            </p>
          </div>
        </div>
        {nav}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[#2f242b] px-3 pt-4">
          <Avatar name={currentAdmin.name} size={32} tone="dark" />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-white">{currentAdmin.name}</p>
            <p className="truncate text-[11px] text-[#a08d99]">
              {currentAdmin.department} / {currentAdmin.role}
            </p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[rgba(28,20,24,0.55)]"
          />
          <div className="gi-enter relative h-full w-[264px] overflow-y-auto bg-[#1c1418] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <Mark size={20} tone="light" />
                <span className="text-[14px] font-semibold tracking-[-0.03em] text-white">
                  GenderInsight Admin
                </span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#2f242b] text-white"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--gi-hairline)] bg-[var(--gi-canvas)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--gi-ink)]">
            {ADMIN_NAV.find((item) => item.key === screen)?.label}
          </p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gi-mute)]"
            />
            <input
              placeholder="진단명, 참여자 이름 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--gi-hairline)] bg-[var(--gi-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--gi-mute)] focus:border-[var(--gi-hairline-strong)] focus:bg-[var(--gi-canvas)]"
            />
          </div>

          <div className="relative ml-auto md:ml-0">
            <button
              type="button"
              aria-label={`알림 ${unread}건`}
              onClick={() => setNoticeOpen((prev) => !prev)}
              className="relative flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] transition-colors hover:bg-[var(--gi-soft)]"
            >
              <Bell size={14} />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gi-danger)] px-1 gi-mono text-[10px] font-medium text-white">
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
                <div className="gi-enter absolute right-0 top-11 z-50 w-[320px] overflow-hidden rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] shadow-[var(--gi-shadow-pop)]">
                  <p className="border-b border-[var(--gi-hairline)] px-4 py-3 text-[13px] font-medium text-[var(--gi-ink)]">
                    알림 {unread}건
                  </p>
                  <ul className="max-h-[320px] overflow-y-auto">
                    {NOTICES.map((notice) => (
                      <li key={notice.id} className="border-b border-[var(--gi-hairline)] px-4 py-3 last:border-b-0">
                        <div className="flex items-start gap-2">
                          {notice.unread && (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gi-info)]" />
                          )}
                          <div className={notice.unread ? "" : "pl-3.5"}>
                            <p className="text-[13px] font-medium leading-5 text-[var(--gi-ink)]">
                              {notice.title}
                            </p>
                            <p className="mt-0.5 text-[12px] leading-4 text-[var(--gi-body)]">
                              {notice.detail}
                            </p>
                            <p className="mt-1 gi-mono text-[11px] text-[var(--gi-mute)]">{notice.at}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <Badge tone="ink">{currentAdmin.role}</Badge>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
