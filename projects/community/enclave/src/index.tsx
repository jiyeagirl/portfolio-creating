"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/community/enclave/styles/enclave.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { OnboardingScreen } from "@/projects/community/enclave/components/screens/onboarding-screen";
import { HomeScreen } from "@/projects/community/enclave/components/screens/home-screen";
import { ExploreScreen } from "@/projects/community/enclave/components/screens/explore-screen";
import { ProductDetailScreen } from "@/projects/community/enclave/components/screens/product-detail-screen";
import { PostCreateScreen } from "@/projects/community/enclave/components/screens/post-create-screen";
import { ChatListScreen } from "@/projects/community/enclave/components/screens/chat-list-screen";
import { ChatDetailScreen } from "@/projects/community/enclave/components/screens/chat-detail-screen";
import { LockerScreen } from "@/projects/community/enclave/components/screens/locker-screen";
import { MyActivityScreen } from "@/projects/community/enclave/components/screens/my-activity-screen";
import { MyPageScreen } from "@/projects/community/enclave/components/screens/mypage-screen";
import { CHAT_THREADS } from "@/projects/community/enclave/lib/mock-data";
import type { BottomNavKey, EnclaveScreen as ScreenKey } from "@/projects/community/enclave/lib/navigation";

const SCREENS: ScreenKey[] = [
  "onboarding",
  "home",
  "explore",
  "productDetail",
  "postCreate",
  "chatList",
  "chatDetail",
  "locker",
  "myActivity",
  "mypage",
];

function getInitialScreen(param: string | null): ScreenKey {
  return SCREENS.includes(param as ScreenKey) ? (param as ScreenKey) : "onboarding";
}

export default function Enclave() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<ScreenKey>(() => getInitialScreen(searchParams.get("screen")));
  const [productId, setProductId] = useState("p1");
  const [productOrigin, setProductOrigin] = useState<ScreenKey>("home");
  const [threadId, setThreadId] = useState(CHAT_THREADS[0].id);
  const [activityTab, setActivityTab] = useState<"판매내역" | "구매내역" | "찜목록">("판매내역");
  const [likedIds, setLikedIds] = useState<string[]>(["p5", "p2"]);

  function goTab(key: BottomNavKey) {
    setScreen(key);
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function openProduct(id: string, origin: ScreenKey = "home") {
    setProductId(id);
    setProductOrigin(origin);
    setScreen("productDetail");
  }

  function openChatForSeller(sellerId: string) {
    const thread = CHAT_THREADS.find((t) => t.counterpartId === sellerId);
    if (thread) {
      setThreadId(thread.id);
      setScreen("chatDetail");
    } else {
      setScreen("chatList");
    }
  }

  function openActivity(tab: "판매내역" | "구매내역" | "찜목록") {
    setActivityTab(tab);
    setScreen("myActivity");
  }

  return (
    <PhoneFrame
      screenClassName="enclave bg-[var(--ec-canvas)] text-[var(--ec-ink)]"
      statusBarClassName="text-[var(--ec-ink)]"
      homeIndicatorClassName="bg-[var(--ec-ink)]/70"
    >
      {screen === "onboarding" && <OnboardingScreen onComplete={() => setScreen("home")} />}
      {screen === "home" && (
        <HomeScreen
          onOpenProduct={(id) => openProduct(id, "home")}
          onNavigate={goTab}
          onCreatePost={() => setScreen("postCreate")}
          likedIds={likedIds}
          onToggleLike={toggleLike}
        />
      )}
      {screen === "explore" && (
        <ExploreScreen
          onOpenProduct={(id) => openProduct(id, "explore")}
          onNavigate={goTab}
          likedIds={likedIds}
          onToggleLike={toggleLike}
        />
      )}
      {screen === "productDetail" && (
        <ProductDetailScreen
          productId={productId}
          onBack={() => setScreen(productOrigin)}
          onOpenChat={openChatForSeller}
          liked={likedIds.includes(productId)}
          onToggleLike={() => toggleLike(productId)}
        />
      )}
      {screen === "postCreate" && (
        <PostCreateScreen onBack={() => setScreen("home")} onSubmit={() => setScreen("home")} />
      )}
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
      {screen === "locker" && <LockerScreen onNavigate={goTab} />}
      {screen === "myActivity" && (
        <MyActivityScreen
          initialTab={activityTab}
          onBack={() => setScreen("mypage")}
          onOpenProduct={(id) => openProduct(id, "myActivity")}
          likedIds={likedIds}
          onToggleLike={toggleLike}
        />
      )}
      {screen === "mypage" && <MyPageScreen onNavigate={goTab} onOpenActivity={openActivity} />}
    </PhoneFrame>
  );
}
