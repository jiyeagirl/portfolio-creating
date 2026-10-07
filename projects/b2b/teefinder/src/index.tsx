"use client";

import { useSearchParams } from "next/navigation";
import "@/projects/b2b/teefinder/styles/teefinder.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { StoreProvider } from "@/projects/b2b/teefinder/lib/store";
import { isAppScreen } from "@/projects/b2b/teefinder/lib/navigation";
import { AppShell, resolveInitial } from "@/projects/b2b/teefinder/components/app/app-shell";
import type { MemberStatus } from "@/projects/b2b/teefinder/lib/types";

/* 회원 앱 전용 엔트리. 관리자 웹은 /b2b/teefinder-admin 에서 따로 연다.
   ?screen=<앱 화면> 으로 시작 화면을, ?step= 으로 웹뷰 진행 단계(0~3)를 정한다. */
export default function Teefinder() {
  const params = useSearchParams();
  const requested = params.get("screen");
  const step = Math.min(Math.max(Number(params.get("step") ?? 0) || 0, 0), 3);

  const appScreen = isAppScreen(requested) ? requested : null;
  const initial = resolveInitial(appScreen, step);

  let initialSession: string | null = "m01";
  let initialStatus: MemberStatus | undefined;
  if (appScreen === "login" || appScreen === "signup") initialSession = null;
  if (appScreen === "pending") initialStatus = "승인 대기";
  if (appScreen === "rejected") initialStatus = "반려";

  return (
    <StoreProvider initialSession={initialSession} initialStatus={initialStatus}>
      <PhoneFrame
        screenClassName="teefinder bg-[var(--tf-canvas)] text-[var(--tf-ink)]"
        statusBarClassName="text-[var(--tf-ink)]"
        homeIndicatorClassName="bg-[var(--tf-ink)]/85"
      >
        <AppShell initial={initial} />
      </PhoneFrame>
    </StoreProvider>
  );
}
