"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, MagnifyingGlass, X } from "@phosphor-icons/react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

/* 칩은 색을 채운 덩어리가 아니라 가는 보더 + 아주 옅은 틴트로 표시한다.
   상태를 뜻하는 톤(success/warning/danger)에만 currentColor 도트를 붙여
   "지금 이 상태다"라는 의미를 더하고, 분류 라벨(neutral/accent)에는 도트를 넣지 않는다. */
const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-[var(--vl-border)] text-[var(--vl-muted)]",
  accent: "border-[var(--vl-accent)]/25 bg-[var(--vl-accent)]/[0.06] text-[var(--vl-accent)]",
  success: "border-[var(--vl-success)]/25 bg-[var(--vl-success)]/[0.06] text-[var(--vl-success)]",
  warning: "border-[var(--vl-warning)]/25 bg-[var(--vl-warning)]/[0.06] text-[var(--vl-warning)]",
  danger: "border-[var(--vl-danger)]/25 bg-[var(--vl-danger)]/[0.06] text-[var(--vl-danger)]",
};

const DOT_TONES: Tone[] = ["success", "warning", "danger"];

export function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-semibold leading-none ${TONE_CLASS[tone]}`}
    >
      {DOT_TONES.includes(tone) && (
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-current" aria-hidden />
      )}
      {children}
    </span>
  );
}

export function PageHead({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-[68ch] text-[14px] text-[var(--vl-muted)]">{description}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  note,
  actions,
  children,
  className = "",
}: {
  title?: string;
  note?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--vl-border)] px-5 py-4">
          <div>
            {title && <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>}
            {note && <p className="mt-1 text-[12.5px] text-[var(--vl-muted)]">{note}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

/** 지표 타일. 숫자가 주인공이라 차트를 그리지 않는다. */
export function Metric({
  label,
  value,
  unit,
  delta,
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  note?: string;
}) {
  return (
    <div className="rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-5">
      <p className="text-[12.5px] font-semibold text-[var(--vl-muted)]">{label}</p>
      <p className="vl-num mt-2 text-[26px] font-bold leading-none tracking-tight">
        {value}
        {unit && <span className="ml-1 text-[14px] font-semibold text-[var(--vl-muted)]">{unit}</span>}
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        {typeof delta === "number" && (
          <span
            className={`vl-num inline-flex items-center gap-0.5 text-[12px] font-bold ${
              delta >= 0 ? "text-[var(--vl-success)]" : "text-[var(--vl-danger)]"
            }`}
          >
            {delta >= 0 ? <ArrowUp size={11} weight="bold" /> : <ArrowDown size={11} weight="bold" />}
            {Math.abs(delta)}%
          </span>
        )}
        {note && <span className="vl-num text-[12px] text-[var(--vl-muted)]">{note}</span>}
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-3.5 py-2 lg:max-w-[320px]">
      <MagnifyingGlass size={15} className="shrink-0 text-[var(--vl-muted)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-[13px] text-[var(--vl-ink)] outline-none"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="검색어 지우기">
          <X size={13} weight="bold" className="text-[var(--vl-muted)]" />
        </button>
      )}
    </div>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
            value === option.key
              ? "bg-[var(--vl-accent)] text-[var(--vl-accent-fg)]"
              : "border border-[var(--vl-border)] text-[var(--vl-muted)] hover:text-[var(--vl-ink)]"
          }`}
        >
          {option.label}
          {typeof option.count === "number" && <span className="vl-num ml-1.5 opacity-70">{option.count}</span>}
        </button>
      ))}
    </div>
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
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="flex items-center justify-between border-t border-[var(--vl-border)] px-5 py-3.5">
      <p className="vl-num text-[12.5px] text-[var(--vl-muted)]">
        전체 {total}건 중 {Math.min(total, (page - 1) * perPage + 1)}
        {" ~ "}
        {Math.min(total, page * perPage)}건
      </p>
      <div className="flex items-center gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={page === n ? "page" : undefined}
            className={`vl-num h-7 min-w-7 rounded-[6px] px-2 text-[12.5px] font-semibold transition-colors ${
              page === n
                ? "bg-[var(--vl-accent)] text-[var(--vl-accent-fg)]"
                : "text-[var(--vl-muted)] hover:bg-[var(--vl-surface)]"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Drawer({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" aria-label="닫기" onClick={onClose} className="flex-1 bg-[rgba(21,22,26,0.4)]" />
      <aside className="h-full w-full max-w-[420px] overflow-y-auto border-l border-[var(--vl-border)] bg-[var(--vl-elevated)] p-6">
        {children}
      </aside>
    </div>
  );
}

/* 시간대별 통화 건수. 한 계열이라 범례 없이 제목이 계열을 설명한다. */
export function HourlyBars({ data, unit = "건" }: { data: { hour: string; calls: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.calls));
  const peak = data.find((d) => d.calls === max);

  return (
    <div className="px-5 py-5">
      <div className="flex h-[148px] items-stretch gap-[2px]">
        {data.map((item) => {
          const height = Math.max(4, (item.calls / max) * 100);
          const isPeak = item.hour === peak?.hour;
          return (
            <div key={item.hour} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="vl-num h-4 text-[11px] font-bold text-[var(--vl-ink)]">
                {isPeak ? item.calls : ""}
              </span>
              <span
                title={`${item.hour}시 ${item.calls}${unit}`}
                style={{ height: `${height}%` }}
                className={`w-full rounded-t-[4px] transition-colors ${
                  isPeak ? "bg-[var(--vl-chart-strong)]" : "bg-[var(--vl-chart-base)]"
                } group-hover:bg-[var(--vl-chart-strong)]`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-[2px] border-t border-[var(--vl-border)] pt-2">
        {data.map((item) => (
          <span key={item.hour} className="vl-num flex-1 text-center text-[10.5px] text-[var(--vl-muted)]">
            {item.hour}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 이용권 등급별 비중. 라이트→프리미엄으로 이어지는 순서형 값이라 액센트 한 색의 명도 단계로 표현한다. */
export function ShareBar({ data }: { data: { label: string; share: number; note: string }[] }) {
  const steps = ["var(--vl-chart-strong)", "var(--vl-chart-base)", "var(--vl-chart-soft)"];
  return (
    <div className="px-5 py-5">
      <div className="flex h-3 gap-[2px] overflow-hidden">
        {data.map((item, i) => (
          <span
            key={item.label}
            title={`${item.label} ${item.share}%`}
            style={{ width: `${item.share}%`, background: steps[i] }}
            className="h-full rounded-[4px]"
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {data.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: steps[i] }} aria-hidden />
            <span className="text-[13px] font-semibold">{item.label}</span>
            <span className="vl-num ml-auto text-[13px] font-bold">{item.share}%</span>
            <span className="vl-num w-20 text-right text-[12px] text-[var(--vl-muted)]">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 일별 추이(신규가입, 매출 등). 한 계열, 가로 막대, 값은 직접 라벨로 붙인다. */
export function TrendBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-3 px-5 py-5">
      {data.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="vl-num w-16 shrink-0 text-[12px] text-[var(--vl-muted)]">{item.label}</span>
          <span className="h-2.5 flex-1 bg-[var(--vl-surface)]">
            <span
              title={`${item.label} ${item.caption}`}
              style={{ width: `${(item.value / max) * 100}%` }}
              className="block h-full rounded-r-[4px] bg-[var(--vl-chart-base)]"
            />
          </span>
          <span className="vl-num w-28 shrink-0 text-right text-[12.5px] font-semibold">{item.caption}</span>
        </li>
      ))}
    </ul>
  );
}
