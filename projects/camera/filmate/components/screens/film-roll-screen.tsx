"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import { films } from "@/projects/camera/filmate/lib/films";
import type { FilmateNavigate } from "@/projects/camera/filmate/lib/navigation";
import { GradedPhoto } from "@/projects/camera/filmate/components/graded-photo";

const ACTIVE_FILM_ID = "kodak-gold";

export function FilmRollScreen({ onNavigate }: { onNavigate: FilmateNavigate }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = cardRefs.current.findIndex((el) => el === visible.target);
        if (idx !== -1) setViewIndex(idx);
      },
      { root, threshold: [0.6, 0.8] },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToIndex(i: number) {
    cardRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  return (
    <div className="flex h-full w-full flex-col pt-[64px]">
      <div className="flex items-center px-5 pt-2">
        <button
          type="button"
          onClick={() => onNavigate("camera")}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--fm-surface)]"
          aria-label="카메라로 돌아가기"
        >
          <ArrowLeft size={20} weight="regular" />
        </button>
      </div>

      <div className="mb-5 px-6 pt-2">
        <h1 className="text-[24px] font-bold tracking-tight">필름 롤</h1>
        <p className="mt-1 text-[13px] text-[var(--fm-warm-gray)]">
          좌우로 넘겨 촬영에 사용할 필름을 골라보세요
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex flex-1 items-start gap-5 overflow-x-auto px-[60px] pb-2 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {films.map((film, i) => (
          <button
            key={film.id}
            type="button"
            onClick={() => onNavigate("filmDetail", film.id)}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={`flex w-[272px] shrink-0 flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 [scroll-snap-align:center] ${
              i === viewIndex
                ? "scale-100 border-[var(--fm-accent)]/50 opacity-100"
                : "scale-[0.94] border-[var(--fm-border)] opacity-65"
            }`}
          >
            <div className="relative h-[336px] w-full">
              <GradedPhoto
                src={`https://picsum.photos/seed/${film.heroSeed}/560/700`}
                alt={film.name}
                grade={film.colorGrade}
                sizes="272px"
                className="h-full w-full"
              />
              {film.id === ACTIVE_FILM_ID && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md">
                  <Check size={11} weight="bold" className="text-[var(--fm-accent)]" />
                  <span className="text-[10px] font-semibold tracking-wide text-[var(--fm-foreground)]">
                    사용 중
                  </span>
                </div>
              )}
            </div>
            <div className="bg-[var(--fm-surface)] p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[19px] font-semibold tracking-tight">
                  {film.shortName}
                </h2>
                <span className="text-[11px] font-medium tabular-nums text-[var(--fm-warm-gray)]">
                  ISO {film.iso}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-[1.5] text-[var(--fm-warm-gray)]">
                {film.tagline}
              </p>
              <div className="mt-3 flex gap-1.5">
                {film.palette.map((color) => (
                  <span
                    key={color}
                    className="h-4 w-4 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 py-5">
        {films.map((film, i) => (
          <button
            key={film.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`${film.shortName}로 이동`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === viewIndex
                ? "w-5 bg-[var(--fm-accent)]"
                : "w-1.5 bg-[var(--fm-warm-gray-soft)]"
            }`}
          />
        ))}
      </div>

      <div className="px-6 pb-8 pt-1">
        <button
          type="button"
          onClick={() => onNavigate("camera")}
          className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--fm-accent)] text-[15px] font-semibold text-[#1a1305]"
        >
          {films[viewIndex].shortName}으로 촬영하기
        </button>
      </div>
    </div>
  );
}
