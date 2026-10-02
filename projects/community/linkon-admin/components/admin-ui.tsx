"use client";

import type { ReactNode } from "react";
import { X } from "@phosphor-icons/react";

export function AdminSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-[var(--lk-ink)]">{title}</h2>
          {description && (
            <p className="mt-1 text-[13px] text-[var(--lk-muted)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function TableShell({
  head,
  children,
  minWidth = 760,
}: {
  head: ReactNode;
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)]">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-[var(--lk-border)] bg-[var(--lk-bg)]">{head}</tr>
        </thead>
        <tbody className="divide-y divide-[var(--lk-border)]">{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-4 py-3 text-[12.5px] font-semibold text-[var(--lk-muted)] ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-3.5 align-middle text-[13.5px] text-[var(--lk-ink)] ${className}`}
    >
      {children}
    </td>
  );
}

export function TableAction({
  children,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "default" | "danger" | "accent";
}) {
  const toneClass =
    tone === "danger"
      ? "text-[var(--lk-danger)] hover:bg-[var(--lk-danger-soft)]"
      : tone === "accent"
        ? "text-[var(--lk-accent)] hover:bg-[var(--lk-accent-soft)]"
        : "text-[var(--lk-muted)] hover:bg-[var(--lk-surface)] hover:text-[var(--lk-ink)]";
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors ${toneClass}`}
    >
      {children}
    </button>
  );
}

export function Drawer({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--lk-ink)]/40 backdrop-blur-[1px]"
      />
      <aside className="relative flex h-full w-full max-w-[460px] flex-col border-l border-[var(--lk-border)] bg-[var(--lk-elevated)]">
        <header className="flex items-center justify-between border-b border-[var(--lk-border)] px-6 py-4">
          <h3 className="text-[16px] font-bold text-[var(--lk-ink)]">{title}</h3>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--lk-muted)] hover:bg-[var(--lk-surface)]"
          >
            <X size={17} weight="bold" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--lk-border)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

export function DefinitionRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-[13px] text-[var(--lk-muted)]">{label}</dt>
      <dd className="text-right text-[13.5px] font-semibold text-[var(--lk-ink)]">{value}</dd>
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="w-[104px] shrink-0 truncate text-[13px] font-medium text-[var(--lk-ink)]">
        {label}
      </span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--lk-surface)]">
        <span
          className="block h-full rounded-full bg-[var(--lk-accent)]"
          style={{ width: `${Math.round((value / max) * 100)}%` }}
        />
      </span>
      <span className="lk-num w-[58px] shrink-0 text-right text-[13px] font-semibold text-[var(--lk-ink)]">
        {value}
        {suffix}
      </span>
    </div>
  );
}
