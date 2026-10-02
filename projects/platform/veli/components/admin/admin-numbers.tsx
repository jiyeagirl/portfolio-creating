"use client";

import { useMemo, useState } from "react";
import { ArrowCounterClockwise, PhoneOutgoing, X } from "@phosphor-icons/react";
import { ADMIN_SAFE_NUMBERS } from "@/projects/platform/veli/lib/mock-data";
import type { AdminNumberStatus, AdminSafeNumberRow, CtiStatus } from "@/projects/platform/veli/lib/types";
import {
  Drawer,
  FilterChips,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
  Tag,
} from "@/projects/platform/veli/components/admin/admin-ui";

type StatusFilter = "all" | AdminNumberStatus;

const STATUS_TONE: Record<AdminNumberStatus, "success" | "neutral" | "danger"> = {
  사용중: "success",
  미사용: "neutral",
  회수됨: "danger",
};

const CTI_TONE: Record<CtiStatus, "success" | "warning" | "neutral"> = {
  정상: "success",
  지연: "warning",
  점검중: "neutral",
};

const PER_PAGE = 6;

export function AdminNumbers() {
  const [rows, setRows] = useState<AdminSafeNumberRow[]>(ADMIN_SAFE_NUMBERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [openNumber, setOpenNumber] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (!q) return true;
      return row.number.includes(q) || (row.assignedTo ?? "").includes(q);
    });
  }, [rows, query, status]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const open = rows.find((r) => r.number === openNumber) ?? null;

  const counts = (key: AdminNumberStatus) => rows.filter((r) => r.status === key).length;

  const issueNumber = (number: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.number === number
          ? {
              ...r,
              status: "사용중",
              assignedTo: "수동 테스트 배정",
              issuedAt: "2026-07-30",
            }
          : r,
      ),
    );
  };

  const reclaimNumber = (number: string) => {
    setRows((prev) =>
      prev.map((r) => (r.number === number ? { ...r, status: "회수됨" } : r)),
    );
  };

  return (
    <>
      <PageHead
        title="안심번호 관리"
        description="070 안심번호의 발급, 회수, 상태를 관리하고 CTI 연결 상태와 사용 이력을 확인합니다."
      />

      <Panel
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="안심번호, 배정 회원"
            />
            <FilterChips<StatusFilter>
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={[
                { key: "all", label: "전체", count: rows.length },
                { key: "사용중", label: "사용중", count: counts("사용중") },
                { key: "미사용", label: "미사용", count: counts("미사용") },
                { key: "회수됨", label: "회수됨", count: counts("회수됨") },
              ]}
            />
          </div>
        }
        title="안심번호 목록"
        note="행을 누르면 발급, 회수 처리와 CTI 상태를 확인할 수 있습니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left">
            <thead>
              <tr className="border-b border-[var(--vl-border)] text-[11.5px] text-[var(--vl-muted)]">
                <th className="px-5 py-3 font-semibold">번호</th>
                <th className="px-3 py-3 font-semibold">배정 회원</th>
                <th className="px-3 py-3 font-semibold">차량번호</th>
                <th className="px-3 py-3 font-semibold">상태</th>
                <th className="px-3 py-3 font-semibold">CTI 상태</th>
                <th className="px-3 py-3 font-semibold">발급일</th>
                <th className="px-5 py-3 text-right font-semibold">총 통화</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vl-border)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-bold">조건에 맞는 안심번호가 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--vl-muted)]">
                      상태 필터를 전체로 바꾸거나 검색어를 지워 보세요.
                    </p>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.number}
                    onClick={() => setOpenNumber(row.number)}
                    className="cursor-pointer text-[13px] hover:bg-[var(--vl-surface)]"
                  >
                    <td className="vl-num px-5 py-3 font-semibold">{row.number}</td>
                    <td className="px-3 py-3 text-[var(--vl-muted)]">{row.assignedTo ?? "미배정"}</td>
                    <td className="vl-num px-3 py-3 text-[var(--vl-muted)]">
                      {row.vehicleNumber ?? "-"}
                    </td>
                    <td className="px-3 py-3">
                      <Tag tone={STATUS_TONE[row.status]}>{row.status}</Tag>
                    </td>
                    <td className="px-3 py-3">
                      <Tag tone={CTI_TONE[row.ctiStatus]}>{row.ctiStatus}</Tag>
                    </td>
                    <td className="vl-num px-3 py-3 text-[var(--vl-muted)]">
                      {row.issuedAt ?? "-"}
                    </td>
                    <td className="vl-num px-5 py-3 text-right">{row.totalCalls}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {open && (
        <Drawer onClose={() => setOpenNumber(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="vl-num text-[12.5px] text-[var(--vl-muted)]">안심번호</p>
              <h2 className="vl-num mt-1 text-[19px] font-bold tracking-tight">{open.number}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenNumber(null)}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--vl-surface)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] bg-[var(--vl-surface)] p-4">
            <div>
              <p className="text-[14px] font-bold">{open.assignedTo ?? "미배정 번호"}</p>
              <p className="vl-num text-[12px] text-[var(--vl-muted)]">
                {open.vehicleNumber ?? "매핑된 차량 없음"}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1.5">
              <Tag tone={STATUS_TONE[open.status]}>{open.status}</Tag>
              <Tag tone={CTI_TONE[open.ctiStatus]}>{open.ctiStatus}</Tag>
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "발급일", value: open.issuedAt ?? "-", num: true },
              { label: "CTI 상태", value: open.ctiStatus, num: false },
              { label: "총 통화 건수", value: `${open.totalCalls}건`, num: true },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--vl-muted)]">{item.label}</dt>
                <dd className={`text-right font-semibold ${item.num ? "vl-num" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-[13.5px] font-bold">사용 이력</h3>
          <ol className="mt-3 space-y-3">
            {(open.status === "미사용"
              ? [{ time: "-", text: "발급 이력이 없는 미사용 번호입니다" }]
              : [
                  { time: `${open.issuedAt ?? "-"} 09:00`, text: "회원에게 번호 발급, CTI 회선 연결" },
                  { time: "2026-07-27 16:47", text: "안심번호 통화 연결 성공" },
                  {
                    time: "2026-07-29 09:41",
                    text:
                      open.ctiStatus === "지연"
                        ? "CTI 연결 지연 감지, 회선 상태 점검 대상 등록"
                        : "CTI 회선 상태 정상 확인",
                  },
                ]
            ).map((item) => (
              <li key={item.time} className="flex gap-3">
                <span className="vl-num w-[112px] shrink-0 text-[11.5px] text-[var(--vl-muted)]">
                  {item.time}
                </span>
                <span className="text-[12.5px] leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-7 space-y-2">
            {open.status === "미사용" && (
              <button
                type="button"
                onClick={() => issueNumber(open.number)}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--vl-accent)] py-3 text-[13.5px] font-bold text-[var(--vl-accent-fg)] active:scale-[0.97]"
              >
                <PhoneOutgoing size={14} />
                번호 발급
              </button>
            )}
            {open.status === "사용중" && (
              <button
                type="button"
                onClick={() => reclaimNumber(open.number)}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[var(--vl-danger)] py-3 text-[13.5px] font-bold text-[var(--vl-danger)] active:scale-[0.97]"
              >
                <ArrowCounterClockwise size={14} />
                번호 회수
              </button>
            )}
            {open.status === "회수됨" && (
              <p className="rounded-[8px] border border-[var(--vl-border)] px-4 py-3 text-center text-[12.5px] font-semibold text-[var(--vl-muted)]">
                재발급 대기 처리 중인 번호입니다. 격리 기간 경과 후 신규 회원에게 재배정됩니다.
              </p>
            )}
          </div>
        </Drawer>
      )}
    </>
  );
}
