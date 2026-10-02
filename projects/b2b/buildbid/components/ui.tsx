"use client";

/**
 * BuildBid 공용 프리미티브. 값은 전부 styles/buildbid.css의 --bb-* 토큰을 참조하고
 * 여기서 새 색을 만들지 않는다. 반경은 apple_compact 문법을 따른다:
 * sm(8px)=유틸리티 버튼, lg(18px)=카드, pill=액션(버튼/인풋/칩). 굵기는
 * 300/400/600/700만 쓰고 500(font-medium)은 절대 쓰지 않는다(apple_compact 규칙).
 */

import { useId, useState } from "react";
import Image from "next/image";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CraneTower,
  MagnifyingGlass,
  RoadHorizon,
  Shovel,
  Tractor,
  Truck,
  TruckTrailer,
  X,
} from "@phosphor-icons/react";
import type { StaticImageData } from "next/image";
import type { EquipmentCategory } from "@/projects/b2b/buildbid/lib/types";
import { CATEGORY_LABEL, type Tone } from "@/projects/b2b/buildbid/lib/navigation";

/* ── Badge ── */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--bb-neutral-soft)] text-[var(--bb-body)]",
  info: "bg-[var(--bb-info-soft)] text-[var(--bb-info-deep)]",
  warn: "bg-[var(--bb-warn-soft)] text-[var(--bb-warn-deep)]",
  ink: "bg-[var(--bb-ink)] text-white",
  danger: "bg-[var(--bb-danger-soft)] text-[var(--bb-danger-deep)]",
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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-normal leading-4 ${TONE_CLASS[tone]}`}
    >
      {dot && (
        <span className="bb-live-dot relative inline-block h-[5px] w-[5px] rounded-full bg-current" />
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
  className = "",
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
  className?: string;
}) {
  const variants = {
    primary: "bg-[var(--bb-primary)] text-white border border-[var(--bb-primary)] hover:bg-[var(--bb-primary-focus)]",
    secondary: "bg-[var(--bb-canvas)] text-[var(--bb-ink)] border border-[var(--bb-hairline)] hover:bg-[var(--bb-canvas-parchment)]",
    ghost: "bg-transparent text-[var(--bb-body)] border border-transparent hover:bg-[var(--bb-canvas-parchment)] hover:text-[var(--bb-ink)]",
    danger: "bg-[var(--bb-canvas)] text-[var(--bb-danger-deep)] border border-[var(--bb-danger-soft)] hover:bg-[var(--bb-danger-soft)]",
  };
  const sizes = {
    sm: "h-8 px-3.5 text-[13px]",
    md: "h-10 px-4 text-[14px]",
    lg: "h-12 px-6 text-[15px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-normal transition-colors active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`}
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
      className={`rounded-[18px] border border-[var(--bb-hairline)] ${
        soft ? "bg-[var(--bb-canvas-parchment)]" : "bg-[var(--bb-canvas)]"
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
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--bb-ink)]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] leading-5 text-[var(--bb-mute)]">{desc}</p>}
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
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--bb-hairline)] pb-6">
      <div className="min-w-0 max-w-[70ch]">
        <p className="bb-mono text-[12px] uppercase tracking-[0.08em] text-[var(--bb-mute)]">{eyebrow}</p>
        <h1 className="mt-2 text-[26px] font-semibold leading-8 tracking-[-0.03em] text-[var(--bb-ink)]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--bb-body)]">{desc}</p>
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
  const signed = delta ? /^[+-]/.test(delta) : false;
  const up = delta?.startsWith("+");
  return (
    <div
      className={`rounded-[18px] border p-5 ${
        emphasis
          ? "border-[var(--bb-primary)] bg-[var(--bb-primary)] text-white"
          : "border-[var(--bb-hairline)] bg-[var(--bb-canvas)]"
      }`}
    >
      <p className={`text-[13px] ${emphasis ? "text-white/70" : "text-[var(--bb-mute)]"}`}>{label}</p>
      <p className={`mt-2 text-[26px] font-semibold leading-8 tracking-[-0.03em] ${emphasis ? "text-white" : "text-[var(--bb-ink)]"}`}>
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={`text-[12px] font-normal ${
              emphasis ? "text-white/90" : !signed ? "text-[var(--bb-body)]" : up ? "text-[var(--bb-info-deep)]" : "text-[var(--bb-danger-deep)]"
            }`}
          >
            {delta}
          </span>
        )}
        {note && <span className={`text-[12px] ${emphasis ? "text-white/60" : "text-[var(--bb-mute)]"}`}>{note}</span>}
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
      <span className="flex items-center gap-1 text-[13px] font-semibold text-[var(--bb-ink)]">
        {label}
        {required && <span className="text-[var(--bb-danger)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] leading-4 text-[var(--bb-mute)]">{hint}</p>}
    </label>
  );
}

const INPUT_CLASS =
  "h-11 w-full rounded-full border border-[var(--bb-hairline)] bg-[var(--bb-canvas)] px-4 text-[14px] text-[var(--bb-ink)] outline-none transition-colors placeholder:text-[var(--bb-mute)] focus:border-[var(--bb-primary-focus)]";

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
        className={`${INPUT_CLASS} ${suffix ? "pr-14" : ""}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[var(--bb-mute)]">
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
        className={`${INPUT_CLASS} appearance-none pr-10`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDown size={13} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--bb-mute)]" />
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
      <MagnifyingGlass size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--bb-mute)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CLASS} pl-10`}
      />
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="sm"
      onClassName="bg-[var(--bb-primary)]"
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
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--bb-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-current={active}
            className={`relative shrink-0 px-3 pb-3 pt-1 text-[14px] transition-colors ${
              active ? "font-semibold text-[var(--bb-ink)]" : "text-[var(--bb-mute)] hover:text-[var(--bb-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && <span className="ml-1.5 bb-mono text-[12px] text-[var(--bb-mute)]">{item.count}</span>}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--bb-primary)]" />}
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
    <div className="inline-flex rounded-full border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] p-[3px]">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={active}
            className={`rounded-full px-3.5 py-1 text-[13px] transition-colors ${
              active ? "bg-[var(--bb-canvas)] font-semibold text-[var(--bb-ink)] shadow-[0_1px_1px_rgba(0,0,0,0.04)]" : "text-[var(--bb-mute)] hover:text-[var(--bb-body)]"
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
          <tr className="border-b border-[var(--bb-hairline)]">
            {head.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-normal text-[var(--bb-mute)] first:pl-0 last:pr-0 ${
                  align[index] === "right" ? "text-right" : align[index] === "center" ? "text-center" : ""
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

export function Row({ children, onClick, active = false }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--bb-hairline)] last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-[var(--bb-canvas-parchment)]" : "hover:bg-[var(--bb-canvas-parchment)]"
      }`}
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
      className={`px-3 py-3 text-[13px] first:pl-0 last:pr-0 ${align === "right" ? "text-right" : align === "center" ? "text-center" : ""} ${
        strong ? "font-semibold text-[var(--bb-ink)]" : muted ? "text-[var(--bb-mute)]" : "text-[var(--bb-body)]"
      } ${mono ? "bb-mono" : ""} ${nowrap ? "whitespace-nowrap" : ""}`}
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--bb-hairline)] pt-4">
      <p className="bb-mono text-[12px] text-[var(--bb-mute)]">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] transition-colors hover:bg-[var(--bb-canvas-parchment)] disabled:opacity-35"
        >
          <CaretLeft size={13} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page}
            className={`h-8 min-w-8 rounded-full px-2 bb-mono text-[13px] transition-colors ${
              n === page ? "bg-[var(--bb-primary)] text-white" : "border border-[var(--bb-hairline)] text-[var(--bb-body)] hover:bg-[var(--bb-canvas-parchment)]"
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
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] transition-colors hover:bg-[var(--bb-canvas-parchment)] disabled:opacity-35"
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
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-[rgba(0,0,0,0.32)]" />
      <aside
        role="dialog"
        aria-label={title}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="bb-enter relative flex h-full w-full max-w-[520px] flex-col border-l border-[var(--bb-hairline)] bg-[var(--bb-canvas)] shadow-[var(--bb-shadow-overlay)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--bb-hairline)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--bb-ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-[var(--bb-mute)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--bb-hairline)] text-[var(--bb-body)] transition-colors hover:bg-[var(--bb-canvas-parchment)]"
          >
            <X size={13} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-[var(--bb-hairline)] px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}

/* ── Equipment thumbnail ──
   picsum에는 굴착기/크레인/덤프트럭 등 중장비에 맞는 사진이 없다(330여개 표본을
   직접 확인함, 풍경/사무실/도시/동물 위주). 이 프로젝트는 이전에 그 이유로 전
   카테고리를 글리프 타일로 대체했었지만, 아이콘 타일이 "신뢰성이 떨어진다"는
   포트폴리오 피드백에 따라 Wikimedia Commons에서 CC 라이선스 실사진을 개별
   확인해 가져와 `Equipment.photo`로 연결했다(design.md 사진 매핑 참고).
   `EquipmentThumb`은 이제 그 실사진을 렌더링한다. `CATEGORY_ICON`은 목록 필터
   칩 등 "이 장비의 사진"이 아니라 "카테고리 라벨"을 나타내는 `CategoryTag`,
   그리고 신규 등록 폼의 업로드 전 placeholder에서만 계속 쓰인다. */

export const CATEGORY_ICON: Record<EquipmentCategory, React.ComponentType<{ size?: number; weight?: "bold" }>> = {
  excavator: Shovel,
  crane: CraneTower,
  loader: Tractor,
  dumpTruck: TruckTrailer,
  forklift: Truck,
  roller: RoadHorizon,
};

export function EquipmentThumb({
  photo,
  alt,
  size = 44,
  rounded = 12,
}: {
  photo: StaticImageData;
  alt: string;
  size?: number;
  rounded?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)]"
      style={{ width: size, height: size, borderRadius: rounded }}
    >
      <Image src={photo} alt={alt} className="h-full w-full object-cover" sizes={`${size}px`} />
    </span>
  );
}

export function CategoryTag({ category }: { category: EquipmentCategory }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--bb-body)]">
      <Icon size={14} weight="bold" />
      {CATEGORY_LABEL[category]}
    </span>
  );
}

/* ── Charts ── */

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
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex min-w-[64px] flex-1 flex-col justify-end gap-2">
            <p className={`bb-mono whitespace-nowrap text-center text-[11px] leading-4 ${d.emphasis ? "font-semibold text-[var(--bb-ink)]" : "text-[var(--bb-mute)]"}`}>
              {format(d.value)}
            </p>
            <div
              className="w-full rounded-t-[6px]"
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%`, background: d.emphasis ? "var(--bb-primary)" : "var(--bb-chart-rest)" }}
            />
            <p className="whitespace-nowrap text-center text-[11px] leading-4 text-[var(--bb-mute)]">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RankBars({ data }: { data: { label: string; value: number; caption: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ramp = ["var(--bb-chart-1)", "var(--bb-chart-2)", "var(--bb-chart-3)", "var(--bb-chart-4)", "var(--bb-chart-5)"];
  return (
    <ul className="space-y-3">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-semibold text-[var(--bb-ink)]">{d.label}</span>
            <span className="bb-mono text-[13px] text-[var(--bb-body)]">{d.caption}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bb-neutral-soft)]">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: ramp[Math.min(index, ramp.length - 1)] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CompareChart({ data, height = 176 }: { data: { month: string; auto: number; won: number }[]; height?: number }) {
  const max = Math.max(...data.flatMap((d) => [d.auto, d.won]), 1);
  return (
    <div>
      <div className="flex items-stretch gap-3" style={{ height }}>
        {data.map((d) => (
          <div key={d.month} className="flex flex-1 flex-col justify-end gap-2">
            <div className="flex flex-1 items-end justify-center gap-[3px]">
              <div className="w-1/2 max-w-[18px] rounded-t-[6px] bg-[var(--bb-chart-rest)]" style={{ height: `${(d.auto / max) * 100}%` }} />
              <div className="w-1/2 max-w-[18px] rounded-t-[6px] bg-[var(--bb-primary)]" style={{ height: `${(d.won / max) * 100}%` }} />
            </div>
            <p className="text-center text-[11px] leading-4 text-[var(--bb-mute)]">{d.month}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 border-t border-[var(--bb-hairline)] pt-3">
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--bb-body)]">
          <span className="h-2 w-2 rounded-[3px] bg-[var(--bb-chart-rest)]" />
          AI 예상 시세
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--bb-body)]">
          <span className="h-2 w-2 rounded-[3px] bg-[var(--bb-primary)]" />
          실제 낙찰가
        </span>
      </div>
    </div>
  );
}

export function Meter({ value, tone = "ink" }: { value: number; tone?: "ink" | "info" | "warn" }) {
  const color = tone === "info" ? "var(--bb-info)" : tone === "warn" ? "var(--bb-warn)" : "var(--bb-primary)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bb-neutral-soft)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ── Timeline ── */

export function Timeline({ steps }: { steps: { label: string; at: string; done: boolean; note?: string }[] }) {
  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span className="absolute left-[7px] top-4 w-px" style={{ bottom: 0, background: step.done ? "var(--bb-primary)" : "var(--bb-hairline)" }} />
            )}
            <span
              className={`relative z-10 mt-[3px] h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                step.done ? "border-[var(--bb-primary)] bg-[var(--bb-primary)]" : "border-[var(--bb-hairline)] bg-[var(--bb-canvas)]"
              }`}
              style={!step.done ? { borderColor: "#c7c7c7" } : undefined}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={`text-[14px] ${step.done ? "font-semibold text-[var(--bb-ink)]" : "text-[var(--bb-mute)]"}`}>{step.label}</p>
                <p className="bb-mono text-[12px] text-[var(--bb-mute)]">{step.at}</p>
              </div>
              {step.note && <p className="mt-1 text-[13px] leading-5 text-[var(--bb-body)]">{step.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Definition list ── */

export function DefList({ items, columns = 2 }: { items: { label: string; value: React.ReactNode }[]; columns?: 1 | 2 | 3 }) {
  const cols = columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-1 gap-x-6 gap-y-0 ${cols}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 border-b border-[var(--bb-hairline)] py-2.5 last:border-b-0">
          <dt className="shrink-0 text-[13px] text-[var(--bb-mute)]">{item.label}</dt>
          <dd className="min-w-0 text-right text-[13px] font-semibold text-[var(--bb-ink)]">{item.value}</dd>
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
    <div className="border-b border-[var(--bb-hairline)] last:border-b-0">
      <button type="button" onClick={() => setOpen((prev) => !prev)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-4 py-3.5 text-left">
        <span className="text-[14px] font-semibold text-[var(--bb-ink)]">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          {meta}
          <CaretDown size={13} className={`text-[var(--bb-mute)] transition-transform ${open ? "rotate-180" : ""}`} />
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
