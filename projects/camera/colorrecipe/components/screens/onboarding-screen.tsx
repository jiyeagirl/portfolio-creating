"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Aperture,
  Bell,
  Camera as CameraIcon,
  CheckCircle,
  FolderSimple,
  Sliders,
} from "@phosphor-icons/react";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { recipeThumb } from "@/projects/camera/colorrecipe/lib/recipes";
import { getRecipe } from "@/projects/camera/colorrecipe/lib/recipes";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

const HERO_RECIPE = getRecipe("cinema-teal-orange")!;

const FEATURES = [
  {
    icon: Sliders,
    title: "나만의 레시피 만들기",
    body: "밝기부터 곡선, 광학 효과까지 세밀하게 조정한 색감을 레시피로 저장하고 다시 꺼내 씁니다.",
  },
  {
    icon: Aperture,
    title: "실시간 필터 프리뷰",
    body: "촬영 화면에서 레시피를 좌우로 넘기며 적용 결과를 바로 확인하고 셔터를 누릅니다.",
  },
  {
    icon: FolderSimple,
    title: "저장과 공유",
    body: "완성한 레시피를 JSON, QR, 링크로 내보내 다른 기기나 다른 사람과 함께 씁니다.",
  },
];

export type OnboardingStep = "intro" | "features" | "permissions" | "auth";
type Step = OnboardingStep;

export function OnboardingScreen({
  onNavigate,
  initialStep = "intro",
}: {
  onNavigate: ColorRecipeNavigate;
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [libraryAllowed, setLibraryAllowed] = useState(false);
  const [notifyAllowed, setNotifyAllowed] = useState(false);
  const reduce = useReducedMotion();

  const STEP_ORDER: Step[] = ["intro", "features", "permissions", "auth"];
  const stepIndex = STEP_ORDER.indexOf(step);

  function next() {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEP_ORDER.length) setStep(STEP_ORDER[nextIndex]);
  }

  return (
    <div className="flex h-full w-full flex-col pt-[64px]">
      <div className="flex-1 overflow-hidden px-6">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-full flex-col"
          >
            <div className="relative mt-2 h-[300px] w-full overflow-hidden rounded-[24px]">
              <GradedSwatch
                src={recipeThumb(HERO_RECIPE.heroSeed, 700)}
                alt={HERO_RECIPE.name}
                grade={HERO_RECIPE.colorGrade}
                priority
                sizes="345px"
                className="h-full w-full"
              />
            </div>
            <h1 className="mt-8 text-[34px] font-bold leading-tight tracking-tight">
              찍는 순간의 색감을
              <br />
              레시피로 저장하세요
            </h1>
            <p className="mt-3 text-[15px] leading-[1.6] text-[var(--cr-cool-gray)]">
              COLORRECIPE는 사진의 색감 보정을 재사용 가능한 레시피로 만들어, 언제나 같은 톤으로
              촬영할 수 있게 돕는 컬러 그레이딩 카메라입니다.
            </p>
          </motion.div>
        )}

        {step === "features" && (
          <motion.div
            key="features"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-full flex-col justify-center gap-5"
          >
            <h1 className="mb-2 text-[24px] font-bold tracking-tight">주요 기능</h1>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3.5 rounded-[20px] bg-[var(--cr-surface-raised)]/60 p-1.5 ring-1 ring-white/[0.06]"
              >
                <div className="flex flex-1 items-start gap-3.5 rounded-[14px] bg-[var(--cr-surface)] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cr-accent-dim)]">
                    <f.icon size={20} weight="regular" className="text-[var(--cr-accent)]" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-[var(--cr-foreground)]">
                      {f.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.5] text-[var(--cr-cool-gray)]">
                      {f.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === "permissions" && (
          <motion.div
            key="permissions"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-full flex-col justify-center gap-4"
          >
            <h1 className="mb-2 text-[24px] font-bold tracking-tight">권한 허용</h1>
            <PermissionRow
              icon={CameraIcon}
              title="카메라"
              body="실시간 프리뷰와 촬영을 위해 필요합니다"
              required
              allowed={cameraAllowed}
              onToggle={() => setCameraAllowed((v) => !v)}
            />
            <PermissionRow
              icon={FolderSimple}
              title="사진 보관함"
              body="촬영한 사진을 저장하고 불러오기 위해 필요합니다"
              required
              allowed={libraryAllowed}
              onToggle={() => setLibraryAllowed((v) => !v)}
            />
            <PermissionRow
              icon={Bell}
              title="알림 (선택)"
              body="레시피 백업, 공유 요청 알림을 받습니다"
              required={false}
              allowed={notifyAllowed}
              onToggle={() => setNotifyAllowed((v) => !v)}
            />
          </motion.div>
        )}

        {step === "auth" && (
          <motion.div
            key="auth"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-full flex-col justify-center gap-3"
          >
            <h1 className="mb-1 text-[24px] font-bold tracking-tight">시작하기</h1>
            <p className="mb-4 text-[14px] text-[var(--cr-cool-gray)]">
              로그인하면 레시피가 클라우드에 자동으로 백업됩니다.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--cr-accent)] text-[15px] font-semibold text-[#04252b]"
            >
              이메일로 계속하기
            </button>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex h-[52px] w-full items-center justify-center rounded-full border border-[var(--cr-border)] text-[15px] font-semibold text-[var(--cr-foreground)]"
            >
              Apple로 계속하기
            </button>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="mt-2 text-center text-[13px] font-medium text-[var(--cr-cool-gray)]"
            >
              둘러보기
            </button>
          </motion.div>
        )}
      </div>

      {step !== "auth" && (
        <div className="px-6 pb-10 pt-4">
          <div className="mb-4 flex items-center justify-center gap-2">
            {STEP_ORDER.slice(0, 3).map((s, i) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIndex ? "w-5 bg-[var(--cr-accent)]" : "w-1.5 bg-[var(--cr-cool-gray-soft)]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--cr-accent)] text-[15px] font-semibold text-[#04252b]"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

function PermissionRow({
  icon: Icon,
  title,
  body,
  required,
  allowed,
  onToggle,
}: {
  icon: typeof CameraIcon;
  title: string;
  body: string;
  required: boolean;
  allowed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3.5 rounded-[20px] bg-[var(--cr-surface-raised)]/60 p-1.5 text-left ring-1 ring-white/[0.06]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5 rounded-[14px] bg-[var(--cr-surface)] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cr-accent-dim)]">
          <Icon size={19} weight="regular" className="text-[var(--cr-accent)]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold text-[var(--cr-foreground)]">
            {title}
            {required && <span className="ml-1.5 text-[11px] font-medium text-[var(--cr-cool-gray)]">필수</span>}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-[var(--cr-cool-gray)]">{body}</p>
        </div>
        {allowed ? (
          <CheckCircle size={22} weight="fill" className="shrink-0 text-[var(--cr-accent)]" />
        ) : (
          <span className="h-[22px] w-[22px] shrink-0 rounded-full border-2 border-[var(--cr-cool-gray-soft)]" />
        )}
      </div>
    </button>
  );
}
