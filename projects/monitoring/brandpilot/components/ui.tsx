"use client";

/**
 * BrandPilot 공용 프리미티브. 색은 전부 styles/brandpilot.css의 --bp-* 토큰을 참조하고
 * 여기서 새 색을 만들지 않는다. 반경은 design.md의 3단계(6 / 8 / full)만 쓴다.
 * 구조는 projects/b2b/assetflow/components/ui.tsx를 기준으로 삼되 톤 어휘와 색은 새로 설계했다.
 */

import Image from "next/image";
import { useId, useState } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  InstagramLogo,
  MagnifyingGlass,
  MusicNotes,
  Note,
  X,
  YoutubeLogo,
} from "@phosphor-icons/react";
import type { Tone } from "@/projects/monitoring/brandpilot/lib/navigation";
import type { Channel } from "@/projects/monitoring/brandpilot/lib/types";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--bp-soft-2)] text-[var(--bp-body)]",
  accent: "bg-[var(--bp-accent-soft)] text-[var(--bp-accent-deep)]",
  warn: "bg-[var(--bp-warn-soft)] text-[var(--bp-warn-deep)]",
  success: "bg-[var(--bp-success-soft)] text-[var(--bp-success-deep)]",
  danger: "bg-[var(--bp-danger-soft)] text-[var(--bp-danger-deep)]",
};

export function Badge({
  children,
  tone = "neutral",
  pulse = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {pulse && <span className="bp-pulse h-[5px] w-[5px] shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** 대문자 + 넓은 자간의 마이크로 라벨(minimalist-ui). 모노로 렌더한다. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="bp-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--bp-mute)]">
      {children}
    </p>
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
      "bg-[var(--bp-accent)] text-[var(--bp-on-accent)] border border-[var(--bp-accent)] hover:bg-[var(--bp-accent-deep)] hover:border-[var(--bp-accent-deep)]",
    secondary:
      "bg-[var(--bp-canvas)] text-[var(--bp-ink)] border border-[var(--bp-hairline)] hover:bg-[var(--bp-soft)]",
    ghost:
      "bg-transparent text-[var(--bp-body)] border border-transparent hover:bg-[var(--bp-soft-2)] hover:text-[var(--bp-ink)]",
    danger:
      "bg-[var(--bp-canvas)] text-[var(--bp-danger-deep)] border border-[var(--bp-danger-soft)] hover:bg-[var(--bp-danger-soft)]",
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
  raised = false,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  soft?: boolean;
  raised?: boolean;
}) {
  return (
    <section
      className={`rounded-[8px] border border-[var(--bp-hairline)] ${
        soft ? "bg-[var(--bp-soft)]" : "bg-[var(--bp-canvas)]"
      } ${raised ? "shadow-[var(--bp-shadow)]" : ""} ${padded ? "p-5" : ""} ${className}`}
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--bp-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--bp-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--bp-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--bp-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-[var(--bp-body)]">{desc}</p>
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
          ? "border-[var(--bp-accent)] bg-[var(--bp-accent)] text-[var(--bp-on-accent)]"
          : "border-[var(--bp-hairline)] bg-[var(--bp-canvas)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/75" : "text-[var(--bp-mute)]"}`}>{label}</p>
      <p
        className={`bp-mono mt-2 text-[26px] font-semibold leading-8 tracking-[-0.03em] ${
          emphasis ? "text-[var(--bp-on-accent)]" : "text-[var(--bp-ink)]"
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
                  ? "text-[var(--bp-body)]"
                  : up
                    ? "text-[var(--bp-success-deep)]"
                    : "text-[var(--bp-danger-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/70" : "text-[var(--bp-mute)]"}`}>
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
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--bp-ink)]">
        {label}
        {required && <span className="text-[var(--bp-danger-deep)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--bp-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--bp-hairline)] bg-[var(--bp-canvas)] px-3 text-[14px] text-[var(--bp-ink)] outline-none transition-colors placeholder:text-[var(--bp-mute)] focus:border-[var(--bp-accent)]";

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
      className="w-full resize-none rounded-[6px] border border-[var(--bp-hairline)] bg-[var(--bp-canvas)] px-3 py-2.5 text-[14px] leading-6 text-[var(--bp-ink)] outline-none transition-colors placeholder:text-[var(--bp-mute)] focus:border-[var(--bp-accent)]"
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
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--bp-mute)]"
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
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--bp-mute)]"
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
      onClassName="bg-[var(--bp-accent)]"
      offClassName="bg-[#d9d9d9]"
    />
  );
}

/* ── Tabs / Segmented / Chips ── */

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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--bp-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-medium text-[var(--bp-ink)]" : "text-[var(--bp-mute)] hover:text-[var(--bp-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="bp-mono ml-1.5 text-[12px] text-[var(--bp-mute)]">{item.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--bp-accent)]" />
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
    <div className="inline-flex rounded-[6px] border border-[var(--bp-hairline)] bg-[var(--bp-soft)] p-[3px]">
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
                ? "bg-[var(--bp-canvas)] font-medium text-[var(--bp-ink)] shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                : "text-[var(--bp-mute)] hover:text-[var(--bp-body)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterChips<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string; count?: number }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={active}
            className={`rounded-[6px] border px-2.5 py-1.5 text-[13px] transition-colors ${
              active
                ? "border-[var(--bp-accent)] bg-[var(--bp-accent-soft)] font-medium text-[var(--bp-accent-deep)]"
                : "border-[var(--bp-hairline)] bg-[var(--bp-canvas)] text-[var(--bp-body)] hover:bg-[var(--bp-soft)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="bp-mono ml-1.5 text-[12px] opacity-70">{item.count}</span>
            )}
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
          <tr className="border-b border-[var(--bp-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--bp-mute)] first:pl-0 last:pr-0 ${
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
      className={`border-b border-[var(--bp-hairline)] last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-[var(--bp-accent-soft)]" : "hover:bg-[var(--bp-soft)]"
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
      } ${strong ? "font-medium text-[var(--bp-ink)]" : muted ? "text-[var(--bp-mute)]" : "text-[var(--bp-body)]"} ${
        mono ? "bp-mono" : ""
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--bp-hairline)] pt-4">
      <p className="bp-mono text-[12px] text-[var(--bp-mute)]">
        {from}-{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--bp-hairline)] text-[var(--bp-body)] transition-colors hover:bg-[var(--bp-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`bp-mono h-8 min-w-8 rounded-[6px] px-2 text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--bp-accent)] text-[var(--bp-on-accent)]"
                : "border border-[var(--bp-hairline)] text-[var(--bp-body)] hover:bg-[var(--bp-soft)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--bp-hairline)] text-[var(--bp-body)] transition-colors hover:bg-[var(--bp-soft)] disabled:opacity-35"
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
        className="absolute inset-0 bg-[rgba(0,0,0,0.32)]"
      />
      <aside
        role="dialog"
        aria-label={title}
        className="bp-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--bp-hairline)] bg-[var(--bp-canvas)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--bp-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--bp-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--bp-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--bp-hairline)] text-[var(--bp-body)] transition-colors hover:bg-[var(--bp-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--bp-hairline)] px-6 py-4">{footer}</footer>}
      </aside>
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
    <div className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[var(--bp-hairline-strong)] px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bp-soft-2)] text-[var(--bp-mute)]">
        {icon}
      </span>
      <div>
        <p className="text-[14px] font-medium text-[var(--bp-ink)]">{title}</p>
        <p className="mt-1 max-w-[38ch] text-[13px] leading-5 text-[var(--bp-mute)]">{desc}</p>
      </div>
      {action}
    </div>
  );
}

/* ── Avatar / thumbnail ── */

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
      ? "bg-[var(--bp-accent)] text-[var(--bp-on-accent)]"
      : tone === "ink"
        ? "bg-[var(--bp-ink)] text-white"
        : "bg-[var(--bp-soft-2)] text-[var(--bp-body)]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${bg}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/**
 * 콘텐츠 썸네일. photo id는 design.md의 "사진 매핑" 표에 있는 값만 넘긴다.
 */
export function Thumb({
  photo,
  alt,
  size = 44,
  rounded = 6,
  className = "",
}: {
  photo: number;
  alt: string;
  size?: number;
  rounded?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden border border-[var(--bp-hairline)] bg-[var(--bp-soft-2)] ${className}`}
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      <Image
        src={`https://picsum.photos/id/${photo}/${size * 2}/${size * 2}`}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

/** 가로:세로 비율이 있는 콘텐츠 프리뷰. 그리드 카드와 편집기에서 쓴다. */
export function Preview({
  photo,
  alt,
  ratio = "4 / 5",
  rounded = 6,
}: {
  photo: number;
  alt: string;
  ratio?: string;
  rounded?: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden border border-[var(--bp-hairline)] bg-[var(--bp-soft-2)]"
      style={{ aspectRatio: ratio, borderRadius: rounded }}
    >
      <Image src={`https://picsum.photos/id/${photo}/800/1000`} alt={alt} fill className="object-cover" />
    </div>
  );
}

/* ── Channel ── */

const CHANNEL_ICON: Record<Channel, React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>> = {
  instagram: InstagramLogo,
  tiktok: MusicNotes,
  youtube: YoutubeLogo,
  blog: Note,
};

/** 채널은 색이 아니라 아이콘과 텍스트로만 구분한다(design.md 액센트 1개 규칙). */
export function ChannelTag({ channel, label }: { channel: Channel; label: string }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12.5px] text-[var(--bp-body)]">
      <Icon size={14} weight="bold" />
      {label}
    </span>
  );
}

export function ChannelIcon({ channel, size = 14 }: { channel: Channel; size?: number }) {
  const Icon = CHANNEL_ICON[channel];
  return <Icon size={size} weight="bold" />;
}

/* ── Charts ── */

export function BarChart({
  data,
  format,
  height = 160,
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
              className={`bp-mono whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--bp-ink)]" : "text-[var(--bp-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--bp-accent)" : "var(--bp-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--bp-mute)]">
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
  height = 160,
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
        {/* 면과 선만 SVG로 그린다. preserveAspectRatio="none"은 viewBox를 가로세로
            따로 늘리기 때문에 이 안에 <circle>을 두면 원이 타원으로 찌그러진다.
            그래서 꼭짓점은 아래에서 고정 px 크기의 HTML 원으로 따로 얹는다. */}
        <svg
          viewBox={`0 0 ${w} 100`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <path d={area} fill="var(--bp-accent-soft)" stroke="none" />
          <path
            d={path}
            fill="none"
            stroke="var(--bp-accent)"
            strokeWidth={1.6}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {points.map((p) => (
          <span
            key={p.d.label}
            className="absolute block h-[7px] w-[7px] rounded-full bg-[var(--bp-accent)] ring-2 ring-[var(--bp-canvas)]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[11px] leading-4 text-[var(--bp-mute)]">{d.label}</span>
            <span className="bp-mono text-[11px] leading-4 text-[var(--bp-ink)]">
              {formatValue ? formatValue(d.value) : d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const RAMP = [
  "var(--bp-chart-1)",
  "var(--bp-chart-2)",
  "var(--bp-chart-3)",
  "var(--bp-chart-4)",
  "var(--bp-chart-5)",
];

/* 도넛 기하. viewBox 단위 = px(1:1)로 두는 것이 핵심이다.
   - 작은 viewBox(예: 0 0 36 36)를 168px로 확대하면 세그먼트 경계가 어긋나 계단처럼 보인다.
   - 바깥 반지름(R + 선폭/2)이 viewBox를 넘으면 SVG 루트의 기본 overflow:hidden에 잘려
     상하좌우 네 지점이 평평해진다. 그래서 R + STROKE/2 < SIZE/2 를 반드시 지킨다. */
const DONUT_SIZE = 168;
const DONUT_STROKE = 22;
const DONUT_R = 72; // 72 + 11 = 83 < 84. 안티에일리어싱용 1px 여유

/** 12시 방향에서 시계방향으로, 0~1 비율 구간을 그리는 호 경로. */
function donutArc(from: number, to: number): string {
  const mid = DONUT_SIZE / 2;
  const at = (frac: number) => {
    const rad = (frac * 360 - 90) * (Math.PI / 180);
    return [mid + DONUT_R * Math.cos(rad), mid + DONUT_R * Math.sin(rad)];
  };
  const [sx, sy] = at(from);
  const [ex, ey] = at(to);
  const large = to - from > 0.5 ? 1 : 0;
  return `M ${sx.toFixed(3)} ${sy.toFixed(3)} A ${DONUT_R} ${DONUT_R} 0 ${large} 1 ${ex.toFixed(3)} ${ey.toFixed(3)}`;
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; note?: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const segments = data.reduce<{ label: string; value: number; frac: number; start: number }[]>(
    (acc, d) => {
      const frac = d.value / total;
      const start = acc.length > 0 ? acc[acc.length - 1].start + acc[acc.length - 1].frac : 0;
      return [...acc, { label: d.label, value: d.value, frac, start }];
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      {/* 정사각 고정 + xMidYMid meet + 명시적 width/height. 셋 중 하나라도 빠지면
          컨테이너가 눌릴 때 원이 타원으로 찌그러진다.
          회전은 CSS transform이 아니라 좌표 계산(-90도)으로 넣는다. SVG에 CSS 회전을
          걸면 크로미움이 레이어를 래스터화한 뒤 돌려서 경계선이 지그재그로 깨진다. */}
      <div className="relative aspect-square h-[168px] w-[168px] shrink-0">
        <svg
          viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
          width={DONUT_SIZE}
          height={DONUT_SIZE}
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          className="absolute inset-0 block h-full w-full"
        >
          <circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_R}
            fill="none"
            stroke="var(--bp-soft-2)"
            strokeWidth={DONUT_STROKE}
          />
          {segments.map((d, i) => {
            const stroke = RAMP[Math.min(i, RAMP.length - 1)];
            // 한 구간이 원 전체를 차지하면 호의 시작점과 끝점이 겹쳐 아무것도 그려지지
            // 않는다. 이때만 원으로 대체한다.
            if (d.frac >= 0.9999) {
              return (
                <circle
                  key={d.label}
                  cx={DONUT_SIZE / 2}
                  cy={DONUT_SIZE / 2}
                  r={DONUT_R}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={DONUT_STROKE}
                />
              );
            }
            return (
              <path
                key={d.label}
                d={donutArc(d.start, d.start + d.frac)}
                fill="none"
                stroke={stroke}
                strokeWidth={DONUT_STROKE}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="bp-mono text-[20px] font-semibold tracking-[-0.02em] text-[var(--bp-ink)]">
            {centerValue}
          </span>
          <span className="text-[12px] text-[var(--bp-mute)]">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2 text-[var(--bp-body)]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ background: RAMP[Math.min(i, RAMP.length - 1)] }}
              />
              <span className="truncate">{d.label}</span>
              {d.note && <span className="shrink-0 text-[12px] text-[var(--bp-mute)]">{d.note}</span>}
            </span>
            <span className="bp-mono shrink-0 font-medium text-[var(--bp-ink)]">{d.value}%</span>
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
            <span className="truncate text-[13px] font-medium text-[var(--bp-ink)]">{d.label}</span>
            <span className="bp-mono shrink-0 text-[13px] text-[var(--bp-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bp-soft-2)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: RAMP[Math.min(index, RAMP.length - 1)],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Meter({ value, tone = "accent" }: { value: number; tone?: "accent" | "warn" | "success" }) {
  const color =
    tone === "warn"
      ? "var(--bp-warn)"
      : tone === "success"
        ? "var(--bp-success-deep)"
        : "var(--bp-accent)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bp-soft-2)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ── Timeline ── */

export function Timeline({
  steps,
}: {
  steps: { label: string; at: string; done: boolean; note?: string; actor?: string }[];
}) {
  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={`${step.label}-${step.at}`} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute left-[7px] top-4 w-px"
                style={{ bottom: 0, background: step.done ? "var(--bp-accent)" : "var(--bp-hairline)" }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done
                  ? "border-[var(--bp-accent)] bg-[var(--bp-accent)]"
                  : "border-[var(--bp-hairline-strong)] bg-[var(--bp-canvas)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={`text-[14px] ${step.done ? "font-medium text-[var(--bp-ink)]" : "text-[var(--bp-mute)]"}`}
                >
                  {step.label}
                </p>
                <p className="bp-mono text-[12px] text-[var(--bp-mute)]">{step.at}</p>
              </div>
              {step.actor && <p className="mt-0.5 text-[12px] text-[var(--bp-mute)]">{step.actor}</p>}
              {step.note && (
                <p className="mt-1 text-[13px] leading-5 text-[var(--bp-body)]">{step.note}</p>
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
          className="flex items-start justify-between gap-4 border-b border-[var(--bp-hairline)] py-2.5 last:border-b-0"
        >
          <dt className="shrink-0 text-[13px] text-[var(--bp-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--bp-ink)]">{item.value}</dd>
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
    <div className="border-b border-[var(--bp-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--bp-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <span
            className="bp-mono w-3 text-center text-[15px] leading-none text-[var(--bp-mute)]"
            aria-hidden
          >
            {open ? "-" : "+"}
          </span>
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
