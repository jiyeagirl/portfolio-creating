"use client";

/**
 * 관리자 콘솔 프리미티브. 모바일 화면과 같은 --yc-* 토큰을 쓰되,
 * 반경 문법만 콘솔용으로 좁힌다(버튼/입력 6px, 카드 8px, 배지 full).
 * 표는 overflow-x-auto 안에 들어가므로 minWidth 를 넘기면 마지막 열이 조용히 잘린다.
 */

import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export type Tone = "neutral" | "accent" | "stamp" | "lock" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--yc-surface-soft)] text-[var(--yc-body)]",
  accent: "bg-[var(--yc-accent-soft)] text-[var(--yc-accent-deep)]",
  stamp: "bg-[var(--yc-stamp-soft)] text-[var(--yc-stamp)]",
  lock: "bg-[var(--yc-lock-soft)] text-[var(--yc-lock)]",
  danger: "bg-[#f6dfd6] text-[#9c4620]",
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
      {dot && <span className="h-[5px] w-[5px] rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  onClick,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const variants = {
    primary:
      "bg-[var(--yc-accent)] text-[var(--yc-on-accent)] border border-[var(--yc-accent)] hover:bg-[var(--yc-accent-deep)]",
    secondary:
      "bg-[var(--yc-surface)] text-[var(--yc-ink)] border border-[var(--yc-hairline)] hover:bg-[var(--yc-canvas)]",
    ghost:
      "bg-transparent text-[var(--yc-body)] border border-transparent hover:bg-[var(--yc-surface-soft)]",
  };
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-9 px-4 text-[13.5px]" };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-[6px] font-medium transition-colors active:scale-[0.99] ${variants[variant]} ${sizes[size]}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-[8px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] ${
        padded ? "p-5" : ""
      } ${className}`}
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--yc-ink)]">
          {title}
        </h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--yc-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--yc-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--yc-mute)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.035em] text-[var(--yc-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--yc-body)]">{desc}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Stat({
  label,
  value,
  unit,
  delta,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  note?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-[8px] border p-5 ${
        emphasis
          ? "yc-b-accent bg-[var(--yc-accent)] text-[var(--yc-on-accent)]"
          : "border-[var(--yc-hairline)] bg-[var(--yc-surface)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--yc-mute)]"}`}>
        {label}
      </p>
      <p
        className={`yc-num mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] ${
          emphasis ? "text-[var(--yc-on-accent)]" : "text-[var(--yc-ink)]"
        }`}
      >
        {value}
        {unit && <span className="ml-1 text-[14px] font-medium">{unit}</span>}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`yc-num text-[12px] font-medium ${
              emphasis ? "text-white/90" : "text-[var(--yc-accent)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && (
          <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--yc-mute)]"}`}>
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--yc-hairline)]">
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
                ? "font-medium text-[var(--yc-ink)]"
                : "text-[var(--yc-mute)] hover:text-[var(--yc-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="yc-num ml-1.5 text-[12px] text-[var(--yc-mute)]">{item.count}</span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--yc-accent)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** 표는 overflow-x-auto 안에 있다. 컬럼 폭 합이 minWidth 를 넘으면 마지막 열이
 *  조용히 잘리므로, 열을 6개 이하로 유지하고 값은 보조 줄로 내린다. */
export function Table({
  head,
  children,
  align = [],
  minWidth = 720,
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
          <tr className="border-b border-[var(--yc-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-[var(--yc-mute)] first:pl-0 last:pr-0 ${
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

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-[var(--yc-hairline)] last:border-b-0 hover:bg-[var(--yc-canvas)]">
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align = "left",
  strong = false,
  num = false,
  muted = false,
  nowrap = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  strong?: boolean;
  num?: boolean;
  muted?: boolean;
  nowrap?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 text-[13px] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${
        strong
          ? "font-medium text-[var(--yc-ink)]"
          : muted
            ? "text-[var(--yc-mute)]"
            : "text-[var(--yc-body)]"
      } ${num ? "yc-num" : ""} ${nowrap ? "whitespace-nowrap" : ""}`}
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--yc-hairline)] pt-4">
      <p className="yc-num text-[12px] text-[var(--yc-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--yc-hairline)] text-[var(--yc-body)] transition-colors hover:bg-[var(--yc-canvas)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`yc-num h-8 min-w-8 rounded-[6px] px-2 text-[13px] transition-colors ${
              n === page
                ? "bg-[var(--yc-accent)] text-[var(--yc-on-accent)]"
                : "border border-[var(--yc-hairline)] text-[var(--yc-body)] hover:bg-[var(--yc-canvas)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--yc-hairline)] text-[var(--yc-body)] transition-colors hover:bg-[var(--yc-canvas)] disabled:opacity-35"
        >
          <CaretRight size={13} />
        </button>
      </div>
    </div>
  );
}

/** 단일 계열 세로 막대. 계열이 하나뿐이라 범례 없이 카드 제목이 계열을 설명한다. */
export function BarChart({
  data,
  format,
  height = 152,
}: {
  data: { label: string; value: number; emphasis?: boolean }[];
  format: (value: number) => string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex min-w-[52px] flex-1 flex-col justify-end gap-2">
            <p
              className={`yc-num whitespace-nowrap text-center text-[11px] leading-4 ${
                d.emphasis ? "font-medium text-[var(--yc-ink)]" : "text-[var(--yc-mute)]"
              }`}
            >
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: d.emphasis ? "var(--yc-accent)" : "var(--yc-chart-rest)",
              }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--yc-mute)]">
              {d.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 순위형 가로 막대. 값으로 정렬되는 데이터라 색 대신 단일 색조의 명도 단계를 쓴다. */
export function RankBars({
  data,
}: {
  data: { label: string; value: number; caption: string; sub: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = [
    "var(--yc-chart-1)",
    "var(--yc-chart-2)",
    "var(--yc-chart-3)",
    "var(--yc-chart-4)",
    "var(--yc-chart-5)",
  ];
  return (
    <ul className="space-y-3.5">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[var(--yc-ink)]">{d.label}</span>
            <span className="yc-num text-[13px] text-[var(--yc-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--yc-surface-soft)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: ramp[Math.min(index, ramp.length - 1)],
              }}
            />
          </div>
          <p className="yc-num mt-1 text-[11.5px] text-[var(--yc-mute)]">{d.sub}</p>
        </li>
      ))}
    </ul>
  );
}

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
                className="absolute bottom-0 left-[7px] top-4 w-px"
                style={{ background: step.done ? "var(--yc-accent)" : "var(--yc-hairline)" }}
              />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done
                  ? "yc-b-accent bg-[var(--yc-accent)]"
                  : "yc-b-strong bg-[var(--yc-surface)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={`text-[14px] ${
                    step.done ? "font-medium text-[var(--yc-ink)]" : "text-[var(--yc-mute)]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="yc-num text-[12px] text-[var(--yc-mute)]">{step.at}</p>
              </div>
              {step.note && (
                <p className="mt-1 text-[13px] leading-5 text-[var(--yc-body)]">{step.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
