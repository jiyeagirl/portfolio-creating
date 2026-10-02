"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/youngin/safe/styles/safe.css";
import { GameScreen } from "@/projects/youngin/safe/components/screens/game-screen";
import { MissionSelectScreen } from "@/projects/youngin/safe/components/screens/mission-select-screen";
import { ReportScreen } from "@/projects/youngin/safe/components/screens/report-screen";
import { SAMPLE_RESULT } from "@/projects/youngin/safe/lib/scoring";
import type { MissionResult } from "@/projects/youngin/safe/lib/scoring";
import type { ScreenKey } from "@/projects/youngin/safe/lib/types";

const SCREEN_KEYS: ScreenKey[] = ["select", "game", "report"];

/* 스크린샷 도구가 넘기는 `?screen=` 값을 읽는다. 서버 스냅샷을 빈 값으로 두면
   hydration 불일치 없이 클라이언트에서만 반영된다. */
const subscribeToNothing = () => () => {};

export default function Safe() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );

  const initialScreen = useMemo<ScreenKey>(() => {
    const requested = new URLSearchParams(search).get("screen");
    return SCREEN_KEYS.includes(requested as ScreenKey) ? (requested as ScreenKey) : "select";
  }, [search]);

  const [screen, setScreen] = useState<ScreenKey | null>(null);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [runId, setRunId] = useState(0);
  const [reportHeroVisible, setReportHeroVisible] = useState(true);

  const active = screen ?? initialScreen;
  /* 게임 화면은 항상, 리포트는 딥 히어로가 상태바 아래 남아 있는 동안만 잉크를 뒤집는다.
     스크롤해서 종이 캔버스가 올라오면 다시 어두운 잉크로 돌아간다. */
  const darkStatusBar = active === "game" || (active === "report" && reportHeroVisible);

  /* 게임을 거치지 않고 리포트만 열었을 때도 화면이 비지 않도록 표준 기록을 쓴다. */
  const shownResult = result ?? SAMPLE_RESULT;

  const startGame = () => {
    setResult(null);
    setRunId((n) => n + 1);
    setScreen("game");
  };

  return (
    <PhoneFrame
      screenClassName="safe bg-[var(--sf-canvas)] text-[var(--sf-ink)]"
      statusBarClassName={darkStatusBar ? "text-[#F1EFE8]" : "text-[#171512]"}
      homeIndicatorClassName={active === "game" ? "bg-white/45" : "bg-black/25"}
    >
      {active === "select" && <MissionSelectScreen onStart={startGame} />}

      {active === "game" && (
        <GameScreen
          key={runId}
          onExit={() => setScreen("select")}
          onFinish={(missionResult) => {
            setResult(missionResult);
            setScreen("report");
          }}
        />
      )}

      {active === "report" && (
        <ReportScreen
          result={shownResult}
          onRetry={startGame}
          onOther={() => setScreen("select")}
          onHeroVisibleChange={setReportHeroVisible}
        />
      )}
    </PhoneFrame>
  );
}
