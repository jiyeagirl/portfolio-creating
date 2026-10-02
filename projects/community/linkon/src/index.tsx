"use client";

import { useState } from "react";
import "@/projects/community/linkon/styles/linkon.css";
import type { LinkonView, NavigateFn } from "@/projects/community/linkon/lib/navigation";
import type { FeedPost, Question } from "@/projects/community/linkon/lib/types";
import { CHAT_ROOMS } from "@/projects/community/linkon/lib/mock-data";
import { TopNav } from "@/projects/community/linkon/components/layout/top-nav";
import { SignupScreen } from "@/projects/community/linkon/components/screens/signup-screen";
import { HomeScreen } from "@/projects/community/linkon/components/screens/home-screen";
import { CompaniesScreen } from "@/projects/community/linkon/components/screens/companies-screen";
import { CompanyDetailScreen } from "@/projects/community/linkon/components/screens/company-detail-screen";
import { ChatScreen } from "@/projects/community/linkon/components/screens/chat-screen";
import { FeedScreen } from "@/projects/community/linkon/components/screens/feed-screen";
import { FeedWriteScreen } from "@/projects/community/linkon/components/screens/feed-write-screen";
import { BoardScreen } from "@/projects/community/linkon/components/screens/board-screen";
import { BoardDetailScreen } from "@/projects/community/linkon/components/screens/board-detail-screen";
import { MentorScreen } from "@/projects/community/linkon/components/screens/mentor-screen";
import { MentorDetailScreen } from "@/projects/community/linkon/components/screens/mentor-detail-screen";
import { MentorAskScreen } from "@/projects/community/linkon/components/screens/mentor-ask-screen";

export default function LinkON() {
  const [view, setView] = useState<LinkonView>("home");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [feedDrafts, setFeedDrafts] = useState<FeedPost[]>([]);
  const [questionDrafts, setQuestionDrafts] = useState<Question[]>([]);

  const unreadChats = CHAT_ROOMS.reduce((sum, room) => sum + room.unread, 0);

  const navigate: NavigateFn = (nextView, id) => {
    setView(nextView);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="linkon flex min-h-dvh flex-col bg-[var(--lk-bg)] text-[var(--lk-ink)]">
      <TopNav active={view} unreadChats={unreadChats} onNavigate={navigate} />
      <main className="flex-1">
        {view === "signup" && <SignupScreen onNavigate={navigate} />}
        {view === "home" && <HomeScreen onNavigate={navigate} unreadChats={unreadChats} />}
        {view === "companies" && <CompaniesScreen onNavigate={navigate} initialQuery={selectedId} />}
        {view === "companyDetail" && (
          <CompanyDetailScreen companyId={selectedId ?? ""} onNavigate={navigate} />
        )}
        {view === "chat" && <ChatScreen onNavigate={navigate} initialRoomCompanyId={selectedId} />}
        {view === "feed" && <FeedScreen onNavigate={navigate} drafts={feedDrafts} />}
        {view === "feedWrite" && (
          <FeedWriteScreen
            onNavigate={navigate}
            onPublish={(post) => setFeedDrafts((prev) => [post, ...prev])}
          />
        )}
        {view === "board" && <BoardScreen onNavigate={navigate} />}
        {view === "boardDetail" && (
          <BoardDetailScreen postId={selectedId ?? ""} onNavigate={navigate} />
        )}
        {view === "mentor" && <MentorScreen onNavigate={navigate} drafts={questionDrafts} />}
        {view === "mentorDetail" && (
          <MentorDetailScreen
            questionId={selectedId ?? ""}
            drafts={questionDrafts}
            onNavigate={navigate}
          />
        )}
        {view === "mentorAsk" && (
          <MentorAskScreen
            onNavigate={navigate}
            onPublish={(question) => setQuestionDrafts((prev) => [question, ...prev])}
          />
        )}
      </main>
    </div>
  );
}
