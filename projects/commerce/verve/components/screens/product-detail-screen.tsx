"use client";

import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowsClockwise, CaretDown, Heart, Link as LinkIcon, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { currentUser, findProduct, recommendSize, reviewsFor } from "@/projects/commerce/verve/lib/mock-data";
import type { Product, SizeLabel } from "@/projects/commerce/verve/lib/types";
import { Button, Divider, PriceTag, QuantityStepper, RatingStars, SpecCell } from "@/projects/commerce/verve/components/ui";

type ViewMode = "gallery" | "spin";

export function ProductDetailScreen({
  productId,
  onNavigate,
  onAddToCart,
}: {
  productId: string;
  onNavigate: NavigateFn;
  onAddToCart: (product: Product, color: string, size: SizeLabel, quantity: number) => void;
}) {
  const product = findProduct(productId);

  const [mode, setMode] = useState<ViewMode>("gallery");
  const [activeImage, setActiveImage] = useState(0);
  const [spinFrame, setSpinFrame] = useState(0);
  const [color, setColor] = useState(product?.colors[0]?.name ?? "");
  const [size, setSize] = useState<SizeLabel | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  const sizeResult = useMemo(
    () =>
      recommendSize({
        gender: currentUser.gender,
        heightCm: currentUser.heightCm,
        weightKg: currentUser.weightKg,
        workoutPurpose: product?.workoutTypes[0] ?? "일상 착용",
        preferredFit: currentUser.preferredFit,
      }),
    [product],
  );

  if (!product) {
    return (
      <div className="verve-light flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[18px] font-medium text-[var(--v-body-on-light)]">상품을 찾을 수 없어요</p>
        <Button tone="light" onClick={() => onNavigate("shop")}>쇼핑 계속하기</Button>
      </div>
    );
  }

  // 실제 정면/측면/후면 사진이 다 있는 상품만 360 뷰어를 노출한다.
  // 사진이 1장뿐인 상품에서 토글만 보여주면 눌러도 아무 일도 안 일어나
  // "기능이 없다"는 인상을 준다 — 그 실패를 반복하지 않는다.
  const hasSpin = product.spin360.length > 1;
  const effectiveMode = hasSpin ? mode : "gallery";
  const productReviews = reviewsFor(product.id).slice(0, 2);

  const handleSpinStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const lastFrame = spinFrame;
    const move = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const framesMoved = Math.round(delta / 40);
      const next = ((lastFrame - framesMoved) % product.spin360.length + product.spin360.length) % product.spin360.length;
      setSpinFrame(next);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const handleShare = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const selectedStock = size ? product.sizes.find((s) => s.size === size)?.stock ?? 0 : null;

  return (
    <div>
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* 갤러리 / 360 뷰어 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode("gallery")}
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.65px] ${effectiveMode === "gallery" ? "bg-[var(--v-ink)] text-[var(--v-canvas)]" : "border border-[var(--v-hairline)] text-[var(--v-body)]"}`}
              >
                갤러리
              </button>
              {hasSpin && (
                <button
                  type="button"
                  onClick={() => setMode("spin")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.65px] ${effectiveMode === "spin" ? "bg-[var(--v-ink)] text-[var(--v-canvas)]" : "border border-[var(--v-hairline)] text-[var(--v-body)]"}`}
                >
                  <ArrowsClockwise size={13} /> 360°
                </button>
              )}
            </div>

            {effectiveMode === "gallery" ? (
              <>
                <button type="button" onClick={() => setZoomOpen(true)} className="block aspect-[4/5] w-full overflow-hidden bg-[var(--v-canvas-light)]">
                  <img src={product.gallery[activeImage]} alt={product.name} className="h-full w-full object-contain" />
                </button>
                <div className="mt-3 flex gap-2">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden border bg-[var(--v-canvas-light)] ${activeImage === i ? "border-[var(--v-primary)]" : "border-[var(--v-hairline)]"}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div
                  onPointerDown={handleSpinStart}
                  className="relative aspect-[4/5] w-full cursor-grab select-none overflow-hidden bg-[var(--v-canvas-light)] active:cursor-grabbing"
                >
                  <img
                    src={product.spin360[spinFrame]}
                    alt={`${product.name} 360도 뷰 ${spinFrame + 1}/${product.spin360.length}`}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.4px] text-white">
                    <ArrowsClockwise size={13} /> 드래그해서 회전
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {product.spin360.map((_, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === spinFrame ? "bg-[var(--v-primary)]" : "bg-[var(--v-hairline)]"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div>
            <p className="text-[12px] text-[var(--v-body)]">{product.category}</p>
            <h1 className="mt-1 text-[26px] font-medium tracking-[-0.3px] text-[var(--v-ink)]">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} />
              <button type="button" onClick={() => onNavigate("reviews", product.id)} className="text-[12px] text-[var(--v-body)] underline underline-offset-4">
                리뷰 {product.reviewCount}개
              </button>
            </div>
            <div className="mt-5"><PriceTag price={product.price} originalPrice={product.originalPrice} size="lg" /></div>

            <Divider className="my-6" />

            {/* 색상 */}
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-ink)]">색상 · {color}</p>
              <div className="mt-3 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setColor(c.name)}
                    className={`h-9 w-9 border-2 ${color === c.name ? "border-[var(--v-primary)]" : "border-transparent"}`}
                  >
                    <span className="block h-full w-full border border-[var(--v-hairline)]" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* 사이즈 */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-ink)]">사이즈</p>
                <button type="button" onClick={() => onNavigate("sizeRecommendation")} className="text-[12px] text-[var(--v-primary)] underline underline-offset-4">
                  AI 사이즈 추천
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    disabled={s.stock === 0}
                    onClick={() => setSize(s.size)}
                    className={`h-11 w-14 border text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                      size === s.size ? "border-[var(--v-primary)] bg-[var(--v-primary)] text-white" : "border-[var(--v-hairline)] text-[var(--v-ink)] hover:border-[var(--v-ink)]"
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {selectedStock !== null && selectedStock <= 5 && selectedStock > 0 && (
                <p className="mt-2 text-[12px] text-[var(--v-warning)]">재고 {selectedStock}개 남았어요</p>
              )}
            </div>

            {/* AI 사이즈 추천 결과 인라인 — 핵심 화면의 핵심 구성 */}
            <div className="mt-6 border border-[var(--v-hairline)] bg-[var(--v-canvas-elevated)]/40 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--v-primary)]">AI 사이즈 추천</p>
                <span className="text-[11px] text-[var(--v-body)]">신뢰도 {Math.round(sizeResult.confidence * 100)}%</span>
              </div>
              <div className="mt-4 flex items-center gap-8">
                <SpecCell value={sizeResult.recommendedSize} label="추천 사이즈" accent />
                <p className="max-w-[28ch] text-[13px] leading-relaxed text-[var(--v-body)]">{sizeResult.reasons[0]}</p>
              </div>
              <button
                type="button"
                onClick={() => size !== sizeResult.recommendedSize && setSize(sizeResult.recommendedSize)}
                className="mt-4 text-[12px] font-semibold uppercase tracking-[0.65px] text-[var(--v-ink)] underline underline-offset-4"
              >
                추천 사이즈로 선택하기
              </button>
            </div>

            {/* 수량 + CTA */}
            <div className="mt-6 flex items-center gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <button
                type="button"
                aria-label="찜하기"
                onClick={() => setWishlisted((v) => !v)}
                className="flex h-12 w-12 items-center justify-center border border-[var(--v-hairline)]"
              >
                <Heart size={18} weight={wishlisted ? "fill" : "regular"} className={wishlisted ? "text-[var(--v-primary)]" : "text-[var(--v-ink)]"} />
              </button>
              <div className="relative">
                <button type="button" aria-label="공유" onClick={handleShare} className="flex h-12 w-12 items-center justify-center border border-[var(--v-hairline)]">
                  <LinkIcon size={18} className="text-[var(--v-ink)]" />
                </button>
                {copied && (
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[var(--v-ink)] px-2 py-1 text-[11px] text-[var(--v-canvas)]">
                    링크 복사됨
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                disabled={!size}
                onClick={() => size && onAddToCart(product, color, size, quantity)}
              >
                장바구니
              </Button>
              <Button
                disabled={!size}
                onClick={() => {
                  if (!size) return;
                  onAddToCart(product, color, size, quantity);
                  onNavigate("cart");
                }}
              >
                바로 구매
              </Button>
            </div>

            <Divider className="my-8" />

            {/* 상세 정보 아코디언 */}
            <div className="divide-y divide-[var(--v-hairline)]">
              <AccordionRow
                title="상품 설명"
                open={openSection === "description"}
                onToggle={() => setOpenSection(openSection === "description" ? null : "description")}
              >
                <p className="text-[13px] leading-relaxed text-[var(--v-body)]">{product.description}</p>
                <p className="mt-2 text-[13px] text-[var(--v-body)]">핏 노트: {product.fitNote}</p>
              </AccordionRow>
              <AccordionRow
                title="소재 및 세탁 방법"
                open={openSection === "material"}
                onToggle={() => setOpenSection(openSection === "material" ? null : "material")}
              >
                <p className="text-[13px] text-[var(--v-body)]">{product.material}</p>
                <ul className="mt-2 space-y-1 text-[13px] text-[var(--v-body)]">
                  {product.care.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </AccordionRow>
              <AccordionRow
                title="배송 / 교환 안내"
                open={openSection === "shipping"}
                onToggle={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
              >
                <p className="text-[13px] leading-relaxed text-[var(--v-body)]">
                  결제 완료 후 1-2일 내 출고되며, 출고 후 1-2일 내 도착합니다. 미착용/미세탁 상품에 한해 수령 후 7일 이내 교환 및 반품이 가능합니다.
                </p>
              </AccordionRow>
            </div>

            {productReviews.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-[var(--v-ink)]">구매자 리뷰</p>
                  <button type="button" onClick={() => onNavigate("reviews", product.id)} className="text-[12px] text-[var(--v-body)] underline underline-offset-4">
                    전체보기
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {productReviews.map((r) => (
                    <div key={r.id} className="border border-[var(--v-hairline)] p-4">
                      <div className="flex items-center justify-between">
                        <RatingStars rating={r.rating} showValue={false} />
                        <span className="text-[11px] text-[var(--v-body)]">{r.purchasedSize} 구매</span>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-[var(--v-body-strong)]">{r.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
            onClick={() => setZoomOpen(false)}
          >
            <button type="button" aria-label="닫기" className="absolute right-6 top-6 text-white" onClick={() => setZoomOpen(false)}>
              <X size={24} />
            </button>
            <img src={product.gallery[activeImage]} alt={product.name} className="max-h-[90dvh] max-w-[90vw] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionRow({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="py-4">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <span className="text-[14px] font-medium text-[var(--v-ink)]">{title}</span>
        <CaretDown size={14} className={`text-[var(--v-body)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
