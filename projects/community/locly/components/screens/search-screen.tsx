"use client";

import { useMemo, useState } from "react";
import { CalendarBlank, ChatCircle, MagnifyingGlass, MapPin, Storefront, UsersThree } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { EVENTS, MEETUPS, POSTS, STORES } from "@/projects/community/locly/lib/mock-data";
import { Avatar, EmptyState } from "@/projects/community/locly/components/layout/ui";

const RECENT = ["콩국수", "무더위쉼터", "러닝크루", "분리배출"];
const POPULAR = ["여름밤 야시장", "OO면가", "독서모임", "실외기 소음", "폭염특보"];

const TABS = [
  { key: "post", label: "게시글" },
  { key: "event", label: "행사" },
  { key: "meetup", label: "모임" },
  { key: "store", label: "가게" },
  { key: "user", label: "사용자" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function SearchScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("post");

  const users = useMemo(() => Array.from(new Set(POSTS.map((p) => p.author))), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { post: [], event: [], meetup: [], store: [], user: [] };
    return {
      post: POSTS.filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))),
      event: EVENTS.filter((e) => e.title.toLowerCase().includes(q)),
      meetup: MEETUPS.filter((m) => m.title.toLowerCase().includes(q)),
      store: STORES.filter((s) => s.name.toLowerCase().includes(q)),
      user: users.filter((u) => u.toLowerCase().includes(q)),
    };
  }, [query, users]);

  const counts: Record<TabKey, number> = {
    post: results.post.length,
    event: results.event.length,
    meetup: results.meetup.length,
    store: results.store.length,
    user: results.user.length,
  };
  const hasQuery = query.trim().length > 0;
  const totalResults = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-[760px] px-6 pb-24 pt-8 lg:px-0">
      <div className="flex items-center gap-2 rounded-full border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-4 py-3">
        <MagnifyingGlass size={18} className="text-[var(--locly-muted)]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="게시글, 행사, 모임, 가게, 사용자 통합 검색"
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--locly-muted)]"
        />
      </div>

      {!hasQuery && (
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="text-[13px] font-semibold text-[var(--locly-ink)]">최근 검색어</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {RECENT.map((r) => (
                <button
                  key={r}
                  onClick={() => setQuery(r)}
                  className="rounded-full border border-[var(--locly-border)] px-3 py-1.5 text-[12.5px] text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--locly-ink)]">인기 검색어</p>
            <div className="mt-2 flex flex-col divide-y divide-[var(--locly-border)]">
              {POPULAR.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setQuery(p)}
                  className="flex items-center gap-3 py-2.5 text-left text-[13.5px] text-[var(--locly-ink)] hover:text-[var(--locly-accent)]"
                >
                  <span className={`w-4 text-[13px] font-bold ${i < 3 ? "text-[var(--locly-accent)]" : "text-[var(--locly-muted)]"}`}>
                    {i + 1}
                  </span>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasQuery && (
        <>
          <div className="locly-scrollbar-none mt-6 flex items-center gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  tab === t.key ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
                }`}
              >
                {t.label} {counts[t.key]}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {totalResults === 0 && (
              <EmptyState
                icon={<MagnifyingGlass size={20} />}
                title="검색 결과가 없어요"
                description={`"${query}"와 일치하는 결과를 찾지 못했어요. 다른 검색어로 시도해보세요.`}
              />
            )}

            {tab === "post" && (
              <div className="flex flex-col divide-y divide-[var(--locly-border)]">
                {results.post.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => onNavigate("postDetail", post.id)}
                    className="flex items-center gap-3 py-4 text-left hover:bg-[var(--locly-surface)]"
                  >
                    <ChatCircle size={16} className="shrink-0 text-[var(--locly-accent)]" />
                    <span className="line-clamp-1 text-[14px] font-medium text-[var(--locly-ink)]">{post.title}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === "event" && (
              <div className="flex flex-col divide-y divide-[var(--locly-border)]">
                {results.event.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onNavigate("eventDetail", event.id)}
                    className="flex items-center gap-3 py-4 text-left hover:bg-[var(--locly-surface)]"
                  >
                    <CalendarBlank size={16} className="shrink-0 text-[var(--locly-accent)]" />
                    <span className="line-clamp-1 text-[14px] font-medium text-[var(--locly-ink)]">{event.title}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === "meetup" && (
              <div className="flex flex-col divide-y divide-[var(--locly-border)]">
                {results.meetup.map((meetup) => (
                  <button
                    key={meetup.id}
                    onClick={() => onNavigate("meetupDetail", meetup.id)}
                    className="flex items-center gap-3 py-4 text-left hover:bg-[var(--locly-surface)]"
                  >
                    <UsersThree size={16} className="shrink-0 text-[var(--locly-accent)]" />
                    <span className="line-clamp-1 text-[14px] font-medium text-[var(--locly-ink)]">{meetup.title}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === "store" && (
              <div className="flex flex-col divide-y divide-[var(--locly-border)]">
                {results.store.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => onNavigate("storeDetail", store.id)}
                    className="flex items-center gap-3 py-4 text-left hover:bg-[var(--locly-surface)]"
                  >
                    <Storefront size={16} className="shrink-0 text-[var(--locly-accent)]" />
                    <span className="line-clamp-1 text-[14px] font-medium text-[var(--locly-ink)]">{store.name}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === "user" && (
              <div className="flex flex-col divide-y divide-[var(--locly-border)]">
                {results.user.map((user) => (
                  <div key={user} className="flex items-center gap-3 py-4">
                    <Avatar name={user} size={30} />
                    <span className="text-[14px] font-medium text-[var(--locly-ink)]">{user}</span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-[var(--locly-muted)]">
                      <MapPin size={12} />
                      OO동
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
