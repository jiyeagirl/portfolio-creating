"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Camera, Plus, TrashSimple } from "@phosphor-icons/react";
import type { CapturedPhoto } from "@/projects/b2b/buildbid-inspector/lib/types";

export function PhotosStep({
  photos,
  canAddMore,
  onAdd,
  onRemove,
}: {
  photos: CapturedPhoto[];
  canAddMore: boolean;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="px-5 pb-4">
      <div className="rounded-[18px] border border-[var(--bbi-border)] bg-[var(--bbi-surface)] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9999px] bg-[var(--bbi-accent-soft)]">
            <Camera size={18} weight="bold" className="text-[var(--bbi-accent)]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold leading-[22px] text-[var(--bbi-ink)]">
              장비 사진을 촬영하세요
            </p>
            <p className="text-[12px] font-normal leading-[16px] text-[var(--bbi-muted)]">
              엔진룸, 유압계통, 외관, 하부주행체 등 최소 4장 권장
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="group relative aspect-square overflow-hidden rounded-[18px] border border-[var(--bbi-border)]"
          >
            <Image
              src={`https://picsum.photos/id/${photo.picsumId}/400/400`}
              alt={photo.label}
              fill
              sizes="200px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,26,0)_60%,rgba(20,24,26,0.7)_100%)]" />
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label="사진 삭제"
              className="bbi-btn-press absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-[8px] bg-black/45 text-white"
            >
              <TrashSimple size={14} weight="bold" />
            </button>
            <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5">
              <p className="bbi-tabular text-[10px] font-semibold text-white/75">{photo.capturedAt} 촬영</p>
              <p className="truncate text-[12px] font-bold leading-[16px] text-white">{photo.label}</p>
            </div>
          </motion.div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={onAdd}
            className="bbi-btn-press flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-[var(--bbi-border-strong)] bg-[var(--bbi-surface-sunken)] text-[var(--bbi-muted)]"
          >
            <Plus size={22} weight="bold" />
            <span className="text-[12px] font-bold">사진 추가</span>
          </button>
        )}
      </div>

      {photos.length === 0 && (
        <p className="mt-3 text-center text-[12px] font-normal leading-[16px] text-[var(--bbi-muted-soft)]">
          아직 촬영된 사진이 없습니다
        </p>
      )}
    </div>
  );
}
