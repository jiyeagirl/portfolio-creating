"use client";

/**
 * GenderInsight 공용 프리미티브. 값은 전부 styles/genderinsight.css의 --gi-* 토큰을
 * 참조하고 여기서 새 색을 만들지 않는다. 반경은 6(버튼·입력) / 8(카드) / full(배지)만 쓴다.
 */

import { useId, useState } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { Tone } from "@/projects/b2b/genderinsight/lib/types";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--gi-soft-2)] text-[var(--gi-body)]",
  info: "bg-[var(--gi-info-soft)] text-[var(--gi-info-deep)]",
  warn: "bg-[var(--gi-warn-soft)] text-[var(--gi-warn-deep)]",
  ink: "bg-[var(--gi-accent)] text-[var(--gi-on-primary)]",
  danger: "bg-[var(--gi-danger-soft)] text-[var(--gi-danger-deep)]",
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
      {dot && (
        <span className="gi-live-dot relative inline-block h-[5px] w-[5px] rounded-full bg-current" />
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
      "bg-[var(--gi-accent)] text-[var(--gi-on-primary)] border border-[var(--gi-accent)] hover:bg-[var(--gi-accent-deep)] hover:border-[var(--gi-accent-deep)]",
    secondary:
      "bg-[var(--gi-canvas)] text-[var(--gi-ink)] border border-[var(--gi-hairline)] hover:bg-[var(--gi-soft)]",
    ghost:
      "bg-transparent text-[var(--gi-body)] border border-transparent hover:bg-[var(--gi-soft-2)] hover:text-[var(--gi-ink)]",
    danger:
      "bg-[var(--gi-canvas)] text-[var(--gi-danger-deep)] border border-[var(--gi-danger-soft)] hover:bg-[var(--gi-danger-soft)]",
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
      className={`rounded-[8px] border border-[var(--gi-hairline)] ${
        soft ? "bg-[var(--gi-soft)]" : "bg-[var(--gi-canvas)]"
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--gi-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--gi-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--gi-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="gi-mono text-[12px] uppercase tracking-[0.08em] text-[var(--gi-mute)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--gi-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--gi-body)]">{desc}</p>
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
          ? "border-[var(--gi-accent)] bg-[var(--gi-accent)] text-[var(--gi-on-primary)]"
          : "border-[var(--gi-hairline)] bg-[var(--gi-canvas)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--gi-mute)]"}`}>{label}</p>
      <p
        className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] ${
          emphasis ? "text-[var(--gi-on-primary)]" : "text-[var(--gi-ink)]"
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
                  ? "text-[var(--gi-body)]"
                  : up
                    ? "text-[var(--gi-info-deep)]"
                    : "text-[var(--gi-danger-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--gi-mute)]"}`}>
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Avatar ── */

export function Avatar({
  name,
  size = 32,
  tone = "light",
}: {
  name: string;
  size?: number;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${
        tone === "dark"
          ? "bg-[#3a2c34] text-white"
          : "bg-[var(--gi-accent-soft)] text-[var(--gi-accent-deep)]"
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {name.slice(-2)}
    </span>
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
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--gi-ink)]">
        {label}
        {required && <span className="text-[var(--gi-danger)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--gi-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] px-3 text-[14px] text-[var(--gi-ink)] outline-none transition-colors placeholder:text-[var(--gi-mute)] focus:border-[var(--gi-hairline-strong)]";

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
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gi-mute)]">
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
      className="w-full resize-none rounded-[6px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] px-3 py-2.5 text-[14px] leading-5 text-[var(--gi-ink)] outline-none transition-colors placeholder:text-[var(--gi-mute)] focus:border-[var(--gi-hairline-strong)]"
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
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gi-mute)]"
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
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gi-mute)]"
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

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex items-center gap-2 rounded-[6px] border px-3 py-2 text-left text-[13px] transition-colors ${
        checked
          ? "border-[var(--gi-accent)] bg-[var(--gi-accent-soft)] text-[var(--gi-accent-deep)]"
          : "border-[var(--gi-hairline)] text-[var(--gi-body)] hover:bg-[var(--gi-soft)]"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
          checked ? "border-[var(--gi-accent)] bg-[var(--gi-accent)]" : "border-[var(--gi-hairline-strong)]"
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2.5 6.2 5 8.7l4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="sm"
      onClassName="bg-[var(--gi-accent)]"
      offClassName="bg-[#ddd3d9]"
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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--gi-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active
                ? "font-medium text-[var(--gi-ink)]"
                : "text-[var(--gi-mute)] hover:text-[var(--gi-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 gi-mono text-[12px] text-[var(--gi-mute)]">{item.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--gi-accent)]" />
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
    <div className="inline-flex rounded-[6px] border border-[var(--gi-hairline)] bg-[var(--gi-soft)] p-[3px]">
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
                ? "bg-[var(--gi-canvas)] font-medium text-[var(--gi-ink)] shadow-[0_1px_1px_rgba(34,27,29,0.04)]"
                : "text-[var(--gi-mute)] hover:text-[var(--gi-body)]"
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
  /** 표가 들어가는 컬럼보다 넓으면 마지막 열이 잘려 보인다. 사이드바가 있는
   *  1440px 레이아웃의 좁은 컬럼이 약 600px이라 기본값을 그 아래로 잡는다. */
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
          <tr className="border-b border-[var(--gi-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--gi-mute)] first:pl-0 last:pr-0 ${
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
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--gi-hairline)] last:border-b-0 ${
        onClick ? "cursor-pointer" : ""
      } ${active ? "bg-[var(--gi-soft)]" : "hover:bg-[var(--gi-soft)]"}`}
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
      } ${strong ? "font-medium text-[var(--gi-ink)]" : muted ? "text-[var(--gi-mute)]" : "text-[var(--gi-body)]"} ${
        mono ? "gi-mono" : ""
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--gi-hairline)] pt-4">
      <p className="gi-mono text-[12px] text-[var(--gi-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] transition-colors hover:bg-[var(--gi-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 gi-mono text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--gi-accent)] text-[var(--gi-on-primary)]"
                : "border border-[var(--gi-hairline)] text-[var(--gi-body)] hover:bg-[var(--gi-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] transition-colors hover:bg-[var(--gi-soft)] disabled:opacity-35"
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
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(34,27,29,0.32)]"
      />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="gi-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--gi-hairline)] bg-[var(--gi-canvas)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--gi-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--gi-ink)]">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--gi-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] transition-colors hover:bg-[var(--gi-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <footer className="border-t border-[var(--gi-hairline)] px-6 py-4">{footer}</footer>
        )}
      </aside>
    </div>
  );
}

/* ── Meter / Score scale ── */

export function Meter({
  value,
  tone = "ink",
}: {
  value: number;
  tone?: "ink" | "info" | "warn";
}) {
  const color =
    tone === "info" ? "var(--gi-info)" : tone === "warn" ? "var(--gi-warn)" : "var(--gi-accent)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--gi-soft-2)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/** 1~5점 리커트 척도를 점 다섯 개로 시각화한다. 영역별 점수 카드, 개인 결과 화면에 쓴다. */
export function ScoreScale({ score, max = 5 }: { score: number; max?: number }) {
  const dots = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1.5">
      {dots.map((dot) => {
        const fill = Math.max(0, Math.min(1, score - (dot - 1)));
        return (
          <span
            key={dot}
            className="relative h-2.5 w-2.5 overflow-hidden rounded-full bg-[var(--gi-soft-2)]"
          >
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 bg-[var(--gi-accent)]"
                style={{ width: `${fill * 100}%` }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ── Charts ── */

/** 단일 계열 세로 막대. 응답 추이처럼 시간에 따른 누적/일별 값에 쓴다. */
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
          <div key={d.label} className="flex min-w-[44px] flex-1 flex-col justify-end gap-2">
            <p
              className={`gi-mono whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--gi-ink)]" : "text-[var(--gi-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--gi-accent)" : "var(--gi-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--gi-mute)]">
              {d.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 순위형 가로 막대. 부서/직급 비교처럼 값으로 정렬되는 데이터에 색조 명도 단계 + 직접 라벨을 쓴다. */
export function RankBars({
  data,
}: {
  data: { label: string; value: number; caption: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = [
    "var(--gi-chart-1)",
    "var(--gi-chart-2)",
    "var(--gi-chart-3)",
    "var(--gi-chart-4)",
    "var(--gi-chart-5)",
  ];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--gi-ink)]">{d.label}</span>
            <span className="gi-mono text-[13px] text-[var(--gi-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--gi-soft-2)]">
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

/** 부서/직급별 참여율처럼 목표 대비 실적을 겹쳐 보여준다. 축이 같은 값(명)이라 하나만 쓴다. */
export function CompareChart({
  data,
  height = 176,
}: {
  data: { label: string; target: number; actual: number }[];
  height?: number;
}) {
  const max = Math.max(...data.flatMap((d) => [d.target, d.actual]), 1);
  return (
    <div>
      <div className="flex items-stretch gap-3" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col justify-end gap-2">
            <div className="flex flex-1 items-end justify-center gap-[3px]">
              <div
                className="w-1/2 max-w-[18px] rounded-t-[4px] bg-[var(--gi-chart-rest)]"
                style={{ height: `${(d.target / max) * 100}%` }}
              />
              <div
                className="w-1/2 max-w-[18px] rounded-t-[4px] bg-[var(--gi-accent)]"
                style={{ height: `${(d.actual / max) * 100}%` }}
              />
            </div>
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--gi-mute)]">
              {d.label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 border-t border-[var(--gi-hairline)] pt-3">
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--gi-body)]">
          <span className="h-2 w-2 rounded-[2px] bg-[var(--gi-chart-rest)]" />
          대상 인원
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--gi-body)]">
          <span className="h-2 w-2 rounded-[2px] bg-[var(--gi-accent)]" />
          응답 인원
        </span>
      </div>
    </div>
  );
}

/* ── Timeline ── */

export function Timeline({
  steps,
}: {
  steps: { label: string; at: string; done: boolean; note?: string }[];
}) {
  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute left-[7px] top-4 w-px"
                style={{
                  bottom: 0,
                  background: step.done ? "var(--gi-accent)" : "var(--gi-hairline)",
                }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done
                  ? "border-[var(--gi-accent)] bg-[var(--gi-accent)]"
                  : "border-[var(--gi-hairline-strong)] bg-[var(--gi-canvas)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={`text-[14px] ${
                    step.done ? "font-medium text-[var(--gi-ink)]" : "text-[var(--gi-mute)]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="gi-mono text-[12px] text-[var(--gi-mute)]">{step.at}</p>
              </div>
              {step.note && (
                <p className="mt-1 text-[13px] leading-5 text-[var(--gi-body)]">{step.note}</p>
              )}
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
          className="flex items-start justify-between gap-4 border-b border-[var(--gi-hairline)] py-2.5 last:border-b-0"
        >
          <dt className="shrink-0 text-[13px] text-[var(--gi-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--gi-ink)]">
            {item.value}
          </dd>
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
    <div className="border-b border-[var(--gi-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--gi-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown
            size={13}
            className={`text-[var(--gi-mute)] transition-transform ${open ? "rotate-180" : ""}`}
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
