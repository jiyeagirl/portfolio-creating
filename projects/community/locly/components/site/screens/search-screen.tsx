"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarBlank,
  ChatCircle,
  Clock,
  Heart,
  MagnifyingGlass,
  MapPin,
  Storefront,
  TrendUp,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { EVENTS, MEETUPS, POSTS, STORES, boardLabel } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Avatar,
  Badge,
  CONTAINER,
  Display,
  EmptyState,
  OfficialBadge,
  StarRating,
  formatRelativeTime,
} from "@/projects/community/locly/components/site/ui";

const RECENT_QUERIES = ["콩국수", "여름 물놀이장", "재활용 정거장", "러닝크루", "무인민원발급기"];

const TRENDING = [
  { query: "여름 물놀이장 개장", delta: "up" as const },
  { query: "동진시장 냉면", delta: "up" as const },
  { query: "폐가전 무상수거", delta: "same" as const },
  { query: "나인동 러닝크루", delta: "up" as const },
  { query: "어린이집 대기", delta: "down" as const },
  { query: "8월 문화강좌", delta: "up" as const },
];

/** Residents surfaced in search — derived from who actually writes on the boards. */
const PEOPLE = (() => {
  const counts = new Map<string, { posts: number; official: boolean }>();
  for (const post of POSTS) {
    const entry = counts.get(post.author) ?? { posts: 0, official: false };
    entry.posts += 1;
    entry.official = entry.official || post.authorBadge === "official";
    counts.set(post.author, entry);
  }
  return [...counts.entries()]
    .map(([name, meta]) => ({ name, ...meta }))
    .sort((a, b) => b.posts - a.posts);
})();

type Tab = "all" | "post" | "event" | "meetup" | "store" | "people";

function ResultCount({ label, count }: { label: string; count: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      <span className="text-[var(--lc-muted-soft)]">{count}</span>
    </span>
  );
}

function GroupHead({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-[var(--lc-hairline)] pb-3">
      <p className="text-[15px] font-medium text-[var(--lc-ink)]">{title}</p>
      <p className="text-[13px] text-[var(--lc-muted-soft)]">{count}건</p>
    </div>
  );
}

/** Wraps every occurrence of the query in the coral inline-emphasis tone. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-transparent font-medium text-[var(--lc-primary)]">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function SearchScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [recent, setRecent] = useState(RECENT_QUERIES);

  function submit(next: string) {
    const trimmed = next.trim();
    setInput(trimmed);
    setQuery(trimmed);
    setTab("all");
    if (trimmed && !recent.includes(trimmed)) setRecent((prev) => [trimmed, ...prev].slice(0, 8));
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { posts: [], events: [], meetups: [], stores: [], people: [] };
    const has = (...fields: (string | undefined)[]) =>
      fields.some((field) => field?.toLowerCase().includes(q));
    return {
      posts: POSTS.filter((p) => has(p.title, p.excerpt, p.content, p.author, ...p.tags)),
      events: EVENTS.filter((e) => has(e.title, e.description, e.location, e.category, e.organizer)),
      meetups: MEETUPS.filter((m) => has(m.title, m.description, m.category, m.location, m.host)),
      stores: STORES.filter((s) => has(s.name, s.address, s.category, s.promo, ...s.tags)),
      people: PEOPLE.filter((p) => has(p.name)),
    };
  }, [query]);

  const total =
    results.posts.length +
    results.events.length +
    results.meetups.length +
    results.stores.length +
    results.people.length;

  const TABS: { key: Tab; node: React.ReactNode }[] = [
    { key: "all", node: <ResultCount label="전체" count={total} /> },
    { key: "post", node: <ResultCount label="게시글" count={results.posts.length} /> },
    { key: "event", node: <ResultCount label="행사" count={results.events.length} /> },
    { key: "meetup", node: <ResultCount label="모임" count={results.meetups.length} /> },
    { key: "store", node: <ResultCount label="가게" count={results.stores.length} /> },
    { key: "people", node: <ResultCount label="주민" count={results.people.length} /> },
  ];

  const show = (key: Exclude<Tab, "all">) => tab === "all" || tab === key;

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <div className="mx-auto max-w-[880px]">
        <Display as="h1" size="lg">
          통합 검색
        </Display>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mt-8 flex items-center gap-3 border-b-2 border-[var(--lc-ink)] pb-4"
        >
          <MagnifyingGlass size={22} className="shrink-0 text-[var(--lc-ink)]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="게시글, 행사, 모임, 가게, 주민을 한 번에 찾아보세요"
            className="min-w-0 flex-1 bg-transparent text-[18px] text-[var(--lc-ink)] outline-none placeholder:text-[var(--lc-muted-soft)] md:text-[20px]"
          />
          {input && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                setInput("");
                setQuery("");
              }}
              className="shrink-0 text-[var(--lc-muted-soft)]"
            >
              <X size={18} />
            </button>
          )}
        </form>

        {!query && (
          <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
            <section>
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--lc-muted-soft)]">
                  <Clock size={14} />
                  최근 검색어
                </p>
                <button
                  onClick={() => setRecent([])}
                  className="text-[13px] text-[var(--lc-muted-soft)] active:text-[var(--lc-ink)]"
                >
                  전체 삭제
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {recent.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--lc-hairline)] py-1.5 pl-4 pr-2.5 text-[14px] text-[var(--lc-body)]"
                  >
                    <button onClick={() => submit(item)}>{item}</button>
                    <button
                      aria-label={`${item} 삭제`}
                      onClick={() => setRecent((prev) => prev.filter((v) => v !== item))}
                      className="text-[var(--lc-muted-soft)]"
                    >
                      <X size={12} weight="bold" />
                    </button>
                  </span>
                ))}
                {recent.length === 0 && (
                  <p className="text-[14px] text-[var(--lc-muted-soft)]">최근 검색 기록이 없어요.</p>
                )}
              </div>
            </section>

            <section>
              <p className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--lc-muted-soft)]">
                <TrendUp size={14} />
                지금 나인동 인기 검색어
              </p>
              <ol className="mt-5 flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
                {TRENDING.map((item, i) => (
                  <li key={item.query}>
                    <button
                      onClick={() => submit(item.query)}
                      className="flex w-full items-center gap-4 py-3 text-left"
                    >
                      <span className="w-4 text-[14px] font-medium text-[var(--lc-primary)]">{i + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-[15px] text-[var(--lc-ink)]">
                        {item.query}
                      </span>
                      <span
                        className={`text-[12px] font-medium ${
                          item.delta === "up"
                            ? "text-[var(--lc-success)]"
                            : item.delta === "down"
                              ? "text-[var(--lc-error)]"
                              : "text-[var(--lc-muted-soft)]"
                        }`}
                      >
                        {item.delta === "up" ? "▲" : item.delta === "down" ? "▼" : "—"}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}

        {query && (
          <>
            <p className="mt-8 text-[15px] text-[var(--lc-body)]">
              <span className="font-medium text-[var(--lc-ink)]">&ldquo;{query}&rdquo;</span> 검색 결과{" "}
              {total.toLocaleString()}건
            </p>

            <div className="locly-scrollbar-none mt-6 flex items-center gap-1 overflow-x-auto border-b border-[var(--lc-hairline)] pb-4">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`shrink-0 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    tab === item.key
                      ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                      : "text-[var(--lc-muted)]"
                  }`}
                >
                  {item.node}
                </button>
              ))}
            </div>

            {total === 0 && (
              <div className="mt-10">
                <EmptyState
                  icon={<MagnifyingGlass size={30} />}
                  title="검색 결과가 없어요"
                  description="검색어의 철자를 확인하거나 더 짧은 단어로 다시 찾아보세요. 인기 검색어에서 힌트를 얻을 수도 있어요."
                />
              </div>
            )}

            <div className="mt-10 flex flex-col gap-14">
              {show("post") && results.posts.length > 0 && (
                <section>
                  <GroupHead title="게시글" count={results.posts.length} />
                  <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
                    {results.posts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => onNavigate("postDetail", post.id)}
                        className="flex items-start gap-6 py-5 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>{boardLabel(post.board)}</Badge>
                            {post.authorBadge === "official" && <OfficialBadge />}
                          </div>
                          <p className="mt-2.5 text-[17px] font-medium leading-[1.4] text-[var(--lc-ink)]">
                            <Highlight text={post.title} query={query} />
                          </p>
                          <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                            <Highlight text={post.excerpt} query={query} />
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 text-[13px] text-[var(--lc-muted-soft)]">
                            <span className="text-[var(--lc-body)]">{post.author}</span>
                            <span>{formatRelativeTime(post.createdAt)}</span>
                            <span className="inline-flex items-center gap-1">
                              <Heart size={13} /> {post.likes}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <ChatCircle size={13} /> {post.comments}
                            </span>
                          </div>
                        </div>
                        {post.image && (
                          <div className="relative hidden h-[86px] w-[126px] shrink-0 overflow-hidden rounded-[8px] sm:block">
                            <Image src={post.image} alt="" fill sizes="126px" className="object-cover" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {show("event") && results.events.length > 0 && (
                <section>
                  <GroupHead title="지역행사" count={results.events.length} />
                  <div className="grid gap-4 pt-5 sm:grid-cols-2">
                    {results.events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onNavigate("eventDetail", event.id)}
                        className="flex gap-4 rounded-[12px] border border-[var(--lc-hairline)] p-4 text-left"
                      >
                        <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[8px]">
                          <Image src={event.image} alt="" fill sizes="76px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {event.official && <OfficialBadge />}
                            <span className="text-[12px] text-[var(--lc-muted-soft)]">{event.category}</span>
                          </div>
                          <p className="mt-2 truncate text-[15px] font-medium text-[var(--lc-ink)]">
                            <Highlight text={event.title} query={query} />
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--lc-muted)]">
                            <CalendarBlank size={13} />
                            {event.date} · {event.time}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {show("meetup") && results.meetups.length > 0 && (
                <section>
                  <GroupHead title="모임" count={results.meetups.length} />
                  <div className="grid gap-4 pt-5 sm:grid-cols-2">
                    {results.meetups.map((meetup) => (
                      <button
                        key={meetup.id}
                        onClick={() => onNavigate("meetupDetail", meetup.id)}
                        className="flex gap-4 rounded-[12px] border border-[var(--lc-hairline)] p-4 text-left"
                      >
                        <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[8px]">
                          <Image src={meetup.image} alt="" fill sizes="76px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={meetup.status === "recruiting" ? "official" : "closed"}>
                              {meetup.status === "recruiting" ? "모집중" : "마감"}
                            </Badge>
                            <span className="text-[12px] text-[var(--lc-muted-soft)]">{meetup.category}</span>
                          </div>
                          <p className="mt-2 truncate text-[15px] font-medium text-[var(--lc-ink)]">
                            <Highlight text={meetup.title} query={query} />
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--lc-muted)]">
                            <UsersThree size={13} />
                            {meetup.applied}/{meetup.capacity}명 · {meetup.schedule}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {show("store") && results.stores.length > 0 && (
                <section>
                  <GroupHead title="동네가게" count={results.stores.length} />
                  <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
                    {results.stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => onNavigate("storeDetail", store.id)}
                        className="flex items-center gap-5 py-4 text-left"
                      >
                        <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px]">
                          <Image src={store.image} alt="" fill sizes="60px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[16px] font-medium text-[var(--lc-ink)]">
                            <Highlight text={store.name} query={query} />
                          </p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-[var(--lc-muted)]">
                            <span className="inline-flex items-center gap-1.5">
                              <Storefront size={13} />
                              {store.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={13} />
                              {store.address}
                            </span>
                          </p>
                        </div>
                        <div className="hidden shrink-0 items-center gap-2 sm:flex">
                          <StarRating rating={store.rating} />
                          <span className="text-[13px] font-medium text-[var(--lc-ink)]">{store.rating}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {show("people") && results.people.length > 0 && (
                <section>
                  <GroupHead title="주민" count={results.people.length} />
                  <div className="grid gap-3 pt-5 sm:grid-cols-2">
                    {results.people.map((person) => (
                      <div
                        key={person.name}
                        className="flex items-center gap-3 rounded-[12px] bg-[var(--lc-surface-card)] px-5 py-4"
                      >
                        <Avatar name={person.name} size={40} />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 text-[15px] font-medium text-[var(--lc-ink)]">
                            <Highlight text={person.name} query={query} />
                            {person.official && <OfficialBadge />}
                          </p>
                          <p className="mt-0.5 text-[13px] text-[var(--lc-muted)]">
                            작성한 글 {person.posts}개
                          </p>
                        </div>
                        <ArrowUpRight size={16} className="shrink-0 text-[var(--lc-muted-soft)]" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
