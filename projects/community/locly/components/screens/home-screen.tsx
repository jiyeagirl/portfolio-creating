"use client";

import Image from "next/image";
import {
  ChatCircle,
  Fire,
  Heart,
  MapPin,
  Megaphone,
  PencilSimpleLine,
  Question,
  UsersThree,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  CURRENT_USER,
  EVENTS,
  MEETUPS,
  NEIGHBORHOOD,
  POSTS,
  STORES,
  boardLabel,
} from "@/projects/community/locly/lib/mock-data";
import {
  Badge,
  MoreLink,
  OfficialBadge,
  SectionHeader,
  StarRating,
  formatRelativeTime,
} from "@/projects/community/locly/components/layout/ui";
import { Reveal } from "@/projects/community/locly/components/layout/reveal";

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const notices = POSTS.filter((p) => p.isNotice);
  const featured = notices[0];
  const sideNews = [POSTS[1], POSTS[10]];
  const popular = [...POSTS].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const weekEvents = EVENTS.slice(0, 5);
  const bestFood = STORES.filter((s) => s.category === "맛집").slice(0, 2);
  const bestShops = STORES.filter((s) => s.category !== "맛집").slice(0, 3);
  const recruitingMeetups = MEETUPS.filter((m) => m.status === "recruiting").slice(0, 4);
  const questions = POSTS.filter((p) => p.isQuestion).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1360px] px-6 pb-24 lg:px-10">
      <section className="grid gap-6 pt-8 pb-10 lg:grid-cols-[1.25fr_1fr] lg:items-stretch">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--locly-accent-soft)] px-3 py-1 text-[12.5px] font-semibold text-[var(--locly-accent)]">
            <MapPin size={13} weight="fill" />
            {NEIGHBORHOOD}
          </span>
          <h1 className="mt-4 max-w-[18ch] text-[28px] font-bold leading-[1.25] tracking-tight text-[var(--locly-ink)] lg:text-[32px]">
            {CURRENT_USER.name}님, 오늘 OO동은 이렇게 움직이고 있어요
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--locly-muted)]">
            오늘 새 글 {POSTS.length}건, 진행 중인 지역 행사 {EVENTS.length}건이 올라왔어요.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
          <button
            onClick={() => onNavigate("search")}
            className="flex items-center gap-2 rounded-lg border border-[var(--locly-border)] px-4 py-3 text-left text-[13.5px] text-[var(--locly-muted)] transition-colors hover:border-[var(--locly-accent)]"
          >
            <Question size={17} />
            우리 동네 맛집, 행사, 모임을 검색해보세요
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate("postWrite")}
              className="flex items-center justify-center gap-2 rounded-lg bg-[var(--locly-accent)] px-4 py-3 text-[13.5px] font-semibold text-[var(--locly-accent-foreground)] transition-transform active:scale-[0.98]"
            >
              <PencilSimpleLine size={16} />
              글쓰기
            </button>
            <button
              onClick={() => onNavigate("meetups")}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--locly-border)] px-4 py-3 text-[13.5px] font-semibold text-[var(--locly-ink)] transition-colors hover:border-[var(--locly-accent)] hover:text-[var(--locly-accent)]"
            >
              <UsersThree size={16} />
              모임 둘러보기
            </button>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader title="오늘의 소식" description="OO동에서 지금 가장 많이 회자되는 이야기" />
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <button
              onClick={() => onNavigate("postDetail", featured.id)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] text-left transition-colors hover:border-[var(--locly-accent)]/50"
            >
              <div className="p-6">
                <div className="flex items-center gap-2">
                  {featured.authorBadge === "official" && <OfficialBadge />}
                  <span className="text-[12.5px] font-medium text-[var(--locly-muted)]">
                    {boardLabel(featured.board)} · {formatRelativeTime(featured.createdAt)}
                  </span>
                </div>
                <h3 className="mt-3 text-[19px] font-bold leading-snug text-[var(--locly-ink)] group-hover:text-[var(--locly-accent)]">
                  {featured.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[var(--locly-muted)]">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-[12.5px] text-[var(--locly-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Heart size={14} /> {featured.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ChatCircle size={14} /> {featured.comments}
                  </span>
                </div>
              </div>
            </button>

            <div className="flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
              {sideNews.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onNavigate("postDetail", post.id)}
                  className="flex flex-col gap-1.5 px-5 py-4 text-left transition-colors hover:bg-[var(--locly-surface)]"
                >
                  <span className="text-[12px] font-medium text-[var(--locly-muted)]">
                    {boardLabel(post.board)} · {formatRelativeTime(post.createdAt)}
                  </span>
                  <span className="line-clamp-2 text-[14px] font-semibold text-[var(--locly-ink)]">
                    {post.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader
            title="실시간 인기 게시글"
            description="좋아요와 댓글이 가장 많이 모인 글이에요"
            action={<MoreLink onClick={() => onNavigate("community")} />}
          />
          <div className="mt-5 divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
            {popular.map((post, i) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--locly-surface)]"
              >
                <span
                  className={`w-5 shrink-0 text-[15px] font-extrabold ${
                    i < 3 ? "text-[var(--locly-accent)]" : "text-[var(--locly-muted)]"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-semibold text-[var(--locly-ink)]">{post.title}</p>
                  <p className="mt-0.5 text-[12.5px] text-[var(--locly-muted)]">{boardLabel(post.board)}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 text-[12.5px] text-[var(--locly-muted)] sm:inline-flex">
                  <Fire size={14} className="text-[var(--locly-warning)]" />
                  {post.likes}
                </span>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader
            title="이번 주 지역 행사"
            description="공식 행사와 주민 모임 행사를 한곳에서 확인하세요"
            action={<MoreLink onClick={() => onNavigate("events")} />}
          />
          <div className="locly-scrollbar-none mt-5 flex gap-4 overflow-x-auto pb-2">
            {weekEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onNavigate("eventDetail", event.id)}
                className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] text-left transition-colors hover:border-[var(--locly-accent)]/50"
              >
                <div className="relative h-[140px] w-full">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                  <span className="absolute left-3 top-3">
                    {event.official ? <OfficialBadge /> : <Badge tone="neutral">주민 주최</Badge>}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="text-[12px] font-medium text-[var(--locly-accent)]">
                    {event.date.slice(5).replace("-", ".")} · {event.time.split(" ")[0]}
                  </span>
                  <p className="line-clamp-2 text-[14px] font-semibold text-[var(--locly-ink)]">{event.title}</p>
                  <p className="mt-auto text-[12px] text-[var(--locly-muted)]">{event.location}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader
            title="베스트 동네 맛집 · 가게"
            description="주민들이 가장 많이 방문하고 추천한 곳"
            action={<MoreLink onClick={() => onNavigate("stores")} />}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-4 md:grid-rows-2">
            {bestFood.map((store, i) => (
              <button
                key={store.id}
                onClick={() => onNavigate("storeDetail", store.id)}
                className={`group relative overflow-hidden rounded-2xl text-left ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-2"
                }`}
              >
                <div className={`relative w-full ${i === 0 ? "h-[280px] md:h-full" : "h-[132px]"}`}>
                  <Image src={store.image} alt={store.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <Badge tone="accent">{store.category}</Badge>
                  <p className="mt-2 text-[15px] font-bold text-white">{store.name}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[12px] text-white/85">
                    <StarRating rating={store.rating} size={11} />
                    {store.rating.toFixed(1)} ({store.reviewCount})
                  </div>
                </div>
              </button>
            ))}
            {bestShops.map((store) => (
              <button
                key={store.id}
                onClick={() => onNavigate("storeDetail", store.id)}
                className="flex items-center gap-3 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-3 text-left transition-colors hover:border-[var(--locly-accent)]/50"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={store.image} alt={store.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[var(--locly-ink)]">{store.name}</p>
                  <p className="text-[12px] text-[var(--locly-muted)]">
                    {store.category} · {store.rating.toFixed(1)}점
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader
            title="모집 중인 모임"
            description="관심사가 같은 이웃과 함께해보세요"
            action={<MoreLink onClick={() => onNavigate("meetups")} />}
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recruitingMeetups.map((meetup) => (
              <button
                key={meetup.id}
                onClick={() => onNavigate("meetupDetail", meetup.id)}
                className="flex flex-col overflow-hidden rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] text-left transition-colors hover:border-[var(--locly-accent)]/50"
              >
                <div className="relative h-[110px] w-full">
                  <Image src={meetup.image} alt={meetup.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <Badge tone="neutral">{meetup.category}</Badge>
                  <p className="line-clamp-1 text-[14px] font-semibold text-[var(--locly-ink)]">{meetup.title}</p>
                  <p className="text-[12px] text-[var(--locly-muted)]">{meetup.schedule}</p>
                  <div className="mt-auto flex items-center gap-1.5 text-[12px] font-medium text-[var(--locly-accent)]">
                    <UsersThree size={14} />
                    {meetup.applied}/{meetup.capacity}명 모집 중
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader
            title="최근 올라온 질문"
            description="이웃의 질문에 답해주세요"
            action={<MoreLink onClick={() => onNavigate("community", "question")} />}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {questions.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex items-start gap-3 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-4 text-left transition-colors hover:border-[var(--locly-accent)]/50"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]">
                  <Question size={14} weight="bold" />
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-1 text-[14px] font-semibold text-[var(--locly-ink)]">{post.title}</p>
                  <p className="mt-1 line-clamp-1 text-[12.5px] text-[var(--locly-muted)]">{post.excerpt}</p>
                </div>
                <span className="ml-auto shrink-0">
                  {post.isAnswered ? (
                    <Badge tone="success">답변완료</Badge>
                  ) : (
                    <Badge tone="warning">답변대기</Badge>
                  )}
                </span>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-[var(--locly-border)] py-10">
          <SectionHeader title="공지사항" description="지자체 공식 계정의 안내를 놓치지 마세요" />
          <div className="mt-5 divide-y divide-[var(--locly-border)] overflow-hidden rounded-2xl border border-[var(--locly-border)]">
            {notices.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex w-full items-center gap-3 bg-[var(--locly-surface-elevated)] px-5 py-4 text-left transition-colors hover:bg-[var(--locly-surface)]"
              >
                <Megaphone size={16} className="shrink-0 text-[var(--locly-accent)]" />
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-[var(--locly-ink)]">
                  {post.title}
                </span>
                <span className="shrink-0 text-[12px] text-[var(--locly-muted)]">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
