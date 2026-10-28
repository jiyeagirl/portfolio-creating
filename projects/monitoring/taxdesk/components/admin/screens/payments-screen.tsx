"use client";

import { useState } from "react";
import { CreditCard, DownloadSimple, Bank } from "@phosphor-icons/react";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import {
  Button,
  ConfirmDialog,
  MetricStrip,
  PageHeader,
  TD,
  TH,
  TH_R,
  TH_C,
  TR,
  Tabs,
  Toast,
  Pagination,
} from "@/projects/monitoring/taxdesk/components/admin/admin-ui";
import { PAYMENT_ROWS, PAYMENT_TOTALS } from "@/projects/monitoring/taxdesk/lib/admin-data";
import { PAYMENT_TONE, type PaymentState } from "@/projects/monitoring/taxdesk/lib/status";

type Filter = "전체" | "신용카드" | "가상계좌" | "확인 필요";

export function PaymentsScreen() {
  const [rows, setRows] = useState(PAYMENT_ROWS);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("전체");
  const [refundId, setRefundId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const needs = (s: PaymentState) => s === "입금 대기" || s === "기한 임박" || s === "기한 경과" || s === "결제 실패";
  const list = rows.filter((r) =>
    filter === "전체" ? true : filter === "확인 필요" ? needs(r.state) : r.method === filter,
  );
  const refundRow = rows.find((r) => r.id === refundId);

  function update(id: string, state: PaymentState, msg: string) {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, state } : r)));
    setToast(msg);
  }

  return (
    <div>
      <PageHeader
        title="결제 관리"
        meta="2025년 2기 신고 기간 | 01.02부터"
        actions={
          <Button variant="secondary" icon={<DownloadSimple size={15} />}>
            정산 내역
          </Button>
        }
      />
      <div className="mt-5">
        <MetricStrip
          items={[
            { label: "결제 건수 (건)", value: PAYMENT_TOTALS.count },
            { label: "결제 금액 (원)", value: PAYMENT_TOTALS.paid.toLocaleString("ko-KR") },
            { label: "입금 대기 (건)", value: PAYMENT_TOTALS.pending, tone: "act", sub: "기한 임박 1건 포함" },
            { label: "기한 경과 (건)", value: PAYMENT_TOTALS.overdue, tone: "stop" },
            { label: "환불 (건)", value: PAYMENT_TOTALS.refunded },
          ]}
        />
      </div>

      <div className="mt-6">
        <Tabs
          items={[
            { id: "전체" as Filter, label: "전체" },
            { id: "신용카드" as Filter, label: "신용카드" },
            { id: "가상계좌" as Filter, label: "가상계좌" },
            { id: "확인 필요" as Filter, label: "확인 필요", count: rows.filter((r) => needs(r.state)).length },
          ]}
          value={filter}
          onChange={setFilter}
          size="sm"
        />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--td-line)]">
              <th className={TH}>고객</th>
              <th className={TH}>결제 수단</th>
              <th className={`${TH_R} w-[136px]`}>금액 (원)</th>
              <th className={`${TH_C} w-[128px]`}>상태</th>
              <th className={`${TH} w-[168px]`}>일시 / 입금 기한</th>
              <th className={`${TH_R} w-[160px]`}>처리</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className={`${TR} hover:bg-[var(--td-pearl)]`}>
                <td className={TD}>
                  <p className="font-semibold">{r.business}</p>
                  <p className="td-mono mt-0.5 text-[12px] text-[var(--td-ink-3)]">{r.id}</p>
                </td>
                <td className={TD}>
                  <p className="flex items-center gap-1.5">
                    {r.method === "신용카드" ? <CreditCard size={15} className="text-[var(--td-ink-3)]" /> : <Bank size={15} className="text-[var(--td-ink-3)]" />}
                    {r.method}
                  </p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-[var(--td-ink-3)]">{r.detail}</p>
                </td>
                <td className={`${TD} text-right tabular-nums`}>{r.amount.toLocaleString("ko-KR")}</td>
                <td className={`${TD} text-center`}>
                  <StatusChip compact tone={PAYMENT_TONE[r.state]}>
                    {r.state}
                  </StatusChip>
                </td>
                <td className={`${TD} whitespace-nowrap tabular-nums text-[var(--td-ink-2)]`}>
                  {r.at}
                  {r.due && <p className={`text-[12px] ${r.state === "기한 경과" ? "text-[var(--td-stop-fg)]" : "text-[var(--td-ink-3)]"}`}>기한 {r.due}</p>}
                </td>
                <td className={`${TD} text-right`}>
                  {(r.state === "입금 대기" || r.state === "기한 임박") && (
                    <Button size="sm" variant="secondary" onClick={() => update(r.id, "결제 완료", "입금을 확인했습니다")}>
                      입금 확인
                    </Button>
                  )}
                  {r.state === "결제 완료" && (
                    <Button size="sm" variant="ghost" onClick={() => setRefundId(r.id)}>
                      환불
                    </Button>
                  )}
                  {r.state === "기한 경과" && <span className="text-[12px] text-[var(--td-ink-3)]">신청 자동 취소</span>}
                  {r.state === "결제 실패" && <span className="text-[12px] text-[var(--td-ink-3)]">한도 초과, 재결제됨</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        from={1}
        to={rows.length}
        total={PAYMENT_TOTALS.count}
        page={page}
        pages={Math.ceil(PAYMENT_TOTALS.count / rows.length)}
        onPage={setPage}
      />

      <ConfirmDialog
        open={refundRow !== undefined}
        title="환불할까요"
        body={
          <p>
            {refundRow?.business} | {refundRow?.amount.toLocaleString("ko-KR")}원을 {refundRow?.method}로 환불하고 접수 건을 반려 처리합니다.
          </p>
        }
        confirmLabel="환불"
        danger
        onClose={() => setRefundId(null)}
        onConfirm={() => {
          if (refundRow) update(refundRow.id, "환불", "환불을 요청했습니다");
          setRefundId(null);
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
