"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import type { OrderStatus } from "@/projects/b2b/partloop/lib/types";

/* ---------- 면 구분: full-bleed 타일의 색 전환이 섹션 구분선이다 ---------- */

const CONTAINER = "mx-auto w-full max-w-[1152px] px-4 sm:px-8";

/* 파치먼트 색 머리 타일. 페이지 제목과 요약이 놓인다. */
export function PageBand({ children }: { children: ReactNode }) {
  return (
    <section className="bg-[var(--pl-parchment)]">
      <div className={`${CONTAINER} py-8 sm:py-10`}>{children}</div>
    </section>
  );
}

/* 흰색 본문 타일. */
export function PageBody({ children }: { children: ReactNode }) {
  return <div className={`${CONTAINER} py-8 sm:py-10`}>{children}</div>;
}

/* ---------- 버튼: 액션은 pill, 유틸리티 아이콘은 원형 ---------- */

type ButtonVariant = "primary" | "secondary" | "icon" | "link";

const BUTTON_BASE =
  "pl-press inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap text-[14px] transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    "h-11 rounded-full bg-[var(--pl-primary)] px-[22px] text-[var(--pl-on-primary)] hover:bg-[var(--pl-primary-focus)]",
  secondary:
    "h-11 rounded-full border border-[var(--pl-primary)] px-[22px] text-[var(--pl-primary)] hover:bg-[var(--pl-parchment)]",
  icon: "h-11 w-11 rounded-full bg-[color-mix(in_srgb,var(--pl-hairline-strong)_64%,transparent)] text-[var(--pl-ink)] hover:bg-[var(--pl-hairline-strong)]",
  link: "text-[var(--pl-primary)] hover:underline",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={`${BUTTON_BASE} ${BUTTON_VARIANT[variant]} ${className}`} {...rest} />;
}

/* ---------- 상태 배지: 5단계 톤 구조를 프로젝트 안에서 고정한다 ---------- */

const STATUS_TONE: Record<OrderStatus, { bg: string; fg: string }> = {
  "승인 대기": { bg: "var(--pl-wait-bg)", fg: "var(--pl-wait-fg)" },
  "수락 대기": { bg: "var(--pl-neutral-bg)", fg: "var(--pl-neutral-fg)" },
  "진행 중": { bg: "var(--pl-progress-bg)", fg: "var(--pl-progress-fg)" },
  지연: { bg: "var(--pl-action-bg)", fg: "var(--pl-action-fg)" },
  "납품 완료": { bg: "var(--pl-done-bg)", fg: "var(--pl-done-fg)" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold leading-[18px]"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {status}
    </span>
  );
}

/* ---------- 폼: 입력은 pill, 여러 줄 입력만 카드 반경 ---------- */

export const inputClass =
  "h-11 w-full rounded-full border border-[rgba(0,0,0,0.08)] bg-[var(--pl-paper)] px-5 text-[14px] text-[var(--pl-ink)] placeholder:text-[var(--pl-mute)] transition-colors hover:border-[var(--pl-hairline-strong)] focus-visible:border-[var(--pl-primary-focus)] aria-[invalid=true]:border-[var(--pl-action-fg)]";

/* 브라우저 기본 화살표 대신 Phosphor CaretDown을 얹는다. select에는 selectClass를 준다. */
export const selectClass = `${inputClass} appearance-none pr-11`;

export function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <CaretDown
        size={14}
        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[var(--pl-mute)]"
      />
    </div>
  );
}

export function Field({
  label,
  required,
  error,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold">
        {label}
        {required && <span className="text-[12px] font-normal text-[var(--pl-mute)]">필수</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[12px] text-[var(--pl-action-fg)]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- 페이지 머리: 좌측 제목과 한 줄 메타, 우측은 액션 버튼만 ---------- */

export function PageHeader({
  title,
  badge,
  meta,
  actions,
}: {
  title: string;
  badge?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="pl-num text-[34px] font-semibold leading-[40px] tracking-[-0.011em]">{title}</h1>
          {badge}
        </div>
        {meta && <p className="mt-1 text-[14px] text-[var(--pl-mute)]">{meta}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- 한 줄 지표: 카드 없이 세로 헤어라인으로 나눈다 ---------- */

export type Metric = { label: string; value: string; tone?: "alert" };

export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="grid grid-cols-2 border-t border-[var(--pl-hairline-strong)] lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`min-w-0 py-5 pr-4 lg:border-l lg:border-t-0 lg:border-[var(--pl-hairline-strong)] lg:pl-6 lg:first:border-l-0 lg:first:pl-0 ${
            index % 2 === 1 ? "border-l border-[var(--pl-hairline-strong)] pl-6" : ""
          } ${index >= 2 ? "border-t border-[var(--pl-hairline-strong)]" : ""}`}
        >
          <dt className="truncate text-[12px] text-[var(--pl-mute)]">{metric.label}</dt>
          <dd
            className="pl-num mt-1 text-[34px] font-semibold leading-[40px]"
            style={metric.tone === "alert" ? { color: "var(--pl-action-fg)" } : undefined}
          >
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- 빈 상태: 한 줄 문구와 주 액션 ---------- */

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-[14px] text-[var(--pl-mute)]">{message}</p>
      {action}
    </div>
  );
}
