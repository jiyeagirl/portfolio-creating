"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChatCircle, MagnifyingGlass, PencilSimpleLine, Sparkle, ThumbsUp } from "@phosphor-icons/react";
import { CATEGORY_LABEL, pexelsPhoto, COMMUNITY_POSTS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { CommunityCategory } from "@/projects/community/wedit/lib/types";
import { Avatar, EmptyState, Tag } from "@/projects/community/wedit/components/ui";

type Filter = "all" | CommunityCategory;

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "studio", label: "스튜디오" },
  { key: "dress", label: "드레스" },
  { key: "makeup", label: "메이크업" },
  { key: "prep", label: "예식 준비" },
];

export function CommunityScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [query, setQuery] = useState("");

  const posts = useMemo(() => {
    let list = COMMUNITY_POSTS.filter((p) => (filter === "all" ? true : p.category === filter));
    if (query.trim()) list = list.filter((p) => p.title.includes(query) || p.content.includes(query));
    list = [...list].sort((a, b) =>
      sort === "popular" ? b.likeCount - a.likeCount : a.createdAt < b.createdAt ? 1 : -1,
    );
    return list;
  }, [filter, sort, query]);

  return (
    <div className="relative flex min-h-full w-full flex-col pb-[108px] pt-[68px]">
      <div className="flex flex-col gap-3 px-5">
        <div className="flex h-11 items-center gap-2 rounded-full border border-[var(--wd-border)] bg-white px-4">
          <MagnifyingGlass size={17} className="text-[var(--wd-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="궁금한 내용을 검색해보세요"
            className="h-full flex-1 bg-transparent text-[13.5px] text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                  filter === t.key
                    ? "bg-[var(--wd-ink)] text-white"
                    : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 text-[12px]">
          <button
            type="button"
            onClick={() => setSort("latest")}
            className={sort === "latest" ? "font-semibold text-[var(--wd-ink)]" : "text-[var(--wd-muted)]"}
          >
            최신글
          </button>
          <button
            type="button"
            onClick={() => setSort("popular")}
            className={sort === "popular" ? "font-semibold text-[var(--wd-ink)]" : "text-[var(--wd-muted)]"}
          >
            인기글
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={<ChatCircle size={24} weight="duotone" />}
          title="게시글이 없어요"
          body="가장 먼저 질문을 남기고 답변을 받아보세요."
        />
      ) : (
        <div className="mt-3 flex flex-col divide-y divide-[var(--wd-border)] px-5">
          {posts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onNavigate("postDetail", { id: p.id })}
              className="flex items-start gap-3 py-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Tag>{CATEGORY_LABEL[p.category]}</Tag>
                  {p.aiAnswer && (
                    <span className="flex items-center gap-0.5 text-[10.5px] font-semibold text-[var(--wd-accent)]">
                      <Sparkle size={10} weight="fill" />
                      AI 답변
                    </span>
                  )}
                </div>
                <p className="mt-1.5 truncate text-[14px] font-semibold text-[var(--wd-ink)]">{p.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-[18px] text-[var(--wd-muted)]">
                  {p.content}
                </p>
                <div className="mt-2 flex items-center gap-2.5 text-[11px] text-[var(--wd-muted)]">
                  <span className="flex items-center gap-1">
                    <Avatar initial={p.authorInitial} size={16} />
                    {p.authorLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={11} />
                    {p.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChatCircle size={11} />
                    {p.commentCount}
                  </span>
                </div>
              </div>
              {p.photoId && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={pexelsPhoto(p.photoId, 140, 140)}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    style={p.photoCrop ? { objectPosition: p.photoCrop } : undefined}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onNavigate("postWrite")}
        className="absolute bottom-[104px] right-5 z-30 flex items-center gap-2 rounded-full bg-[var(--wd-accent)] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_30px_-8px_rgba(178,58,110,0.55)] active:scale-[0.96]"
        style={{ transition: "transform 0.2s cubic-bezier(.16,1,.3,1)" }}
      >
        <PencilSimpleLine size={16} weight="bold" />
        질문 작성
      </button>
    </div>
  );
}
