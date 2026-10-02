"use client";

import { useState } from "react";
import {
  ChatCenteredText,
  Gauge,
  IdentificationCard,
  Ruler,
  Storefront,
  SignOut,
} from "@phosphor-icons/react";
import "@/projects/commerce/pawfit/styles/pawfit.css";
import { AdminDashboard } from "@/projects/commerce/pawfit/components/admin/admin-dashboard";
import { AdminSizeRules } from "@/projects/commerce/pawfit/components/admin/admin-size-rules";
import { AdminProducts } from "@/projects/commerce/pawfit/components/admin/admin-products";
import { AdminMembers } from "@/projects/commerce/pawfit/components/admin/admin-members";
import { AdminFeedback } from "@/projects/commerce/pawfit/components/admin/admin-feedback";

export type AdminTab = "dashboard" | "sizeRules" | "products" | "members" | "feedback";

const TABS: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
  { key: "dashboard", label: "대시보드", icon: Gauge },
  { key: "sizeRules", label: "사이즈 기준표", icon: Ruler },
  { key: "products", label: "상품 관리", icon: Storefront },
  { key: "members", label: "회원 관리", icon: IdentificationCard },
  { key: "feedback", label: "피드백 관리", icon: ChatCenteredText },
];

export function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  return (
    <div className="pawfit flex min-h-dvh flex-col bg-[var(--pf-canvas)] text-[var(--pf-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--pf-hairline)] bg-[var(--pf-canvas)]">
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-4 px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--pf-ink)] text-white">
              <Storefront size={16} weight="fill" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">
              PawFit
              <span className="ml-1.5 rounded-full bg-[var(--pf-surface-card)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--pf-muted)]">
                관리자 페이지
              </span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-[13px] font-semibold leading-tight">한서진</span>
              <span className="block text-[11.5px] leading-tight text-[var(--pf-muted)]">
                운영팀 매니저
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[13px] font-semibold text-[var(--pf-ink)]">
              한
            </span>
            <button
              type="button"
              aria-label="로그아웃"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface-card)] hover:text-[var(--pf-ink)]"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-4 py-6 lg:flex-row lg:px-8 lg:py-8">
        <nav className="pf-scroll-x lg:sticky lg:top-[84px] lg:h-fit lg:w-[220px] lg:shrink-0">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {TABS.map((item) => (
              <li key={item.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(item.key)}
                  aria-current={tab === item.key ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors lg:rounded-[8px] ${
                    tab === item.key
                      ? "bg-[var(--pf-ink)] text-white"
                      : "border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] text-[var(--pf-muted)] hover:text-[var(--pf-ink)] lg:border-transparent lg:bg-transparent"
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
          {tab === "dashboard" && <AdminDashboard />}
          {tab === "sizeRules" && <AdminSizeRules />}
          {tab === "products" && <AdminProducts />}
          {tab === "members" && <AdminMembers />}
          {tab === "feedback" && <AdminFeedback />}
        </main>
      </div>
    </div>
  );
}
