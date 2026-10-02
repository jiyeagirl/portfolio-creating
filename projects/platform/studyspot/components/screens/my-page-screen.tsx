"use client";

import { CaretRight, MapPin } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { BottomNav } from "@/projects/platform/studyspot/components/bottom-nav";
import { Badge, Button, Card, SectionHead } from "@/projects/platform/studyspot/components/ui";
import { BRANCHES, CURRENT_USER, PASSES, PAYMENT_RECORDS } from "@/projects/platform/studyspot/lib/mock-data";
import { dateOnly, won, type Navigate } from "@/projects/platform/studyspot/lib/navigation";

export function MyPageScreen({ onNavigate }: { onNavigate: Navigate }) {
  const favorites = BRANCHES.filter((b) => b.favorited);

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="마이페이지"
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--ss-ink)]"
      />

      <div className="flex-1 overflow-y-auto px-5 pb-[140px] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 프로필 요약 */}
        <Card padded className="ss-enter">
          <p className="text-[20px] font-extrabold tracking-[-0.01em] text-[var(--ss-ink)]">{CURRENT_USER.name}</p>
          <p className="mt-1 text-[13px] text-[var(--ss-mute)]">{CURRENT_USER.email}</p>
          <p className="mt-0.5 text-[13px] text-[var(--ss-mute)]">{CURRENT_USER.phone}</p>
        </Card>

        {/* 포인트 / 쿠폰 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas-soft)] p-4">
            <p className="text-[12px] text-[var(--ss-mute)]">포인트</p>
            <p className="ss-mono mt-1 text-[17px] font-bold text-[var(--ss-ink)]">
              {CURRENT_USER.point.toLocaleString("ko-KR")}P
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas-soft)] p-4">
            <p className="text-[12px] text-[var(--ss-mute)]">쿠폰</p>
            <p className="ss-mono mt-1 text-[17px] font-bold text-[var(--ss-ink)]">{CURRENT_USER.couponCount}장</p>
          </div>
        </div>

        {/* 보유 이용권 */}
        <div className="mt-7">
          <SectionHead title="보유 이용권" />
          <div className="space-y-3">
            {PASSES.map((pass) => {
              const remaining = pass.type === "time" ? pass.remainingHours : pass.remainingDays;
              const expired = !remaining || remaining <= 0;
              return (
                <Card key={pass.id} padded className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[15px] font-bold text-[var(--ss-ink)]">{pass.name}</p>
                      <Badge tone="neutral">{pass.type === "time" ? "시간권" : "기간권"}</Badge>
                    </div>
                    <p className="mt-1.5 text-[12.5px] text-[var(--ss-mute)]">{dateOnly(pass.expiresAt)}까지</p>
                  </div>
                  {expired ? (
                    <Badge tone="neutral">만료됨</Badge>
                  ) : (
                    <p className="ss-mono shrink-0 text-[15px] font-bold text-[var(--ss-ink)]">
                      {pass.type === "time" ? `${pass.remainingHours}시간` : `${pass.remainingDays}일`} 남음
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* 즐겨찾는 지점 */}
        {favorites.length > 0 && (
          <div className="mt-7">
            <SectionHead title="즐겨찾는 지점" />
            <div className="space-y-2">
              {favorites.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => onNavigate("branchDetail", branch.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)] p-4 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ss-surface)] text-[var(--ss-ink)]">
                      <MapPin size={16} weight="bold" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14.5px] font-semibold text-[var(--ss-ink)]">{branch.name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-[var(--ss-mute)]">{branch.address}</p>
                    </div>
                  </div>
                  <CaretRight size={14} className="shrink-0 text-[var(--ss-mute)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 결제 내역 */}
        <div className="mt-7">
          <SectionHead
            title="결제 내역"
            action={<span className="text-[12.5px] font-medium text-[var(--ss-mute)]">전체보기</span>}
          />
          <div className="space-y-2">
            {PAYMENT_RECORDS.slice(0, 4).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)] p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[var(--ss-ink)]">{record.item}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ss-mute)]">
                    {record.method} | {dateOnly(record.paidAt)}
                  </p>
                </div>
                <p className="ss-mono shrink-0 text-[14.5px] font-bold text-[var(--ss-ink)]">{won(record.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 계정 */}
        <div className="mt-7">
          <SectionHead title="계정" />
          <Button variant="secondary" full onClick={() => onNavigate("login")}>
            로그아웃
          </Button>
          <div className="mt-4 text-center">
            <button type="button" className="text-[12px] text-[var(--ss-negative)]">
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>

      <BottomNav screen="myPage" onNavigate={onNavigate} />
    </div>
  );
}
