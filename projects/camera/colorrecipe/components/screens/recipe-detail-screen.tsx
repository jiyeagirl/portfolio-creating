"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Copy,
  ExportIcon,
  Link as LinkIcon,
  PencilSimple,
  QrCode,
  Star,
  Trash,
  X,
} from "@phosphor-icons/react";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { recipeThumb } from "@/projects/camera/colorrecipe/lib/recipes";
import { photosByRecipe } from "@/projects/camera/colorrecipe/lib/photos";
import type { Recipe } from "@/projects/camera/colorrecipe/lib/types";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

export function RecipeDetailScreen({
  recipe,
  onNavigate,
}: {
  recipe: Recipe;
  onNavigate: ColorRecipeNavigate;
}) {
  const [favorite, setFavorite] = useState(recipe.favorite);
  const [showBefore, setShowBefore] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const reduce = useReducedMotion();

  const samples = photosByRecipe(recipe.id).slice(0, 4);

  return (
    <div className="relative h-full w-full pb-10">
      <div className="relative h-[360px] w-full">
        <GradedSwatch
          src={recipeThumb(recipe.heroSeed, 800)}
          alt={recipe.name}
          grade={recipe.colorGrade}
          intensity={showBefore ? 0 : 100}
          priority
          sizes="393px"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--cr-bg)] via-black/5 to-black/30" />

        <button
          type="button"
          onClick={() => onNavigate("recipes")}
          className="absolute left-5 top-[70px] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
          aria-label="레시피 목록으로"
        >
          <ArrowLeft size={20} weight="regular" />
        </button>

        <button
          type="button"
          onMouseDown={() => setShowBefore(true)}
          onMouseUp={() => setShowBefore(false)}
          onMouseLeave={() => setShowBefore(false)}
          onTouchStart={() => setShowBefore(true)}
          onTouchEnd={() => setShowBefore(false)}
          className="absolute right-5 top-[70px] rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium text-white backdrop-blur-md"
        >
          {showBefore ? "원본" : "누르면 원본"}
        </button>

        <div className="absolute inset-x-6 bottom-6">
          <span className="text-[11px] font-medium tracking-wide text-[var(--cr-cool-gray)]">
            {recipe.category} | LUT {recipe.lutIntensity}%
          </span>
          <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">
            {recipe.name}
          </h1>
          <p className="mt-1 text-[14px] text-white/80">{recipe.tagline}</p>
        </div>
      </div>

      <div className="space-y-8 px-6 pt-7">
        <div className="flex gap-2">
          <ActionButton
            icon={Star}
            label={favorite ? "즐겨찾기됨" : "즐겨찾기"}
            active={favorite}
            onClick={() => setFavorite((v) => !v)}
          />
          <ActionButton icon={Copy} label="복제" onClick={() => {}} />
          <ActionButton icon={ExportIcon} label="공유" onClick={() => setShareOpen(true)} />
          <ActionButton icon={Trash} label="삭제" danger onClick={() => setConfirmDelete(true)} />
        </div>

        <p className="text-[15px] leading-[1.7] text-[var(--cr-cool-gray)]">
          {recipe.description}
        </p>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">색감</h2>
          <div className="flex gap-2">
            {recipe.palette.map((color) => (
              <div key={color} className="flex-1">
                <div
                  className="h-14 w-full rounded-xl border border-white/10"
                  style={{ backgroundColor: color }}
                />
                <p className="mt-1.5 text-center text-[10px] font-medium tabular-nums text-[var(--cr-cool-gray)]">
                  {color.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {samples.length > 0 && (
          <section>
            <h2 className="mb-3 text-[17px] font-semibold tracking-tight">이 레시피로 찍은 사진</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {samples.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onNavigate("photoDetail", { photoId: photo.id })}
                  className="relative aspect-square overflow-hidden rounded-xl"
                >
                  <GradedSwatch
                    src={recipeThumb(photo.seed, 400)}
                    alt={`${recipe.name}로 촬영한 사진`}
                    grade={recipe.colorGrade}
                    sizes="180px"
                    className="h-full w-full"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">태그</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--cr-border)] bg-[var(--cr-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--cr-foreground)]/90"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="px-6 pt-8">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("recipeEditor", { recipeId: recipe.id })}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-[var(--cr-border)] text-[15px] font-semibold text-[var(--cr-foreground)]"
          >
            <PencilSimple size={17} weight="regular" />
            편집하기
          </button>
          <button
            type="button"
            onClick={() => onNavigate("camera")}
            className="flex h-[52px] flex-[1.3] items-center justify-center rounded-full bg-[var(--cr-accent)] text-[15px] font-semibold text-[#04252b]"
          >
            이 레시피로 촬영하기
          </button>
        </div>
      </div>

      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col justify-end bg-black/50"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={reduce ? undefined : { y: 260 }}
              animate={{ y: 0 }}
              exit={reduce ? undefined : { y: 260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-t-[24px] bg-[var(--cr-bg)] px-6 pb-10 pt-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[17px] font-semibold tracking-tight">레시피 공유</h2>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cr-surface)]"
                  aria-label="닫기"
                >
                  <X size={16} weight="regular" />
                </button>
              </div>
              <div className="space-y-2">
                <ShareRow icon={ExportIcon} label="JSON으로 내보내기" />
                <ShareRow icon={QrCode} label="QR 코드 생성" />
                <ShareRow icon={LinkIcon} label="공유 링크 복사" />
              </div>
            </motion.div>
          </motion.div>
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
                레시피를 삭제할까요
              </p>
              <p className="mt-1.5 text-[13px] text-[var(--cr-cool-gray)]">
                이 레시피로 저장한 사진에는 영향을 주지 않지만, 레시피 자체는 복구할 수 없습니다.
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
                    onNavigate("recipes");
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

function ActionButton({
  icon: Icon,
  label,
  onClick,
  active,
  danger,
}: {
  icon: typeof Star;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1.5 rounded-[16px] bg-[var(--cr-surface)] py-3"
    >
      <Icon
        size={18}
        weight={active ? "fill" : "regular"}
        className={
          danger
            ? "text-[var(--cr-danger)]"
            : active
              ? "text-[var(--cr-accent)]"
              : "text-[var(--cr-foreground)]"
        }
      />
      <span className="text-[11px] font-medium text-[var(--cr-cool-gray)]">{label}</span>
    </button>
  );
}

function ShareRow({ icon: Icon, label }: { icon: typeof QrCode; label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-[16px] bg-[var(--cr-surface)] px-4 py-3.5 text-left"
    >
      <Icon size={19} weight="regular" className="text-[var(--cr-accent)]" />
      <span className="text-[14px] font-medium text-[var(--cr-foreground)]">{label}</span>
    </button>
  );
}
