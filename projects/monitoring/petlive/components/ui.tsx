"use client";

/**
 * PetLive 공용 프리미티브. 값은 전부 styles/petlive.css의 --pl-* 토큰을 참조한다.
 * 버튼/주요 카드는 wise_compact 시그니처인 rounded-[24px]를 쓴다.
 */

import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { WifiHigh, WifiLow, WifiSlash, WifiX, BatteryFull, BatteryLow, BatteryWarning } from "@phosphor-icons/react";
import type { Tone } from "@/projects/monitoring/petlive/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--pl-canvas-strong)] text-[var(--pl-body)]",
  positive: "bg-[var(--pl-positive-soft)] text-[var(--pl-positive-deep)]",
  warning: "bg-[var(--pl-warning-soft)] text-[var(--pl-warning-deep)]",
  negative: "bg-[var(--pl-negative-soft)] text-[var(--pl-negative-deep)]",
  info: "bg-[var(--pl-info-soft)] text-[var(--pl-info-deep)]",
};

const DOT_CLASS: Record<Tone, string> = {
  neutral: "text-[var(--pl-mute)]",
  positive: "text-[var(--pl-positive)]",
  warning: "text-[var(--pl-warning-deep)]",
  negative: "text-[var(--pl-negative)]",
  info: "text-[var(--pl-info)]",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  live = false,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  /** 온라인 + 실시간 스트리밍 중임을 강조하는 맥동 점 */
  live?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && (
        <span
          className={`relative inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-current ${DOT_CLASS[tone]} ${live ? "pl-live-dot" : ""}`}
        />
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
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const variants = {
    primary: "bg-[var(--pl-accent)] text-[var(--pl-on-accent)]",
    secondary: "bg-[var(--pl-canvas-soft)] text-[var(--pl-ink)] border border-[var(--pl-hairline)]",
    ghost: "bg-transparent text-[var(--pl-body)]",
    danger: "bg-[var(--pl-negative-soft)] text-[var(--pl-negative-deep)]",
  };
  const sizes = {
    sm: "h-9 px-4 text-[13px] rounded-[18px]",
    md: "h-12 px-5 text-[15px] rounded-[24px]",
    lg: "h-14 px-6 text-[16px] rounded-[24px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
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
  floating = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  soft?: boolean;
  /** 라이브 영상 카드 등 정말 뜬 요소에만 — 그림자는 희소하게 */
  floating?: boolean;
}) {
  return (
    <section
      className={`rounded-[24px] ${soft ? "bg-[var(--pl-canvas-soft)]" : "bg-[var(--pl-canvas)] border border-[var(--pl-hairline)]"} ${
        floating ? "shadow-[var(--pl-shadow-soft)]" : ""
      } ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/* ── Section head ── */

export function SectionHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[var(--pl-ink)]">
          {title}
        </h2>
        {desc && <p className="mt-0.5 text-[13px] leading-[18px] text-[var(--pl-mute)]">{desc}</p>}
      </div>
      {action}
    </header>
  );
}

/* ── Avatar ── */

export function PetAvatar({
  src,
  alt,
  size = 44,
}: {
  src: StaticImageData;
  alt: string;
  size?: number;
}) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full border-2 border-[var(--pl-canvas)] bg-[var(--pl-canvas-soft)] shadow-[var(--pl-shadow-soft)]"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

/* ── Device thumbnail ── */

export function DeviceThumb({
  src,
  alt,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
}) {
  return (
    <span className={`relative block overflow-hidden bg-[var(--pl-canvas-strong)] ${className}`}>
      <Image src={src} alt={alt} fill sizes="400px" className="object-cover" />
    </span>
  );
}

/* ── Status / signal indicators ── */

export function StatusPill({ status, tone, label }: { status: string; tone: Tone; label?: string }) {
  return (
    <Badge tone={tone} dot live={tone === "positive"}>
      {label ?? status}
    </Badge>
  );
}

export function SignalIndicator({ pct }: { pct: number }) {
  const Icon = pct === 0 ? WifiX : pct < 25 ? WifiSlash : pct < 65 ? WifiLow : WifiHigh;
  const color =
    pct === 0 ? "text-[var(--pl-negative)]" : pct < 40 ? "text-[var(--pl-warning-deep)]" : "text-[var(--pl-mute)]";
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon size={14} weight="bold" />
      <span className="pl-mono text-[12px]">{pct}%</span>
    </span>
  );
}

export function BatteryIndicator({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-[12px] text-[var(--pl-mute)]">상시 전원</span>;
  }
  const Icon = pct < 20 ? BatteryWarning : pct < 45 ? BatteryLow : BatteryFull;
  const color = pct < 20 ? "text-[var(--pl-negative)]" : pct < 45 ? "text-[var(--pl-warning-deep)]" : "text-[var(--pl-mute)]";
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon size={15} weight="bold" />
      <span className="pl-mono text-[12px]">{pct}%</span>
    </span>
  );
}

/* ── Form ── */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[var(--pl-ink)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--pl-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-[52px] w-full rounded-[14px] border border-[var(--pl-hairline)] bg-[var(--pl-canvas)] px-4 text-[15px] text-[var(--pl-ink)] outline-none transition-colors placeholder:text-[var(--pl-mute-soft)] focus:border-[var(--pl-accent)]";

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
}: {
  value: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: ReactNode;
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
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</span>}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      onClassName="bg-[var(--pl-accent)]"
      offClassName="bg-[var(--pl-hairline-strong)]"
    />
  );
}

/* ── Empty state ── */

export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--pl-hairline-strong)] px-6 py-12 text-center">
      <p className="text-[15px] font-semibold text-[var(--pl-ink)]">{title}</p>
      <p className="mt-1.5 max-w-[26ch] text-[13px] leading-5 text-[var(--pl-mute)]">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
