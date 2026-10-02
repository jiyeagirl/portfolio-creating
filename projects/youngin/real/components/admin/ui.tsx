"use client";

/* CIVICPIN 운영 콘솔 프리미티브. 사용자 앱과 같은 --cp-* 토큰을 쓰되 문법이 다르다.
   모바일 앱: 반경 16px + 그림자 카드, 웹 콘솔: 반경 8px + hairline 보더 카드.
   _reference-ui.tsx(assetflow)를 구조 기준으로만 참조했고 색과 톤 어휘는 새로 정의했다. */

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import type { ReportStatus } from "@/projects/youngin/real/lib/types";

/* ── Badge ── */

export type Tone = "neutral" | "info" | "warn" | "ok" | "danger" | "ink";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--cp-sunken)] text-[var(--cp-body)]",
  info: "bg-[var(--cp-accent-soft)] text-[var(--cp-accent)]",
  warn: "bg-[var(--cp-warn-soft)] text-[var(--cp-warn)]",
  ok: "bg-[var(--cp-ok-soft)] text-[var(--cp-ok)]",
  danger: "bg-[var(--cp-danger-soft)] text-[var(--cp-danger)]",
  ink: "bg-[var(--cp-accent)] text-[var(--cp-on-accent)]",
};

/** 신고 워크플로우 4단계를 색으로 고정한다. 다른 화면에서 임의로 바꾸지 않는다. */
export const REPORT_TONE: Record<ReportStatus, Tone> = {
  접수: "info",
  검토: "warn",
  반영: "ink",
  완료: "ok",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && <span className="inline-block h-[5px] w-[5px] rounded-full bg-current" />}
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
  ariaLabel,
}: {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const variants = {
    primary:
      "bg-[var(--cp-accent)] text-[var(--cp-on-accent)] border border-[var(--cp-accent)] hover:bg-[var(--cp-accent-strong)]",
    secondary:
      "bg-[var(--cp-surface)] text-[var(--cp-ink)] border border-[var(--cp-hairline)] hover:bg-[var(--cp-soft)]",
    ghost:
      "bg-transparent text-[var(--cp-body)] border border-transparent hover:bg-[var(--cp-sunken)] hover:text-[var(--cp-ink)]",
    danger:
      "bg-[var(--cp-surface)] text-[var(--cp-danger)] border border-[var(--cp-danger-soft)] hover:bg-[var(--cp-danger-soft)]",
  };
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-[14px]", lg: "h-12 px-5 text-[15px]" };

  return (
    <button
      type="button"
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

/* ── 컨테이너 ── */

export function Card({
  children,
  className = "",
  padded = true,
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  soft?: boolean;
}) {
  return (
    <section
      className={`rounded-[8px] border border-[var(--cp-hairline)] ${
        soft ? "bg-[var(--cp-soft)]" : "bg-[var(--cp-surface)]"
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
  action?: ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--cp-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--cp-mute)]">{desc}</p>}
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
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--cp-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="cp-num text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--cp-mute)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[24px] font-bold leading-8 tracking-[-0.03em] text-[var(--cp-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--cp-body)]">{desc}</p>
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
          ? "border-[var(--cp-accent)] bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
          : "border-[var(--cp-hairline)] bg-[var(--cp-surface)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--cp-mute)]"}`}>{label}</p>
      <p
        className={`cp-num mt-2 text-[26px] font-bold leading-8 tracking-[-0.03em] ${
          emphasis ? "text-[var(--cp-on-accent)]" : "text-[var(--cp-ink)]"
        }`}
      >
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {delta && (
          <span
            className={`cp-num text-[12px] font-medium ${
              emphasis
                ? "text-white/90"
                : !signed
                  ? "text-[var(--cp-body)]"
                  : up
                    ? "text-[var(--cp-accent)]"
                    : "text-[var(--cp-danger)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--cp-mute)]"}`}>
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
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--cp-ink)]">
        {label}
        {required && <span className="text-[var(--cp-danger)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--cp-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-3 text-[14px] text-[var(--cp-ink)] outline-none transition-colors placeholder:text-[var(--cp-faint)] focus:border-[var(--cp-accent)]";

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
  /** "date" 처럼 브라우저 기본 입력기를 쓰고 싶을 때만 넘긴다 */
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
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--cp-mute)]">
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
      rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[6px] border border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-3 py-2.5 text-[14px] leading-[21px] text-[var(--cp-ink)] outline-none transition-colors placeholder:text-[var(--cp-faint)] focus:border-[var(--cp-accent)]"
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
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cp-mute)]"
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
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cp-mute)]"
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

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <SharedToggle
      checked={on}
      onChange={onChange}
      label={label}
      size="sm"
      onClassName="bg-[var(--cp-accent)]"
      offClassName="bg-[var(--cp-hairline-strong)]"
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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--cp-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active ? "true" : undefined}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active
                ? "font-medium text-[var(--cp-ink)]"
                : "text-[var(--cp-mute)] hover:text-[var(--cp-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="cp-num ml-1.5 text-[12px] text-[var(--cp-mute)]">{item.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--cp-accent)]" />
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
    <div className="inline-flex rounded-[6px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)] p-[3px]">
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
                ? "bg-[var(--cp-surface)] font-medium text-[var(--cp-ink)] shadow-[0_1px_1px_rgba(20,24,30,0.06)]"
                : "text-[var(--cp-mute)] hover:text-[var(--cp-body)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Table ──
   overflow-x-auto 안에 있어 컬럼 폭 합이 minWidth 를 넘으면 마지막 열이 조용히 잘린다.
   컬럼 예산은 design.md "표 밀도 / 컬럼 예산" 절에 적어두었다. */

export function Table({
  head,
  children,
  align = [],
  minWidth = 760,
}: {
  head: string[];
  children: ReactNode;
  align?: ("left" | "right" | "center")[];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-[var(--cp-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--cp-mute)] first:pl-0 last:pr-0 ${
                  align[index] === "right"
                    ? "text-right"
                    : align[index] === "center"
                      ? "text-center"
                      : ""
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
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--cp-hairline)] last:border-b-0 ${
        onClick ? "cursor-pointer" : ""
      } ${active ? "bg-[var(--cp-accent-soft)]" : "hover:bg-[var(--cp-soft)]"}`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align = "left",
  strong = false,
  num = false,
  muted = false,
  nowrap = false,
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  strong?: boolean;
  num?: boolean;
  muted?: boolean;
  nowrap?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 text-[13px] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${strong ? "font-medium text-[var(--cp-ink)]" : muted ? "text-[var(--cp-mute)]" : "text-[var(--cp-body)]"} ${
        num ? "cp-num" : ""
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--cp-hairline)] pt-4">
      <p className="cp-num text-[12px] text-[var(--cp-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--cp-hairline)] text-[var(--cp-body)] transition-colors hover:bg-[var(--cp-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`cp-num h-8 min-w-8 rounded-[6px] px-2 text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
                : "border border-[var(--cp-hairline)] text-[var(--cp-body)] hover:bg-[var(--cp-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--cp-hairline)] text-[var(--cp-body)] transition-colors hover:bg-[var(--cp-soft)] disabled:opacity-35"
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
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,24,30,0.36)]"
      />
      <aside
        role="dialog"
        aria-label={title}
        className="cp-enter relative flex h-full w-full max-w-[540px] flex-col border-l border-[var(--cp-hairline)] bg-[var(--cp-surface)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--cp-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--cp-ink)]">
              {title}
            </h2>
            {subtitle && <p className="cp-num mt-1 text-[13px] text-[var(--cp-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--cp-hairline)] text-[var(--cp-body)] transition-colors hover:bg-[var(--cp-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <footer className="border-t border-[var(--cp-hairline)] px-6 py-4">{footer}</footer>
        )}
      </aside>
    </div>
  );
}

/* ── 표시 요소 ── */

export function DefList({
  items,
  columns = 2,
}: {
  items: { label: string; value: ReactNode }[];
  columns?: 1 | 2 | 3;
}) {
  const cols = columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-1 gap-x-6 ${cols}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 border-b border-[var(--cp-hairline)] py-2.5 last:border-b-0"
        >
          <dt className="shrink-0 text-[13px] text-[var(--cp-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--cp-ink)]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({
  steps,
}: {
  steps: { label: string; at: string; done: boolean; note?: string; by?: string }[];
}) {
  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={`${step.label}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute bottom-0 left-[7px] top-4 w-px"
                style={{ background: step.done ? "var(--cp-accent)" : "var(--cp-hairline)" }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done
                  ? "border-[var(--cp-accent)] bg-[var(--cp-accent)]"
                  : "border-[var(--cp-hairline-strong)] bg-[var(--cp-surface)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={`text-[14px] ${
                    step.done ? "font-medium text-[var(--cp-ink)]" : "text-[var(--cp-mute)]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="cp-num text-[12px] text-[var(--cp-mute)]">{step.at}</p>
              </div>
              {step.note && (
                <p className="mt-1 text-[13px] leading-5 text-[var(--cp-body)]">{step.note}</p>
              )}
              {step.by && <p className="mt-0.5 text-[12px] text-[var(--cp-mute)]">{step.by}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── 차트 (라이브러리 없이 직접 구현) ── */

export function BarChart({
  data,
  format,
  height = 152,
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
            <p
              className={`cp-num whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--cp-ink)]" : "text-[var(--cp-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--cp-accent)" : "var(--cp-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--cp-mute)]">
              {d.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RankBars({
  data,
}: {
  data: { label: string; value: number; caption: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = [
    "var(--cp-chart-1)",
    "var(--cp-chart-2)",
    "var(--cp-chart-3)",
    "var(--cp-chart-4)",
    "var(--cp-chart-5)",
  ];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--cp-ink)]">{d.label}</span>
            <span className="cp-num text-[13px] text-[var(--cp-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--cp-sunken)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: ramp[Math.min(index, ramp.length - 1)],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 신고 상태 4단계의 분포. 파이 차트 대신 가로 스택 한 줄로 보여준다. */
export function StatusStack({
  data,
}: {
  data: { status: ReportStatus; count: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const fill: Record<ReportStatus, string> = {
    접수: "var(--cp-chart-4)",
    검토: "var(--cp-warn)",
    반영: "var(--cp-chart-2)",
    완료: "var(--cp-ok)",
  };
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {data.map((d) => (
          <span
            key={d.status}
            style={{ width: `${(d.count / total) * 100}%`, background: fill[d.status] }}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        {data.map((d) => (
          <li key={d.status} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-[3px]"
              style={{ background: fill[d.status] }}
            />
            <span className="text-[12.5px] text-[var(--cp-body)]">{d.status}</span>
            <span className="cp-num ml-auto text-[13px] font-medium text-[var(--cp-ink)]">
              {d.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Accordion({
  title,
  meta,
  children,
  defaultOpen = false,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-[var(--cp-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--cp-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown
            size={13}
            className={`text-[var(--cp-mute)] transition-transform ${open ? "rotate-180" : ""}`}
          />
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

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[8px] border border-dashed border-[var(--cp-hairline-strong)] px-6 py-12 text-center">
      <p className="text-[14px] font-medium text-[var(--cp-body)]">{title}</p>
      <p className="mt-1.5 text-[13px] leading-5 text-[var(--cp-mute)]">{desc}</p>
    </div>
  );
}
