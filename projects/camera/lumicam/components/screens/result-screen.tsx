"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { getFilm, picsum } from "@/projects/camera/lumicam/lib/films";
import type { Shot } from "@/projects/camera/lumicam/lib/types";
import type { LumicamNavigate } from "@/projects/camera/lumicam/lib/navigation";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";

export function ResultScreen({ shot, onNavigate }: { shot: Shot; onNavigate: LumicamNavigate }) {
  const film = getFilm(shot.filmId)!;
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [saved, setSaved] = useState(shot.savedToLibrary);

  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--lc-canvas)]">
      <ScreenHeader
        title="촬영 결과"
        subtitle={`Frame ${shot.frame} / ${shot.time}`}
        onBack={() => onNavigate("camera")}
        className="bg-[var(--lc-canvas)] border-[var(--lc-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--lc-ink)]"
        subtitleClassName="text-[11px] tabular-nums text-[var(--lc-mute)]"
        backButtonClassName="text-[var(--lc-ink)] hover:bg-[var(--lc-surface-soft)]"
      />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative h-[300px] w-full overflow-hidden rounded-[12px] border border-[var(--lc-border)]">
          <GradedPhoto
            src={picsum(shot.photoId, 700, 620)}
            alt={`${film.name}로 촬영된 사진`}
            grade={film.colorGrade}
            ungraded={showOriginal}
            className="h-full w-full"
            sizes="393px"
            priority
          />
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
            aria-label="확대 보기"
          >
            <Icon icon="solar:magnifer-zoom-in-linear" width={16} />
          </button>
          <div className="absolute left-3 top-3 flex overflow-hidden rounded-full border border-white/40 bg-black/35 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowOriginal(false)}
              className={`px-3 py-1 text-[11px] font-medium ${!showOriginal ? "bg-white text-[var(--lc-ink)]" : "text-white/85"}`}
            >
              필터 적용
            </button>
            <button
              type="button"
              onClick={() => setShowOriginal(true)}
              className={`px-3 py-1 text-[11px] font-medium ${showOriginal ? "bg-white text-[var(--lc-ink)]" : "text-white/85"}`}
            >
              원본
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-bold text-[var(--lc-ink)]">{film.name}</p>
              <p className="mt-0.5 text-[12px] text-[var(--lc-mute)]">{film.tagline}</p>
            </div>
            <span className="rounded-full bg-[var(--lc-accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--lc-accent-soft-ink)]">
              ISO {film.iso}
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {film.palette.map((color) => (
              <span key={color} className="h-6 w-6 rounded-full border border-[var(--lc-border)]" style={{ background: color }} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {film.characteristics.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--lc-border)] px-2.5 py-1 text-[11px] text-[var(--lc-body)]"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--lc-border)] pt-3 text-[12px] tabular-nums text-[var(--lc-mute)]">
            <span>해상도 {shot.resolution}</span>
            <span>{saved ? "라이브러리 저장됨" : "저장 안 함"}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="flex flex-col items-center gap-1.5 rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] py-3.5"
          >
            {saved ? (
              <Icon icon="solar:check-circle-bold" width={18} className="text-[var(--lc-accent)]" />
            ) : (
              <Icon icon="solar:download-minimalistic-linear" width={18} className="text-[var(--lc-ink)]" />
            )}
            <span className="text-[11px] font-medium text-[var(--lc-ink)]">
              {saved ? "저장 완료" : "고해상도 저장"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("share")}
            className="flex flex-col items-center gap-1.5 rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] py-3.5"
          >
            <Icon icon="solar:share-linear" width={18} className="text-[var(--lc-ink)]" />
            <span className="text-[11px] font-medium text-[var(--lc-ink)]">공유하기</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("filterSettings", shot.id)}
            className="flex flex-col items-center gap-1.5 rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)] py-3.5"
          >
            <Icon icon="solar:pen-2-linear" width={18} className="text-[var(--lc-ink)]" />
            <span className="text-[11px] font-medium text-[var(--lc-ink)]">다시 편집</span>
          </button>
        </div>
      </div>

      {zoomed && (
        <div className="absolute inset-0 z-40 bg-black">
          <GradedPhoto
            src={picsum(shot.photoId, 900, 900)}
            alt={`${film.name} 확대 보기`}
            grade={film.colorGrade}
            ungraded={showOriginal}
            className="h-full w-full"
            sizes="393px"
          />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-[68px] flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md"
            aria-label="확대 보기 닫기"
          >
            <Icon icon="solar:close-circle-bold" width={16} />
          </button>
        </div>
      )}
    </div>
  );
}
