"use client";

import { useState } from "react";
import {
  Bell,
  Broadcast,
  Buildings,
  ChartBar,
  Gauge,
  HardHat,
  List,
  MagnifyingGlass,
  SignOut,
  UsersThree,
  Warning,
  X,
} from "@phosphor-icons/react";
import "@/projects/monitoring/safesense/styles/safesense.css";
import { AdminDashboard } from "@/projects/monitoring/safesense/components/admin/admin-dashboard";
import { AdminMonitoring } from "@/projects/monitoring/safesense/components/admin/admin-monitoring";
import { AdminEvents } from "@/projects/monitoring/safesense/components/admin/admin-events";
import { AdminWorkers } from "@/projects/monitoring/safesense/components/admin/admin-workers";
import { AdminStats } from "@/projects/monitoring/safesense/components/admin/admin-stats";
import { AdminSites } from "@/projects/monitoring/safesense/components/admin/admin-sites";
import { events, workers } from "@/projects/monitoring/safesense/lib/mock-data";

export type AdminTab = "dashboard" | "monitoring" | "events" | "workers" | "stats" | "sites";

const NAV: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
  { key: "dashboard", label: "메인 대시보드", icon: Gauge },
  { key: "monitoring", label: "실시간 관제", icon: Broadcast },
  { key: "events", label: "이벤트 관리", icon: Warning },
  { key: "workers", label: "근로자 관리", icon: UsersThree },
  { key: "stats", label: "통계 분석", icon: ChartBar },
  { key: "sites", label: "현장 관리", icon: Buildings },
];

export function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeEvents = events.filter((e) => e.status === "active").length;

  function go(next: AdminTab) {
    setTab(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ss-accent)] bg-[var(--ss-accent-wash)]">
          <HardHat size={16} weight="fill" className="text-[var(--ss-accent)]" />
        </span>
        <span className="ss-display text-[15px] text-[var(--ss-foreground)]">SAFESENSE</span>
        <span className="ss-mono ml-auto rounded-full border border-[var(--ss-border-strong)] px-1.5 py-0.5 text-[9px] text-[var(--ss-muted)]">
          ADMIN
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 pt-3">
        <p className="ss-mono px-3 pb-2 text-[9.5px] text-[var(--ss-muted)]">관제 콘솔</p>
        <div className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.key)}
                className={`ss-press ss-mono flex items-center gap-3 rounded-[8px] border px-3 py-2.5 text-[11px] font-semibold transition-colors ${
                  active
                    ? "border-[var(--ss-accent)] bg-[var(--ss-accent-wash)] text-[var(--ss-accent)]"
                    : "border-transparent text-[var(--ss-muted)]"
                }`}
              >
                <item.icon size={16} weight={active ? "fill" : "regular"} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === "events" && activeEvents > 0 && (
                  <span className="rounded-full bg-[var(--ss-accent)] px-1.5 py-[1px] text-[10px] font-bold text-[#0a0a0a]">
                    {activeEvents}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[var(--ss-border)] px-6 py-5">
        <p className="ss-mono text-[11px] font-semibold text-[var(--ss-foreground)]">오세연</p>
        <p className="ss-mono mt-1 text-[9.5px] text-[var(--ss-muted)]">안전관리 담당</p>
        <button className="ss-mono mt-4 inline-flex items-center gap-1.5 text-[10.5px] text-[var(--ss-muted)]">
          <SignOut size={13} />
          로그아웃
        </button>
      </div>
    </div>
  );

  return (
    <div className="safesense flex min-h-dvh bg-[var(--ss-bg)]">
      <aside className="hidden w-[236px] shrink-0 border-r border-[var(--ss-border)] bg-[var(--ss-panel)] lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[236px] border-r border-[var(--ss-border)] bg-[var(--ss-panel)]">{sidebar}</div>
          <button aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="flex-1 bg-black/60" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--ss-border)] bg-[var(--ss-bg)] px-5 lg:px-8">
          <button
            aria-label="메뉴"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--ss-border-strong)] text-[var(--ss-foreground)] lg:hidden"
          >
            {menuOpen ? <X size={16} /> : <List size={16} />}
          </button>

          <p className="ss-mono hidden shrink-0 items-center gap-2 text-[10.5px] text-[var(--ss-muted)] sm:flex">
            관제 콘솔
            <span>/</span>
            <span className="font-semibold text-[var(--ss-foreground)]">
              {NAV.find((n) => n.key === tab)?.label}
            </span>
          </p>

          <div className="ml-auto flex min-w-0 items-center gap-3">
            <span className="hidden min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-[var(--ss-border-strong)] bg-[var(--ss-panel)] px-3 py-2 sm:flex lg:max-w-[260px]">
              <MagnifyingGlass size={13} className="shrink-0 text-[var(--ss-muted)]" />
              <input
                placeholder="근로자, 이벤트, 현장 검색"
                aria-label="관제 콘솔 통합 검색"
                className="ss-mono w-full min-w-0 bg-transparent text-[11px] text-[var(--ss-foreground)] outline-none placeholder:text-[var(--ss-muted)]"
              />
            </span>
            <button
              aria-label="알림"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ss-border-strong)] text-[var(--ss-muted)]"
            >
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[var(--ss-accent)]" />
            </button>
            <span className="hidden h-8 w-px shrink-0 bg-[var(--ss-border)] sm:block" />
            <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <span className="ss-mono flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ss-border-strong)] bg-[var(--ss-panel-2)] text-[11px] font-bold text-[var(--ss-foreground)]">
                오
              </span>
              <span className="ss-mono text-[11px] font-semibold text-[var(--ss-foreground)]">오세연</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8 lg:py-10">
          {tab === "dashboard" && <AdminDashboard onGo={go} />}
          {tab === "monitoring" && <AdminMonitoring />}
          {tab === "events" && <AdminEvents />}
          {tab === "workers" && <AdminWorkers workers={workers} />}
          {tab === "stats" && <AdminStats />}
          {tab === "sites" && <AdminSites />}
        </main>

        <footer className="border-t border-[var(--ss-border)] px-5 py-5 lg:px-8">
          <p className="ss-mono text-[10px] text-[var(--ss-muted)]">
            SAFESENSE 관제 콘솔, 포트폴리오용 목업으로 실제 근로자 데이터가 아닙니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
