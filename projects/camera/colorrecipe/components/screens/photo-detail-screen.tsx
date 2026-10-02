"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowsClockwise,
  DeviceMobile,
  Download,
  Heart,
  Link as LinkGlyph,
  PencilSimple,
  ShareNetwork,
  Trash,
  X,
} from "@phosphor-icons/react";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { Histogram } from "@/projects/camera/colorrecipe/components/histogram";
import { Segmented } from "@/projects/camera/colorrecipe/components/segmented";
import { Toggle } from "@/components/shared/toggle";
import { getRecipe, recipes, recipeThumb } from "@/projects/camera/colorrecipe/lib/recipes";
import type { Photo } from "@/projects/camera/colorrecipe/lib/types";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

export function PhotoDetailScreen({
  photo,
  onNavigate,
}: {
  photo: Photo;
  onNavigate: ColorRecipeNavigate;
}) {
  const [recipeId, setRecipeId] = useState(photo.recipeId);
  const [favorite, setFavorite] = useState(photo.favorite);
  const [showOriginal, setShowOriginal] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fileFormat, setFileFormat] = useState<"jpeg" | "png">("jpeg");
  const [highRes, setHighRes] = useState(true);
  const [keepMeta, setKeepMeta] = useState(true);
  const reduce = useReducedMotion();

  const recipe = getRecipe(recipeId)!;

  return (
    <div className="relative h-full w-full pb-10">
      <div className="flex items-center justify-between px-5 pt-[64px]">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--cr-surface)]"
          aria-label="홈으로 돌아가기"
        >
          <ArrowLeft size={20} weight="regular" />
        </button>
        <span className="text-[12px] font-medium tabular-nums text-[var(--cr-cool-gray)]">
          {photo.capturedAt}
        </span>
        <button
          type="button"
          onClick={() => setFavorite((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--cr-surface)]"
          aria-label="즐겨찾기"
        >
          <Heart
            size={19}
            weight={favorite ? "fill" : "regular"}
            className={favorite ? "text-[var(--cr-danger)]" : "text-[var(--cr-foreground)]"}
          />
        </button>
      </div>

      <div className="relative mx-5 mt-3 aspect-square overflow-hidden rounded-[24px]">
        <GradedSwatch
          src={recipeThumb(photo.seed, 800)}
          alt="촬영한 사진"
          grade={recipe.colorGrade}
          intensity={showOriginal ? 0 : 100}
          priority
          sizes="345px"
          className="h-full w-full"
        />
        <button
          type="button"
          onMouseDown={() => setShowOriginal(true)}
          onMouseUp={() => setShowOriginal(false)}
          onMouseLeave={() => setShowOriginal(false)}
          onTouchStart={() => setShowOriginal(true)}
          onTouchEnd={() => setShowOriginal(false)}
          className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md"
        >
          {showOriginal ? "원본" : "누르면 원본"}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 px-6">
        <button
          type="button"
          onClick={() => onNavigate("recipeDetail", { recipeId: recipe.id })}
          className="flex flex-1 items-center gap-2.5 rounded-full bg-[var(--cr-surface)] py-2 pl-2 pr-4"
        >
          <span className="relative h-8 w-8 overflow-hidden rounded-full">
            <GradedSwatch
              src={recipeThumb(recipe.heroSeed, 80)}
              alt={recipe.name}
              grade={recipe.colorGrade}
              sizes="32px"
              className="h-full w-full"
            />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-semibold text-[var(--cr-foreground)]">
              {recipe.name}
            </span>
            <span className="block text-[11px] text-[var(--cr-cool-gray)]">적용된 레시피</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cr-surface)]"
          aria-label="다른 레시피로 재적용"
        >
          <ArrowsClockwise size={17} weight="regular" />
        </button>
      </div>

      <div className="mt-6 flex gap-2 px-6">
        <button
          type="button"
          onClick={() => onNavigate("recipeEditor", { recipeId: recipe.id })}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--cr-border)] text-[13.5px] font-semibold text-[var(--cr-foreground)]"
        >
          <PencilSimple size={15} weight="regular" />
          색감 편집
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--cr-border)] text-[13.5px] font-semibold text-[var(--cr-foreground)]"
        >
          <ShareNetwork size={15} weight="regular" />
          공유
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--cr-border)]"
          aria-label="삭제"
        >
          <Trash size={16} weight="regular" className="text-[var(--cr-danger)]" />
        </button>
      </div>

      <div className="mt-7 px-6">
        <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
          히스토그램
        </h2>
        <Histogram seed={photo.seed} />
      </div>

      <div className="mt-7 px-6">
        <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
          촬영 정보
        </h2>
        <div className="divide-y divide-[var(--cr-border)] overflow-hidden rounded-[16px] bg-[var(--cr-surface)]">
          <ExifRow label="카메라" value={photo.exif.camera} />
          <ExifRow label="렌즈" value={`${photo.exif.lens} (${photo.exif.focalLength})`} />
          <ExifRow
            label="노출"
            value={`${photo.exif.aperture} ${photo.exif.shutterSpeed}s ISO ${photo.exif.iso}`}
          />
          <ExifRow label="해상도" value={photo.exif.resolution} />
          <ExifRow label="파일 크기" value={photo.exif.fileSize} />
          <ExifRow label="파일명" value={photo.exif.fileName} />
        </div>
      </div>

      <AnimatePresence>
        {pickerOpen && (
          <Sheet title="레시피 재적용" onClose={() => setPickerOpen(false)} reduce={!!reduce}>
            <div className="grid grid-cols-3 gap-2.5">
              {recipes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRecipeId(r.id);
                    setPickerOpen(false);
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`relative h-16 w-16 overflow-hidden rounded-[14px] ${
                      r.id === recipeId ? "ring-2 ring-[var(--cr-accent)]" : ""
                    }`}
                  >
                    <GradedSwatch
                      src={recipeThumb(r.heroSeed, 160)}
                      alt={r.name}
                      grade={r.colorGrade}
                      sizes="64px"
                      className="h-full w-full"
                    />
                  </span>
                  <span className="truncate text-[10.5px] font-medium text-[var(--cr-cool-gray)]">
                    {r.name}
                  </span>
                </button>
              ))}
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && (
          <Sheet title="사진 저장 및 공유" onClose={() => setShareOpen(false)} reduce={!!reduce}>
            <div className="space-y-6">
              <section>
                <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
                  공유
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  <ShareTile icon={ShareNetwork} label="SNS 공유" />
                  <ShareTile icon={LinkGlyph} label="링크 복사" />
                  <ShareTile icon={DeviceMobile} label="AirDrop" />
                </div>
              </section>
              <section>
                <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--cr-cool-gray)]">
                  저장 옵션
                </h3>
                <div className="space-y-3.5 rounded-[16px] bg-[var(--cr-surface)] p-4">
                  <Segmented
                    options={[
                      { id: "jpeg", label: "JPEG" },
                      { id: "png", label: "PNG" },
                    ]}
                    value={fileFormat}
                    onChange={setFileFormat}
                  />
                  <ToggleRow label="고해상도로 저장" checked={highRes} onChange={setHighRes} />
                  <ToggleRow label="메타데이터 유지" checked={keepMeta} onChange={setKeepMeta} />
                </div>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="mt-3.5 flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--cr-accent)] text-[14px] font-semibold text-[#04252b]"
                >
                  <Download size={16} weight="regular" />
                  기기에 저장
                </button>
              </section>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-8"
          >
            <div className="w-full rounded-[20px] bg-[var(--cr-surface)] p-5">
              <p className="text-[15px] font-semibold text-[var(--cr-foreground)]">
                사진을 삭제할까요
              </p>
              <p className="mt-1.5 text-[13px] text-[var(--cr-cool-gray)]">
                삭제한 사진은 복구할 수 없습니다.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="h-11 flex-1 rounded-full bg-[var(--cr-surface-raised)] text-[13.5px] font-semibold text-[var(--cr-foreground)]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    onNavigate("home");
                  }}
                  className="h-11 flex-1 rounded-full bg-[var(--cr-danger)] text-[13.5px] font-semibold text-white"
                >
                  삭제
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExifRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-[var(--cr-cool-gray)]">{label}</span>
      <span className="text-[13px] font-medium tabular-nums text-[var(--cr-foreground)]">
        {value}
      </span>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-[var(--cr-foreground)]">{label}</span>
      <Toggle
        checked={checked}
        onChange={onChange}
        label={label}
        onClassName="bg-[var(--cr-accent)]"
        offClassName="bg-[var(--cr-cool-gray-soft)]"
      />
    </div>
  );
}

function ShareTile({ icon: Icon, label }: { icon: typeof ShareNetwork; label: string }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1.5 rounded-[16px] bg-[var(--cr-surface)] py-3.5"
    >
      <Icon size={19} weight="regular" className="text-[var(--cr-accent)]" />
      <span className="text-[11px] font-medium text-[var(--cr-cool-gray)]">{label}</span>
    </button>
  );
}

function Sheet({
  title,
  onClose,
  reduce,
  children,
}: {
  title: string;
  onClose: () => void;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col justify-end bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={reduce ? undefined : { y: 320 }}
        animate={{ y: 0 }}
        exit={reduce ? undefined : { y: 320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[70%] overflow-y-auto rounded-t-[24px] bg-[var(--cr-bg)] px-6 pb-10 pt-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cr-surface)]"
            aria-label="닫기"
          >
            <X size={16} weight="regular" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
