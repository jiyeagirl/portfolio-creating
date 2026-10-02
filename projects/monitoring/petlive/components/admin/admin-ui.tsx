"use client";

/**
 * PetLive 관리자 콘솔 공용 프리미티브. 값은 전부 styles/petlive.css의 --pl-* 토큰을 참조한다.
 * CLAUDE.md 웹 콘솔 구조 베이스라인에 따라 반경은 6px(버튼/인풋) / 8px(카드) / full(배지)만
 * 쓴다 — 모바일 앱 쪽의 rounded-[24px] 시그니처와는 별개다.
 */

import { useId, useState } from "react";
import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { Tone } from "@/projects/monitoring/petlive/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--pl-canvas-strong)] text-[var(--pl-body)]",
  positive: "bg-[var(--pl-positive-soft)] text-[var(--pl-positive-deep)]",
  warning: "bg-[var(--pl-warning-soft)] text-[var(--pl-warning-deep)]",
  negative: "bg-[var(--pl-negative-soft)] text-[var(--pl-negative-deep)]",
  info: "bg-[var(--pl-info-soft)] text-[var(--pl-info-deep)]",
};

const DOT_CLASS: Record<Tone, string> = {
  neutral: "text-[var(--pl-mute)]",
  positive: "text-[var(--pl-positive)]",
  warning: "text-[var(--pl-warning-deep)]",
  negative: "text-[var(--pl-negative)]",
  info: "text-[var(--pl-info)]",
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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && <span className={`inline-block h-[5px] w-[5px] rounded-full bg-current ${DOT_CLASS[tone]}`} />}
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
    primary: "bg-[var(--pl-accent)] text-[var(--pl-on-accent)] hover:bg-[var(--pl-accent-active)]",
    secondary: "bg-[var(--pl-canvas)] text-[var(--pl-ink)] border border-[var(--pl-hairline)] hover:bg-[var(--pl-canvas-soft)]",
    ghost: "bg-transparent text-[var(--pl-body)] hover:bg-[var(--pl-canvas-soft)] hover:text-[var(--pl-ink)]",
    danger: "bg-[var(--pl-canvas)] text-[var(--pl-negative-deep)] border border-[var(--pl-negative-soft)] hover:bg-[var(--pl-negative-soft)]",
  };
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-[14px]",
    lg: "h-12 px-5 text-[15px]",
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
      className={`rounded-[8px] border border-[var(--pl-hairline)] ${soft ? "bg-[var(--pl-canvas-soft)]" : "bg-[var(--pl-canvas)]"} ${padded ? "p-5" : ""} ${className}`}
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--pl-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--pl-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--pl-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="pl-mono text-[12px] uppercase tracking-[0.08em] text-[var(--pl-mute)]">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--pl-ink)]">{title}</h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--pl-body)]">{desc}</p>
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
      className={`rounded-[8px] border p-5 ${
        emphasis
          ? "border-[var(--pl-accent)] bg-[var(--pl-accent)] text-[var(--pl-on-accent)]"
          : "border-[var(--pl-hairline)] bg-[var(--pl-canvas)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--pl-mute)]"}`}>{label}</p>
      <p
        className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] ${
          emphasis ? "text-[var(--pl-on-accent)]" : "text-[var(--pl-ink)]"
        }`}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`text-[12px] font-medium ${
              emphasis ? "text-white/90" : !signed ? "text-[var(--pl-body)]" : up ? "text-[var(--pl-positive-deep)]" : "text-[var(--pl-negative-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--pl-mute)]"}`}>{note}</span>}
      </div>
    </div>
  );
}

/* ── Form ── */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[var(--pl-ink)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--pl-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--pl-hairline)] bg-[var(--pl-canvas)] px-3 text-[14px] text-[var(--pl-ink)] outline-none transition-colors placeholder:text-[var(--pl-mute)] focus:border-[var(--pl-accent)]";

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={INPUT_CLASS}
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
      <CaretDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pl-mute)]" />
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
      <MagnifyingGlass size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pl-mute)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLASS} pl-9`}
      />
    </div>
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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--pl-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-medium text-[var(--pl-ink)]" : "text-[var(--pl-mute)] hover:text-[var(--pl-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="ml-1.5 pl-mono text-[12px] text-[var(--pl-mute)]">{item.count}</span>}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--pl-accent)]" />}
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
    <div className="inline-flex rounded-[6px] border border-[var(--pl-hairline)] bg-[var(--pl-canvas-soft)] p-[3px]">
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
                ? "bg-[var(--pl-canvas)] font-medium text-[var(--pl-ink)] shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[var(--pl-mute)] hover:text-[var(--pl-body)]"
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
  /** 1440px에서 사이드바(236px) + 본문 패딩을 뺀 실제 컬럼 폭 기준 */
  minWidth = 640,
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
          <tr className="border-b border-[var(--pl-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--pl-mute)] first:pl-0 last:pr-0 ${
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
      className={`border-b border-[var(--pl-hairline)] last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-[var(--pl-canvas-soft)]" : "hover:bg-[var(--pl-canvas-soft)]"
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
      } ${strong ? "font-medium text-[var(--pl-ink)]" : muted ? "text-[var(--pl-mute)]" : "text-[var(--pl-body)]"} ${
        mono ? "pl-mono" : ""
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--pl-hairline)] pt-4">
      <p className="pl-mono text-[12px] text-[var(--pl-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--pl-hairline)] text-[var(--pl-body)] transition-colors hover:bg-[var(--pl-canvas-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 pl-mono text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--pl-accent)] text-[var(--pl-on-accent)]"
                : "border border-[var(--pl-hairline)] text-[var(--pl-body)] hover:bg-[var(--pl-canvas-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--pl-hairline)] text-[var(--pl-body)] transition-colors hover:bg-[var(--pl-canvas-soft)] disabled:opacity-35"
        >
          <CaretRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Drawer ── */

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
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(32,26,20,0.32)]" />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="pl-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--pl-hairline)] bg-[var(--pl-canvas)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--pl-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--pl-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--pl-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--pl-hairline)] text-[var(--pl-body)] transition-colors hover:bg-[var(--pl-canvas-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--pl-hairline)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
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
          className="flex items-start justify-between gap-4 border-b border-[var(--pl-hairline)] py-2.5 last:border-b-0"
        >
          <dt className="shrink-0 text-[13px] text-[var(--pl-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--pl-ink)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Avatar (이니셜) ── */

export function InitialsAvatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--pl-canvas-strong)] font-medium text-[var(--pl-ink)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.slice(0, 1)}
    </span>
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
    <div className="border-b border-[var(--pl-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--pl-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown size={13} className={`text-[var(--pl-mute)] transition-transform ${open ? "rotate-180" : ""}`} />
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
