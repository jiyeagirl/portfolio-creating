"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { bestSellers, formatPrice } from "@/projects/commerce/shoppingmall/lib/products";

export function BestSeller() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  function toggleLike(id: string) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="best-seller" className="mx-auto max-w-[1400px] px-6 py-16 sm:py-20 lg:px-10">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
          베스트셀러
        </h2>
        <p className="max-w-[50ch] text-[15px] leading-relaxed text-muted">
          지난 30일간 가장 많이 판매된 아이템입니다. 매주 월요일 순위가
          업데이트됩니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-5">
        {bestSellers.map((product, index) => (
          <motion.div
            key={product.id}
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <span className="absolute left-3 top-3 z-10 text-[22px] font-semibold leading-none text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]">
                {String(product.rank).padStart(2, "0")}
              </span>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 16vw, 45vw"
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
        ))}
      </div>
    </section>
  );
}
