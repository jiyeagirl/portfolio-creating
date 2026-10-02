"use client";

import { Camera, House, Sliders, Gear } from "@phosphor-icons/react";
import type { ColorRecipeNavigate, ColorRecipeScreen } from "@/projects/camera/colorrecipe/lib/navigation";

const TABS: { id: ColorRecipeScreen; label: string; icon: typeof House }[] = [
  { id: "home", label: "홈", icon: House },
  { id: "camera", label: "카메라", icon: Camera },
  { id: "recipes", label: "레시피", icon: Sliders },
  { id: "settings", label: "설정", icon: Gear },
];

export function BottomTabBar({
  active,
  onNavigate,
}: {
  active: ColorRecipeScreen;
  onNavigate: ColorRecipeNavigate;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-[var(--cr-border)] bg-[var(--cr-bg)] pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className="flex h-11 w-16 flex-col items-center justify-center gap-1"
            aria-label={tab.label}
          >
            <Icon
              size={20}
              weight={isActive ? "fill" : "regular"}
              className={isActive ? "text-[var(--cr-accent)]" : "text-[var(--cr-cool-gray)]"}
            />
            <span
              className={`text-[10px] font-medium ${
                isActive ? "text-[var(--cr-accent)]" : "text-[var(--cr-cool-gray)]"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
