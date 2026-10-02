"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { films, getFilm, picsum } from "@/projects/camera/lumicam/lib/films";
import { onboardingSteps } from "@/projects/camera/lumicam/lib/mock-data";
import type { LumicamNavigate } from "@/projects/camera/lumicam/lib/navigation";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";

/* 스크린샷 도구(scripts/capture-screenshot.ts)가 넘기는 `onboarding:step=N` 값을 읽어
   해당 스텝에서 시작한다(캡처 전용, 일반 사용 흐름에는 영향 없음). habitkong의 온보딩과
   같은 패턴 — 서버 스냅샷을 빈 값으로 둬 hydration 불일치를 피한다. */
const subscribeToNothing = () => () => {};

/* iOS 시스템 권한 알럿을 그대로 흉내낸 목업 — 화면 전체를 반투명 검정으로 덮고 그 위에
   흰 알럿을 중앙 배치한다(실제 OS가 앱 화면 위에 얹는 방식 그대로). 실제 OS 크롬이라
   앱 자체 토큰(--lc-*) 대신 iOS 시스템 색(연회색 패널, iOS 블루 버튼)을 그대로 쓴다.
   StatusBar와 같은 예외. */
function PermissionAlert({ kind }: { kind: "camera" | "library" }) {
  const title =
    kind === "camera"
      ? "“LUMI CAM”이(가) 카메라에 접근하려고 합니다."
      : "“LUMI CAM”이(가) 사진에 접근하려고 합니다.";
  const body =
    kind === "camera"
      ? "실시간 프리뷰와 촬영을 위해 필요해요."
      : "촬영한 필름 사진을 라이브러리에 저장하려면 필요해요.";
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45">
      <div className="w-[270px] overflow-hidden rounded-[14px] bg-[#F5F5F7] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="px-4 pb-4 pt-5 text-center">
          <p className="break-keep text-[13px] font-semibold leading-[17px] text-[#1c1c1e]">{title}</p>
          <p className="mt-1.5 break-keep text-[13px] leading-[17px] text-[#3c3c43]">{body}</p>
        </div>
        <div className="grid grid-cols-2 border-t border-[#3c3c4333]">
          <button type="button" className="border-r border-[#3c3c4333] py-3 text-[17px] text-[#007AFF]">
            허용 안 함
          </button>
          <button type="button" className="py-3 text-[17px] font-semibold text-[#007AFF]">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export function OnboardingScreen({ onNavigate }: { onNavigate: LumicamNavigate }) {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initialStep = useMemo(() => {
    const requested = Number(new URLSearchParams(search).get("step"));
    return Number.isInteger(requested) && requested >= 0 && requested < onboardingSteps.length ? requested : 0;
  }, [search]);

  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const step = stepOverride ?? initialStep;
  const setStep = (next: number | ((current: number) => number)) =>
    setStepOverride((prev) => {
      const current = prev ?? initialStep;
      return typeof next === "function" ? (next as (current: number) => number)(current) : next;
    });
  const [selectedFilmId, setSelectedFilmId] = useState(films[0].id);
  const reduce = useReducedMotion();
  const total = onboardingSteps.length;
  const current = onboardingSteps[step];
  const isPreset = current.id === "preset";
  const isLast = step === total - 1;

  function next() {
    if (isLast) {
      onNavigate("camera");
      return;
    }
    setStep((s) => Math.min(total - 1, s + 1));
  }

  const isPermissionStep = current.id === "camera-permission" || current.id === "library-permission";

  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--lc-canvas)] pb-8 pt-[59px]">
      <div className="flex items-center justify-between px-6 pb-4 pt-3">
        <div className="flex items-center gap-1.5">
          {onboardingSteps.map((s, i) => (
            <span
              key={s.id}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-[var(--lc-accent)]" : "w-3 bg-[var(--lc-border)]"
              }`}
            />
          ))}
        </div>
        {!isLast && (
          <button
            type="button"
            onClick={() => onNavigate("camera")}
            className="text-[12px] font-medium text-[var(--lc-mute)]"
          >
            건너뛰기
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? undefined : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -16 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex h-full flex-col"
          >
            {isPreset ? (
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--lc-accent-soft-ink)]">
                    {current.eyebrow}
                  </p>
                  <h1 className="mt-2 break-keep text-[24px] font-bold leading-[30px] tracking-[-0.01em] text-[var(--lc-ink)]">
                    {current.title}
                  </h1>
                  <p className="mt-2.5 break-keep text-[14px] leading-[21px] text-[var(--lc-body)]">{current.body}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {films.map((f) => {
                    const active = f.id === selectedFilmId;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFilmId(f.id)}
                        className={`overflow-hidden rounded-[12px] border text-left transition-colors ${
                          active ? "border-[var(--lc-accent)]" : "border-[var(--lc-border)]"
                        }`}
                      >
                        <GradedPhoto
                          src={picsum(f.heroId, 260, 180)}
                          alt={f.name}
                          grade={f.colorGrade}
                          className="h-[110px] w-full"
                          sizes="200px"
                        />
                        <div className="bg-[var(--lc-surface)] px-3 py-2.5">
                          <p className="text-[13px] font-semibold text-[var(--lc-ink)]">{f.shortName}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--lc-mute)]">{f.tagline}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : isPermissionStep ? (
              // 실제 카메라/사진 화면 없이 시스템 알럿만 화면 전체를 덮으므로, 뒤에 깔리는
              // 빈 아이콘 박스 없이 안내 문구만 보여준다.
              <div className="pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--lc-accent-soft-ink)]">
                  {current.eyebrow}
                </p>
                <h1 className="mt-2 break-keep text-[24px] font-bold leading-[30px] tracking-[-0.01em] text-[var(--lc-ink)]">
                  {current.title}
                </h1>
                <p className="mt-2.5 break-keep text-[14px] leading-[21px] text-[var(--lc-body)]">{current.body}</p>
              </div>
            ) : (
              <>
                {current.id === "done" ? (
                  <div className="relative h-[248px] w-full overflow-hidden rounded-[12px] border border-[var(--lc-border)]">
                    <GradedPhoto
                      src={picsum(getFilm(selectedFilmId)!.heroId, 620, 500)}
                      alt={`${getFilm(selectedFilmId)!.name}로 촬영 준비 완료`}
                      grade={getFilm(selectedFilmId)!.colorGrade}
                      className="h-full w-full"
                      sizes="393px"
                      priority
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <p className="absolute inset-x-3 bottom-3 break-keep text-[12.5px] font-medium text-white">
                      {getFilm(selectedFilmId)!.name}로 촬영 준비 완료
                    </p>
                  </div>
                ) : (
                  <div className="h-[248px] w-full overflow-hidden rounded-[12px] border border-[var(--lc-border)]">
                    <GradedPhoto
                      src={picsum(current.photoId, 620, 500)}
                      alt={current.title}
                      grade={getFilm(selectedFilmId)!.colorGrade}
                      className="h-full w-full"
                      sizes="393px"
                      priority
                    />
                  </div>
                )}

                <div className="pt-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--lc-accent-soft-ink)]">
                    {current.eyebrow}
                  </p>
                  <h1 className="mt-2 break-keep text-[24px] font-bold leading-[30px] tracking-[-0.01em] text-[var(--lc-ink)]">
                    {current.title}
                  </h1>
                  <p className="mt-2.5 break-keep text-[14px] leading-[21px] text-[var(--lc-body)]">{current.body}</p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 px-6 pt-4">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] border border-[var(--lc-border)] text-[var(--lc-ink)]"
            aria-label="이전 단계"
          >
            <Icon icon="solar:alt-arrow-left-linear" width={18} />
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="h-12 flex-1 rounded-[6px] bg-[var(--lc-ink)] text-[15px] font-semibold text-[var(--lc-on-ink)] transition-transform active:scale-[0.98]"
        >
          {isLast ? "촬영 시작" : "다음"}
        </button>
      </div>

      {isPermissionStep && (
        <PermissionAlert kind={current.id === "camera-permission" ? "camera" : "library"} />
      )}
    </div>
  );
}
