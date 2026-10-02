"use client";

import { Bell, CaretRight, Clock, Ticket } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { BottomNav } from "@/projects/platform/studyspot/components/bottom-nav";
import { BranchCard, Card, SectionHead } from "@/projects/platform/studyspot/components/ui";
import { BRANCHES, CURRENT_SESSION, CURRENT_USER, PASSES } from "@/projects/platform/studyspot/lib/mock-data";
import { timeOnly, type Navigate } from "@/projects/platform/studyspot/lib/navigation";

export function HomeScreen({ onNavigate }: { onNavigate: Navigate }) {
  const favorites = BRANCHES.filter((b) => b.favorited);
  const activePass = PASSES.find((p) => (p.remainingHours ?? p.remainingDays ?? 0) > 0);

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="StudySpot"
        subtitle={`안녕하세요, ${CURRENT_USER.name}님`}
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--ss-ink)]"
        subtitleClassName="text-[11px] text-[var(--ss-mute)]"
        right={
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--ss-ink)]"
          >
            <Bell size={20} weight="bold" />
            <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[var(--ss-negative)]" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-[140px] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 이용 중 세션 배너 */}
        {CURRENT_SESSION && (
          <button
            type="button"
            onClick={() => onNavigate("session")}
            className="ss-enter flex w-full items-center justify-between gap-3 rounded-[12px] bg-[var(--ss-ink)] p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-[var(--ss-on-ink)]">
                <Clock size={18} weight="bold" />
              </span>
              <div>
                <p className="text-[13.5px] font-semibold text-[var(--ss-on-ink)]">
                  {CURRENT_SESSION.seatLabel} 좌석 이용 중
                </p>
                <p className="mt-0.5 text-[12px] text-white/60">{timeOnly(CURRENT_SESSION.plannedEndAt)}까지 이용 예정</p>
              </div>
            </div>
            <CaretRight size={16} className="text-white/60" />
          </button>
        )}

        {/* 이용권 요약 */}
        <Card soft className="mt-4 flex items-center justify-between" padded>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ss-surface)] text-[var(--ss-ink)]">
              <Ticket size={18} weight="bold" />
            </span>
            <div>
              <p className="text-[13px] text-[var(--ss-body)]">보유 이용권</p>
              <p className="text-[15px] font-bold text-[var(--ss-ink)]">
                {activePass ? activePass.name : "보유한 이용권이 없어요"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("myPage")}
            className="flex items-center gap-0.5 text-[12.5px] font-medium text-[var(--ss-mute)]"
          >
            전체보기 <CaretRight size={13} />
          </button>
        </Card>

        {/* 즐겨찾기 지점 */}
        {favorites.length > 0 && (
          <div className="mt-7">
            <SectionHead title="즐겨찾는 지점" />
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {favorites.map((branch) => (
                <div key={branch.id} className="min-w-[220px]">
                  <BranchCard
                    photo={branch.photo}
                    name={branch.name}
                    address={branch.address}
                    isOpenNow={branch.isOpenNow}
                    freeSeatAvailable={branch.freeSeatAvailable}
                    freeSeatTotal={branch.freeSeatTotal}
                    favorited={branch.favorited}
                    onClick={() => onNavigate("branchDetail", branch.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주변 지점 */}
        <div className="mt-7">
          <SectionHead title="주변 지점" desc="현재 위치 기준으로 가까운 순" />
          <div className="space-y-3">
            {BRANCHES.map((branch) => (
              <BranchCard
                key={branch.id}
                photo={branch.photo}
                name={branch.name}
                address={branch.address}
                isOpenNow={branch.isOpenNow}
                freeSeatAvailable={branch.freeSeatAvailable}
                freeSeatTotal={branch.freeSeatTotal}
                favorited={branch.favorited}
                onClick={() => onNavigate("branchDetail", branch.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav screen="home" onNavigate={onNavigate} />
    </div>
  );
}
