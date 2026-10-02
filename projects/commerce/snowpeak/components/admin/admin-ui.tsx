"use client";

/**
 * SnowPeak 관리자 콘솔 공용 프리미티브. 값은 전부 styles/snowpeak.css의 --sp-*
 * 토큰을 참조한다. 반경은 6 / 8 / 12(모바일 화면과 구분되는 web 프리셋 스케일)
 * / full만 쓴다. projects/b2b/assetflow/components/ui.tsx의 구조를 그대로 따르되 톤 어휘는 새로 설계.
 */

import Image from "next/image";
import { useId, useState } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { Tone } from "@/projects/commerce/snowpeak/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--sp-surface-soft)] text-[var(--sp-body)]",
  info: "bg-[var(--sp-info-soft)] text-[var(--sp-info)]",
  success: "bg-[var(--sp-success-soft)] text-[var(--sp-success)]",
  warn: "bg-[var(--sp-warn-soft)] text-[var(--sp-warn)]",
  danger: "bg-[var(--sp-danger-soft)] text-[var(--sp-danger)]",
  ink: "bg-[var(--sp-ink)] text-white",
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
      {dot && <span className="relative inline-block h-[5px] w-[5px] rounded-full bg-current" />}
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
    primary: "bg-[var(--sp-accent)] text-white border border-[var(--sp-accent)] hover:bg-[var(--sp-accent-deep)]",
    secondary: "bg-[var(--sp-surface)] text-[var(--sp-ink)] border border-[var(--sp-border)] hover:bg-[var(--sp-surface-soft)]",
    ghost: "bg-transparent text-[var(--sp-body)] border border-transparent hover:bg-[var(--sp-surface-soft)] hover:text-[var(--sp-ink)]",
    danger: "bg-[var(--sp-surface)] text-[var(--sp-danger)] border border-[var(--sp-danger-soft)] hover:bg-[var(--sp-danger-soft)]",
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
      className={`rounded-[8px] border border-[var(--sp-border)] ${soft ? "bg-[var(--sp-surface-soft)]" : "bg-[var(--sp-surface)]"} ${padded ? "p-5" : ""} ${className}`}
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--sp-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--sp-border)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="sp-num text-[12px] uppercase tracking-[0.08em] text-[var(--sp-mute)]">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--sp-ink)]">{title}</h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--sp-body)]">{desc}</p>
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
        emphasis ? "border-[var(--sp-accent)] bg-[var(--sp-accent)] text-white" : "border-[var(--sp-border)] bg-[var(--sp-surface)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/75" : "text-[var(--sp-mute)]"}`}>{label}</p>
      <p className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] ${emphasis ? "text-white" : "text-[var(--sp-ink)]"}`}>
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`text-[12px] font-medium ${
              emphasis ? "text-white/90" : !signed ? "text-[var(--sp-body)]" : up ? "text-[var(--sp-success)]" : "text-[var(--sp-danger)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--sp-mute)]"}`}>{note}</span>}
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
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--sp-ink)]">
        {label}
        {required && <span className="text-[var(--sp-danger)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--sp-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 text-[14px] text-[var(--sp-ink)] outline-none transition-colors placeholder:text-[var(--sp-mute)] focus:border-[var(--sp-border-strong)]";

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
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--sp-mute)]">
          {suffix}
        </span>
      )}
    </div>
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
      <CaretDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
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
      <MagnifyingGlass size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]" />
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
      onClassName="bg-[var(--sp-accent)]"
      offClassName="bg-[#d4d4d4]"
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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--sp-border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-medium text-[var(--sp-ink)]" : "text-[var(--sp-mute)] hover:text-[var(--sp-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="sp-num ml-1.5 text-[12px] text-[var(--sp-mute)]">{item.count}</span>}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--sp-accent)]" />}
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
    <div className="inline-flex rounded-[6px] border border-[var(--sp-border)] bg-[var(--sp-surface-soft)] p-[3px]">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={active}
            className={`rounded-[4px] px-3 py-1 text-[13px] transition-colors ${
              active ? "bg-[var(--sp-surface)] font-medium text-[var(--sp-ink)] shadow-[0_1px_1px_rgba(0,0,0,0.04)]" : "text-[var(--sp-mute)] hover:text-[var(--sp-body)]"
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
          <tr className="border-b border-[var(--sp-border)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--sp-mute)] first:pl-0 last:pr-0 ${
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

export function Row({ children, onClick, active = false }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--sp-border)] last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-[var(--sp-surface-soft)]" : "hover:bg-[var(--sp-surface-soft)]"
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
      className={`px-3 py-3 text-[13px] first:pl-0 last:pr-0 ${align === "right" ? "text-right" : align === "center" ? "text-center" : ""} ${
        strong ? "font-medium text-[var(--sp-ink)]" : muted ? "text-[var(--sp-mute)]" : "text-[var(--sp-body)]"
      } ${mono ? "sp-num" : ""} ${nowrap ? "whitespace-nowrap" : ""}`}
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sp-border)] pt-4">
      <p className="sp-num text-[12px] text-[var(--sp-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--sp-border)] text-[var(--sp-body)] transition-colors hover:bg-[var(--sp-surface-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 sp-num text-[13px] transition-colors ${
              n === page ? "bg-[var(--sp-accent)] text-white" : "border border-[var(--sp-border)] text-[var(--sp-body)] hover:bg-[var(--sp-surface-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--sp-border)] text-[var(--sp-body)] transition-colors hover:bg-[var(--sp-surface-soft)] disabled:opacity-35"
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
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(19,26,34,0.32)]" />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="sp-admin-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--sp-border)] bg-[var(--sp-surface)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--sp-border)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--sp-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--sp-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--sp-border)] text-[var(--sp-body)] transition-colors hover:bg-[var(--sp-surface-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--sp-border)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

/* ── Thumb ── */

export function PhotoThumb({
  photo,
  name,
  size = 44,
  rounded = 6,
}: {
  photo?: number;
  name: string;
  size?: number;
  rounded?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--sp-border)] bg-[var(--sp-surface-soft)]"
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      {photo !== undefined && (
        <Image
          src={`https://picsum.photos/id/${photo}/${size * 2}/${size * 2}`}
          alt={`${name} 사진`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      )}
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
          <div key={d.label} className="flex min-w-[52px] flex-1 flex-col justify-end gap-2">
            <p className={`sp-num whitespace-nowrap text-center text-[11px] leading-4 ${d.emphasis ? "font-medium text-[var(--sp-ink)]" : "text-[var(--sp-mute)]"}`}>
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%`, background: d.emphasis ? "var(--sp-accent)" : "var(--sp-chart-1)" }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--sp-mute)]">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RankBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = ["var(--sp-chart-1)", "var(--sp-chart-2)", "var(--sp-chart-3)", "var(--sp-chart-4)", "var(--sp-chart-5)"];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--sp-ink)]">{d.label}</span>
            <span className="sp-num text-[13px] text-[var(--sp-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--sp-surface-soft)]">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: ramp[Math.min(index, ramp.length - 1)] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Meter({ value, tone = "ink" }: { value: number; tone?: "ink" | "info" | "warn" | "danger" }) {
  const color =
    tone === "info" ? "var(--sp-info)" : tone === "warn" ? "var(--sp-warn)" : tone === "danger" ? "var(--sp-danger)" : "var(--sp-accent)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--sp-surface-soft)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ── Timeline ── */

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
                style={{ bottom: 0, background: step.done ? "var(--sp-accent)" : "var(--sp-border)" }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done ? "border-[var(--sp-accent)] bg-[var(--sp-accent)]" : "border-[var(--sp-border-strong)] bg-[var(--sp-surface)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={`text-[14px] ${step.done ? "font-medium text-[var(--sp-ink)]" : "text-[var(--sp-mute)]"}`}>{step.label}</p>
                <p className="sp-num text-[12px] text-[var(--sp-mute)]">{step.at}</p>
              </div>
              {step.note && <p className="mt-1 text-[13px] leading-5 text-[var(--sp-body)]">{step.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Definition list ── */

export function DefList({ items, columns = 2 }: { items: { label: string; value: React.ReactNode }[]; columns?: 1 | 2 | 3 }) {
  const cols = columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-1 gap-x-6 gap-y-0 ${cols}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 border-b border-[var(--sp-border)] py-2.5 last:border-b-0">
          <dt className="shrink-0 text-[13px] text-[var(--sp-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--sp-ink)]">{item.value}</dd>
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
    <div className="border-b border-[var(--sp-border)] last:border-b-0">
      <button type="button" onClick={() => setOpen((prev) => !prev)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-4 py-3.5 text-left">
        <span className="text-[14px] font-medium text-[var(--sp-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown size={13} className={`text-[var(--sp-mute)] transition-transform ${open ? "rotate-180" : ""}`} />
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
