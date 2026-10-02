"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  AirplaneTakeoff,
  Baby,
  Buildings,
  Car,
  Coffee,
  CreditCard,
  DoorOpen,
  Drop,
  Elevator,
  HandHeart,
  IdentificationCard,
  Info,
  MapTrifold,
  Printer,
  Receipt,
  Stairs,
  Stamp,
  Star,
  Ticket,
  Toilet,
  UsersThree,
  Wheelchair,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { FacilityKind, ServiceIcon } from "../lib/types";

/* Pictogram per facility kind. The floor plan reads by shape first and color
   second, so every kind gets a distinct silhouette rather than a tinted dot. */
export const FACILITY_ICON: Record<FacilityKind, Icon> = {
  counter: IdentificationCard,
  dept: Buildings,
  ticket: Ticket,
  kiosk: Printer,
  info: Info,
  restroom: Toilet,
  restroomAccessible: Wheelchair,
  nursing: Baby,
  cafe: Coffee,
  water: Drop,
  atm: CreditCard,
  elevator: Elevator,
  stairs: Stairs,
  entrance: DoorOpen,
  parking: Car,
};

export const SERVICE_ICON: Record<ServiceIcon, Icon> = {
  resident: IdentificationCard,
  family: UsersThree,
  passport: AirplaneTakeoff,
  seal: Stamp,
  land: MapTrifold,
  car: Car,
  welfare: HandHeart,
  tax: Receipt,
};

export const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

/** Fixed, hand-verified picsum ids only. Never a random or hash seed for a
 *  content-bearing photo. See design.md 사진 매핑 for what each id shows. */
export function Photo({
  id,
  alt,
  className = "",
  sizes = "393px",
  priority,
  objectPosition,
  request = [900, 700],
}: {
  id: number;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** e.g. "50% 80%" to crop toward the facade instead of the sky. */
  objectPosition?: string;
  /** picsum center-crops to the requested ratio, so a portrait request is how
   *  a landscape source gets tightened onto its subject. */
  request?: [number, number];
}) {
  return (
    <div className={`relative overflow-hidden bg-[var(--yi-surface-sunken)] ${className}`}>
      <Image
        src={`https://picsum.photos/id/${id}/${request[0]}/${request[1]}`}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}

/* ------------------------------ primitives ------------------------------ */

export function Card({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  title,
  desc,
  action,
  onAction,
}: {
  title: string;
  desc?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-5">
      <div className="min-w-0">
        <h2 className="text-[17px] font-semibold leading-6 tracking-[-0.01em] text-[var(--yi-ink)]">
          {title}
        </h2>
        {desc && <p className="mt-0.5 text-[13px] leading-[18px] text-[var(--yi-muted)]">{desc}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="yi-press shrink-0 text-[13px] font-semibold text-[var(--yi-primary)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[var(--yi-surface-soft)] text-[var(--yi-muted)]",
    primary: "bg-[var(--yi-primary-soft)] text-[var(--yi-primary)]",
    success: "bg-[#E4F3EB] text-[var(--yi-success)]",
    warning: "bg-[#FBEEDD] text-[var(--yi-warning)]",
    danger: "bg-[#F9E7E4] text-[var(--yi-danger)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-semibold leading-[15px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Chip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`yi-press flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors ${
        active
          ? "border-[var(--yi-primary)] bg-[var(--yi-primary)] text-[var(--yi-on-primary)]"
          : "border-[var(--yi-border)] bg-[var(--yi-surface)] text-[var(--yi-body)]"
      }`}
    >
      {color && (
        <span
          className="h-[7px] w-[7px] rounded-[2px]"
          style={{ background: active ? "rgba(255,255,255,.85)" : color }}
        />
      )}
      {label}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon: IconCmp,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: Icon;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`yi-press flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-semibold transition-colors ${
        disabled
          ? "bg-[var(--yi-surface-sunken)] text-[var(--yi-muted-soft)]"
          : "bg-[var(--yi-primary)] text-[var(--yi-on-primary)] active:bg-[var(--yi-primary-strong)]"
      } ${className}`}
    >
      {IconCmp && <IconCmp size={20} weight="bold" />}
      {children}
    </button>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`5점 만점에 ${value}점`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} weight="fill" className="absolute inset-0 text-[var(--yi-border-strong)]" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} weight="fill" className="text-[#E0A21A]" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* -------------------------------- sheet -------------------------------- */

/** Anchored `absolute` to the app shell, never `fixed` — a fixed element
 *  inside the device escapes PhoneFrame's rounded clip (CLAUDE.md).
 *  z-20 keeps it under PhoneFrame's own z-30 status bar, so the clock stays
 *  legible over the scrim the way it does on iOS. */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <motion.button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-[rgba(9,24,40,0.42)]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING}
            /* Fixed px, not vh: the viewport is the browser page, but the
               sheet lives inside the 852pt device screen. */
            className="yi-raised relative flex max-h-[640px] flex-col overflow-hidden rounded-t-[20px] bg-[var(--yi-surface)]"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-3 pt-4">
              <h3 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-[var(--yi-ink)]">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="yi-press flex h-8 w-8 items-center justify-center rounded-full bg-[var(--yi-surface-soft)] text-[var(--yi-muted)]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {children}
            </div>
            {footer && <div className="shrink-0 px-5 pb-[26px] pt-3">{footer}</div>}
            {!footer && <div className="h-[26px] shrink-0" />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
