"use client";

import { useState } from "react";
import { Bell, Megaphone, Warning, Wrench } from "@phosphor-icons/react";
import { EmptyState } from "@/projects/monitoring/safesense/components/app/ui";
import { notifications as initialNotifications } from "@/projects/monitoring/safesense/lib/mock-data";

const FILTERS = ["전체", "위험", "공지", "시스템"] as const;

const TYPE_META = {
  danger: { icon: Warning, label: "위험" },
  notice: { icon: Megaphone, label: "공지" },
  system: { icon: Wrench, label: "시스템" },
} as const;

export function NotificationsScreen() {
  const [items, setItems] = useState(initialNotifications);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("전체");

  const filtered = items.filter((n) => {
    if (filter === "전체") return true;
    if (filter === "위험") return n.type === "danger";
    if (filter === "공지") return n.type === "notice";
    return n.type === "system";
  });

  return (
    <div className="min-h-full w-full px-5 pb-32 pt-[78px]">
      <div className="flex items-baseline justify-between">
        <h1 className="ss-display text-[22px] text-[var(--ss-foreground)]">알림</h1>
        <button
          type="button"
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="ss-mono text-[10.5px] font-semibold text-[var(--ss-accent)]"
        >
          모두 읽음
        </button>
      </div>
      <p className="ss-mono mt-1 text-[10px] text-[var(--ss-muted)]">
        읽지 않은 알림 {items.filter((n) => !n.read).length}건
      </p>

      <div className="ss-mono mt-4 flex gap-[1px] overflow-hidden rounded-[8px] bg-[var(--ss-border)]">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`ss-press flex-1 border-0 bg-[var(--ss-panel)] py-2 text-[10.5px] ${
              filter === f ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell size={28} />}
          title="알림이 없습니다"
          description="선택한 유형의 알림이 아직 없습니다."
          className="mt-6"
        />
      ) : (
        <div className="mt-4 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
          {filtered.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() =>
                  setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                }
                className="ss-press flex w-full items-start gap-3 px-4 py-3.5 text-left"
              >
                <meta.icon
                  size={17}
                  weight="fill"
                  className={`mt-0.5 shrink-0 ${n.type === "danger" ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold leading-[1.4] text-[var(--ss-foreground)]">
                    {n.title}
                  </p>
                  <p className="ss-mono mt-1 text-[10px] leading-[1.6] text-[var(--ss-muted)]">
                    {n.body}
                  </p>
                  <p className="ss-mono mt-1.5 text-[9.5px] text-[var(--ss-muted)]">{n.at}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--ss-accent)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
