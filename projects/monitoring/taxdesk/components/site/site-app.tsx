"use client";

import { useState } from "react";
import { MotionConfig, motion } from "motion/react";
import type { SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import { SiteFooter, SiteHeader } from "@/projects/monitoring/taxdesk/components/site/site-chrome";
import { ApplyScreen } from "@/projects/monitoring/taxdesk/components/site/screens/apply-screen";
import { DocumentsScreen } from "@/projects/monitoring/taxdesk/components/site/screens/documents-screen";
import {
  SignScreen,
  type PayMethod,
  type PayResult,
} from "@/projects/monitoring/taxdesk/components/site/screens/sign-screen";
import { StatusScreen, type StatusState } from "@/projects/monitoring/taxdesk/components/site/screens/status-screen";
import { KakaoScreen } from "@/projects/monitoring/taxdesk/components/site/screens/kakao-screen";

export type SiteInitial = {
  screen: SiteScreen;
  step: number | null;
  modal: boolean;
  tab: "ai" | "upload";
  pay: PayMethod;
  result: PayResult;
  state: StatusState;
  filing: string | null;
  open: string;
};

export function SiteApp({ initial }: { initial: SiteInitial }) {
  const [screen, setScreen] = useState<SiteScreen>(initial.screen);
  const [signedIn, setSignedIn] = useState(!(initial.screen === "apply" && initial.step === null));
  const [visit, setVisit] = useState(0);

  function navigate(next: SiteScreen) {
    setScreen(next);
    setVisit((v) => v + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  // 처음 진입한 화면만 쿼리의 내부 상태를 쓰고, 이동한 뒤에는 기본 상태로 연다
  const fresh = visit === 0;

  // reduced motion에서는 transform 계열 애니메이션이 꺼지고 투명도만 남는다
  if (screen === "kakao")
    return (
      <MotionConfig reducedMotion="user">
        <KakaoScreen initialOpen={initial.open} onNavigate={navigate} />
      </MotionConfig>
    );

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader
        screen={screen}
        signedIn={signedIn}
        onNavigate={navigate}
        onSignIn={() => navigate("apply")}
      />
      <motion.main
        key={`${screen}-${visit}`}
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", visualDuration: 0.3, bounce: 0 }}
      >
        {screen === "apply" && (
          <ApplyScreen
            initialStep={fresh ? initial.step : signedIn ? 0 : null}
            initialModal={fresh && initial.modal}
            onNavigate={navigate}
            onSignedIn={() => setSignedIn(true)}
          />
        )}
        {screen === "documents" && <DocumentsScreen initialTab={fresh ? initial.tab : "upload"} onNavigate={navigate} />}
        {screen === "sign" && (
          <SignScreen
            initialPay={fresh ? initial.pay : "card"}
            initialResult={fresh ? initial.result : null}
            onNavigate={navigate}
          />
        )}
        {screen === "status" && (
          <StatusScreen
            state={fresh ? initial.state : "supplement"}
            initialFiling={fresh ? initial.filing : null}
            onNavigate={navigate}
          />
        )}
      </motion.main>
      <SiteFooter />
    </div>
    </MotionConfig>
  );
}
