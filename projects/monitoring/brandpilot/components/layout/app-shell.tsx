"use client";

import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChartLineUp,
  Compass,
  FolderOpen,
  List,
  MagnifyingGlass,
  MegaphoneSimple,
  PaperPlaneTilt,
  PencilSimple,
  SealCheck,
  Sparkle,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import { Badge, InitialAvatar } from "@/projects/monitoring/brandpilot/components/ui";
import { Mark } from "@/projects/monitoring/brandpilot/components/layout/mark";
import { brand, contents, currentUser } from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  NAV_GROUPS,
  NAV_ITEMS,
  type Navigate,
  type Screen,
} from "@/projects/monitoring/brandpilot/lib/navigation";

const NAV_ICON: Record<Screen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: SquaresFour,
  analytics: ChartLineUp,
  generate: Sparkle,
  editor: PencilSimple,
  library: FolderOpen,
  approvals: SealCheck,
  campaigns: MegaphoneSimple,
  publishing: PaperPlaneTilt,
  references: Compass,
  brandGuide: BookOpen,
};

export function AppShell({
  screen,
  onNavigate,
  onLogout,
  children,
}: {
  screen: Screen;
  onNavigate: Navigate;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const pendingReview = contents.filter((c) => c.status === "review").length;

  const nav = (
    <nav className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <p className="bp-mono px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--bp-mute)]">
            {group}
          </p>
          <ul className="space-y-px">
            {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
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
                        ? "bg-[var(--bp-soft-2)] font-medium text-[var(--bp-ink)]"
                        : "text-[var(--bp-body)] hover:bg-[var(--bp-soft-2)] hover:text-[var(--bp-ink)]"
                    }`}
                  >
                    <Icon size={15} weight={active ? "fill" : "bold"} />
                    <span className="flex-1">{item.label}</span>
                    {item.key === "approvals" && pendingReview > 0 && (
                      <span className="bp-mono rounded-full bg-[var(--bp-warn-soft)] px-1.5 text-[11px] font-medium text-[var(--bp-warn-deep)]">
                        {pendingReview}
                      </span>
                    )}
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
    <div className="brandpilot min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--bp-hairline)] bg-[var(--bp-canvas)]">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--bp-hairline)] text-[var(--bp-body)] lg:hidden"
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2"
          >
            <Mark size={22} />
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
              BrandPilot
            </span>
          </button>

          <span className="hidden h-4 w-px bg-[var(--bp-hairline)] sm:block" />

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-[13px] text-[var(--bp-body)]">{brand.name}</span>
            <Badge tone="accent">{brand.plan}</Badge>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden w-[240px] xl:block">
              <MagnifyingGlass
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--bp-mute)]"
              />
              <input
                placeholder="콘텐츠, 캠페인 검색"
                className="h-9 w-full rounded-[6px] border border-[var(--bp-hairline)] bg-[var(--bp-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--bp-mute)] focus:border-[var(--bp-accent)] focus:bg-[var(--bp-canvas)]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={`알림 ${pendingReview}건`}
                onClick={() => setNoticeOpen((v) => !v)}
                className="relative flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--bp-hairline)] text-[var(--bp-body)] transition-colors hover:bg-[var(--bp-soft)]"
              >
                <Bell size={15} />
                {pendingReview > 0 && (
                  <span className="bp-mono absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--bp-accent)] px-1 text-[10px] font-medium text-white">
                    {pendingReview}
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
                  <div className="bp-enter absolute right-0 top-11 z-50 w-[340px] overflow-hidden rounded-[8px] border border-[var(--bp-hairline)] bg-[var(--bp-canvas)] shadow-[var(--bp-shadow-pop)]">
                    <div className="flex items-center justify-between border-b border-[var(--bp-hairline)] px-4 py-3">
                      <p className="text-[13px] font-medium text-[var(--bp-ink)]">
                        검토 대기 {pendingReview}건
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate("approvals");
                          setNoticeOpen(false);
                        }}
                        className="text-[12px] text-[var(--bp-accent)]"
                      >
                        전체 보기
                      </button>
                    </div>
                    <ul className="max-h-[320px] overflow-y-auto">
                      {contents
                        .filter((c) => c.status === "review")
                        .map((c) => (
                          <li
                            key={c.id}
                            className="border-b border-[var(--bp-hairline)] px-4 py-3 last:border-b-0"
                          >
                            <p className="text-[13px] font-medium leading-5 text-[var(--bp-ink)]">
                              {c.title}
                            </p>
                            <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[12px] text-[var(--bp-mute)]">
                              <span>{c.author}</span>
                              <span>{c.campaignName}</span>
                            </p>
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
              className="hidden items-center gap-2 rounded-[6px] px-2 py-1 text-[13px] text-[var(--bp-body)] transition-colors hover:bg-[var(--bp-soft)] sm:flex"
            >
              <InitialAvatar name={currentUser.name} size={28} tone="ink" />
              <span className="hidden text-left leading-tight md:block">
                <span className="block font-medium text-[var(--bp-ink)]">{currentUser.name}</span>
                <span className="block text-[11px] text-[var(--bp-mute)]">{brand.team}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-64px)] w-[236px] shrink-0 overflow-y-auto border-r border-[var(--bp-hairline)] bg-[var(--bp-soft)] px-3 py-6 lg:block">
          {nav}
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-[rgba(0,0,0,0.32)]"
            />
            <div className="bp-enter relative h-full w-[264px] overflow-y-auto bg-[var(--bp-canvas)] px-3 py-5">
              <div className="mb-5 flex items-center justify-between px-3">
                <span className="flex items-center gap-2">
                  <Mark size={20} />
                  <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
                    BrandPilot
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="메뉴 닫기"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--bp-hairline)] text-[var(--bp-body)]"
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
