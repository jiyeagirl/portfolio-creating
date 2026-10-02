"use client";

import { useState } from "react";
import type { UIEvent } from "react";
import { motion } from "motion/react";
import { Backpack, Bed, Bell, Ticket } from "@phosphor-icons/react";
import type { NavigateFn, Tone } from "@/projects/commerce/snowpeak/lib/navigation";
import type { NoticeTag } from "@/projects/commerce/snowpeak/lib/types";
import { NOTICES, NOTIFICATIONS, PACKAGES, ROOMS, USER_PROFILE } from "@/projects/commerce/snowpeak/lib/mock-data";
import { Badge, Card, PhotoTile, PriceTag, SectionHead, Stars } from "@/projects/commerce/snowpeak/components/ui";

const BANNERS = [
  {
    key: "gondola",
    src: "https://images.pexels.com/photos/29952995/pexels-photo-29952995.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eyebrow: "2023-24 시즌 오픈",
    title: "사전 예약 15% 할인 받기",
    view: "roomList" as const,
    refId: undefined as string | undefined,
  },
  {
    key: "snowboard",
    src: "https://images.pexels.com/photos/5699888/pexels-photo-5699888.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eyebrow: "라이더를 위한 슬로프",
    title: "리프트권 / 시즌권 바로 예약하기",
    view: "liftSeason" as const,
    refId: undefined as string | undefined,
  },
  {
    key: "village",
    src: "https://images.unsplash.com/photo-1764067656521-ed9d4994f3d9?q=80&w=1200&auto=format&fit=crop",
    eyebrow: "노을이 물든 리조트 빌리지",
    title: "프리미어 올인클루시브 패키지 만나보기",
    view: "package" as const,
    refId: "package-premier",
  },
];

const NOTICE_TONE: Record<NoticeTag, Tone> = {
  이벤트: "warn",
  공지: "info",
  점검: "danger",
};

const BANNER_SLIDE_WIDTH = 300 + 12;

const REVEAL_PROPS = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

export function HomeScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [activeBanner, setActiveBanner] = useState(0);

  const featuredPackages = PACKAGES.slice(0, 3);
  const popularRooms = [...ROOMS].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 3);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  function handleBannerScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / BANNER_SLIDE_WIDTH);
    setActiveBanner(Math.min(BANNERS.length - 1, Math.max(0, idx)));
  }

  const shortcuts = [
    { key: "room", label: "객실 예약", icon: Bed, onClick: () => onNavigate("roomList") },
    { key: "lift", label: "리프트권 / 시즌권", icon: Ticket, onClick: () => onNavigate("liftSeason") },
    { key: "rental", label: "장비 렌탈", icon: Backpack, onClick: () => onNavigate("rental") },
  ];

  return (
    <div className="pb-24">
      <header className="flex items-center justify-between px-5 pb-3 pt-[59px]">
        <div>
          <p className="text-[12px] font-semibold text-[var(--sp-mute)]">{USER_PROFILE.tier} 멤버</p>
          <h1 className="mt-1 text-[21px] font-semibold leading-tight tracking-[-0.02em]">
            {USER_PROFILE.name}님, 좋은 슬로프 되세요
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("notifications")}
          aria-label="알림"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sp-surface-soft)] text-[var(--sp-ink)]"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--sp-accent)]" />
          )}
        </button>
      </header>

      <section className="mt-2">
        <div
          onScroll={handleBannerScroll}
          className="sp-scroll-x flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"
        >
          {BANNERS.map((banner) => (
            <button
              key={banner.key}
              type="button"
              onClick={() => onNavigate(banner.view, banner.refId)}
              className="relative h-[220px] w-[300px] shrink-0 snap-center overflow-hidden rounded-[20px] text-left"
            >
              <PhotoTile src={banner.src} alt={banner.title} className="absolute inset-0 h-full w-full" sizes="300px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--sp-ink)]">
                  {banner.eyebrow}
                </span>
                <p className="mt-2 text-[16px] font-semibold leading-snug text-white">{banner.title}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {BANNERS.map((banner, i) => (
            <span
              key={banner.key}
              className={`h-1.5 rounded-full transition-all ${
                i === activeBanner ? "w-5 bg-[var(--sp-accent)]" : "w-1.5 bg-[var(--sp-border-strong)]"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="grid grid-cols-3 gap-3">
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.key}
              type="button"
              onClick={shortcut.onClick}
              className="flex flex-col items-center gap-2 rounded-[16px] bg-[var(--sp-surface)] py-4"
              style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]">
                <shortcut.icon size={19} weight="fill" />
              </span>
              <span className="px-1 text-center text-[11.5px] font-semibold leading-tight text-[var(--sp-ink)]">
                {shortcut.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <motion.section {...REVEAL_PROPS} className="mt-9">
        <SectionHead
          title="패키지 상품 추천"
          note="객실, 렌탈, 리프트권을 한 번에 예약해요"
          action="예약 허브"
          onAction={() => onNavigate("bookHub")}
        />
        <div className="sp-scroll-x flex gap-3.5 overflow-x-auto px-5">
          {featuredPackages.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onNavigate("package", pkg.id)}
              className="w-[220px] shrink-0 text-left"
            >
              <Card padded={false} className="overflow-hidden">
                <div className="relative h-[140px] w-full">
                  <PhotoTile id={pkg.photo} alt={pkg.name} className="absolute inset-0 h-full w-full" sizes="220px" />
                  <Badge tone="ink" className="absolute left-3 top-3">
                    {pkg.tag}
                  </Badge>
                </div>
                <div className="p-3.5">
                  <p className="line-clamp-1 text-[14px] font-semibold text-[var(--sp-ink)]">{pkg.name}</p>
                  <p className="mt-1 text-[12px] text-[var(--sp-mute)]">
                    {pkg.nights}박 | {pkg.includes.length}개 구성
                  </p>
                  <div className="mt-2">
                    <PriceTag price={pkg.price} listPrice={pkg.listPrice} size="sm" />
                  </div>
                  <div className="mt-2">
                    <Badge tone="success">실시간 예약 가능</Badge>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section {...REVEAL_PROPS} className="mt-9">
        <SectionHead title="이벤트 및 공지사항" note="놓치면 아쉬운 시즌 소식" />
        <div className="flex flex-col gap-2.5 px-5">
          {NOTICES.map((notice) => (
            <button key={notice.id} type="button" onClick={() => onNavigate("notifications")} className="text-left">
              <Card padded={false} className="flex items-center gap-3 overflow-hidden p-3">
                {notice.photo ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px]">
                    <PhotoTile id={notice.photo} alt={notice.title} className="absolute inset-0 h-full w-full" sizes="56px" />
                  </div>
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] bg-[var(--sp-surface-soft)] text-[var(--sp-mute)]">
                    <Bell size={18} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <Badge tone={NOTICE_TONE[notice.tag]}>{notice.tag}</Badge>
                  <p className="mt-1.5 line-clamp-1 text-[13.5px] font-semibold text-[var(--sp-ink)]">{notice.title}</p>
                  <p className="sp-num mt-0.5 text-[11.5px] text-[var(--sp-mute)]">{notice.date.replaceAll("-", ".")}</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section {...REVEAL_PROPS} className="mt-9">
        <SectionHead
          title="인기 상품 추천"
          note="가장 평점이 높은 객실이에요"
          action="객실 전체보기"
          onAction={() => onNavigate("roomList")}
        />
        <div className="sp-scroll-x flex gap-3.5 overflow-x-auto px-5">
          {popularRooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => onNavigate("roomDetail", room.id)}
              className="w-[200px] shrink-0 text-left"
            >
              <Card padded={false} className="overflow-hidden">
                <div className="relative h-[150px] w-full">
                  <PhotoTile id={room.viewPhoto} alt={room.name} className="absolute inset-0 h-full w-full" sizes="200px" />
                </div>
                <div className="p-3.5">
                  <p className="line-clamp-1 text-[13.5px] font-semibold text-[var(--sp-ink)]">{room.name}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Stars rating={room.rating} size={10} />
                    <span className="sp-num text-[11px] text-[var(--sp-mute)]">({room.reviewCount})</span>
                  </div>
                  <div className="mt-2">
                    <PriceTag price={room.basePrice} size="sm" />
                  </div>
                  <div className="mt-2">
                    <Badge tone="success">실시간 예약 가능</Badge>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
