"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CheckCircle,
  Circle,
  ClockCounterClockwise,
  FileArrowUp,
  FileText,
  MagnifyingGlass,
  SealCheck,
  X,
} from "@phosphor-icons/react";
import { INSTITUTIONS, PROGRAMS } from "@/projects/community/linkon/lib/mock-data";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  Field,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";

const STEPS = ["회원가입", "기업 인증", "가입 완료"];

const TERMS = [
  { key: "service", label: "서비스 이용약관 동의", required: true },
  { key: "privacy", label: "개인정보 수집·이용 동의", required: true },
  { key: "verify", label: "기업 인증을 위한 서류 검증 동의", required: true },
  { key: "marketing", label: "지원사업·행사 소식 수신 동의", required: false },
];

const BIZ_DIRECTORY: Record<string, { name: string; ceo: string; opened: string }> = {
  "4178601923": { name: "M커머스 주식회사", ceo: "허수아", opened: "2024.03.18" },
  "2058177410": { name: "N소재 주식회사", ceo: "장한별", opened: "2022.11.02" },
};

export function SignupScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [step, setStep] = useState(0);

  // step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // step 2
  const [bizNumber, setBizNumber] = useState("");
  const [lookup, setLookup] = useState<{ name: string; ceo: string; opened: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [institution, setInstitution] = useState("");
  const [selectionType, setSelectionType] = useState<"입주기업" | "지원사업">("지원사업");
  const [program, setProgram] = useState("");
  const [documents, setDocuments] = useState<{ name: string; size: string }[]>([]);
  const [manager, setManager] = useState({ name: "", role: "", phone: "", email: "" });
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  const allRequiredAgreed = TERMS.filter((t) => t.required).every((t) => agreed[t.key]);
  const allAgreed = TERMS.every((t) => agreed[t.key]);

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreed(Object.fromEntries(TERMS.map((t) => [t.key, next])));
  };

  const submitStep1 = () => {
    const errors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "이메일 형식을 확인해 주세요.";
    if (password.length < 8) errors.password = "비밀번호는 8자 이상이어야 합니다.";
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
      errors.password = "영문과 숫자를 모두 포함해 주세요.";
    if (password !== passwordConfirm) errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!allRequiredAgreed) errors.terms = "필수 약관에 모두 동의해 주세요.";
    setStep1Errors(errors);
    if (Object.keys(errors).length === 0) {
      setStep(1);
      window.scrollTo({ top: 0 });
    }
  };

  const runLookup = () => {
    const digits = bizNumber.replace(/[^0-9]/g, "");
    if (digits.length !== 10) {
      setLookupError("사업자등록번호 10자리를 입력해 주세요.");
      setLookup(null);
      return;
    }
    const found = BIZ_DIRECTORY[digits];
    if (found) {
      setLookup(found);
      setLookupError(null);
    } else {
      setLookup({ name: "Q에너지 주식회사", ceo: "탁유하", opened: "2023.06.09" });
      setLookupError(null);
    }
  };

  const submitStep2 = () => {
    const errors: Record<string, string> = {};
    if (!lookup) errors.biz = "사업자등록번호를 조회해 주세요.";
    if (!institution) errors.institution = "소속 창업지원기관을 선택해 주세요.";
    if (!program) errors.program = "선정 사업을 선택해 주세요.";
    if (documents.length === 0) errors.documents = "인증 서류를 1개 이상 업로드해 주세요.";
    if (!manager.name.trim()) errors.managerName = "담당자 이름을 입력해 주세요.";
    if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(manager.phone.replace(/\s/g, "")))
      errors.managerPhone = "연락처 형식을 확인해 주세요.";
    setStep2Errors(errors);
    if (Object.keys(errors).length === 0) {
      setStep(2);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="mx-auto max-w-[820px] px-6 pb-24 pt-10 lg:px-10">
      <header>
        <p className="text-[13px] font-semibold text-[var(--lk-accent)]">기업 인증 가입</p>
        <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-tight text-[var(--lk-ink)]">
          창업지원사업 선정기업만 가입할 수 있습니다
        </h1>
        <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-[var(--lk-muted)]">
          사업자등록번호와 선정 증빙을 확인한 뒤 운영기관이 승인합니다. 심사는 평균 1.8영업일 걸립니다.
        </p>
      </header>

      <ol className="mt-8 flex items-center gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                index < step
                  ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
                  : index === step
                    ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                    : "bg-[var(--lk-surface)] text-[var(--lk-muted)]"
              }`}
            >
              {index < step ? <CheckCircle size={17} weight="fill" /> : index + 1}
            </span>
            <span
              className={`hidden text-[13.5px] font-semibold sm:block ${
                index <= step ? "text-[var(--lk-ink)]" : "text-[var(--lk-muted)]"
              }`}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span
                className={`h-px flex-1 ${index < step ? "bg-[var(--lk-accent)]" : "bg-[var(--lk-border)]"}`}
              />
            )}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 text-[14px] font-bold text-[#191600] transition-opacity hover:opacity-90">
              카카오로 시작하기
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#03C75A] px-4 py-3 text-[14px] font-bold text-white transition-opacity hover:opacity-90">
              네이버로 시작하기
            </button>
          </div>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--lk-border)]" />
            <span className="text-[12.5px] font-medium text-[var(--lk-muted)]">또는 이메일로 가입</span>
            <span className="h-px flex-1 bg-[var(--lk-border)]" />
          </div>

          <div className="space-y-5">
            <Field label="이메일" required error={step1Errors.email} helper="기업 도메인 이메일 사용을 권장합니다.">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.co.kr"
                className={inputClass}
              />
            </Field>
            <Field
              label="비밀번호"
              required
              error={step1Errors.password}
              helper="영문과 숫자를 포함해 8자 이상 입력해 주세요."
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className={inputClass}
              />
            </Field>
            <Field label="비밀번호 확인" required error={step1Errors.passwordConfirm}>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-7 rounded-xl border border-[var(--lk-border)] bg-[var(--lk-bg)] p-5">
            <button
              onClick={toggleAll}
              className="flex w-full items-center gap-2.5 text-left text-[14.5px] font-bold text-[var(--lk-ink)]"
            >
              {allAgreed ? (
                <CheckCircle size={20} weight="fill" className="text-[var(--lk-accent)]" />
              ) : (
                <Circle size={20} className="text-[var(--lk-muted)]" />
              )}
              약관 전체 동의
            </button>
            <ul className="mt-4 space-y-3 border-t border-[var(--lk-border)] pt-4">
              {TERMS.map((term) => (
                <li key={term.key}>
                  <button
                    onClick={() => setAgreed((prev) => ({ ...prev, [term.key]: !prev[term.key] }))}
                    className="flex w-full items-center gap-2.5 text-left"
                  >
                    {agreed[term.key] ? (
                      <CheckCircle size={18} weight="fill" className="shrink-0 text-[var(--lk-accent)]" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-[var(--lk-muted)]" />
                    )}
                    <span className="flex-1 text-[13.5px] text-[var(--lk-ink)]">{term.label}</span>
                    <span
                      className={`text-[12px] font-semibold ${
                        term.required ? "text-[var(--lk-accent)]" : "text-[var(--lk-muted)]"
                      }`}
                    >
                      {term.required ? "필수" : "선택"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {step1Errors.terms && (
              <p className="mt-3 text-[12.5px] font-medium text-[var(--lk-danger)]">{step1Errors.terms}</p>
            )}
          </div>

          <div className="mt-7 flex justify-end">
            <PrimaryButton onClick={submitStep1}>
              기업 인증 단계로
              <ArrowRight size={16} weight="bold" />
            </PrimaryButton>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-8 space-y-4">
          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7">
            <h2 className="text-[17px] font-bold text-[var(--lk-ink)]">사업자 정보</h2>
            <div className="mt-5">
              <Field label="사업자등록번호" required error={step2Errors.biz ?? lookupError ?? undefined}>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={bizNumber}
                    onChange={(e) => {
                      setBizNumber(e.target.value);
                      setLookup(null);
                    }}
                    inputMode="numeric"
                    placeholder="417-86-01923"
                    className={`${inputClass} lk-num`}
                  />
                  <button
                    onClick={runLookup}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-5 py-2.5 text-[13.5px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
                  >
                    <MagnifyingGlass size={15} />
                    기업명 조회
                  </button>
                </div>
              </Field>

              {lookup && (
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl bg-[var(--lk-accent-soft)] px-5 py-4">
                  <span className="flex items-center gap-2 text-[15px] font-bold text-[var(--lk-accent)]">
                    <Buildings size={18} weight="fill" />
                    {lookup.name}
                  </span>
                  <span className="text-[13px] font-medium text-[var(--lk-accent)]">
                    대표자 {lookup.ceo}
                  </span>
                  <span className="lk-num text-[13px] font-medium text-[var(--lk-accent)]">
                    개업일 {lookup.opened}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7">
            <h2 className="text-[17px] font-bold text-[var(--lk-ink)]">선정 사업 정보</h2>
            <div className="mt-5 space-y-5">
              <Field label="소속 창업지원기관" required error={step2Errors.institution}>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">기관을 선택하세요</option>
                  {INSTITUTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-[var(--lk-ink)]">
                  선정 구분 <span className="text-[var(--lk-danger)]">*</span>
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {(["입주기업", "지원사업"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectionType(type)}
                      className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                        selectionType === type
                          ? "border-[var(--lk-accent)] bg-[var(--lk-accent-soft)]"
                          : "border-[var(--lk-border)] bg-[var(--lk-bg)] hover:border-[var(--lk-accent)]"
                      }`}
                    >
                      <span
                        className={`block text-[14.5px] font-bold ${
                          selectionType === type ? "text-[var(--lk-accent)]" : "text-[var(--lk-ink)]"
                        }`}
                      >
                        {type}
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
                        {type === "입주기업"
                          ? "보육센터·허브에 입주 계약을 맺은 기업"
                          : "정부·기관 창업지원사업에 선정된 기업"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Field label="선정 사업명" required error={step2Errors.program}>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">사업을 선택하세요</option>
                  {PROGRAMS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7">
            <h2 className="text-[17px] font-bold text-[var(--lk-ink)]">인증 서류</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--lk-muted)]">
              사업자등록증과 선정 증빙 서류를 올려주세요. PDF 또는 이미지, 파일당 10MB 이내입니다.
            </p>
            <button
              onClick={() =>
                setDocuments((prev) =>
                  prev.length >= 3
                    ? prev
                    : [
                        ...prev,
                        prev.length === 0
                          ? { name: "사업자등록증.pdf", size: "620KB" }
                          : prev.length === 1
                            ? { name: "협약체결_확인서.pdf", size: "1.1MB" }
                            : { name: "재직증명서.pdf", size: "180KB" },
                      ],
                )
              }
              className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--lk-border)] bg-[var(--lk-bg)] py-9 text-[var(--lk-muted)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
            >
              <FileArrowUp size={24} />
              <span className="text-[13.5px] font-semibold">파일을 선택하거나 이 영역에 끌어다 놓으세요</span>
            </button>

            {documents.length > 0 && (
              <ul className="mt-4 space-y-2">
                {documents.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center gap-3 rounded-xl border border-[var(--lk-border)] px-4 py-3"
                  >
                    <FileText size={17} className="shrink-0 text-[var(--lk-accent)]" />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                      {file.name}
                    </span>
                    <span className="lk-num shrink-0 text-[12px] text-[var(--lk-muted)]">{file.size}</span>
                    <Badge tone="success">업로드 완료</Badge>
                    <button
                      onClick={() => setDocuments(documents.filter((f) => f.name !== file.name))}
                      aria-label={`${file.name} 삭제`}
                      className="text-[var(--lk-muted)] hover:text-[var(--lk-danger)]"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {step2Errors.documents && (
              <p className="mt-3 text-[12.5px] font-medium text-[var(--lk-danger)]">
                {step2Errors.documents}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7">
            <h2 className="text-[17px] font-bold text-[var(--lk-ink)]">담당자 정보</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="이름" required error={step2Errors.managerName}>
                <input
                  value={manager.name}
                  onChange={(e) => setManager({ ...manager, name: e.target.value })}
                  placeholder="담당자 이름"
                  className={inputClass}
                />
              </Field>
              <Field label="직함">
                <input
                  value={manager.role}
                  onChange={(e) => setManager({ ...manager, role: e.target.value })}
                  placeholder="예: 사업개발 리드"
                  className={inputClass}
                />
              </Field>
              <Field label="연락처" required error={step2Errors.managerPhone}>
                <input
                  value={manager.phone}
                  onChange={(e) => setManager({ ...manager, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className={`${inputClass} lk-num`}
                />
              </Field>
              <Field label="담당자 이메일" helper="가입 이메일과 달라도 됩니다.">
                <input
                  value={manager.email}
                  onChange={(e) => setManager({ ...manager, email: e.target.value })}
                  placeholder="manager@company.co.kr"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <SecondaryButton onClick={() => setStep(0)}>
              <ArrowLeft size={15} weight="bold" />
              이전
            </SecondaryButton>
            <PrimaryButton onClick={submitStep2}>
              인증 심사 신청
              <ArrowRight size={16} weight="bold" />
            </PrimaryButton>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-8">
          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]">
              <SealCheck size={26} weight="fill" />
            </span>
            <h2 className="mt-5 text-[22px] font-bold tracking-tight text-[var(--lk-ink)]">
              인증 심사 신청이 접수되었습니다
            </h2>
            <p className="mx-auto mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-[var(--lk-muted)]">
              {institution || "소속 기관"} 담당자가 제출 서류를 확인합니다. 결과는 가입 이메일과 문자로
              안내됩니다.
            </p>

            <div className="mx-auto mt-8 max-w-[420px] text-left">
              <ol className="space-y-0">
                {[
                  { label: "신청 접수", detail: "2026.07.27 12:00", done: true },
                  { label: "서류 검토", detail: "담당자 배정 완료", done: false, current: true },
                  { label: "승인 완료", detail: "승인 시 즉시 서비스 이용 가능", done: false },
                ].map((item, index, arr) => (
                  <li key={item.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          item.done
                            ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
                            : item.current
                              ? "bg-[var(--lk-warning-soft)] text-[var(--lk-warning)]"
                              : "bg-[var(--lk-surface)] text-[var(--lk-muted)]"
                        }`}
                      >
                        {item.done ? (
                          <CheckCircle size={17} weight="fill" />
                        ) : item.current ? (
                          <ClockCounterClockwise size={16} weight="fill" />
                        ) : (
                          <Circle size={14} />
                        )}
                      </span>
                      {index < arr.length - 1 && <span className="h-10 w-px bg-[var(--lk-border)]" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-[14.5px] font-bold text-[var(--lk-ink)]">{item.label}</p>
                      <p className="lk-num mt-0.5 text-[12.5px] text-[var(--lk-muted)]">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mx-auto mt-2 max-w-[420px] rounded-xl bg-[var(--lk-surface)] px-5 py-4 text-left">
              <p className="text-[13px] font-bold text-[var(--lk-ink)]">승인 예상 시간</p>
              <p className="lk-num mt-1 text-[13px] leading-relaxed text-[var(--lk-muted)]">
                최근 30일 평균 1.8영업일. 서류 보완이 필요하면 담당자가 연락드립니다.
              </p>
            </div>

            <ul className="mx-auto mt-6 max-w-[440px] space-y-2 text-left">
              {[
                "승인 전에는 공개 공지사항만 열람할 수 있습니다.",
                "승인 후 기업 프로필, 회원 기업 검색, 채팅 기능이 열립니다.",
                "인증 정보가 변경되면 마이페이지에서 재심사를 신청할 수 있습니다.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-[var(--lk-muted)]">
                  <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--lk-accent)]" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <PrimaryButton onClick={() => onNavigate("home")}>홈으로 이동</PrimaryButton>
              <SecondaryButton onClick={() => setStep(0)}>처음부터 다시 보기</SecondaryButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
