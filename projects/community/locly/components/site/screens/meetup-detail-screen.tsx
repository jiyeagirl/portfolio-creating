"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, MapPin, UsersThree } from "@phosphor-icons/react";
import { MEETUPS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Avatar,
  Badge,
  CONTAINER,
  Display,
  EmptyState,
  PrimaryButton,
} from "@/projects/community/locly/components/site/ui";

const STATUS: Record<string, { label: string; tone: "official" | "neutral" | "closed" }> = {
  recruiting: { label: "모집중", tone: "official" },
  closed: { label: "모집완료", tone: "neutral" },
  done: { label: "종료", tone: "closed" },
};

export function MeetupDetailScreen({ meetupId, onNavigate }: { meetupId: string; onNavigate: NavigateFn }) {
  const meetup = MEETUPS.find((m) => m.id === meetupId) ?? MEETUPS[0];
  const [applied, setApplied] = useState(false);
  const status = STATUS[meetup.status];
  const total = meetup.applied + (applied ? 1 : 0);
  const isFull = meetup.status !== "recruiting" || total >= meetup.capacity;

  return (
    <div className={`${CONTAINER} py-14 lg:py-20`}>
      <div className="mx-auto max-w-[920px]">
        <button
          onClick={() => onNavigate("meetups")}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--lc-muted)]"
        >
          <ArrowLeft size={15} />
          모임
        </button>

        <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-[16px]">
          <Image src={meetup.image} alt={meetup.title} fill sizes="920px" className="object-cover" priority />
          <span className="absolute left-6 top-6">
            <Badge tone={status.tone}>{status.label}</Badge>
          </span>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Badge>{meetup.category}</Badge>
            <Display as="h1" size="md" className="mt-4">
              {meetup.title}
            </Display>
            <p className="mt-3 text-[14px] text-[var(--lc-muted)]">모임장 · {meetup.host}</p>
            <p className="mt-6 whitespace-pre-line text-[17px] leading-[1.75] text-[var(--lc-body-strong)]">
              {meetup.description}
            </p>

            <div className="mt-8">
              <p className="text-[14px] font-medium text-[var(--lc-ink)]">참여 멤버</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {meetup.members.map((member) => (
                  <span
                    key={member}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--lc-hairline)] py-1 pl-1 pr-3.5"
                  >
                    <Avatar name={member} size={24} />
                    <span className="text-[13px] text-[var(--lc-body)]">{member}</span>
                  </span>
                ))}
              </div>
            </div>

            <section className="mt-12 border-t border-[var(--lc-hairline)] pt-8">
              <h2 className="text-[18px] font-medium text-[var(--lc-ink)]">모임 후기</h2>
              {meetup.reviews.length > 0 ? (
                <div className="mt-6 flex flex-col divide-y divide-[var(--lc-hairline)]">
                  {meetup.reviews.map((review, i) => (
                    <div key={i} className="flex gap-3 py-5 first:pt-0">
                      <Avatar name={review.author} size={34} />
                      <div>
                        <p className="text-[14px] font-medium text-[var(--lc-ink)]">{review.author}</p>
                        <p className="mt-1.5 text-[15px] leading-[1.6] text-[var(--lc-body)]">{review.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    icon={<UsersThree size={22} />}
                    title="아직 후기가 없어요"
                    description="모임에 참여하고 첫 후기를 남겨보세요."
                  />
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-surface-card)] p-8 lg:sticky lg:top-24">
            <dl className="flex flex-col gap-5">
              {[
                { icon: <CalendarBlank size={17} />, label: "일정", value: meetup.schedule },
                { icon: <MapPin size={17} />, label: "장소", value: meetup.location },
                { icon: <UsersThree size={17} />, label: "인원", value: `${total} / ${meetup.capacity}명` },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[var(--lc-muted)]">{row.icon}</span>
                  <div className="min-w-0">
                    <dt className="text-[12px] text-[var(--lc-muted-soft)]">{row.label}</dt>
                    <dd className="mt-0.5 text-[15px] leading-[1.5] text-[var(--lc-ink)]">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[var(--lc-hairline)]">
              <div
                className="h-full rounded-full bg-[var(--lc-primary)]"
                style={{ width: `${Math.min(100, (total / meetup.capacity) * 100)}%` }}
              />
            </div>

            <div className="mt-6">
              <PrimaryButton full onClick={() => setApplied(true)} disabled={applied || isFull}>
                {applied
                  ? "참가 신청 완료"
                  : meetup.status === "done"
                    ? "종료된 모임"
                    : isFull
                      ? "정원 마감"
                      : "참가 신청하기"}
              </PrimaryButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
