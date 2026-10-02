"use client";

import { useState } from "react";
import { Check, Export } from "@phosphor-icons/react";
import {
  POLICY_FEE,
  SETTLEMENTS,
  SETTLEMENT_MONTHS,
  expertById,
  formatWon,
} from "@/projects/platform/lumi/lib/mock-data";
import type { Settlement } from "@/projects/platform/lumi/lib/types";
import {
  FilterChips,
  Metric,
  PageHead,
  Panel,
  Tag,
  TrendBars,
} from "@/projects/platform/lumi/components/admin/admin-ui";

type StateFilter = "all" | Settlement["state"];

const STATE_TONE: Record<Settlement["state"], "accent" | "live" | "success"> = {
  지급대기: "accent",
  검토중: "live",
  지급완료: "success",
};

export function AdminSettlements() {
  const [filter, setFilter] = useState<StateFilter>("all");
  const [paid, setPaid] = useState<string[]>([]);

  const stateOf = (row: Settlement): Settlement["state"] =>
    paid.includes(row.id) ? "지급완료" : row.state;

  const rows = SETTLEMENTS.filter((row) => filter === "all" || stateOf(row) === filter);

  const duePayout = SETTLEMENTS.filter((r) => stateOf(r) !== "지급완료").reduce(
    (sum, r) => sum + r.payout,
    0,
  );
  const feeIncome = SETTLEMENTS.reduce((sum, r) => sum + r.fee, 0);
  const donePayout = SETTLEMENTS.filter((r) => stateOf(r) === "지급완료").reduce(
    (sum, r) => sum + r.payout,
    0,
  );

  return (
    <>
      <PageHead
        title="정산 관리"
        description="상담사별 정산 금액을 확인하고 지급을 승인합니다. 정산은 매월 1일과 16일, 두 번 마감합니다."
        actions={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--lm-surface)]"
          >
            <Export size={14} />
            정산 명세서 발송
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="지급 예정"
          value={formatWon(duePayout)}
          unit="원"
          note={`${SETTLEMENTS.filter((r) => stateOf(r) !== "지급완료").length}건 · 7월 31일 마감`}
        />
        <Metric label="이번 회차 수수료 수익" value={formatWon(feeIncome)} unit="원" note="플랫폼 귀속" />
        <Metric label="지급 완료" value={formatWon(donePayout)} unit="원" note="이번 달 누적" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="월별 정산 지급액" note="단위는 원, 2026년 7월은 상반기 마감분만 포함">
          <TrendBars
            data={SETTLEMENT_MONTHS.map((item) => ({
              label: item.month,
              value: item.payout,
              caption: `${(item.payout / 100000000).toFixed(2)}억원`,
            }))}
          />
        </Panel>

        <Panel title="등급별 수수료" note="정산 금액 계산에 그대로 적용됩니다">
          <ul className="divide-y divide-[var(--lm-border)]">
            {POLICY_FEE.map((item) => (
              <li key={item.grade} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold">{item.grade}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--lm-muted)]">{item.condition}</p>
                </div>
                <span className="lm-num text-[17px] font-bold">{item.fee}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        className="mt-4"
        title="정산 내역"
        note="지급액은 상담 총액에서 수수료와 조정 금액을 뺀 값입니다"
        actions={
          <FilterChips<StateFilter>
            value={filter}
            onChange={setFilter}
            options={[
              { key: "all", label: "전체", count: SETTLEMENTS.length },
              { key: "지급대기", label: "지급대기" },
              { key: "검토중", label: "검토중" },
              { key: "지급완료", label: "지급완료" },
            ]}
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                <th className="px-5 py-3 font-semibold">정산번호</th>
                <th className="px-3 py-3 font-semibold">상담사</th>
                <th className="px-3 py-3 font-semibold">정산 기간</th>
                <th className="px-3 py-3 text-right font-semibold">상담</th>
                <th className="px-3 py-3 text-right font-semibold">총액</th>
                <th className="px-3 py-3 text-right font-semibold">수수료</th>
                <th className="px-3 py-3 text-right font-semibold">조정</th>
                <th className="px-3 py-3 text-right font-semibold">지급액</th>
                <th className="px-5 py-3 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--lm-border)]">
              {rows.map((row) => {
                const state = stateOf(row);
                return (
                  <tr key={row.id} className="text-[13px] hover:bg-[var(--lm-surface)]">
                    <td className="lm-num px-5 py-3 font-semibold">{row.id}</td>
                    <td className="px-3 py-3 font-semibold">{expertById(row.expertId).name}</td>
                    <td className="lm-num px-3 py-3 text-[var(--lm-muted)]">{row.period}</td>
                    <td className="lm-num px-3 py-3 text-right">{row.sessions}건</td>
                    <td className="lm-num px-3 py-3 text-right">{formatWon(row.gross)}</td>
                    <td className="lm-num px-3 py-3 text-right text-[var(--lm-muted)]">
                      {formatWon(row.fee)} ({row.feeRate}%)
                    </td>
                    <td
                      className={`lm-num px-3 py-3 text-right ${
                        row.adjust < 0 ? "text-[var(--lm-danger)]" : "text-[var(--lm-muted)]"
                      }`}
                    >
                      {row.adjust === 0 ? "-" : formatWon(row.adjust)}
                    </td>
                    <td className="lm-num px-3 py-3 text-right font-bold">
                      {formatWon(row.payout)}
                    </td>
                    <td className="px-5 py-3">
                      {state === "지급완료" ? (
                        <Tag tone="success">
                          <Check size={11} weight="bold" />
                          지급완료
                        </Tag>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Tag tone={STATE_TONE[state]}>{state}</Tag>
                          <button
                            type="button"
                            onClick={() => setPaid((prev) => [...prev, row.id])}
                            className="rounded-lg border border-[var(--lm-border)] px-2.5 py-1 text-[12px] font-semibold transition-colors hover:bg-[var(--lm-surface)]"
                          >
                            지급 완료
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
