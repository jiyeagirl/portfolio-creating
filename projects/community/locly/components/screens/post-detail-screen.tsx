"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  BookmarkSimple,
  ChatCircle,
  Flag,
  Heart,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { BOARDS, POSTS, POST_COMMENTS } from "@/projects/community/locly/lib/mock-data";
import type { Comment } from "@/projects/community/locly/lib/types";
import { Avatar, OfficialBadge, formatRelativeTime } from "@/projects/community/locly/components/layout/ui";

function CommentRow({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  return (
    <div className={depth > 0 ? "ml-11 mt-3" : ""}>
      <div className="flex gap-3">
        <Avatar name={comment.author} size={30} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-[var(--locly-ink)]">{comment.author}</span>
            <span className="text-[12px] text-[var(--locly-muted)]">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--locly-ink)]">{comment.content}</p>
          <div className="mt-1.5 flex items-center gap-3 text-[12px] font-medium text-[var(--locly-muted)]">
            <button className="inline-flex items-center gap-1 hover:text-[var(--locly-accent)]">
              <Heart size={13} /> {comment.likes}
            </button>
            <button className="hover:text-[var(--locly-accent)]">답글쓰기</button>
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

  return (
    <div className="mx-auto max-w-[760px] px-6 pb-24 pt-8 lg:px-0">
      <button
        onClick={() => onNavigate("community", post.board)}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
      >
        <ArrowLeft size={16} />
        {BOARDS.find((b) => b.key === post.board)?.label}으로 돌아가기
      </button>

      <article className="mt-5 border-b border-[var(--locly-border)] pb-6">
        <div className="flex items-center gap-2">
          {post.authorBadge === "official" && <OfficialBadge />}
          <span className="text-[12.5px] font-medium text-[var(--locly-accent)]">
            {BOARDS.find((b) => b.key === post.board)?.label}
          </span>
        </div>
        <h1 className="mt-3 text-[24px] font-bold leading-snug tracking-tight text-[var(--locly-ink)]">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <Avatar name={post.author} size={36} />
          <div>
            <p className="text-[13.5px] font-semibold text-[var(--locly-ink)]">{post.author}</p>
            <p className="text-[12px] text-[var(--locly-muted)]">
              {formatRelativeTime(post.createdAt)} · 조회 {post.views.toLocaleString()}
            </p>
          </div>
        </div>

        {post.image && (
          <div className="relative mt-5 h-[320px] w-full overflow-hidden rounded-2xl">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.8] text-[var(--locly-ink)]">
          {post.content}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--locly-surface)] px-3 py-1 text-[12.5px] text-[var(--locly-muted)]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              liked
                ? "border-[var(--locly-accent)] bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]"
                : "border-[var(--locly-border)] text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
            }`}
          >
            <Heart size={16} weight={liked ? "fill" : "regular"} />
            좋아요 {post.likes + (liked ? 1 : 0)}
          </button>
          <button
            onClick={() => setBookmarked((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              bookmarked
                ? "border-[var(--locly-accent)] bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]"
                : "border-[var(--locly-border)] text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
            }`}
          >
            <BookmarkSimple size={16} weight={bookmarked ? "fill" : "regular"} />
            북마크
          </button>
          <button className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-danger)]">
            <Flag size={15} />
            신고
          </button>
        </div>
      </article>

      <section className="mt-6">
        <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-[var(--locly-ink)]">
          <ChatCircle size={17} />
          댓글 {comments.length}
        </h2>

        <div className="mt-4 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="따뜻한 댓글을 남겨주세요"
            className="min-w-0 flex-1 rounded-lg border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-4 py-2.5 text-[13.5px] outline-none placeholder:text-[var(--locly-muted)] focus:border-[var(--locly-accent)]"
          />
          <button
            disabled={!draft.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)] transition-opacity disabled:opacity-30"
          >
            <PaperPlaneTilt size={16} />
          </button>
        </div>

        <div className="mt-6 divide-y divide-[var(--locly-border)]">
          {comments.map((comment) => (
            <div key={comment.id} className="py-4 first:pt-0">
              <CommentRow comment={comment} />
            </div>
          ))}
          {comments.length === 0 && (
            <p className="py-10 text-center text-[13px] text-[var(--locly-muted)]">
              아직 댓글이 없어요. 첫 댓글을 남겨보세요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
