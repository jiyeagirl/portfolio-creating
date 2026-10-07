"use client";

/**
 * LogiSync 프리미티브. 값은 전부 styles/logisync.css의 --ls-* 토큰을 참조한다.
 * 반경 문법: 16px(패널) / 10px(사진, 입력, 버튼) / 6px(코드 칩, 태그) / full(배지, 점).
 * 테두리 대신 면의 명도 차로 구분한다. 박스 외곽선은 쓰지 않는다.
 * 눌림 피드백: 스케일 없이 hover/active 배경만 한 단계 바꾼다.
 */

import Image from "next/image";
import { useId, useState } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { ICONS, type IconName } from "@/projects/b2b/logisync/lib/icons";
import { CENTER_BY_ID } from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";
import { photoUrl } from "@/projects/b2b/logisync/lib/photos";
import type { CenterId, Tone } from "@/projects/b2b/logisync/lib/types";

/* ── Icon ── */

export function I({
  icon,
  size = 16,
  className = "",
  weight = "regular",
}: {
  icon: IconName;
  size?: number;
  className?: string;
  weight?: "regular" | "fill";
}) {
  const Glyph = ICONS[icon];
  return <Glyph size={size} weight={weight} className={`shrink-0 ${className}`} aria-hidden />;
}

/* ── Status ── */

const TONE_VAR: Record<Tone, { base: string; fg: string; bg: string }> = {
  ok: { base: "var(--ls-ok)", fg: "var(--ls-ok-fg)", bg: "var(--ls-ok-bg)" },
  info: { base: "var(--ls-info)", fg: "var(--ls-info-fg)", bg: "var(--ls-info-bg)" },
  warn: { base: "var(--ls-warn)", fg: "var(--ls-warn-fg)", bg: "var(--ls-warn-bg)" },
  danger: { base: "var(--ls-danger)", fg: "var(--ls-danger-fg)", bg: "var(--ls-danger-bg)" },
  neutral: { base: "var(--ls-neutral)", fg: "var(--ls-neutral-fg)", bg: "var(--ls-neutral-bg)" },
};

export function toneColor(tone: Tone, kind: "base" | "fg" | "bg" = "fg") {
  return TONE_VAR[tone][kind];
}

export function Dot({ tone, live = false, size = 7 }: { tone: Tone; live?: boolean; size?: number }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${live ? "ls-live" : ""}`}
      style={{ width: size, height: size, background: TONE_VAR[tone].base, color: TONE_VAR[tone].base }}
    />
  );
}

export function Badge({ tone = "neutral", children, dot = true }: { tone?: Tone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-semibold leading-4"
      style={{ background: TONE_VAR[tone].bg, color: TONE_VAR[tone].fg }}
    >
      {dot && <span className="h-[6px] w-[6px] rounded-full" style={{ background: TONE_VAR[tone].base }} />}
      {children}
    </span>
  );
}

export function Code({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`ls-code inline-block whitespace-nowrap rounded-[6px] bg-[var(--ls-elevated)] px-1.5 py-px text-[var(--ls-body-strong)] ${className}`}>
      {children}
    </span>
  );
}

/* ── Buttons ── */

export function Button({
  children,
  variant = "secondary",
  size = "md",
  icon,
  onClick,
  full = false,
  disabled,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
}) {
  const variants = {
    primary: "bg-[var(--ls-primary)] text-[var(--ls-on-primary)] hover:bg-[var(--ls-primary-active)] active:bg-[var(--ls-primary-active)]",
    secondary: "bg-[var(--ls-elevated)] text-[var(--ls-ink)] hover:bg-[var(--ls-pressed)] active:bg-[var(--ls-pressed)]",
    outline: "bg-[var(--ls-surface)] text-[var(--ls-ink)] shadow-[var(--ls-shadow)] hover:bg-[var(--ls-elevated)] active:bg-[var(--ls-pressed)]",
    ghost: "text-[var(--ls-body-strong)] hover:bg-[var(--ls-elevated)] active:bg-[var(--ls-pressed)]",
  };
  const sizes = {
    sm: "h-8 px-3 text-[12px] gap-1.5",
    md: "h-10 px-4 text-[13px] gap-2",
    lg: "h-12 px-6 text-[13px] gap-2",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`ls-swap inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] font-bold leading-4 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
    >
      {icon && <I icon={icon} size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

export function IconButton({ icon, label, onClick }: { icon: IconName; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="ls-swap flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[var(--ls-body)] hover:bg-[var(--ls-elevated)] active:bg-[var(--ls-pressed)]"
    >
      <I icon={icon} size={18} />
    </button>
  );
}

/* ── Layout ── */

export function PageHead({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-5 pb-2 lg:flex-row lg:items-end lg:justify-between">
      <h1 className="min-w-0 text-[28px] font-semibold leading-9 tracking-[-0.28px] text-[var(--ls-ink)]">{title}</h1>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
  padded = true,
  flush = false,
}: {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  /** 헤더 아래 본문을 좌우 여백 없이 붙인다 (표) */
  flush?: boolean;
}) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-2xl bg-[var(--ls-surface)] shadow-[var(--ls-shadow)] ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
          <div className="min-w-0">
            {eyebrow && <p className="ls-eyebrow mb-1 text-[var(--ls-muted)]">{eyebrow}</p>}
            {title && <h2 className="text-[16px] font-bold leading-[22px] text-[var(--ls-ink)]">{title}</h2>}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={flush ? "" : padded ? "px-6 pb-6" : ""}>{children}</div>
    </section>
  );
}

/** farrari spec-cell. 카드 없이 숫자와 캡션만. */
/* 페이지 맨 위 핵심 지표. 정합성 화면의 스코어보드와 같은 규격(카드 하나에 라벨과 30px 숫자)이다. */
export function SpecBand({ children, cols }: { children: React.ReactNode; cols: 2 | 3 | 4 }) {
  const lg = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" }[cols];
  return <div className={`grid grid-cols-2 gap-3 ${lg}`}>{children}</div>;
}

export function SpecCell({
  label,
  value,
  unit,
  sub,
  subTone,
  highlight = false,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subTone?: Tone;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-[var(--ls-surface)] p-5 shadow-[var(--ls-shadow)]">
      <p className="text-[13px] leading-5 text-[var(--ls-body)]">
        {label}
        {unit && ` (${unit})`}
      </p>
      <p className="ls-figure mt-3 whitespace-nowrap text-[30px] leading-9" style={{ color: highlight ? "var(--ls-primary)" : "var(--ls-ink)" }}>
        {value}
      </p>
      {sub && (
        <p className="ls-num mt-2 text-[12px] leading-[18px]" style={{ color: subTone ? TONE_VAR[subTone].fg : "var(--ls-body)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function KeyValue({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-[var(--ls-hairline-soft)]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-4 py-2.5">
          <dt className="shrink-0 text-[13px] leading-5 text-[var(--ls-muted)]">{k}</dt>
          <dd className="min-w-0 text-right text-[13px] leading-5 text-[var(--ls-body-strong)]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Center / photo ── */

export function Photo({
  id,
  alt,
  w,
  h,
  className = "",
  sizes,
  priority,
}: {
  id: number;
  alt: string;
  w: number;
  h: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={photoUrl(id, w, h)}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      className={`block object-cover ${className}`}
    />
  );
}

export function CenterTag({ id, withName = true }: { id: CenterId; withName?: boolean }) {
  const c = CENTER_BY_ID[id];
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span className="ls-code shrink-0 rounded-[6px] bg-[var(--ls-elevated)] px-1.5 py-px text-[11px] font-semibold text-[var(--ls-body-strong)]">
        {id}
      </span>
      {withName && <span className="truncate text-[var(--ls-body-strong)]">{c.name}</span>}
    </span>
  );
}

/* ── Inputs ── */

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`relative flex h-10 items-center ${className}`}>
      <I icon="magnifying-glass" size={16} className="pointer-events-none absolute left-3 text-[var(--ls-muted)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full rounded-[10px] bg-[var(--ls-canvas)] pl-9 pr-3 text-[13px] text-[var(--ls-ink)] outline-none placeholder:text-[var(--ls-muted)] focus:bg-[var(--ls-elevated)]"
      />
    </label>
  );
}

export function Select({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="relative flex h-10 shrink-0 items-center">
      <span className="sr-only">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full appearance-none rounded-[10px] bg-[var(--ls-canvas)] pl-3 pr-9 text-[13px] text-[var(--ls-body-strong)] outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <I icon="caret-down" size={14} className="pointer-events-none absolute right-3 text-[var(--ls-muted)]" />
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="sm"
      onClassName="bg-[var(--ls-ok)]"
      offClassName="bg-[var(--ls-pressed)]"
    />
  );
}

/* ── Tabs / Segmented ── */

export function Tabs<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string; count?: number; tone?: Tone }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="ls-noscroll flex gap-6 overflow-x-auto">
      {items.map((it) => {
        const on = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            aria-pressed={on}
            className={`ls-swap relative flex shrink-0 items-center gap-2 pb-3 pt-1 text-[14px] ${
              on ? "font-bold text-[var(--ls-ink)]" : "text-[var(--ls-muted)]"
            }`}
          >
            {it.tone && <Dot tone={it.tone} size={6} />}
            {it.label}
            {it.count !== undefined && <span className="ls-num text-[12px] font-medium text-[var(--ls-muted)]">{fmt(it.count)}</span>}
            {on && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[var(--ls-ink)]" />}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-[10px] bg-[var(--ls-elevated)] p-1">
      {items.map((it) => {
        const on = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            aria-pressed={on}
            className={`ls-swap h-8 rounded-[8px] px-3 text-[12px] font-semibold ${
              on ? "bg-[var(--ls-surface)] text-[var(--ls-ink)] shadow-[var(--ls-shadow)]" : "text-[var(--ls-body)] hover:text-[var(--ls-ink)]"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Table ── */

export function Table({
  head,
  children,
  align = [],
  minWidth = 600,
}: {
  head: string[];
  children: React.ReactNode;
  align?: ("left" | "right" | "center")[];
  /** 컬럼 폭보다 넓으면 마지막 열이 조용히 잘린다. design.md "표 밀도 / 컬럼 예산" 참고. */
  minWidth?: number;
}) {
  return (
    <div className="ls-scroll overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="bg-[var(--ls-canvas)]">
            {head.map((h, i) => (
              <th
                key={h + i}
                scope="col"
                className={`whitespace-nowrap px-6 py-2.5 text-[12px] font-semibold leading-4 text-[var(--ls-muted)] ${
                  align[i] === "right" ? "text-right" : align[i] === "center" ? "text-center" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({
  children,
  onClick,
  selected = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      aria-selected={onClick ? selected : undefined}
      className={`ls-swap border-b border-[var(--ls-hairline-soft)] ${onClick ? "cursor-pointer" : ""} ${
        selected ? "bg-[var(--ls-primary-soft)]" : onClick ? "hover:bg-[var(--ls-canvas)]" : ""
      }`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align = "left",
  className = "",
  first = false,
  selected = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  /** 선택 행의 좌측 흰 바를 그리는 첫 셀 */
  first?: boolean;
  selected?: boolean;
}) {
  return (
    <td
      className={`relative px-6 py-3 align-middle text-[13px] leading-5 text-[var(--ls-body-strong)] ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${className}`}
    >
      {first && selected && <span aria-hidden className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[var(--ls-primary)]" />}
      {children}
    </td>
  );
}

export function Pagination({ total, pageSize, label }: { total: number; pageSize: number; label: string }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const shown = [1, 2, 3, 4, 5].filter((p) => p <= pages);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <p className="ls-num text-[12px] text-[var(--ls-muted)]">
        {label} {fmt(total)}건 중 {fmt(from)}–{fmt(to)}
      </p>
      <div className="flex items-center">
        <IconButton icon="caret-left" label="이전 페이지" onClick={() => setPage((p) => Math.max(1, p - 1))} />
        {shown.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={`ls-num ls-swap h-9 w-9 rounded-[10px] text-[13px] ${
              p === page ? "bg-[var(--ls-ink)] font-bold text-[var(--ls-surface)]" : "text-[var(--ls-body)] hover:bg-[var(--ls-elevated)]"
            }`}
          >
            {p}
          </button>
        ))}
        {pages > 5 && <span className="ls-num px-2 text-[13px] text-[var(--ls-muted)]">… {fmt(pages)}</span>}
        <IconButton icon="caret-right" label="다음 페이지" onClick={() => setPage((p) => Math.min(pages, p + 1))} />
      </div>
    </div>
  );
}

/* ── Drawer ── */

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="닫기" onClick={onClose} className="ls-scrim absolute inset-0 bg-[rgba(27,28,31,0.32)]" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="ls-drawer absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-[var(--ls-surface)] sm:inset-y-3 sm:right-3 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
          <div className="min-w-0">
            {eyebrow && <p className="ls-eyebrow text-[var(--ls-muted)]">{eyebrow}</p>}
            <h2 className="mt-1 text-[20px] font-medium leading-7 text-[var(--ls-ink)]">{title}</h2>
          </div>
          <IconButton icon="x" label="닫기" onClick={onClose} />
        </div>
        <div className="ls-scroll flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="flex gap-2 bg-[var(--ls-canvas)] px-6 py-4 sm:rounded-b-2xl">{footer}</div>}
      </aside>
    </div>
  );
}

/* ── Meter ── */

export function Meter({ value, max = 100, tone = "neutral", marker }: { value: number; max?: number; tone?: Tone | "ink"; marker?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "ink" ? "var(--ls-ink)" : TONE_VAR[tone].base;
  return (
    <div className="relative h-[6px] w-full rounded-full bg-[var(--ls-elevated)]">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      {marker !== undefined && (
        <span
          aria-hidden
          className="absolute -top-[3px] h-[12px] w-[2px] rounded-full bg-[var(--ls-body-strong)]"
          style={{ left: `${Math.min(100, (marker / max) * 100)}%` }}
        />
      )}
    </div>
  );
}

/* ── Charts (라이브러리 없음) ── */

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "var(--ls-ink)",
  baseline,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  baseline?: number;
}) {
  const min = Math.min(...data, baseline ?? Infinity);
  const max = Math.max(...data, baseline ?? -Infinity);
  const span = max - min || 1;
  const x = (i: number) => (i / (data.length - 1)) * width;
  const y = (v: number) => height - 2 - ((v - min) / span) * (height - 4);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="block">
      {baseline !== undefined && (
        <line x1={0} x2={width} y1={y(baseline)} y2={y(baseline)} stroke="var(--ls-disabled)" strokeDasharray="2 3" />
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r={2.5} fill={color} />
    </svg>
  );
}

/** 시간대별 막대. 0인 구간은 빈 슬롯으로 남겨 수집 공백을 드러낸다. */
export function MiniBars({ data, labels, tone }: { data: number[]; labels?: string[]; tone?: Tone }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="flex h-12 items-end gap-[3px]">
        {data.map((v, i) => (
          <div key={i} className="relative flex h-full flex-1 items-end overflow-hidden rounded-[3px] bg-[var(--ls-canvas)]">
            <div
              className="w-full rounded-[3px]"
              style={{
                height: `${(v / max) * 100}%`,
                background: v === 0 ? "transparent" : i === data.length - 1 && tone ? TONE_VAR[tone].base : "var(--ls-chart-2)",
              }}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div className="ls-num mt-1.5 flex justify-between text-[10px] leading-3 text-[var(--ls-disabled)]">
          <span>{labels[0]}시</span>
          <span>{labels[labels.length - 1]}시</span>
        </div>
      )}
    </div>
  );
}

export function DualBars({
  labels,
  a,
  b,
  legend,
  unit,
  highlightIndex,
}: {
  labels: string[];
  a: number[];
  b: number[];
  legend: [string, string];
  unit: string;
  highlightIndex?: number;
}) {
  const max = Math.max(...a, ...b);
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  return (
    <div>
      <div className="mb-4 flex items-center gap-5 text-[12px] text-[var(--ls-body)]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--ls-chart-1)]" />
          {legend[0]}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--ls-chart-2)]" />
          {legend[1]}
        </span>
        <span className="ml-auto text-[var(--ls-muted)]">단위 {unit}</span>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex flex-col justify-between pb-6">
          {ticks.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="ls-num w-9 shrink-0 text-right text-[10px] text-[var(--ls-disabled)]">{fmt(Math.round(max * t))}</span>
              <span className="h-px flex-1 bg-[var(--ls-hairline-soft)]" />
            </div>
          ))}
        </div>
        <div className="relative ml-11 flex h-[220px] items-end gap-1.5 pb-6 sm:gap-2.5">
          {labels.map((l, i) => (
            <div key={l} className="relative flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="flex h-full items-end justify-center gap-[2px]">
                <div
                  title={`${l} ${legend[0]} ${fmt(a[i])}`}
                  className="w-1/2 max-w-[14px] rounded-t-[4px]"
                  style={{ height: `${(a[i] / max) * 100}%`, background: i === highlightIndex ? "var(--ls-primary)" : "var(--ls-chart-1)" }}
                />
                <div
                  title={`${l} ${legend[1]} ${fmt(b[i])}`}
                  className="w-1/2 max-w-[14px] rounded-t-[4px] bg-[var(--ls-chart-2)]"
                  style={{ height: `${(b[i] / max) * 100}%` }}
                />
              </div>
              <span className="ls-num absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] leading-5 text-[var(--ls-muted)]">
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LineChart({
  labels,
  series,
  height = 200,
}: {
  labels: string[];
  series: { name: string; data: number[]; color: string; dashed?: boolean }[];
  height?: number;
}) {
  const W = 640;
  const H = height;
  const pad = { l: 36, r: 24, t: 12, b: 24 };
  const all = series.flatMap((s) => s.data);
  const min = Math.floor(Math.min(...all) * 0.9);
  const max = Math.ceil(Math.max(...all) * 1.05);
  const x = (i: number) => pad.l + (i / (labels.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const ticks = [0, 0.5, 1].map((t) => min + (max - min) * t);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-5 text-[12px] text-[var(--ls-body)]">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-2">
            <svg width="18" height="4" aria-hidden>
              <line x1="0" x2="18" y1="2" y2="2" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? "3 3" : undefined} />
            </svg>
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={series.map((s) => s.name).join(", ")}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--ls-hairline-soft)" />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--ls-disabled)" className="ls-num">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          labels.length <= 8 || i % 2 === 0 || i === labels.length - 1 ? (
            <text key={l} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--ls-muted)" className="ls-num">
              {l}
            </text>
          ) : null,
        )}
        {series.map((s) => (
          <g key={s.name}>
            <path
              d={s.data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "4 4" : undefined}
            />
            <circle cx={x(s.data.length - 1)} cy={y(s.data[s.data.length - 1])} r={3.5} fill={s.color} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Heatmap({ rows, cols, data }: { rows: string[]; cols: string[]; data: number[][] }) {
  const flat = data.flat();
  const top = Math.max(...flat);
  const step = (v: number) =>
    v === top ? "var(--ls-heat-3)" : v >= 80 ? "var(--ls-heat-2)" : v >= 50 ? "var(--ls-heat-1)" : "var(--ls-heat-0)";
  return (
    <div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `28px repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span />
        {cols.map((c) => (
          <span key={c} className="ls-num pb-1 text-center text-[10px] text-[var(--ls-muted)]">
            {c}시
          </span>
        ))}
        {rows.map((r, ri) => (
          <div key={r} className="contents">
            <span className="flex items-center text-[12px] text-[var(--ls-body)]">{r}</span>
            {data[ri].map((v, ci) => (
              <span
                key={ci}
                title={`${r} ${cols[ci]}시 ${v}`}
                className="ls-num flex h-9 items-center justify-center rounded-[6px] text-[11px]"
                style={{ background: step(v), color: v >= 80 ? "#ffffff" : v >= 50 ? "var(--ls-ink)" : "var(--ls-muted)" }}
              >
                {v}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 text-[11px] text-[var(--ls-muted)]">
        <span>낮음</span>
        {["--ls-heat-0", "--ls-heat-1", "--ls-heat-2", "--ls-heat-3"].map((v) => (
          <span key={v} className="h-2.5 w-6 rounded-full" style={{ background: `var(${v})` }} />
        ))}
        <span>최고 구간</span>
      </div>
    </div>
  );
}

export function RankBars({ items }: { items: { label: string; value: number; sub?: string }[] }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ol className="space-y-4">
      {items.map((it, idx) => (
        <li key={it.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex min-w-0 items-baseline gap-3">
              <span
                className="ls-figure w-5 shrink-0 text-[18px] leading-6"
                style={{ color: idx === 0 ? "var(--ls-primary)" : "var(--ls-disabled)" }}
              >
                {idx + 1}
              </span>
              <span className="truncate text-[13px] text-[var(--ls-body-strong)]">{it.label}</span>
            </span>
            <span className="ls-num shrink-0 text-[13px] font-semibold text-[var(--ls-ink)]">
              {fmt(it.value)}
            </span>
          </div>
          <div className="ml-8 mt-2">
            <Meter value={it.value} max={max} tone={idx === 0 ? "ink" : "neutral"} />
          </div>
        </li>
      ))}
    </ol>
  );
}
