"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarBlank, MapPin, Plus, UsersThree, X } from "@phosphor-icons/react";
import { MEETUPS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Badge,
  CONTAINER,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
} from "@/projects/community/locly/components/site/ui";

const STATUS: Record<string, { label: string; tone: "official" | "neutral" | "closed" }> = {
  recruiting: { label: "모집중", tone: "official" },
  closed: { label: "모집완료", tone: "neutral" },
  done: { label: "종료", tone: "closed" },
};

export function MeetupsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <div className={`${CONTAINER} pt-10 pb-14 lg:pt-14 lg:pb-20`}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <PageHeader
            title="모임"
            lead="관심사가 같은 이웃과 온라인을 넘어 오프라인에서 만나보세요. 누구나 모임을 열 수 있습니다."
          />
        </div>
        <div className="pt-2">
          <PrimaryButton onClick={() => setCreating((v) => !v)}>
            <Plus size={15} weight="bold" />
            모임 개설하기
          </PrimaryButton>
        </div>
      </div>

      {creating && (
        <div className="mt-8 rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-surface-card)] p-8">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium text-[var(--lc-ink)]">새 모임 개설</p>
            <button onClick={() => setCreating(false)} aria-label="닫기" className="text-[var(--lc-muted)]">
              <X size={17} />
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="모임 이름을 입력하세요 (예: 나인동 주말 등산 모임)"
              className="h-10 flex-1 rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] px-3.5 text-[15px] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
            />
            <SecondaryButton
              onClick={() => {
                setCreating(false);
                setTitle("");
              }}
            >
              개설 신청
            </SecondaryButton>
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {MEETUPS.map((meetup) => {
          const status = STATUS[meetup.status];
          return (
            <button
              key={meetup.id}
              onClick={() => onNavigate("meetupDetail", meetup.id)}
              className="flex flex-col text-left"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
                <Image
                  src={meetup.image}
                  alt={meetup.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </span>
              </div>
              <div className="mt-5">
                <p className="text-[13px] text-[var(--lc-muted)]">{meetup.category}</p>
                <p className="mt-1.5 text-[18px] font-medium leading-[1.4] text-[var(--lc-ink)]">{meetup.title}</p>
                <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-[var(--lc-muted)]">
                  {meetup.description}
                </p>
                <div className="mt-4 flex flex-col gap-2 border-t border-[var(--lc-hairline)] pt-4 text-[13px] text-[var(--lc-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarBlank size={13} className="shrink-0" />
                    {meetup.schedule}
                  </span>
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <MapPin size={13} className="shrink-0" />
                    <span className="truncate">{meetup.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--lc-ink)]">
                    <UsersThree size={13} />
                    {meetup.applied}/{meetup.capacity}명
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
