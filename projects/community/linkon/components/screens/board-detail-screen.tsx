"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkSimple,
  CalendarBlank,
  DownloadSimple,
  Eye,
  FileText,
  SealCheck,
  ShareNetwork,
} from "@phosphor-icons/react";
import { BOARD_POSTS, daysUntil, formatDate, formatRelativeTime } from "@/projects/community/linkon/lib/mock-data";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";

export function BoardDetailScreen({
  postId,
  onNavigate,
}: {
  postId: string;
  onNavigate: NavigateFn;
}) {
  const index = BOARD_POSTS.findIndex((p) => p.id === postId);
  const post = BOARD_POSTS[index];
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post?.comments ?? []);

  if (!post) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24">
        <EmptyState
          icon={<FileText size={22} />}
          title="게시글을 찾을 수 없습니다"
          description="삭제되었거나 이동된 게시글입니다."
          action={<SecondaryButton onClick={() => onNavigate("board")}>목록으로</SecondaryButton>}
        />
      </div>
    );
  }

  const prev = BOARD_POSTS[index - 1];
  const next = BOARD_POSTS[index + 1];

  const addComment = () => {
    if (!comment.trim()) return;
    setComments([
      ...comments,
      { author: "A테크 정하윤", content: comment.trim(), createdAt: "2026-07-27T12:00:00" },
    ]);
    setComment("");
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-8 lg:px-10">
      <button
        onClick={() => onNavigate("board")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-ink)]"
      >
        <ArrowLeft size={15} weight="bold" />
        정보게시판
      </button>

      <article className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{post.category}</Badge>
          {post.deadline && daysUntil(post.deadline) >= 0 && (
            <Badge tone="danger">접수 마감 D-{daysUntil(post.deadline)}</Badge>
          )}
        </div>
        <h1 className="mt-4 text-[30px] font-bold leading-[1.35] tracking-tight text-[var(--lk-ink)]">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--lk-border)] py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]">
              <SealCheck size={18} weight="fill" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[var(--lk-ink)]">{post.authorOrg}</p>
              <p className="lk-num mt-0.5 text-[12.5px] text-[var(--lk-muted)]">
                {post.author} {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="lk-num flex items-center gap-4 text-[12.5px] font-medium text-[var(--lk-muted)]">
            <span className="inline-flex items-center gap-1">
              <Eye size={14} />
              {post.views.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookmarkSimple size={14} />
              {post.bookmarks + (bookmarked ? 1 : 0)}
            </span>
          </div>
        </div>

        {post.deadline && (
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-[var(--lk-surface)] px-6 py-5">
            <div>
              <p className="text-[12px] font-semibold text-[var(--lk-muted)]">접수 마감</p>
              <p className="lk-num mt-1 text-[16px] font-bold text-[var(--lk-ink)]">
                {formatDate(post.deadline)}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[var(--lk-muted)]">남은 기간</p>
              <p className="lk-num mt-1 text-[16px] font-bold text-[var(--lk-accent)]">
                {daysUntil(post.deadline)}일
              </p>
            </div>
            <div className="ml-auto">
              <PrimaryButton onClick={() => setBookmarked(true)}>
                <CalendarBlank size={16} weight="fill" />내 일정에 추가
              </PrimaryButton>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {post.content.map((paragraph) => (
            <p key={paragraph} className="text-[15.5px] leading-[1.9] text-[var(--lk-ink)]">
              {paragraph}
            </p>
          ))}
        </div>

        {post.attachments.length > 0 && (
          <div className="mt-9">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">첨부파일</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {post.attachments.map((file) => (
                <li key={file.name}>
                  <button className="flex w-full items-center gap-3 rounded-xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-4 py-3 text-left transition-colors hover:border-[var(--lk-accent)]">
                    <FileText size={18} className="shrink-0 text-[var(--lk-accent)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                        {file.name}
                      </span>
                      <span className="lk-num block text-[12px] text-[var(--lk-muted)]">{file.size}</span>
                    </span>
                    <DownloadSimple size={17} className="shrink-0 text-[var(--lk-muted)]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setBookmarked((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              bookmarked
                ? "border-[var(--lk-accent)] bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                : "border-[var(--lk-border)] text-[var(--lk-ink)] hover:border-[var(--lk-accent)]"
            }`}
          >
            <BookmarkSimple size={16} weight={bookmarked ? "fill" : "regular"} />
            {bookmarked ? "북마크됨" : "북마크"}
          </button>
          <button
            onClick={() => setShared(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--lk-border)] px-4 py-2 text-[13.5px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)]"
          >
            <ShareNetwork size={16} />
            {shared ? "링크 복사됨" : "공유"}
          </button>
          <div className="ml-auto flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--lk-surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--lk-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="lk-num text-[17px] font-bold text-[var(--lk-ink)]">댓글 {comments.length}</h2>
        <ul className="mt-4 divide-y divide-[var(--lk-border)] border-y border-[var(--lk-border)]">
          {comments.length === 0 && (
            <li className="py-6 text-[13.5px] text-[var(--lk-muted)]">
              아직 댓글이 없습니다. 공고에 대한 궁금한 점을 남기면 운영기관이 답변합니다.
            </li>
          )}
          {comments.map((item, i) => (
            <li key={`${item.author}-${i}`} className="py-4">
              <p className="lk-num text-[13.5px] font-semibold text-[var(--lk-ink)]">
                {item.author}
                <span className="ml-2 font-normal text-[var(--lk-muted)]">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--lk-ink)]">{item.content}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            placeholder="댓글을 입력하세요"
            aria-label="댓글 입력"
            className={inputClass}
          />
          <PrimaryButton onClick={addComment}>등록</PrimaryButton>
        </div>
      </section>

      <nav className="mt-12 divide-y divide-[var(--lk-border)] border-y border-[var(--lk-border)]">
        {prev && (
          <button
            onClick={() => onNavigate("boardDetail", prev.id)}
            className="flex w-full items-center gap-4 py-4 text-left"
          >
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-[var(--lk-muted)]">
              <ArrowLeft size={13} weight="bold" />
              이전 글
            </span>
            <span className="truncate text-[14px] font-medium text-[var(--lk-ink)]">{prev.title}</span>
          </button>
        )}
        {next && (
          <button
            onClick={() => onNavigate("boardDetail", next.id)}
            className="flex w-full items-center gap-4 py-4 text-left"
          >
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-[var(--lk-muted)]">
              다음 글
              <ArrowRight size={13} weight="bold" />
            </span>
            <span className="truncate text-[14px] font-medium text-[var(--lk-ink)]">{next.title}</span>
          </button>
        )}
      </nav>
    </div>
  );
}
