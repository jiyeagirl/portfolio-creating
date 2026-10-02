"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bell,
  CaretRight,
  FileText,
  Info,
  Lock,
  Ruler,
  Scales,
  SignOut,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Toggle } from "@/components/shared/toggle";
import { InitialAvatar } from "@/projects/healthcare/welllog/components/ui";
import { AppleHealthMark, GoogleFitMark } from "@/projects/healthcare/welllog/components/health-marks";
import { currentUser, healthConnections } from "@/projects/healthcare/welllog/lib/mock-data";

export function MypageScreen() {
  const [connections, setConnections] = useState(healthConnections);
  const [notifOn, setNotifOn] = useState(true);

  return (
    <div className="relative h-full overflow-y-auto bg-[var(--wl-canvas)] pb-[110px]">
      <ScreenHeader
        title="마이페이지"
        className="bg-[var(--wl-canvas)] border-[var(--wl-hairline)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wl-ink)]"
      />

      <div className="relative mx-5 mt-4 overflow-hidden rounded-[20px]">
        <div className="relative h-[96px] w-full">
          <Image src="https://picsum.photos/id/365/700/300" alt="김이 나는 찻잔과 책" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex items-center gap-3 px-4">
          <InitialAvatar name={currentUser.name} size={52} tone="sage" />
          <div>
            <p className="text-[16px] font-semibold text-white">{currentUser.name}</p>
            <p className="text-[12.5px] text-white/85">{currentUser.goal}</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-[20px] bg-[var(--wl-surface)] p-3.5 shadow-[var(--wl-shadow)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wl-accent-soft)]">
            <Ruler size={16} color="var(--wl-accent-deep)" />
          </span>
          <div>
            <p className="text-[11.5px] text-[var(--wl-mute)]">키</p>
            <p className="wl-num text-[14.5px] font-semibold text-[var(--wl-ink)]">{currentUser.height}cm</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-[20px] bg-[var(--wl-surface)] p-3.5 shadow-[var(--wl-shadow)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wl-coral-soft)]">
            <Scales size={16} color="var(--wl-coral)" />
          </span>
          <div>
            <p className="text-[11.5px] text-[var(--wl-mute)]">몸무게</p>
            <p className="wl-num text-[14.5px] font-semibold text-[var(--wl-ink)]">{currentUser.weight}kg</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-5">
        <p className="mb-2 text-[13px] font-medium text-[var(--wl-mute)]">건강 데이터 연동</p>
        <div className="divide-y divide-[var(--wl-hairline)] rounded-[20px] bg-[var(--wl-surface)] px-4 shadow-[var(--wl-shadow)]">
          {connections.map((c) => (
            <div key={c.platform} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                {c.platform === "Apple Health" ? <AppleHealthMark size={28} /> : <GoogleFitMark size={28} />}
                <div>
                  <p className="text-[13.5px] font-medium text-[var(--wl-ink)]">{c.platform}</p>
                  <p className="text-[11.5px] text-[var(--wl-mute)]">
                    {c.connected ? `마지막 동기화 ${c.lastSyncAt}` : "연동되지 않음"}
                  </p>
                </div>
              </div>
              <Toggle
                checked={c.connected}
                onChange={(next) =>
                  setConnections((prev) => prev.map((p) => (p.platform === c.platform ? { ...p, connected: next } : p)))
                }
                label={`${c.platform} 연동`}
                size="sm"
                onClassName="bg-[var(--wl-accent)]"
                offClassName="bg-[var(--wl-hairline)]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5">
        <p className="mb-2 text-[13px] font-medium text-[var(--wl-mute)]">설정</p>
        <div className="divide-y divide-[var(--wl-hairline)] rounded-[20px] bg-[var(--wl-surface)] px-4 shadow-[var(--wl-shadow)]">
          <div className="flex items-center justify-between py-3.5">
            <span className="flex items-center gap-2.5 text-[13.5px] text-[var(--wl-ink)]">
              <Bell size={16} color="var(--wl-body)" />
              제안형 알림 받기
            </span>
            <Toggle
              checked={notifOn}
              onChange={setNotifOn}
              label="알림 받기"
              size="sm"
              onClassName="bg-[var(--wl-accent)]"
              offClassName="bg-[var(--wl-hairline)]"
            />
          </div>
          {[
            { icon: Lock, label: "개인정보 처리방침" },
            { icon: FileText, label: "이용약관" },
            { icon: Info, label: "앱 정보" },
          ].map((item) => (
            <button key={item.label} type="button" className="flex w-full items-center justify-between py-3.5">
              <span className="flex items-center gap-2.5 text-[13.5px] text-[var(--wl-ink)]">
                <item.icon size={16} color="var(--wl-body)" />
                {item.label}
              </span>
              <CaretRight size={14} color="var(--wl-mute)" />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5">
        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-[13.5px] font-medium text-[var(--wl-mute)]">
          <SignOut size={15} />
          로그아웃
        </button>
        <p className="mt-1 text-center text-[11px] text-[var(--wl-mute)]">welllog와 함께한 지 {currentUser.joinedAt}부터</p>
      </div>
    </div>
  );
}
