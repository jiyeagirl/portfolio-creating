"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/commerce/pawfit/styles/pawfit.css";
import type { NavigateFn, PawfitView } from "@/projects/commerce/pawfit/lib/navigation";
import { ALL_VIEWS, TAB_OF_VIEW, TAB_ROOTS } from "@/projects/commerce/pawfit/lib/navigation";
import { ORDERS, PETS } from "@/projects/commerce/pawfit/lib/mock-data";
import type { CartItem, Order } from "@/projects/commerce/pawfit/lib/types";
import { BottomNav } from "@/projects/commerce/pawfit/components/bottom-nav";
import { LoginScreen } from "@/projects/commerce/pawfit/components/screens/login-screen";
import { HomeScreen } from "@/projects/commerce/pawfit/components/screens/home-screen";
import { PetProfileScreen } from "@/projects/commerce/pawfit/components/screens/pet-profile-screen";
import { SizeRecommendationScreen } from "@/projects/commerce/pawfit/components/screens/size-recommendation-screen";
import { ProductListScreen } from "@/projects/commerce/pawfit/components/screens/product-list-screen";
import { ProductDetailScreen } from "@/projects/commerce/pawfit/components/screens/product-detail-screen";
import { CartScreen } from "@/projects/commerce/pawfit/components/screens/cart-screen";
import { CheckoutScreen } from "@/projects/commerce/pawfit/components/screens/checkout-screen";
import { MypageScreen } from "@/projects/commerce/pawfit/components/screens/mypage-screen";
import { OrderHistoryScreen } from "@/projects/commerce/pawfit/components/screens/order-history-screen";
import { ProfileEditScreen } from "@/projects/commerce/pawfit/components/screens/profile-edit-screen";
import { SizeFeedbackScreen } from "@/projects/commerce/pawfit/components/screens/size-feedback-screen";

/* 스크린샷 도구용 진입점. `?screen=home` 형태를 읽는다.
   서버 스냅샷을 빈 문자열로 두면 hydration 불일치 없이 클라이언트 값만 반영된다. */
const subscribeToNothing = () => () => {};

export default function Pawfit() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const screen = params.get("screen");
    return {
      view:
        screen && ALL_VIEWS.includes(screen as PawfitView) ? (screen as PawfitView) : ("login" as PawfitView),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [nav, setNav] = useState<{ view: PawfitView; id?: string } | null>(null);
  const view = nav?.view ?? initial.view;
  const selectedId = nav ? nav.id : initial.id;

  const [selectedPetId, setSelectedPetId] = useState(PETS[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const rootRef = useRef<HTMLDivElement>(null);

  /* 화면을 바꾸면 기기 안쪽 스크롤을 맨 위로 되돌린다. */
  useEffect(() => {
    rootRef.current?.parentElement?.scrollTo({ top: 0, behavior: "auto" });
  }, [view, selectedId]);

  const navigate: NavigateFn = (nextView, id) => {
    setNav({ view: nextView, id });
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) => c.productId === item.productId && c.color === item.color && c.size === item.size,
      );
      if (idx === -1) return [...prev, item];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
      return next;
    });
  };

  const updateCartQuantity = (productId: string, color: string, size: string, quantity: number) => {
    setCart((prev) =>
      prev.map((c) => (c.productId === productId && c.color === color && c.size === size ? { ...c, quantity } : c)),
    );
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart((prev) => prev.filter((c) => !(c.productId === productId && c.color === color && c.size === size)));
  };

  const placeOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
    setCart([]);
  };

  const showTabs = TAB_ROOTS.includes(view);

  return (
    <PhoneFrame
      screenClassName="pawfit bg-[var(--pf-canvas)] text-[var(--pf-ink)]"
      statusBarClassName="text-[var(--pf-ink)]"
      homeIndicatorClassName="bg-[var(--pf-ink)]/70"
    >
      <div ref={rootRef} className="min-h-full">
        {view === "login" && <LoginScreen onNavigate={navigate} />}

        {view === "home" && (
          <HomeScreen selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} onNavigate={navigate} />
        )}

        {view === "petProfile" && (
          <PetProfileScreen selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} onNavigate={navigate} />
        )}

        {view === "sizeRecommendation" && (
          <SizeRecommendationScreen petId={selectedId ?? selectedPetId} onNavigate={navigate} />
        )}

        {view === "productList" && <ProductListScreen category={selectedId} onNavigate={navigate} />}

        {view === "productDetail" && (
          <ProductDetailScreen productId={selectedId ?? ""} onNavigate={navigate} onAddToCart={addToCart} />
        )}

        {view === "cart" && (
          <CartScreen
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onNavigate={navigate}
          />
        )}

        {view === "checkout" && (
          <CheckoutScreen cart={cart} onNavigate={navigate} onPlaceOrder={placeOrder} />
        )}

        {view === "mypage" && <MypageScreen onNavigate={navigate} />}

        {view === "orderHistory" && <OrderHistoryScreen orders={orders} onNavigate={navigate} />}

        {view === "profileEdit" && <ProfileEditScreen onNavigate={navigate} />}

        {view === "sizeFeedback" && <SizeFeedbackScreen orderId={selectedId} onNavigate={navigate} />}
      </div>

      {showTabs && <BottomNav active={TAB_OF_VIEW[view]!} onNavigate={navigate} />}
    </PhoneFrame>
  );
}
