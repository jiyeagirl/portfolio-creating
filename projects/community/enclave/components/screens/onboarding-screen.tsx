"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AppleLogo,
  Buildings,
  CaretLeft,
  CheckCircle,
  ChatCircle,
  Clock,
  GoogleLogo,
  House,
  MagnifyingGlass,
  SealCheck,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Badge, Button, DongHoTag, HeroCard } from "@/projects/community/enclave/components/ui";
import { COMPLEX_SEARCH_RESULTS, ME, MY_COMPLEX } from "@/projects/community/enclave/lib/mock-data";
import type { ProductCategory } from "@/projects/community/enclave/lib/types";

const TOTAL_STEPS = 6;
const INTEREST_OPTIONS: ProductCategory[] = ["전자기기", "가구/인테리어", "패션/잡화", "취미/악기", "생활가전", "스포츠/레저"];
const DEAL_WINDOWS = ["평일 저녁 7시 ~ 10시", "평일 오전 8시 ~ 10시", "주말 오후", "언제든 가능"];

/* 스크린샷 도구가 넘기는 `?step=` 값을 읽어 해당 스텝에서 시작한다(캡처 전용,
   일반 사용 흐름에는 영향 없음). src/index.tsx의 `?screen=` 처리와 같은 이유로
   서버 스냅샷을 빈 값으로 둬 hydration 불일치를 피한다.
   뒤 단계일수록 앞 단계 입력값도 그럴듯하게 채워서, 어느 스텝으로 바로 진입해도
   완성된 화면으로 보인다(habitkong 온보딩과 같은 취지). initialStep은 하이드레이션
   이후에야 실제 값으로 올라오므로, 각 필드는 useState 초기값에 바로 굳히지 않고
   "override ?? initialStep 기반 기본값"으로 매 렌더 다시 계산한다(= step 자체를
   stepOverride ?? initialStep으로 두는 것과 같은 패턴) — effect에서 setState하지
   않아도 initialStep이 갱신되는 순간 자동으로 반영된다. */
const subscribeToNothing = () => () => {};

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initialStep = useMemo(() => {
    const requested = Number(new URLSearchParams(search).get("step"));
    return Number.isInteger(requested) && requested >= 0 && requested <= TOTAL_STEPS ? requested : 0;
  }, [search]);

  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const step = stepOverride ?? initialStep;

  const [agreedTermsOverride, setAgreedTermsOverride] = useState<boolean | null>(null);
  const agreedTerms = agreedTermsOverride ?? initialStep >= 2;

  const [phoneOverride, setPhoneOverride] = useState<string | null>(null);
  const phone = phoneOverride ?? (initialStep >= 3 ? "01012345678" : "");

  const [codeSentOverride, setCodeSentOverride] = useState<boolean | null>(null);
  const codeSent = codeSentOverride ?? initialStep >= 3;

  const [complexIdOverride, setComplexIdOverride] = useState<string | null | undefined>(undefined);
  const complexId = complexIdOverride === undefined ? (initialStep >= 4 ? MY_COMPLEX.id : null) : complexIdOverride;

  const [dongOverride, setDongOverride] = useState<string | null>(null);
  const dong = dongOverride ?? (initialStep >= 5 ? ME.dong : "");

  const [hoOverride, setHoOverride] = useState<string | null>(null);
  const ho = hoOverride ?? (initialStep >= 5 ? ME.ho : "");

  const [complexVerifiedOverride, setComplexVerifiedOverride] = useState<boolean | null>(null);
  const complexVerified = complexVerifiedOverride ?? initialStep >= 5;

  const [nicknameOverride, setNicknameOverride] = useState<string | null>(null);
  const nickname = nicknameOverride ?? (initialStep >= 6 ? ME.nickname : "");

  const [interestsOverride, setInterestsOverride] = useState<ProductCategory[] | null>(null);
  const interests: ProductCategory[] =
    interestsOverride ?? (initialStep >= 6 ? ["전자기기", "취미/악기", "가구/인테리어"] : ["전자기기"]);

  const [dealWindow, setDealWindow] = useState(DEAL_WINDOWS[0]);

  const setAgreedTerms = setAgreedTermsOverride;
  const setPhone = setPhoneOverride;
  const setCodeSent = setCodeSentOverride;
  const setComplexId = setComplexIdOverride;
  const setDong = setDongOverride;
  const setHo = setHoOverride;
  const setComplexVerified = setComplexVerifiedOverride;
  const setNickname = setNicknameOverride;

  function next() {
    if (step < TOTAL_STEPS) setStepOverride(step + 1);
    else onComplete();
  }
  function back() {
    if (step > 0) setStepOverride(step - 1);
  }
  function toggleInterest(category: ProductCategory) {
    setInterestsOverride(interests.includes(category) ? interests.filter((c) => c !== category) : [...interests, category]);
  }

  const canProceed =
    step === 1
      ? true
      : step === 2
        ? agreedTerms
        : step === 3
          ? phone.length >= 9 && codeSent
          : step === 4
            ? complexId !== null
            : step === 5
              ? dong.length > 0 && ho.length > 0 && complexVerified
              : step === 6
                ? nickname.trim().length > 0 && interests.length > 0
                : true;

  return (
    <div className="enclave flex h-full flex-col bg-[var(--ec-surface)]">
      {step > 0 && (
        <div className="flex items-center gap-2 pt-[59px] px-4 pb-2">
          <button
            type="button"
            onClick={back}
            aria-label="이전"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ec-ink)] transition-colors active:bg-[var(--ec-surface-soft)]"
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <div className="flex flex-1 items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--ec-surface-sunken)]">
                <span
                  className="block h-full rounded-full bg-[var(--ec-accent)] transition-all duration-500"
                  style={{ width: i + 1 <= step ? "100%" : "0%" }}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto ec-scroll px-6 pb-6 ${step === 0 ? "pt-[59px]" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex h-full flex-col"
          >
            {step === 0 && <SplashStep />}
            {step === 1 && <LoginStep />}
            {step === 2 && <TermsStep agreed={agreedTerms} onChange={setAgreedTerms} />}
            {step === 3 && (
              <PhoneStep phone={phone} setPhone={setPhone} codeSent={codeSent} setCodeSent={setCodeSent} />
            )}
            {step === 4 && <ComplexSearchStep selected={complexId} onSelect={setComplexId} />}
            {step === 5 && (
              <ComplexVerifyStep
                complexName={COMPLEX_SEARCH_RESULTS.find((c) => c.id === complexId)?.name ?? ""}
                dong={dong}
                ho={ho}
                setDong={setDong}
                setHo={setHo}
                verified={complexVerified}
                onVerify={() => setComplexVerified(true)}
              />
            )}
            {step === 6 && (
              <ProfileStep
                nickname={nickname}
                setNickname={setNickname}
                interests={interests}
                onToggleInterest={toggleInterest}
                dealWindow={dealWindow}
                setDealWindow={setDealWindow}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 pt-2">
        <Button full size="lg" onClick={next} disabled={!canProceed}>
          {step === 0 ? "시작하기" : step === TOTAL_STEPS ? "Enclave 시작하기" : "다음"}
        </Button>
      </div>
    </div>
  );
}

function SplashStep() {
  const checks = ["단지 인증 기반 안전거래", "무인택배함 비대면 픽업", "같은 단지 이웃끼리만"];
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 pt-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--ec-accent)] text-white shadow-[var(--ec-shadow-pop)]">
        <Buildings size={36} weight="fill" />
      </div>
      <div>
        <h1 className="text-[30px] font-bold leading-[36px] tracking-[-0.02em] text-[var(--ec-ink)]">Enclave</h1>
        <p className="mt-2 text-[14.5px] leading-[21px] text-[var(--ec-body)]">
          우리 단지 사람들끼리만<br />안전하게 만나는 하이퍼로컬 거래
        </p>
      </div>
      <div className="w-full space-y-2.5 rounded-[16px] border border-[var(--ec-border)] p-4 text-left">
        {checks.map((label) => (
          <div key={label} className="flex items-center gap-2 text-[13.5px] text-[var(--ec-body)]">
            <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--ec-accent)]" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginStep() {
  const social = [
    { label: "카카오로 계속하기", bg: "bg-[#FEE500]", text: "text-[#191600]" },
    { label: "Apple로 계속하기", bg: "bg-[var(--ec-ink)]", text: "text-white" },
    { label: "Google로 계속하기", bg: "bg-[var(--ec-surface)] border border-[var(--ec-border-strong)]", text: "text-[var(--ec-ink)]" },
  ];
  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div>
        <h1 className="text-[21px] font-bold leading-[27px] text-[var(--ec-ink)]">간편하게 시작해요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--ec-body)]">기존 회원이면 자동으로 로그인돼요</p>
      </div>
      <div className="space-y-2.5">
        {social.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={`flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full text-[15px] font-semibold transition-transform active:scale-[0.97] ${s.bg} ${s.text}`}
          >
            {i === 0 && <ChatCircle size={18} weight="fill" />}
            {i === 1 && <AppleLogo size={18} weight="fill" />}
            {i === 2 && <GoogleLogo size={18} weight="bold" />}
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TermsStep({ agreed, onChange }: { agreed: boolean; onChange: (v: boolean) => void }) {
  const terms = [
    "서비스 이용약관 동의 (필수)",
    "개인정보 수집 및 이용 동의 (필수)",
    "단지 인증 정보 활용 동의 (필수)",
    "이벤트 및 혜택 알림 수신 동의 (선택)",
  ];
  return (
    <div className="flex flex-1 flex-col justify-center gap-7">
      <div>
        <h1 className="text-[21px] font-bold leading-[27px] text-[var(--ec-ink)]">약관에 동의해주세요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--ec-body)]">안전한 거래를 위해 필수 항목에 동의가 필요해요</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!agreed)}
        className="flex items-center gap-2.5 rounded-[14px] border border-[var(--ec-border-strong)] px-4 py-3.5"
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            agreed ? "border-[var(--ec-accent)] bg-[var(--ec-accent)]" : "border-[var(--ec-border-strong)]"
          }`}
        >
          {agreed && <CheckCircle size={13} weight="fill" className="text-white" />}
        </span>
        <span className="text-[14px] font-semibold text-[var(--ec-ink)]">전체 동의합니다</span>
      </button>
      <ul className="space-y-3 px-1">
        {terms.map((t) => (
          <li key={t} className="flex items-center gap-2 text-[13px] text-[var(--ec-body)]">
            <CheckCircle size={14} weight={agreed ? "fill" : "regular"} className={agreed ? "text-[var(--ec-accent)]" : "text-[var(--ec-muted)]"} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhoneStep({
  phone,
  setPhone,
  codeSent,
  setCodeSent,
}: {
  phone: string;
  setPhone: (v: string) => void;
  codeSent: boolean;
  setCodeSent: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-7">
      <div>
        <Badge tone="accent">본인인증</Badge>
        <h1 className="mt-3 text-[21px] font-bold leading-[27px] text-[var(--ec-ink)]">휴대폰 본인인증을 진행할게요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--ec-body)]">중복 가입 방지를 위해 실명 인증을 확인합니다</p>
      </div>
      <div className="space-y-3">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="휴대폰 번호 입력"
          inputMode="numeric"
          className="h-[52px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] px-4 tabular-nums text-[15px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
        />
        {!codeSent ? (
          <Button variant="secondary" full onClick={() => setCodeSent(true)} disabled={phone.length < 9}>
            인증번호 받기
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-[12px] border border-[var(--ec-accent)] bg-[var(--ec-accent-soft)] px-4 py-3.5 text-[13.5px] font-medium text-[var(--ec-accent-ink)]">
            <SealCheck size={18} weight="fill" />
            인증번호가 전송됐어요, 자동으로 확인 중입니다
          </div>
        )}
      </div>
    </div>
  );
}

function ComplexSearchStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const results = COMPLEX_SEARCH_RESULTS.filter((c) => (query ? c.name.includes(query) : true));
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-[21px] font-bold leading-[27px] text-[var(--ec-ink)]">우리 단지를 찾아주세요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--ec-body)]">아파트 또는 오피스텔 이름으로 검색해요</p>
      </div>
      <div className="relative">
        <MagnifyingGlass size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ec-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="단지명 검색"
          className="h-[48px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] pl-10 pr-4 text-[14px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
        />
      </div>
      <div className="space-y-2.5">
        {results.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-colors ${
              selected === c.id ? "border-[var(--ec-accent)] bg-[var(--ec-accent-soft)]" : "border-[var(--ec-border)]"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--ec-surface-sunken)] text-[var(--ec-body)]">
              <Buildings size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px] font-semibold text-[var(--ec-ink)]">{c.name}</p>
              <p className="truncate text-[12px] text-[var(--ec-muted)]">{c.address}</p>
            </div>
            {selected === c.id && <CheckCircle size={18} weight="fill" className="shrink-0 text-[var(--ec-accent)]" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function ComplexVerifyStep({
  complexName,
  dong,
  ho,
  setDong,
  setHo,
  verified,
  onVerify,
}: {
  complexName: string;
  dong: string;
  ho: string;
  setDong: (v: string) => void;
  setHo: (v: string) => void;
  verified: boolean;
  onVerify: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <div>
        <Badge tone="accent" icon={<House size={12} weight="fill" />}>
          단지 인증
        </Badge>
        <h1 className="mt-3 text-[21px] font-bold leading-[27px] text-[var(--ec-ink)]">동/호수를 입력해주세요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--ec-body)]">{complexName} 입주민 인증을 진행해요</p>
      </div>
      {!verified ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={dong}
              onChange={(e) => setDong(e.target.value)}
              placeholder="예: 104동"
              className="h-[52px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] px-4 text-[15px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
            />
            <input
              value={ho}
              onChange={(e) => setHo(e.target.value)}
              placeholder="예: 1502호"
              className="h-[52px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] px-4 text-[15px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
            />
          </div>
          <p className="text-[12.5px] leading-5 text-[var(--ec-muted)]">
            관리비 고지서 사진 또는 관리사무소 확인서를 업로드하면 담당자 검수 후 인증이 완료돼요. 이 목업에서는 바로 인증 완료로 진행합니다.
          </p>
          <Button variant="secondary" full disabled={!dong || !ho} onClick={onVerify}>
            인증 서류 제출하기
          </Button>
        </>
      ) : (
        <HeroCard className="mt-2">
          <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]">
              <ShieldCheck size={26} weight="fill" />
            </span>
            <p className="text-[17px] font-bold text-[var(--ec-ink)]">단지 인증 완료</p>
            <DongHoTag dong={dong} ho={ho} />
            <p className="text-[12.5px] leading-5 text-[var(--ec-muted)]">
              이제 {complexName} 이웃들의 게시글과 무인택배함을 이용할 수 있어요
            </p>
          </div>
        </HeroCard>
      )}
    </div>
  );
}

function ProfileStep({
  nickname,
  setNickname,
  interests,
  onToggleInterest,
  dealWindow,
  setDealWindow,
}: {
  nickname: string;
  setNickname: (v: string) => void;
  interests: ProductCategory[];
  onToggleInterest: (c: ProductCategory) => void;
  dealWindow: string;
  setDealWindow: (v: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <div>
        <h1 className="text-[21px] font-bold leading-[27px] text-[var(--ec-ink)]">프로필을 완성해주세요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--ec-body)]">닉네임과 관심 카테고리로 맞춤 피드를 만들어요</p>
      </div>
      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">닉네임</p>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예: 3단지산책러"
          className="h-[48px] w-full rounded-[12px] border border-[var(--ec-border-strong)] bg-[var(--ec-surface)] px-4 text-[14.5px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
        />
      </div>
      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">관심 카테고리</p>
        <div className="flex flex-wrap gap-1.5">
          {INTEREST_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onToggleInterest(c)}
              aria-pressed={interests.includes(c)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                interests.includes(c)
                  ? "border-[var(--ec-accent)] bg-[var(--ec-accent)] text-white"
                  : "border-[var(--ec-border)] text-[var(--ec-body)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--ec-body)]">거래 가능 시간</p>
        <div className="grid grid-cols-2 gap-2">
          {DEAL_WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setDealWindow(w)}
              aria-pressed={dealWindow === w}
              className={`flex items-center gap-1.5 rounded-[12px] border px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                dealWindow === w
                  ? "border-[var(--ec-accent)] bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]"
                  : "border-[var(--ec-border)] text-[var(--ec-body)]"
              }`}
            >
              <Clock size={13} />
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
