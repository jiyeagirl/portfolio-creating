"use client";

import Image from "next/image";
import { ChatCircleDots, Eye, Heart, Package } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Avatar, Badge, Button, DongHoTag, ReputationBar, formatWon } from "@/projects/community/enclave/components/ui";
import { PRODUCTS, picsumId, resolveResident } from "@/projects/community/enclave/lib/mock-data";

export function ProductDetailScreen({
  productId,
  onBack,
  onOpenChat,
  liked,
  onToggleLike,
}: {
  productId: string;
  onBack: () => void;
  onOpenChat: (productId: string) => void;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const seller = resolveResident(product.sellerId);

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-surface)]">
      <ScreenHeader
        title="상품 정보"
        onBack={onBack}
        className="bg-[var(--ec-surface)] border-[var(--ec-border)]"
        backButtonClassName="text-[var(--ec-ink)] hover:bg-[var(--ec-surface-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--ec-ink)]"
      />

      <div className="flex-1 overflow-y-auto ec-scroll pb-[104px]">
        <div className="relative h-[280px] w-full bg-[var(--ec-surface-sunken)]">
          <Image src={picsumId(product.photoId, 800, 700)} alt={product.title} fill sizes="393px" className="object-cover" />
          {product.status !== "판매중" && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--ec-ink)]">
                {product.status}
              </span>
            </span>
          )}
        </div>

        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={() => onOpenChat(seller.id)}
            className="flex w-full items-center gap-3 rounded-[14px] border border-[var(--ec-border)] p-3 text-left"
          >
            <Avatar size={40} tone="neutral" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[13.5px] font-medium text-[var(--ec-ink)]">{seller.nickname}</p>
                <DongHoTag dong={seller.dong} ho={seller.ho} />
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="w-[72px]">
                  <ReputationBar value={seller.reputationScore} />
                </div>
                <span className="tabular-nums text-[11.5px] text-[var(--ec-muted)]">이웃평판 {seller.reputationScore}점</span>
              </div>
            </div>
          </button>
        </div>

        <div className="px-5 pt-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="neutral">{product.category}</Badge>
            <Badge tone="neutral">{product.condition}</Badge>
            {product.lockerAvailable && (
              <Badge tone="accent" icon={<Package size={11} weight="fill" />}>
                무인택배함 픽업 가능
              </Badge>
            )}
          </div>
          <h1 className="mt-3 text-[19px] font-bold leading-[25px] text-[var(--ec-ink)]">{product.title}</h1>
          <p className="mt-2 tabular-nums text-[24px] font-bold text-[var(--ec-ink)]">{formatWon(product.price)}</p>

          <div className="mt-4 flex items-center gap-3 text-[12.5px] text-[var(--ec-muted)]">
            <span>{product.postedAt} 등록</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={13} />
              {product.viewCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <ChatCircleDots size={13} />
              {product.chatCount}
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-[14.5px] leading-[22px] text-[var(--ec-body)]">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span key={t} className="rounded-full bg-[var(--ec-surface-soft)] px-2.5 py-1 text-[11.5px] text-[var(--ec-body)]">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-[var(--ec-border)] bg-[var(--ec-surface)] px-5 pb-[34px] pt-3">
        <button
          type="button"
          onClick={onToggleLike}
          aria-pressed={liked}
          aria-label="찜하기"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--ec-border-strong)]"
        >
          <Heart size={20} weight={liked ? "fill" : "regular"} className={liked ? "text-[var(--ec-danger)]" : "text-[var(--ec-body)]"} />
        </button>
        <Button full size="lg" onClick={() => onOpenChat(seller.id)}>
          채팅으로 문의하기
        </Button>
      </div>
    </div>
  );
}
