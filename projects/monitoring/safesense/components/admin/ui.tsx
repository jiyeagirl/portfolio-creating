"use client";

import type { ReactNode } from "react";
import type { SafetyStatus } from "@/projects/monitoring/safesense/lib/types";

/* 관리자 콘솔 전용 프리미티브. app/ui.tsx와 토큰(--ss-*)은 같지만 밀도가 다른
   독립 컴포넌트 — VISUAL_DENSITY 8, 카드 남용 대신 1px 라인 + 데이터 테이블. */

export function PageHead({
  eyebrow,
  title,
  desc,
  actions,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--ss-border)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="ss-mono ss-bracket text-[11px] text-[var(--ss-muted)]">{eyebrow}</p>
        <h1 className="ss-display mt-2 text-[26px] text-[var(--ss-foreground)]">{title}</h1>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-[var(--ss-muted)]">{desc}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

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

export function CardHead({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4 p-5 pb-0">
      <div className="min-w-0">
        <h2 className="ss-mono ss-bracket text-[11px] text-[var(--ss-muted)]">{title}</h2>
        {desc && <p className="mt-1 text-[12px] text-[var(--ss-muted)]">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

const STATUS_COLOR: Record<SafetyStatus, string> = {
  safe: "var(--ss-safe)",
  danger: "var(--ss-accent)",
};
const STATUS_LABEL: Record<SafetyStatus, string> = { safe: "안전", danger: "위험" };

export function StatusBadge({ status, live = false }: { status: SafetyStatus; live?: boolean }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className="ss-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--ss-border)] px-2 py-[3px] text-[10px] font-semibold"
      style={{ color }}
    >
      <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${live ? "ss-blink" : ""}`} style={{ background: color }} />
      {STATUS_LABEL[status]}
    </span>
  );
}

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
  const up = delta?.startsWith("+");
  return (
    <div className={`rounded-[10px] border p-5 ${emphasis ? "border-[var(--ss-accent)] bg-[var(--ss-accent-wash)]" : "border-[var(--ss-border)] bg-[var(--ss-panel)]"}`}>
      <p className="ss-mono text-[10.5px] text-[var(--ss-muted)]">{label}</p>
      <p className="ss-mono mt-2 text-[26px] font-bold text-[var(--ss-foreground)]">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span className={`ss-mono text-[11px] font-semibold ${up ? "text-[var(--ss-safe)]" : "text-[var(--ss-accent)]"}`}>
            {delta}
          </span>
        )}
        {note && <span className="ss-mono text-[11px] text-[var(--ss-muted)]">{note}</span>}
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
    <div className="flex gap-0 border-b border-[var(--ss-border)]">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`ss-mono relative px-4 py-3 text-[11px] font-semibold transition-colors ${
              active ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="ml-1.5 opacity-70">{item.count}</span>}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--ss-accent)]" />}
          </button>
        );
      })}
    </div>
  );
}

export function Table({
  head,
  children,
  align = [],
  minWidth = 640,
}: {
  head: string[];
  children: ReactNode;
  align?: ("left" | "right" | "center")[];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-[var(--ss-border)]">
            {head.map((label, i) => (
              <th
                key={label}
                scope="col"
                className={`ss-mono whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold text-[var(--ss-muted)] first:pl-0 last:pr-0 ${
                  align[i] === "right" ? "text-right" : align[i] === "center" ? "text-center" : ""
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

export function Row({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`ss-press border-b border-[var(--ss-border)] last:border-b-0 ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align = "left",
  strong = false,
  mono = true,
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 text-[12px] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${strong ? "font-semibold text-[var(--ss-foreground)]" : "text-[var(--ss-muted)]"} ${mono ? "ss-mono" : ""}`}
    >
      {children}
    </td>
  );
}

export function BarChart({
  data,
  height = 148,
}: {
  data: { label: string; value: number; emphasis?: boolean }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-stretch gap-[1px] overflow-hidden rounded-[8px] bg-[var(--ss-border)]" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex min-w-[36px] flex-1 flex-col justify-end gap-2 bg-[var(--ss-panel)] p-1.5">
          <p className={`ss-mono text-center text-[9px] ${d.emphasis ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"}`}>
            {d.value}
          </p>
          <div
            className="w-full rounded-t-[3px]"
            style={{
              height: `${Math.max(4, (d.value / max) * 100)}%`,
              background: d.emphasis ? "var(--ss-accent)" : "var(--ss-border-strong)",
            }}
          />
          <p className="ss-mono text-center text-[9px] text-[var(--ss-muted)]">{d.label}</p>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ steps }: { steps: { label: string; at: string; done: boolean }[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                className="absolute left-[5px] top-4 w-px"
                style={{ bottom: 0, background: step.done ? "var(--ss-accent)" : "var(--ss-border)" }}
              />
            )}
            <span
              className="relative z-10 mt-[3px] h-[11px] w-[11px] shrink-0 rounded-full border-2"
              style={{
                borderColor: step.done ? "var(--ss-accent)" : "var(--ss-border-strong)",
                background: step.done ? "var(--ss-accent)" : "var(--ss-panel)",
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={`ss-mono text-[11px] ${step.done ? "font-semibold text-[var(--ss-foreground)]" : "text-[var(--ss-muted)]"}`}>
                  {step.label}
                </p>
                <p className="ss-mono text-[10px] text-[var(--ss-muted)]">{step.at}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
