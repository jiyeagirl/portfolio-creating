"use client";

import { useState } from "react";
import {
  BookmarkSimple,
  ChatCircle,
  Gear,
  MapPin,
  PencilSimpleLine,
  X,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { CURRENT_USER, POSTS, boardLabel } from "@/projects/community/locly/lib/mock-data";
import { Avatar, Badge, EmptyState } from "@/projects/community/locly/components/layout/ui";

const TABS = [
  { key: "posts", label: "내 게시글" },
  { key: "comments", label: "내 댓글" },
  { key: "bookmarks", label: "북마크" },
  { key: "activity", label: "활동내역" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--locly-accent)]" : "bg-[var(--locly-border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function MypageScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<TabKey>("posts");
  const [categories, setCategories] = useState(CURRENT_USER.interestCategories);
  const [notifSettings, setNotifSettings] = useState({
    comment: true,
    like: true,
    event: true,
    meetup: false,
    notice: true,
  });

  const myPosts = POSTS.filter((p) => p.author === CURRENT_USER.name);
  const myComments = [
    { postId: "p2", content: "위치가 정확히 어디쯤인가요? 동진시장이 넓어서요." },
  ];
  const bookmarked = POSTS.filter((p) => ["p1", "p5", "p9"].includes(p.id));
  const activity = [
    { label: "게시글 작성", detail: myPosts[0]?.title ?? "", date: "2026-07-26" },
    { label: "댓글 작성", detail: "동진시장 안쪽 냉면집, 여름 한정 콩국수 시작했어요", date: "2026-07-26" },
    { label: "행사 참가 신청", detail: "OO 새벽 러닝크루", date: "2026-07-24" },
    { label: "게시글 좋아요", detail: "여름철 에어컨 실외기 소음 민원, 이렇게 해결했어요", date: "2026-07-20" },
  ];

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-24 pt-8 lg:px-0">
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-6 sm:flex-row sm:items-center">
        <Avatar name={CURRENT_USER.name} size={64} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[18px] font-bold text-[var(--locly-ink)]">{CURRENT_USER.name}</p>
            <span className="text-[13px] text-[var(--locly-muted)]">{CURRENT_USER.handle}</span>
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-[12.5px] text-[var(--locly-muted)]">
            <MapPin size={13} />
            {CURRENT_USER.interestRegion} · {CURRENT_USER.joinedAt} 가입
          </p>
          <div className="mt-3 flex gap-5 text-[13px] text-[var(--locly-ink)]">
            <span>
              게시글 <b>{CURRENT_USER.stats.posts}</b>
            </span>
            <span>
              댓글 <b>{CURRENT_USER.stats.comments}</b>
            </span>
            <span>
              북마크 <b>{CURRENT_USER.stats.bookmarks}</b>
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate("postWrite")}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--locly-border)] px-4 py-2 text-[13px] font-semibold text-[var(--locly-ink)] hover:border-[var(--locly-accent)] hover:text-[var(--locly-accent)]"
        >
          <PencilSimpleLine size={15} />
          글쓰기
        </button>
      </div>

      <div className="locly-scrollbar-none mt-6 flex items-center gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              tab === t.key ? "bg-[var(--locly-accent)] text-[var(--locly-accent-foreground)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "posts" && (
          <div className="flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
            {myPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--locly-surface)]"
              >
                <Badge tone="neutral">{boardLabel(post.board)}</Badge>
                <span className="line-clamp-1 text-[14px] font-medium text-[var(--locly-ink)]">{post.title}</span>
              </button>
            ))}
            {myPosts.length === 0 && (
              <div className="p-6">
                <EmptyState icon={<PencilSimpleLine size={20} />} title="작성한 게시글이 없어요" description="첫 게시글을 작성해 이웃과 소식을 나눠보세요." />
              </div>
            )}
          </div>
        )}

        {tab === "comments" && (
          <div className="flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
            {myComments.map((c, i) => (
              <button
                key={i}
                onClick={() => onNavigate("postDetail", c.postId)}
                className="flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--locly-surface)]"
              >
                <ChatCircle size={16} className="shrink-0 text-[var(--locly-accent)]" />
                <span className="line-clamp-1 text-[13.5px] text-[var(--locly-ink)]">{c.content}</span>
              </button>
            ))}
          </div>
        )}

        {tab === "bookmarks" && (
          <div className="flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
            {bookmarked.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--locly-surface)]"
              >
                <BookmarkSimple size={16} weight="fill" className="shrink-0 text-[var(--locly-accent)]" />
                <span className="line-clamp-1 text-[14px] font-medium text-[var(--locly-ink)]">{post.title}</span>
              </button>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <span className="w-24 shrink-0 text-[12px] font-semibold text-[var(--locly-accent)]">{a.label}</span>
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-[var(--locly-ink)]">{a.detail}</span>
                <span className="shrink-0 text-[12px] text-[var(--locly-muted)]">{a.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-[var(--locly-border)] pt-8">
        <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-[var(--locly-ink)]">
          <Gear size={17} />
          설정
        </h2>

        <div className="mt-4">
          <p className="text-[13px] font-semibold text-[var(--locly-ink)]">관심 지역</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--locly-accent-soft)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--locly-accent)]">
              <MapPin size={12} weight="fill" />
              {CURRENT_USER.interestRegion}
            </span>
            <button className="rounded-full border border-dashed border-[var(--locly-border)] px-3 py-1.5 text-[12.5px] text-[var(--locly-muted)] hover:text-[var(--locly-ink)]">
              + 관심 지역 추가
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[13px] font-semibold text-[var(--locly-ink)]">관심 카테고리</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--locly-surface)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--locly-ink)]"
              >
                {c}
                <button onClick={() => setCategories(categories.filter((x) => x !== c))} className="text-[var(--locly-muted)] hover:text-[var(--locly-danger)]">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)]">
          {(
            [
              ["comment", "댓글 알림"],
              ["like", "좋아요 알림"],
              ["event", "행사 시작 알림"],
              ["meetup", "모임 신청 알림"],
              ["notice", "공지사항 알림"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[13.5px] text-[var(--locly-ink)]">{label}</span>
              <Switch
                checked={notifSettings[key]}
                onChange={() => setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
