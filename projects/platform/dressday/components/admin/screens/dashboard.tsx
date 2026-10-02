"use client";

import { ArrowRight, Moped, Package, Warning, CoatHanger } from "@phosphor-icons/react";
import {
  DAILY_REVENUE,
  DASHBOARD,
  DELAYED,
  INSPECTION_PENDING,
  CENTER,
  NOW,
  RESERVATIONS,
  TODAY_CANCELLED,
  TODAY_JOBS,
  UNASSIGNED,
  getCustomer,
  getRider,
  JOB_TONE,
  productStatus,
} from "@/projects/platform/dressday/lib/admin-data";
import { PRODUCTS, getProduct, num } from "@/projects/platform/dressday/lib/catalog";
import type { Tone } from "@/projects/platform/dressday/lib/types";
import type { Go } from "@/projects/platform/dressday/components/admin/admin-shell";
import { Badge, Button, ColumnChart, MetricRow, PageHead, Panel, SectionTitle, Td, Th, TableWrap } from "@/projects/platform/dressday/components/admin/admin-ui";

const HOURS = Array.from({ length: 12 }, (_, i) => 10 + i);

function HourlyChart() {
  const rows = HOURS.map((h) => {
    const inHour = TODAY_JOBS.filter((j) => Number(j.window.slice(0, 2)) === h);
    return { h, d: inHour.filter((j) => j.kind === "배송").length, p: inHour.filter((j) => j.kind === "회수").length };
  });
  const max = Math.max(...rows.map((r) => Math.max(r.d, r.p)), 1);
  const H = 148;
  const nowHour = Math.floor(NOW.minutes / 60);
  return (
    <div>
      <div className="relative flex items-end gap-2" style={{ height: H }}>
        {rows.map((r) => {
          const past = r.h < nowHour;
          const current = r.h === nowHour;
          return (
            <div key={r.h} className="relative flex h-full min-w-0 flex-1 items-end justify-center gap-[3px]">
              {current && <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--dd-primary)]" />}
              <span
                className="relative block w-[38%] max-w-[14px] rounded-t-[3px]"
                style={{ height: Math.max(2, (r.d / max) * (H - 16)), background: past ? "var(--dd-border-strong)" : "var(--dd-ink)" }}
                title={`${r.h}시 배송 ${r.d}`}
              />
              <span
                className="relative block w-[38%] max-w-[14px] rounded-t-[3px]"
                style={{ height: Math.max(2, (r.p / max) * (H - 16)), background: past ? "var(--dd-hairline)" : "var(--dd-muted-soft)" }}
                title={`${r.h}시 회수 ${r.p}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 border-t border-[var(--dd-hairline)] pt-2">
        {rows.map((r) => (
          <span key={r.h} className={`dd-num min-w-0 flex-1 text-center text-[11px] leading-4 ${r.h === nowHour ? "font-semibold text-[var(--dd-primary-active)]" : "text-[var(--dd-muted)]"}`}>
            {r.h === nowHour ? NOW.time : `${r.h}시`}
          </span>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--dd-muted)]">
      <span aria-hidden className="h-2.5 w-2.5 rounded-[2px]" style={{ background: color }} />
      {label}
    </span>
  );
}

interface QueueItem {
  key: string;
  icon: typeof Warning;
  title: string;
  meta: string;
  badge: { tone: Tone; label: string };
  action: string;
  onClick: () => void;
}

export function Dashboard({ go }: { go: Go }) {
  const d = DASHBOARD;
  const moving = TODAY_JOBS.filter((j) => j.state === "이동 중" || j.state === "지연");
  const deliveryMoving = TODAY_JOBS.filter((j) => j.kind === "배송" && j.state === "이동 중").length;
  const pickupMoving = TODAY_JOBS.filter((j) => j.kind === "회수" && j.state === "이동 중").length;
  const lowStock = PRODUCTS.filter((p) => productStatus(p) === "재고 부족");

  const week = DAILY_REVENUE.slice(13, 18);
  const lastWeek = DAILY_REVENUE.slice(6, 11);
  const weekSum = week.reduce((a, b) => a + b.value, 0);
  // 비교는 하루가 끝난 월~목끼리 (금요일은 진행 중)
  const doneSum = week.slice(0, 4).reduce((a, b) => a + b.value, 0);
  const lastSum = lastWeek.slice(0, 4).reduce((a, b) => a + b.value, 0);
  const diff = ((doneSum - lastSum) / lastSum) * 100;
  const WEEK_LABEL = ["월", "화", "수", "목", "금"];

  const queue: QueueItem[] = [
    ...DELAYED.map((j) => ({
      key: j.jobId,
      icon: Warning,
      title: `${j.jobId} ${j.kind} 지연`,
      meta: `${getCustomer(j.reservation.customerId)?.name} | ${j.reservation.gu} | ${j.issue ?? ""}`,
      badge: { tone: "stop" as Tone, label: "지연" },
      action: "확인",
      onClick: () => go("dispatch"),
    })),
    ...UNASSIGNED.slice(0, 3).map((j) => ({
      key: j.jobId,
      icon: Moped,
      title: `${j.jobId} ${j.kind} ${j.window}`,
      meta: `${getCustomer(j.reservation.customerId)?.name} | ${j.reservation.gu} | ${getProduct(j.reservation.productId).name}`,
      badge: { tone: "act" as Tone, label: "미배차" },
      action: "배정",
      onClick: () => go("dispatch", { assign: j.jobId }),
    })),
    {
      key: "inspection",
      icon: Package,
      title: `반납 검수 대기 ${INSPECTION_PENDING.length}벌`,
      meta: `가장 먼저 입고 ${INSPECTION_PENDING.map((i) => i.receivedAt).sort()[0]} | ${CENTER} 검수대`,
      badge: { tone: "act", label: "검수 필요" },
      action: "검수",
      onClick: () => go("inspection"),
    },
    {
      key: "stock",
      icon: CoatHanger,
      title: `재고 부족 상품 ${lowStock.length}개`,
      meta: lowStock.map((p) => p.name).join(", "),
      badge: { tone: "wait", label: "재고 부족" },
      action: "보기",
      onClick: () => go("products"),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHead
        title="관리자 대시보드"
        actions={
          <Button variant="secondary" onClick={() => go("reservations")}>
            예약 관리
          </Button>
        }
      />

      <MetricRow
        items={[
          { label: "오늘 예약 (건)", value: num(d.todayOrders), sub: `취소 ${TODAY_CANCELLED.length}건 별도` },
          { label: "배송 예정 (건)", value: num(d.deliveries), sub: `이동 중 ${deliveryMoving} | 지연 ${DELAYED.length}` },
          { label: "회수 예정 (건)", value: num(d.pickups), sub: `이동 중 ${pickupMoving}` },
          { label: "이용 중 (건)", value: num(d.inUse), sub: `회수 요청 ${RESERVATIONS.filter((r) => r.status === "회수 요청").length}건 별도` },
          { label: "미배차 (건)", value: num(d.unassigned), tone: "act", sub: `가장 이른 ${UNASSIGNED[0]?.window.slice(0, 5)}`, onClick: () => go("dispatch") },
          { label: "반납 확인 필요 (벌)", value: num(d.inspection), tone: "act", sub: "검수 대기", onClick: () => go("inspection") },
        ]}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel className="p-6">
          <SectionTitle
            aside={
              <span className="flex items-center gap-4">
                <Legend color="var(--dd-ink)" label="배송" />
                <Legend color="var(--dd-muted-soft)" label="회수" />
              </span>
            }
          >
            오늘 시간대별 배송, 회수 (건)
          </SectionTitle>
          <div className="mt-6">
            <HourlyChart />
          </div>
          <dl className="mt-6 grid grid-cols-3 divide-x divide-[var(--dd-hairline)] border-t border-[var(--dd-hairline)] pt-4">
            {[
              ["오늘 전체 (건)", TODAY_JOBS.length],
              ["완료 (건)", TODAY_JOBS.filter((j) => j.state === "완료").length],
              ["남은 작업 (건)", TODAY_JOBS.filter((j) => j.state !== "완료").length],
            ].map(([k, v]) => (
              <div key={k} className="px-4 first:pl-0">
                <dt className="text-[12px] text-[var(--dd-muted)]">{k}</dt>
                <dd className="dd-num mt-0.5 text-[18px] font-semibold text-[var(--dd-ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <section>
          <SectionTitle aside={<span className="dd-num text-[13px] text-[var(--dd-muted)]">{queue.length}건</span>}>지금 조치할 것</SectionTitle>
          <ul className="mt-3 divide-y divide-[var(--dd-hairline-soft)] border-y border-[var(--dd-hairline)]">
            {queue.map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.key} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--dd-soft)] text-[var(--dd-ink)]">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="dd-num truncate text-[14px] font-semibold leading-5 text-[var(--dd-ink)]">{q.title}</p>
                      <Badge tone={q.badge.tone}>{q.badge.label}</Badge>
                    </div>
                    <p className="dd-num mt-0.5 truncate text-[12px] leading-4 text-[var(--dd-muted)]" title={q.meta}>
                      {q.meta}
                    </p>
                  </div>
                  <Button size="sm" variant={q.action === "배정" ? "ink" : "secondary"} onClick={q.onClick}>
                    {q.action}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <Panel tone="soft" className="p-6">
          <p className="text-[13px] text-[var(--dd-muted)]">이번 주 매출 (원)</p>
          <p className="dd-num mt-1 text-[28px] font-semibold leading-9 text-[var(--dd-ink)]">{num(weekSum)}</p>
          <p className="dd-num mt-0.5 text-[12px] text-[var(--dd-muted)]">
            월~목 지난주 대비{" "}
            <span className="font-semibold" style={{ color: diff >= 0 ? "var(--dd-done-fg)" : "var(--dd-error)" }}>
              {diff >= 0 ? "+" : "−"}
              {Math.abs(diff).toFixed(1)}%
            </span>
          </p>
          <div className="mt-6">
            <ColumnChart
              height={120}
              highlight={4}
              format={(v) => num(v)}
              data={week.map((w, i) => ({ label: `${WEEK_LABEL[i]} ${w.date.slice(3).replace(/^0/, "")}`, value: w.value, muted: w.partial }))}
            />
          </div>
        </Panel>

        <section>
          <SectionTitle
            aside={
              <button type="button" onClick={() => go("dispatch")} className="dd-press inline-flex items-center gap-1 text-[13px] font-medium text-[var(--dd-ink)]">
                배송 및 회수 관리 <ArrowRight size={14} />
              </button>
            }
          >
            이동 중인 라이더
          </SectionTitle>
          <div className="mt-3">
            <TableWrap minWidth={640}>
              <thead>
                <tr>
                  <Th>작업</Th>
                  <Th>라이더</Th>
                  <Th>고객, 지역</Th>
                  <Th>시간대</Th>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {moving.map((j) => (
                  <tr key={j.jobId}>
                    <Td>
                      <span className="dd-code text-[var(--dd-ink)]">{j.jobId}</span>
                      <span className="block text-[12px] text-[var(--dd-muted)]">{j.kind}</span>
                    </Td>
                    <Td>
                      <span className="text-[var(--dd-ink)]">{getRider(j.riderId)?.name}</span>
                      <span className="dd-num block text-[12px] text-[var(--dd-muted)]">{j.departedAt} 출발</span>
                    </Td>
                    <Td>
                      <span className="text-[var(--dd-ink)]">{getCustomer(j.reservation.customerId)?.name}</span>
                      <span className="block text-[12px] text-[var(--dd-muted)]">{j.reservation.gu}</span>
                    </Td>
                    <Td className="dd-num whitespace-nowrap">{j.window}</Td>
                    <Td>
                      <Badge tone={JOB_TONE[j.state]} dot={j.state === "이동 중"}>
                        {j.state}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </div>
        </section>
      </div>
    </div>
  );
}
