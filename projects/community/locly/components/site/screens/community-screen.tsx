"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BookmarkSimple, ChatCircle, Heart, PencilSimpleLine } from "@phosphor-icons/react";
import { BOARDS, POSTS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Badge,
  CONTAINER,
  OfficialBadge,
  PageHeader,
  PrimaryButton,
  formatRelativeTime,
} from "@/projects/community/locly/components/site/ui";

type SortMode = "latest" | "popular";

export function CommunityScreen({
  onNavigate,
  initialBoard,
}: {
  onNavigate: NavigateFn;
  initialBoard?: string;
}) {
  const valid = BOARDS.some((b) => b.key === initialBoard) ? initialBoard! : "all";
  const [board, setBoard] = useState(valid);
  const [sort, setSort] = useState<SortMode>("latest");

  const posts = useMemo(() => {
    const filtered = board === "all" ? POSTS : POSTS.filter((p) => p.board === board);
    return [...filtered].sort((a, b) =>
      sort === "popular" ? b.likes - a.likes : +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  }, [board, sort]);

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <PageHeader
            title="커뮤니티"
            lead="나인동 주민들이 나누는 일상, 정보, 질문. 게시판을 골라 이웃의 이야기를 살펴보세요."
          />
        </div>
        <div className="pt-2">
          <PrimaryButton onClick={() => onNavigate("postWrite")}>
            <PencilSimpleLine size={15} weight="bold" />
            글쓰기
          </PrimaryButton>
        </div>
      </div>

      <div className="locly-scrollbar-none mt-8 flex items-center gap-1 overflow-x-auto">
        {[{ key: "all", label: "전체" }, ...BOARDS].map((b) => (
          <button
            key={b.key}
            onClick={() => setBoard(b.key)}
            className={`shrink-0 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
              board === b.key
                ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                : "text-[var(--lc-muted)]"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-[var(--lc-hairline)] pb-4">
        <p className="text-[13px] text-[var(--lc-muted)]">
          전체 <span className="font-medium text-[var(--lc-ink)]">{posts.length}</span>건
        </p>
        <div className="flex items-center gap-3 text-[13px] font-medium">
          {(["latest", "popular"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={sort === mode ? "text-[var(--lc-ink)]" : "text-[var(--lc-muted-soft)]"}
            >
              {mode === "latest" ? "최신순" : "인기순"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[var(--lc-hairline)]">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onNavigate("postDetail", post.id)}
            className="flex items-start gap-6 py-6 text-left"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{BOARDS.find((b) => b.key === post.board)?.label}</Badge>
                {post.authorBadge === "official" && <OfficialBadge />}
                {post.isNotice && <Badge tone="coral">공지</Badge>}
              </div>
              <p className="mt-3 text-[18px] font-medium leading-[1.4] text-[var(--lc-ink)]">{post.title}</p>
              <p className="mt-2 line-clamp-2 max-w-[70ch] text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                {post.excerpt}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--lc-muted-soft)]">
                <span className="text-[var(--lc-body)]">{post.author}</span>
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
              <div className="relative hidden h-[104px] w-[152px] shrink-0 overflow-hidden rounded-[8px] sm:block">
                <Image src={post.image} alt="" fill sizes="152px" className="object-cover" />
              </div>
            )}
          </button>
        ))}
        {posts.length === 0 && (
          <p className="py-20 text-center text-[14px] text-[var(--lc-muted)]">
            아직 이 게시판에 작성된 글이 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
