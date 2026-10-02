"use client";

import { useState } from "react";
import { Check } from "@phosphor-icons/react";
import { Button } from "@/projects/platform/studyspot/components/ui";
import type { Navigate } from "@/projects/platform/studyspot/lib/navigation";

type CheckinStep = "payment_success" | "qr_ready" | "checked_in";

/**
 * 8x8 결정론적 QR 목업 패턴. 좌상단/우상단/좌하단 3곳은 실제 QR의 파인더 패턴처럼
 * 3x3 블록(중앙 1칸만 비움)으로 렌더링하고, 나머지 37칸은 고정 배열로 채운다.
 * Math.random()을 쓰지 않아 매 렌더마다 같은 모양을 유지한다.
 */
const QR_DATA_PATTERN: (0 | 1)[] = [
  1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0,
];

function isFinderBlock(row: number, col: number) {
  const topLeft = row <= 2 && col <= 2;
  const topRight = row <= 2 && col >= 5;
  const bottomLeft = row >= 5 && col <= 2;
  return topLeft || topRight || bottomLeft;
}

function isFinderCenter(row: number, col: number) {
  return (row === 1 && col === 1) || (row === 1 && col === 6) || (row === 6 && col === 1);
}

function QrMock() {
  const cells: React.ReactNode[] = [];
  let dataIndex = 0;

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const key = `${row}-${col}`;
      let on: boolean;
      if (isFinderBlock(row, col)) {
        on = !isFinderCenter(row, col);
      } else {
        on = QR_DATA_PATTERN[dataIndex] === 1;
        dataIndex += 1;
      }
      cells.push(<span key={key} className={`aspect-square rounded-[1px] ${on ? "bg-[var(--ss-ink)]" : "bg-[var(--ss-canvas)]"}`} />);
    }
  }

  return <div className="grid grid-cols-8 gap-[2px]">{cells}</div>;
}

function CheckBadge() {
  return (
    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ss-positive)]">
      <Check size={36} weight="bold" className="text-[var(--ss-canvas)]" />
    </span>
  );
}

export function QrCheckinScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [step, setStep] = useState<CheckinStep>("payment_success");

  if (step === "payment_success") {
    return (
      <div className="ss-enter flex min-h-full flex-col items-center justify-center px-6 text-center">
        <CheckBadge />
        <h1 className="mt-6 text-[20px] font-bold leading-[26px] text-[var(--ss-ink)]">결제가 완료되었어요</h1>
        <p className="mt-2 text-[14px] leading-[20px] text-[var(--ss-mute)]">
          판교점 자유석 3시간 이용권 결제가 확인됐어요.
        </p>
        <div className="mt-8 w-full">
          <Button full size="lg" onClick={() => setStep("qr_ready")}>
            QR 코드 발급받기
          </Button>
        </div>
      </div>
    );
  }

  if (step === "qr_ready") {
    return (
      <div className="ss-enter flex min-h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="text-[20px] font-bold leading-[26px] text-[var(--ss-ink)]">
          출입 게이트에
          <br />
          QR 코드를 스캔해 주세요
        </h1>
        <p className="mt-2 text-[13px] leading-[18px] text-[var(--ss-mute)]">
          리더기에 화면을 가까이 대주세요.
        </p>

        <div className="mt-8 rounded-[12px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)] p-5">
          <div className="w-[184px]">
            <QrMock />
          </div>
        </div>

        <p className="ss-mono mt-5 text-[13px] font-medium text-[var(--ss-body)]">StudySpot 강남 본점 | A-03</p>

        <div className="mt-8 w-full">
          <Button full size="lg" onClick={() => setStep("checked_in")}>
            인증 완료 (시뮬레이션)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ss-enter flex min-h-full flex-col items-center justify-center px-6 text-center">
      <CheckBadge />
      <h1 className="mt-6 text-[20px] font-bold leading-[26px] text-[var(--ss-ink)]">입실이 완료되었어요</h1>
      <p className="mt-2 text-[14px] leading-[20px] text-[var(--ss-mute)]">이용 시간 측정이 시작됐어요.</p>
      <div className="mt-8 w-full">
        <Button full size="lg" onClick={() => onNavigate("session")}>
          이용 현황 보기
        </Button>
      </div>
    </div>
  );
}
