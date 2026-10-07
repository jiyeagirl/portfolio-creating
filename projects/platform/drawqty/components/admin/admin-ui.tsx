"use client";

import type { ReactNode } from "react";
import { CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";

/* 관리자 전용 부품. 패널 10px, 버튼과 입력 6px, 배지 6px. hover는 배경 톤만 바꾼다. */

export function AButton({
  children,
  onClick,
  active,
  disabled,
  kind = "ghost",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  kind?: "ghost" | "primary";
  className?: string;
}) {
  const tone =
    kind === "primary"
      ? "bg-[var(--dq-brand)] text-white hover:bg-[var(--dq-brand-press)]"
      : active
        ? "border border-[var(--dq-brand)] bg-[var(--dq-blue-bg)] font-semibold text-[var(--dq-brand)]"
        : "border border-[var(--dq-line-strong)] bg-[var(--dq-surface)] text-[var(--dq-ink)] hover:bg-[var(--dq-soft)]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] px-3.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:text-[var(--dq-disabled)] ${tone} ${className}`}
    >
      {children}
    </button>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block w-full sm:w-[400px]">
      <span className="sr-only">검색</span>
      <MagnifyingGlass size={20} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dq-ink-3)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-[6px] border border-[var(--dq-line-strong)] bg-[var(--dq-surface)] pl-11 pr-3.5 text-[14px] placeholder:text-[var(--dq-disabled)]"
      />
    </label>
  );
}

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; count: number }>;
}) {
  return (
    <div role="tablist" className="dq-scroll-x flex max-w-full gap-1 overflow-x-auto">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-3 text-[13px] transition-colors ${
              active
                ? "bg-[var(--dq-soft-2)] font-semibold text-[var(--dq-ink)]"
                : "font-medium text-[var(--dq-ink-3)] hover:bg-[var(--dq-soft)] hover:text-[var(--dq-ink)]"
            }`}
          >
            {o.label}
            <span className={`tabular-nums ${active ? "text-[var(--dq-ink-2)]" : "text-[var(--dq-ink-3)]"}`}>{o.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Pager({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[var(--dq-line)] px-4 py-2.5 text-[13px] text-[var(--dq-ink-2)]">
      <span className="tabular-nums">
        {pages > 1 ? `${from}~${to} / ` : ""}전체 {total}건
      </span>
      <div className={`items-center gap-1 ${pages > 1 ? "flex" : "hidden"}`}>
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-[var(--dq-soft)] disabled:text-[var(--dq-disabled)] disabled:hover:bg-transparent"
        >
          <CaretLeft size={16} />
        </button>
        <span className="min-w-[48px] text-center tabular-nums">
          {page} / {pages}
        </span>
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-[var(--dq-soft)] disabled:text-[var(--dq-disabled)] disabled:hover:bg-transparent"
        >
          <CaretRight size={16} />
        </button>
      </div>
    </div>
  );
}

export function DetailPanel({
  title,
  badge,
  onClose,
  children,
}: {
  title: ReactNode;
  badge?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <aside className="dq-slide overflow-hidden rounded-[10px] border border-[var(--dq-line)] bg-[var(--dq-surface)]">
      <div className="flex items-center gap-3 border-b border-[var(--dq-line)] px-5 py-3.5">
        <div className="min-w-0 flex-1">{title}</div>
        {badge}
        <button
          type="button"
          aria-label="패널 닫기"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[var(--dq-ink-3)] hover:bg-[var(--dq-soft)]"
        >
          <X size={16} />
        </button>
      </div>
      {children}
    </aside>
  );
}

export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[var(--dq-line)] px-5 py-4 last:border-b-0">
      <h3 className="text-[13px] font-semibold leading-5">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function DefRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-[13px]">
      <dt className="shrink-0 text-[var(--dq-ink-3)]">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium text-[var(--dq-ink)]">{children}</dd>
    </div>
  );
}

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-[160px] text-center text-[13px] text-[var(--dq-ink-3)]">
        {text}
      </td>
    </tr>
  );
}
