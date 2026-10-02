"use client";

import { Flag, HouseSimple, ImagesSquare } from "@phosphor-icons/react";
import type { ChildNavigate, ChildScreen } from "@/projects/youngin/child/lib/navigation";

/* 화면 박스 안쪽에 absolute 로 붙는 탭바. CLAUDE.md 의 기기 엣지 규칙대로
   backdrop-blur 없이 불투명 표면만 쓴다 (블러를 쓰면 PhoneFrame 의 라운드 코너
   클립을 뚫고 하단 모서리에 흰 틈이 샌다). pb-8 은 홈 인디케이터를 피하는 값이다. */

const TABS: { key: ChildScreen; label: string; icon: typeof HouseSimple }[] = [
  { key: "home", label: "홈", icon: HouseSimple },
  { key: "mission", label: "미션", icon: Flag },
  { key: "record", label: "기록", icon: ImagesSquare },
];

export function BottomNav({
  active,
  onNavigate,
}: {
  active: ChildScreen;
  onNavigate: ChildNavigate;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-[var(--yc-hairline)] bg-[var(--yc-surface)] pb-8 pt-2.5">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-1 transition-colors ${
              isActive ? "text-[var(--yc-accent)]" : "text-[var(--yc-lock)]"
            }`}
          >
            <tab.icon size={22} weight={isActive ? "fill" : "regular"} />
            <span className="text-[10.5px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
