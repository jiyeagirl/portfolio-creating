"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarBlank, MapPin, Plus, UsersThree, X } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { MEETUPS } from "@/projects/community/locly/lib/mock-data";
import { Badge, PrimaryButton, SecondaryButton } from "@/projects/community/locly/components/layout/ui";

const STATUS_LABEL: Record<string, { label: string; tone: "success" | "neutral" | "danger" }> = {
  recruiting: { label: "모집중", tone: "success" },
  closed: { label: "모집완료", tone: "neutral" },
  done: { label: "종료", tone: "danger" },
};

export function MeetupsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--locly-ink)]">모임</h1>
          <p className="mt-1 text-[13.5px] text-[var(--locly-muted)]">
            관심사가 같은 이웃과 온라인을 넘어 오프라인에서 만나보세요
          </p>
        </div>
        <PrimaryButton onClick={() => setCreating((v) => !v)}>
          <Plus size={16} weight="bold" />
          모임 개설하기
        </PrimaryButton>
      </div>

      {creating && (
        <div className="mt-6 rounded-2xl border border-[var(--locly-accent)]/40 bg-[var(--locly-accent-soft)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-[var(--locly-ink)]">새 모임 개설</p>
            <button onClick={() => setCreating(false)} className="text-[var(--locly-muted)] hover:text-[var(--locly-ink)]">
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="모임 이름을 입력하세요 (예: OO 주말 등산 모임)"
              className="flex-1 rounded-lg border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-4 py-2.5 text-[13.5px] outline-none placeholder:text-[var(--locly-muted)] focus:border-[var(--locly-accent)]"
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MEETUPS.map((meetup) => {
          const status = STATUS_LABEL[meetup.status];
          return (
            <button
              key={meetup.id}
              onClick={() => onNavigate("meetupDetail", meetup.id)}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] text-left transition-colors hover:border-[var(--locly-accent)]/50"
            >
              <div className="relative h-[140px] w-full">
                <Image src={meetup.image} alt={meetup.title} fill className="object-cover" />
                <span className="absolute left-3 top-3">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <Badge tone="neutral">{meetup.category}</Badge>
                <p className="line-clamp-1 text-[15px] font-semibold text-[var(--locly-ink)]">{meetup.title}</p>
                <p className="line-clamp-2 text-[12.5px] leading-relaxed text-[var(--locly-muted)]">
                  {meetup.description}
                </p>
                <div className="mt-auto flex flex-col gap-1.5 pt-1 text-[12px] text-[var(--locly-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <CalendarBlank size={13} />
                    {meetup.schedule}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {meetup.location}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-[var(--locly-accent)]">
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
