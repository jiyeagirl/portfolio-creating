"use client";

import { House, MapTrifold, Toilet } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

/* Edge-anchored bar: fully opaque, no backdrop-blur, `pb-[34px]` to clear the
   home indicator. See design.md 기기 프레임 안쪽 규칙. */

type TabId = "lobby" | "floor" | "amenity";

const TABS: { id: TabId; label: string; icon: Icon }[] = [
  { id: "lobby", label: "통합 안내", icon: House },
  { id: "floor", label: "층별 안내", icon: MapTrifold },
  { id: "amenity", label: "편의시설", icon: Toilet },
];

export function TabBar({
  active,
  onSelect,
}: {
  active: TabId | null;
  onSelect: (id: TabId) => void;
}) {
  return (
    /* No z-index: this is a flex sibling of the scroll area, not an overlay,
       and raising it would put it above the bottom sheet. */
    <nav className="yi-edge-bar shrink-0 border-t border-[var(--yi-border)] pb-[34px]">
      <div className="flex h-[56px] items-stretch">
        {TABS.map((tab) => {
          const on = active === tab.id;
          const IconCmp = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              aria-current={on ? "page" : undefined}
              className="yi-press flex flex-1 flex-col items-center justify-center gap-[3px]"
            >
              <IconCmp
                size={22}
                weight={on ? "fill" : "regular"}
                className={on ? "text-[var(--yi-primary)]" : "text-[var(--yi-muted-soft)]"}
              />
              <span
                className={`text-[10.5px] font-semibold leading-[14px] ${
                  on ? "text-[var(--yi-primary)]" : "text-[var(--yi-muted-soft)]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
