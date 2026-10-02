"use client";

/* CIVICPIN 모바일 프리미티브. 색은 전부 styles/civicpin.css 의 --cp-* 토큰을 참조하고
   여기서 새 색을 만들지 않는다. 반경 스케일은 16px(카드) / 12px(타일) / 10px(작은 태그) /
   full(칩, 배지) 네 단계만 쓴다. */

import type { ReactNode } from "react";
import {
  Armchair,
  Basket,
  CaretRight,
  Coffee,
  ForkKnife,
  Heartbeat,
  Info,
  PencilSimple,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Storefront,
  Toilet,
  FirstAidKit,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { FacilityType, StoreCategory } from "@/projects/youngin/real/lib/types";

export type PhosphorIcon = Icon;

/* ── 분류 토큰 ── */

export const FACILITY_TONE: Record<
  FacilityType,
  { fg: string; bg: string; icon: PhosphorIcon; short: string }
> = {
  AED: { fg: "var(--cp-aed)", bg: "var(--cp-aed-soft)", icon: Heartbeat, short: "AED" },
  대피소: { fg: "var(--cp-shelter)", bg: "var(--cp-shelter-soft)", icon: ShieldCheck, short: "대피소" },
  쉼터: { fg: "var(--cp-rest)", bg: "var(--cp-rest-soft)", icon: Armchair, short: "쉼터" },
  화장실: { fg: "var(--cp-toilet)", bg: "var(--cp-toilet-soft)", icon: Toilet, short: "화장실" },
};

export const STORE_ICON: Record<StoreCategory, PhosphorIcon> = {
  음식: ForkKnife,
  카페: Coffee,
  농수산: Basket,
  생활: ShoppingBag,
  미용: Scissors,
  의료: FirstAidKit,
  교육: PencilSimple,
};

/* ── Badge ── */

export type Tone = "neutral" | "accent" | "ok" | "warn" | "danger" | "line";

const BADGE_TONE: Record<Tone, string> = {
  neutral: "bg-[var(--cp-sunken)] text-[var(--cp-body)]",
  accent: "bg-[var(--cp-accent-soft)] text-[var(--cp-accent)]",
  ok: "bg-[var(--cp-ok-soft)] text-[var(--cp-ok)]",
  warn: "bg-[var(--cp-warn-soft)] text-[var(--cp-warn)]",
  danger: "bg-[var(--cp-danger-soft)] text-[var(--cp-danger)]",
  line: "border border-[var(--cp-hairline-strong)] text-[var(--cp-body)]",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-[11px] font-semibold leading-[14px] ${BADGE_TONE[tone]}`}
    >
      {dot && <span className="inline-block h-[5px] w-[5px] rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** 온누리상품권 가맹 배지. 상권 화면 전체에서 같은 형태로만 등장한다. */
export function OnnuriBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[6px] bg-[var(--cp-accent-soft)] px-1.5 py-[3px] text-[11px] font-semibold leading-[14px] text-[var(--cp-accent)]">
      <Storefront size={12} weight="fill" />
      {compact ? "온누리" : "온누리 가맹"}
    </span>
  );
}

/* ── 아이콘 타일 ── */

export function IconTile({
  icon: Icon,
  fg,
  bg,
  size = 40,
  radius = 12,
}: {
  icon: PhosphorIcon;
  fg: string;
  bg: string;
  size?: number;
  radius?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, borderRadius: radius, background: bg, color: fg }}
    >
      <Icon size={Math.round(size * 0.5)} weight="fill" />
    </span>
  );
}

export function FacilityIcon({ type, size = 40 }: { type: FacilityType; size?: number }) {
  const tone = FACILITY_TONE[type];
  return <IconTile icon={tone.icon} fg={tone.fg} bg={tone.bg} size={size} />;
}

export function StoreIcon({ category, size = 40 }: { category: StoreCategory; size?: number }) {
  return (
    <IconTile
      icon={STORE_ICON[category]}
      fg="var(--cp-body)"
      bg="var(--cp-sunken)"
      size={size}
    />
  );
}

/* ── 컨테이너 ── */

export function Card({
  children,
  className = "",
  padded = true,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const base = `rounded-2xl bg-[var(--cp-surface)] shadow-[var(--cp-shadow)] ${
    padded ? "p-4" : ""
  } ${className}`;
  if (!onClick) return <section className={base}>{children}</section>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} w-full text-left transition-transform active:scale-[0.985]`}
    >
      {children}
    </button>
  );
}

export function SectionHead({
  title,
  desc,
  actionLabel,
  onAction,
}: {
  title: string;
  desc?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[19px] font-bold leading-6 tracking-[-0.02em] text-[var(--cp-ink)]">
          {title}
        </h2>
        {desc && <p className="mt-1 text-[12.5px] leading-[18px] text-[var(--cp-mute)]">{desc}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex shrink-0 items-center gap-0.5 pb-0.5 text-[12.5px] font-semibold text-[var(--cp-accent)]"
        >
          {actionLabel}
          <CaretRight size={12} weight="bold" />
        </button>
      )}
    </header>
  );
}

/* ── 컨트롤 ── */

export function FilterChip({
  label,
  count,
  active,
  onClick,
  icon: Icon,
  tone,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  icon?: PhosphorIcon;
  tone?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
        active
          ? "border-[var(--cp-accent)] bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
          : "border-[var(--cp-hairline)] bg-[var(--cp-surface)] text-[var(--cp-body)]"
      }`}
    >
      {Icon && (
        <span style={active ? undefined : { color: tone }} className="flex items-center">
          <Icon size={14} weight="fill" />
        </span>
      )}
      {label}
      {count !== undefined && (
        <span
          className={`cp-num text-[12px] font-bold ${
            active ? "text-[var(--cp-on-accent)]/80" : "text-[var(--cp-faint)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[var(--cp-accent)] px-6 text-[16px] font-bold text-[var(--cp-on-accent)] transition-transform active:scale-[0.98] ${
        full ? "w-full" : ""
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({
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
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-3.5 text-[13px] font-semibold text-[var(--cp-body)] transition-colors active:bg-[var(--cp-sunken)]"
    >
      {icon}
      {children}
    </button>
  );
}

/* ── 표시 요소 ── */

/** 이질적인 메타 필드를 한 줄로 잇는다. 중간점 대신 파이프를 쓴다(CLAUDE.md 타이포 규칙). */
export function MetaLine({ items, className = "" }: { items: (string | undefined)[]; className?: string }) {
  const shown = items.filter(Boolean) as string[];
  return (
    <p className={`cp-num truncate text-[12.5px] leading-[18px] text-[var(--cp-mute)] ${className}`}>
      {shown.join(" | ")}
    </p>
  );
}

export function Notice({
  children,
  tone = "accent",
  icon,
  onDismiss,
}: {
  children: ReactNode;
  tone?: "accent" | "warn" | "ok";
  icon?: ReactNode;
  onDismiss?: () => void;
}) {
  const map = {
    accent: "bg-[var(--cp-accent-soft)] text-[var(--cp-accent)]",
    warn: "bg-[var(--cp-warn-soft)] text-[var(--cp-warn)]",
    ok: "bg-[var(--cp-ok-soft)] text-[var(--cp-ok)]",
  } as const;
  return (
    <div className={`flex items-start gap-2 rounded-[12px] px-3 py-2.5 ${map[tone]}`}>
      <span className="mt-[1px] shrink-0">{icon ?? <Info size={15} weight="fill" />}</span>
      <p className="min-w-0 flex-1 text-[12.5px] font-medium leading-[18px]">{children}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="안내 닫기"
          className="-mr-1 -mt-0.5 shrink-0 px-1 text-[16px] leading-none opacity-60"
        >
          ×
        </button>
      )}
    </div>
  );
}

/** 업종 비중 그래프. 액센트 단일 색조의 명도 단계만 쓴다. */
export function MixBar({ data }: { data: { label: string; ratio: number }[] }) {
  const ramp = [
    "var(--cp-chart-1)",
    "var(--cp-chart-2)",
    "var(--cp-chart-3)",
    "var(--cp-chart-4)",
    "var(--cp-chart-5)",
    "var(--cp-chart-rest)",
  ];
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {data.map((d, i) => (
          <span
            key={d.label}
            style={{ width: `${d.ratio}%`, background: ramp[Math.min(i, ramp.length - 1)] }}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-[3px]"
              style={{ background: ramp[Math.min(i, ramp.length - 1)] }}
            />
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--cp-body)]">
              {d.label}
            </span>
            <span className="cp-num shrink-0 text-[12.5px] font-semibold text-[var(--cp-ink)]">
              {d.ratio}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--cp-hairline-strong)] px-6 py-10 text-center">
      <p className="text-[14px] font-semibold text-[var(--cp-body)]">{title}</p>
      <p className="mt-1.5 text-[12.5px] leading-[18px] text-[var(--cp-mute)]">{desc}</p>
    </div>
  );
}

/** 시트 상단 그랩 핸들 */
export function SheetHandle() {
  return (
    <div className="flex justify-center py-2">
      <span className="h-1 w-9 rounded-full bg-[var(--cp-hairline-strong)]" />
    </div>
  );
}

/** QR 스캔 지점 안내 스트립. 모든 화면 상단에서 기준점을 반복해 알려준다. */
export function QrContextStrip({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--cp-accent-soft)] px-4 py-2">
      <span className="cp-num shrink-0 rounded-[6px] bg-[var(--cp-accent)] px-1.5 py-[2px] text-[10.5px] font-bold tracking-[0.02em] text-[var(--cp-on-accent)]">
        {code}
      </span>
      <p className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-[var(--cp-accent)]">
        스캔 지점 기준 안내 / {label}
      </p>
    </div>
  );
}
