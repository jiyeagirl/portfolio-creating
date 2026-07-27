"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CameraRotate,
  CaretRight,
  Gear,
  Lightning,
  LightningSlash,
} from "@phosphor-icons/react";
import { films, getFilm } from "@/projects/camera/filmate/lib/films";
import { shots } from "@/projects/camera/filmate/lib/shots";
import type { FilmateNavigate } from "@/projects/camera/filmate/lib/navigation";
import { GradedPhoto } from "@/projects/camera/filmate/components/graded-photo";

const PREVIEW_SEED = "filmate-city-street-dusk";
const FLASH_MODES = ["off", "on", "auto"] as const;

export function CameraScreen({ onNavigate }: { onNavigate: FilmateNavigate }) {
  const [filmIndex, setFilmIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [facingFront, setFacingFront] = useState(false);
  const [flashPulse, setFlashPulse] = useState(false);
  const reduce = useReducedMotion();

  const film = films[filmIndex];
  const flashMode = FLASH_MODES[flashIndex];
  const recentShot = shots[shots.length - 1];
  const recentShotFilm = getFilm(recentShot.filmId)!;

  function handleShutter() {
    setFlashPulse(true);
    window.setTimeout(() => setFlashPulse(false), 120);
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <GradedPhoto
          src={`https://picsum.photos/seed/${PREVIEW_SEED}/800/1734`}
          alt="실시간 카메라 프리뷰"
          grade={film.colorGrade}
          priority
          sizes="393px"
          className="h-full w-full"
        />
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
          {flashMode === "off" ? (
            <LightningSlash size={18} weight="regular" />
          ) : (
            <Lightning size={18} weight={flashMode === "on" ? "fill" : "regular"} />
          )}
        </button>

        <div className="flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--fm-accent)]" />
          <span className="text-[11px] font-medium tabular-nums tracking-wide text-[var(--fm-foreground)]/90">
            LIVE · {film.shortName}
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

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent pb-8 pt-16">
        <button
          type="button"
          onClick={() => onNavigate("films")}
          className="mb-4 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-[var(--fm-foreground)]/90"
        >
          {film.name}
          <CaretRight size={12} weight="bold" />
        </button>

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
                    ? "h-12 w-12 border-[var(--fm-accent)] opacity-100"
                    : "h-9 w-9 border-white/25 opacity-55"
                }`}
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/${f.heroSeed}/120/120)`,
                  filter: f.colorGrade.filter,
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-9">
          <button
            type="button"
            onClick={() => onNavigate("contactSheet")}
            className="relative h-11 w-11 overflow-hidden rounded-[10px] border border-white/30"
            aria-label="콘택트 시트 보기"
          >
            <GradedPhoto
              src={`https://picsum.photos/seed/${recentShot.seed}/160/160`}
              alt="최근 촬영"
              grade={recentShotFilm.colorGrade}
              className="h-full w-full"
              sizes="44px"
            />
          </button>

          <motion.button
            type="button"
            onClick={handleShutter}
            whileTap={reduce ? undefined : { scale: 0.9 }}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-[var(--fm-foreground)]"
            aria-label="촬영"
          >
            <span className="h-[60px] w-[60px] rounded-full bg-[var(--fm-foreground)]" />
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
    </div>
  );
}
