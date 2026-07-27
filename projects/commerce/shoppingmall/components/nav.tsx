"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  List,
  MagnifyingGlass,
  ShoppingBag,
  User,
  X,
} from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "NEW", href: "#products" },
  { label: "BEST", href: "#best-seller" },
  { label: "SHOP", href: "#products" },
  { label: "COLLECTION", href: "#lookbook" },
];

export function Nav({
  onNavigate,
}: {
  onNavigate: (view: "home" | "mypage") => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <>
      <div className="hidden sm:block border-b border-border bg-accent text-accent-foreground">
        <p className="mx-auto max-w-[1400px] px-6 py-2 text-center text-[13px] tracking-tight">
          5만원 이상 구매 시 무료배송 · 신규 가입하면 첫 주문 15% 할인 쿠폰 증정
        </p>
      </div>

      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border"
            : "bg-background border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-8 lg:w-1/3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 flex items-center justify-center rounded-full p-2 transition-colors hover:bg-surface lg:hidden"
              aria-label="메뉴 열기"
            >
              <List size={22} weight="light" />
            </button>
            <nav className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-medium tracking-[0.06em] text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="text-[22px] font-semibold tracking-[0.12em] lg:w-1/3 lg:text-center"
          >
            VESTIRE
          </button>

          <div className="flex items-center justify-end gap-1 lg:w-1/3">
            <button
              type="button"
              className="hidden items-center justify-center rounded-full p-2.5 transition-colors hover:bg-surface sm:flex"
              aria-label="검색"
            >
              <MagnifyingGlass size={20} weight="light" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("mypage")}
              className="flex items-center justify-center rounded-full p-2.5 transition-colors hover:bg-surface"
              aria-label="마이페이지"
            >
              <User size={20} weight="light" />
            </button>
            <button
              type="button"
              className="relative flex items-center justify-center rounded-full p-2.5 transition-colors hover:bg-surface"
              aria-label="장바구니"
            >
              <ShoppingBag size={20} weight="light" />
              <span className="absolute right-1 top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-6">
              <span className="text-[22px] font-semibold tracking-[0.12em]">
                VESTIRE
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="-mr-2 flex items-center justify-center rounded-full p-2 hover:bg-surface"
                aria-label="메뉴 닫기"
              >
                <X size={22} weight="light" />
              </button>
            </div>
            <motion.nav
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
              className="flex flex-col gap-1 px-6 py-8"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.label}
                  variants={{
                    closed: { opacity: 0, y: 12 },
                    open: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-border py-4 text-[28px] font-medium tracking-tight"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate("mypage");
                }}
                className="mt-6 flex items-center gap-2 text-[15px] font-medium text-muted"
              >
                <User size={18} weight="light" />
                마이페이지
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
