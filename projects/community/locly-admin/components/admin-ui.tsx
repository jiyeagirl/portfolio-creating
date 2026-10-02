"use client";

import type { ReactNode } from "react";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { AdminApproval } from "@/projects/community/locly/lib/types";

/** Console sections. Lives here, not in LOCLY's navigation module — the
    resident site has no notion of the operator console. */
export type AdminSection = "overview" | "members" | "posts" | "events" | "stores" | "civic";

/* ── Status badge ─────────────────────────────────────────────────────────
   Admin status colors come from the semantic tokens, never coral — coral
   stays reserved for actions (design.md §5).                              */
export type AdminTone = "neutral" | "ok" | "wait" | "danger" | "info";

const TONES: Record<AdminTone, string> = {
  neutral: "bg-[var(--lc-surface-card)] text-[var(--lc-body)]",
  ok: "bg-[rgba(93,184,166,0.16)] text-[#2f7d6f]",
  wait: "bg-[rgba(212,160,23,0.18)] text-[#8a6a10]",
  danger: "bg-[rgba(198,69,69,0.12)] text-[var(--lc-error)]",
  info: "bg-[rgba(24,23,21,0.06)] text-[var(--lc-ink)]",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: AdminTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-[3px] text-[12px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export const APPROVAL_TONE: Record<AdminApproval["status"], AdminTone> = {
  대기: "wait",
  승인: "ok",
  반려: "danger",
};

/* ── Page furniture ──────────────────────────────────────────────────────── */
export function AdminPageHead({
  title,
  lead,
  action,
}: {
  title: string;
  lead: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-[var(--lc-ink)]">{title}</h1>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.55] text-[var(--lc-muted)]">{lead}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  meta,
  action,
  children,
  padded = true,
}: {
  title?: string;
  meta?: string;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <section className="rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)]">
      {title && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--lc-hairline)] px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[15px] font-medium text-[var(--lc-ink)]">{title}</h2>
            {meta && <span className="text-[13px] text-[var(--lc-muted-soft)]">{meta}</span>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? "p-6" : ""}>{children}</div>
    </section>
  );
}

/* ── Controls ────────────────────────────────────────────────────────────── */
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] px-3 sm:max-w-[320px]">
      <MagnifyingGlass size={15} className="shrink-0 text-[var(--lc-muted-soft)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--lc-ink)] outline-none placeholder:text-[var(--lc-muted-soft)]"
      />
      {value && (
        <button aria-label="검색어 지우기" onClick={() => onChange("")} className="text-[var(--lc-muted-soft)]">
          <X size={13} />
        </button>
      )}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] pl-3 pr-8 text-[14px] text-[var(--lc-ink)] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <CaretDown
        size={12}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lc-muted-soft)]"
      />
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { key: T; label: string; count?: number }[];
}) {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--lc-hairline)]">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`-mb-px border-b-2 pb-3 text-[14px] font-medium transition-colors ${
            value === item.key
              ? "border-[var(--lc-ink)] text-[var(--lc-ink)]"
              : "border-transparent text-[var(--lc-muted)]"
          }`}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ml-1.5 text-[var(--lc-muted-soft)]">{item.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "secondary",
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md";
}) {
  const variants = {
    primary: "bg-[var(--lc-primary)] text-[var(--lc-on-primary)] active:bg-[var(--lc-primary-active)]",
    secondary:
      "border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] text-[var(--lc-ink)] active:bg-[var(--lc-surface-card)]",
    quiet: "text-[var(--lc-muted)] active:text-[var(--lc-ink)]",
    danger: "border border-[rgba(198,69,69,0.3)] text-[var(--lc-error)] active:bg-[rgba(198,69,69,0.08)]",
  };
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-9 px-4 text-[14px]" };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] font-medium transition-colors ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

/** Form field shared by the registration drawers. */
export function Field({
  label,
  placeholder,
  textarea,
  hint,
}: {
  label: string;
  placeholder: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[var(--lc-body-strong)]">{label}</span>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="mt-2 w-full resize-none rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] p-3.5 text-[14px] leading-[1.6] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
        />
      ) : (
        <input
          placeholder={placeholder}
          className="mt-2 h-10 w-full rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] px-3.5 text-[14px] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
        />
      )}
      {hint && <span className="mt-1.5 block text-[12px] text-[var(--lc-muted-soft)]">{hint}</span>}
    </label>
  );
}

/* ── Data table ──────────────────────────────────────────────────────────── */
export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--lc-hairline)]">
            {head.map((cell, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-6 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--lc-muted-soft)]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--lc-hairline-soft)]">{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${onClick ? "cursor-pointer active:bg-[var(--lc-surface-soft)]" : ""}`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  strong,
  align = "left",
  wrap,
}: {
  children: ReactNode;
  strong?: boolean;
  align?: "left" | "right";
  /** Opt in to wrapping. Off by default so dates and emails never split
      across two lines when the table is at its minimum width. */
  wrap?: boolean;
}) {
  return (
    <td
      className={`px-6 py-4 text-[14px] ${wrap ? "" : "whitespace-nowrap"} ${
        align === "right" ? "text-right" : ""
      } ${strong ? "font-medium text-[var(--lc-ink)]" : "text-[var(--lc-body)]"}`}
    >
      {children}
    </td>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  onChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--lc-hairline)] px-6 py-3.5">
      <p className="text-[13px] text-[var(--lc-muted)]">전체 {total.toLocaleString()}건</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-8 rounded-[6px] px-3 text-[13px] font-medium text-[var(--lc-muted)] disabled:opacity-40"
        >
          이전
        </button>
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={`h-8 min-w-8 rounded-[6px] px-2 text-[13px] font-medium transition-colors ${
              page === i + 1
                ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                : "text-[var(--lc-muted)]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="h-8 rounded-[6px] px-3 text-[13px] font-medium text-[var(--lc-muted)] disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </div>
  );
}

/* ── Drawer ──────────────────────────────────────────────────────────────── */
export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,20,19,0.32)]"
      />
      <aside className="relative flex h-full w-full max-w-[440px] flex-col border-l border-[var(--lc-hairline)] bg-[var(--lc-canvas)]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--lc-hairline)] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[17px] font-medium leading-[1.4] text-[var(--lc-ink)]">{title}</p>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--lc-muted)]">{subtitle}</p>}
          </div>
          <button aria-label="닫기" onClick={onClose} className="shrink-0 pt-1 text-[var(--lc-muted)]">
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-[var(--lc-hairline)] px-6 py-4">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[var(--lc-hairline-soft)] py-3.5 last:border-b-0">
      <span className="shrink-0 text-[13px] text-[var(--lc-muted)]">{label}</span>
      <span className="text-right text-[14px] font-medium text-[var(--lc-ink)]">{children}</span>
    </div>
  );
}

/* ── Utilities ───────────────────────────────────────────────────────────── */
/** Admin tables show absolute dates, never "3분 전" — operators compare rows. */
export function formatAdminDate(iso: string) {
  const date = new Date(iso);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return iso.includes("T") ? `${mm}.${dd} ${hh}:${mi}` : `${mm}.${dd}`;
}

/* ── Charts (hand-rolled — the workspace has no chart dependency) ────────── */
export function AreaChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values) * 1.15;
  const w = 640;
  const h = 180;
  const step = w / (values.length - 1);
  const points = values.map((v, i) => [i * step, h - (v / max) * h] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 180 }}>
        <defs>
          <linearGradient id="lc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--lc-primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--lc-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1="0"
            x2={w}
            y1={h * t}
            y2={h * t}
            stroke="var(--lc-hairline)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill="url(#lc-area)" />
        <path
          d={line}
          fill="none"
          stroke="var(--lc-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="var(--lc-canvas)" stroke="var(--lc-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-3 flex justify-between text-[12px] text-[var(--lc-muted-soft)]">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-baseline justify-between text-[14px]">
            <span className="text-[var(--lc-ink)]">{item.label}</span>
            <span className="font-medium text-[var(--lc-body)]">{item.value.toLocaleString()}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--lc-surface-card)]">
            <span
              className="block h-full rounded-full bg-[var(--lc-ink)]"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
