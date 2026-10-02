"use client";

import { useState } from "react";
import { List, ShoppingBag, User, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { NavigateFn, VerveView } from "@/projects/commerce/verve/lib/navigation";

const LINKS: { view: VerveView; label: string }[] = [
  { view: "shop", label: "Shop" },
  { view: "sizeRecommendation", label: "AI Size" },
  { view: "brand", label: "Brand" },
  { view: "support", label: "Support" },
];

export function Nav({
  tone,
  cartCount,
  onNavigate,
}: {
  tone: "dark" | "light";
  cartCount: number;
  onNavigate: NavigateFn;
}) {
  const [open, setOpen] = useState(false);
  const isDark = tone === "dark";
  const bgClass = isDark ? "bg-[var(--v-canvas)]" : "bg-[var(--v-canvas-light)]";
  const inkClass = isDark ? "text-[var(--v-ink)]" : "text-[var(--v-body-on-light)]";
  const hairlineClass = isDark ? "border-[var(--v-hairline)]" : "border-[var(--v-hairline-on-light)]";

  return (
    <header className={`sticky top-0 z-40 border-b ${hairlineClass} ${bgClass}`}>
      <div className={`mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-8 ${inkClass}`}>
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-[18px] font-bold uppercase tracking-[1.4px]"
        >
          VERVE
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.view}
              type="button"
              onClick={() => onNavigate(link.view)}
              className="text-[13px] font-semibold uppercase tracking-[0.65px] hover:text-[var(--v-primary)] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button type="button" aria-label="마이페이지" onClick={() => onNavigate("mypage")} className="hover:text-[var(--v-primary)] transition-colors">
            <User size={20} />
          </button>
          <button type="button" aria-label="장바구니" onClick={() => onNavigate("cart")} className="relative hover:text-[var(--v-primary)] transition-colors">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--v-primary)] text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button type="button" aria-label="메뉴" onClick={() => setOpen(true)} className="md:hidden">
            <List size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--v-canvas)] md:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-[var(--v-hairline)] px-4 text-[var(--v-ink)]">
              <span className="text-[18px] font-bold uppercase tracking-[1.4px]">VERVE</span>
              <button type="button" aria-label="닫기" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col px-4 py-6">
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.view}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => {
                    onNavigate(link.view);
                    setOpen(false);
                  }}
                  className="border-b border-[var(--v-hairline)] py-4 text-left text-[20px] font-medium uppercase tracking-[0.4px] text-[var(--v-ink)]"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
