"use client";

import { useState } from "react";
import {
  CheckCircle,
  FileText,
  Lock,
  Receipt,
  Sparkle,
  UploadSimple,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import type { VerificationDocType } from "@/projects/community/wedit/lib/types";
import { Button, StatusPill } from "@/projects/community/wedit/components/ui";

type Step = "select" | "scanning" | "confirm" | "done";

export function VerifyUploadScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [step, setStep] = useState<Step>("select");
  const [docType, setDocType] = useState<VerificationDocType>("receipt");
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [contractDate, setContractDate] = useState("");

  const startScan = () => {
    setStep("scanning");
    setTimeout(() => {
      setVendorName("루메르 스튜디오");
      setAmount("1,350,000");
      setContractDate("2025-10-16");
      setStep("confirm");
    }, 1100);
  };

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="영수증 · 계약서 인증"
        subtitle={step === "done" ? undefined : "결제 인증 리뷰를 남기려면 인증이 필요해요"}
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
        subtitleClassName="text-[11px] text-[var(--wd-muted)]"
      />

      {step === "select" && (
        <div className="flex flex-col gap-6 px-5 pt-6">
          <div className="flex gap-2">
            {(["receipt", "contract"] as VerificationDocType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDocType(t)}
                className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border py-4 ${
                  docType === t
                    ? "border-[var(--wd-accent)] bg-[var(--wd-accent-soft)]"
                    : "border-[var(--wd-border)] bg-white"
                }`}
              >
                {t === "receipt" ? (
                  <Receipt size={22} weight="duotone" className="text-[var(--wd-accent)]" />
                ) : (
                  <FileText size={22} weight="duotone" className="text-[var(--wd-accent)]" />
                )}
                <span className="text-[13px] font-semibold text-[var(--wd-ink)]">
                  {t === "receipt" ? "영수증" : "계약서"}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={startScan}
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--wd-accent)] bg-white py-12"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wd-accent-soft)] text-[var(--wd-accent)]">
              <UploadSimple size={22} weight="bold" />
            </span>
            <span className="text-[13.5px] font-semibold text-[var(--wd-ink)]">
              {docType === "receipt" ? "영수증 사진 올리기" : "계약서 사진 올리기"}
            </span>
            <span className="text-[11.5px] text-[var(--wd-muted)]">JPG, PNG, PDF · 최대 20MB</span>
          </button>

          <div className="flex items-start gap-2.5 rounded-2xl bg-[var(--wd-surface-tint)] p-4">
            <Lock size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--wd-accent)]" />
            <p className="text-[12px] leading-[17px] text-[var(--wd-body)]">
              이름, 연락처, 서명 등 개인정보는 자동으로 마스킹 처리되어 계약 금액과 구성만
              공개됩니다.
            </p>
          </div>
        </div>
      )}

      {step === "scanning" && (
        <div className="flex flex-col items-center gap-4 px-5 pt-24">
          <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[var(--wd-accent-soft)] text-[var(--wd-accent)]">
            <Sparkle size={26} weight="fill" />
          </span>
          <p className="text-[14px] font-semibold text-[var(--wd-ink)]">OCR로 정보를 인식하고 있어요</p>
          <p className="text-[12px] text-[var(--wd-muted)]">업체명, 계약 금액, 계약일을 자동으로 찾는 중</p>
          <div className="mt-4 flex w-full flex-col gap-2">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-[var(--wd-surface-tint)]" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-[var(--wd-surface-tint)]" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-[var(--wd-surface-tint)]" />
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-5 px-5 pt-6">
          <div className="flex items-center gap-2 rounded-full bg-[var(--wd-accent-soft)] px-3.5 py-2 text-[11.5px] font-medium text-[var(--wd-accent-strong)]">
            <CheckCircle size={14} weight="fill" />
            정보를 자동으로 인식했어요. 확인 후 수정할 수 있어요.
          </div>

          <Field label="업체명 (자동 인식)" value={vendorName} onChange={setVendorName} />
          <Field label="계약 금액" value={amount} onChange={setAmount} prefix="₩" />
          <Field label="계약일" value={contractDate} onChange={setContractDate} type="date" />

          <div className="flex items-start gap-2.5 rounded-2xl bg-[var(--wd-surface-tint)] p-4">
            <Lock size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--wd-accent)]" />
            <p className="text-[12px] leading-[17px] text-[var(--wd-body)]">
              제출 전 개인정보 영역이 마스킹된 미리보기를 다시 확인할 수 있어요.
            </p>
          </div>

          <Button fullWidth size="lg" onClick={() => setStep("done")}>
            인증 신청하기
          </Button>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-5 px-5 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--wd-accent-soft)] text-[var(--wd-accent)]">
            <CheckCircle size={28} weight="fill" />
          </span>
          <div>
            <p className="text-[16px] font-bold text-[var(--wd-ink)]">인증 신청이 접수됐어요</p>
            <p className="mt-1.5 text-[12.5px] leading-[18px] text-[var(--wd-muted)]">
              검수는 보통 1~2일 정도 걸려요. 진행 상태는 마이페이지에서 확인할 수 있어요.
            </p>
          </div>
          <div className="flex w-full items-center justify-between rounded-2xl border border-[var(--wd-border)] bg-white p-4">
            <div className="text-left">
              <p className="text-[13.5px] font-semibold text-[var(--wd-ink)]">{vendorName}</p>
              <p className="text-[11.5px] text-[var(--wd-muted)]">{contractDate} 계약</p>
            </div>
            <StatusPill status="received" />
          </div>
          <Button fullWidth size="lg" onClick={() => onNavigate("myVerifications")}>
            인증 현황 전체보기
          </Button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[var(--wd-muted)]">{label}</span>
      <div className="flex h-12 items-center gap-1.5 rounded-xl border border-[var(--wd-border)] bg-white px-3.5">
        {prefix && <span className="text-[13.5px] text-[var(--wd-muted)]">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full flex-1 bg-transparent text-[13.5px] text-[var(--wd-ink)] outline-none"
        />
      </div>
    </label>
  );
}
