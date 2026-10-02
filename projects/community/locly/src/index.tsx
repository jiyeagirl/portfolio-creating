"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/community/locly/styles/locly.css";
import { NOTIFICATIONS } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn, SiteView } from "@/projects/community/locly/lib/navigation";
import { TopNav } from "@/projects/community/locly/components/site/top-nav";
import { SiteFooter } from "@/projects/community/locly/components/site/footer";
import { HomeScreen } from "@/projects/community/locly/components/site/screens/home-screen";
import { CommunityScreen } from "@/projects/community/locly/components/site/screens/community-screen";
import { PostDetailScreen } from "@/projects/community/locly/components/site/screens/post-detail-screen";
import { PostWriteScreen } from "@/projects/community/locly/components/site/screens/post-write-screen";
import { EventsScreen } from "@/projects/community/locly/components/site/screens/events-screen";
import { EventDetailScreen } from "@/projects/community/locly/components/site/screens/event-detail-screen";
import { StoresScreen } from "@/projects/community/locly/components/site/screens/stores-screen";
import { StoreDetailScreen } from "@/projects/community/locly/components/site/screens/store-detail-screen";
import { MeetupsScreen } from "@/projects/community/locly/components/site/screens/meetups-screen";
import { MeetupDetailScreen } from "@/projects/community/locly/components/site/screens/meetup-detail-screen";
import { CivicScreen } from "@/projects/community/locly/components/site/screens/civic-screen";
import { SearchScreen } from "@/projects/community/locly/components/site/screens/search-screen";
import { NotificationsScreen } from "@/projects/community/locly/components/site/screens/notifications-screen";
import { MypageScreen } from "@/projects/community/locly/components/site/screens/mypage-screen";

const SCREENS: SiteView[] = [
  "home",
  "community",
  "postDetail",
  "postWrite",
  "events",
  "eventDetail",
  "stores",
  "storeDetail",
  "meetups",
  "meetupDetail",
  "civic",
  "search",
  "notifications",
  "mypage",
];

export default function Locly() {
  // ?screen=<view>&id=<id> 로 첫 화면을 고른다 (시각 검증 캡처용)
  const searchParams = useSearchParams();
  const [view, setView] = useState<SiteView>(() => {
    const screen = searchParams.get("screen") as SiteView | null;
    return screen && SCREENS.includes(screen) ? screen : "home";
  });
  const [selectedId, setSelectedId] = useState<string | undefined>(() => searchParams.get("id") ?? undefined);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const navigate: NavigateFn = (nextView, id) => {
    setView(nextView);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="locly flex min-h-dvh flex-col bg-[var(--lc-canvas)] text-[var(--lc-ink)]">
      <TopNav active={view} unreadCount={unreadCount} onNavigate={navigate} />

      <main className="flex-1">
        {view === "home" && <HomeScreen onNavigate={navigate} />}
        {view === "community" && <CommunityScreen onNavigate={navigate} initialBoard={selectedId} />}
        {view === "postDetail" && <PostDetailScreen postId={selectedId ?? ""} onNavigate={navigate} />}
        {view === "postWrite" && <PostWriteScreen onNavigate={navigate} />}
        {view === "events" && <EventsScreen onNavigate={navigate} />}
        {view === "eventDetail" && <EventDetailScreen eventId={selectedId ?? ""} onNavigate={navigate} />}
        {view === "stores" && <StoresScreen onNavigate={navigate} />}
        {view === "storeDetail" && <StoreDetailScreen storeId={selectedId ?? ""} onNavigate={navigate} />}
        {view === "meetups" && <MeetupsScreen onNavigate={navigate} />}
        {view === "meetupDetail" && (
          <MeetupDetailScreen meetupId={selectedId ?? ""} onNavigate={navigate} />
        )}
        {view === "civic" && <CivicScreen />}
        {view === "search" && <SearchScreen onNavigate={navigate} />}
        {view === "notifications" && <NotificationsScreen onNavigate={navigate} />}
        {view === "mypage" && <MypageScreen onNavigate={navigate} />}
      </main>

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
