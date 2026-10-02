import type { ReactNode } from "react";
import { SealCheck, Star, StarHalf } from "@phosphor-icons/react";

/* ── Brand mark ────────────────────────────────────────────────────────────
   A 4-spoke radial glyph in the spirit of the design system's spike mark,
   redrawn as LOCLY's own (a pin-like radial rather than Anthropic's).      */
export function LoclyMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M10 1.5 11.6 7.2 17.4 8.4 12.9 11.6 14.1 17.4 10 14 5.9 17.4 7.1 11.6 2.6 8.4 8.4 7.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Typography helpers ──────────────────────────────────────────────────── */
export function Display({
  as: Tag = "h2",
  size = "lg",
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3" | "p";
  size?: "xl" | "lg" | "md" | "sm";
  children: ReactNode;
  className?: string;
}) {
  const sizes = {
    xl: "text-[34px] leading-[1.15] sm:text-[42px] md:text-[50px] lg:text-[56px] lg:leading-[1.1]",
    lg: "text-[26px] leading-[34px] md:text-[30px] md:leading-[38px] lg:text-[32px] lg:leading-[40px]",
    md: "text-[26px] leading-[1.15] md:text-[32px] lg:text-[36px]",
    sm: "text-[22px] leading-[1.2] md:text-[26px] lg:text-[28px]",
  };
  // lg는 목록 화면의 페이지 제목. 나머지와 달리 locly-display(-0.03em)를 빼고 자간을 덜 좁힌다.
  // 한글 제목이 48px에 -0.03em이면 글자가 뭉쳐 보이고 본문과 크기 차가 너무 컸다.
  const face = size === "lg" ? "font-bold tracking-[-0.02em]" : "locly-display";
  return <Tag className={`${face} ${sizes[size]} ${className}`}>{children}</Tag>;
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */
export function PrimaryButton({
  children,
  onClick,
  full,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-5 text-[14px] font-medium text-[var(--lc-on-primary)] transition-colors active:bg-[var(--lc-primary-active)] disabled:cursor-not-allowed disabled:bg-[var(--lc-primary-disabled)] disabled:text-[var(--lc-muted)]`}
      style={{ backgroundColor: disabled ? undefined : "var(--lc-primary)" }}
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
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] px-5 text-[14px] font-medium text-[var(--lc-ink)] transition-colors active:bg-[var(--lc-surface-card)]`}
    >
      {children}
    </button>
  );
}

/** Cream button used on coral / dark surfaces. */
export function InverseButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[var(--lc-canvas)] px-5 text-[14px] font-medium text-[var(--lc-ink)] transition-transform active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[14px] font-medium text-[var(--lc-primary)] underline-offset-4 transition-colors active:underline"
    >
      {children}
    </button>
  );
}

/* ── Badges ──────────────────────────────────────────────────────────────── */
type BadgeTone = "neutral" | "coral" | "official" | "pending" | "closed";

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]",
    coral: "bg-[var(--lc-primary)] text-[var(--lc-on-primary)] tracking-[0.1em] uppercase",
    official: "bg-[rgba(93,184,166,0.16)] text-[#2f7d6f]",
    pending: "bg-[rgba(212,160,23,0.16)] text-[#8a6a10]",
    closed: "bg-[rgba(198,69,69,0.12)] text-[var(--lc-error)]",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-[3px] text-[12px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function OfficialBadge() {
  return (
    <Badge tone="official">
      <SealCheck size={12} weight="fill" />
      공식
    </Badge>
  );
}

/* ── Small pieces ────────────────────────────────────────────────────────── */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--lc-surface-strong)] font-medium text-[var(--lc-body-strong)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.trim().charAt(0)}
    </span>
  );
}

export function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5 text-[var(--lc-amber)]">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} weight="fill" />;
        if (i === full && half) return <StarHalf key={i} size={size} weight="fill" />;
        return <Star key={i} size={size} className="text-[var(--lc-hairline)]" />;
      })}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.15em] text-[var(--lc-muted-soft)]">
            {eyebrow}
          </p>
        )}
        <Display size="md">{title}</Display>
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="border-b border-[var(--lc-hairline)] pb-6">
      <Display as="h1" size="lg">
        {title}
      </Display>
      <p className="mt-2 max-w-[58ch] text-[15px] leading-[24px] text-[var(--lc-body)]">{lead}</p>
    </header>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-[var(--lc-hairline)] px-6 py-16 text-center">
      <span className="text-[var(--lc-muted-soft)]">{icon}</span>
      <p className="text-[16px] font-medium text-[var(--lc-ink)]">{title}</p>
      <p className="max-w-[40ch] text-[14px] leading-[1.55] text-[var(--lc-muted)]">{description}</p>
    </div>
  );
}

/* ── Utilities ───────────────────────────────────────────────────────────── */
export function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const now = new Date("2026-07-27T12:00:00");
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export const CONTAINER = "mx-auto w-full max-w-[1200px] px-6 lg:px-10";
