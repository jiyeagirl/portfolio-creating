"use client";

import type { ReactNode } from "react";
import { CaretLeft } from "@phosphor-icons/react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import type { SafetyStatus } from "@/projects/monitoring/caresignal/lib/types";

/* Apple 시스템의 radius 문법을 그대로 따른다.
   lg(18px) = 카드, md(11px) = 카드 안쪽 타일, pill = 액션, sm(8px) = 유틸리티 버튼. */

export function Card({
  children,
  className = "",
  tone = "canvas",
}: {
  children: ReactNode;
  className?: string;
  tone?: "canvas" | "parchment" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-[#272729] text-white"
      : tone === "parchment"
        ? "bg-[#f5f5f7]"
        : "bg-white border border-[#e0e0e0]";
  return <section className={`rounded-[18px] ${toneClass} ${className}`}>{children}</section>;
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
      <h2 className="text-[19px] font-semibold leading-[1.3] tracking-[-0.02em] text-[#1d1d1f]">
        {children}
      </h2>
      {action}
    </div>
  );
}

const STATUS_TEXT: Record<SafetyStatus, string> = {
  safe: "text-[#248a3d]",
  caution: "text-[#9a5b00]",
  danger: "text-[#d70015]",
};

const STATUS_WASH: Record<SafetyStatus, string> = {
  safe: "bg-[#eaf6ee]",
  caution: "bg-[#fdf2e3]",
  danger: "bg-[#fdecea]",
};

const STATUS_DOT: Record<SafetyStatus, string> = {
  safe: "bg-[#248a3d]",
  caution: "bg-[#ff9500]",
  danger: "bg-[#ff3b30]",
};

export const STATUS_LABEL: Record<SafetyStatus, string> = {
  safe: "안전",
  caution: "주의",
  danger: "위험",
};

export function StatusBadge({
  status,
  children,
  dot = true,
  className = "",
}: {
  status: SafetyStatus;
  children?: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${STATUS_WASH[status]} ${STATUS_TEXT[status]} ${className}`}
    >
      {dot && <span className={`h-[6px] w-[6px] rounded-full ${STATUS_DOT[status]}`} />}
      {children ?? STATUS_LABEL[status]}
    </span>
  );
}

export function Tag({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "dark";
  className?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-[#eef4fb] text-[#0066cc]"
      : tone === "dark"
        ? "bg-[#1d1d1f] text-white"
        : "bg-[#f5f5f7] text-[#333333]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  tone = "primary",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "primary" | "danger" | "ghost" | "dark";
  type?: "button" | "submit";
}) {
  const toneClass =
    tone === "danger"
      ? "bg-[#d70015] text-white"
      : tone === "ghost"
        ? "border border-[#0066cc] text-[#0066cc]"
        : tone === "dark"
          ? "bg-[#1d1d1f] text-white"
          : "bg-[#0066cc] text-white";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cs-press cs-focusable inline-flex min-h-[44px] items-center justify-center rounded-full px-[22px] text-[17px] font-semibold leading-none ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}

export function UtilityButton({
  children,
  onClick,
  active = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cs-press cs-focusable inline-flex items-center justify-center rounded-[8px] px-[15px] py-2 text-[14px] font-normal leading-none ${
        active ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#333333]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex rounded-full bg-[#f5f5f7] p-[3px] ${className}`}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={active}
            className={`cs-press cs-focusable flex-1 rounded-full px-3 py-[7px] text-[13px] leading-none ${
              active ? "bg-white font-semibold text-[#1d1d1f]" : "font-normal text-[#7a7a7a]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
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
    <div className={`rounded-[11px] bg-[#f5f5f7] px-3.5 py-3 ${className}`}>
      <p className="text-[12px] font-normal leading-none text-[#7a7a7a]">{label}</p>
      <p className="mt-2 flex items-baseline gap-1 text-[#1d1d1f]">
        <span className="text-[22px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
          {value}
        </span>
        {unit && <span className="text-[13px] font-normal leading-none">{unit}</span>}
      </p>
      {sub && <p className="mt-1.5 text-[11.5px] font-normal leading-none text-[#7a7a7a]">{sub}</p>}
    </div>
  );
}

export function ProgressBar({
  ratio,
  tone = "primary",
  className = "",
}: {
  ratio: number;
  tone?: "primary" | "safe" | "caution" | "danger";
  className?: string;
}) {
  const fill =
    tone === "safe"
      ? "bg-[#248a3d]"
      : tone === "caution"
        ? "bg-[#ff9500]"
        : tone === "danger"
          ? "bg-[#ff3b30]"
          : "bg-[#0066cc]";
  return (
    <div className={`h-[6px] w-full overflow-hidden rounded-full bg-[#e8e8ed] ${className}`}>
      <div
        className={`h-full rounded-full ${fill}`}
        style={{ width: `${Math.max(2, Math.min(100, ratio))}%` }}
      />
    </div>
  );
}

export function ScreenHeader({
  title,
  description,
  right,
  onBack,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  return (
    <header className="pt-[72px]">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="cs-press cs-focusable -ml-1 mb-2 flex h-9 w-9 items-center justify-center rounded-full text-[#0066cc]"
          aria-label="뒤로"
        >
          <CaretLeft size={22} weight="bold" />
        </button>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-[14px] font-normal leading-[1.45] text-[#7a7a7a]">
              {description}
            </p>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onClick,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold leading-[1.35] text-[#1d1d1f]">{title}</div>
        {subtitle && (
          <div className="mt-0.5 text-[13px] font-normal leading-[1.45] text-[#7a7a7a]">
            {subtitle}
          </div>
        )}
      </div>
      {trailing}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`cs-press cs-focusable flex w-full items-center gap-3 text-left ${className}`}
      >
        {content}
      </button>
    );
  }
  return <div className={`flex items-center gap-3 ${className}`}>{content}</div>;
}

/** 사람 이름을 원형 모노그램으로 표시한다. 목업 인물의 얼굴 사진을 지어내지 않기 위한 장치. */
export function Monogram({
  name,
  size = 40,
  tone = "neutral",
}: {
  name: string;
  size?: number;
  tone?: "neutral" | "primary";
}) {
  const initial = name.slice(0, 1);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        tone === "primary" ? "bg-[#eef4fb] text-[#0066cc]" : "bg-[#f5f5f7] text-[#333333]"
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initial}
    </span>
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
      size="lg"
      onClassName="bg-[#248a3d]"
      offClassName="bg-[#e8e8ed]"
      className="cs-focusable"
    />
  );
}
