"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretRight, ImageSquare, MagnifyingGlass } from "@phosphor-icons/react";
import { GradedSwatch } from "@/projects/camera/colorrecipe/components/graded-swatch";
import { RecipeCard } from "@/projects/camera/colorrecipe/components/recipe-card";
import { BottomTabBar } from "@/projects/camera/colorrecipe/components/bottom-tab-bar";
import { categories, getRecipe, recipeThumb, recipes } from "@/projects/camera/colorrecipe/lib/recipes";
import { photos, today } from "@/projects/camera/colorrecipe/lib/photos";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

export function HomeScreen({ onNavigate }: { onNavigate: ColorRecipeNavigate }) {
  const [category, setCategory] = useState<(typeof categories)[number] | "전체">("전체");
  const reduce = useReducedMotion();

  const recentPhotos = photos.slice(0, 6);
  const recentRecipes = [...recipes]
    .sort((a, b) => (a.lastUsedAt < b.lastUsedAt ? 1 : -1))
    .slice(0, 5);
  const favoriteRecipes = recipes.filter((r) => r.favorite);
  const recommended = category === "전체" ? recipes : recipes.filter((r) => r.category === category);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto pb-24 pt-[64px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between px-6">
          <div>
            <p className="text-[12px] font-medium tabular-nums text-[var(--cr-cool-gray)]">
              {today}
            </p>
            <h1 className="mt-0.5 text-[24px] font-bold tracking-tight">안녕하세요, 지은님</h1>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("recipes")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cr-surface)]"
            aria-label="레시피 검색"
          >
            <MagnifyingGlass size={18} weight="regular" />
          </button>
        </div>

        <div className="mt-6 px-6">
          <button
            type="button"
            onClick={() => onNavigate("camera")}
            className="relative flex h-[104px] w-full items-center justify-between overflow-hidden rounded-[20px] bg-[var(--cr-surface-raised)]/60 p-1.5 ring-1 ring-white/[0.06]"
          >
            <div className="flex h-full flex-1 items-center justify-between rounded-[14px] bg-[var(--cr-surface)] px-5">
              <div className="text-left">
                <p className="text-[15px] font-semibold text-[var(--cr-foreground)]">
                  오늘의 색감으로 촬영하기
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--cr-cool-gray)]">
                  {recentRecipes[0].name} 레시피가 적용됩니다
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--cr-accent-dim)]">
                <CaretRight size={18} weight="bold" className="text-[var(--cr-accent)]" />
              </span>
            </div>
          </button>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between px-6">
            <h2 className="text-[17px] font-semibold tracking-tight">최근 촬영</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--cr-cool-gray)]"
            >
              사진 가져오기
              <ImageSquare size={14} weight="regular" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentPhotos.map((photo) => {
              const recipe = getRecipe(photo.recipeId)!;
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onNavigate("photoDetail", { photoId: photo.id })}
                  className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-[16px]"
                >
                  <GradedSwatch
                    src={recipeThumb(photo.seed, 260)}
                    alt={recipe.name}
                    grade={recipe.colorGrade}
                    sizes="112px"
                    className="h-full w-full"
                  />
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between px-6">
            <h2 className="text-[17px] font-semibold tracking-tight">즐겨찾기 레시피</h2>
            <button
              type="button"
              onClick={() => onNavigate("recipes")}
              className="text-[12.5px] font-medium text-[var(--cr-cool-gray)]"
            >
              전체보기
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="w-[148px] shrink-0">
                <RecipeCard
                  recipe={recipe}
                  onClick={() => onNavigate("recipeDetail", { recipeId: recipe.id })}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 px-6">
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">최근 사용한 레시피</h2>
          <div className="flex flex-wrap gap-2">
            {recentRecipes.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => onNavigate("recipeDetail", { recipeId: recipe.id })}
                className="flex items-center gap-2 rounded-full bg-[var(--cr-surface)] py-1.5 pl-1.5 pr-3.5"
              >
                <span className="relative h-6 w-6 overflow-hidden rounded-full">
                  <GradedSwatch
                    src={recipeThumb(recipe.heroSeed, 80)}
                    alt={recipe.name}
                    grade={recipe.colorGrade}
                    sizes="24px"
                    className="h-full w-full"
                  />
                </span>
                <span className="text-[12.5px] font-medium text-[var(--cr-foreground)]">
                  {recipe.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 px-6 text-[17px] font-semibold tracking-tight">추천 레시피</h2>
          <div className="flex gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(["전체", ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  category === c
                    ? "bg-[var(--cr-accent)] text-[#04252b]"
                    : "bg-[var(--cr-surface)] text-[var(--cr-cool-gray)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 px-6">
            {recommended.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <RecipeCard
                  recipe={recipe}
                  wide
                  onClick={() => onNavigate("recipeDetail", { recipeId: recipe.id })}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <BottomTabBar active="home" onNavigate={onNavigate} />
    </div>
  );
}
