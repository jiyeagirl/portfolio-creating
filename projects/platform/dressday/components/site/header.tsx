"use client";

import { useState } from "react";
import { CaretRight, Heart, List, MagnifyingGlass, MapPin, X } from "@phosphor-icons/react";
import type { NavigateFn, ScreenName } from "@/projects/platform/dressday/lib/types";
import { ADDRESSES, ME } from "@/projects/platform/dressday/lib/site-data";
import { CONTAINER } from "@/projects/platform/dressday/components/site/ui";

const NAV: { screen: ScreenName; label: string }[] = [
  { screen: "browse", label: "옷 둘러보기" },
  { screen: "tracking", label: "예약, 배송 조회" },
  { screen: "return", label: "반납 신청" },
];

/** 활성 메뉴 판정: 예약, 결제는 상품 흐름, 상세는 둘러보기에 속한다 */
function activeOf(screen: ScreenName): ScreenName | null {
  if (screen === "product" || screen === "booking" || screen === "payment") return "browse";
  return NAV.some((n) => n.screen === screen) ? screen : null;
}

export function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 items-baseline" aria-label="DRESSDAY 홈">
      <span className="text-[22px] font-bold tracking-[-0.03em] text-[var(--dd-primary)]">dressday</span>
    </button>
  );
}

export function Header({
  screen,
  onNavigate,
  initialMenu = false,
}: {
  screen: ScreenName;
  onNavigate: NavigateFn;
  initialMenu?: boolean;
}) {
  const [menu, setMenu] = useState(initialMenu);
  const active = activeOf(screen);
  const go = (s: ScreenName) => {
    setMenu(false);
    onNavigate(s);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--dd-hairline)] bg-white">
        <div className={`${CONTAINER} flex h-16 items-center gap-8 lg:h-20`}>
          <Wordmark onClick={() => go("home")} />

          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.screen}
                type="button"
                onClick={() => go(n.screen)}
                aria-current={active === n.screen ? "page" : undefined}
                className={`relative flex h-20 items-center text-[16px] ${
                  active === n.screen ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-muted)]"
                }`}
              >
                {n.label}
                {active === n.screen && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--dd-ink)]" />}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="dd-press hidden h-11 items-center gap-2 rounded-full border border-[var(--dd-hairline)] px-4 text-[14px] text-[var(--dd-ink)] md:flex"
            >
              <MapPin size={18} className="shrink-0" />
              <span className="max-w-[180px] truncate">{ADDRESSES[0].line.replace("서울 ", "")}</span>
              <span className="text-[var(--dd-muted)]">오늘 18:00까지 주문</span>
            </button>
            <button type="button" aria-label="검색" onClick={() => go("browse")} className="dd-press flex h-11 w-11 items-center justify-center rounded-full lg:hidden">
              <MagnifyingGlass size={22} />
            </button>
            <button type="button" aria-label="저장한 옷" className="dd-press hidden h-11 w-11 items-center justify-center rounded-full lg:flex">
              <Heart size={22} />
            </button>
            <button
              type="button"
              onClick={() => go("mypage")}
              aria-label="마이페이지"
              className="dd-press hidden h-11 items-center gap-2 rounded-full border border-[var(--dd-hairline)] pl-1.5 pr-4 lg:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dd-ink)] text-[13px] font-semibold text-white">
                {ME.name.slice(1, 2)}
              </span>
              <span className="text-[14px] font-medium">{ME.name}</span>
            </button>
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={() => setMenu(true)}
              className="dd-press flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            >
              <List size={24} />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="메뉴 닫기" onClick={() => setMenu(false)} className="dd-scrim absolute inset-0 bg-black/50" />
          <div className="dd-sheet-left absolute inset-y-0 right-0 flex w-[88%] max-w-[360px] flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-6">
              <Wordmark onClick={() => go("home")} />
              <button type="button" aria-label="메뉴 닫기" onClick={() => setMenu(false)} className="dd-press -mr-2 flex h-11 w-11 items-center justify-center">
                <X size={22} />
              </button>
            </div>
            <button type="button" onClick={() => go("mypage")} className="mx-6 flex items-center gap-3 border-b border-[var(--dd-hairline)] pb-5 pt-2 text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--dd-ink)] text-[15px] font-semibold text-white">
                {ME.name.slice(1, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold">{ME.name}</span>
                <span className="block truncate text-[14px] text-[var(--dd-muted)]">{ADDRESSES[0].line}</span>
              </span>
              <CaretRight size={18} className="shrink-0 text-[var(--dd-muted)]" />
            </button>
            <nav aria-label="주요 메뉴" className="flex flex-col px-6 pt-2">
              {[{ screen: "home" as ScreenName, label: "홈" }, ...NAV, { screen: "mypage" as ScreenName, label: "렌탈 내역" }].map((n) => {
                const on = (n.screen === "home" && screen === "home") || active === n.screen || (n.screen === "mypage" && screen === "mypage");
                return (
                  <button
                    key={n.screen}
                    type="button"
                    onClick={() => go(n.screen)}
                    aria-current={on ? "page" : undefined}
                    className={`flex h-14 items-center text-left text-[18px] ${on ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-body)]"}`}
                  >
                    {n.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-[var(--dd-hairline)] px-6 py-5 text-[14px] text-[var(--dd-muted)]">
              <p>
                고객센터 <span className="dd-num font-medium text-[var(--dd-ink)]">1670-0918</span>
              </p>
              <p className="dd-num mt-1">매일 10:00~22:00</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
