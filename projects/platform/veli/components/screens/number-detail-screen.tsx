"use client";

import { useEffect, useState } from "react";
import {
  ArrowsClockwise,
  CheckCircle,
  DownloadSimple,
  Printer,
  QrCode,
  ShareNetwork,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import { MY_SAFE_NUMBERS } from "@/projects/platform/veli/lib/mock-data";
import {
  CtiStatusBadge,
  SafeNumberHero,
  VehicleTile,
} from "@/projects/platform/veli/components/ui";

/* 실제 스캔 가능한 QR이 아니라, "이런 게 있다"는 시각적 인상을 주기 위한 목업
   패턴이다. 고정된 수식으로 한 번만 계산해 매 렌더마다 모양이 바뀌지 않는다. */
const QR_SIZE = 17;

function buildQrPattern(): boolean[][] {
  const grid: boolean[][] = Array.from({ length: QR_SIZE }, () => Array(QR_SIZE).fill(false));

  const inFinderZone = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= QR_SIZE - 7) || (r >= QR_SIZE - 7 && c < 7);

  const stampFinder = (baseR: number, baseC: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isRing = r === 0 || r === 6 || c === 0 || c === 6;
        const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[baseR + r][baseC + c] = isRing || isCore;
      }
    }
  };

  stampFinder(0, 0);
  stampFinder(0, QR_SIZE - 7);
  stampFinder(QR_SIZE - 7, 0);

  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      if (inFinderZone(r, c)) continue;
      grid[r][c] = (r * 5 + c * 3 + (r % 3) * 7) % 4 === 0 || (r + c) % 5 === 0;
    }
  }

  return grid;
}

const QR_PATTERN = buildQrPattern();

export function NumberDetailScreen({
  safeNumberId,
  onNavigate,
}: {
  safeNumberId: string;
  onNavigate: NavigateFn;
}) {
  const safeNumber = MY_SAFE_NUMBERS.find((s) => s.id === safeNumberId) ?? MY_SAFE_NUMBERS[0];

  const [reissueRequested, setReissueRequested] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="vl-enter">

      <div className="px-5 pb-12 pt-4">
        <SafeNumberHero
          number={safeNumber.number}
          vehicleNumber={safeNumber.vehicle.number}
          status={safeNumber.status}
        />

        <section className="mt-5 rounded-[12px] border border-[var(--vl-border)] p-4">
          <div className="flex items-center gap-3">
            <VehicleTile color={safeNumber.vehicle.color} size={44} />
            <div className="min-w-0 flex-1">
              <p className="vl-num text-[15px] font-bold">{safeNumber.vehicle.number}</p>
              <p className="mt-0.5 truncate text-[12.5px] text-[var(--vl-muted)]">
                {safeNumber.vehicle.model} | {safeNumber.vehicle.color}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--vl-divider)] pt-4">
            <div>
              <p className="text-[11.5px] text-[var(--vl-muted)]">차량 등록일</p>
              <p className="vl-num mt-0.5 text-[13px] font-semibold">
                {safeNumber.vehicle.registeredAt}
              </p>
            </div>
            <div>
              <p className="text-[11.5px] text-[var(--vl-muted)]">이번 달 통화</p>
              <p className="vl-num mt-0.5 text-[13px] font-semibold">
                {safeNumber.callCountThisMonth}건
              </p>
            </div>
            <div>
              <p className="text-[11.5px] text-[var(--vl-muted)]">발급일</p>
              <p className="vl-num mt-0.5 text-[13px] font-semibold">{safeNumber.issuedAt}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[var(--vl-muted)]">만료 예정일</p>
              <p className="vl-num mt-0.5 text-[13px] font-semibold">{safeNumber.expiresAt}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--vl-divider)] pt-4">
            <p className="text-[12.5px] font-semibold text-[var(--vl-muted)]">회선 연결 상태</p>
            <CtiStatusBadge status={safeNumber.ctiStatus} />
          </div>
        </section>

        <section className="mt-5">
          {!reissueRequested ? (
            <button
              type="button"
              onClick={() => setReissueRequested(true)}
              className="flex w-full items-center gap-3 rounded-[12px] border border-[var(--vl-border)] px-4 py-3.5 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vl-surface)] text-[var(--vl-muted)]">
                <ArrowsClockwise size={17} />
              </span>
              <span className="flex-1 text-[14px] font-semibold">재발급 요청</span>
              <span className="text-[12px] text-[var(--vl-muted)]">번호는 그대로 유지</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-[12px] bg-[var(--vl-success-soft)] px-4 py-3.5 text-[var(--vl-success)]">
              <CheckCircle size={19} weight="fill" />
              <p className="text-[13px] font-semibold">
                재발급 요청이 접수되었습니다. 영업일 기준 1일 이내 처리됩니다.
              </p>
            </div>
          )}
        </section>

        <section className="mt-3">
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            className="flex w-full items-center gap-3 rounded-[12px] border border-[var(--vl-border)] px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vl-surface)] text-[var(--vl-muted)]">
              <QrCode size={17} />
            </span>
            <span className="flex-1 text-[14px] font-semibold">QR 주차번호판 보기</span>
            <span className="text-[12px] text-[var(--vl-muted)]">{showQr ? "접기" : "펼치기"}</span>
          </button>

          {showQr && (
            <div className="mt-2.5 flex flex-col items-center rounded-[12px] border border-[var(--vl-border)] px-5 py-6">
              <div className="rounded-[12px] bg-white p-4" style={{ boxShadow: "var(--vl-shadow)" }}>
                <div
                  className="grid gap-[1.5px]"
                  style={{
                    gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)`,
                    width: 187,
                    height: 187,
                  }}
                >
                  {QR_PATTERN.flatMap((row, r) =>
                    row.map((on, c) => (
                      <span
                        key={`${r}-${c}`}
                        className={on ? "bg-[#1d1d1f]" : "bg-transparent"}
                      />
                    )),
                  )}
                </div>
              </div>
              <p className="vl-num mt-4 text-[15px] font-bold">{safeNumber.number}</p>
              <p className="mt-1 text-center text-[12px] leading-relaxed text-[var(--vl-muted)]">
                차량 유리창에 부착하면 이 QR을 스캔한 사람이
                <br />
                번호 노출 없이 안심번호로 연결할 수 있습니다.
              </p>
            </div>
          )}
        </section>

        <section className="mt-3">
          <button
            type="button"
            onClick={() => setShowShareSheet((v) => !v)}
            className="flex w-full items-center gap-3 rounded-[12px] border border-[var(--vl-border)] px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vl-surface)] text-[var(--vl-muted)]">
              <ShareNetwork size={17} />
            </span>
            <span className="flex-1 text-[14px] font-semibold">번호 공유 / 출력</span>
            <span className="text-[12px] text-[var(--vl-muted)]">
              {showShareSheet ? "접기" : "펼치기"}
            </span>
          </button>

          {showShareSheet && (
            <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[var(--vl-border)]">
              <button
                type="button"
                onClick={() => setToast("이미지로 저장되었습니다")}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <DownloadSimple size={17} className="text-[var(--vl-muted)]" />
                <span className="flex-1 text-[13.5px] font-semibold">이미지로 저장</span>
              </button>
              <div className="h-px bg-[var(--vl-divider)]" />
              <button
                type="button"
                onClick={() => setToast("인쇄를 시작합니다")}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <Printer size={17} className="text-[var(--vl-muted)]" />
                <span className="flex-1 text-[13.5px] font-semibold">인쇄하기</span>
              </button>
            </div>
          )}

          {toast && (
            <div className="mt-2.5 flex items-center gap-2 rounded-full bg-[var(--vl-accent-soft)] px-4 py-2.5 text-[12.5px] font-semibold text-[var(--vl-accent)]">
              <CheckCircle size={15} weight="fill" />
              {toast}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
