"use client";

import { CalendarCheck, House, MagnifyingGlass, Ticket, User } from "@phosphor-icons/react";
import type { NavigateFn, TabKey } from "@/projects/platform/lumi/lib/navigation";
import type { LumiView } from "@/projects/platform/lumi/lib/navigation";

const TABS: { key: TabKey; view: LumiView; label: string; icon: typeof House }[] = [
  { key: "home", view: "home", label: "홈", icon: House },
  { key: "experts", view: "experts", label: "상담사", icon: MagnifyingGlass },
  { key: "passes", view: "passes", label: "상담권", icon: Ticket },
  { key: "history", view: "history", label: "내 상담", icon: CalendarCheck },
  { key: "mypage", view: "mypage", label: "마이", icon: User },
];

export function BottomNav({
  active,
  badge,
  onNavigate,
}: {
  active: TabKey;
  badge: number;
  onNavigate: NavigateFn;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[var(--lm-border)] bg-[var(--lm-elevated)] pb-8 pt-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.view)}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
              isActive ? "text-[var(--lm-accent)]" : "text-[var(--lm-muted)]"
            }`}
          >
            <span className="relative">
              <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
              {tab.key === "history" && badge > 0 && (
                <span className="lm-num absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lm-live)] px-1 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-[10.5px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
