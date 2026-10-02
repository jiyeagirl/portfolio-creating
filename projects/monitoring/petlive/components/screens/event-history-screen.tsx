"use client";

import { useMemo, useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Badge, Button, DeviceThumb, EmptyState } from "@/projects/monitoring/petlive/components/ui";
import { EVENTS, deviceById, petById } from "@/projects/monitoring/petlive/lib/mock-data";
import {
  EVENT_KIND_LABEL,
  dateOnly,
  dateTime,
  durationLabel,
  timeOnly,
  type Navigate,
} from "@/projects/monitoring/petlive/lib/navigation";
import type { EventKind } from "@/projects/monitoring/petlive/lib/types";

type KindFilter = "all" | EventKind;

const KIND_CHIPS: { key: KindFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "motion", label: "움직임 감지" },
  { key: "sound", label: "소리 감지" },
];

export function EventHistoryScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const sortedEvents = useMemo(
    () => [...EVENTS].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1)),
    [],
  );

  const dateChips = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const event of sortedEvents) {
      const d = dateOnly(event.occurredAt);
      if (!seen.has(d)) {
        seen.add(d);
        list.push(d);
      }
    }
    return list;
  }, [sortedEvents]);

  const filteredEvents = useMemo(
    () =>
      sortedEvents.filter((event) => {
        if (kindFilter !== "all" && event.kind !== kindFilter) return false;
        if (dateFilter && dateOnly(event.occurredAt) !== dateFilter) return false;
        return true;
      }),
    [sortedEvents, kindFilter, dateFilter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof filteredEvents>();
    for (const event of filteredEvents) {
      const key = dateOnly(event.occurredAt);
      const list = map.get(key);
      if (list) {
        list.push(event);
      } else {
        map.set(key, [event]);
      }
    }
    return Array.from(map.entries());
  }, [filteredEvents]);

  const selectedEvent = selectedId ? EVENTS.find((e) => e.id === selectedId) ?? null : null;
  const selectedPet = selectedEvent ? petById(selectedEvent.petId) : undefined;
  const selectedDevice = selectedEvent ? deviceById(selectedEvent.deviceId) : undefined;

  const closeModal = () => {
    setSelectedId(null);
    setPlaying(false);
  };

  return (
    <div className="pl-enter relative flex h-full flex-col">
      <ScreenHeader
        title="이벤트 기록"
        onBack={() => onNavigate("home")}
        className="bg-[var(--pl-canvas)] border-[var(--pl-hairline)]"
        backButtonClassName="text-[var(--pl-ink)] hover:bg-[var(--pl-canvas-soft)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--pl-ink)]"
      />

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 종류 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {KIND_CHIPS.map((chip) => {
            const active = kindFilter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setKindFilter(chip.key)}
                className={`shrink-0 whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-[var(--pl-accent)] text-white"
                    : "bg-[var(--pl-canvas-soft)] text-[var(--pl-body)]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* 날짜 필터 */}
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setDateFilter(null)}
            className={`shrink-0 whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              dateFilter === null
                ? "bg-[var(--pl-accent)] text-white"
                : "bg-[var(--pl-canvas-soft)] text-[var(--pl-body)]"
            }`}
          >
            전체 날짜
          </button>
          {dateChips.map((d) => {
            const active = dateFilter === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDateFilter(d)}
                className={`shrink-0 whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-[var(--pl-accent)] text-white"
                    : "bg-[var(--pl-canvas-soft)] text-[var(--pl-body)]"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* 이벤트 목록 */}
        {groups.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="해당 조건의 이벤트가 없어요" desc="필터를 바꿔서 다시 확인해보세요." />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {groups.map(([date, events]) => (
              <div key={date}>
                <p className="mb-2.5 text-[13px] font-semibold text-[var(--pl-mute)]">{date}</p>
                <div className="space-y-2.5">
                  {events.map((event) => {
                    const pet = petById(event.petId);
                    const device = deviceById(event.deviceId);
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedId(event.id)}
                        className="flex w-full items-center gap-3 rounded-[18px] bg-[var(--pl-canvas-soft)] p-2.5 text-left"
                      >
                        <DeviceThumb
                          src={event.thumbnail}
                          alt={event.note}
                          className="h-[56px] w-[56px] shrink-0 rounded-[14px]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Badge tone={event.kind === "motion" ? "info" : "warning"}>
                              {EVENT_KIND_LABEL[event.kind]}
                            </Badge>
                            {!event.reviewed && <Badge tone="negative">미확인</Badge>}
                          </div>
                          <p className="mt-1 truncate text-[13.5px] font-semibold text-[var(--pl-ink)]">
                            {pet?.name ?? "미지정"} | {device?.name ?? "알 수 없는 기기"}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[var(--pl-mute)]">
                            {timeOnly(event.occurredAt)} | {durationLabel(event.durationSec)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 이벤트 상세 오버레이 */}
      {selectedEvent && (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-[320px] overflow-hidden rounded-[24px] bg-[var(--pl-canvas)]">
            <div className="relative h-[200px] w-full bg-[var(--pl-canvas-strong)]">
              <DeviceThumb src={selectedEvent.thumbnail} alt={selectedEvent.note} className="h-full w-full" />
              <button
                type="button"
                onClick={closeModal}
                aria-label="닫기"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(32,26,20,.72)] text-white"
              >
                <X size={16} weight="bold" />
              </button>
              <div className="absolute left-3 top-3 flex items-center gap-1.5">
                <Badge tone={selectedEvent.kind === "motion" ? "info" : "warning"}>
                  {EVENT_KIND_LABEL[selectedEvent.kind]}
                </Badge>
                {!selectedEvent.reviewed && <Badge tone="negative">미확인</Badge>}
              </div>
            </div>

            <div className="p-5">
              <p className="text-[13.5px] font-semibold text-[var(--pl-ink)]">
                {selectedPet?.name ?? "미지정"} | {selectedDevice?.name ?? "알 수 없는 기기"}
              </p>
              <p className="mt-1 text-[12px] text-[var(--pl-mute)]">
                {dateTime(selectedEvent.occurredAt)} | {durationLabel(selectedEvent.durationSec)}
              </p>
              <p className="mt-3 text-[14px] leading-[20px] text-[var(--pl-body)]">{selectedEvent.note}</p>

              <div className="mt-4">
                <Button
                  variant="primary"
                  full
                  icon={<Play size={16} weight="fill" />}
                  onClick={() => setPlaying(true)}
                  disabled={playing}
                >
                  다시보기
                </Button>
              </div>
              {playing && (
                <p className="mt-3 text-center text-[12.5px] font-medium text-[var(--pl-accent-active)]">
                  재생 중이에요 (프로토타입)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
