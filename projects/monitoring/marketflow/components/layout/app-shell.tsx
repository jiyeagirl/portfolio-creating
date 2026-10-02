"use client";

import { useState } from "react";
import {
  Bell,
  CalendarBlank,
  ChatCircleDots,
  Database,
  Gauge,
  Gear,
  List,
  MagicWand,
  Megaphone,
  NotePencil,
  Plus,
  Sparkle,
  Users,
  Warning,
  X,
} from "@phosphor-icons/react";
import { Mark } from "@/projects/monitoring/marketflow/components/layout/mark";
import { Avatar, Badge } from "@/projects/monitoring/marketflow/components/ui";
import { NAV, NAV_GROUPS, type Navigate, type Screen } from "@/projects/monitoring/marketflow/lib/navigation";
import { activityLog, contentItems, dataSources, workflows } from "@/projects/monitoring/marketflow/lib/mock-data";

const NAV_ICON: Record<Screen, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  dashboard: Gauge,
  generate: MagicWand,
  calendar: CalendarBlank,
  editor: NotePencil,
  crm: Users,
  workflow: Sparkle,
  prompts: ChatCircleDots,
  collection: Database,
  settings: Gear,
};

function timeAgo(iso: string) {
  const diffMs = new Date("2025-09-08T09:32:00").getTime() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}분 전`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.round(hours / 24)}일 전`;
}

export function AppShell({
  screen,
  onNavigate,
  children,
}: {
  screen: Screen;
  onNavigate: Navigate;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const pendingApproval = contentItems.filter((c) => c.status === "pending").length;
  const workflowErrors = workflows.filter((w) => w.status === "error").length;
  const sourceErrors = dataSources.filter((s) => s.status === "error").length;

  const nav = (
    <nav className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <p className="mf-mono px-3 text-[11px] uppercase tracking-[0.08em] text-[var(--mf-on-dark-soft)]">{group}</p>
          <ul className="mt-2 space-y-px">
            {NAV.filter((item) => item.group === group).map((item) => {
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
                        ? "bg-[var(--mf-surface-dark-elevated)] font-medium text-[var(--mf-on-dark)]"
                        : "text-[var(--mf-on-dark-soft)] hover:bg-[var(--mf-surface-dark-soft)] hover:text-[var(--mf-on-dark)]"
                    }`}
                  >
                    <Icon size={15} weight={active ? "fill" : "bold"} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const actionCard = (
    <div className="mt-8 rounded-[8px] border border-[var(--mf-dark-hairline)] bg-[var(--mf-surface-dark-elevated)] p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--mf-on-dark)]">
        <Warning size={13} weight="bold" />
        조치 필요
      </p>
      <ul className="mt-2.5 space-y-1.5">
        <li className="flex items-center justify-between text-[12px]">
          <span className="text-[var(--mf-on-dark-soft)]">승인 대기 콘텐츠</span>
          <span className="mf-mono font-medium text-[var(--mf-on-dark)]">{pendingApproval}</span>
        </li>
        <li className="flex items-center justify-between text-[12px]">
          <span className="text-[var(--mf-on-dark-soft)]">오류 발생 워크플로우</span>
          <span className="mf-mono font-medium text-[var(--mf-on-dark)]">{workflowErrors}</span>
        </li>
        <li className="flex items-center justify-between text-[12px]">
          <span className="text-[var(--mf-on-dark-soft)]">수집 오류 소스</span>
          <span className="mf-mono font-medium text-[var(--mf-on-dark)]">{sourceErrors}</span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="marketflow flex min-h-dvh">
      {/* 데스크탑 사이드바 — 잉크 반전(다크). 이 프로젝트는 단일 관리자 콘솔이라 전역에 적용한다. */}
      <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col overflow-y-auto bg-[var(--mf-surface-dark)] px-3 py-5 lg:flex">
        <div className="flex items-center gap-2 px-3 pb-6">
          <Mark size={22} tone="light" />
          <div>
            <p className="text-[14px] font-semibold leading-4 tracking-[-0.02em] text-[var(--mf-on-dark)]">MarketFlow</p>
            <p className="mf-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--mf-on-dark-soft)]">Ops Console</p>
          </div>
        </div>
        {nav}
        {actionCard}
        <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--mf-dark-hairline)] px-3 pt-4">
          <Avatar name="박서연" size={32} />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-[var(--mf-on-dark)]">박서연</p>
            <p className="truncate text-[11px] text-[var(--mf-on-dark-soft)]">콘텐츠운영팀 | 슈퍼관리자</p>
          </div>
        </div>
      </aside>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[rgba(20,20,19,0.5)]"
          />
          <div className="mf-enter relative h-full w-[264px] overflow-y-auto bg-[var(--mf-surface-dark)] px-3 py-5">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <Mark size={20} tone="light" />
                <span className="text-[14px] font-semibold tracking-[-0.02em] text-[var(--mf-on-dark)]">MarketFlow</span>
              </span>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-dark-hairline)] text-[var(--mf-on-dark)]"
              >
                <X size={13} />
              </button>
            </div>
            {nav}
            {actionCard}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--mf-hairline)] bg-[var(--mf-canvas)] px-4 lg:px-8">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] lg:hidden"
          >
            <List size={14} />
          </button>

          <p className="text-[13.5px] font-medium text-[var(--mf-ink)]">{NAV.find((item) => item.key === screen)?.label}</p>

          <div className="relative ml-auto">
            <button
              type="button"
              aria-label={`알림 ${activityLog.length}건`}
              onClick={() => setNoticeOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] transition-colors hover:bg-[var(--mf-soft)]"
            >
              <Bell size={15} />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--mf-primary)] px-1 mf-mono text-[10px] font-medium text-white">
                {pendingApproval + workflowErrors}
              </span>
            </button>

            {noticeOpen && (
              <>
                <button
                  type="button"
                  aria-label="알림 닫기"
                  onClick={() => setNoticeOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div className="mf-enter absolute right-0 top-11 z-50 w-[360px] overflow-hidden rounded-[8px] border border-[var(--mf-hairline)] bg-[var(--mf-canvas)] shadow-[var(--mf-shadow-pop)]">
                  <p className="border-b border-[var(--mf-hairline)] px-4 py-3 text-[13px] font-medium text-[var(--mf-ink)]">
                    최근 활동
                  </p>
                  <ul className="max-h-[360px] overflow-y-auto">
                    {activityLog.slice(0, 8).map((entry) => (
                      <li key={entry.id} className="border-b border-[var(--mf-hairline)] px-4 py-3 last:border-b-0">
                        <p className="text-[13px] leading-5 text-[var(--mf-ink)]">
                          <span className="font-medium">{entry.actor}</span>
                          {"  "}
                          {entry.action}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] leading-4 text-[var(--mf-body)]">{entry.target}</p>
                        <p className="mt-1 mf-mono text-[11px] text-[var(--mf-mute)]">{timeAgo(entry.at)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate("generate")}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[6px] border border-[var(--mf-primary)] bg-[var(--mf-primary)] px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--mf-primary-active)]"
          >
            <Plus size={14} weight="bold" />
            <span className="hidden sm:inline">새 콘텐츠 생성</span>
          </button>

          <span className="hidden items-center gap-1.5 rounded-full bg-[var(--mf-soft-2)] px-2.5 py-1 text-[11px] text-[var(--mf-mute)] md:flex">
            <Megaphone size={12} />
            2025. 09. 08 (월) 09:32 KST
          </span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "info" | "warn" | "danger" | "ink" | "neutral"; children: React.ReactNode }) {
  return <Badge tone={tone}>{children}</Badge>;
}
