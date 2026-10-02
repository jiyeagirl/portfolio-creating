"use client";

import { House, Clock, User, type IconProps } from "@phosphor-icons/react";
import { BOTTOM_NAV, type BottomNavScreen, type StudyspotScreen } from "@/projects/platform/studyspot/lib/navigation";

const NAV_ICON: Record<BottomNavScreen, React.ComponentType<IconProps>> = {
  home: House,
  session: Clock,
  myPage: User,
};

/**
 * 하단 탭바 — 불투명 표면만 쓴다(backdrop-blur 금지, 기기 프레임 클립 누출 방지).
 * absolute로 화면 박스 안쪽에 고정한다.
 */
export function BottomNav({
  screen,
  onNavigate,
}: {
  screen: StudyspotScreen;
  onNavigate: (next: StudyspotScreen) => void;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--ss-hairline)] bg-[var(--ss-canvas)] pb-[calc(env(safe-area-inset-bottom)+34px)] pt-2">
      <ul className="flex items-center justify-around px-2">
        {BOTTOM_NAV.map((item) => {
          const Icon = NAV_ICON[item.key];
          const active = item.key === screen;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onNavigate(item.key)}
                aria-current={active ? "page" : undefined}
                className="flex min-w-[64px] flex-col items-center gap-1 rounded-[8px] px-3 py-1.5 transition-colors"
              >
                <Icon
                  size={22}
                  weight={active ? "fill" : "bold"}
                  className={active ? "text-[var(--ss-ink)]" : "text-[var(--ss-mute)]"}
                />
                <span
                  className={`text-[10.5px] font-medium ${active ? "text-[var(--ss-ink)]" : "text-[var(--ss-mute)]"}`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
