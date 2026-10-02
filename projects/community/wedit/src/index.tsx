"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/community/wedit/styles/wedit.css";
import { BottomNav } from "@/projects/community/wedit/components/bottom-nav";
import { HomeScreen } from "@/projects/community/wedit/components/screens/home-screen";
import { ExploreScreen } from "@/projects/community/wedit/components/screens/explore-screen";
import { CompareScreen } from "@/projects/community/wedit/components/screens/compare-screen";
import { VendorDetailScreen } from "@/projects/community/wedit/components/screens/vendor-detail-screen";
import { VerifyUploadScreen } from "@/projects/community/wedit/components/screens/verify-upload-screen";
import { CommunityScreen } from "@/projects/community/wedit/components/screens/community-screen";
import { PostDetailScreen } from "@/projects/community/wedit/components/screens/post-detail-screen";
import { PostWriteScreen } from "@/projects/community/wedit/components/screens/post-write-screen";
import { ReviewsScreen } from "@/projects/community/wedit/components/screens/reviews-screen";
import { MypageScreen } from "@/projects/community/wedit/components/screens/mypage-screen";
import { MyVerificationsScreen } from "@/projects/community/wedit/components/screens/my-verifications-screen";
import { MyReviewsScreen } from "@/projects/community/wedit/components/screens/my-reviews-screen";
import { BookmarksScreen } from "@/projects/community/wedit/components/screens/bookmarks-screen";
import { ActivityScreen } from "@/projects/community/wedit/components/screens/activity-screen";
import { SupportScreen } from "@/projects/community/wedit/components/screens/support-screen";
import { AccountScreen } from "@/projects/community/wedit/components/screens/account-screen";
import type { NavigateParams, TabKey, View } from "@/projects/community/wedit/lib/navigation";

const VIEW_KEYS: View[] = [
  "home",
  "explore",
  "reviews",
  "community",
  "mypage",
  "vendorDetail",
  "compare",
  "verifyUpload",
  "postDetail",
  "postWrite",
  "myVerifications",
  "myReviews",
  "bookmarks",
  "activity",
  "support",
  "account",
];

const TAB_VIEWS: View[] = ["home", "explore", "reviews", "community", "mypage"];

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function Wedit() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initialView = useMemo<View>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return VIEW_KEYS.includes(requested as View) ? (requested as View) : "home";
  }, [search]);

  const [view, setView] = useState<View | null>(null);
  const [params, setParams] = useState<NavigateParams>({});
  const active = view ?? initialView;
  const showTabs = TAB_VIEWS.includes(active);

  const navigate = (nextView: View, nextParams: NavigateParams = {}) => {
    setView(nextView);
    setParams(nextParams);
  };

  return (
    <PhoneFrame screenClassName="wedit bg-[var(--wd-canvas)] text-[var(--wd-ink)]">
      {active === "home" && <HomeScreen onNavigate={navigate} />}
      {active === "explore" && (
        <ExploreScreen onNavigate={navigate} initialCategory={params.category} />
      )}
      {active === "reviews" && <ReviewsScreen onNavigate={navigate} />}
      {active === "community" && <CommunityScreen onNavigate={navigate} />}
      {active === "mypage" && <MypageScreen onNavigate={navigate} />}
      {active === "vendorDetail" && (
        <VendorDetailScreen onNavigate={navigate} vendorId={params.id ?? ""} />
      )}
      {active === "compare" && <CompareScreen onNavigate={navigate} ids={params.ids ?? []} />}
      {active === "verifyUpload" && <VerifyUploadScreen onNavigate={navigate} />}
      {active === "postDetail" && (
        <PostDetailScreen onNavigate={navigate} postId={params.id ?? ""} />
      )}
      {active === "postWrite" && <PostWriteScreen onNavigate={navigate} />}
      {active === "myVerifications" && <MyVerificationsScreen onNavigate={navigate} />}
      {active === "myReviews" && <MyReviewsScreen onNavigate={navigate} />}
      {active === "bookmarks" && <BookmarksScreen onNavigate={navigate} />}
      {active === "activity" && <ActivityScreen onNavigate={navigate} />}
      {active === "support" && <SupportScreen onNavigate={navigate} />}
      {active === "account" && <AccountScreen onNavigate={navigate} />}

      {showTabs && <BottomNav active={active as TabKey} onNavigate={navigate} />}
    </PhoneFrame>
  );
}
