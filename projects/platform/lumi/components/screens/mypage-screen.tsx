"use client";

import Image from "next/image";
import {
  CaretRight,
  Coins,
  Heart,
  Megaphone,
  PencilSimple,
  Question,
  Receipt,
  ShieldCheck,
  SignOut,
  Ticket,
} from "@phosphor-icons/react";
import headerPhoto from "@/projects/platform/lumi/assets/mood-horizon-blue.jpg";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import type { LumiView } from "@/projects/platform/lumi/lib/navigation";
import {
  OWNED_PASSES,
  PASS_BY_TIER,
  USER,
  formatWon,
} from "@/projects/platform/lumi/lib/mock-data";

export function MypageScreen({
  onNavigate,
  favoriteCount,
}: {
  onNavigate: NavigateFn;
  favoriteCount: number;
}) {
  const menu: { icon: typeof Heart; label: string; note?: string; view?: LumiView }[] = [
    { icon: Heart, label: "찜한 상담사", note: `${favoriteCount}명`, view: "favorites" },
    { icon: Receipt, label: "결제 내역", note: "최근 5건", view: "payments" },
    { icon: PencilSimple, label: "프로필 수정", view: "profileEdit" },
    { icon: Megaphone, label: "공지사항", note: "8월 가격 조정 안내" },
    { icon: Question, label: "자주 묻는 질문" },
    { icon: ShieldCheck, label: "개인정보 처리방침" },
  ];

  return (
    <div className="lm-enter pb-28">
      <div className="relative">
        <Image
          src={headerPhoto}
          alt="해질 무렵 푸른 바다 수평선"
          placeholder="blur"
          className="h-[168px] w-full object-cover"
          sizes="393px"
        />
        <span className="absolute inset-0 bg-gradient-to-b from-[rgba(13,11,28,0.5)] to-[rgba(13,11,28,0.85)]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 pb-11">
          <div>
            <p className="text-[19px] font-bold tracking-tight text-white">{USER.name}님</p>
            <p className="lm-num mt-1 text-[12.5px] text-white/70">
              {USER.grade} · {USER.gradeNote}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("profileEdit")}
            className="rounded-full bg-[rgba(13,11,28,0.55)] px-3.5 py-1.5 text-[12.5px] font-bold text-white"
          >
            프로필 수정
          </button>
        </div>
      </div>

      <section className="relative z-10 -mt-6 px-5">
        <div className="rounded-2xl bg-[var(--lm-elevated)] p-4 shadow-[var(--lm-shadow)]">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[14px] font-bold">
              <Ticket size={15} weight="fill" className="text-[var(--lm-accent)]" />
              보유 상담권
            </p>
            <button
              type="button"
              onClick={() => onNavigate("passes")}
              className="text-[12.5px] font-semibold text-[var(--lm-muted)]"
            >
              충전하기
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 divide-x divide-[var(--lm-border)]">
            {OWNED_PASSES.map((pass) => (
              <div key={pass.tier} className="px-1 text-center">
                <p className="text-[11.5px] text-[var(--lm-muted)]">
                  {PASS_BY_TIER[pass.tier].name}
                </p>
                <p className="lm-num mt-1 text-[17px] font-bold">
                  {pass.count}
                  <span className="ml-0.5 text-[12px] font-semibold text-[var(--lm-muted)]">장</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-3 px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-4 py-3.5">
          <Coins size={17} weight="fill" className="text-[var(--lm-live)]" />
          <p className="lm-num flex-1 text-[13.5px] font-semibold">
            포인트 {formatWon(USER.point)}P
          </p>
          <span className="h-4 w-px bg-[var(--lm-border)]" aria-hidden />
          <p className="lm-num text-[13.5px] font-semibold">쿠폰 {USER.coupon}장</p>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="overflow-hidden rounded-2xl bg-[var(--lm-elevated)] shadow-[var(--lm-shadow)]">
          {menu.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.view && onNavigate(item.view)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
                index > 0 ? "border-t border-[var(--lm-border)]" : ""
              }`}
            >
              <item.icon size={17} className="text-[var(--lm-muted)]" />
              <span className="flex-1 text-[14px] font-semibold">{item.label}</span>
              {item.note && (
                <span className="lm-num text-[12.5px] text-[var(--lm-muted)]">{item.note}</span>
              )}
              <CaretRight size={14} className="text-[var(--lm-border)]" />
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="rounded-2xl bg-[var(--lm-surface)] p-4">
          <p className="text-[13px] font-bold">고객센터</p>
          <p className="lm-num mt-1.5 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
            평일 10:00 ~ 19:00 · 1533-0288
            <br />
            상담 중 문제가 있었다면 상담 내역에서 바로 신고할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mt-5 px-5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 py-2 text-[13px] font-semibold text-[var(--lm-muted)]"
        >
          <SignOut size={14} />
          로그아웃
        </button>
      </section>
    </div>
  );
}
