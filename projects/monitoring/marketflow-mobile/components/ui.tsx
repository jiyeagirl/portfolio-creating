"use client";

import type { ReactNode } from "react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import type {
  ApprovalStatus,
  ChannelId,
  ContentType,
  NotificationType,
} from "@/projects/monitoring/marketflow-mobile/lib/types";
import {
  APPROVAL_STATUS_LABEL,
  CHANNEL_LABEL,
  CONTENT_TYPE_LABEL,
} from "@/projects/monitoring/marketflow-mobile/lib/types";

/* MarketFlow Mobile 공통 프리미티브. claude_compact 팔레트를 CSS 변수(--mfm-*)로 받는다.
   radius 위계: md(8px)=버튼/인풋/탭, lg(12px)=콘텐츠 카드, pill=배지. */

export function Card({
  children,
  className = "",
  as = "div",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "button";
  onClick?: () => void;
}) {
  const base = `rounded-[12px] border border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] ${className}`;
  if (as === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} text-left transition-transform active:scale-[0.98]`}
      >
        {children}
      </button>
    );
  }
  return <div className={base}>{children}</div>;
}

const STATUS_TONE: Record<ApprovalStatus, string> = {
  pending: "bg-[var(--mfm-warning-soft)] text-[#8a6a10]",
  "changes-requested": "bg-[#f7e6cf] text-[#9a5a17]",
  rejected: "bg-[var(--mfm-error-soft)] text-[#8f2f2f]",
  approved: "bg-[var(--mfm-success-soft)] text-[#33633f]",
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] ${STATUS_TONE[status]}`}
    >
      {APPROVAL_STATUS_LABEL[status]}
    </span>
  );
}

export function ContentTypeBadge({ type }: { type: ContentType }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[var(--mfm-surface-card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--mfm-body-strong)]">
      {CONTENT_TYPE_LABEL[type]}
    </span>
  );
}

export function ChannelTag({ channel }: { channel: ChannelId }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-[var(--mfm-hairline)] px-2.5 py-1 text-[11px] font-medium text-[var(--mfm-muted)]">
      {CHANNEL_LABEL[channel]}
    </span>
  );
}

const NOTIF_TONE: Record<NotificationType, string> = {
  "approval-request": "bg-[var(--mfm-surface-card)] text-[var(--mfm-body-strong)]",
  "publish-complete": "bg-[var(--mfm-success-soft)] text-[#33633f]",
  "publish-error": "bg-[var(--mfm-error-soft)] text-[#8f2f2f]",
};

export function NotificationTypeDot({ type }: { type: NotificationType }) {
  const cls =
    type === "publish-error"
      ? "bg-[var(--mfm-error)]"
      : type === "publish-complete"
        ? "bg-[var(--mfm-success)]"
        : "bg-[var(--mfm-primary)]";
  return <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${cls}`} />;
}

export function NotificationTypeBadge({ type }: { type: NotificationType }) {
  const label =
    type === "approval-request" ? "승인 요청" : type === "publish-complete" ? "발행 완료" : "발행 오류";
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${NOTIF_TONE[type]}`}
    >
      {label}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "md" | "sm";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variants: Record<string, string> = {
    primary: "bg-[var(--mfm-primary)] text-[var(--mfm-on-primary)] active:bg-[var(--mfm-primary-active)]",
    secondary:
      "bg-[var(--mfm-surface)] text-[var(--mfm-ink)] border border-[var(--mfm-hairline)] active:bg-[var(--mfm-surface-soft)]",
    danger: "bg-[var(--mfm-error)] text-white active:bg-[#a83838]",
    ghost: "bg-transparent text-[var(--mfm-body)] active:bg-[var(--mfm-surface-soft)]",
  };
  const sizes: Record<string, string> = {
    md: "h-11 px-5 text-[14px]",
    sm: "h-9 px-4 text-[13px]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-[8px] font-semibold transition-colors active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[13.5px] font-semibold text-[var(--mfm-ink)]">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-[11.5px] font-medium text-[var(--mfm-muted)] transition-colors active:text-[var(--mfm-ink)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/** 뒤로가기가 있는 화면용 헤더. 크림 서페이스로 통일해 앱 전체의 상단/하단 바가 한 세트로 읽히게 한다. */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <SharedScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="bg-[var(--mfm-surface)] border-[var(--mfm-hairline)]"
      backButtonClassName="text-[var(--mfm-ink)] hover:bg-[var(--mfm-surface-soft)]"
      titleClassName="text-[15.5px] font-semibold text-[var(--mfm-ink)]"
      subtitleClassName="text-[11px] text-[var(--mfm-muted)]"
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <SharedToggle
      checked={checked}
      onChange={onChange}
      label={label}
      size="md"
      onClassName="bg-[var(--mfm-primary)]"
      offClassName="bg-[var(--mfm-hairline)]"
    />
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mfm-surface-card)] text-[var(--mfm-muted)]">
        {icon}
      </span>
      <div>
        <p className="text-[14px] font-semibold text-[var(--mfm-ink)]">{title}</p>
        <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--mfm-muted)]">{body}</p>
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  icon,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  icon: ReactNode;
}) {
  return (
    <label className="flex h-11 items-center gap-2 rounded-[8px] border border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] px-3.5">
      <span className="text-[var(--mfm-muted-soft)]">{icon}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[14px] text-[var(--mfm-ink)] outline-none placeholder:text-[var(--mfm-muted-soft)]"
      />
    </label>
  );
}

export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
        active
          ? "border-[var(--mfm-ink)] bg-[var(--mfm-ink)] text-[var(--mfm-on-dark)]"
          : "border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] text-[var(--mfm-body)]"
      }`}
    >
      {label}
    </button>
  );
}

export function Monogram({
  letter,
  size = 40,
  className = "",
}: {
  letter: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--mfm-surface-card)] font-bold text-[var(--mfm-body-strong)] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {letter}
    </span>
  );
}

export function StatTile({
  label,
  value,
  sub,
  tone = "light",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={`flex flex-col gap-1 rounded-[12px] px-3.5 py-3 ${
        isDark
          ? "bg-[var(--mfm-surface-dark-elevated)]"
          : "border border-[var(--mfm-hairline)] bg-[var(--mfm-surface)]"
      }`}
    >
      <p className={`text-[11.5px] ${isDark ? "text-[var(--mfm-on-dark-soft)]" : "text-[var(--mfm-muted)]"}`}>
        {label}
      </p>
      <p
        className={`mfm-tabular text-[20px] font-bold ${isDark ? "text-[var(--mfm-on-dark)]" : "text-[var(--mfm-ink)]"}`}
      >
        {value}
      </p>
      {sub && (
        <p className={`mfm-tabular text-[10.5px] ${isDark ? "text-[var(--mfm-on-dark-soft)]" : "text-[var(--mfm-muted-soft)]"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
