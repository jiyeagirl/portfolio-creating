"use client";

import { useState } from "react";
import {
  ArrowsClockwise,
  Gauge,
  IdentificationCard,
  List,
  MagnifyingGlass,
  Package,
  Stack,
  Mountains,
  ShieldWarning,
  X,
} from "@phosphor-icons/react";
import { ADMIN_NAV, type AdminScreen } from "@/projects/commerce/snowpeak/lib/navigation";

const NAV_ICON: Record<AdminScreen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: Gauge,
  reservations: Stack,
  products: Package,
  members: IdentificationCard,
  inventory: Mountains,
  erp: ArrowsClockwise,
};

/**
 * 관리자 백오피스 셸. 사용자 콘솔과 완전히 분리된 영역이라는 신호로
 * 사이드바를 잉크 네이비블랙(--sp-rail)으로 반전시킨다(assetflow의 다크 반전 표면 관례).
 */
export function AdminShell({
  screen,
  onNavigate,
  children,
}: {
  screen: AdminScreen;
  onNavigate: (next: AdminScreen) => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (
    <ul className="space-y-px">
      {ADMIN_NAV.map((item) => {
        const Icon = NAV_ICON[item.key];
        const active = item.key === screen;
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => {
                onNavigate(item.key);
                setMenuOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-[13.5px] transition-colors ${
                active
                  ? "bg-[var(--sp-rail-active)] font-medium text-[var(--sp-rail-fg)]"
                  : "text-[var(--sp-rail-mute)] hover:bg-[var(--sp-rail-hover)] hover:text-[var(--sp-rail-fg)]"
              }`}
            >
              <Icon size={15} weight={active ? "fill" : "bold"} />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const sideFoot = (
    <div className="mt-8 rounded-[8px] border border-[var(--sp-rail-border)] bg-[var(--sp-rail-hover)] p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--sp-rail-fg)]">
        <ShieldWarning size={13} weight="bold" />
        조치 필요
      </p>
      <ul className="mt-2.5 space-y-1.5">
        {[
          { label: "재고 부족", count: 2 },
          { label: "ERP 동기화 실패", count: 1 },
          { label: "환불 대기", count: 1 },
        ].map((item) => (
          <li key={item.label} className="flex items-center justify-between text-[12px]">
            <span className="text-[var(--sp-rail-mute)]">{item.label}</span>
            <span className="sp-num font-medium text-[var(--sp-rail-fg)]">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="snowpeak flex min-h-dvh">
      {/* 데스크탑 사이드바 */}
      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto bg-[var(--sp-rail)] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--sp-accent)] text-white">
            <Mountains size={17} weight="fill" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.03em] text-[var(--sp-rail-fg)]">SnowPeak</p>
            <p className="sp-num text-[10.5px] uppercase tracking-[0.1em] text-[var(--sp-rail-mute)]">Admin Console</p>
          </div>
        </div>
        {nav}
        {sideFoot}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--sp-rail-border)] px-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sp-rail-active)] text-[12px] font-medium text-[var(--sp-rail-fg)]">
            민서
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-[var(--sp-rail-fg)]">오민서</p>
            <p className="truncate text-[11px] text-[var(--sp-rail-mute)]">운영팀 | 슈퍼관리자</p>
          </div>
        </div>
      </aside>

      {/* 모바일 사이드바 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"
          />
          <div className="sp-admin-enter relative h-full w-[264px] overflow-y-auto bg-[var(--sp-rail)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--sp-accent)] text-white">
                  <Mountains size={15} weight="fill" />
                </span>
                <span className="text-[14px] font-semibold tracking-[-0.03em] text-[var(--sp-rail-fg)]">SnowPeak Admin</span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--sp-rail-border)] text-[var(--sp-rail-fg)]"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
            {sideFoot}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--sp-border)] bg-[var(--sp-bg)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--sp-border)] text-[var(--sp-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--sp-ink)]">{ADMIN_NAV.find((item) => item.key === screen)?.label}</p>

          <div className="relative ml-auto hidden w-[280px] md:block">
            <MagnifyingGlass size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
            <input
              placeholder="예약번호, 상품, 회원 검색"
              className="h-8 w-full rounded-[6px] border border-[var(--sp-border)] bg-[var(--sp-surface-soft)] pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[var(--sp-mute)] focus:border-[var(--sp-border-strong)] focus:bg-[var(--sp-surface)]"
            />
          </div>

          <span className="sp-num ml-auto shrink-0 text-[12px] text-[var(--sp-mute)] md:ml-0">2023. 10. 15 10:14 KST</span>
        </header>

        <main className="flex-1 bg-[var(--sp-bg)] px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
