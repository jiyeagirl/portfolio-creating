"use client";

import { Bell, CaretRight, SquaresFour } from "@phosphor-icons/react";
import { Card, NotificationTypeBadge, ScreenHeader, SectionTitle, StatTile } from "@/projects/monitoring/marketflow-mobile/components/ui";
import { formatDateShort } from "@/projects/monitoring/marketflow-mobile/lib/format";
import { adminProfile, contentItems } from "@/projects/monitoring/marketflow-mobile/lib/mock-data";
import type { MarketflowMobileNavigate } from "@/projects/monitoring/marketflow-mobile/lib/navigation";
import { CHANNEL_LABEL, type ApprovalStatus, type AppNotification, type ChannelId } from "@/projects/monitoring/marketflow-mobile/lib/types";

export function HomeScreen({
  pendingCount,
  notifications,
  getStatus,
  onNavigate,
}: {
  pendingCount: number;
  notifications: AppNotification[];
  getStatus: (id: string) => ApprovalStatus;
  onNavigate: MarketflowMobileNavigate;
}) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const channelOverview = new Map<ChannelId, { count: number; nearest: string }>();
  for (const item of contentItems) {
    if (getStatus(item.id) === "rejected") continue;
    for (const channel of item.channelIds) {
      const existing = channelOverview.get(channel);
      if (!existing) {
        channelOverview.set(channel, { count: 1, nearest: item.scheduledAt });
      } else {
        existing.count += 1;
        if (item.scheduledAt < existing.nearest) existing.nearest = item.scheduledAt;
      }
    }
  }
  const channelRows = Array.from(channelOverview.entries())
    .map(([channel, data]) => ({ channel, ...data }))
    .sort((a, b) => b.count - a.count);

  const recentNotifications = notifications
    .filter((n) => n.type === "publish-complete" || n.type === "publish-error")
    .slice(0, 3);

  return (
    <div>
      <ScreenHeader
        title="MarketFlow"
        subtitle={`${adminProfile.name} | ${adminProfile.role}`}
        right={
          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            aria-label="알림 센터로 이동"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--mfm-ink)] transition-colors hover:bg-[var(--mfm-surface-soft)]"
          >
            <Bell size={19} weight={unreadCount > 0 ? "fill" : "regular"} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--mfm-primary)]" />
            )}
          </button>
        }
      />

      <div className="flex flex-col gap-7 px-4 pb-28 pt-5">
        <Card
          as="button"
          onClick={() => onNavigate("approvals")}
          className="flex items-center justify-between gap-3 !rounded-[16px] !border-0 bg-[var(--mfm-surface-dark)] px-5 py-5"
        >
          <div>
            <p className="text-[12px] text-[var(--mfm-on-dark-soft)]">오늘의 승인 대기</p>
            <p className="mfm-tabular mt-1 text-[30px] font-bold leading-none text-[var(--mfm-on-dark)]">
              {pendingCount}
              <span className="ml-1 text-[15px] font-medium text-[var(--mfm-on-dark-soft)]">건</span>
            </p>
            <p className="mt-2 text-[11.5px] text-[var(--mfm-on-dark-soft)]">지금 확인하고 처리하세요</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--mfm-primary)] text-[var(--mfm-on-primary)]">
            <CaretRight size={18} weight="bold" />
          </span>
        </Card>

        <div className="flex flex-col gap-3">
          <SectionTitle title="채널별 발행 예정" />
          <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {channelRows.map((row) => (
              <div key={row.channel} className="w-[136px] shrink-0">
                <StatTile
                  label={CHANNEL_LABEL[row.channel]}
                  value={`${row.count}건`}
                  sub={`가장 빠른 발행 ${formatDateShort(row.nearest)}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitle title="최근 발행 알림" action="전체보기" onAction={() => onNavigate("notifications")} />
          <div className="flex flex-col gap-2.5">
            {recentNotifications.map((notif) => (
              <Card
                key={notif.id}
                as="button"
                onClick={() =>
                  notif.contentId ? onNavigate("contentReview", notif.contentId) : onNavigate("notifications")
                }
                className="flex flex-col gap-1.5 px-4 py-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <NotificationTypeBadge type={notif.type} />
                  <span className="mfm-tabular shrink-0 text-[11px] text-[var(--mfm-muted-soft)]">
                    {formatDateShort(notif.createdAt)}
                  </span>
                </div>
                <p className="text-[13.5px] font-semibold leading-[1.4] text-[var(--mfm-ink)]">{notif.title}</p>
                <p className="line-clamp-1 text-[12px] leading-[1.4] text-[var(--mfm-muted)]">{notif.body}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card as="button" onClick={() => onNavigate("approvals")} className="flex flex-col gap-2.5 px-4 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mfm-surface-card)] text-[var(--mfm-body-strong)]">
              <SquaresFour size={17} weight="bold" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[var(--mfm-ink)]">승인함 바로가기</p>
              <p className="mt-0.5 text-[11px] text-[var(--mfm-muted)]">대기 중인 콘텐츠 확인</p>
            </div>
          </Card>
          <Card as="button" onClick={() => onNavigate("notifications")} className="flex flex-col gap-2.5 px-4 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mfm-surface-card)] text-[var(--mfm-body-strong)]">
              <Bell size={17} weight="bold" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[var(--mfm-ink)]">알림센터 바로가기</p>
              <p className="mt-0.5 text-[11px] text-[var(--mfm-muted)]">발행 상태 전체 보기</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
