"use client";

import { useState } from "react";
import { Bell, List, MagnifyingGlass, PencilSimpleLine, X } from "@phosphor-icons/react";
import { CURRENT_USER } from "@/projects/community/locly/lib/mock-data";
import { PRIMARY_NAV } from "@/projects/community/locly/lib/navigation";
import type { NavigateFn, SiteView } from "@/projects/community/locly/lib/navigation";
import { Avatar, CONTAINER, LoclyMark, PrimaryButton } from "@/projects/community/locly/components/site/ui";

export function TopNav({
  active,
  unreadCount,
  onNavigate,
}: {
  active: SiteView;
  unreadCount: number;
  onNavigate: NavigateFn;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function go(view: SiteView) {
    setMenuOpen(false);
    onNavigate(view);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--lc-hairline)] bg-[var(--lc-canvas)]">
      <div className={`${CONTAINER} flex h-16 items-center gap-8`}>
        <button onClick={() => go("home")} className="flex shrink-0 items-center gap-2">
          <LoclyMark size={18} className="text-[var(--lc-primary)]" />
          <span className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--lc-ink)]">LOCLY</span>
        </button>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={`rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                active === item.view
                  ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                  : "text-[var(--lc-muted)] active:text-[var(--lc-ink)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <button
            aria-label="통합 검색"
            onClick={() => go("search")}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              active === "search" ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
            }`}
          >
            <MagnifyingGlass size={18} />
          </button>
          <button
            aria-label="알림"
            onClick={() => go("notifications")}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              active === "notifications" ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[var(--lc-primary)] px-1 text-[10px] font-semibold text-[var(--lc-on-primary)]">
                {unreadCount}
              </span>
            )}
          </button>
          <button aria-label="마이페이지" onClick={() => go("mypage")} className="ml-1">
            <Avatar name={CURRENT_USER.name} size={30} />
          </button>
          <span className="ml-2 hidden sm:block">
            <PrimaryButton onClick={() => go("postWrite")}>
              <PencilSimpleLine size={15} weight="bold" />
              글쓰기
            </PrimaryButton>
          </span>
          <button
            aria-label="메뉴"
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[var(--lc-ink)] lg:hidden"
          >
            {menuOpen ? <X size={19} /> : <List size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--lc-hairline)] bg-[var(--lc-canvas)] lg:hidden">
          <div className={`${CONTAINER} flex flex-col py-2`}>
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.view}
                onClick={() => go(item.view)}
                className={`rounded-[8px] px-3 py-3 text-left text-[15px] font-medium ${
                  active === item.view ? "text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-3 pb-3 pt-2 sm:hidden">
              <PrimaryButton full onClick={() => go("postWrite")}>
                <PencilSimpleLine size={15} weight="bold" />
                글쓰기
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
