"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check, WarningCircle } from "@phosphor-icons/react";

/* 사용자 웹 프리미티브. 액션은 pill, 카드는 16, 입력 박스는 8 (design.md Shape). */

type Variant = "primary" | "secondary" | "ghost" | "dark";

const VARIANT: Record<Variant, string> = {
  primary: "bg-[var(--td-blue)] text-white hover:bg-[var(--td-blue-press)] disabled:bg-[#b9cfe8]",
  secondary: "border border-[var(--td-blue)] text-[var(--td-blue)] hover:bg-[var(--td-blue-tint)]",
  ghost: "text-[var(--td-ink-2)] hover:bg-[var(--td-parch)]",
  dark: "bg-[var(--td-ink)] text-white hover:bg-[#333336]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }) {
  const sz =
    size === "lg" ? "h-[52px] px-7 text-[17px]" : size === "sm" ? "h-9 px-4 text-[14px]" : "h-11 px-[22px] text-[15px]";
  return (
    <button
      type="button"
      className={`td-press inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--td-blue-focus)] focus-visible:ring-offset-2 ${sz} ${VARIANT[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  required,
  hint,
  error,
  ok,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  ok?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[14px] font-semibold text-[var(--td-ink)]">
        {label}
        {required && <span className="text-[var(--td-blue)]">*</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-[13px] text-[var(--td-stop-fg)]">
          <WarningCircle size={15} weight="fill" className="shrink-0" />
          {error}
        </span>
      ) : ok ? (
        <span className="mt-1.5 flex items-center gap-1 text-[13px] text-[var(--td-done-fg)]">
          <Check size={14} weight="bold" className="shrink-0" />
          {ok}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-[var(--td-ink-3)]">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextBox({
  value,
  placeholder,
  invalid,
  readOnly,
  mono,
  suffix,
}: {
  value?: string;
  placeholder?: string;
  invalid?: boolean;
  readOnly?: boolean;
  mono?: boolean;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`flex h-12 items-center gap-2 rounded-[8px] border px-4 text-[16px] ${
        invalid
          ? "border-[var(--td-stop-fg)] bg-white"
          : readOnly
            ? "border-transparent bg-[var(--td-parch)]"
            : "border-[var(--td-line)] bg-white focus-within:border-[var(--td-blue-focus)]"
      }`}
    >
      <input
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--td-ink-3)] ${mono ? "td-mono" : ""}`}
      />
      {suffix}
    </div>
  );
}

export function ChoiceChip({
  selected,
  children,
  onClick,
}: {
  selected?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`td-press inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[15px] ${
        selected
          ? "border-2 border-[var(--td-blue-focus)] bg-[var(--td-blue-tint)] px-[15px] font-semibold text-[var(--td-ink)]"
          : "border-[var(--td-line)] bg-white text-[var(--td-ink-2)] hover:border-[#c7c7cc]"
      }`}
    >
      {selected && <Check size={15} weight="bold" className="text-[var(--td-blue)]" />}
      {children}
    </button>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1160px] px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Monogram({ text, size = 48, className = "" }: { text: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#dde3ea] font-semibold text-[#3a4654] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {text}
    </span>
  );
}
