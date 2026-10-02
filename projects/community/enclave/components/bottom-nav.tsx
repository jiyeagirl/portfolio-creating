"use client";

import { motion } from "motion/react";
import { BOTTOM_NAV, type BottomNavKey } from "@/projects/community/enclave/lib/navigation";

/* 화면 박스 안쪽 absolute, 불투명 서페이스 — backdrop-blur 금지(엣지 클립 버그). */
export function BottomNav({
  active,
  onNavigate,
}: {
  active: BottomNavKey;
  onNavigate: (key: BottomNavKey) => void;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-[var(--ec-border)] bg-[var(--ec-surface)] pb-[26px] pt-2">
      <div className="flex items-center justify-around px-1">
        {BOTTOM_NAV.map((item) => {
          const isActive = item.key === active;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? "page" : undefined}
              className="relative flex h-12 w-[68px] flex-col items-center justify-center gap-1 rounded-[14px] transition-transform active:scale-95"
            >
              {isActive && (
                <motion.span
                  layoutId="ec-bottom-nav-active"
                  className="absolute inset-0 rounded-[14px] bg-[var(--ec-accent-soft)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                weight={isActive ? "fill" : "regular"}
                className={`relative ${isActive ? "text-[var(--ec-accent)]" : "text-[var(--ec-muted)]"}`}
              />
              <span
                className={`relative text-[10px] font-medium ${
                  isActive ? "text-[var(--ec-accent-ink)]" : "text-[var(--ec-muted)]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
