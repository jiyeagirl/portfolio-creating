"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatCircle, PaperPlaneTilt, Sparkle, ThumbsUp } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { CATEGORY_LABEL, pexelsPhoto, COMMUNITY_POSTS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { Comment } from "@/projects/community/wedit/lib/types";
import { Avatar, Tag } from "@/projects/community/wedit/components/ui";

export function PostDetailScreen({ onNavigate, postId }: { onNavigate: NavigateFn; postId: string }) {
  const post = COMMUNITY_POSTS.find((p) => p.id === postId) ?? COMMUNITY_POSTS[0];
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [draft, setDraft] = useState("");

  const submitComment = () => {
    if (!draft.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        authorInitial: "나",
        authorLabel: "나",
        content: draft.trim(),
        likeCount: 0,
        createdAt: "방금",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-[100px]">
      <ScreenHeader
        title="커뮤니티"
        onBack={() => onNavigate("community")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
      />

      <div className="flex flex-col gap-3 px-5 pt-5">
        <Tag>{CATEGORY_LABEL[post.category]}</Tag>
        <h1 className="text-[18px] font-bold leading-[25px] text-[var(--wd-ink)]">{post.title}</h1>
        <div className="flex items-center gap-2">
          <Avatar initial={post.authorInitial} size={26} />
          <span className="text-[12.5px] font-medium text-[var(--wd-body)]">{post.authorLabel}</span>
          <span className="text-[11.5px] text-[var(--wd-muted)]">{post.createdAt}</span>
        </div>
        {post.photoId && (
          <div className="relative h-[180px] w-full overflow-hidden rounded-2xl">
            <Image
              src={pexelsPhoto(post.photoId, 720, 420)}
              alt=""
              fill
              sizes="360px"
              className="object-cover"
              style={post.photoCrop ? { objectPosition: post.photoCrop } : undefined}
            />
          </div>
        )}
        <p className="text-[14px] leading-[21px] text-[var(--wd-body)]">{post.content}</p>

        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className={`flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium ${
            liked
              ? "border-[var(--wd-accent)] bg-[var(--wd-accent-soft)] text-[var(--wd-accent-strong)]"
              : "border-[var(--wd-border)] text-[var(--wd-muted)]"
          }`}
        >
          <ThumbsUp size={13} weight={liked ? "fill" : "regular"} />
          좋아요 {post.likeCount + (liked ? 1 : 0)}
        </button>
      </div>

      {post.aiAnswer && (
        <div className="mx-5 mt-6 flex flex-col gap-2 rounded-2xl bg-[var(--wd-surface-tint)] p-4">
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--wd-accent-strong)]">
            <Sparkle size={14} weight="fill" />
            AI 자동 답변
          </div>
          <p className="text-[13px] leading-[19px] text-[var(--wd-body)]">{post.aiAnswer}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 px-5">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--wd-ink)]">
          <ChatCircle size={15} />
          답변 {comments.length}
        </p>
        <div className="flex flex-col divide-y divide-[var(--wd-border)]">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5 py-3">
              <Avatar initial={c.authorInitial} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-semibold text-[var(--wd-ink)]">{c.authorLabel}</span>
                  <span className="text-[10.5px] text-[var(--wd-muted)]">{c.createdAt}</span>
                </div>
                <p className="mt-0.5 text-[13px] leading-[19px] text-[var(--wd-body)]">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-[var(--wd-border)] bg-white px-4 py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
          placeholder="답변을 남겨보세요"
          className="h-10 flex-1 rounded-full border border-[var(--wd-border)] bg-[var(--wd-canvas)] px-4 text-[13px] text-[var(--wd-ink)] outline-none placeholder:text-[var(--wd-muted)]"
        />
        <button
          type="button"
          onClick={submitComment}
          aria-label="답변 등록"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--wd-accent)] text-white active:bg-[var(--wd-accent-strong)]"
        >
          <PaperPlaneTilt size={16} weight="fill" />
        </button>
      </div>
    </div>
  );
}
