"use client";

import type { ReactNode } from "react";
import { Toggle as SharedToggle } from "@/components/shared/toggle";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";

/* habitkong 공통 프리미티브.
   팔레트는 minimalist-ui 규격을 그대로 쓴다.
   ink #17140F / body #4A443C / muted #8A8377 / faint #B5AEA4
   border #EAEAEA / surface #F7F6F3 / white
   pastel: red #FDEBEC·#9F2F2D, blue #E1F3FE·#1F6C9F, green #EDF3EC·#346538, yellow #FBF3DB·#956400 */

export type Tone = "neutral" | "blue" | "green" | "yellow" | "red";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[#F7F6F3] text-[#8A8377]",
  blue: "bg-[#E1F3FE] text-[#1F6C9F]",
  green: "bg-[#EDF3EC] text-[#346538]",
  yellow: "bg-[#FBF3DB] text-[#956400]",
  red: "bg-[#FDEBEC] text-[#9F2F2D]",
};

export function Tag({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.02em] ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  as = "div",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "button";
  onClick?: () => void;
}) {
  const base = `rounded-[12px] border border-[#EAEAEA] bg-white ${className}`;
  if (as === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} text-left transition-transform active:scale-[0.98]`}
      >
        {children}
      </button>
    );
  }
  return <div className={base}>{children}</div>;
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[13.5px] font-semibold text-[#17140F]">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-[11.5px] font-medium text-[#8A8377] transition-colors hover:text-[#17140F]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/** 뒤로가기가 있는 화면용 헤더. 탭 화면은 자체 제목을 쓴다. */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <SharedScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="bg-white border-[#EAEAEA]"
      backButtonClassName="text-[#17140F] hover:bg-[#F7F6F3]"
      titleClassName="text-[15.5px] font-semibold text-[#17140F]"
      subtitleClassName="text-[11px] text-[#8A8377]"
    />
  );
}

export function ProgressBar({
  value,
  tone = "ink",
  height = 6,
}: {
  /** 0 ~ 1 */
  value: number;
  tone?: "ink" | "muted";
  height?: number;
}) {
  return (
    <span
      className="block w-full overflow-hidden rounded-full bg-[#F0EEE9]"
      style={{ height }}
      role="presentation"
    >
      <span
        className={`block h-full rounded-full ${tone === "ink" ? "bg-[#17140F]" : "bg-[#C9C0B8]"}`}
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </span>
  );
}

export function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-[#EAEAEA] bg-white px-3 py-3">
      <span className="text-[#8A8377]">{icon}</span>
      <div>
        <p className="text-[13px] font-bold tabular-nums text-[#17140F]">{value}</p>
        <p className="text-[10.5px] text-[#8A8377]">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] tabular-nums text-[#B5AEA4]">{sub}</p>}
      </div>
    </div>
  );
}

/** 값 하나짜리 세로 막대 차트. 계열이 하나라 범례 없이 제목으로 설명한다. */
export function BarChart({
  data,
  max = 100,
  height = 96,
  highlight,
  unit = "",
}: {
  data: { label: string; value: number }[];
  max?: number;
  height?: number;
  highlight?: string;
  unit?: string;
}) {
  const peak = Math.max(...data.map((d) => d.value));
  return (
    <div>
      <div className="flex items-stretch gap-[3px]" style={{ height }}>
        {data.map((item) => {
          const active = highlight ? item.label === highlight : item.value === peak;
          return (
            <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-1.5">
              <span className="h-3.5 text-center text-[9.5px] font-semibold tabular-nums text-[#17140F]">
                {active ? `${item.value}${unit}` : ""}
              </span>
              <span
                title={`${item.label} ${item.value}${unit}`}
                className={`w-full rounded-t-[4px] ${active ? "bg-[#17140F]" : "bg-[#EAEAEA]"}`}
                style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-[3px]">
        {data.map((item) => (
          <span
            key={item.label}
            className={`flex-1 text-center text-[10px] font-medium ${
              (highlight ? item.label === highlight : item.value === peak)
                ? "text-[#17140F]"
                : "text-[#B5AEA4]"
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <SharedToggle
      checked={on}
      onChange={() => onChange()}
      label={label}
      size="md"
      onClassName="bg-[#17140F]"
      offClassName="bg-[#EAEAEA]"
    />
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-[8px] bg-[#F7F6F3] p-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={`flex-1 rounded-[6px] py-1.5 text-[12px] font-semibold transition-colors ${
            value === option.key ? "bg-white text-[#17140F] shadow-[0_1px_2px_rgba(23,20,15,0.04)]" : "text-[#8A8377]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ListRow({
  label,
  detail,
  right,
  onClick,
}: {
  label: string;
  detail?: string;
  right?: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-[#17140F]">{label}</span>
        {detail && <span className="mt-0.5 block text-[11.5px] text-[#8A8377]">{detail}</span>}
      </span>
      {right}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#FBFBFA]"
      >
        {content}
      </button>
    );
  }
  return <div className="flex items-center gap-3 px-4 py-3.5">{content}</div>;
}
