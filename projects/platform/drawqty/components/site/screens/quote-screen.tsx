"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Info } from "@phosphor-icons/react";
import { allItems, totalsFor } from "@/projects/platform/drawqty/lib/calc";
import { fmt } from "@/projects/platform/drawqty/lib/format";
import { SAMPLE_FILE } from "@/projects/platform/drawqty/lib/plan-data";
import { useStore, type QuoteForm } from "@/projects/platform/drawqty/lib/store";
import { APPROX_NOTICE, Button, Checkbox, Field } from "@/projects/platform/drawqty/components/site/ui";

const MONTHS = ["2026년 10월", "2026년 11월", "2026년 12월", "2027년 1월", "2027년 2월", "2027년 3월", "미정"];

type Errors = Partial<Record<keyof QuoteForm | "agree", string>>;

export function QuoteScreen({
  initialReceipt,
  onBack,
  onNewUpload,
}: {
  initialReceipt: string | null;
  onBack: () => void;
  onNewUpload: () => void;
}) {
  const { items, targets, file, submitQuote } = useStore();
  const [form, setForm] = useState<QuoteForm>({
    company: "",
    site: "",
    manager: "",
    phone: "",
    email: "",
    startMonth: MONTHS[1],
    memo: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [receipt, setReceipt] = useState<string | null>(initialReceipt);

  const totals = useMemo(() => totalsFor(allItems(items)), [items]);
  const set = <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  function submit() {
    const next: Errors = {};
    if (!form.company.trim()) next.company = "업체명을 입력해 주세요";
    if (!form.site.trim()) next.site = "현장명을 입력해 주세요";
    if (!form.manager.trim()) next.manager = "담당자명을 입력해 주세요";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "연락처를 확인해 주세요";
    if (!agree) next.agree = "개인정보 수집에 동의해 주세요";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setReceipt(submitQuote(form));
  }

  return (
    <div className="dq-enter">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          {receipt ? (
            <div>
              <CheckCircle size={44} weight="fill" className="text-[var(--dq-green)]" />
              <h1 className="mt-4 text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[28px] sm:leading-9">견적 요청을 접수했어요</h1>
              <dl className="mt-6 divide-y divide-[var(--dq-line)] border-y border-[var(--dq-line)]">
                <div className="flex min-h-[56px] items-center justify-between gap-4">
                  <dt className="text-[13px] text-[var(--dq-ink-3)]">접수번호</dt>
                  <dd className="dq-mono text-[18px] font-semibold">{receipt}</dd>
                </div>
                <div className="flex min-h-[48px] items-center justify-between gap-4">
                  <dt className="text-[13px] text-[var(--dq-ink-3)]">접수 일시</dt>
                  <dd className="text-[14px] font-medium">2026-10-07 10:12</dd>
                </div>
              </dl>
              <p className="mt-5 text-[14px] leading-6 text-[var(--dq-ink-2)]">
                담당자가 도면과 물량을 확인한 뒤 입력하신 연락처로 안내해요. 접수 내용은 영업일 기준 1일 안에 검토해요.
              </p>
              <p className="mt-2 flex items-start gap-2 text-[13px] leading-5 text-[var(--dq-ink-3)]">
                <Info size={18} className="mt-px shrink-0" />
                {APPROX_NOTICE}
              </p>
              <Button className="mt-8" onClick={onNewUpload}>
                새 도면 업로드
              </Button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[28px] sm:leading-9">견적 요청</h1>
              <p className="mt-4 flex items-start gap-2.5 rounded-[8px] bg-[var(--dq-soft)] px-3.5 py-3 text-[13px] leading-5 text-[var(--dq-ink-2)]">
                <Info size={18} className="mt-px shrink-0 text-[var(--dq-ink-3)]" />
                {APPROX_NOTICE}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="업체명" value={form.company} onChange={(v) => set("company", v)} required error={errors.company} placeholder="A종합건설" />
                <Field label="현장명" value={form.site} onChange={(v) => set("site", v)} required error={errors.site} placeholder="성수동 근생 신축현장" />
                <Field label="담당자명" value={form.manager} onChange={(v) => set("manager", v)} required error={errors.manager} />
                <Field label="연락처" value={form.phone} onChange={(v) => set("phone", v)} required error={errors.phone} inputMode="tel" placeholder="010-0000-0000" />
                <Field label="이메일 (선택)" value={form.email} onChange={(v) => set("email", v)} inputMode="email" type="email" placeholder="name@company.test" />
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[var(--dq-ink-2)]">공사 예정 시기</span>
                  <select
                    value={form.startMonth}
                    onChange={(e) => set("startMonth", e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[var(--dq-line-strong)] bg-[var(--dq-surface)] px-3 text-[14px]"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--dq-ink-2)]">요청 메모</span>
                <textarea
                  value={form.memo}
                  onChange={(e) => set("memo", e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-[8px] border border-[var(--dq-line-strong)] bg-[var(--dq-surface)] px-3.5 py-3 text-[14px] leading-6 placeholder:text-[var(--dq-disabled)]"
                  placeholder="현장 조건이나 요청 사항을 적어 주세요"
                />
              </label>

              <div className="mt-3">
                <Checkbox checked={agree} onChange={setAgree} error={errors.agree}>
                  개인정보 수집 및 이용에 동의해요 (업체명, 담당자명, 연락처, 이메일)
                </Checkbox>
              </div>

              <div className="mt-6 flex gap-3">
                <Button kind="ghost" onClick={onBack}>
                  이전
                </Button>
                <Button type="submit" className="flex-1 sm:flex-none sm:px-10">
                  견적 요청
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="order-first rounded-[12px] border border-[var(--dq-line)] p-5 sm:p-6 lg:sticky lg:top-[88px] lg:order-none lg:col-span-5">
          <h2 className="text-[16px] font-semibold leading-6">산출 결과 요약</h2>
          <dl className="mt-4 divide-y divide-[var(--dq-line)] text-[14px]">
            <div className="py-3">
              <dt className="text-[12px] text-[var(--dq-ink-3)]">도면 파일명</dt>
              <dd className="mt-0.5 truncate font-medium" title={file?.name ?? SAMPLE_FILE.name}>
                {file?.name ?? SAMPLE_FILE.name}
              </dd>
            </div>
            <Row label="시스템비계 면적 (㎡)" value={targets.scaffold ? fmt(totals.scaffoldArea) : "-"} />
            <Row label="동바리 RC 체적 (㎥)" value={targets.shoring ? fmt(totals.rcVolume) : "-"} />
            <Row label="동바리 DECK 체적 (㎥)" value={targets.shoring ? fmt(totals.deckVolume) : "-"} />
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-4">
      <dt className="text-[13px] text-[var(--dq-ink-2)]">{label}</dt>
      <dd className="text-[16px] font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
