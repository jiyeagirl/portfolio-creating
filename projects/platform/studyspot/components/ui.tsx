"use client";

/**
 * StudySpot 공용 프리미티브. 값은 전부 styles/studyspot.css의 --ss-* 토큰을
 * 참조한다. minimalist-ui 스킬 그대로 — 카드 rounded-[12px], 버튼/인풋 rounded-[6px]
 * (필 금지), 배지만 rounded-full. 주요 CTA는 컬러 액센트가 아니라 잉크 블랙 솔리드.
 */

import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { MapPin, Star, Users } from "@phosphor-icons/react";
import type { Tone } from "@/projects/platform/studyspot/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--ss-surface)] text-[var(--ss-mute)]",
  positive: "bg-[var(--ss-positive-soft)] text-[var(--ss-positive)]",
  warning: "bg-[var(--ss-warning-soft)] text-[var(--ss-warning)]",
  negative: "bg-[var(--ss-negative-soft)] text-[var(--ss-negative)]",
  info: "bg-[var(--ss-info-soft)] text-[var(--ss-info)]",
};

const DOT_CLASS: Record<Tone, string> = {
  neutral: "text-[var(--ss-mute)]",
  positive: "text-[var(--ss-positive)]",
  warning: "text-[var(--ss-warning)]",
  negative: "text-[var(--ss-negative)]",
  info: "text-[var(--ss-info)]",
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
  live?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && (
        <span
          className={`relative inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-current ${DOT_CLASS[tone]} ${live ? "ss-live-dot" : ""}`}
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
    primary: "bg-[var(--ss-ink)] text-[var(--ss-on-ink)]",
    secondary: "bg-[var(--ss-canvas)] text-[var(--ss-ink)] border border-[var(--ss-hairline-strong)]",
    ghost: "bg-transparent text-[var(--ss-body)]",
    danger: "bg-[var(--ss-negative-soft)] text-[var(--ss-negative)]",
  };
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-12 px-5 text-[15px]",
    lg: "h-14 px-6 text-[16px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
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
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  soft?: boolean;
}) {
  return (
    <section
      className={`rounded-[12px] border border-[var(--ss-hairline)] ${soft ? "bg-[var(--ss-canvas-soft)]" : "bg-[var(--ss-canvas)]"} ${padded ? "p-5" : ""} ${className}`}
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
        <h2 className="text-[17px] font-bold leading-[22px] tracking-[-0.01em] text-[var(--ss-ink)]">
          {title}
        </h2>
        {desc && <p className="mt-0.5 text-[13px] leading-[18px] text-[var(--ss-mute)]">{desc}</p>}
      </div>
      {action}
    </header>
  );
}

/* ── Branch card ── */

export function BranchCard({
  photo,
  name,
  address,
  isOpenNow,
  freeSeatAvailable,
  freeSeatTotal,
  favorited,
  onClick,
}: {
  photo: StaticImageData;
  name: string;
  address: string;
  isOpenNow: boolean;
  freeSeatAvailable: number;
  freeSeatTotal: number;
  favorited: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="ss-enter w-full text-left">
      <div className="overflow-hidden rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)]">
        <div className="relative h-[132px] w-full">
          <Image src={photo} alt={`${name} 매장 사진`} fill sizes="400px" className="object-cover" />
          <span className="absolute left-3 top-3">
            <Badge tone={isOpenNow ? "positive" : "neutral"} dot>
              {isOpenNow ? "영업 중" : "마감"}
            </Badge>
          </span>
          {favorited && (
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ss-canvas)]">
              <Star size={14} weight="fill" className="text-[var(--ss-warning)]" />
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[15.5px] font-bold text-[var(--ss-ink)]">{name}</p>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--ss-mute)]">
            <MapPin size={12} />
            {address}
          </p>
          <p className="mt-2 text-[12.5px] font-medium text-[var(--ss-body)]">
            자유석 {freeSeatAvailable} / {freeSeatTotal}석 남음
          </p>
        </div>
      </div>
    </button>
  );
}

/* ── Study room card ── */

export function RoomCard({
  photo,
  name,
  capacity,
  hourlyPrice,
  onClick,
}: {
  photo: StaticImageData;
  name: string;
  capacity: number;
  hourlyPrice: number;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <div className="overflow-hidden rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)]">
        <div className="relative h-[100px] w-full">
          <Image src={photo} alt={`${name} 사진`} fill sizes="320px" className="object-cover" />
        </div>
        <div className="p-3">
          <p className="text-[14px] font-bold text-[var(--ss-ink)]">{name}</p>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--ss-mute)]">
            <Users size={12} />
            {capacity}인실
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-[var(--ss-ink)]">
            시간당 {hourlyPrice.toLocaleString("ko-KR")}원
          </p>
        </div>
      </div>
    </button>
  );
}

/* ── Seat chip (좌석 배치도) ── */

const SEAT_CHIP_CLASS: Record<string, string> = {
  available: "border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] text-[var(--ss-body)]",
  occupied: "border-transparent bg-[var(--ss-surface)] text-[var(--ss-mute-soft)]",
  reserved: "border-[var(--ss-info)] bg-[var(--ss-info-soft)] text-[var(--ss-info)]",
  selected: "border-[var(--ss-ink)] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]",
};

export function SeatChip({
  label,
  state,
  onClick,
  disabled,
}: {
  label: string;
  state: "available" | "occupied" | "reserved" | "selected";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`ss-mono flex h-11 w-full items-center justify-center rounded-[8px] border text-[12px] font-semibold transition-colors disabled:cursor-not-allowed ${SEAT_CHIP_CLASS[state]}`}
    >
      {label}
    </button>
  );
}

/* ── Form ── */

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[var(--ss-ink)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const INPUT_CLASS =
  "h-[52px] w-full rounded-[6px] border border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] px-4 text-[15px] text-[var(--ss-ink)] outline-none transition-colors placeholder:text-[var(--ss-mute-soft)] focus:border-[var(--ss-ink)]";

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
      onClassName="bg-[var(--ss-ink)]"
      offClassName="bg-[var(--ss-hairline-strong)]"
    />
  );
}

/* ── Empty state ── */

export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[var(--ss-hairline-strong)] px-6 py-12 text-center">
      <p className="text-[15px] font-semibold text-[var(--ss-ink)]">{title}</p>
      <p className="mt-1.5 max-w-[26ch] text-[13px] leading-5 text-[var(--ss-mute)]">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
