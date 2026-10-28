"use client";

/*
 * 스튜디오와 관리자가 같이 쓰는 라이트 콘솔 프리미티브. 토큰은 styles/eduon.css의 --eo-*.
 * 눌림 피드백은 배경 톤만 (design.md Motion). 배지는 고정 폭 64px, 가운데 정렬.
 */

import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ImageSquare, X } from "@phosphor-icons/react";
import { photoUrl } from "@/projects/platform/eduon/lib/mock-data";

export type Tone = "green" | "blue" | "orange" | "red" | "gray";

const TONE: Record<Tone, string> = {
  green: "bg-[var(--eo-green-bg)] text-[var(--eo-green-fg)]",
  blue: "bg-[var(--eo-blue-bg)] text-[var(--eo-blue-fg)]",
  orange: "bg-[var(--eo-orange-bg)] text-[var(--eo-orange-fg)]",
  red: "bg-[var(--eo-red-bg)] text-[var(--eo-red-fg)]",
  gray: "bg-[var(--eo-gray-bg)] text-[var(--eo-gray-fg)]",
};

/** 상태 칩. 글자 수와 무관하게 64px 고정 (사용자 지정) */
export function StatusBadge({ tone, children, wide = false }: { tone: Tone; children: ReactNode; wide?: boolean }) {
  return (
    <span
      className={`inline-flex h-[22px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] text-[12px] font-semibold leading-none ${
        wide ? "w-[88px]" : "w-[64px]"
      } ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}

export function Dot({ tone }: { tone: Tone }) {
  const bg = { green: "bg-[var(--eo-green)]", blue: "bg-[var(--eo-blue)]", orange: "bg-[var(--eo-orange)]", red: "bg-[var(--eo-red)]", gray: "bg-[var(--eo-gray)]" }[tone];
  return <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${bg}`} />;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BTN: Record<ButtonVariant, string> = {
  primary: "bg-[var(--eo-ink-btn)] text-white hover:bg-[#2c3442] active:bg-[#0c0f14]",
  secondary: "border border-[var(--eo-line-2)] bg-white text-[var(--eo-ink)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]",
  ghost: "text-[var(--eo-ink-2)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]",
  danger: "border border-[#efc4c4] bg-white text-[var(--eo-red-fg)] hover:bg-[var(--eo-red-bg)] active:bg-[#f6d3d3]",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "sm" | "md"; icon?: ReactNode }) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--eo-blue)] disabled:cursor-not-allowed disabled:opacity-45 ${
        size === "sm" ? "h-8 px-3 text-[12px]" : "h-9 px-3.5 text-[13px]"
      } ${BTN[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className = "",
}: {
  tabs: Array<{ key: T; label: string; count?: number }>;
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={`eo-scroll-x flex gap-5 overflow-x-auto border-b border-[var(--eo-line)] ${className}`}>
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(t.key)}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] transition-colors ${
              on ? "font-semibold text-[var(--eo-ink)]" : "font-medium text-[var(--eo-ink-3)] hover:text-[var(--eo-ink-2)]"
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className="text-[12px] font-medium text-[var(--eo-ink-3)]">{t.count}</span>}
            {on && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--eo-ink)]" />}
          </button>
        );
      })}
    </div>
  );
}

export function Field({ label, required, children, hint, error }: { label: string; required?: boolean; children: ReactNode; hint?: string; error?: string }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 flex items-center gap-1 text-[12px] font-medium text-[var(--eo-ink-2)]">
        {label}
        {required && <span className="text-[var(--eo-red)]">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[12px] text-[var(--eo-red-fg)]">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[12px] text-[var(--eo-ink-3)]">{hint}</span>
      ) : null}
    </label>
  );
}

export const inputCls =
  "h-9 w-full min-w-0 rounded-[8px] border border-[var(--eo-line-2)] bg-white px-3 text-[13px] text-[var(--eo-ink)] outline-none transition-colors placeholder:text-[var(--eo-ink-3)] focus:border-[var(--eo-ink-2)]";

export function Progress({ value, tone = "ink", className = "" }: { value: number; tone?: "ink" | "blue" | "green" | "orange" | "red" | "brand"; className?: string }) {
  const bar = {
    ink: "bg-[var(--eo-ink)]",
    blue: "bg-[var(--eo-blue)]",
    green: "bg-[var(--eo-green)]",
    orange: "bg-[var(--eo-orange)]",
    red: "bg-[var(--eo-red)]",
    brand: "bg-[var(--eo-brand)]",
  }[tone];
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-[var(--eo-soft-2)] ${className}`}>
      <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/** 강좌 썸네일. 사진이 없으면 글자 없이 빈 칸에 이미지 아이콘만 (사용자 지정, 2026-10-28) */
export function Thumb({ photo, title, className = "" }: { photo: number | string | null; title: string; className?: string }) {
  if (photo === null)
    return (
      <div role="img" aria-label={`${title} 썸네일 없음`} className={`flex aspect-video shrink-0 items-center justify-center rounded-[6px] bg-[var(--eo-soft-2)] text-[var(--eo-ink-3)] ${className}`}>
        <ImageSquare weight="regular" className="h-[38%] w-auto max-h-12" />
      </div>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photoUrl(photo, 320, 180)} alt="" className={`aspect-video shrink-0 rounded-[6px] object-cover ${className}`} />
  );
}


/** 우측 상세 패널. xl 이상은 표 옆 고정, 미만은 오버레이 슬라이드오버 (design.md 셸 레이아웃) */
export function DetailPanel({ open, onClose, title, meta, children, footer }: { open: boolean; onClose: () => void; title: ReactNode; meta?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <>
      <button type="button" aria-label="상세 닫기" onClick={onClose} className="eo-fade fixed inset-0 z-40 bg-[rgba(20,24,32,0.32)] xl:hidden" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[488px] flex-col border-l border-[var(--eo-line)] bg-white shadow-[var(--eo-pop-shadow)] [animation:eo-slide_200ms_var(--eo-ease)_both] xl:sticky xl:top-14 xl:z-0 xl:h-[calc(100dvh-56px)] xl:shadow-none">
        <style>{`@keyframes eo-slide{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}`}</style>
        <div className="flex items-start gap-3 border-b border-[var(--eo-line)] px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-semibold leading-[24px] text-[var(--eo-ink)]">{title}</div>
            {meta && <div className="mt-0.5 text-[12px] text-[var(--eo-ink-3)]">{meta}</div>}
          </div>
          <button type="button" onClick={onClose} aria-label="닫기" className="-mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[var(--eo-ink-3)] hover:bg-[var(--eo-soft)]">
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap items-center gap-2 border-t border-[var(--eo-line)] px-6 py-3">{footer}</div>}
      </aside>
    </>
  );
}

/** 짧은 토스트 */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div role="status" className="eo-rise fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-[10px] bg-[var(--eo-ink)] px-4 py-2.5 text-[13px] font-medium text-white shadow-[var(--eo-pop-shadow)]">
      {msg}
    </div>
  ) : null;
  return { show: setMsg, node };
}

/** 정의 목록 한 줄 (라벨 좌, 값 우) */
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <dt className="w-[96px] shrink-0 text-[12px] text-[var(--eo-ink-3)]">{label}</dt>
      <dd className="min-w-0 flex-1 text-[13px] text-[var(--eo-ink)]">{children}</dd>
    </div>
  );
}

/** 모달. 파괴적 행동과 확인 단계 */
export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label="닫기" onClick={onClose} className="eo-fade absolute inset-0 bg-[rgba(20,24,32,0.4)]" />
      <div role="dialog" aria-modal="true" className="eo-rise relative w-full max-w-[440px] rounded-[12px] bg-white p-6 shadow-[var(--eo-pop-shadow)]">
        <h2 className="text-[16px] font-semibold leading-[24px]">{title}</h2>
        <div className="mt-3 text-[13px] text-[var(--eo-ink-2)]">{children}</div>
        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}
