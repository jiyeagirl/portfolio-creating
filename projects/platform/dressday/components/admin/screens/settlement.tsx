"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import {
  AUGUST_TO_18,
  DAILY_REVENUE,
  DISTRICT_OPS,
  MONTHLY_REVENUE,
  MONTH_CANCELLED,
  MONTH_RENTALS_BY_PRODUCT,
  MONTH_REVENUE_TO_DATE,
  RESERVATIONS,
  SERVICE_AREAS,
} from "@/projects/platform/dressday/lib/admin-data";
import { CATEGORIES, getProduct, num } from "@/projects/platform/dressday/lib/catalog";
import {
  Button,
  ColumnChart,
  PageHead,
  Panel,
  ProductThumb,
  SectionTitle,
  Segmented,
  TableWrap,
  Td,
  Th,
  toneFg,
} from "@/projects/platform/dressday/components/admin/admin-ui";
import type { Tone } from "@/projects/platform/dressday/lib/types";

type Range = "daily" | "monthly";

export function Settlement() {
  const [range, setRange] = useState<Range>("daily");

  const delivered = DISTRICT_OPS.reduce((a, b) => a + b.delivered, 0);
  const picked = DISTRICT_OPS.reduce((a, b) => a + b.picked, 0);
  const delays = DISTRICT_OPS.reduce((a, b) => a + b.delays, 0);
  const onTime = (1 - delays / (delivered + picked)) * 100;
  const avg = Math.round(MONTH_REVENUE_TO_DATE / delivered);
  const growth = ((MONTH_REVENUE_TO_DATE - AUGUST_TO_18) / AUGUST_TO_18) * 100;

  const ranking = Object.entries(MONTH_RENTALS_BY_PRODUCT)
    .map(([id, n]) => ({ p: getProduct(id), n }))
    .sort((a, b) => b.n - a.n);
  const top = ranking[0].n;

  // 렌탈 현황: 이번 달 예약의 현재 단계
  const inHands = RESERVATIONS.filter((r) => ["이용 중", "회수 요청", "회수 중"].includes(r.status)).length;
  const stages: { label: string; n: number; tone: Tone | "ink" }[] = [
    { label: "배송 전", n: RESERVATIONS.filter((r) => r.status === "예약 확정").length, tone: "wait" },
    { label: "배송 중", n: RESERVATIONS.filter((r) => r.status === "배송 중").length, tone: "live" },
    { label: "고객 이용 중", n: inHands, tone: "ink" },
    { label: "반납 완료", n: picked, tone: "done" },
    { label: "취소", n: MONTH_CANCELLED, tone: "stop" },
  ];
  const stageTotal = stages.reduce((a, b) => a + b.n, 0);

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    n: ranking.filter((x) => x.p.category === cat).reduce((a, b) => a + b.n, 0),
  })).sort((a, b) => b.n - a.n);

  const chart =
    range === "daily"
      ? DAILY_REVENUE.map((d) => ({ label: String(Number(d.date.slice(3))), value: d.value, muted: d.partial }))
      : MONTHLY_REVENUE.map((m) => ({ label: m.month, value: m.value, muted: m.partial }));
  const best = chart.reduce((bi, d, i, arr) => (d.value > arr[bi].value ? i : bi), 0);

  return (
    <div className="space-y-8">
      <PageHead
        title="정산 및 통계"
        actions={
          <Button variant="secondary" icon={<DownloadSimple size={16} />}>
            정산서 내보내기
          </Button>
        }
      />

      {/* 핵심 지표 하나를 크게, 나머지는 작게 */}
      <div className="grid items-end gap-6 border-b border-[var(--dd-hairline)] pb-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-[13px] text-[var(--dd-muted)]">9월 매출 (원)</p>
          <p className="dd-num mt-1 text-[40px] font-semibold leading-[48px] tracking-[-0.01em] text-[var(--dd-ink)]">{num(MONTH_REVENUE_TO_DATE)}</p>
          <p className="dd-num mt-1 text-[13px] text-[var(--dd-muted)]">
            8월 같은 기간 {num(AUGUST_TO_18)} 대비{" "}
            <span className="font-semibold" style={{ color: growth >= 0 ? "var(--dd-done-fg)" : "var(--dd-error)" }}>
              {growth >= 0 ? "+" : "−"}
              {Math.abs(growth).toFixed(1)}%
            </span>
          </p>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-[var(--dd-hairline)]">
          {[
            ["대여 (건)", num(delivered)],
            ["건당 매출 (원)", num(avg)],
            ["정시율 (%)", onTime.toFixed(1)],
          ].map(([k, v]) => (
            <div key={k} className="px-6 first:pl-0 last:pr-0">
              <dt className="whitespace-nowrap text-[12px] text-[var(--dd-muted)]">{k}</dt>
              <dd className="dd-num mt-0.5 text-[20px] font-semibold text-[var(--dd-ink)]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Panel className="p-6">
        <SectionTitle
          aside={
            <Segmented<Range>
              size="sm"
              value={range}
              onChange={setRange}
              items={[
                { key: "daily", label: "일별" },
                { key: "monthly", label: "월별" },
              ]}
            />
          }
        >
          {range === "daily" ? "9월 일별 매출 (원)" : "월별 매출 (원)"}
        </SectionTitle>
        <div className="mt-6">
          <ColumnChart height={200} data={chart} highlight={best} format={(v) => num(v)} />
        </div>
      </Panel>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section>
          <SectionTitle aside={<span className="dd-num text-[13px] text-[var(--dd-muted)]">합계 {delivered}</span>}>상품별 대여 횟수 (회)</SectionTitle>
          <ol className="mt-3 border-t border-[var(--dd-hairline)]">
            {ranking.slice(0, 8).map(({ p, n }, i) => (
              <li key={p.id} className="flex items-center gap-3 border-b border-[var(--dd-hairline-soft)] py-2.5">
                <span className={`dd-num w-5 shrink-0 text-center text-[13px] ${i < 3 ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-muted)]"}`}>{i + 1}</span>
                <ProductThumb product={p} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] leading-5 text-[var(--dd-ink)]">{p.name}</span>
                  <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-[var(--dd-strong)]">
                    <span className="block h-full rounded-full bg-[var(--dd-ink)]" style={{ width: `${(n / top) * 100}%` }} />
                  </span>
                </span>
                <span className="dd-num w-10 shrink-0 text-right text-[14px] font-semibold text-[var(--dd-ink)]">{n}</span>
              </li>
            ))}
          </ol>
          <p className="dd-num pt-3 text-[13px] text-[var(--dd-muted)]">
            9~{ranking.length}위 {ranking.slice(8).reduce((a, b) => a + b.n, 0)}회
          </p>
        </section>

        <section className="space-y-8">
          <div>
            <SectionTitle aside={<span className="dd-num text-[13px] text-[var(--dd-muted)]">예약 {stageTotal}</span>}>렌탈 현황 (건)</SectionTitle>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full">
              {stages.map((s) => (
                <span key={s.label} style={{ width: `${(s.n / stageTotal) * 100}%`, background: s.tone === "ink" ? "var(--dd-ink)" : s.tone === "done" ? "var(--dd-border-strong)" : toneFg(s.tone) }} />
              ))}
            </div>
            <dl className="mt-4 grid grid-cols-5 gap-2">
              {stages.map((s) => (
                <div key={s.label} className="min-w-0">
                  <dt className="flex items-center gap-1.5 truncate text-[12px] text-[var(--dd-muted)]">
                    <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.tone === "ink" ? "var(--dd-ink)" : s.tone === "done" ? "var(--dd-border-strong)" : toneFg(s.tone) }} />
                    {s.label}
                  </dt>
                  <dd className="dd-num mt-0.5 text-[18px] font-semibold text-[var(--dd-ink)]">{s.n}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <SectionTitle>카테고리별 대여 (회)</SectionTitle>
            <ul className="mt-3 space-y-2">
              {byCategory.map(({ cat, n }) => (
                <li key={cat} className="grid grid-cols-[96px_1fr_40px] items-center gap-3 text-[13px]">
                  <span className="truncate text-[var(--dd-body)]">{cat}</span>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-[var(--dd-strong)]">
                    <span className="block h-full rounded-full bg-[var(--dd-border-strong)]" style={{ width: `${(n / byCategory[0].n) * 100}%` }} />
                  </span>
                  <span className="dd-num text-right font-semibold text-[var(--dd-ink)]">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section>
        <SectionTitle>배송 및 회수 처리 현황</SectionTitle>
        <div className="mt-2">
          <TableWrap minWidth={720}>
            <thead>
              <tr>
                <Th>지역</Th>
                <Th>당일 마감</Th>
                <Th align="right">배송 (건)</Th>
                <Th align="right">회수 (건)</Th>
                <Th align="right">지연 (건)</Th>
                <Th align="right">정시율 (%)</Th>
              </tr>
            </thead>
            <tbody>
              {DISTRICT_OPS.map((d) => {
                const rate = (1 - d.delays / (d.delivered + d.picked)) * 100;
                return (
                  <tr key={d.gu}>
                    <Td className="text-[var(--dd-ink)]">{d.gu}</Td>
                    <Td className="dd-num">{SERVICE_AREAS.find((s) => s.gu === d.gu)?.cutoff}</Td>
                    <Td align="right">{d.delivered}</Td>
                    <Td align="right">{d.picked}</Td>
                    <Td align="right">
                      <span className={d.delays >= 5 ? "font-semibold text-[var(--dd-error)]" : ""}>{d.delays}</span>
                    </Td>
                    <Td align="right">
                      <span className={rate < 95 ? "text-[var(--dd-error)]" : "text-[var(--dd-ink)]"}>{rate.toFixed(1)}</span>
                    </Td>
                  </tr>
                );
              })}
              <tr>
                <Td className="font-semibold text-[var(--dd-ink)]">합계</Td>
                <Td />
                <Td align="right" className="font-semibold text-[var(--dd-ink)]">
                  {delivered}
                </Td>
                <Td align="right" className="font-semibold text-[var(--dd-ink)]">
                  {picked}
                </Td>
                <Td align="right" className="font-semibold text-[var(--dd-ink)]">
                  {delays}
                </Td>
                <Td align="right" className="font-semibold text-[var(--dd-ink)]">
                  {onTime.toFixed(1)}
                </Td>
              </tr>
            </tbody>
          </TableWrap>
        </div>
      </section>
    </div>
  );
}
