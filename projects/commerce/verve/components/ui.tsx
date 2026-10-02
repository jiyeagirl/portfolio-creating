"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Star } from "@phosphor-icons/react";

type Tone = "dark" | "light";

/* ---------- Button ---------- */

type ButtonVariant = "primary" | "outline" | "text";

export function Button({
  variant = "primary",
  tone = "dark",
  className = "",
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap px-8 text-[14px] font-bold uppercase tracking-[1.4px] transition-transform duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
  const variants: Record<ButtonVariant, Record<Tone, string>> = {
    primary: {
      dark: "bg-[var(--v-primary)] text-[var(--v-on-primary)] hover:bg-[var(--v-primary-hover)] active:bg-[var(--v-primary-active)]",
      light: "bg-[var(--v-primary)] text-[var(--v-on-primary)] hover:bg-[var(--v-primary-hover)] active:bg-[var(--v-primary-active)]",
    },
    outline: {
      dark: "border border-[var(--v-ink)] text-[var(--v-ink)] hover:bg-white/5",
      light: "border border-[var(--v-body-on-light)] text-[var(--v-body-on-light)] hover:bg-black/5",
    },
    text: {
      dark: "text-[var(--v-ink)] px-0 h-auto",
      light: "text-[var(--v-body-on-light)] px-0 h-auto",
    },
  };
  return (
    <button className={`${base} ${variants[variant][tone]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Badge ---------- */

export function BadgePill({
  children,
  tone = "dark",
  accent = false,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  accent?: boolean;
  className?: string;
}) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.1px]";
  const colorClass = accent
    ? "bg-[var(--v-primary)] text-[var(--v-on-primary)]"
    : tone === "dark"
      ? "bg-[var(--v-canvas-elevated)] text-[var(--v-ink)]"
      : "bg-[var(--v-surface-strong-light)] text-[var(--v-body-on-light)]";
  return <span className={`${base} ${colorClass} ${className}`}>{children}</span>;
}

/* ---------- Price ---------- */

export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function PriceTag({
  price,
  originalPrice,
  tone = "dark",
  size = "md",
}: {
  price: number;
  originalPrice?: number;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
}) {
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  const mutedClass = tone === "dark" ? "text-[var(--v-body)]" : "text-[var(--v-muted)]";
  const sizeClass = size === "lg" ? "text-[26px]" : size === "sm" ? "text-[14px]" : "text-[18px]";
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  return (
    <div className="flex items-baseline gap-2">
      {discount > 0 && <span className="text-[var(--v-primary)] font-bold text-[14px]">{discount}%</span>}
      <span className={`v-number font-medium ${sizeClass} ${inkClass}`}>{formatPrice(price)}</span>
      {originalPrice && <span className={`text-[13px] line-through ${mutedClass}`}>{formatPrice(originalPrice)}</span>}
    </div>
  );
}

/* ---------- Rating ---------- */

export function RatingStars({ rating, tone = "dark", showValue = true }: { rating: number; tone?: Tone; showValue?: boolean }) {
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  const mutedClass = tone === "dark" ? "text-[var(--v-body)]" : "text-[var(--v-muted)]";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} weight={i < Math.round(rating) ? "fill" : "regular"} className={i < Math.round(rating) ? "text-[var(--v-primary)]" : mutedClass} />
        ))}
      </div>
      {showValue && <span className={`text-[12px] ${inkClass}`}>{rating.toFixed(1)}</span>}
    </div>
  );
}

/* ---------- Inputs ---------- */

const inputBase =
  "h-12 w-full border px-4 text-[14px] transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--v-focus)]";

export function TextInput({ tone = "dark", className = "", ...rest }: { tone?: Tone; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const toneClass =
    tone === "dark"
      ? "bg-[var(--v-canvas)] text-[var(--v-ink)] border-[var(--v-hairline)]"
      : "bg-[var(--v-canvas-light)] text-[var(--v-body-on-light)] border-[var(--v-hairline-on-light)]";
  return <input className={`${inputBase} ${toneClass} ${className}`} {...rest} />;
}

export function TextArea({ tone = "dark", className = "", ...rest }: { tone?: Tone; className?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const toneClass =
    tone === "dark"
      ? "bg-[var(--v-canvas)] text-[var(--v-ink)] border-[var(--v-hairline)]"
      : "bg-[var(--v-canvas-light)] text-[var(--v-body-on-light)] border-[var(--v-hairline-on-light)]";
  return <textarea className={`${inputBase} ${toneClass} min-h-32 py-3 ${className}`} {...rest} />;
}

export function Select({ tone = "dark", className = "", children, ...rest }: { tone?: Tone; className?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const toneClass =
    tone === "dark"
      ? "bg-[var(--v-canvas)] text-[var(--v-ink)] border-[var(--v-hairline)]"
      : "bg-[var(--v-canvas-light)] text-[var(--v-body-on-light)] border-[var(--v-hairline-on-light)]";
  return (
    <select className={`${inputBase} ${toneClass} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Field({ label, tone = "dark", children }: { label: string; tone?: Tone; children: ReactNode }) {
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  return (
    <label className="flex flex-col gap-2">
      <span className={`text-[12px] font-medium uppercase tracking-[0.65px] ${inkClass}`}>{label}</span>
      {children}
    </label>
  );
}

/* ---------- Layout helpers ---------- */

export function Divider({ tone = "dark", className = "" }: { tone?: Tone; className?: string }) {
  const colorClass = tone === "dark" ? "border-[var(--v-hairline)]" : "border-[var(--v-hairline-on-light)]";
  return <div className={`border-t ${colorClass} ${className}`} />;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "dark",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  tone?: Tone;
  align?: "left" | "center";
}) {
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  const bodyClass = tone === "dark" ? "text-[var(--v-body)]" : "text-[var(--v-muted)]";
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-primary)] mb-3">{eyebrow}</p>}
      <h2 className={`text-[26px] md:text-[36px] font-medium tracking-[-0.36px] ${inkClass}`}>{title}</h2>
      {body && <p className={`mt-3 max-w-[56ch] text-[14px] leading-relaxed ${bodyClass} ${align === "center" ? "mx-auto" : ""}`}>{body}</p>}
    </div>
  );
}

/* ---------- Spec cell (숫자 강조 표시, AI 사이즈 추천 등) ---------- */

export function SpecCell({ value, label, accent = false, tone = "dark" }: { value: string; label: string; accent?: boolean; tone?: Tone }) {
  const inkClass = accent ? "text-[var(--v-primary)]" : tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  const labelClass = tone === "dark" ? "text-[var(--v-body)]" : "text-[var(--v-muted)]";
  return (
    <div>
      <div className={`v-number text-[40px] md:text-[56px] font-bold leading-none ${inkClass}`}>{value}</div>
      <div className={`mt-2 text-[11px] font-semibold uppercase tracking-[1.1px] ${labelClass}`}>{label}</div>
    </div>
  );
}

/* ---------- Quantity stepper ---------- */

export function QuantityStepper({ value, onChange, tone = "dark" }: { value: number; onChange: (next: number) => void; tone?: Tone }) {
  const borderClass = tone === "dark" ? "border-[var(--v-hairline)]" : "border-[var(--v-hairline-on-light)]";
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  return (
    <div className={`inline-flex h-10 items-center border ${borderClass}`}>
      <button
        type="button"
        aria-label="수량 감소"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`flex h-full w-9 items-center justify-center text-[16px] ${inkClass} hover:bg-white/5`}
      >
        -
      </button>
      <span className={`v-number flex h-full w-10 items-center justify-center text-[14px] ${inkClass}`}>{value}</span>
      <button
        type="button"
        aria-label="수량 증가"
        onClick={() => onChange(value + 1)}
        className={`flex h-full w-9 items-center justify-center text-[16px] ${inkClass} hover:bg-white/5`}
      >
        +
      </button>
    </div>
  );
}

/* ---------- Checkbox ---------- */

export function Checkbox({
  checked,
  onChange,
  label,
  tone = "dark",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  tone?: Tone;
}) {
  const borderClass = tone === "dark" ? "border-[var(--v-ink)]" : "border-[var(--v-body-on-light)]";
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${borderClass} ${checked ? "bg-[var(--v-primary)] border-[var(--v-primary)]" : ""}`}
      >
        {checked && <span className="h-2 w-2 bg-[var(--v-on-primary)]" />}
      </span>
      <span className={`text-[13px] ${inkClass}`}>{label}</span>
    </label>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({ title, body, tone = "dark", action }: { title: string; body?: string; tone?: Tone; action?: ReactNode }) {
  const inkClass = tone === "dark" ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  const bodyClass = tone === "dark" ? "text-[var(--v-body)]" : "text-[var(--v-muted)]";
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h3 className={`text-[20px] font-medium ${inkClass}`}>{title}</h3>
      {body && <p className={`max-w-[40ch] text-[14px] ${bodyClass}`}>{body}</p>}
      {action}
    </div>
  );
}
