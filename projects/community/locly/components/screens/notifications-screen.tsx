"use client";

import { useState } from "react";
import { Bell, CalendarBlank, ChatCircle, Heart, Megaphone, UsersThree } from "@phosphor-icons/react";
import { NOTIFICATIONS } from "@/projects/community/locly/lib/mock-data";
import type { Notification } from "@/projects/community/locly/lib/types";
import { EmptyState, formatRelativeTime } from "@/projects/community/locly/components/layout/ui";

const TYPE_ICON: Record<Notification["type"], typeof Bell> = {
  comment: ChatCircle,
  like: Heart,
  event: CalendarBlank,
  meetup: UsersThree,
  notice: Megaphone,
};

function isToday(iso: string) {
  return iso.startsWith("2026-07-27");
}

export function NotificationsScreen() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const today = items.filter((n) => isToday(n.createdAt));
  const earlier = items.filter((n) => !isToday(n.createdAt));

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 pb-24 pt-8 lg:px-0">
      <h1 className="text-[24px] font-bold tracking-tight text-[var(--locly-ink)]">알림</h1>
      <div className="mt-6 flex flex-col gap-6">
        <NotificationGroup label="오늘" list={today} onRead={markRead} />
        <NotificationGroup label="이전" list={earlier} onRead={markRead} />
        {items.length === 0 && (
          <EmptyState icon={<Bell size={20} />} title="알림이 없어요" description="새로운 활동이 생기면 이곳에서 알려드릴게요." />
        )}
      </div>
    </div>
  );
}

function NotificationGroup({
  label,
  list,
  onRead,
}: {
  label: string;
  list: Notification[];
  onRead: (id: string) => void;
}) {
  if (list.length === 0) return null;
  return (
    <div>
      <p className="text-[13px] font-semibold text-[var(--locly-muted)]">{label}</p>
      <div className="mt-2 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
        {list.map((n) => {
          const Icon = TYPE_ICON[n.type];
          return (
            <button
              key={n.id}
              onClick={() => onRead(n.id)}
              className="flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--locly-surface)]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--locly-accent-soft)] text-[var(--locly-accent)]">
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] leading-relaxed text-[var(--locly-ink)]">{n.message}</p>
                <p className="mt-0.5 line-clamp-1 text-[12.5px] text-[var(--locly-muted)]">{n.target}</p>
                <p className="mt-1 text-[11.5px] text-[var(--locly-muted)]">{formatRelativeTime(n.createdAt)}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--locly-accent)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
