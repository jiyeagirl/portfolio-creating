"use client";

/* 하단 탭바는 PhoneFrame 의 rounded-[50px] 클립 경계에 닿는다.
   backdrop-blur 를 쓰면 Chromium 이 라운드 코너 클립을 뚫고 흰 틈이 새므로
   불투명 표면 + 상단 border 만 쓴다 (design.md "기기 프레임 안쪽 규칙"). */

import { Compass, House, MapTrifold, Storefront } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { TabKey } from "@/projects/youngin/real/lib/navigation";

const TABS: { key: TabKey; label: string; icon: Icon }[] = [
  { key: "home", label: "홈", icon: House },
  { key: "map", label: "주변 지도", icon: MapTrifold },
  { key: "districts", label: "상점가", icon: Storefront },
  { key: "festivals", label: "축제", icon: Compass },
];

export function BottomTabBar({
  active,
  onSelect,
  hasNewFestival = true,
}: {
  active: TabKey;
  onSelect: (tab: TabKey) => void;
  hasNewFestival?: boolean;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--cp-hairline)] bg-[var(--cp-surface)] pb-[34px]">
      <div className="flex h-[58px] items-stretch px-1">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center justify-center gap-[3px] transition-colors ${
                isActive ? "text-[var(--cp-accent)]" : "text-[var(--cp-faint)]"
              }`}
            >
              <span className="relative">
                <Icon size={22} weight={isActive ? "fill" : "regular"} />
                {key === "festivals" && hasNewFestival && (
                  <span className="absolute -right-1 -top-0.5 h-[6px] w-[6px] rounded-full bg-[var(--cp-danger)] ring-2 ring-[var(--cp-surface)]" />
                )}
              </span>
              <span className="text-[10px] font-bold tracking-[-0.01em]">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
