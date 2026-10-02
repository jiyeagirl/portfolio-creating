"use client";

import { Bell, House, PersonSimpleWalk, UserCircle } from "@phosphor-icons/react";
import type { AppNavigate, AppScreen, TabKey } from "@/projects/monitoring/safesense/lib/navigation";

const TABS: { key: TabKey; screen: AppScreen; label: string; icon: typeof House }[] = [
  { key: "home", screen: "home", label: "홈", icon: House },
  { key: "records", screen: "records", label: "기록", icon: PersonSimpleWalk },
  { key: "notifications", screen: "notifications", label: "알림", icon: Bell },
  { key: "mypage", screen: "mypage", label: "마이", icon: UserCircle },
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
    /* 불투명 배경. backdrop-blur는 기기 프레임 라운드 클리핑을 벗어나 하단 모서리에
       흰 띠가 새어 나오는 문제를 일으킨다 (CLAUDE.md Device edge integrity). */
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[var(--ss-border)] bg-[var(--ss-panel)] pb-8 pt-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.screen)}
            aria-current={isActive ? "page" : undefined}
            className={`ss-focusable flex flex-1 flex-col items-center gap-[4px] py-1 transition-colors ${
              isActive ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"
            }`}
          >
            <span className="relative">
              <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
              {tab.key === "notifications" && unread > 0 && (
                <span className="ss-mono absolute -right-2 -top-1.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full border border-[var(--ss-bg)] bg-[var(--ss-accent)] px-[3px] text-[9px] font-bold leading-none text-[#0a0a0a]">
                  {unread}
                </span>
              )}
            </span>
            <span className="ss-mono text-[9.5px] font-semibold leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
