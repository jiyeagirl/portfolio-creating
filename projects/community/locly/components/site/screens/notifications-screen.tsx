"use client";

import { useMemo, useState } from "react";
import {
  BellSimple,
  CalendarBlank,
  ChatCircle,
  Gear,
  Heart,
  Megaphone,
  UsersThree,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { NOTIFICATIONS } from "@/projects/community/locly/lib/mock-data";
import type { Notification } from "@/projects/community/locly/lib/types";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  CONTAINER,
  Display,
  EmptyState,
  TextLink,
  formatRelativeTime,
} from "@/projects/community/locly/components/site/ui";

const TYPE_META: Record<Notification["type"], { label: string; icon: Icon; tint: string }> = {
  comment: { label: "댓글", icon: ChatCircle, tint: "var(--lc-primary)" },
  like: { label: "좋아요", icon: Heart, tint: "var(--lc-error)" },
  event: { label: "행사", icon: CalendarBlank, tint: "var(--lc-teal)" },
  meetup: { label: "모임", icon: UsersThree, tint: "var(--lc-amber)" },
  notice: { label: "공지", icon: Megaphone, tint: "var(--lc-body)" },
};

const FILTERS: { key: "all" | Notification["type"]; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "comment", label: "댓글" },
  { key: "like", label: "좋아요" },
  { key: "event", label: "행사" },
  { key: "meetup", label: "모임" },
  { key: "notice", label: "공지" },
];

/** Groups notifications into the day buckets a real feed uses. */
function bucketOf(iso: string) {
  const now = new Date("2026-07-27T12:00:00");
  const date = new Date(iso);
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (days < 1) return "오늘";
  if (days < 2) return "어제";
  if (days < 7) return "이번 주";
  return "지난 알림";
}

export function NotificationsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all");

  const unread = items.filter((n) => !n.read).length;
  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((n) => n.type === filter)),
    [items, filter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Notification[]>();
    for (const item of filtered) {
      const key = bucketOf(item.createdAt);
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <div className="mx-auto max-w-[760px]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--lc-hairline)] pb-8">
          <div>
            <Display as="h1" size="lg">
              알림
            </Display>
            <p className="mt-3 text-[16px] leading-[1.55] text-[var(--lc-body)]">
              {unread > 0
                ? `읽지 않은 알림이 ${unread}개 있어요.`
                : "새로 도착한 알림을 모두 확인했어요."}
            </p>
          </div>
          <div className="flex items-center gap-5 pb-1">
            <TextLink onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}>
              모두 읽음 처리
            </TextLink>
            <button
              onClick={() => onNavigate("mypage")}
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--lc-muted)]"
            >
              <Gear size={15} />
              알림 설정
            </button>
          </div>
        </div>

        <div className="locly-scrollbar-none mt-6 flex items-center gap-1 overflow-x-auto">
          {FILTERS.map((item) => {
            const count =
              item.key === "all" ? items.length : items.filter((n) => n.type === item.key).length;
            return (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`shrink-0 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                  filter === item.key
                    ? "bg-[var(--lc-surface-card)] text-[var(--lc-ink)]"
                    : "text-[var(--lc-muted)]"
                }`}
              >
                {item.label}
                <span className="ml-1.5 text-[var(--lc-muted-soft)]">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<BellSimple size={30} />}
              title="해당하는 알림이 없어요"
              description="다른 유형을 선택하거나, 관심 게시판과 모임을 구독하면 새 소식이 여기에 쌓여요."
            />
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-10">
            {groups.map(([bucket, list]) => (
              <section key={bucket}>
                <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--lc-muted-soft)]">
                  {bucket}
                </p>
                <div className="mt-4 flex flex-col divide-y divide-[var(--lc-hairline-soft)] border-t border-[var(--lc-hairline)]">
                  {list.map((item) => {
                    const meta = TYPE_META[item.type];
                    const TypeIcon = meta.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          setItems((prev) =>
                            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
                          )
                        }
                        className={`flex items-start gap-4 px-4 py-5 text-left transition-colors ${
                          item.read ? "" : "bg-[var(--lc-surface-soft)]"
                        }`}
                      >
                        <span
                          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lc-surface-card)]"
                          style={{ color: meta.tint }}
                        >
                          <TypeIcon size={17} weight="fill" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[15px] leading-[1.5] ${
                              item.read ? "text-[var(--lc-body)]" : "font-medium text-[var(--lc-ink)]"
                            }`}
                          >
                            {item.message}
                          </p>
                          <p className="mt-1.5 truncate text-[14px] text-[var(--lc-muted)]">
                            {item.target}
                          </p>
                          <p className="mt-2 text-[13px] text-[var(--lc-muted-soft)]">
                            {meta.label} · {formatRelativeTime(item.createdAt)}
                          </p>
                        </div>
                        {!item.read && (
                          <span
                            aria-label="읽지 않음"
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--lc-primary)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
