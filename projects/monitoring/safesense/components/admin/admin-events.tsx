"use client";

import { useState } from "react";
import { Card, Cell, PageHead, Row, Table, Tabs } from "@/projects/monitoring/safesense/components/admin/ui";
import { events, eventLabel } from "@/projects/monitoring/safesense/lib/mock-data";
import type { EventStatus } from "@/projects/monitoring/safesense/lib/types";

const STATUS_LABEL: Record<EventStatus, string> = {
  active: "진행 중",
  acknowledged: "확인됨",
  resolved: "종료",
};

const STATUS_COLOR: Record<EventStatus, string> = {
  active: "var(--ss-accent)",
  acknowledged: "#e0a458",
  resolved: "var(--ss-safe)",
};

export function AdminEvents() {
  const [status, setStatus] = useState<"all" | EventStatus>("all");
  const [type, setType] = useState<"all" | "fall" | "impact" | "stationary">("all");

  const filtered = events.filter((e) => {
    if (status !== "all" && e.status !== status) return false;
    if (type !== "all" && e.type !== type) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="EVENT MANAGEMENT"
        title="이벤트 관리"
        desc="낙상/충격/정지 이벤트를 조회하고 처리 상태를 관리합니다."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={status}
          items={[
            { key: "all", label: "전체", count: events.length },
            { key: "active", label: "진행 중", count: events.filter((e) => e.status === "active").length },
            { key: "acknowledged", label: "확인됨", count: events.filter((e) => e.status === "acknowledged").length },
            { key: "resolved", label: "종료", count: events.filter((e) => e.status === "resolved").length },
          ]}
          onChange={setStatus}
        />
        <div className="ss-mono flex gap-[1px] overflow-hidden rounded-[8px] bg-[var(--ss-border)] text-[10px]">
          {(["all", "fall", "impact", "stationary"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`border-0 bg-[var(--ss-panel)] px-3 py-2 ${type === t ? "text-[var(--ss-accent)]" : "text-[var(--ss-muted)]"}`}
            >
              {t === "all" ? "전체 유형" : eventLabel(t)}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-5">
        <Table head={["근로자", "유형", "현장", "위치", "발생 시각", "상태"]} align={["left", "left", "left", "left", "right", "right"]}>
          {filtered.map((ev) => (
            <Row key={ev.id}>
              <Cell strong mono={false}>{ev.workerName}</Cell>
              <Cell mono={false}>{eventLabel(ev.type)}</Cell>
              <Cell mono={false}>{ev.siteName}</Cell>
              <Cell mono={false}>{ev.location}</Cell>
              <Cell align="right">{ev.at}</Cell>
              <Cell align="right">
                <span className="ss-mono font-semibold" style={{ color: STATUS_COLOR[ev.status] }}>
                  {STATUS_LABEL[ev.status]}
                </span>
              </Cell>
            </Row>
          ))}
        </Table>
        {filtered.length === 0 && (
          <p className="ss-mono py-10 text-center text-[11px] text-[var(--ss-muted)]">
            조건에 맞는 이벤트가 없습니다
          </p>
        )}
      </Card>
    </div>
  );
}
