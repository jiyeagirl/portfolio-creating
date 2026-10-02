"use client";

import Image from "next/image";
import { ArrowRight, Heart, Lightning, MagnifyingGlass, Plus, Ticket } from "@phosphor-icons/react";
import heroNight from "@/projects/platform/lumi/assets/hero-moonlit-desert.jpg";
import catSaju from "@/projects/platform/lumi/assets/cat-saju-books.jpg";
import catTarot from "@/projects/platform/lumi/assets/cat-tarot-dreamcatcher.jpg";
import catSinjeom from "@/projects/platform/lumi/assets/cat-sinjeom-lantern.jpg";
import promo from "@/projects/platform/lumi/assets/promo-milkyway-figure.jpg";
import reviewMood from "@/projects/platform/lumi/assets/mood-reading.jpg";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { CategoryKey } from "@/projects/platform/lumi/lib/types";
import {
  CATEGORY_META,
  CONCERN_THEMES,
  EXPERTS,
  OWNED_PASSES,
  PASS_BY_TIER,
  REVIEWS,
  TODAY_LABEL,
  USER,
  expertById,
} from "@/projects/platform/lumi/lib/mock-data";
import { ExpertRow, ExpertTile } from "@/projects/platform/lumi/components/expert-card";
import { SectionHead, Stars } from "@/projects/platform/lumi/components/ui";

const CATEGORY_IMAGE: Record<CategoryKey, typeof catSaju> = {
  saju: catSaju,
  tarot: catTarot,
  sinjeom: catSinjeom,
};

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const available = EXPERTS.filter((e) => e.status === "available");
  const recommended = [...EXPERTS].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const fresh = EXPERTS.filter((e) => e.isNew);
  const passCount = OWNED_PASSES.reduce((sum, p) => sum + p.count, 0);
  const latestReviews = REVIEWS.slice(3, 5);

  return (
    <div className="lm-enter pb-28">
      <header className="px-5 pb-4 pt-[71px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12.5px] font-semibold text-[var(--lm-muted)]">{TODAY_LABEL}</p>
            <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight">
              {USER.nickname}님, 오늘은
              <br />
              무엇이 궁금하신가요
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("favorites")}
            aria-label="찜한 상담사"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lm-surface)] text-[var(--lm-ink)]"
          >
            <Heart size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("experts")}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-4 py-3 text-left"
        >
          <MagnifyingGlass size={17} className="text-[var(--lm-muted)]" />
          <span className="text-[13.5px] text-[var(--lm-muted)]">
            상담사 이름, 고민 키워드로 찾기
          </span>
        </button>
      </header>

      {/* 보유 상담권 요약. 홈에서 잔여를 먼저 보여 준다. */}
      <section className="px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lm-accent-soft)] text-[var(--lm-accent)]">
            <Ticket size={19} weight="fill" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="lm-num text-[14px] font-bold">보유 상담권 {passCount}장</p>
            <p className="lm-num mt-0.5 truncate text-[12px] text-[var(--lm-muted)]">
              {OWNED_PASSES.filter((p) => p.count > 0)
                .map((p) => `${PASS_BY_TIER[p.tier].name} ${p.count}장`)
                .join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("passes")}
            className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--lm-surface)] px-3 py-1.5 text-[12.5px] font-bold text-[var(--lm-ink)]"
          >
            <Plus size={13} weight="bold" />
            충전
          </button>
        </div>
      </section>

      {/* 히어로. 달이 뜬 밤 사진 위에 오늘 상담 가능 인원을 얹는다. */}
      <section className="mt-5 px-5">
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={heroNight}
            alt="달이 떠 있는 밤의 사막 풍경"
            placeholder="blur"
            className="h-[196px] w-full object-cover"
            sizes="393px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,11,28,0.92)] via-[rgba(13,11,28,0.45)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[19px] font-bold leading-snug tracking-tight text-white">
              오늘 밤 12시까지
              <br />
              {available.length}명이 바로 통화할 수 있어요
            </p>
            <button
              type="button"
              onClick={() => onNavigate("experts", "available")}
              className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#191730] active:translate-y-[1px]"
            >
              <Lightning size={14} weight="fill" />
              즉시 상담 상담사 보기
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionHead
          title="지금 통화 가능"
          note="대기 없이 바로 연결됩니다"
          action="전체 보기"
          onAction={() => onNavigate("experts", "available")}
        />
        <div className="lm-scroll-x flex gap-3 overflow-x-auto px-5 pb-1">
          {available.map((expert) => (
            <ExpertTile
              key={expert.id}
              expert={expert}
              onOpen={() => onNavigate("expertDetail", expert.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead title="어떤 방식으로 보시겠어요" />
        <div className="grid grid-cols-3 gap-2 px-5">
          {(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate("experts", key)}
              className="relative overflow-hidden rounded-2xl text-left"
            >
              <Image
                src={CATEGORY_IMAGE[key]}
                alt={
                  key === "saju"
                    ? "끈으로 묶인 오래된 책과 만년필"
                    : key === "tarot"
                      ? "깃털이 달린 드림캐처"
                      : "한자가 적힌 한지 등"
                }
                placeholder="blur"
                className="h-[132px] w-full object-cover"
                sizes="120px"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[rgba(13,11,28,0.88)] to-[rgba(13,11,28,0.05)]" />
              <span className="absolute inset-x-0 bottom-0 p-2.5">
                <span className="block text-[14px] font-bold text-white">
                  {CATEGORY_META[key].label}
                </span>
                <span className="mt-0.5 block text-[10.5px] leading-tight text-white/75">
                  {CATEGORY_META[key].sub}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead title="고민부터 골라도 됩니다" note="테마를 고르면 맞는 상담사만 보여 드려요" />
        <div className="grid grid-cols-2 gap-2.5 px-5">
          {CONCERN_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onNavigate("experts", theme.id)}
              className="relative overflow-hidden rounded-2xl text-left"
            >
              <Image
                src={theme.image}
                alt={theme.label}
                placeholder="blur"
                className="h-[112px] w-full object-cover"
                sizes="180px"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[rgba(13,11,28,0.9)] to-[rgba(13,11,28,0.1)]" />
              <span className="absolute inset-x-0 bottom-0 p-3">
                <span className="block text-[14px] font-bold text-white">{theme.label}</span>
                <span className="mt-0.5 block text-[11px] text-white/75">{theme.copy}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead
          title="예린님께 맞을 상담사"
          note="최근 본 고민과 평점을 기준으로 골랐어요"
          action="더 보기"
          onAction={() => onNavigate("experts")}
        />
        <div className="space-y-2.5 px-5">
          {recommended.map((expert) => (
            <ExpertRow
              key={expert.id}
              expert={expert}
              onOpen={() => onNavigate("expertDetail", expert.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <button
          type="button"
          onClick={() => onNavigate("passes")}
          className="relative block w-full overflow-hidden rounded-2xl text-left"
        >
          <Image
            src={promo}
            alt="은하수 아래 서 있는 사람"
            placeholder="blur"
            className="h-[148px] w-full object-cover"
            sizes="353px"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-[rgba(13,11,28,0.92)] via-[rgba(13,11,28,0.6)] to-transparent" />
          <span className="absolute inset-y-0 left-0 flex flex-col justify-center gap-1 p-5">
            <span className="block text-[11.5px] font-bold text-white/70">8월 31일까지</span>
            <span className="block text-[17px] font-bold leading-snug text-white">
              첫 상담 Lite 15분
              <br />
              12,000원에 시작하기
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-white">
              상담권 보러 가기
              <ArrowRight size={13} weight="bold" />
            </span>
          </span>
        </button>
      </section>

      <section className="mt-8">
        <SectionHead title="새로 들어온 상담사" note="입점 3개월 이내" />
        <div className="lm-scroll-x flex gap-3 overflow-x-auto px-5 pb-1">
          {fresh.map((expert) => (
            <ExpertTile
              key={expert.id}
              expert={expert}
              onOpen={() => onNavigate("expertDetail", expert.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="overflow-hidden rounded-2xl bg-[var(--lm-elevated)] shadow-[var(--lm-shadow)]">
          <div className="relative">
            <Image
              src={reviewMood}
              alt="어두운 실내에서 책을 읽고 있는 사람"
              placeholder="blur"
              className="h-[124px] w-full object-cover"
              sizes="353px"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[rgba(13,11,28,0.85)] to-[rgba(13,11,28,0.15)]" />
            <p className="absolute bottom-3 left-4 text-[15px] font-bold text-white">
              어제 남겨진 후기
            </p>
          </div>
          <div className="divide-y divide-[var(--lm-border)]">
            {latestReviews.map((review) => {
              const expert = expertById(review.expertId);
              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => onNavigate("expertDetail", review.expertId)}
                  className="block w-full px-4 py-3.5 text-left"
                >
                  <span className="flex items-center gap-2">
                    <Stars rating={review.rating} />
                    <span className="text-[12px] font-semibold text-[var(--lm-ink)]">
                      {expert.name}
                    </span>
                    <span className="lm-num text-[11.5px] text-[var(--lm-muted)]">
                      {review.author} · {review.createdAt}
                    </span>
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[13px] leading-relaxed text-[var(--lm-muted)]">
                    {review.body}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
