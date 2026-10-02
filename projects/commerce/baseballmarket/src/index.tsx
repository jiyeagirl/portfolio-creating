"use client";

import { useEffect, useState } from "react";
import "@/projects/commerce/baseballmarket/styles/baseballmarket.css";
import { TopNav } from "@/projects/commerce/baseballmarket/components/layout/top-nav";
import { Footer } from "@/projects/commerce/baseballmarket/components/layout/footer";
import { AuthScreen } from "@/projects/commerce/baseballmarket/components/screens/auth-screen";
import { HomeScreen } from "@/projects/commerce/baseballmarket/components/screens/home-screen";
import { BrowseScreen } from "@/projects/commerce/baseballmarket/components/screens/browse-screen";
import { DetailScreen } from "@/projects/commerce/baseballmarket/components/screens/detail-screen";
import { SellScreen } from "@/projects/commerce/baseballmarket/components/screens/sell-screen";
import { ChatScreen } from "@/projects/commerce/baseballmarket/components/screens/chat-screen";
import { CommunityScreen } from "@/projects/commerce/baseballmarket/components/screens/community-screen";
import { PostDetailScreen } from "@/projects/commerce/baseballmarket/components/screens/post-detail-screen";
import { MypageScreen } from "@/projects/commerce/baseballmarket/components/screens/mypage-screen";
import { POSTS, listing } from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { UserView } from "@/projects/commerce/baseballmarket/lib/navigation";

/* 사용자 콘솔. 워크스페이스 규칙대로 URL은 하나뿐이고 화면 전환은 내부 상태다.
   관리자 콘솔은 /commerce/baseballmarket-admin에 완전히 분리되어 있으며
   이 화면 어디에도 관리자 진입점을 두지 않는다. */

export default function BaseballMarket() {
  const [view, setView] = useState<UserView>("home");
  const [listingId, setListingId] = useState("l1");
  const [postId, setPostId] = useState("p1");
  const [liked, setLiked] = useState<Set<string>>(new Set(["l3", "l7"]));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, listingId, postId]);

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openListing(id: string) {
    setListingId(id);
    setView("detail");
  }

  function openPost(id: string) {
    setPostId(id);
    setView("postDetail");
  }

  const post = POSTS.find((p) => p.id === postId) ?? POSTS[0];

  if (view === "auth") {
    return (
      <div className="baseballmarket min-h-dvh bg-[var(--bm-canvas)]">
        <AuthScreen onDone={() => setView("home")} />
      </div>
    );
  }

  return (
    <div className="baseballmarket flex min-h-dvh flex-col bg-[var(--bm-canvas)]">
      <TopNav view={view} onNavigate={setView} onSell={() => setView("sell")} />

      <main className="flex-1">
        {view === "home" && (
          <HomeScreen
            onNavigate={setView}
            onOpenListing={openListing}
            liked={liked}
            onToggleLike={toggleLike}
          />
        )}

        {view === "browse" && (
          <BrowseScreen onOpenListing={openListing} liked={liked} onToggleLike={toggleLike} />
        )}

        {view === "detail" && (
          <DetailScreen
            listing={listing(listingId)}
            onBack={() => setView("browse")}
            onOpenListing={openListing}
            onOpenChat={() => setView("chat")}
            liked={liked.has(listingId)}
            onToggleLike={() => toggleLike(listingId)}
          />
        )}

        {view === "sell" && (
          <SellScreen onBack={() => setView("home")} onDone={() => setView("mypage")} />
        )}

        {view === "chat" && <ChatScreen onOpenListing={openListing} />}

        {view === "community" && (
          <CommunityScreen onOpenPost={openPost} onOpenListing={openListing} />
        )}

        {view === "postDetail" && (
          <PostDetailScreen
            post={post}
            onBack={() => setView("community")}
            onOpenListing={openListing}
          />
        )}

        {view === "mypage" && (
          <MypageScreen
            onOpenListing={openListing}
            onLogout={() => setView("auth")}
            liked={liked}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
