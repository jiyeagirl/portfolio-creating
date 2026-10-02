"use client";

import Image from "next/image";
import { BookmarkSimple, Check, MapPin } from "@phosphor-icons/react";
import { pexelsPhoto } from "@/projects/community/wedit/lib/mock-data";
import type { Vendor } from "@/projects/community/wedit/lib/types";
import { PriceText, RatingRow, VerifiedBadge } from "@/projects/community/wedit/components/ui";

export function VendorCard({
  vendor,
  onClick,
  rank,
  bookmarked,
  onToggleBookmark,
  compareSelected,
  onToggleCompare,
}: {
  vendor: Vendor;
  onClick: () => void;
  rank?: number;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  compareSelected?: boolean;
  onToggleCompare?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--wd-border)] bg-[var(--wd-surface)] text-left active:scale-[0.99]"
      style={{ transition: "transform 0.2s cubic-bezier(.16,1,.3,1)" }}
    >
      <div className="relative h-[148px] w-full">
        <Image
          src={pexelsPhoto(vendor.photoId, 480, 320)}
          alt={vendor.name}
          fill
          sizes="360px"
          className="object-cover"
          style={vendor.photoCrop ? { objectPosition: vendor.photoCrop } : undefined}
        />
        {rank && (
          <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--wd-ink)]/80 text-[12px] font-bold text-white tabular-nums">
            {rank}
          </span>
        )}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <VerifiedBadge compact />
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              aria-label="북마크"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white"
            >
              <BookmarkSimple size={14} weight={bookmarked ? "fill" : "regular"} />
            </button>
          )}
        </div>
        {onToggleCompare && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`absolute bottom-3 left-3 flex h-7 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-semibold transition-colors ${
              compareSelected ? "bg-[var(--wd-accent)] text-white" : "bg-black/35 text-white"
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                compareSelected ? "border-white bg-white/20" : "border-white/70"
              }`}
            >
              {compareSelected && <Check size={9} weight="bold" />}
            </span>
            비교
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold text-[var(--wd-ink)]">{vendor.name}</h3>
          <RatingRow value={vendor.ratingAvg} />
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[var(--wd-muted)]">
          <MapPin size={12} weight="fill" />
          <span>{vendor.region}</span>
          <span className="text-[var(--wd-border)]">|</span>
          <span>후기 {vendor.reviewCount}</span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[12px] text-[var(--wd-muted)]">평균 실결제가</span>
          <span className="text-[14px] font-bold text-[var(--wd-ink)]">
            <PriceText value={vendor.avgPaidPrice} />
          </span>
        </div>
      </div>
    </button>
  );
}
