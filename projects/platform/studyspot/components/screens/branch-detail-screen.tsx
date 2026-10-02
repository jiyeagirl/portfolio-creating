"use client";

import Image from "next/image";
import { CaretLeft, Check, Clock, MapPin, X } from "@phosphor-icons/react";
import { Badge, Button, Card, EmptyState, RoomCard, SectionHead } from "@/projects/platform/studyspot/components/ui";
import { BRANCHES, STUDY_ROOMS, branchById } from "@/projects/platform/studyspot/lib/mock-data";
import type { Navigate } from "@/projects/platform/studyspot/lib/navigation";

export function BranchDetailScreen({
  branchId,
  onNavigate,
}: {
  branchId?: string;
  onNavigate: Navigate;
}) {
  const branch = (branchId ? branchById(branchId) : undefined) ?? BRANCHES[0];
  const rooms = STUDY_ROOMS.filter((room) => room.branchId === branch.id);
  const hasAnyFacility = branch.hasFreeSeat || branch.hasFixedSeat || branch.hasStudyRoom;

  const facilities = [
    { label: "자유석", available: branch.hasFreeSeat },
    { label: "고정석", available: branch.hasFixedSeat },
    { label: "스터디룸", available: branch.hasStudyRoom },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-[48px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 히어로 지점 사진 */}
        <div className="relative h-[200px] w-full">
          <Image src={branch.photo} alt={`${branch.name} 매장 사진`} fill sizes="440px" className="object-cover" priority />
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="뒤로"
            className="absolute left-4 top-[68px] flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ss-canvas)] text-[var(--ss-ink)]"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
        </div>

        <div className="ss-enter px-5 pt-5">
          {/* 지점명 / 상태 */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[var(--ss-ink)]">
              {branch.name}
            </h1>
            <Badge tone={branch.isOpenNow ? "positive" : "negative"} dot live={branch.isOpenNow}>
              {branch.isOpenNow ? "영업 중" : "마감"}
            </Badge>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-[13.5px] text-[var(--ss-mute)]">
            <MapPin size={14} />
            {branch.address}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-[var(--ss-mute)]">
            <Clock size={14} />
            {branch.openTime} ~ {branch.closeTime} 운영
          </p>

          {/* 보유 시설 */}
          <div className="mt-5 flex gap-2">
            {facilities.map((facility) => (
              <span
                key={facility.label}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border py-2.5 text-[12.5px] font-semibold ${
                  facility.available
                    ? "border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] text-[var(--ss-ink)]"
                    : "border-[var(--ss-hairline)] bg-[var(--ss-surface)] text-[var(--ss-mute-soft)]"
                }`}
              >
                {facility.available ? (
                  <Check size={13} weight="bold" className="text-[var(--ss-positive)]" />
                ) : (
                  <X size={13} weight="bold" className="text-[var(--ss-mute-soft)]" />
                )}
                {facility.label}
              </span>
            ))}
          </div>

          {!hasAnyFacility && (
            <div className="mt-6">
              <EmptyState
                title="오픈을 준비하고 있어요"
                desc={`${branch.name}은 아직 예약을 받지 않는 준비 중인 지점이에요. 오픈하면 알려드릴게요.`}
              />
            </div>
          )}

          {/* 자유석 */}
          {branch.hasFreeSeat && (
            <Card className="mt-6" padded>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-[var(--ss-ink)]">자유석</p>
                  <p className="mt-1 text-[13px] text-[var(--ss-body)]">
                    {branch.freeSeatAvailable} / {branch.freeSeatTotal}석 이용 가능
                  </p>
                </div>
                <Badge tone={branch.freeSeatAvailable > 0 ? "positive" : "negative"}>
                  {branch.freeSeatAvailable > 0 ? "여유" : "만석"}
                </Badge>
              </div>
              <div className="mt-4">
                <Button
                  full
                  size="md"
                  onClick={() => onNavigate("seatBooking", branch.id)}
                  disabled={branch.freeSeatAvailable === 0}
                  ariaLabel="자유석 좌석 선택하기"
                >
                  좌석 선택하기
                </Button>
              </div>
            </Card>
          )}

          {/* 스터디룸 */}
          {branch.hasStudyRoom && rooms.length > 0 && (
            <div className="mt-7">
              <SectionHead title="스터디룸" desc="인원과 시간에 맞는 룸을 예약하세요" />
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {rooms.map((room) => (
                  <div key={room.id} className="min-w-[180px]">
                    <RoomCard
                      photo={room.photo}
                      name={room.name}
                      capacity={room.capacity}
                      hourlyPrice={room.hourlyPrice}
                      onClick={() => onNavigate("roomBooking", room.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 고정석 */}
          {branch.hasFixedSeat && (
            <Card className="mt-7" padded>
              <p className="text-[15px] font-bold text-[var(--ss-ink)]">고정석</p>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[var(--ss-body)]">
                월 단위로 이용 가능한 고정 좌석입니다.
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  full
                  size="md"
                  onClick={() => onNavigate("fixedSeat", branch.id)}
                  ariaLabel="고정석 알아보기"
                >
                  고정석 알아보기
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
