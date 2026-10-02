"use client";

import { useState } from "react";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { Card, PrimaryButton, ScreenHeader, SectionTitle } from "@/projects/monitoring/safesense/components/app/ui";
import { currentWorker, sites } from "@/projects/monitoring/safesense/lib/mock-data";
import type { AppNavigate } from "@/projects/monitoring/safesense/lib/navigation";

const MOUNT_POSITIONS = ["상의 가슴 주머니", "팔 밴드", "허리 벨트"];

const CHECKLIST = [
  "안전모 착용 확인",
  "안전화 착용 확인",
  "고소작업용 안전벨트 체결 확인 (해당 시)",
  "스마트폰 거치 위치 고정 확인",
];

export function WorkStartScreen({ onNavigate }: { onNavigate: AppNavigate }) {
  const [siteId, setSiteId] = useState(currentWorker.siteId);
  const [mountIndex, setMountIndex] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false));
  const [calibrating, setCalibrating] = useState(false);

  const allChecked = checked.every(Boolean);

  return (
    <div className="flex min-h-full w-full flex-col">
      <ScreenHeader title="작업 시작" onBack={() => onNavigate("home")} />

      <div className="flex-1 px-5 pb-10 pt-5">
        <SectionTitle>현장 선택</SectionTitle>
        <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
          {sites.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => setSiteId(site.id)}
              className="ss-press flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span>
                <span className="block text-[13.5px] font-semibold text-[var(--ss-foreground)]">
                  {site.name}
                </span>
                <span className="ss-mono mt-0.5 block text-[10px] text-[var(--ss-muted)]">
                  {site.address}
                </span>
              </span>
              {siteId === site.id ? (
                <CheckCircle size={20} weight="fill" className="shrink-0 text-[var(--ss-accent)]" />
              ) : (
                <Circle size={20} className="shrink-0 text-[var(--ss-border-strong)]" />
              )}
            </button>
          ))}
        </div>

        <SectionTitle className="mt-7">스마트폰 거치 위치</SectionTitle>
        <div className="mt-2 grid grid-cols-3 gap-[1px] overflow-hidden rounded-[8px] bg-[var(--ss-border)]">
          {MOUNT_POSITIONS.map((pos, i) => (
            <button
              key={pos}
              type="button"
              onClick={() => setMountIndex(i)}
              className={`ss-mono ss-press border-0 bg-[var(--ss-panel)] px-2 py-3 text-center text-[10px] leading-[1.5] ${
                mountIndex === i ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        <SectionTitle className="mt-7">센서 캘리브레이션</SectionTitle>
        <Card className="mt-2 p-4">
          <div className="ss-mono flex items-center justify-between text-[11px]">
            <span className="text-[var(--ss-muted)]">GPS / 가속도 / 자이로</span>
            <span className={calibrating ? "text-[var(--ss-accent)]" : "text-[var(--ss-safe)]"}>
              {calibrating ? "보정 중..." : "보정 완료"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setCalibrating(true);
              window.setTimeout(() => setCalibrating(false), 1200);
            }}
            className="ss-mono ss-press ss-focusable mt-3 w-full rounded-[8px] border border-[var(--ss-border-strong)] py-2 text-[10.5px] text-[var(--ss-foreground)]"
          >
            다시 보정하기
          </button>
        </Card>

        <SectionTitle className="mt-7">작업 전 체크리스트</SectionTitle>
        <div className="mt-2 divide-y divide-[var(--ss-border)] overflow-hidden rounded-[10px] border border-[var(--ss-border)]">
          {CHECKLIST.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
              }
              className="ss-press flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              {checked[i] ? (
                <CheckCircle size={19} weight="fill" className="shrink-0 text-[var(--ss-accent)]" />
              ) : (
                <Circle size={19} className="shrink-0 text-[var(--ss-border-strong)]" />
              )}
              <span className="text-[12.5px] text-[var(--ss-foreground)]">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--ss-border)] px-5 py-4">
        <PrimaryButton tone="accent" className="w-full" onClick={() => onNavigate("home")} disabled={!allChecked}>
          작업 시작하기
        </PrimaryButton>
      </div>
    </div>
  );
}
