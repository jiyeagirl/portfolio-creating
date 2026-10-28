"use client";

import type { ReactNode } from "react";
import { CaretLeft, CaretRight, Check, X } from "@phosphor-icons/react";

/* 관리자 프리미티브. 버튼 radius 8 (디자인시스템 dark-utility), hover는 배경 톤만, 굵기 500 없음. */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--td-blue-focus)]";

type Variant = "primary" | "dark" | "secondary" | "ghost" | "danger";

const VARIANT: Record<Variant, string> = {
  primary: "bg-[var(--td-blue)] text-white hover:bg-[var(--td-blue-press)]",
  dark: "bg-[var(--td-ink)] text-white hover:bg-[#333336]",
  secondary: "border border-[var(--td-line)] bg-white text-[var(--td-ink)] hover:bg-[var(--td-parch)]",
  ghost: "text-[var(--td-ink-2)] hover:bg-[var(--td-parch)]",
  danger: "border border-[var(--td-line)] bg-white text-[var(--td-stop-fg)] hover:bg-[var(--td-stop-bg)]",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  onClick,
  disabled,
  className = "",
}: {
  variant?: Variant;
  size?: "sm" | "md";
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS} ${
        size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9 px-3.5 text-[13px]"
      } ${VARIANT[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function PageHeader({ title, meta, actions }: { title: string; meta?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="text-[21px] font-semibold leading-[28px] tracking-[-0.01em]">{title}</h1>
        {meta && <p className="mt-1 text-[13px] leading-[18px] text-[var(--td-ink-3)]">{meta}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** 한 줄 지표. 카드 없이 세로 헤어라인으로 구분한다 */
export function MetricStrip({
  items,
}: {
  items: { label: string; value: ReactNode; tone?: "act" | "stop" | "run"; sub?: ReactNode }[];
}) {
  const toneClass = { act: "text-[var(--td-act-fg)]", stop: "text-[var(--td-stop-fg)]", run: "text-[var(--td-run-fg)]" };
  return (
    <div className="grid grid-cols-2 border-y border-[var(--td-line)] sm:grid-cols-3 lg:flex">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`min-w-0 flex-1 px-4 py-3.5 first:pl-0 lg:border-l lg:border-[var(--td-line)] lg:first:border-l-0 ${
            i > 0 ? "" : ""
          }`}
        >
          <p className="whitespace-nowrap text-[12px] leading-4 text-[var(--td-ink-3)]">{it.label}</p>
          <p className={`mt-1.5 text-[22px] font-semibold leading-7 tabular-nums ${it.tone ? toneClass[it.tone] : ""}`}>
            {it.value}
          </p>
          {it.sub && <p className="mt-0.5 truncate text-[12px] leading-4 text-[var(--td-ink-3)]">{it.sub}</p>}
        </div>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  size = "md",
}: {
  items: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div role="tablist" className="td-scroll-x flex gap-5 overflow-x-auto border-b border-[var(--td-line)]">
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.id)}
            className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap pb-2.5 pt-1 ${size === "sm" ? "text-[13px]" : "text-[14px]"} ${
              active ? "font-semibold text-[var(--td-ink)]" : "text-[var(--td-ink-3)] hover:text-[var(--td-ink-2)]"
            }`}
          >
            {it.label}
            {it.count !== undefined && <span className="tabular-nums text-[12px] text-[var(--td-ink-3)]">{it.count}</span>}
            {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--td-ink)]" />}
          </button>
        );
      })}
    </div>
  );
}

/* 정렬 클래스를 덧붙이면 text-left와 충돌해 무시되므로 정렬별 상수를 따로 쓴다 */
const TH_BASE = "h-10 whitespace-nowrap px-3 text-[12px] font-semibold leading-4 text-[var(--td-ink-3)]";
export const TH = `${TH_BASE} text-left`;
export const TH_C = `${TH_BASE} text-center`;
export const TH_R = `${TH_BASE} text-right`;
export const TD = "px-3 py-3 align-middle text-[13px] leading-[18px]";
export const TR = "border-b border-[var(--td-line-soft)] transition-colors duration-150";

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border ${FOCUS} ${
        checked ? "border-[var(--td-ink)] bg-[var(--td-ink)] text-white" : "border-[#c7c7cc] bg-white"
      }`}
    >
      {checked && <Check size={12} weight="bold" />}
    </button>
  );
}

export function Pagination({
  from,
  to,
  total,
  page,
  pages,
  onPage,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-3 text-[12.5px] text-[var(--td-ink-3)]">
      <span className="tabular-nums">
        {from}–{to} / {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[var(--td-parch)] disabled:opacity-30"
        >
          <CaretLeft size={14} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            className={`h-8 min-w-8 rounded-[8px] px-2 tabular-nums ${
              p === page ? "bg-[var(--td-ink)] font-semibold text-white" : "hover:bg-[var(--td-parch)]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[var(--td-parch)] disabled:opacity-30"
        >
          <CaretRight size={14} />
        </button>
      </div>
    </div>
  );
}

/** 우측 상세 패널. xl 이상은 본문 안 고정 컬럼, 그 아래는 오버레이 슬라이드오버 */
export function SidePanel({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="패널 닫기"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label={label}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(440px,100%)] flex-col bg-white transition-transform duration-[220ms] [transition-timing-function:var(--td-panel-ease)] motion-reduce:transition-none xl:sticky xl:top-[76px] xl:z-auto xl:h-[calc(100dvh-100px)] xl:w-[440px] xl:shrink-0 xl:translate-x-0 xl:rounded-[16px] xl:border xl:border-[var(--td-line)] ${
          open ? "translate-x-0" : "translate-x-full xl:hidden"
        }`}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--td-ink-3)] hover:bg-[var(--td-parch)]"
        >
          <X size={16} />
        </button>
        {children}
      </aside>
    </>
  );
}

export function KV({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[112px_1fr] gap-3 py-2 text-[13px] leading-[18px]">
      <dt className="text-[var(--td-ink-3)]">{label}</dt>
      <dd className={`min-w-0 ${mono ? "td-mono text-[12.5px]" : ""}`}>{value}</dd>
    </div>
  );
}

export function BlockTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold leading-5">{children}</h2>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[16px] border border-[var(--td-line)] bg-white ${className}`}>{children}</section>;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/35" />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-[400px] rounded-[16px] border border-[var(--td-line)] bg-white p-6">
        <h3 className="text-[17px] font-semibold leading-6">{title}</h3>
        <div className="mt-2 text-[14px] leading-5 text-[var(--td-ink-2)]">{body}</div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-20 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-[10px] bg-[var(--td-ink)] px-4 py-3 text-[13px] text-white lg:bottom-6">
      <Check size={16} weight="bold" className="text-[#7fd08f]" />
      <span className="whitespace-nowrap">{message}</span>
      <button type="button" onClick={onClose} aria-label="닫기" className="text-[#a1a1a6] hover:text-white">
        <X size={14} />
      </button>
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 appearance-none rounded-[8px] border border-[var(--td-line)] bg-white pl-3 pr-8 text-[13px] text-[var(--td-ink)] ${FOCUS}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <CaretRight size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[var(--td-ink-3)]" />
    </label>
  );
}
