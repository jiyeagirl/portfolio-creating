"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/platform/eduon/styles/eduon.css";
import { StoreProvider } from "@/projects/platform/eduon/lib/store";
import { PLAYBACK_STATES, SITE_SCREENS, SUB_PRESETS, pick, type PlaybackState, type SiteScreen } from "@/projects/platform/eduon/lib/navigation";
import { SiteContext, type GoOptions, type SiteCtx } from "@/projects/platform/eduon/components/site/site-context";
import { SiteHeader } from "@/projects/platform/eduon/components/site/header";
import { DemoTools } from "@/projects/platform/eduon/components/site/demo-tools";
import { useSiteToast } from "@/projects/platform/eduon/components/site/ui";
import { HomeScreen } from "@/projects/platform/eduon/components/site/screens/home-screen";
import { CourseScreen } from "@/projects/platform/eduon/components/site/screens/course-screen";
import { WatchScreen } from "@/projects/platform/eduon/components/site/screens/watch-screen";
import { SubscriptionScreen, type PayStep, type RestoreResult, type StoreStep } from "@/projects/platform/eduon/components/site/screens/subscription-screen";
import { MypageScreen, type MyTab } from "@/projects/platform/eduon/components/site/screens/mypage-screen";
import { MembershipScreen } from "@/projects/platform/eduon/components/site/screens/membership-screen";

/*
 * 사용자 웹. 시작 화면과 상태는 URL에서 고른다 (spec 6번):
 * ?screen=home|course|watch|subscription|mypage|membership (subscription은 메뉴가 아니라 강의 화면의 구독 버튼으로만 들어가는 결제 단계), ?subscription=free|active|cancelled|expired,
 * ?playback=normal|locked|network-error|expired-url|drm-error|denied|unsupported,
 * 화면 내부 상태: ?course=&episode=, ?tab=continue|done|wish,
 * ?pay=form|pending|fail, ?store=sheet|fail, ?restore=success|none|other, ?platform=ios|android, ?from=<강좌 id>
 */

interface Route {
  screen: SiteScreen;
  courseId: string;
  episode: number;
  returnTo?: GoOptions["returnTo"];
  anchor?: "explore";
  n: number;
}

export function SiteApp() {
  const params = useSearchParams();
  const subPreset = pick(SUB_PRESETS, params.get("subscription"));
  return (
    <StoreProvider subPreset={subPreset}>
      <Site params={params} />
    </StoreProvider>
  );
}

function Site({ params }: { params: URLSearchParams }) {
  const initialPlayback = pick(PLAYBACK_STATES, params.get("playback")) ?? "normal";
  const from = params.get("from");
  const [route, setRoute] = useState<Route>(() => ({
    screen: pick(SITE_SCREENS, params.get("screen")) ?? "home",
    courseId: params.get("course") ?? "c01",
    /* 구독 안내(locked) 시연은 미리보기 다음 회차에서 시작한다 */
    episode: Number(params.get("episode")) || (initialPlayback === "locked" ? 2 : 1),
    returnTo: from ? { courseId: from, episode: 2 } : undefined,
    n: 0,
  }));
  const [query, setQuery] = useState("");
  const [playback, setPlayback] = useState<PlaybackState>(initialPlayback === "locked" ? "normal" : initialPlayback);
  const inApp = params.get("embed") === "1";
  const { show, node: toastNode } = useSiteToast();

  const go = useCallback((screen: SiteScreen, opts: GoOptions = {}) => {
    setRoute((r) => ({
      screen,
      courseId: opts.courseId ?? r.courseId,
      episode: opts.episode ?? 1,
      returnTo: opts.returnTo,
      anchor: opts.anchor,
      n: r.n + 1,
    }));
    if (screen !== "watch") setPlayback("normal");
    if (!opts.anchor) window.scrollTo({ top: 0 });
  }, []);

  const ctx = useMemo<SiteCtx>(
    () => ({ screen: route.screen, go, openCourse: (courseId: string) => go("course", { courseId }), query, setQuery, playback, setPlayback, inApp, toast: show }),
    [route.screen, go, query, playback, inApp, show],
  );

  return (
    <SiteContext.Provider value={ctx}>
      <div className="eduon min-h-[100dvh]">
        <SiteHeader />
        <main key={`${route.screen}-${route.n}`} className="eo-fade">
          {route.screen === "home" && <HomeScreen anchor={route.anchor} />}
          {route.screen === "course" && <CourseScreen courseId={route.courseId} />}
          {route.screen === "watch" && <WatchScreen courseId={route.courseId} episode={route.episode} />}
          {route.screen === "subscription" && (
            <SubscriptionScreen
              returnTo={route.returnTo}
              initialPay={route.n === 0 ? ((params.get("pay") as PayStep) ?? "idle") : "idle"}
              initialStore={route.n === 0 ? ((params.get("store") as StoreStep) ?? "idle") : "idle"}
              initialRestore={route.n === 0 ? (params.get("restore") as RestoreResult | null) : null}
              platform={params.get("platform") === "android" ? "android" : "ios"}
            />
          )}
          {route.screen === "mypage" && (
            <MypageScreen initialTab={route.n === 0 && ["done", "wish"].includes(params.get("tab") ?? "") ? (params.get("tab") as MyTab) : "continue"} />
          )}
          {route.screen === "membership" && <MembershipScreen />}
        </main>
        {!inApp && <DemoTools />}
        {toastNode}
      </div>
    </SiteContext.Provider>
  );
}
