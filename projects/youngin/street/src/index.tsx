"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Camera, ClipboardText, MapTrifold } from "@phosphor-icons/react";
import { PhoneFrame } from "@/components/shared/phone-frame";

import "@/projects/youngin/street/styles/street.css";
import { MapScreen } from "@/projects/youngin/street/components/screens/map-screen";
import { ReportScreen } from "@/projects/youngin/street/components/screens/report-screen";
import { StatusScreen } from "@/projects/youngin/street/components/screens/status-screen";
import { TabBar } from "@/projects/youngin/street/components/ui";
import type { ScreenKey } from "@/projects/youngin/street/lib/types";

const SCREEN_KEYS: ScreenKey[] = ["map", "report", "status"];

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function Street() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initialScreen = useMemo<ScreenKey>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return SCREEN_KEYS.includes(requested as ScreenKey) ? (requested as ScreenKey) : "map";
  }, [search]);

  /* 접수 직후 상태는 제보하기 화면을 거쳐야만 나오므로, 스크린샷 도구가 곧바로
     찍을 수 있도록 `?screen=status&submitted=1`도 받는다. */
  const initialSubmitted = useMemo(
    () => new URLSearchParams(search).get("submitted") === "1",
    [search],
  );

  const [screen, setScreen] = useState<ScreenKey | null>(null);
  /* 제보 화면의 사진 히어로가 상태바 아래에 남아 있는 동안만 잉크를 밝게 쓴다.
     스크롤해서 흰 폼이 올라오면 어두운 잉크로 되돌린다. */
  const [reportHeroVisible, setReportHeroVisible] = useState(true);
  /* 제보하기 화면을 거쳐 넘어왔을 때만 접수 완료 안내를 얹는다. 탭으로 들어오면
     평소의 내 제보 목록 화면이다. */
  const [submitted, setSubmitted] = useState<boolean | null>(null);

  const active = screen ?? initialScreen;
  const justSubmitted = submitted ?? initialSubmitted;

  return (
    <PhoneFrame
      screenClassName="street bg-[var(--st-canvas)] text-[var(--st-ink)]"
      statusBarClassName={
        active === "report" && reportHeroVisible ? "text-[#FFFFFF]" : "text-[#1D1D1F]"
      }
      homeIndicatorClassName="bg-black/25"
    >
      {active === "map" && (
        <MapScreen
          onReport={() => {
            setSubmitted(false);
            setScreen("report");
          }}
        />
      )}

      {active === "report" && (
        <ReportScreen
          onBack={() => setScreen("map")}
          onHeroVisibleChange={setReportHeroVisible}
          onSubmit={() => {
            setSubmitted(true);
            setScreen("status");
          }}
        />
      )}

      {active === "status" && (
        <StatusScreen justSubmitted={justSubmitted} onGoMap={() => setScreen("map")} />
      )}

      {active !== "report" && (
        <TabBar
          active={active}
          onSelect={(key) => {
            if (key === "report") {
              setSubmitted(false);
              setScreen("report");
              return;
            }
            setSubmitted(false);
            setScreen(key as ScreenKey);
          }}
          items={[
            {
              key: "map",
              label: "위험 지도",
              icon: <MapTrifold size={23} />,
              activeIcon: <MapTrifold size={23} weight="fill" />,
            },
            {
              key: "report",
              label: "제보하기",
              icon: <Camera size={23} />,
              activeIcon: <Camera size={23} weight="fill" />,
            },
            {
              key: "status",
              label: "내 제보",
              icon: <ClipboardText size={23} />,
              activeIcon: <ClipboardText size={23} weight="fill" />,
            },
          ]}
        />
      )}
    </PhoneFrame>
  );
}
