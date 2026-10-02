"use client";

import { useState } from "react";
import {
  Bell,
  Broadcast,
  Gauge,
  HeartStraight,
  List,
  MagnifyingGlass,
  SignOut,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import "@/projects/monitoring/caresignal/styles/caresignal.css";
import { AdminDashboard } from "@/projects/monitoring/caresignal/components/admin/admin-dashboard";
import { AdminUsers } from "@/projects/monitoring/caresignal/components/admin/admin-users";
import { AdminMonitoring } from "@/projects/monitoring/caresignal/components/admin/admin-monitoring";
import { agency, summary } from "@/projects/monitoring/caresignal/lib/admin-data";

export type AdminTab = "dashboard" | "users" | "monitoring";

const NAV: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
  { key: "dashboard", label: "관리자 대시보드", icon: Gauge },
  { key: "users", label: "사용자 관리", icon: UsersThree },
  { key: "monitoring", label: "실시간 모니터링", icon: Broadcast },
];

export function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  function go(next: AdminTab) {
    setTab(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#0066cc]">
          <HeartStraight size={16} weight="fill" className="text-white" />
        </span>
        <span className="text-[16px] font-semibold tracking-[-0.01em] text-white">CareSignal</span>
        <span className="ml-auto rounded-full bg-[#3a3a3c] px-2 py-0.5 text-[10.5px] font-semibold text-[#cccccc]">
          관리자
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 pt-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a7a]">
          한빛종합사회복지관
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.key)}
                className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[14px] font-normal transition-colors ${
                  active ? "bg-[#2a2a2c] font-semibold text-white" : "text-[#cccccc]"
                }`}
              >
                <item.icon size={17} weight={active ? "fill" : "regular"} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === "users" && summary.statusCounts.danger > 0 && (
                  <span className="rounded-full bg-[#ff3b30] px-1.5 py-[1px] text-[11px] font-semibold text-white">
                    {summary.statusCounts.danger}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#3a3a3c] px-6 py-5">
        <p className="text-[13px] font-semibold text-white">{agency.operator}</p>
        <p className="mt-1 text-[12px] text-[#a1a1a6]">{agency.role}</p>
        <button className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-normal text-[#a1a1a6]">
          <SignOut size={14} />
          로그아웃
        </button>
      </div>
    </div>
  );

  return (
    <div className="caresignal flex min-h-dvh bg-[#fafafc]">
      <aside className="hidden w-[248px] shrink-0 bg-[#1d1d1f] lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[248px] bg-[#1d1d1f]">{sidebar}</div>
          <button aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="flex-1 bg-black/40" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#e0e0e0] bg-white px-5 lg:px-8">
          <button
            aria-label="메뉴"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#1d1d1f] lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <List size={18} />}
          </button>

          <p className="hidden shrink-0 items-center gap-2 text-[13px] text-[#7a7a7a] sm:flex">
            관리자 콘솔
            <span className="text-[#c7c7cc]">/</span>
            <span className="font-semibold text-[#1d1d1f]">
              {NAV.find((n) => n.key === tab)?.label}
            </span>
          </p>

          <div className="ml-auto flex min-w-0 items-center gap-3">
            <span className="hidden min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-[#d2d2d7] bg-white px-3 py-2 sm:flex lg:max-w-[280px]">
              <MagnifyingGlass size={14} className="shrink-0 text-[#7a7a7a]" />
              <input
                placeholder="사용자, 이벤트 검색"
                aria-label="관리자 통합 검색"
                className="w-full min-w-0 bg-transparent text-[13px] text-[#1d1d1f] outline-none placeholder:text-[#a1a1a6]"
              />
            </span>
            <button
              aria-label="관리자 알림"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7a7a7a]"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff3b30]" />
            </button>
            <span className="hidden h-8 w-px shrink-0 bg-[#e0e0e0] sm:block" />
            <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d1d1f] text-[13px] font-semibold text-white">
                {agency.operator.charAt(0)}
              </span>
              <span className="text-[13px] font-semibold text-[#1d1d1f]">{agency.operator}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8 lg:py-10">
          {tab === "dashboard" && <AdminDashboard onGo={go} />}
          {tab === "users" && <AdminUsers />}
          {tab === "monitoring" && <AdminMonitoring />}
        </main>

        <footer className="border-t border-[#e0e0e0] px-5 py-5 lg:px-8">
          <p className="text-[12px] text-[#a1a1a6]">
            CareSignal 관리자 콘솔 · {agency.district} · 포트폴리오용 목업으로 실제 이용자 데이터가
            아닙니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
