"use client";

/**
 * MarketFlow 공용 프리미티브. 값은 전부 styles/marketflow.css의 --mf-* 토큰을 참조한다.
 * 반경은 web 콘솔 구조 베이스라인(6px 버튼·입력 / 8px 카드 / full 배지)만 쓴다.
 * assetflow의 components/ui.tsx를 구조 기준으로만 참고했고, 색과 톤 어휘는 새로 만들었다.
 */

import { useId, useState } from "react";
import Image from "next/image";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { CaretDown, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { Tone } from "@/projects/monitoring/marketflow/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--mf-soft-2)] text-[var(--mf-body)]",
  info: "bg-[var(--mf-info-soft)] text-[var(--mf-info-deep)]",
  warn: "bg-[var(--mf-warn-soft)] text-[var(--mf-warn-deep)]",
  ink: "bg-[var(--mf-primary)] text-[var(--mf-on-primary)]",
  danger: "bg-[var(--mf-danger-soft)] text-[var(--mf-danger-deep)]",
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
      {dot && <span className="mf-live-dot relative inline-block h-[5px] w-[5px] rounded-full bg-current" />}
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
      "bg-[var(--mf-primary)] text-[var(--mf-on-primary)] border border-[var(--mf-primary)] hover:bg-[var(--mf-primary-active)]",
    secondary:
      "bg-[var(--mf-canvas)] text-[var(--mf-ink)] border border-[var(--mf-hairline)] hover:bg-[var(--mf-soft)]",
    ghost:
      "bg-transparent text-[var(--mf-body)] border border-transparent hover:bg-[var(--mf-soft-2)] hover:text-[var(--mf-ink)]",
    danger:
      "bg-[var(--mf-canvas)] text-[var(--mf-danger-deep)] border border-[var(--mf-danger-soft)] hover:bg-[var(--mf-danger-soft)]",
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
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
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
      className={`rounded-[8px] border border-[var(--mf-hairline)] ${
        soft ? "bg-[var(--mf-soft)]" : "bg-[var(--mf-canvas)]"
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--mf-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--mf-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--mf-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="mf-mono text-[12px] uppercase tracking-[0.08em] text-[var(--mf-mute)]">{eyebrow}</p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--mf-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--mf-body)]">{desc}</p>
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
          ? "border-[var(--mf-primary)] bg-[var(--mf-primary)] text-[var(--mf-on-primary)]"
          : "border-[var(--mf-hairline)] bg-[var(--mf-canvas)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--mf-mute)]"}`}>{label}</p>
      <p
        className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.03em] ${
          emphasis ? "text-[var(--mf-on-primary)]" : "text-[var(--mf-ink)]"
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
                  ? "text-[var(--mf-body)]"
                  : up
                    ? "text-[var(--mf-info-deep)]"
                    : "text-[var(--mf-danger-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--mf-mute)]"}`}>{note}</span>
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
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--mf-ink)]">
        {label}
        {required && <span className="text-[var(--mf-danger)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--mf-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--mf-hairline)] bg-[var(--mf-canvas)] px-3 text-[14px] text-[var(--mf-ink)] outline-none transition-colors placeholder:text-[var(--mf-mute)] focus:border-[var(--mf-hairline-strong)]";

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
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--mf-mute)]">
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
  rows = 4,
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
      className="w-full resize-none rounded-[6px] border border-[var(--mf-hairline)] bg-[var(--mf-canvas)] px-3 py-2.5 text-[14px] leading-6 text-[var(--mf-ink)] outline-none transition-colors placeholder:text-[var(--mf-mute)] focus:border-[var(--mf-hairline-strong)]"
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
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mf-mute)]"
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
      <MagnifyingGlassIcon />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLASS} pl-9`}
      />
    </div>
  );
}

function MagnifyingGlassIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 256 256"
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mf-mute)]"
      fill="currentColor"
    >
      <path d="M229.66 218.34 179.6 168.28a88.21 88.21 0 1 0-11.32 11.32l50.06 50.06a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72Z" />
    </svg>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="sm"
      onClassName="bg-[var(--mf-primary)]"
      offClassName="bg-[#dcd4c8]"
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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--mf-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-medium text-[var(--mf-ink)]" : "text-[var(--mf-mute)] hover:text-[var(--mf-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 mf-mono text-[12px] text-[var(--mf-mute)]">{item.count}</span>
            )}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--mf-primary)]" />}
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
    <div className="inline-flex rounded-[6px] border border-[var(--mf-hairline)] bg-[var(--mf-soft)] p-[3px]">
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
                ? "bg-[var(--mf-canvas)] font-medium text-[var(--mf-ink)] shadow-[0_1px_1px_rgba(20,20,19,0.06)]"
                : "text-[var(--mf-mute)] hover:text-[var(--mf-body)]"
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
   overflow-x-auto 안에 있어 minWidth를 넘으면 마지막 열이 조용히 잘린다.
   design.md "표 밀도 · 컬럼 예산"에 근거를 남긴다. */

export function Table({
  head,
  children,
  align = [],
  minWidth = 620,
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
          <tr className="border-b border-[var(--mf-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--mf-mute)] first:pl-0 last:pr-0 ${
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
      className={`border-b border-[var(--mf-hairline)] last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-[var(--mf-soft)]" : "hover:bg-[var(--mf-soft)]"
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
      } ${strong ? "font-medium text-[var(--mf-ink)]" : muted ? "text-[var(--mf-mute)]" : "text-[var(--mf-body)]"} ${
        mono ? "mf-mono" : ""
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--mf-hairline)] pt-4">
      <p className="mf-mono text-[12px] text-[var(--mf-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] transition-colors hover:bg-[var(--mf-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 mf-mono text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--mf-primary)] text-[var(--mf-on-primary)]"
                : "border border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] transition-colors hover:bg-[var(--mf-soft)] disabled:opacity-35"
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
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(20,20,19,0.32)]" />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="mf-enter relative flex h-full w-full max-w-[560px] flex-col border-l border-[var(--mf-hairline)] bg-[var(--mf-canvas)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--mf-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--mf-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--mf-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] transition-colors hover:bg-[var(--mf-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--mf-hairline)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

/* ── Modal (중앙 팝업 — 승인/반려처럼 짧은 확인 액션용) ── */

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidth = 480,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(20,20,19,0.4)]" />
      <div
        role="dialog"
        aria-label={title}
        className="mf-enter relative w-full overflow-hidden rounded-[8px] border border-[var(--mf-hairline)] bg-[var(--mf-canvas)] shadow-[var(--mf-shadow-pop)]"
        style={{ maxWidth }}
      >
        <header className="flex items-center justify-between gap-4 border-b border-[var(--mf-hairline)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--mf-ink)]">{title}</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--mf-mute)] transition-colors hover:bg-[var(--mf-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-[var(--mf-hairline)] px-5 py-4">{footer}</footer>}
      </div>
    </div>
  );
}

/* ── Avatar (모노그램) ── */

const AVATAR_PALETTE = [
  "#cc785c",
  "#3f8f80",
  "#b9790f",
  "#7a6bb0",
  "#4f8f5f",
  "#a9583e",
];

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const hash = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const bg = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white"
      style={{ width: size, height: size, background: bg, fontSize: Math.round(size * 0.38) }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function BrandTile({ name, size = 32 }: { name: string; size?: number }) {
  const hash = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const bg = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[6px] font-semibold text-white"
      style={{ width: size, height: size, background: bg, fontSize: Math.round(size * 0.4) }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/* ── 콘텐츠 썸네일 (실제 사진, picsum 고정 id) ── */

export function ContentThumb({
  photo,
  title,
  size = 44,
  rounded = 6,
}: {
  photo?: number;
  title: string;
  size?: number;
  rounded?: number;
}) {
  if (photo === undefined) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center border border-[var(--mf-hairline)] bg-[var(--mf-soft-2)] text-[var(--mf-mute)]"
        style={{ width: size, height: size, borderRadius: rounded, fontSize: Math.round(size * 0.32) }}
      >
        {title.slice(0, 1)}
      </span>
    );
  }
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--mf-hairline)] bg-[var(--mf-soft-2)]"
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      <Image
        src={`https://picsum.photos/id/${photo}/${size * 3}/${size * 3}`}
        alt={`${title} 썸네일`}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

/* ── Charts (라이브러리 없이 직접 구현) ── */

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
            <p
              className={`mf-mono whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--mf-ink)]" : "text-[var(--mf-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--mf-primary)" : "var(--mf-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--mf-mute)]">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RankBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = ["var(--mf-chart-1)", "var(--mf-chart-2)", "var(--mf-chart-3)", "var(--mf-chart-4)", "var(--mf-chart-5)"];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--mf-ink)]">{d.label}</span>
            <span className="mf-mono text-[13px] text-[var(--mf-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--mf-soft-2)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(d.value / max) * 100}%`, background: ramp[Math.min(index, ramp.length - 1)] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Meter({ value, tone = "ink" }: { value: number; tone?: "ink" | "info" | "warn" | "danger" }) {
  const color =
    tone === "info"
      ? "var(--mf-info)"
      : tone === "warn"
        ? "var(--mf-warn)"
        : tone === "danger"
          ? "var(--mf-danger)"
          : "var(--mf-primary)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--mf-soft-2)]">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, value)}%`, background: color }} />
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
          <li key={`${step.label}-${step.at}`} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute left-[7px] top-4 w-px"
                style={{ bottom: 0, background: step.done ? "var(--mf-primary)" : "var(--mf-hairline)" }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done ? "border-[var(--mf-primary)] bg-[var(--mf-primary)]" : "border-[var(--mf-hairline-strong)] bg-[var(--mf-canvas)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={`text-[14px] ${step.done ? "font-medium text-[var(--mf-ink)]" : "text-[var(--mf-mute)]"}`}>{step.label}</p>
                <p className="mf-mono text-[12px] text-[var(--mf-mute)]">{step.at}</p>
              </div>
              {step.note && <p className="mt-1 text-[13px] leading-5 text-[var(--mf-body)]">{step.note}</p>}
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
        <div key={item.label} className="flex items-start justify-between gap-4 border-b border-[var(--mf-hairline)] py-2.5 last:border-b-0">
          <dt className="shrink-0 text-[13px] text-[var(--mf-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--mf-ink)]">{item.value}</dd>
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
    <div className="border-b border-[var(--mf-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--mf-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown size={13} className={`text-[var(--mf-mute)] transition-transform ${open ? "rotate-180" : ""}`} />
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

/* ── Empty state ── */

export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[var(--mf-hairline-strong)] px-6 py-14 text-center">
      <p className="text-[14px] font-medium text-[var(--mf-ink)]">{title}</p>
      <p className="max-w-[42ch] text-[13px] leading-5 text-[var(--mf-mute)]">{desc}</p>
      {action}
    </div>
  );
}
