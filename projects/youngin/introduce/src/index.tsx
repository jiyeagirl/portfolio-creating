"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/youngin/introduce/styles/introduce.css";
import type { FloorId } from "@/projects/youngin/introduce/lib/types";
import type { NavigateFn, View } from "@/projects/youngin/introduce/lib/navigation";
import { LobbyScreen } from "@/projects/youngin/introduce/components/screens/lobby-screen";
import { FloorScreen } from "@/projects/youngin/introduce/components/screens/floor-screen";
import { ServiceScreen } from "@/projects/youngin/introduce/components/screens/service-screen";
import { TabBar } from "@/projects/youngin/introduce/components/tab-bar";
import { AmenitySheet } from "@/projects/youngin/introduce/components/amenity-sheet";
import { SPRING } from "@/projects/youngin/introduce/components/ui";

/* One URL per project, so every screen change is component state and the
   whole app lives inside a single PhoneFrame (CLAUDE.md). */

const VIEWS: View[] = ["lobby", "floor", "service"];

/* Screenshot capture convention (scripts/capture-screenshot.ts): the initial
   screen comes from `?screen=<view>`, with `?floor=`, `?facility=` and
   `?service=` selecting what that screen opens on. Read once at mount;
   in-app navigation drives everything after that. */
function initialView(param: string | null): View {
  return VIEWS.includes(param as View) ? (param as View) : "lobby";
}

function initialFloor(param: string | null): FloorId {
  const n = Number(param);
  return n === 2 || n === 3 ? (n as FloorId) : 1;
}

export default function YounginIntroduce() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>(() => initialView(searchParams.get("screen")));
  const [floor, setFloor] = useState<FloorId>(() => initialFloor(searchParams.get("floor")));
  const [facilityId, setFacilityId] = useState<string | undefined>(
    () => searchParams.get("facility") ?? undefined
  );
  const [serviceId, setServiceId] = useState<string>(
    () => searchParams.get("service") ?? "resident-copy"
  );
  const [amenityOpen, setAmenityOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const navigate: NavigateFn = (next, options) => {
    if (options?.floor) setFloor(options.floor);
    if (options?.serviceId) setServiceId(options.serviceId);
    setFacilityId(next === "floor" ? options?.facilityId : undefined);
    setAmenityOpen(false);
    setView(next);
  };

  /* Dark hero on the lobby, and a dimmed scrim under any sheet, both want
     white status bar glyphs. */
  const lightStatusBar = view === "lobby" || amenityOpen || detailSheetOpen;

  return (
    <PhoneFrame
      screenClassName="bg-[#F4F7FB] text-[#0F2338]"
      statusBarClassName={lightStatusBar ? "text-white" : "text-[#0F2338]"}
      homeIndicatorClassName="bg-[#0F2338]/75"
    >
      <div className="yi relative flex h-full flex-col overflow-hidden bg-[var(--yi-canvas)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view === "service" ? `service-${serviceId}` : view}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={SPRING}
            className="flex min-h-0 flex-1 flex-col"
          >
            {view === "lobby" && (
              <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <LobbyScreen onNavigate={navigate} onOpenAmenities={() => setAmenityOpen(true)} />
              </div>
            )}

            {view === "floor" && (
              <FloorScreen
                floorId={floor}
                selectedId={facilityId}
                onNavigate={navigate}
                onChangeFloor={(next) => {
                  setFloor(next);
                  setFacilityId(undefined);
                }}
                onSelectFacility={setFacilityId}
              />
            )}

            {view === "service" && (
              <ServiceScreen
                serviceId={serviceId}
                onNavigate={navigate}
                onSheetChange={setDetailSheetOpen}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {view !== "service" && (
          <TabBar
            active={amenityOpen ? "amenity" : view === "floor" ? "floor" : "lobby"}
            onSelect={(tab) => {
              if (tab === "amenity") {
                setAmenityOpen(true);
                return;
              }
              setAmenityOpen(false);
              navigate(tab === "floor" ? "floor" : "lobby", { floor });
            }}
          />
        )}

        <AmenitySheet
          open={amenityOpen}
          onClose={() => setAmenityOpen(false)}
          onGo={(nextFloor, nextFacility) => {
            setAmenityOpen(false);
            navigate("floor", { floor: nextFloor, facilityId: nextFacility });
          }}
        />
      </div>
    </PhoneFrame>
  );
}
