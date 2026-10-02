"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretLeft, Heart, ShareNetwork, Siren } from "@phosphor-icons/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import { ListingRow } from "@/projects/commerce/baseballmarket/components/listing-card";
import {
  BOARDS,
  ME,
  POSTS,
  listing,
  photo,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { Post } from "@/projects/commerce/baseballmarket/lib/types";

const COMMENTS = [
  { id: "cm1", author: "외야석주민", body: "14열이면 시야 진짜 좋죠. 저도 다음에 그 구역으로 가려고요.", at: "2시간 전", likes: 12 },
  { id: "cm2", author: "마킹장인", body: "햇빛 얘기 공감합니다. 3회까지는 모자 필수예요.", at: "1시간 전", likes: 8 },
  { id: "cm3", author: "직관메이트", body: "연결해두신 매물 봤습니다. 채팅 드릴게요.", at: "42분 전", likes: 3 },
  { id: "cm4", author: "9회말투아웃", body: "사진 잘 찍으셨네요. 어떤 렌즈 쓰셨나요", at: "18분 전", likes: 1 },
];

export function PostDetailScreen({
  post,
  onBack,
  onOpenListing,
}: {
  post: Post;
  onBack: () => void;
  onOpenListing: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [draft, setDraft] = useState("");
  const linked = post.linkedListingId ? listing(post.linkedListingId) : null;
  const more = POSTS.filter((p) => p.id !== post.id && p.board === post.board).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8 lg:py-12">
      <button
        type="button"
        onClick={onBack}
        className="bm-press mb-6 inline-flex items-center gap-1.5 rounded-[6px] py-1.5 pr-3 text-[14px] font-semibold text-[var(--bm-muted)]"
      >
        <CaretLeft size={15} weight="bold" />
        커뮤니티
      </button>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <article className="bm-rise lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            {post.team && <TeamMark id={post.team} size={22} accent={post.team === ME.team} />}
            <Badge tone="neutral">{BOARDS.find((b) => b.key === post.board)?.label}</Badge>
            <span className="text-[13px] leading-[19px] text-[var(--bm-muted)]">{post.createdAt}</span>
          </div>

          <h1 className="mt-4 text-[28px] font-semibold leading-[36px] tracking-[-0.02em] text-[var(--bm-ink)]">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center gap-3 border-b border-[var(--bm-hairline)] pb-5">
            <Avatar name={post.author} size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                {post.author}
              </p>
              <p className="bm-num truncate text-[12px] leading-[17px] text-[var(--bm-muted)]">
                조회 1,284 | 댓글 {post.comments}
              </p>
            </div>
            <button
              type="button"
              aria-label="공유"
              className="bm-press flex h-9 w-9 items-center justify-center rounded-full text-[var(--bm-muted)]"
            >
              <ShareNetwork size={16} />
            </button>
            <button
              type="button"
              aria-label="신고"
              className="bm-press flex h-9 w-9 items-center justify-center rounded-full text-[var(--bm-muted)]"
            >
              <Siren size={16} />
            </button>
          </div>

          {post.photoId && (
            <div className="relative mt-7 aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[var(--bm-surface-strong)]">
              <Image
                src={photo(post.photoId, 900, 563)}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="mt-7 space-y-5 text-[16px] leading-[25px] text-[var(--bm-body)]">
            <p>{post.body}</p>
            <p>
              사진은 3회말에 찍었습니다. 응원단상이 정면으로 보이는 자리라 소리가 잘 모입니다.
              혼자 가도 어색하지 않았고, 주변에 같은 구단 팬들이라 자연스럽게 같이 응원하게 됩니다.
            </p>
            <p>
              다만 통로 쪽이 아니면 이동이 불편합니다. 음식 사러 나가려면 옆자리에 양해를 구해야
              하니 참고하세요.
            </p>
          </div>

          {linked && (
            <div className="mt-8">
              <p className="mb-2.5 text-[12px] font-semibold uppercase leading-[17px] tracking-[0.12em] text-[var(--bm-muted)]">
                이 글에 연결된 매물
              </p>
              <div className="rounded-[12px] bg-[var(--bm-surface-card)] p-4">
                <ListingRow
                  listing={linked}
                  onOpen={() => onOpenListing(linked.id)}
                  trailing={
                    <Button size="sm" onClick={() => onOpenListing(linked.id)}>
                      보기
                    </Button>
                  }
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              className="bm-press inline-flex items-center gap-2 rounded-full border border-[var(--bm-hairline-strong)] px-5 py-2.5 text-[14px] font-semibold text-[var(--bm-ink)]"
            >
              <Heart size={16} weight={liked ? "fill" : "regular"} color={liked ? "var(--bm-error)" : undefined} />
              <span className="bm-num">{post.likes + (liked ? 1 : 0)}</span>
            </button>
          </div>

          {/* 댓글 */}
          <section className="mt-12">
            <h2 className="text-[18px] font-semibold leading-[25px] text-[var(--bm-ink)]">
              댓글 <span className="bm-num text-[var(--bm-muted)]">{COMMENTS.length}</span>
            </h2>

            <div className="mt-5 flex items-center gap-2.5">
              <Avatar name={ME.nickname} size={38} />
              <div className="flex-1">
                <Input value={draft} onChange={setDraft} placeholder="댓글을 남겨보세요" />
              </div>
              <Button>등록</Button>
            </div>

            <ul className="mt-7 space-y-6">
              {COMMENTS.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <Avatar name={c.author} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                        {c.author}
                      </span>
                      <span className="text-[12px] leading-[17px] text-[var(--bm-muted-soft)]">
                        {c.at}
                      </span>
                    </div>
                    <p className="mt-1 text-[14px] leading-[22px] text-[var(--bm-body)]">{c.body}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="bm-num inline-flex items-center gap-1 text-[12px] text-[var(--bm-muted)]">
                        <Heart size={12} />
                        {c.likes}
                      </span>
                      <button type="button" className="text-[12px] font-medium text-[var(--bm-muted)]">
                        답글
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="lg:col-span-4">
          <p className="mb-4 text-[12px] font-semibold uppercase leading-[17px] tracking-[0.12em] text-[var(--bm-muted)]">
            같은 게시판 글
          </p>
          <div className="space-y-2.5">
            {more.map((p) => (
              <Card key={p.id} tone="card" padded={false} className="p-4">
                <p className="line-clamp-2 text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                  {p.title}
                </p>
                <p className="bm-num mt-1.5 text-[12px] leading-[17px] text-[var(--bm-muted)]">
                  {p.author} | 좋아요 {p.likes}
                </p>
              </Card>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
