"use client";

import { useRef } from "react";
import { ArrowClockwise, FileVideo, Pause, UploadSimple } from "@phosphor-icons/react";
import { Button, StatusBadge, type Tone } from "@/projects/platform/eduon/components/console/console-ui";
import { clock } from "@/projects/platform/eduon/lib/format";
import { mb, transferredMb, type UploadState } from "@/projects/platform/eduon/components/studio/studio-model";

/** 목업 전송 속도. 타이머 한 틱(250ms)에 올라가는 양이 이 값에서 나온다 */
export const SPEED_MB = 54.1;
export const TICK_MS = 250;

/** 선형 진행 막대. reduced motion이면 eduon.css 전역 규칙이 전환을 끈다 */
export function Bar({ value, tone }: { value: number; tone: Tone | "brand" }) {
  const fill = {
    green: "bg-[var(--eo-green)]",
    blue: "bg-[var(--eo-blue)]",
    orange: "bg-[var(--eo-orange)]",
    red: "bg-[var(--eo-red)]",
    gray: "bg-[var(--eo-gray)]",
    brand: "bg-[var(--eo-brand)]",
  }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--eo-soft-2)]" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-[width] duration-200 ease-linear ${fill}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

const STATUS: Record<Exclude<UploadState["status"], "idle">, { label: string; tone: Tone }> = {
  uploading: { label: "업로드 중", tone: "blue" },
  paused: { label: "중단", tone: "gray" },
  done: { label: "완료", tone: "green" },
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">{label}</div>
      <div className="mt-0.5 whitespace-nowrap text-[14px] font-semibold tabular-nums text-[var(--eo-ink)]">{value}</div>
    </div>
  );
}

export function UploadPanel({
  upload,
  readOnly,
  onPick,
  onSample,
  onPause,
  onResume,
  onReplace,
}: {
  upload: UploadState;
  readOnly: boolean;
  onPick: (name: string, sizeMb: number) => void;
  onSample: () => void;
  onPause: () => void;
  onResume: () => void;
  onReplace: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const moved = transferredMb(upload);
  const remainSec = (upload.sizeMb - moved) / SPEED_MB;
  const gb = (upload.sizeMb / 1024).toFixed(1);

  return (
    <div className="rounded-[10px] border border-[var(--eo-line)]">
      <div className="flex items-center gap-2 border-b border-[var(--eo-line)] px-4 py-3">
        <span className="text-[13px] font-semibold text-[var(--eo-ink)]">1강 원본 영상</span>
      </div>

      {upload.status === "idle" ? (
        <div className="flex flex-col items-center px-4 py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--eo-soft)] text-[var(--eo-ink-2)]">
            <UploadSimple size={22} />
          </span>
          <div className="mt-3 text-[13px] font-semibold text-[var(--eo-ink)]">올린 영상이 없어요</div>
          <div className="mt-1 text-[12px] text-[var(--eo-ink-3)]">MP4, MOV | 최대 4 GB | 1080p 이상</div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button disabled={readOnly} onClick={() => inputRef.current?.click()}>
              파일 선택
            </Button>
            <Button variant="primary" disabled={readOnly} onClick={onSample}>
              예시 영상으로 체험
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f.name, Math.max(1, f.size / (1024 * 1024)));
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--eo-soft)] text-[var(--eo-ink-2)]">
              <FileVideo size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="eo-mono truncate text-[var(--eo-ink)]" title={upload.fileName}>
                {upload.fileName}
              </div>
              <div className="text-[12px] text-[var(--eo-ink-3)]">{gb} GB | 1080p 원본 | 14:26</div>
            </div>
            <StatusBadge tone={STATUS[upload.status].tone}>{STATUS[upload.status].label}</StatusBadge>
          </div>

          <div className="mt-4">
            <Bar value={upload.pct} tone={STATUS[upload.status].tone} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <Stat label="전송량 (MB)" value={`${mb(moved)} / ${mb(upload.sizeMb)}`} />
            <Stat label="진행률 (%)" value={String(Math.floor(upload.pct))} />
            <Stat label="전송 속도 (MB/s)" value={upload.status === "uploading" ? mb(SPEED_MB) : "0.0"} />
            <Stat label="남은 시간" value={upload.status === "done" ? "0:00" : clock(remainSec)} />
          </div>

          {!readOnly && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--eo-line)] pt-3">
              {upload.status === "uploading" && (
                <Button icon={<Pause size={14} />} onClick={onPause}>
                  업로드 중단
                </Button>
              )}
              {upload.status === "paused" && (
                <>
                  <Button variant="primary" icon={<ArrowClockwise size={14} />} onClick={onResume}>
                    이어 올리기
                  </Button>
                  <span className="text-[12px] text-[var(--eo-ink-3)] tabular-nums">중단 지점 {mb(moved)} MB 보존</span>
                </>
              )}
              {upload.status === "done" && (
                <Button variant="ghost" onClick={onReplace}>
                  영상 교체
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
