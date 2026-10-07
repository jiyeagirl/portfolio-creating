"use client";

import { useMemo, useState } from "react";
import { PencilSimple } from "@phosphor-icons/react";
import { INTERVAL_OPTIONS, MONITOR_LOGS, PROXY_SUMMARY, getCourse } from "@/projects/b2b/teefinder/lib/mock-data";
import { formatWon } from "@/projects/b2b/teefinder/lib/format";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { Badge, collectTone } from "@/projects/b2b/teefinder/components/ui";
import type { CollectStatus } from "@/projects/b2b/teefinder/lib/types";
import {
  Btn,
  PageHeader,
  Pagination,
  TableShell,
  Td,
  TextInput,
  Th,
} from "@/projects/b2b/teefinder/components/admin/admin-ui";

const PAGE_SIZE = 10;
const SEVERITY: Record<CollectStatus, number> = { 오류: 0, "점검 필요": 1, "인증 필요": 2, 정상: 3 };

export function MonitoringScreen({ onEditConfig }: { onEditConfig: (courseId: string) => void }) {
  const { courses } = useStore();
  const [page, setPage] = useState(1);
  const [interval, setIntervalMin] = useState(5);
  const [threshold, setThreshold] = useState("3");
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const sorted = useMemo(
    () =>
      [...courses].sort(
        (a, b) => SEVERITY[a.status] - SEVERITY[b.status] || a.successRate - b.successRate,
      ),
    [courses],
  );
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const collected = courses.filter((c) => c.lastSuccess !== "수집 전");
  const overall = collected.reduce((sum, c) => sum + c.successRate, 0) / Math.max(collected.length, 1);
  const errorCount = courses.filter((c) => c.status === "오류").length;

  return (
    <div>
      <PageHeader title="수집 모니터링" meta="최근 24시간 기준" />

      <section className="mb-5 flex flex-wrap items-stretch rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
        <div className="min-w-[220px] flex-[1.4] px-6 py-4">
          <p className="text-[12.5px] text-[var(--tf-ink-3)]">전체 수집 성공률 (%)</p>
          <p className="mt-1 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums">
            {overall.toFixed(1)}
          </p>
        </div>
        <div className="min-w-[150px] flex-1 border-l border-[var(--tf-line)] px-6 py-4">
          <p className="text-[12.5px] text-[var(--tf-ink-3)]">오류 골프장 (곳)</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums text-[var(--tf-red-fg)]">{errorCount}</p>
        </div>
        <div className="min-w-[150px] flex-1 border-l border-[var(--tf-line)] px-6 py-4">
          <p className="text-[12.5px] text-[var(--tf-ink-3)]">프록시 가용률 (%)</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums">{PROXY_SUMMARY.availability.toFixed(1)}</p>
        </div>
        <div className="min-w-[170px] flex-1 border-l border-[var(--tf-line)] px-6 py-4">
          <p className="text-[12.5px] text-[var(--tf-ink-3)]">마지막 수집 시각</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums">09:42</p>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div>
            <TableShell minWidth={760}>
              <thead>
                <tr>
                  <Th>골프장</Th>
                  <Th align="right" width={140}>
                    24시간 성공률 (%)
                  </Th>
                  <Th width={150}>마지막 성공</Th>
                  <Th width={130}>상태</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--tf-line)]">
                {rows.map((c) => {
                  const bad = c.status === "오류";
                  return (
                    <tr key={c.id} className={bad ? "bg-[color-mix(in_srgb,var(--tf-red-bg)_38%,white)]" : ""}>
                      <Td>
                        <div className="font-medium">{c.name}</div>
                        <div className="mt-0.5 text-[12px] text-[var(--tf-ink-3)]">{c.region}</div>
                      </Td>
                      <Td align="right" className={bad ? "font-semibold text-[var(--tf-red-fg)]" : ""}>
                        {c.successRate.toFixed(1)}
                      </Td>
                      <Td className="tabular-nums text-[var(--tf-ink-2)]">{c.lastSuccess}</Td>
                      <Td>
                        <Badge tone={collectTone(c.status)} compact>
                          {c.status}
                        </Badge>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableShell>
            <Pagination page={current} pageCount={pageCount} total={sorted.length} pageSize={PAGE_SIZE} onPage={setPage} />
          </div>

          <section>
            <h2 className="pb-3 text-[14px] font-semibold">오류 로그</h2>
            <TableShell minWidth={760}>
              <thead>
                <tr>
                  <Th width={116}>시각</Th>
                  <Th width={140}>골프장</Th>
                  <Th width={72}>구분</Th>
                  <Th>내용</Th>
                  <Th width={116}>조치</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--tf-line)]">
                {MONITOR_LOGS.map((l) => (
                  <tr key={l.id}>
                    <Td className="whitespace-nowrap tabular-nums text-[var(--tf-ink-2)]">{l.at}</Td>
                    <Td className="whitespace-nowrap font-medium">{getCourse(l.courseId).name}</Td>
                    <Td>
                      <Badge tone={l.level === "오류" ? "red" : "orange"} compact>
                        {l.level}
                      </Badge>
                    </Td>
                    <Td className="text-[var(--tf-ink-2)]">{l.message}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => onEditConfig(l.courseId)}
                        className="inline-flex h-8 items-center gap-1 rounded-[6px] px-2 text-[13px] font-medium text-[var(--tf-ink-2)] underline underline-offset-4 hover:bg-[var(--tf-soft)]"
                      >
                        <PencilSimple size={14} />
                        설정 수정
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
            <div className="flex h-12 items-center border-b border-[var(--tf-line)] px-4">
              <h2 className="text-[14px] font-semibold">수집 간격</h2>
            </div>
            <div className="p-4">
              <div role="radiogroup" className="flex gap-1 rounded-[6px] bg-[var(--tf-soft)] p-1">
                {INTERVAL_OPTIONS.map((o) => {
                  const active = interval === o.minutes;
                  return (
                    <button
                      key={o.minutes}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setIntervalMin(o.minutes)}
                      className={`h-8 flex-1 rounded-[4px] text-[13px] transition-colors ${
                        active
                          ? "bg-[var(--tf-surface)] font-semibold shadow-[0_1px_2px_rgba(24,35,29,0.08)]"
                          : "font-medium text-[var(--tf-ink-3)] hover:text-[var(--tf-ink)]"
                      }`}
                    >
                      {o.minutes}분
                    </button>
                  );
                })}
              </div>
              <table className="mt-3 w-full text-[13px]">
                <thead>
                  <tr className="text-[12px] text-[var(--tf-ink-3)]">
                    <th className="pb-1.5 text-left font-medium">간격</th>
                    <th className="pb-1.5 text-right font-medium">예상 월 운영비 (원)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--tf-line)]">
                  {INTERVAL_OPTIONS.map((o) => (
                    <tr key={o.minutes} className={interval === o.minutes ? "font-semibold" : "text-[var(--tf-ink-2)]"}>
                      <td className="py-2">{o.minutes}분</td>
                      <td className="py-2 text-right tabular-nums">{formatWon(o.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[11.5px] text-[var(--tf-ink-3)]">예시 수치입니다. 실제는 견적 확정 후 안내합니다.</p>
            </div>
          </section>

          <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
            <div className="flex h-12 items-center border-b border-[var(--tf-line)] px-4">
              <h2 className="text-[14px] font-semibold">프록시 상태</h2>
            </div>
            <ul className="divide-y divide-[var(--tf-line)]">
              {PROXY_SUMMARY.pools.map((p) => {
                const ratio = (p.healthy / p.total) * 100;
                return (
                  <li key={p.name} className="px-4 py-3">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium">{p.name}</span>
                      <span className="tabular-nums text-[var(--tf-ink-2)]">
                        {p.healthy} / {p.total}
                      </span>
                    </div>
                    <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[var(--tf-soft)]">
                      <div
                        className={`h-full rounded-full ${ratio < 90 ? "bg-[var(--tf-orange)]" : "bg-[var(--tf-green)]"}`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
            <div className="flex h-12 items-center border-b border-[var(--tf-line)] px-4">
              <h2 className="text-[14px] font-semibold">수집 실패 알림 기준</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-[var(--tf-ink-2)]">연속</span>
                <TextInput
                  value={threshold}
                  onChange={(v) => {
                    setThreshold(v.replace(/\D/g, "").slice(0, 2));
                    setThresholdSaved(false);
                  }}
                  className="!w-16 text-center tabular-nums"
                />
                <span className="text-[var(--tf-ink-2)]">회 실패 시 운영자 알림</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-[var(--tf-green-fg)]">
                  {thresholdSaved ? "저장했습니다" : ""}
                </span>
                <Btn
                  kind="primary"
                  disabled={threshold === "" || Number(threshold) < 1}
                  onClick={() => setThresholdSaved(true)}
                >
                  저장
                </Btn>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
