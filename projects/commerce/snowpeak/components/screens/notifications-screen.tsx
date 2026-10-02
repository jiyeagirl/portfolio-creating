"use client";

import { BellSlash } from "@phosphor-icons/react";
import { AppBar, Badge, EmptyState } from "@/projects/commerce/snowpeak/components/ui";
import type { AppNotification, NotificationType } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn, Tone } from "@/projects/commerce/snowpeak/lib/navigation";

const TYPE_TONE: Record<NotificationType, Tone> = {
  예약: "info",
  결제: "success",
  프로모션: "warn",
  공지: "neutral",
};

export function NotificationsScreen({
  notifications,
  onNavigate,
  onMarkRead,
}: {
  notifications: AppNotification[];
  onNavigate: NavigateFn;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="알림" onBack={() => onNavigate("mypage")} />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<BellSlash size={22} weight="bold" />}
            title="받은 알림이 없어요"
            body="새로운 예약, 결제, 프로모션 알림이 이곳에 표시됩니다."
          />
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.read && onMarkRead(n.id)}
                className={`flex w-full items-start gap-3 rounded-[16px] p-4 text-left transition-transform active:scale-[0.98] ${
                  n.read ? "bg-[var(--sp-surface-soft)]" : "bg-[var(--sp-surface)]"
                }`}
                style={
                  n.read
                    ? undefined
                    : { boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }
                }
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    n.read ? "bg-transparent" : "bg-[var(--sp-accent)]"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={TYPE_TONE[n.type]}>{n.type}</Badge>
                    <span className="sp-num shrink-0 text-[11px] text-[var(--sp-mute)]">{n.createdAt}</span>
                  </div>
                  <p
                    className={`mt-2 text-[14px] ${
                      n.read ? "font-medium text-[var(--sp-body)]" : "font-semibold text-[var(--sp-ink)]"
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sp-mute)]">{n.body}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
