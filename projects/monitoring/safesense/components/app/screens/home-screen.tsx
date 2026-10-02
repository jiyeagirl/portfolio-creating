"use client";

import { Broadcast, MapPin, Warning } from "@phosphor-icons/react";
import {
  Card,
  Monogram,
  PrimaryButton,
  SectionTitle,
  StatTile,
  StatusBadge,
} from "@/projects/monitoring/safesense/components/app/ui";
import { currentWorker, sites } from "@/projects/monitoring/safesense/lib/mock-data";
import type { AppNavigate } from "@/projects/monitoring/safesense/lib/navigation";

export function HomeScreen({ onNavigate }: { onNavigate: AppNavigate }) {
  const site = sites.find((s) => s.id === currentWorker.siteId)!;

  return (
    <div className="min-h-full w-full px-5 pb-36 pt-[78px]">
      <p className="ss-mono text-[10.5px] text-[var(--ss-muted)]">2026.07.29 (수) / {site.name}</p>
      <div className="mt-1 flex items-center justify-between">
        <h1 className="ss-display text-[26px] text-[var(--ss-foreground)]">
          {currentWorker.name} 님
        </h1>
        <Monogram name={currentWorker.name} size={40} />
      </div>
      <p className="ss-mono mt-1 text-[10.5px] text-[var(--ss-muted)]">{currentWorker.role}</p>

      <Card className="mt-5 p-4" tone={currentWorker.status === "danger" ? "danger" : "panel"}>
        <div className="flex items-center justify-between">
          <StatusBadge status={currentWorker.status} live />
          <span className="ss-mono flex items-center gap-1.5 text-[10px] text-[var(--ss-muted)]">
            <Broadcast size={13} weight="bold" />
            센서 연결됨
          </span>
        </div>
        <p className="ss-display mt-3 text-[19px] text-[var(--ss-foreground)]">
          {currentWorker.status === "safe" ? "지금은 안전합니다" : "위험 신호가 감지되었습니다"}
        </p>
        <p className="ss-mono mt-1.5 text-[10.5px] text-[var(--ss-muted)]">
          마지막 신호 {currentWorker.lastSignalMinAgo}분 전, 오전 6:20부터 연속 감지 중
        </p>
      </Card>

      <PrimaryButton tone="outline" className="mt-3 w-full" onClick={() => onNavigate("work-start")}>
        작업 시작 / 종료
      </PrimaryButton>

      <PrimaryButton
        tone="accent"
        className="mt-4 w-full"
        onClick={() => onNavigate("event")}
      >
        <Warning size={18} weight="fill" />
        SOS 긴급 신고
      </PrimaryButton>

      <SectionTitle className="mt-7">오늘 현황</SectionTitle>
      <div className="mt-2 grid grid-cols-2 gap-[1px] bg-[var(--ss-border)]">
        <StatTile label="작업 시간" value="4:12" className="border-0" />
        <StatTile label="이동 거리" value="2.8" unit="KM" className="border-0" />
        <StatTile label="오늘 이벤트" value={String(currentWorker.todayEvents)} unit="건" className="border-0" />
        <StatTile label="배터리" value={String(currentWorker.battery)} unit="%" className="border-0" />
      </div>

      <SectionTitle className="mt-7">GPS 위치</SectionTitle>
      <div className="ss-mono relative mt-2 flex h-[132px] items-center justify-center overflow-hidden rounded-[10px] border border-[var(--ss-border)] bg-[var(--ss-panel)] text-[10px] text-[var(--ss-muted)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--ss-border) 1px, transparent 1px), linear-gradient(90deg, var(--ss-border) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="ss-blink absolute h-3 w-3 rounded-full bg-[var(--ss-safe)]" />
        </span>
        <span className="relative ml-4">37.5017°N 127.0396°E / {site.name}</span>
      </div>

      <SectionTitle className="mt-7">시스템 상태</SectionTitle>
      <Card className="mt-2 divide-y divide-[var(--ss-border)] p-0">
        <div className="ss-mono flex items-center justify-between px-4 py-3 text-[11px]">
          <span className="flex items-center gap-2 text-[var(--ss-muted)]">
            <MapPin size={13} />
            GPS 권한
          </span>
          <span className="text-[var(--ss-safe)]">허용됨</span>
        </div>
        <div className="ss-mono flex items-center justify-between px-4 py-3 text-[11px]">
          <span className="text-[var(--ss-muted)]">백그라운드 동작</span>
          <span className="text-[var(--ss-safe)]">정상</span>
        </div>
        <div className="ss-mono flex items-center justify-between px-4 py-3 text-[11px]">
          <span className="text-[var(--ss-muted)]">가속도 / 자이로 센서</span>
          <span className="text-[var(--ss-safe)]">정상</span>
        </div>
      </Card>
    </div>
  );
}
