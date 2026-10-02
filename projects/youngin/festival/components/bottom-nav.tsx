"use client";

import { Icon } from "@iconify/react";
import type {
  FestivalNavigate,
  FestivalScreen,
  TabKey,
} from "@/projects/youngin/festival/lib/navigation";

const TABS: { key: TabKey; screen: FestivalScreen; label: string; icon: string; active: string }[] =
  [
    {
      key: "home",
      screen: "home",
      label: "행사 홈",
      icon: "solar:home-2-linear",
      active: "solar:home-2-bold",
    },
    {
      key: "map",
      screen: "map",
      label: "행사장 지도",
      icon: "solar:map-linear",
      active: "solar:map-bold",
    },
    {
      key: "mission",
      screen: "mission",
      label: "미션 참여",
      icon: "solar:flag-2-linear",
      active: "solar:flag-2-bold",
    },
  ];

export function BottomNav({ active, onNavigate }: { active: TabKey; onNavigate: FestivalNavigate }) {
  /* 기기 프레임 안쪽 규칙 (design.md): backdrop-blur 금지. 불투명 표면 + 화면 박스 안쪽
     absolute 배치로 PhoneFrame의 라운드 코너 클립을 뚫지 않는다. */
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-30 flex items-stretch pb-[30px] pt-2"
      style={{
        background: "var(--fs-surface)",
        boxShadow: "0 -1px 0 var(--fs-line)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.screen)}
            aria-current={isActive ? "page" : undefined}
            className="flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1 transition-colors duration-150"
            style={{ color: isActive ? "var(--fs-accent)" : "var(--fs-faint)" }}
          >
            <Icon icon={isActive ? tab.active : tab.icon} width="23" height="23" />
            <span className="text-[10.5px] font-semibold tracking-[-0.01em]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
