"use client";

import { useEffect, useState } from "react";
import { AndroidLogo, AppleLogo, Check, CheckCircle, CircleNotch, CreditCard, Minus, Play, WarningCircle, XCircle } from "@phosphor-icons/react";
import { SUB_STATUS_LABEL, subscriptionActive } from "@/projects/platform/eduon/lib/access";
import { won } from "@/projects/platform/eduon/lib/format";
import { FIRST_MONTH_PRICE, ME, PRICE, TODAY } from "@/projects/platform/eduon/lib/mock-data";
import { addMonths, useStore } from "@/projects/platform/eduon/lib/store";
import { useSite, type GoOptions } from "@/projects/platform/eduon/components/site/site-context";
import { Btn, Dialog } from "@/projects/platform/eduon/components/site/ui";

/*
 * 구독 골격: 폼 + 고정 요약 패널. 데스크톱은 웹 카드 정기결제 버전,
 * 모바일 프레임 안(embed=1)은 앱 미리보기 버전(iOS / Android 스토어 구매 흐름 목업).
 * 결제수단은 등록된 카드 중에서 고른다. 결과 상태는 URL(?pay=, ?store=, ?restore=)로만 고른다.
 */

export type PayStep = "idle" | "form" | "pending" | "success" | "fail";
export type StoreStep = "idle" | "sheet" | "pending" | "success" | "cancel" | "fail";
export type RestoreResult = "success" | "none" | "other";

const COMPARE: Array<{ label: string; free: boolean; sub: boolean }> = [
  { label: "무료 공개 강의", free: true, sub: true },
  { label: "구독 전용 강좌의 미리보기 회차", free: true, sub: true },
  { label: "구독 대상 전체 강의", free: false, sub: true },
  { label: "자막, 화질 선택, 이어보기", free: true, sub: true },
];

const TEST_CARDS = [
  { key: "ok", label: "A카드 개인", note: "기본 결제수단", result: "success" as const },
  { key: "fail", label: "B카드 개인", note: "", result: "fail" as const },
];

export function SubscriptionScreen({
  returnTo,
  initialPay = "idle",
  initialStore = "idle",
  initialRestore = null,
  platform = "ios",
}: {
  returnTo?: GoOptions["returnTo"];
  initialPay?: PayStep;
  initialStore?: StoreStep;
  initialRestore?: RestoreResult | null;
  platform?: "ios" | "android";
}) {
  const { inApp } = useSite();
  return inApp ? (
    <AppVersion returnTo={returnTo} initialStore={initialStore} initialRestore={initialRestore} initialPlatform={platform} />
  ) : (
    <WebVersion returnTo={returnTo} initialPay={initialPay} />
  );
}

function PlanSummary() {
  return (
    <>
      <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.01em]">EduOn 구독 시작</h1>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[14px] text-[var(--eo-fg-3)]">첫 달 (원)</span>
        <span className="text-[32px] font-bold leading-[40px]">{won(FIRST_MONTH_PRICE)}</span>
        <span className="text-[15px] text-[var(--eo-fg-3)] line-through">{won(PRICE)}</span>
        <span className="text-[14px] text-[var(--eo-fg-2)]">둘째 달부터 월 {won(PRICE)}원</span>
      </div>
      <table className="mt-8 w-full text-[15px]">
        <thead>
          <tr className="border-b border-[var(--eo-hair)] text-[13px] text-[var(--eo-fg-3)]">
            <th className="py-2.5 text-left font-medium">이용 범위</th>
            <th className="w-[72px] py-2.5 text-center font-medium sm:w-[96px]">무료 회원</th>
            <th className="w-[72px] py-2.5 text-center font-semibold text-[var(--eo-brand-ink)] sm:w-[96px]">구독 회원</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE.map((r) => (
            <tr key={r.label} className="border-b border-[var(--eo-hair)]">
              <td className="py-3.5 pr-2">{r.label}</td>
              <td className="text-center">{r.free ? <Check size={18} weight="bold" className="mx-auto text-[var(--eo-fg-2)]" aria-label="이용 가능" /> : <Minus size={18} className="mx-auto text-[var(--eo-fg-3)]" aria-label="이용 불가" />}</td>
              <td className="text-center">{r.sub && <Check size={18} weight="bold" className="mx-auto text-[var(--eo-brand-ink)]" aria-label="이용 가능" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-8 space-y-3 text-[15px] leading-[24px] text-[var(--eo-fg-2)]">
        <li className="flex gap-2.5">
          <Check size={18} className="mt-[3px] shrink-0 text-[var(--eo-fg-3)]" />
          매월 같은 날 자동으로 갱신돼요. 다음 갱신일 전날까지 해지할 수 있어요.
        </li>
        <li className="flex gap-2.5">
          <Check size={18} className="mt-[3px] shrink-0 text-[var(--eo-fg-3)]" />
          갱신을 해지해도 이미 결제한 기간이 끝날 때까지 전체 강의를 볼 수 있어요.
        </li>
        <li className="flex gap-2.5">
          <Check size={18} className="mt-[3px] shrink-0 text-[var(--eo-fg-3)]" />
          웹에서 결제한 구독과 앱에서 구매한 구독은 같은 EduOn 계정의 이용 권한으로 연결돼요.
        </li>
      </ul>
    </>
  );
}

function ReturnNote({ returnTo }: { returnTo?: GoOptions["returnTo"] }) {
  const { course } = useStore();
  const c = returnTo ? course(returnTo.courseId) : undefined;
  if (!c || !returnTo) return null;
  return (
    <div className="mb-8 flex items-center gap-3 rounded-[16px] bg-[var(--eo-mint-band)] px-4 py-3 text-[14px] text-[var(--eo-fg-2)]">
      <Play size={16} weight="fill" className="shrink-0 text-[var(--eo-brand-ink)]" />
      <span className="min-w-0">
        구독하면 <span className="font-semibold text-[var(--eo-fg)]">{c.title}</span> {returnTo.episode}강을 바로 이어서 재생해요.
      </span>
    </div>
  );
}

function SuccessBlock({ returnTo, channelLabel }: { returnTo?: GoOptions["returnTo"]; channelLabel: string }) {
  const { go } = useSite();
  const { course, mySub } = useStore();
  const c = returnTo ? course(returnTo.courseId) : undefined;
  return (
    <div className="eo-rise">
      <CheckCircle size={40} weight="fill" className="text-[var(--eo-green-dk)]" />
      <h2 className="mt-4 text-[24px] font-bold leading-[34px]">구독이 시작됐어요</h2>
      <dl className="mt-5 grid grid-cols-[112px_1fr] gap-y-2 text-[15px]">
        <dt className="text-[var(--eo-fg-3)]">구매 경로</dt>
        <dd>{channelLabel}</dd>
        <dt className="text-[var(--eo-fg-3)]">다음 갱신 예정일</dt>
        <dd>{mySub.periodEnd ?? addMonths(TODAY, 1)}</dd>
        <dt className="text-[var(--eo-fg-3)]">계정</dt>
        <dd>{ME.email}</dd>
      </dl>
      <div className="mt-8 flex flex-wrap gap-2">
        {c && returnTo ? (
          <Btn variant="brand" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => go("watch", { courseId: c.id, episode: returnTo.episode })}>
            {returnTo.episode}강 이어서 재생
          </Btn>
        ) : (
          <Btn variant="brand" size="lg" onClick={() => go("home", { anchor: "explore" })}>
            강의 둘러보기
          </Btn>
        )}
        <Btn variant="outline" size="lg" onClick={() => go("membership")}>
          내 구독
        </Btn>
      </div>
    </div>
  );
}

/* 이미 구독 중이면 결제 폼 대신 현재 상태를 보여 준다 */
function AlreadySubscribed() {
  const { mySub } = useStore();
  const { go } = useSite();
  return (
    <div>
      <div className="text-[14px] font-semibold text-[var(--eo-brand-ink)]">{SUB_STATUS_LABEL[mySub.status]}</div>
      <p className="mt-2 text-[16px] leading-[26px] text-[var(--eo-fg-2)]">
        {mySub.status === "cancelled" ? `${mySub.periodEnd}까지 전체 강의를 볼 수 있어요.` : `다음 갱신 예정일은 ${mySub.periodEnd}이에요.`}
      </p>
      <Btn variant="outline" className="mt-5" onClick={() => go("membership")}>
        내 구독 관리
      </Btn>
    </div>
  );
}

function WebVersion({ returnTo, initialPay }: { returnTo?: GoOptions["returnTo"]; initialPay: PayStep }) {
  const { mySub, subscribe } = useStore();
  const [step, setStep] = useState<PayStep>(initialPay);
  const [card, setCard] = useState(TEST_CARDS[0].key);
  const [agree, setAgree] = useState({ billing: initialPay !== "idle", notice: initialPay !== "idle" });
  const active = subscriptionActive(mySub.status) && step !== "success";

  useEffect(() => {
    if (step !== "pending") return;
    const result = TEST_CARDS.find((c) => c.key === card)?.result ?? "success";
    const id = window.setTimeout(() => {
      if (result === "success") subscribe("web");
      setStep(result);
    }, 1800);
    return () => window.clearTimeout(id);
  }, [step, card, subscribe]);

  return (
    <div className="mx-auto max-w-[1328px] px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ReturnNote returnTo={returnTo} />
          <PlanSummary />
        </div>

        <aside className="lg:sticky lg:top-[96px] lg:col-span-5">
          <div className="rounded-[24px] bg-[var(--eo-raised)] p-6 md:p-7">
            {step === "success" ? (
              <SuccessBlock returnTo={returnTo} channelLabel="웹 카드 정기결제" />
            ) : active ? (
              <AlreadySubscribed />
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[18px] font-semibold">카드 정기결제</h2>
                </div>
                <dl className="mt-5 space-y-3 border-b border-[var(--eo-hair)] pb-5 text-[15px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--eo-fg-3)]">상품</dt>
                    <dd>EduOn 월 구독</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--eo-fg-3)]">이용 기간</dt>
                    <dd className="whitespace-nowrap">
                      {TODAY} ~ {addMonths(TODAY, 1)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--eo-fg-3)]">다음 갱신 예정일</dt>
                    <dd className="whitespace-nowrap">{addMonths(TODAY, 1)}</dd>
                  </div>
                </dl>
                <div className="flex items-baseline justify-between pt-5">
                  <span className="text-[15px] text-[var(--eo-fg-2)]">오늘 결제 금액 (원)</span>
                  <span className="text-[26px] font-bold">{won(FIRST_MONTH_PRICE)}</span>
                </div>

                {step === "fail" && (
                  <div className="mt-5 flex gap-2.5 rounded-[10px] bg-[rgba(240,138,138,0.1)] px-4 py-3 text-[14px] leading-[22px] text-[var(--eo-red-dk)]">
                    <XCircle size={18} className="mt-0.5 shrink-0" />
                    <span>카드사에서 결제를 거절했어요 (한도 초과). 다른 카드로 다시 시도해 주세요.</span>
                  </div>
                )}

                <Btn variant="signature" size="lg" className="mt-6 w-full" icon={<CreditCard size={20} />} onClick={() => setStep("form")}>
                  {step === "fail" ? "다른 카드로 결제" : "할인 받고 구독 시작하기"}
                </Btn>
              </>
            )}
          </div>
        </aside>
      </div>

      <Dialog
        open={step === "form" || step === "pending"}
        onClose={() => step !== "pending" && setStep("idle")}
        title={step === "pending" ? "결제를 확인하고 있어요" : "결제수단 등록"}
        footer={
          step === "pending" ? null : (
            <>
              <Btn variant="ghost" onClick={() => setStep("idle")}>
                취소
              </Btn>
              <Btn variant="brand" disabled={!agree.billing || !agree.notice} onClick={() => setStep("pending")}>
                {won(FIRST_MONTH_PRICE)}원 결제
              </Btn>
            </>
          )
        }
      >
        {step === "pending" ? (
          <div className="flex items-center gap-3 py-4">
            <CircleNotch size={22} className="animate-spin text-[var(--eo-brand-ink)]" />
            <span>카드사 승인 결과를 기다리는 중이에요. 창을 닫지 마세요.</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[var(--eo-fg)]">결제 카드</span>
            </div>
            <div className="mt-2 space-y-2" role="radiogroup" aria-label="결제 카드">
              {TEST_CARDS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="radio"
                  aria-checked={card === c.key}
                  onClick={() => setCard(c.key)}
                  className={`flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors ${
                    card === c.key ? "border-[var(--eo-brand)] bg-[var(--eo-brand-soft)]" : "border-[var(--eo-hair-2)] hover:bg-[var(--eo-raised-2)]"
                  }`}
                >
                  <CreditCard size={20} className="shrink-0 text-[var(--eo-fg-2)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-[var(--eo-fg)]">{c.label}</span>
                    <span className="eo-mono block text-[13px] text-[var(--eo-fg-3)]">**** **** **** {c.key === "ok" ? "4242" : "0002"}</span>
                  </span>
                  {c.note && <span className="text-[13px] text-[var(--eo-fg-3)]">{c.note}</span>}
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-2.5">
              <Check2 checked={agree.billing} onChange={(v) => setAgree((a) => ({ ...a, billing: v }))}>
                첫 달 {won(FIRST_MONTH_PRICE)}원, 이후 매월 {won(PRICE)}원 정기결제에 동의해요
              </Check2>
              <Check2 checked={agree.notice} onChange={(v) => setAgree((a) => ({ ...a, notice: v }))}>
                자동 갱신과 해지 방법 안내를 확인했어요
              </Check2>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}

function Check2({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[var(--eo-fg)]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-[18px] w-[18px] shrink-0 accent-[var(--eo-brand)]" />
      {children}
    </label>
  );
}

/* ---------- 앱 미리보기 버전 (모바일 프레임 안) ---------- */

function AppVersion({
  returnTo,
  initialStore,
  initialRestore,
  initialPlatform,
}: {
  returnTo?: GoOptions["returnTo"];
  initialStore: StoreStep;
  initialRestore: RestoreResult | null;
  initialPlatform: "ios" | "android";
}) {
  const { mySub, subscribe } = useStore();
  const [platform, setPlatform] = useState<"ios" | "android">(initialPlatform);
  const [step, setStep] = useState<StoreStep>(initialStore);
  const [restore, setRestore] = useState<RestoreResult | null>(initialRestore);
  /* 복원 결과는 ?restore=로 고르고 기본은 성공 */
  const restoreScenario: RestoreResult = initialRestore ?? "success";
  const active = subscriptionActive(mySub.status) && step !== "success";
  const storeName = platform === "ios" ? "App Store" : "Google Play";

  useEffect(() => {
    if (step !== "pending") return;
    const id = window.setTimeout(() => {
      subscribe(platform);
      setStep("success");
    }, 1500);
    return () => window.clearTimeout(id);
  }, [step, platform, subscribe]);

  return (
    <div className="px-4 pb-24 pt-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-[10px] bg-[var(--eo-raised-2)] p-1" role="radiogroup" aria-label="앱 플랫폼">
          {(["ios", "android"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={platform === p}
              onClick={() => setPlatform(p)}
              className={`flex h-9 items-center gap-1.5 rounded-[8px] px-3 text-[14px] font-semibold ${platform === p ? "bg-[var(--eo-fg)] text-[var(--eo-canvas)]" : "text-[var(--eo-fg-2)]"}`}
            >
              {p === "ios" ? <AppleLogo size={16} weight="fill" /> : <AndroidLogo size={16} weight="fill" />}
              {p === "ios" ? "iOS" : "Android"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <ReturnNote returnTo={returnTo} />
      </div>

      {step === "success" ? (
        <SuccessBlock returnTo={returnTo} channelLabel={`${storeName} 인앱 구독`} />
      ) : active ? (
        <div className="rounded-[24px] bg-[var(--eo-raised)] p-5">
          <AlreadySubscribed />
        </div>
      ) : (
        <>
          <PlanSummary />
          {step === "cancel" && <Notice tone="gray">구매를 취소했어요. 결제되지 않았어요.</Notice>}
          {step === "fail" && <Notice tone="red">{storeName}에서 구매를 완료하지 못했어요. 결제 수단을 확인한 뒤 다시 시도해 주세요.</Notice>}
          <div className="mt-8 space-y-2">
            <Btn variant="signature" size="lg" className="w-full" onClick={() => setStep("sheet")}>
              할인 받고 구독 시작하기
            </Btn>
            <Btn variant="ghost" size="lg" className="w-full" onClick={() => setRestore(restoreScenario)}>
              구매 복원
            </Btn>
          </div>
          <p className="mt-3 text-[13px] leading-[20px] text-[var(--eo-fg-3)]">
            결제와 해지는 {storeName} 계정에서 관리돼요. 웹에서 이미 구독했다면 같은 계정으로 로그인하면 바로 이용할 수 있어요.
          </p>
        </>
      )}

      {/* 스토어 구매 확인창 */}
      {(step === "sheet" || step === "pending") && (
        <div className="fixed inset-0 z-50 flex items-end">
          <button type="button" aria-label="닫기" onClick={() => step === "sheet" && setStep("cancel")} className="eo-fade absolute inset-0 bg-black/55" />
          <div
            className={`relative w-full rounded-t-[16px] p-5 pb-8 [animation:eo-sheet-up_300ms_var(--eo-ease)_both] ${
              platform === "ios" ? "bg-[#f2f2f4] text-[#111]" : "bg-white text-[#1f1f1f]"
            }`}
          >
            <style>{`@keyframes eo-sheet-up{from{transform:translateY(100%)}to{transform:none}}`}</style>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#666]">{storeName}</span>
              {step === "sheet" && (
                <button type="button" onClick={() => setStep("cancel")} className="h-9 rounded-[8px] px-2 text-[14px] font-semibold text-[#2563c9]">
                  취소
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-[12px] bg-white px-4 py-3 ring-1 ring-black/5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#0f1216] text-[13px] font-bold text-[var(--eo-brand-ink)]">On</span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold">EduOn 월 구독</div>
                <div className="text-[13px] text-[#666]">EduOn | 자동 갱신</div>
              </div>
              <div className="whitespace-nowrap text-right text-[15px] font-semibold leading-[20px]">₩{won(FIRST_MONTH_PRICE)}<span className="block text-[12px] font-medium text-[#666]">이후 ₩{won(PRICE)}/월</span></div>
            </div>
            <dl className="mt-3 space-y-1.5 px-1 text-[13px] text-[#555]">
              <div className="flex justify-between">
                <dt>계정</dt>
                <dd>{platform === "ios" ? "dabin.j@icloud.example" : "dabin.j@gmail.example"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>갱신</dt>
                <dd>{addMonths(TODAY, 1)}부터 매월</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled={step === "pending"}
              onClick={() => setStep("pending")}
              className={`mt-4 flex h-12 w-full items-center justify-center gap-2 text-[16px] font-semibold text-white ${
                platform === "ios" ? "rounded-[12px] bg-[#2563c9]" : "rounded-full bg-[#1a7f4e]"
              }`}
            >
              {step === "pending" ? <CircleNotch size={20} className="animate-spin" /> : null}
              {step === "pending" ? "구매 확인 중" : platform === "ios" ? "구독" : "정기 결제"}
            </button>
          </div>
        </div>
      )}

      {/* 구매 복원 */}
      <Dialog
        open={restore !== null}
        onClose={() => setRestore(null)}
        title={restore === "success" ? "구매를 복원했어요" : restore === "none" ? "복원할 구매가 없어요" : "다른 계정에 연결된 구매예요"}
        footer={
          restore === "success" ? (
            <Btn
              variant="brand"
              onClick={() => {
                subscribe(platform, "구매 복원");
                setRestore(null);
                setStep("success");
              }}
            >
              확인
            </Btn>
          ) : (
            <Btn
              variant="outline"
              onClick={() => setRestore(null)}
            >
              닫기
            </Btn>
          )
        }
      >
        {restore === "success" ? (
          <p>{storeName}에서 구독 1건을 찾아 이 계정({ME.email})에 연결했어요.</p>
        ) : restore === "none" ? (
          <p>이 {storeName} 계정으로 구매한 EduOn 구독이 없어요. 웹에서 구독했다면 같은 EduOn 계정으로 로그인해 주세요.</p>
        ) : (
          <p className="flex gap-2">
            <WarningCircle size={18} className="mt-1 shrink-0 text-[var(--eo-orange-dk)]" />
            이 구매는 다른 EduOn 계정(mi***@inbox.kr)에 연결되어 있어요. 그 계정으로 로그인하거나 고객센터에 계정 이전을 요청해 주세요.
          </p>
        )}
      </Dialog>
    </div>
  );
}

function Notice({ tone, children }: { tone: "red" | "gray"; children: React.ReactNode }) {
  return (
    <div
      className={`mt-6 rounded-[10px] px-4 py-3 text-[14px] leading-[22px] ${
        tone === "red" ? "bg-[rgba(240,138,138,0.1)] text-[var(--eo-red-dk)]" : "bg-[var(--eo-raised-2)] text-[var(--eo-fg-2)]"
      }`}
    >
      {children}
    </div>
  );
}
