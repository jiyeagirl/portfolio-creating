"use client";

import { Bag, CalendarCheck, House, UserCircle } from "@phosphor-icons/react";
import type { NavigateFn, SnowPeakView, TabKey } from "@/projects/commerce/snowpeak/lib/navigation";

const TABS: { key: TabKey; view: SnowPeakView; label: string; icon: typeof House }[] = [
  { key: "home", view: "home", label: "홈", icon: House },
  { key: "bookHub", view: "bookHub", label: "예약", icon: CalendarCheck },
  { key: "cart", view: "cart", label: "장바구니", icon: Bag },
  { key: "mypage", view: "mypage", label: "마이", icon: UserCircle },
];

export function BottomNav({
  active,
  cartCount = 0,
  onNavigate,
}: {
  active: TabKey;
  cartCount?: number;
  onNavigate: NavigateFn;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[var(--sp-border)] bg-[var(--sp-surface)] pb-8 pt-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.view)}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
              isActive ? "text-[var(--sp-accent)]" : "text-[var(--sp-mute)]"
            }`}
          >
            <span className="relative">
              <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
              {tab.key === "cart" && cartCount > 0 && (
                <span className="sp-num absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--sp-accent)] px-1 text-[9.5px] font-bold text-white">
                  {cartCount}
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
