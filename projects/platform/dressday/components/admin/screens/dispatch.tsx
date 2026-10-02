"use client";

import { useState } from "react";
import { Check, MapPin, Warning } from "@phosphor-icons/react";
import {
  DELAYED,
  JOB_TONE,
  NOW,
  RIDERS,
  TODAY_JOBS,
  UNASSIGNED,
  getCustomer,
  getJob,
  getRider,
  riderJobs,
  riderStatus,
  RIDER_TONE,
  type Job,
  type JobState,
} from "@/projects/platform/dressday/lib/admin-data";
import { getProduct } from "@/projects/platform/dressday/lib/catalog";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Meter,
  PageHead,
  Pagination,
  ProductThumb,
  SectionTitle,
  Segmented,
  TableWrap,
  Tabs,
  Td,
  Th,
  toneFg,
} from "@/projects/platform/dressday/components/admin/admin-ui";

type KindFilter = "전체" | "배송" | "회수";
const SLOTS = [
  [10, 12],
  [12, 14],
  [14, 16],
  [16, 18],
  [18, 20],
  [20, 22],
] as const;
const STATE_ORDER: JobState[] = ["배차 대기", "배정", "이동 중", "지연", "완료"];
const CAPACITY = 6;
const SLOT_PAGE = 12;

function AssignDrawer({ job, onClose }: { job: Job; onClose: () => void }) {
  const r = job.reservation;
  const c = getCustomer(r.customerId);
  const p = getProduct(r.productId);
  const candidates = RIDERS.filter((x) => !x.off)
    .map((x) => ({ rider: x, local: x.zones.includes(r.gu), load: riderJobs(x.id).filter((j) => j.state !== "완료").length }))
    .sort((a, b) => Number(b.local) - Number(a.local) || a.load - b.load);
  const [pick, setPick] = useState(candidates[0]?.rider.id);

  return (
    <Drawer
      open
      onClose={onClose}
      width={520}
      title={
        <span className="flex items-center gap-3">
          <span>라이더 배정</span>
          <span className="dd-code text-[15px] font-normal text-[var(--dd-muted)]">{job.jobId}</span>
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" disabled={!pick}>
            배정
          </Button>
        </>
      }
    >
      <section className="flex gap-4 rounded-[14px] bg-[var(--dd-soft)] p-4">
        <ProductThumb product={p} size={56} />
        <div className="min-w-0 text-[14px] leading-5">
          <p className="font-semibold text-[var(--dd-ink)]">
            {c?.name} <span className="dd-num font-normal text-[var(--dd-muted)]">{c?.phone}</span>
          </p>
          <p className="mt-1 flex items-start gap-1 text-[var(--dd-body)]">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--dd-muted)]" />
            서울 {r.gu} {r.address}
          </p>
          <p className="mt-1 text-[13px] text-[var(--dd-muted)]">
            {p.name} {r.size} | <span className="dd-code">{r.unit}</span> | <span className="dd-code">{r.id}</span>
          </p>
        </div>
      </section>

      <div className="mt-6">
        <SectionTitle aside={<span className="text-[13px] text-[var(--dd-muted)]">남은 작업 적은 순</span>}>배정 가능 라이더</SectionTitle>
        <ul className="mt-3 space-y-2" role="radiogroup" aria-label="라이더 선택">
          {candidates.map(({ rider, local, load }) => {
            const on = pick === rider.id;
            const next = riderJobs(rider.id).find((j) => j.state === "배정" || j.state === "이동 중");
            return (
              <li key={rider.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPick(rider.id)}
                  className={`dd-press flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left ${
                    on ? "border-2 border-[var(--dd-ink)] px-[15px] py-[11px]" : "border border-[var(--dd-hairline)]"
                  }`}
                >
                  <Avatar name={rider.name} size={36} dark={on} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[var(--dd-ink)]">{rider.name}</span>
                      {local ? <Badge tone="done">담당 지역</Badge> : <Badge tone="wait">지역 외</Badge>}
                    </span>
                    <span className="dd-num mt-0.5 block truncate text-[12px] text-[var(--dd-muted)]">
                      {rider.zones.join(", ")} | {rider.shift} | 다음 {next ? `${next.window.slice(0, 5)} ${next.kind}` : "작업 없음"}
                    </span>
                  </span>
                  <span className="w-[72px] shrink-0 text-right">
                    <span className="dd-num block text-[14px] font-semibold text-[var(--dd-ink)]">
                      {load} / {CAPACITY}
                    </span>
                    <span className="mt-1 block">
                      <Meter value={load} max={CAPACITY} tone="ink" />
                    </span>
                  </span>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${on ? "bg-[var(--dd-ink)] text-white" : "border border-[var(--dd-border-strong)]"}`}>
                    {on && <Check size={12} weight="bold" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Drawer>
  );
}

export function Dispatch({ assign }: { assign?: string }) {
  const [kind, setKind] = useState<KindFilter>("전체");
  const [assignId, setAssignId] = useState<string | null>(getJob(assign)?.jobId ?? null);
  const assignJob = getJob(assignId);

  const jobs = TODAY_JOBS.filter((j) => kind === "전체" || j.kind === kind);
  const byState = STATE_ORDER.map((s) => ({ s, n: TODAY_JOBS.filter((j) => j.state === s).length }));

  // 시간대 탭: 남은 작업은 시작 시각 기준 2시간 묶음, 끝난 작업은 "완료" 탭 하나로
  const nowHour = Math.floor(NOW.minutes / 60);
  const slotTabs = [
    ...SLOTS.map(([from, to]) => {
      const rows = jobs.filter((j) => {
        const h = Number(j.window.slice(0, 2));
        return j.state !== "완료" && h >= from && h < to;
      });
      const current = nowHour >= from && nowHour < to;
      return { key: `${from}`, label: `${current ? "지금 " : ""}${from}:00~${to}:00`, rows, current };
    }).filter((t) => t.rows.length > 0 || t.current),
    { key: "done", label: "완료", rows: jobs.filter((j) => j.state === "완료"), current: false },
  ];
  const [slotTab, setSlotTab] = useState(() => slotTabs.find((t) => t.current)?.key ?? slotTabs[0].key);
  const [slotPage, setSlotPage] = useState(1);
  const activeSlot = slotTabs.find((t) => t.key === slotTab) ?? slotTabs[0];
  const slotRows = activeSlot.rows.slice((slotPage - 1) * SLOT_PAGE, slotPage * SLOT_PAGE);

  return (
    <div className="space-y-7">
      <PageHead
        title="배송 및 회수 관리"
        actions={
          <Segmented<KindFilter>
            value={kind}
            onChange={setKind}
            items={[
              { key: "전체", label: "전체" },
              { key: "배송", label: "배송" },
              { key: "회수", label: "회수" },
            ]}
          />
        }
      />

      {/* 상태 분포: 한 줄 비율 막대 */}
      <div>
        <div className="flex h-2 overflow-hidden rounded-full">
          {byState.map(({ s, n }) => (
            <span key={s} style={{ width: `${(n / TODAY_JOBS.length) * 100}%`, background: s === "완료" ? "var(--dd-hairline)" : toneFg(JOB_TONE[s]) }} />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {byState.map(({ s, n }) => (
            <li key={s} className="flex items-center gap-2 text-[13px]">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: s === "완료" ? "var(--dd-border-strong)" : toneFg(JOB_TONE[s]) }} />
              <span className="text-[var(--dd-muted)]">{s}</span>
              <span className="dd-num font-semibold text-[var(--dd-ink)]">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          {/* 미배차 큐 */}
          <section className="rounded-[14px] bg-[var(--dd-act-bg)] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-semibold text-[var(--dd-act-fg)]">미배차 {UNASSIGNED.length}건</h2>
              <Button size="sm" variant="secondary">
                지역 기준 자동 배정
              </Button>
            </div>
            <ul className="mt-3 divide-y divide-[rgba(133,84,0,0.14)]">
              {UNASSIGNED.map((j) => {
                const c = getCustomer(j.reservation.customerId);
                return (
                  <li key={j.jobId} className="flex items-center gap-4 py-2.5">
                    <span className="dd-num w-[92px] shrink-0 text-[14px] font-semibold text-[var(--dd-ink)]">{j.window}</span>
                    <span className="w-10 shrink-0 text-[13px] text-[var(--dd-body)]">{j.kind}</span>
                    <span className="min-w-0 flex-1 truncate text-[14px] text-[var(--dd-ink)]">
                      {c?.name} <span className="text-[var(--dd-muted)]">| {j.reservation.gu} {j.reservation.address}</span>
                    </span>
                    <span className="dd-code hidden shrink-0 text-[13px] text-[var(--dd-muted)] sm:inline">{j.jobId}</span>
                    <Button size="sm" variant="ink" onClick={() => setAssignId(j.jobId)}>
                      배정
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 시간대별 작업 */}
          <section>
            <SectionTitle>시간대별 작업</SectionTitle>
            <div className="mt-3">
              <Tabs<string>
                value={slotTab}
                onChange={(k) => {
                  setSlotTab(k);
                  setSlotPage(1);
                }}
                items={slotTabs.map((t) => ({ key: t.key, label: t.label, count: t.rows.length }))}
              />
              <TableWrap minWidth={640}>
                <thead>
                  <tr>
                    <Th>작업</Th>
                    <Th>시간대</Th>
                    <Th>고객, 주소, 상품</Th>
                    <Th>라이더</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {slotRows.map((j) => {
                    const c = getCustomer(j.reservation.customerId);
                    const rider = getRider(j.riderId);
                    const p = getProduct(j.reservation.productId);
                    return (
                      <tr key={j.jobId}>
                        <Td>
                          <span className="dd-code text-[var(--dd-ink)]">{j.jobId}</span>
                          <span className="block text-[12px] text-[var(--dd-muted)]">{j.kind}</span>
                        </Td>
                        <Td className="dd-num whitespace-nowrap">{j.window}</Td>
                        <Td>
                          <span className="text-[var(--dd-ink)]">{c?.name}</span>
                          <span className="block max-w-[280px] truncate text-[12px] text-[var(--dd-muted)]" title={`${j.reservation.gu} ${j.reservation.address}`}>
                            {j.reservation.gu} {j.reservation.address}
                          </span>
                          <span className="block max-w-[280px] truncate text-[12px] text-[var(--dd-muted)]" title={p.name}>
                            {p.name} {j.reservation.size} | <span className="dd-code">{j.reservation.unit}</span>
                          </span>
                        </Td>
                        <Td>
                          {rider ? (
                            <>
                              <span className="text-[var(--dd-ink)]">{rider.name}</span>
                              <span className="dd-num block text-[12px] text-[var(--dd-muted)]">
                                {j.doneAt ? `${j.doneAt} 완료` : j.departedAt ? `${j.departedAt} 출발` : `${j.assignedAt ?? ""} 배정`}
                              </span>
                            </>
                          ) : (
                            <Button size="sm" variant="ink" onClick={() => setAssignId(j.jobId)}>
                              배정
                            </Button>
                          )}
                        </Td>
                        <Td className="w-[96px]">
                          <Badge tone={JOB_TONE[j.state]} dot={j.state === "이동 중"}>
                            {j.state}
                          </Badge>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableWrap>
              <Pagination page={slotPage} pageSize={SLOT_PAGE} total={activeSlot.rows.length} onChange={setSlotPage} />
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section>
            <SectionTitle>지연 및 이슈</SectionTitle>
            <ul className="mt-3 space-y-3">
              {DELAYED.map((j) => {
                const c = getCustomer(j.reservation.customerId);
                const rider = getRider(j.riderId);
                return (
                  <li key={j.jobId} className="rounded-[14px] border border-[var(--dd-hairline)] p-4">
                    <div className="flex items-center gap-2">
                      <Warning size={16} weight="fill" className="text-[var(--dd-error)]" />
                      <span className="dd-code text-[14px] font-semibold text-[var(--dd-ink)]">{j.jobId}</span>
                      <Badge tone="stop">지연</Badge>
                      <span className="dd-num ml-auto text-[12px] text-[var(--dd-muted)]">{j.window}</span>
                    </div>
                    <p className="mt-2 text-[14px] leading-5 text-[var(--dd-ink)]">{j.issue}</p>
                    <p className="mt-1 text-[12px] leading-4 text-[var(--dd-muted)]">
                      {j.kind} | {c?.name} | {j.reservation.gu} | 라이더 {rider?.name}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary">
                        고객 안내
                      </Button>
                      <Button size="sm" variant="ghost">
                        라이더 연락
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <SectionTitle aside={<span className="text-[12px] text-[var(--dd-muted)]">남은 작업 / 한도</span>}>배차 현황</SectionTitle>
            <ul className="mt-3 divide-y divide-[var(--dd-hairline-soft)] border-t border-[var(--dd-hairline)]">
              {RIDERS.map((r) => {
                const all = riderJobs(r.id);
                const left = all.filter((j) => j.state !== "완료").length;
                const st = riderStatus(r);
                return (
                  <li key={r.id} className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[var(--dd-ink)]">{r.name}</span>
                      <span className="truncate text-[12px] text-[var(--dd-muted)]">{r.zones.join(", ")}</span>
                      <span className="ml-auto">
                        <Badge tone={RIDER_TONE[st]}>{st}</Badge>
                      </span>
                    </div>
                    {!r.off && (
                      <div className="mt-2 flex items-center gap-3">
                        <span className="flex-1">
                          <Meter value={left} max={CAPACITY} tone="ink" />
                        </span>
                        <span className="dd-num w-12 text-right text-[12px] text-[var(--dd-body)]">
                          {left} / {CAPACITY}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      {assignJob && <AssignDrawer key={assignJob.jobId} job={assignJob} onClose={() => setAssignId(null)} />}
    </div>
  );
}
