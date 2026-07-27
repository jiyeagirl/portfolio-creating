"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { products, formatPrice, type Product } from "@/projects/commerce/shoppingmall/lib/products";

const TABS = [
  { key: "all", label: "전체" },
  { key: "new", label: "신상품" },
  { key: "popular", label: "인기" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function sortProducts(list: Product[], tab: TabKey) {
  if (tab === "new") return list.filter((p) => p.isNew);
  if (tab === "popular")
    return [...list].sort((a, b) => b.reviewCount - a.reviewCount);
  return list;
}

export function ProductList() {
  const [tab, setTab] = useState<TabKey>("all");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  const visible = useMemo(() => sortProducts(products, tab), [tab]);

  function toggleLike(id: string) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="products" className="mx-auto max-w-[1400px] px-6 py-16 sm:py-20 lg:px-10">
      <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            전체 상품
          </h2>
          <p className="max-w-[50ch] text-[15px] leading-relaxed text-muted">
            총 128개 상품 중 이번 시즌 신상 16종을 소개합니다.
          </p>
        </div>
        <div className="flex gap-1 border-b border-border sm:border-none">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-[14px] font-medium transition-colors ${
                tab === t.key
                  ? "border-b-2 border-foreground text-foreground"
                  : "border-b-2 border-transparent text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {visible.map((product, index) => {
          const discount = product.originalPrice
            ? Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100,
              )
            : null;
          return (
            <motion.div
              key={product.id}
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                  {product.isNew && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wide text-black">
                      NEW
                    </span>
                  )}
                  {discount && (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent-foreground">
                      -{discount}%
                    </span>
                  )}
                </div>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 23vw, 45vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => toggleLike(product.id)}
                  aria-pressed={!!liked[product.id]}
                  aria-label="위시리스트에 추가"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform active:scale-90"
                >
                  <Heart
                    size={16}
                    weight={liked[product.id] ? "fill" : "regular"}
                    className={liked[product.id] ? "text-accent" : "text-black/70"}
                  />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[12px] text-muted">{product.category}</p>
                <p className="text-[14px] font-medium leading-snug">{product.name}</p>
                <div className="flex items-baseline gap-2">
                  {product.originalPrice && (
                    <span className="text-[12px] text-muted line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[14px] font-semibold">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
