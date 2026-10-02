"use client";

import { useState } from "react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Badge, Button, Card, EmptyState, SeatChip, SectionHead } from "@/projects/platform/studyspot/components/ui";
import { FIXED_SEATS, FIXED_SEAT_CONTRACTS } from "@/projects/platform/studyspot/lib/mock-data";
import {
  CONTRACT_STATUS_LABEL,
  CONTRACT_STATUS_TONE,
  dateOnly,
  won,
  type Navigate,
} from "@/projects/platform/studyspot/lib/navigation";
import type { FixedSeat, FixedSeatContract } from "@/projects/platform/studyspot/lib/types";

const MONTH_OPTIONS = [1, 3, 6] as const;

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-[var(--ss-mute)]">{label}</span>
      <span className="ss-mono text-[13.5px] font-semibold text-[var(--ss-ink)]">{value}</span>
    </div>
  );
}

function SeatZoneMap({
  seats,
  selectedSeatId,
  onSelect,
}: {
  seats: FixedSeat[];
  selectedSeatId: string | null;
  onSelect: (id: string) => void;
}) {
  const zones = Array.from(new Set(seats.map((s) => s.zone)));
  return (
    <div className="space-y-5">
      {zones.map((zone) => (
        <div key={zone}>
          <p className="mb-2 text-[12.5px] font-semibold text-[var(--ss-mute)]">{zone}</p>
          <div className="grid grid-cols-3 gap-2">
            {seats
              .filter((s) => s.zone === zone)
              .map((seat) => (
                <SeatChip
                  key={seat.id}
                  label={seat.label}
                  state={
                    seat.status === "occupied"
                      ? "occupied"
                      : seat.id === selectedSeatId
                        ? "selected"
                        : "available"
                  }
                  disabled={seat.status === "occupied"}
                  onClick={() => onSelect(seat.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 관리 모드 (이미 계약 중인 경우) ── */

function FixedSeatManage({
  branchId,
  contract,
  onNavigate,
}: {
  branchId: string;
  contract: FixedSeatContract;
  onNavigate: Navigate;
}) {
  const [extended, setExtended] = useState(false);
  const [changingSeat, setChangingSeat] = useState(false);
  const [changeSeatId, setChangeSeatId] = useState<string | null>(null);
  const [seatChanged, setSeatChanged] = useState(false);

  const availableSeats = FIXED_SEATS.filter((s) => s.branchId === branchId && s.status === "available");
  const changeTarget = availableSeats.find((s) => s.id === changeSeatId);

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="고정석 관리"
        onBack={() => onNavigate("branchDetail", branchId)}
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[15.5px] font-bold text-[var(--ss-ink)]"
        backButtonClassName="text-[var(--ss-ink)]"
      />

      <div className="ss-enter flex-1 overflow-y-auto px-5 pb-8 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[16px] font-bold text-[var(--ss-ink)]">{contract.seatLabel}</p>
              <p className="mt-0.5 text-[12.5px] text-[var(--ss-mute)]">
                {dateOnly(contract.startDate)} ~ {dateOnly(contract.endDate)}
              </p>
            </div>
            <Badge tone={CONTRACT_STATUS_TONE[contract.status]}>{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
          </div>

          <div className="mt-5 flex items-baseline gap-1.5 border-t border-[var(--ss-hairline)] pt-5">
            <span className="ss-mono text-[30px] font-extrabold leading-none text-[var(--ss-ink)]">
              {contract.remainingDays}
            </span>
            <span className="text-[14px] font-semibold text-[var(--ss-body)]">일 남음</span>
          </div>
        </Card>

        <Card className="mt-4" padded>
          <div className="divide-y divide-[var(--ss-hairline)]">
            <DefRow label="월 이용료" value={won(contract.monthlyPrice)} />
            <DefRow label="계약 시작일" value={dateOnly(contract.startDate)} />
            <DefRow label="계약 종료일" value={dateOnly(contract.endDate)} />
          </div>
        </Card>

        <div className="mt-5 flex items-center gap-3">
          <Button variant="primary" full disabled={extended} onClick={() => setExtended(true)}>
            연장 신청
          </Button>
          <Button variant="secondary" full onClick={() => setChangingSeat((v) => !v)}>
            좌석 변경 신청
          </Button>
        </div>

        {extended && (
          <div className="mt-3 flex justify-center">
            <Badge tone="positive" dot>
              연장 신청 완료
            </Badge>
          </div>
        )}

        {changingSeat && (
          <div className="mt-7">
            <SectionHead title="좌석 변경" desc="이용 가능한 좌석 중에서 선택해 주세요" />
            {availableSeats.length > 0 ? (
              <>
                <SeatZoneMap
                  seats={availableSeats}
                  selectedSeatId={changeSeatId}
                  onSelect={(id) => {
                    setChangeSeatId(id);
                    setSeatChanged(false);
                  }}
                />

                {changeTarget && (
                  <Card className="mt-5" soft>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[15px] font-bold text-[var(--ss-ink)]">{changeTarget.label}</p>
                        <p className="mt-0.5 text-[12.5px] text-[var(--ss-mute)]">{changeTarget.zone}</p>
                      </div>
                      <p className="ss-mono text-[15px] font-semibold text-[var(--ss-ink)]">
                        {won(changeTarget.monthlyPrice)}
                      </p>
                    </div>
                  </Card>
                )}

                <div className="mt-4">
                  <Button variant="primary" full disabled={!changeSeatId} onClick={() => setSeatChanged(true)}>
                    변경 신청하기
                  </Button>
                </div>

                {seatChanged && (
                  <div className="mt-3 flex justify-center">
                    <Badge tone="positive" dot>
                      좌석 변경 신청 완료
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="변경 가능한 좌석이 없어요"
                desc="현재 이 지점에는 이용 가능한 고정석이 없습니다. 나중에 다시 시도해 주세요."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 신청 모드 (계약이 없는 경우) ── */

function FixedSeatApply({ branchId, onNavigate }: { branchId: string; onNavigate: Navigate }) {
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [months, setMonths] = useState<(typeof MONTH_OPTIONS)[number]>(1);

  const seats = FIXED_SEATS.filter((s) => s.branchId === branchId);
  const selectedSeat = seats.find((s) => s.id === selectedSeatId);
  const totalPrice = selectedSeat ? selectedSeat.monthlyPrice * months : 0;

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="고정석 신청"
        onBack={() => onNavigate("branchDetail", branchId)}
        className="bg-[var(--ss-canvas)] border-[var(--ss-hairline)]"
        titleClassName="text-[15.5px] font-bold text-[var(--ss-ink)]"
        backButtonClassName="text-[var(--ss-ink)]"
      />

      <div className="ss-enter flex-1 overflow-y-auto px-5 pb-8 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-[13.5px] leading-[20px] text-[var(--ss-body)]">
          고정석은 매달 자동 갱신되는 월 단위 정기 좌석이에요. 원하는 좌석과 이용 기간을 선택하면
          결제 후 바로 이용을 시작할 수 있어요.
        </p>

        <div className="mt-6">
          <SectionHead title="좌석 배치도" desc="비어 있는 좌석만 선택할 수 있어요" />
          <SeatZoneMap seats={seats} selectedSeatId={selectedSeatId} onSelect={setSelectedSeatId} />
        </div>

        <div className="mt-7">
          <SectionHead title="이용 기간 선택" />
          <div className="flex gap-2 rounded-[6px] border border-[var(--ss-hairline-strong)] p-1">
            {MONTH_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonths(m)}
                className={`h-10 flex-1 rounded-[4px] text-[13.5px] font-semibold transition-colors ${
                  months === m ? "bg-[var(--ss-ink)] text-[var(--ss-on-ink)]" : "text-[var(--ss-body)]"
                }`}
              >
                {m}개월
              </button>
            ))}
          </div>
        </div>

        {selectedSeat && (
          <Card className="mt-6" soft>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-[var(--ss-ink)]">{selectedSeat.label}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--ss-mute)]">{selectedSeat.zone}</p>
              </div>
              <p className="ss-mono text-[13px] text-[var(--ss-mute)]">{won(selectedSeat.monthlyPrice)} / 월</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--ss-hairline)] pt-4">
              <span className="text-[13.5px] font-medium text-[var(--ss-body)]">총 결제 금액 ({months}개월)</span>
              <span className="ss-mono text-[17px] font-extrabold text-[var(--ss-ink)]">{won(totalPrice)}</span>
            </div>
          </Card>
        )}

        <div className="mt-7">
          <Button variant="primary" full size="lg" disabled={!selectedSeat} onClick={() => onNavigate("payment", branchId)}>
            신청하기
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── 엔트리 ── */

export function FixedSeatScreen({ branchId, onNavigate }: { branchId?: string; onNavigate: Navigate }) {
  const activeBranchId = branchId ?? "gangnam";
  const contract = FIXED_SEAT_CONTRACTS.find((c) => c.branchId === activeBranchId);

  if (contract) {
    return <FixedSeatManage branchId={activeBranchId} contract={contract} onNavigate={onNavigate} />;
  }
  return <FixedSeatApply branchId={activeBranchId} onNavigate={onNavigate} />;
}
