"use client";

import { useState } from "react";
import {
  Bell,
  CalendarBlank,
  ChartLineUp,
  Flag,
  List,
  Megaphone,
  SignOut,
  Storefront,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import "@/projects/community/locly/styles/locly.css";
import { ADMIN_REPORTS, NEIGHBORHOOD } from "@/projects/community/locly/lib/mock-data";
import { LoclyMark } from "@/projects/community/locly/components/site/ui";
import { AdminOverview } from "@/projects/community/locly-admin/components/admin-overview";
import { AdminMembers } from "@/projects/community/locly-admin/components/admin-members";
import { AdminPosts } from "@/projects/community/locly-admin/components/admin-posts";
import { AdminEvents } from "@/projects/community/locly-admin/components/admin-events";
import { AdminStores } from "@/projects/community/locly-admin/components/admin-stores";
import { AdminCivic } from "@/projects/community/locly-admin/components/admin-civic";
import { SearchField } from "@/projects/community/locly-admin/components/admin-ui";
import type { AdminSection } from "@/projects/community/locly-admin/components/admin-ui";

const NAV: { section: AdminSection; label: string; icon: Icon; group: string }[] = [
  { section: "overview", label: "운영 현황", icon: ChartLineUp, group: "대시보드" },
  { section: "members", label: "회원 관리", icon: UsersThree, group: "운영" },
  { section: "posts", label: "게시글 · 신고", icon: Flag, group: "운영" },
  { section: "events", label: "행사 관리", icon: CalendarBlank, group: "콘텐츠" },
  { section: "stores", label: "동네 가게", icon: Storefront, group: "콘텐츠" },
  { section: "civic", label: "주민참여", icon: Megaphone, group: "콘텐츠" },
];

const GROUPS = ["대시보드", "운영", "콘텐츠"];

const OPERATOR = { name: "김나인", role: "나인구청 소통협력관" };

export default function LoclyAdmin() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingReports = ADMIN_REPORTS.filter((r) => r.status === "대기").length;
  const currentLabel = NAV.find((item) => item.section === section)?.label ?? "";

  function go(next: AdminSection) {
    setSection(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6">
        <LoclyMark size={17} className="text-[var(--lc-primary)]" />
        <span className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--lc-on-dark)]">
          LOCLY
        </span>
        <span className="ml-1 rounded-full bg-[var(--lc-dark-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--lc-on-dark-soft)]">
          운영자
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 pt-2">
        {GROUPS.map((group) => (
          <div key={group} className="mb-6">
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--lc-on-dark-soft)]/70">
              {group}
            </p>
            <div className="flex flex-col gap-0.5">
              {NAV.filter((item) => item.group === group).map((item) => {
                const NavIcon = item.icon;
                const active = section === item.section;
                return (
                  <button
                    key={item.section}
                    onClick={() => go(item.section)}
                    className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[14px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--lc-dark-elevated)] text-[var(--lc-on-dark)]"
                        : "text-[var(--lc-on-dark-soft)]"
                    }`}
                  >
                    <NavIcon size={16} weight={active ? "fill" : "regular"} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.section === "posts" && pendingReports > 0 && (
                      <span className="rounded-full bg-[var(--lc-primary)] px-1.5 py-[1px] text-[11px] font-semibold text-[var(--lc-on-primary)]">
                        {pendingReports}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--lc-hairline-dark)] px-6 py-5">
        <p className="text-[13px] font-medium text-[var(--lc-on-dark)]">{OPERATOR.name}</p>
        <p className="mt-1 text-[12px] text-[var(--lc-on-dark-soft)]">{OPERATOR.role}</p>
        {/* No link back to the resident site — the two services have separate
            addresses and separate accounts (spec.md §1). */}
        <button className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--lc-on-dark-soft)]">
          <SignOut size={14} />
          로그아웃
        </button>
      </div>
    </div>
  );

  return (
    <div className="locly flex min-h-dvh bg-[var(--lc-surface-soft)]">
      {/* The dark column stretches the full page height so a full-page capture
          never shows it stopping mid-scroll; the inner panel is what sticks. */}
      <aside className="hidden w-[248px] shrink-0 bg-[var(--lc-dark)] lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[248px] bg-[var(--lc-dark)]">{sidebar}</div>
          <button
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="flex-1 bg-[rgba(20,20,19,0.4)]"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--lc-hairline)] bg-[var(--lc-canvas)] px-5 lg:px-8">
          <button
            aria-label="메뉴"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--lc-ink)] lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <List size={18} />}
          </button>

          <p className="hidden shrink-0 items-center gap-2 text-[13px] text-[var(--lc-muted)] sm:flex">
            운영자 콘솔
            <span className="text-[var(--lc-muted-soft)]">/</span>
            <span className="font-medium text-[var(--lc-ink)]">{currentLabel}</span>
          </p>

          <div className="ml-auto flex min-w-0 items-center gap-3">
            <span className="hidden min-w-0 flex-1 sm:flex">
              <SearchField value={query} onChange={setQuery} placeholder="회원, 게시글, 가게 검색" />
            </span>
            <button
              aria-label="운영 알림"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--lc-muted)]"
            >
              <Bell size={18} />
              {pendingReports > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--lc-primary)]" />
              )}
            </button>
            <span className="hidden h-8 w-px shrink-0 bg-[var(--lc-hairline)] sm:block" />
            <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lc-dark)] text-[13px] font-medium text-[var(--lc-on-dark)]">
                {OPERATOR.name.charAt(0)}
              </span>
              <span className="text-[13px] font-medium text-[var(--lc-ink)]">{OPERATOR.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8 lg:py-10">
          {section === "overview" && <AdminOverview onSection={go} />}
          {section === "members" && <AdminMembers />}
          {section === "posts" && <AdminPosts />}
          {section === "events" && <AdminEvents />}
          {section === "stores" && <AdminStores />}
          {section === "civic" && <AdminCivic />}
        </main>

        <footer className="border-t border-[var(--lc-hairline)] px-5 py-5 lg:px-8">
          <p className="text-[12px] text-[var(--lc-muted-soft)]">
            LOCLY 운영자 콘솔 · {NEIGHBORHOOD} · 포트폴리오용 목업으로 실제 회원 데이터가 아닙니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
