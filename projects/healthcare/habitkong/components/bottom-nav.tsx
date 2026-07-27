"use client";

import { ChartBar, House, UserCircle } from "@phosphor-icons/react";
import type {
  HabitkongNavigate,
  HabitkongScreen,
} from "@/projects/healthcare/habitkong/lib/navigation";

export function BottomNav({
  active,
  onNavigate,
}: {
  active: HabitkongScreen;
  onNavigate: HabitkongNavigate;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#F1E7DF] bg-white/95 pb-8 pt-2.5 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onNavigate("home")}
        className={`flex flex-col items-center gap-1 px-5 py-1 transition-colors ${
          active === "home" ? "text-[#FF6F4D]" : "text-[#C9C0B8]"
        }`}
      >
        <House size={22} weight={active === "home" ? "fill" : "regular"} />
        <span className="text-[11px] font-medium">홈</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate("stats")}
        className={`flex flex-col items-center gap-1 px-5 py-1 transition-colors ${
          active === "stats" ? "text-[#FF6F4D]" : "text-[#C9C0B8]"
        }`}
      >
        <ChartBar size={22} weight={active === "stats" ? "fill" : "regular"} />
        <span className="text-[11px] font-medium">통계</span>
      </button>

      <div className="flex flex-col items-center gap-1 px-5 py-1 text-[#C9C0B8]">
        <UserCircle size={22} weight="regular" />
        <span className="text-[11px] font-medium">마이페이지</span>
      </div>
    </nav>
  );
}
