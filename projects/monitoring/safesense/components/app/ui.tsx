"use client";

import type { ReactNode } from "react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import type { SafetyStatus } from "@/projects/monitoring/safesense/lib/types";

/* SafeSense 프리미티브. industrial-brutalist-ui의 Tactical Telemetry 톤(다크,
   1px 보더 구획, 액센트는 --ss-accent 하나, --ss-safe는 상태 배지 하나에만)은
   유지하되, 반경 0은 실제 프로덕트 화면보다 과하게 각져 보인다는 피드백을 받아
   완화했다 — 카드 10px, 버튼/타일 8px, 배지/태그는 pill. 매크로(구조) 텍스트는
   Pretendard 굵게, 마이크로(데이터)는 .ss-mono. design.md 참고. */

export function Card({
  children,
  className = "",
  tone = "panel",
}: {
  children: ReactNode;
  className?: string;
  tone?: "panel" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "bg-[var(--ss-accent-wash)] border-[var(--ss-accent)] border-t-2"
      : "bg-[var(--ss-panel)] border-[var(--ss-border)]";
  return <section className={`overflow-hidden rounded-[10px] border ${toneClass} ${className}`}>{children}</section>;
}

export function SectionTitle({
  children,
  action,
  className = "",
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline justify-between ${className}`}>
      <h2 className="ss-mono ss-bracket text-[12px] font-semibold text-[var(--ss-muted)]">
        {children}
      </h2>
      {action}
    </div>
  );
}

const STATUS_LABEL: Record<SafetyStatus, string> = { safe: "안전", danger: "위험" };

export function StatusBadge({
  status,
  live = false,
  className = "",
}: {
  status: SafetyStatus;
  live?: boolean;
  className?: string;
}) {
  const color = status === "safe" ? "var(--ss-safe)" : "var(--ss-accent)";
  return (
    <span
      className={`ss-mono inline-flex items-center gap-2 rounded-full border border-[var(--ss-border)] px-2.5 py-1 text-[11px] font-semibold ${className}`}
      style={{ color }}
    >
      <span
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${live ? "ss-blink" : ""}`}
        style={{ background: color }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  tone = "accent",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "accent" | "outline" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--ss-accent)] text-[#0a0a0a] border border-[var(--ss-accent)]"
      : tone === "outline"
        ? "bg-transparent text-[var(--ss-foreground)] border border-[var(--ss-border-strong)]"
        : "bg-transparent text-[var(--ss-muted)] border border-transparent";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ss-press ss-focusable inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] px-5 text-[15px] font-bold disabled:cursor-not-allowed disabled:opacity-40 ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatTile({
  label,
  value,
  unit,
  sub,
  className = "",
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[8px] border border-[var(--ss-border)] bg-[var(--ss-panel-2)] px-3.5 py-3 ${className}`}>
      <p className="ss-mono text-[10px] text-[var(--ss-muted)]">{label}</p>
      <p className="ss-display mt-1.5 flex items-baseline gap-1 text-[var(--ss-foreground)]">
        <span className="ss-mono text-[22px] tracking-normal">{value}</span>
        {unit && <span className="ss-mono text-[11px] text-[var(--ss-muted)]">{unit}</span>}
      </p>
      {sub && <p className="ss-mono mt-1 text-[10px] text-[var(--ss-muted)]">{sub}</p>}
    </div>
  );
}

export function ProgressBar({
  ratio,
  tone = "accent",
  className = "",
}: {
  ratio: number;
  tone?: "accent" | "safe" | "muted";
  className?: string;
}) {
  const fill =
    tone === "safe" ? "bg-[var(--ss-safe)]" : tone === "muted" ? "bg-[var(--ss-border-strong)]" : "bg-[var(--ss-accent)]";
  return (
    <div className={`h-[6px] w-full overflow-hidden rounded-full border border-[var(--ss-border)] bg-[var(--ss-bg)] ${className}`}>
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${Math.max(2, Math.min(100, ratio))}%` }} />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-[var(--ss-border-strong)] px-6 py-14 text-center ${className}`}
    >
      <span className="text-[var(--ss-muted)]">{icon}</span>
      <p className="ss-display text-[15px] text-[var(--ss-foreground)]">{title}</p>
      <p className="ss-mono max-w-[36ch] text-[10.5px] leading-[1.6] text-[var(--ss-muted)]">
        {description}
      </p>
    </div>
  );
}

/** 이름 이니셜 모노그램. */
export function Monogram({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[8px] border border-[var(--ss-border-strong)] bg-[var(--ss-panel-2)] font-bold text-[var(--ss-foreground)]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  );
}

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
      className="bg-[var(--ss-bg)] border-[var(--ss-border)]"
      backButtonClassName="text-[var(--ss-foreground)] hover:bg-[var(--ss-panel)]"
      titleClassName="ss-display text-[16px] text-[var(--ss-foreground)]"
      subtitleClassName="ss-mono text-[10px] text-[var(--ss-muted)]"
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
      onClassName="bg-[var(--ss-accent)]"
      offClassName="bg-[var(--ss-panel-2)]"
      className="ss-focusable border border-[var(--ss-border-strong)]"
    />
  );
}
