"use client";

/* Waypoint 앱 공용 프리미티브. 색은 전부 styles/waypoint.css의 --wp-* 토큰을 참조하고
   여기서 새 색을 만들지 않는다. 히어로 카드는 high-end-visual-design의 Double-Bezel
   구조(아우터 셸 + 이너 코어)를 쓴다 — design.md "Shape" 절 참고. */

import Image from "next/image";
import type { ReactNode } from "react";
import {
  Coffee,
  Heart,
  MapPinLine,
  Star,
  Storefront,
  Student,
  Train,
} from "@phosphor-icons/react";
import type { Product, Seller, WaypointSpot } from "@/projects/community/waypoint/lib/types";
import { picsumId } from "@/projects/community/waypoint/lib/mock-data";

export function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

/* ── Badge ── */

export type Tone = "neutral" | "accent" | "success" | "warn" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--wp-surface-soft)] text-[var(--wp-body)]",
  accent: "bg-[var(--wp-accent-soft)] text-[var(--wp-accent-ink)]",
  success: "bg-[var(--wp-success-soft)] text-[var(--wp-success)]",
  warn: "bg-[var(--wp-warn-soft)] text-[var(--wp-warn)]",
  danger: "bg-[var(--wp-danger-soft)] text-[var(--wp-danger)]",
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
    primary: "bg-[var(--wp-accent)] text-white",
    secondary: "bg-[var(--wp-surface)] text-[var(--wp-ink)] border border-[var(--wp-border-strong)]",
    ghost: "bg-transparent text-[var(--wp-body)]",
    danger: "bg-[var(--wp-danger-soft)] text-[var(--wp-danger)]",
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
      className={`rounded-[18px] border border-[var(--wp-border)] bg-[var(--wp-surface)] ${padded ? "p-4" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/** Double-Bezel 히어로 카드 — 아우터 셸 + 이너 코어. 신뢰지수, 내 동선 홈 배너 등
    화면당 1~2개 핵심 카드에만 쓴다(남용 금지). */
export function HeroCard({
  children,
  className = "",
  coreClassName = "bg-[var(--wp-surface)]",
}: {
  children: ReactNode;
  className?: string;
  coreClassName?: string;
}) {
  return (
    <div className={`rounded-[28px] bg-[var(--wp-surface-soft)] p-1.5 ${className}`}>
      <div className={`overflow-hidden rounded-[22px] ${coreClassName}`}>{children}</div>
    </div>
  );
}

/* ── Avatar (모노그램, 사진 대신) ── */

export function Avatar({
  initial,
  size = 40,
  tone = "accent",
}: {
  initial: string;
  size?: number;
  tone?: "accent" | "neutral";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        tone === "accent"
          ? "bg-[var(--wp-accent-soft)] text-[var(--wp-accent-ink)]"
          : "bg-[var(--wp-surface-sunken)] text-[var(--wp-body)]"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
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
          ? "border-[var(--wp-accent)] bg-[var(--wp-accent)] text-white"
          : "border-[var(--wp-border)] bg-[var(--wp-surface)] text-[var(--wp-body)]"
      }`}
    >
      {label}
    </button>
  );
}

/* ── 신뢰지수 바 ── */

export function TrustBar({ value }: { value: number }) {
  const tone = value >= 80 ? "var(--wp-success)" : value >= 50 ? "var(--wp-accent)" : "var(--wp-warn)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--wp-surface-sunken)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: tone }} />
    </div>
  );
}

/* ── 웨이스팟 타입 아이콘 ── */

export const WAYPOINT_TYPE_ICON = {
  지하철역: Train,
  편의점: Storefront,
  카페: Coffee,
  스터디카페: Student,
} as const;

/* ── 상품 카드 ── */

export function ProductCard({
  product,
  onClick,
  metaMode = "distance",
  liked,
  onToggleLike,
}: {
  product: Product;
  onClick: () => void;
  metaMode?: "distance" | "route";
  liked?: boolean;
  onToggleLike?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[18px] p-2 text-left transition-colors active:bg-[var(--wp-surface-soft)]"
    >
      <span className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--wp-surface-sunken)]">
        <Image
          src={picsumId(product.photoId, 200, 200)}
          alt={product.title}
          fill
          sizes="84px"
          className="object-cover"
        />
        {product.status !== "판매중" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--wp-ink)]">
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
            <Heart size={13} weight={liked ? "fill" : "regular"} className={liked ? "text-[var(--wp-danger)]" : "text-white"} />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate text-[14.5px] font-medium text-[var(--wp-ink)]">{product.title}</p>
        <p className="mt-1 tabular-nums text-[15.5px] font-semibold text-[var(--wp-ink)]">
          {formatWon(product.price)}
        </p>
        {/* 메타 스트립은 한 줄로 유지한다. 세 조각이 다 들어가면 좁은 시트에서 줄이
            바뀌면서 파이프 구분자가 줄머리에 남는다 — `min-w-0` + `truncate`로 자른다. */}
        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap text-[12px] text-[var(--wp-muted)]">
          {metaMode === "distance" ? (
            <span className="shrink-0">
              {product.distanceM < 1000 ? `${product.distanceM}m` : `${(product.distanceM / 1000).toFixed(1)}km`}
            </span>
          ) : (
            <span className="inline-flex min-w-0 shrink items-center gap-1 text-[var(--wp-accent-ink)]">
              <MapPinLine size={12} weight="fill" className="shrink-0" />
              <span className="truncate">
                {product.nearestStation} 도보 {product.etaMin}분
              </span>
            </span>
          )}
          <span className="shrink-0">|</span>
          <span className="shrink-0">관심 {product.likeCount}</span>
          {product.waypointSpotId && (
            <>
              <span className="shrink-0">|</span>
              <span className="truncate text-[var(--wp-accent-ink)]">웨이스팟 거래가능</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── 웨이스팟 카드 ── */

export function WaypointCard({
  spot,
  onToggleFavorite,
  onShare,
}: {
  spot: WaypointSpot;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}) {
  const Icon = WAYPOINT_TYPE_ICON[spot.type];
  const crowdTone: Tone = spot.crowdLevel === "여유" ? "success" : spot.crowdLevel === "보통" ? "accent" : "warn";
  return (
    <Card padded={false} className="overflow-hidden">
      {spot.photoId && (
        <div className="relative h-[104px] w-full">
          <Image src={picsumId(spot.photoId, 500, 220)} alt={spot.name} fill sizes="360px" className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--wp-accent-ink)]">
              <Icon size={13} weight="fill" />
              {spot.type}
            </div>
            <p className="mt-1 truncate text-[15px] font-semibold text-[var(--wp-ink)]">{spot.name}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-[var(--wp-muted)]">{spot.address}</p>
          </div>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-pressed={spot.favorite}
              aria-label={spot.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
            >
              <Star
                size={20}
                weight={spot.favorite ? "fill" : "regular"}
                className={spot.favorite ? "text-[var(--wp-warn)]" : "text-[var(--wp-muted)]"}
              />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{spot.distanceM}m</Badge>
          <Badge tone="neutral">{spot.hours}</Badge>
          <Badge tone={crowdTone}>혼잡도 {spot.crowdLevel}</Badge>
          <Badge tone="success">안전도 {spot.safetyScore}</Badge>
        </div>
        {onShare && (
          <div className="mt-4">
            <Button variant="secondary" size="sm" full onClick={onShare}>
              이 웨이스팟 공유하기
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── 신뢰 요약 행 (채팅목록/상품상세 등에서 상대 정보) ── */

export function SellerInline({ seller }: { seller: Seller }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar initial={seller.avatarInitial} size={28} tone="neutral" />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-[var(--wp-ink)]">{seller.nickname}</p>
        <p className="truncate text-[11px] text-[var(--wp-muted)]">신뢰지수 {seller.trustScore}</p>
      </div>
      {seller.dualVerified && (
        <Badge tone="success">듀얼인증</Badge>
      )}
    </div>
  );
}

/* ── 빈 상태 ── */

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-[var(--wp-border-strong)] px-6 py-14 text-center">
      <p className="text-[14.5px] font-semibold text-[var(--wp-ink)]">{title}</p>
      <p className="text-[13px] leading-5 text-[var(--wp-muted)]">{body}</p>
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
      <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--wp-ink)]">{title}</h2>
      {action}
    </div>
  );
}
