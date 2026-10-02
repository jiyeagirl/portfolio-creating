"use client";

import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Card, Cell, PageHead, Row, StatusBadge, Table } from "@/projects/monitoring/safesense/components/admin/ui";
import { sites } from "@/projects/monitoring/safesense/lib/mock-data";
import type { Worker } from "@/projects/monitoring/safesense/lib/types";

export function AdminWorkers({ workers }: { workers: Worker[] }) {
  const [query, setQuery] = useState("");

  const filtered = workers.filter(
    (w) => w.name.includes(query) || w.role.includes(query),
  );

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="WORKER MANAGEMENT"
        title="근로자 관리"
        desc="등록된 근로자의 현장 배정, 작업 상태, 근무 이력을 관리합니다."
        actions={
          <button className="ss-press ss-focusable rounded-[8px] border border-[var(--ss-accent)] bg-[var(--ss-accent)] px-4 py-2 text-[11px] font-bold text-[#0a0a0a]">
            근로자 등록
          </button>
        }
      />

      <div className="ss-mono flex items-center gap-2 rounded-[8px] border border-[var(--ss-border-strong)] bg-[var(--ss-panel)] px-3 py-2.5 sm:max-w-[320px]">
        <MagnifyingGlass size={14} className="shrink-0 text-[var(--ss-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름, 직종 검색"
          className="w-full bg-transparent text-[11px] text-[var(--ss-foreground)] outline-none placeholder:text-[var(--ss-muted)]"
        />
      </div>

      <Card className="p-5">
        <Table
          head={["근로자", "직종", "현장", "상태", "배터리", "마지막 신호", "오늘 이벤트"]}
          align={["left", "left", "left", "left", "right", "right", "right"]}
        >
          {filtered.map((w) => {
            const site = sites.find((s) => s.id === w.siteId);
            return (
              <Row key={w.id}>
                <Cell strong mono={false}>{w.name}</Cell>
                <Cell mono={false}>{w.role}</Cell>
                <Cell mono={false}>{site?.name ?? "-"}</Cell>
                <Cell>
                  <StatusBadge status={w.status} live={w.status === "danger"} />
                </Cell>
                <Cell align="right">
                  <span className={w.battery < 30 ? "text-[var(--ss-accent)]" : ""}>{w.battery}%</span>
                </Cell>
                <Cell align="right">{w.lastSignalMinAgo === 0 ? "방금 전" : `${w.lastSignalMinAgo}분 전`}</Cell>
                <Cell align="right">{w.todayEvents}건</Cell>
              </Row>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
