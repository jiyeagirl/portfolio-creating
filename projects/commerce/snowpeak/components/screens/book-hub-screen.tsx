"use client";

import { Bed, CableCar, Package, PersonSimpleSki } from "@phosphor-icons/react";
import { AppBar, PhotoTile } from "@/projects/commerce/snowpeak/components/ui";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

export function BookHubScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="예약" subtitle="원하시는 예약 유형을 선택해 주세요" />

      <div className="flex-1 overflow-y-auto px-5 pb-24 pt-4">
        {/* 객실 대형 히어로 카드 */}
        <button
          type="button"
          onClick={() => onNavigate("roomList")}
          className="relative block h-[220px] w-full overflow-hidden rounded-[16px] text-left transition-transform active:scale-[0.98]"
          style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
        >
          <PhotoTile
            src="https://images.pexels.com/photos/8412597/pexels-photo-8412597.jpeg"
            alt="침엽수림 사이 곤돌라 리프트와 설산 슬로프, 리조트 베이스 스테이션"
            className="absolute inset-0 h-full w-full"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(19,26,34,0) 30%, rgba(19,26,34,.72) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
                <Bed size={19} weight="bold" />
              </span>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-white">객실</h2>
              <p className="mt-1 max-w-[220px] text-[13px] leading-relaxed text-white/80">
                마운틴뷰, 레이크뷰 객실을 날짜와 인원에 맞춰 실시간으로 예약하세요
              </p>
            </div>
          </div>
        </button>

        {/* 리프트권/시즌권 + 장비 렌탈 2열 */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onNavigate("liftSeason")}
            className="relative flex h-[168px] flex-col justify-between overflow-hidden rounded-[16px] bg-[var(--sp-surface)] p-4 text-left transition-transform active:scale-[0.97]"
            style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]">
              <CableCar size={19} weight="bold" />
            </span>
            <div>
              <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">
                리프트권 / 시즌권
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--sp-mute)]">
                1일권부터 프리미엄 시즌권까지
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("rental")}
            className="relative flex h-[168px] flex-col justify-between overflow-hidden rounded-[16px] bg-[var(--sp-surface)] p-4 text-left transition-transform active:scale-[0.97]"
            style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]">
              <PersonSimpleSki size={19} weight="bold" />
            </span>
            <div>
              <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">장비 렌탈</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--sp-mute)]">
                스키, 보드, 부츠, 웨어까지 한번에
              </p>
            </div>
          </button>
        </div>

        {/* 패키지 와이드 카드 */}
        <button
          type="button"
          onClick={() => onNavigate("package")}
          className="relative mt-4 flex h-[124px] w-full items-center gap-4 overflow-hidden rounded-[16px] bg-[var(--sp-surface)] p-4 text-left transition-transform active:scale-[0.97]"
          style={{ boxShadow: "0 1px 2px rgba(19,26,34,.04), 0 12px 28px -14px rgba(19,26,34,.16)" }}
        >
          <PhotoTile
            id={128}
            alt="유럽풍 대형 고성과 잔디 진입로"
            className="h-[92px] w-[92px] shrink-0 rounded-[12px]"
            sizes="92px"
          />
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--sp-accent)]">
              <Package size={13} weight="bold" />
              패키지
            </span>
            <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">
              숙박부터 리프트권까지 한번에
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--sp-mute)]">
              허니문, 패밀리, 프리미엄 구성 상품
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
