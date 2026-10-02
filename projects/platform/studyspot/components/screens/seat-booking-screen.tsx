"use client";

import { useState } from "react";
import { Check, Monitor, Plug } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Badge, Button, SectionHead, SeatChip } from "@/projects/platform/studyspot/components/ui";
import { BRANCHES, FREE_SEATS, PASSES, branchById } from "@/projects/platform/studyspot/lib/mock-data";
import { won, type Navigate } from "@/projects/platform/studyspot/lib/navigation";
import type { FreeSeat } from "@/projects/platform/studyspot/lib/types";

/** 이용권 미선택 시 보여줄 예상 요금 계산용 — 실제 과금 로직이 아니라 화면 예시용 값. */
const HOURLY_RATE = 2000;
const ASSUMED_HOURS = 2;

export function SeatBookingScreen({ branchId, onNavigate }: { branchId?: string; onNavigate: Navigate }) {
  const branch = (branchId ? branchById(branchId) : undefined) ?? BRANCHES.find((b) => b.hasFreeSeat) ?? BRANCHES[0];

  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);

  const seats = FREE_SEATS.filter((seat) => seat.branchId === branch.id);
  const zones = seats.reduce<{ zone: string; seats: FreeSeat[] }[]>((acc, seat) => {
    const group = acc.find((z) => z.zone === seat.zone);
    if (group) group.seats.push(seat);
    else acc.push({ zone: seat.zone, seats: [seat] });
    return acc;
  }, []);

  const selectedSeat = seats.find((s) => s.id === selectedSeatId) ?? null;
  const availablePasses = PASSES.filter((p) => (p.remainingHours ?? p.remainingDays ?? 0) > 0);
  const selectedPass = availablePasses.find((p) => p.id === selectedPassId) ?? null;
  const estimatedCost = HOURLY_RATE * ASSUMED_HOURS;

  return (
    <div className="relative flex h-full flex-col">
      <ScreenHeader
        title="자유석 예약"
        subtitle={branch.name}
        onBack={() => onNavigate("branchDetail", branch.id)}
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[15.5px] font-bold text-[var(--ss-ink)]"
        subtitleClassName="text-[11px] text-[var(--ss-mute)]"
      />

      <div className="flex-1 overflow-y-auto px-5 pb-[100px] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 좌석 배치도 */}
        <SectionHead title="좌석 배치도" desc="실시간 좌석 현황" />

        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] bg-[var(--ss-surface)] px-3.5 py-3">
          <LegendItem swatchClassName="border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)]" label="선택 가능" />
          <LegendItem swatchClassName="border-transparent bg-[var(--ss-mute-soft)]" label="이용 중" />
          <LegendItem swatchClassName="border-[var(--ss-info)] bg-[var(--ss-info-soft)]" label="예약됨" />
          <LegendItem swatchClassName="border-[var(--ss-ink)] bg-[var(--ss-ink)]" label="선택함" />
        </div>

        {zones.map((group) => (
          <div key={group.zone} className="mb-6">
            <p className="mb-2.5 text-[13px] font-semibold text-[var(--ss-body)]">{group.zone}</p>
            <div className="grid grid-cols-4 gap-2">
              {group.seats.map((seat) => {
                const isSelected = seat.id === selectedSeatId;
                const isTappable = seat.status === "available";
                return (
                  <SeatChip
                    key={seat.id}
                    label={seat.label}
                    state={isSelected ? "selected" : seat.status}
                    disabled={!isTappable}
                    onClick={isTappable ? () => setSelectedSeatId(seat.id) : undefined}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* 선택 좌석 상세 (콘센트 / 모니터) */}
        {selectedSeat && (
          <div className="mb-7 flex flex-wrap items-center gap-4 rounded-[10px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas-soft)] px-4 py-3">
            <span className="ss-mono text-[13px] font-bold text-[var(--ss-ink)]">{selectedSeat.label} 선택됨</span>
            <span className="flex items-center gap-1 text-[12px] text-[var(--ss-mute)]">
              <Plug
                size={14}
                weight={selectedSeat.hasPower ? "bold" : "regular"}
                className={selectedSeat.hasPower ? "text-[var(--ss-positive)]" : "text-[var(--ss-mute-soft)]"}
              />
              콘센트 {selectedSeat.hasPower ? "있음" : "없음"}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-[var(--ss-mute)]">
              <Monitor
                size={14}
                weight={selectedSeat.hasMonitor ? "bold" : "regular"}
                className={selectedSeat.hasMonitor ? "text-[var(--ss-positive)]" : "text-[var(--ss-mute-soft)]"}
              />
              모니터 {selectedSeat.hasMonitor ? "있음" : "없음"}
            </span>
          </div>
        )}

        {/* 이용권 선택 */}
        <SectionHead title="이용권 선택" desc="시간권 / 기간권을 적용해 결제할 수 있어요" />
        {availablePasses.length > 0 ? (
          <div className="space-y-2">
            {availablePasses.map((pass) => {
              const selected = pass.id === selectedPassId;
              const remainLabel =
                pass.type === "time" ? `${pass.remainingHours}시간 남음` : `${pass.remainingDays}일 남음`;
              return (
                <button
                  key={pass.id}
                  type="button"
                  onClick={() => setSelectedPassId(selected ? null : pass.id)}
                  className={`flex w-full items-center justify-between rounded-[10px] border bg-[var(--ss-canvas)] px-4 py-3.5 text-left transition-colors ${
                    selected ? "border-[var(--ss-ink)]" : "border-[var(--ss-hairline)]"
                  }`}
                >
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--ss-ink)]">{pass.name}</p>
                    <p className="ss-mono mt-0.5 text-[12px] text-[var(--ss-mute)]">{remainLabel}</p>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-[var(--ss-ink)] bg-[var(--ss-ink)]" : "border-[var(--ss-hairline-strong)]"
                    }`}
                  >
                    {selected && <Check size={12} weight="bold" className="text-[var(--ss-on-ink)]" />}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] leading-5 text-[var(--ss-mute)]">
            보유한 이용권이 없어요. 결제 화면에서 새 이용권을 구매할 수 있어요.
          </p>
        )}
      </div>

      {/* 하단 요약 바 — 불투명 표면, absolute로 화면 박스 안쪽에 고정 */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--ss-hairline)] bg-[var(--ss-canvas)] px-5 pb-8 pt-3.5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-[var(--ss-mute)]">
              {selectedSeat ? `선택 좌석 ${selectedSeat.label}` : "좌석을 선택해 주세요"}
            </p>
            <p className="ss-mono text-[17px] font-extrabold text-[var(--ss-ink)]">
              {selectedPass ? "이용권 적용" : won(estimatedCost)}
            </p>
          </div>
          {selectedPass && (
            <Badge tone="info" dot>
              {selectedPass.name}
            </Badge>
          )}
        </div>
        <Button full disabled={!selectedSeatId} onClick={() => onNavigate("payment", branch.id)}>
          결제하기
        </Button>
      </div>
    </div>
  );
}

function LegendItem({ swatchClassName, label }: { swatchClassName: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-[4px] border ${swatchClassName}`} />
      <span className="text-[11px] text-[var(--ss-mute)]">{label}</span>
    </div>
  );
}
