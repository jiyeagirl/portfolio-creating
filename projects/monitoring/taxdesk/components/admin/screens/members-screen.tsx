"use client";

import { useState } from "react";
import { DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { Button, MetricStrip, PageHeader, Pagination, TD, TH, TH_C, TH_R, TR, Tabs } from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { MEMBERS, MEMBER_TOTALS } from "@/projects/monitoring/taxdesk/lib/admin-data";
import type { Tone } from "@/projects/monitoring/taxdesk/lib/status";

type Consult = (typeof MEMBERS)[number]["consult"];
const CONSULT_TONE: Record<Consult, Tone> = { 신청: "act", "상담 완료": "done", 미신청: "wait" };
type Filter = "전체" | Consult;

export function MembersScreen() {
  const [filter, setFilter] = useState<Filter>("전체");
  const rows = MEMBERS.filter((m) => filter === "전체" || m.consult === filter);

  return (
    <div>
      <PageHeader
        title="회원 관리"
        meta="개인정보는 마스킹해 표시 | 열람 기록 보관 1년"
        actions={
          <Button variant="secondary" icon={<DownloadSimple size={15} />}>
            내보내기
          </Button>
        }
      />
      <div className="mt-5">
        <MetricStrip
          items={[
            { label: "전체 회원 (명)", value: MEMBER_TOTALS.total.toLocaleString("ko-KR") },
            { label: "이번 신고 기간 신규 (명)", value: MEMBER_TOTALS.newThisPeriod },
            { label: "기장대리 상담 신청 (명)", value: MEMBER_TOTALS.consultRequested, tone: "act", sub: "응대 대기 28명" },
            { label: "상담 완료 (명)", value: MEMBER_TOTALS.consultDone },
          ]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Tabs
            items={[
              { id: "전체" as Filter, label: "전체" },
              { id: "신청" as Filter, label: "상담 신청" },
              { id: "상담 완료" as Filter, label: "상담 완료" },
              { id: "미신청" as Filter, label: "미신청" },
            ]}
            value={filter}
            onChange={setFilter}
            size="sm"
          />
        </div>
        <label className="relative">
          <span className="sr-only">회원 검색</span>
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--td-ink-3)]" />
          <input
            placeholder="회원번호, 상호"
            className="h-9 w-[220px] rounded-[8px] border border-[var(--td-line)] pl-8 pr-3 text-[13px] placeholder:text-[var(--td-ink-3)]"
          />
        </label>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--td-line)]">
              <th className={TH}>회원</th>
              <th className={TH}>상호</th>
              <th className={`${TH} w-[120px]`}>가입 경로</th>
              <th className={`${TH_R} w-[128px]`}>신고 이력 (건)</th>
              <th className={`${TH} w-[200px]`}>최근 신고</th>
              <th className={`${TH_C} w-[144px]`}>기장대리 상담</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className={`${TR} hover:bg-[var(--td-pearl)]`}>
                <td className={TD}>
                  <p className="font-semibold">{m.name}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--td-ink-3)]">
                    <span className="td-mono">{m.id}</span> | <span className="tabular-nums">{m.phone}</span>
                  </p>
                </td>
                <td className={`${TD} whitespace-nowrap`}>{m.business}</td>
                <td className={`${TD} text-[var(--td-ink-2)]`}>{m.joined}</td>
                <td className={`${TD} text-right tabular-nums`}>{m.filings}</td>
                <td className={`${TD} text-[var(--td-ink-2)]`}>{m.last}</td>
                <td className={`${TD} text-center`}>
                  <StatusChip compact tone={CONSULT_TONE[m.consult]}>
                    {m.consult === "신청" ? "상담 신청" : m.consult}
                  </StatusChip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination from={1} to={rows.length} total={filter === "전체" ? MEMBER_TOTALS.total : rows.length} page={1} pages={filter === "전체" ? 5 : 1} onPage={() => {}} />
    </div>
  );
}
