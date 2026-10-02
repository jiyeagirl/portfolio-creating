"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Clock, Heart, MapPin, Phone, Tag } from "@phosphor-icons/react";
import { STORES } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Avatar,
  Badge,
  CONTAINER,
  Display,
  EmptyState,
  SecondaryButton,
  StarRating,
} from "@/projects/community/locly/components/site/ui";

export function StoreDetailScreen({ storeId, onNavigate }: { storeId: string; onNavigate: NavigateFn }) {
  const store = STORES.find((s) => s.id === storeId) ?? STORES[0];
  const [favorited, setFavorited] = useState(false);

  return (
    <div className={`${CONTAINER} py-14 lg:py-20`}>
      <div className="mx-auto max-w-[920px]">
        <button
          onClick={() => onNavigate("stores")}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--lc-muted)]"
        >
          <ArrowLeft size={15} />
          동네 가게
        </button>

        <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-[16px]">
          <Image src={store.image} alt={store.name} fill sizes="920px" className="object-cover" priority />
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Badge>{store.category}</Badge>
            <Display as="h1" size="md" className="mt-4">
              {store.name}
            </Display>
            <div className="mt-3 flex items-center gap-2 text-[14px] text-[var(--lc-muted)]">
              <StarRating rating={store.rating} size={14} />
              <span className="font-medium text-[var(--lc-ink)]">{store.rating.toFixed(1)}</span>
              <span>후기 {store.reviewCount}개</span>
            </div>

            {store.promo && (
              <div className="mt-6 flex items-center gap-2 rounded-[12px] bg-[var(--lc-primary)] px-5 py-4 text-[15px] font-medium text-[var(--lc-on-primary)]">
                <Tag size={16} weight="fill" />
                {store.promo}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {store.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--lc-surface-card)] px-3 py-1 text-[13px] text-[var(--lc-body)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <section className="mt-12 border-t border-[var(--lc-hairline)] pt-8">
              <h2 className="text-[18px] font-medium text-[var(--lc-ink)]">방문자 후기</h2>
              {store.reviews.length > 0 ? (
                <div className="mt-6 flex flex-col divide-y divide-[var(--lc-hairline)]">
                  {store.reviews.map((review, i) => (
                    <div key={i} className="flex gap-3 py-5 first:pt-0">
                      <Avatar name={review.author} size={34} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-medium text-[var(--lc-ink)]">{review.author}</p>
                          <StarRating rating={review.rating} size={11} />
                          <span className="text-[13px] text-[var(--lc-muted-soft)]">{review.createdAt}</span>
                        </div>
                        <p className="mt-1.5 text-[15px] leading-[1.6] text-[var(--lc-body)]">{review.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    icon={<Tag size={22} />}
                    title="아직 후기가 없어요"
                    description="첫 방문 후기를 남겨 이웃에게 알려주세요."
                  />
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-surface-card)] p-8 lg:sticky lg:top-24">
            <dl className="flex flex-col gap-5">
              {[
                { icon: <MapPin size={17} />, label: "주소", value: store.address },
                { icon: <Clock size={17} />, label: "영업시간", value: store.hours },
                { icon: <Phone size={17} />, label: "전화", value: store.phone },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[var(--lc-muted)]">{row.icon}</span>
                  <div className="min-w-0">
                    <dt className="text-[12px] text-[var(--lc-muted-soft)]">{row.label}</dt>
                    <dd className="mt-0.5 text-[15px] leading-[1.5] text-[var(--lc-ink)]">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <SecondaryButton full onClick={() => setFavorited((v) => !v)}>
                <Heart
                  size={15}
                  weight={favorited ? "fill" : "regular"}
                  className={favorited ? "text-[var(--lc-primary)]" : ""}
                />
                {favorited ? "즐겨찾기 완료" : "즐겨찾기 추가"}
              </SecondaryButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
