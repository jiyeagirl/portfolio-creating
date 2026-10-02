"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, CaretDown, Minus, Plus, Star } from "@phosphor-icons/react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";
import { formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { Tone } from "@/projects/commerce/snowpeak/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-[var(--sp-border)] text-[var(--sp-mute)]",
  info: "border-transparent bg-[var(--sp-info-soft)] text-[var(--sp-info)]",
  success: "border-transparent bg-[var(--sp-success-soft)] text-[var(--sp-success)]",
  warn: "border-transparent bg-[var(--sp-warn-soft)] text-[var(--sp-warn)]",
  danger: "border-transparent bg-[var(--sp-danger-soft)] text-[var(--sp-danger)]",
  ink: "border-transparent bg-[var(--sp-ink)] text-white",
};

const DOT_TONES: Tone[] = ["success", "warn", "danger"];

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-semibold leading-none ${TONE_CLASS[tone]} ${className}`}
    >
      {DOT_TONES.includes(tone) && (
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-current" aria-hidden />
      )}
      {children}
    </span>
  );
}

/* ── Card ── */

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-[16px] bg-[var(--sp-surface)] ${padded ? "p-4" : ""} ${className}`}
      style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
    >
      {children}
    </section>
  );
}

/* ── Photo ── */

/** `id`가 있으면 picsum 고정 id, `src`가 있으면 검증된 외부 스톡 사진 URL(Pexels/Unsplash 등)을
 *  그대로 쓴다. 실제 특정 리조트가 식별되는 사진은 쓰지 않는다 — design.md 사진 매핑 참고. */
export function PhotoTile({
  id,
  src,
  alt,
  className = "",
  sizes = "393px",
}: {
  id?: number;
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[var(--sp-surface-soft)] ${className}`}>
      <Image
        src={src ?? `https://picsum.photos/id/${id}/800/600`}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

/* ── Buttons ── */

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  full = true,
  type = "button",
  trailingIcon = true,
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
  trailingIcon?: boolean;
  size?: "sm" | "md";
}) {
  const sm = size === "sm";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--sp-accent)] font-semibold text-[var(--sp-on-accent)] transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[var(--sp-surface-soft)] disabled:text-[var(--sp-mute)] ${
        sm ? "py-2 pl-4 text-[13px]" : "py-3.5 pl-6 text-[15px]"
      } ${trailingIcon ? (sm ? "pr-1.5" : "pr-2") : sm ? "pr-4" : "pr-6"} ${full ? "w-full" : ""}`}
    >
      {children}
      {trailingIcon && (
        <span
          className={`flex shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform group-active:translate-x-0.5 ${
            sm ? "h-5 w-5" : "h-8 w-8"
          }`}
        >
          <ArrowRight size={sm ? 11 : 15} weight="bold" />
        </span>
      )}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-full border border-[var(--sp-border-strong)] bg-[var(--sp-surface)] px-6 py-3.5 text-[15px] font-semibold text-[var(--sp-ink)] transition-transform active:scale-[0.97]`}
    >
      {children}
    </button>
  );
}

export function DangerGhostButton({
  children,
  onClick,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-full border border-[var(--sp-danger)]/30 bg-[var(--sp-danger-soft)] px-6 py-3.5 text-[15px] font-semibold text-[var(--sp-danger)] transition-transform active:scale-[0.97]`}
    >
      {children}
    </button>
  );
}

/* ── Header / Section ── */

export function AppBar({
  title,
  onBack,
  right,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
}) {
  return (
    <SharedScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="bg-[var(--sp-surface)] border-[var(--sp-border)]"
      backButtonClassName="text-[var(--sp-ink)] hover:bg-[var(--sp-surface-soft)] active:scale-[0.97]"
      titleClassName="text-[16px] font-semibold tracking-tight"
      subtitleClassName="text-[11.5px] text-[var(--sp-mute)]"
    />
  );
}

export function SectionHead({
  title,
  note,
  action,
  onAction,
}: {
  title: string;
  note?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-5">
      <div>
        <h2 className="text-[19px] font-semibold tracking-[-0.02em]">{title}</h2>
        {note && <p className="mt-0.5 text-[12.5px] text-[var(--sp-mute)]">{note}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[12.5px] font-semibold text-[var(--sp-mute)] transition-colors hover:text-[var(--sp-ink)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ── Form ── */

export function Field({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-[var(--sp-ink)]">{label}</span>
      {children}
      {helper && !error && <span className="text-[12px] text-[var(--sp-mute)]">{helper}</span>}
      {error && <span className="text-[12px] font-semibold text-[var(--sp-danger)]">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-4 py-3 text-[14px] text-[var(--sp-ink)] outline-none transition-colors placeholder:text-[var(--sp-mute)] focus:border-[var(--sp-accent)]";

export function SelectField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-9`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDown
        size={13}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sp-mute)]"
      />
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--sp-border)] px-1 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="수량 감소"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--sp-ink)] transition-colors hover:bg-[var(--sp-surface-soft)] disabled:opacity-30"
      >
        <Minus size={13} weight="bold" />
      </button>
      <span className="sp-num w-5 text-center text-[14px] font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="수량 증가"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--sp-ink)] transition-colors hover:bg-[var(--sp-surface-soft)] disabled:opacity-30"
      >
        <Plus size={13} weight="bold" />
      </button>
    </div>
  );
}

/* ── Content ── */

export function PriceTag({
  price,
  listPrice,
  size = "md",
  suffix = "원",
}: {
  price: number;
  listPrice?: number;
  size?: "sm" | "md" | "lg";
  suffix?: string;
}) {
  const sizeClass = size === "lg" ? "text-[24px]" : size === "sm" ? "text-[14px]" : "text-[18px]";
  return (
    <span className="sp-num inline-flex items-baseline gap-1.5">
      <span className={`font-semibold text-[var(--sp-ink)] ${sizeClass}`}>
        {formatWon(price)}
        {suffix}
      </span>
      {listPrice && listPrice > price && (
        <span className="text-[12.5px] text-[var(--sp-mute)] line-through">
          {formatWon(listPrice)}
          {suffix}
        </span>
      )}
    </span>
  );
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`평점 ${rating}점`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          weight="fill"
          className={i < Math.round(rating) ? "text-[var(--sp-accent)]" : "text-[var(--sp-border)]"}
        />
      ))}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-mute)]">
        {icon}
      </span>
      <div>
        <p className="text-[15px] font-semibold">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--sp-mute)]">{body}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-full bg-[var(--sp-accent)] px-5 py-2.5 text-[13.5px] font-semibold text-white active:scale-[0.97]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function ListRow({
  icon,
  label,
  value,
  onClick,
  danger = false,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[var(--sp-border)] px-5 py-3.5 text-left last:border-b-0"
    >
      {icon && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            danger ? "bg-[var(--sp-danger-soft)] text-[var(--sp-danger)]" : "bg-[var(--sp-surface-soft)] text-[var(--sp-mute)]"
          }`}
        >
          {icon}
        </span>
      )}
      <span className={`flex-1 text-[14px] ${danger ? "font-medium text-[var(--sp-danger)]" : "text-[var(--sp-ink)]"}`}>
        {label}
      </span>
      {value && <span className="text-[13px] text-[var(--sp-mute)]">{value}</span>}
    </button>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
        active ? "bg-[var(--sp-ink)] text-white" : "border border-[var(--sp-border)] text-[var(--sp-body)]"
      }`}
    >
      {children}
    </button>
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
    <div className="flex gap-1 border-b border-[var(--sp-border)] px-5">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-semibold text-[var(--sp-ink)]" : "text-[var(--sp-mute)]"
            }`}
          >
            {item.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--sp-accent)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Bottom sheet ── */

export function BottomSheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(19,26,34,0.4)]"
      />
      <div className="sp-enter relative max-h-[85%] w-full overflow-y-auto rounded-t-[24px] bg-[var(--sp-surface)] pb-8">
        <div className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-[var(--sp-border-strong)]" />
        <div className="flex items-center justify-between px-5 pb-4 pt-3">
          <h3 className="text-[16px] font-semibold text-[var(--sp-ink)]">{title}</h3>
        </div>
        <div className="px-5">{children}</div>
        {footer && <div className="mt-5 px-5">{footer}</div>}
      </div>
    </div>
  );
}
