"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretRight, Check, Heart, Lightning, Star } from "@phosphor-icons/react";
import cover from "@/projects/platform/lumi/assets/cover-arcade.jpg";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { PassTier } from "@/projects/platform/lumi/lib/types";
import {
  CATEGORY_META,
  PASS_BY_TIER,
  expertById,
  formatWon,
  reviewsOf,
} from "@/projects/platform/lumi/lib/mock-data";
import {
  AppBar,
  Badge,
  ExpertAvatar,
  Stars,
  StatusPill,
} from "@/projects/platform/lumi/components/ui";

export function ExpertDetailScreen({
  expertId,
  onNavigate,
  liked,
  onToggleFavorite,
  selectedTier,
  onSelectTier,
}: {
  expertId: string;
  onNavigate: NavigateFn;
  liked: boolean;
  onToggleFavorite: () => void;
  selectedTier: PassTier;
  onSelectTier: (tier: PassTier) => void;
}) {
  const expert = expertById(expertId);
  const reviews = reviewsOf(expert.id);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [slotDate, setSlotDate] = useState(expert.slots.find((s) => s.times.length > 0)?.date ?? "");

  const tier = expert.tiers.includes(selectedTier) ? selectedTier : expert.tiers[0];
  const activeSlot = expert.slots.find((s) => s.date === slotDate);
  const totalRatings = expert.ratingBreakdown.reduce((sum, r) => sum + r.count, 0);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div className="lm-enter flex min-h-full flex-col">
      <AppBar
        title={expert.name}
        subtitle={CATEGORY_META[expert.category].label}
        onBack={() => onNavigate("experts")}
        right={
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={liked ? "찜 해제" : "찜하기"}
            aria-pressed={liked}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--lm-ink)]"
          >
            <Heart
              size={19}
              weight={liked ? "fill" : "regular"}
              className={liked ? "text-[var(--lm-danger)]" : ""}
            />
          </button>
        }
      />

      <div className="relative">
        <Image
          src={cover}
          alt="따뜻한 빛이 들어오는 석조 회랑"
          placeholder="blur"
          className="h-[132px] w-full object-cover"
          sizes="393px"
        />
        <span className="absolute inset-0 bg-gradient-to-b from-[rgba(13,11,28,0.25)] to-[rgba(13,11,28,0.72)]" />
      </div>

      <section className="relative z-10 -mt-10 px-5">
        <span className="inline-block rounded-full border-[3px] border-[var(--lm-canvas)]">
          <ExpertAvatar expert={expert} size={76} />
        </span>

        <div className="mt-2.5 flex items-center gap-1.5">
          <h2 className="text-[21px] font-bold tracking-tight">{expert.name}</h2>
          {expert.isNew && <Badge tone="accent">신규</Badge>}
        </div>
        <p className="lm-num mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[var(--lm-muted)]">
          <Star size={12} weight="fill" className="text-[var(--lm-live)]" />
          <span className="font-bold text-[var(--lm-ink)]">{expert.rating.toFixed(2)}</span>
          후기 {expert.reviewCount.toLocaleString("ko-KR")}
          <span aria-hidden>·</span>
          {expert.years}년차
        </p>

        <p className="mt-3.5 text-[15px] font-semibold leading-relaxed">{expert.headline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <StatusPill status={expert.status} waitMinutes={expert.waitMinutes} />
          {expert.styleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--lm-surface)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--lm-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 지표는 카드 대신 얇은 구분선으로 나눈다. */}
      <section className="mt-5 px-5">
        <dl className="lm-num grid grid-cols-4 divide-x divide-[var(--lm-border)] rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] py-3.5">
          {[
            { label: "누적 상담", value: `${(expert.sessionCount / 1000).toFixed(1)}천` },
            { label: "응답률", value: `${expert.responseRate}%` },
            { label: "재상담률", value: `${expert.repeatRate}%` },
            { label: "경력", value: `${expert.years}년` },
          ].map((stat) => (
            <div key={stat.label} className="px-1 text-center">
              <dt className="text-[11px] text-[var(--lm-muted)]">{stat.label}</dt>
              <dd className="mt-1 text-[14.5px] font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-7 px-5">
        <h3 className="text-[16px] font-bold tracking-tight">상담사 소개</h3>
        <p className="mt-2.5 whitespace-pre-line text-[13.5px] leading-[1.75] text-[var(--lm-muted)]">
          {expert.intro}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {expert.specialties.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--lm-border)] px-2.5 py-1 text-[12px] font-semibold text-[var(--lm-ink)]"
            >
              {item}
            </span>
          ))}
        </div>
        <ul className="mt-4 space-y-1.5">
          {expert.career.map((line) => (
            <li key={line} className="flex gap-2 text-[13px] leading-relaxed text-[var(--lm-muted)]">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--lm-border)]" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-7 px-5">
        <h3 className="text-[16px] font-bold tracking-tight">상담권 선택</h3>
        <p className="mt-1 text-[12.5px] text-[var(--lm-muted)]">
          이 상담사는 {expert.tiers.map((t) => PASS_BY_TIER[t].name).join(", ")} 상담권을 받습니다
        </p>
        <div className="mt-3 space-y-2">
          {expert.tiers.map((key) => {
            const pass = PASS_BY_TIER[key];
            const active = tier === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectTier(key)}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                  active
                    ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? "border-[var(--lm-accent)] bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                      : "border-[var(--lm-border)]"
                  }`}
                >
                  {active && <Check size={12} weight="bold" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="lm-num block text-[14.5px] font-bold">
                    {pass.name} {pass.minutes}분
                  </span>
                  <span className="mt-0.5 block text-[12px] text-[var(--lm-muted)]">
                    {pass.summary}
                  </span>
                </span>
                <span className="lm-num shrink-0 text-right">
                  <span className="block text-[14.5px] font-bold">{formatWon(pass.price)}원</span>
                  <span className="block text-[11px] text-[var(--lm-muted)]">
                    분당 {formatWon(pass.perMinute)}원
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7 px-5">
        <h3 className="text-[16px] font-bold tracking-tight">상담 가능 시간</h3>
        <div className="lm-scroll-x mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {expert.slots.map((slot) => {
            const disabled = slot.times.length === 0;
            return (
              <button
                key={slot.date}
                type="button"
                disabled={disabled}
                onClick={() => setSlotDate(slot.date)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  slotDate === slot.date
                    ? "bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                    : disabled
                      ? "bg-[var(--lm-surface)] text-[var(--lm-border)]"
                      : "bg-[var(--lm-surface)] text-[var(--lm-muted)]"
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>

        {activeSlot && activeSlot.times.length > 0 ? (
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {activeSlot.times.map((t) => (
              <span
                key={t.time}
                className={`lm-num rounded-xl border py-2 text-center text-[12.5px] font-semibold ${
                  t.taken
                    ? "border-[var(--lm-border)] text-[var(--lm-border)] line-through"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)] text-[var(--lm-ink)]"
                }`}
              >
                {t.time}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-[var(--lm-surface)] px-4 py-3 text-[12.5px] text-[var(--lm-muted)]">
            이 날짜는 예약을 받지 않습니다. 다른 날짜를 선택해 주세요.
          </p>
        )}
      </section>

      <section className="mt-7 px-5">
        <div className="flex items-end justify-between">
          <h3 className="text-[16px] font-bold tracking-tight">
            후기 <span className="lm-num text-[var(--lm-muted)]">{expert.reviewCount.toLocaleString("ko-KR")}</span>
          </h3>
          <span className="lm-num text-[13px] font-bold">
            {expert.rating.toFixed(2)}
            <span className="ml-1 font-normal text-[var(--lm-muted)]">/ 5</span>
          </span>
        </div>

        <div className="mt-3 space-y-1.5 rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4">
          {expert.ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2.5">
              <span className="lm-num w-5 text-[11.5px] text-[var(--lm-muted)]">{row.stars}점</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--lm-surface)]">
                <span
                  className="block h-full rounded-full bg-[var(--lm-accent)]"
                  style={{ width: `${Math.round((row.count / totalRatings) * 100)}%` }}
                />
              </span>
              <span className="lm-num w-10 text-right text-[11.5px] text-[var(--lm-muted)]">
                {row.count.toLocaleString("ko-KR")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-2.5">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4"
            >
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <span className="lm-num text-[12px] font-semibold">{review.author}</span>
                <span className="lm-num ml-auto text-[11.5px] text-[var(--lm-muted)]">
                  {review.createdAt}
                </span>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed">{review.body}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="lm-num rounded-full bg-[var(--lm-surface)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lm-muted)]">
                  {PASS_BY_TIER[review.tier].name} {PASS_BY_TIER[review.tier].minutes}분
                </span>
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--lm-accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lm-accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {reviews.length > 2 && !showAllReviews && (
          <button
            type="button"
            onClick={() => setShowAllReviews(true)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-[var(--lm-border)] py-3 text-[13.5px] font-bold text-[var(--lm-ink)]"
          >
            후기 {reviews.length - 2}개 더 보기
            <CaretRight size={13} weight="bold" />
          </button>
        )}
      </section>

      <div className="h-6" />

      <div className="sticky bottom-0 mt-auto border-t border-[var(--lm-border)] bg-[var(--lm-elevated)] px-5 pb-7 pt-3">
        <div className="lm-num mb-2.5 flex items-baseline justify-between">
          <span className="text-[12.5px] text-[var(--lm-muted)]">
            선택한 상담권 {PASS_BY_TIER[tier].name} {PASS_BY_TIER[tier].minutes}분
          </span>
          <span className="text-[15px] font-bold">{formatWon(PASS_BY_TIER[tier].price)}원</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onNavigate("booking", expert.id)}
            className="flex-1 rounded-xl border border-[var(--lm-border)] py-3.5 text-[15px] font-bold text-[var(--lm-ink)] active:translate-y-[1px]"
          >
            예약하기
          </button>
          <button
            type="button"
            disabled={expert.status !== "available"}
            onClick={() => onNavigate("call", expert.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--lm-accent)] py-3.5 text-[15px] font-bold text-[var(--lm-accent-fg)] transition-transform active:translate-y-[1px] disabled:bg-[var(--lm-surface)] disabled:text-[var(--lm-muted)]"
          >
            <Lightning size={15} weight="fill" />
            {expert.status === "available" ? "즉시 상담" : "예약만 가능"}
          </button>
        </div>
      </div>
    </div>
  );
}
