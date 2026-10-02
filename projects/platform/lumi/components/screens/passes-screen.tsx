"use client";

import Image from "next/image";
import { ArrowRight, Check, Clock, Info, Ticket } from "@phosphor-icons/react";
import passHeader from "@/projects/platform/lumi/assets/pass-startrail.jpg";
import clockPhoto from "@/projects/platform/lumi/assets/mood-clock.jpg";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import {
  CAUTIONS,
  OWNED_PASSES,
  PASS_BY_TIER,
  PASS_PRODUCTS,
  formatWon,
} from "@/projects/platform/lumi/lib/mock-data";
import { SectionHead } from "@/projects/platform/lumi/components/ui";

export function PassesScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const owned = OWNED_PASSES.filter((p) => p.count > 0);
  const totalMinutes = OWNED_PASSES.reduce(
    (sum, p) => sum + p.count * PASS_BY_TIER[p.tier].minutes,
    0,
  );

  return (
    <div className="lm-enter pb-28">
      <header className="px-5 pb-4 pt-[71px]">
        <h1 className="text-[22px] font-bold tracking-tight">상담권</h1>
        <p className="mt-1 text-[13px] text-[var(--lm-muted)]">
          미리 사 두고 예약이나 즉시 상담에 씁니다
        </p>
      </header>

      <section className="px-5">
        <div className="rounded-2xl bg-[var(--lm-night)] p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] text-white/65">보유 상담 시간</p>
            <Ticket size={18} weight="fill" className="text-white/45" />
          </div>
          <p className="lm-num mt-1.5 text-[30px] font-bold leading-none">
            {totalMinutes}
            <span className="ml-1 text-[15px] font-semibold text-white/70">분</span>
          </p>

          {owned.length > 0 ? (
            <ul className="mt-4 space-y-2 border-t border-white/12 pt-4">
              {owned.map((pass) => (
                <li key={pass.tier} className="lm-num flex items-center justify-between text-[13px]">
                  <span className="font-semibold">
                    {PASS_BY_TIER[pass.tier].name} {PASS_BY_TIER[pass.tier].minutes}분
                  </span>
                  <span className="text-white/60">
                    {pass.count}장 · {pass.expiresAt}까지
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 border-t border-white/12 pt-4 text-[13px] text-white/65">
              보유한 상담권이 없습니다. 아래에서 먼저 구매해 주세요.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="px-5">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={passHeader}
              alt="바위 위로 별이 궤적을 그린 밤하늘"
              placeholder="blur"
              className="h-[124px] w-full object-cover"
              sizes="353px"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[rgba(13,11,28,0.9)] to-[rgba(13,11,28,0.2)]" />
            <p className="absolute bottom-4 left-4 text-[16px] font-bold leading-snug text-white">
              필요한 만큼만 고르세요
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 px-5">
          {PASS_PRODUCTS.map((pass) => {
            const highlight = pass.tier === "standard";
            return (
              <article
                key={pass.tier}
                className={`rounded-2xl border p-5 ${
                  highlight
                    ? "border-[var(--lm-accent)] bg-[var(--lm-elevated)]"
                    : "border-[var(--lm-border)] bg-[var(--lm-elevated)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="lm-num text-[17px] font-bold tracking-tight">
                        {pass.name} {pass.minutes}분
                      </h3>
                      {highlight && (
                        <span className="rounded-full bg-[var(--lm-accent-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--lm-accent)]">
                          가장 많이 선택
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[12.5px] text-[var(--lm-muted)]">{pass.summary}</p>
                  </div>
                  <div className="lm-num shrink-0 text-right">
                    <p className="text-[11.5px] text-[var(--lm-muted)] line-through">
                      {formatWon(pass.listPrice)}원
                    </p>
                    <p className="text-[18px] font-bold leading-tight">{formatWon(pass.price)}원</p>
                  </div>
                </div>

                <ul className="mt-3.5 space-y-1.5">
                  {pass.includes.map((line) => (
                    <li key={line} className="flex items-center gap-2 text-[12.5px] text-[var(--lm-muted)]">
                      <Check size={13} weight="bold" className="shrink-0 text-[var(--lm-accent)]" />
                      {line}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 rounded-xl bg-[var(--lm-surface)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--lm-muted)]">
                  {pass.bestFor}
                </p>

                <button
                  type="button"
                  onClick={() => onNavigate("purchase", pass.tier)}
                  className={`mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-[14.5px] font-bold transition-transform active:translate-y-[1px] ${
                    highlight
                      ? "bg-[var(--lm-accent)] text-[var(--lm-accent-fg)]"
                      : "border border-[var(--lm-border)] text-[var(--lm-ink)]"
                  }`}
                >
                  {pass.name} 구매하기
                  <ArrowRight size={14} weight="bold" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead title="상담 시간은 이렇게 계산됩니다" />
        <div className="px-5">
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)]">
            <div className="flex gap-4 p-4">
              <Image
                src={clockPhoto}
                alt="탁상 위 아날로그 시계"
                placeholder="blur"
                className="h-[88px] w-[88px] shrink-0 rounded-xl object-cover"
                sizes="88px"
              />
              <ul className="space-y-2">
                {[
                  "통화가 연결된 순간부터 시간이 흐릅니다.",
                  "연결 전 대기 시간은 차감되지 않습니다.",
                  "남은 시간 3분 전에 안내 신호가 들립니다.",
                ].map((line) => (
                  <li key={line} className="flex gap-2 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                    <Clock size={13} className="mt-[3px] shrink-0 text-[var(--lm-accent)]" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-2xl bg-[var(--lm-surface)] p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-bold">
            <Info size={14} weight="fill" className="text-[var(--lm-muted)]" />
            구매 전 확인해 주세요
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {CAUTIONS.map((line) => (
              <li key={line} className="flex gap-2 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--lm-muted)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
