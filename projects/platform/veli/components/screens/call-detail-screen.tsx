"use client";

import { useState } from "react";
import {
  CheckCircle,
  PhoneIncoming,
  PhoneOutgoing,
  ShieldWarning,
} from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/veli/lib/navigation";
import { CALL_LOGS } from "@/projects/platform/veli/lib/mock-data";
import { Badge, CallResultBadge, DangerGhostButton, GhostButton } from "@/projects/platform/veli/components/ui";

function formatDuration(sec: number) {
  if (sec <= 0) return "통화하지 않음";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CallDetailScreen({
  callId,
  onNavigate,
}: {
  callId: string;
  onNavigate: NavigateFn;
}) {
  const call = CALL_LOGS.find((c) => c.id === callId) ?? CALL_LOGS[0];

  const [reported, setReported] = useState(call.reported);
  const [deleteRequested, setDeleteRequested] = useState(false);

  return (
    <div className="vl-enter flex min-h-full flex-col bg-[var(--vl-canvas)]">

      <div className="flex-1 overflow-y-auto px-5 pb-9 pt-5">
        <div className="rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] p-5">
          <div className="flex items-center gap-3.5">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                call.direction === "incoming"
                  ? "bg-[var(--vl-accent-soft)] text-[var(--vl-accent)]"
                  : "bg-[var(--vl-surface)] text-[var(--vl-muted)]"
              }`}
            >
              {call.direction === "incoming" ? (
                <PhoneIncoming size={20} weight="fill" />
              ) : (
                <PhoneOutgoing size={20} weight="fill" />
              )}
            </span>
            <div>
              <p className="text-[16px] font-bold">
                {call.direction === "incoming" ? "수신 통화" : "발신 통화"}
              </p>
              <p className="mt-0.5 text-[12.5px] text-[var(--vl-muted)]">{call.counterpartLabel}</p>
            </div>
            <span className="ml-auto">
              <CallResultBadge result={call.result} />
            </span>
          </div>

          <dl className="vl-num mt-5 space-y-2.5 border-t border-[var(--vl-divider)] pt-4 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-[var(--vl-muted)]">사용된 안심번호</dt>
              <dd className="font-semibold">{call.safeNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--vl-muted)]">일시</dt>
              <dd className="font-semibold">
                {call.date} {call.time}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--vl-muted)]">통화 시간</dt>
              <dd className="font-semibold">{formatDuration(call.durationSec)}</dd>
            </div>
          </dl>

          {call.memo && (
            <p className="mt-4 rounded-[8px] bg-[var(--vl-surface)] px-3.5 py-3 text-[12.5px] leading-relaxed text-[var(--vl-muted)]">
              {call.memo}
            </p>
          )}
        </div>

        {reported && (
          <div className="mt-4 flex items-center gap-2.5 rounded-[12px] border border-[var(--vl-danger)]/25 bg-[var(--vl-danger-soft)] px-4 py-3.5">
            <ShieldWarning size={18} weight="fill" className="shrink-0 text-[var(--vl-danger)]" />
            <p className="text-[12.5px] font-semibold leading-relaxed text-[var(--vl-danger)]">
              스팸으로 신고 접수되었습니다. 해당 번호로부터의 재연결이 제한됩니다.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-2.5">
          {!reported && (
            <GhostButton onClick={() => setReported(true)}>스팸으로 신고</GhostButton>
          )}

          {!deleteRequested ? (
            <DangerGhostButton onClick={() => setDeleteRequested(true)}>
              통화 기록 삭제 요청
            </DangerGhostButton>
          ) : (
            <div className="flex items-start gap-2.5 rounded-[12px] border border-[var(--vl-border)] bg-[var(--vl-surface)] px-4 py-3.5">
              <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--vl-success)]" />
              <p className="text-[12.5px] leading-relaxed text-[var(--vl-muted)]">
                삭제 요청이 접수되었습니다. 개인정보 처리방침에 따라 영업일 기준 3일 이내에
                해당 통화 기록이 삭제 처리됩니다.
              </p>
            </div>
          )}
        </div>

        <div className="mt-3">
          <Badge tone="neutral" className="text-[11px]">
            통화 ID {call.id}
          </Badge>
        </div>
      </div>
    </div>
  );
}
