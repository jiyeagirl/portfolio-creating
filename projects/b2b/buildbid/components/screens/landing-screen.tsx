"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChartLineUp,
  CraneTower,
  FileMagnifyingGlass,
  Gavel,
  RoadHorizon,
  Shovel,
  Tractor,
  Truck,
  TruckTrailer,
} from "@phosphor-icons/react";
import { Mark } from "@/projects/b2b/buildbid/components/layout/mark";
import type { Role } from "@/projects/b2b/buildbid/lib/navigation";

const HERO_ICONS = [Shovel, CraneTower, Tractor, TruckTrailer, Truck, RoadHorizon];

export function LandingScreen({ onSelectRole }: { onSelectRole: (role: Role) => void }) {
  return (
    <div className="buildbid min-h-dvh bg-[var(--bb-canvas)]">
      <header className="mx-auto flex h-16 max-w-[1200px] items-center gap-2 px-6">
        <Mark size={24} />
        <span className="text-[16px] font-semibold tracking-[-0.03em] text-[var(--bb-ink)]">BuildBid</span>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 pb-20 pt-6 lg:pt-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--bb-ink)] lg:text-[40px]">
              중고 건설장비, AI 견적과
              <br />
              2단계 입찰로 제값 받고 넘긴다
            </h1>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-7 text-[var(--bb-body)]">
              보유 장비를 등록하면 AI가 예상 거래가를 산출하고, 국내외 매입업체가 1차
              입찰에 참여합니다. 현장 검수 결과가 반영된 최종 입찰로 거래가 확정됩니다.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RoleCard
                role="seller"
                title="판매자로 시작"
                desc="보유 장비를 등록하고 AI 예상 거래가를 확인한 뒤 입찰을 관리합니다."
                icon={<Shovel size={20} weight="bold" />}
                onSelect={onSelectRole}
              />
              <RoleCard
                role="buyer"
                title="바이어로 시작"
                desc="등록된 장비를 탐색하고 1차, 최종 입찰에 참여해 낙찰받습니다."
                icon={<Gavel size={20} weight="bold" />}
                onSelect={onSelectRole}
              />
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--bb-hairline)] pt-6">
              {[
                { label: "누적 등록 장비", value: "3,412대" },
                { label: "누적 거래액", value: "487억원" },
                { label: "제휴 매입업체", value: "126개사" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[12px] text-[var(--bb-mute)]">{stat.label}</dt>
                  <dd className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-[var(--bb-ink)]">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] p-8">
            <p className="text-[13px] font-semibold text-[var(--bb-mute)]">거래 가능 장비 카테고리</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {HERO_ICONS.map((Icon, index) => (
                <div
                  key={index}
                  className="flex aspect-square items-center justify-center rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas)] text-[var(--bb-primary)]"
                >
                  <Icon size={32} weight="bold" />
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-[var(--bb-hairline)] pt-5">
              <FlowStep icon={<ChartLineUp size={15} weight="bold" />} label="AI 자동 시세 산출" />
              <FlowStep icon={<Gavel size={15} weight="bold" />} label="1차 역경매 입찰" />
              <FlowStep icon={<FileMagnifyingGlass size={15} weight="bold" />} label="현장 검수 리포트 반영" />
              <FlowStep icon={<ArrowRight size={15} weight="bold" />} label="최종 입찰과 낙찰 확정" />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--bb-hairline)] py-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 text-[12px] text-[var(--bb-mute)]">
          <span>BuildBid는 포트폴리오 목업이며 실제 거래를 중개하지 않습니다.</span>
          <Link href="/b2b/buildbid-admin" className="text-[var(--bb-mute)] transition-colors hover:text-[var(--bb-body)]">
            관리자 콘솔
          </Link>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({
  role,
  title,
  desc,
  icon,
  onSelect,
}: {
  role: Role;
  title: string;
  desc: string;
  icon: React.ReactNode;
  onSelect: (role: Role) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className="group flex flex-col items-start gap-3 rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas)] p-5 text-left transition-colors hover:border-[var(--bb-primary)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bb-canvas-parchment)] text-[var(--bb-primary)]">{icon}</span>
      <span className="text-[15px] font-semibold text-[var(--bb-ink)]">{title}</span>
      <span className="text-[13px] leading-5 text-[var(--bb-mute)]">{desc}</span>
      <span className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-[var(--bb-primary)]">
        시작하기
        <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function FlowStep({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-[var(--bb-body)]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bb-canvas)] text-[var(--bb-primary)]">{icon}</span>
      {label}
    </div>
  );
}
