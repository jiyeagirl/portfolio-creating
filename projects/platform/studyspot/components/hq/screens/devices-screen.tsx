"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  DefList,
  Drawer,
  PageHead,
  Row,
  Cell,
  Segmented,
  SearchInput,
  Table,
} from "@/projects/platform/studyspot/components/admin/admin-ui";
import { BRANCHES, HQ_DEVICES } from "@/projects/platform/studyspot/lib/mock-data";
import type { DeviceKind, DeviceStatus } from "@/projects/platform/studyspot/lib/types";
import {
  DEVICE_KIND_LABEL,
  DEVICE_STATUS_LABEL,
  DEVICE_STATUS_TONE,
  dateTime,
  type HqNavigate,
} from "@/projects/platform/studyspot/lib/navigation";

const branchName = (branchId: string) => BRANCHES.find((branch) => branch.id === branchId)?.name ?? branchId;

const KIND_ORDER: DeviceKind[] = ["door", "hvac", "light", "cctv", "airQuality"];

type KindFilter = DeviceKind | "all";

const STATUS_ORDER: DeviceStatus[] = ["normal", "warning", "error", "offline"];

const NEEDS_RESTART: DeviceStatus[] = ["error", "offline", "warning"];

interface MaintenanceEntry {
  branch: string;
  task: string;
  date: string;
}

const MAINTENANCE_SCHEDULE: MaintenanceEntry[] = [
  { branch: "StudySpot 강남 본점", task: "1층 냉난방기 필터 교체", date: "2025-06-20" },
  { branch: "StudySpot 홍대점", task: "냉난방기 정밀 점검 (센서 응답 없음 장애 후속)", date: "2025-06-18" },
  { branch: "StudySpot 판교점", task: "정문 출입 게이트 배터리 교체", date: "2025-06-25" },
  { branch: "StudySpot 부산 서면점", task: "CCTV 펌웨어 일괄 업데이트", date: "2025-06-30" },
];

export function DevicesScreen({}: { onNavigate: HqNavigate }) {
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restartedIds, setRestartedIds] = useState<Set<string>>(new Set());
  const [updatedIds, setUpdatedIds] = useState<Set<string>>(new Set());

  const counts = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = HQ_DEVICES.filter((device) => device.status === status).length;
      return acc;
    },
    {} as Record<DeviceStatus, number>,
  );

  const kindItems: { key: KindFilter; label: string }[] = [
    { key: "all", label: "전체" },
    ...KIND_ORDER.map((kind) => ({ key: kind as KindFilter, label: DEVICE_KIND_LABEL[kind] })),
  ];

  const query = search.trim().toLowerCase();
  const filteredDevices = HQ_DEVICES.filter((device) => {
    const matchesKind = kindFilter === "all" || device.kind === kindFilter;
    const matchesQuery =
      query === "" || device.name.toLowerCase().includes(query) || branchName(device.branchId).toLowerCase().includes(query);
    return matchesKind && matchesQuery;
  });

  const selectedDevice = selectedId ? HQ_DEVICES.find((device) => device.id === selectedId) ?? null : null;
  const drawerOpen = selectedDevice !== null;

  const effectiveFirmware = (deviceId: string, firmwareVersion?: string, firmwareLatest?: string) =>
    updatedIds.has(deviceId) && firmwareLatest ? firmwareLatest : firmwareVersion;

  const closeDrawer = () => setSelectedId(null);

  const handleRestart = (deviceId: string) => {
    setRestartedIds((prev) => new Set(prev).add(deviceId));
  };

  const handleFirmwareUpdate = (deviceId: string) => {
    setUpdatedIds((prev) => new Set(prev).add(deviceId));
  };

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="본사 관리자 콘솔"
        title="장비 통합 관리"
        desc="전 지점에 설치된 출입문, 냉난방, 조명, CCTV, 공기질 센서를 한 화면에서 모니터링하고 장애 발생 시 원격으로 제어합니다."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <Card key={status}>
            <p className="text-[13px] text-[var(--ss-mute)]">{DEVICE_STATUS_LABEL[status]}</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <p className="text-[26px] font-semibold leading-8 tracking-[-0.04em] text-[var(--ss-ink)]">{counts[status]}</p>
              <span className="text-[13px] text-[var(--ss-mute)]">대</span>
            </div>
            <div className="mt-2">
              <Badge tone={DEVICE_STATUS_TONE[status]} dot>
                전 지점 기준
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-[var(--ss-hairline)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-[320px]">
            <SearchInput value={search} onChange={setSearch} placeholder="장비명 또는 지점명 검색" />
          </div>
          <Segmented<KindFilter> value={kindFilter} items={kindItems} onChange={setKindFilter} />
        </div>
        <div className="p-5">
          <Table minWidth={640} head={["지점", "장비명", "종류", "상태", "최근 점검", "펌웨어"]}>
            {filteredDevices.map((device) => {
              const firmwareVersion = effectiveFirmware(device.id, device.firmwareVersion, device.firmwareLatest);
              const outdated = Boolean(firmwareVersion && device.firmwareLatest && firmwareVersion !== device.firmwareLatest);
              return (
                <Row key={device.id} onClick={() => setSelectedId(device.id)} active={device.id === selectedId}>
                  <Cell muted nowrap>{branchName(device.branchId)}</Cell>
                  <Cell strong>{device.name}</Cell>
                  <Cell muted nowrap>{DEVICE_KIND_LABEL[device.kind]}</Cell>
                  <Cell>
                    <Badge tone={DEVICE_STATUS_TONE[device.status]} dot>
                      {DEVICE_STATUS_LABEL[device.status]}
                    </Badge>
                  </Cell>
                  <Cell mono muted nowrap>{dateTime(device.lastCheckedAt)}</Cell>
                  <Cell nowrap>
                    {outdated ? (
                      <Badge tone="warning">업데이트 필요</Badge>
                    ) : firmwareVersion ? (
                      <span className="ss-mono text-[13px] text-[var(--ss-body)]">{firmwareVersion}</span>
                    ) : (
                      <span className="text-[13px] text-[var(--ss-mute)]">-</span>
                    )}
                  </Cell>
                </Row>
              );
            })}
          </Table>
          {filteredDevices.length === 0 && (
            <p className="py-10 text-center text-[13px] text-[var(--ss-mute)]">검색 조건에 맞는 장비가 없습니다.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHead title="유지보수 일정" desc="지점별로 예정된 정기 점검 및 교체 작업입니다." />
        <div className="space-y-0">
          {MAINTENANCE_SCHEDULE.map((entry, index) => (
            <div
              key={`${entry.branch}-${index}`}
              className="flex items-center justify-between gap-4 border-b border-[var(--ss-hairline)] py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-[var(--ss-ink)]">{entry.task}</p>
                <p className="mt-0.5 text-[13px] text-[var(--ss-mute)]">{entry.branch}</p>
              </div>
              <span className="ss-mono shrink-0 text-[13px] text-[var(--ss-mute)]">{entry.date}</span>
            </div>
          ))}
        </div>
      </Card>

      {selectedDevice && (() => {
        const firmwareVersion = effectiveFirmware(selectedDevice.id, selectedDevice.firmwareVersion, selectedDevice.firmwareLatest);
        const outdated = Boolean(
          firmwareVersion && selectedDevice.firmwareLatest && firmwareVersion !== selectedDevice.firmwareLatest,
        );
        const canRestart = NEEDS_RESTART.includes(selectedDevice.status);
        const restarted = restartedIds.has(selectedDevice.id);

        return (
          <Drawer
            open={drawerOpen}
            onClose={closeDrawer}
            title={selectedDevice.name}
            subtitle={`${branchName(selectedDevice.branchId)} / ${DEVICE_KIND_LABEL[selectedDevice.kind]}`}
            footer={
              (canRestart || outdated) && (
                <div className="space-y-3">
                  {canRestart && (
                    <div>
                      {restarted ? (
                        <div className="flex items-center gap-2 text-[13px] text-[var(--ss-positive)]">
                          <Badge tone="positive" dot>
                            재시작 요청 완료
                          </Badge>
                          <span className="text-[var(--ss-mute)]">잠시 후 장비 상태가 갱신됩니다.</span>
                        </div>
                      ) : (
                        <Button full onClick={() => handleRestart(selectedDevice.id)}>
                          원격 재시작
                        </Button>
                      )}
                    </div>
                  )}
                  {outdated && (
                    <Button full variant="secondary" onClick={() => handleFirmwareUpdate(selectedDevice.id)}>
                      펌웨어 업데이트
                    </Button>
                  )}
                </div>
              )
            }
          >
            <DefList
              items={[
                { label: "지점", value: branchName(selectedDevice.branchId) },
                { label: "장비명", value: selectedDevice.name },
                { label: "종류", value: DEVICE_KIND_LABEL[selectedDevice.kind] },
                {
                  label: "상태",
                  value: <Badge tone={DEVICE_STATUS_TONE[selectedDevice.status]} dot>{DEVICE_STATUS_LABEL[selectedDevice.status]}</Badge>,
                },
                { label: "현재 값", value: selectedDevice.reading },
                { label: "최근 점검", value: dateTime(selectedDevice.lastCheckedAt) },
                { label: "펌웨어 버전", value: firmwareVersion ?? "정보 없음" },
                { label: "최신 버전", value: selectedDevice.firmwareLatest ?? "정보 없음" },
              ]}
              columns={1}
            />
          </Drawer>
        );
      })()}
    </div>
  );
}
