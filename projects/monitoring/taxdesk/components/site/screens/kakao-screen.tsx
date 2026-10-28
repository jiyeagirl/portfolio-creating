"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Flashlight, LockSimple, X } from "@phosphor-icons/react";
import kakaotalkIcon from "@/projects/monitoring/taxdesk/assets/kakaotalk.png";
import { KAKAO, type KakaoMessage } from "@/projects/monitoring/taxdesk/lib/mock-data";
import type { SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";

/* 모바일 보기 전용 잠금화면. 기준 시각 2026.01.20(화) 10:27 (spec 3.3)
   iOS 알림 센터 형태: 앱 아이콘 + "카카오톡" + 시각 머리줄, 아래에 제목과 본문 (2026-10-28 사용자 레퍼런스) */

function Notification({
  m,
  open,
  onToggle,
  onNavigate,
}: {
  m: KakaoMessage;
  open: boolean;
  onToggle: () => void;
  onNavigate: (s: SiteScreen) => void;
}) {
  return (
    <motion.li layout className="overflow-hidden rounded-[16px] bg-[#e3e8ee]/90 text-[#1d1d1f]">
      <button type="button" onClick={onToggle} className="block w-full px-3.5 pb-3 pt-2.5 text-left" aria-expanded={open}>
        <span className="flex items-center gap-2">
          <Image src={kakaotalkIcon} alt="" width={20} height={20} className="h-5 w-5 rounded-[5px]" />
          <span className="flex-1 text-[13px] text-[#5b6168]">카카오톡</span>
          <span className="shrink-0 text-[13px] text-[#5b6168]">{m.at}</span>
        </span>
        <span className="mt-1.5 block text-[15px] font-semibold leading-[20px]">{m.title}</span>
        {!open && <span className="mt-0.5 line-clamp-2 text-[14px] leading-[19px] text-[#2c2f33]">{m.body}</span>}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", visualDuration: 0.3, bounce: 0 }}
          >
            <div className="mx-2.5 mb-2.5 overflow-hidden rounded-[12px] bg-white">
              <p className="bg-[#FEE500] px-4 py-2 text-[13px] font-semibold text-[#3c1e1e]">알림톡 도착</p>
              <div className="px-4 pb-4 pt-3">
                <p className="text-[14px] leading-[21px] text-[#333336]">{m.body}</p>
                <dl className="mt-3 space-y-1 border-t border-[#f0f0f2] pt-3 text-[13px]">
                  {m.lines.map((l) => (
                    <div key={l.label} className="flex gap-3">
                      <dt className="w-[64px] shrink-0 text-[#7a7a7e]">{l.label}</dt>
                      <dd className="min-w-0 flex-1 break-all">{l.value}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={() => onNavigate(m.button.screen)}
                  className="td-press mt-4 h-11 w-full rounded-[8px] bg-[#f2f2f4] text-[14px] font-semibold"
                >
                  {m.button.label}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function KakaoScreen({ initialOpen, onNavigate }: { initialOpen: string; onNavigate: (s: SiteScreen) => void }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#1f2b36] text-white">
      <div className="flex flex-col items-center pt-2">
        <p className="flex items-center gap-1.5 text-[14px] font-medium">
          <LockSimple size={15} weight="fill" />
          위로 쓸어올려서 잠금 해제
        </p>
        <p className="mt-3 text-[84px] font-light leading-[88px] tracking-[-0.02em] tabular-nums">10:27</p>
        <p className="mt-1 text-[19px] font-medium">1월 20일 화요일</p>
      </div>

      <div className="mt-8 flex items-center justify-between px-4">
        <p className="text-[26px] font-semibold">알림 센터</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <X size={15} weight="bold" />
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-2 px-3 pb-6">
        {KAKAO.map((m) => (
          <Notification
            key={m.id}
            m={m}
            open={open === m.id}
            onToggle={() => setOpen(open === m.id ? "" : m.id)}
            onNavigate={onNavigate}
          />
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between px-11 pb-3">
        <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white/15">
          <Flashlight size={22} weight="fill" />
        </span>
        <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white/15">
          <Camera size={22} weight="fill" />
        </span>
      </div>
    </div>
  );
}
