"use client";

import { ArrowRight, ArrowsClockwise } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { bestSellers, mostReviewed, newArrivals, products } from "@/projects/commerce/verve/lib/mock-data";
import { Button, Divider, PriceTag, RatingStars, SectionHeading } from "@/projects/commerce/verve/components/ui";

const CATEGORY_ORDER = ["러닝", "트레이닝", "요가", "아우터"] as const;

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const feature = bestSellers[0];
  const rest = bestSellers.slice(1, 4);
  const categoryTiles = CATEGORY_ORDER.map((category) => ({
    category,
    product: products.find((p) => p.category === category)!,
  }));

  return (
    <div>
      {/* 1. 히어로 — 풀블리드 시네마틱, 비대칭 좌측 텍스트 */}
      <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
        <img src="https://picsum.photos/id/770/1600/2000" alt="점프하는 러너 실루엣" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
        <div className="relative z-10 w-full px-4 pb-16 md:px-8 md:pb-24">
          <div className="mx-auto max-w-[1280px]">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[16ch] text-[40px] font-medium leading-[1.05] tracking-[-0.9px] text-white md:text-[64px]"
            >
              보는 것과 맞는 것, 동시에 해결하다
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-white/70"
            >
              360° 뷰어로 실제 핏을 확인하고, AI 사이즈 추천으로 내 몸에 맞는 사이즈를 찾으세요.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button onClick={() => onNavigate("shop")}>지금 쇼핑하기</Button>
              <Button variant="outline" onClick={() => onNavigate("sizeRecommendation")}>
                AI 사이즈 추천 받기
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. 사이즈 추천 CTA 밴드 — livery-band, 히어로 바로 아래 우선 유도 */}
      <section className="bg-[var(--v-primary)] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-[20ch] text-[28px] font-medium leading-tight tracking-[-0.4px] text-white md:text-[36px]">
            키와 몸무게만 입력하면, AI가 맞는 사이즈를 찾아드려요
          </h2>
          <Button variant="outline" tone="dark" className="border-white text-white hover:bg-white/10 shrink-0" onClick={() => onNavigate("sizeRecommendation")}>
            30초만에 시작하기
          </Button>
        </div>
      </section>

      {/* 3. 카테고리 바로가기 — 비대칭 벤토 */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading title="카테고리" />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {categoryTiles.map((tile) => (
              <button
                key={tile.category}
                type="button"
                onClick={() => onNavigate("shop")}
                className="group relative aspect-[3/4] overflow-hidden bg-[var(--v-canvas-light)]"
              >
                <img
                  src={tile.product.gallery[0]}
                  alt={`${tile.category} 카테고리 대표 상품 ${tile.product.name}`}
                  className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-[var(--v-ink)] px-4 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.4px] text-[var(--v-canvas)]">
                  {tile.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Divider className="mx-4 md:mx-8" />

      {/* 4. NEW ARRIVALS — 가로 스크롤 스냅 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <SectionHeading title="새로 나온 상품" />
        </div>
        <div className="mt-10 flex gap-4 overflow-x-auto px-4 pb-4 md:px-8 [scrollbar-width:none]">
          {newArrivals.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onNavigate("productDetail", p.id)}
              className="w-[220px] shrink-0 snap-start text-left md:w-[280px]"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[var(--v-canvas-elevated)]">
                <img src={p.gallery[0]} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 text-[13px] text-[var(--v-body)]">{p.category}</p>
              <p className="text-[15px] font-medium text-[var(--v-ink)]">{p.name}</p>
              <div className="mt-1">
                <PriceTag price={p.price} originalPrice={p.originalPrice} size="sm" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. BEST 상품 — 비대칭 (피처 1 + 3) */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading title="가장 많이 찾는 상품" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {feature && (
              <button type="button" onClick={() => onNavigate("productDetail", feature.id)} className="group text-left">
                <div className="aspect-[4/5] overflow-hidden bg-[var(--v-canvas-elevated)]">
                  <img src={feature.gallery[0]} alt={feature.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <p className="text-[18px] font-medium text-[var(--v-ink)]">{feature.name}</p>
                    <div className="mt-1"><RatingStars rating={feature.rating} /></div>
                  </div>
                  <PriceTag price={feature.price} originalPrice={feature.originalPrice} />
                </div>
              </button>
            )}
            <div className="grid grid-cols-2 gap-4">
              {rest.map((p) => (
                <button key={p.id} type="button" onClick={() => onNavigate("productDetail", p.id)} className="group text-left">
                  <div className="aspect-square overflow-hidden bg-[var(--v-canvas-elevated)]">
                    <img src={p.gallery[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-[13px] font-medium text-[var(--v-ink)] line-clamp-1">{p.name}</p>
                  <div className="mt-1"><PriceTag price={p.price} size="sm" /></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 이벤트 배너 */}
      <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28">
        <img src="https://picsum.photos/id/1011/1600/700" alt="카누 위 액티브웨어" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-[1280px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-white/70">여름 시즌 이벤트</p>
          <h2 className="mt-3 text-[26px] font-medium tracking-[-0.3px] text-white md:text-[36px]">신규 회원 첫 구매 15% 할인</h2>
          <div className="mt-8">
            <Button onClick={() => onNavigate("signup")}>회원가입하고 받기</Button>
          </div>
        </div>
      </section>

      {/* 7. 360 뷰어 체험 배너 */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden bg-[var(--v-canvas-light)]">
            <img src={products[0].spin360[1]} alt="에어리 메시 런닝 티 360도 뷰어 미리보기" className="h-full w-full object-contain p-8" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-black/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.65px] text-white">
              <ArrowsClockwise size={14} />
              360° 뷰
            </div>
          </div>
          <div>
            <h2 className="text-[26px] font-medium leading-tight tracking-[-0.3px] text-[var(--v-ink)] md:text-[36px]">
              한 장의 정면 사진으로는 알 수 없는 핏
            </h2>
            <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-[var(--v-body)]">
              에어리 메시 런닝 티는 정면, 측면, 후면을 360도로 돌려보며 실루엣을 확인할 수 있어요.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("productDetail", products[0].id)}
              className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.65px] text-[var(--v-ink)] hover:text-[var(--v-primary)] transition-colors"
            >
              360° 뷰어 체험하기 <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <Divider className="mx-4 md:mx-8" />

      {/* 8. 리뷰 많은 상품 */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading title="리뷰가 가장 많은 상품" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {mostReviewed.map((p) => (
              <button key={p.id} type="button" onClick={() => onNavigate("productDetail", p.id)} className="text-left">
                <div className="aspect-[3/4] overflow-hidden bg-[var(--v-canvas-elevated)]">
                  <img src={p.gallery[0]} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-[13px] font-medium text-[var(--v-ink)] line-clamp-1">{p.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <RatingStars rating={p.rating} showValue={false} />
                  <span className="text-[11px] text-[var(--v-body)]">리뷰 {p.reviewCount}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 브랜드 스토리 티저 */}
      <section className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32">
        <img src="https://picsum.photos/id/685/1600/900" alt="구름 위에 앉은 러너" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-[1280px] text-center">
          <h2 className="mx-auto max-w-[18ch] text-[26px] font-medium leading-tight tracking-[-0.3px] text-white md:text-[36px]">
            우리는 몸에 맞지 않는 옷이 운동을 그만두게 만든다고 믿습니다
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("brand")}
            className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.65px] text-white hover:text-[var(--v-primary)] transition-colors"
          >
            브랜드 스토리 보기 <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
