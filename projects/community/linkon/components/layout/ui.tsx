"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SealCheck } from "@phosphor-icons/react";
import type { BrandLogo, LogoShape, MarkTone } from "@/projects/community/linkon/lib/types";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--lk-surface)] text-[var(--lk-muted)]",
  accent: "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]",
  success: "bg-[var(--lk-success-soft)] text-[var(--lk-success)]",
  warning: "bg-[var(--lk-warning-soft)] text-[var(--lk-warning)]",
  danger: "bg-[var(--lk-danger-soft)] text-[var(--lk-danger)]",
};

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
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ label = "인증 기업" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lk-accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lk-accent)]">
      <SealCheck size={12} weight="fill" />
      {label}
    </span>
  );
}

// 기업 로고는 도형 마크로 그린다. 각 기업은 shape 하나와 브랜드 컬러 하나를 갖고,
// 배경은 같은 색의 저채도 틴트를 쓴다.
const LOGO_PATHS: Record<LogoShape, ReactNode> = {
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" opacity="0.45" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" opacity="0.45" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C11 4 4 8.5 4 15a5 5 0 0 0 5 5c7 0 11-6.5 11-16Z" />
      <path d="M15 9c-4 2-6.5 5.5-7.5 10" stroke="var(--lk-elevated)" strokeWidth="1.8" fill="none" />
    </>
  ),
  arc: (
    <>
      <path d="M4 18a8 8 0 0 1 16 0Z" />
      <rect x="4" y="19.5" width="16" height="2.5" rx="1.25" opacity="0.45" />
    </>
  ),
  cross: (
    <>
      <rect x="9.75" y="3" width="4.5" height="18" rx="2.25" />
      <rect x="3" y="9.75" width="18" height="4.5" rx="2.25" opacity="0.45" />
    </>
  ),
  bolt: <path d="M13.5 2 5 13h5l-1.5 9L19 10h-5.5L13.5 2Z" />,
  wave: (
    <>
      <path d="M2 9c3.5-4 6.5-4 10 0s6.5 4 10 0v3c-3.5 4-6.5 4-10 0S5.5 8 2 12V9Z" />
      <path d="M2 15c3.5-4 6.5-4 10 0s6.5 4 10 0v3c-3.5 4-6.5 4-10 0S5.5 14 2 18v-3Z" opacity="0.45" />
    </>
  ),
  stack: (
    <>
      <rect x="3" y="4" width="18" height="4" rx="2" />
      <rect x="5.5" y="10" width="15" height="4" rx="2" opacity="0.45" />
      <rect x="3" y="16" width="18" height="4" rx="2" />
    </>
  ),
  notch: <path d="M4 4h11l5 5v11H4V4Zm11 1.5V9h3.5L15 5.5Z" />,
  orbit: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        opacity="0.5"
        transform="rotate(-28 12 12)"
      />
    </>
  ),
  ring: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />,
  prism: (
    <>
      <path d="M12 3 21 20H3L12 3Z" />
      <path d="M12 10.5 16.5 20h-9L12 10.5Z" fill="var(--lk-elevated)" opacity="0.75" />
    </>
  ),
  chevron: (
    <>
      <path d="M5 4.5 13.5 12 5 19.5 8 22l11-10L8 2 5 4.5Z" />
      <path d="M14 6 20 12l-6 6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </>
  ),
};

export function BrandMark({
  logo,
  size = 44,
  radius,
}: {
  logo: BrandLogo;
  size?: number;
  radius?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius ?? Math.max(8, size * 0.28),
        background: `color-mix(in srgb, ${logo.color} 16%, transparent)`,
        color: logo.color,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="currentColor">
        {LOGO_PATHS[logo.shape]}
      </svg>
    </span>
  );
}

const MARK_CLASS: Record<MarkTone, string> = {
  accent: "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]",
  ink: "bg-[var(--lk-ink)] text-[var(--lk-bg)]",
  neutral: "bg-[var(--lk-surface)] text-[var(--lk-ink)]",
};

export function InitialMark({
  mark,
  tone = "neutral",
  size = 44,
}: {
  mark: string;
  tone?: MarkTone;
  size?: number;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-bold tracking-tight ${MARK_CLASS[tone]}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden
    >
      {mark}
    </span>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[21px] font-bold tracking-tight text-[var(--lk-ink)]">{title}</h2>
        {description && (
          <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--lk-muted)]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function MoreLink({ label = "전체보기", onClick }: { label?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full px-2 py-1 text-[13px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-accent)]"
    >
      {label}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  full,
  size = "md",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  size?: "sm" | "md";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const pad = size === "sm" ? "px-4 py-2 text-[13px]" : "px-5 py-2.5 text-[14px]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} ${pad} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--lk-accent)] font-semibold text-[var(--lk-accent-fg)] transition-transform active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  full,
  size = "md",
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  size?: "sm" | "md";
  active?: boolean;
}) {
  const pad = size === "sm" ? "px-4 py-2 text-[13px]" : "px-5 py-2.5 text-[14px]";
  return (
    <button
      onClick={onClick}
      className={`${full ? "w-full" : ""} ${pad} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border font-semibold transition-colors active:translate-y-[1px] ${
        active
          ? "border-[var(--lk-accent)] bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
          : "border-[var(--lk-border)] bg-[var(--lk-elevated)] text-[var(--lk-ink)] hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
          : "border border-[var(--lk-border)] bg-[var(--lk-elevated)] text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  helper,
  error,
  children,
  required,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-[var(--lk-ink)]">
        {label}
        {required && <span className="ml-1 text-[var(--lk-danger)]">*</span>}
      </span>
      {children}
      {helper && !error && <span className="text-[12.5px] text-[var(--lk-muted)]">{helper}</span>}
      {error && <span className="text-[12.5px] font-medium text-[var(--lk-danger)]">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-3.5 py-2.5 text-[14px] text-[var(--lk-ink)] transition-colors placeholder:text-[var(--lk-muted)] hover:border-[var(--lk-accent)]";

export function StatTile({
  label,
  value,
  unit,
  delta,
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-[var(--lk-muted)]">{label}</span>
        {icon && <span className="text-[var(--lk-muted)]">{icon}</span>}
      </div>
      <p className="lk-num mt-3 text-[28px] font-bold leading-none tracking-tight text-[var(--lk-ink)]">
        {value}
        {unit && <span className="ml-1 text-[15px] font-semibold text-[var(--lk-muted)]">{unit}</span>}
      </p>
      {delta && <p className="mt-2 text-[12.5px] font-medium text-[var(--lk-success)]">{delta}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--lk-border)] bg-[var(--lk-elevated)] px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lk-surface)] text-[var(--lk-muted)]">
        {icon}
      </span>
      <p className="text-[15px] font-semibold text-[var(--lk-ink)]">{title}</p>
      <p className="max-w-[40ch] text-[13px] leading-relaxed text-[var(--lk-muted)]">{description}</p>
      {action}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Tabs<T extends string>({
  items,
  active,
  onChange,
}: {
  items: { key: T; label: string; count?: number }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="lk-scroll-x flex items-center gap-1 overflow-x-auto border-b border-[var(--lk-border)]">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`relative shrink-0 px-3.5 py-3 text-[14px] font-semibold transition-colors ${
            active === item.key
              ? "text-[var(--lk-accent)]"
              : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
          }`}
        >
          {item.label}
          {typeof item.count === "number" && (
            <span className="lk-num ml-1.5 text-[12px] font-semibold opacity-70">{item.count}</span>
          )}
          {active === item.key && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--lk-accent)]" />
          )}
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const ratio = Math.min(100, Math.round((value / max) * 100));
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[var(--lk-surface)]">
      <span
        className="block h-full rounded-full bg-[var(--lk-accent)]"
        style={{ width: `${ratio}%` }}
      />
    </span>
  );
}
