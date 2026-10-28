"use client";

import type { ReactNode } from "react";
import { Bell, ClipboardText, MagnifyingGlass, Robot, Stack, UsersThree } from "@phosphor-icons/react";
import { JOB_SUMMARY, PAYMENT_TOTALS, STAFF } from "@/projects/monitoring/taxdesk/lib/admin-data";
import {
  REVIEW_QUEUES,
  SCREEN_LABEL,
  SECTION_OF,
  queueCount,
  type AdminScreen,
  type ReviewQueue,
  type SectionId,
} from "@/projects/monitoring/taxdesk/components/admin/admin-nav";

const SECTIONS: { id: SectionId; label: string; Icon: typeof Robot; first: AdminScreen }[] = [
  { id: "review", label: "신고 검토", Icon: ClipboardText, first: "review" },
  { id: "auto", label: "자동 신고", Icon: Robot, first: "jobs" },
  { id: "ops", label: "운영", Icon: UsersThree, first: "members" },
];

const SUB: Record<Exclude<SectionId, "review">, { screen: AdminScreen; count?: number; alert?: boolean }[]> = {
  auto: [
    { screen: "jobs", count: JOB_SUMMARY.running + JOB_SUMMARY.failed + JOB_SUMMARY.waiting + JOB_SUMMARY.doneToday + JOB_SUMMARY.queued },
    { screen: "auth", count: JOB_SUMMARY.waiting, alert: true },
    { screen: "mapping", count: 3, alert: true },
    { screen: "automation" },
  ],
  ops: [{ screen: "members" }, { screen: "payments", count: PAYMENT_TOTALS.pending, alert: true }, { screen: "knowledge" }],
};

type Nav = (screen: AdminScreen, queue?: ReviewQueue) => void;

/* 240 다크 사이드바 하나에 섹션 제목과 하위 메뉴를 함께 둔다. 헤더는 본문 컬럼 위에만.
   lg 미만: 섹션은 하단 아이콘 바, 하위 메뉴는 본문 위 가로 세그먼트. */
export function AdminShell({
  screen,
  queue,
  onNavigate,
  children,
}: {
  screen: AdminScreen;
  queue: ReviewQueue;
  onNavigate: Nav;
  children: ReactNode;
}) {
  const section = SECTION_OF[screen];

  return (
    <div className="taxdesk flex min-h-dvh !bg-[var(--td-canvas)] text-[var(--td-ink)]">
      <div className="hidden w-[240px] shrink-0 bg-[var(--td-side)] lg:block">
      <nav aria-label="관리자 메뉴" className="sticky top-0 flex h-dvh flex-col">
        <div className="flex h-[52px] items-center gap-2.5 px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white text-[var(--td-side)]">
            <Stack size={15} weight="fill" />
          </span>
          <span className="text-[15px] font-semibold text-white">TaxDesk</span>
        </div>
        <div className="td-scroll-x flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-5 pt-3">
          {SECTIONS.map(({ id, label, Icon }) => (
            <div key={id}>
              <p className="flex items-center gap-2 px-3 pb-1.5 text-[12px] font-semibold text-[var(--td-side-ink)]">
                <Icon size={15} weight="bold" />
                {label}
              </p>
              <SectionItems section={id} screen={screen} queue={queue} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5 border-t border-white/10 px-5 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--td-side-active)] text-[13px] font-semibold text-white">
            {STAFF.name.slice(0, 1)}
          </span>
          <span className="min-w-0 truncate text-[13px] text-white">
            {STAFF.name} <span className="text-[var(--td-side-ink)]">{STAFF.role}</span>
          </span>
        </div>
      </nav>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between gap-4 border-b border-[var(--td-line)] bg-white px-5 lg:px-8">
          <p className="min-w-0 truncate text-[13px] text-[var(--td-ink-3)]">
            <span className="font-semibold text-[var(--td-ink)]">{STAFF.office}</span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <label className="relative hidden md:block">
              <span className="sr-only">고객, 접수번호 검색</span>
              <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--td-ink-3)]" />
              <input
                placeholder="상호, 사업자번호, 접수번호"
                className="h-8 w-[240px] rounded-[8px] bg-[var(--td-parch)] pl-8 pr-3 text-[13px] placeholder:text-[var(--td-ink-3)] focus:outline-2 focus:outline-[var(--td-blue-focus)]"
              />
            </label>
            <button
              type="button"
              aria-label="알림 4건"
              className="relative flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--td-ink-2)] hover:bg-[var(--td-parch)]"
            >
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--td-stop-fg)] ring-2 ring-white" />
            </button>
            <span className="hidden whitespace-nowrap text-[13px] text-[var(--td-ink-2)] sm:inline">
              {STAFF.name} {STAFF.role}
            </span>
          </div>
        </header>

        <div className="td-scroll-x flex gap-1.5 overflow-x-auto border-b border-[var(--td-line)] bg-white px-5 py-2 lg:hidden">
          <SectionItems section={section} screen={screen} queue={queue} onNavigate={onNavigate} compact />
        </div>

        <main key={screen} className="min-w-0 flex-1 px-5 pb-28 pt-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <nav
        aria-label="관리자 섹션"
        className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-3 bg-[var(--td-side)] lg:hidden"
      >
        {SECTIONS.map(({ id, label, Icon, first }) => {
          const active = section === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(first, id === "review" ? "전체 접수" : undefined)}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] ${active ? "font-semibold text-white" : "text-[var(--td-side-ink)]"}`}
            >
              <Icon size={21} weight={active ? "fill" : "regular"} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function SectionItems({
  section,
  screen,
  queue,
  onNavigate,
  compact = false,
}: {
  section: SectionId;
  screen: AdminScreen;
  queue: ReviewQueue;
  onNavigate: Nav;
  compact?: boolean;
}) {
  const items =
    section === "review"
      ? REVIEW_QUEUES.map((q) => ({
          key: q,
          label: q,
          count: queueCount(q),
          active: screen === "review" && queue === q,
          alert: q === "기한 임박" || q === "보완 요청 중",
          go: () => onNavigate("review", q),
        }))
      : SUB[section].map((s) => ({
          key: s.screen,
          label: SCREEN_LABEL[s.screen],
          count: s.count,
          active: screen === s.screen,
          alert: s.alert,
          go: () => onNavigate(s.screen),
        }));

  if (compact) {
    return (
      <>
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            onClick={it.go}
            aria-current={it.active ? "page" : undefined}
            className={`flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13px] ${
              it.active ? "bg-[var(--td-ink)] font-semibold text-white" : "bg-[var(--td-parch)] text-[var(--td-ink-2)]"
            }`}
          >
            {it.label}
            {it.count !== undefined && <span className="tabular-nums opacity-70">{it.count}</span>}
          </button>
        ))}
      </>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((it) => (
        <li key={it.key}>
          <button
            type="button"
            onClick={it.go}
            aria-current={it.active ? "page" : undefined}
            className={`flex h-9 w-full items-center justify-between rounded-[8px] px-3 text-[13.5px] transition-colors duration-150 ${
              it.active ? "bg-[var(--td-side-active)] font-semibold text-white" : "text-[#d2d2d7] hover:bg-[var(--td-side-hover)] hover:text-white"
            }`}
          >
            <span className="truncate">{it.label}</span>
            {it.count !== undefined && (
              <span
                className={`tabular-nums text-[12px] ${
                  it.alert && it.count > 0 ? "font-semibold text-[#ffb340]" : "text-[var(--td-side-ink)]"
                }`}
              >
                {it.count}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
