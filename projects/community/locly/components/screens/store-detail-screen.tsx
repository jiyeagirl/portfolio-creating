"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Clock, Heart, MapPin, Phone, Tag } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { STORES } from "@/projects/community/locly/lib/mock-data";
import { Avatar, Badge, EmptyState, SecondaryButton, StarRating } from "@/projects/community/locly/components/layout/ui";

export function StoreDetailScreen({ storeId, onNavigate }: { storeId: string; onNavigate: NavigateFn }) {
  const store = STORES.find((s) => s.id === storeId) ?? STORES[0];
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-24 pt-8 lg:px-0">
      <button
        onClick={() => onNavigate("stores")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
      >
        <ArrowLeft size={16} />
        동네 가게 목록으로
      </button>

      <div className="relative mt-5 h-[280px] w-full overflow-hidden rounded-2xl md:h-[340px]">
        <Image src={store.image} alt={store.name} fill className="object-cover" />
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="neutral">{store.category}</Badge>
              <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">{store.name}</h1>
              <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px] text-[var(--locly-muted)]">
                <StarRating rating={store.rating} />
                <span className="font-semibold text-[var(--locly-ink)]">{store.rating.toFixed(1)}</span>
                <span>후기 {store.reviewCount}개</span>
              </div>
            </div>
            <button
              onClick={() => setFavorited((v) => !v)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--locly-border)] transition-colors hover:border-[var(--locly-danger)]"
            >
              <Heart size={17} weight={favorited ? "fill" : "regular"} className={favorited ? "text-[var(--locly-danger)]" : "text-[var(--locly-muted)]"} />
            </button>
          </div>

          {store.promo && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--locly-warning-soft)] px-4 py-3 text-[13px] font-semibold text-[var(--locly-warning)]">
              <Tag size={15} />
              {store.promo}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {store.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--locly-surface)] px-3 py-1 text-[12.5px] text-[var(--locly-muted)]">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-[15px] font-bold text-[var(--locly-ink)]">방문자 후기</h2>
            {store.reviews.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4">
                {store.reviews.map((review, i) => (
                  <div key={i} className="flex gap-3 border-b border-[var(--locly-border)] pb-4 last:border-0">
                    <Avatar name={review.author} size={32} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13.5px] font-semibold text-[var(--locly-ink)]">{review.author}</p>
                        <StarRating rating={review.rating} size={11} />
                        <span className="text-[12px] text-[var(--locly-muted)]">{review.createdAt}</span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--locly-muted)]">{review.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState icon={<Tag size={20} />} title="아직 후기가 없어요" description="첫 방문 후기를 남겨 이웃에게 알려주세요." />
              </div>
            )}
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{store.address}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <Clock size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{store.hours}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <Phone size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{store.phone}</span>
          </div>
          <SecondaryButton full onClick={() => setFavorited((v) => !v)}>
            <Heart size={15} weight={favorited ? "fill" : "regular"} />
            {favorited ? "즐겨찾기 완료" : "즐겨찾기 추가"}
          </SecondaryButton>
        </aside>
      </div>
    </div>
  );
}
