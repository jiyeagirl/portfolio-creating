"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bank,
  CheckCircle,
  Copy,
  CreditCard,
  DownloadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { AGENT, FEE, VIRTUAL_ACCOUNT, won } from "@/projects/monitoring/taxdesk/lib/mock-data";
import type { SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import {
  CUSTOMER_SUMMARY,
  RequestSummaryDocument,
} from "@/projects/monitoring/taxdesk/components/request-summary-document";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { FlowRail, FlowSteps } from "@/projects/monitoring/taxdesk/components/site/site-chrome";
import { Button, Container, Monogram } from "@/projects/monitoring/taxdesk/components/site/ui";

export type PayMethod = "card" | "vbank";
export type PayResult = "success" | "fail" | "pending" | null;

function Block({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--td-line)] py-6 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold">{title}</h2>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function AgentCard() {
  return (
    <div className="flex items-center gap-4">
      <Monogram text={AGENT.initial} size={52} />
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-semibold">
          {AGENT.name} {AGENT.title}
        </p>
        <p className="text-[14px] text-[var(--td-ink-2)]">
          {AGENT.office} | {AGENT.regNo}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-[var(--td-ink-3)]">{AGENT.career}</p>
      </div>
    </div>
  );
}

/** 결제 뒤에 일어나는 일. 아직 아무것도 시작되지 않았으니 진행 표시 없이 순서만 보여 준다 */
function AfterPayment() {
  const steps = [
    { t: "신고 의뢰 접수", d: "결제가 확인되면 바로 접수돼요" },
    { t: "세무사 자료 검토", d: "필요한 자료가 있으면 보완을 요청해요" },
    { t: "신고 내용 확정", d: `${AGENT.name} ${AGENT.title}가 최종 신고 내용을 확정해요` },
    { t: "신고, 접수증 발급", d: "결과와 접수증은 신고 현황에서 확인해요" },
  ];
  return (
    <ol>
      {steps.map((x, i) => (
        <li key={x.t} className="relative flex gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 && <span className="absolute left-[10px] top-6 h-[calc(100%-20px)] w-px bg-[var(--td-line)]" />}
          <span className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border border-[var(--td-line)] text-[11px] font-semibold text-[var(--td-ink-2)]">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold">{x.t}</p>
            <p className="text-[13px] text-[var(--td-ink-3)]">{x.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ConfirmCheck({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      aria-pressed={on}
      className="flex w-full items-start gap-3 rounded-[12px] bg-[var(--td-parch)] p-4 text-left"
    >
      <CheckCircle
        size={22}
        weight={on ? "fill" : "regular"}
        className={`mt-px shrink-0 ${on ? "text-[var(--td-blue)]" : "text-[#c7c7cc]"}`}
      />
      <span>
        <span className="block text-[15px] font-semibold">의뢰 내역을 확인했어요</span>
        <span className="mt-0.5 block text-[13px] leading-[19px] text-[var(--td-ink-3)]">
          사업자 정보, 신고 대상, 제출자료가 맞는지 확인해 주세요
        </span>
      </span>
    </button>
  );
}

function FeeBlock() {
  return (
    <dl className="space-y-2.5 text-[15px]">
      <div className="flex justify-between gap-4">
        <dt className="text-[var(--td-ink-2)]">기본료</dt>
        <dd className="whitespace-nowrap">{won(FEE.base)}원</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="min-w-0 text-[var(--td-ink-2)]">
          매출 구간 추가
          <span className="block text-[13px] text-[var(--td-ink-3)]">{FEE.salesTierLabel}</span>
        </dt>
        <dd className="whitespace-nowrap">{won(FEE.salesTier)}원</dd>
      </div>
      {FEE.options.map((o) => (
        <div key={o.label} className="flex justify-between gap-4">
          <dt className="text-[var(--td-ink-2)]">옵션 | {o.label}</dt>
          <dd className="whitespace-nowrap">{won(o.amount)}원</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-4 border-t border-[var(--td-line)] pt-3">
        <dt className="font-semibold">
          결제 금액 (원)
          <span className="block text-[12px] font-normal text-[var(--td-ink-3)]">부가세 포함</span>
        </dt>
        <dd className="text-[28px] font-bold leading-none">{won(FEE.total)}</dd>
      </div>
    </dl>
  );
}

function PayMethodBlock({ pay, setPay }: { pay: PayMethod; setPay: (p: PayMethod) => void }) {
  const opts = [
    { id: "card" as const, Icon: CreditCard, t: "신용카드", d: "결제 즉시 검토 시작" },
    { id: "vbank" as const, Icon: Bank, t: "무통장입금", d: "가상계좌 발급, 입금 확인 후 시작" },
  ];
  return (
    <div className="grid gap-2">
      {opts.map(({ id, Icon, t, d }) => {
        const on = pay === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setPay(id)}
            aria-pressed={on}
            className={`flex items-center gap-3 rounded-[12px] border p-4 text-left ${
              on ? "border-2 border-[var(--td-blue-focus)] bg-[var(--td-blue-tint)] p-[15px]" : "border-[var(--td-line)]"
            }`}
          >
            <Icon size={22} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{t}</span>
              <span className="block text-[13px] text-[var(--td-ink-3)]">{d}</span>
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                on ? "border-[var(--td-blue)]" : "border-[#c7c7cc]"
              }`}
            >
              {on && <span className="h-2.5 w-2.5 rounded-full bg-[var(--td-blue)]" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ResultDialog({
  result,
  onClose,
  onNavigate,
  onRetry,
}: {
  result: Exclude<PayResult, null>;
  onClose: () => void;
  onNavigate: (s: SiteScreen) => void;
  onRetry: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" aria-label="닫기" className="absolute inset-0" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-label="결제 결과"
        className="relative w-full rounded-t-[16px] bg-white px-6 pb-6 pt-7 md:max-w-[420px] md:rounded-[16px]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", visualDuration: 0.36, bounce: 0.08 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--td-parch)]"
        >
          <X size={20} />
        </button>

        {result === "success" && (
          <>
            <CheckCircle size={44} weight="fill" className="text-[var(--td-done-fg)]" />
            <h2 className="mt-4 text-[24px] font-semibold leading-[32px]">신고 의뢰가 접수됐어요</h2>
            <p className="mt-2 text-[15px] leading-[22px] text-[var(--td-ink-2)]">
              {AGENT.name} {AGENT.title}가 자료 검토를 시작해요. 진행 상황은 알림톡과 신고 현황에서 볼 수 있어요.
            </p>
            <dl className="mt-5 space-y-2 rounded-[12px] bg-[var(--td-parch)] p-4 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[var(--td-ink-3)]">결제 금액</dt>
                <dd className="font-semibold">{won(FEE.total)}원</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--td-ink-3)]">결제 수단</dt>
                <dd>J카드 (4417) 일시불</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--td-ink-3)]">승인 일시</dt>
                <dd>2026.01.08 14:43</dd>
              </div>
            </dl>
            <Button size="lg" className="mt-6 w-full" onClick={() => onNavigate("status")}>
              신고 현황 보기
            </Button>
          </>
        )}

        {result === "fail" && (
          <>
            <WarningCircle size={44} weight="fill" className="text-[var(--td-stop-fg)]" />
            <h2 className="mt-4 text-[24px] font-semibold leading-[32px]">결제하지 못했어요</h2>
            <p className="mt-2 text-[15px] leading-[22px] text-[var(--td-ink-2)]">
              카드사에서 승인을 거절했어요. 사유: 한도 초과 (J카드 4417). 다른 카드나 무통장입금으로 다시 시도해 주세요.
            </p>
            <p className="mt-4 text-[13px] text-[var(--td-ink-3)]">입력한 신청 정보와 올린 증빙은 그대로 저장돼 있어요.</p>
            <div className="mt-6 flex gap-2">
              <Button variant="ghost" size="lg" className="flex-1" onClick={onClose}>
                수단 바꾸기
              </Button>
              <Button size="lg" className="flex-1" onClick={onRetry}>
                다시 결제
              </Button>
            </div>
          </>
        )}

        {result === "pending" && (
          <>
            <div className="flex items-center gap-2">
              <StatusChip tone="wait">입금 대기</StatusChip>
              <span className="text-[13px] text-[var(--td-ink-3)]">기한 {VIRTUAL_ACCOUNT.dueAt}</span>
            </div>
            <h2 className="mt-4 text-[24px] font-semibold leading-[32px]">가상계좌가 발급됐어요</h2>
            <div className="mt-5 rounded-[12px] border border-[var(--td-line)] p-4">
              <p className="text-[13px] text-[var(--td-ink-3)]">{VIRTUAL_ACCOUNT.bank}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="td-mono text-[19px] font-semibold">{VIRTUAL_ACCOUNT.number}</p>
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[var(--td-blue)]"
                >
                  <Copy size={14} />
                  복사
                </button>
              </div>
              <dl className="mt-3 space-y-1.5 border-t border-[var(--td-line-soft)] pt-3 text-[14px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--td-ink-3)]">예금주</dt>
                  <dd className="text-right">{VIRTUAL_ACCOUNT.holder}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--td-ink-3)]">입금 금액</dt>
                  <dd className="font-semibold">{won(FEE.total)}원</dd>
                </div>
              </dl>
            </div>
            <p className="mt-3 text-[13px] leading-[19px] text-[var(--td-ink-3)]">
              입금이 확인되면 알림톡을 보내 드려요. 기한이 지나면 신청이 자동 취소돼요.
            </p>
            <Button size="lg" className="mt-6 w-full" onClick={() => onNavigate("status")}>
              확인
            </Button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function SignScreen({
  initialPay,
  initialResult,
  onNavigate,
}: {
  initialPay: PayMethod;
  initialResult: PayResult;
  onNavigate: (s: SiteScreen) => void;
}) {
  const [pay, setPay] = useState(initialPay);
  const [result, setResult] = useState<PayResult>(initialResult);
  const [confirmed, setConfirmed] = useState(true);

  const submit = () => setResult(pay === "card" ? "success" : "pending");

  return (
    <div className="pb-28 md:pb-16">
      {/* 데스크톱은 왼쪽 세로 레일, 그보다 좁으면 상단 가로 단계 */}
      <div className="border-b border-[var(--td-line)] lg:hidden">
        <Container className="flex h-14 items-center">
          <FlowSteps screen="sign" onNavigate={onNavigate} />
        </Container>
      </div>

      <Container className="grid items-start gap-10 pt-8 lg:grid-cols-[200px_1fr_360px] lg:gap-10 lg:pt-12">
        <aside className="hidden lg:block">
          <FlowRail screen="sign" onNavigate={onNavigate} />
        </aside>

        {/* 의뢰 내역서. 패널이 더 길어서 문서 쪽을 고정한다 */}
        <div className="min-w-0 lg:sticky lg:top-[72px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[24px] font-semibold leading-[32px] md:text-[32px] md:leading-[40px]">의뢰 확인, 결제</h1>
              <p className="mt-1 text-[15px] text-[var(--td-ink-3)]">신고대리 의뢰 내역서 | 결제 전에 확인해 주세요</p>
            </div>
            <Button variant="secondary" size="sm">
              <DownloadSimple size={15} />
              PDF 다운로드
            </Button>
          </div>
          <div className="mt-6 rounded-[16px] bg-[var(--td-parch)] px-6 py-8 sm:px-12 lg:px-6 lg:py-8">
            {/* 문서 글자 크기는 미리보기 폭을 따라 단계별로 바꾼다 */}
            <div className="mx-auto max-w-[540px] text-[9px] sm:text-[13px] lg:text-[9.5px]">
              <RequestSummaryDocument fontSize="1em" data={CUSTOMER_SUMMARY} />
            </div>
          </div>
        </div>

        {/* 확인, 결제 패널 */}
        <aside className="min-w-0">
          <Block title="담당 세무사" aside={<span className="text-[13px] text-[var(--td-ink-3)]">업종 기준 자동 지정</span>}>
            <AgentCard />
          </Block>
          <Block title="결제 후 진행">
            <AfterPayment />
          </Block>
          <Block title="수수료">
            <FeeBlock />
          </Block>
          <Block title="결제수단">
            <PayMethodBlock pay={pay} setPay={setPay} />
          </Block>
          <ConfirmCheck on={confirmed} setOn={setConfirmed} />
          <div className="mt-4 hidden md:block">
            <Button size="lg" className="w-full" onClick={submit} disabled={!confirmed}>
              {won(FEE.total)}원 {pay === "card" ? "결제" : "가상계좌 발급"}
            </Button>
          </div>
          <p className="mt-3 hidden text-center text-[12px] text-[var(--td-ink-3)] md:block">
            결제하면 신고 의뢰가 접수되고 담당 세무사가 자료 검토를 시작해요
          </p>
        </aside>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-4 border-t border-[var(--td-line)] bg-white px-6 pb-4 pt-3 md:hidden">
        <div className="shrink-0">
          <p className="text-[12px] text-[var(--td-ink-3)]">결제 금액 (원)</p>
          <p className="text-[19px] font-bold leading-6">{won(FEE.total)}</p>
        </div>
        <Button size="lg" className="flex-1" onClick={submit} disabled={!confirmed}>
          {pay === "card" ? "결제하기" : "가상계좌 발급"}
          <ArrowRight size={16} weight="bold" />
        </Button>
      </div>

      <AnimatePresence>
        {result && (
          <ResultDialog
            result={result}
            onClose={() => setResult(null)}
            onNavigate={onNavigate}
            onRetry={() => setResult("success")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
