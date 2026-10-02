"use client";

import { ChartLineUp, ForkKnife, House, UserCircle, UsersThree } from "@phosphor-icons/react";
import { TABS, type Navigate, type TabKey } from "@/projects/healthcare/welllog/lib/navigation";

const TAB_ICON: Record<
  TabKey,
  React.ComponentType<{ size?: number; weight?: "regular" | "fill"; color?: string }>
> = {
  home: House,
  diet: ForkKnife,
  challenge: UsersThree,
  report: ChartLineUp,
  mypage: UserCircle,
};

export function BottomNav({ active, onNavigate }: { active: TabKey; onNavigate: Navigate }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-[var(--wl-hairline)] bg-[var(--wl-surface)] pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <ul className="flex items-center justify-around px-2">
        {TABS.map((tab) => {
          const Icon = TAB_ICON[tab.key];
          const isActive = tab.key === active;
          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onNavigate(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className="flex w-16 flex-col items-center gap-1 py-1"
              >
                <Icon
                  size={21}
                  weight={isActive ? "fill" : "regular"}
                  color={isActive ? "var(--wl-accent)" : "var(--wl-mute)"}
                />
                <span
                  className="text-[10.5px] font-medium"
                  style={{ color: isActive ? "var(--wl-accent)" : "var(--wl-mute)" }}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
