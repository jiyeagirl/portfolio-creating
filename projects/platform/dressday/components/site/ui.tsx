"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CoatHanger, Dress, Heart, Pants, ShirtFolded, TShirt } from "@phosphor-icons/react";
import type { Garment, Product, Tone } from "@/projects/platform/dressday/lib/types";
import { photoUrl, totalStock, won } from "@/projects/platform/dressday/lib/catalog";

export const CONTAINER = "mx-auto w-full max-w-[1280px] px-6 lg:px-8";

const GARMENT_ICON: Record<Garment, typeof Dress> = {
  dress: Dress,
  skirt: Dress,
  shirt: ShirtFolded,
  knit: TShirt,
  outer: CoatHanger,
  pants: Pants,
};

/**
 * 상품 이미지. 확인된 picsum 사진이 있으면 사진, 없으면 상품 색 톤 타일 + 의류 아이콘.
 * 톤 타일은 사진 요청 목록에 올라간 자리다 (design.md 사진 매핑).
 */
export function ProductImage({
  product,
  w = 600,
  h = 800,
  position,
  zoom,
  className = "",
  iconSize = 40,
}: {
  product: Product;
  w?: number;
  h?: number;
  /** 같은 사진의 다른 크롭 (object-position) */
  position?: string;
  /** 크롭 확대 배율 */
  zoom?: number;
  className?: string;
  iconSize?: number;
}) {
  if (product.photo) {
    return (
      <div className={`overflow-hidden bg-[var(--dd-strong)] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl(product.photo.id, w, h)}
          alt={product.photo.alt}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: position, transform: zoom ? `scale(${zoom})` : undefined, transformOrigin: position }}
        />
      </div>
    );
  }
  const Icon = GARMENT_ICON[product.garment];
  return (
    <div
      role="img"
      aria-label={`${product.name} (${product.color}) 사진 준비 중`}
      className={`flex items-center justify-center ${className}`}
      style={{ background: product.tone }}
    >
      <Icon
        size={iconSize}
        weight="light"
        className={product.toneInk === "light" ? "text-white/70" : "text-[var(--dd-ink)]/45"}
      />
    </div>
  );
}

export function Photo({ id, alt, w, h, className = "" }: { id: number; alt: string; w: number; h: number; className?: string }) {
  return (
    <div className={`overflow-hidden bg-[var(--dd-strong)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoUrl(id, w, h)} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`dd-press inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[var(--dd-primary)] px-6 text-[16px] font-medium text-white active:bg-[var(--dd-primary-active)] disabled:cursor-not-allowed disabled:bg-[var(--dd-primary-disabled)] ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`dd-press inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[var(--dd-ink)] bg-white px-6 text-[16px] font-medium text-[var(--dd-ink)] active:bg-[var(--dd-soft)] ${className}`}
    >
      {children}
    </button>
  );
}

export function TextLink({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[14px] font-medium text-[var(--dd-ink)] underline underline-offset-4 ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  on,
  onClick,
  className = "",
}: {
  children: ReactNode;
  on?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`dd-press inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-[14px] ${
        on
          ? "border-[var(--dd-ink)] bg-[var(--dd-ink)] font-medium text-white"
          : "border-[var(--dd-hairline)] bg-white text-[var(--dd-body)] active:border-[var(--dd-ink)]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

const TONE_CLASS: Record<Tone, string> = {
  wait: "bg-[var(--dd-wait-bg)] text-[var(--dd-wait-fg)]",
  live: "bg-[var(--dd-live-bg)] text-[var(--dd-live-fg)]",
  act: "bg-[var(--dd-act-bg)] text-[var(--dd-act-fg)]",
  done: "bg-[var(--dd-done-bg)] text-[var(--dd-done-fg)]",
  stop: "bg-[var(--dd-stop-bg)] text-[var(--dd-stop-fg)]",
};

export function Badge({ tone, children, className = "" }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full px-2.5 text-[12px] font-semibold ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SaveButton({ saved, className = "" }: { saved?: boolean; className?: string }) {
  const [on, setOn] = useState(!!saved);
  return (
    <button
      type="button"
      aria-label={on ? "저장 취소" : "저장"}
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation();
        setOn(!on);
      }}
      className={`dd-press flex h-11 w-11 items-center justify-center ${className}`}
    >
      <span className="relative block h-6 w-6">
        {on && <Heart size={24} weight="fill" className="absolute inset-0 text-[var(--dd-primary)]" />}
        <Heart size={24} weight="bold" className="absolute inset-0 text-white [filter:drop-shadow(0_1px_2px_rgba(34,34,34,0.45))]" />
      </span>
    </button>
  );
}

/** 사진 위 흰 알약. 실제 상태(오늘 수령, 대여 중)에만 쓴다 */
export function PhotoTag({ children }: { children: ReactNode }) {
  return (
    <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-white px-3 text-[12px] font-semibold text-[var(--dd-ink)] shadow-[var(--dd-float)]">
      {children}
    </span>
  );
}

export function ProductCard({
  product,
  onOpen,
  saved,
  imageClass = "aspect-[3/4]",
}: {
  product: Product;
  onOpen: () => void;
  saved?: boolean;
  imageClass?: string;
}) {
  const soldOut = !product.today;
  const left = totalStock(product);
  // 실제 상태만 표시한다: 오늘 못 받으면 "내일 도착", 재고가 2벌 이하면 남은 수량
  const tag = soldOut ? "내일 도착" : left <= 2 ? `${left}벌 남음` : null;
  return (
    <article className="group flex min-w-0 flex-col">
      <div className="dd-zoom relative">
        <button type="button" onClick={onOpen} className="block w-full" aria-label={`${product.name} 보기`}>
          <ProductImage product={product} className={`w-full rounded-[14px] ${imageClass}`} />
        </button>
        {tag ? <PhotoTag>{tag}</PhotoTag> : null}
        <SaveButton saved={saved} className="absolute right-1 top-1" />
      </div>
      <button type="button" onClick={onOpen} className="mt-3 flex flex-1 flex-col text-left">
        <span className="text-[13px] text-[var(--dd-muted)]">{product.label}</span>
        <span className="mt-0.5 line-clamp-2 text-[16px] font-semibold leading-5 text-[var(--dd-ink)]">{product.name}</span>
        <span className="mt-1 text-[14px] text-[var(--dd-muted)]">
          {product.color}
        </span>
        <span className="dd-num mt-auto pt-2 text-[15px] text-[var(--dd-ink)]">
          <span className="font-semibold">{won(product.price)}</span>
          <span className="text-[var(--dd-muted)]"> / 1일</span>
        </span>
      </button>
    </article>
  );
}

/** 섹션 진입 1회. IntersectionObserver만 쓴다 (mockup-craft 6절) */
export function Reveal({ children, className = "", as = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" }) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref as never} data-shown={shown} className={`dd-reveal ${className}`}>
      {children}
    </Tag>
  );
}

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[14px] font-medium text-[var(--dd-muted)]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const INPUT =
  "h-14 w-full rounded-[8px] border border-[var(--dd-hairline)] bg-white px-3 text-[16px] text-[var(--dd-ink)] outline-none placeholder:text-[var(--dd-muted-soft)] focus:border-2 focus:border-[var(--dd-ink)] focus:px-[11px]";

/** 예약 조회, 반납의 단계 타임라인 */
export function Timeline({ steps }: { steps: { key: string; label: string; at?: string; tone: Tone }[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const done = s.tone === "done";
        const live = s.tone === "live";
        return (
          <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={`absolute left-[7px] top-5 bottom-0 w-px ${done ? "bg-[var(--dd-ink)]" : "bg-[var(--dd-hairline)]"}`}
              />
            )}
            <span
              aria-hidden
              className={`relative mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                done
                  ? "border-[var(--dd-ink)] bg-[var(--dd-ink)]"
                  : live
                    ? "dd-live-dot border-[var(--dd-live-fg)] bg-white"
                    : "border-[var(--dd-hairline)] bg-white"
              }`}
            />
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
              <span
                className={`text-[15px] ${
                  live ? "font-semibold text-[var(--dd-live-fg)]" : done ? "text-[var(--dd-ink)]" : "text-[var(--dd-muted-soft)]"
                }`}
              >
                {s.label}
              </span>
              {s.at ? <span className="dd-num shrink-0 text-[14px] text-[var(--dd-muted)]">{s.at}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** 단계 표시. 단계 이름 자체가 라벨이다 ("STEP 1" 금지) */
export function Steps({ items, current }: { items: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 text-[14px]">
      {items.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-px w-6 bg-[var(--dd-hairline)]" />}
          <span
            aria-current={i === current ? "step" : undefined}
            className={
              i === current
                ? "font-semibold text-[var(--dd-ink)]"
                : i < current
                  ? "text-[var(--dd-body)]"
                  : "text-[var(--dd-muted-soft)]"
            }
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function SummaryRow({
  label,
  value,
  strong,
  minus,
}: {
  label: string;
  value: number;
  strong?: boolean;
  minus?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${strong ? "text-[var(--dd-ink)]" : "text-[var(--dd-body)]"}`}>
      <span className={strong ? "text-[16px] font-semibold" : "text-[15px]"}>{label}</span>
      <span className={`dd-num whitespace-nowrap ${strong ? "text-[21px] font-bold" : "text-[15px]"}`}>
        {minus ? "−" : ""}
        {won(value)}
      </span>
    </div>
  );
}
