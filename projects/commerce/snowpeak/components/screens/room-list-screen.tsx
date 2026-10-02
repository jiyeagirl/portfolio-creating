"use client";

import { useMemo, useState } from "react";
import {
  Bathtub,
  Car,
  Coffee,
  DoorOpen,
  Fire,
  Mountains,
  PawPrint,
  Waves,
} from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  Card,
  Field,
  PhotoTile,
  PriceTag,
  SectionHead,
  Stepper,
  inputClass,
} from "@/projects/commerce/snowpeak/components/ui";
import { ROOMS, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { RoomAmenity } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

/** 객실 카드 대표 사진 재정의 — Lorem Picsum의 풍경/호수/고성 사진이 "빈 배경"으로 보인다는
 *  피드백에 따라, 실제 스키 리조트 슬로프/리프트/베이스 구역이 뚜렷이 보이는 Pexels 사진으로 교체.
 *  design.md 사진 매핑 참고. */
const ROOM_PHOTO: Record<string, string> = {
  "room-deluxe-mtn": "https://images.pexels.com/photos/30018600/pexels-photo-30018600.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "room-suite-lake": "https://images.pexels.com/photos/19771980/pexels-photo-19771980.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "room-premier": "https://images.pexels.com/photos/21235823/pexels-photo-21235823.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "room-ondol-family": "https://images.pexels.com/photos/35923083/pexels-photo-35923083.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const AMENITY_ICON: Record<RoomAmenity, typeof Mountains> = {
  마운틴뷰: Mountains,
  레이크뷰: Waves,
  발코니: DoorOpen,
  월풀: Bathtub,
  벽난로: Fire,
  조식포함: Coffee,
  무료주차: Car,
  반려동물동반: PawPrint,
};

export function RoomListScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [checkIn, setCheckIn] = useState("2023-12-24");
  const [checkOut, setCheckOut] = useState("2023-12-26");
  const [adult, setAdult] = useState(2);
  const [child, setChild] = useState(0);

  const nights = useMemo(() => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="객실" onBack={() => onNavigate("bookHub")} />

      <div className="flex-1 overflow-y-auto pb-10">
        {/* 날짜 / 인원 선택 */}
        <div className="px-5 pt-4">
          <Card>
            <div className="grid grid-cols-2 gap-3">
              <Field label="체크인">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={`${inputClass} sp-num`}
                />
              </Field>
              <Field label="체크아웃">
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`${inputClass} sp-num`}
                />
              </Field>
            </div>
            <p className="sp-num mt-2 text-[12px] text-[var(--sp-mute)]">{nights}박 일정</p>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--sp-border)] pt-4">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">성인</span>
              <Stepper value={adult} onChange={setAdult} min={1} max={6} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">소아</span>
              <Stepper value={child} onChange={setChild} min={0} max={4} />
            </div>
          </Card>
        </div>

        {/* 객실 목록 */}
        <div className="mt-6">
          <SectionHead title="예약 가능한 객실" note={`${ROOMS.length}개 객실`} />

          <div className="flex flex-col gap-4 px-5">
            {ROOMS.map((room) => {
              const lowStock = room.stock < 3;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => onNavigate("roomDetail", room.id)}
                  className="text-left transition-transform active:scale-[0.98]"
                >
                  <Card padded={false} className="overflow-hidden">
                    <div className="relative">
                      <PhotoTile
                        src={ROOM_PHOTO[room.id]}
                        alt={`${room.name} 인근 슬로프와 리프트가 보이는 리조트 전경`}
                        className="h-[168px] w-full"
                      />
                      <span className="absolute left-3 top-3">
                        <Badge tone={lowStock ? "warn" : "success"}>
                          {lowStock ? "마감임박" : "실시간 예약 가능"}
                        </Badge>
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">
                            {room.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-1 text-[12.5px] text-[var(--sp-mute)]">{room.tagline}</p>
                        </div>
                        <span className="sp-num shrink-0 text-[12px] font-semibold text-[var(--sp-mute)]">
                          잔여 {room.stock}실
                        </span>
                      </div>

                      <p className="sp-num mt-2 text-[12.5px] text-[var(--sp-body)]">
                        {room.bedType} | 성인 {room.maxAdult}인 | 소아 {room.maxChild}인 | {room.sizeSqm}m²
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {room.amenities.map((amenity) => {
                          const Icon = AMENITY_ICON[amenity];
                          return (
                            <span
                              key={amenity}
                              className="inline-flex items-center gap-1 rounded-full bg-[var(--sp-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--sp-body)]"
                            >
                              <Icon size={12} weight="bold" />
                              {amenity}
                            </span>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex items-end justify-between border-t border-[var(--sp-border)] pt-3">
                        <PriceTag price={room.basePrice} suffix="원 / 1박" size="sm" />
                        <span className="sp-num text-[11.5px] text-[var(--sp-mute)]">
                          {nights}박 {formatWon(room.basePrice * nights)}원
                        </span>
                      </div>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
