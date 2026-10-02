"use client";

import { ChatCircleDots, Compass, House, Star, User } from "@phosphor-icons/react";
import { TABS, type NavigateFn, type TabKey } from "@/projects/community/wedit/lib/navigation";

const ICONS: Record<TabKey, typeof House> = {
  home: House,
  explore: Compass,
  reviews: Star,
  community: ChatCircleDots,
  mypage: User,
};

export function BottomNav({ active, onNavigate }: { active: TabKey; onNavigate: NavigateFn }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[var(--wd-border)] bg-white pb-8 pt-2">
      {TABS.map((tab) => {
        const Icon = ICONS[tab.key];
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
              isActive ? "text-[var(--wd-accent)]" : "text-[var(--wd-muted)]"
            }`}
          >
            <Icon size={22} weight={isActive ? "fill" : "regular"} />
            <span className="text-[10.5px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
