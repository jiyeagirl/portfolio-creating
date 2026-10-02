"use client";

import Image from "next/image";
import {
  Camera,
  CaretRight,
  Dress,
  MagnifyingGlass,
  Palette,
  Sparkle,
} from "@phosphor-icons/react";
import { pexelsPhoto, REVIEWS, VENDORS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { VendorCategory } from "@/projects/community/wedit/lib/types";
import { PriceText, RatingRow, SectionHeader } from "@/projects/community/wedit/components/ui";

const CATEGORIES: { key: VendorCategory; label: string; icon: typeof Camera }[] = [
  { key: "studio", label: "스튜디오", icon: Camera },
  { key: "dress", label: "드레스", icon: Dress },
  { key: "makeup", label: "메이크업", icon: Palette },
];

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const ranked = [...VENDORS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const recentReviews = [...REVIEWS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 4);

  return (
    <div className="flex min-h-full w-full flex-col gap-7 pb-[108px] pt-[72px]">
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium text-[var(--wd-muted)]">서연님, 예식까지</p>
            <p className="text-[19px] font-bold text-[var(--wd-ink)]">D-92 남았어요</p>
          </div>
          <span className="rounded-full bg-[var(--wd-accent-soft)] px-3 py-1.5 text-[11.5px] font-semibold text-[var(--wd-accent-strong)]">
            인증 2건
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("explore")}
          className="flex h-12 items-center gap-2 rounded-full border border-[var(--wd-border)] bg-white px-4 text-[13.5px] text-[var(--wd-muted)]"
        >
          <MagnifyingGlass size={17} />
          지역, 업체명으로 검색
        </button>
      </div>

      <div className="px-5">
        <button
          type="button"
          onClick={() => onNavigate("verifyUpload")}
          className="relative block h-[168px] w-full overflow-hidden rounded-[20px] text-left active:scale-[0.99]"
          style={{ transition: "transform 0.2s cubic-bezier(.16,1,.3,1)" }}
        >
          <Image src={pexelsPhoto(14000811, 720, 400)} alt="" fill sizes="360px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
            <p className="text-[18px] font-bold leading-[24px] text-white">
              결제한 사람만
              <br />
              말할 수 있어요
            </p>
            <p className="text-[12px] leading-[17px] text-white/75">
              영수증 · 계약서 인증 후에만 남기는 리얼 후기
            </p>
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[var(--wd-ink)]">
              지금 인증하기
              <CaretRight size={12} weight="bold" />
            </span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 px-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onNavigate("explore", { category: c.key })}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--wd-border)] bg-white py-4 active:bg-[var(--wd-surface-tint)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--wd-surface-tint)] text-[var(--wd-accent)]">
              <c.icon size={20} weight="duotone" />
            </span>
            <span className="text-[12.5px] font-semibold text-[var(--wd-ink)]">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="실시간 인기 업체"
          subtitle="지금 가장 많이 찾는 인증 업체"
          actionLabel="전체보기"
          onAction={() => onNavigate("explore")}
        />
        <div className="flex flex-col gap-2 px-5">
          {ranked.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onNavigate("vendorDetail", { id: v.id })}
              className="flex items-center gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-2.5 active:bg-[var(--wd-surface-tint)]"
            >
              <span className="w-5 shrink-0 text-center text-[15px] font-bold tabular-nums text-[var(--wd-accent)]">
                {i + 1}
              </span>
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={pexelsPhoto(v.photoId, 120, 120)}
                  alt={v.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  style={v.photoCrop ? { objectPosition: v.photoCrop } : undefined}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[var(--wd-ink)]">{v.name}</p>
                <p className="truncate text-[11.5px] text-[var(--wd-muted)]">{v.region}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <RatingRow value={v.ratingAvg} size={12} />
                <span className="text-[11px] font-semibold text-[var(--wd-body)]">
                  <PriceText value={v.avgPaidPrice} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => onNavigate("explore", { category: "budget" })}
          className="flex w-[168px] shrink-0 flex-col justify-between gap-6 rounded-2xl bg-[var(--wd-ink)] p-4 text-left"
        >
          <span className="text-[11.5px] font-medium text-white/60">기획전</span>
          <span className="text-[15px] font-bold leading-[20px] text-white">
            가성비 좋은
            <br />
            업체 모음
          </span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("explore", { category: "popular" })}
          className="flex w-[168px] shrink-0 flex-col justify-between gap-6 rounded-2xl bg-[var(--wd-accent)] p-4 text-left"
        >
          <span className="text-[11.5px] font-medium text-white/70">기획전</span>
          <span className="text-[15px] font-bold leading-[20px] text-white">
            리뷰 많은
            <br />
            인기 업체
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="최근 등록된 인증 리뷰"
          actionLabel="전체보기"
          onAction={() => onNavigate("reviews")}
        />
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recentReviews.map((r) => {
            const vendor = VENDORS.find((v) => v.id === r.vendorId);
            if (!vendor) return null;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onNavigate("vendorDetail", { id: vendor.id })}
                className="w-[220px] shrink-0 overflow-hidden rounded-2xl border border-[var(--wd-border)] bg-white text-left"
              >
                <div className="relative h-[120px] w-full">
                  <Image
                    src={pexelsPhoto(r.photos[0].photoId, 440, 240)}
                    alt=""
                    fill
                    sizes="220px"
                    className="object-cover"
                    style={r.photos[0].crop ? { objectPosition: r.photos[0].crop } : undefined}
                  />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[12.5px] font-semibold text-[var(--wd-ink)]">
                      {vendor.name}
                    </span>
                    <RatingRow value={r.ratingAvg} size={11} />
                  </div>
                  <p className="line-clamp-2 text-[11.5px] leading-[16px] text-[var(--wd-muted)]">
                    {r.content}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5">
        <button
          type="button"
          onClick={() => onNavigate("community")}
          className="flex w-full items-center gap-3 rounded-2xl bg-[var(--wd-surface-tint)] p-4 active:bg-[#fbe5ea]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--wd-accent)]">
            <Sparkle size={19} weight="fill" />
          </span>
          <div className="flex-1 text-left">
            <p className="text-[13.5px] font-semibold text-[var(--wd-ink)]">
              궁금한 게 있다면? AI가 먼저 답해드려요
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--wd-muted)]">커뮤니티에서 질문 남기기</p>
          </div>
          <CaretRight size={16} className="text-[var(--wd-muted)]" />
        </button>
      </div>
    </div>
  );
}
