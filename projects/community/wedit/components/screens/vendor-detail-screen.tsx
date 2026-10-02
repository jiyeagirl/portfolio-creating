"use client";

import { useState } from "react";
import Image from "next/image";
import { BookmarkSimple, CaretLeft, Check, MapPin, Minus, Scales, ThumbsUp } from "@phosphor-icons/react";
import { pexelsPhoto, REVIEWS, VENDORS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import { Avatar, Button, PriceText, RatingRow, Tag, VerifiedBadge } from "@/projects/community/wedit/components/ui";

const RATING_ROWS: { key: "kindness" | "priceSatisfaction" | "resultSatisfaction" | "afterCare"; label: string }[] = [
  { key: "kindness", label: "친절도" },
  { key: "priceSatisfaction", label: "가격 만족도" },
  { key: "resultSatisfaction", label: "결과물 만족도" },
  { key: "afterCare", label: "사후 대응" },
];

export function VendorDetailScreen({ onNavigate, vendorId }: { onNavigate: NavigateFn; vendorId: string }) {
  const vendor = VENDORS.find((v) => v.id === vendorId) ?? VENDORS[0];
  const reviews = REVIEWS.filter((r) => r.vendorId === vendor.id);
  const [bookmarked, setBookmarked] = useState(false);
  const [helped, setHelped] = useState<Set<string>>(new Set());

  const toggleHelped = (id: string) => {
    setHelped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-[104px]">
      <div className="relative h-[260px] w-full shrink-0">
        <Image
          src={pexelsPhoto(vendor.photoId, 720, 520)}
          alt={vendor.name}
          fill
          sizes="393px"
          className="object-cover"
          style={vendor.photoCrop ? { objectPosition: vendor.photoCrop } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <div className="absolute inset-x-4 top-[59px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            aria-label="뒤로"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white"
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => setBookmarked((v) => !v)}
            aria-label="북마크"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white"
          >
            <BookmarkSimple size={18} weight={bookmarked ? "fill" : "regular"} />
          </button>
        </div>
        <div className="absolute bottom-4 left-5">
          <VerifiedBadge />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-5 pt-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-bold text-[var(--wd-ink)]">{vendor.name}</h1>
            <RatingRow value={vendor.ratingAvg} size={15} />
          </div>
          <div className="flex items-center gap-1 text-[12.5px] text-[var(--wd-muted)]">
            <MapPin size={13} weight="fill" />
            <span>{vendor.address}</span>
          </div>
          <p className="text-[13px] leading-[19px] text-[var(--wd-body)]">{vendor.summary}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {vendor.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--wd-border)] bg-white p-4">
          <p className="text-[12.5px] font-semibold text-[var(--wd-ink)]">항목별 평점</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {RATING_ROWS.map((r) => (
              <div key={r.key} className="flex items-center gap-3">
                <span className="w-[76px] shrink-0 text-[12px] text-[var(--wd-muted)]">{r.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--wd-surface-tint)]">
                  <div
                    className="h-full rounded-full bg-[var(--wd-accent)]"
                    style={{ width: `${(vendor.ratingBreakdown[r.key] / 5) * 100}%` }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-[12px] font-semibold tabular-nums text-[var(--wd-ink)]">
                  {vendor.ratingBreakdown[r.key].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--wd-surface-tint)] p-4">
          <p className="text-[12px] text-[var(--wd-muted)]">인증된 회원 평균 실결제가</p>
          <p className="mt-1 text-[22px] font-bold tabular-nums text-[var(--wd-accent-strong)]">
            <PriceText value={vendor.avgPaidPrice} />
          </p>
          <p className="mt-1 text-[11px] text-[var(--wd-muted)]">
            결제 인증 리뷰 {vendor.verifiedCount}건 기준
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-[var(--wd-ink)]">계약 구성</p>
          <div className="flex flex-col divide-y divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white px-4">
            {vendor.packageItems.map((p) => (
              <div key={p.label} className="flex items-center gap-2 py-2.5">
                {p.included ? (
                  <Check size={15} weight="bold" className="shrink-0 text-[var(--wd-accent)]" />
                ) : (
                  <Minus size={13} className="shrink-0 text-[var(--wd-muted)]" />
                )}
                <span className={`text-[13px] ${p.included ? "text-[var(--wd-ink)]" : "text-[var(--wd-muted)] line-through"}`}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-semibold text-[var(--wd-ink)]">옵션 추가 비용</p>
          <div className="flex flex-col divide-y divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white px-4">
            {vendor.optionItems.map((o) => (
              <div key={o.label} className="flex items-center justify-between py-2.5">
                <span className="text-[13px] text-[var(--wd-body)]">{o.label}</span>
                <span className="text-[13px] font-semibold tabular-nums text-[var(--wd-ink)]">
                  +<PriceText value={o.price} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[var(--wd-ink)]">인증 리뷰 {reviews.length}</p>
          </div>
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-4">
                <div className="flex items-center gap-2.5">
                  <Avatar initial={r.authorInitial} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-[var(--wd-ink)]">{r.authorLabel}</p>
                    <p className="text-[10.5px] text-[var(--wd-muted)]">{r.createdAt}</p>
                  </div>
                  <RatingRow value={r.ratingAvg} size={12} />
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
                <button
                  type="button"
                  onClick={() => toggleHelped(r.id)}
                  className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                    helped.has(r.id)
                      ? "border-[var(--wd-accent)] bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)]"
                      : "border-[var(--wd-border)] text-[var(--wd-muted)]"
                  }`}
                >
                  <ThumbsUp size={12} weight={helped.has(r.id) ? "fill" : "regular"} />
                  도움이 돼요 {r.helpfulCount + (helped.has(r.id) ? 1 : 0)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-[24px] z-30 flex gap-2">
        <button
          type="button"
          onClick={() => setBookmarked((v) => !v)}
          aria-label="북마크"
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border ${
            bookmarked
              ? "border-[var(--wd-accent)] bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)]"
              : "border-[var(--wd-border)] bg-white text-[var(--wd-muted)]"
          }`}
        >
          <BookmarkSimple size={20} weight={bookmarked ? "fill" : "regular"} />
        </button>
        <Button
          fullWidth
          size="lg"
          icon={<Scales size={13} weight="bold" />}
          onClick={() => onNavigate("compare", { ids: [vendor.id] })}
        >
          업체 비교에 추가
        </Button>
      </div>
    </div>
  );
}
