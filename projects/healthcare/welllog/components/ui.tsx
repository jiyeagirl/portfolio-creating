"use client";

/**
 * welllog 공용 프리미티브. 색은 전부 styles/welllog.css의 --wl-* 토큰을 참조하고
 * 여기서 새 색을 만들지 않는다. 반경은 design.md의 3단계 스케일(pill / 20px / 14px)만 쓴다.
 */

import type { Tone } from "@/projects/healthcare/welllog/lib/navigation";

/* ── Chip / Tag ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--wl-surface-soft)] text-[var(--wl-mute)]",
  sage: "bg-[var(--wl-accent-soft)] text-[var(--wl-accent-deep)]",
  amber: "bg-[var(--wl-amber-soft)] text-[var(--wl-amber)]",
  coral: "bg-[var(--wl-coral-soft)] text-[var(--wl-coral)]",
  periwinkle: "bg-[var(--wl-periwinkle-soft)] text-[var(--wl-periwinkle)]",
};

export function Chip({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {icon}
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
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const variants = {
    primary: "bg-[var(--wl-accent)] text-[var(--wl-on-accent)] hover:bg-[var(--wl-accent-deep)]",
    secondary: "bg-[var(--wl-surface-soft)] text-[var(--wl-ink)] hover:bg-[var(--wl-hairline)]",
    ghost: "bg-transparent text-[var(--wl-body)] hover:bg-[var(--wl-surface-soft)]",
    outline: "bg-[var(--wl-surface)] text-[var(--wl-ink)] border border-[var(--wl-hairline)] hover:bg-[var(--wl-surface-soft)]",
  };
  const sizes = {
    sm: "h-8 px-3.5 text-[13px]",
    md: "h-11 px-5 text-[14px]",
    lg: "h-[52px] px-6 text-[15px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
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
      className={`rounded-[20px] ${
        soft ? "bg-[var(--wl-surface-soft)]" : "bg-[var(--wl-surface)] shadow-[var(--wl-shadow)]"
      } ${padded ? "p-4" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--wl-ink)]">{title}</h2>
        {desc && <p className="mt-0.5 text-[12.5px] text-[var(--wl-mute)]">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Ring ── */

export function Ring({
  percent,
  size = 64,
  stroke = 8,
  color,
  track = "var(--wl-surface-soft)",
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

/* ── Avatar ── */

export function InitialAvatar({
  name,
  size = 36,
  tone = "sage",
}: {
  name: string;
  size?: number;
  tone?: "sage" | "ink" | "neutral";
}) {
  const bg =
    tone === "sage"
      ? "bg-[var(--wl-accent)] text-[var(--wl-on-accent)]"
      : tone === "ink"
        ? "bg-[var(--wl-ink)] text-white"
        : "bg-[var(--wl-surface-soft)] text-[var(--wl-body)]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${bg}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/* ── Progress bar (line, for challenge completion) ── */

export function ProgressBar({ value, tone = "sage" }: { value: number; tone?: Tone }) {
  const color =
    tone === "coral"
      ? "var(--wl-coral)"
      : tone === "amber"
        ? "var(--wl-amber)"
        : tone === "periwinkle"
          ? "var(--wl-periwinkle)"
          : "var(--wl-accent)";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--wl-surface-soft)]">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
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
    <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-[var(--wl-hairline)] px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wl-surface-soft)] text-[var(--wl-mute)]">
        {icon}
      </span>
      <div>
        <p className="text-[14px] font-medium text-[var(--wl-ink)]">{title}</p>
        <p className="mt-1 max-w-[30ch] text-[12.5px] leading-5 text-[var(--wl-mute)]">{desc}</p>
      </div>
      {action}
    </div>
  );
}

/* ── Checklist row (오늘의 습관 체크) ── */

export function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-left transition-colors ${
        checked ? "bg-[var(--wl-accent-soft)]" : "bg-[var(--wl-surface-soft)]"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked ? "border-[var(--wl-accent)] bg-[var(--wl-accent)]" : "border-[var(--wl-hairline)] bg-transparent"
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        className={`text-[14px] ${checked ? "font-medium text-[var(--wl-accent-deep)] line-through decoration-1" : "text-[var(--wl-ink)]"}`}
      >
        {label}
      </span>
    </button>
  );
}
