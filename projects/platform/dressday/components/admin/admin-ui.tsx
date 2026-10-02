"use client";

/*
 * DRESSDAY 관리자 프리미티브. 색은 전부 styles/dressday.css의 --dd-* 토큰.
 * radius: 패널 14, 입력과 버튼 8, 배지와 칩은 완전한 원형 끝 (design.md Shape).
 * 그림자는 --dd-float 하나, 드로어와 드롭다운에만. hover 효과는 두지 않는다 (디자인시스템 no-hover).
 */

import Image from "next/image";
import type { ReactNode } from "react";
import { CaretDown, CaretLeft, CaretRight, CoatHanger, Dress, Hoodie, Pants, TShirt, X } from "@phosphor-icons/react";
import type { Garment, Product, Tone } from "@/projects/platform/dressday/lib/types";
import { photoUrl } from "@/projects/platform/dressday/lib/catalog";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  wait: "bg-[var(--dd-wait-bg)] text-[var(--dd-wait-fg)]",
  live: "bg-[var(--dd-live-bg)] text-[var(--dd-live-fg)]",
  act: "bg-[var(--dd-act-bg)] text-[var(--dd-act-fg)]",
  done: "bg-[var(--dd-done-bg)] text-[var(--dd-done-fg)]",
  stop: "bg-[var(--dd-stop-bg)] text-[var(--dd-stop-fg)]",
};

export function toneFg(tone: Tone) {
  return `var(--dd-${tone}-fg)`;
}

export function Badge({ tone, children, dot = false }: { tone: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-medium leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && <span aria-hidden className="dd-live-dot h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ── Button ── */

type ButtonVariant = "primary" | "ink" | "secondary" | "ghost" | "danger";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-[var(--dd-primary)] text-white active:bg-[var(--dd-primary-active)] disabled:bg-[var(--dd-primary-disabled)]",
  ink: "bg-[var(--dd-ink)] text-white",
  secondary: "border border-[var(--dd-hairline)] bg-white text-[var(--dd-ink)] active:bg-[var(--dd-soft)]",
  ghost: "text-[var(--dd-ink)] active:bg-[var(--dd-strong)]",
  danger: "border border-[var(--dd-hairline)] bg-white text-[var(--dd-error)] active:bg-[var(--dd-stop-bg)]",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  icon,
  onClick,
  disabled,
  full,
  ariaLabel,
}: {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`dd-press inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] font-medium disabled:cursor-not-allowed ${
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-[14px]"
      } ${full ? "w-full" : ""} ${BUTTON_VARIANT[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ── Page head ── */

export function PageHead({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[22px] font-medium leading-[30px] tracking-[-0.01em] text-[var(--dd-ink)]">{title}</h1>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[16px] font-semibold leading-6 text-[var(--dd-ink)]">{children}</h2>
      {aside}
    </div>
  );
}

/* ── Panel ── */

export function Panel({ children, className = "", tone = "line" }: { children: ReactNode; className?: string; tone?: "line" | "soft" }) {
  return (
    <section
      className={`rounded-[14px] ${tone === "soft" ? "bg-[var(--dd-soft)]" : "border border-[var(--dd-hairline)] bg-white"} ${className}`}
    >
      {children}
    </section>
  );
}

/* ── Metric row: 세로 헤어라인으로 나눈 한 줄 지표 ── */

export function MetricRow({
  items,
}: {
  items: { label: string; value: string; sub?: ReactNode; tone?: Tone; onClick?: () => void }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-y-5 border-y border-[var(--dd-hairline)] py-5 sm:grid-cols-3 xl:flex xl:divide-x xl:divide-[var(--dd-hairline)]">
      {items.map((m) => {
        const body = (
          <>
            <p className="text-[13px] leading-5 text-[var(--dd-muted)]">{m.label}</p>
            <p
              className="dd-num mt-1 text-[28px] font-semibold leading-9"
              style={{ color: m.tone ? toneFg(m.tone) : "var(--dd-ink)" }}
            >
              {m.value}
            </p>
            {m.sub && <p className="mt-0.5 text-[12px] leading-4 text-[var(--dd-muted)]">{m.sub}</p>}
          </>
        );
        return (
          <div key={m.label} className="min-w-0 px-5 first:pl-0 xl:flex-1">
            {m.onClick ? (
              <button type="button" onClick={m.onClick} className="dd-press block w-full text-left">
                {body}
              </button>
            ) : (
              body
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Tabs (밑줄형) ── */

export function Tabs<K extends string>({
  items,
  value,
  onChange,
}: {
  items: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div role="tablist" className="dd-scroll-x flex gap-6 overflow-x-auto border-b border-[var(--dd-hairline)]">
      {items.map((t) => {
        const on = t.key === value;
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(t.key)}
            className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap pb-3 pt-1 text-[14px] leading-5 ${
              on ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-muted)]"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`dd-num text-[12px] ${on ? "text-[var(--dd-ink)]" : "text-[var(--dd-muted-soft)]"}`}>{t.count}</span>
            )}
            {on && <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--dd-ink)]" />}
          </button>
        );
      })}
    </div>
  );
}

/* ── Segmented (필 형) ── */

export function Segmented<K extends string>({
  items,
  value,
  onChange,
  size = "md",
}: {
  items: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex shrink-0 rounded-full bg-[var(--dd-strong)] p-1">
      {items.map((t) => {
        const on = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(t.key)}
            className={`whitespace-nowrap rounded-full ${size === "sm" ? "h-7 px-3 text-[12px]" : "h-8 px-3.5 text-[13px]"} ${
              on ? "bg-white font-semibold text-[var(--dd-ink)] shadow-[0_0_0_1px_var(--dd-hairline)]" : "text-[var(--dd-muted)]"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Table ── */

export function TableWrap({ children, minWidth = 960 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, align = "left", className = "" }: { children?: ReactNode; align?: "left" | "right" | "center"; className?: string }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-[var(--dd-hairline)] px-4 py-2.5 text-[13px] font-medium leading-5 text-[var(--dd-muted)] first:pl-0 last:pr-0 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
      } ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, align = "left", className = "" }: { children?: ReactNode; align?: "left" | "right" | "center"; className?: string }) {
  return (
    <td
      className={`border-b border-[var(--dd-hairline-soft)] px-4 py-3 align-middle text-[14px] leading-5 text-[var(--dd-body)] [&_.dd-code]:whitespace-nowrap [&_.dd-num]:whitespace-nowrap first:pl-0 last:pr-0 ${
        align === "right" ? "dd-num whitespace-nowrap text-right" : align === "center" ? "text-center" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}

/** 클릭 가능한 행. 선택 행은 옅은 바탕 */
export function rowClass(selected: boolean) {
  return `cursor-pointer ${selected ? "bg-[var(--dd-soft)]" : ""}`;
}

/* ── Pagination ── */

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="dd-num text-[13px] text-[var(--dd-muted)]">
        {from}–{to} / {total}
      </p>
      {pages > 1 && (
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="dd-press flex h-8 w-8 items-center justify-center rounded-full text-[var(--dd-ink)] disabled:text-[var(--dd-muted-soft)]"
        >
          <CaretLeft size={16} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            className={`dd-num flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[13px] ${
              p === page ? "bg-[var(--dd-ink)] font-semibold text-white" : "text-[var(--dd-body)]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="dd-press flex h-8 w-8 items-center justify-center rounded-full text-[var(--dd-ink)] disabled:text-[var(--dd-muted-soft)]"
        >
          <CaretRight size={16} />
        </button>
      </div>
      )}
    </div>
  );
}

/* ── Drawer (우측 슬라이드오버) ── */

export function Drawer({
  open,
  onClose,
  title,
  meta,
  children,
  footer,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button type="button" aria-label="닫기" onClick={onClose} className="dd-scrim absolute inset-0 bg-[rgba(34,34,34,0.32)]" />
      <aside
        className="dd-drawer absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-[var(--dd-float)]"
        style={{ maxWidth: width }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--dd-hairline)] px-6 py-5">
          <div className="min-w-0">
            <div className="text-[18px] font-semibold leading-7 text-[var(--dd-ink)]">{title}</div>
            {meta && <div className="mt-1 text-[13px] leading-5 text-[var(--dd-muted)]">{meta}</div>}
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="dd-press -mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--dd-ink)] active:bg-[var(--dd-strong)]"
          >
            <X size={18} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex items-center justify-end gap-2 border-t border-[var(--dd-hairline)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

/** 드로어 안의 정의 목록 블록 */
export function InfoBlock({ title, rows, aside }: { title: string; rows: [string, ReactNode][]; aside?: ReactNode }) {
  return (
    <section className="border-b border-[var(--dd-hairline-soft)] py-5 first:pt-0 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold leading-5 text-[var(--dd-ink)]">{title}</h3>
        {aside}
      </div>
      <dl className="mt-3 space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[104px_1fr] gap-3 text-[14px] leading-5">
            <dt className="text-[var(--dd-muted)]">{k}</dt>
            <dd className="min-w-0 text-[var(--dd-ink)]">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Form ── */

export function Field({ label, required, children, hint }: { label: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[13px] font-medium leading-5 text-[var(--dd-ink)]">
        {label}
        {required && <span className="text-[var(--dd-error)]">*</span>}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {hint && <span className="mt-1 block text-[12px] leading-4 text-[var(--dd-muted)]">{hint}</span>}
    </label>
  );
}

const INPUT =
  "h-10 w-full rounded-[8px] border border-[var(--dd-hairline)] bg-white px-3 text-[14px] text-[var(--dd-ink)] outline-none focus:border-2 focus:border-[var(--dd-ink)] focus:px-[11px]";

export function TextInput({ defaultValue, suffix, align = "left" }: { defaultValue: string; suffix?: string; align?: "left" | "right" }) {
  return (
    <span className="relative block">
      <input defaultValue={defaultValue} className={`${INPUT} ${align === "right" ? "dd-num text-right" : ""} ${suffix ? "pr-9" : ""}`} />
      {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--dd-muted)]">{suffix}</span>}
    </span>
  );
}

export function SelectInput({ defaultValue, options }: { defaultValue: string; options: string[] }) {
  return (
    <span className="relative block">
      <select
        defaultValue={defaultValue}
        className="h-10 w-full appearance-none rounded-[8px] border border-[var(--dd-hairline)] bg-white pl-3 pr-9 text-[14px] text-[var(--dd-ink)] outline-none focus:border-2 focus:border-[var(--dd-ink)] focus:pl-[11px]"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dd-ink)]" />
    </span>
  );
}

/** 여러 개를 켜고 끄는 칩 (사이즈 등) */
export function ChipToggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`dd-press h-9 min-w-12 rounded-full px-3.5 text-[13px] ${
        on ? "bg-[var(--dd-ink)] font-semibold text-white" : "border border-[var(--dd-hairline)] bg-white text-[var(--dd-body)]"
      }`}
    >
      {label}
    </button>
  );
}

/* ── 상품 썸네일 ── */

const GARMENT_ICON: Record<Garment, typeof Dress> = {
  dress: Dress,
  skirt: Dress,
  shirt: TShirt,
  knit: Hoodie,
  outer: CoatHanger,
  pants: Pants,
};

export function ProductThumb({ product, size = 40, ratio = "3/4" }: { product: Product; size?: number; ratio?: "3/4" | "1/1" }) {
  const w = size;
  const h = ratio === "3/4" ? Math.round((size * 4) / 3) : size;
  const Icon = GARMENT_ICON[product.garment];
  const radius = size >= 120 ? 14 : 8;
  if (product.photo) {
    return (
      <span className="relative block shrink-0 overflow-hidden bg-[var(--dd-strong)]" style={{ width: w, height: h, borderRadius: radius }}>
        <Image
          src={photoUrl(product.photo.id, w * 2, h * 2)}
          alt={product.photo.alt}
          fill
          sizes={`${w}px`}
          className="object-cover"
          unoptimized
        />
      </span>
    );
  }
  return (
    <span
      aria-label={`${product.name} 사진 없음`}
      className="flex shrink-0 items-center justify-center"
      style={{ width: w, height: h, borderRadius: radius, background: product.tone, color: product.toneInk === "light" ? "rgba(255,255,255,0.86)" : "rgba(34,34,34,0.62)" }}
    >
      <Icon size={Math.max(16, Math.round(w * 0.42))} weight="light" />
    </span>
  );
}

/* ── 차트 (div 막대) ── */

/** 세로 막대. 강조 막대 하나만 잉크, 나머지는 회색 (console.md 차트) */
export function ColumnChart({
  data,
  height = 160,
  highlight,
  format,
}: {
  data: { label: string; value: number; sub?: string; muted?: boolean }[];
  height?: number;
  highlight?: number;
  format?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-[6px]" style={{ height }}>
        {data.map((d, i) => {
          const h = Math.max(2, Math.round((d.value / max) * (height - 20)));
          const on = i === highlight;
          return (
            <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1" title={format ? format(d.value) : String(d.value)}>
              {on && format && <span className="dd-num whitespace-nowrap text-[11px] font-semibold leading-4 text-[var(--dd-ink)]">{format(d.value)}</span>}
              <span
                className="block w-full rounded-t-[4px]"
                style={{
                  height: h,
                  background: on ? "var(--dd-ink)" : d.muted ? "var(--dd-hairline)" : "var(--dd-border-strong)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-[6px]">
        {data.map((d, i) => (
          <span
            key={d.label}
            className={`dd-num min-w-0 flex-1 truncate text-center text-[11px] leading-4 ${i === highlight ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-muted)]"}`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 가로 진행 막대 (4px) */
export function Meter({ value, max, tone = "ink" }: { value: number; max: number; tone?: "ink" | "muted" | Tone }) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  const color = tone === "ink" ? "var(--dd-ink)" : tone === "muted" ? "var(--dd-border-strong)" : toneFg(tone);
  return (
    <span className="block h-1 w-full overflow-hidden rounded-full bg-[var(--dd-strong)]">
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}

export function Avatar({ name, size = 36, dark = false }: { name: string; size?: number; dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${dark ? "bg-[var(--dd-ink)] text-white" : "bg-[var(--dd-strong)] text-[var(--dd-ink)]"}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {name.slice(0, 1)}
    </span>
  );
}
