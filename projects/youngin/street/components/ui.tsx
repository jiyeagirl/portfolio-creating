"use client";

import type { CSSProperties, ReactNode } from "react";
import { Check } from "@phosphor-icons/react";

import { HAZARD_BY_KEY, STATUS_META } from "@/projects/youngin/street/lib/mock-data";
import { STATUS_ORDER } from "@/projects/youngin/street/lib/types";
import type { HazardType, ReportStatus } from "@/projects/youngin/street/lib/types";

/*
 * 이 프로젝트의 톤 어휘. radius 문법은 apple_compact을 그대로 따르고 섞지 않는다:
 * 5 오버레이 칩 / 8 유틸리티 버튼 / 11 인풋·사진·타일 / 18 카드·시트 / full 액션·칩·배지.
 * 그림자는 지도 위 부유 요소(--st-shadow-float)에만 쓰고 그 밖에는 쓰지 않는다.
 * 폰트 굵기는 300 / 400 / 600 / 700만 존재한다 (500 없음).
 */

/** 리스트 스태거 지연. Tailwind로 표현할 수 없어 CSS 변수로 넘긴다. */
export const staggerVar = (i: number) => ({ "--st-i": i }) as CSSProperties;

export function StatusBadge({ status, size = "md" }: { status: ReportStatus; size?: "sm" | "md" }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold ${
        size === "sm" ? "px-2 py-[3px] text-[11px] leading-[14px]" : "px-2.5 py-1 text-[12px] leading-[16px]"
      }`}
      style={{ color: meta.ink, background: meta.soft }}
    >
      <span className="h-[6px] w-[6px] rounded-full" style={{ background: meta.ink }} />
      {meta.label}
    </span>
  );
}

export function TypeBadge({ type, onDark = false }: { type: HazardType; onDark?: boolean }) {
  const meta = HAZARD_BY_KEY[type];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-[16px] ${
        onDark
          ? "bg-white/16 text-[var(--st-on-dark)]"
          : "bg-[var(--st-pearl)] text-[var(--st-ink-80)] ring-1 ring-inset ring-[var(--st-hairline)]"
      }`}
    >
      <Icon size={14} />
      {meta.label}
    </span>
  );
}

/** 가로 스크롤 필터 스트립 안의 칩. 선택 시 액센트로 채운다. */
export function FilterChip({
  children,
  selected,
  onClick,
  icon,
  floating = false,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  /** 지도 위에 떠 있는 스트립인지. 이 경우에만 그림자 토큰을 쓴다. */
  floating?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition-transform duration-200 active:scale-95 ${
        selected
          ? "bg-[var(--st-accent)] text-[var(--st-on-accent)]"
          : "bg-[var(--st-surface)] text-[var(--st-ink-80)] ring-1 ring-inset ring-[var(--st-hairline)]"
      }`}
      style={floating && !selected ? { boxShadow: "var(--st-shadow-float)" } : undefined}
    >
      {icon}
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  style,
  onClick,
  selected = false,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  selected?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "w-full rounded-[18px] border bg-[var(--st-surface)] text-left transition-[border-color,transform] duration-200";
  const state = selected
    ? "border-[var(--st-accent)]"
    : "border-[var(--st-hairline)]";

  if (!onClick) {
    return (
      <div className={`${base} ${state} ${className}`} style={style}>
        {children}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={selected}
      style={style}
      className={`${base} ${state} active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

export function SectionTitle({
  title,
  caption,
  right,
  className = "",
}: {
  title: string;
  caption?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3 flex items-end justify-between gap-3 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-[21px] font-semibold leading-[25px] tracking-[-0.3px] text-[var(--st-ink)]">
          {title}
        </h2>
        {caption && (
          <p className="mt-1 text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
            {caption}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

/** apple button-primary: pill, Action Blue, body 17/400, active scale(0.95). */
export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  icon,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--st-accent)] text-[17px] font-semibold tracking-[-0.374px] text-[var(--st-on-accent)] transition-transform duration-200 active:scale-95 disabled:bg-[var(--st-chip)] disabled:text-white"
    >
      {icon}
      {children}
    </button>
  );
}

/** apple button-secondary-pill: 투명 채움 + 액센트 1px 보더. */
export function SecondaryButton({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[var(--st-accent)] bg-transparent text-[17px] font-normal tracking-[-0.374px] text-[var(--st-accent)] transition-transform duration-200 active:scale-95"
    >
      {icon}
      {children}
    </button>
  );
}

/** apple button-dark-utility: 잉크 채움, radius 8, caption 14/400. 사진 위에서 쓴다. */
export function DarkUtilityButton({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--st-ink-surface)] px-[15px] py-2 text-[14px] font-normal tracking-[-0.224px] text-[var(--st-on-dark)] transition-transform duration-200 active:scale-95"
    >
      {icon}
      {children}
    </button>
  );
}

/** apple button-icon-circular: 44x44, full radius. 지도 위 컨트롤 전용이라 그림자를 쓴다. */
export function MapControlButton({
  children,
  onClick,
  label,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 active:scale-95 ${
        active
          ? "bg-[var(--st-accent)] text-[var(--st-on-accent)]"
          : "bg-[var(--st-surface)] text-[var(--st-ink)]"
      }`}
      style={{ boxShadow: "var(--st-shadow-float)" }}
    >
      {children}
    </button>
  );
}

/** iOS 그룹 리스트 블록. 흰 면 + 18 라운드 + 행 사이 연한 구분선. */
export function GroupList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-[var(--st-hairline)] bg-[var(--st-surface)] ${className}`}
    >
      {children}
    </div>
  );
}

export function GroupRow({
  label,
  value,
  sub,
  icon,
  onClick,
  right,
  last = false,
}: {
  label: string;
  value?: ReactNode;
  sub?: string;
  icon?: ReactNode;
  onClick?: () => void;
  right?: ReactNode;
  last?: boolean;
}) {
  const inner = (
    <div className={`flex min-h-[56px] items-center gap-3 px-4 py-3 ${last ? "" : "border-b border-[var(--st-divider)]"}`}>
      {icon && <span className="shrink-0 text-[var(--st-ink-48)]">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">{label}</p>
        {value !== undefined && (
          <p className="mt-0.5 text-[17px] font-normal leading-[25px] tracking-[-0.374px] text-[var(--st-ink)]">
            {value}
          </p>
        )}
        {sub && (
          <p className="mt-0.5 text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">{sub}</p>
        )}
      </div>
      {right}
    </div>
  );

  if (!onClick) return inner;
  return (
    <button type="button" onClick={onClick} className="w-full text-left transition-transform duration-200 active:scale-[0.98]">
      {inner}
    </button>
  );
}

/** 처리 상태 4단계 트래커. 완료 단계는 상태색, 미도달 단계는 헤어라인이다. */
export function StatusTrack({ status }: { status: ReportStatus }) {
  const current = STATUS_ORDER.indexOf(status);
  const ink = STATUS_META[status].ink;

  return (
    <div className="flex items-start">
      {STATUS_ORDER.map((s, i) => {
        const reached = i <= current;
        return (
          <div key={s} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                className="h-[2px] flex-1 rounded-full transition-[background] duration-300"
                style={{ background: i === 0 ? "transparent" : reached ? ink : "var(--st-hairline)" }}
              />
              {/* 지금 단계만 소프트 톤 링을 둘러 "여기까지 왔다"를 한눈에 읽히게 한다.
                  접수 완료 단계의 잉크가 회색이라 링이 없으면 비활성처럼 보인다. */}
              <span
                className="flex h-[22px] w-[22px] items-center justify-center rounded-full transition-colors duration-300"
                style={{
                  background: reached ? ink : "var(--st-hairline)",
                  boxShadow: i === current ? `0 0 0 4px ${STATUS_META[status].soft}` : undefined,
                }}
              >
                {i < current ? (
                  <Check size={12} weight="bold" color="#ffffff" />
                ) : (
                  <span className="h-[7px] w-[7px] rounded-full bg-white" />
                )}
              </span>
              <span
                className="h-[2px] flex-1 rounded-full transition-[background] duration-300"
                style={{
                  background:
                    i === STATUS_ORDER.length - 1
                      ? "transparent"
                      : i < current
                        ? ink
                        : "var(--st-hairline)",
                }}
              />
            </div>
            <p
              className="mt-2 text-center text-[11px] font-semibold leading-[14px]"
              style={{ color: reached ? "var(--st-ink)" : "var(--st-ink-48)" }}
            >
              {STATUS_META[s].label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** 동의 항목의 체크박스. apple에는 체크박스 스펙이 없어 액센트 원형으로 만든다. */
export function CheckRow({
  checked,
  onChange,
  title,
  required = false,
  detail,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  required?: boolean;
  detail?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 py-2.5 text-left"
    >
      <span
        className={`mt-[1px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
          checked ? "bg-[var(--st-accent)]" : "border border-[var(--st-chip)] bg-transparent"
        }`}
      >
        <Check size={13} weight="bold" color={checked ? "#ffffff" : "var(--st-chip)"} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink)]">
          <span className={required ? "text-[var(--st-accent)]" : "text-[var(--st-ink-48)]"}>
            {required ? "[필수] " : "[선택] "}
          </span>
          {title}
        </span>
        {detail && (
          <span className="mt-0.5 block text-[12px] leading-[16px] text-[var(--st-ink-48)]">{detail}</span>
        )}
      </span>
    </button>
  );
}

/** 하단 고정 액션 바. 기기 프레임 하단에 붙으므로 backdrop-blur 없이 불투명 서페이스만 쓴다. */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--st-hairline)] bg-[var(--st-surface)] px-5 pb-9 pt-3.5">
      {children}
    </div>
  );
}

/** 하단 탭바. 마찬가지로 불투명이고 화면 박스 안쪽 absolute다. */
export function TabBar({
  items,
  active,
  onSelect,
}: {
  items: { key: string; label: string; icon: ReactNode; activeIcon: ReactNode }[];
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--st-hairline)] bg-[var(--st-surface)] pb-[34px] pt-1.5">
      <ul className="flex">
        {items.map((item) => {
          const on = item.key === active;
          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(item.key)}
                aria-current={on ? "page" : undefined}
                className="flex h-[49px] w-full flex-col items-center justify-center gap-[3px] transition-transform duration-200 active:scale-95"
                style={{ color: on ? "var(--st-accent)" : "var(--st-ink-48)" }}
              >
                {on ? item.activeIcon : item.icon}
                <span className="text-[11px] font-semibold leading-[13px]">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function StatTile({
  label,
  value,
  unit,
  tone = "var(--st-ink)",
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: string;
}) {
  return (
    <div className="flex-1">
      <p className="text-[12px] font-semibold leading-[16px] text-[var(--st-ink-48)]">{label}</p>
      <p className="st-num mt-1 text-[24px] font-semibold leading-[28px] tracking-[-0.4px]" style={{ color: tone }}>
        {value}
        {unit && <span className="ml-0.5 text-[13px] font-normal text-[var(--st-ink-48)]">{unit}</span>}
      </p>
    </div>
  );
}
