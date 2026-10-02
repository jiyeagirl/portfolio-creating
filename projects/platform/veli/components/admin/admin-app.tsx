"use client";

import { useState } from "react";
import {
  ChatCenteredText,
  Gauge,
  IdentificationCard,
  PhoneCall,
  Receipt,
  ShieldCheck,
  SignOut,
} from "@phosphor-icons/react";
import "@/projects/platform/veli/styles/veli.css";
import { AdminDashboard } from "@/projects/platform/veli/components/admin/admin-dashboard";
import { AdminMembers } from "@/projects/platform/veli/components/admin/admin-members";
import { AdminNumbers } from "@/projects/platform/veli/components/admin/admin-numbers";
import { AdminCalls } from "@/projects/platform/veli/components/admin/admin-calls";
import { AdminBilling } from "@/projects/platform/veli/components/admin/admin-billing";
import { AdminOperations } from "@/projects/platform/veli/components/admin/admin-operations";

export type AdminTab = "dashboard" | "members" | "numbers" | "calls" | "billing" | "operations";

const TABS: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
  { key: "dashboard", label: "대시보드", icon: Gauge },
  { key: "members", label: "회원 관리", icon: IdentificationCard },
  { key: "numbers", label: "안심번호 관리", icon: ShieldCheck },
  { key: "calls", label: "통화 관리", icon: PhoneCall },
  { key: "billing", label: "결제 관리", icon: Receipt },
  { key: "operations", label: "운영 관리", icon: ChatCenteredText },
];

export function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  return (
    <div className="veli flex min-h-dvh flex-col bg-[var(--vl-canvas)] text-[var(--vl-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--vl-border)] bg-[var(--vl-elevated)]">
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-4 px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--vl-accent)] text-white">
              <ShieldCheck size={17} weight="fill" />
            </span>
            <span className="text-[17px] font-bold tracking-tight">
              VELI
              <span className="ml-1.5 rounded-full bg-[var(--vl-surface)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--vl-muted)]">
                관리자 페이지
              </span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-[13px] font-bold leading-tight">한서진</span>
              <span className="block text-[11.5px] leading-tight text-[var(--vl-muted)]">
                운영팀 매니저
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[13px] font-bold text-[var(--vl-accent)]">
              한
            </span>
            <button
              type="button"
              aria-label="로그아웃"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--vl-muted)] transition-colors hover:bg-[var(--vl-surface)] hover:text-[var(--vl-ink)]"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-4 py-6 lg:flex-row lg:px-8 lg:py-8">
        <nav className="vl-scroll-x lg:sticky lg:top-[84px] lg:h-fit lg:w-[220px] lg:shrink-0">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {TABS.map((item) => (
              <li key={item.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(item.key)}
                  aria-current={tab === item.key ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors lg:rounded-[8px] ${
                    tab === item.key
                      ? "bg-[var(--vl-accent)] text-[var(--vl-accent-fg)]"
                      : "border border-[var(--vl-border)] bg-[var(--vl-elevated)] text-[var(--vl-muted)] hover:text-[var(--vl-ink)] lg:border-transparent lg:bg-transparent"
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
          {tab === "members" && <AdminMembers />}
          {tab === "numbers" && <AdminNumbers />}
          {tab === "calls" && <AdminCalls />}
          {tab === "billing" && <AdminBilling />}
          {tab === "operations" && <AdminOperations />}
        </main>
      </div>
    </div>
  );
}
