"use client";

/* CIVICPIN 사용자 앱 엔트리. URL 은 /youngin/real 하나이고, 화면 이동은 전부 내부 상태로
   처리한다(CLAUDE.md "One URL per project"). 관리자 콘솔은 /youngin/real-admin 에 따로 있고
   이 화면 어디에도 관리자 진입점을 두지 않는다. */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/youngin/real/styles/civicpin.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomTabBar } from "@/projects/youngin/real/components/bottom-tab-bar";
import { HomeScreen } from "@/projects/youngin/real/components/screens/home-screen";
import { MapScreen } from "@/projects/youngin/real/components/screens/map-screen";
import { DirectionsScreen } from "@/projects/youngin/real/components/screens/directions-screen";
import { DistrictsScreen } from "@/projects/youngin/real/components/screens/districts-screen";
import { DistrictDetailScreen } from "@/projects/youngin/real/components/screens/district-detail-screen";
import { StoreDetailScreen } from "@/projects/youngin/real/components/screens/store-detail-screen";
import { FestivalsScreen } from "@/projects/youngin/real/components/screens/festivals-screen";
import { FestivalDetailScreen } from "@/projects/youngin/real/components/screens/festival-detail-screen";
import { TAB_ROUTE, tabOf, type Route, type TabKey } from "@/projects/youngin/real/lib/navigation";

/* scripts/capture-screenshot.ts 의 `?screen=` 관례. 파라미터가 필요한 상세 화면은
   대표 레코드 하나를 기본값으로 잡는다. */
const CAPTURE_ROUTE: Record<string, Route> = {
  home: { name: "home" },
  map: { name: "map" },
  districts: { name: "districts" },
  festivals: { name: "festivals" },
  directions: { name: "directions", targetId: "fc-aed-3" },
  district: { name: "districtDetail", districtId: "d-a" },
  /* 사진 없이 구역 지도를 히어로로 쓰는 분기 확인용 */
  "district-map": { name: "districtDetail", districtId: "d-c" },
  store: { name: "storeDetail", storeId: "st-a-09" },
  festival: { name: "festivalDetail", festivalId: "fs-01" },
};

export default function Civicpin() {
  const searchParams = useSearchParams();
  const initial = CAPTURE_ROUTE[searchParams.get("screen") ?? ""] ?? { name: "home" };

  /* 뒤로가기를 위해 얕은 스택 하나만 둔다. 탭을 누르면 스택을 초기화한다. */
  const [stack, setStack] = useState<Route[]>([initial]);
  const route = stack[stack.length - 1];
  const tab = tabOf(route);

  const push = (next: Route) => {
    const nextTab = tabOf(next);
    setStack(nextTab ? [next] : [...stack, next]);
  };
  const back = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  const selectTab = (key: TabKey) => setStack([TAB_ROUTE[key]]);

  return (
    <PhoneFrame
      screenClassName="civicpin bg-[var(--cp-canvas)] text-[var(--cp-ink)]"
      statusBarClassName={route.name === "home" ? "text-white" : "text-[var(--cp-ink)]"}
      homeIndicatorClassName="bg-[var(--cp-ink)]/70"
    >
      <div key={`${route.name}-${stack.length}`} className="h-full cp-screen-in">
        {route.name === "home" && <HomeScreen onNavigate={push} />}
        {route.name === "map" && <MapScreen onNavigate={push} focusId={route.focusId} />}
        {route.name === "districts" && <DistrictsScreen onNavigate={push} />}
        {route.name === "festivals" && <FestivalsScreen onNavigate={push} />}
        {route.name === "directions" && (
          <DirectionsScreen targetId={route.targetId} onNavigate={push} onBack={back} />
        )}
        {route.name === "districtDetail" && (
          <DistrictDetailScreen districtId={route.districtId} onNavigate={push} onBack={back} />
        )}
        {route.name === "storeDetail" && (
          <StoreDetailScreen storeId={route.storeId} onNavigate={push} onBack={back} />
        )}
        {route.name === "festivalDetail" && (
          <FestivalDetailScreen festivalId={route.festivalId} onNavigate={push} onBack={back} />
        )}
      </div>

      {tab && <BottomTabBar active={tab} onSelect={selectTab} />}
    </PhoneFrame>
  );
}
