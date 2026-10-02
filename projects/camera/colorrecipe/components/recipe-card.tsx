"use client";

import { Star } from "@phosphor-icons/react";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { recipeThumb } from "@/projects/camera/colorrecipe/lib/recipes";
import type { Recipe } from "@/projects/camera/colorrecipe/lib/types";

export function RecipeCard({
  recipe,
  onClick,
  wide = false,
}: {
  recipe: Recipe;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[var(--cr-surface-raised)]/60 p-1.5 text-left ring-1 ring-white/[0.06]"
    >
      <div
        className={`relative overflow-hidden rounded-[14px] ${wide ? "aspect-[4/3]" : "aspect-square"}`}
      >
        <GradedSwatch
          src={recipeThumb(recipe.heroSeed, 400)}
          alt={recipe.name}
          grade={recipe.colorGrade}
          sizes="200px"
          className="h-full w-full"
        />
        {recipe.favorite && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/45">
            <Star size={12} weight="fill" className="text-[var(--cr-accent)]" />
          </span>
        )}
      </div>
      <div className="px-2 pb-1.5 pt-2">
        <p className="truncate text-[13.5px] font-semibold tracking-tight text-[var(--cr-foreground)]">
          {recipe.name}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-[var(--cr-cool-gray)]">
          {recipe.category} | {recipe.tagline}
        </p>
      </div>
    </button>
  );
}
