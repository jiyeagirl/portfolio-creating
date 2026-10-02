"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Bell, Clock, MagnifyingGlass } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Display,
  Eyebrow,
  MonoIndex,
  SectionTitle,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import { ListingCard, ListingRow } from "@/projects/commerce/baseballmarket/components/listing-card";
import {
  CATEGORY_TILES,
  KRW,
  LISTINGS,
  ME,
  RECENT_VIEWED,
  SAVED_SEARCHES,
  TODAY_GAMES,
  listing,
  photo,
  team,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { UserView } from "@/projects/commerce/baseballmarket/lib/navigation";

/* 홈. vercel_compact의 밴드 순환(canvas-soft → canvas → ink 다크 반전)과 1280px 폭을 따른다.

   "구단 테마가 반영된 홈"은 색이 아니라 **다크 반전 밴드**로 구현한다 — 내 구단 경기 카드
   하나만 잉크 배경을 갖고, 그 위 1px에만 브랜드 메시 그라데이션이 얹힌다.
   메시는 히어로 스케일에서만 쓰라는 vercel 규칙에 맞춘 유일한 사용처 두 곳 중 하나다. */

export function HomeScreen({
  onNavigate,
  onOpenListing,
  liked,
  onToggleLike,
}: {
  onNavigate: (v: UserView) => void;
  onOpenListing: (id: string) => void;
  liked: Set<string>;
  onToggleLike: (id: string) => void;
}) {
  const myTeam = team(ME.team);
  const myGame = TODAY_GAMES[0];
  const hot = LISTINGS.filter((l) => l.status === "판매중").slice(0, 6);
  const myTeamListings = LISTINGS.filter((l) => l.team === ME.team && l.status !== "거래완료");

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-4 pt-10 lg:px-8 lg:pt-14">
      {/* 히어로 7-5. 헤드라인은 문장체 + 강한 음수 letter-spacing(vercel 규칙). */}
      <section className="bm-rise grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2">
            <TeamMark id={ME.team} size={24} accent />
            <Eyebrow>{teamLabel(ME.team)} 팬 홈</Eyebrow>
          </div>
          <Display className="mt-5">
            {ME.nickname}님, 오늘 {myTeam.name}{" "}
            <span className="bm-mesh-text">홈경기</span>입니다.
          </Display>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-[24px] text-[var(--bm-body)]">
            구단과 시즌, 선수와 등번호, 실측까지 걸러서 찾습니다. 티켓은 정가 기준표와
            나란히 놓고 봅니다.
          </p>

          <div className="mt-7 flex max-w-[520px] items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <MagnifyingGlass
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--bm-muted-soft)]"
              />
              <button
                type="button"
                onClick={() => onNavigate("browse")}
                className="h-12 w-full truncate rounded-[6px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)] pl-9 pr-3 text-left text-[16px] leading-[24px] text-[var(--bm-muted-soft)]"
              >
                구단, 선수, 등번호, 좌석으로 검색
              </button>
            </div>
            <Button size="lg" variant="cta" onClick={() => onNavigate("browse")}>
              검색
            </Button>
          </div>

          <div className="bm-noscroll mt-3 flex gap-2 overflow-x-auto pb-1">
            {SAVED_SEARCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate("browse")}
                className="bm-press-flat flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--bm-hairline)] px-3 py-1.5 text-[13px] font-medium text-[var(--bm-body)]"
              >
                {s.alarm && <Bell size={11} weight="fill" className="text-[var(--bm-link)]" />}
                {s.label}
                <span className="bm-num text-[var(--bm-muted-soft)]">{s.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 다크 반전 밴드. 페이지에서 잉크 표면을 갖는 유일한 카드이고,
            상단 1px 메시 라인이 브랜드 그라데이션의 두 번째이자 마지막 사용처다. */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-[8px] bg-[var(--bm-ink)] text-[var(--bm-on-ink)]">
            <div className="bm-mesh-rule h-[3px] w-full" aria-hidden />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium leading-[16px] tracking-[0.06em] text-white/50">
                  오늘의 경기
                </span>
                <span className="bm-num inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-medium">
                  <Clock size={12} weight="fill" />
                  {myGame.time}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] leading-[16px] text-white/50">홈</p>
                  <p className="mt-0.5 truncate text-[20px] font-semibold leading-[28px] tracking-[-0.03em]">
                    {team(myGame.home).name}
                  </p>
                </div>
                <span className="bm-mono text-[13px] text-white/40">vs</span>
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-[12px] leading-[16px] text-white/50">원정</p>
                  <p className="mt-0.5 truncate text-[20px] font-semibold leading-[28px] tracking-[-0.03em]">
                    {team(myGame.away).name}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[14px] leading-[20px] tracking-[-0.01em] text-white/60">
                {myGame.stadium} | {myGame.note}
              </p>

              <button
                type="button"
                onClick={() => onNavigate("community")}
                className="mt-5 flex w-full items-center justify-between rounded-[6px] bg-white/10 px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-white/15"
              >
                실시간 응원 스레드 열기
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight size={12} weight="bold" />
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {TODAY_GAMES.slice(1).map((g) => (
              <div
                key={g.stadium}
                className="bm-card rounded-[8px] bg-[var(--bm-canvas)] p-4"
              >
                <p className="bm-mono text-[12px] leading-[16px] text-[var(--bm-muted-soft)]">
                  {g.time}
                </p>
                <p className="mt-2 truncate text-[14px] font-medium leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)]">
                  {team(g.home).name} vs {team(g.away).name}
                </p>
                <p className="mt-0.5 truncate text-[13px] leading-[18px] text-[var(--bm-muted)]">
                  {g.note || g.stadium}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 템플릿 그리드. vercel은 액센트가 잉크 하나뿐이라 색면 타일을 쓰지 않는다.
          구별은 모노 순번(01~06)과 타일마다 다른 실측 한 줄이 맡는다. */}
      <section className="mt-24">
        <SectionTitle title="무엇을 찾으시나요" sub="구단, 시즌, 선수, 등번호, 실측까지 걸러서 봅니다" />
        <div className="bm-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_TILES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => onNavigate(c.key === "커뮤니티" ? "community" : "browse")}
              className="bm-press group rounded-[8px] bg-[var(--bm-canvas)] p-5 text-left"
            >
              <span className="flex items-center justify-between">
                <MonoIndex n={c.index} />
                <ArrowUpRight
                  size={15}
                  className="text-[var(--bm-muted-soft)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
              <p className="mt-6 text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-[var(--bm-ink)]">
                {c.label}
              </p>
              <p className="mt-1 text-[14px] leading-[20px] tracking-[-0.01em] text-[var(--bm-muted)]">
                {c.sub}
              </p>
              <p className="bm-num mt-4 border-t border-[var(--bm-hairline)] pt-3 text-[12px] leading-[16px] text-[var(--bm-muted-soft)]">
                {c.metric}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 실시간 인기 매물 */}
      <section className="mt-24">
        <SectionTitle
          title="지금 인기 매물"
          sub="찜과 채팅이 빠르게 늘고 있는 순서"
          action={
            <Button variant="secondary" size="sm" onClick={() => onNavigate("browse")}>
              전체 보기
            </Button>
          }
        />
        <div className="bm-stagger grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {hot.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              onOpen={() => onOpenListing(l.id)}
              liked={liked.has(l.id)}
              onToggleLike={() => onToggleLike(l.id)}
            />
          ))}
        </div>
      </section>

      {/* 내 구단 매물 + 최근 본 상품 */}
      <section className="mt-24 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionTitle title={`${myTeam.name} 매물`} sub="응원 구단으로 먼저 걸러 봅니다" />
          <div className="space-y-5">
            {myTeamListings.map((l) => (
              <div key={l.id} className="rounded-[12px] bg-[var(--bm-surface-card)] p-4">
                <ListingRow
                  listing={l}
                  onOpen={() => onOpenListing(l.id)}
                  trailing={
                    l.category === "티켓" ? (
                      <Badge tone="success">정가 비교</Badge>
                    ) : (
                      <Badge tone="team">내 구단</Badge>
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <SectionTitle title="최근 본 상품" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {RECENT_VIEWED.map((id) => {
              const l = listing(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpenListing(id)}
                  className="text-left"
                >
                  <span className="relative block aspect-square w-full overflow-hidden rounded-[8px] bg-[var(--bm-surface-strong)]">
                    <Image
                      src={photo(l.photoId, 320, 320)}
                      alt={l.title}
                      fill
                      sizes="200px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  <span className="mt-2 block truncate text-[13px] font-medium leading-[19px] text-[var(--bm-body-strong)]">
                    {l.title}
                  </span>
                  <span className="bm-num mt-0.5 block text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                    {KRW(l.price)}
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
