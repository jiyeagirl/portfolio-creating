"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Flag, MagnifyingGlass, Star, ThumbsUp } from "@phosphor-icons/react";
import { pexelsPhoto, REVIEWS, VENDORS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { VendorCategory } from "@/projects/community/wedit/lib/types";
import { Avatar, EmptyState, PriceText, RatingRow, Tag, VerifiedBadge } from "@/projects/community/wedit/components/ui";

type Filter = "all" | VendorCategory;
type SortMode = "latest" | "rating" | "priceAsc";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "studio", label: "스튜디오" },
  { key: "dress", label: "드레스" },
  { key: "makeup", label: "메이크업" },
];

const SORT_LABEL: Record<SortMode, string> = {
  latest: "최신순",
  rating: "평점순",
  priceAsc: "실결제가 낮은 순",
};

export function ReviewsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortMode>("latest");
  const [query, setQuery] = useState("");
  const [helped, setHelped] = useState<Set<string>>(new Set());
  const [reported, setReported] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    let list = REVIEWS.map((r) => ({ review: r, vendor: VENDORS.find((v) => v.id === r.vendorId)! }));
    if (filter !== "all") list = list.filter((row) => row.vendor.category === filter);
    if (query.trim()) {
      const q = query.trim();
      list = list.filter((row) => row.vendor.name.includes(q) || row.review.content.includes(q));
    }
    list = [...list].sort((a, b) => {
      if (sort === "rating") return b.review.ratingAvg - a.review.ratingAvg;
      if (sort === "priceAsc") return a.review.paidPrice - b.review.paidPrice;
      return a.review.createdAt < b.review.createdAt ? 1 : -1;
    });
    return list;
  }, [filter, sort, query]);

  const toggleHelped = (id: string) =>
    setHelped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleReport = (id: string) =>
    setReported((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex min-h-full w-full flex-col pb-[108px] pt-[68px]">
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[19px] font-bold text-[var(--wd-ink)]">인증 리뷰</h1>
          <VerifiedBadge compact />
        </div>
        <div className="flex h-11 items-center gap-2 rounded-full border border-[var(--wd-border)] bg-white px-4">
          <MagnifyingGlass size={17} className="text-[var(--wd-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="업체명, 후기 내용으로 검색"
            className="h-full flex-1 bg-transparent text-[13.5px] text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                  filter === t.key
                    ? "bg-[var(--wd-ink)] text-white"
                    : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="shrink-0 rounded-full border border-[var(--wd-border)] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[var(--wd-body)] outline-none"
          >
            {(Object.keys(SORT_LABEL) as SortMode[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Star size={24} weight="duotone" />}
          title="조건에 맞는 리뷰가 없어요"
          body="검색어나 필터를 조정해서 다시 찾아보세요."
        />
      ) : (
        <div className="mt-4 flex flex-col gap-3 px-5">
          {rows.map(({ review: r, vendor }) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-4">
              <button
                type="button"
                onClick={() => onNavigate("vendorDetail", { id: vendor.id })}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[var(--wd-ink)]">{vendor.name}</span>
                  <Tag>{vendor.region}</Tag>
                </div>
                <RatingRow value={r.ratingAvg} size={12} />
              </button>
              <div className="flex items-center gap-2.5">
                <Avatar initial={r.authorInitial} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--wd-body)]">{r.authorLabel}</p>
                  <p className="text-[10.5px] text-[var(--wd-muted)]">{r.createdAt}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Tag tone="accent">
                  <PriceText value={r.paidPrice} /> 결제
                </Tag>
                <Tag>{r.packageSummary}</Tag>
              </div>
              <p className="text-[13px] leading-[19px] text-[var(--wd-body)]">{r.content}</p>
              {r.photos.length > 0 && (
                <div className="flex gap-2">
                  {r.photos.map((p, i) => (
                    <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={pexelsPhoto(p.photoId, 140, 140)}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        style={p.crop ? { objectPosition: p.crop } : undefined}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleHelped(r.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium ${
                    helped.has(r.id)
                      ? "border-[var(--wd-accent)] bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)]"
                      : "border-[var(--wd-border)] text-[var(--wd-muted)]"
                  }`}
                >
                  <ThumbsUp size={12} weight={helped.has(r.id) ? "fill" : "regular"} />
                  도움이 돼요 {r.helpfulCount + (helped.has(r.id) ? 1 : 0)}
                </button>
                <button
                  type="button"
                  onClick={() => toggleReport(r.id)}
                  className={`flex items-center gap-1 text-[11.5px] ${
                    reported.has(r.id) ? "text-[var(--wd-status-rejected-fg)]" : "text-[var(--wd-muted)]"
                  }`}
                >
                  <Flag size={12} weight={reported.has(r.id) ? "fill" : "regular"} />
                  {reported.has(r.id) ? "신고 접수됨" : "신고하기"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
