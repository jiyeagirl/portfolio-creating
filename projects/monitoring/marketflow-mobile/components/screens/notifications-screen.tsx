"use client";

import { useMemo, useState } from "react";
import { BellSlash, CaretRight } from "@phosphor-icons/react";
import { Card, EmptyState, NotificationTypeDot, ScreenHeader } from "@/projects/monitoring/marketflow-mobile/components/ui";
import { daysAgo, formatRelative } from "@/projects/monitoring/marketflow-mobile/lib/format";
import type { MarketflowMobileNavigate } from "@/projects/monitoring/marketflow-mobile/lib/navigation";
import type { AppNotification } from "@/projects/monitoring/marketflow-mobile/lib/types";

type FilterKey = "all" | "unread";

function groupLabel(iso: string): string {
  const diff = daysAgo(iso);
  if (diff <= 0) return "오늘";
  if (diff < 7) return "이번 주";
  return "이전";
}

export function NotificationsScreen({
  notifications,
  onRead,
  onNavigate,
}: {
  notifications: AppNotification[];
  onRead: (id: string) => void;
  onNavigate: MarketflowMobileNavigate;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(
    () => notifications.filter((n) => (filter === "unread" ? !n.read : true)),
    [notifications, filter],
  );

  const groups = useMemo(() => {
    const order = ["오늘", "이번 주", "이전"];
    const map = new Map<string, AppNotification[]>();
    for (const notif of filtered) {
      const key = groupLabel(notif.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(notif);
    }
    return order.filter((key) => map.has(key)).map((key) => ({ key, items: map.get(key)! }));
  }, [filtered]);

  function handleTap(notif: AppNotification) {
    if (!notif.read) onRead(notif.id);
    if (notif.contentId) onNavigate("contentReview", notif.contentId);
  }

  return (
    <div>
      <ScreenHeader title="알림 센터" subtitle={`읽지 않음 ${unreadCount}건`} />

      <div className="flex gap-2 px-4 pt-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`flex-1 rounded-[8px] py-2.5 text-[13px] font-semibold transition-colors ${
            filter === "all"
              ? "bg-[var(--mfm-ink)] text-[var(--mfm-on-dark)]"
              : "bg-[var(--mfm-surface-card)] text-[var(--mfm-body)]"
          }`}
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`flex-1 rounded-[8px] py-2.5 text-[13px] font-semibold transition-colors ${
            filter === "unread"
              ? "bg-[var(--mfm-ink)] text-[var(--mfm-on-dark)]"
              : "bg-[var(--mfm-surface-card)] text-[var(--mfm-body)]"
          }`}
        >
          읽지 않음
        </button>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-28 pt-5">
        {groups.length === 0 && (
          <EmptyState
            icon={<BellSlash size={22} />}
            title="알림이 없어요"
            body="읽지 않은 알림이 모두 확인되었습니다."
          />
        )}
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2.5">
            <p className="text-[11.5px] font-semibold text-[var(--mfm-muted-soft)]">{group.key}</p>
            <div className="flex flex-col gap-2">
              {group.items.map((notif) => (
                <Card
                  key={notif.id}
                  as="button"
                  onClick={() => handleTap(notif)}
                  className={`flex items-start gap-2.5 px-3.5 py-3.5 ${
                    notif.read ? "" : "!border-[var(--mfm-primary-disabled)] bg-[var(--mfm-surface-soft)]"
                  }`}
                >
                  <span className="mt-1.5">
                    <NotificationTypeDot type={notif.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13.5px] leading-[1.4] ${
                        notif.read ? "font-medium text-[var(--mfm-body)]" : "font-semibold text-[var(--mfm-ink)]"
                      }`}
                    >
                      {notif.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-[var(--mfm-muted)]">{notif.body}</p>
                    <p className="mfm-tabular mt-1.5 text-[11px] text-[var(--mfm-muted-soft)]">
                      {formatRelative(notif.createdAt)}
                    </p>
                  </div>
                  {notif.contentId && (
                    <span className="mt-1.5 shrink-0 text-[var(--mfm-muted-soft)]">
                      <CaretRight size={14} />
                    </span>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
