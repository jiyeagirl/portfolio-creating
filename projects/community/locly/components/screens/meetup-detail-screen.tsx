"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, MapPin, UsersThree } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { MEETUPS } from "@/projects/community/locly/lib/mock-data";
import { Avatar, Badge, EmptyState, PrimaryButton } from "@/projects/community/locly/components/layout/ui";

const STATUS_LABEL: Record<string, { label: string; tone: "success" | "neutral" | "danger" }> = {
  recruiting: { label: "모집중", tone: "success" },
  closed: { label: "모집완료", tone: "neutral" },
  done: { label: "종료", tone: "danger" },
};

export function MeetupDetailScreen({ meetupId, onNavigate }: { meetupId: string; onNavigate: NavigateFn }) {
  const meetup = MEETUPS.find((m) => m.id === meetupId) ?? MEETUPS[0];
  const [applied, setApplied] = useState(false);
  const status = STATUS_LABEL[meetup.status];
  const isFull = meetup.status !== "recruiting" || meetup.applied + (applied ? 1 : 0) >= meetup.capacity;

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-24 pt-8 lg:px-0">
      <button
        onClick={() => onNavigate("meetups")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
      >
        <ArrowLeft size={16} />
        모임 목록으로
      </button>

      <div className="relative mt-5 h-[260px] w-full overflow-hidden rounded-2xl md:h-[320px]">
        <Image src={meetup.image} alt={meetup.title} fill className="object-cover" />
        <span className="absolute left-4 top-4">
          <Badge tone={status.tone}>{status.label}</Badge>
        </span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <Badge tone="neutral">{meetup.category}</Badge>
          <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">{meetup.title}</h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--locly-muted)]">모임장 · {meetup.host}</p>
          <p className="mt-4 whitespace-pre-line text-[14.5px] leading-[1.8] text-[var(--locly-ink)]">
            {meetup.description}
          </p>

          <div className="mt-6">
            <p className="text-[13px] font-semibold text-[var(--locly-ink)]">참여 멤버</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {meetup.members.map((member) => (
                <div key={member} className="flex items-center gap-1.5 rounded-full border border-[var(--locly-border)] py-1 pl-1 pr-3">
                  <Avatar name={member} size={22} />
                  <span className="text-[12.5px] text-[var(--locly-ink)]">{member}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-[15px] font-bold text-[var(--locly-ink)]">모임 후기</h2>
            {meetup.reviews.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4">
                {meetup.reviews.map((review, i) => (
                  <div key={i} className="flex gap-3 border-b border-[var(--locly-border)] pb-4 last:border-0">
                    <Avatar name={review.author} size={32} />
                    <div>
                      <p className="text-[13.5px] font-semibold text-[var(--locly-ink)]">{review.author}</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--locly-muted)]">{review.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState icon={<UsersThree size={20} />} title="아직 후기가 없어요" description="모임에 참여하고 첫 후기를 남겨보세요." />
              </div>
            )}
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <CalendarBlank size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{meetup.schedule}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{meetup.location}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <UsersThree size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>
              {meetup.applied + (applied ? 1 : 0)}/{meetup.capacity}명
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--locly-surface)]">
            <div
              className="h-full rounded-full bg-[var(--locly-accent)]"
              style={{ width: `${Math.min(100, ((meetup.applied + (applied ? 1 : 0)) / meetup.capacity) * 100)}%` }}
            />
          </div>
          <PrimaryButton full onClick={() => setApplied(true)} disabled={applied || isFull}>
            {applied ? "참가 신청 완료" : isFull ? (meetup.status === "done" ? "종료된 모임" : "정원 마감") : "참가 신청하기"}
          </PrimaryButton>
        </aside>
      </div>
    </div>
  );
}
