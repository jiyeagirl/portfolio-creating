"use client";

import {
  Bell,
  CaretRight,
  ClipboardText,
  Headset,
  PencilSimple,
  Wallet,
} from "@phosphor-icons/react";
import { AppBar, Badge, ListRow } from "@/projects/commerce/snowpeak/components/ui";
import { formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { UserProfile } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

function formatJoinedDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일 가입`;
}

export function MypageScreen({
  profile,
  onNavigate,
}: {
  profile: UserProfile;
  onNavigate: NavigateFn;
}) {
  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="마이" />

      <div className="flex-1 overflow-y-auto px-5 pb-24 pt-4">
        {/* 프로필 요약 */}
        <div
          className="rounded-[16px] bg-[var(--sp-surface)] p-5"
          style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[20px] font-semibold text-[var(--sp-ink)]">
              {profile.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[17px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">
                  {profile.name}
                </p>
                <Badge tone="ink">{profile.tier}</Badge>
              </div>
              <p className="mt-1 truncate text-[12.5px] text-[var(--sp-mute)]">
                {formatJoinedDate(profile.joinedAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("wallet")}
            className="mt-4 flex w-full items-center justify-between rounded-[12px] bg-[var(--sp-surface-soft)] px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="text-[13px] font-medium text-[var(--sp-body)]">보유 포인트</span>
            <span className="flex items-center gap-1.5">
              <span className="sp-num text-[16px] font-semibold text-[var(--sp-accent)]">
                {formatWon(profile.pointBalance)}P
              </span>
              <CaretRight size={13} weight="bold" className="text-[var(--sp-mute)]" />
            </span>
          </button>
        </div>

        {/* 예약 */}
        <div className="mt-6 overflow-hidden rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)]">
          <ListRow
            icon={<ClipboardText size={16} weight="bold" />}
            label="예약 내역"
            onClick={() => onNavigate("reservationList")}
          />
          <ListRow
            icon={<Wallet size={16} weight="bold" />}
            label="결제 / 쿠폰 / 포인트"
            onClick={() => onNavigate("wallet")}
          />
        </div>

        {/* 계정 */}
        <div className="mt-4 overflow-hidden rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)]">
          <ListRow
            icon={<PencilSimple size={16} weight="bold" />}
            label="회원정보 수정"
            onClick={() => onNavigate("profileEdit")}
          />
          <ListRow
            icon={<Bell size={16} weight="bold" />}
            label="알림"
            onClick={() => onNavigate("notifications")}
          />
        </div>

        {/* 고객센터 */}
        <div className="mt-4 overflow-hidden rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)]">
          <ListRow
            icon={<Headset size={16} weight="bold" />}
            label="고객센터"
            onClick={() => onNavigate("support")}
          />
        </div>
      </div>
    </div>
  );
}
