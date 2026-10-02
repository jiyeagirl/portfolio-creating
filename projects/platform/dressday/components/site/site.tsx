"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ScreenName } from "@/projects/platform/dressday/lib/types";
import { getProduct } from "@/projects/platform/dressday/lib/catalog";
import { Header } from "@/projects/platform/dressday/components/site/header";
import { Footer } from "@/projects/platform/dressday/components/site/footer";
import { HomeScreen } from "@/projects/platform/dressday/components/site/screens/home-screen";
import { BrowseScreen } from "@/projects/platform/dressday/components/site/screens/browse-screen";
import { ProductScreen } from "@/projects/platform/dressday/components/site/screens/product-screen";
import { BookingScreen } from "@/projects/platform/dressday/components/site/screens/booking-screen";
import { PaymentScreen } from "@/projects/platform/dressday/components/site/screens/payment-screen";
import { TrackingScreen } from "@/projects/platform/dressday/components/site/screens/tracking-screen";
import { ReturnScreen } from "@/projects/platform/dressday/components/site/screens/return-screen";
import { MY_TABS, MypageScreen, type MyTab } from "@/projects/platform/dressday/components/site/screens/mypage-screen";

export const SCREENS: ScreenName[] = ["home", "browse", "product", "booking", "payment", "tracking", "return", "mypage"];

/**
 * 초기 상태는 쿼리에서 읽는다 (시각 검증 캡처용):
 *   ?screen=<SCREENS>  &product=<id>  &sheet=filter  &menu=1  &step=done  &tab=<MyTab>
 * 한 번 읽은 뒤에는 내부 상태로 이동한다.
 */
export function Site() {
  const params = useSearchParams();
  const initial = params.get("screen");
  const [screen, setScreen] = useState<ScreenName>(SCREENS.includes(initial as ScreenName) ? (initial as ScreenName) : "home");
  const [productId, setProductId] = useState(params.get("product") ?? "lace-mini");
  const tabParam = params.get("tab");
  const tab = MY_TABS.some((t) => t.key === tabParam) ? (tabParam as MyTab) : "history";

  const navigate = (next: ScreenName) => {
    setScreen(next);
    window.scrollTo({ top: 0 });
  };
  const openProduct = (id: string) => {
    setProductId(id);
    navigate("product");
  };
  const product = getProduct(productId);

  return (
    <div className="dressday flex min-h-[100dvh] flex-col">
      <Header screen={screen} onNavigate={navigate} initialMenu={params.get("menu") === "1"} />
      <main key={screen} className="flex-1">
        {screen === "home" && <HomeScreen onNavigate={navigate} onOpenProduct={openProduct} />}
        {screen === "browse" && <BrowseScreen onOpenProduct={openProduct} initialSheet={params.get("sheet") === "filter"} />}
        {screen === "product" && <ProductScreen product={product} onNavigate={navigate} />}
        {screen === "booking" && <BookingScreen product={product} onNavigate={navigate} />}
        {screen === "payment" && <PaymentScreen product={product} onNavigate={navigate} done={params.get("step") === "done"} />}
        {screen === "tracking" && <TrackingScreen onNavigate={navigate} />}
        {screen === "return" && <ReturnScreen onNavigate={navigate} />}
        {screen === "mypage" && <MypageScreen onNavigate={navigate} initialTab={tab} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
