"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  AppleLogo,
  ArrowRight,
  Buildings,
  CaretLeft,
  ChatCircle,
  CheckCircle,
  SealCheck,
  Clock,
  GoogleLogo,
  House,
  MapPinLine,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Badge, Button } from "@/projects/community/waypoint/components/ui";
import { picsumId } from "@/projects/community/waypoint/lib/mock-data";

const STEP_LABELS = ["스플래시", "로그인", "본인인증", "집 인증", "회사 인증", "동선 등록"];
const ROUTE_LINES = ["2호선", "9호선", "GTX-A", "공항철도", "신분당선"];
const COMMUTE_WINDOWS = ["07:00 ~ 09:00", "08:00 ~ 10:00", "18:00 ~ 20:00", "19:00 ~ 21:00"];

/* 스크린샷 도구가 넘기는 `?step=` 값을 읽어 해당 스텝에서 시작한다(캡처 전용,
   일반 사용 흐름에는 영향 없음). src/index.tsx의 `?screen=` 처리와 같은 이유로
   서버 스냅샷을 빈 값으로 둬 hydration 불일치를 피한다. */
const subscribeToNothing = () => () => {};

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initialStep = useMemo(() => {
    const requested = Number(new URLSearchParams(search).get("step"));
    return Number.isInteger(requested) && requested >= 0 && requested <= 5 ? requested : 0;
  }, [search]);

  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const step = stepOverride ?? initialStep;
  const setStep = (next: number) => setStepOverride(next);
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [homeVerified, setHomeVerified] = useState(false);
  const [workVerified, setWorkVerified] = useState(false);
  const [selectedLines, setSelectedLines] = useState<string[]>(["2호선"]);
  const [selectedWindow, setSelectedWindow] = useState(COMMUTE_WINDOWS[1]);
  const [recommendOn, setRecommendOn] = useState(true);

  function next() {
    if (step < 5) setStep(step + 1);
    else onComplete();
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }
  function toggleLine(line: string) {
    setSelectedLines((prev) => (prev.includes(line) ? prev.filter((l) => l !== line) : [...prev, line]));
  }

  const canProceed =
    step === 1 ? true : step === 2 ? phone.length >= 9 && codeSent : step === 3 ? homeVerified : step === 4 ? workVerified : true;

  return (
    <div className="waypoint flex h-full flex-col bg-[var(--wp-surface)]">
      {step > 0 && (
        <div className="flex items-center gap-2 pt-[59px] px-4 pb-2">
          <button
            type="button"
            onClick={back}
            aria-label="이전"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--wp-ink)] transition-colors active:bg-[var(--wp-surface-soft)]"
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <div className="flex flex-1 items-center gap-1.5">
            {STEP_LABELS.slice(1).map((_, i) => (
              <span
                key={i}
                className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--wp-surface-sunken)]"
              >
                <span
                  className="block h-full rounded-full bg-[var(--wp-accent)] transition-all duration-500"
                  style={{ width: i + 1 <= step ? "100%" : "0%" }}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto px-6 pb-6 ${step === 0 ? "pt-[59px]" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            /* CLAUDE.md `## Motion` → "스케일 복제 금지". 워크스페이스 12개 파일이 쓰는
               spring 300/30을 그대로 쓰지 않는다. 이 프로젝트는 CSS 쪽 진입도
               `240ms cubic-bezier(0.33, 1, 0.68, 1)`로 갈았으므로 여기서도 같은 계열의
               tween으로 맞춘다 — 온보딩만 스프링으로 튀면 앱이 두 언어를 쓰게 된다. */
            transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
            className="flex h-full flex-col"
          >
            {step === 0 && <SplashStep />}
            {step === 1 && <LoginStep />}
            {step === 2 && (
              <PhoneStep phone={phone} setPhone={setPhone} codeSent={codeSent} setCodeSent={setCodeSent} />
            )}
            {step === 3 && <HomeGpsStep verified={homeVerified} onVerify={() => setHomeVerified(true)} />}
            {step === 4 && (
              <WorkGpsStep verified={workVerified} onVerify={() => setWorkVerified(true)} />
            )}
            {step === 5 && (
              <RouteStep
                selectedLines={selectedLines}
                onToggleLine={toggleLine}
                selectedWindow={selectedWindow}
                onSelectWindow={setSelectedWindow}
                recommendOn={recommendOn}
                onToggleRecommend={() => setRecommendOn((v) => !v)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 pt-2">
        <Button full size="lg" onClick={next} disabled={!canProceed}>
          {step === 0 ? "시작하기" : step === 5 ? "웨이포인트 시작하기" : "다음"}
        </Button>
      </div>
    </div>
  );
}

function SplashStep() {
  const checks = ["자동 로그인 확인 완료", "위치 권한 허용됨", "최신 버전입니다"];
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 pt-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[var(--wp-accent)] text-white shadow-[var(--wp-shadow-pop)]">
        <MapPinLine size={38} weight="fill" />
      </div>
      <div>
        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em] text-[var(--wp-ink)]">
          Waypoint
        </h1>
        <p className="mt-2 text-[15px] leading-[22px] text-[var(--wp-body)]">
          집과 회사, 두 곳을 인증한 동선 기반<br />하이퍼로컬 안전거래
        </p>
      </div>
      <div className="w-full space-y-2.5 rounded-[18px] border border-[var(--wp-border)] p-4 text-left">
        {checks.map((label) => (
          <div key={label} className="flex items-center gap-2 text-[13.5px] text-[var(--wp-body)]">
            <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--wp-success)]" />
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
    { label: "Apple로 계속하기", bg: "bg-[var(--wp-ink)]", text: "text-white" },
    { label: "Google로 계속하기", bg: "bg-[var(--wp-surface)] border border-[var(--wp-border-strong)]", text: "text-[var(--wp-ink)]" },
  ];
  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div>
        <h1 className="text-[22px] font-bold leading-[28px] text-[var(--wp-ink)]">간편하게 시작해요</h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--wp-body)]">
          기존 회원이면 자동으로 로그인돼요
        </p>
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
      <p className="text-center text-[11.5px] leading-4 text-[var(--wp-muted)]">
        계속 진행 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다
      </p>
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
        <Badge tone="accent">PASS 본인인증</Badge>
        <h1 className="mt-3 text-[22px] font-bold leading-[28px] text-[var(--wp-ink)]">
          휴대폰 본인인증을 진행할게요
        </h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--wp-body)]">
          중복 가입 방지를 위해 SIM 기반 실명 인증을 확인합니다
        </p>
      </div>
      <div className="space-y-3">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="휴대폰 번호 입력"
          inputMode="numeric"
          className="h-[52px] w-full rounded-[14px] border border-[var(--wp-border-strong)] bg-[var(--wp-surface)] px-4 tabular-nums text-[15px] text-[var(--wp-ink)] outline-none placeholder:text-[var(--wp-muted)] focus:border-[var(--wp-accent)]"
        />
        {!codeSent ? (
          <Button variant="secondary" full onClick={() => setCodeSent(true)} disabled={phone.length < 9}>
            인증번호 받기
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-[14px] border border-[var(--wp-success)] bg-[var(--wp-success-soft)] px-4 py-3.5 text-[13.5px] font-medium text-[var(--wp-success)]">
            <SealCheck size={18} weight="fill" />
            인증번호가 전송됐어요, 자동으로 확인 중입니다
          </div>
        )}
      </div>
    </div>
  );
}

function HomeGpsStep({ verified, onVerify }: { verified: boolean; onVerify: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <div>
        <Badge tone="accent" icon={<House size={12} weight="fill" />}>
          1 / 2 듀얼 인증
        </Badge>
        <h1 className="mt-3 text-[22px] font-bold leading-[28px] text-[var(--wp-ink)]">
          집 동네를 인증해주세요
        </h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--wp-body)]">
          현재 위치를 기반으로 반경 인증 후 집 동네를 등록해요
        </p>
      </div>
      <MapMock label="서울 마포구 합정동" verified={verified} />
      {!verified ? (
        <Button variant="secondary" full onClick={onVerify}>
          현재 위치로 인증하기
        </Button>
      ) : (
        <div className="flex items-center gap-2 rounded-[14px] border border-[var(--wp-success)] bg-[var(--wp-success-soft)] px-4 py-3.5 text-[13.5px] font-medium text-[var(--wp-success)]">
          <CheckCircle size={18} weight="fill" />
          집 위치 등록 완료
        </div>
      )}
    </div>
  );
}

function WorkGpsStep({ verified, onVerify }: { verified: boolean; onVerify: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <div>
        <Badge tone="accent" icon={<Buildings size={12} weight="fill" />}>
          2 / 2 듀얼 인증
        </Badge>
        <h1 className="mt-3 text-[22px] font-bold leading-[28px] text-[var(--wp-ink)]">
          회사 동네도 인증해주세요
        </h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--wp-body)]">
          집과 회사, 두 곳을 모두 인증하면 동선 기반 추천이 열려요
        </p>
      </div>
      <MapMock label="서울 강남구 역삼동" verified={verified} />
      {!verified ? (
        <Button variant="secondary" full onClick={onVerify}>
          회사 위치로 인증하기
        </Button>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 rounded-[14px] border border-[var(--wp-success)] bg-[var(--wp-success-soft)] px-4 py-3.5 text-[13.5px] font-medium text-[var(--wp-success)]">
            <CheckCircle size={18} weight="fill" />
            회사 위치 등록 완료
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--wp-accent-soft)] px-4 py-2 text-[13px] font-semibold text-[var(--wp-accent-ink)]">
            <ShieldCheck size={15} weight="fill" />
            듀얼 인증 완료, 신뢰 계정이 생성됐어요
          </div>
        </div>
      )}
    </div>
  );
}

function MapMock({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-[20px] border border-[var(--wp-border)] bg-[var(--wp-surface-soft)]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--wp-border) 1px, transparent 1px), linear-gradient(90deg, var(--wp-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-x-0 top-[38%] h-[3px] -rotate-6 bg-[var(--wp-surface-sunken)]" />
      <div className="absolute inset-y-0 left-[62%] w-[3px] rotate-3 bg-[var(--wp-surface-sunken)]" />
      <motion.div
        animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--wp-accent)]"
      />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-[var(--wp-shadow-pop)] ${
            verified ? "bg-[var(--wp-success)]" : "bg-[var(--wp-accent)]"
          }`}
        >
          <MapPinLine size={19} weight="fill" />
        </span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[12px] bg-[var(--wp-surface)] px-3.5 py-2.5 shadow-[var(--wp-shadow)]">
        <span className="text-[13px] font-medium text-[var(--wp-ink)]">{label}</span>
        <Badge tone={verified ? "success" : "neutral"}>반경 300m</Badge>
      </div>
    </div>
  );
}

function RouteStep({
  selectedLines,
  onToggleLine,
  selectedWindow,
  onSelectWindow,
  recommendOn,
  onToggleRecommend,
}: {
  selectedLines: string[];
  onToggleLine: (line: string) => void;
  selectedWindow: string;
  onSelectWindow: (w: string) => void;
  recommendOn: boolean;
  onToggleRecommend: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-2">
      <div>
        <h1 className="text-[22px] font-bold leading-[28px] text-[var(--wp-ink)]">
          출퇴근 경로를 등록해주세요
        </h1>
        <p className="mt-2 text-[14px] leading-[21px] text-[var(--wp-body)]">
          자주 이용하는 노선과 시간대를 알려주시면 동선 기반 추천을 시작해요
        </p>
      </div>

      <div className="relative h-[100px] overflow-hidden rounded-[16px]">
        <Image src={picsumId(22, 700, 300)} alt="출퇴근 동선" fill sizes="360px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-3 bottom-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-white">
          <House size={13} weight="fill" /> 합정동
          <ArrowRight size={11} weight="bold" />
          <Buildings size={13} weight="fill" /> 역삼동
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--wp-body)]">자주 이용하는 노선</p>
        <div className="flex flex-wrap gap-1.5">
          {ROUTE_LINES.map((line) => (
            <button
              key={line}
              type="button"
              onClick={() => onToggleLine(line)}
              aria-pressed={selectedLines.includes(line)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                selectedLines.includes(line)
                  ? "border-[var(--wp-accent)] bg-[var(--wp-accent)] text-white"
                  : "border-[var(--wp-border)] text-[var(--wp-body)]"
              }`}
            >
              {line}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--wp-body)]">출퇴근 시간대</p>
        <div className="grid grid-cols-2 gap-2">
          {COMMUTE_WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onSelectWindow(w)}
              aria-pressed={selectedWindow === w}
              className={`flex items-center gap-1.5 rounded-[12px] border px-3 py-2.5 text-[13px] font-medium tabular-nums transition-colors ${
                selectedWindow === w
                  ? "border-[var(--wp-accent)] bg-[var(--wp-accent-soft)] text-[var(--wp-accent-ink)]"
                  : "border-[var(--wp-border)] text-[var(--wp-body)]"
              }`}
            >
              <Clock size={13} />
              {w}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleRecommend}
        className="flex items-center justify-between rounded-[14px] border border-[var(--wp-border)] px-4 py-3.5"
      >
        <div className="text-left">
          <p className="text-[13.5px] font-medium text-[var(--wp-ink)]">동선 기반 추천 활성화</p>
          <p className="mt-0.5 text-[11.5px] text-[var(--wp-muted)]">내 동선 홈에서 노선 기반 상품을 우선 노출해요</p>
        </div>
        <span
          className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors ${
            recommendOn ? "bg-[var(--wp-accent)]" : "bg-[var(--wp-surface-sunken)]"
          }`}
        >
          <span
            className="absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all"
            style={{ left: recommendOn ? 21 : 3 }}
          />
        </span>
      </button>
    </div>
  );
}
