"use client";

import { useState } from "react";
import { Phone, Plus } from "@phosphor-icons/react";
import {
  JOB_TONE,
  RIDERS,
  RIDER_TONE,
  WEEK_DAYS,
  getCustomer,
  getRider,
  riderJobs,
  riderStatus,
  short,
} from "@/projects/platform/dressday/lib/admin-data";
import { num } from "@/projects/platform/dressday/lib/catalog";
import {
  Avatar,
  Badge,
  Button,
  ColumnChart,
  PageHead,
  Panel,
  SectionTitle,
  TableWrap,
  Td,
  Th,
  rowClass,
} from "@/projects/platform/dressday/components/admin/admin-ui";

function RiderDetail({ id }: { id: string }) {
  const r = getRider(id) ?? RIDERS[0];
  const jobs = riderJobs(r.id);
  const st = riderStatus(r);
  const weekTotal = r.week.reduce((a, b) => a + b, 0);
  const todayDone = jobs.filter((j) => j.state === "완료").length;

  return (
    <Panel className="p-6">
      <div className="flex items-start gap-4">
        <Avatar name={r.name} size={48} dark />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold leading-7 text-[var(--dd-ink)]">{r.name}</h2>
            <Badge tone={RIDER_TONE[st]} dot={st === "운행 중"}>
              {st}
            </Badge>
          </div>
          <p className="dd-num text-[13px] leading-5 text-[var(--dd-muted)]">
            {r.phone} | {r.vehicle}
          </p>
          <p className="text-[13px] leading-5 text-[var(--dd-muted)]">
            {r.zones.join(", ")} | {r.shift}
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={<Phone size={14} />}>
          연락
        </Button>
      </div>

      <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--dd-hairline)] border-y border-[var(--dd-hairline)] py-4">
        {[
          ["누적 완료 (건)", num(r.lifetime)],
          ["최근 6일 (건)", num(weekTotal)],
          ["이번 달 지연 (건)", num(r.monthDelays)],
        ].map(([k, v]) => (
          <div key={k} className="px-4 first:pl-0">
            <dt className="text-[12px] text-[var(--dd-muted)]">{k}</dt>
            <dd className="dd-num mt-0.5 text-[20px] font-semibold text-[var(--dd-ink)]">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <SectionTitle aside={<span className="dd-num text-[13px] text-[var(--dd-muted)]">완료 {todayDone} / {jobs.length}</span>}>오늘 업무</SectionTitle>
        {jobs.length === 0 ? (
          <p className="mt-3 rounded-[12px] bg-[var(--dd-soft)] px-4 py-5 text-[14px] text-[var(--dd-muted)]">오늘은 휴무입니다. 다음 근무 9/19 (토) 10:00</p>
        ) : (
          <ol className="relative mt-3 space-y-0 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-[var(--dd-hairline)]">
            {jobs.map((j) => (
              <li key={j.jobId} className="relative flex items-start gap-3 py-2.5 pl-6">
                <span
                  aria-hidden
                  className="absolute left-0 top-[15px] h-[11px] w-[11px] rounded-full border-2 border-white"
                  style={{ background: j.state === "완료" ? "var(--dd-border-strong)" : `var(--dd-${JOB_TONE[j.state]}-fg)` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[14px] leading-5 text-[var(--dd-ink)]">
                    <span className="dd-num font-semibold">{j.window}</span>
                    <span>{j.kind}</span>
                    <span className="truncate text-[var(--dd-muted)]">
                      {getCustomer(j.reservation.customerId)?.name} | {j.reservation.gu}
                    </span>
                  </p>
                  <p className="dd-num mt-0.5 text-[12px] leading-4 text-[var(--dd-muted)]">
                    <span className="dd-code">{j.jobId}</span>
                    {j.doneAt ? ` | ${j.doneAt} 완료` : j.departedAt ? ` | ${j.departedAt} 출발` : j.assignedAt ? ` | ${j.assignedAt} 배정` : ""}
                    {j.issue ? ` | ${j.issue}` : ""}
                  </p>
                </div>
                <Badge tone={JOB_TONE[j.state]}>{j.state}</Badge>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-6">
        <SectionTitle>최근 6일 처리 (건)</SectionTitle>
        <div className="mt-4">
          <ColumnChart
            height={96}
            highlight={r.week.indexOf(Math.max(...r.week))}
            format={(v) => String(v)}
            data={r.week.map((v, i) => ({ label: v === 0 ? `${short(WEEK_DAYS[i])} 휴무` : short(WEEK_DAYS[i]), value: v }))}
          />
        </div>
      </div>
    </Panel>
  );
}

export function Riders({ rider }: { rider?: string }) {
  const [selected, setSelected] = useState(getRider(rider)?.id ?? "r4");

  return (
    <div className="space-y-6">
      <PageHead
        title="라이더 관리"
        actions={
          <Button variant="ink" icon={<Plus size={16} />}>
            라이더 등록
          </Button>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <TableWrap minWidth={600}>
            <thead>
              <tr>
                <Th>라이더</Th>
                <Th>담당 지역, 근무 시간</Th>
                <Th>차량</Th>
                <Th align="right">완료 / 배정 (건)</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {RIDERS.map((r) => {
                const jobs = riderJobs(r.id);
                const st = riderStatus(r);
                return (
                  <tr key={r.id} className={rowClass(r.id === selected)} onClick={() => setSelected(r.id)}>
                    <Td>
                      <span className="flex items-center gap-3">
                        <Avatar name={r.name} size={32} dark={r.id === selected} />
                        <span>
                          <button type="button" onClick={() => setSelected(r.id)} className="block font-medium text-[var(--dd-ink)]">
                            {r.name}
                          </button>
                          <span className="dd-num block text-[12px] text-[var(--dd-muted)]">{r.phone}</span>
                        </span>
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      {r.zones.join(", ")}
                      <span className="dd-num block text-[12px] text-[var(--dd-muted)]">{r.shift}</span>
                    </Td>
                    <Td className="whitespace-nowrap">{r.vehicle}</Td>
                    <Td align="right">
                      {jobs.filter((j) => j.state === "완료").length} / {jobs.length}
                    </Td>
                    <Td className="w-[88px]">
                      <Badge tone={RIDER_TONE[st]} dot={st === "운행 중"}>
                        {st}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
          <p className="dd-num pt-4 text-[13px] text-[var(--dd-muted)]">
            1–{RIDERS.length} / {RIDERS.length}
          </p>
        </div>

        <RiderDetail key={selected} id={selected} />
      </div>
    </div>
  );
}
