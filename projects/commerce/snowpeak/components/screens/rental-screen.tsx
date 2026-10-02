"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, ShoppingCartSimple } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  BottomSheet,
  Chip,
  PhotoTile,
  PriceTag,
  PrimaryButton,
  SelectField,
  Stepper,
} from "@/projects/commerce/snowpeak/components/ui";
import { RENTAL_GEAR, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItem, RentalGear, RentalGearCategory } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

type CategoryFilter = "전체" | RentalGearCategory;

const CATEGORIES: RentalGearCategory[] = ["스키", "보드", "부츠", "헬멧", "웨어"];

/** 상단 히어로 배너 — 안개 낀 침엽수림(id 925)이 스키 리조트로 안 읽힌다는 피드백에 따라
 *  리프트/슬로프가 뚜렷한 사진으로 교체. */
const RENTAL_HERO_PHOTO =
  "https://images.pexels.com/photos/937692/pexels-photo-937692.jpeg?auto=compress&cs=tinysrgb&w=1200";

/** 렌탈 장비 카드 사진 재정의 — 기존 mock-data의 picsum 사진(숲/설산 풍경)은 장비 자체를
 *  전혀 보여주지 못한다는 피드백에 따라, 실제 장비가 보이는 Pexels 사진으로 교체.
 *  design.md 사진 매핑 참고. */
const GEAR_PHOTO: Record<string, string> = {
  "rental-ski-all": "https://images.pexels.com/photos/10692419/pexels-photo-10692419.jpeg?auto=compress&cs=tinysrgb&w=800",
  "rental-board-park": "https://images.pexels.com/photos/6141665/pexels-photo-6141665.jpeg?auto=compress&cs=tinysrgb&w=800",
  "rental-boots": "https://images.pexels.com/photos/20146487/pexels-photo-20146487.jpeg?auto=compress&cs=tinysrgb&w=800",
  "rental-helmet": "https://images.pexels.com/photos/6699212/pexels-photo-6699212.jpeg?auto=compress&cs=tinysrgb&w=800",
  "rental-wear": "https://images.pexels.com/photos/14653036/pexels-photo-14653036.jpeg?auto=compress&cs=tinysrgb&w=800",
};

export function RentalScreen({
  onNavigate,
  onAddToCart,
}: {
  onNavigate: NavigateFn;
  onAddToCart: (item: CartItem) => void;
}) {
  const [filter, setFilter] = useState<CategoryFilter>("전체");
  const [activeGear, setActiveGear] = useState<RentalGear | null>(null);
  const [size, setSize] = useState("");
  const [days, setDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [justAddedName, setJustAddedName] = useState<string | null>(null);

  useEffect(() => {
    if (!justAddedName) return;
    const t = setTimeout(() => setJustAddedName(null), 1800);
    return () => clearTimeout(t);
  }, [justAddedName]);

  const filtered = RENTAL_GEAR.filter((gear) => filter === "전체" || gear.category === filter);

  function openSheet(gear: RentalGear) {
    setActiveGear(gear);
    setSize(gear.sizeOptions[0]);
    setDays(1);
    setQuantity(1);
  }

  function closeSheet() {
    setActiveGear(null);
  }

  function handleAdd() {
    if (!activeGear) return;
    onAddToCart({
      cartId: crypto.randomUUID(),
      kind: "rental",
      refId: activeGear.id,
      name: activeGear.name,
      detail: `${size} | ${days}일`,
      size,
      quantity,
      unitPrice: activeGear.pricePerDay * days,
    });
    setJustAddedName(activeGear.name);
    closeSheet();
  }

  const total = activeGear ? activeGear.pricePerDay * days * quantity : 0;

  return (
    <div className="snowpeak relative flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="장비 렌탈" onBack={() => onNavigate("bookHub")} />

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="relative h-[104px] w-full overflow-hidden">
          <PhotoTile src={RENTAL_HERO_PHOTO} alt="리프트 옆 슬로프를 활강하는 스키어, 곤돌라 캐빈이 지나가는 리조트 전경" className="absolute inset-0 h-full w-full" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(19,26,34,0) 20%, rgba(19,26,34,.72) 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-3.5">
            <p className="text-[15px] font-semibold text-white">스키, 보드부터 웨어까지</p>
            <p className="mt-0.5 text-[11.5px] text-white/80">현장 수령, 실시간 재고로 바로 확인</p>
          </div>
        </div>

        <div className="sp-scroll-x flex gap-2 overflow-x-auto px-5 py-4">
          <Chip active={filter === "전체"} onClick={() => setFilter("전체")}>
            전체
          </Chip>
          {CATEGORIES.map((cat) => (
            <Chip key={cat} active={filter === cat} onClick={() => setFilter(cat)}>
              {cat}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-5">
          {filtered.map((gear) => (
            <button
              key={gear.id}
              type="button"
              onClick={() => openSheet(gear)}
              className="flex flex-col items-start text-left transition-transform active:scale-[0.97]"
            >
              <PhotoTile src={GEAR_PHOTO[gear.id]} alt={gear.name} className="h-[132px] w-full rounded-[12px]" sizes="180px" />
              <p className="mt-2.5 text-[13.5px] font-semibold text-[var(--sp-ink)]">{gear.name}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <PriceTag price={gear.pricePerDay} size="sm" />
                <span className="text-[11px] text-[var(--sp-mute)]">/일</span>
              </div>
              <Badge tone="success" className="mt-1.5">
                재고 {gear.stock}개
              </Badge>
            </button>
          ))}
        </div>

        <div className="px-5 pt-6">
          <button
            type="button"
            onClick={() => onNavigate("cart")}
            className="flex w-full items-center justify-between rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 text-[13.5px] font-semibold text-[var(--sp-ink)]">
              <ShoppingCartSimple size={17} weight="bold" className="text-[var(--sp-accent)]" />
              장바구니 보기
            </span>
            <ArrowRight size={15} weight="bold" className="text-[var(--sp-mute)]" />
          </button>
        </div>
      </div>

      {justAddedName && (
        <div className="pointer-events-none absolute inset-x-5 bottom-6 z-30 flex items-center gap-1.5 rounded-full bg-[var(--sp-ink)] px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-lg">
          <Check size={14} weight="bold" className="shrink-0" />
          {justAddedName} 담았어요
        </div>
      )}

      <BottomSheet
        open={activeGear !== null}
        title={activeGear?.name ?? ""}
        onClose={closeSheet}
        footer={activeGear ? <PrimaryButton onClick={handleAdd}>장바구니 담기</PrimaryButton> : undefined}
      >
        {activeGear && (
          <div className="flex flex-col gap-5">
            <PhotoTile src={GEAR_PHOTO[activeGear.id]} alt={activeGear.name} className="h-[140px] w-full rounded-[12px]" />

            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">사이즈 선택</span>
              <SelectField value={size} options={activeGear.sizeOptions} onChange={setSize} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">렌탈 기간</span>
              <div className="flex items-center gap-2">
                <Stepper value={days} onChange={setDays} min={1} max={14} />
                <span className="text-[13px] text-[var(--sp-mute)]">일</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--sp-ink)]">수량</span>
              <Stepper value={quantity} onChange={setQuantity} min={1} max={activeGear.stock} />
            </div>

            <div className="flex items-center justify-between rounded-[12px] bg-[var(--sp-surface-soft)] px-4 py-3.5">
              <span className="text-[13px] text-[var(--sp-body)]">
                {formatWon(activeGear.pricePerDay)}원 × {days}일 × {quantity}개
              </span>
              <span className="sp-num text-[16px] font-semibold text-[var(--sp-ink)]">{formatWon(total)}원</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
