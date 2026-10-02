"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "@phosphor-icons/react";
import {
  AppBar,
  GhostButton,
  PriceTag,
  PrimaryButton,
  ProductTile,
  Stars,
} from "@/projects/commerce/pawfit/components/ui";
import { ADMIN_REVIEWS, PRODUCTS, PRODUCT_BY_ID, formatWon } from "@/projects/commerce/pawfit/lib/mock-data";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

export function ProductDetailScreen({
  productId,
  onNavigate,
  onAddToCart,
}: {
  productId: string;
  onNavigate: NavigateFn;
  onAddToCart: (item: { productId: string; color: string; size: string; quantity: number }) => void;
}) {
  const product = PRODUCT_BY_ID[productId] ?? PRODUCTS[0];
  const [selectedColor, setSelectedColor] = useState(product.colorways[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  const activeRow = product.sizeChart.find((row) => row.size === selectedSize) ?? product.sizeChart[0];

  const reviews = ADMIN_REVIEWS.filter((r) => r.product === product.name && r.exposed);

  function handleAddToCart() {
    onAddToCart({ productId: product.id, color: selectedColor, size: selectedSize, quantity });
  }

  function handleAddAndStay() {
    handleAddToCart();
    setJustAdded(true);
  }

  function handleBuyNow() {
    handleAddToCart();
    onNavigate("cart");
  }

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar
        title={product.name}
        onBack={() => onNavigate("productList")}
        right={
          <button
            type="button"
            onClick={() => onNavigate("cart")}
            aria-label="장바구니"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--pf-ink)] transition-transform hover:bg-[var(--pf-surface-card)] active:scale-[0.97]"
          >
            <ShoppingCart size={19} weight="bold" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-6">
        {/* 히어로 */}
        <div className="flex flex-col items-center gap-4 px-5 pt-6">
          <ProductTile
            category={product.category}
            tint={product.brandTint}
            colorways={product.colorways}
            image={product.image}
            alt={product.name}
            size={220}
          />
          <div className="w-full text-center">
            <p className="text-[12px] font-semibold text-[var(--pf-muted)]">{product.category}</p>
            <h1 className="mt-1 text-[20px] font-semibold tracking-[-0.01em] text-[var(--pf-ink)]">{product.name}</h1>
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              <Stars rating={product.rating} size={13} />
              <span className="text-[12.5px] text-[var(--pf-muted)]">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
            <div className="mt-2.5 flex justify-center">
              <PriceTag price={product.price} listPrice={product.listPrice} size="lg" />
            </div>
          </div>
        </div>

        {/* 컬러 선택 */}
        <div className="mt-7 px-5">
          <p className="text-[13px] font-semibold text-[var(--pf-ink)]">
            컬러 <span className="font-normal text-[var(--pf-muted)]">{selectedColor}</span>
          </p>
          <div className="mt-2.5 flex gap-2.5">
            {product.colorways.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                aria-label={c.name}
                aria-pressed={selectedColor === c.name}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-transform active:scale-[0.94] ${
                  selectedColor === c.name ? "border-[var(--pf-ink)]" : "border-[var(--pf-hairline)]"
                }`}
              >
                <span className="h-7 w-7 rounded-full" style={{ background: c.hex }} />
                {selectedColor === c.name && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--pf-ink)] text-white">
                    <Check size={10} weight="bold" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 사이즈 선택 */}
        <div className="mt-6 px-5">
          <p className="text-[13px] font-semibold text-[var(--pf-ink)]">사이즈</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                  selectedSize === size
                    ? "border-[var(--pf-ink)] bg-[var(--pf-ink)] text-white"
                    : "border-[var(--pf-hairline)] text-[var(--pf-body)]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 착용 예시 (일러스트 사이즈 가이드) */}
        <div className="mt-7 px-5">
          <p className="text-[13px] font-semibold text-[var(--pf-ink)]">착용 예시</p>
          <p className="mt-0.5 text-[12px] text-[var(--pf-muted)]">
            실제 착용 사진 대신, 선택한 사이즈({selectedSize})의 측정 부위를 그림으로 안내해요.
          </p>

          <div className="relative mt-3 flex h-[190px] items-center justify-center overflow-hidden rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)]">
            {/* 실루엣 */}
            <div className="relative h-[92px] w-[220px]">
              {/* 꼬리 */}
              <div className="absolute -left-3 top-[30px] h-3 w-9 -rotate-[24deg] rounded-full bg-[var(--pf-ink)]/[0.07]" />
              {/* 몸통 */}
              <div className="absolute left-3 top-[14px] h-[46px] w-[172px] rounded-[28px] border border-[var(--pf-ink)]/10 bg-[var(--pf-ink)]/[0.06]" />
              {/* 머리 */}
              <div className="absolute right-0 top-0 h-[52px] w-[52px] rounded-full border border-[var(--pf-ink)]/10 bg-[var(--pf-ink)]/[0.06]" />
              {/* 귀 */}
              <div className="absolute right-1 -top-2 h-5 w-3.5 rotate-[18deg] rounded-full bg-[var(--pf-ink)]/[0.07]" />
              {/* 다리 */}
              {[24, 60, 130, 166].map((left) => (
                <div
                  key={left}
                  className="absolute top-[54px] h-8 w-2.5 rounded-b-full bg-[var(--pf-ink)]/[0.06]"
                  style={{ left }}
                />
              ))}

              {/* 목둘레 측정선 */}
              <div className="absolute right-[6px] top-[4px] h-[46px] w-0 border-l border-dashed border-[var(--pf-ink)]/35" />
              <span className="pf-num absolute -top-[18px] right-0 whitespace-nowrap rounded-full border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--pf-ink)]">
                목둘레 {activeRow.neck}cm
              </span>

              {/* 가슴둘레 측정선 */}
              <div className="absolute left-[54px] top-[4px] h-[62px] w-0 border-l border-dashed border-[var(--pf-ink)]/35" />
              <span className="pf-num absolute -top-[18px] left-[30px] whitespace-nowrap rounded-full border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--pf-ink)]">
                가슴둘레 {activeRow.chest}cm
              </span>

              {/* 기장 측정선 */}
              <div className="absolute bottom-[-14px] left-3 h-0 w-[172px] border-t border-dashed border-[var(--pf-ink)]/35" />
              <span className="pf-num absolute bottom-[-38px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--pf-ink)]">
                기장 {activeRow.length}cm
              </span>
            </div>
          </div>
        </div>

        {/* 사이즈 차트 */}
        <div className="mt-9 px-5">
          <p className="text-[13px] font-semibold text-[var(--pf-ink)]">사이즈 차트</p>
          <div className="mt-2.5 overflow-hidden rounded-[16px] border border-[var(--pf-hairline)]">
            <div className="grid grid-cols-4 bg-[var(--pf-surface-card)] px-4 py-2.5 text-[11.5px] font-semibold text-[var(--pf-muted)]">
              <span>사이즈</span>
              <span className="text-right">가슴둘레</span>
              <span className="text-right">목둘레</span>
              <span className="text-right">기장</span>
            </div>
            {product.sizeChart.map((row, i) => (
              <div
                key={row.size}
                className={`grid grid-cols-4 px-4 py-2.5 text-[13px] ${
                  row.size === selectedSize ? "bg-[var(--pf-surface-soft)]" : ""
                } ${i !== product.sizeChart.length - 1 ? "border-b border-[var(--pf-hairline)]" : ""}`}
              >
                <span className={`font-semibold ${row.size === selectedSize ? "text-[var(--pf-ink)]" : "text-[var(--pf-body)]"}`}>
                  {row.size}
                </span>
                <span className="pf-num text-right text-[var(--pf-body)]">{row.chest}cm</span>
                <span className="pf-num text-right text-[var(--pf-body)]">{row.neck}cm</span>
                <span className="pf-num text-right text-[var(--pf-body)]">{row.length}cm</span>
              </div>
            ))}
          </div>
        </div>

        {/* 상품 설명 */}
        <div className="mt-7 px-5">
          <p className="text-[13px] font-semibold text-[var(--pf-ink)]">상품 설명</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--pf-body)]">{product.description}</p>
        </div>

        {/* 후기 */}
        <div className="mt-8 px-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-semibold text-[var(--pf-ink)]">후기</p>
            <span className="text-[12px] text-[var(--pf-muted)]">{reviews.length}개</span>
          </div>

          {reviews.length === 0 ? (
            <p className="mt-2.5 text-[12.5px] text-[var(--pf-muted)]">아직 등록된 후기가 없어요.</p>
          ) : (
            <div className="mt-2.5 space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[var(--pf-ink)]">{review.member}</span>
                    <Stars rating={review.rating} size={11} />
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--pf-body)]">{review.body}</p>
                  <p className="mt-1.5 text-[11px] text-[var(--pf-muted)]">{review.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 구매 바 */}
      <div className="sticky bottom-0 border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 pb-6 pt-3.5">
        {justAdded && (
          <div className="mb-2.5 flex items-center gap-1.5 rounded-[12px] bg-[var(--pf-success-soft)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--pf-success)]">
            <Check size={14} weight="bold" />
            장바구니에 담았어요
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[var(--pf-ink)]">수량</span>
          <div className="flex items-center gap-3 rounded-full border border-[var(--pf-hairline)] px-1 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="수량 감소"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--pf-ink)] transition-transform active:scale-[0.9]"
            >
              <Minus size={13} weight="bold" />
            </button>
            <span className="pf-num w-5 text-center text-[13.5px] font-semibold text-[var(--pf-ink)]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="수량 증가"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--pf-ink)] transition-transform active:scale-[0.9]"
            >
              <Plus size={13} weight="bold" />
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between text-[13px]">
          <span className="text-[var(--pf-muted)]">총 상품금액</span>
          <span className="pf-num font-semibold text-[var(--pf-ink)]">{formatWon(product.price * quantity)}원</span>
        </div>

        <div className="flex gap-2.5">
          <div className="min-w-0 flex-1">
            <GhostButton onClick={handleAddAndStay}>장바구니 담기</GhostButton>
          </div>
          <div className="min-w-0 flex-1">
            <PrimaryButton onClick={handleBuyNow}>바로 구매</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
