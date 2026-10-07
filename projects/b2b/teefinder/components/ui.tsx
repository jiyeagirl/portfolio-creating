import type { ReactNode } from "react";
import type {
  AccountStatus,
  CollectStatus,
  MemberStatus,
  SlotStatus,
} from "@/projects/b2b/teefinder/lib/types";

export type Tone = "green" | "orange" | "red" | "gray" | "blue" | "blueSolid";

const TONE_CLASS: Record<Tone, string> = {
  green: "bg-[var(--tf-green-bg)] text-[var(--tf-green-fg)]",
  orange: "bg-[var(--tf-orange-bg)] text-[var(--tf-orange-fg)]",
  red: "bg-[var(--tf-red-bg)] text-[var(--tf-red-fg)]",
  gray: "bg-[var(--tf-gray-bg)] text-[var(--tf-gray-fg)]",
  blue: "bg-[var(--tf-blue-bg)] text-[var(--tf-blue-fg)]",
  blueSolid: "bg-[var(--tf-blue)] text-white",
};

const DOT_CLASS: Record<Tone, string> = {
  green: "bg-[var(--tf-green)]",
  orange: "bg-[var(--tf-orange)]",
  red: "bg-[var(--tf-red)]",
  gray: "bg-[var(--tf-gray)]",
  blue: "bg-[var(--tf-blue)]",
  blueSolid: "bg-white",
};

export function memberTone(s: MemberStatus): Tone {
  return s === "정상" ? "green" : s === "승인 대기" ? "orange" : s === "반려" ? "red" : "gray";
}

export function collectTone(s: CollectStatus): Tone {
  return s === "정상" ? "green" : s === "점검 필요" ? "orange" : s === "오류" ? "red" : "blue";
}

export function slotTone(s: SlotStatus): Tone {
  return s === "예약 가능" ? "green" : s === "마감" ? "gray" : "blueSolid";
}

export function accountTone(s: AccountStatus): Tone {
  return s === "정상" ? "green" : s === "로그인 실패" ? "red" : "blue";
}

/* 글자 수와 상관없이 칩 크기는 고정(compact 68px, 기본 80px)하고 글자는 가운데 정렬한다. 앱 배지는 13px, 관리자는 compact로 12px */
export function Badge({
  tone,
  children,
  compact = false,
  dot = false,
}: {
  tone: Tone;
  children: ReactNode;
  compact?: boolean;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap text-center font-medium ${TONE_CLASS[tone]} ${
        compact ? "h-[22px] w-[68px] rounded-[4px] px-1 text-[12px]" : "h-[26px] w-[80px] rounded-[8px] px-1 text-[13px]"
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[tone]}`} />}
      {children}
    </span>
  );
}

/* 골프장 로고 자리의 모노그램. 사진이 아니라 글자 한 개로 구분한다. */
export function Monogram({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[12px] bg-[var(--tf-soft)] font-semibold text-[var(--tf-brand)]"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {name.slice(0, 1)}
    </span>
  );
}
