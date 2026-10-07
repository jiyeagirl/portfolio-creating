"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { openSlotCount, TOTAL_COURSE_COUNT } from "@/projects/b2b/teefinder/lib/mock-data";
import { TODAY } from "@/projects/b2b/teefinder/lib/format";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { EmptyLine, HeartButton, Segmented } from "@/projects/b2b/teefinder/components/app/app-ui";
import { Badge, Monogram, accountTone } from "@/projects/b2b/teefinder/components/ui";
import type { Region } from "@/projects/b2b/teefinder/lib/types";

const REGION_CHIPS: Array<Region | "전체"> = ["전체", "경기", "강원", "충청", "영남", "호남", "제주"];

export function CoursesScreen({ onOpenCourse }: { onOpenCourse: (courseId: string) => void }) {
  const { courses, accounts, favorites, toggleFavorite } = useStore();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "전체">("전체");
  const [scope, setScope] = useState<"all" | "fav">("all");

  const rows = useMemo(
    () =>
      courses.filter(
        (c) =>
          (region === "전체" || c.region === region) &&
          (scope === "all" || favorites.includes(c.id)) &&
          c.name.includes(query.trim()),
      ),
    [courses, region, scope, favorites, query],
  );

  return (
    <div className="flex h-full flex-col bg-[var(--tf-canvas)]">
      <header className="border-b border-[var(--tf-line)] bg-[var(--tf-surface)] pt-[59px]">
        <div className="flex h-14 items-end px-5 pb-2">
          <h1 className="text-[24px] font-bold tracking-[-0.02em]">골프장</h1>
          <span className="ml-2 pb-1 text-[14px] text-[var(--tf-ink-3)]">
            총 {TOTAL_COURSE_COUNT}곳 중 연동 {courses.length}곳
          </span>
        </div>
        <div className="space-y-3 px-5 pb-3 pt-1">
          <label className="relative block">
            <span className="sr-only">골프장 이름 검색</span>
            <MagnifyingGlass
              size={20}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--tf-ink-3)]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="골프장 이름"
              className="h-11 w-full rounded-[12px] bg-[var(--tf-soft)] pl-11 pr-4 text-[16px] placeholder:text-[var(--tf-ink-3)]"
            />
          </label>
          <div className="tf-scroll-x -mx-5 flex gap-2 overflow-x-auto px-5">
            {REGION_CHIPS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                aria-pressed={region === r}
                className={`tf-press h-11 shrink-0 rounded-[10px] px-4 text-[15px] ${
                  region === r
                    ? "bg-[var(--tf-brand)] font-semibold text-white"
                    : "bg-[var(--tf-soft)] font-medium text-[var(--tf-ink-2)] active:bg-[var(--tf-pressed)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Segmented
            value={scope}
            onChange={setScope}
            options={[
              { value: "all", label: "전체" },
              { value: "fav", label: `즐겨찾기 ${favorites.length}` },
            ]}
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--tf-surface)]">
        {rows.length === 0 ? (
          <EmptyLine
            text={scope === "fav" ? "즐겨찾기한 골프장이 없어요" : "검색 결과가 없어요"}
            action={scope === "fav" ? "전체 골프장 보기" : "검색어 지우기"}
            onAction={() => {
              setScope("all");
              setQuery("");
              setRegion("전체");
            }}
          />
        ) : (
          <ul className="divide-y divide-[var(--tf-line)]">
            {rows.map((c) => {
              const account = accounts.find((a) => a.courseId === c.id);
              const open = openSlotCount(c.id, TODAY);
              return (
                <li key={c.id} className="flex items-center gap-3 py-2 pl-5 pr-2">
                  <button
                    type="button"
                    onClick={() => onOpenCourse(c.id)}
                    className="tf-press flex min-h-[64px] min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <Monogram name={c.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold tracking-[-0.01em]">{c.name}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-[var(--tf-ink-3)]">
                        {c.region} | 오늘 잔여 {open}
                      </span>
                    </span>
                    {account && (
                      <Badge tone={accountTone(account.status)} compact>
                        {account.status}
                      </Badge>
                    )}
                  </button>
                  <HeartButton
                    active={favorites.includes(c.id)}
                    onToggle={() => toggleFavorite(c.id)}
                    name={c.name}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
