"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import "@/projects/commerce/verve/styles/verve.css";
import { ALL_VIEWS, DARK_VIEWS, type NavigateFn, type VerveView } from "@/projects/commerce/verve/lib/navigation";
import { initialCart, orders as seedOrders } from "@/projects/commerce/verve/lib/mock-data";
import type { CartItem, Order, Product, SizeLabel } from "@/projects/commerce/verve/lib/types";
import { Nav } from "@/projects/commerce/verve/components/layout/nav";
import { Footer } from "@/projects/commerce/verve/components/layout/footer";
import { HomeScreen } from "@/projects/commerce/verve/components/screens/home-screen";
import { ShopScreen } from "@/projects/commerce/verve/components/screens/shop-screen";
import { ProductDetailScreen } from "@/projects/commerce/verve/components/screens/product-detail-screen";
import { SizeRecommendationScreen } from "@/projects/commerce/verve/components/screens/size-recommendation-screen";
import { CartScreen } from "@/projects/commerce/verve/components/screens/cart-screen";
import { CheckoutScreen } from "@/projects/commerce/verve/components/screens/checkout-screen";
import { OrderCompleteScreen } from "@/projects/commerce/verve/components/screens/order-complete-screen";
import { MypageScreen } from "@/projects/commerce/verve/components/screens/mypage-screen";
import { ReviewScreen } from "@/projects/commerce/verve/components/screens/review-screen";
import { BrandScreen } from "@/projects/commerce/verve/components/screens/brand-screen";
import { AuthScreen } from "@/projects/commerce/verve/components/screens/auth-screen";
import { SupportScreen } from "@/projects/commerce/verve/components/screens/support-screen";

const subscribeToNothing = () => () => {};

export default function Verve() {
  /* 스크린샷 도구용 진입점. `?screen=home&id=p-run-01` 형태를 읽는다. */
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const screen = params.get("screen");
    return {
      view: screen && ALL_VIEWS.includes(screen as VerveView) ? (screen as VerveView) : ("home" as VerveView),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [nav, setNav] = useState<{ view: VerveView; id?: string } | null>(null);
  const view = nav?.view ?? initial.view;
  const selectedId = nav ? nav.id : initial.id;
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ block: "start" });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view, selectedId]);

  const navigate: NavigateFn = (view, id) => setNav({ view, id });

  const addToCart = (product: Product, color: string, size: SizeLabel, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.color === color && item.size === size);
      if (existing) {
        return prev.map((item) => (item.cartId === existing.cartId ? { ...item, quantity: item.quantity + quantity } : item));
      }
      const colorImage = product.colors.find((c) => c.name === color)?.image ?? product.gallery[0];
      return [
        ...prev,
        {
          cartId: `c-${Date.now()}-${Math.round(Math.random() * 1000)}`,
          productId: product.id,
          name: product.name,
          image: colorImage,
          color,
          size,
          price: product.price,
          quantity,
        },
      ];
    });
  };

  const addProductQuickToCart = (product: Product) => {
    addToCart(product, product.colors[0].name, product.sizes.find((s) => s.stock > 0)?.size ?? product.sizes[0].size, 1);
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const placeOrder = () => {
    const id = `VV${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 8999)}`;
    const newOrder: Order = {
      id,
      date: "2026.08.04",
      status: "결제완료",
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        color: item.color,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      estimatedDelivery: "2026.08.07 도착 예정",
      recipient: "김지은",
      address: "서울시 마포구 성지길 12, 3층",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return id;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const tone = DARK_VIEWS.includes(view) ? "dark" : "light";

  return (
    <div ref={rootRef} className="verve flex min-h-dvh flex-col">
      <Nav tone={tone} cartCount={cartCount} onNavigate={navigate} />

      <main className="flex-1">
        {view === "home" && <HomeScreen onNavigate={navigate} />}
        {view === "shop" && <ShopScreen onNavigate={navigate} onAddToCart={addProductQuickToCart} />}
        {view === "productDetail" && <ProductDetailScreen productId={selectedId ?? ""} onNavigate={navigate} onAddToCart={addToCart} />}
        {view === "sizeRecommendation" && <SizeRecommendationScreen onNavigate={navigate} />}
        {view === "cart" && <CartScreen cart={cart} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onNavigate={navigate} />}
        {view === "checkout" && <CheckoutScreen cart={cart} onNavigate={navigate} onPlaceOrder={placeOrder} />}
        {view === "orderComplete" && <OrderCompleteScreen orderId={selectedId} orders={orders} onNavigate={navigate} />}
        {view === "mypage" && <MypageScreen onNavigate={navigate} />}
        {view === "reviews" && <ReviewScreen productId={selectedId} onNavigate={navigate} />}
        {view === "brand" && <BrandScreen onNavigate={navigate} />}
        {view === "login" && <AuthScreen mode="login" onNavigate={navigate} />}
        {view === "signup" && <AuthScreen mode="signup" onNavigate={navigate} />}
        {view === "support" && <SupportScreen />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
