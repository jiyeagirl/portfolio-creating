"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, Clock, MapPin, ShareNetwork, Star, UsersThree } from "@phosphor-icons/react";
import { EVENTS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import {
  Avatar,
  Badge,
  CONTAINER,
  Display,
  EmptyState,
  OfficialBadge,
  PrimaryButton,
} from "@/projects/community/locly/components/site/ui";

export function EventDetailScreen({ eventId, onNavigate }: { eventId: string; onNavigate: NavigateFn }) {
  const event = EVENTS.find((e) => e.id === eventId) ?? EVENTS[0];
  const [applied, setApplied] = useState(false);
  const total = event.applied + (applied ? 1 : 0);
  const isFull = total >= event.capacity;

  return (
    <div className={`${CONTAINER} py-14 lg:py-20`}>
      <div className="mx-auto max-w-[920px]">
        <button
          onClick={() => onNavigate("events")}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--lc-muted)]"
        >
          <ArrowLeft size={15} />
          지역 행사
        </button>

        <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-[16px]">
          <Image src={event.image} alt={event.title} fill sizes="920px" className="object-cover" priority />
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {event.official ? <OfficialBadge /> : <Badge>주민 주최</Badge>}
              <Badge>{event.category}</Badge>
            </div>
            <Display as="h1" size="md" className="mt-5">
              {event.title}
            </Display>
            <p className="mt-3 text-[14px] text-[var(--lc-muted)]">주최 · {event.organizer}</p>
            <p className="mt-6 whitespace-pre-line text-[17px] leading-[1.75] text-[var(--lc-body-strong)]">
              {event.description}
            </p>

            <section className="mt-12 border-t border-[var(--lc-hairline)] pt-8">
              <h2 className="text-[18px] font-medium text-[var(--lc-ink)]">참가자 후기</h2>
              {event.reviews.length > 0 ? (
                <div className="mt-6 flex flex-col divide-y divide-[var(--lc-hairline)]">
                  {event.reviews.map((review, i) => (
                    <div key={i} className="flex gap-3 py-5 first:pt-0">
                      <Avatar name={review.author} size={34} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-medium text-[var(--lc-ink)]">{review.author}</p>
                          <span className="inline-flex gap-0.5 text-[var(--lc-amber)]">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} size={11} weight="fill" />
                            ))}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[15px] leading-[1.6] text-[var(--lc-body)]">{review.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    icon={<Star size={22} />}
                    title="아직 후기가 없어요"
                    description="행사에 참여하고 첫 번째 후기를 남겨보세요."
                  />
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-surface-card)] p-8 lg:sticky lg:top-24">
            <dl className="flex flex-col gap-5">
              {[
                {
                  icon: <CalendarBlank size={17} />,
                  label: "일정",
                  value: event.endDate ? `${event.date} ~ ${event.endDate}` : event.date,
                },
                { icon: <Clock size={17} />, label: "시간", value: event.time },
                { icon: <MapPin size={17} />, label: "장소", value: event.location },
                { icon: <UsersThree size={17} />, label: "신청", value: `${total} / ${event.capacity}명` },
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
                style={{ width: `${Math.min(100, (total / event.capacity) * 100)}%` }}
              />
            </div>

            <div className="mt-6">
              <PrimaryButton full onClick={() => setApplied(true)} disabled={applied || isFull}>
                {applied ? "신청 완료" : isFull ? "정원 마감" : "참가 신청하기"}
              </PrimaryButton>
            </div>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 text-[13px] font-medium text-[var(--lc-muted)]">
              <ShareNetwork size={14} />
              일정 공유하기
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
