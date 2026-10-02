"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Star } from "@phosphor-icons/react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";
import type {
  CategoryKey,
  Expert,
  ExpertStatus,
  PassTier,
} from "@/projects/platform/lumi/lib/types";
import { CATEGORY_META, PASS_BY_TIER } from "@/projects/platform/lumi/lib/mock-data";

type Tone = "neutral" | "accent" | "live" | "success" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--lm-surface)] text-[var(--lm-muted)]",
  accent: "bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]",
  live: "bg-[var(--lm-live-soft)] text-[var(--lm-live)]",
  success: "bg-[var(--lm-success-soft)] text-[var(--lm-success)]",
  danger: "bg-[var(--lm-danger-soft)] text-[var(--lm-danger)]",
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

/* 상담사 아바타. 실존 인물 사진 대신 상담사마다 고정된 상징 이미지를 쓴다. */
export function ExpertAvatar({
  expert,
  size = 56,
}: {
  expert: Pick<Expert, "name" | "avatar">;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 overflow-hidden rounded-full bg-[var(--lm-surface)]"
      style={{ width: size, height: size }}
    >
      <Image
        src={expert.avatar}
        alt={`${expert.name} 상담사 프로필 이미지`}
        width={size}
        height={size}
        placeholder="blur"
        className="h-full w-full object-cover"
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: "inset 0 0 0 1px rgba(25, 23, 48, 0.08)" }}
        aria-hidden
      />
    </span>
  );
}

const STATUS_META: Record<ExpertStatus, { label: string; tone: Tone }> = {
  available: { label: "즉시 상담 가능", tone: "live" },
  inCall: { label: "상담 중", tone: "neutral" },
  reserveOnly: { label: "예약만 가능", tone: "neutral" },
  offline: { label: "오늘 상담 종료", tone: "neutral" },
};

export function StatusPill({
  status,
  waitMinutes = 0,
  compact = false,
}: {
  status: ExpertStatus;
  waitMinutes?: number;
  compact?: boolean;
}) {
  const meta = STATUS_META[status];
  const label =
    status === "inCall" && waitMinutes > 0 ? `상담 중 · 대기 ${waitMinutes}분` : meta.label;

  return (
    <Badge tone={meta.tone} className={compact ? "px-2 py-0.5 text-[10.5px]" : ""}>
      {status === "available" && (
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--lm-live)]" aria-hidden />
      )}
      {label}
    </Badge>
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
          className={i < Math.round(rating) ? "text-[var(--lm-live)]" : "text-[var(--lm-border)]"}
        />
      ))}
    </span>
  );
}

export function CategoryChip({ category }: { category: CategoryKey }) {
  return (
    <span className="rounded-full bg-[var(--lm-surface)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lm-muted)]">
      {CATEGORY_META[category].label}
    </span>
  );
}

export function TierChip({ tier }: { tier: PassTier }) {
  const pass = PASS_BY_TIER[tier];
  return (
    <span className="lm-num rounded-full bg-[var(--lm-accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lm-accent)]">
      {pass.name} {pass.minutes}분
    </span>
  );
}

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
      className="bg-[var(--lm-elevated)] border-[var(--lm-border)]"
      backButtonClassName="text-[var(--lm-ink)] hover:bg-[var(--lm-surface)] active:scale-[0.96]"
      titleClassName="text-[16px] font-bold tracking-tight"
      subtitleClassName="text-[11.5px] text-[var(--lm-muted)]"
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
        <h2 className="text-[17px] font-bold tracking-tight">{title}</h2>
        {note && <p className="mt-0.5 text-[12.5px] text-[var(--lm-muted)]">{note}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[12.5px] font-semibold text-[var(--lm-muted)] transition-colors hover:text-[var(--lm-ink)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  full = true,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} rounded-xl bg-[var(--lm-accent)] px-5 py-3.5 text-[15px] font-bold text-[var(--lm-accent-fg)] transition-transform active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-[var(--lm-surface)] disabled:text-[var(--lm-muted)]`}
    >
      {children}
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
      className={`${full ? "w-full" : ""} rounded-xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-5 py-3.5 text-[15px] font-bold text-[var(--lm-ink)] transition-transform active:translate-y-[1px]`}
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
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-[var(--lm-ink)]">{label}</span>
      {children}
      {helper && !error && <span className="text-[12px] text-[var(--lm-muted)]">{helper}</span>}
      {error && <span className="text-[12px] font-semibold text-[var(--lm-danger)]">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-4 py-3 text-[14px] text-[var(--lm-ink)] outline-none transition-colors focus:border-[var(--lm-accent)]";

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
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lm-surface)] text-[var(--lm-muted)]">
        {icon}
      </span>
      <div>
        <p className="text-[15px] font-bold">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--lm-muted)]">{body}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-xl bg-[var(--lm-accent)] px-5 py-2.5 text-[13.5px] font-bold text-[var(--lm-accent-fg)] active:translate-y-[1px]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl bg-[var(--lm-elevated)] p-4">
      <span className="h-14 w-14 shrink-0 rounded-full bg-[var(--lm-surface)]" />
      <span className="flex-1 space-y-2">
        <span className="block h-3.5 w-1/3 rounded bg-[var(--lm-surface)]" />
        <span className="block h-3 w-4/5 rounded bg-[var(--lm-surface)]" />
        <span className="block h-3 w-1/2 rounded bg-[var(--lm-surface)]" />
      </span>
    </div>
  );
}
