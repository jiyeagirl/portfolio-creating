"use client";

import { useState } from "react";
import { ArrowCounterClockwise, Flask } from "@phosphor-icons/react";
import { useStore, type SubPreset } from "@/projects/platform/eduon/lib/store";
import type { PlaybackState } from "@/projects/platform/eduon/lib/navigation";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";

/*
 * 스펙이 요구한 시연 상태 전환과 처음 상태로. 서비스 화면을 가리지 않게 왼쪽 아래 작은 버튼 하나에만 둔다.
 * 사용자와 관리자를 오가는 전환은 두지 않는다 (사용자 지정).
 */

const SUBS: Array<{ key: SubPreset; label: string }> = [
  { key: "free", label: "무료 회원" },
  { key: "active", label: "구독 중" },
  { key: "cancelled", label: "갱신 해지" },
  { key: "expired", label: "만료" },
];

const PLAYBACK: Array<{ key: PlaybackState; label: string }> = [
  { key: "normal", label: "정상 재생" },
  { key: "locked", label: "구독 필요" },
  { key: "network-error", label: "네트워크 오류" },
  { key: "expired-url", label: "재생 주소 만료" },
  { key: "denied", label: "재생 권한 없음" },
  { key: "drm-error", label: "라이선스 발급 실패" },
  { key: "unsupported", label: "미지원 환경" },
];

export function DemoTools() {
  const [open, setOpen] = useState(false);
  const { mySub, setSubPreset, resetDemo } = useStore();
  const { screen, playback, setPlayback, toast } = useSite();
  const currentSub = mySub.status === "free" || mySub.status === "active" || mySub.status === "cancelled" || mySub.status === "expired" ? mySub.status : null;

  return (
    <div className="fixed bottom-3 left-2 z-30">
      {open && (
        <div className="eo-rise mb-2 w-[272px] rounded-[14px] border border-[var(--eo-hair-2)] bg-[var(--eo-raised)] p-4 shadow-[var(--eo-float-shadow)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[15px] font-semibold">화면 상태</span>
          </div>
          <div className="text-[13px] font-semibold text-[var(--eo-fg-2)]">구독 상태</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {SUBS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSubPreset(s.key)}
                className={`h-9 rounded-[8px] text-[13px] font-medium transition-colors ${
                  currentSub === s.key ? "bg-[var(--eo-fg)] text-[var(--eo-canvas)]" : "bg-[var(--eo-raised-2)] text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-3)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {screen === "watch" && (
            <>
              <div className="mt-4 text-[13px] font-semibold text-[var(--eo-fg-2)]">재생 상태</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PLAYBACK.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPlayback(p.key)}
                    className={`h-8 rounded-[8px] px-2.5 text-[12px] font-medium transition-colors ${
                      playback === p.key ? "bg-[var(--eo-fg)] text-[var(--eo-canvas)]" : "bg-[var(--eo-raised-2)] text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-3)]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              resetDemo();
              setPlayback("normal");
              toast("처음 상태로 되돌렸어요");
            }}
            className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] border border-[var(--eo-hair-2)] text-[13px] font-medium text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-2)]"
          >
            <ArrowCounterClockwise size={16} />
            처음 상태로
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="화면 상태"
        title="화면 상태"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--eo-hair-2)] bg-[var(--eo-raised)] text-[var(--eo-fg-2)] shadow-[var(--eo-float-shadow)] hover:bg-[var(--eo-raised-2)]"
      >
        <Flask size={18} />
      </button>
    </div>
  );
}
