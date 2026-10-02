"use client";

import { Bell, ChartBar, House, MapPin, PersonSimpleWalk } from "@phosphor-icons/react";
import type { AppNavigate, AppScreen, TabKey } from "@/projects/monitoring/caresignal/lib/navigation";

const TABS: { key: TabKey; screen: AppScreen; label: string; icon: typeof House }[] = [
  { key: "home", screen: "home", label: "홈", icon: House },
  { key: "location", screen: "location", label: "위치", icon: MapPin },
  { key: "activity", screen: "activity", label: "활동", icon: PersonSimpleWalk },
  { key: "notifications", screen: "notifications", label: "알림", icon: Bell },
  { key: "report", screen: "report", label: "리포트", icon: ChartBar },
];

export function BottomNav({
  active,
  unread,
  onNavigate,
}: {
  active: TabKey;
  unread: number;
  onNavigate: AppNavigate;
}) {
  return (
    /* 불투명 배경을 쓴다. backdrop-blur를 넣으면 기기 프레임의 라운드 클리핑을
       벗어나 하단 모서리에 흰 띠가 새어 나온다. */
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#e0e0e0] bg-white pb-8 pt-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.screen)}
            aria-current={isActive ? "page" : undefined}
            className={`cs-focusable flex flex-1 flex-col items-center gap-[3px] py-1 transition-colors ${
              isActive ? "text-[#0066cc]" : "text-[#a1a1a6]"
            }`}
          >
            <span className="relative">
              <tab.icon size={23} weight={isActive ? "fill" : "regular"} />
              {tab.key === "notifications" && unread > 0 && (
                <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[9.5px] font-semibold leading-none text-white">
                  {unread}
                </span>
              )}
            </span>
            <span className="text-[10.5px] font-semibold leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
