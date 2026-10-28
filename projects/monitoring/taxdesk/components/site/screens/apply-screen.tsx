"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CaretLeft,
  ChatCircle,
  CheckCircle,
  CloudArrowUp,
  DeviceMobile,
  EnvelopeSimple,
  FloppyDisk,
  MagnifyingGlass,
  PenNib,
  Storefront,
  X,
} from "@phosphor-icons/react";
import { CUSTOMER, FEE, FILING, won } from "@/projects/monitoring/taxdesk/lib/mock-data";
import type { SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import { RequestSummaryDocument } from "@/projects/monitoring/taxdesk/components/request-summary-document";
import { FlowRail, FlowSteps } from "@/projects/monitoring/taxdesk/components/site/site-chrome";
import { Button, ChoiceChip, Container, Field, TextBox } from "@/projects/monitoring/taxdesk/components/site/ui";

const STEPS = ["사업자 정보", "대표자 및 담당자", "신고 대상", "사업 내용"];

const spring = { type: "spring" as const, visualDuration: 0.3, bounce: 0 };

/* ---------- 히어로 ---------- */

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="bg-[var(--td-parch)]">
        <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1fr_360px] lg:gap-16 lg:py-10">
          <div>
            <h1 className="text-[28px] font-semibold leading-[34px] tracking-[-0.02em] lg:text-[40px] lg:leading-[48px]">
              부가세 신고, 자료만 올리면
              <br />
              세무사가 대신 신고해요
            </h1>
            <p className="mt-5 max-w-[30em] text-[17px] leading-[25px] text-[var(--td-ink-2)]">
              사업정보와 증빙을 제출하고 신고대리를 의뢰하세요. 담당 세무사가 자료를 검토한 뒤 신고를 진행하며, 신고
              결과와 접수증까지 한곳에서 확인할 수 있어요.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={onStart}>
                신고 신청 시작
                <ArrowRight size={18} weight="bold" />
              </Button>
            </div>
            <dl className="mt-10 grid max-w-[480px] grid-cols-3 divide-x divide-[var(--td-line)] border-y border-[var(--td-line)] py-4">
              <div className="pr-4">
                <dt className="text-[12px] text-[var(--td-ink-3)]">기본 수수료 (원)</dt>
                <dd className="mt-1 text-[21px] font-semibold">{won(FEE.base)}</dd>
              </div>
              <div className="px-4">
                <dt className="text-[12px] text-[var(--td-ink-3)]">신청서 입력</dt>
                <dd className="mt-1 text-[21px] font-semibold">약 6분</dd>
              </div>
              <div className="pl-4">
                <dt className="text-[12px] text-[var(--td-ink-3)]">신고 기한까지</dt>
                <dd className="mt-1 text-[21px] font-semibold">D-{FILING.dday}</dd>
              </div>
            </dl>
          </div>
          <div className="mx-auto w-full max-w-[360px] lg:max-w-none">
            <div className="px-6 lg:px-5">
              <RequestSummaryDocument fontSize={9} />
            </div>
            <p className="mt-3 text-center text-[13px] text-[var(--td-ink-3)]">
              신청 정보를 바탕으로 자동 생성되는 의뢰 내역서 예시
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 lg:pb-12 lg:pt-8">
          <h2 className="text-[21px] font-semibold leading-[28px]">신청부터 접수까지</h2>
          <ol className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Storefront, t: "신청서 작성", d: "사업자등록번호 조회로 상호, 과세유형 자동 입력" },
              { Icon: CloudArrowUp, t: "증빙 올리기", d: "AI 안내로 업종별 준비자료 확인, 사진 촬영 업로드" },
              { Icon: PenNib, t: "의뢰 확인, 결제", d: "의뢰 내역 확인 후 카드나 가상계좌 결제" },
              { Icon: CheckCircle, t: "세무사 검토, 제출", d: "세무사 확정 후 홈택스 제출, 접수증 발급" },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4 border-t border-[var(--td-line)] pt-5">
                <Icon size={26} className="shrink-0 text-[var(--td-ink)]" />
                <div>
                  <p className="text-[17px] font-semibold">{t}</p>
                  <p className="mt-1 text-[14px] leading-[20px] text-[var(--td-ink-3)]">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}

/* ---------- 간편가입 모달 ---------- */

function SignupModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [agree, setAgree] = useState([true, true, true, false]);
  const terms = [
    { t: "서비스 이용약관", req: true },
    { t: "개인정보 수집 및 이용", req: true },
    { t: "신고대리 의뢰 및 의뢰 내역서 생성", req: true },
    { t: "신고 일정 알림톡 수신", req: false },
  ];
  const all = agree.every(Boolean);

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
        aria-label="간편가입"
        className="relative flex max-h-full w-full flex-col overflow-y-auto rounded-t-[16px] bg-white md:max-w-[440px] md:rounded-[16px]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", visualDuration: 0.36, bounce: 0.08 }}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-[21px] font-semibold">간편가입</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--td-parch)]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-2.5 px-6 pt-5">
          <button
            type="button"
            className="td-press flex h-12 items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[15px] font-semibold text-[#191600]"
          >
            <ChatCircle size={19} weight="fill" />
            카카오로 시작
          </button>
          <button
            type="button"
            className="td-press flex h-12 items-center justify-center gap-2 rounded-full bg-[#03C75A] text-[15px] font-semibold text-white"
          >
            <span className="text-[15px] font-bold">N</span>
            네이버로 시작
          </button>
          <button
            type="button"
            className="td-press flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--td-line)] text-[15px] font-semibold"
          >
            <EnvelopeSimple size={19} />
            이메일로 시작
          </button>
        </div>

        <div className="mx-6 mt-6 rounded-[16px] bg-[var(--td-parch)] p-4">
          <div className="flex items-center gap-3">
            <DeviceMobile size={22} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">휴대폰 본인인증</p>
              <p className="text-[13px] text-[var(--td-ink-3)]">의뢰인 본인 확인에 필요해요</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[var(--td-done-fg)]">
              <CheckCircle size={16} weight="fill" />
              인증 완료
            </span>
          </div>
        </div>

        <div className="px-6 pt-5">
          <button
            type="button"
            onClick={() => setAgree(agree.map(() => !all))}
            className="flex h-11 w-full items-center gap-3 border-b border-[var(--td-line)] text-[15px] font-semibold"
          >
            <CheckCircle size={22} weight="fill" className={all ? "text-[var(--td-blue)]" : "text-[#d2d2d7]"} />
            전체 동의
          </button>
          <ul className="py-1">
            {terms.map((term, i) => (
              <li key={term.t}>
                <button
                  type="button"
                  onClick={() => setAgree(agree.map((v, j) => (j === i ? !v : v)))}
                  className="flex h-10 w-full items-center gap-3 text-left text-[14px]"
                >
                  <CheckCircle
                    size={20}
                    weight={agree[i] ? "fill" : "regular"}
                    className={agree[i] ? "text-[var(--td-blue)]" : "text-[#c7c7cc]"}
                  />
                  <span className="text-[var(--td-ink-3)]">{term.req ? "필수" : "선택"}</span>
                  <span className="min-w-0 flex-1 truncate">{term.t}</span>
                  <span className="text-[13px] text-[var(--td-ink-3)] underline underline-offset-2">보기</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3">
          <Button size="lg" className="w-full" onClick={onDone} disabled={!agree.slice(0, 3).every(Boolean)}>
            동의하고 신청서 작성
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- 단계 폼 ---------- */

function StepBody({ step }: { step: number }) {
  const [kind, setKind] = useState<"예정" | "확정">("확정");
  const [channels, setChannels] = useState(["오프라인 매장", "배달앱"]);
  const [staff, setStaff] = useState("있음");

  if (step === 0)
    return (
      <div className="flex flex-col gap-6">
        <Field label="사업자등록번호" required ok="국세청 사업자 상태 조회 완료, 계속사업자">
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <TextBox value={CUSTOMER.bizNo} mono />
            </div>
            <Button variant="secondary" className="h-12">
              <MagnifyingGlass size={17} />
              조회
            </Button>
          </div>
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="상호">
            <TextBox value={CUSTOMER.business} readOnly />
          </Field>
          <Field label="개업일">
            <TextBox value={CUSTOMER.openedAt} readOnly />
          </Field>
        </div>
        <Field label="과세유형">
          <TextBox value={CUSTOMER.taxType} readOnly />
        </Field>
        <Field label="사업장 소재지">
          <TextBox value={CUSTOMER.address} readOnly />
        </Field>
      </div>
    );

  if (step === 1)
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="대표자 이름" required ok="본인인증 정보와 일치">
            <TextBox value={CUSTOMER.owner} />
          </Field>
          <Field label="휴대폰 번호" required>
            <TextBox value={CUSTOMER.phone} />
          </Field>
        </div>
        <Field label="이메일" required error="도메인 끝을 확인해 주세요. 예: dbakery.kr">
          <TextBox value="jm.ryu@dbakery" invalid />
        </Field>
        <Field label="신고 담당자" hint="대표자와 다르면 바꿔 주세요">
          <TextBox value="대표자 본인" />
        </Field>
        <label className="flex items-start gap-3 rounded-[16px] bg-[var(--td-parch)] p-4">
          <CheckCircle size={22} weight="fill" className="mt-px shrink-0 text-[var(--td-blue)]" />
          <span>
            <span className="block text-[15px] font-semibold">알림톡 수신 동의</span>
            <span className="mt-0.5 block text-[14px] leading-[20px] text-[var(--td-ink-3)]">
              결제, 보완 요청, 접수 완료, 다음 신고 기한을 카카오톡으로 받아요
            </span>
          </span>
        </label>
      </div>
    );

  if (step === 2)
    return (
      <div className="flex flex-col gap-6">
        <Field label="신고 구분" required>
          <div className="flex gap-2">
            {(["예정", "확정"] as const).map((k) => (
              <ChoiceChip key={k} selected={kind === k} onClick={() => setKind(k)}>
                {k}신고
              </ChoiceChip>
            ))}
          </div>
        </Field>
        <Field label="과세기간" required>
          <TextBox value={`${FILING.period} (${FILING.range})`} readOnly />
        </Field>
        <div className="flex items-center justify-between gap-4 rounded-[16px] border border-[var(--td-line)] p-5">
          <div className="min-w-0">
            <p className="text-[14px] text-[var(--td-ink-3)]">신고기한</p>
            <p className="mt-1 text-[21px] font-semibold">{FILING.deadline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[14px] text-[var(--td-ink-3)]">남은 기간 (일)</p>
            <p className="mt-1 text-[21px] font-semibold text-[var(--td-blue)]">{FILING.dday}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <Field label="업종" required ok={`업종코드 ${CUSTOMER.industryCode} 사업자등록 업태와 일치`}>
        <TextBox
          value={`${CUSTOMER.industry} (${CUSTOMER.industryCode})`}
          suffix={<MagnifyingGlass size={18} className="text-[var(--td-ink-3)]" />}
        />
      </Field>
      <Field label="판매 채널" required hint="해당하는 것을 모두 골라 주세요">
        <div className="flex flex-wrap gap-2">
          {["오프라인 매장", "온라인 쇼핑몰", "배달앱"].map((c) => (
            <ChoiceChip
              key={c}
              selected={channels.includes(c)}
              onClick={() => setChannels(channels.includes(c) ? channels.filter((x) => x !== c) : [...channels, c])}
            >
              {c}
            </ChoiceChip>
          ))}
        </div>
      </Field>
      <Field label="직원" required>
        <div className="flex gap-2">
          {["있음", "없음"].map((s) => (
            <ChoiceChip key={s} selected={staff === s} onClick={() => setStaff(s)}>
              {s}
            </ChoiceChip>
          ))}
        </div>
      </Field>
      {staff === "있음" && (
        <Field label="직원 수 (명)">
          <TextBox value="2" />
        </Field>
      )}
    </div>
  );
}

function StepForm({
  initialStep,
  onNavigate,
}: {
  initialStep: number;
  onNavigate: (s: SiteScreen) => void;
}) {
  const [step, setStep] = useState(initialStep);
  const [dir, setDir] = useState(1);

  function go(next: number) {
    if (next > 3) return onNavigate("documents");
    setDir(next > step ? 1 : -1);
    setStep(Math.max(0, next));
  }

  return (
    <div className="pb-28 md:pb-0">
      {/* 모바일만 상단 가로 단계. 데스크톱은 왼쪽 세로 레일이 대신한다 */}
      <div className="border-b border-[var(--td-line)] md:hidden">
        <Container className="flex h-14 items-center">
          <FlowSteps screen="apply" onNavigate={onNavigate} />
        </Container>
      </div>

      <Container className="grid gap-10 py-8 md:grid-cols-[240px_1fr] md:py-12 lg:gap-16">
        <aside className="hidden md:block">
          <FlowRail screen="apply" onNavigate={onNavigate}>
            <ol className="flex flex-col">
              {STEPS.map((s, j) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => go(j)}
                    className={`flex h-11 w-full items-center gap-3 border-l-2 pl-6 text-left text-[14px] ${
                      j === step
                        ? "border-[var(--td-blue)] font-semibold text-[var(--td-ink)]"
                        : j < step
                          ? "border-[var(--td-ink)] text-[var(--td-ink-2)]"
                          : "border-[var(--td-line)] text-[var(--td-ink-3)]"
                    }`}
                  >
                    {s}
                    {j < step && <CheckCircle size={16} weight="fill" className="ml-auto text-[var(--td-ink)]" />}
                  </button>
                </li>
              ))}
            </ol>
          </FlowRail>
          <div className="mt-8 rounded-[16px] bg-[var(--td-parch)] p-4">
            <p className="text-[13px] text-[var(--td-ink-3)]">신고 대상</p>
            <p className="mt-1 text-[15px] font-semibold">
              {FILING.period} {FILING.kind}
            </p>
            <p className="text-[14px] text-[var(--td-ink-2)]">기한 {FILING.deadline}</p>
          </div>
        </aside>

        <div className="relative min-w-0 max-w-[600px] overflow-hidden">
          {/* 임시저장은 단계 제목과 같은 행 오른쪽 끝. 단계 전환 애니메이션 밖에 둬서 고정된다 */}
          <button
            type="button"
            className="absolute right-0 top-0 flex h-5 items-center gap-1.5 text-[14px] text-[var(--td-ink-2)] hover:text-[var(--td-ink)] md:h-10"
          >
            <FloppyDisk size={17} />
            <span className="hidden sm:inline">임시저장</span>
            <span className="text-[var(--td-ink-3)]">10:24 저장됨</span>
          </button>
          <p className="text-[14px] font-semibold text-[var(--td-blue)] md:hidden">
            {step + 1} / 4
          </p>
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ x: 24 * dir, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24 * dir, opacity: 0 }}
              transition={spring}
            >
              <h1 className="mt-1 text-[24px] font-semibold leading-[32px] md:mt-0 md:pr-56 md:text-[32px] md:leading-[40px]">
                {STEPS[step]}
              </h1>
              <div className="mt-8">
                <StepBody step={step} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 hidden items-center gap-3 md:flex">
            {step > 0 && (
              <Button variant="ghost" onClick={() => go(step - 1)}>
                <CaretLeft size={16} />
                이전
              </Button>
            )}
            <Button className="ml-auto min-w-[160px]" onClick={() => go(step + 1)}>
              {step === 3 ? "증빙 제출로" : "다음"}
            </Button>
          </div>
        </div>
      </Container>

      {/* 모바일 하단 고정 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-[var(--td-line)] bg-white px-6 pb-4 pt-3 md:hidden">
        {step > 0 && (
          <Button variant="ghost" size="lg" className="px-5" onClick={() => go(step - 1)}>
            이전
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={() => go(step + 1)}>
          {step === 3 ? "증빙 제출로" : "다음"}
        </Button>
      </div>
    </div>
  );
}

export function ApplyScreen({
  initialStep,
  initialModal,
  onNavigate,
  onSignedIn,
}: {
  /** null이면 히어로, 0~3이면 폼 단계 */
  initialStep: number | null;
  initialModal: boolean;
  onNavigate: (s: SiteScreen) => void;
  onSignedIn: () => void;
}) {
  const [step, setStep] = useState(initialStep);
  const [modal, setModal] = useState(initialModal);

  return (
    <>
      {step === null ? <Hero onStart={() => setModal(true)} /> : <StepForm initialStep={step} onNavigate={onNavigate} />}
      <AnimatePresence>
        {modal && (
          <SignupModal
            onClose={() => setModal(false)}
            onDone={() => {
              setModal(false);
              onSignedIn();
              setStep(0);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
