"use client";

import Image from "next/image";
import {
  CaretLeft,
  CaretRight,
  ChatCircleText,
  ClockCounterClockwise,
  Gear,
  Heart,
  House,
  ShieldCheck,
  ShoppingBagOpen,
  Buildings,
} from "@phosphor-icons/react";
import { Badge, HeroCard, TrustBar } from "@/projects/community/waypoint/components/ui";
import { ME, picsumId } from "@/projects/community/waypoint/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/waypoint/lib/navigation";

export function MyPageScreen({
  onNavigate,
  onOpenTransactions,
  onOpenSettings,
}: {
  onNavigate: (key: BottomNavKey) => void;
  onOpenTransactions: (tab: "liked" | "selling" | "buying") => void;
  onOpenSettings: () => void;
}) {
  const links = [
    { key: "liked" as const, label: "관심상품", icon: Heart },
    { key: "selling" as const, label: "판매내역", icon: ShoppingBagOpen },
    { key: "buying" as const, label: "구매내역", icon: ClockCounterClockwise },
  ];

  return (
    <div className="waypoint relative flex h-full flex-col bg-[var(--wp-canvas)]">
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="relative h-[104px] w-full">
          <Image src={picsumId(321, 700, 260)} alt="마이페이지 배경" fill sizes="360px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-[var(--wp-canvas)]" />
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="지도로 돌아가기"
            className="absolute left-3 top-[63px] flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--wp-ink)] transition-opacity active:opacity-60"
            style={{ boxShadow: "var(--wp-shadow)" }}
          >
            <CaretLeft size={18} weight="bold" />
          </button>
        </div>

        <div className="relative -mt-12 px-5">
          <div className="flex items-end gap-3">
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-[var(--wp-canvas)] bg-[var(--wp-accent)] text-[26px] font-bold text-white">
              {ME.avatarInitial}
            </span>
            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[18px] font-bold text-[var(--wp-ink)]">{ME.nickname}</p>
                {ME.dualVerified && <Badge tone="success" icon={<ShieldCheck size={11} weight="fill" />}>듀얼인증</Badge>}
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[var(--wp-muted)]">
                <House size={12} weight="fill" /> {ME.homeDong.split(" ").slice(-1)}
                <span>|</span>
                <Buildings size={12} weight="fill" /> {ME.workDong.split(" ").slice(-1)}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <HeroCard>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-[var(--wp-body)]">신뢰지수</p>
                  <p className="tabular-nums text-[22px] font-bold text-[var(--wp-ink)]">{ME.trustScore}점</p>
                </div>
                <div className="mt-2.5">
                  <TrustBar value={ME.trustScore} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--wp-border)] pt-3.5 text-center">
                  <div>
                    <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{ME.dealCount}</p>
                    <p className="text-[11px] text-[var(--wp-muted)]">거래성공</p>
                  </div>
                  <div>
                    <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{ME.onTimeRate}%</p>
                    <p className="text-[11px] text-[var(--wp-muted)]">시간준수율</p>
                  </div>
                  <div>
                    <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{ME.responseRate}%</p>
                    <p className="text-[11px] text-[var(--wp-muted)]">응답률</p>
                  </div>
                </div>
              </div>
            </HeroCard>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className="mt-4 flex w-full items-center gap-3 rounded-[16px] border border-[var(--wp-border)] px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wp-success-soft)] text-[var(--wp-success)]">
              <ShieldCheck size={17} weight="fill" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-[var(--wp-ink)]">안심거래</p>
              <p className="mt-0.5 truncate text-[11.5px] text-[var(--wp-muted)]">
                본인인증, 집/회사 인증, 로그인 기기, 차단 관리
              </p>
            </div>
            <CaretRight size={15} className="shrink-0 text-[var(--wp-muted)]" />
          </button>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {links.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => onOpenTransactions(l.key)}
                className="flex flex-col items-center gap-2 rounded-[16px] border border-[var(--wp-border)] py-4"
              >
                <l.icon size={20} className="text-[var(--wp-accent)]" />
                <span className="text-[12.5px] font-medium text-[var(--wp-body)]">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 divide-y divide-[var(--wp-border)] rounded-[16px] border border-[var(--wp-border)]">
            <button type="button" onClick={onOpenSettings} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <Gear size={17} className="text-[var(--wp-body)]" />
              <span className="flex-1 text-[13.5px] text-[var(--wp-ink)]">설정</span>
              <CaretRight size={14} className="text-[var(--wp-muted)]" />
            </button>
            <button type="button" className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <ChatCircleText size={17} className="text-[var(--wp-body)]" />
              <span className="flex-1 text-[13.5px] text-[var(--wp-ink)]">고객센터</span>
              <CaretRight size={14} className="text-[var(--wp-muted)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
