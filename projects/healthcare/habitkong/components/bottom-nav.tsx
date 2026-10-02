"use client";

import { ChartBar, CheckCircle, ForkKnife, House, User } from "@phosphor-icons/react";
import type {
  HabitkongNavigate,
  HabitkongScreen,
  TabKey,
} from "@/projects/healthcare/habitkong/lib/navigation";

const TABS: { key: TabKey; screen: HabitkongScreen; label: string; icon: typeof House }[] = [
  { key: "home", screen: "home", label: "홈", icon: House },
  { key: "diet", screen: "diet", label: "식단", icon: ForkKnife },
  { key: "routine", screen: "routine", label: "루틴", icon: CheckCircle },
  { key: "report", screen: "report", label: "리포트", icon: ChartBar },
  { key: "mypage", screen: "mypage", label: "마이", icon: User },
];

export function BottomNav({
  active,
  onNavigate,
}: {
  active: TabKey;
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
            onClick={() => onNavigate(tab.screen)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
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
