"use client";

/**
 * LUMI CAM 관리자 콘솔 공용 프리미티브. 값은 전부 styles/lumicam.css의 --lc-* 토큰을
 * 참조하고 여기서 새 색을 만들지 않는다. 반경은 design.md §3 스케일(6 / 12px)만 쓴다.
 */

import { useId, useState } from "react";
import { Icon } from "@iconify/react";

export type Tone = "neutral" | "accent" | "warn" | "danger" | "ink";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--lc-surface-soft)] text-[var(--lc-body)]",
  accent: "bg-[var(--lc-accent-soft)] text-[var(--lc-accent-soft-ink)]",
  warn: "bg-[var(--lc-accent-soft)] text-[var(--lc-accent-soft-ink)]",
  danger: "bg-[var(--lc-danger-soft)] text-[var(--lc-danger-ink)]",
  ink: "bg-[var(--lc-ink)] text-[var(--lc-on-ink)]",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  icon,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-[var(--lc-ink)] text-[var(--lc-on-ink)] border border-[var(--lc-ink)] hover:bg-[#2a241a]",
    secondary: "bg-[var(--lc-surface)] text-[var(--lc-ink)] border border-[var(--lc-border)] hover:bg-[var(--lc-surface-soft)]",
    ghost: "bg-transparent text-[var(--lc-body)] border border-transparent hover:bg-[var(--lc-surface-soft)]",
  };
  const sizes = { sm: "h-8 px-3 text-[12.5px]", md: "h-10 px-4 text-[13.5px]" };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors active:scale-[0.99] ${variants[variant]} ${sizes[size]}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-5 ${className}`}>
      {children}
    </section>
  );
}

export function CardHead({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--lc-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[12.5px] leading-5 text-[var(--lc-mute)]">{desc}</p>}
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
  descNoWrap = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  actions?: React.ReactNode;
  /** 설명이 짧아서 줄바꿈 없이 한 줄로 두고 싶을 때. max-w-[70ch] 캡을 풀어주는 대신
   *  header의 flex-wrap이 폭 부족 시 actions를 다음 줄로 내려준다. */
  descNoWrap?: boolean;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--lc-border)] pb-6">
      <div className={`min-w-0 ${descNoWrap ? "" : "max-w-[70ch]"}`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-mute)]">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] font-bold leading-8 tracking-[-0.02em] text-[var(--lc-ink)]">{title}</h1>
        <p className={`mt-2 text-[13.5px] leading-6 text-[var(--lc-body)] ${descNoWrap ? "whitespace-nowrap" : ""}`}>
          {desc}
        </p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-5">
      <p className="text-[12.5px] text-[var(--lc-mute)]">{label}</p>
      <p className="mt-2 text-[24px] font-bold leading-8 tracking-[-0.02em] text-[var(--lc-ink)] tabular-nums">{value}</p>
      {note && <p className="mt-2 text-[12px] text-[var(--lc-mute)]">{note}</p>}
    </div>
  );
}

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
          <tr className="border-b border-[var(--lc-border)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[11.5px] font-medium text-[var(--lc-mute)] first:pl-0 last:pr-0 ${
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

export function Row({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-[var(--lc-border)] last:border-b-0 hover:bg-[var(--lc-surface-soft)]">{children}</tr>;
}

export function Cell({
  children,
  align = "left",
  strong = false,
  mono = false,
  muted = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  strong?: boolean;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 text-[12.5px] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${strong ? "font-medium text-[var(--lc-ink)]" : muted ? "text-[var(--lc-mute)]" : "text-[var(--lc-body)]"} ${
        mono ? "tabular-nums" : ""
      }`}
    >
      {children}
    </td>
  );
}

export function Tabs<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--lc-border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[13px] transition-colors ${
              active ? "font-medium text-[var(--lc-ink)]" : "text-[var(--lc-mute)] hover:text-[var(--lc-body)]"
            }`}
          >
            {item.label}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--lc-accent)]" />}
          </button>
        );
      })}
    </div>
  );
}

export function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (next: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-[6px] border border-[var(--lc-border)] bg-[var(--lc-surface)] px-3 pr-8 text-[12.5px] text-[var(--lc-ink)] outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon icon="solar:alt-arrow-down-linear" width={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lc-mute)]" />
    </div>
  );
}

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
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(24,20,13,0.35)]" />
      <aside
        role="dialog"
        aria-label={title}
        className="relative flex h-full w-full max-w-[440px] flex-col border-l border-[var(--lc-border)] bg-[var(--lc-surface)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--lc-border)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--lc-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[12.5px] text-[var(--lc-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--lc-border)] text-[var(--lc-body)]"
          >
            <Icon icon="solar:close-circle-linear" width={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--lc-border)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

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
            <p className={`whitespace-nowrap text-center text-[11px] leading-4 tabular-nums ${d.emphasis ? "font-medium text-[var(--lc-ink)]" : "text-[var(--lc-mute)]"}`}>
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%`, background: d.emphasis ? "var(--lc-accent)" : "var(--lc-chart-rest)" }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--lc-mute)]">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Meter({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--lc-surface-soft)]">
      <div className="h-full rounded-full bg-[var(--lc-accent)]" style={{ width: `${value}%` }} />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="text-[12.5px] font-medium text-[var(--lc-ink)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function SliderField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-[var(--lc-ink)]">{label}</span>
        <span className="text-[12px] tabular-nums text-[var(--lc-mute)]">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lc-slider h-4 w-full"
        style={{ ["--lc-slider-fill" as string]: `${value}%` }}
        aria-label={label}
      />
    </div>
  );
}

export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  return { open, show: () => setOpen(true), hide: () => setOpen(false) };
}
