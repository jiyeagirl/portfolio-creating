"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowCounterClockwise,
  CaretUpDown,
  Check,
  CreditCard,
  FilmSlate,
  MagnifyingGlass,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { AdminScreen } from "@/projects/platform/eduon/lib/navigation";
import {
  HIGH_RISK_REQUESTS,
  ROLE_LABEL,
  ROLE_PERSON,
  type AdminRole,
} from "@/projects/platform/eduon/lib/admin-data";

const NAV: Array<{
  key: AdminScreen;
  label: string;
  Icon: typeof FilmSlate;
  queue: string;
}> = [
  { key: "content", label: "콘텐츠 검수", Icon: FilmSlate, queue: "검수 대기" },
  {
    key: "billing",
    label: "구독 운영",
    Icon: CreditCard,
    queue: "권한 확인 필요",
  },
  {
    key: "security",
    label: "보안 검증",
    Icon: ShieldCheck,
    queue: "승인 대기",
  },
];

/**
 * 관리자 셸, C2 워크벤치 (design.md 셸 레이아웃).
 * 전체 폭 흰색 상단 바 56px(브랜드, 계정) 아래에 사이드바 248px 짙은 면과 흰색 본문.
 * lg 미만은 사이드바가 상단 바 아래 짙은 가로 메뉴 띠로 접힌다. 드로어 없음.
 */
export function AdminShell({
  screen,
  onNavigate,
  role,
  onRole,
  title,
  meta,
  query,
  onQuery,
  placeholder,
  onReset,
  children,
}: {
  screen: AdminScreen;
  onNavigate: (s: AdminScreen) => void;
  role: AdminRole;
  onRole: (r: AdminRole) => void;
  title: string;
  meta: ReactNode;
  query: string;
  onQuery: (q: string) => void;
  placeholder: string;
  onReset: () => void;
  children: ReactNode;
}) {
  const { courses, adminSubs } = useStore();
  const counts: Record<AdminScreen, number> = {
    content: courses.filter((c) => c.review === "검수 대기").length,
    billing: adminSubs.filter((s) => s.entitlement === "확인 필요").length,
    security: HIGH_RISK_REQUESTS.filter((r) => r.status === "이중 승인 대기")
      .length,
  };

  const brand = (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--eo-side)] text-[13px] font-bold text-[var(--eo-brand)]">
        E
      </span>
      <span className="min-w-0 truncate whitespace-nowrap text-[15px] leading-[22px]">
        <span className="font-bold text-[var(--eo-ink)]">EduOn</span>{" "}
        <span className="font-medium text-[var(--eo-ink-2)]">통합관리시스템</span>
      </span>
    </span>
  );

  return (
    <div className="eduon-console flex min-h-dvh flex-col !bg-[var(--eo-surface)]">
      {/* 전체 폭 흰색 상단 바 (스튜디오와 같은 구조). 사이드바는 이 아래에서 시작한다 */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--eo-line)] bg-white px-4 sm:px-6">
        {brand}
        <AccountChip role={role} onRole={onRole} onReset={onReset} />
      </header>

      {/* lg 미만: 짙은 가로 메뉴 띠 */}
      <nav
        aria-label="관리자 메뉴"
        className="eo-scroll-x sticky top-14 z-30 flex gap-1 overflow-x-auto bg-[var(--eo-side)] px-3 py-2 lg:hidden"
      >
        {NAV.map(({ key, label, Icon }) => {
          const active = key === screen;
          const n = counts[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-[8px] px-3 text-[13px] ${
                active ? "bg-[var(--eo-side-3)] font-semibold text-white" : "font-medium text-[var(--eo-side-fg-2)]"
              }`}
            >
              <Icon size={16} weight={active ? "fill" : "regular"} />
              {label}
              {n > 0 && <span className="text-[12px] tabular-nums text-[var(--eo-side-fg-2)]">{n}</span>}
            </button>
          );
        })}
      </nav>

      <div className="flex min-w-0 flex-1">
        {/* 데스크톱 사이드바. 배경은 페이지 끝까지, 내용은 상단 바 아래에 고정 */}
        <div className="hidden w-[248px] shrink-0 bg-[var(--eo-side)] lg:block">
          <aside className="sticky top-14 flex h-[calc(100dvh-56px)] flex-col">
            <nav aria-label="관리자 메뉴" className="flex flex-col gap-1 px-3 pt-4">
              {NAV.map(({ key, label, Icon, queue }) => {
                const active = key === screen;
                const n = counts[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onNavigate(key)}
                    aria-current={active ? "page" : undefined}
                    title={`${queue} ${n}`}
                    className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-[13px] transition-colors ${
                      active
                        ? "bg-[var(--eo-side-3)] font-semibold text-white"
                        : "font-medium text-[var(--eo-side-fg-2)] hover:bg-[var(--eo-side-2)] hover:text-white"
                    }`}
                  >
                    <Icon size={18} weight={active ? "fill" : "regular"} className="shrink-0" />
                    <span className="flex-1 whitespace-nowrap text-left">{label}</span>
                    {n > 0 && (
                      <span
                        aria-label={`${queue} ${n}`}
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${
                          "bg-[var(--eo-brand)] text-black"
                        }`}
                      >
                        {n}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-[60px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-[var(--eo-line)] bg-[var(--eo-surface)] px-4 py-3 sm:px-8 lg:flex-nowrap">
            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-[20px] font-semibold leading-[28px] text-[var(--eo-ink)]">{title}</h1>
              <div className="truncate text-[12px] leading-[16px] text-[var(--eo-ink-3)]">{meta}</div>
            </div>
            <label className="relative block w-full sm:w-[280px]">
              <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--eo-ink-3)]" />
              <input
                type="search"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="h-9 w-full rounded-[8px] border border-[var(--eo-line-2)] bg-white pl-9 pr-3 text-[13px] text-[var(--eo-ink)] outline-none placeholder:text-[var(--eo-ink-3)] focus:border-[var(--eo-ink-2)]"
              />
            </label>
          </div>
          <div key={screen} className="eo-fade flex min-w-0 flex-1 items-start">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountChip({
  role,
  onRole,
  onReset,
}: {
  role: AdminRole;
  onRole: (r: AdminRole) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const person = ROLE_PERSON[role];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex h-10 items-center gap-2 rounded-[8px] px-2 text-left transition-colors hover:bg-[var(--eo-soft)] ${open ? "bg-[var(--eo-soft)]" : ""}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--eo-soft-2)] text-[12px] font-semibold text-[var(--eo-ink-2)]">
          {person.slice(0, 1)}
        </span>
        <span className="hidden whitespace-nowrap text-[13px] sm:block">
          <span className="font-semibold text-[var(--eo-ink)]">{person}</span>
          <span className="text-[var(--eo-ink-3)]"> | {ROLE_LABEL[role]}</span>
        </span>
        <CaretUpDown size={14} className="shrink-0 text-[var(--eo-ink-3)]" />
      </button>
      {open && (
        <div
          role="menu"
          className="eo-fade absolute right-0 top-full z-50 mt-2 w-[232px] rounded-[10px] border border-[var(--eo-line)] bg-white p-1.5 text-[13px] text-[var(--eo-ink)] shadow-[var(--eo-pop-shadow)]"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[12px] text-[var(--eo-ink-3)]">
            역할 전환
          </p>
          {(["operator", "super"] as const).map((r) => (
            <button
              key={r}
              type="button"
              role="menuitemradio"
              aria-checked={role === r}
              onClick={() => {
                onRole(r);
                setOpen(false);
              }}
              className="flex h-9 w-full items-center gap-2 rounded-[6px] px-2.5 text-left hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]"
            >
              <span className="flex-1 whitespace-nowrap">
                {ROLE_LABEL[r]}{" "}
                <span className="text-[var(--eo-ink-3)]">{ROLE_PERSON[r]}</span>
              </span>
              {role === r && <Check size={14} weight="bold" />}
            </button>
          ))}
          <div className="my-1.5 h-px bg-[var(--eo-line)]" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
            className="flex h-9 w-full items-center gap-2 rounded-[6px] px-2.5 text-left text-[var(--eo-ink-2)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]"
          >
            <ArrowCounterClockwise size={15} />
            처음 상태로
          </button>
        </div>
      )}
    </div>
  );
}
