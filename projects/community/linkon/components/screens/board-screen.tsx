"use client";

import { useMemo, useState } from "react";
import {
  BookmarkSimple,
  CalendarBlank,
  ChatCircle,
  Eye,
  MagnifyingGlass,
  Paperclip,
  PushPin,
  Tag,
} from "@phosphor-icons/react";
import { BOARD_POSTS, daysUntil, formatDate } from "@/projects/community/linkon/lib/mock-data";
import type { BoardCategory } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  EmptyState,
  Reveal,
  Tabs,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";

const CATEGORIES: (BoardCategory | "전체")[] = [
  "전체",
  "지원사업",
  "공지사항",
  "투자 정보",
  "교육 프로그램",
  "창업 자료실",
];

const PERIODS = [
  { key: "all", label: "전체 기간" },
  { key: "7", label: "최근 1주" },
  { key: "30", label: "최근 1개월" },
  { key: "90", label: "최근 3개월" },
] as const;

export function BoardScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"title" | "tag">("title");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("all");

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOARD_POSTS.filter((post) => {
      if (category !== "전체" && post.category !== category) return false;
      if (q) {
        const target =
          scope === "title"
            ? `${post.title} ${post.summary}`.toLowerCase()
            : post.tags.join(" ").toLowerCase();
        if (!target.includes(q)) return false;
      }
      if (period !== "all") {
        const days = -daysUntil(post.createdAt.slice(0, 10));
        if (days > Number(period)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [category, query, scope, period]);

  const tabs = CATEGORIES.map((key) => ({
    key,
    label: key,
    count: key === "전체" ? BOARD_POSTS.length : BOARD_POSTS.filter((p) => p.category === key).length,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 lg:px-10">
      <h1 className="text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">정보게시판</h1>
      <p className="mt-2 text-[14px] text-[var(--lk-muted)]">
        운영기관이 등록한 지원사업 공고, 투자 정보, 교육 프로그램과 자료를 모았습니다.
      </p>

      <div className="mt-7">
        <Tabs items={tabs} active={category} onChange={setCategory} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-lg border border-[var(--lk-border)]">
          {(["title", "tag"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setScope(key)}
              className={`px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
                scope === key
                  ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
                  : "bg-[var(--lk-elevated)] text-[var(--lk-muted)]"
              }`}
            >
              {key === "title" ? "제목" : "태그"}
            </button>
          ))}
        </div>
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-3.5 py-2.5">
          <MagnifyingGlass size={17} className="shrink-0 text-[var(--lk-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={scope === "title" ? "제목으로 검색" : "태그로 검색 (예: 데모데이)"}
            aria-label="게시글 검색"
            className="w-full bg-transparent text-[14px] text-[var(--lk-ink)] outline-none"
          />
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as typeof period)}
          aria-label="기간 선택"
          className={`${inputClass} w-[148px] cursor-pointer`}
        >
          {PERIODS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <p className="lk-num mt-5 text-[13px] font-medium text-[var(--lk-muted)]">총 {posts.length}건</p>

      {posts.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<MagnifyingGlass size={22} />}
            title="검색 결과가 없습니다"
            description="검색어를 바꾸거나 기간 조건을 넓혀보세요."
          />
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-[var(--lk-border)] border-t border-[var(--lk-border)]">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={Math.min(index, 8) * 0.02}>
              <li>
                <button
                  onClick={() => onNavigate("boardDetail", post.id)}
                  className="group flex w-full flex-col gap-3 py-5 text-left sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lk-accent-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--lk-accent)]">
                          <PushPin size={11} weight="fill" />
                          고정
                        </span>
                      )}
                      <Badge tone={post.category === "지원사업" ? "accent" : "neutral"}>
                        {post.category}
                      </Badge>
                      {post.deadline && daysUntil(post.deadline) >= 0 && (
                        <span className="lk-num text-[12px] font-bold text-[var(--lk-danger)]">
                          마감 D-{daysUntil(post.deadline)}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[16px] font-bold leading-snug text-[var(--lk-ink)] transition-colors group-hover:text-[var(--lk-accent)]">
                      {post.title}
                    </p>
                    <p className="mt-1.5 line-clamp-1 text-[13.5px] text-[var(--lk-muted)]">
                      {post.summary}
                    </p>
                    <div className="lk-num mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[var(--lk-muted)]">
                      <span className="font-semibold text-[var(--lk-ink)]">{post.authorOrg}</span>
                      <span>{post.author}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarBlank size={13} />
                        {formatDate(post.createdAt)}
                      </span>
                      {post.attachments.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Paperclip size={13} />
                          {post.attachments.length}
                        </span>
                      )}
                      {post.tags.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Tag size={13} />
                          {post.tags.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="lk-num flex shrink-0 items-center gap-4 text-[12.5px] font-medium text-[var(--lk-muted)] sm:w-[190px] sm:justify-end">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={14} />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ChatCircle size={14} />
                      {post.comments.length}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookmarkSimple size={14} />
                      {post.bookmarks}
                    </span>
                  </div>
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
