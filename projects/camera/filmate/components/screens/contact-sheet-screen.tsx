"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, X } from "@phosphor-icons/react";
import { films, getFilm } from "@/projects/camera/filmate/lib/films";
import { shots, today, type Shot } from "@/projects/camera/filmate/lib/shots";
import type { FilmateNavigate } from "@/projects/camera/filmate/lib/navigation";
import { GradedPhoto } from "@/projects/camera/filmate/components/graded-photo";

function SprocketStrip({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-10 w-[5px] bg-black/70 ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(245,242,234,0.55) 1.1px, transparent 1.2px)",
        backgroundSize: "100% 9px",
        backgroundPosition: "center",
      }}
    />
  );
}

export function ContactSheetScreen({ onNavigate }: { onNavigate: FilmateNavigate }) {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () => (filter === "all" ? shots : shots.filter((s) => s.filmId === filter)),
    [filter],
  );

  const filmsUsedCount = useMemo(
    () => new Set(shots.map((s) => s.filmId)).size,
    [],
  );

  const activeShot: Shot | null =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const activeFilm = activeShot ? getFilm(activeShot.filmId) : null;

  function goTo(delta: number) {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + delta + filtered.length) % filtered.length;
    setLightboxIndex(next);
  }

  return (
    <div className="h-full w-full pb-10 pt-[64px]">
      <div className="flex items-center px-5">
        <button
          type="button"
          onClick={() => onNavigate("camera")}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--fm-surface)]"
          aria-label="카메라로 돌아가기"
        >
          <ArrowLeft size={20} weight="regular" />
        </button>
      </div>

      <div className="px-6 pb-5 pt-2">
        <h1 className="text-[24px] font-bold tracking-tight">오늘 촬영</h1>
        <p className="mt-1 text-[13px] tabular-nums text-[var(--fm-warm-gray)]">
          {today} · {shots.length}컷 · {filmsUsedCount}개 필름 사용
        </p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
            filter === "all"
              ? "bg-[var(--fm-accent)] text-[#1a1305]"
              : "bg-[var(--fm-surface)] text-[var(--fm-warm-gray)]"
          }`}
        >
          전체
        </button>
        {films.map((film) => (
          <button
            key={film.id}
            type="button"
            onClick={() => setFilter(film.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              filter === film.id
                ? "bg-[var(--fm-accent)] text-[#1a1305]"
                : "bg-[var(--fm-surface)] text-[var(--fm-warm-gray)]"
            }`}
          >
            {film.shortName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[3px] bg-black px-[3px]">
        {filtered.map((shot, i) => {
          const film = getFilm(shot.filmId)!;
          return (
            <button
              key={shot.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-square overflow-hidden"
            >
              <GradedPhoto
                src={`https://picsum.photos/seed/${shot.seed}-${shot.id}/300/300`}
                alt={`${film.shortName} 프레임 ${shot.frame}`}
                grade={film.colorGrade}
                sizes="140px"
                className="h-full w-full"
              />
              <SprocketStrip side="left" />
              <SprocketStrip side="right" />
              <span className="absolute bottom-1 left-1.5 z-10 text-[10px] font-semibold tabular-nums text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                {String(shot.frame).padStart(2, "0")}
              </span>
              <span className="absolute bottom-1 right-1.5 z-10 text-[9px] font-medium tracking-wide text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                {film.shortName}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeShot && activeFilm && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex flex-col bg-[var(--fm-bg)]"
          >
            <div className="flex items-center justify-between px-5 pt-[64px]">
              <span className="text-[12px] font-medium tabular-nums text-[var(--fm-warm-gray)]">
                {String(activeShot.frame).padStart(2, "0")} · {activeShot.time}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fm-surface)]"
                aria-label="닫기"
              >
                <X size={18} weight="regular" />
              </button>
            </div>

            <motion.div
              key={activeShot.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) goTo(1);
                else if (info.offset.x > 60) goTo(-1);
              }}
              className="relative mx-6 mt-5 flex-1 overflow-hidden rounded-2xl"
            >
              <GradedPhoto
                src={`https://picsum.photos/seed/${activeShot.seed}-${activeShot.id}/700/700`}
                alt={`${activeFilm.shortName} 프레임 ${activeShot.frame}`}
                grade={activeFilm.colorGrade}
                sizes="340px"
                className="h-full w-full"
              />
            </motion.div>

            <div className="px-6 pb-10 pt-5">
              <p className="text-[15px] font-semibold">{activeFilm.name}</p>
              <p className="mt-1 text-[13px] text-[var(--fm-warm-gray)]">
                ISO {activeFilm.iso} · {activeShot.time} 촬영
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
