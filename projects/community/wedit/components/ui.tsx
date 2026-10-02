"use client";

import type { ReactNode } from "react";
import { CaretRight, CheckCircle, Star } from "@phosphor-icons/react";
import type { VerificationStatus } from "@/projects/community/wedit/lib/types";

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between px-5">
      <div>
        <h2 className="text-[17px] font-semibold text-[var(--wd-ink)]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12.5px] text-[var(--wd-muted)]">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="flex shrink-0 items-center gap-0.5 text-[12.5px] font-medium text-[var(--wd-muted)] transition-colors active:text-[var(--wd-accent)]"
        >
          {actionLabel}
          <CaretRight size={12} weight="bold" />
        </button>
      )}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth,
  icon,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const sizes = {
    sm: "h-9 px-4 text-[12.5px]",
    md: "h-11 px-5 text-[14px]",
    lg: "h-[52px] px-6 text-[15px]",
  } as const;
  const variants = {
    primary: "bg-[var(--wd-accent)] text-white active:bg-[var(--wd-accent-strong)]",
    secondary: "bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)] active:bg-[#f0c8d7]",
    ghost: "bg-transparent text-[var(--wd-ink)] border border-[var(--wd-border)] active:bg-[var(--wd-surface-tint)]",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-all active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {children}
      {icon && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/10">
          {icon}
        </span>
      )}
    </button>
  );
}

export function Card({
  children,
  className = "",
  doubleBezel = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  doubleBezel?: boolean;
  onClick?: () => void;
}) {
  if (doubleBezel) {
    return (
      <div
        onClick={onClick}
        className={`rounded-[20px] bg-white/60 p-1.5 ring-1 ring-[var(--wd-border)] ${onClick ? "cursor-pointer active:scale-[0.99]" : ""} ${className}`}
      >
        <div className="rounded-[16px] bg-[var(--wd-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-[var(--wd-border)] bg-[var(--wd-surface)] ${onClick ? "cursor-pointer active:scale-[0.99]" : ""} ${className}`}
      style={{ transition: "transform 0.2s cubic-bezier(.16,1,.3,1)" }}
    >
      {children}
    </div>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
        tone === "accent"
          ? "bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)]"
          : "bg-[var(--wd-surface-tint)] text-[var(--wd-body)]"
      }`}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ compact }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[var(--wd-accent)] font-semibold text-white ${
        compact ? "px-2 py-[3px] text-[10.5px]" : "px-2.5 py-1 text-[11.5px]"
      }`}
    >
      <CheckCircle size={compact ? 11 : 13} weight="fill" />
      결제 인증
    </span>
  );
}

const STATUS_LABEL: Record<VerificationStatus, string> = {
  received: "접수",
  reviewing: "검수중",
  approved: "승인",
  rejected: "반려",
};

export function StatusPill({ status }: { status: VerificationStatus }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{
        color: `var(--wd-status-${status}-fg)`,
        backgroundColor: `var(--wd-status-${status}-bg)`,
      }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function RatingRow({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 tabular-nums">
      <Star size={size} weight="fill" className="text-[var(--wd-accent)]" />
      <span className="text-[13px] font-semibold text-[var(--wd-ink)]">{value.toFixed(1)}</span>
    </span>
  );
}

export function Avatar({ initial, size = 36 }: { initial: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--wd-accent-soft)] font-semibold text-[var(--wd-accent-strong)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  );
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--wd-surface-tint)] text-[var(--wd-accent)]">
        {icon}
      </div>
      <div>
        <p className="text-[14.5px] font-semibold text-[var(--wd-ink)]">{title}</p>
        <p className="mt-1 text-[12.5px] leading-[18px] text-[var(--wd-muted)]">{body}</p>
      </div>
    </div>
  );
}

export function PriceText({ value }: { value: number }) {
  return <span className="tabular-nums">{value.toLocaleString("ko-KR")}원</span>;
}
