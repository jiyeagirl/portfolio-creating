"use client";

import { CalendarBlank, CheckCircle, ForkKnife, House } from "@phosphor-icons/react";
import type {
  HabitkongNavigate,
  HabitkongScreen,
} from "@/projects/healthcare/habitkong/lib/navigation";

const TABS: { key: HabitkongScreen; label: string; icon: typeof House }[] = [
  { key: "home", label: "홈", icon: House },
  { key: "diet", label: "식단", icon: ForkKnife },
  { key: "routine", label: "루틴", icon: CheckCircle },
  { key: "diary", label: "다이어리", icon: CalendarBlank },
];

export function BottomNav({
  active,
  onNavigate,
}: {
  active: HabitkongScreen;
  onNavigate: HabitkongNavigate;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#EAEAEA] bg-white pb-8 pt-2.5">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.key)}
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
              isActive ? "text-[#17140F]" : "text-[#C9C0B8]"
            }`}
          >
            <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
            <span className="text-[10.5px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
