"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Coins,
  Gauge,
  IdentificationCard,
  MagnifyingGlass,
  SignOut,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import "@/projects/platform/lumi/styles/lumi.css";
import { ADMIN_TODAY } from "@/projects/platform/lumi/lib/mock-data";
import { AdminDashboard } from "@/projects/platform/lumi/components/admin/admin-dashboard";
import { AdminExperts } from "@/projects/platform/lumi/components/admin/admin-experts";
import { AdminReservations } from "@/projects/platform/lumi/components/admin/admin-reservations";
import { AdminSettlements } from "@/projects/platform/lumi/components/admin/admin-settlements";
import { AdminPolicies } from "@/projects/platform/lumi/components/admin/admin-policies";

export type AdminTab = "dashboard" | "experts" | "reservations" | "settlements" | "policies";

const TABS: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
  { key: "dashboard", label: "대시보드", icon: Gauge },
  { key: "experts", label: "상담사 관리", icon: IdentificationCard },
  { key: "reservations", label: "예약 · 상담", icon: CalendarCheck },
  { key: "settlements", label: "정산 관리", icon: Coins },
  { key: "policies", label: "운영 정책", icon: SlidersHorizontal },
];

export function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  return (
    <div className="lumi flex min-h-dvh flex-col bg-[var(--lm-canvas)] text-[var(--lm-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--lm-border)] bg-[var(--lm-elevated)]">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-4 px-6 lg:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--lm-accent)] text-[15px] font-extrabold text-[var(--lm-accent-fg)]">
              L
            </span>
            <span className="text-[17px] font-bold tracking-tight">
              LUMI
              <span className="ml-1.5 rounded-full bg-[var(--lm-surface)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--lm-muted)]">
                운영 콘솔
              </span>
            </span>
          </div>

          <div className="ml-6 hidden min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[var(--lm-border)] bg-[var(--lm-canvas)] px-3.5 py-2 md:flex lg:max-w-[320px]">
            <MagnifyingGlass size={15} className="shrink-0 text-[var(--lm-muted)]" />
            <input
              placeholder="회원, 상담사, 예약번호 검색"
              aria-label="관리자 통합 검색"
              className="w-full bg-transparent text-[13px] text-[var(--lm-ink)] outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full bg-[var(--lm-live-soft)] px-3 py-1.5 text-[12px] font-bold text-[var(--lm-live)] sm:flex">
              진행 중 상담 {ADMIN_TODAY.liveSessions}건
            </span>
            <span className="hidden text-right sm:block">
              <span className="block text-[13px] font-bold leading-tight">한서진</span>
              <span className="block text-[11.5px] leading-tight text-[var(--lm-muted)]">
                운영팀 매니저
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lm-surface)] text-[13px] font-bold">
              한
            </span>
            <button
              type="button"
              aria-label="로그아웃"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--lm-muted)] transition-colors hover:bg-[var(--lm-surface)] hover:text-[var(--lm-ink)]"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-6 py-8 lg:flex-row lg:px-10">
        <nav className="lg:sticky lg:top-[88px] lg:h-fit lg:w-[212px] lg:shrink-0">
          <ul className="lm-scroll-x flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {TABS.map((item) => (
              <li key={item.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(item.key)}
                  aria-current={tab === item.key ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors lg:rounded-xl ${
                    tab === item.key
                      ? "bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                      : "border border-[var(--lm-border)] bg-[var(--lm-elevated)] text-[var(--lm-muted)] hover:text-[var(--lm-ink)] lg:border-transparent lg:bg-transparent"
                  }`}
                >
                  <item.icon size={16} weight={tab === item.key ? "fill" : "regular"} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          {tab === "dashboard" && <AdminDashboard onGo={setTab} />}
          {tab === "experts" && <AdminExperts />}
          {tab === "reservations" && <AdminReservations />}
          {tab === "settlements" && <AdminSettlements />}
          {tab === "policies" && <AdminPolicies />}
        </main>
      </div>
    </div>
  );
}
