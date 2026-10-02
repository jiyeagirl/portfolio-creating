"use client";

import { useState } from "react";
import {
  BookmarkSimple,
  CalendarBlank,
  ChatCircle,
  Check,
  Heart,
  MapPin,
  NotePencil,
  PencilSimpleLine,
  Storefront,
  UsersThree,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  CURRENT_USER,
  MY_ACTIVITY,
  MY_BOOKMARK_IDS,
  MY_COMMENTS,
  NOTIFICATION_PREFS,
  POSTS,
  boardLabel,
} from "@/projects/community/locly/lib/mock-data";
import type { ActivityEntry } from "@/projects/community/locly/lib/types";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Avatar,
  Badge,
  CONTAINER,
  Display,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  formatRelativeTime,
} from "@/projects/community/locly/components/site/ui";

const TABS = [
  { key: "posts", label: "내 게시글" },
  { key: "comments", label: "내 댓글" },
  { key: "bookmarks", label: "북마크" },
  { key: "activity", label: "활동내역" },
  { key: "settings", label: "설정" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const ACTIVITY_ICON: Record<ActivityEntry["type"], Icon> = {
  post: NotePencil,
  comment: ChatCircle,
  event: CalendarBlank,
  meetup: UsersThree,
  store: Storefront,
  civic: MapPin,
};

const ALL_CATEGORIES = [
  "자유게시판",
  "우리동네 소식",
  "질문하기",
  "맛집추천",
  "생활꿀팁",
  "육아",
  "반려동물",
  "분실물",
  "벼룩시장",
  "모임후기",
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-[var(--lc-primary)]" : "bg-[var(--lc-surface-strong)]"
      }`}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-[var(--lc-canvas)] transition-[left] duration-200"
        style={{ left: on ? 22 : 2 }}
      />
    </button>
  );
}

export function MypageScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<TabKey>("posts");
  const [categories, setCategories] = useState<string[]>(CURRENT_USER.interestCategories);
  const [prefs, setPrefs] = useState(NOTIFICATION_PREFS);

  const myPosts = POSTS.filter((p) => p.author === CURRENT_USER.name).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
  const bookmarks = MY_BOOKMARK_IDS.map((id) => POSTS.find((p) => p.id === id)).filter(
    (p): p is (typeof POSTS)[number] => Boolean(p),
  );

  const counts: Record<TabKey, number | null> = {
    posts: myPosts.length,
    comments: MY_COMMENTS.length,
    bookmarks: bookmarks.length,
    activity: MY_ACTIVITY.length,
    settings: null,
  };

  return (
    <div className={`${CONTAINER} py-14 lg:py-20`}>
      <div className="mx-auto max-w-[960px]">
        {/* Profile band — cream card, asymmetric: identity left, stats right. */}
        <section className="rounded-[16px] bg-[var(--lc-surface-card)] p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="flex items-center gap-5">
              <Avatar name={CURRENT_USER.name} size={72} />
              <div>
                <Display as="h1" size="sm">
                  {CURRENT_USER.name}
                </Display>
                <p className="mt-1.5 text-[14px] text-[var(--lc-muted)]">{CURRENT_USER.handle}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--lc-muted-soft)]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} />
                    {CURRENT_USER.interestRegion}
                  </span>
                  <span>{CURRENT_USER.joinedAt} 가입</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {[
                { label: "게시글", value: CURRENT_USER.stats.posts },
                { label: "댓글", value: CURRENT_USER.stats.comments },
                { label: "북마크", value: CURRENT_USER.stats.bookmarks },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="locly-display text-[28px] leading-none text-[var(--lc-ink)]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[13px] text-[var(--lc-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton onClick={() => onNavigate("postWrite")}>
              <PencilSimpleLine size={15} weight="bold" />
              새 글 쓰기
            </PrimaryButton>
            <SecondaryButton onClick={() => setTab("settings")}>프로필 설정</SecondaryButton>
          </div>
        </section>

        <div className="locly-scrollbar-none mt-10 flex items-center gap-1 overflow-x-auto border-b border-[var(--lc-hairline)] pb-4">
          {TABS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`shrink-0 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                tab === item.key
                  ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                  : "text-[var(--lc-muted)]"
              }`}
            >
              {item.label}
              {counts[item.key] !== null && (
                <span className="ml-1.5 text-[var(--lc-muted-soft)]">{counts[item.key]}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
            {myPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="py-6 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{boardLabel(post.board)}</Badge>
                  <span className="text-[13px] text-[var(--lc-muted-soft)]">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
                <p className="mt-3 text-[18px] font-medium leading-[1.4] text-[var(--lc-ink)]">
                  {post.title}
                </p>
                <p className="mt-2 line-clamp-2 max-w-[70ch] text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 text-[13px] text-[var(--lc-muted-soft)]">
                  <span className="inline-flex items-center gap-1">
                    <Heart size={13} /> {post.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ChatCircle size={13} /> {post.comments}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookmarkSimple size={13} /> {post.bookmarks}
                  </span>
                  <span>조회 {post.views.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === "comments" && (
          <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
            {MY_COMMENTS.map((comment) => (
              <button
                key={comment.id}
                onClick={() => onNavigate("postDetail", comment.postId)}
                className="py-6 text-left"
              >
                <p className="text-[16px] leading-[1.6] text-[var(--lc-ink)]">{comment.content}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--lc-muted-soft)]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--lc-body)]">
                    <ChatCircle size={13} />
                    {comment.postTitle}
                  </span>
                  <span>{boardLabel(comment.board)}</span>
                  <span>{formatRelativeTime(comment.createdAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Heart size={13} /> {comment.likes}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === "bookmarks" && (
          <div className="grid gap-4 pt-8 sm:grid-cols-2">
            {bookmarks.map((post) => (
              <button
                key={post.id}
                onClick={() => onNavigate("postDetail", post.id)}
                className="flex h-full flex-col rounded-[12px] border border-[var(--lc-hairline)] p-6 text-left"
              >
                <div className="flex items-center gap-2">
                  <Badge>{boardLabel(post.board)}</Badge>
                  {post.isNotice && <Badge tone="coral">공지</Badge>}
                </div>
                <p className="mt-3 text-[16px] font-medium leading-[1.4] text-[var(--lc-ink)]">
                  {post.title}
                </p>
                <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-[13px] text-[var(--lc-muted-soft)]">
                  {post.author} · {formatRelativeTime(post.createdAt)}
                </p>
              </button>
            ))}
            {bookmarks.length === 0 && (
              <div className="sm:col-span-2">
                <EmptyState
                  icon={<BookmarkSimple size={30} />}
                  title="저장한 글이 없어요"
                  description="게시글 상세에서 북마크를 누르면 여기에 모아둘 수 있어요."
                />
              </div>
            )}
          </div>
        )}

        {tab === "activity" && (
          <div className="pt-8">
            {MY_ACTIVITY.map((entry, i) => {
              const ActivityIcon = ACTIVITY_ICON[entry.type];
              return (
                <div key={entry.id} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lc-surface-card)] text-[var(--lc-body)]">
                      <ActivityIcon size={16} />
                    </span>
                    {i < MY_ACTIVITY.length - 1 && (
                      <span className="w-px flex-1 bg-[var(--lc-hairline)]" style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-[15px] font-medium text-[var(--lc-ink)]">{entry.label}</p>
                    <p className="mt-1 text-[15px] leading-[1.55] text-[var(--lc-body)]">{entry.detail}</p>
                    <p className="mt-1.5 text-[13px] text-[var(--lc-muted-soft)]">{entry.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "settings" && (
          <div className="flex flex-col gap-14 pt-10">
            <section>
              <p className="text-[17px] font-medium text-[var(--lc-ink)]">관심 지역</p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                설정한 지역의 소식과 행사가 홈 화면에 먼저 노출됩니다.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-surface-card)] px-4 py-2.5 text-[15px] text-[var(--lc-ink)]">
                  <MapPin size={15} />
                  {CURRENT_USER.interestRegion}
                </span>
                <SecondaryButton>지역 변경</SecondaryButton>
              </div>
            </section>

            <section>
              <p className="text-[17px] font-medium text-[var(--lc-ink)]">관심 카테고리</p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                선택한 게시판의 새 글을 홈과 알림에서 우선 보여드려요.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((category) => {
                  const on = categories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() =>
                        setCategories((prev) =>
                          on ? prev.filter((c) => c !== category) : [...prev, category],
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                        on
                          ? "bg-[var(--lc-ink)] text-[var(--lc-on-dark)]"
                          : "border border-[var(--lc-hairline)] text-[var(--lc-body)]"
                      }`}
                    >
                      {on && <Check size={13} weight="bold" />}
                      {category}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <p className="text-[17px] font-medium text-[var(--lc-ink)]">알림 설정</p>
              <div className="mt-5 flex flex-col divide-y divide-[var(--lc-hairline-soft)] border-y border-[var(--lc-hairline)]">
                {prefs.map((pref) => (
                  <div key={pref.key} className="flex items-center gap-6 py-5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-[var(--lc-ink)]">{pref.label}</p>
                      <p className="mt-1 text-[14px] leading-[1.5] text-[var(--lc-muted)]">
                        {pref.description}
                      </p>
                    </div>
                    <Toggle
                      on={pref.enabled}
                      label={pref.label}
                      onChange={() =>
                        setPrefs((prev) =>
                          prev.map((p) => (p.key === pref.key ? { ...p, enabled: !p.enabled } : p)),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
