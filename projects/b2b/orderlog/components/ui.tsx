"use client";

/**
 * OrderLog 공용 프리미티브. 색은 전부 styles/orderlog.css의 --ot-* 토큰을 참조하고
 * 여기서 새 색을 만들지 않는다. 반경은 design.md의 3단계 스케일(6 / 10 / full)만 쓴다.
 */

import Image from "next/image";
import { useId, useState } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { Tone } from "@/projects/b2b/orderlog/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--ot-surface-soft)] text-[var(--ot-body)]",
  info: "bg-[var(--ot-accent-soft)] text-[var(--ot-accent-deep)]",
  warn: "bg-[var(--ot-warn-soft)] text-[var(--ot-warn-deep)]",
  success: "bg-[var(--ot-success-soft)] text-[var(--ot-success-deep)]",
  danger: "bg-[var(--ot-danger-soft)] text-[var(--ot-danger-deep)]",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && (
        <span className="ot-live-dot relative inline-block h-[5px] w-[5px] rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}

/* ── Button ── */

export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  icon,
  onClick,
  disabled,
  type = "button",
  ariaLabel,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const variants = {
    primary:
      "bg-[var(--ot-accent)] text-[var(--ot-on-accent)] border border-[var(--ot-accent)] hover:bg-[var(--ot-accent-deep)] hover:border-[var(--ot-accent-deep)]",
    secondary:
      "bg-[var(--ot-surface)] text-[var(--ot-ink)] border border-[var(--ot-hairline)] hover:bg-[var(--ot-surface-soft)]",
    ghost:
      "bg-transparent text-[var(--ot-body)] border border-transparent hover:bg-[var(--ot-surface-soft)] hover:text-[var(--ot-ink)]",
    danger:
      "bg-[var(--ot-surface)] text-[var(--ot-danger-deep)] border border-[var(--ot-danger-soft)] hover:bg-[var(--ot-danger-soft)]",
  };
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-[14px]",
    lg: "h-11 px-5 text-[14.5px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ── Card ── */

export function Card({
  children,
  className = "",
  padded = true,
  soft = false,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  soft?: boolean;
}) {
  return (
    <section
      className={`rounded-[10px] border border-[var(--ot-hairline)] ${
        soft ? "bg-[var(--ot-surface-soft)]" : "bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]"
      } ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ot-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--ot-mute)]">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function PageHead({
  eyebrow,
  title,
  desc,
  actions,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--ot-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--ot-accent)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--ot-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--ot-body)]">{desc}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ── Stat ── */

export function Stat({
  label,
  value,
  delta,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  delta?: string;
  note?: string;
  emphasis?: boolean;
}) {
  const signed = delta ? /^[+-]/.test(delta) : false;
  const up = delta?.startsWith("+");
  return (
    <div
      className={`rounded-[10px] border p-5 ${
        emphasis
          ? "border-[var(--ot-accent)] bg-[var(--ot-accent)] text-[var(--ot-on-accent)]"
          : "border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--ot-mute)]"}`}>{label}</p>
      <p
        className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.03em] ${
          emphasis ? "text-[var(--ot-on-accent)]" : "text-[var(--ot-ink)]"
        }`}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`text-[12px] font-medium ${
              emphasis
                ? "text-white/90"
                : !signed
                  ? "text-[var(--ot-body)]"
                  : up
                    ? "text-[var(--ot-success-deep)]"
                    : "text-[var(--ot-danger-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--ot-mute)]"}`}>
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Form ── */

export function Field({
  label,
  hint,
  children,
  required = false,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--ot-ink)]">
        {label}
        {required && <span className="text-[var(--ot-danger)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--ot-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] px-3 text-[14px] text-[var(--ot-ink)] outline-none transition-colors placeholder:text-[var(--ot-mute)] focus:border-[var(--ot-accent)]";

export function Input({
  value,
  onChange,
  placeholder,
  suffix,
  type = "text",
}: {
  value: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  suffix?: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLASS} ${suffix ? "pr-12" : ""}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--ot-mute)]">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-[6px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] px-3 py-2.5 text-[14px] text-[var(--ot-ink)] outline-none transition-colors placeholder:text-[var(--ot-mute)] focus:border-[var(--ot-accent)]"
    />
  );
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange?: (next: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${INPUT_CLASS} appearance-none pr-9`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ot-mute)]"
      />
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full">
      <MagnifyingGlass
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ot-mute)]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLASS} pl-9`}
      />
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="sm"
      onClassName="bg-[var(--ot-accent)]"
      offClassName="bg-[#d3d7e6]"
    />
  );
}

/* ── Tabs / Segmented ── */

export function Tabs<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string; count?: number }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--ot-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-medium text-[var(--ot-ink)]" : "text-[var(--ot-mute)] hover:text-[var(--ot-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ot-mono ml-1.5 text-[12px] text-[var(--ot-mute)]">{item.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--ot-accent)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="inline-flex rounded-[6px] border border-[var(--ot-hairline)] bg-[var(--ot-surface-soft)] p-[3px]">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={active}
            className={`rounded-[4px] px-3 py-1 text-[13px] transition-colors ${
              active
                ? "bg-[var(--ot-surface)] font-medium text-[var(--ot-ink)] shadow-[0_1px_1px_rgba(16,21,42,0.06)]"
                : "text-[var(--ot-mute)] hover:text-[var(--ot-body)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Table ── */

export function Table({
  head,
  children,
  align = [],
  minWidth = 560,
}: {
  head: string[];
  children: React.ReactNode;
  align?: ("left" | "right" | "center")[];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-[var(--ot-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--ot-mute)] first:pl-0 last:pr-0 ${
                  align[index] === "right" ? "text-right" : align[index] === "center" ? "text-center" : ""
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--ot-hairline)] last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-[var(--ot-accent-soft)]" : "hover:bg-[var(--ot-surface-soft)]"
      }`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align = "left",
  strong = false,
  mono = false,
  muted = false,
  nowrap = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  strong?: boolean;
  mono?: boolean;
  muted?: boolean;
  nowrap?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 text-[13px] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${strong ? "font-medium text-[var(--ot-ink)]" : muted ? "text-[var(--ot-mute)]" : "text-[var(--ot-body)]"} ${
        mono ? "ot-mono" : ""
      } ${nowrap ? "whitespace-nowrap" : ""}`}
    >
      {children}
    </td>
  );
}

export function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (next: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ot-hairline)] pt-4">
      <p className="ot-mono text-[12px] text-[var(--ot-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ot-hairline)] text-[var(--ot-body)] transition-colors hover:bg-[var(--ot-surface-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 ot-mono text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--ot-accent)] text-[var(--ot-on-accent)]"
                : "border border-[var(--ot-hairline)] text-[var(--ot-body)] hover:bg-[var(--ot-surface-soft)]"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ot-hairline)] text-[var(--ot-body)] transition-colors hover:bg-[var(--ot-surface-soft)] disabled:opacity-35"
        >
          <CaretRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Drawer / Modal ── */

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(10,15,34,0.4)]"
      />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="ot-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--ot-hairline)] bg-[var(--ot-surface)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--ot-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--ot-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--ot-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--ot-hairline)] text-[var(--ot-body)] transition-colors hover:bg-[var(--ot-surface-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--ot-hairline)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  width = 480,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(10,15,34,0.4)]"
      />
      <div
        role="dialog"
        aria-label={title}
        className="ot-enter relative w-full overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow-pop)]"
        style={{ maxWidth: width }}
      >
        <header className="flex items-center justify-between gap-4 border-b border-[var(--ot-hairline)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--ot-ink)]">{title}</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ot-mute)] transition-colors hover:bg-[var(--ot-surface-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-[var(--ot-hairline)] px-5 py-4">{footer}</footer>}
      </div>
    </div>
  );
}

/* ── Empty state ── */

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-[var(--ot-hairline-strong)] px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ot-surface-soft)] text-[var(--ot-mute)]">
        {icon}
      </span>
      <div>
        <p className="text-[14px] font-medium text-[var(--ot-ink)]">{title}</p>
        <p className="mt-1 max-w-[38ch] text-[13px] leading-5 text-[var(--ot-mute)]">{desc}</p>
      </div>
      {action}
    </div>
  );
}

/* ── Avatar ── */

export function InitialAvatar({
  name,
  size = 32,
  tone = "neutral",
}: {
  name: string;
  size?: number;
  tone?: "neutral" | "accent" | "ink";
}) {
  const bg =
    tone === "accent"
      ? "bg-[var(--ot-accent)] text-[var(--ot-on-accent)]"
      : tone === "ink"
        ? "bg-[var(--ot-ink)] text-white"
        : "bg-[var(--ot-surface-soft)] text-[var(--ot-body)]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${bg}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/* ── Charts ── */

export function BarChart({
  data,
  format,
  height = 148,
}: {
  data: { label: string; value: number; emphasis?: boolean }[];
  format: (value: number) => string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex min-w-[56px] flex-1 flex-col justify-end gap-2">
            <p
              className={`ot-mono whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--ot-ink)]" : "text-[var(--ot-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--ot-accent)" : "var(--ot-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--ot-mute)]">
              {d.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({
  data,
  height = 148,
  formatValue,
}: {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = Math.max(max - min, 1);
  const w = 100;
  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * w;
    const y = 100 - ((d.value - min) / range) * 100;
    return { x, y, d };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${w},100 L0,100 Z`;

  return (
    <div>
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 ${w} 100`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <path d={area} fill="var(--ot-accent-soft)" stroke="none" />
          <path d={path} fill="none" stroke="var(--ot-accent)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
          {points.map((p) => (
            <circle key={p.d.label} cx={p.x} cy={p.y} r={1.6} fill="var(--ot-accent)" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[11px] leading-4 text-[var(--ot-mute)]">{d.label}</span>
            <span className="ot-mono text-[11px] leading-4 text-[var(--ot-ink)]">
              {formatValue ? formatValue(d.value) : d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DONUT_RAMP = [
  "var(--ot-chart-1)",
  "var(--ot-chart-2)",
  "var(--ot-chart-3)",
  "var(--ot-chart-4)",
  "var(--ot-chart-5)",
];

export function DonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number }[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = 15.9155;
  const c = 2 * Math.PI * r;
  const segments = data.reduce<{ label: string; value: number; frac: number; start: number }[]>((acc, d) => {
    const frac = d.value / total;
    const start = acc.length > 0 ? acc[acc.length - 1].start + acc[acc.length - 1].frac : 0;
    return [...acc, { ...d, frac, start }];
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative h-[168px] w-[168px] shrink-0">
        <svg
          viewBox="0 0 36 36"
          width={168}
          height={168}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full -rotate-90"
        >
          <circle cx="18" cy="18" r={r} fill="none" stroke="var(--ot-surface-soft)" strokeWidth="5" />
          {segments.map((d, i) => {
            const dash = d.frac * c;
            const offset = d.start * c;
            return (
              <circle
                key={d.label}
                cx="18"
                cy="18"
                r={r}
                fill="none"
                stroke={DONUT_RAMP[Math.min(i, DONUT_RAMP.length - 1)]}
                strokeWidth="5"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--ot-ink)]">
            {centerValue}
          </span>
          <span className="text-[12px] text-[var(--ot-mute)]">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex items-center gap-2 text-[var(--ot-body)]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ background: DONUT_RAMP[Math.min(i, DONUT_RAMP.length - 1)] }}
              />
              {d.label}
            </span>
            <span className="ot-mono font-medium text-[var(--ot-ink)]">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RankBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--ot-ink)]">{d.label}</span>
            <span className="ot-mono text-[13px] text-[var(--ot-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--ot-surface-soft)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(d.value / max) * 100}%`, background: DONUT_RAMP[Math.min(index, DONUT_RAMP.length - 1)] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Meter({ value, tone = "accent" }: { value: number; tone?: "accent" | "warn" | "success" }) {
  const color =
    tone === "warn" ? "var(--ot-warn)" : tone === "success" ? "var(--ot-success)" : "var(--ot-accent)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ot-surface-soft)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ── Timeline (요약형, 스레드 화면의 대화형 타임라인과는 별개) ── */

export function Timeline({ steps }: { steps: { label: string; at: string; done: boolean; note?: string }[] }) {
  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute left-[7px] top-4 w-px"
                style={{ bottom: 0, background: step.done ? "var(--ot-accent)" : "var(--ot-hairline)" }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done ? "border-[var(--ot-accent)] bg-[var(--ot-accent)]" : "border-[var(--ot-hairline-strong)] bg-[var(--ot-surface)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={`text-[14px] ${step.done ? "font-medium text-[var(--ot-ink)]" : "text-[var(--ot-mute)]"}`}>
                  {step.label}
                </p>
                <p className="ot-mono text-[12px] text-[var(--ot-mute)]">{step.at}</p>
              </div>
              {step.note && <p className="mt-1 text-[13px] leading-5 text-[var(--ot-body)]">{step.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Definition list ── */

export function DefList({
  items,
  columns = 2,
}: {
  items: { label: string; value: React.ReactNode }[];
  columns?: 1 | 2 | 3;
}) {
  const cols = columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-1 gap-x-6 gap-y-0 ${cols}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 border-b border-[var(--ot-hairline)] py-2.5 last:border-b-0"
        >
          <dt className="shrink-0 text-[13px] text-[var(--ot-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--ot-ink)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Accordion ── */

export function Accordion({
  title,
  meta,
  children,
  defaultOpen = false,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-[var(--ot-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--ot-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown size={13} className={`text-[var(--ot-mute)] transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div id={id} className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Item / photo thumbnail ── */

export function PhotoThumb({
  photo,
  alt,
  size = 44,
  rounded = 6,
  fallback,
}: {
  photo?: number;
  alt: string;
  size?: number;
  rounded?: number;
  fallback: React.ReactNode;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--ot-hairline)] bg-[var(--ot-surface-soft)]"
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      {photo !== undefined ? (
        <Image
          src={`https://picsum.photos/id/${photo}/${size * 2}/${size * 2}`}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        fallback
      )}
    </span>
  );
}
