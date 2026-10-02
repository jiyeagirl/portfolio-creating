"use client";

import type { ReactNode } from "react";
import { CaretDown, X } from "@phosphor-icons/react";
import type { SafetyStatus } from "@/projects/monitoring/caresignal/lib/types";

type Tone = "neutral" | "primary" | "safe" | "caution" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[#f5f5f7] text-[#333333]",
  primary: "bg-[#eef4fb] text-[#0066cc]",
  safe: "bg-[#eaf6ee] text-[#248a3d]",
  caution: "bg-[#fdf2e3] text-[#9a5b00]",
  danger: "bg-[#fdecea] text-[#d70015]",
};

const STATUS_TONE: Record<SafetyStatus, Tone> = { safe: "safe", caution: "caution", danger: "danger" };
export const STATUS_LABEL: Record<SafetyStatus, string> = { safe: "안전", caution: "주의", danger: "위험" };
const STATUS_DOT: Record<SafetyStatus, string> = {
  safe: "bg-[#248a3d]",
  caution: "bg-[#ff9500]",
  danger: "bg-[#ff3b30]",
};

export function Tag({
  tone = "neutral",
  children,
  dot = false,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${TONE_CLASS[tone]}`}
    >
      {dot && tone !== "neutral" && tone !== "primary" && (
        <span className={`h-[6px] w-[6px] rounded-full ${STATUS_DOT[tone as SafetyStatus]}`} />
      )}
      {children}
    </span>
  );
}

export function StatusTag({ status }: { status: SafetyStatus }) {
  return (
    <Tag tone={STATUS_TONE[status]} dot>
      {STATUS_LABEL[status]}
    </Tag>
  );
}

export function PageHead({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#1d1d1f]">
          {title}
        </h1>
        <p className="mt-2.5 max-w-[64ch] text-[14px] leading-[1.55] text-[#7a7a7a]">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  note,
  actions,
  children,
  className = "",
  padded = false,
}: {
  title?: string;
  note?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`rounded-[18px] border border-[#e0e0e0] bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0f0f0] px-5 py-4">
          <div>
            {title && (
              <h2 className="text-[15px] font-semibold leading-none text-[#1d1d1f]">{title}</h2>
            )}
            {note && <p className="mt-1.5 text-[12.5px] text-[#7a7a7a]">{note}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  unit,
  delta,
  deltaGood,
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaGood?: boolean;
  note?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-5">
      <p className="text-[12.5px] font-normal leading-none text-[#7a7a7a]">{label}</p>
      <p className="mt-3 flex items-baseline gap-1.5 text-[#1d1d1f]">
        <span className="text-[27px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
          {value}
        </span>
        {unit && <span className="text-[13.5px] font-normal">{unit}</span>}
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        {delta && (
          <span
            className={`text-[12.5px] font-semibold tabular-nums ${
              deltaGood ? "text-[#248a3d]" : "text-[#d70015]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && <span className="text-[12.5px] font-normal text-[#7a7a7a]">{note}</span>}
      </div>
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "secondary",
  size = "md",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md";
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-[#0066cc] text-white",
    secondary: "border border-[#d2d2d7] bg-white text-[#1d1d1f]",
    quiet: "text-[#7a7a7a]",
    danger: "border border-[#f3c6c1] text-[#d70015]",
  };
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-9 px-4 text-[13.5px]" };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cs-press inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] font-semibold leading-none ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

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
    <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-[#d2d2d7] bg-white px-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-w-0 bg-transparent text-[13.5px] text-[#1d1d1f] outline-none placeholder:text-[#a1a1a6]"
      />
    </div>
  );
}

export function SelectField({
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
        className="h-9 appearance-none rounded-[8px] border border-[#d2d2d7] bg-white pl-3 pr-8 text-[13.5px] text-[#1d1d1f] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <CaretDown size={11} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1a6]" />
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
    <div className="flex items-center gap-6 border-b border-[#e0e0e0]">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`-mb-px border-b-2 pb-3 text-[14px] font-semibold leading-none transition-colors ${
            value === item.key ? "border-[#1d1d1f] text-[#1d1d1f]" : "border-transparent text-[#7a7a7a]"
          }`}
        >
          {item.label}
          {item.count !== undefined && <span className="ml-1.5 text-[#a1a1a6]">{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ── Data table ── */
export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#e0e0e0]">
            {head.map((cell, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-5 py-3 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f0f0]">{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick} className={`transition-colors ${onClick ? "cursor-pointer hover:bg-[#fafafc]" : ""}`}>
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
  wrap?: boolean;
}) {
  return (
    <td
      className={`px-5 py-3.5 text-[13.5px] ${wrap ? "" : "whitespace-nowrap"} ${
        align === "right" ? "text-right" : ""
      } ${strong ? "font-semibold text-[#1d1d1f]" : "font-normal text-[#333333]"}`}
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f0f0] px-5 py-3.5">
      <p className="text-[12.5px] font-normal text-[#7a7a7a]">전체 {total.toLocaleString()}명</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-8 rounded-[6px] px-3 text-[12.5px] font-semibold text-[#7a7a7a] disabled:opacity-40"
        >
          이전
        </button>
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={`h-8 min-w-8 rounded-[6px] px-2 text-[12.5px] font-semibold ${
              page === i + 1 ? "bg-[#f5f5f7] text-[#1d1d1f]" : "text-[#7a7a7a]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="h-8 rounded-[6px] px-3 text-[12.5px] font-semibold text-[#7a7a7a] disabled:opacity-40"
        >
          다음
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
      <button aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(0,0,0,0.32)]" />
      <aside className="relative flex h-full w-full max-w-[460px] flex-col border-l border-[#e0e0e0] bg-white">
        <header className="flex items-start justify-between gap-4 border-b border-[#f0f0f0] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[17px] font-semibold leading-[1.4] text-[#1d1d1f]">{title}</p>
            {subtitle && <p className="mt-1 text-[13px] text-[#7a7a7a]">{subtitle}</p>}
          </div>
          <button aria-label="닫기" onClick={onClose} className="shrink-0 pt-1 text-[#7a7a7a]">
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-[#f0f0f0] px-6 py-4">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[#f0f0f0] py-3.5 last:border-b-0">
      <span className="shrink-0 text-[13px] text-[#7a7a7a]">{label}</span>
      <span className="text-right text-[13.5px] font-semibold text-[#1d1d1f]">{children}</span>
    </div>
  );
}

export function Monogram({
  name,
  size = 36,
  tone = "neutral",
}: {
  name: string;
  size?: number;
  tone?: "neutral" | "primary" | "dark";
}) {
  const bg = tone === "primary" ? "bg-[#eef4fb] text-[#0066cc]" : tone === "dark" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#333333]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${bg}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <p className="text-[15px] font-semibold text-[#1d1d1f]">{title}</p>
      <p className="mt-2 max-w-[40ch] text-[13.5px] leading-[1.6] text-[#7a7a7a]">{body}</p>
    </div>
  );
}
