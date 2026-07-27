import type { ReactNode } from "react";
import { SealCheck, Star, StarHalf } from "@phosphor-icons/react";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "bg-[var(--locly-surface)] text-[var(--locly-muted)]",
  accent: "bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]",
  success: "bg-[var(--locly-success-soft)] text-[var(--locly-success)]",
  warning: "bg-[var(--locly-warning-soft)] text-[var(--locly-warning)]",
  danger: "bg-[var(--locly-danger-soft)] text-[var(--locly-danger)]",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${BADGE_TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

export function OfficialBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--locly-success-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--locly-success)]">
      <SealCheck size={12} weight="fill" />
      공식
    </span>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--locly-accent-soft)] font-semibold text-[var(--locly-accent)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  );
}

export function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5 text-[var(--locly-warning)]">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} weight="fill" />;
        if (i === full && half) return <StarHalf key={i} size={size} weight="fill" />;
        return <Star key={i} size={size} weight="regular" className="text-[var(--locly-border)]" />;
      })}
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
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[20px] font-bold tracking-tight text-[var(--locly-ink)]">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-[var(--locly-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MoreLink({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 text-[13px] font-medium text-[var(--locly-muted)] transition-colors hover:text-[var(--locly-accent)]"
    >
      더보기
    </button>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--locly-border)] px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--locly-surface)] text-[var(--locly-muted)]">
        {icon}
      </span>
      <p className="text-[15px] font-semibold text-[var(--locly-ink)]">{title}</p>
      <p className="max-w-[36ch] text-[13px] leading-relaxed text-[var(--locly-muted)]">{description}</p>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  full,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 rounded-full bg-[var(--locly-accent)] px-5 py-2.5 text-[14px] font-semibold text-[var(--locly-accent-foreground)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 rounded-full border border-[var(--locly-border)] px-5 py-2.5 text-[14px] font-semibold text-[var(--locly-ink)] transition-colors hover:border-[var(--locly-accent)] hover:text-[var(--locly-accent)] active:scale-[0.98]`}
    >
      {children}
    </button>
  );
}

export function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const now = new Date("2026-07-27T12:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
