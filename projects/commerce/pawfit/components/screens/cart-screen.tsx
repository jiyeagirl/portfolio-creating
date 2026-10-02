"use client";

import { Minus, Plus, ShoppingBagOpen, X } from "@phosphor-icons/react";
import { AppBar, EmptyState, PrimaryButton, ProductTile } from "@/projects/commerce/pawfit/components/ui";
import { PRODUCT_BY_ID, formatWon } from "@/projects/commerce/pawfit/lib/mock-data";
import type { CartItem } from "@/projects/commerce/pawfit/lib/types";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

export function CartScreen({
  cart,
  onUpdateQuantity,
  onRemove,
  onNavigate,
}: {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  onRemove: (productId: string, color: string, size: string) => void;
  onNavigate: NavigateFn;
}) {
  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCT_BY_ID[item.productId];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar
        title="장바구니"
        subtitle={cart.length > 0 ? `${cart.length}개 상품 담김` : undefined}
        onBack={() => onNavigate("home")}
      />

      <div className="flex-1 overflow-y-auto pb-10">
        {cart.length === 0 ? (
          <EmptyState
            icon={<ShoppingBagOpen size={22} weight="bold" />}
            title="장바구니가 비어있어요"
            body="마음에 드는 상품을 담고 사이즈 추천도 함께 확인해보세요."
            action="쇼핑하러 가기"
            onAction={() => onNavigate("productList")}
          />
        ) : (
          <div className="px-5 pt-5">
            <div className="space-y-3">
              {cart.map((item) => {
                const product = PRODUCT_BY_ID[item.productId];
                if (!product) return null;
                const lineTotal = product.price * item.quantity;
                return (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}`}
                    className="flex gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-3"
                  >
                    <ProductTile
                      category={product.category}
                      tint={product.brandTint}
                      colorways={product.colorways}
                      image={product.image}
                      alt={product.name}
                      size={72}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[14px] font-semibold text-[var(--pf-ink)]">{product.name}</p>
                        <button
                          type="button"
                          onClick={() => onRemove(item.productId, item.color, item.size)}
                          aria-label="상품 삭제"
                          className="shrink-0 rounded-full p-1 text-[var(--pf-muted)] transition-transform active:scale-[0.9]"
                        >
                          <X size={16} weight="bold" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
                        {item.color} | {item.size}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.productId, item.color, item.size, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                            aria-label="수량 줄이기"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pf-hairline)] text-[var(--pf-ink)] transition-transform active:scale-[0.9] disabled:text-[var(--pf-muted-soft)]"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="pf-num w-4 text-center text-[13.5px] font-semibold text-[var(--pf-ink)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                            }
                            aria-label="수량 늘리기"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pf-hairline)] text-[var(--pf-ink)] transition-transform active:scale-[0.9]"
                          >
                            <Plus size={12} weight="bold" />
                          </button>
                        </div>
                        <span className="pf-num text-[14.5px] font-semibold text-[var(--pf-ink)]">
                          {formatWon(lineTotal)}원
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-[16px] bg-[var(--pf-surface-card)] px-4 py-3.5">
              <span className="text-[13.5px] font-semibold text-[var(--pf-ink)]">상품 금액</span>
              <span className="pf-num text-[16px] font-semibold text-[var(--pf-ink)]">{formatWon(subtotal)}원</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-4">
        <PrimaryButton disabled={cart.length === 0} onClick={() => onNavigate("checkout")}>
          주문하기
        </PrimaryButton>
      </div>
    </div>
  );
}
