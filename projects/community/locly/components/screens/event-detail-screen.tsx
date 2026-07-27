"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, Clock, MapPin, ShareNetwork, Star, UsersThree } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { EVENTS } from "@/projects/community/locly/lib/mock-data";
import { Avatar, Badge, EmptyState, OfficialBadge, PrimaryButton } from "@/projects/community/locly/components/layout/ui";

export function EventDetailScreen({ eventId, onNavigate }: { eventId: string; onNavigate: NavigateFn }) {
  const event = EVENTS.find((e) => e.id === eventId) ?? EVENTS[0];
  const [applied, setApplied] = useState(false);
  const isFull = event.applied + (applied ? 1 : 0) >= event.capacity;

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-24 pt-8 lg:px-0">
      <button
        onClick={() => onNavigate("events")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-ink)]"
      >
        <ArrowLeft size={16} />
        지역 행사 목록으로
      </button>

      <div className="relative mt-5 h-[280px] w-full overflow-hidden rounded-2xl md:h-[360px]">
        <Image src={event.image} alt={event.title} fill className="object-cover" />
        <div className="absolute left-4 top-4 flex gap-2">
          {event.official ? <OfficialBadge /> : <Badge tone="neutral">주민 주최</Badge>}
          <Badge tone="accent">{event.category}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h1 className="text-[24px] font-bold leading-snug tracking-tight text-[var(--locly-ink)]">{event.title}</h1>
          <p className="mt-2 text-[13.5px] text-[var(--locly-muted)]">주최 · {event.organizer}</p>
          <p className="mt-4 whitespace-pre-line text-[14.5px] leading-[1.8] text-[var(--locly-ink)]">
            {event.description}
          </p>

          <div className="mt-8">
            <h2 className="text-[15px] font-bold text-[var(--locly-ink)]">참가자 후기</h2>
            {event.reviews.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4">
                {event.reviews.map((review, i) => (
                  <div key={i} className="flex gap-3 border-b border-[var(--locly-border)] pb-4 last:border-0">
                    <Avatar name={review.author} size={32} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13.5px] font-semibold text-[var(--locly-ink)]">{review.author}</p>
                        <span className="inline-flex items-center gap-0.5 text-[var(--locly-warning)]">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} size={11} weight="fill" />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--locly-muted)]">{review.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  icon={<Star size={20} />}
                  title="아직 후기가 없어요"
                  description="행사에 참여하고 첫 번째 후기를 남겨보세요."
                />
              </div>
            )}
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <CalendarBlank size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>
              {event.date}
              {event.endDate ? ` ~ ${event.endDate}` : ""}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <Clock size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13.5px] text-[var(--locly-ink)]">
            <UsersThree size={17} className="mt-0.5 shrink-0 text-[var(--locly-accent)]" />
            <span>
              {event.applied + (applied ? 1 : 0)}/{event.capacity}명 신청
            </span>
          </div>

          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--locly-surface)]">
            <div
              className="h-full rounded-full bg-[var(--locly-accent)]"
              style={{ width: `${Math.min(100, ((event.applied + (applied ? 1 : 0)) / event.capacity) * 100)}%` }}
            />
          </div>

          <PrimaryButton full onClick={() => setApplied(true)} disabled={applied || isFull}>
            {applied ? "신청 완료" : isFull ? "정원 마감" : "참가 신청하기"}
          </PrimaryButton>
          <button className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-ink)]">
            <ShareNetwork size={15} />
            일정 공유하기
          </button>
        </aside>
      </div>
    </div>
  );
}
