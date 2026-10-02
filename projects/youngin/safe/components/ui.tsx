"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ScenarioKey } from "@/projects/youngin/safe/lib/types";

/* 이 프로젝트의 톤 어휘. radius 문법은 칩 full / 버튼 12 / 카드 16 / 패널 20으로 고정한다. */

export const SCENARIO_TONE: Record<
  ScenarioKey,
  { ink: string; soft: string; label: string }
> = {
  cardiac: { ink: "var(--sf-cardiac)", soft: "var(--sf-cardiac-soft)", label: "심정지" },
  heat: { ink: "var(--sf-heat)", soft: "var(--sf-heat-soft)", label: "폭염" },
  cold: { ink: "var(--sf-cold)", soft: "var(--sf-cold-soft)", label: "한파" },
  quake: { ink: "var(--sf-quake)", soft: "var(--sf-quake-soft)", label: "지진" },
};

export function Chip({
  children,
  ink = "var(--sf-body)",
  soft = "var(--sf-sunken)",
  icon,
}: {
  children: ReactNode;
  ink?: string;
  soft?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-[14px]"
      style={{ color: ink, background: soft }}
    >
      {icon}
      {children}
    </span>
  );
}

export function OutlineChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--sf-hairline)] px-2.5 py-1 text-[11px] font-medium leading-[14px] text-[var(--sf-muted)]">
      {children}
    </span>
  );
}

export function SectionTitle({
  title,
  caption,
  right,
}: {
  title: string;
  caption?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-[19px] font-bold leading-[24px] tracking-[-0.01em] text-[var(--sf-ink)]">
          {title}
        </h2>
        {caption && (
          <p className="mt-1 text-[13px] font-medium leading-[18px] text-[var(--sf-muted)]">
            {caption}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

export function Card({
  children,
  className = "",
  style,
  onClick,
  selected = false,
  disabled = false,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "w-full rounded-[16px] border bg-[var(--sf-surface)] text-left transition-[transform,border-color,box-shadow] duration-200";
  const state = selected
    ? "border-[var(--sf-accent)] shadow-[0_0_0_3px_var(--sf-accent-soft)]"
    : "border-[var(--sf-hairline)] shadow-[0_1px_2px_rgba(23,21,18,0.04)]";

  if (!onClick) {
    return (
      <div className={`${base} ${state} ${className}`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={`${base} ${state} active:scale-[0.985] disabled:opacity-55 ${className}`}
    >
      {children}
    </button>
  );
}

/** 리스트 스태거 지연. Tailwind로 표현할 수 없어 CSS 변수로 넘긴다. */
export const staggerVar = (i: number) => ({ "--sf-i": i }) as CSSProperties;

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  tone = "var(--sf-accent)",
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ background: disabled ? "var(--sf-sunken)" : tone }}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[15.5px] font-bold text-white transition-transform duration-200 active:scale-[0.98] disabled:text-[var(--sf-muted-soft)]"
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  onDark = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  onDark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] border text-[15px] font-semibold transition-transform duration-200 active:scale-[0.98] ${
        onDark
          ? "border-[var(--sf-deep-line)] bg-[var(--sf-deep-raised)] text-[var(--sf-on-dark)]"
          : "border-[var(--sf-hairline)] bg-[var(--sf-surface)] text-[var(--sf-body)]"
      }`}
    >
      {children}
    </button>
  );
}

/** 하단 고정 액션 바. 기기 프레임 하단에 붙으므로 backdrop-blur 없이 불투명 서페이스만 쓴다. */
export function BottomBar({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-30 border-t px-5 pb-9 pt-3.5 ${
        dark
          ? "border-[var(--sf-deep-line)] bg-[var(--sf-deep)]"
          : "border-[var(--sf-hairline)] bg-[var(--sf-surface)]"
      }`}
    >
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  unit,
  emphasis = false,
}: {
  label: string;
  value: string;
  unit?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex-1">
      <p className="text-[11px] font-semibold leading-[14px] text-[var(--sf-muted-soft)]">
        {label}
      </p>
      <p
        className="sf-num mt-1 text-[22px] font-bold leading-[26px] tracking-[-0.02em]"
        style={{ color: emphasis ? "var(--sf-accent)" : "var(--sf-ink)" }}
      >
        {value}
        {unit && (
          <span className="ml-0.5 text-[12px] font-semibold text-[var(--sf-muted)]">{unit}</span>
        )}
      </p>
    </div>
  );
}

/** 가로 막대 게이지. 권장 시간 대비 내 기록을 겹쳐 보여 준다. */
export function MeterBar({
  ratio,
  targetRatio,
  tone = "var(--sf-accent)",
}: {
  ratio: number;
  targetRatio?: number;
  tone?: string;
}) {
  const width = Math.min(100, Math.max(2, ratio * 100));
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--sf-sunken)]">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${width}%`, background: tone }}
      />
      {targetRatio !== undefined && (
        <span
          aria-hidden
          className="absolute top-[-2px] h-[12px] w-[2px] rounded-full bg-[var(--sf-ink)] opacity-40"
          style={{ left: `${Math.min(100, targetRatio * 100)}%` }}
        />
      )}
    </div>
  );
}

export function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-[5px] w-[5px] rounded-full"
          style={{
            background: i <= level ? "var(--sf-accent)" : "var(--sf-hairline)",
          }}
        />
      ))}
    </span>
  );
}
