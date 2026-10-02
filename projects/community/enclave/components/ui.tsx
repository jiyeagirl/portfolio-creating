"use client";

/* Enclave 앱 공용 프리미티브. 색은 전부 styles/enclave.css의 --ec-* 토큰을 참조하고
   여기서 새 색을 만들지 않는다. 히어로 카드는 high-end-visual-design의 Double-Bezel
   구조(아우터 셸 + 이너 코어)를 화면당 핵심 순간에만 쓴다 — design.md "Shape" 절 참고. */

import Image from "next/image";
import type { ReactNode } from "react";
import { Heart, Package, UserCircle } from "@phosphor-icons/react";
import type { Product } from "@/projects/community/enclave/lib/types";
import { picsumId } from "@/projects/community/enclave/lib/mock-data";

export function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

/* ── Badge ── */

export type Tone = "neutral" | "accent" | "warn" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--ec-surface-soft)] text-[var(--ec-body)]",
  accent: "bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]",
  warn: "bg-[var(--ec-warn-soft)] text-[var(--ec-warn)]",
  danger: "bg-[var(--ec-danger-soft)] text-[var(--ec-danger)]",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold leading-3.5 ${TONE_CLASS[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

/* ── Button (필-버튼, 트레일링 아이콘은 버튼-인-버튼) ── */

export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  trailingIcon,
  onClick,
  disabled,
  type = "button",
}: {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  trailingIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-[var(--ec-accent)] text-white",
    secondary: "bg-[var(--ec-surface)] text-[var(--ec-ink)] border border-[var(--ec-border-strong)]",
    ghost: "bg-transparent text-[var(--ec-body)]",
    danger: "bg-[var(--ec-danger-soft)] text-[var(--ec-danger)]",
  };
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-[14px]",
    lg: "h-[52px] px-6 text-[15.5px]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""}`}
    >
      {children}
      {trailingIcon && (
        <span className="-mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

/* ── Card ── */

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-[16px] border border-[var(--ec-border)] bg-[var(--ec-surface)] ${padded ? "p-4" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/** Double-Bezel 히어로 카드 — 아우터 셸 + 이너 코어. 단지 인증 완료, 무인택배함
    픽업 코드 등 화면당 핵심 순간 1곳에만 쓴다(남용 금지). */
export function HeroCard({
  children,
  className = "",
  coreClassName = "bg-[var(--ec-surface)]",
}: {
  children: ReactNode;
  className?: string;
  coreClassName?: string;
}) {
  return (
    <div className={`rounded-[26px] bg-[var(--ec-surface-soft)] p-1.5 ${className}`}>
      <div className={`overflow-hidden rounded-[20px] ${coreClassName}`}>{children}</div>
    </div>
  );
}

/* ── Avatar — 프로필 사진 대신 단일 캐릭터로 통일. 이웃마다 다른 이니셜을 쓰면
   화면마다 제각각인 "회원가입 아바타"처럼 보여서, 누구든 같은 아이콘 하나로
   고정한다(색조만 me/타인 구분). ── */

export function Avatar({
  size = 40,
  tone = "accent",
}: {
  size?: number;
  tone?: "accent" | "neutral";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${
        tone === "accent"
          ? "bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]"
          : "bg-[var(--ec-surface-sunken)] text-[var(--ec-body)]"
      }`}
      style={{ width: size, height: size }}
    >
      <UserCircle size={size * 0.64} weight="fill" />
    </span>
  );
}

/* ── 동/호수 칩 — 우편함 라벨을 은유하는 각진 태그 ── */

export function DongHoTag({ dong, ho }: { dong: string; ho: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-[8px] bg-[var(--ec-surface-sunken)] px-2 py-1 tabular-nums text-[11px] font-medium text-[var(--ec-body)]">
      {dong} {ho}
    </span>
  );
}

/* ── Chip (필터) ── */

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "border-[var(--ec-accent)] bg-[var(--ec-accent)] text-white"
          : "border-[var(--ec-border)] bg-[var(--ec-surface)] text-[var(--ec-body)]"
      }`}
    >
      {label}
    </button>
  );
}

/* ── 이웃평판 바 (0-100점) ── */

export function ReputationBar({ value }: { value: number }) {
  const pct = Math.min(100, value);
  const tone = value >= 75 ? "var(--ec-accent)" : value >= 50 ? "var(--ec-warn)" : "var(--ec-danger)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ec-surface-sunken)]">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tone }} />
    </div>
  );
}

/* ── 상품 카드 ── */

export function ProductCard({
  product,
  onClick,
  liked,
  onToggleLike,
}: {
  product: Product;
  onClick: () => void;
  liked?: boolean;
  onToggleLike?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[16px] p-2 text-left transition-colors active:bg-[var(--ec-surface-soft)]"
    >
      <span className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[12px] bg-[var(--ec-surface-sunken)]">
        <Image
          src={picsumId(product.photoId, 200, 200)}
          alt={product.title}
          fill
          sizes="84px"
          className="object-cover"
        />
        {product.status !== "판매중" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--ec-ink)]">
              {product.status}
            </span>
          </span>
        )}
        {onToggleLike && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/35"
          >
            <Heart size={13} weight={liked ? "fill" : "regular"} className={liked ? "text-[var(--ec-danger-soft)]" : "text-white"} />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate text-[14.5px] font-medium text-[var(--ec-ink)]">{product.title}</p>
        <p className="mt-1 tabular-nums text-[15.5px] font-semibold text-[var(--ec-ink)]">
          {formatWon(product.price)}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--ec-muted)]">
          <span>{product.postedAt.slice(5).replace(".", "/")}</span>
          <span>|</span>
          <span>관심 {product.likeCount}</span>
          {product.lockerAvailable && (
            <>
              <span>|</span>
              <span className="inline-flex items-center gap-0.5 text-[var(--ec-accent-ink)]">
                <Package size={11} weight="fill" />
                무인택배함
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── 빈 상태 ── */

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] border border-dashed border-[var(--ec-border-strong)] px-6 py-14 text-center">
      <p className="text-[14.5px] font-semibold text-[var(--ec-ink)]">{title}</p>
      <p className="text-[13px] leading-5 text-[var(--ec-muted)]">{body}</p>
    </div>
  );
}

/* ── 섹션 타이틀 ── */

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[16.5px] font-semibold tracking-[-0.01em] text-[var(--ec-ink)]">{title}</h2>
      {action}
    </div>
  );
}
