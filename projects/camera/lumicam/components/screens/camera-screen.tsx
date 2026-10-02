"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@iconify/react";
import { films, picsum } from "@/projects/camera/lumicam/lib/films";
import { shots } from "@/projects/camera/lumicam/lib/shots";
import type { LumicamNavigate } from "@/projects/camera/lumicam/lib/navigation";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";

const FLASH_MODES = ["off", "on", "auto"] as const;
const EXPOSURES = ["-1.0", "-0.3", "0.0", "+0.3", "+1.0"];
const LIVE_PREVIEW_ID = 1043;

export function CameraScreen({ onNavigate }: { onNavigate: LumicamNavigate }) {
  const [filmIndex, setFilmIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [exposureIndex, setExposureIndex] = useState(2);
  const [gridOn, setGridOn] = useState(false);
  const [facingFront, setFacingFront] = useState(false);
  const [flashPulse, setFlashPulse] = useState(false);
  // 촬영 화면에는 필터 선택 바 바로 아래 이 슬라이더 하나만 노출한다 — 원본과 LUT
  // 적용 결과의 블렌드 비율. 나머지 조정값/광학 효과는 "필터 조정" 화면에서만 다룬다.
  const [lutIntensity, setLutIntensity] = useState(100);
  const reduce = useReducedMotion();

  const film = films[filmIndex];
  const flashMode = FLASH_MODES[flashIndex];
  const recentShot = shots[shots.length - 1];

  function handleShutter() {
    setFlashPulse(true);
    window.setTimeout(() => setFlashPulse(false), 120);
  }

  return (
    <div className="relative h-full w-full bg-black">
      <div className="absolute inset-0">
        <GradedPhoto
          src={picsum(LIVE_PREVIEW_ID, 800, 1734)}
          alt="실시간 카메라 프리뷰"
          grade={film.colorGrade}
          ungraded
          priority
          sizes="393px"
          className="h-full w-full"
        />
        {lutIntensity > 0 && (
          <div className="absolute inset-0" style={{ opacity: lutIntensity / 100 }}>
            <GradedPhoto
              src={picsum(LIVE_PREVIEW_ID, 800, 1734)}
              alt=""
              grade={film.colorGrade}
              sizes="393px"
              className="h-full w-full"
            />
          </div>
        )}
      </div>

      {gridOn && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/35" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/35" />
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/35" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/35" />
        </div>
      )}

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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md"
          aria-label="플래시 설정"
        >
          <Icon icon={flashMode === "on" ? "solar:bolt-bold" : "solar:bolt-linear"} width={18} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate("filterSettings")}
          className="flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-white backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--lc-accent)]" />
          <span className="text-[11px] font-medium tabular-nums tracking-wide text-white/90">
            LIVE / {film.shortName}
          </span>
          <Icon icon="solar:tuning-2-linear" width={12} className="text-white/70" />
        </button>

        <button
          type="button"
          onClick={() => setGridOn((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md"
          aria-label="그리드 표시"
        >
          <Icon icon={gridOn ? "solar:widget-4-bold" : "solar:widget-4-linear"} width={18} />
        </button>
      </div>

      <div className="absolute inset-x-0 top-[118px] z-20 flex justify-center">
        <button
          type="button"
          onClick={() => setExposureIndex((i) => (i + 1) % EXPOSURES.length)}
          className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium tabular-nums text-white/90 backdrop-blur-md"
        >
          노출 {EXPOSURES[exposureIndex]}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/65 via-black/25 to-transparent pb-8 pt-16">
        <div className="mb-6 flex items-center justify-center gap-3 px-5">
          {films.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilmIndex(i)}
              aria-label={`${f.name} 선택`}
            >
              <span
                className={`block rounded-full border-2 bg-cover bg-center transition-all duration-300 ${
                  i === filmIndex
                    ? "h-12 w-12 border-[var(--lc-accent)] opacity-100"
                    : "h-9 w-9 border-white/30 opacity-55"
                }`}
                style={{
                  backgroundImage: `url(${picsum(f.heroId, 120, 120)})`,
                  filter: f.colorGrade.filter,
                }}
              />
            </button>
          ))}
        </div>

        <div className="mb-5 px-9">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-white/80">LUT 강도</span>
            <span className="text-[11px] tabular-nums text-white/80">{lutIntensity}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={lutIntensity}
            onChange={(e) => setLutIntensity(Number(e.target.value))}
            className="lc-slider-dark h-4 w-full"
            style={{ ["--lc-slider-fill" as string]: `${lutIntensity}%` }}
            aria-label="LUT 강도"
          />
        </div>

        <div className="flex items-center justify-between px-9">
          <button
            type="button"
            onClick={() => onNavigate("result", recentShot.id)}
            className="relative h-11 w-11 overflow-hidden rounded-[10px] border border-white/30"
            aria-label="최근 촬영 보기"
          >
            <GradedPhoto
              src={picsum(recentShot.photoId, 160, 160)}
              alt="최근 촬영"
              grade={films.find((f) => f.id === recentShot.filmId)!.colorGrade}
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
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md"
            aria-label="카메라 전환"
          >
            <Icon icon={facingFront ? "solar:camera-rotate-bold" : "solar:camera-rotate-linear"} width={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("filterStore")}
          className="mt-5 flex w-full items-center justify-center gap-1 text-[12px] font-medium text-white/80"
        >
          필터 스토어 둘러보기
          <Icon icon="solar:alt-arrow-right-linear" width={11} />
        </button>
      </div>
    </div>
  );
}
