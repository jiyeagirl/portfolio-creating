"use client";

import { useId } from "react";
import { Icon } from "@iconify/react";
import type { BadgeTier, BookCategory, StampKind } from "@/projects/youngin/book/lib/types";

/* 책도장 고유 에셋. 도장/배지/타이포 표지는 이 서비스의 정체성이라
   components/shared로 올리지 않는다 (CLAUDE.md components/shared 절). */

/** id에서 결정론적으로 뽑는 값. 리렌더에도 도장 각도가 흔들리지 않는다. */
function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 1000;
  return h;
}

const KIND_TEXT: Record<StampKind, string> = {
  visit: "용인시립도서관",
  read: "완독인증",
  mission: "월간미션",
};

export function Stamp({
  label,
  date,
  kind = "visit",
  size = 84,
  seed = label,
  animate = false,
  color = "var(--bk-accent)",
}: {
  label: string;
  date?: string;
  kind?: StampKind;
  size?: number;
  seed?: string;
  animate?: boolean;
  color?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const tilt = (hash(seed) % 13) - 6;
  const top = KIND_TEXT[kind];
  const short = label.length > 2;

  return (
    <span
      className={`relative inline-flex items-center justify-center ${animate ? "book-stamp-in" : ""}`}
      style={{ width: size, height: size, transform: animate ? undefined : `rotate(${tilt}deg)` }}
    >
      {animate && (
        <span
          aria-hidden
          className="book-ink-ring absolute inset-0 rounded-full"
          style={{ background: color }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label={`${label} ${kind === "visit" ? "방문" : "완독"} 도장`}
        style={{ opacity: 0.92, transform: animate ? `rotate(${tilt}deg)` : undefined }}
      >
        <defs>
          <path id={`arc-${uid}`} d="M 50 50 m -34 0 a 34 34 0 0 1 68 0" fill="none" />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2.6" />
        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="2 3.2"
        />
        <text
          fill={color}
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.6"
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          <textPath href={`#arc-${uid}`} startOffset="50%">
            {top}
          </textPath>
        </text>
        <text
          x="50"
          y={date ? 54 : 57}
          fill={color}
          fontSize={short ? 20 : 25}
          fontWeight="800"
          letterSpacing="-0.5"
          textAnchor="middle"
        >
          {label}
        </text>
        {date ? (
          <text
            x="50"
            y="72"
            fill={color}
            fontSize="8.5"
            fontWeight="600"
            textAnchor="middle"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {date}
          </text>
        ) : (
          /* 날짜가 없는 도장은 잉크로 그은 짧은 밑줄 두 개로 마감한다.
             SVG 안에서는 Iconify를 쓰지 않는다 (foreignObject는 캡처 도구에서 깨진다). */
          <g stroke={color} strokeWidth="1.6" strokeLinecap="round">
            <line x1="40" y1="68" x2="60" y2="68" />
            <line x1="45" y1="73" x2="55" y2="73" />
          </g>
        )}
      </svg>
    </span>
  );
}

export function EmptyStamp({ label, size = 84 }: { label: string; size?: number }) {
  return (
    <span
      className="inline-flex flex-col items-center justify-center rounded-full border-[1.5px] border-dashed"
      style={{
        width: size,
        height: size,
        borderColor: "var(--bk-line)",
        background: "var(--bk-surface-sunk)",
      }}
    >
      <Icon
        icon="solar:lock-keyhole-minimalistic-linear"
        width={size * 0.2}
        height={size * 0.2}
        color="var(--bk-faint)"
      />
      <span
        className="mt-1 text-[11.5px] font-semibold"
        style={{ color: "var(--bk-faint)" }}
      >
        {label}
      </span>
    </span>
  );
}

const TIER: Record<BadgeTier, { ring: string; fill: string; ink: string; name: string }> = {
  bronze: { ring: "#B07A4B", fill: "#F3E6DA", ink: "#8A5A30", name: "브론즈" },
  silver: { ring: "#8B9299", fill: "#EBEEF0", ink: "#5F676E", name: "실버" },
  gold: { ring: "#C79A2E", fill: "#F8EFD6", ink: "#8A6412", name: "골드" },
};

export const TIER_NAME = (tier: BadgeTier) => TIER[tier].name;

export function BadgeMark({
  tier,
  icon,
  earned,
  size = 56,
}: {
  tier: BadgeTier;
  icon: string;
  earned: boolean;
  size?: number;
}) {
  const t = TIER[tier];
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        filter: earned ? undefined : "saturate(0.15)",
        opacity: earned ? 1 : 0.5,
      }}
    >
      <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden>
        <path
          d="M28 2.5 48.5 9.4v18.4c0 12.1-8.2 21.2-20.5 25.7C15.7 49 7.5 39.9 7.5 27.8V9.4Z"
          fill={t.fill}
          stroke={t.ring}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center pb-1">
        <Icon icon={icon} width={size * 0.4} height={size * 0.4} color={t.ink} />
      </span>
    </span>
  );
}

/* 사진 대신 조판으로 만드는 표지. picsum에 실제 도서 표지가 없어 어떤 id를 골라도
   제목과 어긋나므로 (design.md 사진 매핑 절) 표지만 타이포그래피로 처리한다. */
const COVER: Record<BookCategory, { bg: string; ink: string; rule: string }> = {
  문학: { bg: "#1E6B4E", ink: "#F3F1E7", rule: "rgba(243,241,231,0.42)" },
  인문: { bg: "#EDE6D6", ink: "#2C2A22", rule: "rgba(44,42,34,0.28)" },
  과학: { bg: "#20302A", ink: "#E6EDE7", rule: "rgba(230,237,231,0.36)" },
  사회: { bg: "#D9DFD5", ink: "#26302A", rule: "rgba(38,48,42,0.28)" },
  예술: { bg: "#F3E7DB", ink: "#5A3E24", rule: "rgba(90,62,36,0.3)" },
};

export function BookCover({
  title,
  author,
  category,
  width = 92,
}: {
  title: string;
  author: string;
  category: BookCategory;
  width?: number;
}) {
  const c = COVER[category];
  return (
    <div
      className="flex shrink-0 flex-col justify-between overflow-hidden rounded-[6px] px-2.5 py-3"
      style={{
        width,
        height: width * 1.44,
        background: c.bg,
        color: c.ink,
        boxShadow: "0 1px 2px rgba(26,29,25,0.06), 0 8px 18px -12px rgba(26,29,25,0.4)",
      }}
    >
      <div>
        <div
          className="mb-2 h-px w-6"
          style={{ background: c.rule }}
          aria-hidden
        />
        <p className="text-[12.5px] font-bold leading-[1.28] tracking-[-0.01em]">{title}</p>
      </div>
      <p className="text-[10px] font-medium opacity-75">{author}</p>
    </div>
  );
}
