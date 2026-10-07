"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { StoreProvider, useStore } from "@/projects/platform/drawqty/lib/store";
import { isSiteScreen, STEPS, type SiteScreen } from "@/projects/platform/drawqty/lib/navigation";
import { FLOORS } from "@/projects/platform/drawqty/lib/plan-data";
import { SiteHeader } from "@/projects/platform/drawqty/components/site/header";
import { Stepper } from "@/projects/platform/drawqty/components/site/stepper";
import { UploadScreen, type UploadPhase } from "@/projects/platform/drawqty/components/site/screens/upload-screen";
import { ReviewScreen } from "@/projects/platform/drawqty/components/site/screens/review-screen";
import { ResultScreen } from "@/projects/platform/drawqty/components/site/screens/result-screen";
import { QuoteScreen } from "@/projects/platform/drawqty/components/site/screens/quote-screen";
import type { FloorId } from "@/projects/platform/drawqty/lib/types";

/* ?screen=upload|review|result|quote 로 첫 화면을 고른다.
   ?state=filled|analyzing(&step=1)|done|toast, ?floor=2F, ?edit=<구간 id>, ?add=1 은 스크린샷으로 확인할 내부 상태. */
export function SiteApp() {
  const params = useSearchParams();
  const requested = params.get("screen");
  const initial: SiteScreen = isSiteScreen(requested) ? requested : "upload";
  const state = params.get("state");
  const withSample = initial !== "upload" || state === "filled" || state === "analyzing";

  return (
    <StoreProvider withSample={withSample}>
      <SiteBody initial={initial} state={state} params={params} />
    </StoreProvider>
  );
}

function SiteBody({
  initial,
  state,
  params,
}: {
  initial: SiteScreen;
  state: string | null;
  params: URLSearchParams;
}) {
  const { file, resetSession } = useStore();
  const [screen, setScreen] = useState<SiteScreen>(initial);
  const [reached, setReached] = useState(STEPS.findIndex((s) => s.key === initial));
  const [uploadInit, setUploadInit] = useState<UploadPhase | null>(
    state === "filled" ? "ready" : state === "analyzing" ? "analyzing" : null,
  );

  const floorParam = params.get("floor") as FloorId | null;
  const initialFloor = floorParam && FLOORS.includes(floorParam) ? floorParam : "1F";

  function go(next: SiteScreen) {
    setScreen(next);
    setReached((r) => Math.max(r, STEPS.findIndex((s) => s.key === next)));
    setUploadInit(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <div className="drawqty flex min-h-dvh flex-col bg-[var(--dq-surface)] text-[var(--dq-ink)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 pb-0 pt-6 sm:px-8 sm:pt-8">
        <Stepper current={screen} reached={reached} onGo={go} />
        <div className="mt-6 pb-10 sm:mt-8">
          {screen === "upload" && (
            <UploadScreen
              key={`upload-${uploadInit}`}
              initialPhase={uploadInit ?? (file ? "ready" : "empty")}
              freezeStep={uploadInit === "analyzing" ? Number(params.get("step") ?? 1) : undefined}
              onDone={() => go("review")}
            />
          )}
          {screen === "review" && (
            <ReviewScreen
              initialFloor={initialFloor}
              initialSelected={params.get("edit")}
              initialAdding={params.get("add") === "1"}
              onBack={() => go("upload")}
              onNext={() => go("result")}
            />
          )}
          {screen === "result" && (
            <ResultScreen initialToast={state === "toast"} onBack={() => go("review")} onNext={() => go("quote")} />
          )}
          {screen === "quote" && (
            <QuoteScreen
              initialReceipt={state === "done" ? "DQ-20261007-005" : null}
              onBack={() => go("result")}
              onNewUpload={() => {
                resetSession();
                setReached(0);
                go("upload");
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
