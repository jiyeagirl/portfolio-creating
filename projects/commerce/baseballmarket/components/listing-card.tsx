"use client";

import Image from "next/image";
import { Heart, ChatCircle, Warning, ShieldCheck } from "@phosphor-icons/react";
import { Badge, TeamMark } from "@/projects/commerce/baseballmarket/components/ui";
import {
  KRW,
  overFaceRatio,
  photo,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { Listing } from "@/projects/commerce/baseballmarket/lib/types";

/* 매물 카드. 그림자를 쓰지 않으므로 카드는 크림 사다리 위에 색면으로만 앉는다.
   티켓은 정가 대비 판매가를 카드 단계에서 이미 드러낸다 — spec Key Focus 2번
   (암표 방지를 운영 관점에서 설계했음을 시각적으로 전달)의 사용자 쪽 표현이다. */

export function PriceCompare({ listing, size = "md" }: { listing: Listing; size?: "sm" | "md" }) {
  if (listing.category !== "티켓" || !listing.facePrice) return null;
  const ratio = overFaceRatio(listing);
  const over = ratio > 10;
  const fair = ratio <= 10;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-[17px] ${
        over
          ? "bg-[var(--bm-error-soft)] text-[var(--bm-error-deep)]"
          : "bg-[var(--bm-success-soft)] text-[var(--bm-link-deep)]"
      } ${size === "sm" ? "text-[11px]" : ""}`}
    >
      {over ? <Warning size={13} weight="fill" /> : <ShieldCheck size={13} weight="fill" />}
      정가 {KRW(listing.facePrice)}
      <span className="bm-num">
        {ratio > 0 ? `+${ratio}%` : `${ratio}%`}
      </span>
      {fair && ratio <= 0 ? " 이하" : ""}
    </span>
  );
}

export function ListingCard({
  listing,
  onOpen,
  liked,
  onToggleLike,
}: {
  listing: Listing;
  onOpen: () => void;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const done = listing.status === "거래완료";
  return (
    <article className="group relative">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden rounded-[12px] text-left"
      >
        <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-[var(--bm-surface-strong)]">
          <Image
            src={photo(listing.photoId, 640, 480)}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover ${done ? "grayscale" : ""}`}
            unoptimized
          />
          {done && (
            <span className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,10,0.55)] text-[14px] font-semibold text-white">
              거래완료
            </span>
          )}
          {listing.status === "예약중" && (
            <span className="absolute left-3 top-3">
              <Badge tone="ink">예약중</Badge>
            </span>
          )}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleLike}
        aria-label={liked ? "찜 해제" : "찜하기"}
        aria-pressed={liked}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bm-canvas)] text-[var(--bm-body)] bm-press"
      >
        <Heart size={17} weight={liked ? "fill" : "regular"} color={liked ? "var(--bm-error)" : undefined} />
      </button>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <TeamMark id={listing.team} size={20} />
          <span className="truncate text-[12px] font-medium leading-[17px] text-[var(--bm-muted)]">
            {teamLabel(listing.team)}
          </span>
          <span className="text-[var(--bm-hairline-strong)]">|</span>
          <span className="shrink-0 text-[12px] leading-[17px] text-[var(--bm-muted)]">
            {listing.condition}
          </span>
        </div>

        <button type="button" onClick={onOpen} className="mt-1.5 block w-full text-left">
          <h3 className="line-clamp-2 text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
            {listing.title}
          </h3>
        </button>

        <p className="bm-num mt-1.5 text-[18px] font-semibold leading-[25px] text-[var(--bm-ink)]">
          {KRW(listing.price)}
          {listing.negotiable && (
            <span className="ml-1.5 text-[13px] font-medium text-[var(--bm-muted)]">제안 가능</span>
          )}
        </p>

        {listing.category === "티켓" && (
          <div className="mt-2">
            <PriceCompare listing={listing} />
          </div>
        )}

        <div className="mt-2 flex items-center gap-3 text-[12px] leading-[17px] text-[var(--bm-muted-soft)]">
          <span className="truncate">{listing.dong}</span>
          <span className="ml-auto flex shrink-0 items-center gap-1">
            <Heart size={12} />
            <span className="bm-num">{listing.likes}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <ChatCircle size={12} />
            <span className="bm-num">{listing.chats}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

/** 리스트형(가로) 매물 행. 마이페이지, 채팅 상단에서 쓴다. */
export function ListingRow({
  listing,
  onOpen,
  trailing,
}: {
  listing: Listing;
  onOpen?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <button
        type="button"
        onClick={onOpen}
        className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--bm-surface-strong)]"
      >
        <Image
          src={photo(listing.photoId, 200, 200)}
          alt={listing.title}
          fill
          sizes="72px"
          className="object-cover"
          unoptimized
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
          {listing.title}
        </p>
        <p className="bm-num mt-1 text-[15px] font-semibold leading-[21px] text-[var(--bm-body-strong)]">
          {KRW(listing.price)}
        </p>
        <p className="mt-0.5 truncate text-[12px] leading-[17px] text-[var(--bm-muted)]">
          {teamLabel(listing.team)} | {listing.condition} | {listing.dong}
        </p>
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
