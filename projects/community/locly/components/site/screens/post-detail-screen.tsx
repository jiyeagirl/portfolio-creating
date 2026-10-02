"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, BookmarkSimple, ChatCircle, Flag, Heart, PaperPlaneTilt } from "@phosphor-icons/react";
import { BOARDS, POSTS, POST_COMMENTS } from "@/projects/community/locly/lib/mock-data";
import type { Comment } from "@/projects/community/locly/lib/types";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Avatar,
  Badge,
  CONTAINER,
  Display,
  OfficialBadge,
  formatRelativeTime,
} from "@/projects/community/locly/components/site/ui";

function CommentRow({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  return (
    <div className={depth > 0 ? "ml-12 mt-5 border-l border-[var(--lc-hairline)] pl-5" : ""}>
      <div className="flex gap-3">
        <Avatar name={comment.author} size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-[var(--lc-ink)]">{comment.author}</span>
            <span className="text-[13px] text-[var(--lc-muted-soft)]">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1.5 text-[15px] leading-[1.6] text-[var(--lc-body)]">{comment.content}</p>
          <div className="mt-2 flex items-center gap-4 text-[13px] font-medium text-[var(--lc-muted)]">
            <span className="inline-flex items-center gap-1">
              <Heart size={13} /> {comment.likes}
            </span>
            <span>답글쓰기</span>
          </div>
        </div>
      </div>
      {comment.replies?.map((reply) => <CommentRow key={reply.id} comment={reply} depth={depth + 1} />)}
    </div>
  );
}

export function PostDetailScreen({ postId, onNavigate }: { postId: string; onNavigate: NavigateFn }) {
  const post = POSTS.find((p) => p.id === postId) ?? POSTS[0];
  const comments = POST_COMMENTS[post.id] ?? [];
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [draft, setDraft] = useState("");
  const boardName = BOARDS.find((b) => b.key === post.board)?.label;

  return (
    <div className={`${CONTAINER} py-14 lg:py-20`}>
      <div className="mx-auto max-w-[720px]">
        <button
          onClick={() => onNavigate("community", post.board)}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--lc-muted)]"
        >
          <ArrowLeft size={15} />
          {boardName}
        </button>

        <article className="mt-6 border-b border-[var(--lc-hairline)] pb-10">
          <div className="flex flex-wrap items-center gap-2">
            {post.authorBadge === "official" ? <OfficialBadge /> : <Badge>{boardName}</Badge>}
            {post.isNotice && <Badge tone="coral">공지</Badge>}
          </div>

          <Display as="h1" size="md" className="mt-5 text-[var(--lc-ink)]">
            {post.title}
          </Display>

          <div className="mt-6 flex items-center gap-3 border-b border-[var(--lc-hairline-soft)] pb-6">
            <Avatar name={post.author} size={40} />
            <div>
              <p className="text-[15px] font-medium text-[var(--lc-ink)]">{post.author}</p>
              <p className="text-[13px] text-[var(--lc-muted-soft)]">
                {formatRelativeTime(post.createdAt)} · 조회 {post.views.toLocaleString()}
              </p>
            </div>
          </div>

          {post.image && (
            <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-[12px]">
              <Image src={post.image} alt={post.title} fill sizes="720px" className="object-cover" priority />
            </div>
          )}

          <div className="mt-8 whitespace-pre-line text-[17px] leading-[1.75] text-[var(--lc-body-strong)]">
            {post.content}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--lc-surface-card)] px-3 py-1 text-[13px] text-[var(--lc-body)]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2">
            <button
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              className={`inline-flex h-10 items-center gap-2 rounded-[8px] border px-5 text-[14px] font-medium transition-colors ${
                liked
                  ? "border-[var(--lc-primary)] bg-[var(--lc-primary)] text-[var(--lc-on-primary)]"
                  : "border-[var(--lc-hairline)] bg-[var(--lc-canvas)] text-[var(--lc-ink)]"
              }`}
            >
              <Heart size={15} weight={liked ? "fill" : "regular"} />
              좋아요 {post.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={() => setBookmarked((v) => !v)}
              aria-pressed={bookmarked}
              className={`inline-flex h-10 items-center gap-2 rounded-[8px] border px-5 text-[14px] font-medium transition-colors ${
                bookmarked
                  ? "border-[var(--lc-ink)] bg-[var(--lc-ink)] text-[var(--lc-on-dark)]"
                  : "border-[var(--lc-hairline)] bg-[var(--lc-canvas)] text-[var(--lc-ink)]"
              }`}
            >
              <BookmarkSimple size={15} weight={bookmarked ? "fill" : "regular"} />
              북마크
            </button>
            <button className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--lc-muted-soft)]">
              <Flag size={14} />
              신고
            </button>
          </div>
        </article>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-[16px] font-medium text-[var(--lc-ink)]">
            <ChatCircle size={17} />
            댓글 {comments.length}
          </h2>

          <div className="mt-5 flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="따뜻한 댓글을 남겨주세요"
              className="h-10 min-w-0 flex-1 rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] px-3.5 text-[15px] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
            />
            <button
              disabled={!draft.trim()}
              aria-label="댓글 등록"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--lc-primary)] text-[var(--lc-on-primary)] transition-colors disabled:bg-[var(--lc-primary-disabled)] disabled:text-[var(--lc-muted)]"
            >
              <PaperPlaneTilt size={16} />
            </button>
          </div>

          <div className="mt-8 flex flex-col divide-y divide-[var(--lc-hairline)]">
            {comments.map((comment) => (
              <div key={comment.id} className="py-6 first:pt-0">
                <CommentRow comment={comment} />
              </div>
            ))}
            {comments.length === 0 && (
              <p className="py-14 text-center text-[14px] text-[var(--lc-muted)]">
                아직 댓글이 없어요. 첫 댓글을 남겨보세요.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
