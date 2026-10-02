"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/platform/lumi/styles/lumi.css";
import type { LumiView, NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import { TAB_OF_VIEW } from "@/projects/platform/lumi/lib/navigation";
import type { PassTier } from "@/projects/platform/lumi/lib/types";
import {
  CONSULTATIONS,
  FAVORITE_IDS,
  OWNED_PASSES,
} from "@/projects/platform/lumi/lib/mock-data";
import { BottomNav } from "@/projects/platform/lumi/components/bottom-nav";
import { HomeScreen } from "@/projects/platform/lumi/components/screens/home-screen";
import { ExpertsScreen } from "@/projects/platform/lumi/components/screens/experts-screen";
import { ExpertDetailScreen } from "@/projects/platform/lumi/components/screens/expert-detail-screen";
import { PassesScreen } from "@/projects/platform/lumi/components/screens/passes-screen";
import { PurchaseScreen } from "@/projects/platform/lumi/components/screens/purchase-screen";
import { BookingScreen } from "@/projects/platform/lumi/components/screens/booking-screen";
import { CallScreen } from "@/projects/platform/lumi/components/screens/call-screen";
import { HistoryScreen } from "@/projects/platform/lumi/components/screens/history-screen";
import { ReviewWriteScreen } from "@/projects/platform/lumi/components/screens/review-write-screen";
import { MypageScreen } from "@/projects/platform/lumi/components/screens/mypage-screen";
import { FavoritesScreen } from "@/projects/platform/lumi/components/screens/favorites-screen";
import { PaymentsScreen } from "@/projects/platform/lumi/components/screens/payments-screen";
import { ProfileEditScreen } from "@/projects/platform/lumi/components/screens/profile-edit-screen";

const TAB_ROOTS: LumiView[] = ["home", "experts", "passes", "history", "mypage"];

const isTier = (value?: string): value is PassTier =>
  value === "lite" || value === "standard" || value === "premium";

/* 스크린샷 도구용 진입점. `?screen=expertDetail&id=baekdam` 형태를 읽는다.
   서버 스냅샷을 빈 문자열로 두면 hydration 불일치 없이 클라이언트 값만 반영된다. */
const subscribeToNothing = () => () => {};

export default function Lumi() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const screen = params.get("screen");
    return {
      view: screen && screen in TAB_OF_VIEW ? (screen as LumiView) : ("home" as LumiView),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [nav, setNav] = useState<{ view: LumiView; id?: string } | null>(null);
  const view = nav?.view ?? initial.view;
  const selectedId = nav ? nav.id : initial.id;
  const [favorites, setFavorites] = useState<string[]>(FAVORITE_IDS);
  const [tier, setTier] = useState<PassTier>("standard");
  const [passCounts, setPassCounts] = useState<Record<PassTier, number>>(() =>
    OWNED_PASSES.reduce(
      (acc, pass) => ({ ...acc, [pass.tier]: pass.count }),
      { lite: 0, standard: 0, premium: 0 } as Record<PassTier, number>,
    ),
  );
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [callIsDark, setCallIsDark] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  /* 화면을 바꾸면 기기 안쪽 스크롤을 맨 위로 되돌린다. */
  useEffect(() => {
    rootRef.current?.parentElement?.scrollTo({ top: 0, behavior: "auto" });
  }, [view, selectedId]);

  const navigate: NavigateFn = (nextView, id) => {
    if (nextView !== "call") setCallIsDark(false);
    setNav({ view: nextView, id });
  };

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const upcomingCount = CONSULTATIONS.filter((c) => c.status === "upcoming").length;
  const showTabs = TAB_ROOTS.includes(view);
  /* 어두운 사진이나 밤 배경이 화면 맨 위를 덮는 화면은 상태바를 흰색으로 바꾼다. */
  const darkHeader = callIsDark || view === "mypage";

  return (
    <PhoneFrame
      screenClassName="lumi bg-[var(--lm-canvas)] text-[var(--lm-ink)]"
      statusBarClassName={darkHeader ? "text-white" : "text-[var(--lm-ink)]"}
      homeIndicatorClassName={callIsDark ? "bg-white/70" : "bg-[var(--lm-ink)]/70"}
    >
      <div
        ref={rootRef}
        className={`min-h-full ${callIsDark ? "bg-[var(--lm-night)]" : ""}`}
      >
        {view === "home" && <HomeScreen onNavigate={navigate} />}

        {view === "experts" && (
          <ExpertsScreen
            key={selectedId ?? "all"}
            onNavigate={navigate}
            initialFilter={selectedId}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {view === "expertDetail" && (
          <ExpertDetailScreen
            expertId={selectedId ?? ""}
            onNavigate={navigate}
            liked={favorites.includes(selectedId ?? "")}
            onToggleFavorite={() => toggleFavorite(selectedId ?? "")}
            selectedTier={tier}
            onSelectTier={setTier}
          />
        )}

        {view === "passes" && <PassesScreen onNavigate={navigate} />}

        {view === "purchase" && (
          <PurchaseScreen
            tier={isTier(selectedId) ? selectedId : tier}
            onNavigate={navigate}
            onPurchase={(bought, quantity) =>
              setPassCounts((prev) => ({ ...prev, [bought]: prev[bought] + quantity }))
            }
          />
        )}

        {view === "booking" && (
          <BookingScreen
            expertId={selectedId ?? ""}
            onNavigate={navigate}
            selectedTier={tier}
            onSelectTier={setTier}
            ownedCount={(key) => passCounts[key]}
            onConfirm={(used) =>
              setPassCounts((prev) => ({ ...prev, [used]: Math.max(0, prev[used] - 1) }))
            }
          />
        )}

        {view === "call" && (
          <CallScreen
            expertId={selectedId ?? ""}
            tier={tier}
            onNavigate={navigate}
            onDarkPhaseChange={setCallIsDark}
          />
        )}

        {view === "history" && (
          <HistoryScreen onNavigate={navigate} reviewedIds={reviewedIds} />
        )}

        {view === "reviewWrite" && (
          <ReviewWriteScreen
            expertId={selectedId ?? ""}
            onNavigate={navigate}
            onSubmit={(id) => setReviewedIds((prev) => [...prev, id])}
          />
        )}

        {view === "mypage" && (
          <MypageScreen onNavigate={navigate} favoriteCount={favorites.length} />
        )}

        {view === "favorites" && (
          <FavoritesScreen
            favorites={favorites}
            onNavigate={navigate}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {view === "payments" && <PaymentsScreen onNavigate={navigate} />}

        {view === "profileEdit" && <ProfileEditScreen onNavigate={navigate} />}
      </div>

      {showTabs && (
        <BottomNav active={TAB_OF_VIEW[view]} badge={upcomingCount} onNavigate={navigate} />
      )}
    </PhoneFrame>
  );
}
