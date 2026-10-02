"use client";

/**
 * 용인 아이놀이터 모바일 프리미티브.
 * 색은 전부 styles/child.css 의 --yc-* 토큰만 참조하고 여기서 새 색을 만들지 않는다.
 * 반경 문법: 칩 full / 작은 타일 12 / 카드 16 / 히어로 카드 20.
 */

import Image from "next/image";
import { Balloon, BookOpen, Cube, SwimmingPool, Tree } from "@phosphor-icons/react";
import type { FacilityCategory } from "@/projects/youngin/child/lib/types";
import { CATEGORY_LABEL } from "@/projects/youngin/child/lib/navigation";

const CATEGORY_ICON: Record<
  FacilityCategory,
  React.ComponentType<{ size?: number; weight?: "bold" | "fill" | "duotone" }>
> = {
  forest: Tree,
  playground: Balloon,
  library: BookOpen,
  toyLibrary: Cube,
  waterPlay: SwimmingPool,
};

/* ── Section head ── */

export function SectionHead({
  title,
  desc,
  trailing,
}: {
  title: string;
  desc?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <header className="mb-3 flex items-end justify-between gap-3 px-5">
      <div className="min-w-0">
        <h2 className="text-[17px] font-bold leading-6 tracking-[-0.02em] text-[var(--yc-ink)]">
          {title}
        </h2>
        {desc && <p className="mt-1 text-[12.5px] leading-4 text-[var(--yc-mute)]">{desc}</p>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </header>
  );
}

/* ── Chip ── */

export function Chip({
  children,
  tone = "soft",
  icon,
}: {
  children: React.ReactNode;
  tone?: "soft" | "accent" | "stamp" | "lock" | "outline";
  icon?: React.ReactNode;
}) {
  const tones = {
    soft: "bg-[var(--yc-surface-soft)] text-[var(--yc-body)]",
    accent: "bg-[var(--yc-accent-soft)] text-[var(--yc-accent-deep)]",
    stamp: "bg-[var(--yc-stamp-soft)] text-[var(--yc-stamp)]",
    lock: "bg-[var(--yc-lock-soft)] text-[var(--yc-lock)]",
    outline: "border border-[var(--yc-hairline)] text-[var(--yc-body)]",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold leading-4 ${tones[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

/* ── Progress ── */

export function Progress({
  value,
  tone = "accent",
  height = 6,
}: {
  /** 0 - 100 */
  value: number;
  tone?: "accent" | "onAccent" | "stamp";
  height?: number;
}) {
  const track =
    tone === "onAccent" ? "rgba(255,255,255,0.24)" : "var(--yc-surface-soft)";
  const fill =
    tone === "onAccent"
      ? "#ffffff"
      : tone === "stamp"
        ? "var(--yc-stamp)"
        : "var(--yc-accent)";
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height, background: track }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: fill }}
      />
    </div>
  );
}

/* ── Facility thumbnail ──
 * 사진이 있으면 사진, 없으면 카테고리 글리프 타일.
 * 장난감도서관과 물놀이장은 내용이 맞는 사진이 없어 의도적으로 글리프를 쓴다. */

export function FacilityThumb({
  category,
  photo,
  name,
  width,
  height,
  radius = 12,
  className = "",
}: {
  category: FacilityCategory;
  photo?: number;
  name: string;
  width: number;
  height: number;
  radius?: number;
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[var(--yc-surface-soft)] ${className}`}
      style={{ width, height, borderRadius: radius }}
    >
      {photo !== undefined ? (
        <Image
          src={`https://picsum.photos/id/${photo}/${width * 2}/${height * 2}`}
          alt={`${name} 시설 사진`}
          width={width}
          height={height}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex flex-col items-center gap-1 text-[var(--yc-lock)]">
          <Icon size={Math.min(28, Math.round(width * 0.28))} weight="duotone" />
          <span className="text-[10px] font-semibold leading-3">{CATEGORY_LABEL[category]}</span>
        </span>
      )}
    </span>
  );
}

/* ── Stamp mark ──
 * 실제 고무도장처럼 두꺼운 원형 테두리 + 미세한 회전. 획득 전에는 점선 빈 자리. */

export function StampSlot({ filled, index }: { filled: boolean; index: number }) {
  return filled ? (
    <span
      className="yc-stamp-mark yc-b-stamp flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] bg-[var(--yc-stamp-soft)] text-[11px] font-extrabold text-[var(--yc-stamp)]"
      style={{ transform: `rotate(${index % 2 === 0 ? -8 : 6}deg)` }}
    >
      확인
    </span>
  ) : (
    <span className="yc-b-strong flex h-9 w-9 items-center justify-center rounded-full border-[2px] border-dashed" />
  );
}

/* ── Filter chips ──
 * 화면 안에서 목록을 좁히는 용도. 탭바와 섞이지 않게 알약형으로만 쓴다. */

export function FilterChips<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: { key: T; label: string; count?: number }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="yc-rail-scroll flex gap-1.5 overflow-x-auto px-5 pb-1">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              active
                ? "bg-[var(--yc-accent)] text-[var(--yc-on-accent)]"
                : "border border-[var(--yc-hairline)] bg-[var(--yc-surface)] text-[var(--yc-body)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={`yc-num text-[11.5px] font-bold ${
                  active ? "text-white/70" : "text-[var(--yc-mute)]"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Info row ──
 * 시설 상세의 주소/운영시간처럼 라벨과 값이 짝인 줄. 값이 길어도 라벨은 줄바꿈하지 않는다. */

export function InfoRow({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <li className="flex items-start gap-3 border-b border-[var(--yc-hairline)] py-3 last:border-b-0 last:pb-0">
      <span className="mt-0.5 shrink-0 text-[var(--yc-accent)]">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-semibold text-[var(--yc-mute)]">{label}</p>
        <p className="mt-0.5 text-[13.5px] leading-5 text-[var(--yc-ink)]">{value}</p>
        {note && <p className="mt-0.5 text-[12px] leading-4 text-[var(--yc-mute)]">{note}</p>}
      </div>
    </li>
  );
}

/* ── Row card ── */

export function Card({
  children,
  className = "",
  tone = "surface",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "soft" | "dashed";
}) {
  const tones = {
    surface: "bg-[var(--yc-surface)] border border-[var(--yc-hairline)]",
    soft: "bg-[var(--yc-surface-soft)] border border-transparent",
    dashed: "yc-b-strong bg-transparent border border-dashed",
  };
  return <div className={`rounded-[16px] ${tones[tone]} ${className}`}>{children}</div>;
}
