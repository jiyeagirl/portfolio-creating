"use client";

import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@iconify/react";

/* 포은문화제 공통 프리미티브. 색은 전부 styles/festival.css의 CSS 변수를 통해 들어온다.
   Chip/Card/ProgressBar 같은 이름은 다른 프로젝트와 겹치지만 톤 어휘와 radius 문법이
   달라 공유하지 않는다 (CLAUDE.md components/shared 절). */

export type Tone = "neutral" | "program" | "convenience" | "safety" | "gold" | "accent" | "line";

const TONE: Record<Tone, CSSProperties> = {
  neutral: { background: "var(--fs-surface-soft)", color: "var(--fs-muted)" },
  program: { background: "var(--fs-cat-program-soft)", color: "var(--fs-cat-program)" },
  convenience: { background: "var(--fs-cat-conv-soft)", color: "var(--fs-cat-conv)" },
  safety: { background: "var(--fs-cat-safety-soft)", color: "var(--fs-cat-safety)" },
  gold: { background: "var(--fs-gold-soft)", color: "var(--fs-gold)" },
  accent: { background: "var(--fs-accent)", color: "var(--fs-on-accent)" },
  line: {
    background: "transparent",
    color: "var(--fs-muted)",
    boxShadow: "inset 0 0 0 1px var(--fs-line)",
  },
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
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-[15px] tracking-[0.01em]"
      style={TONE[tone]}
    >
      {icon && <Icon icon={icon} width="13" height="13" />}
      {children}
    </span>
  );
}

/** 운영 상태. 색만으로 구분하지 않고 도트 + 라벨을 항상 함께 낸다 (design.md). */
export function StatusDot({
  status,
  label,
}: {
  status: "open" | "busy" | "closed";
  label: string;
}) {
  const color =
    status === "open"
      ? "var(--fs-cat-conv)"
      : status === "busy"
        ? "var(--fs-gold)"
        : "var(--fs-faint)";
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color }}>
      <span className="h-[7px] w-[7px] rounded-full" style={{ background: color }} />
      {label}
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
    "overflow-hidden rounded-[14px] border bg-[var(--fs-surface)] border-[var(--fs-line)]";
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

export function SectionHead({
  title,
  meta,
  action,
  onAction,
}: {
  title: string;
  meta?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-5">
      <div className="min-w-0">
        <h2 className="text-[17px] font-bold leading-[23px] text-[var(--fs-ink)]">{title}</h2>
        {meta && (
          <p className="festival-num mt-0.5 text-[12px] leading-[16px] text-[var(--fs-muted)]">
            {meta}
          </p>
        )}
      </div>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="-mr-1 flex min-h-[32px] shrink-0 items-center gap-0.5 rounded-full px-2 text-[12.5px] font-semibold text-[var(--fs-accent)] transition-transform duration-150 active:scale-[0.96]"
        >
          {action}
          <Icon icon="solar:alt-arrow-right-linear" width="15" height="15" />
        </button>
      )}
    </div>
  );
}

export function ProgressBar({ percent, tone = "accent" }: { percent: number; tone?: "accent" | "gold" }) {
  const fill = tone === "gold" ? "var(--fs-gold)" : "var(--fs-accent)";
  return (
    <div
      className="h-[8px] w-full overflow-hidden rounded-full"
      style={{ background: "var(--fs-surface-sunk)" }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${percent}%`, background: fill }}
      />
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  disabled,
  variant = "solid",
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
  variant?: "solid" | "outline";
}) {
  const style: CSSProperties =
    variant === "solid"
      ? { background: "var(--fs-accent)", color: "var(--fs-on-accent)" }
      : {
          background: "var(--fs-surface)",
          color: "var(--fs-ink)",
          boxShadow: "inset 0 0 0 1px var(--fs-line)",
        };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={disabled ? { background: "var(--fs-surface-sunk)", color: "var(--fs-faint)" } : style}
      className="flex min-h-[50px] w-full items-center justify-center gap-1.5 rounded-[12px] text-[15px] font-bold transition-transform duration-150 active:scale-[0.98] disabled:active:scale-100"
    >
      {icon && <Icon icon={icon} width="19" height="19" />}
      {children}
    </button>
  );
}

/**
 * 사진 없는 시설을 위한 글리프 타일. 화장실, AED, 분실물센터에 맞는 사진이 없어
 * 맞지 않는 사진을 붙이는 대신 분류 색 + Solar 아이콘을 쓴다 (design.md 사진 매핑).
 */
export function GlyphTile({
  icon,
  tone,
  size = 44,
  radius = 12,
}: {
  icon: string;
  tone: "program" | "convenience" | "safety" | "gold";
  size?: number;
  radius?: number;
}) {
  const fg =
    tone === "program"
      ? "var(--fs-cat-program)"
      : tone === "convenience"
        ? "var(--fs-cat-conv)"
        : tone === "safety"
          ? "var(--fs-cat-safety)"
          : "var(--fs-gold)";
  const bg =
    tone === "program"
      ? "var(--fs-cat-program-soft)"
      : tone === "convenience"
        ? "var(--fs-cat-conv-soft)"
        : tone === "safety"
          ? "var(--fs-cat-safety-soft)"
          : "var(--fs-gold-soft)";
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, borderRadius: radius, background: bg, color: fg }}
    >
      <Icon icon={icon} width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} />
    </div>
  );
}

export function MetaRow({ items }: { items: string[] }) {
  /* 이질적인 필드를 한 줄에 붙일 때는 파이프를 쓴다 (CLAUDE.md Typography). */
  return (
    <p className="festival-num truncate text-[12.5px] leading-[17px] text-[var(--fs-muted)]">
      {items.join(" | ")}
    </p>
  );
}

export function Divider() {
  return <div className="h-px w-full" style={{ background: "var(--fs-line-soft)" }} />;
}
