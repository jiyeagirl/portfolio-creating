"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  Drop,
  PawPrint,
  SneakerMove,
  Sparkle,
  Star,
  TShirt,
  Wind,
} from "@phosphor-icons/react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";
import type { BrandTint, Pet, ProductCategory } from "@/projects/commerce/pawfit/lib/types";
import { formatWon } from "@/projects/commerce/pawfit/lib/mock-data";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

/* 칩은 색을 채운 덩어리가 아니라 가는 보더 + 아주 옅은 틴트로 표시한다.
   상태를 뜻하는 톤(success/warning/danger)에만 currentColor 도트를 붙인다. */
const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-[var(--pf-hairline)] text-[var(--pf-muted)]",
  accent: "border-[var(--pf-ink)]/20 bg-[var(--pf-ink)]/[0.05] text-[var(--pf-ink)]",
  success: "border-[var(--pf-success)]/25 bg-[var(--pf-success)]/[0.08] text-[var(--pf-success)]",
  warning: "border-[var(--pf-warning)]/25 bg-[var(--pf-warning)]/[0.08] text-[var(--pf-warning)]",
  danger: "border-[var(--pf-error)]/25 bg-[var(--pf-error)]/[0.08] text-[var(--pf-error)]",
};

const DOT_TONES: Tone[] = ["success", "warning", "danger"];
const TONE_DOT_VAR: Partial<Record<Tone, string>> = {
  success: "var(--pf-success)",
  warning: "var(--pf-warning)",
  danger: "var(--pf-error)",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
  onLight = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** 브랜드 컬러 타일처럼 이미 채도 높은 배경 위에서 쓸 때 흰색 계열로 대비를 확보한다. */
  onLight?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-semibold leading-none ${
        onLight ? "border-white/40 bg-white/20 text-white" : TONE_CLASS[tone]
      } ${className}`}
    >
      {DOT_TONES.includes(tone) &&
        (onLight ? (
          <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: TONE_DOT_VAR[tone] }} aria-hidden />
        ) : (
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-current" aria-hidden />
        ))}
      {children}
    </span>
  );
}

/* 6색 브랜드 로테이션. 버튼에는 쓰지 않고 카드/타일 배경 전용(clay_compact 규칙). */
const TINT_BG: Record<BrandTint, string> = {
  pink: "var(--pf-brand-pink)",
  teal: "var(--pf-brand-teal)",
  lavender: "var(--pf-brand-lavender)",
  peach: "var(--pf-brand-peach)",
  ochre: "var(--pf-brand-ochre)",
  cream: "var(--pf-surface-card)",
};

const TINT_FG: Record<BrandTint, string> = {
  pink: "#ffffff",
  teal: "#ffffff",
  lavender: "var(--pf-ink)",
  peach: "var(--pf-ink)",
  ochre: "var(--pf-ink)",
  cream: "var(--pf-ink)",
};

const CATEGORY_ICON: Record<ProductCategory, typeof TShirt> = {
  니트: TShirt,
  레인코트: Wind,
  하네스: PawPrint,
  반다나: Sparkle,
  부츠: SneakerMove,
  잠옷: Drop,
};

/** 상품 이미지. 실제 착용 사진이 검증된 상품은 그 사진을 쓰고(design.md
    "사진 매핑" 참고), 아직 검증된 사진이 없는 카테고리는 브랜드 6색 로테이션 +
    카테고리 아이콘 + 컬러웨이 스와치 타일로 대체한다. */
export function ProductTile({
  category,
  tint,
  colorways,
  image,
  alt,
  size = 96,
  className = "",
}: {
  category: ProductCategory;
  tint: BrandTint;
  colorways?: { name: string; hex: string }[];
  image?: StaticImageData;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category];

  if (image) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-[16px] ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={image}
          alt={alt ?? `${category} 상품 이미지`}
          fill
          placeholder="blur"
          className="object-cover"
          sizes={`${size}px`}
        />
        {colorways && colorways.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {colorways.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white/60"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[16px] ${className}`}
      style={{ width: size, height: size, background: TINT_BG[tint], color: TINT_FG[tint] }}
    >
      <Icon size={size * 0.42} weight="duotone" />
      {colorways && colorways.length > 0 && (
        <div className="absolute bottom-2 left-2 flex gap-1">
          {colorways.slice(0, 3).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/60"
              style={{ background: c.hex }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* 반려동물 프로필 사진. 등록된 실제 반려동물 사진을 원형으로 쓴다. */
export function PetAvatar({
  pet,
  size = 56,
}: {
  pet: Pick<Pet, "name" | "photo">;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 overflow-hidden rounded-full bg-[var(--pf-surface-card)]"
      style={{ width: size, height: size }}
    >
      <Image
        src={pet.photo}
        alt={`${pet.name} 프로필 사진`}
        width={size}
        height={size}
        placeholder="blur"
        className="h-full w-full object-cover"
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: "inset 0 0 0 1px rgba(10, 10, 10, 0.08)" }}
        aria-hidden
      />
    </span>
  );
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`평점 ${rating}점`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          weight="fill"
          className={i < Math.round(rating) ? "text-[var(--pf-ink)]" : "text-[var(--pf-hairline)]"}
        />
      ))}
    </span>
  );
}

export function PriceTag({
  price,
  listPrice,
  size = "md",
}: {
  price: number;
  listPrice?: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "text-[22px]" : size === "sm" ? "text-[14px]" : "text-[17px]";
  return (
    <span className="pf-num inline-flex items-baseline gap-1.5">
      <span className={`font-semibold ${sizeClass}`}>{formatWon(price)}원</span>
      {listPrice && listPrice > price && (
        <span className="text-[12.5px] text-[var(--pf-muted-soft)] line-through">
          {formatWon(listPrice)}원
        </span>
      )}
    </span>
  );
}

export function AppBar({
  title,
  onBack,
  right,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
}) {
  return (
    <SharedScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="bg-[var(--pf-canvas)] border-[var(--pf-hairline)]"
      backButtonClassName="text-[var(--pf-ink)] hover:bg-[var(--pf-surface-card)] active:scale-[0.97]"
      titleClassName="text-[16px] font-semibold tracking-tight"
      subtitleClassName="text-[11.5px] text-[var(--pf-muted)]"
    />
  );
}

export function SectionHead({
  title,
  note,
  action,
  onAction,
}: {
  title: string;
  note?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-5">
      <div>
        <h2 className="text-[18px] font-medium tracking-[-0.02em]">{title}</h2>
        {note && <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">{note}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[12.5px] font-semibold text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-ink)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  full = true,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} rounded-[12px] bg-[var(--pf-primary)] px-5 py-3.5 text-[15px] font-semibold text-[var(--pf-on-primary)] transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[var(--pf-surface-strong)] disabled:text-[var(--pf-muted)]`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-[12px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-3.5 text-[15px] font-semibold text-[var(--pf-ink)] transition-transform active:scale-[0.97]`}
    >
      {children}
    </button>
  );
}

export function DangerGhostButton({
  children,
  onClick,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-[12px] border border-[var(--pf-error)]/30 bg-[var(--pf-error)]/[0.06] px-5 py-3.5 text-[15px] font-semibold text-[var(--pf-error)] transition-transform active:scale-[0.97]`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-[var(--pf-ink)]">{label}</span>
      {children}
      {helper && !error && <span className="text-[12px] text-[var(--pf-muted)]">{helper}</span>}
      {error && <span className="text-[12px] font-semibold text-[var(--pf-error)]">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-[12px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-4 py-3 text-[14px] text-[var(--pf-ink)] outline-none transition-colors focus:border-[var(--pf-ink)]";

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-muted)]">
        {icon}
      </span>
      <div>
        <p className="text-[15px] font-semibold">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--pf-muted)]">{body}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-[12px] bg-[var(--pf-primary)] px-5 py-2.5 text-[13.5px] font-semibold text-[var(--pf-on-primary)] active:scale-[0.97]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function ListRow({
  icon,
  label,
  value,
  onClick,
  danger = false,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[var(--pf-hairline)] px-5 py-3.5 text-left last:border-b-0"
    >
      {icon && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            danger ? "bg-[var(--pf-error)]/[0.08] text-[var(--pf-error)]" : "bg-[var(--pf-surface-card)] text-[var(--pf-muted)]"
          }`}
        >
          {icon}
        </span>
      )}
      <span className={`flex-1 text-[14px] font-normal ${danger ? "text-[var(--pf-error)]" : "text-[var(--pf-ink)]"}`}>
        {label}
      </span>
      {value && <span className="text-[13px] text-[var(--pf-muted)]">{value}</span>}
    </button>
  );
}

export function CategoryTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
        active ? "bg-[var(--pf-surface-card)] text-[var(--pf-ink)]" : "text-[var(--pf-muted)]"
      }`}
    >
      {children}
    </button>
  );
}
