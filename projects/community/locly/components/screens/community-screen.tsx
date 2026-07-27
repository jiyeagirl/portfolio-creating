"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BookmarkSimple, ChatCircle, Heart, PencilSimpleLine } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { BOARDS, POSTS } from "@/projects/community/locly/lib/mock-data";
import { Badge, OfficialBadge, PrimaryButton, formatRelativeTime } from "@/projects/community/locly/components/layout/ui";

type SortMode = "latest" | "popular";

export function CommunityScreen({
  onNavigate,
  initialBoard,
}: {
  onNavigate: NavigateFn;
  initialBoard?: string;
}) {
  const validBoard = BOARDS.some((b) => b.key === initialBoard) ? initialBoard : "all";
  const [board, setBoard] = useState<string>(validBoard ?? "all");
  const [sort, setSort] = useState<SortMode>("latest");

  const posts = useMemo(() => {
    const filtered = board === "all" ? POSTS : POSTS.filter((p) => p.board === board);
    const sorted = [...filtered].sort((a, b) =>
      sort === "popular"
        ? b.likes - a.likes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sorted;
  }, [board, sort]);

  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-8 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--locly-ink)]">커뮤니티</h1>
          <p className="mt-1 text-[13.5px] text-[var(--locly-muted)]">
            OO동 주민들이 나누는 일상, 정보, 질문을 확인해보세요
          </p>
        </div>
        <PrimaryButton onClick={() => onNavigate("postWrite")}>
          <PencilSimpleLine size={16} weight="bold" />
          글쓰기
        </PrimaryButton>
      </div>

      <div className="locly-scrollbar-none mt-6 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setBoard("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            board === "all"
              ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]"
              : "border border-[var(--locly-border)] text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
          }`}
        >
          전체
        </button>
        {BOARDS.map((b) => (
          <button
            key={b.key}
            onClick={() => setBoard(b.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              board === b.key
                ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]"
                : "border border-[var(--locly-border)] text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-1 text-[13px] font-medium text-[var(--locly-muted)]">
        <button
          onClick={() => setSort("latest")}
          className={sort === "latest" ? "text-[var(--locly-ink)]" : "hover:text-[var(--locly-ink)]"}
        >
          최신순
        </button>
        <span className="text-[var(--locly-border)]">/</span>
        <button
          onClick={() => setSort("popular")}
          className={sort === "popular" ? "text-[var(--locly-ink)]" : "hover:text-[var(--locly-ink)]"}
        >
          인기순
        </button>
      </div>

      <div className="mt-3 divide-y divide-[var(--locly-border)] border-t border-[var(--locly-border)]">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onNavigate("postDetail", post.id)}
            className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-[var(--locly-surface)]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge tone="neutral">{BOARDS.find((b) => b.key === post.board)?.label}</Badge>
                {post.authorBadge === "official" && <OfficialBadge />}
                {post.isNotice && <Badge tone="accent">공지</Badge>}
              </div>
              <p className="mt-2 line-clamp-1 text-[15px] font-semibold text-[var(--locly-ink)]">{post.title}</p>
              <p className="mt-1 line-clamp-1 text-[13px] text-[var(--locly-muted)]">{post.excerpt}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--locly-muted)]">
                <span>{post.author}</span>
                <span>{formatRelativeTime(post.createdAt)}</span>
                <span className="inline-flex items-center gap-1">
                  <Heart size={13} /> {post.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ChatCircle size={13} /> {post.comments}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookmarkSimple size={13} /> {post.bookmarks}
                </span>
              </div>
            </div>
            {post.image && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image src={post.image} alt="" fill className="object-cover" />
              </div>
            )}
          </button>
        ))}
        {posts.length === 0 && (
          <p className="py-16 text-center text-[13.5px] text-[var(--locly-muted)]">
            아직 이 게시판에 작성된 글이 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
