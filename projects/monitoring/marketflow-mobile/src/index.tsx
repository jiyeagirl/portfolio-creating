"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/monitoring/marketflow-mobile/styles/marketflow-mobile.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/projects/monitoring/marketflow-mobile/components/bottom-nav";
import { HomeScreen } from "@/projects/monitoring/marketflow-mobile/components/screens/home-screen";
import { ApprovalsScreen } from "@/projects/monitoring/marketflow-mobile/components/screens/approvals-screen";
import { ContentReviewScreen } from "@/projects/monitoring/marketflow-mobile/components/screens/content-review-screen";
import { NotificationsScreen } from "@/projects/monitoring/marketflow-mobile/components/screens/notifications-screen";
import { MypageScreen } from "@/projects/monitoring/marketflow-mobile/components/screens/mypage-screen";
import {
  FULLSCREEN,
  TAB_OF_SCREEN,
  type MarketflowMobileScreen,
  type TabKey,
} from "@/projects/monitoring/marketflow-mobile/lib/navigation";
import { adminProfile, contentItems, notifications as initialNotifications } from "@/projects/monitoring/marketflow-mobile/lib/mock-data";
import type { ApprovalStatus, AppNotification, NotificationSettings, ReviewComment } from "@/projects/monitoring/marketflow-mobile/lib/types";

const SCREENS: MarketflowMobileScreen[] = ["home", "approvals", "contentReview", "notifications", "mypage"];

// Lets screenshot tooling (scripts/capture-screenshot.ts) request a specific
// screen via `?screen=<name>`, e.g. /monitoring/marketflow-mobile?screen=contentReview.
// Accepts the kebab-case CLI-friendly spelling too ("content-review"). Read
// once at mount; in-app navigation still drives `screen` afterwards.
function getInitialScreen(param: string | null): MarketflowMobileScreen {
  if (param === "content-review") return "contentReview";
  return SCREENS.includes(param as MarketflowMobileScreen) ? (param as MarketflowMobileScreen) : "home";
}

export default function MarketflowMobile() {
  const searchParams = useSearchParams();
  const initialScreen = getInitialScreen(searchParams.get("screen"));
  const [screen, setScreen] = useState<MarketflowMobileScreen>(initialScreen);
  const [activeContentId, setActiveContentId] = useState<string | null>(
    initialScreen === "contentReview" ? (contentItems[0]?.id ?? null) : null,
  );
  const [returnTab, setReturnTab] = useState<TabKey>("approvals");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApprovalStatus>>({});
  const [commentAppends, setCommentAppends] = useState<Record<string, ReviewComment[]>>({});
  const [notifs, setNotifs] = useState<AppNotification[]>(initialNotifications);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(adminProfile.notificationSettings);

  function navigate(next: MarketflowMobileScreen, contentId?: string) {
    if (next === "contentReview" && contentId) {
      setActiveContentId(contentId);
      setReturnTab(TAB_OF_SCREEN[screen]);
    }
    setScreen(next);
  }

  function getStatus(id: string): ApprovalStatus {
    const item = contentItems.find((c) => c.id === id);
    return statusOverrides[id] ?? item?.status ?? "pending";
  }

  function handleDecision(id: string, decision: ApprovalStatus, comment?: string) {
    setStatusOverrides((prev) => ({ ...prev, [id]: decision }));
    if (comment) {
      const entry: ReviewComment = {
        id: `cmt-${id}-${Date.now()}`,
        author: adminProfile.name,
        createdAt: new Date().toISOString(),
        body: comment,
        kind: decision === "rejected" ? "rejection" : "change-request",
      };
      setCommentAppends((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), entry] }));
    }
  }

  function markNotifRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const pendingCount = contentItems.filter((item) => getStatus(item.id) === "pending").length;
  const unreadCount = notifs.filter((n) => !n.read).length;
  const showTabs = !FULLSCREEN.includes(screen);
  const activeContent = activeContentId ? contentItems.find((c) => c.id === activeContentId) ?? null : null;

  return (
    <PhoneFrame screenClassName="marketflow-mobile bg-[var(--mfm-canvas)] text-[var(--mfm-ink)]">
      <div className="min-h-full">
        {screen === "home" && (
          <HomeScreen
            pendingCount={pendingCount}
            notifications={notifs}
            getStatus={getStatus}
            onNavigate={navigate}
          />
        )}
        {screen === "approvals" && <ApprovalsScreen getStatus={getStatus} onNavigate={navigate} />}
        {screen === "contentReview" && activeContent && (
          <ContentReviewScreen
            key={activeContent.id}
            content={activeContent}
            status={getStatus(activeContent.id)}
            extraComments={commentAppends[activeContent.id] ?? []}
            onDecision={handleDecision}
            onBack={() => navigate(returnTab)}
          />
        )}
        {screen === "notifications" && (
          <NotificationsScreen notifications={notifs} onRead={markNotifRead} onNavigate={navigate} />
        )}
        {screen === "mypage" && <MypageScreen settings={notifSettings} onChangeSettings={setNotifSettings} />}
      </div>

      {showTabs && (
        <BottomNav
          active={TAB_OF_SCREEN[screen]}
          onNavigate={navigate}
          approvalCount={pendingCount}
          unreadCount={unreadCount}
        />
      )}
    </PhoneFrame>
  );
}
