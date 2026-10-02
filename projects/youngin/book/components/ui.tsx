"use client";

import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@iconify/react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";

/* 책도장 공통 프리미티브. 색은 전부 styles/book.css의 CSS 변수를 통해 들어온다.
   Badge/Card/ProgressBar 같은 이름은 다른 프로젝트와 겹치지만 톤 어휘와 radius 문법이
   달라 공유하지 않는다 (CLAUDE.md components/shared 절). */

export type Tone = "neutral" | "visit" | "read" | "gold" | "event" | "accent";

const TONE: Record<Tone, CSSProperties> = {
  neutral: { background: "var(--bk-surface-soft)", color: "var(--bk-muted)" },
  visit: { background: "var(--bk-visit-soft)", color: "var(--bk-visit)" },
  read: { background: "var(--bk-read-soft)", color: "var(--bk-read)" },
  gold: { background: "var(--bk-gold-soft)", color: "var(--bk-gold)" },
  event: { background: "var(--bk-event-soft)", color: "var(--bk-event)" },
  accent: { background: "var(--bk-accent)", color: "var(--bk-on-accent)" },
};

export function Chip({
  tone = "neutral",
  icon,
  children,
}: {
  tone?: Tone;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.01em]"
      style={TONE[tone]}
    >
      {icon && <Icon icon={icon} width="13" height="13" />}
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  onClick,
  label,
  style,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  label?: string;
  style?: CSSProperties;
}) {
  const base =
    "rounded-[14px] border bg-[var(--bk-surface)] border-[var(--bk-line)] overflow-hidden";
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        style={style}
        className={`${base} w-full text-left transition-transform duration-150 active:scale-[0.98] ${className}`}
      >
        {children}
      </button>
    );
  }
  return (
    <div className={`${base} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  caption,
  action,
  onAction,
}: {
  title: string;
  caption?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[17.5px] font-semibold tracking-[-0.01em] text-[var(--bk-ink)]">
          {title}
        </h2>
        {caption && <p className="mt-0.5 text-[13px] text-[var(--bk-muted)]">{caption}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="-mr-2 flex h-11 shrink-0 items-center gap-0.5 px-2 text-[13px] font-semibold text-[var(--bk-accent)]"
        >
          {action}
          <Icon icon="solar:alt-arrow-right-linear" width="14" height="14" />
        </button>
      )}
    </div>
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
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <SharedScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="border-[var(--bk-line)] bg-[var(--bk-canvas)]"
      backButtonClassName="text-[var(--bk-ink)] active:bg-[var(--bk-surface-soft)]"
      titleClassName="text-[16px] font-semibold text-[var(--bk-ink)]"
      subtitleClassName="text-[11.5px] text-[var(--bk-muted)]"
    />
  );
}

export function ProgressBar({
  value,
  goal,
  height = 8,
  track = "var(--bk-surface-sunk)",
  fill = "var(--bk-accent)",
  animate = true,
}: {
  value: number;
  goal: number;
  height?: number;
  track?: string;
  fill?: string;
  animate?: boolean;
}) {
  const ratio = goal === 0 ? 0 : Math.min(1, value / goal);
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height, background: track }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={goal}
    >
      <div
        className={`h-full rounded-full ${animate ? "book-fill" : ""}`}
        style={{ width: `${ratio * 100}%`, background: fill }}
      />
    </div>
  );
}

export function StatTile({
  value,
  unit,
  label,
  tone = "light",
}: {
  value: number | string;
  unit?: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className="flex-1 rounded-[10px] px-3 py-3"
      style={{ background: dark ? "var(--bk-dark-soft)" : "var(--bk-surface-soft)" }}
    >
      <p
        className="book-num text-[22px] font-bold leading-none tracking-[-0.02em]"
        style={{ color: dark ? "var(--bk-on-dark)" : "var(--bk-ink)" }}
      >
        {value}
        {unit && (
          <span className="ml-0.5 text-[12.5px] font-semibold opacity-70">{unit}</span>
        )}
      </p>
      <p
        className="mt-1.5 text-[11.5px] font-medium"
        style={{ color: dark ? "var(--bk-on-dark-muted)" : "var(--bk-muted)" }}
      >
        {label}
      </p>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  full = true,
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: string;
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[52px] items-center justify-center gap-2 rounded-[10px] px-5 text-[15.5px] font-semibold transition-transform duration-150 active:scale-[0.97] disabled:opacity-45 ${
        full ? "w-full" : ""
      }`}
      style={{ background: "var(--bk-accent)", color: "var(--bk-on-accent)" }}
    >
      {icon && <Icon icon={icon} width="20" height="20" />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  icon,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: string;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[48px] items-center justify-center gap-2 rounded-[10px] border border-[var(--bk-line)] bg-[var(--bk-surface)] px-4 text-[14.5px] font-semibold text-[var(--bk-ink)] transition-transform duration-150 active:scale-[0.97] ${
        full ? "w-full" : ""
      }`}
    >
      {icon && <Icon icon={icon} width="18" height="18" />}
      {children}
    </button>
  );
}

/** 도서 검색, 대출, 예약은 기존 용인시 도서관 시스템으로 넘긴다. */
export function OutlinkRow({
  title,
  detail,
  icon,
}: {
  title: string;
  detail: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      className="flex min-h-[60px] w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-[var(--bk-surface-soft)]"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background: "var(--bk-accent-soft)" }}
      >
        <Icon icon={icon} width="19" height="19" color="var(--bk-accent)" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-semibold text-[var(--bk-ink)]">{title}</span>
        <span className="mt-0.5 block text-[12.5px] text-[var(--bk-muted)]">{detail}</span>
      </span>
      <Icon
        icon="solar:square-top-down-linear"
        width="17"
        height="17"
        color="var(--bk-faint)"
        className="shrink-0"
      />
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  optional = false,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5">
        <span className="text-[13.5px] font-semibold text-[var(--bk-ink)]">{label}</span>
        {optional && (
          <span className="text-[11.5px] font-medium text-[var(--bk-faint)]">선택</span>
        )}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-[var(--bk-muted)]">{hint}</span>}
    </label>
  );
}

export function BottomBar({ children }: { children: ReactNode }) {
  /* 기기 프레임 안쪽 규칙: backdrop-blur 금지, 불투명 배경 + 화면 박스 안 absolute.
     bottom-[34px]로 홈 인디케이터를 피한다. */
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 px-4 pb-[34px] pt-3"
      style={{
        background: "var(--bk-canvas)",
        boxShadow: "0 -1px 0 var(--bk-line), 0 -12px 24px -16px rgba(26,29,25,0.18)",
      }}
    >
      {children}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div
      className="flex gap-1 rounded-[10px] p-1"
      style={{ background: "var(--bk-surface-soft)" }}
      role="tablist"
    >
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.key)}
            className="h-9 flex-1 rounded-[7px] text-[13.5px] font-semibold transition-colors duration-150"
            style={{
              background: active ? "var(--bk-surface)" : "transparent",
              color: active ? "var(--bk-ink)" : "var(--bk-muted)",
              boxShadow: active ? "0 1px 2px rgba(26,29,25,0.08)" : undefined,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="book-scroll-x -mx-5 flex gap-2 overflow-x-auto px-5">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={active}
            className="h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150"
            style={{
              background: active ? "var(--bk-accent)" : "var(--bk-surface)",
              color: active ? "var(--bk-on-accent)" : "var(--bk-body)",
              borderColor: active ? "var(--bk-accent)" : "var(--bk-line)",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Divider() {
  return <div className="h-px w-full" style={{ background: "var(--bk-line-soft)" }} />;
}

export function InfoNote({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div
      className="flex gap-2.5 rounded-[10px] px-3.5 py-3"
      style={{ background: "var(--bk-accent-soft)" }}
    >
      <Icon
        icon={icon}
        width="18"
        height="18"
        color="var(--bk-accent)"
        className="mt-0.5 shrink-0"
      />
      <p className="text-[13px] leading-[1.55] text-[var(--bk-accent-deep)]">{children}</p>
    </div>
  );
}
