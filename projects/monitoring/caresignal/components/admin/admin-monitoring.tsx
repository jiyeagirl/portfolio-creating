"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Clock, MapPin, Phone, SpinnerGap } from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import {
  AdminButton,
  Drawer,
  DetailRow,
  EmptyState,
  PageHead,
  Panel,
  StatusTag,
  Tabs,
} from "@/projects/monitoring/caresignal/components/admin/ui";
import {
  KIND_LABEL,
  STATE_LABEL,
  events,
  users,
} from "@/projects/monitoring/caresignal/lib/admin-data";
import type { AdminEvent } from "@/projects/monitoring/caresignal/lib/types";

type Filter = "active" | "all" | "resolved";

export function AdminMonitoring() {
  const [filter, setFilter] = useState<Filter>("active");
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [focusUserId, setFocusUserId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (filter === "active") {
      return events.filter((e) => e.state === "detecting" || e.state === "notified" || e.state === "responding");
    }
    if (filter === "resolved") {
      return events.filter((e) => e.state === "resolved" || e.state === "dismissed");
    }
    return events;
  }, [filter]);

  const activeCount = events.filter(
    (e) => e.state === "detecting" || e.state === "notified" || e.state === "responding",
  ).length;

  const focusedUser = focusUserId ? users.find((u) => u.id === focusUserId) : null;

  return (
    <div>
      <PageHead
        title="실시간 모니터링"
        description="담당 사용자의 위치와 안전 상태를 지도에서 확인하고, 발생한 위험 이벤트를 처리합니다."
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_380px]">
        <Panel
          title="사용자 위치 지도"
          note={`${users.filter((u) => u.account === "active").length}명 표시 중 · 마커를 누르면 오른쪽에서 사용자를 확인합니다`}
          padded
        >
          <MiniMap
            className="h-[440px] w-full"
            rounded="rounded-[11px]"
            markers={users
              .filter((u) => u.account === "active")
              .map((u) => ({
                id: u.id,
                x: u.x,
                y: u.y,
                kind: "user",
                status: u.status,
                pulse: u.status !== "safe",
                label: u.status !== "safe" ? u.name : undefined,
                dim: focusUserId !== null && focusUserId !== u.id,
              }))}
          />
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#f0f0f0] pt-3.5">
            <LegendDot color="bg-[#0066cc]" label="안전" />
            <LegendDot color="bg-[#ff9500]" label="주의" />
            <LegendDot color="bg-[#ff3b30]" label="위험 · 실시간 신호" />
          </div>
        </Panel>

        <Panel
          title={focusedUser ? focusedUser.name : "위험 이벤트 발생 현황"}
          note={
            focusedUser
              ? `${focusedUser.dong} · ${focusedUser.address}`
              : `진행 중 ${activeCount}건`
          }
          actions={
            focusedUser ? (
              <button
                type="button"
                onClick={() => setFocusUserId(null)}
                className="text-[12.5px] font-semibold text-[#0066cc]"
              >
                목록으로
              </button>
            ) : undefined
          }
        >
          {focusedUser ? (
            <div className="space-y-4 px-5 py-4">
              <div className="flex items-center justify-between">
                <StatusTag status={focusedUser.status} />
                <span className="text-[12.5px] font-normal text-[#7a7a7a]">
                  {focusedUser.lastSignal} 수신
                </span>
              </div>
              <DetailRow label="보호자">
                {focusedUser.guardian} ({focusedUser.guardianRelation})
              </DetailRow>
              <DetailRow label="연락처">{focusedUser.guardianPhone}</DetailRow>
              <DetailRow label="배터리">{focusedUser.battery}%</DetailRow>
              <DetailRow label="안심 구역">{focusedUser.safeZone}</DetailRow>
              <AdminButton variant="primary" size="sm">
                <Phone size={13} weight="fill" />
                보호자에게 통화
              </AdminButton>
            </div>
          ) : (
            <>
              <div className="px-5 pt-4">
                <Tabs
                  value={filter}
                  onChange={setFilter}
                  items={[
                    { key: "active", label: "진행 중", count: activeCount },
                    { key: "all", label: "전체" },
                    { key: "resolved", label: "종료" },
                  ]}
                />
              </div>
              {filteredEvents.length === 0 ? (
                <EmptyState title="해당하는 이벤트가 없습니다" body="다른 탭을 선택해 보세요." />
              ) : (
                <ul className="max-h-[380px] divide-y divide-[#f0f0f0] overflow-y-auto">
                  {filteredEvents.map((event) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvent(event);
                          setFocusUserId(event.userId);
                        }}
                        className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[#fafafc]"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7]">
                          {event.state === "resolved" || event.state === "dismissed" ? (
                            <CheckCircle size={15} weight="fill" className="text-[#248a3d]" />
                          ) : (
                            <SpinnerGap size={15} weight="bold" className="text-[#d70015]" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] font-semibold text-[#1d1d1f]">
                            {event.userName} · {KIND_LABEL[event.kind]}
                          </p>
                          <p className="mt-1 truncate text-[12px] font-normal text-[#7a7a7a]">
                            {event.place}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <StatusTag status={event.status} />
                          <p className="mt-1.5 text-[11px] font-normal text-[#a1a1a6]">{event.at}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Panel>
      </div>

      <Drawer
        open={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `${selectedEvent.userName} · ${KIND_LABEL[selectedEvent.kind]}` : ""}
        subtitle={selectedEvent?.id}
        footer={
          selectedEvent && (
            <>
              <AdminButton variant="secondary">담당자 배정</AdminButton>
              <AdminButton variant="primary">처리 완료로 표시</AdminButton>
            </>
          )
        }
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <StatusTag status={selectedEvent.status} />
              <span className="text-[12.5px] font-normal text-[#7a7a7a]">{selectedEvent.at} 감지</span>
            </div>

            <MiniMap
              className="h-[152px] w-full"
              rounded="rounded-[11px]"
              markers={[
                {
                  id: selectedEvent.id,
                  x: users.find((u) => u.id === selectedEvent.userId)?.x ?? 50,
                  y: users.find((u) => u.id === selectedEvent.userId)?.y ?? 50,
                  kind: "event",
                  status: selectedEvent.status,
                  pulse: selectedEvent.state !== "resolved" && selectedEvent.state !== "dismissed",
                },
              ]}
              showLabels={false}
            />

            <p className="flex items-start gap-2 text-[13.5px] leading-[1.55] text-[#333333]">
              <MapPin size={16} weight="fill" className="mt-0.5 shrink-0 text-[#d70015]" />
              {selectedEvent.place}
            </p>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                <Clock size={15} weight="fill" className="text-[#7a7a7a]" />
                처리 정보
              </p>
              <DetailRow label="처리 상태">{STATE_LABEL[selectedEvent.state]}</DetailRow>
              <DetailRow label="담당자">{selectedEvent.responder}</DetailRow>
              <DetailRow label="경과">{selectedEvent.elapsed}</DetailRow>
            </div>

            <div className="rounded-[11px] bg-[#f5f5f7] p-3.5">
              <p className="text-[13px] font-normal leading-[1.6] text-[#333333]">{selectedEvent.note}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] font-normal text-[#7a7a7a]">
      <span className={`h-[8px] w-[8px] rounded-full ${color}`} />
      {label}
    </span>
  );
}
