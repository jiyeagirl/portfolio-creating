"use client";

/* 관리자 콘솔 공용 프리미티브. 색은 사용자 앱과 동일한 styles/enclave.css의 --ec-*
   토큰을 그대로 상속한다(별도 admin 토큰 세트 없음). 구조(반경/그림자/표/드로어)는
   projects/b2b/assetflow/components/ui.tsx를 기준점으로만 참고해 새로 작성했다 — vercel_compact 반경 스케일
   (6 / 8 / 12px)을 그대로 쓴다. */

import Image from "next/image";
import { useId, useState } from "react";
import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { picsumId } from "@/projects/community/enclave/lib/mock-data";
import type { Tone } from "@/projects/community/enclave/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--ec-surface-soft)] text-[var(--ec-body)]",
  accent: "bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]",
  warn: "bg-[var(--ec-warn-soft)] text-[var(--ec-warn)]",
  danger: "bg-[var(--ec-danger-soft)] text-[var(--ec-danger)]",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

/* ── Button ── */

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-[var(--ec-ink)] text-white border border-[var(--ec-ink)] hover:opacity-90",
    secondary: "bg-[var(--ec-surface)] text-[var(--ec-ink)] border border-[var(--ec-border-strong)] hover:bg-[var(--ec-surface-soft)]",
    ghost: "bg-transparent text-[var(--ec-body)] border border-transparent hover:bg-[var(--ec-surface-soft)]",
    danger: "bg-[var(--ec-surface)] text-[var(--ec-danger)] border border-[var(--ec-danger-soft)] hover:bg-[var(--ec-danger-soft)]",
  };
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-[14px]" };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

/* ── Card / PageHead / Stat ── */

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`rounded-[8px] border border-[var(--ec-border)] bg-[var(--ec-surface)] ${padded ? "p-5" : ""} ${className}`}>
      {children}
    </section>
  );
}

export function CardHead({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ec-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--ec-muted)]">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function PageHead({ eyebrow, title, desc, actions }: { eyebrow: string; title: string; desc: string; actions?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--ec-border)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="ec-mono text-[12px] uppercase tracking-[0.08em] text-[var(--ec-muted)]">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ec-ink)]">{title}</h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--ec-body)]">{desc}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Stat({ label, value, delta, note }: { label: string; value: string; delta?: string; note?: string }) {
  const signed = delta ? /^[+-]/.test(delta) : false;
  const up = delta?.startsWith("+");
  return (
    <div className="rounded-[8px] border border-[var(--ec-border)] bg-[var(--ec-surface)] p-5">
      <p className="text-[13px] text-[var(--ec-muted)]">{label}</p>
      <p className="mt-2 tabular-nums text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ec-ink)]">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`text-[12px] font-medium ${
              !signed ? "text-[var(--ec-body)]" : up ? "text-[var(--ec-accent-ink)]" : "text-[var(--ec-danger)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && <span className="text-[12px] text-[var(--ec-muted)]">{note}</span>}
      </div>
    </div>
  );
}

/* ── Form ── */

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 text-[14px] text-[var(--ec-ink)] outline-none transition-colors placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-border-strong)]";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[var(--ec-ink)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--ec-muted)]">{hint}</p>}
    </label>
  );
}

export function Select({ value, options, onChange }: { value: string; options: string[]; onChange?: (next: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className={`${INPUT_CLASS} appearance-none pr-9`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <CaretDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ec-muted)]" />
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (next: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full">
      <MagnifyingGlass size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ec-muted)]" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${INPUT_CLASS} pl-9`} />
    </div>
  );
}

/* ── Tabs ── */

export function Tabs<T extends string>({ value, items, onChange }: { value: T; items: { key: T; label: string; count?: number }[]; onChange: (next: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--ec-border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-medium text-[var(--ec-ink)]" : "text-[var(--ec-muted)] hover:text-[var(--ec-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="ml-1.5 ec-mono text-[12px] text-[var(--ec-muted)]">{item.count}</span>}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--ec-accent)]" />}
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
          <tr className="border-b border-[var(--ec-border)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--ec-muted)] first:pl-0 last:pr-0 ${
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

export function Row({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick} className={`border-b border-[var(--ec-border)] last:border-b-0 ${onClick ? "cursor-pointer hover:bg-[var(--ec-surface-soft)]" : ""}`}>
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
        strong ? "font-medium text-[var(--ec-ink)]" : muted ? "text-[var(--ec-muted)]" : "text-[var(--ec-body)]"
      } ${mono ? "ec-mono" : ""} ${nowrap ? "whitespace-nowrap" : ""}`}
    >
      {children}
    </td>
  );
}

export function ThumbCell({ photoId, title }: { photoId: number; title: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[6px] bg-[var(--ec-surface-soft)]">
        <Image src={picsumId(photoId, 80, 80)} alt={title} fill sizes="36px" className="object-cover" />
      </span>
      <span className="max-w-[220px] truncate font-medium text-[var(--ec-ink)]">{title}</span>
    </span>
  );
}

export function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (next: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ec-border)] pt-4">
      <p className="ec-mono text-[12px] text-[var(--ec-muted)]">
        {from}-{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ec-border)] text-[var(--ec-body)] transition-colors hover:bg-[var(--ec-surface-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 ec-mono text-[13px] transition-colors ${
              n === page ? "bg-[var(--ec-ink)] text-white" : "border border-[var(--ec-border)] text-[var(--ec-body)] hover:bg-[var(--ec-surface-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--ec-border)] text-[var(--ec-body)] transition-colors hover:bg-[var(--ec-surface-soft)] disabled:opacity-35"
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
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(21,27,18,0.32)]" />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="ec-enter relative flex h-full w-full max-w-[480px] flex-col border-l border-[var(--ec-border)] bg-[var(--ec-surface)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--ec-border)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--ec-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--ec-muted)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--ec-border)] text-[var(--ec-body)] transition-colors hover:bg-[var(--ec-surface-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--ec-border)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

/* ── Definition list ── */

export function DefList({ items, columns = 2 }: { items: { label: string; value: React.ReactNode }[]; columns?: 1 | 2 }) {
  const cols = columns === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-1 gap-x-6 gap-y-0 ${cols}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 border-b border-[var(--ec-border)] py-2.5 last:border-b-0">
          <dt className="shrink-0 text-[13px] text-[var(--ec-muted)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--ec-ink)]">{item.value}</dd>
        </div>
      ))}
    </dl>
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
      <div className="flex items-stretch justify-center gap-6" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex w-9 shrink-0 flex-col justify-end gap-2">
            <p className={`ec-mono whitespace-nowrap text-center text-[11px] leading-4 ${d.emphasis ? "font-medium text-[var(--ec-ink)]" : "text-[var(--ec-muted)]"}`}>
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%`, background: d.emphasis ? "var(--ec-accent)" : "var(--ec-surface-sunken)" }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--ec-muted)]">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RankBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = ["#3D6B3F", "#5C8A5E", "#87A888", "#B0C4B1", "#DCE5DC"];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--ec-ink)]">{d.label}</span>
            <span className="ec-mono text-[13px] text-[var(--ec-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--ec-surface-soft)]">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: ramp[Math.min(index, ramp.length - 1)] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Accordion ── */

export function Accordion({ title, meta, children, defaultOpen = false }: { title: string; meta?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-[var(--ec-border)] last:border-b-0">
      <button type="button" onClick={() => setOpen((prev) => !prev)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-4 py-3.5 text-left">
        <span className="text-[14px] font-medium text-[var(--ec-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown size={13} className={`text-[var(--ec-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
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
