"use client";

import { useState } from "react";
import { Nav } from "@/projects/commerce/shoppingmall/components/nav";
import { Footer } from "@/projects/commerce/shoppingmall/components/footer";
import { Hero } from "@/projects/commerce/shoppingmall/components/hero";
import { CategoryStrip } from "@/projects/commerce/shoppingmall/components/category-strip";
import { BestSeller } from "@/projects/commerce/shoppingmall/components/best-seller";
import { EditorialBanner } from "@/projects/commerce/shoppingmall/components/editorial-banner";
import { ProductList } from "@/projects/commerce/shoppingmall/components/product-list";
import { Newsletter } from "@/projects/commerce/shoppingmall/components/newsletter";
import { AccountDashboard } from "@/projects/commerce/shoppingmall/components/mypage/dashboard";

type View = "home" | "mypage";

export default function Shoppingmall() {
  const [view, setView] = useState<View>("home");

  return (
    <>
      <Nav onNavigate={setView} />
      <main className="flex-1">
        {view === "home" ? (
          <>
            <Hero />
            <CategoryStrip />
            <BestSeller />
            <EditorialBanner />
            <ProductList />
            <Newsletter />
          </>
        ) : (
          <AccountDashboard />
        )}
      </main>
      <Footer />
    </>
  );
}
