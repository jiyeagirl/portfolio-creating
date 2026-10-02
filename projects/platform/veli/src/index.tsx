"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/platform/veli/styles/veli.css";
import type { VeliView, NavigateFn } from "@/projects/platform/veli/lib/navigation";
import {
  ALL_VIEWS,
  FULLSCREEN_VIEWS,
  SHEET_PARENT,
  SHEET_TITLE,
} from "@/projects/platform/veli/lib/navigation";
import { MY_SAFE_NUMBERS } from "@/projects/platform/veli/lib/mock-data";
import { Sheet } from "@/projects/platform/veli/components/sheet";
import { LoginScreen } from "@/projects/platform/veli/components/screens/login-screen";
import { HomeScreen } from "@/projects/platform/veli/components/screens/home-screen";
import { NumberDetailScreen } from "@/projects/platform/veli/components/screens/number-detail-screen";
import { CallFlowScreen } from "@/projects/platform/veli/components/screens/call-flow-screen";
import { HistoryScreen } from "@/projects/platform/veli/components/screens/history-screen";
import { CallDetailScreen } from "@/projects/platform/veli/components/screens/call-detail-screen";
import { PassesScreen } from "@/projects/platform/veli/components/screens/passes-screen";
import { PurchaseScreen } from "@/projects/platform/veli/components/screens/purchase-screen";
import { MypageScreen } from "@/projects/platform/veli/components/screens/mypage-screen";
import { ProfileEditScreen } from "@/projects/platform/veli/components/screens/profile-edit-screen";
import { SettingsScreen } from "@/projects/platform/veli/components/screens/settings-screen";
import type { PassTier } from "@/projects/platform/veli/lib/types";

const isTier = (value?: string): value is PassTier =>
  value === "lite" || value === "standard" || value === "premium";

/* 스크린샷 도구용 진입점. `?screen=home` 형태를 읽는다.
   서버 스냅샷을 빈 문자열로 두면 hydration 불일치 없이 클라이언트 값만 반영된다. */
const subscribeToNothing = () => () => {};

/* 아키타입 A2(크리덴셜 월렛)의 셸.

   하단 탭바가 없다. 지갑(홈)은 항상 배경에 살아 있고, 나머지 화면은 그 위로 올라오는
   시트다. 로그인과 통화 플로우만 지갑을 완전히 덮는 전체 화면이다 — 전자는 아직 지갑이
   없는 상태이고, 후자는 실제 통화 중이라 덮는 것이 맞다. */
export default function Veli() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const screen = params.get("screen");
    return {
      view:
        screen && ALL_VIEWS.includes(screen as VeliView) ? (screen as VeliView) : ("login" as VeliView),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [nav, setNav] = useState<{ view: VeliView; id?: string } | null>(null);
  const view = nav?.view ?? initial.view;
  const selectedId = nav ? nav.id : initial.id;

  const navigate: NavigateFn = (nextView, id) => {
    setNav({ view: nextView, id });
  };

  const isFullscreen = FULLSCREEN_VIEWS.includes(view);
  const sheetTitle = SHEET_TITLE[view];
  const sheetParent = SHEET_PARENT[view];

  const screen = (() => {
    switch (view) {
      case "login":
        return <LoginScreen onNavigate={navigate} />;
      case "callFlow":
        return <CallFlowScreen scenario={selectedId} onNavigate={navigate} />;
      case "numberDetail":
        return (
          <NumberDetailScreen
            safeNumberId={selectedId ?? MY_SAFE_NUMBERS[0].id}
            onNavigate={navigate}
          />
        );
      case "history":
        return <HistoryScreen onNavigate={navigate} />;
      case "callDetail":
        return <CallDetailScreen callId={selectedId ?? ""} onNavigate={navigate} />;
      case "passes":
        return <PassesScreen onNavigate={navigate} />;
      case "purchase":
        return (
          <PurchaseScreen tier={isTier(selectedId) ? selectedId : undefined} onNavigate={navigate} />
        );
      case "mypage":
        return <MypageScreen onNavigate={navigate} />;
      case "profileEdit":
        return <ProfileEditScreen onNavigate={navigate} />;
      case "settings":
        return <SettingsScreen onNavigate={navigate} />;
      default:
        return null;
    }
  })();

  return (
    <PhoneFrame
      screenClassName="veli bg-[var(--vl-canvas)] text-[var(--vl-ink)]"
      statusBarClassName="text-[var(--vl-ink)]"
      homeIndicatorClassName="bg-[var(--vl-ink)]/70"
    >
      {isFullscreen ? (
        <div className="min-h-full">{screen}</div>
      ) : (
        <>
          <div className="min-h-full">
            <HomeScreen onNavigate={navigate} />
          </div>

          {/* key로 시트를 뷰마다 remount시킨다 — 시트가 갈릴 때 안쪽 스크롤이
              자동으로 맨 위에서 시작하고, 진입 애니메이션도 다시 재생된다. */}
          {view !== "home" && sheetTitle && (
            <Sheet
              key={`${view}:${selectedId ?? ""}`}
              title={sheetTitle}
              onClose={() => navigate("home")}
              onBack={sheetParent ? () => navigate(sheetParent) : undefined}
            >
              {screen}
            </Sheet>
          )}
        </>
      )}
    </PhoneFrame>
  );
}
