"use client";

import { useSearchParams } from "next/navigation";
import "@/projects/monitoring/taxdesk/styles/taxdesk.css";
import { ResponsiveSite } from "@/components/shared/responsive-site";
import { isSiteScreen, type SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import { SiteApp, type SiteInitial } from "@/projects/monitoring/taxdesk/components/site/site-app";
import { FILING } from "@/projects/monitoring/taxdesk/lib/mock-data";

/* 사용자 웹 엔트리. 관리자 웹은 /monitoring/taxdesk-admin 에서 따로 연다.
   ?screen=apply|documents|sign|status|kakao, 내부 상태는 아래 파라미터로 연다.
   알림톡(kakao)은 모바일 보기(?view=mobile) 전용이라 데스크톱에서는 신고 현황으로 간다. */
function getInitial(params: URLSearchParams): SiteInitial {
  const embedded = params.get("embed") === "1";
  const requested = params.get("screen");
  let screen: SiteScreen = isSiteScreen(requested) ? requested : "apply";
  if (screen === "kakao" && !embedded) screen = "status";

  const stepParam = params.get("step");
  const step = stepParam === null ? null : Math.min(Math.max(Number(stepParam) - 1 || 0, 0), 3);
  const result = params.get("result");

  return {
    screen,
    step,
    modal: params.get("modal") === "signup",
    tab: params.get("tab") === "ai" ? "ai" : "upload",
    pay: params.get("pay") === "vbank" || result === "pending" ? "vbank" : "card",
    result: result === "success" || result === "fail" || result === "pending" ? result : null,
    state: params.get("state") === "done" ? "done" : "supplement",
    // 신고 현황은 목록으로 열린다. filing=<신청번호> 또는 state=를 주면 해당 신고 상세로 바로 연다
    filing: params.get("filing") ?? (params.has("state") ? FILING.id : null),
    open: params.get("open") ?? "",
  };
}

export default function Taxdesk() {
  const params = useSearchParams();
  const initial = getInitial(new URLSearchParams(params.toString()));
  const lock = params.get("screen") === "kakao";

  return (
    <ResponsiveSite
      screenClassName={lock ? "bg-[#1f2b36] text-white" : "bg-white text-[#1d1d1f]"}
      statusBarClassName={lock ? "text-white" : undefined}
      statusTime={lock ? "" : "10:27"}
      homeIndicatorClassName={lock ? "bg-white" : undefined}
    >
      <div className={`taxdesk${params.get("embed") === "1" ? " td-embed" : ""}`}>
        <SiteApp initial={initial} />
      </div>
    </ResponsiveSite>
  );
}
