"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { Heart } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";

/* 시트와 모달이 열리면 셸이 하단 탭바 위에도 스크림을 덮는다. */
export const ScrimContext = createContext<(on: boolean) => void>(() => {});

export function useScrim(active: boolean) {
  const setScrim = useContext(ScrimContext);
  useEffect(() => {
    setScrim(active);
    return () => setScrim(false);
  }, [active, setScrim]);
}

/* 앱 전용 부품. 눌림은 translateY(1px) + 배경 톤(tf-press), 터치 타깃 44px 이상. */

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`tf-press flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--tf-brand)] text-[16px] font-semibold text-[var(--tf-on-brand)] active:bg-[var(--tf-brand-press)] disabled:cursor-not-allowed disabled:bg-[var(--tf-pressed)] disabled:text-[var(--tf-ink-3)] ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`tf-press flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-[var(--tf-line)] bg-[var(--tf-surface)] text-[16px] font-semibold text-[var(--tf-ink)] active:bg-[var(--tf-soft)] disabled:cursor-not-allowed disabled:text-[var(--tf-ink-3)] ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  error,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-[var(--tf-ink-2)]">
        {label}
        {required && <span className="text-[var(--tf-red-fg)]">*</span>}
      </span>
      <input
        value={value}
        type={type}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-[52px] w-full rounded-[12px] border bg-[var(--tf-surface)] px-4 text-[16px] text-[var(--tf-ink)] placeholder:text-[var(--tf-disabled)] ${
          error ? "border-[var(--tf-red)]" : "border-[var(--tf-line)]"
        }`}
      />
      {error && <span className="mt-1 block text-[13px] text-[var(--tf-red-fg)]">{error}</span>}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--tf-ink-2)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[52px] w-full rounded-[12px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-3.5 text-[16px] text-[var(--tf-ink)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
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
    <div role="tablist" className="flex h-11 rounded-[12px] bg-[var(--tf-soft)] p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-[9px] text-[15px] transition-colors ${
              active
                ? "bg-[var(--tf-surface)] font-semibold text-[var(--tf-ink)] shadow-[0_1px_2px_rgba(24,35,29,0.08)]"
                : "font-medium text-[var(--tf-ink-3)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function HeartButton({
  active,
  onToggle,
  name,
}: {
  active: boolean;
  onToggle: () => void;
  name: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={active ? `${name} 즐겨찾기 해제` : `${name} 즐겨찾기 추가`}
      aria-pressed={active}
      className="tf-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-[var(--tf-soft)]"
    >
      <Heart
        size={24}
        weight={active ? "fill" : "regular"}
        className={active ? "text-[var(--tf-red)]" : "text-[var(--tf-ink-3)]"}
      />
    </button>
  );
}

/* 하단에서 올라오는 시트. 부모(position: relative 화면 박스) 안에서 absolute로 깐다. */
export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useScrim(true);
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(24,35,29,0.4)]"
      />
      <div className="tf-rise relative max-h-[86%] w-full overflow-y-auto rounded-t-[20px] bg-[var(--tf-surface)] px-5 pb-[48px] pt-3 shadow-[var(--tf-sheet-shadow)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--tf-line)]" />
        <h2 className="mb-4 text-[20px] font-bold tracking-[-0.02em]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function EmptyLine({
  text,
  action,
  onAction,
}: {
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-5 py-14 text-center">
      <p className="text-[16px] text-[var(--tf-ink-2)]">{text}</p>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="tf-press h-11 rounded-[12px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-5 text-[15px] font-semibold active:bg-[var(--tf-soft)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* 상태바를 피하는 불투명 앱바. 공용 ScreenHeader에 이 프로젝트의 색과 타이포를 넘긴다. */
export function AppBar({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <ScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="border-[var(--tf-line)] bg-[var(--tf-surface)]"
      backButtonClassName="text-[var(--tf-ink)] active:bg-[var(--tf-soft)]"
      titleClassName="text-[17px] font-semibold tracking-[-0.01em] text-[var(--tf-ink)]"
      subtitleClassName="text-[13px] text-[var(--tf-ink-3)]"
    />
  );
}
