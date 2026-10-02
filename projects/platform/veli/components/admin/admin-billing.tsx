"use client";

import { useMemo, useState } from "react";
import { ArrowCounterClockwise, Check, PaperPlaneTilt, X } from "@phosphor-icons/react";
import {
  ADMIN_PAYMENTS,
  PASS_TIER_SHARE,
  REVENUE_TREND,
  formatWon,
} from "@/projects/platform/veli/lib/mock-data";
import type { AdminPaymentRow } from "@/projects/platform/veli/lib/types";
import {
  Drawer,
  FilterChips,
  Metric,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
  ShareBar,
  Tag,
  TrendBars,
} from "@/projects/platform/veli/components/admin/admin-ui";

type StatusFilter = "all" | AdminPaymentRow["status"];
type PaymentRowState = AdminPaymentRow & { resent?: boolean };

const STATUS_TONE: Record<AdminPaymentRow["status"], "success" | "neutral" | "danger"> = {
  완료: "success",
  환불: "neutral",
  실패: "danger",
};

const PER_PAGE = 6;

export function AdminBilling() {
  const [rows, setRows] = useState<PaymentRowState[]>(ADMIN_PAYMENTS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const latestRevenue = REVENUE_TREND[REVENUE_TREND.length - 1];
  const refundCount = rows.filter((r) => r.status === "환불").length;
  const failedCount = rows.filter((r) => r.status === "실패").length;

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (!q) return true;
      return row.member.includes(q) || row.item.includes(q);
    });
  }, [rows, query, status]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const open = rows.find((r) => r.id === openId) ?? null;

  const counts = (key: AdminPaymentRow["status"]) => rows.filter((r) => r.status === key).length;

  const refund = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "환불" } : r)));
  };

  const resendPayment = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, resent: true } : r)));
  };

  return (
    <>
      <PageHead
        title="결제 관리"
        description="이용권 판매와 결제 실패 현황을 확인하고 환불 처리와 재결제 요청을 진행합니다."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="이번 달 매출"
          value={formatWon(latestRevenue.value)}
          unit="원"
          note={`${latestRevenue.label} 기준`}
        />
        <Metric label="환불 처리 건수" value={String(refundCount)} unit="건" note="누적 기준" />
        <Metric label="결제 실패 건수" value={String(failedCount)} unit="건" note="재결제 요청 필요" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="매출 추이" note="최근 5개월, 단위는 원">
          <TrendBars data={REVENUE_TREND} />
        </Panel>

        <Panel title="이용권 등급별 판매 비중" note="현재 활성 구독 기준">
          <ShareBar data={PASS_TIER_SHARE} />
        </Panel>
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
              placeholder="회원명, 항목 검색"
            />
            <FilterChips<StatusFilter>
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={[
                { key: "all", label: "전체", count: rows.length },
                { key: "완료", label: "완료", count: counts("완료") },
                { key: "환불", label: "환불", count: counts("환불") },
                { key: "실패", label: "실패", count: counts("실패") },
              ]}
            />
          </div>
        }
        title="결제 내역"
        note="행을 누르면 환불 처리와 재결제 요청을 할 수 있습니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[var(--vl-border)] text-[11.5px] text-[var(--vl-muted)]">
                <th className="px-5 py-3 font-semibold">회원</th>
                <th className="px-3 py-3 font-semibold">항목</th>
                <th className="px-3 py-3 text-right font-semibold">금액</th>
                <th className="px-3 py-3 font-semibold">일시</th>
                <th className="px-3 py-3 font-semibold">결제수단</th>
                <th className="px-5 py-3 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vl-border)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-bold">조건에 맞는 결제 내역이 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--vl-muted)]">
                      상태 필터를 전체로 바꾸거나 검색어를 지워 보세요.
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
                    <td className="px-5 py-3 font-semibold">{row.member}</td>
                    <td className="px-3 py-3 text-[var(--vl-muted)]">{row.item}</td>
                    <td className="vl-num px-3 py-3 text-right font-semibold">
                      {formatWon(row.amount)}원
                    </td>
                    <td className="vl-num px-3 py-3 text-[var(--vl-muted)]">{row.date}</td>
                    <td className="px-3 py-3 text-[var(--vl-muted)]">{row.method}</td>
                    <td className="px-5 py-3">
                      <Tag tone={STATUS_TONE[row.status]}>{row.status}</Tag>
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
              <p className="vl-num text-[12.5px] text-[var(--vl-muted)]">{open.id}</p>
              <h2 className="mt-1 text-[19px] font-bold tracking-tight">결제 상세</h2>
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
              <p className="vl-num text-[12px] text-[var(--vl-muted)]">{open.item}</p>
            </div>
            <span className="ml-auto">
              <Tag tone={STATUS_TONE[open.status]}>{open.status}</Tag>
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "결제 금액", value: `${formatWon(open.amount)}원`, num: true },
              { label: "결제 일시", value: open.date, num: true },
              { label: "결제수단", value: open.method, num: false },
              { label: "항목", value: open.item, num: false },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--vl-muted)]">{item.label}</dt>
                <dd className={`text-right font-semibold ${item.num ? "vl-num" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>

          {open.status === "완료" && (
            <div className="mt-7">
              <button
                type="button"
                onClick={() => refund(open.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[var(--vl-danger)] py-3 text-[13.5px] font-bold text-[var(--vl-danger)] active:scale-[0.97]"
              >
                <ArrowCounterClockwise size={14} />
                환불 처리
              </button>
            </div>
          )}

          {open.status === "환불" && (
            <p className="mt-7 rounded-[8px] border border-[var(--vl-border)] px-4 py-3 text-center text-[12.5px] font-semibold text-[var(--vl-muted)]">
              {open.method}로 환불 처리가 완료된 결제 건입니다.
            </p>
          )}

          {open.status === "실패" && (
            <div className="mt-7">
              {open.resent ? (
                <p className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[var(--vl-border)] px-4 py-3 text-center text-[12.5px] font-semibold text-[var(--vl-success)]">
                  <Check size={13} weight="bold" />
                  재결제 요청 알림을 회원에게 발송했습니다
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => resendPayment(open.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--vl-accent)] py-3 text-[13.5px] font-bold text-[var(--vl-accent-fg)] active:scale-[0.97]"
                >
                  <PaperPlaneTilt size={14} />
                  재결제 요청 발송
                </button>
              )}
            </div>
          )}
        </Drawer>
      )}
    </>
  );
}
