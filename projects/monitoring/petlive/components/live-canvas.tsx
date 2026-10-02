"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Broadcast, WarningCircle, WifiSlash } from "@phosphor-icons/react";
import type { Device } from "@/projects/monitoring/petlive/lib/types";

/* 아키타입 A5(라이브 모니터 캔버스)의 부품들.

   이 화면에는 카드 리스트도 `SectionHead`도 없다. 라이브 영상 타일이 지배 요소이고,
   상태는 텍스트 행이 아니라 영상 위 앰비언트 표시로 읽힌다.

   기기 프레임 안쪽 규칙: 오버레이 표면은 전부 `--pl-overlay` 계열 불투명 채움이다.
   `backdrop-blur`를 쓰지 않는다 — Chromium에서 backdrop filter는 조상의 라운드 코너
   클립을 벗어나 PhoneFrame 모서리 밖으로 흰 틈을 만든다. */

/** 영상 위 상태 표시. 온라인이면 초록 맥동 점, 그 외에는 정지 상태 아이콘. */
export function LiveBadge({ status, compact = false }: { status: Device["status"]; compact?: boolean }) {
  if (status === "online") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--pl-overlay-strong)] font-semibold text-[var(--pl-overlay-ink)] ${
          compact ? "px-1.5 py-[3px] text-[9.5px]" : "px-2.5 py-1 text-[11px]"
        }`}
      >
        <span className="relative flex h-[6px] w-[6px]">
          <span className="pl-live-dot absolute inset-0 rounded-full text-[var(--pl-positive)]" />
          <span className="relative h-[6px] w-[6px] rounded-full bg-[var(--pl-positive)]" />
        </span>
        LIVE
      </span>
    );
  }

  const isError = status === "error";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[var(--pl-overlay-strong)] font-semibold ${
        isError ? "text-[var(--pl-warning-deep)]" : "text-[var(--pl-mute)]"
      } ${compact ? "px-1.5 py-[3px] text-[9.5px]" : "px-2.5 py-1 text-[11px]"}`}
    >
      {isError ? <WarningCircle size={compact ? 10 : 12} weight="fill" /> : <WifiSlash size={compact ? 10 : 12} weight="fill" />}
      {isError ? "불안정" : "오프라인"}
    </span>
  );
}

/** 히어로 라이브 피드. 화면 폭을 꽉 채우고 위아래로 비네트가 깔린다. */
export function LiveFeed({
  device,
  petName,
  timestamp,
  overlay,
  onExpand,
}: {
  device: Device;
  petName: string;
  timestamp: string;
  /** 하단 비네트 위에 얹는 컨트롤 행 */
  overlay?: ReactNode;
  onExpand?: () => void;
}) {
  const offline = device.status === "offline";

  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`${device.name} 전체화면으로 보기`}
      className="pl-feed-cut relative block aspect-[4/5] w-full overflow-hidden text-left transition-opacity active:opacity-80"
    >
      <Image
        src={device.thumbnail}
        alt={`${device.name} 라이브 화면`}
        fill
        sizes="393px"
        className={`object-cover ${offline ? "opacity-25 grayscale" : ""}`}
        priority
      />

      {/* 상단 비네트 — 상태바와 앰비언트 정보가 밝은 영상 위에서도 읽히게 한다. */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[172px]"
        style={{ background: "linear-gradient(to bottom, rgba(6,7,8,0.78) 0%, rgba(6,7,8,0) 100%)" }}
        aria-hidden
      />
      <span className="pl-vignette pointer-events-none absolute inset-x-0 bottom-0 h-[240px]" aria-hidden />

      {offline && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--pl-mute)]">
          <WifiSlash size={30} weight="fill" />
          <span className="text-[13px] font-semibold">연결이 끊어졌습니다</span>
        </span>
      )}

      <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <LiveBadge status={device.status} />
            <span className="pl-mono text-[11px] text-[var(--pl-overlay-ink)]/70">{timestamp}</span>
          </span>
          <span className="mt-2 block truncate text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[var(--pl-overlay-ink)]">
            {device.name}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-[var(--pl-overlay-ink)]/70">
            {device.location} | {petName}
          </span>
        </span>
        {overlay}
      </span>
    </button>
  );
}

/** 카메라 전환용 필름스트립 타일. 하단 탭바를 대체하는 A5의 네비게이션 요소다. */
export function FilmstripTile({
  device,
  active,
  onSelect,
}: {
  device: Device;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="relative h-[62px] w-[92px] shrink-0 overflow-hidden rounded-[10px] transition-opacity active:opacity-80"
      style={active ? { boxShadow: "0 0 0 2px var(--pl-accent)" } : undefined}
    >
      <Image
        src={device.thumbnail}
        alt={device.name}
        fill
        sizes="92px"
        className={`object-cover ${device.status === "offline" ? "opacity-25 grayscale" : active ? "" : "opacity-60"}`}
      />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26px]"
        style={{ background: "linear-gradient(to top, rgba(6,7,8,0.85) 0%, rgba(6,7,8,0) 100%)" }}
        aria-hidden
      />
      <span className="absolute left-1.5 top-1.5">
        <LiveBadge status={device.status} compact />
      </span>
      <span className="absolute inset-x-1.5 bottom-1 truncate text-left text-[10.5px] font-semibold text-[var(--pl-overlay-ink)]">
        {device.name}
      </span>
    </button>
  );
}

/** 영상 위 원형 컨트롤. 마이크/스냅샷/확대처럼 캔버스를 떠나지 않는 액션에 쓴다. */
export function OverlayControl({
  icon,
  label,
  onClick,
  tone = "neutral",
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  tone?: "neutral" | "accent";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-70 ${
        tone === "accent"
          ? "bg-[var(--pl-accent)] text-[var(--pl-on-accent)]"
          : "bg-[var(--pl-overlay-strong)] text-[var(--pl-overlay-ink)]"
      }`}
    >
      {icon}
    </button>
  );
}

/* 이벤트 이력을 세로 리스트가 아니라 가로 시간축으로 읽는다. A5에서 이력은
   "언제 무슨 일이 있었나"를 훑는 것이지 항목을 하나씩 고르는 것이 아니다. */
export function TimelineScrubber({
  items,
  onOpen,
}: {
  items: { id: string; time: string; label: string; thumbnail: Device["thumbnail"]; unreviewed: boolean }[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="pl-scrub flex gap-2 overflow-x-auto px-5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(item.id)}
          className="w-[104px] shrink-0 text-left transition-opacity active:opacity-80"
        >
          <span className="relative block h-[68px] w-full overflow-hidden rounded-[10px] bg-[var(--pl-canvas-soft)]">
            <Image src={item.thumbnail} alt="" fill sizes="104px" className="object-cover" />
            {item.unreviewed && (
              <span
                className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[var(--pl-accent)]"
                aria-label="확인 전"
              />
            )}
          </span>
          <span className="pl-mono mt-1.5 block text-[11px] text-[var(--pl-mute)]">{item.time}</span>
          <span className="mt-0.5 block truncate text-[12px] font-medium text-[var(--pl-body)]">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/** 캔버스 상단의 앰비언트 상태 줄. 카드가 아니라 영상 위에 얹히는 텍스트다. */
export function AmbientStatus({
  onlineCount,
  totalCount,
  timestamp,
}: {
  onlineCount: number;
  totalCount: number;
  timestamp: string;
}) {
  return (
    <span className="flex items-center gap-2 text-[var(--pl-overlay-ink)]">
      <Broadcast size={15} weight="fill" className="text-[var(--pl-accent)]" />
      <span className="pl-mono text-[12px] tabular-nums">
        {onlineCount}/{totalCount} 온라인
      </span>
      <span className="text-[var(--pl-overlay-ink)]/40">|</span>
      <span className="pl-mono text-[12px] text-[var(--pl-overlay-ink)]/70">{timestamp}</span>
    </span>
  );
}
