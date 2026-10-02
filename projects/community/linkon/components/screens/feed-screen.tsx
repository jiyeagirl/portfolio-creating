"use client";

import { useMemo, useState } from "react";
import {
  BookmarkSimple,
  ChatCircle,
  DownloadSimple,
  FilePdf,
  Fire,
  Handshake,
  Heart,
  PencilSimpleLine,
  ShareNetwork,
  Sparkle,
} from "@phosphor-icons/react";
import {
  CURRENT_USER,
  FEED_POSTS,
  MY_COMPANY,
  companyById,
  daysUntil,
  formatRelativeTime,
} from "@/projects/community/linkon/lib/mock-data";
import type { FeedCategory, FeedPost } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  BrandMark,
  EmptyState,
  PrimaryButton,
  Reveal,
  Tabs,
  VerifiedBadge,
} from "@/projects/community/linkon/components/layout/ui";

const CATEGORIES: (FeedCategory | "전체")[] = [
  "전체",
  "협업 모집",
  "투자 이야기",
  "창업 후기",
  "정부지원사업",
  "행사 후기",
];

export function FeedScreen({
  onNavigate,
  drafts,
}: {
  onNavigate: NavigateFn;
  drafts: FeedPost[];
}) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [saves, setSaves] = useState<Record<string, boolean>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const allPosts = useMemo(() => [...drafts, ...FEED_POSTS], [drafts]);

  const posts = useMemo(() => {
    const filtered =
      category === "전체" ? allPosts : allPosts.filter((post) => post.category === category);
    return [...filtered].sort((a, b) =>
      sort === "popular" ? b.likes - a.likes : b.createdAt.localeCompare(a.createdAt),
    );
  }, [allPosts, category, sort]);

  const popular = [...allPosts].sort((a, b) => b.likes - a.likes).slice(0, 4);
  const recommended = allPosts
    .filter((post) => post.companyId !== MY_COMPANY.id)
    .map((post) => {
      const company = companyById(post.companyId);
      const overlap = (company?.keywords ?? []).filter((keyword) =>
        CURRENT_USER.interests.some((interest) => interest.includes(keyword) || keyword.includes(interest)),
      );
      const tagOverlap = post.tags.filter((tag) =>
        CURRENT_USER.interests.some((interest) => interest.includes(tag) || tag.includes(interest)),
      );
      const matched = [...overlap, ...tagOverlap];
      return { post, score: matched.length + post.saves / 1000, matched };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const counts = CATEGORIES.map((key) => ({
    key,
    label: key,
    count: key === "전체" ? allPosts.length : allPosts.filter((p) => p.category === key).length,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">네트워킹 피드</h1>
          <p className="mt-2 text-[14px] text-[var(--lk-muted)]">
            인증 기업이 직접 올린 협업 제안과 창업 경험을 확인하세요.
          </p>
        </div>
        <PrimaryButton onClick={() => onNavigate("feedWrite")}>
          <PencilSimpleLine size={16} weight="fill" />
          글쓰기
        </PrimaryButton>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_308px]">
        <div>
          <Tabs items={counts} active={category} onChange={setCategory} />

          <div className="mt-4 flex items-center gap-2">
            {(["recent", "popular"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  sort === key
                    ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                    : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
                }`}
              >
                {key === "recent" ? "최신순" : "인기순"}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={<Handshake size={22} />}
                title="아직 등록된 글이 없습니다"
                description="이 카테고리의 첫 글을 남겨보세요. 협업 모집 글은 관심 분야가 맞는 기업에게 먼저 노출됩니다."
                action={
                  <PrimaryButton size="sm" onClick={() => onNavigate("feedWrite")}>
                    글쓰기
                  </PrimaryButton>
                }
              />
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {posts.map((post, index) => {
                const company = companyById(post.companyId) ?? MY_COMPANY;
                const liked = likes[post.id];
                const saved = saves[post.id];
                const commentsOpen = openComments[post.id];
                return (
                  <Reveal key={post.id} delay={Math.min(index, 5) * 0.04}>
                    <li className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
                      <div className="flex items-start gap-3">
                        <button onClick={() => onNavigate("companyDetail", company.id)}>
                          <BrandMark logo={company.logo} size={44} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => onNavigate("companyDetail", company.id)}
                              className="text-[15px] font-bold text-[var(--lk-ink)] hover:text-[var(--lk-accent)]"
                            >
                              {company.name}
                            </button>
                            <VerifiedBadge />
                            <span className="lk-num text-[12.5px] text-[var(--lk-muted)]">
                              {post.author} {formatRelativeTime(post.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12.5px] text-[var(--lk-muted)]">
                            {company.industry} {company.region}
                          </p>
                        </div>
                        <Badge tone={post.category === "협업 모집" ? "accent" : "neutral"}>
                          {post.category}
                        </Badge>
                      </div>

                      <p className="mt-4 whitespace-pre-line text-[14.5px] leading-[1.8] text-[var(--lk-ink)]">
                        {post.content}
                      </p>

                      {post.recruiting && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-[var(--lk-accent-soft)] px-4 py-3.5">
                          <span className="flex items-center gap-2 text-[13.5px] font-bold text-[var(--lk-accent)]">
                            <Handshake size={16} weight="fill" />
                            {post.recruiting.role} {post.recruiting.positions}곳 모집
                          </span>
                          <span className="lk-num text-[12.5px] font-semibold text-[var(--lk-accent)]">
                            마감 D-{daysUntil(post.recruiting.deadline)}
                          </span>
                          <button
                            onClick={() => onNavigate("chat", company.id)}
                            className="ml-auto rounded-full bg-[var(--lk-accent)] px-4 py-1.5 text-[12.5px] font-semibold text-[var(--lk-accent-fg)]"
                          >
                            참여 문의
                          </button>
                        </div>
                      )}

                      {post.image && (
                        <img
                          src={post.image}
                          alt={`${company.name}가 올린 사진`}
                          className="mt-4 h-[280px] w-full rounded-xl object-cover"
                        />
                      )}

                      {post.attachment && (
                        <button className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[var(--lk-border)] bg-[var(--lk-bg)] px-4 py-3 text-left transition-colors hover:border-[var(--lk-accent)] sm:w-[380px]">
                          <FilePdf size={18} className="shrink-0 text-[var(--lk-accent)]" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                              {post.attachment.name}
                            </span>
                            <span className="lk-num block text-[12px] text-[var(--lk-muted)]">
                              {post.attachment.size}
                            </span>
                          </span>
                          <DownloadSimple size={16} className="shrink-0 text-[var(--lk-muted)]" />
                        </button>
                      )}

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[var(--lk-surface)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--lk-muted)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-1 border-t border-[var(--lk-border)] pt-3">
                        <ActionButton
                          active={liked}
                          onClick={() => setLikes((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                          icon={<Heart size={17} weight={liked ? "fill" : "regular"} />}
                          label={`${post.likes + (liked ? 1 : 0)}`}
                        />
                        <ActionButton
                          active={commentsOpen}
                          onClick={() =>
                            setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                          }
                          icon={<ChatCircle size={17} weight={commentsOpen ? "fill" : "regular"} />}
                          label={`${post.comments.length}`}
                        />
                        <ActionButton
                          active={saved}
                          onClick={() => setSaves((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                          icon={<BookmarkSimple size={17} weight={saved ? "fill" : "regular"} />}
                          label={`${post.saves + (saved ? 1 : 0)}`}
                        />
                        <button
                          onClick={() => setCopied(post.id)}
                          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-accent)]"
                        >
                          <ShareNetwork size={16} />
                          {copied === post.id ? "링크 복사됨" : "공유"}
                        </button>
                      </div>

                      {commentsOpen && (
                        <div className="mt-4 space-y-3 border-t border-[var(--lk-border)] pt-4">
                          {post.comments.length === 0 ? (
                            <p className="py-2 text-[13.5px] text-[var(--lk-muted)]">
                              아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
                            </p>
                          ) : (
                            post.comments.map((comment) => {
                              const author = companyById(comment.companyId);
                              return (
                                <div key={comment.id} className="flex items-start gap-3">
                                  {author && (
                                    <BrandMark logo={author.logo} size={32} />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="lk-num text-[13px] font-semibold text-[var(--lk-ink)]">
                                      {author?.name} {comment.author}
                                      <span className="ml-2 font-normal text-[var(--lk-muted)]">
                                        {formatRelativeTime(comment.createdAt)}
                                      </span>
                                    </p>
                                    <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--lk-ink)]">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <BrandMark logo={MY_COMPANY.logo} size={32} />
                            <input
                              placeholder="댓글을 입력하세요"
                              aria-label="댓글 입력"
                              className="flex-1 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3.5 py-2 text-[13.5px] text-[var(--lk-ink)] outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <p className="flex items-center gap-2 text-[14px] font-bold text-[var(--lk-ink)]">
              <Fire size={16} weight="fill" className="text-[var(--lk-accent)]" />
              이번 주 인기 게시글
            </p>
            <ol className="mt-4 space-y-3">
              {popular.map((post, index) => {
                const company = companyById(post.companyId) ?? MY_COMPANY;
                return (
                  <li key={post.id} className="flex gap-3">
                    <span className="lk-num w-4 shrink-0 text-[14px] font-bold text-[var(--lk-accent)]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-[var(--lk-ink)]">
                        {post.content.slice(0, 46)}
                      </p>
                      <p className="lk-num mt-1 text-[12px] text-[var(--lk-muted)]">
                        {company.name} 좋아요 {post.likes}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <p className="flex items-center gap-2 text-[14px] font-bold text-[var(--lk-ink)]">
              <Sparkle size={16} weight="fill" className="text-[var(--lk-accent)]" />
              관심 분야 추천
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
              {MY_COMPANY.name}의 관심 키워드와 겹치는 글입니다.
            </p>
            <ul className="mt-4 space-y-4">
              {recommended.map(({ post, matched }) => {
                const company = companyById(post.companyId) ?? MY_COMPANY;
                return (
                  <li key={`rec-${post.id}`}>
                    <button
                      onClick={() => onNavigate("companyDetail", company.id)}
                      className="w-full text-left"
                    >
                      <span className="flex items-center gap-2">
                        <BrandMark logo={company.logo} size={28} />
                        <span className="text-[13px] font-semibold text-[var(--lk-ink)]">
                          {company.name}
                        </span>
                        {matched[0] && (
                          <span className="ml-auto rounded-full bg-[var(--lk-accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lk-accent)]">
                            {matched[0]}
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block line-clamp-2 text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
                        {post.content}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`lk-num inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
        active ? "text-[var(--lk-accent)]" : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
