"use client";

import { useEffect, useRef, useState } from "react";
import { List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useStore } from "@/projects/platform/eduon/lib/store";
import { ME } from "@/projects/platform/eduon/lib/mock-data";
import { SUB_STATUS_LABEL } from "@/projects/platform/eduon/lib/access";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { IconBtn } from "@/projects/platform/eduon/components/site/ui";

type NavKey = "home" | "explore" | "mypage";

const NAV: Array<{ key: NavKey; label: string }> = [
  { key: "home", label: "홈" },
  { key: "explore", label: "탐색" },
  { key: "mypage", label: "내 학습" },
];

export function Logo() {
  return (
    <span className="flex items-center text-[22px] font-bold leading-none tracking-[-0.02em] text-[var(--eo-fg)]">
      Edu
      <span className="ml-0.5 rounded-full bg-[var(--eo-brand)] px-1.5 py-0.5">
        On
      </span>
    </span>
  );
}

export function SiteHeader() {
  const { screen, go } = useSite();
  const { mySub } = useStore();
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!profile) return;
    const close = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfile(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [profile]);

  const active = (key: NavKey) => key !== "explore" && key === screen;
  const navTo = (key: NavKey) => {
    setMenu(false);
    if (key === "explore") go("home", { anchor: "explore" });
    else go(key);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--eo-hair)] bg-[var(--eo-canvas)]">
      <div className="mx-auto flex h-16 max-w-[1328px] items-center gap-2 px-4 md:px-8">
        <button
          type="button"
          onClick={() => navTo("home")}
          className="mr-4 flex h-11 items-center lg:mr-8"
          aria-label="EduOn 홈"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-3 md:flex lg:gap-4" aria-label="주 메뉴">
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => navTo(n.key)}
              aria-current={active(n.key) ? "page" : undefined}
              className={`h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[15px] transition-colors hover:bg-[var(--eo-raised-2)] ${
                active(n.key)
                  ? "bg-[var(--eo-raised)] font-semibold text-[var(--eo-fg)]"
                  : "font-semibold text-[var(--eo-fg-3)] hover:text-[var(--eo-fg)]"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <IconBtn
            label="검색"
            onClick={() => go("home", { anchor: "explore" })}
          >
            <MagnifyingGlass size={22} />
          </IconBtn>

          {/* 프로필 메뉴: 내 학습, 구독 관리 (구독과 결제 내역은 내 학습과 분리된 계정 화면) */}
          <div ref={profileRef} className="relative ml-1 hidden md:block">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={profile}
              onClick={() => setProfile((v) => !v)}
              className="flex h-11 items-center gap-2.5 rounded-full pl-1 pr-3 transition-colors hover:bg-[var(--eo-raised-2)] md:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--eo-raised-3)] text-[13px] font-semibold text-[var(--eo-fg)]">
                {ME.name.slice(1, 2)}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[14px] font-semibold text-[var(--eo-fg)]">
                  {ME.name}
                </span>
                <span
                  className={`block text-[12px] ${mySub.status === "active" || mySub.status === "cancelled" ? "text-[var(--eo-brand-ink)]" : "text-[var(--eo-fg-3)]"}`}
                >
                  {SUB_STATUS_LABEL[mySub.status]}
                </span>
              </span>
            </button>
            {profile && (
              <div
                role="menu"
                className="eo-fade absolute right-0 top-[52px] z-50 w-[200px] rounded-[16px] border border-[var(--eo-hair)] bg-[var(--eo-canvas)] p-1.5 shadow-[var(--eo-float-shadow)]"
              >
                {(
                  [
                    ["mypage", "내 학습"],
                    ["membership", "구독 관리"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfile(false);
                      go(key);
                    }}
                    className={`flex h-10 w-full items-center rounded-[10px] px-3 text-left text-[14px] hover:bg-[var(--eo-raised)] ${screen === key ? "font-semibold" : "font-medium text-[var(--eo-fg-2)]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <IconBtn
            label={menu ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setMenu((v) => !v)}
            className="md:hidden"
          >
            {menu ? <X size={22} /> : <List size={22} />}
          </IconBtn>
        </div>
      </div>

      {menu && (
        <nav
          className="eo-fade border-t border-[var(--eo-hair)] bg-[var(--eo-canvas)] px-4 pb-4 pt-2 md:hidden"
          aria-label="모바일 메뉴"
        >
          <div className="flex items-center gap-3 border-b border-[var(--eo-hair)] py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--eo-raised-3)] text-[14px] font-semibold">
              {ME.name.slice(1, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">{ME.name}</div>
              <div className="text-[13px] text-[var(--eo-fg-3)]">
                {SUB_STATUS_LABEL[mySub.status]}
              </div>
            </div>
            {/* 구독 관리는 주 메뉴가 아니라 계정 영역에만 둔다 (데스크톱은 프로필 메뉴) */}
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                go("membership");
              }}
              className="h-9 shrink-0 rounded-full border border-[var(--eo-hair-2)] px-3 text-[13px] font-semibold"
            >
              구독 관리
            </button>
          </div>
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => navTo(n.key)}
              className={`flex h-12 w-full items-center text-[16px] ${active(n.key) ? "font-semibold text-[var(--eo-fg)]" : "text-[var(--eo-fg-2)]"}`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
