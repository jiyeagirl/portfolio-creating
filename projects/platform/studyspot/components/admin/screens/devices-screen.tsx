"use client";

import { useState } from "react";
import { ArrowClockwise, DoorOpen, Lightbulb, Thermometer, VideoCamera, Wind } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  PageHead,
  Row,
  Segmented,
  Table,
} from "@/projects/platform/studyspot/components/admin/admin-ui";
import {
  DEVICE_KIND_LABEL,
  DEVICE_STATUS_LABEL,
  DEVICE_STATUS_TONE,
  dateTime,
  type AdminNavigate,
} from "@/projects/platform/studyspot/lib/navigation";
import { FAULT_LOGS, IOT_DEVICES } from "@/projects/platform/studyspot/lib/mock-data";
import type { DeviceKind, DeviceStatus, IotDevice } from "@/projects/platform/studyspot/lib/types";

type KindFilter = "all" | DeviceKind;

const KIND_ICON: Record<DeviceKind, React.ComponentType<{ size?: number; weight?: "bold" | "fill" | "regular" }>> = {
  door: DoorOpen,
  hvac: Thermometer,
  light: Lightbulb,
  cctv: VideoCamera,
  airQuality: Wind,
};

const STATUS_ORDER: DeviceStatus[] = ["normal", "warning", "error", "offline"];

const STATUS_VALUE_CLASS: Record<DeviceStatus, string> = {
  normal: "text-[var(--ss-ink)]",
  warning: "text-[var(--ss-warning)]",
  error: "text-[var(--ss-negative)]",
  offline: "text-[var(--ss-mute)]",
};

const FILTER_ITEMS: { key: KindFilter; label: string }[] = [
  { key: "all", label: "전체" },
  ...(Object.keys(DEVICE_KIND_LABEL) as DeviceKind[]).map((kind) => ({
    key: kind as KindFilter,
    label: DEVICE_KIND_LABEL[kind],
  })),
];

const byNewest = (a: { occurredAt: string }, b: { occurredAt: string }) =>
  new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();

export function DevicesScreen({}: { onNavigate: AdminNavigate }) {
  const [filter, setFilter] = useState<KindFilter>("all");
  const [selected, setSelected] = useState<IotDevice | null>(null);
  const [restarted, setRestarted] = useState(false);

  const statusCounts = STATUS_ORDER.reduce<Record<DeviceStatus, number>>(
    (acc, status) => {
      acc[status] = IOT_DEVICES.filter((device) => device.status === status).length;
      return acc;
    },
    { normal: 0, warning: 0, error: 0, offline: 0 }
  );

  const filteredDevices = filter === "all" ? IOT_DEVICES : IOT_DEVICES.filter((device) => device.kind === filter);
  const sortedFaultLogs = [...FAULT_LOGS].sort(byNewest);
  const selectedFaultLogs = selected ? FAULT_LOGS.filter((log) => log.deviceId === selected.id).sort(byNewest) : [];
  const canRestart = selected ? selected.status === "error" || selected.status === "offline" || selected.status === "warning" : false;

  const openDevice = (device: IotDevice) => {
    setSelected(device);
    setRestarted(false);
  };

  const closeDrawer = () => {
    setSelected(null);
    setRestarted(false);
  };

  return (
    <div className="ss-enter space-y-8">
      <PageHead
        eyebrow="점주 관리자 콘솔"
        title="장비 현황"
        desc="출입문, 냉난방, 조명, CCTV, 공기질 센서까지 강남 본점의 IoT 장비 상태를 실시간으로 모니터링합니다."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-[13px] text-[var(--ss-mute)]">정상</p>
          <p className="mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] text-[var(--ss-ink)]">
            {statusCounts.normal}
          </p>
        </Card>
        <Card>
          <p className="text-[13px] text-[var(--ss-mute)]">주의</p>
          <p className="mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] text-[var(--ss-warning)]">
            {statusCounts.warning}
          </p>
        </Card>
        <Card>
          <p className="text-[13px] text-[var(--ss-mute)]">장애</p>
          <p className="mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] text-[var(--ss-negative)]">
            {statusCounts.error}
          </p>
        </Card>
        <Card>
          <p className="text-[13px] text-[var(--ss-mute)]">오프라인</p>
          <p className="mt-2 text-[26px] font-semibold leading-8 tracking-[-0.04em] text-[var(--ss-mute)]">
            {statusCounts.offline}
          </p>
        </Card>
      </div>

      <Card>
        <CardHead title="장비 목록" desc="종류별로 필터링해 개별 장비의 상태와 최근 점검 시각을 확인하세요." />
        <Segmented value={filter} items={FILTER_ITEMS} onChange={setFilter} />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDevices.map((device) => {
            const Icon = KIND_ICON[device.kind];
            const needsFirmware = device.firmwareVersion !== undefined && device.firmwareVersion !== device.firmwareLatest;
            return (
              <button
                key={device.id}
                type="button"
                onClick={() => openDevice(device)}
                className="rounded-[8px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas)] p-4 text-left transition-colors hover:bg-[var(--ss-canvas-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[var(--ss-surface)] text-[var(--ss-ink)]">
                    <Icon size={17} weight="bold" />
                  </span>
                  <Badge tone={DEVICE_STATUS_TONE[device.status]} dot>
                    {DEVICE_STATUS_LABEL[device.status]}
                  </Badge>
                </div>
                <p className="mt-3 text-[14px] font-medium text-[var(--ss-ink)]">{device.name}</p>
                <p className="mt-0.5 text-[12px] text-[var(--ss-mute)]">{DEVICE_KIND_LABEL[device.kind]}</p>
                <p className={`mt-3 text-[15px] font-semibold ${STATUS_VALUE_CLASS[device.status]}`}>{device.reading}</p>
                <p className="mt-2 ss-mono text-[12px] text-[var(--ss-mute)]">최근 점검 {dateTime(device.lastCheckedAt)}</p>
                {needsFirmware && (
                  <div className="mt-3">
                    <Badge tone="warning">펌웨어 업데이트 필요</Badge>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHead title="전체 장애 이력" desc="강남 본점에서 발생한 장비 장애 이력을 최신순으로 표시합니다." />
        <Table head={["장비", "메시지", "발생 시각", "상태"]} align={["left", "left", "left", "right"]} minWidth={560}>
          {sortedFaultLogs.map((log) => {
            const device = IOT_DEVICES.find((d) => d.id === log.deviceId);
            return (
              <Row key={log.id}>
                <Cell strong nowrap>
                  {device?.name ?? "알 수 없는 장비"}
                </Cell>
                <Cell>{log.message}</Cell>
                <Cell mono nowrap>
                  {dateTime(log.occurredAt)}
                </Cell>
                <Cell align="right">
                  {log.resolvedAt ? <Badge tone="positive">해결됨</Badge> : <Badge tone="negative">미해결</Badge>}
                </Cell>
              </Row>
            );
          })}
        </Table>
      </Card>

      <Drawer
        open={selected !== null}
        onClose={closeDrawer}
        title={selected?.name ?? ""}
        subtitle={selected ? DEVICE_KIND_LABEL[selected.kind] : undefined}
        footer={
          selected && canRestart ? (
            <div className="flex items-center justify-between gap-3">
              <p className={`text-[13px] ${restarted ? "font-medium text-[var(--ss-positive)]" : "text-[var(--ss-mute)]"}`}>
                {restarted ? "재시작 요청을 보냈어요" : "장비가 응답하지 않으면 재시작을 시도하세요."}
              </p>
              <Button variant="secondary" icon={<ArrowClockwise size={14} />} onClick={() => setRestarted(true)} disabled={restarted}>
                장비 재시작
              </Button>
            </div>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-6">
            <DefList
              columns={1}
              items={[
                { label: "장비명", value: selected.name },
                { label: "종류", value: DEVICE_KIND_LABEL[selected.kind] },
                {
                  label: "상태",
                  value: (
                    <Badge tone={DEVICE_STATUS_TONE[selected.status]} dot>
                      {DEVICE_STATUS_LABEL[selected.status]}
                    </Badge>
                  ),
                },
                { label: "현재 값", value: selected.reading },
                { label: "최근 점검", value: dateTime(selected.lastCheckedAt) },
                ...(selected.firmwareVersion
                  ? [
                      {
                        label: "펌웨어",
                        value:
                          selected.firmwareVersion === selected.firmwareLatest
                            ? selected.firmwareVersion
                            : `${selected.firmwareVersion} → ${selected.firmwareLatest}`,
                      },
                    ]
                  : []),
              ]}
            />

            <div>
              <h3 className="text-[13px] font-medium text-[var(--ss-ink)]">장애 이력</h3>
              {selectedFaultLogs.length === 0 ? (
                <p className="mt-3 text-[13px] text-[var(--ss-mute)]">이 장비에 기록된 장애 이력이 없습니다.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {selectedFaultLogs.map((log) => (
                    <li key={log.id} className="rounded-[8px] border border-[var(--ss-hairline)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13px] font-medium text-[var(--ss-ink)]">{log.message}</p>
                        {log.resolvedAt ? <Badge tone="positive">해결됨</Badge> : <Badge tone="negative">미해결</Badge>}
                      </div>
                      <p className="mt-1.5 ss-mono text-[12px] text-[var(--ss-mute)]">{dateTime(log.occurredAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
