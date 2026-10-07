"use client";

import { ClipboardText, PencilSimpleLine, Package } from "@phosphor-icons/react";
import { BUYER } from "@/projects/b2b/partloop/lib/mock-data";
import { NAV_ITEMS, type Navigate, type Screen } from "@/projects/b2b/partloop/lib/navigation";

const NAV_ICON = {
  orders: ClipboardText,
  "new-order": PencilSimpleLine,
} as const;

/* C3 상단 바 + apple_compact global-nav. 검정 44px 바에 12px 링크. 사이드바와 드로어는 없다. */
export function TopBar({ screen, onNavigate }: { screen: Screen; onNavigate: Navigate }) {
  /* 상세 화면은 목록에서 들어왔으므로 내비에서는 발주 현황이 활성이다. */
  const activeKey = screen === "order-detail" ? "orders" : screen;

  return (
    <header className="sticky top-0 z-30 bg-[var(--pl-nav)] text-[var(--pl-on-nav)]">
      <div className="mx-auto flex h-11 max-w-[1152px] items-center gap-4 px-4 sm:gap-8 sm:px-8">
        <button
          type="button"
          onClick={() => onNavigate("orders")}
          className="flex shrink-0 items-center gap-2"
          aria-label="발주 현황으로 이동"
        >
          <Package size={18} weight="fill" />
          <span className="text-[14px] font-semibold tracking-[-0.02em]">PartLoop</span>
        </button>

        <nav className="flex h-full min-w-0 flex-1 items-stretch gap-1 sm:gap-5">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICON[item.key as keyof typeof NAV_ICON];
            const active = item.key === activeKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2 text-[12px] transition-colors sm:px-1 ${
                  active
                    ? "text-[var(--pl-on-nav)]"
                    : "text-[var(--pl-on-nav-muted)] hover:text-[var(--pl-on-nav)]"
                }`}
              >
                <Icon size={14} weight={active ? "fill" : "regular"} className="hidden sm:block" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--pl-tile)] text-[12px] font-semibold"
          >
            {BUYER.manager.slice(0, 1)}
          </span>
          <span className="whitespace-nowrap text-[12px] text-[var(--pl-on-nav-muted)]">
            {BUYER.manager} | {BUYER.company} {BUYER.team}
          </span>
        </div>
      </div>
    </header>
  );
}
