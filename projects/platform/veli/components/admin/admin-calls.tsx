"use client";

import { useMemo, useState } from "react";
import { Flag, PhoneIncoming, PhoneOutgoing, Prohibit, X } from "@phosphor-icons/react";
import { ADMIN_CALLS } from "@/projects/platform/veli/lib/mock-data";
import type { AdminCallRow, CallResult } from "@/projects/platform/veli/lib/types";
import {
  Drawer,
  FilterChips,
  Metric,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
  Tag,
} from "@/projects/platform/veli/components/admin/admin-ui";

type ResultFilter = "all" | CallResult;
type CallRowState = AdminCallRow & { blocked?: boolean };

const RESULT_LABEL: Record<CallResult, string> = {
  connected: "연결성공",
  missed: "부재중",
  failed: "연결실패",
};

const RESULT_TONE: Record<CallResult, "success" | "warning" | "danger"> = {
  connected: "success",
  missed: "warning",
  failed: "danger",
};

const PER_PAGE = 6;

function formatDuration(sec: number): string {
  if (sec <= 0) return "-";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AdminCalls() {
  const [rows, setRows] = useState<CallRowState[]>(ADMIN_CALLS);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ResultFilter>("all");
  const [reportedOnly, setReportedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const totalCalls = rows.length;
  const successCount = rows.filter((r) => r.result === "connected").length;
  const successRate = totalCalls === 0 ? 0 : Math.round((successCount / totalCalls) * 1000) / 10;
  const reportedCount = rows.filter((r) => r.reported).length;

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows.filter((row) => {
      if (result !== "all" && row.result !== result) return false;
      if (reportedOnly && !row.reported) return false;
      if (!q) return true;
      return row.member.includes(q) || row.safeNumber.includes(q);
    });
  }, [rows, query, result, reportedOnly]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const open = rows.find((r) => r.id === openId) ?? null;

  const counts = (key: CallResult) => rows.filter((r) => r.result === key).length;

  const blockNumber = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, blocked: true } : r)));
  };

  return (
    <>
      <PageHead
        title="통화 관리"
        description="안심번호로 걸려온 전체 통화 이력을 조회하고 신고된 통화와 비정상 이용을 확인해 스팸 번호를 차단합니다."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="오늘 통화 건수" value={String(totalCalls)} unit="건" note="표시된 통화 이력 기준" />
        <Metric
          label="통화 성공률"
          value={successRate.toFixed(1)}
          unit="%"
          note={`연결 ${successCount}건 / 전체 ${totalCalls}건`}
        />
        <Metric label="신고 건수" value={String(reportedCount)} unit="건" note="스팸 의심 신고 접수" />
      </div>

      <Panel
        className="mt-4"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="회원명, 안심번호 검색"
            />
            <FilterChips<ResultFilter>
              value={result}
              onChange={(v) => {
                setResult(v);
                setPage(1);
              }}
              options={[
                { key: "all", label: "전체", count: rows.length },
                { key: "connected", label: "연결성공", count: counts("connected") },
                { key: "missed", label: "부재중", count: counts("missed") },
                { key: "failed", label: "연결실패", count: counts("failed") },
              ]}
            />
            <button
              type="button"
              onClick={() => {
                setReportedOnly((v) => !v);
                setPage(1);
              }}
              aria-pressed={reportedOnly}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                reportedOnly
                  ? "bg-[var(--vl-danger-soft)] text-[var(--vl-danger)]"
                  : "border border-[var(--vl-border)] text-[var(--vl-muted)] hover:text-[var(--vl-ink)]"
              }`}
            >
              신고된 통화만
            </button>
          </div>
        }
        title="통화 이력"
        note="행을 누르면 상세 내역과 스팸 번호 차단 처리를 할 수 있습니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-[var(--vl-border)] text-[11.5px] text-[var(--vl-muted)]">
                <th className="px-5 py-3 font-semibold">안심번호</th>
                <th className="px-3 py-3 font-semibold">회원</th>
                <th className="px-3 py-3 font-semibold">방향</th>
                <th className="px-3 py-3 font-semibold">일시</th>
                <th className="px-3 py-3 text-right font-semibold">통화시간</th>
                <th className="px-3 py-3 font-semibold">결과</th>
                <th className="px-5 py-3 font-semibold">신고여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vl-border)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-bold">조건에 맞는 통화가 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--vl-muted)]">
                      필터를 전체로 바꾸거나 검색어를 지워 보세요.
                    </p>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setOpenId(row.id)}
                    className="cursor-pointer text-[13px] hover:bg-[var(--vl-surface)]"
                  >
                    <td className="vl-num px-5 py-3 font-semibold">{row.safeNumber}</td>
                    <td className="px-3 py-3">{row.member}</td>
                    <td className="px-3 py-3 text-[var(--vl-muted)]">
                      <span className="inline-flex items-center gap-1.5">
                        {row.direction === "incoming" ? (
                          <PhoneIncoming size={13} />
                        ) : (
                          <PhoneOutgoing size={13} />
                        )}
                        {row.direction === "incoming" ? "수신" : "발신"}
                      </span>
                    </td>
                    <td className="vl-num px-3 py-3">
                      <div>{row.date}</div>
                      <div className="text-[12px] text-[var(--vl-muted)]">{row.time}</div>
                    </td>
                    <td className="vl-num px-3 py-3 text-right">{formatDuration(row.durationSec)}</td>
                    <td className="px-3 py-3">
                      <Tag tone={RESULT_TONE[row.result]}>{RESULT_LABEL[row.result]}</Tag>
                    </td>
                    <td className="px-5 py-3">
                      {row.reported ? (
                        <div className="flex flex-col items-start gap-1">
                          <Tag tone="danger">
                            <Flag size={10} weight="fill" />
                            신고 접수
                          </Tag>
                          {row.blocked && <Tag tone="neutral">차단됨</Tag>}
                        </div>
                      ) : (
                        <span className="text-[var(--vl-muted)]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {open && (
        <Drawer onClose={() => setOpenId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="vl-num text-[12.5px] text-[var(--vl-muted)]">{open.safeNumber}</p>
              <h2 className="mt-1 text-[19px] font-bold tracking-tight">통화 상세</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--vl-surface)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] bg-[var(--vl-surface)] p-4">
            <div>
              <p className="text-[14px] font-bold">{open.member}</p>
              <p className="vl-num text-[12px] text-[var(--vl-muted)]">
                {open.date} {open.time}
              </p>
            </div>
            <span className="ml-auto">
              <Tag tone={RESULT_TONE[open.result]}>{RESULT_LABEL[open.result]}</Tag>
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "안심번호", value: open.safeNumber, num: true },
              {
                label: "방향",
                value: open.direction === "incoming" ? "수신" : "발신",
                num: false,
              },
              { label: "통화시간", value: formatDuration(open.durationSec), num: true },
              { label: "일시", value: `${open.date} ${open.time}`, num: true },
              { label: "신고여부", value: open.reported ? "신고 접수" : "신고 없음", num: false },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--vl-muted)]">{item.label}</dt>
                <dd className={`text-right font-semibold ${item.num ? "vl-num" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>

          {open.reported && (
            <div className="mt-7">
              {open.blocked ? (
                <p className="rounded-[8px] border border-[var(--vl-border)] px-4 py-3 text-center text-[12.5px] font-semibold text-[var(--vl-muted)]">
                  이 통화의 발신 번호가 차단 목록에 등록되어 있습니다.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => blockNumber(open.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[var(--vl-danger)] py-3 text-[13.5px] font-bold text-[var(--vl-danger)] active:scale-[0.97]"
                >
                  <Prohibit size={14} />
                  번호 차단 처리
                </button>
              )}
            </div>
          )}
        </Drawer>
      )}
    </>
  );
}
