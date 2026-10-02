"use client";

import { useState } from "react";
import { CheckCircle, Plus, Trash, X } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import {
  Badge,
  BatteryIndicator,
  Button,
  DeviceThumb,
  EmptyState,
  Field,
  Input,
  SignalIndicator,
  StatusPill,
} from "@/projects/monitoring/petlive/components/ui";
import { DEVICES } from "@/projects/monitoring/petlive/lib/mock-data";
import { DEVICE_STATUS_LABEL, DEVICE_STATUS_TONE, dateTime, type Navigate } from "@/projects/monitoring/petlive/lib/navigation";

const LOCATIONS = ["거실", "주방", "침실", "복도"];

export function DeviceManageScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [firmwareUpdated, setFirmwareUpdated] = useState(false);

  const devices = DEVICES.filter((d) => !deletedIds.includes(d.id));
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) ?? null;

  const openPanel = (deviceId: string) => {
    const device = DEVICES.find((d) => d.id === deviceId);
    if (!device) return;
    setSelectedDeviceId(deviceId);
    setEditName(device.name);
    setEditLocation(device.location);
    setFirmwareUpdated(false);
  };

  const closePanel = () => setSelectedDeviceId(null);

  const removeDevice = (deviceId: string) => {
    setDeletedIds((prev) => [...prev, deviceId]);
    closePanel();
  };

  return (
    <div className="relative flex h-full flex-col">
      <ScreenHeader
        onBack={() => onNavigate("home")}
        title="디바이스 관리"
        className="bg-[var(--pl-canvas)] border-[var(--pl-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--pl-ink)]"
        right={
          <button
            type="button"
            onClick={() => onNavigate("deviceRegister")}
            aria-label="펫캠 등록"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pl-accent-pale)] text-[var(--pl-accent-active)]"
          >
            <Plus size={18} weight="bold" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {devices.length === 0 ? (
          <EmptyState
            title="등록된 펫캠이 없어요"
            desc="새 펫캠을 등록하면 실시간 모니터링과 이벤트 알림을 받아볼 수 있어요."
            action={
              <Button onClick={() => onNavigate("deviceRegister")} icon={<Plus size={16} weight="bold" />}>
                새 펫캠 등록하기
              </Button>
            }
          />
        ) : (
          <div className="pl-enter space-y-3">
            {devices.map((device) => {
              const needsUpdate = device.firmwareVersion !== device.firmwareLatest;
              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => openPanel(device.id)}
                  className="flex w-full items-start gap-3 rounded-[20px] border border-[var(--pl-hairline)] bg-[var(--pl-canvas)] p-3 text-left"
                >
                  <DeviceThumb
                    src={device.thumbnail}
                    alt={`${device.name} 실시간 화면`}
                    className="h-[56px] w-[56px] shrink-0 rounded-[14px]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-[14.5px] font-semibold text-[var(--pl-ink)]">{device.name}</p>
                      <StatusPill
                        status={device.status}
                        tone={DEVICE_STATUS_TONE[device.status]}
                        label={DEVICE_STATUS_LABEL[device.status]}
                      />
                      {needsUpdate && <Badge tone="warning">업데이트 필요</Badge>}
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-[var(--pl-mute)]">{device.location}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <BatteryIndicator pct={device.batteryPct} />
                      <SignalIndicator pct={device.wifiPct} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedDevice && (
        <div className="absolute inset-0 z-40">
          <button
            type="button"
            aria-label="패널 닫기"
            onClick={closePanel}
            className="absolute inset-0 bg-black/40"
          />
          <div className="pl-enter absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[24px] bg-[var(--pl-canvas)] px-5 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-3">
            <div className="mx-auto mb-2 h-[4px] w-[36px] rounded-full bg-[var(--pl-hairline-strong)]" />

            <div className="flex items-center justify-between py-2">
              <h2 className="text-[17px] font-bold tracking-[-0.01em] text-[var(--pl-ink)]">{selectedDevice.name}</h2>
              <button
                type="button"
                onClick={closePanel}
                aria-label="닫기"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--pl-mute)]"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <DeviceThumb
              src={selectedDevice.thumbnail}
              alt={`${selectedDevice.name} 실시간 화면`}
              className="h-[140px] w-full rounded-[18px]"
            />

            <div className="mt-5 space-y-4">
              <Field label="디바이스 이름">
                <Input value={editName} onChange={setEditName} placeholder="디바이스 이름" />
              </Field>

              <div>
                <span className="text-[13px] font-medium text-[var(--pl-ink)]">설치 위치</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => {
                    const active = editLocation === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setEditLocation(loc)}
                        className={`rounded-[8px] px-3.5 py-2 text-[13px] font-medium transition-colors ${
                          active
                            ? "bg-[var(--pl-accent)] text-[var(--pl-on-accent)]"
                            : "bg-[var(--pl-canvas-soft)] text-[var(--pl-body)] border border-[var(--pl-hairline)]"
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[13px] font-medium text-[var(--pl-ink)]">연결 상태</span>
                <div className="mt-1.5 flex items-center justify-between rounded-[14px] border border-[var(--pl-hairline)] px-4 py-3">
                  <StatusPill
                    status={selectedDevice.status}
                    tone={DEVICE_STATUS_TONE[selectedDevice.status]}
                    label={DEVICE_STATUS_LABEL[selectedDevice.status]}
                  />
                  <span className="text-[12px] text-[var(--pl-mute)]">
                    최근 접속 {dateTime(selectedDevice.lastConnectedAt)}
                  </span>
                </div>
                {selectedDevice.errorNote && (
                  <div className="mt-2 rounded-[14px] bg-[var(--pl-warning-soft)] px-4 py-3">
                    <p className="text-[12.5px] leading-[18px] text-[var(--pl-warning-deep)]">
                      {selectedDevice.errorNote}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-[14px] border border-[var(--pl-hairline)] px-4">
                <div className="flex items-center justify-between border-b border-[var(--pl-hairline)] py-3">
                  <span className="text-[13px] text-[var(--pl-mute)]">배터리</span>
                  <BatteryIndicator pct={selectedDevice.batteryPct} />
                </div>
                <div className="flex items-center justify-between border-b border-[var(--pl-hairline)] py-3">
                  <span className="text-[13px] text-[var(--pl-mute)]">Wi-Fi 신호</span>
                  <SignalIndicator pct={selectedDevice.wifiPct} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-[var(--pl-mute)]">펌웨어 버전</span>
                  <span className="pl-mono text-[12px] text-[var(--pl-body)]">
                    {selectedDevice.firmwareVersion}
                    {selectedDevice.firmwareVersion !== selectedDevice.firmwareLatest &&
                      ` (최신 ${selectedDevice.firmwareLatest})`}
                  </span>
                </div>
              </div>

              {selectedDevice.firmwareVersion !== selectedDevice.firmwareLatest && (
                <div>
                  {firmwareUpdated ? (
                    <Badge tone="positive" dot>
                      펌웨어가 {selectedDevice.firmwareLatest}로 업데이트되었습니다
                    </Badge>
                  ) : (
                    <Button
                      variant="secondary"
                      full
                      icon={<CheckCircle size={16} weight="bold" />}
                      onClick={() => setFirmwareUpdated(true)}
                    >
                      펌웨어 {selectedDevice.firmwareLatest} 업데이트
                    </Button>
                  )}
                </div>
              )}

              <Button
                variant="danger"
                full
                icon={<Trash size={16} weight="bold" />}
                onClick={() => removeDevice(selectedDevice.id)}
              >
                디바이스 삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
