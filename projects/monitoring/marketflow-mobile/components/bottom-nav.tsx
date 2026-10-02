"use client";

import { Bell, House, SquaresFour, User } from "@phosphor-icons/react";
import type {
  MarketflowMobileNavigate,
  TabKey,
} from "@/projects/monitoring/marketflow-mobile/lib/navigation";

const TABS: { key: TabKey; label: string; icon: typeof House }[] = [
  { key: "home", label: "홈", icon: House },
  { key: "approvals", label: "승인함", icon: SquaresFour },
  { key: "notifications", label: "알림", icon: Bell },
  { key: "mypage", label: "마이", icon: User },
];

export function BottomNav({
  active,
  onNavigate,
  approvalCount,
  unreadCount,
}: {
  active: TabKey;
  onNavigate: MarketflowMobileNavigate;
  approvalCount: number;
  unreadCount: number;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] pb-8 pt-2.5">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const badge =
          tab.key === "approvals" ? approvalCount : tab.key === "notifications" ? unreadCount : 0;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.key)}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
              isActive ? "text-[var(--mfm-primary)]" : "text-[var(--mfm-muted)]"
            }`}
          >
            <span className="relative">
              <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
              {badge > 0 && (
                <span className="mfm-tabular absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--mfm-primary)] px-1 text-[9.5px] font-bold leading-none text-[var(--mfm-on-primary)]">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </span>
            <span className="text-[10.5px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
