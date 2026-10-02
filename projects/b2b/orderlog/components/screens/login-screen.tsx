"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Buildings,
  CheckCircle,
  Devices,
  Factory,
  HandCoins,
  Lock,
  ShieldCheck,
  Storefront,
} from "@phosphor-icons/react";
import { Button, Input } from "@/projects/b2b/orderlog/components/ui";
import { loginHistory } from "@/projects/b2b/orderlog/lib/mock-data";
import { ROLE_LABEL } from "@/projects/b2b/orderlog/lib/navigation";
import { Mark } from "@/projects/b2b/orderlog/components/layout/mark";
import type { Role } from "@/projects/b2b/orderlog/lib/types";

const ROLE_OPTIONS: { role: Role; icon: React.ComponentType<{ size?: number; weight?: "bold" }>; desc: string; company: string }[] = [
  { role: "buyer", icon: Factory, desc: "발주 등록, 단가 스냅샷, 승인 처리 권한", company: "A중공업" },
  { role: "supplier", icon: HandCoins, desc: "납기 조율, 출고 증빙, 발주 확인 권한", company: "B소재" },
  { role: "vendor", icon: Storefront, desc: "발주 승인, 정산 확인, 세금계산서 발행 권한", company: "E상사" },
];

const PERMISSION_NOTE: Record<Role, string> = {
  master: "모든 거래처의 발주 스레드, AI 이상 탐지 로그, 계정 상태를 열람/수정할 수 있습니다. 마스터 권한은 별도의 관리자 콘솔 계정으로만 로그인할 수 있습니다.",
  buyer: "소속 거래처(B소재, C금속, D패키징)와의 발주만 열람하며 단가 스냅샷 생성 권한이 있습니다.",
  supplier: "A중공업으로부터 받은 발주만 열람하며 납기 변경 요청 권한이 있습니다.",
  vendor: "최종 승인/정산 대상 발주만 열람하며 6천만원 이상 발주는 원청 승인이 선행되어야 합니다.",
};

type Step = "role" | "credential" | "otp";

export function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>("buyer");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");

  const selected = ROLE_OPTIONS.find((o) => o.role === role)!;

  return (
    <div className="orderlog min-h-dvh">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px]">
        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 flex items-center gap-2">
              <Mark size={26} />
              <span className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--ot-ink)]">
                OrderLog
              </span>
            </div>

            {step === "role" && (
              <div className="ot-enter">
                <h1 className="text-[22px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ot-ink)]">
                  어떤 권한으로 접속하시나요
                </h1>
                <p className="mt-2 text-[13.5px] leading-5 text-[var(--ot-mute)]">
                  스냅샷 단가 고정과 AI 이상 발주 탐지를 함께 쓰는 통합 수발주 콘솔입니다.
                </p>
                <div className="mt-6 space-y-2.5">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = opt.role === role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => setRole(opt.role)}
                        className={`flex w-full items-start gap-3 rounded-[10px] border px-4 py-3.5 text-left transition-colors ${
                          active
                            ? "border-[var(--ot-accent)] bg-[var(--ot-accent-soft)]"
                            : "border-[var(--ot-hairline)] bg-[var(--ot-surface)] hover:bg-[var(--ot-surface-soft)]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] ${
                            active ? "bg-[var(--ot-accent)] text-white" : "bg-[var(--ot-surface-soft)] text-[var(--ot-body)]"
                          }`}
                        >
                          <Icon size={15} weight="bold" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="text-[14px] font-medium text-[var(--ot-ink)]">{ROLE_LABEL[opt.role]}</span>
                            <span className="text-[12px] text-[var(--ot-mute)]">{opt.company}</span>
                          </span>
                          <span className="mt-0.5 block text-[12.5px] leading-4 text-[var(--ot-mute)]">{opt.desc}</span>
                        </span>
                        {active && <CheckCircle size={17} weight="fill" className="ml-auto mt-0.5 shrink-0 text-[var(--ot-accent)]" />}
                      </button>
                    );
                  })}
                </div>
                <Button full size="lg" onClick={() => setStep("credential")} icon={<Buildings size={15} weight="bold" />}>
                  {ROLE_LABEL[role]}으로 계속하기
                </Button>
                <p className="mt-4 text-center text-[12px] leading-4 text-[var(--ot-mute)]">{PERMISSION_NOTE[role]}</p>
              </div>
            )}

            {step === "credential" && (
              <div className="ot-enter">
                <button type="button" onClick={() => setStep("role")} className="mb-4 text-[12.5px] text-[var(--ot-mute)]">
                  ← 권한 다시 선택
                </button>
                <h1 className="text-[22px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ot-ink)]">
                  {selected.company} 계정으로 로그인
                </h1>
                <p className="mt-2 text-[13.5px] leading-5 text-[var(--ot-mute)]">
                  거래/금융 정보를 다루는 서비스라 2단계 인증을 함께 진행합니다.
                </p>
                <div className="mt-6 space-y-3.5">
                  <Input value={id} onChange={setId} placeholder="업무용 이메일" />
                  <Input value={pw} onChange={setPw} placeholder="비밀번호" type="password" />
                </div>
                <label className="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--ot-mute)]">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-[var(--ot-accent)]" />
                  이 기기 14일간 로그인 상태 유지
                </label>
                <div className="mt-6">
                  <Button full size="lg" onClick={() => setStep("otp")} icon={<Lock size={15} weight="bold" />}>
                    다음
                  </Button>
                </div>
              </div>
            )}

            {step === "otp" && (
              <div className="ot-enter">
                <button type="button" onClick={() => setStep("credential")} className="mb-4 text-[12.5px] text-[var(--ot-mute)]">
                  ← 이전 단계
                </button>
                <h1 className="text-[22px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ot-ink)]">
                  SMS 인증번호 6자리 입력
                </h1>
                <p className="mt-2 text-[13.5px] leading-5 text-[var(--ot-mute)]">
                  010-****-2847로 인증번호를 발송했습니다. (포트폴리오 목업 — 아무 숫자나 입력해도 진행됩니다)
                </p>
                <div className="mt-6">
                  <Input value={otp} onChange={setOtp} placeholder="123456" type="text" />
                </div>
                <div className="mt-6">
                  <Button full size="lg" onClick={() => onLogin(role)} icon={<ShieldCheck size={15} weight="bold" />}>
                    인증하고 콘솔 접속
                  </Button>
                </div>

                <div className="mt-8 border-t border-[var(--ot-hairline)] pt-5">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--ot-body)]">
                    <Devices size={13} />
                    최근 로그인 기록
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {loginHistory.map((h) => (
                      <li key={h.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                        <span className="text-[var(--ot-body)]">
                          {h.device} / {h.location}
                          {h.current && <span className="ml-1.5 text-[var(--ot-accent)]">(현재 세션)</span>}
                        </span>
                        <span className="ot-mono text-[var(--ot-mute)]">{h.at}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[var(--ot-nav-bg)] lg:block">
          <Image
            src="https://picsum.photos/id/1048/960/1400"
            alt="올려다본 유리 오피스 타워"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ot-nav-bg)] via-[var(--ot-nav-bg)]/60 to-[var(--ot-nav-bg)]/10" />
          <div className="relative flex h-full flex-col justify-end p-10">
            <p className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--ot-nav-mute)]">
              <ShieldCheck size={14} />
              스냅샷 단가 고정
            </p>
            <p className="mt-3 max-w-[36ch] text-[22px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ot-nav-fg)]">
              발주 시점 단가를 고정해 마감 금액 불일치를 원천 차단합니다.
            </p>
            <p className="mt-4 max-w-[38ch] text-[13.5px] leading-6 text-[var(--ot-nav-mute)]">
              원청, 납품처, 거래처가 하나의 타임라인 스레드에서 발주 생성부터 승인까지
              실시간으로 같은 맥락을 공유합니다. AI가 중복 발주와 단가 급변을 먼저 감지해
              담당자의 위험도 확인 시간을 줄입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
