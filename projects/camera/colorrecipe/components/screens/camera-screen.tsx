"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CameraRotate,
  CaretRight,
  Gear,
  GridFour,
  Lightning,
  LightningSlash,
  Sliders,
  Timer,
  X,
} from "@phosphor-icons/react";
import { recipes, recipeThumb } from "@/projects/camera/colorrecipe/lib/recipes";
import { photos } from "@/projects/camera/colorrecipe/lib/photos";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { ParamSlider } from "@/projects/camera/colorrecipe/components/param-slider";
import { Toggle } from "@/components/shared/toggle";

const PREVIEW_SEED = "colorrecipe-city-dusk-avenue";
const FLASH_MODES = ["off", "on", "auto"] as const;
const ZOOM_LEVELS = ["0.5x", "1x", "3x"] as const;
const TIMER_OPTIONS = ["끄기", "3초", "10초"] as const;
const WB_PRESETS = ["자동", "맑음", "흐림", "그늘", "텅스텐", "형광등"] as const;
const ISO_VALUES = [100, 200, 400, 800, 1600, 3200];
const SHUTTER_VALUES = ["1/1000", "1/500", "1/250", "1/125", "1/60", "1/30"];

export function CameraScreen({ onNavigate }: { onNavigate: ColorRecipeNavigate }) {
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [facingFront, setFacingFront] = useState(false);
  const [flashPulse, setFlashPulse] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [gridOn, setGridOn] = useState(false);
  const [timerIndex, setTimerIndex] = useState(0);
  const [rawEnabled, setRawEnabled] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [ev, setEv] = useState(0);
  const [wbIndex, setWbIndex] = useState(0);
  const [isoIndex, setIsoIndex] = useState(1);
  const [shutterIndex, setShutterIndex] = useState(2);
  const [reticle, setReticle] = useState<{ x: number; y: number } | null>(null);
  const reduce = useReducedMotion();

  const recipe = recipes[recipeIndex];
  const recentShot = photos[0];

  function handleShutter() {
    setFlashPulse(true);
    window.setTimeout(() => setFlashPulse(false), 120);
  }

  function handleFocusTap(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setReticle({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    window.setTimeout(() => setReticle(null), 900);
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0" onClick={handleFocusTap}>
        <div
          className="h-full w-full transition-transform duration-300"
          style={{ transform: `scale(${1 + zoomIndex * 0.25})` }}
        >
          <GradedSwatch
            src={recipeThumb(PREVIEW_SEED, 1000)}
            alt="실시간 카메라 프리뷰"
            grade={recipe.colorGrade}
            priority
            sizes="393px"
            className="h-full w-full"
          />
        </div>
        {gridOn && (
          <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        )}
        {reticle && (
          <motion.div
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--cr-accent)]"
            style={{ left: reticle.x, top: reticle.y }}
          />
        )}
      </div>

      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: flashPulse ? 0.9 : 0 }}
          transition={{ duration: 0.12 }}
        />
      )}

      <div className="absolute inset-x-0 top-[64px] z-20 flex items-center justify-between px-5">
        <button
          type="button"
          onClick={() => setFlashIndex((i) => (i + 1) % FLASH_MODES.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur-md"
          aria-label="플래시 설정"
        >
          {FLASH_MODES[flashIndex] === "off" ? (
            <LightningSlash size={18} weight="regular" />
          ) : (
            <Lightning size={18} weight={FLASH_MODES[flashIndex] === "on" ? "fill" : "regular"} />
          )}
        </button>

        <div className="flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--cr-accent)]" />
          <span className="text-[11px] font-medium tabular-nums tracking-wide text-white/90">
            LIVE {recipe.name}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur-md"
          aria-label="설정"
        >
          <Gear size={18} weight="regular" />
        </button>
      </div>

      <div className="absolute inset-x-0 top-[118px] z-20 flex items-center justify-center gap-2 px-5">
        <button
          type="button"
          onClick={() => setGridOn((v) => !v)}
          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md ${
            gridOn ? "bg-[var(--cr-accent)] text-[#04252b]" : "bg-black/35 text-white"
          }`}
          aria-label="그리드 켜고 끄기"
        >
          <GridFour size={15} weight="regular" />
        </button>
        <button
          type="button"
          onClick={() => setTimerIndex((i) => (i + 1) % TIMER_OPTIONS.length)}
          className="flex h-8 items-center gap-1 rounded-full bg-black/35 px-2.5 text-[11px] font-medium text-white backdrop-blur-md"
        >
          <Timer size={13} weight="regular" />
          {TIMER_OPTIONS[timerIndex]}
        </button>
        <button
          type="button"
          onClick={() => setRawEnabled((v) => !v)}
          className="flex h-8 items-center rounded-full bg-black/35 px-2.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md"
        >
          {rawEnabled ? "RAW" : "JPEG"}
        </button>
        <button
          type="button"
          onClick={() => setManualOpen(true)}
          className="flex h-8 items-center gap-1 rounded-full bg-black/35 px-2.5 text-[11px] font-medium text-white backdrop-blur-md"
        >
          <Sliders size={13} weight="regular" />
          수동
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 via-black/25 to-transparent pb-8 pt-16">
        <button
          type="button"
          onClick={() => onNavigate("recipes")}
          className="mb-3 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-white/90"
        >
          {recipe.name}
          <CaretRight size={12} weight="bold" />
        </button>

        <div className="mb-3 flex items-center justify-center gap-1.5">
          {ZOOM_LEVELS.map((z, i) => (
            <button
              key={z}
              type="button"
              onClick={() => setZoomIndex(i)}
              className={`flex h-7 items-center justify-center rounded-full px-2.5 text-[11px] font-medium tabular-nums transition-colors ${
                i === zoomIndex ? "bg-[var(--cr-accent)] text-[#04252b]" : "bg-black/35 text-white"
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-center gap-3 px-5">
          {recipes.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRecipeIndex(i)}
              aria-label={`${r.name} 선택`}
            >
              <span
                className={`block overflow-hidden rounded-full border-2 bg-cover bg-center transition-all duration-300 ${
                  i === recipeIndex
                    ? "h-12 w-12 border-[var(--cr-accent)] opacity-100"
                    : "h-9 w-9 border-white/25 opacity-55"
                }`}
                style={{
                  backgroundImage: `url(${recipeThumb(r.heroSeed, 120)})`,
                  filter: r.colorGrade.filter,
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-9">
          <button
            type="button"
            onClick={() => onNavigate("photoDetail", { photoId: recentShot.id })}
            className="relative h-11 w-11 overflow-hidden rounded-[10px] border border-white/30"
            aria-label="최근 촬영 보기"
          >
            <GradedSwatch
              src={recipeThumb(recentShot.seed, 160)}
              alt="최근 촬영"
              grade={recipes.find((r) => r.id === recentShot.recipeId)!.colorGrade}
              className="h-full w-full"
              sizes="44px"
            />
          </button>

          <motion.button
            type="button"
            onClick={handleShutter}
            whileTap={reduce ? undefined : { scale: 0.9 }}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-white"
            aria-label="촬영"
          >
            <span className="h-[60px] w-[60px] rounded-full bg-white" />
          </motion.button>

          <button
            type="button"
            onClick={() => setFacingFront((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-md"
            aria-label="카메라 전환"
          >
            <CameraRotate size={20} weight={facingFront ? "fill" : "regular"} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {manualOpen && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col justify-end bg-black/50"
            onClick={() => setManualOpen(false)}
          >
            <motion.div
              initial={reduce ? undefined : { y: 320 }}
              animate={{ y: 0 }}
              exit={reduce ? undefined : { y: 320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-t-[24px] bg-[var(--cr-bg)] px-6 pb-10 pt-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[17px] font-semibold tracking-tight">수동 설정</h2>
                <button
                  type="button"
                  onClick={() => setManualOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cr-surface)]"
                  aria-label="닫기"
                >
                  <X size={16} weight="regular" />
                </button>
              </div>

              <div className="space-y-5">
                <ParamSlider label="노출" value={ev} min={-3} max={3} unit="EV" onChange={setEv} />

                <StepperRow
                  label="화이트밸런스"
                  value={WB_PRESETS[wbIndex]}
                  onCycle={() => setWbIndex((i) => (i + 1) % WB_PRESETS.length)}
                />
                <StepperRow
                  label="ISO"
                  value={String(ISO_VALUES[isoIndex])}
                  onCycle={() => setIsoIndex((i) => (i + 1) % ISO_VALUES.length)}
                />
                <StepperRow
                  label="셔터스피드"
                  value={`${SHUTTER_VALUES[shutterIndex]}s`}
                  onCycle={() => setShutterIndex((i) => (i + 1) % SHUTTER_VALUES.length)}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[var(--cr-foreground)]">
                    그리드 표시
                  </span>
                  <Toggle
                    checked={gridOn}
                    onChange={setGridOn}
                    label="그리드 표시"
                    onClassName="bg-[var(--cr-accent)]"
                    offClassName="bg-[var(--cr-cool-gray-soft)]"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepperRow({
  label,
  value,
  onCycle,
}: {
  label: string;
  value: string;
  onCycle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-[var(--cr-foreground)]">{label}</span>
      <button
        type="button"
        onClick={onCycle}
        className="rounded-full bg-[var(--cr-surface)] px-3.5 py-1.5 text-[12.5px] font-medium tabular-nums text-[var(--cr-cool-gray)]"
      >
        {value}
      </button>
    </div>
  );
}
