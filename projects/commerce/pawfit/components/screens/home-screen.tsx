"use client";

import Image from "next/image";
import {
  ArrowRight,
  Drop,
  MagnifyingGlass,
  PawPrint,
  Plus,
  SneakerMove,
  Sparkle,
  TShirt,
  Wind,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";
import type { ProductCategory } from "@/projects/commerce/pawfit/lib/types";
import { CURRENT_USER, PETS, PET_ASSETS, PRODUCTS } from "@/projects/commerce/pawfit/lib/mock-data";
import { PetAvatar, PriceTag, ProductTile, SectionHead, Stars } from "@/projects/commerce/pawfit/components/ui";

/* 한글 이름 뒤에 붙는 조사(를/을) 판별. 종성이 있으면 "을", 없으면 "를". */
function withReul(name: string): string {
  const lastChar = name.at(-1) ?? "";
  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return `${name}를`;
  const hasBatchim = code % 28 !== 0;
  return hasBatchim ? `${name}을` : `${name}를`;
}

const CATEGORIES: { key: ProductCategory; icon: typeof TShirt }[] = [
  { key: "니트", icon: TShirt },
  { key: "레인코트", icon: Wind },
  { key: "하네스", icon: PawPrint },
  { key: "반다나", icon: Sparkle },
  { key: "부츠", icon: SneakerMove },
  { key: "잠옷", icon: Drop },
];

function ProductCard({
  product,
  onNavigate,
}: {
  product: (typeof PRODUCTS)[number];
  onNavigate: NavigateFn;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate("productDetail", product.id)}
      className="flex w-[142px] shrink-0 flex-col items-start text-left"
    >
      <ProductTile
        category={product.category}
        tint={product.brandTint}
        colorways={product.colorways}
        image={product.image}
        alt={product.name}
        size={142}
      />
      <p className="mt-2.5 line-clamp-1 text-[13.5px] font-normal text-[var(--pf-ink)]">{product.name}</p>
      <div className="mt-1">
        <PriceTag price={product.price} listPrice={product.listPrice} size="sm" />
      </div>
      <div className="mt-1 flex items-center gap-1">
        <Stars rating={product.rating} size={10} />
        <span className="pf-num text-[11px] text-[var(--pf-muted)]">({product.reviewCount})</span>
      </div>
    </button>
  );
}

export function HomeScreen({
  selectedPetId,
  onSelectPet,
  onNavigate,
}: {
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onNavigate: NavigateFn;
}) {
  const selectedPet = PETS.find((p) => p.id === selectedPetId) ?? PETS[0];
  const popularProducts = PRODUCTS.filter((p) => p.isPopular);
  const recommendedProducts = PRODUCTS.filter((p) => p.recommendedFor.includes(selectedPet.species)).slice(0, 6);
  // 목업: 실제 조회 이력을 추적하지 않고, "최근 본 상품"처럼 보이도록 임의로 고른 상품 4개.
  const recentlyViewed = [PRODUCTS[2], PRODUCTS[6], PRODUCTS[9], PRODUCTS[10]];

  return (
    <div className="pf-enter pb-10">
      <header className="px-5 pb-3 pt-[63px]">
        <p className="text-[12.5px] font-semibold text-[var(--pf-muted)]">
          {CURRENT_USER.name}님, 안녕하세요
        </p>
        <h1 className="mt-1 text-[21px] font-medium leading-tight tracking-[-0.02em]">
          오늘도 산책하기 좋은 날이에요
        </h1>
      </header>

      <div className="px-5">
        <button
          type="button"
          onClick={() => onNavigate("productList")}
          className="flex w-full items-center gap-2.5 rounded-[12px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] px-4 py-3 text-left"
        >
          <MagnifyingGlass size={17} className="text-[var(--pf-muted)]" />
          <span className="text-[13.5px] text-[var(--pf-muted)]">니트, 하네스, 반다나 검색</span>
        </button>
      </div>

      <div className="mt-4 px-5">
        <div className="relative h-[220px] w-full overflow-hidden rounded-[24px]">
          <Image
            src={PET_ASSETS.heroDalmatianRun}
            alt="가을 숲길을 달리는 달마시안"
            fill
            placeholder="blur"
            className="object-cover"
            sizes="393px"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[var(--pf-ink)]/75 px-5 py-4">
            <h2 className="text-[18px] font-medium leading-snug tracking-[-0.02em] text-white">
              매일의 산책이 즐거워지는 옷
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("productList")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-[12px] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--pf-ink)] transition-transform active:scale-[0.97]"
            >
              구경하러 가기
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <div className="pf-scroll-x flex gap-2.5 overflow-x-auto px-5">
          {PETS.map((pet) => {
            const active = pet.id === selectedPetId;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => onSelectPet(pet.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 transition-colors ${
                  active
                    ? "border-[var(--pf-ink)] bg-[var(--pf-surface-card)]"
                    : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)]"
                }`}
              >
                <PetAvatar pet={pet} size={30} />
                <span className={`text-[13px] font-semibold ${active ? "text-[var(--pf-ink)]" : "text-[var(--pf-muted)]"}`}>
                  {pet.name}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onNavigate("petProfile")}
            aria-label="반려동물 등록하기"
            className="flex shrink-0 items-center gap-2 rounded-full border border-dashed border-[var(--pf-hairline)] px-4 py-1.5 text-[13px] font-semibold text-[var(--pf-muted)]"
          >
            <Plus size={14} weight="bold" />
            등록
          </button>
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="grid grid-cols-6 gap-2">
          {CATEGORIES.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate("productList", key)}
              className="flex flex-col items-center gap-1.5 rounded-[16px] py-2 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-ink)]">
                <Icon size={19} weight="duotone" />
              </span>
              <span className="text-[11px] font-normal text-[var(--pf-body)]">{key}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead title="인기 상품" note="지금 가장 많이 찾는 아이템" action="더보기" onAction={() => onNavigate("productList")} />
        <div className="pf-scroll-x flex gap-3.5 overflow-x-auto px-5">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead
          title={`${withReul(selectedPet.name)} 위한 추천`}
          note={`${selectedPet.breed} 체형에 잘 맞는 상품이에요`}
          action="더보기"
          onAction={() => onNavigate("productList")}
        />
        <div className="pf-scroll-x flex gap-3.5 overflow-x-auto px-5">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHead title="최근 본 상품" />
        <div className="pf-scroll-x flex gap-3.5 overflow-x-auto px-5">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
}
