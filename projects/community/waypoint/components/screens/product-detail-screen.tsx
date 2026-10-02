"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CaretLeft,
  ChatCircleDots,
  Clock,
  Eye,
  Heart,
  MapPinLine,
  ShareNetwork,
} from "@phosphor-icons/react";
import { Badge, Button, SellerInline, WaypointCard, formatWon } from "@/projects/community/waypoint/components/ui";
import { PRODUCTS, SELLERS, WAYPOINT_SPOTS, picsumId } from "@/projects/community/waypoint/lib/mock-data";

export function ProductDetailScreen({
  productId,
  onBack,
  onOpenChat,
}: {
  productId: string;
  onBack: () => void;
  onOpenChat: (productId: string) => void;
}) {
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const seller = SELLERS.find((s) => s.id === product.sellerId) ?? SELLERS[0];
  const spot = WAYPOINT_SPOTS.find((s) => s.id === product.waypointSpotId);
  const [liked, setLiked] = useState(false);

  const statusTone = product.status === "판매중" ? "success" : product.status === "예약중" ? "warn" : "neutral";

  return (
    <div className="waypoint relative flex h-full flex-col bg-[var(--wp-surface)]">
      <div className="flex-1 overflow-y-auto pb-[104px]">
        <div className="relative h-[340px] w-full">
          <Image src={picsumId(product.photoId, 800, 800)} alt={product.title} fill sizes="393px" className="object-cover" />
          <div className="absolute inset-x-4 top-[59px] flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onBack}
              aria-label="뒤로"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="공유"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white"
            >
              <ShareNetwork size={16} />
            </button>
          </div>
        </div>

        <div className="px-5 pt-5">
          <div className="flex items-center gap-1.5">
            <Badge tone={statusTone}>{product.status}</Badge>
            <Badge tone="neutral">{product.condition}</Badge>
            {product.waypointSpotId && <Badge tone="accent">웨이스팟 거래가능</Badge>}
          </div>
          <h1 className="mt-2.5 text-[19px] font-bold leading-[24px] text-[var(--wp-ink)]">{product.title}</h1>
          <p className="mt-2 tabular-nums text-[24px] font-bold text-[var(--wp-ink)]">{formatWon(product.price)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--wp-muted)]">
            <span className="inline-flex items-center gap-1">
              <MapPinLine size={13} weight="fill" className="text-[var(--wp-accent)]" />
              {product.nearestStation} 도보 {product.etaMin}분
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} />
              {product.postedAt}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={13} />
              조회 {product.viewCount}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span key={t} className="rounded-full bg-[var(--wp-surface-soft)] px-2.5 py-1 text-[11.5px] text-[var(--wp-body)]">
                #{t}
              </span>
            ))}
          </div>

          <p className="mt-5 text-[14.5px] leading-[23px] text-[var(--wp-body)]">{product.description}</p>

          <div className="mt-6 rounded-[16px] border border-[var(--wp-border)] p-4">
            <SellerInline seller={seller} />
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--wp-border)] pt-3 text-center">
              <div>
                <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{seller.dealCount}</p>
                <p className="text-[11px] text-[var(--wp-muted)]">거래완료</p>
              </div>
              <div>
                <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{seller.onTimeRate}%</p>
                <p className="text-[11px] text-[var(--wp-muted)]">시간준수율</p>
              </div>
              <div>
                <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{seller.responseRate}%</p>
                <p className="text-[11px] text-[var(--wp-muted)]">응답률</p>
              </div>
            </div>
          </div>

          {spot && (
            <div className="mt-6">
              <p className="mb-2 text-[13px] font-semibold text-[var(--wp-ink)]">웨이스팟에서 거래 가능해요</p>
              <WaypointCard spot={spot} />
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-[var(--wp-border)] bg-[var(--wp-surface)] px-4 pb-[26px] pt-3">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--wp-border-strong)]"
        >
          <Heart size={19} weight={liked ? "fill" : "regular"} className={liked ? "text-[var(--wp-danger)]" : "text-[var(--wp-body)]"} />
        </button>
        <Button full size="lg" trailingIcon={<ChatCircleDots size={16} weight="fill" />} onClick={() => onOpenChat(product.id)}>
          채팅하기
        </Button>
      </div>
    </div>
  );
}
