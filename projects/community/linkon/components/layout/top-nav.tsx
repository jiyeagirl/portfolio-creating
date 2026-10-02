"use client";

import { useState } from "react";
import {
  Bell,
  ChatCircleDots,
  Handshake,
  MagnifyingGlass,
  Megaphone,
  UserCirclePlus,
} from "@phosphor-icons/react";
import {
  CURRENT_USER,
  MY_COMPANY,
  NOTIFICATIONS,
  formatRelativeTime,
} from "@/projects/community/linkon/lib/mock-data";
import { PRIMARY_NAV } from "@/projects/community/linkon/lib/navigation";
import type { LinkonView, NavigateFn } from "@/projects/community/linkon/lib/navigation";
import { BrandMark, VerifiedBadge } from "@/projects/community/linkon/components/layout/ui";

const NOTI_ICON = {
  collab: Handshake,
  chat: ChatCircleDots,
  notice: Megaphone,
  answer: ChatCircleDots,
} as const;

export function TopNav({
  active,
  unreadChats,
  onNavigate,
}: {
  active: LinkonView;
  unreadChats: number;
  onNavigate: NavigateFn;
}) {
  const [query, setQuery] = useState("");
  const [notiOpen, setNotiOpen] = useState(false);
  const unreadNoti = NOTIFICATIONS.filter((n) => !n.read).length;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onNavigate("companies", query.trim() || undefined);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--lk-border)] bg-[var(--lk-bg)]/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-5 px-6 lg:px-10">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-[19px] font-bold tracking-tight text-[var(--lk-ink)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--lk-accent)] text-[15px] font-extrabold text-[var(--lk-accent-fg)]">
            L
          </span>
          LinkON
        </button>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {PRIMARY_NAV.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                active === item.view
                  ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                  : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
              }`}
            >
              {item.label}
              {item.view === "chat" && unreadChats > 0 && (
                <span className="lk-num absolute -right-0.5 top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--lk-danger)] px-1 text-[10px] font-bold text-white">
                  {unreadChats}
                </span>
              )}
            </button>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden w-[240px] md:block xl:w-[260px]">
          <div className="flex items-center gap-2 rounded-full border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-3.5 py-2">
            <MagnifyingGlass size={16} className="shrink-0 text-[var(--lk-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="기업명, 대표자명 검색"
              aria-label="회원 기업 검색"
              className="w-full bg-transparent text-[13.5px] text-[var(--lk-ink)] outline-none"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <button
            onClick={() => onNavigate("signup")}
            className={`hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors lg:flex ${
              active === "signup"
                ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
            }`}
          >
            <UserCirclePlus size={16} />
            기업 인증 가입
          </button>

          <div className="relative">
            <button
              aria-label="알림"
              onClick={() => setNotiOpen((v) => !v)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                notiOpen
                  ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                  : "text-[var(--lk-muted)] hover:bg-[var(--lk-surface)]"
              }`}
            >
              <Bell size={19} weight={notiOpen ? "fill" : "regular"} />
              {unreadNoti > 0 && (
                <span className="lk-num absolute right-1 top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--lk-danger)] px-1 text-[10px] font-bold text-white">
                  {unreadNoti}
                </span>
              )}
            </button>

            {notiOpen && (
              <div className="absolute right-0 top-12 z-40 w-[330px] overflow-hidden rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] shadow-[var(--lk-shadow)]">
                <div className="flex items-center justify-between border-b border-[var(--lk-border)] px-4 py-3">
                  <p className="text-[14px] font-bold text-[var(--lk-ink)]">알림</p>
                  <span className="lk-num text-[12px] font-semibold text-[var(--lk-muted)]">
                    안 읽음 {unreadNoti}
                  </span>
                </div>
                <ul className="max-h-[360px] divide-y divide-[var(--lk-border)] overflow-y-auto">
                  {NOTIFICATIONS.map((noti) => {
                    const Icon = NOTI_ICON[noti.kind];
                    return (
                      <li key={noti.id}>
                        <button
                          onClick={() => {
                            setNotiOpen(false);
                            onNavigate(noti.kind === "chat" ? "chat" : noti.kind === "answer" ? "mentor" : "board");
                          }}
                          className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--lk-surface)] ${
                            noti.read ? "" : "bg-[var(--lk-accent-soft)]/40"
                          }`}
                        >
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--lk-surface)] text-[var(--lk-accent)]">
                            <Icon size={16} weight="fill" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                              {noti.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[12.5px] text-[var(--lk-muted)]">
                              {noti.body}
                            </span>
                            <span className="mt-1 block text-[11.5px] text-[var(--lk-muted)]">
                              {formatRelativeTime(noti.createdAt)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate("companyDetail", MY_COMPANY.id)}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[var(--lk-surface)]"
          >
            <BrandMark logo={MY_COMPANY.logo} size={32} />
            <span className="hidden text-left lg:block">
              <span className="block text-[13px] font-semibold leading-tight text-[var(--lk-ink)]">
                {CURRENT_USER.name}
              </span>
              <span className="block text-[11.5px] leading-tight text-[var(--lk-muted)]">
                {MY_COMPANY.name}
              </span>
            </span>
          </button>

        </div>
      </div>

      <div className="lk-scroll-x flex items-center gap-2 px-6 pb-3 xl:hidden">
        {[...PRIMARY_NAV, { view: "signup" as const, label: "기업 인증 가입" }].map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                active === item.view
                  ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
                  : "border border-[var(--lk-border)] bg-[var(--lk-elevated)] text-[var(--lk-muted)]"
              }`}
            >
              {item.label}
            </button>
        ))}
      </div>
    </header>
  );
}

export function MyCompanyStrip() {
  return (
    <div className="flex items-center gap-3">
      <BrandMark logo={MY_COMPANY.logo} size={48} />
      <div>
        <div className="flex items-center gap-2">
          <p className="text-[16px] font-bold text-[var(--lk-ink)]">{MY_COMPANY.name}</p>
          <VerifiedBadge />
        </div>
        <p className="mt-0.5 text-[12.5px] text-[var(--lk-muted)]">
          {MY_COMPANY.institution} {MY_COMPANY.program}
        </p>
      </div>
    </div>
  );
}
