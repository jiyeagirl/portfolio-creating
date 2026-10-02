"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChatCircle, Fire, Heart, PencilSimple } from "@phosphor-icons/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Eyebrow,
  SectionTitle,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import {
  BOARDS,
  ME,
  POSTS,
  TEAMS,
  photo,
  team,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { BoardKey, TeamId } from "@/projects/commerce/baseballmarket/lib/types";

/* 커뮤니티. spec Key Focus 4번대로 게시글에 판매 매물이 연결되고,
   그 연결이 거래 유입으로 이어지는 구조를 카드 안에서 보여준다. */

export function CommunityScreen({
  onOpenPost,
  onOpenListing,
}: {
  onOpenPost: (id: string) => void;
  onOpenListing: (id: string) => void;
}) {
  const [board, setBoard] = useState<BoardKey>("live");
  const [teamFilter, setTeamFilter] = useState<TeamId | "전체">(ME.team);

  const posts = useMemo(() => {
    let out = POSTS.filter((p) => p.board === board);
    if (board === "team" && teamFilter !== "전체") out = out.filter((p) => p.team === teamFilter);
    return out.length > 0 ? out : POSTS.slice(0, 3);
  }, [board, teamFilter]);

  const hot = POSTS.filter((p) => p.hot);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-8 lg:py-14">
      {/* 내 구단 헤더 — 여기가 색을 갖는 두 번째이자 마지막 자리다 */}
      <section className="bm-rise rounded-[16px] bg-[var(--bm-team)] p-6 text-[var(--bm-team-on)] lg:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-[22px] font-semibold"
          >
            {team(ME.team).mark}
          </span>
          <div className="min-w-0 flex-1">
            <Eyebrow>
              <span className="text-white/60">구단 커뮤니티</span>
            </Eyebrow>
            <h1 className="mt-1.5 text-[28px] font-medium leading-[34px] tracking-[-0.02em]">
              {teamLabel(ME.team)} 게시판
            </h1>
            <p className="bm-num mt-1.5 text-[14px] leading-[22px] opacity-80">
              오늘 글 148개 | 접속 중 2,410명
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[8px] bg-white/15 px-5 text-[14px] font-semibold"
          >
            <PencilSimple size={15} />
            글쓰기
          </button>
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="bm-noscroll flex gap-2 overflow-x-auto pb-1">
            {BOARDS.map((b) => (
              <Chip
                key={b.key}
                label={b.label}
                active={board === b.key}
                onClick={() => setBoard(b.key)}
              />
            ))}
          </div>

          {board === "team" && (
            <div className="bm-noscroll mt-3 flex gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setTeamFilter("전체")}
                className={`bm-swap shrink-0 rounded-[6px] px-3 py-1.5 text-[13px] font-medium ${
                  teamFilter === "전체"
                    ? "bg-[var(--bm-surface-strong)] text-[var(--bm-ink)]"
                    : "text-[var(--bm-muted)]"
                }`}
              >
                전체
              </button>
              {TEAMS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTeamFilter(t.id)}
                  className={`bm-swap shrink-0 rounded-[6px] px-3 py-1.5 text-[13px] font-medium ${
                    teamFilter === t.id
                      ? "bg-[var(--bm-surface-strong)] text-[var(--bm-ink)]"
                      : "text-[var(--bm-muted)]"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

          <div className="bm-stagger mt-6 space-y-2.5">
            {posts.map((p) => (
              <article key={p.id} className="rounded-[12px] bg-[var(--bm-surface-card)] p-5">
                <button type="button" onClick={() => onOpenPost(p.id)} className="block w-full text-left">
                  <div className="flex items-center gap-2">
                    {p.team && <TeamMark id={p.team} size={20} accent={p.team === ME.team} />}
                    <span className="text-[12px] font-medium leading-[17px] text-[var(--bm-muted)]">
                      {BOARDS.find((b) => b.key === p.board)?.label}
                    </span>
                    {p.hot && (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--bm-error-deep)]">
                        <Fire size={12} weight="fill" />
                        인기
                      </span>
                    )}
                    <span className="ml-auto text-[12px] leading-[17px] text-[var(--bm-muted-soft)]">
                      {p.createdAt}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[17px] font-semibold leading-[24px] text-[var(--bm-ink)]">
                        {p.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-[14px] leading-[22px] text-[var(--bm-body)]">
                        {p.body}
                      </p>
                    </div>
                    {p.photoId && (
                      <span className="relative h-[84px] w-[112px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--bm-surface-strong)]">
                        <Image
                          src={photo(p.photoId, 280, 210)}
                          alt={p.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                    )}
                  </div>
                </button>

                {p.linkedListingId && (
                  <button
                    type="button"
                    onClick={() => onOpenListing(p.linkedListingId as string)}
                    className="bm-press mt-3.5 flex w-full items-center gap-2 rounded-[8px] bg-[var(--bm-canvas)] px-3.5 py-2.5 text-left"
                  >
                    <Badge tone="neutral">내 판매 매물</Badge>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--bm-body-strong)]">
                      이 글에 연결된 매물 보기
                    </span>
                  </button>
                )}

                <div className="mt-3.5 flex items-center gap-3.5 border-t border-[var(--bm-hairline)] pt-3.5">
                  <Avatar name={p.author} size={26} />
                  <span className="truncate text-[13px] font-medium text-[var(--bm-body-strong)]">
                    {p.author}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-[13px] text-[var(--bm-muted)]">
                    <Heart size={13} />
                    <span className="bm-num">{p.likes}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[13px] text-[var(--bm-muted)]">
                    <ChatCircle size={13} />
                    <span className="bm-num">{p.comments}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <SectionTitle title="인기글" />
          <div className="space-y-2.5">
            {hot.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenPost(p.id)}
                className="bm-press flex w-full items-start gap-3 rounded-[12px] bg-[var(--bm-surface-card)] p-4 text-left"
              >
                <span className="bm-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bm-ink)] text-[12px] font-semibold text-[var(--bm-on-ink)]">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                    {p.title}
                  </span>
                  <span className="bm-num mt-1 block text-[12px] leading-[17px] text-[var(--bm-muted)]">
                    좋아요 {p.likes} | 댓글 {p.comments}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10">
            <SectionTitle title="커뮤니티 규칙" />
            <Card tone="soft">
              <ul className="space-y-2.5 text-[13px] leading-[20px] text-[var(--bm-body)]">
                <li>상대 구단 팬을 향한 비방과 조롱은 경고 없이 삭제됩니다.</li>
                <li>매물 홍보는 글에 연결된 판매 매물 한 건까지만 허용합니다.</li>
                <li>티켓 정가 초과 판매를 유도하는 글은 신고 대상입니다.</li>
              </ul>
              <div className="mt-4">
                <Button variant="secondary" size="sm" full>
                  신고하기
                </Button>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
