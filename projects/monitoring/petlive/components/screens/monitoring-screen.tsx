"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowsIn,
  ArrowsOut,
  CaretLeft,
  Camera,
  SpeakerHigh,
  SpeakerX,
} from "@phosphor-icons/react";
import {
  BatteryIndicator,
  Card,
  DeviceThumb,
  EmptyState,
  SignalIndicator,
  StatusPill,
} from "@/projects/monitoring/petlive/components/ui";
import { DEVICES, deviceById, petById } from "@/projects/monitoring/petlive/lib/mock-data";
import {
  DEVICE_STATUS_LABEL,
  DEVICE_STATUS_TONE,
  dateTime,
  type Navigate,
} from "@/projects/monitoring/petlive/lib/navigation";

const ZOOM_STEPS = [1, 2, 3];

/* 스크린샷 도구가 넘기는 `?fullscreen=1` 값을 읽어 전체화면 상태로 시작한다
   (캡처 전용, 일반 사용 흐름에는 영향 없음). src/index.tsx의 `?screen=` 처리와
   같은 이유로 서버 스냅샷을 빈 값으로 둬 hydration 불일치를 피한다. */
const subscribeToNothing = () => () => {};

export function MonitoringScreen({
  deviceId,
  onNavigate,
}: {
  deviceId?: string;
  onNavigate: Navigate;
}) {
  const initialDeviceId =
    deviceId ?? DEVICES.find((d) => d.status === "online")?.id ?? DEVICES[0].id;

  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initialFullscreen = useMemo(
    () => new URLSearchParams(search).get("fullscreen") === "1",
    [search],
  );

  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId);
  const [fullscreenOverride, setFullscreenOverride] = useState<boolean | null>(null);
  const fullscreen = fullscreenOverride ?? initialFullscreen;
  const setFullscreen = (next: boolean | ((current: boolean) => boolean)) =>
    setFullscreenOverride((prev) => {
      const current = prev ?? initialFullscreen;
      return typeof next === "function" ? (next as (current: boolean) => boolean)(current) : next;
    });
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [flash, setFlash] = useState(false);

  const device = deviceById(selectedDeviceId) ?? DEVICES[0];
  const pet = petById(device.petId);
  const isLive = device.status === "online";

  const handleSnapshot = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  const cycleZoom = () => {
    setZoom((prev) => {
      const idx = ZOOM_STEPS.indexOf(prev);
      return ZOOM_STEPS[(idx + 1) % ZOOM_STEPS.length];
    });
  };

  return (
    <div className="relative flex h-full flex-col pl-enter">
      <div className="flex flex-1 flex-col pt-[59px]">
        {/* 라이브 뷰 */}
        <div
          className={
            fullscreen
              ? "relative flex-1 overflow-hidden bg-[var(--pl-ink)]"
              : "relative mx-5 mt-3 h-[500px] shrink-0 overflow-hidden rounded-[24px] bg-[var(--pl-ink)]"
          }
        >
          {isLive ? (
            <div
              className="h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <DeviceThumb
                src={device.thumbnail}
                alt={`${device.name} 실시간 화면`}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--pl-canvas-strong)] px-8">
              <EmptyState
                title="카메라에 연결할 수 없어요"
                desc={
                  device.status === "error"
                    ? "Wi-Fi 신호가 약해 연결이 끊겼어요. 공유기와 카메라 사이 거리를 확인해주세요."
                    : "카메라가 오프라인 상태예요. 전원과 네트워크 연결을 확인해주세요."
                }
              />
            </div>
          )}

          {/* 스냅샷 플래시 */}
          {flash && <div className="pointer-events-none absolute inset-0 z-20 bg-white" />}

          {/* 상단 오버레이 */}
          <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/25 to-transparent px-4 pb-8 pt-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                aria-label="뒤로"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/35 text-white"
              >
                <CaretLeft size={18} weight="bold" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-white">{device.name}</p>
                <p className="truncate text-[12px] text-white/70">
                  {pet?.name ?? "미지정"} | {device.location}
                </p>
              </div>
              <StatusPill
                status={device.status}
                tone={DEVICE_STATUS_TONE[device.status]}
                label={isLive ? "실시간" : DEVICE_STATUS_LABEL[device.status]}
              />
              <SignalIndicator pct={device.wifiPct} />
            </div>
          </div>

          {/* 하단 컨트롤 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-5 pt-10">
            <button
              type="button"
              onClick={() => setMuted((prev) => !prev)}
              aria-label={muted ? "음소거 해제" : "음소거"}
              disabled={!isLive}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white disabled:opacity-40"
            >
              {muted ? <SpeakerX size={19} weight="bold" /> : <SpeakerHigh size={19} weight="bold" />}
            </button>

            <button
              type="button"
              onClick={cycleZoom}
              aria-label="확대/축소"
              disabled={!isLive}
              className="flex h-9 min-w-[52px] items-center justify-center rounded-full bg-black/35 px-3 text-[12px] font-semibold text-white disabled:opacity-40"
            >
              {zoom.toFixed(1)}x
            </button>

            <button
              type="button"
              onClick={handleSnapshot}
              aria-label="스냅샷 촬영"
              disabled={!isLive}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--pl-ink)] disabled:opacity-40"
            >
              <Camera size={20} weight="bold" />
            </button>

            <button
              type="button"
              onClick={() => setFullscreen((prev) => !prev)}
              aria-label={fullscreen ? "전체화면 종료" : "전체화면"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white"
            >
              {fullscreen ? <ArrowsIn size={18} weight="bold" /> : <ArrowsOut size={18} weight="bold" />}
            </button>
          </div>
        </div>

        {/* 다중 카메라 전환 + 정보 카드 */}
        {!fullscreen && (
          <div className="flex-1 overflow-y-auto px-5 pb-10 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DEVICES.map((d) => {
                const active = d.id === device.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDeviceId(d.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-[14px] border px-2.5 py-2 ${
                      active
                        ? "border-[var(--pl-accent)] bg-[var(--pl-accent-pale)]"
                        : "border-[var(--pl-hairline)] bg-[var(--pl-canvas)]"
                    }`}
                  >
                    <DeviceThumb src={d.thumbnail} alt={d.name} className="h-9 w-9 rounded-[9px]" />
                    <span
                      className={`text-[12.5px] font-semibold ${
                        active ? "text-[var(--pl-accent-active)]" : "text-[var(--pl-ink)]"
                      }`}
                    >
                      {d.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <Card className="mt-4" padded>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[var(--pl-mute)]">위치</p>
                  <p className="mt-0.5 text-[15px] font-semibold text-[var(--pl-ink)]">{device.location}</p>
                </div>
                <StatusPill
                  status={device.status}
                  tone={DEVICE_STATUS_TONE[device.status]}
                  label={DEVICE_STATUS_LABEL[device.status]}
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--pl-hairline)] pt-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] text-[var(--pl-mute)]">배터리</span>
                  <BatteryIndicator pct={device.batteryPct} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] text-[var(--pl-mute)]">최근 연결</span>
                  <span className="pl-mono text-[12.5px] text-[var(--pl-body)]">
                    {dateTime(device.lastConnectedAt)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
