"use client";

import { useEffect, type ReactNode } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import type { Confidence, QuoteStatus } from "@/projects/platform/drawqty/lib/types";

/* 사용자 화면 부품. 패널 12px, 버튼과 입력 8px, 칩 6px. 눌림은 scale(0.98). */

type ButtonKind = "primary" | "ghost" | "text";

export function Button({
  children,
  onClick,
  kind = "primary",
  disabled,
  type = "button",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: ButtonKind;
  disabled?: boolean;
  type?: "button" | "submit";
  size?: "md" | "sm";
  className?: string;
}) {
  const dims = size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-[14px]";
  const base = `dq-press inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-semibold disabled:cursor-not-allowed ${dims}`;
  const tone =
    kind === "primary"
      ? "bg-[var(--dq-brand)] text-[var(--dq-on-brand)] hover:bg-[var(--dq-brand-press)] disabled:bg-[var(--dq-soft-2)] disabled:text-[var(--dq-disabled)]"
      : kind === "ghost"
        ? "border border-[var(--dq-line-strong)] bg-[var(--dq-surface)] text-[var(--dq-ink)] hover:bg-[var(--dq-soft)] disabled:text-[var(--dq-disabled)]"
        : "!px-2 text-[var(--dq-ink-2)] hover:text-[var(--dq-ink)] disabled:text-[var(--dq-disabled)]";
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${tone} ${className}`}>
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  inputMode,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal";
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-[var(--dq-ink-2)]">
        {label}
        {required && <span className="text-[var(--dq-red-fg)]">*</span>}
      </span>
      <input
        value={value}
        type={type}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-[8px] border bg-[var(--dq-surface)] px-3.5 text-[14px] text-[var(--dq-ink)] placeholder:text-[var(--dq-disabled)] ${
          error ? "border-[var(--dq-red)]" : "border-[var(--dq-line-strong)]"
        }`}
      />
      {error && <span className="mt-1 block text-[12px] text-[var(--dq-red-fg)]">{error}</span>}
    </label>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex min-h-[44px] w-full items-center gap-3 text-left"
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border ${
            checked
              ? "border-[var(--dq-brand)] bg-[var(--dq-brand)] text-white"
              : "border-[var(--dq-line-strong)] bg-[var(--dq-surface)] text-transparent"
          }`}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
            <path d="M2.5 6.5l2.2 2.2L9.5 3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1 text-[14px] text-[var(--dq-ink)]">{children}</span>
      </button>
      {error && <span className="block text-[12px] text-[var(--dq-red-fg)]">{error}</span>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-[8px] bg-[var(--dq-soft-2)] p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`h-9 min-w-[52px] whitespace-nowrap rounded-[6px] px-3.5 text-[13px] transition-colors ${
              active
                ? "bg-[var(--dq-surface)] font-semibold text-[var(--dq-ink)] shadow-[0_1px_2px_rgba(22,32,43,0.1)]"
                : "font-medium text-[var(--dq-ink-3)] hover:text-[var(--dq-ink)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const CONF_TONE: Record<Confidence, string> = {
  높음: "bg-[var(--dq-green-bg)] text-[var(--dq-green-fg)]",
  "확인 필요": "bg-[var(--dq-orange-bg)] text-[var(--dq-orange-fg)]",
  "수동 수정됨": "bg-[var(--dq-blue-bg)] text-[var(--dq-blue-fg)]",
};

/* 칩은 글자 수와 무관하게 고정 크기, 글자 가운데 정렬 */
export function ConfidenceChip({ value }: { value: Confidence }) {
  return (
    <span
      className={`inline-flex h-6 w-[76px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] text-[12px] font-semibold ${CONF_TONE[value]}`}
    >
      {value}
    </span>
  );
}

const STATUS_TONE: Record<QuoteStatus, string> = {
  신규: "bg-[var(--dq-blue-bg)] text-[var(--dq-blue-fg)]",
  "검토 중": "bg-[var(--dq-orange-bg)] text-[var(--dq-orange-fg)]",
  "견적 발송": "bg-[var(--dq-green-bg)] text-[var(--dq-green-fg)]",
};

export function StatusChip({ value }: { value: QuoteStatus }) {
  return (
    <span
      className={`inline-flex h-6 w-[68px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] text-[12px] font-semibold ${STATUS_TONE[value]}`}
    >
      {value}
    </span>
  );
}

export const CONFIDENCE_COLOR: Record<Confidence, string> = {
  높음: "var(--dq-green)",
  "확인 필요": "var(--dq-orange)",
  "수동 수정됨": "var(--dq-blue)",
};

export const APPROX_NOTICE = "개략 물량 산출용이며 정밀 구조계산 결과가 아니에요";

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      role="status"
      className="dq-toast fixed inset-x-4 bottom-24 z-50 mx-auto flex w-fit max-w-[calc(100%-32px)] items-center gap-2 rounded-[10px] bg-[var(--dq-ink)] px-4 py-3 text-[14px] font-medium text-white shadow-[var(--dq-pop-shadow)]"
    >
      <CheckCircle size={20} weight="fill" className="shrink-0 text-[#7fd1a0]" />
      <span className="min-w-0">{message}</span>
    </div>
  );
}
