"use client";

import { Drop, Moon, Sparkle, SneakerMove, UsersThree } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { EmptyState } from "@/projects/healthcare/welllog/components/ui";
import { notifications } from "@/projects/healthcare/welllog/lib/mock-data";
import type { NudgeType } from "@/projects/healthcare/welllog/lib/types";

const TYPE_ICON: Record<NudgeType, React.ComponentType<{ size?: number; weight?: "fill"; color?: string }>> = {
  ai: Sparkle,
  exercise: SneakerMove,
  hydration: Drop,
  challenge: UsersThree,
  sleep: Moon,
};

const TYPE_TONE: Record<NudgeType, string> = {
  ai: "var(--wl-accent-soft)",
  exercise: "var(--wl-coral-soft)",
  hydration: "var(--wl-periwinkle-soft)",
  challenge: "var(--wl-amber-soft)",
  sleep: "var(--wl-periwinkle-soft)",
};

const TYPE_ICON_COLOR: Record<NudgeType, string> = {
  ai: "var(--wl-accent-deep)",
  exercise: "var(--wl-coral)",
  hydration: "var(--wl-periwinkle)",
  challenge: "var(--wl-amber)",
  sleep: "var(--wl-periwinkle)",
};

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-10">
      <ScreenHeader
        title="알림"
        subtitle="경고가 아니라 따뜻한 제안이에요"
        onBack={onBack}
        className="bg-[var(--wl-canvas)] border-[var(--wl-hairline)]"
        backButtonClassName="text-[var(--wl-ink)] hover:bg-[var(--wl-surface-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wl-ink)]"
        subtitleClassName="text-[11px] text-[var(--wl-mute)]"
      />

      <div className="px-5 pt-4">
        {notifications.length === 0 ? (
          <EmptyState icon={<Sparkle size={20} />} title="아직 알림이 없어요" desc="새로운 제안이 도착하면 여기서 확인할 수 있어요." />
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type];
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-[20px] p-3.5 ${
                    n.read ? "bg-[var(--wl-surface)] shadow-[var(--wl-shadow)]" : "bg-[var(--wl-surface)] shadow-[var(--wl-shadow-pop)]"
                  }`}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: TYPE_TONE[n.type] }}
                  >
                    <Icon size={17} weight="fill" color={TYPE_ICON_COLOR[n.type]} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13.5px] font-semibold text-[var(--wl-ink)]">{n.title}</p>
                      {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--wl-coral)]" />}
                    </div>
                    <p className="mt-0.5 text-[13px] leading-5 text-[var(--wl-body)]">{n.body}</p>
                    <p className="wl-num mt-1.5 text-[11px] text-[var(--wl-mute)]">{n.at}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
