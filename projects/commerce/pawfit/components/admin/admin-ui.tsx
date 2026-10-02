"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, MagnifyingGlass, X } from "@phosphor-icons/react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-[var(--pf-hairline)] text-[var(--pf-muted)]",
  accent: "border-[var(--pf-ink)]/20 bg-[var(--pf-ink)]/[0.05] text-[var(--pf-ink)]",
  success: "border-[var(--pf-success)]/25 bg-[var(--pf-success)]/[0.08] text-[var(--pf-success)]",
  warning: "border-[var(--pf-warning)]/25 bg-[var(--pf-warning)]/[0.08] text-[var(--pf-warning)]",
  danger: "border-[var(--pf-error)]/25 bg-[var(--pf-error)]/[0.08] text-[var(--pf-error)]",
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
        <h1 className="text-[26px] font-medium tracking-[-0.02em]">{title}</h1>
        <p className="mt-2 max-w-[68ch] text-[14px] text-[var(--pf-muted)]">{description}</p>
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
    <section className={`rounded-[8px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--pf-hairline)] px-5 py-4">
          <div>
            {title && <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>}
            {note && <p className="mt-1 text-[12.5px] text-[var(--pf-muted)]">{note}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

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
    <div className="rounded-[8px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] p-5">
      <p className="text-[12.5px] font-semibold text-[var(--pf-muted)]">{label}</p>
      <p className="pf-num mt-2 text-[26px] font-semibold leading-none tracking-tight">
        {value}
        {unit && <span className="ml-1 text-[14px] font-semibold text-[var(--pf-muted)]">{unit}</span>}
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        {typeof delta === "number" && (
          <span
            className={`pf-num inline-flex items-center gap-0.5 text-[12px] font-semibold ${
              delta >= 0 ? "text-[var(--pf-success)]" : "text-[var(--pf-error)]"
            }`}
          >
            {delta >= 0 ? <ArrowUp size={11} weight="bold" /> : <ArrowDown size={11} weight="bold" />}
            {Math.abs(delta)}%
          </span>
        )}
        {note && <span className="pf-num text-[12px] text-[var(--pf-muted)]">{note}</span>}
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
    <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[8px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-3.5 py-2 lg:max-w-[320px]">
      <MagnifyingGlass size={15} className="shrink-0 text-[var(--pf-muted)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-[13px] text-[var(--pf-ink)] outline-none"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="검색어 지우기">
          <X size={13} weight="bold" className="text-[var(--pf-muted)]" />
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
              ? "bg-[var(--pf-ink)] text-[var(--pf-on-primary)]"
              : "border border-[var(--pf-hairline)] text-[var(--pf-muted)] hover:text-[var(--pf-ink)]"
          }`}
        >
          {option.label}
          {typeof option.count === "number" && <span className="pf-num ml-1.5 opacity-70">{option.count}</span>}
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
    <div className="flex items-center justify-between border-t border-[var(--pf-hairline)] px-5 py-3.5">
      <p className="pf-num text-[12.5px] text-[var(--pf-muted)]">
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
            className={`pf-num h-7 min-w-7 rounded-[6px] px-2 text-[12.5px] font-semibold transition-colors ${
              page === n
                ? "bg-[var(--pf-ink)] text-[var(--pf-on-primary)]"
                : "text-[var(--pf-muted)] hover:bg-[var(--pf-surface-card)]"
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
      <button type="button" aria-label="닫기" onClick={onClose} className="flex-1 bg-[rgba(10,10,10,0.35)]" />
      <aside className="h-full w-full max-w-[420px] overflow-y-auto border-l border-[var(--pf-hairline)] bg-[var(--pf-canvas)] p-6">
        {children}
      </aside>
    </div>
  );
}

/** 카테고리별 사이즈 추천 사용 비중. 순서형 값이 아니라 카테고리 나열이라
    6색 브랜드 로테이션을 그대로 쓴다(대시보드 전용 차트라 clay의 "카드에만"
    제약과는 별개로, 참고선 없는 단일 계열 바 형태로 그린다). */
export function CategoryBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const steps = [
    "var(--pf-brand-pink)",
    "var(--pf-brand-teal)",
    "var(--pf-brand-lavender)",
    "var(--pf-brand-peach)",
    "var(--pf-brand-ochre)",
    "var(--pf-ink)",
  ];
  return (
    <ul className="space-y-3 px-5 py-5">
      {data.map((item, i) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-[12px] text-[var(--pf-muted)]">{item.label}</span>
          <span className="h-2.5 flex-1 bg-[var(--pf-surface-card)]">
            <span
              title={`${item.label} ${item.caption}`}
              style={{ width: `${(item.value / max) * 100}%`, background: steps[i % steps.length] }}
              className="block h-full rounded-r-[4px]"
            />
          </span>
          <span className="pf-num w-16 shrink-0 text-right text-[12.5px] font-semibold">{item.caption}</span>
        </li>
      ))}
    </ul>
  );
}

/** 추천 정확도 비중처럼 단계형 값. ink 명도 단계로 표현한다. */
export function ShareBar({ data }: { data: { label: string; share: number; note: string }[] }) {
  const steps = ["var(--pf-ink)", "var(--pf-muted)", "var(--pf-error)"];
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
            <span className="pf-num ml-auto text-[13px] font-semibold">{item.share}%</span>
            <span className="pf-num w-20 text-right text-[12px] text-[var(--pf-muted)]">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
