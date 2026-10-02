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
import { Toggle } from "@/components/shared/toggle";
import {
  AppBar,
  PhotoTile,
  PriceTag,
  PrimaryButton,
  SectionHead,
  Stars,
  Stepper,
} from "@/projects/commerce/snowpeak/components/ui";
import { ROOMS, ROOM_OPTION_ADDONS, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItem, RoomAmenity } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

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

const MOCK_CHECK_IN = "2023-12-24";
const MOCK_CHECK_OUT = "2023-12-26";
const NIGHTS = 2;

export function RoomDetailScreen({
  roomId,
  onNavigate,
  onAddToCart,
}: {
  roomId: string;
  onNavigate: NavigateFn;
  onAddToCart: (item: CartItem) => void;
}) {
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

  const [adult, setAdult] = useState(Math.min(2, room.maxAdult));
  const [child, setChild] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  const addonTotal = useMemo(() => {
    return ROOM_OPTION_ADDONS.reduce((sum, addon) => {
      if (!selectedAddons[addon.id]) return sum;
      return sum + (addon.unit === "1박" ? addon.price * NIGHTS : addon.price);
    }, 0);
  }, [selectedAddons]);

  const roomTotal = room.basePrice * NIGHTS;
  const grandTotal = roomTotal + addonTotal;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleReserve() {
    const detail = `${MOCK_CHECK_IN} ~ ${MOCK_CHECK_OUT}, ${NIGHTS}박, 성인 ${adult}인, 소아 ${child}인`;
    const item: CartItem = {
      cartId: `cart-${room.id}-${crypto.randomUUID()}`,
      kind: "room",
      refId: room.id,
      name: room.name,
      detail,
      checkIn: MOCK_CHECK_IN,
      checkOut: MOCK_CHECK_OUT,
      quantity: 1,
      unitPrice: grandTotal,
    };
    onAddToCart(item);
    onNavigate("cart");
  }

  return (
    <div className="snowpeak relative flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title={room.name} onBack={() => onNavigate("roomList")} />

      <div className="flex-1 overflow-y-auto pb-[168px]">
        {/* 갤러리 */}
        <div className="sp-scroll-x flex snap-x snap-mandatory gap-0 overflow-x-auto">
          {room.galleryPhotos.map((photoId, i) => (
            <PhotoTile
              key={`${photoId}-${i}`}
              id={photoId}
              alt={`${room.name} 사진 ${i + 1}`}
              className="h-[280px] w-full shrink-0 snap-center"
            />
          ))}
        </div>

        {/* 이름 / 평점 / 가격 */}
        <div className="px-5 pt-5">
          <p className="text-[12.5px] font-semibold text-[var(--sp-accent)]">{room.bedType}</p>
          <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[var(--sp-ink)]">{room.name}</h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--sp-body)]">{room.tagline}</p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <Stars rating={room.rating} size={13} />
            <span className="sp-num text-[12.5px] text-[var(--sp-mute)]">
              {room.rating} ({room.reviewCount})
            </span>
          </div>
          <div className="mt-3">
            <PriceTag price={room.basePrice} suffix="원 / 1박" size="lg" />
          </div>
        </div>

        {/* 시설 정보 */}
        <div className="mt-7">
          <SectionHead title="시설 정보" />
          <div className="flex flex-wrap gap-1.5 px-5">
            {room.amenities.map((amenity) => {
              const Icon = AMENITY_ICON[amenity];
              return (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sp-surface-soft)] px-3 py-1.5 text-[12px] font-medium text-[var(--sp-body)]"
                >
                  <Icon size={13} weight="bold" />
                  {amenity}
                </span>
              );
            })}
          </div>

          <div className="mx-5 mt-3 overflow-hidden rounded-[16px] border border-[var(--sp-border)]">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-[var(--sp-mute)]">침대 타입</span>
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">{room.bedType}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--sp-border)] px-4 py-3">
              <span className="text-[13px] text-[var(--sp-mute)]">객실 크기</span>
              <span className="sp-num text-[13px] font-semibold text-[var(--sp-ink)]">{room.sizeSqm}m²</span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--sp-border)] px-4 py-3">
              <span className="text-[13px] text-[var(--sp-mute)]">최대 인원</span>
              <span className="sp-num text-[13px] font-semibold text-[var(--sp-ink)]">
                성인 {room.maxAdult}인, 소아 {room.maxChild}인
              </span>
            </div>
          </div>

          <p className="mt-4 px-5 text-[13.5px] leading-relaxed text-[var(--sp-body)]">{room.description}</p>
        </div>

        {/* 옵션 추가 선택 */}
        <div className="mt-7">
          <SectionHead title="옵션 추가 선택" note="필요한 옵션을 선택해 주세요" />
          <div className="mx-5 overflow-hidden rounded-[16px] border border-[var(--sp-border)]">
            {ROOM_OPTION_ADDONS.map((addon, i) => (
              <div
                key={addon.id}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i !== 0 ? "border-t border-[var(--sp-border)]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-[var(--sp-ink)]">{addon.label}</p>
                  <p className="sp-num mt-0.5 text-[12px] text-[var(--sp-mute)]">
                    {formatWon(addon.price)}원 / {addon.unit}
                  </p>
                </div>
                <Toggle
                  checked={!!selectedAddons[addon.id]}
                  onChange={() => toggleAddon(addon.id)}
                  label={`${addon.label} 선택`}
                  size="sm"
                  onClassName="bg-[var(--sp-accent)]"
                  offClassName="bg-[var(--sp-surface-soft)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 인원 선택 */}
        <div className="mt-7">
          <SectionHead title="인원 선택" note={`객실 기준 최대 성인 ${room.maxAdult}인, 소아 ${room.maxChild}인`} />
          <div className="mx-5 rounded-[16px] border border-[var(--sp-border)] px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">성인</span>
              <Stepper value={adult} onChange={setAdult} min={1} max={room.maxAdult} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">소아</span>
              <Stepper value={child} onChange={setChild} min={0} max={room.maxChild} />
            </div>
          </div>
        </div>

        {/* 실시간 요금 확인 */}
        <div className="mt-7">
          <SectionHead title="실시간 요금 확인" />
          <div className="mx-5 rounded-[16px] bg-[var(--sp-surface-soft)] p-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[var(--sp-body)]">
                객실 요금 ({NIGHTS}박)
              </span>
              <span className="sp-num font-semibold text-[var(--sp-ink)]">{formatWon(roomTotal)}원</span>
            </div>
            {addonTotal > 0 && (
              <div className="mt-2 flex items-center justify-between text-[13px]">
                <span className="text-[var(--sp-body)]">옵션 추가</span>
                <span className="sp-num font-semibold text-[var(--sp-ink)]">{formatWon(addonTotal)}원</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--sp-border-strong)] pt-3">
              <span className="text-[14px] font-semibold text-[var(--sp-ink)]">총 결제 금액</span>
              <PriceTag price={grandTotal} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 예약 바 */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 pb-8 pt-3.5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[11.5px] text-[var(--sp-mute)]">
              {MOCK_CHECK_IN} ~ {MOCK_CHECK_OUT} | {NIGHTS}박
            </p>
            <p className="sp-num mt-0.5 text-[19px] font-semibold text-[var(--sp-ink)]">
              {formatWon(grandTotal)}원
            </p>
          </div>
        </div>
        <PrimaryButton onClick={handleReserve}>예약하기</PrimaryButton>
      </div>
    </div>
  );
}
