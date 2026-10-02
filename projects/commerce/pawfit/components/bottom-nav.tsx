"use client";

import { House, PawPrint, Storefront, User } from "@phosphor-icons/react";
import type { NavigateFn, PawfitView, TabKey } from "@/projects/commerce/pawfit/lib/navigation";

const TABS: { key: TabKey; view: PawfitView; label: string; icon: typeof House }[] = [
  { key: "home", view: "home", label: "홈", icon: House },
  { key: "productList", view: "productList", label: "샵", icon: Storefront },
  { key: "petProfile", view: "petProfile", label: "마이펫", icon: PawPrint },
  { key: "mypage", view: "mypage", label: "마이", icon: User },
];

export function BottomNav({
  active,
  onNavigate,
}: {
  active: TabKey;
  onNavigate: NavigateFn;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] pb-8 pt-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.view)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
              isActive ? "text-[var(--pf-ink)]" : "text-[var(--pf-muted-soft)]"
            }`}
          >
            <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
            <span className="text-[10.5px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
