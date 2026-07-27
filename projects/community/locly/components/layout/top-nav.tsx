"use client";

import { Bell, MagnifyingGlass, MapPin, ShieldCheck } from "@phosphor-icons/react";
import { CURRENT_USER, NEIGHBORHOOD } from "@/projects/community/locly/lib/mock-data";
import { PRIMARY_NAV } from "@/projects/community/locly/lib/navigation";
import type { LoclyView, NavigateFn } from "@/projects/community/locly/lib/navigation";
import { Avatar } from "@/projects/community/locly/components/layout/ui";

export function TopNav({
  active,
  unreadCount,
  onNavigate,
}: {
  active: LoclyView;
  unreadCount: number;
  onNavigate: NavigateFn;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--locly-border)] bg-[var(--locly-bg)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-6 px-6 lg:px-10">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-[19px] font-bold tracking-tight text-[var(--locly-ink)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--locly-accent)] text-[15px] font-extrabold text-[var(--locly-accent-foreground)]">
            L
          </span>
          LOCLY
        </button>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                active === item.view
                  ? "bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]"
                  : "text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 rounded-full border border-[var(--locly-border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--locly-muted)] md:flex">
          <MapPin size={14} weight="fill" className="text-[var(--locly-accent)]" />
          {NEIGHBORHOOD.split(" ").slice(-1)[0]}
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <button
            aria-label="통합 검색"
            onClick={() => onNavigate("search")}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              active === "search" ? "bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]" : "text-[var(--locly-muted)] hover:bg-[var(--locly-surface)]"
            }`}
          >
            <MagnifyingGlass size={19} />
          </button>
          <button
            aria-label="알림"
            onClick={() => onNavigate("notifications")}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              active === "notifications" ? "bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]" : "text-[var(--locly-muted)] hover:bg-[var(--locly-surface)]"
            }`}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--locly-danger)] px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            aria-label="마이페이지"
            onClick={() => onNavigate("mypage")}
            className="flex items-center gap-2 rounded-full pl-1 pr-1"
          >
            <Avatar name={CURRENT_USER.name} size={32} />
          </button>
          <button
            onClick={() => onNavigate("admin")}
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors xl:flex ${
              active === "admin" ? "bg-[var(--locly-ink)] text-[var(--locly-bg)]" : "text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
            }`}
          >
            <ShieldCheck size={15} />
            관리자
          </button>
        </div>
      </div>

      <div className="locly-scrollbar-none flex items-center gap-2 overflow-x-auto px-6 pb-3 lg:hidden">
        {[...PRIMARY_NAV, { view: "admin" as const, label: "관리자" }].map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              active === item.view
                ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]"
                : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
