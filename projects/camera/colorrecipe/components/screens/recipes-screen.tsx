"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { RecipeCard } from "@/projects/camera/colorrecipe/components/recipe-card";
import { Segmented } from "@/projects/camera/colorrecipe/components/segmented";
import { BottomTabBar } from "@/projects/camera/colorrecipe/components/bottom-tab-bar";
import { recipes } from "@/projects/camera/colorrecipe/lib/recipes";
import type { ColorRecipeNavigate } from "@/projects/camera/colorrecipe/lib/navigation";

type Filter = "all" | "mine" | "official" | "favorite";
type Sort = "recent" | "name" | "usage";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "mine", label: "내 레시피" },
  { id: "official", label: "기본 레시피" },
  { id: "favorite", label: "즐겨찾기" },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "recent", label: "최근 사용순" },
  { id: "name", label: "이름순" },
  { id: "usage", label: "사용 많은순" },
];

export function RecipesScreen({ onNavigate }: { onNavigate: ColorRecipeNavigate }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = recipes;
    if (filter === "mine") list = list.filter((r) => r.source === "user");
    if (filter === "official") list = list.filter((r) => r.source === "official");
    if (filter === "favorite") list = list.filter((r) => r.favorite);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    if (sort === "usage") sorted.sort((a, b) => b.usageCount - a.usageCount);
    if (sort === "recent") sorted.sort((a, b) => (a.lastUsedAt < b.lastUsedAt ? 1 : -1));
    return sorted;
  }, [filter, sort, query]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto pb-24 pt-[64px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-[24px] font-bold tracking-tight">레시피</h1>
          <button
            type="button"
            onClick={() => onNavigate("recipeEditor")}
            className="flex items-center gap-1.5 rounded-full bg-[var(--cr-accent)] py-2 pl-2.5 pr-3.5 text-[12.5px] font-semibold text-[#04252b]"
          >
            <Plus size={15} weight="bold" />
            새 레시피
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-[var(--cr-surface)] px-4 py-2.5 mx-6">
          <MagnifyingGlass size={16} weight="regular" className="text-[var(--cr-cool-gray)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="레시피 이름, 태그로 검색"
            className="w-full bg-transparent text-[13.5px] text-[var(--cr-foreground)] placeholder:text-[var(--cr-cool-gray)] focus:outline-none"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                filter === f.id
                  ? "bg-[var(--cr-accent)] text-[#04252b]"
                  : "bg-[var(--cr-surface)] text-[var(--cr-cool-gray)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-3 px-6">
          <Segmented options={SORTS} value={sort} onChange={setSort} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 px-6">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              wide
              onClick={() => onNavigate("recipeDetail", { recipeId: recipe.id })}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center px-10 text-center">
            <p className="text-[14px] font-medium text-[var(--cr-foreground)]">
              조건에 맞는 레시피가 없어요
            </p>
            <p className="mt-1.5 text-[12.5px] text-[var(--cr-cool-gray)]">
              다른 검색어나 필터로 다시 찾아보세요
            </p>
          </div>
        )}
      </div>

      <BottomTabBar active="recipes" onNavigate={onNavigate} />
    </div>
  );
}
