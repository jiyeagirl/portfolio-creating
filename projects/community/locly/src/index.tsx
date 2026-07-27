"use client";

import { useState } from "react";
import "@/projects/community/locly/styles/locly.css";
import type { LoclyView, NavigateFn } from "@/projects/community/locly/lib/navigation";
import { NOTIFICATIONS } from "@/projects/community/locly/lib/mock-data";
import { TopNav } from "@/projects/community/locly/components/layout/top-nav";
import { HomeScreen } from "@/projects/community/locly/components/screens/home-screen";
import { CommunityScreen } from "@/projects/community/locly/components/screens/community-screen";
import { PostDetailScreen } from "@/projects/community/locly/components/screens/post-detail-screen";
import { PostWriteScreen } from "@/projects/community/locly/components/screens/post-write-screen";
import { EventsScreen } from "@/projects/community/locly/components/screens/events-screen";
import { EventDetailScreen } from "@/projects/community/locly/components/screens/event-detail-screen";
import { StoresScreen } from "@/projects/community/locly/components/screens/stores-screen";
import { StoreDetailScreen } from "@/projects/community/locly/components/screens/store-detail-screen";
import { MeetupsScreen } from "@/projects/community/locly/components/screens/meetups-screen";
import { MeetupDetailScreen } from "@/projects/community/locly/components/screens/meetup-detail-screen";
import { CivicScreen } from "@/projects/community/locly/components/screens/civic-screen";
import { SearchScreen } from "@/projects/community/locly/components/screens/search-screen";
import { NotificationsScreen } from "@/projects/community/locly/components/screens/notifications-screen";
import { MypageScreen } from "@/projects/community/locly/components/screens/mypage-screen";
import { AdminScreen } from "@/projects/community/locly/components/screens/admin-screen";

export default function Locly() {
  const [view, setView] = useState<LoclyView>("home");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const navigate: NavigateFn = (nextView, id) => {
    setView(nextView);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="locly flex min-h-dvh flex-col bg-[var(--locly-bg)] text-[var(--locly-ink)]">
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
        {view === "meetupDetail" && <MeetupDetailScreen meetupId={selectedId ?? ""} onNavigate={navigate} />}
        {view === "civic" && <CivicScreen />}
        {view === "search" && <SearchScreen onNavigate={navigate} />}
        {view === "notifications" && <NotificationsScreen />}
        {view === "mypage" && <MypageScreen onNavigate={navigate} />}
        {view === "admin" && <AdminScreen />}
      </main>
    </div>
  );
}
