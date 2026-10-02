"use client";

import { useState } from "react";
import { Bell, PawPrint, SpeakerHigh, VideoCamera } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { NOTIFICATIONS } from "@/projects/monitoring/petlive/lib/mock-data";
import { dateTime, type Navigate, type Tone } from "@/projects/monitoring/petlive/lib/navigation";
import type { NotificationItem } from "@/projects/monitoring/petlive/lib/types";

const KIND_ICON: Record<
  NotificationItem["kind"],
  React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>
> = {
  motion: PawPrint,
  sound: SpeakerHigh,
  device: VideoCamera,
  system: Bell,
} as Record<NotificationItem["kind"], React.ComponentType<{ size?: number; weight?: "bold" | "fill" }>>;

const KIND_TONE: Record<NotificationItem["kind"], Tone> = {
  motion: "info",
  sound: "warning",
  device: "neutral",
  system: "neutral",
};

const AVATAR_CLASS: Record<Tone, string> = {
  neutral: "bg-[var(--pl-canvas-strong)] text-[var(--pl-body)]",
  positive: "bg-[var(--pl-positive-soft)] text-[var(--pl-positive-deep)]",
  warning: "bg-[var(--pl-warning-soft)] text-[var(--pl-warning-deep)]",
  negative: "bg-[var(--pl-negative-soft)] text-[var(--pl-negative-deep)]",
  info: "bg-[var(--pl-info-soft)] text-[var(--pl-info-deep)]",
};

export function NotificationsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [items, setItems] = useState<NotificationItem[]>(() => NOTIFICATIONS.map((n) => ({ ...n })));
  const hasUnread = items.some((n) => n.unread);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => (n.unread ? { ...n, unread: false } : n)));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const handleRowClick = (item: NotificationItem) => {
    markRead(item.id);
    if (item.kind === "motion" || item.kind === "sound") {
      onNavigate("eventHistory");
    } else if (item.kind === "device") {
      onNavigate("deviceManage");
    }
  };

  return (
    <div className="pl-enter flex h-full flex-col">
      <ScreenHeader
        title="알림"
        onBack={() => onNavigate("home")}
        className="bg-[var(--pl-canvas)] border-[var(--pl-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--pl-ink)]"
        right={
          <button
            type="button"
            onClick={markAllRead}
            disabled={!hasUnread}
            className="text-[13px] font-medium text-[var(--pl-accent)] disabled:text-[var(--pl-mute-soft)]"
          >
            모두 읽음
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="rounded-[24px] border border-[var(--pl-hairline)] bg-[var(--pl-canvas)]">
          {items.map((item, index) => {
            const Icon = KIND_ICON[item.kind];
            const isLast = index === items.length - 1;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRowClick(item)}
                className={`flex w-full items-start gap-3 px-4 py-4 text-left transition-colors active:bg-[var(--pl-canvas-soft)] ${
                  isLast ? "" : "border-b border-[var(--pl-hairline)]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${AVATAR_CLASS[KIND_TONE[item.kind]]}`}
                >
                  <Icon size={18} weight="bold" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`truncate text-[14.5px] leading-[19px] ${
                        item.unread ? "font-bold text-[var(--pl-ink)]" : "font-medium text-[var(--pl-body)]"
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.unread && (
                      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--pl-negative)]" />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[13px] leading-[18px] text-[var(--pl-mute)]">
                    {item.detail}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[var(--pl-mute-soft)]">{dateTime(item.at)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
