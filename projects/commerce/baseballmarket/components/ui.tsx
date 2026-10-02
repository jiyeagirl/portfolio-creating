"use client";

import type { ReactNode } from "react";
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import type { TeamId } from "@/projects/commerce/baseballmarket/lib/types";
import { team } from "@/projects/commerce/baseballmarket/lib/mock-data";

/* BaseballMarket 프리미티브 — design-systems/vercel_compact.md.

   파일 전체를 관통하는 규칙 (design.md Shape / Typography / Motion):
   1. 그림자는 **미세한 다층 스택 + inset hairline**이다(`.bm-card`, `.bm-press`).
      단일 두꺼운 drop-shadow는 쓰지 않는다.
   2. **폰트 웨이트 천장 600.** font-bold(700)를 쓰지 않는다.
   3. radius 사다리는 4 / 6 / 8 / 12 / 16 / pill이고 상한이 16px이다.
   4. pill 스케일은 한 화면에 하나만 — 마케팅 표면은 pill CTA, 앱/관리자 표면은 6px.
      `variant="cta"`가 마케팅용이고 나머지가 앱용이다.
   5. 눌림에 transform을 쓰지 않는다. 그림자가 무너진다. */

/** 섹션 eyebrow.
    vercel은 이 자리를 항상 모노스페이스로 두라고 하지만 **한글에는 적용하지 않는다** —
    라틴 모노 폰트에 한글이 없어 시스템 폰트로 폴백하면서 글자마다 폭이 강제되고
    "대전  코메츠  팬  홈"처럼 자간이 벌어진다. 모노는 숫자와 기호 전용
    (`MonoIndex`, 시각, 차트 축, 단위 접미사)으로만 남긴다. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-[12px] font-medium uppercase leading-[16px] tracking-[0.08em] text-[var(--bm-muted-soft)]">
      {children}
    </span>
  );
}

/** 번호 붙은 모노 eyebrow. 템플릿 그리드의 01~06 표기에 쓴다. */
export function MonoIndex({ n }: { n: number }) {
  return (
    <span className="bm-mono text-[12px] font-medium leading-[16px] text-[var(--bm-muted-soft)]">
      {String(n).padStart(2, "0")}
    </span>
  );
}

export function Display({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`text-[32px] font-semibold leading-[40px] tracking-[-0.04em] text-[var(--bm-ink)] sm:text-[48px] sm:leading-[48px] sm:tracking-[-0.05em] ${className}`}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.04em] text-[var(--bm-ink)]">
          {title}
        </h2>
        {sub && (
          <p className="mt-1.5 text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-muted)]">
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  full,
  disabled,
  trailingIcon,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  /** `cta`는 마케팅 표면 전용 pill이다. 앱/관리자 화면에서 다른 variant와 섞지 않는다. */
  variant?: "primary" | "secondary" | "quiet" | "danger" | "cta";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  disabled?: boolean;
  trailingIcon?: ReactNode;
  type?: "button" | "submit";
}) {
  const sizes = {
    sm: "h-8 px-3 text-[14px]",
    md: "h-10 px-4 text-[14px]",
    lg: "h-12 px-5 text-[16px]",
  };
  const variants = {
    primary: "rounded-[6px] bg-[var(--bm-ink)] text-[var(--bm-on-ink)] bm-press-ink",
    secondary:
      "rounded-[6px] bg-[var(--bm-canvas)] text-[var(--bm-ink)] border border-[var(--bm-hairline)] bm-press",
    quiet: "rounded-[6px] bg-[var(--bm-surface-card)] text-[var(--bm-body-strong)] bm-press-flat",
    danger: "rounded-[6px] bg-[var(--bm-error)] text-white bm-press-ink",
    cta: "rounded-full bg-[var(--bm-ink)] text-[var(--bm-on-ink)] bm-press-ink px-6",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium ${sizes[size]} ${
        variants[variant]
      } ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <span>{children}</span>
      {trailingIcon && (
        <span
          className={`-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            variant === "primary" || variant === "cta" || variant === "danger"
              ? "bg-white/15"
              : "bg-[var(--bm-surface-card)]"
          }`}
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

export function Card({
  children,
  tone = "canvas",
  padded = true,
  className = "",
  onClick,
}: {
  children: ReactNode;
  /** `canvas`가 기본이다. vercel의 깊이는 표면 명도가 아니라 그림자에서 나온다. */
  tone?: "canvas" | "soft" | "card" | "ink";
  padded?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const tones = {
    canvas: "bg-[var(--bm-canvas)] bm-card",
    soft: "bg-[var(--bm-surface)] border border-[var(--bm-hairline)]",
    card: "bg-[var(--bm-surface-card)]",
    ink: "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]",
  };
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={`rounded-[8px] ${tones[tone]} ${padded ? "p-6" : ""} ${
        onClick ? "bm-press w-full text-left" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "ink" | "team";
}) {
  const tones = {
    neutral: "bg-[var(--bm-surface-card)] text-[var(--bm-body)]",
    success: "bg-[var(--bm-success-soft)] text-[var(--bm-link-deep)]",
    warning: "bg-[var(--bm-warning-soft)] text-[var(--bm-warning-deep)]",
    danger: "bg-[var(--bm-error-soft)] text-[var(--bm-error-deep)]",
    ink: "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]",
    team: "bg-[var(--bm-surface-card)] text-[var(--bm-ink)]",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[12px] font-medium leading-[16px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** 구단 모노그램. 색이 아니라 사각 잉크 타일이다. */
export function TeamMark({
  id,
  size = 32,
  accent = false,
}: {
  id: TeamId;
  size?: number;
  accent?: boolean;
}) {
  const t = team(id);
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] font-medium"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: accent ? "var(--bm-ink)" : "var(--bm-surface-card)",
        color: accent ? "var(--bm-on-ink)" : "var(--bm-body)",
      }}
    >
      {t.mark}
    </span>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--bm-surface-card)] font-medium text-[var(--bm-body)]"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        boxShadow: "var(--bm-shadow-hairline)",
      }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`bm-swap bm-press-flat shrink-0 whitespace-nowrap rounded-[6px] px-3 py-1.5 text-[14px] font-medium leading-[20px] tracking-[-0.01em] ${
        active
          ? "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]"
          : "bg-[var(--bm-canvas)] text-[var(--bm-body)] border border-[var(--bm-hairline)]"
      }`}
    >
      {label}
    </button>
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
    <div className="inline-flex rounded-[6px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)] p-0.5">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={`bm-swap rounded-[4px] px-3 py-1.5 text-[14px] font-medium leading-[20px] tracking-[-0.01em] ${
            value === o.key
              ? "bg-[var(--bm-surface-card)] text-[var(--bm-ink)]"
              : "text-[var(--bm-muted)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="bm-noscroll flex gap-5 overflow-x-auto border-b border-[var(--bm-hairline)]">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={`bm-swap -mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-[14px] font-medium leading-[20px] tracking-[-0.01em] ${
            value === o.key
              ? "border-[var(--bm-ink)] text-[var(--bm-ink)]"
              : "border-transparent text-[var(--bm-muted)]"
          }`}
        >
          {o.label}
          {typeof o.count === "number" && (
            <span className="bm-num ml-1.5 text-[13px] text-[var(--bm-muted-soft)]">{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[14px] font-medium leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)]">
        {label}
        {required && <span className="text-[var(--bm-error)]">필수</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-[12px] leading-[16px] text-[var(--bm-muted-soft)]">
          {hint}
        </span>
      )}
    </label>
  );
}

const CONTROL =
  "h-10 w-full rounded-[6px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)] px-3 text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)] outline-none placeholder:text-[var(--bm-muted-soft)] focus:border-[var(--bm-ink)]";

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: string;
}) {
  if (suffix) {
    return (
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`${CONTROL} pr-11`}
        />
        <span className="bm-mono pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--bm-muted-soft)]">
          {suffix}
        </span>
      </div>
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={CONTROL}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-[6px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)] px-3 py-2.5 text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)] outline-none placeholder:text-[var(--bm-muted-soft)] focus:border-[var(--bm-ink)]"
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange?: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${CONTROL} appearance-none pr-9`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1.5 6 6.5 11 1.5' stroke='%23888888' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "검색",
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--bm-muted-soft)]"
      />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`${CONTROL} pl-9`}
      />
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  unit,
}: {
  label: string;
  value: string;
  delta?: number;
  unit?: string;
}) {
  return (
    <div className="rounded-[8px] bg-[var(--bm-canvas)] p-5 bm-card">
      <p className="text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-muted)]">{label}</p>
      <p className="bm-num mt-2 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] text-[var(--bm-ink)]">
        {value}
        {unit && (
          <span className="ml-1 text-[16px] font-normal text-[var(--bm-muted)]">{unit}</span>
        )}
      </p>
      {typeof delta === "number" && (
        <p
          className="bm-num mt-1 text-[13px] font-medium leading-[18px]"
          style={{ color: delta >= 0 ? "var(--bm-link-deep)" : "var(--bm-error-deep)" }}
        >
          {delta >= 0 ? "+" : ""}
          {delta}% 전주 대비
        </p>
      )}
    </div>
  );
}

/* ---------- 표 ----------
   overflow-x-auto 안에 있으므로 minWidth를 넘기면 마지막 열이 조용히 잘린다.
   패널 없는 표 940 / 패널과 나란한 표 640 두 예산이 있다 (design.md). */

export function Table({
  head,
  children,
  minWidth = 940,
}: {
  head: string[];
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-[var(--bm-hairline)]">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="bg-[var(--bm-surface)]">
            {head.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium leading-[16px] text-[var(--bm-muted)]"
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
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={`bm-swap border-t border-[var(--bm-hairline)] ${
        active ? "bg-[var(--bm-surface-card)]" : "bg-[var(--bm-canvas)] hover:bg-[var(--bm-surface)]"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  num,
  strong,
  className = "",
}: {
  children: ReactNode;
  num?: boolean;
  strong?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`px-4 py-3 align-middle text-[14px] leading-[20px] tracking-[-0.01em] ${
        strong ? "font-medium text-[var(--bm-ink)]" : "text-[var(--bm-body)]"
      } ${num ? "bm-num" : ""} ${className}`}
    >
      {children}
    </td>
  );
}

export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="bm-num text-[13px] leading-[18px] text-[var(--bm-muted)]">
        {page} / {total} 페이지
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="이전 페이지"
          className="bm-press flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)] text-[var(--bm-body)] disabled:opacity-30"
        >
          <CaretLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(total, page + 1))}
          disabled={page === total}
          aria-label="다음 페이지"
          className="bm-press flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)] text-[var(--bm-body)] disabled:opacity-30"
        >
          <CaretRight size={14} />
        </button>
      </div>
    </div>
  );
}

/** 마스터-디테일의 우측 패널. C4에는 드로어가 없으므로 인라인 패널로 받는다. */
export function DetailPanel({
  title,
  sub,
  onClose,
  children,
  foot,
}: {
  title: string;
  sub?: string;
  onClose: () => void;
  children: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <aside className="bm-rise bm-card flex w-full shrink-0 flex-col rounded-[8px] bg-[var(--bm-canvas)] xl:w-[360px]">
      <header className="flex items-start justify-between gap-3 border-b border-[var(--bm-hairline)] px-5 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-[var(--bm-ink)]">
            {title}
          </h3>
          {sub && (
            <p className="mt-0.5 text-[13px] leading-[18px] text-[var(--bm-muted)]">{sub}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bm-press-flat shrink-0 rounded-[4px] px-2 py-1 text-[13px] font-medium text-[var(--bm-muted)]"
        >
          닫기
        </button>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">{children}</div>
      {foot && <div className="border-t border-[var(--bm-hairline)] px-5 py-4">{foot}</div>}
    </aside>
  );
}

export function DefList({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-start justify-between gap-4">
          <dt className="shrink-0 text-[13px] leading-[20px] text-[var(--bm-muted)]">{r.label}</dt>
          <dd className="min-w-0 text-right text-[14px] font-medium leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)]">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** 가로 막대 차트. 라이브러리 없이 직접 그린다. */
export function BarChart({
  data,
  max,
  unit = "",
}: {
  data: { label: string; value: number }[];
  max?: number;
  unit?: string;
}) {
  const peak = max ?? Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-[76px] shrink-0 truncate text-[13px] leading-[18px] text-[var(--bm-body)]">
            {d.label}
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bm-surface-card)]">
            <span
              className="block h-full rounded-full bg-[var(--bm-ink)]"
              style={{ width: `${Math.round((d.value / peak) * 100)}%` }}
            />
          </span>
          <span className="bm-num w-[52px] shrink-0 text-right text-[13px] font-medium leading-[18px] text-[var(--bm-ink)]">
            {d.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

/** 추이 라인. SVG 직접 구현. */
export function TrendChart({ data }: { data: { label: string; value: number }[] }) {
  const w = 640;
  const h = 180;
  const pad = 8;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = pad + (1 - (d.value - min) / span) * (h - pad * 2);
    return { x, y, ...d };
  });
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${h} L ${pts[0].x.toFixed(1)} ${h} Z`;
  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[180px] w-full"
        role="img"
        aria-label="티켓 거래 추이"
      >
        <defs>
          <linearGradient id="bm-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bm-surface-card)" />
            <stop offset="100%" stopColor="var(--bm-canvas)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#bm-trend)" />
        <path
          d={line}
          fill="none"
          stroke="var(--bm-ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="var(--bm-canvas)"
            stroke="var(--bm-ink)"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d, i) => (
          <span
            key={d.label}
            className={`bm-mono text-[11px] leading-[16px] text-[var(--bm-muted-soft)] ${
              i % 2 === 1 ? "hidden sm:inline" : ""
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 카테고리 비중. 액센트가 하나뿐이라 잉크 명도 3단으로 나눈다. */
export function ShareBar({ data }: { data: { label: string; value: number }[] }) {
  const inks = ["var(--bm-ink)", "var(--bm-muted-soft)", "var(--bm-surface-strong)"];
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full">
        {data.map((d, i) => (
          <span key={d.label} style={{ width: `${d.value}%`, background: inks[i] ?? inks[2] }} />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: inks[i] ?? inks[2] }}
            />
            <span className="flex-1 text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-body)]">
              {d.label}
            </span>
            <span className="bm-num text-[14px] font-medium leading-[20px] text-[var(--bm-ink)]">
              {d.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[8px] border border-dashed border-[var(--bm-hairline-strong)] px-6 py-14 text-center">
      <p className="text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-[var(--bm-ink)]">
        {title}
      </p>
      <p className="mx-auto mt-1.5 max-w-[380px] text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-muted)]">
        {desc}
      </p>
    </div>
  );
}
