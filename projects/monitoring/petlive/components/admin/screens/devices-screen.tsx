"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  DefList,
  Drawer,
  PageHead,
  Pagination,
  Row,
  Cell,
  SearchInput,
  Segmented,
  Table,
} from "@/projects/monitoring/petlive/components/admin/admin-ui";
import { ADMIN_DEVICES } from "@/projects/monitoring/petlive/lib/mock-data";
import {
  DEVICE_STATUS_LABEL,
  DEVICE_STATUS_TONE,
  dateTime,
  type AdminNavigate,
} from "@/projects/monitoring/petlive/lib/navigation";
import type { DeviceStatus } from "@/projects/monitoring/petlive/lib/types";

const PER_PAGE = 6;

export function DevicesScreen({}: { onNavigate: AdminNavigate }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | DeviceStatus>("all");
  const [page, setPage] = useState(1);
  const [statusOverride, setStatusOverride] = useState<Record<string, DeviceStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const devices = ADMIN_DEVICES.filter((d) => !removedIds.includes(d.id)).map((d) => ({
    ...d,
    status: statusOverride[d.id] ?? d.status,
  }));

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchesQuery =
        query.trim() === "" ||
        d.serial.toLowerCase().includes(query.toLowerCase()) ||
        d.ownerName.includes(query) ||
        d.location.includes(query);
      const matchesFilter = filter === "all" || d.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [devices, query, filter]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selected = devices.find((d) => d.id === selectedId) ?? null;

  const reconnect = (id: string) => setStatusOverride((prev) => ({ ...prev, [id]: "online" }));
  const remove = (id: string) => {
    setRemovedIds((prev) => [...prev, id]);
    setSelectedId(null);
  };

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="관리자 콘솔"
        title="웹캠 관리"
        desc="등록 디바이스 현황을 모니터링하고 연결 오류를 처리하세요."
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-[320px]">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="시리얼 번호, 소유자, 위치 검색"
          />
        </div>
        <Segmented
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          items={[
            { key: "all", label: "전체" },
            { key: "online", label: "온라인" },
            { key: "error", label: "연결 오류" },
            { key: "offline", label: "오프라인" },
          ]}
        />
      </div>

      <Card padded={false}>
        <div className="px-5 pt-5">
          <Table head={["시리얼 번호", "모델", "소유자", "위치", "상태", "최근 접속"]} minWidth={640}>
            {paged.map((device) => (
              <Row key={device.id} onClick={() => setSelectedId(device.id)}>
                <Cell strong mono nowrap>
                  {device.serial}
                </Cell>
                <Cell muted>{device.model}</Cell>
                <Cell>{device.ownerName}</Cell>
                <Cell muted>{device.location}</Cell>
                <Cell>
                  <Badge tone={DEVICE_STATUS_TONE[device.status]} dot>
                    {DEVICE_STATUS_LABEL[device.status]}
                  </Badge>
                </Cell>
                <Cell muted mono nowrap>
                  {dateTime(device.lastConnectedAt)}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
        <div className="px-5 pb-5">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <Drawer
        open={selected !== null}
        title={selected?.serial ?? ""}
        subtitle={selected ? `${selected.ownerName} | ${selected.location}` : undefined}
        onClose={() => setSelectedId(null)}
        footer={
          selected && (
            <div className="flex gap-2">
              {selected.status !== "online" && (
                <Button full icon={<ArrowsClockwise size={15} weight="bold" />} onClick={() => reconnect(selected.id)}>
                  원격 재연결
                </Button>
              )}
              <Button full variant="danger" onClick={() => remove(selected.id)}>
                디바이스 삭제
              </Button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            {selected.errorNote && (
              <div className="flex items-start gap-2 rounded-[8px] border border-[var(--pl-negative-soft)] bg-[var(--pl-negative-soft)] p-3">
                <WarningCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--pl-negative-deep)]" />
                <p className="text-[13px] leading-5 text-[var(--pl-negative-deep)]">{selected.errorNote}</p>
              </div>
            )}
            <DefList
              items={[
                { label: "모델", value: selected.model },
                { label: "소유자", value: selected.ownerName },
                { label: "설치 위치", value: selected.location },
                {
                  label: "연결 상태",
                  value: (
                    <Badge tone={DEVICE_STATUS_TONE[selected.status]} dot>
                      {DEVICE_STATUS_LABEL[selected.status]}
                    </Badge>
                  ),
                },
                {
                  label: "펌웨어 버전",
                  value:
                    selected.firmwareVersion === selected.firmwareLatest ? (
                      selected.firmwareVersion
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {selected.firmwareVersion}
                        <Badge tone="warning">최신 {selected.firmwareLatest} 있음</Badge>
                      </span>
                    ),
                },
                { label: "등록일", value: dateTime(selected.registeredAt) },
                { label: "최근 접속", value: dateTime(selected.lastConnectedAt) },
              ]}
              columns={1}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
