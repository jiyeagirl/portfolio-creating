"use client";

import type { ReactNode } from "react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";

/* 관리자 전용 부품. 앱보다 각진 radius(패널 8, 입력과 버튼 6), 눌림 없이 hover 배경 톤만. */

export function PageHeader({
  title,
  meta,
  actions,
}: {
  title: string;
  meta?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-5">
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold tracking-[-0.02em]">{title}</h1>
        {meta && <p className="mt-0.5 text-[13px] text-[var(--tf-ink-3)]">{meta}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

type BtnKind = "primary" | "ghost" | "danger";

export function Btn({
  kind = "ghost",
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  kind?: BtnKind;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const styles: Record<BtnKind, string> = {
    primary:
      "bg-[var(--tf-brand)] text-white hover:bg-[var(--tf-brand-press)] disabled:bg-[var(--tf-pressed)] disabled:text-[var(--tf-ink-3)]",
    ghost:
      "border border-[var(--tf-line)] bg-[var(--tf-surface)] text-[var(--tf-ink)] hover:bg-[var(--tf-soft)] disabled:text-[var(--tf-ink-3)]",
    danger:
      "bg-[var(--tf-red-fg)] text-white hover:bg-[#8a2b22] disabled:bg-[var(--tf-pressed)] disabled:text-[var(--tf-ink-3)]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] px-3.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed ${styles[kind]} ${className}`}
    >
      {children}
    </button>
  );
}

const INPUT =
  "h-9 w-full rounded-[6px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-3 text-[13.5px] text-[var(--tf-ink)] placeholder:text-[var(--tf-disabled)] disabled:bg-[var(--tf-canvas)]";

export function TextInput({
  value,
  onChange,
  placeholder,
  mono = false,
  disabled,
  invalid = false,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${INPUT} ${mono ? "tf-mono text-[13px]" : ""} ${invalid ? "!border-[var(--tf-red)] !bg-[var(--tf-red-bg)]/40" : ""} ${className}`}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
  className = "",
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  label?: string;
}) {
  return (
    <select
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={`${INPUT} ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-[6px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-3 py-2 text-[13.5px] leading-5 text-[var(--tf-ink)] placeholder:text-[var(--tf-disabled)]"
    />
  );
}

export function FormField({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="mb-1 flex items-center gap-1 text-[12.5px] font-medium text-[var(--tf-ink-2)]">
        {label}
        {required && <span className="text-[var(--tf-red-fg)]">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-[var(--tf-red-fg)]">{error}</span>}
    </div>
  );
}

/* 표 래퍼. 컬럼 폭 합이 넘치면 overflow-x-auto가 스크롤을 만든다(design.md 컬럼 예산). */
export function TableShell({ minWidth, children }: { minWidth: number; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
      <table className="w-full border-collapse text-[13px]" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
  width,
}: {
  children: ReactNode;
  align?: "left" | "right";
  width?: number;
}) {
  return (
    <th
      style={{ width }}
      className={`h-10 border-b border-[var(--tf-line)] bg-[var(--tf-canvas)] px-4 text-[12px] font-medium text-[var(--tf-ink-3)] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 align-middle ${align === "right" ? "text-right tabular-nums" : ""} ${className}`}>
      {children}
    </td>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between pt-3 text-[12.5px] text-[var(--tf-ink-3)]">
      <span className="tabular-nums">
        총 {total}건 중 {from}-{to}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="이전 페이지"
          className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-[var(--tf-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CaretLeft size={14} />
        </button>
        <span className="min-w-[48px] text-center tabular-nums text-[var(--tf-ink-2)]">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          aria-label="다음 페이지"
          className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-[var(--tf-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CaretRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function SidePanel({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <aside className="tf-slide flex min-h-[320px] flex-col rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
      <div className="flex h-12 items-center justify-between border-b border-[var(--tf-line)] pl-4 pr-2">
        <h2 className="text-[14px] font-semibold">{title}</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="패널 닫기"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--tf-ink-3)] hover:bg-[var(--tf-soft)]"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex-1 space-y-4 p-4">{children}</div>
      {footer && <div className="flex gap-2 border-t border-[var(--tf-line)] p-4">{footer}</div>}
    </aside>
  );
}

export function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-[13px]">
      <dt className="shrink-0 text-[var(--tf-ink-3)]">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{children}</dd>
    </div>
  );
}

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; count?: number }>;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-[var(--tf-line)]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`-mb-px h-10 border-b-2 px-3 text-[13px] transition-colors ${
              active
                ? "border-[var(--tf-brand)] font-semibold text-[var(--tf-ink)]"
                : "border-transparent font-medium text-[var(--tf-ink-3)] hover:text-[var(--tf-ink)]"
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className="ml-1.5 tabular-nums text-[var(--tf-ink-3)]">{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyRow({ text, colSpan }: { text: string; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-[13.5px] text-[var(--tf-ink-3)]">
        {text}
      </td>
    </tr>
  );
}
