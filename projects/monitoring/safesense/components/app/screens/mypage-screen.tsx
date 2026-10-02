"use client";

import { useState } from "react";
import { CaretRight, SignOut } from "@phosphor-icons/react";
import { Monogram, SectionTitle, Toggle } from "@/projects/monitoring/safesense/components/app/ui";
import { currentWorker, sites } from "@/projects/monitoring/safesense/lib/mock-data";

export function MypageScreen() {
  const site = sites.find((s) => s.id === currentWorker.siteId)!;
  const [notif, setNotif] = useState({ danger: true, notice: true, system: false });

  return (
    <div className="min-h-full w-full px-5 pb-32 pt-[78px]">
      <h1 className="ss-display text-[22px] text-[var(--ss-foreground)]">마이페이지</h1>

      <div className="mt-5 flex items-center gap-3 rounded-[10px] border border-[var(--ss-border)] bg-[var(--ss-panel)] p-4">
        <Monogram name={currentWorker.name} size={48} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-[var(--ss-foreground)]">{currentWorker.name}</p>
          <p className="ss-mono mt-0.5 text-[10px] text-[var(--ss-muted)]">
            {currentWorker.role} / {site.name}
          </p>
        </div>
      </div>

      <SectionTitle className="mt-7">소속 현장</SectionTitle>
      <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
        <button type="button" className="ss-press flex w-full items-center justify-between px-4 py-3.5 text-left">
          <span>
            <span className="block text-[13px] font-semibold text-[var(--ss-foreground)]">
              {site.name}
            </span>
            <span className="ss-mono mt-0.5 block text-[10px] text-[var(--ss-muted)]">현재 소속</span>
          </span>
          <CaretRight size={16} className="text-[var(--ss-muted)]" />
        </button>
      </div>

      <SectionTitle className="mt-7">센서 설정</SectionTitle>
      <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
        {["스마트폰 거치 위치", "센서 감도 조정", "센서 캘리브레이션"].map((label) => (
          <button key={label} type="button" className="ss-press flex w-full items-center justify-between px-4 py-3.5 text-left">
            <span className="text-[13px] text-[var(--ss-foreground)]">{label}</span>
            <CaretRight size={16} className="text-[var(--ss-muted)]" />
          </button>
        ))}
      </div>

      <SectionTitle className="mt-7">알림 설정</SectionTitle>
      <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[13px] text-[var(--ss-foreground)]">위험 이벤트 알림</span>
          <Toggle checked={notif.danger} onChange={(v) => setNotif((p) => ({ ...p, danger: v }))} label="위험 이벤트 알림" />
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[13px] text-[var(--ss-foreground)]">관리자 공지</span>
          <Toggle checked={notif.notice} onChange={(v) => setNotif((p) => ({ ...p, notice: v }))} label="관리자 공지" />
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[13px] text-[var(--ss-foreground)]">시스템 알림</span>
          <Toggle checked={notif.system} onChange={(v) => setNotif((p) => ({ ...p, system: v }))} label="시스템 알림" />
        </div>
      </div>

      <SectionTitle className="mt-7">개인정보 및 권한</SectionTitle>
      <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
        {["개인정보 수집 및 이용 내역", "위치 권한 관리", "센서 접근 권한 관리"].map((label) => (
          <button key={label} type="button" className="ss-press flex w-full items-center justify-between px-4 py-3.5 text-left">
            <span className="text-[13px] text-[var(--ss-foreground)]">{label}</span>
            <CaretRight size={16} className="text-[var(--ss-muted)]" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="ss-press ss-focusable mt-8 flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--ss-border-strong)] py-3.5 text-[13px] font-bold text-[var(--ss-muted)]"
      >
        <SignOut size={16} />
        로그아웃
      </button>
    </div>
  );
}
