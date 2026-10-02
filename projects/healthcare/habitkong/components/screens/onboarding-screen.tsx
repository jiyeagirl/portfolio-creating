"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CaretLeft, Check, Sparkle } from "@phosphor-icons/react";
import { INTEGRATION_LOGO } from "@/projects/healthcare/habitkong/components/brand-logos";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import {
  GENERATED_ROUTINE,
  LIFE_PATTERNS,
  ONBOARDING_GOALS,
  integrations,
  profile,
  routineTime,
} from "@/projects/healthcare/habitkong/lib/profile";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";
import { Card, ProgressBar, Tag } from "@/projects/healthcare/habitkong/components/ui";

const STEPS = ["건강 데이터", "신체 정보", "건강 목표", "생활 패턴", "루틴 생성", "알림"];
const GENDERS = ["여성", "남성"];

/* 스크린샷 도구가 넘기는 `?step=` 값을 읽어 해당 스텝에서 시작한다(캡처 전용,
   일반 사용 흐름에는 영향 없음). src/index.tsx의 `?screen=` 처리와 같은 이유로
   서버 스냅샷을 빈 값으로 둬 hydration 불일치를 피한다. */
const subscribeToNothing = () => () => {};

export function OnboardingScreen({ onDone }: { onDone: HabitkongNavigate }) {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initialStep = useMemo(() => {
    const requested = Number(new URLSearchParams(search).get("step"));
    return Number.isInteger(requested) && requested >= 0 && requested < STEPS.length ? requested : 0;
  }, [search]);

  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const step = stepOverride ?? initialStep;
  const setStep = (next: number | ((current: number) => number)) =>
    setStepOverride((prev) => {
      const current = prev ?? initialStep;
      return typeof next === "function" ? (next as (current: number) => number)(current) : next;
    });
  const [linked, setLinked] = useState<Record<string, boolean>>({ apple: false, google: false });
  const [gender, setGender] = useState(profile.gender);
  const [age, setAge] = useState(String(profile.age));
  const [height, setHeight] = useState(String(profile.heightCm));
  const [weight, setWeight] = useState(String(profile.weightKg));
  const [goals, setGoals] = useState<string[]>(["sleep"]);
  const [patterns, setPatterns] = useState<string[]>(["desk", "night"]);
  const [phase, setPhase] = useState<"idle" | "generating" | "done">("idle");
  const [time, setTime] = useState(routineTime.value);

  const generating = phase === "generating";

  /* 루틴 생성 단계에 들어오면 분석 중 상태를 잠깐 보여 준다. */
  useEffect(() => {
    if (phase !== "generating") return;
    const timer = window.setTimeout(() => setPhase("done"), 1400);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const goNext = () => {
    const next = step + 1;
    if (next === 4 && phase === "idle") setPhase("generating");
    setStep(next);
  };

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) =>
    setList(list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);

  const canNext =
    step === 1
      ? age.trim() !== "" && height.trim() !== "" && weight.trim() !== ""
      : step === 2
        ? goals.length > 0
        : step === 4
          ? !generating
          : true;

  return (
    // 기기 화면 높이(852px)에 맞춰 CTA를 항상 하단에 붙인다.
    <div className="flex min-h-[852px] w-full flex-col bg-white pb-8 pt-[70px]">
      <header className="px-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="이전 단계"
            className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full text-[#17140F] disabled:text-[#EAEAEA]"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <span className="text-[11.5px] font-medium tabular-nums text-[#8A8377]">
            {step + 1} / {STEPS.length} · {STEPS[step]}
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar value={(step + 1) / STEPS.length} height={4} />
        </div>
      </header>

      <div className="flex-1 px-5 pt-7">
        {step === 0 && (
          <>
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#17140F]">
              건강 데이터를
              <br />
              먼저 연결할게요
            </h1>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#8A8377]">
              걸음, 수면, 심박수를 자동으로 가져와요. 직접 입력하지 않아도 콩이가 컨디션을 읽습니다.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {integrations.map((item) => {
                const Logo = INTEGRATION_LOGO[item.id];
                return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLinked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  aria-pressed={linked[item.id]}
                  className={`flex items-center gap-3 rounded-[12px] border p-4 text-left transition-colors ${
                    linked[item.id] ? "border-[#17140F] bg-[#FBFBFA]" : "border-[#EAEAEA] bg-white"
                  }`}
                >
                  <span className="shrink-0 rounded-[8px] ring-1 ring-inset ring-[#EAEAEA]">
                    <Logo size={40} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-[#17140F]">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-[#8A8377]">{item.detail}</span>
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      linked[item.id]
                        ? "border-[#17140F] bg-[#17140F] text-white"
                        : "border-[#EAEAEA]"
                    }`}
                  >
                    {linked[item.id] && <Check size={12} weight="bold" />}
                  </span>
                </button>
                );
              })}
            </div>

            <p className="mt-3 text-[11.5px] leading-relaxed text-[#B5AEA4]">
              연동은 나중에 마이페이지에서도 할 수 있어요. 데이터는 기기 안에서만 분석합니다.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#17140F]">
              지우님의 몸을
              <br />
              간단히 알려주세요
            </h1>
            <p className="mt-2.5 text-[13px] text-[#8A8377]">
              적정 칼로리와 목표를 계산하는 데만 씁니다.
            </p>

            <div className="mt-6">
              <p className="text-[12px] font-medium text-[#8A8377]">성별</p>
              <div className="mt-2 flex gap-2">
                {GENDERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    aria-pressed={gender === option}
                    className={`flex-1 rounded-[8px] border py-3 text-[13.5px] font-semibold transition-colors ${
                      gender === option
                        ? "border-[#17140F] bg-[#17140F] text-white"
                        : "border-[#EAEAEA] bg-white text-[#8A8377]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <NumberField label="나이" value={age} unit="세" onChange={setAge} />
              <NumberField label="키" value={height} unit="cm" onChange={setHeight} />
              <NumberField label="몸무게" value={weight} unit="kg" onChange={setWeight} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#17140F]">
              무엇을 바꾸고
              <br />
              싶으세요
            </h1>
            <p className="mt-2.5 text-[13px] text-[#8A8377]">여러 개를 골라도 괜찮아요.</p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {ONBOARDING_GOALS.map((goal) => {
                const active = goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggle(goals, setGoals, goal.id)}
                    aria-pressed={active}
                    className={`rounded-[12px] border py-5 text-[13.5px] font-semibold transition-colors ${
                      active
                        ? "border-[#17140F] bg-[#17140F] text-white"
                        : "border-[#EAEAEA] bg-white text-[#4A443C]"
                    }`}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#17140F]">
              요즘 하루는
              <br />
              어떤가요
            </h1>
            <p className="mt-2.5 text-[13px] text-[#8A8377]">
              해당되는 것만 골라주세요. 루틴 난이도를 맞추는 데 씁니다.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {LIFE_PATTERNS.map((pattern) => {
                const active = patterns.includes(pattern.id);
                return (
                  <button
                    key={pattern.id}
                    type="button"
                    onClick={() => toggle(patterns, setPatterns, pattern.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left text-[13.5px] transition-colors ${
                      active
                        ? "border-[#17140F] bg-[#FBFBFA] font-semibold text-[#17140F]"
                        : "border-[#EAEAEA] bg-white text-[#4A443C]"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${
                        active ? "border-[#17140F] bg-[#17140F] text-white" : "border-[#EAEAEA]"
                      }`}
                    >
                      {active && <Check size={11} weight="bold" />}
                    </span>
                    {pattern.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center pt-6 text-center">
            <Mascot size={96} mood={generating ? "good" : "great"} />

            {generating ? (
              <>
                <p className="mt-6 text-[16px] font-semibold text-[#17140F]">
                  콩이가 루틴을 고르는 중이에요
                </p>
                <p className="mt-2 text-[12.5px] text-[#8A8377]">
                  선택한 목표 {goals.length}개와 생활 패턴 {patterns.length}개를 살펴보고 있어요
                </p>
                <div className="mt-5 w-32">
                  <ProgressBar value={0.6} height={4} tone="muted" />
                </div>
              </>
            ) : (
              <>
                <div className="mt-5">
                  <Tag tone="blue">
                    <Sparkle size={11} weight="fill" />
                    AI 맞춤 루틴
                  </Tag>
                </div>
                <p className="mt-3 text-[19px] font-bold tracking-tight text-[#17140F]">
                  {GENERATED_ROUTINE.name}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#8A8377]">
                  {GENERATED_ROUTINE.reason}
                </p>

                <Card className="mt-6 w-full p-4 text-left">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-[#8A8377]">예상 소요</span>
                    <span className="font-semibold tabular-nums text-[#17140F]">
                      {GENERATED_ROUTINE.durationMinutes}분
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#EAEAEA] pt-2.5 text-[12.5px]">
                    <span className="text-[#8A8377]">추천 시각</span>
                    <span className="font-semibold tabular-nums text-[#17140F]">
                      {GENERATED_ROUTINE.time}
                    </span>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {step === 5 && (
          <>
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#17140F]">
              언제 알려드릴까요
            </h1>
            <p className="mt-2.5 text-[13px] text-[#8A8377]">
              루틴 시간에 콩이가 딱 한 번만 알려드려요.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {routineTime.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTime(option)}
                  aria-pressed={time === option}
                  className={`rounded-[12px] border py-4 text-[14px] font-semibold tabular-nums transition-colors ${
                    time === option
                      ? "border-[#17140F] bg-[#17140F] text-white"
                      : "border-[#EAEAEA] bg-white text-[#4A443C]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <Card className="mt-6 p-4">
              <p className="text-[12px] font-medium text-[#8A8377]">이렇게 시작할게요</p>
              <ul className="mt-2.5 space-y-1.5 text-[12.5px] text-[#4A443C]">
                <li className="flex items-center gap-2">
                  <Check size={12} weight="bold" className="text-[#346538]" />
                  {GENERATED_ROUTINE.name} · 매일 {time}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} weight="bold" className="text-[#346538]" />
                  {gender} · {age}세 · {height}cm · {weight}kg 기준 목표 계산
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} weight="bold" className="text-[#346538]" />
                  {linked.apple || linked.google ? "건강 데이터 자동 연동" : "건강 데이터는 나중에 연동"}
                </li>
              </ul>
            </Card>
          </>
        )}
      </div>

      <div className="px-5 pt-6">
        <button
          type="button"
          disabled={!canNext}
          onClick={() => (step === STEPS.length - 1 ? onDone("home") : goNext())}
          className="w-full rounded-[6px] bg-[#17140F] py-3.5 text-[14.5px] font-semibold text-white transition-transform active:scale-[0.98] disabled:bg-[#F0EEE9] disabled:text-[#B5AEA4]"
        >
          {step === STEPS.length - 1 ? "콩이와 시작하기" : "다음"}
        </button>
        {step === 0 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-2 w-full py-2 text-center text-[12.5px] font-medium text-[#8A8377]"
          >
            나중에 연동할게요
          </button>
        )}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  unit: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-[#8A8377]">{label}</span>
      <span className="mt-1.5 flex items-center gap-2 rounded-[8px] border border-[#EAEAEA] bg-white px-4 py-3 focus-within:border-[#17140F]">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          inputMode="decimal"
          className="w-full bg-transparent text-[15px] font-semibold tabular-nums text-[#17140F] outline-none"
        />
        <span className="shrink-0 text-[12.5px] text-[#8A8377]">{unit}</span>
      </span>
    </label>
  );
}
