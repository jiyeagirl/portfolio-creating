"use client";

/* 07-a 상점가 축제 목록 — 상태(진행중 / 예정 / 지난)로 나눠 훑는다.
   축제명, 장소는 전부 가명이며 위치는 상점가 구역 코드와 QR 지점 기준 거리로만 쓴다. */

import Image from "next/image";
import { useState } from "react";
import { CalendarBlank, MapPin } from "@phosphor-icons/react";
import { Badge, EmptyState, QrContextStrip } from "@/projects/youngin/real/components/ui";
import {
  DISTRICTS,
  FESTIVALS,
  QR_POINT,
  formatDistance,
} from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";
import type { FestivalStatus } from "@/projects/youngin/real/lib/types";

const TABS: { key: FestivalStatus | "전체"; label: string }[] = [
  { key: "전체", label: "전체" },
  { key: "진행중", label: "진행중" },
  { key: "예정", label: "예정" },
  { key: "종료", label: "지난 축제" },
];

export function FestivalsScreen({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [tab, setTab] = useState<FestivalStatus | "전체">("전체");

  const list = FESTIVALS.filter((f) => (tab === "전체" ? true : f.status === tab));
  const counts = (key: FestivalStatus | "전체") =>
    key === "전체" ? FESTIVALS.length : FESTIVALS.filter((f) => f.status === key).length;

  return (
    <div className="min-h-full bg-[var(--cp-canvas)] pb-[124px]">
      <div className="sticky top-0 z-30 bg-[var(--cp-surface)] pt-[59px]">
        <QrContextStrip code={QR_POINT.code} label={QR_POINT.label} />
        <div className="px-5 pb-1 pt-3">
          <h1 className="text-[20px] font-extrabold tracking-[-0.03em] text-[var(--cp-ink)]">
            상점가 축제
          </h1>
          <p className="cp-num mt-0.5 text-[12px] text-[var(--cp-mute)]">
            {QR_POINT.city} 골목형 상점가 {FESTIVALS.length}건 / 가까운 순
          </p>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--cp-hairline)] px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={active ? "true" : undefined}
                className={`relative shrink-0 px-3 pb-3 pt-2 text-[13.5px] transition-colors ${
                  active
                    ? "font-bold text-[var(--cp-ink)]"
                    : "font-semibold text-[var(--cp-mute)]"
                }`}
              >
                {t.label}
                <span className="cp-num ml-1 text-[12px] text-[var(--cp-faint)]">
                  {counts(t.key)}
                </span>
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-[var(--cp-accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 px-5 pt-4">
        {list.length === 0 ? (
          <EmptyState
            title="해당 상태의 축제가 없습니다"
            desc="다른 탭에서 진행중이거나 예정된 축제를 확인해 주세요."
          />
        ) : (
          list.map((f) => {
            const district = DISTRICTS.find((d) => d.id === f.districtId);
            const dim = f.status === "종료";
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onNavigate({ name: "festivalDetail", festivalId: f.id })}
                className="block w-full overflow-hidden rounded-2xl bg-[var(--cp-surface)] text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
              >
                <span className="relative block">
                  <Image
                    src={`https://picsum.photos/id/${f.photo}/720/380`}
                    alt={f.photoAlt}
                    width={360}
                    height={190}
                    className={`h-[142px] w-full object-cover ${dim ? "opacity-55 grayscale" : ""}`}
                  />
                  <span className="absolute left-3 top-3">
                    <Badge
                      tone={f.status === "진행중" ? "danger" : f.status === "예정" ? "warn" : "neutral"}
                      dot={f.status === "진행중"}
                    >
                      {f.status}
                    </Badge>
                  </span>
                </span>

                <span className="block p-4">
                  <span className="cp-num flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--cp-mute)]">
                    <CalendarBlank size={12} weight="fill" />
                    {f.period} | {f.time}
                  </span>
                  <span className="mt-1.5 block text-[17px] font-extrabold leading-[23px] tracking-[-0.02em] text-[var(--cp-ink)]">
                    {f.name}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-[19px] text-[var(--cp-body)]">
                    {f.summary}
                  </span>
                  <span className="cp-num mt-3 flex items-center gap-1.5 border-t border-[var(--cp-hairline)] pt-3 text-[12px] text-[var(--cp-mute)]">
                    <MapPin size={13} weight="fill" className="text-[var(--cp-accent)]" />
                    {district?.name ?? f.venue} |{" "}
                    {f.distance === 0 ? "지금 계신 상권" : formatDistance(f.distance)}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
