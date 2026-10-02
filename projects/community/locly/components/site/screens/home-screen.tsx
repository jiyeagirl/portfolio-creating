"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CaretRight,
  ChatCircle,
  Megaphone,
  Question,
  UsersThree,
} from "@phosphor-icons/react";
import {
  CURRENT_USER,
  EVENTS,
  MEETUPS,
  POSTS,
  STORES,
  boardLabel,
} from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { Reveal } from "@/projects/community/locly/components/site/reveal";
import {
  Badge,
  CONTAINER,
  Display,
  InverseButton,
  OfficialBadge,
  PrimaryButton,
  SectionHead,
  StarRating,
  TextLink,
  formatRelativeTime,
} from "@/projects/community/locly/components/site/ui";

/* ── Hero banner ───────────────────────────────────────────────────────────
   A rotating banner rather than a display headline. The old hero set the
   headline at display-xl in a narrow left column, which put a 56px line next
   to a small body column and read as an accident. Here the headline sits at
   display-md inside a full-bleed dark band, so the band carries the scale and
   the type does not have to.

   Each slide points at a real item, and its photo is that item's own
   hand-verified picsum id — no new image pairings are introduced here.      */
type HeroSlide = {
  id: string;
  eyebrow: string;
  title: [string, string];
  lead: string;
  primary: { label: string; onSelect: (nav: NavigateFn) => void };
  secondary: { label: string; onSelect: (nav: NavigateFn) => void };
  image: string;
  caption: string;
  onImageSelect: (nav: NavigateFn) => void;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "brand",
    eyebrow: "나인동 주민 커뮤니티",
    title: ["우리 동네의 모든 이야기가", "여기 모입니다"],
    lead: "흩어져 있던 동네 소식과 생활 정보, 지역 행사와 가게 이야기를 한곳에서. 주민과 지자체가 같은 자리에서 이야기합니다.",
    primary: { label: "커뮤니티 둘러보기", onSelect: (nav) => nav("community") },
    secondary: { label: "모임 보러가기", onSelect: (nav) => nav("meetups") },
    image: MEETUPS.find((m) => m.id === "m5")!.image,
    caption: "나인 사진 산책 모임 · 매주 토요일",
    onImageSelect: (nav) => nav("meetupDetail", "m5"),
  },
  {
    id: "festival",
    eyebrow: "8월 1일 - 8월 3일 · 나인천 숲길",
    title: ["여름밤 야시장이", "사흘간 열립니다"],
    lead: "지역 소상공인 부스 40여 개와 버스킹 공연이 함께합니다. 지금 1,240명이 참가 신청했어요.",
    primary: { label: "행사 자세히 보기", onSelect: (nav) => nav("eventDetail", "e1") },
    secondary: { label: "전체 일정 보기", onSelect: (nav) => nav("events") },
    image: EVENTS.find((e) => e.id === "e1")!.image,
    caption: "2026 나인동 여름밤 야시장",
    onImageSelect: (nav) => nav("eventDetail", "e1"),
  },
  {
    id: "civic",
    eyebrow: "주민 참여",
    title: ["동네에 필요한 것,", "직접 제안해주세요"],
    lead: "접수된 제안은 나인구청 담당 부서로 바로 전달되고, 처리 현황을 끝까지 공개합니다. 평균 12일이면 답변이 옵니다.",
    primary: { label: "정책 제안하기", onSelect: (nav) => nav("civic") },
    secondary: { label: "처리 현황 보기", onSelect: (nav) => nav("civic") },
    image: EVENTS.find((e) => e.id === "e2")!.image,
    caption: "제로웨이스트 실천 워크숍 · 주민 제안으로 시작된 프로그램",
    onImageSelect: (nav) => nav("eventDetail", "e2"),
  },
];

function HeroBanner({ onNavigate }: { onNavigate: NavigateFn }) {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const stats = [
    { label: "오늘 올라온 글", value: POSTS.length },
    { label: "진행 중 행사", value: EVENTS.length },
    { label: "모집 중 모임", value: MEETUPS.filter((m) => m.status === "recruiting").length },
    { label: "등록된 동네 가게", value: STORES.length },
  ];

  return (
    <section className="bg-[var(--lc-dark)] text-[var(--lc-on-dark)]">
      <div className={`${CONTAINER} py-12 lg:py-16`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
          <div className="lg:min-h-[300px] lg:py-2">
            <p
              key={`${slide.id}-eyebrow`}
              className="locly-hero-fade text-[12px] font-medium uppercase tracking-[0.15em] text-[var(--lc-amber)]"
            >
              {slide.eyebrow}
            </p>
            <Display
              as="h1"
              size="md"
              key={`${slide.id}-title`}
              className="locly-hero-fade mt-5 text-[var(--lc-on-dark)]"
            >
              {slide.title[0]}
              <br />
              {slide.title[1]}
            </Display>
            <p
              key={`${slide.id}-lead`}
              className="locly-hero-fade mt-5 max-w-[44ch] text-[15px] leading-[1.65] text-[var(--lc-on-dark-soft)]"
            >
              {slide.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={() => slide.primary.onSelect(onNavigate)}>
                {slide.primary.label}
                <ArrowRight size={15} weight="bold" />
              </PrimaryButton>
              <button
                type="button"
                onClick={() => slide.secondary.onSelect(onNavigate)}
                className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[var(--lc-dark-elevated)] px-5 text-[14px] font-medium text-[var(--lc-on-dark)]"
              >
                {slide.secondary.label}
              </button>
            </div>

            <div className="mt-9 flex items-center gap-3">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}번 배너 보기`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-7 bg-[var(--lc-primary)]" : "w-1.5 bg-[var(--lc-on-dark-soft)]/45"
                  }`}
                />
              ))}
              <span className="ml-1 text-[12px] tabular-nums text-[var(--lc-on-dark-soft)]">
                {index + 1} / {HERO_SLIDES.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => slide.onImageSelect(onNavigate)}
            className="group relative block w-full overflow-hidden rounded-[16px] text-left"
          >
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[5/4]">
              {HERO_SLIDES.map((s, i) => (
                <Image
                  key={s.id}
                  src={s.image}
                  alt={s.caption}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority={i === 0}
                  className={`object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,20,19,0.78)] via-[rgba(20,20,19,0.08)] to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-6">
              <span key={`${slide.id}-caption`} className="locly-hero-fade text-[14px] font-medium text-white">
                {slide.caption}
              </span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                <ArrowUpRight size={15} weight="bold" />
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--lc-hairline-dark)]">
        <div className={`${CONTAINER} flex flex-wrap items-center gap-x-12 gap-y-5 py-6`}>
          <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-[var(--lc-on-dark-soft)]">
            오늘의 나인동 · 7월 27일 기준
          </p>
          <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <dd className="locly-display text-[24px] leading-none text-[var(--lc-on-dark)]">{stat.value}</dd>
                <dt className="text-[13px] text-[var(--lc-on-dark-soft)]">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const notices = POSTS.filter((p) => p.isNotice);
  const featured = POSTS.find((p) => p.id === "p2")!;
  const sideNews = POSTS.filter((p) => ["p13", "p5", "p7"].includes(p.id));
  const popular = [...POSTS].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const weekEvents = EVENTS.slice(0, 4);
  const bestStores = STORES.slice(0, 5);
  const recruiting = MEETUPS.filter((m) => m.status === "recruiting").slice(0, 3);
  const questions = POSTS.filter((p) => p.isQuestion).slice(0, 3);

  return (
    <>
      {/* ── Band 1 · dark banner carousel ───────────────────────────────── */}
      <HeroBanner onNavigate={onNavigate} />

      {/* ── Band 2 · soft cream notice strip + quick entries ────────────── */}
      <section className="border-b border-[var(--lc-hairline)] bg-[var(--lc-surface-soft)]">
        <div className={`${CONTAINER} flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-10`}>
          <div className="flex shrink-0 items-center gap-2 text-[var(--lc-ink)]">
            <Megaphone size={16} weight="fill" className="text-[var(--lc-primary)]" />
            <span className="text-[13px] font-medium">구청 공지</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:gap-8">
            {notices.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="line-clamp-1 text-[14px] text-[var(--lc-body)]">{post.title}</span>
                <span className="shrink-0 text-[13px] text-[var(--lc-muted-soft)]">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick entries — the banner no longer carries a "most-read" list, so
            the strip below it doubles as the home's shortcut row. */}
        <div className={`${CONTAINER} flex flex-wrap items-center gap-2 border-t border-[var(--lc-hairline)] py-4`}>
          {[
            { label: "이웃 이야기", screen: "community" as const },
            { label: "모집 중 모임", screen: "meetups" as const },
            { label: "이번 주 행사", screen: "events" as const },
            { label: "동네 가게", screen: "stores" as const },
            { label: "주민 제안", screen: "civic" as const },
          ].map((entry) => (
            <button
              key={entry.label}
              onClick={() => onNavigate(entry.screen)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] pl-4 pr-3 text-[13px] font-medium text-[var(--lc-body-strong)] transition-colors active:bg-[var(--lc-surface-card)]"
            >
              {entry.label}
              <CaretRight size={12} weight="bold" className="text-[var(--lc-muted-soft)]" />
            </button>
          ))}
        </div>
      </section>

      {/* ── Band 3 · cream · asymmetric editorial 2-column ──────────────── */}
      <Reveal>
        <section className={`${CONTAINER} py-20 lg:py-24`}>
          <SectionHead
            eyebrow="오늘의 소식"
            title="이웃들이 지금 나누는 이야기"
            action={<TextLink onClick={() => onNavigate("community")}>커뮤니티 전체보기</TextLink>}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
            <button onClick={() => onNavigate("postDetail", featured.id)} className="group text-left">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px]">
                <Image
                  src={featured.image!}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Badge>{boardLabel(featured.board)}</Badge>
                <span className="text-[13px] text-[var(--lc-muted)]">
                  {featured.author} · {formatRelativeTime(featured.createdAt)}
                </span>
              </div>
              <Display size="sm" className="mt-3 text-[var(--lc-ink)]">
                {featured.title}
              </Display>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.55] text-[var(--lc-body)]">
                {featured.excerpt}
              </p>
            </button>

            <div className="flex flex-col divide-y divide-[var(--lc-hairline)] border-t border-[var(--lc-hairline)] lg:border-t-0">
              {sideNews.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onNavigate("postDetail", post.id)}
                  className="py-6 text-left first:lg:pt-0"
                >
                  <div className="flex items-center gap-2">
                    {post.authorBadge === "official" ? <OfficialBadge /> : <Badge>{boardLabel(post.board)}</Badge>}
                    <span className="text-[13px] text-[var(--lc-muted-soft)]">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[17px] font-medium leading-[1.4] text-[var(--lc-ink)]">{post.title}</p>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                    {post.excerpt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Band 4 · cream card · ranked list ───────────────────────────── */}
      <Reveal>
        <section className="bg-[var(--lc-surface-card)]">
          <div className={`${CONTAINER} py-20 lg:py-24`}>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Display size="md">이번 주 많이 읽은 글</Display>
                <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.55] text-[var(--lc-body)]">
                  좋아요와 댓글이 가장 많이 모인 다섯 개의 이야기입니다.
                </p>
                <div className="mt-6">
                  <TextLink onClick={() => onNavigate("community")}>전체 인기글 보기</TextLink>
                </div>
              </div>

              <ol className="flex flex-col divide-y divide-[var(--lc-hairline)]">
                {popular.map((post, i) => (
                  <li key={post.id}>
                    <button
                      onClick={() => onNavigate("postDetail", post.id)}
                      className="flex w-full items-baseline gap-5 py-5 text-left"
                    >
                      <span className="locly-display w-7 shrink-0 text-[24px] leading-none text-[var(--lc-muted-soft)]">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] font-medium text-[var(--lc-ink)]">
                          {post.title}
                        </span>
                        <span className="mt-1.5 flex items-center gap-3 text-[13px] text-[var(--lc-muted)]">
                          <span>{boardLabel(post.board)}</span>
                          <span className="inline-flex items-center gap-1">
                            <ChatCircle size={13} />
                            {post.comments}
                          </span>
                        </span>
                      </span>
                      <CaretRight size={15} className="shrink-0 text-[var(--lc-muted-soft)]" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Band 5 · dark · this week's events ──────────────────────────── */}
      <Reveal>
        <section className="bg-[var(--lc-dark)] text-[var(--lc-on-dark)]">
          <div className={`${CONTAINER} py-20 lg:py-24`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.15em] text-[var(--lc-on-dark-soft)]">
                  이번 주 지역 행사
                </p>
                <Display size="md" className="text-[var(--lc-on-dark)]">
                  동네에서 열리는 일들
                </Display>
              </div>
              <button
                onClick={() => onNavigate("events")}
                className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[var(--lc-dark-elevated)] px-5 text-[14px] font-medium text-[var(--lc-on-dark)]"
              >
                전체 일정 보기
                <ArrowRight size={15} weight="bold" />
              </button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {weekEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onNavigate("eventDetail", event.id)}
                  className="flex flex-col overflow-hidden rounded-[12px] bg-[var(--lc-dark-soft)] text-left"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-[12px] font-medium text-[var(--lc-amber)]">
                      {event.date.slice(5).replace("-", ".")} · {event.time.split(" ")[0]}
                    </span>
                    <p className="line-clamp-2 text-[15px] font-medium leading-[1.4] text-[var(--lc-on-dark)]">
                      {event.title}
                    </p>
                    <p className="mt-auto pt-2 text-[13px] text-[var(--lc-on-dark-soft)]">{event.location}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Band 6 · cream · store bento ────────────────────────────────── */}
      <Reveal>
        <section className={`${CONTAINER} py-20 lg:py-24`}>
          <SectionHead
            eyebrow="동네 가게"
            title="주민들이 자주 찾는 곳"
            action={<TextLink onClick={() => onNavigate("stores")}>가게 전체보기</TextLink>}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-4 md:grid-rows-2">
            {bestStores.map((store, i) => {
              const isHero = i === 0;
              return (
                <button
                  key={store.id}
                  onClick={() => onNavigate("storeDetail", store.id)}
                  className={`group relative overflow-hidden rounded-[12px] text-left ${
                    isHero ? "md:col-span-2 md:row-span-2" : "md:col-span-1"
                  }`}
                >
                  <div className={`relative w-full ${isHero ? "h-[260px] md:h-full" : "h-[168px]"}`}>
                    <Image
                      src={store.image}
                      alt={store.name}
                      fill
                      sizes={isHero ? "(max-width: 768px) 100vw, 560px" : "(max-width: 768px) 100vw, 280px"}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,20,19,0.82)] via-[rgba(20,20,19,0.15)] to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-[12px] font-medium text-[var(--lc-on-dark-soft)]">{store.category}</span>
                    <p
                      className={`mt-1 font-medium text-white ${isHero ? "locly-display text-[24px]" : "text-[15px]"}`}
                    >
                      {store.name}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-white/85">
                      <StarRating rating={store.rating} size={11} />
                      {store.rating.toFixed(1)}
                      <span className="text-white/60">· 후기 {store.reviewCount}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* ── Band 7 · soft cream · meetups + questions ───────────────────── */}
      <Reveal>
        <section className="border-y border-[var(--lc-hairline)] bg-[var(--lc-surface-soft)]">
          <div className={`${CONTAINER} grid gap-14 py-20 lg:grid-cols-[1.25fr_1fr] lg:py-24`}>
            <div>
              <SectionHead
                title="모집 중인 모임"
                action={<TextLink onClick={() => onNavigate("meetups")}>모임 전체보기</TextLink>}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {recruiting.map((meetup) => (
                  <button
                    key={meetup.id}
                    onClick={() => onNavigate("meetupDetail", meetup.id)}
                    className="flex flex-col overflow-hidden rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] text-left"
                  >
                    <div className="relative aspect-[3/2] w-full">
                      <Image
                        src={meetup.image}
                        alt={meetup.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <span className="text-[12px] text-[var(--lc-muted)]">{meetup.category}</span>
                      <p className="line-clamp-2 text-[15px] font-medium leading-[1.4] text-[var(--lc-ink)]">
                        {meetup.title}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] text-[var(--lc-muted)]">
                        <UsersThree size={14} />
                        {meetup.applied}/{meetup.capacity}명
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionHead
                title="답변을 기다려요"
                action={<TextLink onClick={() => onNavigate("community", "question")}>질문 전체보기</TextLink>}
              />
              <div className="mt-8 flex flex-col divide-y divide-[var(--lc-hairline)] border-t border-[var(--lc-hairline)]">
                {questions.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => onNavigate("postDetail", post.id)}
                    className="flex items-start gap-3 py-5 text-left"
                  >
                    <Question size={17} weight="bold" className="mt-0.5 shrink-0 text-[var(--lc-primary)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium leading-[1.4] text-[var(--lc-ink)]">
                        {post.title}
                      </span>
                      <span className="mt-1.5 block text-[13px] text-[var(--lc-muted)]">
                        댓글 {post.comments} · {formatRelativeTime(post.createdAt)}
                      </span>
                    </span>
                    {post.isAnswered ? (
                      <Badge tone="official">답변완료</Badge>
                    ) : (
                      <Badge tone="pending">답변대기</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Band 8 · coral callout ──────────────────────────────────────── */}
      <Reveal>
        <section className={`${CONTAINER} py-20 lg:py-24`}>
          <div className="grid gap-10 rounded-[12px] bg-[var(--lc-primary)] p-10 text-[var(--lc-on-primary)] lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-14">
            <div>
              <Display size="sm" className="text-[var(--lc-on-primary)]">
                동네에 필요한 것이 있다면,
                <br />
                직접 제안해주세요
              </Display>
              <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.6] text-white/85">
                주민 제안은 나인구청 담당 부서로 바로 전달되고, 접수부터 답변까지 처리
                현황을 공개합니다. {CURRENT_USER.name}님의 의견도 기다리고 있어요.
              </p>
              <div className="mt-8">
                <InverseButton onClick={() => onNavigate("civic")}>정책 제안하기</InverseButton>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-6 border-t border-white/25 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {[
                { label: "누적 제안", value: "128" },
                { label: "답변 완료", value: "94" },
                { label: "평균 처리", value: "12일" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dd className="locly-display text-[30px] leading-none">{stat.value}</dd>
                  <dt className="mt-2 text-[12px] text-white/80">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </Reveal>
    </>
  );
}
