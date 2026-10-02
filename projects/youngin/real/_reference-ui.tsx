"use client";

/**
 * AssetFlow 공용 프리미티브. 값은 전부 styles/assetflow.css의 --af-* 토큰을 참조하고
 * 여기서 새 색을 만들지 않는다. 반경은 vercel_compact 스케일(6 / 8 / 12px)만 쓴다.
 */

import Image from "next/image";
import { useId, useState } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  Desktop,
  DeviceTablet,
  HardDrives,
  Laptop,
  MagnifyingGlass,
  WifiHigh,
  X,
} from "@phosphor-icons/react";
import type { AssetCategory } from "@/projects/b2b/assetflow/lib/types";
import { CATEGORY_LABEL, type Tone } from "@/projects/b2b/assetflow/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--af-soft-2)] text-[var(--af-body)]",
  info: "bg-[var(--af-link-soft)] text-[var(--af-link-deep)]",
  warn: "bg-[var(--af-warn-soft)] text-[var(--af-warn-deep)]",
  ink: "bg-[var(--af-primary)] text-[var(--af-on-primary)]",
  danger: "bg-[var(--af-error-soft)] text-[var(--af-error-deep)]",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && (
        <span className="af-live-dot relative inline-block h-[5px] w-[5px] rounded-full bg-current" />
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
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const variants = {
    primary:
      "bg-[var(--af-primary)] text-[var(--af-on-primary)] border border-[var(--af-primary)] hover:bg-[#333333]",
    secondary:
      "bg-[var(--af-canvas)] text-[var(--af-ink)] border border-[var(--af-hairline)] hover:bg-[var(--af-soft)]",
    ghost:
      "bg-transparent text-[var(--af-body)] border border-transparent hover:bg-[var(--af-soft-2)] hover:text-[var(--af-ink)]",
    danger:
      "bg-[var(--af-canvas)] text-[var(--af-error-deep)] border border-[var(--af-error-soft)] hover:bg-[var(--af-error-soft)]",
  };
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-[14px]",
    lg: "h-12 px-5 text-[15px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
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
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  soft?: boolean;
}) {
  return (
    <section
      className={`rounded-[8px] border border-[var(--af-hairline)] ${
        soft ? "bg-[var(--af-soft)]" : "bg-[var(--af-canvas)]"
      } ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--af-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--af-mute)]">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function PageHead({
  eyebrow,
  title,
  desc,
  actions,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--af-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="af-mono text-[12px] uppercase tracking-[0.08em] text-[var(--af-mute)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--af-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--af-body)]">{desc}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ── Stat ── */

export function Stat({
  label,
  value,
  delta,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  delta?: string;
  note?: string;
  emphasis?: boolean;
}) {
  // +/- 로 시작하는 값만 증감으로 보고 색을 준다. "4건", "조치 필요" 같은
  // 보조 라벨까지 빨갛게 칠하면 문제가 있는 것처럼 읽힌다.
  const signed = delta ? /^[+-]/.test(delta) : false;
  const up = delta?.startsWith("+");
  return (
    <div
      className={`rounded-[8px] border p-5 ${
        emphasis
          ? "border-[var(--af-primary)] bg-[var(--af-primary)] text-[var(--af-on-primary)]"
          : "border-[var(--af-hairline)] bg-[var(--af-canvas)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--af-mute)]"}`}>{label}</p>
      <p
        className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] ${
          emphasis ? "text-[var(--af-on-primary)]" : "text-[var(--af-ink)]"
        }`}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`text-[12px] font-medium ${
              emphasis
                ? "text-white/90"
                : !signed
                  ? "text-[var(--af-body)]"
                  : up
                    ? "text-[var(--af-link-deep)]"
                    : "text-[var(--af-error-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--af-mute)]"}`}>
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Form ── */

export function Field({
  label,
  hint,
  children,
  required = false,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--af-ink)]">
        {label}
        {required && <span className="text-[var(--af-error)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--af-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-10 w-full rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-canvas)] px-3 text-[14px] text-[var(--af-ink)] outline-none transition-colors placeholder:text-[var(--af-mute)] focus:border-[var(--af-hairline-strong)]";

export function Input({
  value,
  onChange,
  placeholder,
  suffix,
  type = "text",
}: {
  value: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  suffix?: string;
  type?: string;
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
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--af-mute)]">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange?: (next: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${INPUT_CLASS} appearance-none pr-9`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--af-mute)]"
      />
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full">
      <MagnifyingGlass
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--af-mute)]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLASS} pl-9`}
      />
    </div>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="sm"
      onClassName="bg-[var(--af-primary)]"
      offClassName="bg-[#d4d4d4]"
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
  items: { key: T; label: string; count?: number }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--af-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active
                ? "font-medium text-[var(--af-ink)]"
                : "text-[var(--af-mute)] hover:text-[var(--af-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 af-mono text-[12px] text-[var(--af-mute)]">{item.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--af-primary)]" />
            )}
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
  onChange: (next: T) => void;
}) {
  return (
    <div className="inline-flex rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-[3px]">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={active}
            className={`rounded-[4px] px-3 py-1 text-[13px] transition-colors ${
              active
                ? "bg-[var(--af-canvas)] font-medium text-[var(--af-ink)] shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[var(--af-mute)] hover:text-[var(--af-body)]"
            }`}
          >
            {item.label}
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
  /** 표가 들어가는 컬럼보다 넓으면 마지막 열이 잘려 보인다. 사이드바가 있는
   *  1440px 레이아웃의 좁은 컬럼이 약 600px이라 기본값을 그 아래로 잡는다. */
  minWidth = 560,
}: {
  head: string[];
  children: React.ReactNode;
  align?: ("left" | "right" | "center")[];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-[var(--af-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--af-mute)] first:pl-0 last:pr-0 ${
                  align[index] === "right"
                    ? "text-right"
                    : align[index] === "center"
                      ? "text-center"
                      : ""
                }`}
              >
                {label}
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
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--af-hairline)] last:border-b-0 ${
        onClick ? "cursor-pointer" : ""
      } ${active ? "bg-[var(--af-soft)]" : "hover:bg-[var(--af-soft)]"}`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align = "left",
  strong = false,
  mono = false,
  muted = false,
  nowrap = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  strong?: boolean;
  mono?: boolean;
  muted?: boolean;
  nowrap?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 text-[13px] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${strong ? "font-medium text-[var(--af-ink)]" : muted ? "text-[var(--af-mute)]" : "text-[var(--af-body)]"} ${
        mono ? "af-mono" : ""
      } ${nowrap ? "whitespace-nowrap" : ""}`}
    >
      {children}
    </td>
  );
}

export function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (next: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--af-hairline)] pt-4">
      <p className="af-mono text-[12px] text-[var(--af-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] text-[var(--af-body)] transition-colors hover:bg-[var(--af-soft)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-[6px] px-2 af-mono text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--af-primary)] text-[var(--af-on-primary)]"
                : "border border-[var(--af-hairline)] text-[var(--af-body)] hover:bg-[var(--af-soft)]"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] text-[var(--af-body)] transition-colors hover:bg-[var(--af-soft)] disabled:opacity-35"
        >
          <CaretRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Drawer ── */

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(0,0,0,0.32)]"
      />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="af-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--af-hairline)] bg-[var(--af-canvas)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--af-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--af-ink)]">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--af-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] text-[var(--af-body)] transition-colors hover:bg-[var(--af-soft)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <footer className="border-t border-[var(--af-hairline)] px-6 py-4">{footer}</footer>
        )}
      </aside>
    </div>
  );
}

/* ── Asset thumbnail ── */

const CATEGORY_ICON: Record<AssetCategory, React.ComponentType<{ size?: number; weight?: "bold" }>> = {
  laptop: Laptop,
  desktop: Desktop,
  server: HardDrives,
  network: WifiHigh,
  peripheral: DeviceTablet,
};

/**
 * 사진이 있으면 사진, 없으면 카테고리 글리프 타일.
 * 서버/네트워크 장비는 내용이 맞는 사진이 없어서 의도적으로 글리프를 쓴다.
 */
export function AssetThumb({
  category,
  photo,
  name,
  size = 44,
  rounded = 6,
}: {
  category: AssetCategory;
  photo?: number;
  name: string;
  size?: number;
  rounded?: number;
}) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--af-hairline)] bg-[var(--af-soft-2)]"
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      {photo !== undefined ? (
        <Image
          src={`https://picsum.photos/id/${photo}/${size * 2}/${size * 2}`}
          alt={`${name} 자산 사진`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon size={Math.round(size * 0.42)} weight="bold" />
      )}
    </span>
  );
}

export function CategoryTag({ category }: { category: AssetCategory }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
      <Icon size={14} weight="bold" />
      {CATEGORY_LABEL[category]}
    </span>
  );
}

/* ── Charts ── */

/**
 * 단일 계열 세로 막대. 계열이 하나뿐이라 범례 없이 제목이 계열을 설명하고,
 * 강조 막대만 ink, 나머지는 hairline. 이중 축은 쓰지 않는다.
 */
export function BarChart({
  data,
  format,
  height = 148,
}: {
  data: { label: string; value: number; emphasis?: boolean }[];
  format: (value: number) => string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  // 값 라벨("4,630만원")은 keep-all 이라 쪼개지지 않는다. 좁은 화면에서 컬럼이
  // 라벨보다 좁아지면 카드를 넘치므로, 표와 같이 카드 안에서만 가로 스크롤시킨다.
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex min-w-[60px] flex-1 flex-col justify-end gap-2">
            {/* 라벨은 nowrap. 컬럼보다 길면 overflow-wrap: break-word 가
                "1,840만/원" 처럼 쪼개 버린다. */}
            <p
              className={`af-mono whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--af-ink)]" : "text-[var(--af-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--af-primary)" : "var(--af-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--af-mute)]">
              {d.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 순위형 가로 막대. 카테고리 비중처럼 값으로 정렬되는 데이터라
 * 색상 대신 단일 색조의 명도 단계 + 직접 라벨을 쓴다(파이 차트 대신).
 */
export function RankBars({
  data,
}: {
  data: { label: string; value: number; caption: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = [
    "var(--af-chart-1)",
    "var(--af-chart-2)",
    "var(--af-chart-3)",
    "var(--af-chart-4)",
    "var(--af-chart-5)",
  ];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--af-ink)]">{d.label}</span>
            <span className="af-mono text-[13px] text-[var(--af-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--af-soft-2)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: ramp[Math.min(index, ramp.length - 1)],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 자동 시세 대비 낙찰가 추이. 두 값의 단위가 같아 축을 하나만 쓴다. */
export function CompareChart({
  data,
  height = 176,
}: {
  data: { month: string; auto: number; won: number }[];
  height?: number;
}) {
  const max = Math.max(...data.flatMap((d) => [d.auto, d.won]), 1);
  return (
    <div>
      <div className="flex items-stretch gap-3" style={{ height }}>
        {data.map((d) => (
          <div key={d.month} className="flex flex-1 flex-col justify-end gap-2">
            <div className="flex flex-1 items-end justify-center gap-[3px]">
              <div
                className="w-1/2 max-w-[18px] rounded-t-[4px] bg-[var(--af-chart-rest)]"
                style={{ height: `${(d.auto / max) * 100}%` }}
              />
              <div
                className="w-1/2 max-w-[18px] rounded-t-[4px] bg-[var(--af-primary)]"
                style={{ height: `${(d.won / max) * 100}%` }}
              />
            </div>
            <p className="text-center text-[11px] leading-4 text-[var(--af-mute)]">{d.month}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 border-t border-[var(--af-hairline)] pt-3">
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--af-body)]">
          <span className="h-2 w-2 rounded-[2px] bg-[var(--af-chart-rest)]" />
          자동 시세
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--af-body)]">
          <span className="h-2 w-2 rounded-[2px] bg-[var(--af-primary)]" />
          실제 낙찰가
        </span>
      </div>
    </div>
  );
}

export function Meter({
  value,
  tone = "ink",
}: {
  value: number;
  tone?: "ink" | "info" | "warn";
}) {
  const color =
    tone === "info" ? "var(--af-link)" : tone === "warn" ? "var(--af-warn)" : "var(--af-primary)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--af-soft-2)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ── Timeline ── */

export function Timeline({
  steps,
}: {
  steps: { label: string; at: string; done: boolean; note?: string }[];
}) {
  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute left-[7px] top-4 w-px"
                style={{
                  bottom: 0,
                  background: step.done ? "var(--af-primary)" : "var(--af-hairline)",
                }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done
                  ? "border-[var(--af-primary)] bg-[var(--af-primary)]"
                  : "border-[var(--af-hairline-strong)] bg-[var(--af-canvas)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={`text-[14px] ${
                    step.done
                      ? "font-medium text-[var(--af-ink)]"
                      : "text-[var(--af-mute)]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="af-mono text-[12px] text-[var(--af-mute)]">{step.at}</p>
              </div>
              {step.note && (
                <p className="mt-1 text-[13px] leading-5 text-[var(--af-body)]">{step.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Definition list ── */

export function DefList({
  items,
  columns = 2,
}: {
  items: { label: string; value: React.ReactNode }[];
  columns?: 1 | 2 | 3;
}) {
  const cols = columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-1 gap-x-6 gap-y-0 ${cols}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 border-b border-[var(--af-hairline)] py-2.5 last:border-b-0"
        >
          <dt className="shrink-0 text-[13px] text-[var(--af-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--af-ink)]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Accordion ── */

export function Accordion({
  title,
  meta,
  children,
  defaultOpen = false,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-[var(--af-hairline)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[var(--af-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown
            size={13}
            className={`text-[var(--af-mute)] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div id={id} className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
}
