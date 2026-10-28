"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Circle,
  DownloadSimple,
  FileText,
  Headset,
  Receipt as ReceiptIcon,
  UploadSimple,
} from "@phosphor-icons/react";
import {
  AGENT,
  CONFIRMED,
  CUSTOMER,
  FILING,
  FILING_RECORDS,
  NEXT_SCHEDULE,
  PAYMENTS,
  SUPPLEMENT,
  TIMELINE,
  won,
  type FilingRecord,
} from "@/projects/monitoring/taxdesk/lib/mock-data";
import { FILING_TONE, PAYMENT_TONE } from "@/projects/monitoring/taxdesk/lib/status";
import type { SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { Button, Container, Monogram } from "@/projects/monitoring/taxdesk/components/site/ui";

export type StatusState = "supplement" | "done";

const payable = (r: FilingRecord) => r.salesTax - r.purchaseTax - r.credit;

function Timeline({ items }: { items: typeof TIMELINE }) {
  const lastIdx = items.reduce((acc, t, i) => (t.at ? i : acc), -1);
  return (
    <ol>
      {items.map((t, i) => {
        const reached = Boolean(t.at);
        const current = i === lastIdx;
        return (
          <li key={t.stage} className="relative flex gap-4 pb-5 last:pb-0">
            {i < items.length - 1 && (
              <span
                className={`absolute left-[10px] top-6 h-[calc(100%-20px)] w-px ${
                  i < lastIdx ? "bg-[var(--td-ink)]" : "bg-[var(--td-line)]"
                }`}
              />
            )}
            {reached ? (
              current ? (
                <span className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--td-blue)] bg-white">
                  <span className="h-2 w-2 rounded-full bg-[var(--td-blue)]" />
                </span>
              ) : (
                <CheckCircle size={21} weight="fill" className="shrink-0 text-[var(--td-ink)]" />
              )
            ) : (
              <Circle size={21} className="shrink-0 text-[#c7c7cc]" />
            )}
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3">
              <div className="min-w-0">
                <p className={`text-[15px] ${reached ? "font-semibold" : "text-[var(--td-ink-3)]"}`}>{t.stage}</p>
                {t.note && <p className="text-[13px] text-[var(--td-ink-3)]">{t.note}</p>}
              </div>
              {t.at && <span className="shrink-0 text-[13px] text-[var(--td-ink-3)]">{t.at}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--td-line)] py-6 first:border-t-0 first:pt-0">
      <h2 className="text-[17px] font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function NextSchedule() {
  return (
    <div className="flex gap-3">
      <CalendarBlank size={22} className="shrink-0" />
      <div className="min-w-0">
        <p className="text-[15px] font-semibold">{NEXT_SCHEDULE.title}</p>
        <p className="text-[14px] text-[var(--td-ink-2)]">신고 기한 {NEXT_SCHEDULE.deadline}</p>
        <p className="mt-1 text-[13px] leading-[19px] text-[var(--td-ink-3)]">{NEXT_SCHEDULE.note}</p>
      </div>
    </div>
  );
}

export function StatusScreen({
  state,
  initialFiling,
  onNavigate,
}: {
  state: StatusState;
  initialFiling: string | null;
  onNavigate: (s: SiteScreen) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(
    FILING_RECORDS.some((r) => r.id === initialFiling) ? initialFiling : null,
  );

  function open(id: string | null) {
    setOpenId(id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  const record = FILING_RECORDS.find((r) => r.id === openId);
  if (!record) return <StatusList state={state} onOpen={open} />;
  return <StatusDetail record={record} state={state} onBack={() => open(null)} onNavigate={onNavigate} />;
}

function StatusList({ state, onOpen }: { state: StatusState; onOpen: (id: string) => void }) {
  return (
    <div className="pb-16">
      <Container className="pt-8 lg:pt-12">
        <h1 className="text-[24px] font-semibold leading-[32px] md:text-[32px] md:leading-[40px]">신고 현황</h1>
        <p className="mt-1 text-[15px] text-[var(--td-ink-3)]">
          {CUSTOMER.business} | 신청 {FILING_RECORDS.length}건
        </p>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <ul className="min-w-0 border-t border-[var(--td-ink)]">
            {FILING_RECORDS.map((r) => {
              const inProgress = r.id === FILING.id && state === "supplement";
              const stage = inProgress ? "보완 요청" : "접수 완료";
              return (
                <li key={r.id} className="border-b border-[var(--td-line)]">
                  <button
                    type="button"
                    onClick={() => onOpen(r.id)}
                    className="flex w-full items-center gap-4 px-1 py-5 text-left hover:bg-[var(--td-parch)] md:px-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <StatusChip tone={FILING_TONE[stage]} compact>
                          {stage}
                        </StatusChip>
                        <p className="text-[17px] font-semibold">
                          {r.period} 부가가치세 {r.kind}
                        </p>
                      </div>
                      <p className="mt-1.5 text-[14px] text-[var(--td-ink-3)]">
                        신청번호 <span className="td-mono">{r.id}</span>
                        <span className="whitespace-nowrap"> | 신청 {r.receivedAt.slice(0, 10)}</span>
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      {inProgress ? (
                        <>
                          <p className="text-[13px] text-[var(--td-ink-3)]">보완 기한</p>
                          <p className="mt-0.5 text-[15px] font-semibold text-[var(--td-act-fg)]">{SUPPLEMENT.dueAt}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[13px] text-[var(--td-ink-3)]">납부 세액</p>
                          <p className="mt-0.5 text-[15px] font-semibold">{won(payable(r))}원</p>
                        </>
                      )}
                    </div>
                    <CaretRight size={18} className="shrink-0 text-[var(--td-ink-3)]" />
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="min-w-0">
            <SideBlock title="다음 신고 일정">
              <NextSchedule />
            </SideBlock>
          </aside>
        </div>
      </Container>
    </div>
  );
}

function StatusDetail({
  record,
  state,
  onBack,
  onNavigate,
}: {
  record: FilingRecord;
  state: StatusState;
  onBack: () => void;
  onNavigate: (s: SiteScreen) => void;
}) {
  const isCurrent = record.id === FILING.id;
  const done = !isCurrent || state === "done";
  const stage = done ? "접수 완료" : "보완 요청";
  const payments = PAYMENTS.filter((p) => p.item.startsWith(record.period));

  return (
    <div className="pb-16">
      <Container className="pt-6 lg:pt-10">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 flex h-9 items-center gap-1 text-[14px] text-[var(--td-ink-3)] hover:text-[var(--td-ink)]"
        >
          <CaretLeft size={16} />
          신고 현황
        </button>
        <div className="mt-2">
          <h1 className="text-[24px] font-semibold leading-[32px] md:text-[32px] md:leading-[40px]">
            {record.period} 부가가치세 {record.kind}
          </h1>
          <p className="mt-1 text-[15px] text-[var(--td-ink-3)]">
            {CUSTOMER.business} | {record.range}{" "}
            <span className="whitespace-nowrap">
              | 신청번호 <span className="td-mono">{record.id}</span>
            </span>
          </p>
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="min-w-0">
            {/* 현재 단계 */}
            <section className="rounded-[16px] bg-[var(--td-parch)] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <StatusChip tone={FILING_TONE[stage]}>{stage}</StatusChip>
                <span className="text-[14px] text-[var(--td-ink-3)]">
                  {done ? record.doneAt : `신고 기한 ${FILING.deadline} | D-${FILING.dday}`}
                </span>
              </div>
              {done ? (
                <>
                  <h2 className="mt-4 text-[24px] font-semibold leading-[32px] md:text-[28px] md:leading-[36px]">
                    홈택스에 신고가 접수됐어요
                  </h2>
                  <p className="mt-2 text-[15px] text-[var(--td-ink-2)]">
                    접수번호 <span className="td-mono">{record.receiptNo}</span>
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-y-5 border-t border-[var(--td-line)] pt-6 sm:grid-cols-4 sm:divide-x sm:divide-[var(--td-line)]">
                    <div className="sm:pr-5">
                      <dt className="text-[12px] text-[var(--td-ink-3)]">매출세액 (원)</dt>
                      <dd className="mt-1 text-[17px] font-semibold">{won(record.salesTax)}</dd>
                    </div>
                    <div className="sm:px-5">
                      <dt className="text-[12px] text-[var(--td-ink-3)]">매입세액 (원)</dt>
                      <dd className="mt-1 text-[17px] font-semibold">{won(record.purchaseTax)}</dd>
                    </div>
                    <div className="sm:px-5">
                      <dt className="text-[12px] text-[var(--td-ink-3)]">카드발행 공제 (원)</dt>
                      <dd className="mt-1 text-[17px] font-semibold">{won(record.credit)}</dd>
                    </div>
                    <div className="sm:pl-5">
                      <dt className="text-[12px] text-[var(--td-ink-3)]">{isCurrent ? "납부 예정액" : "납부 세액"} (원)</dt>
                      <dd className="mt-1 text-[21px] font-bold text-[var(--td-blue)]">{won(payable(record))}</dd>
                    </div>
                  </dl>
                  <p className="mt-5 text-[14px] text-[var(--td-ink-2)]">
                    {isCurrent ? `납부 기한 ${record.payDue} | ${CONFIRMED.payAccount}` : `${record.payDue}까지 납부 완료`}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--td-ink-3)]">
                    세액은 {AGENT.name} 세무사가 확정했어요 ({record.confirmedAt})
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-[24px] font-semibold leading-[32px] md:text-[28px] md:leading-[36px]">
                    보완 자료를 올려 주세요
                  </h2>
                  <div className="mt-5 flex gap-3">
                    <Monogram text={AGENT.initial} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold">
                        {SUPPLEMENT.by} <span className="font-normal text-[var(--td-ink-3)]">{SUPPLEMENT.requestedAt}</span>
                      </p>
                      <p className="mt-1 text-[15px] leading-[23px] text-[var(--td-ink-2)]">{SUPPLEMENT.message}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {SUPPLEMENT.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5 rounded-[12px] bg-white px-4 py-3 text-[15px]">
                        <FileText size={18} className="shrink-0 text-[var(--td-ink-3)]" />
                        <span className="min-w-0 flex-1">{it}</span>
                        <span className="shrink-0 text-[13px] text-[var(--td-act-fg)]">미제출</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#c7c7cc] bg-white py-6 text-center">
                    <UploadSimple size={22} className="text-[var(--td-ink-3)]" />
                    <p className="text-[14px] text-[var(--td-ink-2)]">PDF, 엑셀, 사진 | 파일당 20MB까지</p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[14px] text-[var(--td-ink-3)]">보완 기한 {SUPPLEMENT.dueAt}</p>
                    <Button onClick={() => onNavigate("documents")}>
                      추가 업로드
                      <ArrowRight size={16} weight="bold" />
                    </Button>
                  </div>
                </>
              )}
            </section>

            <section className="mt-10">
              <h2 className="text-[17px] font-semibold">진행 단계</h2>
              <div className="mt-5">
                <Timeline items={done ? record.timeline : TIMELINE} />
              </div>
            </section>

            {/* 기장대리 상담 */}
            <section className="mt-10 flex flex-col gap-5 rounded-[16px] bg-[var(--td-ink)] p-6 text-white sm:flex-row sm:items-center md:p-8">
              <Headset size={32} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[19px] font-semibold">다음 신고부터는 기장까지 맡겨 보세요</p>
                <p className="mt-1 text-[14px] leading-[20px] text-[#c7c7cc]">
                  {AGENT.office}가 매달 장부를 정리하고 부가세, 종합소득세 신고를 이어서 해요. 월 99,000원부터.
                </p>
              </div>
              <button
                type="button"
                className="td-press h-11 shrink-0 rounded-full bg-white px-5 text-[15px] font-semibold text-[var(--td-ink)]"
              >
                기장대리 상담 신청
              </button>
            </section>
          </div>

          <aside className="min-w-0">
            <SideBlock title="서류">
              <ul className="divide-y divide-[var(--td-line-soft)]">
                {[
                  { t: "신고대리 의뢰 내역서", d: `${record.receivedAt.slice(0, 10)} 접수 | PDF`, on: true },
                  { t: "신고 접수증", d: done ? `${record.doneAt.slice(0, 10)} 발급 | PDF` : "접수 완료 후 발급", on: done },
                  { t: "부가가치세 신고서", d: done ? "확정본 | PDF 4쪽" : "세무사 확정 후 발급", on: done },
                ].map((x) => (
                  <li key={x.t} className="flex items-center gap-3 py-3 first:pt-0">
                    <ReceiptIcon size={20} className={`shrink-0 ${x.on ? "" : "text-[#c7c7cc]"}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[15px] ${x.on ? "font-semibold" : "text-[var(--td-ink-3)]"}`}>{x.t}</p>
                      <p className="text-[13px] text-[var(--td-ink-3)]">{x.d}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!x.on}
                      aria-label={`${x.t} 다운로드`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--td-blue)] hover:bg-[var(--td-blue-tint)] disabled:text-[#c7c7cc] disabled:hover:bg-transparent"
                    >
                      <DownloadSimple size={19} />
                    </button>
                  </li>
                ))}
              </ul>
            </SideBlock>

            <SideBlock title="결제 내역">
              <ul className="space-y-4">
                {payments.map((p) => (
                  <li key={p.at} className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] leading-[21px]">{p.item}</p>
                      <p className="mt-0.5 text-[13px] text-[var(--td-ink-3)]">
                        {p.at} | {p.method}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="whitespace-nowrap text-[15px] font-semibold">{won(p.amount)}원</span>
                      <StatusChip tone={PAYMENT_TONE[p.state]} compact>
                        {p.state}
                      </StatusChip>
                    </div>
                  </li>
                ))}
              </ul>
            </SideBlock>

            {isCurrent && (
              <SideBlock title="다음 신고 일정">
                <NextSchedule />
              </SideBlock>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
