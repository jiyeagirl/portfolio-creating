"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/community/waypoint/styles/waypoint.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { OnboardingScreen } from "@/projects/community/waypoint/components/screens/onboarding-screen";
import { HomeScreen } from "@/projects/community/waypoint/components/screens/home-screen";
import { WaypointScreen } from "@/projects/community/waypoint/components/screens/waypoint-screen";
import { ProductDetailScreen } from "@/projects/community/waypoint/components/screens/product-detail-screen";
import { ChatListScreen } from "@/projects/community/waypoint/components/screens/chat-list-screen";
import { ChatDetailScreen } from "@/projects/community/waypoint/components/screens/chat-detail-screen";
import { MyPageScreen } from "@/projects/community/waypoint/components/screens/mypage-screen";
import { TransactionsScreen } from "@/projects/community/waypoint/components/screens/transactions-screen";
import { SettingsScreen } from "@/projects/community/waypoint/components/screens/settings-screen";
import { CHAT_THREADS } from "@/projects/community/waypoint/lib/mock-data";
import type { BottomNavKey, WaypointScreen as ScreenKey } from "@/projects/community/waypoint/lib/navigation";

const SCREENS: ScreenKey[] = [
  "onboarding",
  "home",
  "waypoint",
  "chatList",
  "chatDetail",
  "productDetail",
  "transactions",
  "settings",
  "mypage",
];

function getInitialScreen(param: string | null): ScreenKey {
  return SCREENS.includes(param as ScreenKey) ? (param as ScreenKey) : "onboarding";
}

export default function Waypoint() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<ScreenKey>(() => getInitialScreen(searchParams.get("screen")));
  const [productId, setProductId] = useState("p1");
  const [productOrigin, setProductOrigin] = useState<"home" | "transactions">("home");
  const [threadId, setThreadId] = useState(CHAT_THREADS[0].id);
  const [transactionsTab, setTransactionsTab] = useState<"liked" | "selling" | "buying">("liked");

  function goTab(key: BottomNavKey) {
    setScreen(key);
  }

  function openProduct(id: string, origin: "home" | "transactions" = "home") {
    setProductId(id);
    setProductOrigin(origin);
    setScreen("productDetail");
  }

  function openChatForProduct(pid: string) {
    const thread = CHAT_THREADS.find((t) => t.productId === pid);
    if (thread) {
      setThreadId(thread.id);
      setScreen("chatDetail");
    } else {
      setScreen("chatList");
    }
  }

  return (
    <PhoneFrame
      screenClassName="waypoint bg-[var(--wp-canvas)] text-[var(--wp-ink)]"
      statusBarClassName="text-[var(--wp-ink)]"
      homeIndicatorClassName="bg-[var(--wp-ink)]/70"
    >
      {screen === "onboarding" && <OnboardingScreen onComplete={() => setScreen("home")} />}
      {screen === "home" && <HomeScreen onOpenProduct={(id) => openProduct(id, "home")} onNavigate={goTab} />}
      {screen === "waypoint" && <WaypointScreen onNavigate={goTab} />}
      {screen === "chatList" && (
        <ChatListScreen
          onOpenChat={(id) => {
            setThreadId(id);
            setScreen("chatDetail");
          }}
          onNavigate={goTab}
        />
      )}
      {screen === "chatDetail" && <ChatDetailScreen threadId={threadId} onBack={() => setScreen("chatList")} />}
      {screen === "productDetail" && (
        <ProductDetailScreen
          productId={productId}
          onBack={() => setScreen(productOrigin === "transactions" ? "transactions" : "home")}
          onOpenChat={openChatForProduct}
        />
      )}
      {screen === "transactions" && (
        <TransactionsScreen
          initialTab={transactionsTab}
          onBack={() => setScreen("mypage")}
          onOpenProduct={(id) => openProduct(id, "transactions")}
        />
      )}
      {screen === "settings" && <SettingsScreen onBack={() => setScreen("mypage")} />}
      {screen === "mypage" && (
        <MyPageScreen
          onNavigate={goTab}
          onOpenTransactions={(tab) => {
            setTransactionsTab(tab);
            setScreen("transactions");
          }}
          onOpenSettings={() => setScreen("settings")}
        />
      )}
    </PhoneFrame>
  );
}
