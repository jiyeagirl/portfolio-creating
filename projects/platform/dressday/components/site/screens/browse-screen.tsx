"use client";

import { useMemo, useState } from "react";
import { CaretDown, Check, SlidersHorizontal, X } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import type { Category, Occasion, Product, Size } from "@/projects/platform/dressday/lib/types";
import { CATEGORIES, OCCASIONS, PRODUCTS, SIZES } from "@/projects/platform/dressday/lib/catalog";
import { CONTAINER, Chip, PrimaryButton, ProductCard } from "@/projects/platform/dressday/components/site/ui";

const COLORS: { name: string; hex: string }[] = [
  { name: "화이트", hex: "#f4f1ea" },
  { name: "아이보리", hex: "#efe9dc" },
  { name: "베이지", hex: "#c8b08c" },
  { name: "그레이", hex: "#8a8a88" },
  { name: "블랙", hex: "#2b2a29" },
  { name: "네이비", hex: "#1f2a44" },
  { name: "버건디", hex: "#6e2433" },
  { name: "라이트 블루", hex: "#a9bfd6" },
];

const PRICE_BANDS = [
  { key: "~15000", label: "1만 5천원 이하", test: (p: number) => p <= 15000 },
  { key: "15000~30000", label: "1만 5천원 ~ 3만원", test: (p: number) => p > 15000 && p <= 30000 },
  { key: "30000~", label: "3만원 초과", test: (p: number) => p > 30000 },
];

const SORTS = ["추천순", "대여 많은 순", "낮은 가격순", "신규순"] as const;
type Sort = (typeof SORTS)[number];

type Filters = {
  todayOnly: boolean;
  categories: Category[];
  sizes: Size[];
  colors: string[];
  price: string | null;
  occasions: Occasion[];
};

const INITIAL: Filters = { todayOnly: true, categories: [], sizes: ["S"], colors: [], price: null, occasions: [] };

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function apply(f: Filters, sort: Sort): Product[] {
  const band = PRICE_BANDS.find((b) => b.key === f.price);
  const list = PRODUCTS.filter(
    (p) =>
      (!f.todayOnly || p.today) &&
      (f.categories.length === 0 || f.categories.includes(p.category)) &&
      (f.sizes.length === 0 || f.sizes.some((s) => p.stock[s] !== undefined)) &&
      (f.colors.length === 0 || f.colors.includes(p.color)) &&
      (!band || band.test(p.price)) &&
      (f.occasions.length === 0 || f.occasions.some((o) => p.occasions.includes(o))),
  );
  const sorted = [...list];
  if (sort === "대여 많은 순") sorted.sort((a, b) => b.rentals - a.rentals);
  if (sort === "낮은 가격순") sorted.sort((a, b) => a.price - b.price);
  if (sort === "신규순") sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return sorted;
}

export function BrowseScreen({ onOpenProduct, initialSheet = false }: { onOpenProduct: (id: string) => void; initialSheet?: boolean }) {
  const [f, setF] = useState<Filters>(INITIAL);
  const [sort, setSort] = useState<Sort>("추천순");
  const [sheet, setSheet] = useState(initialSheet);
  const results = useMemo(() => apply(f, sort), [f, sort]);

  const active: { label: string; clear: () => void }[] = [
    ...(f.todayOnly ? [{ label: "오늘 수령 가능", clear: () => setF({ ...f, todayOnly: false }) }] : []),
    ...f.categories.map((c) => ({ label: c, clear: () => setF({ ...f, categories: toggle(f.categories, c) }) })),
    ...f.sizes.map((s) => ({ label: `사이즈 ${s}`, clear: () => setF({ ...f, sizes: toggle(f.sizes, s) }) })),
    ...f.colors.map((c) => ({ label: c, clear: () => setF({ ...f, colors: toggle(f.colors, c) }) })),
    ...(f.price ? [{ label: PRICE_BANDS.find((b) => b.key === f.price)!.label, clear: () => setF({ ...f, price: null }) }] : []),
    ...f.occasions.map((o) => ({ label: o, clear: () => setF({ ...f, occasions: toggle(f.occasions, o) }) })),
  ];

  return (
    <div className={`${CONTAINER} dd-enter pt-8 lg:pt-10`}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">옷 둘러보기</h1>
          <p className="dd-num mt-1 text-[14px] text-[var(--dd-muted)]">오늘 9월 18일 (금), 성동구 성수이로 118 기준</p>
        </div>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* 데스크톱 좌측 필터 */}
        <aside className="hidden lg:block">
          <FilterPanel f={f} setF={setF} />
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--dd-hairline)] pb-4">
            <p className="dd-num text-[15px]">
              <span className="font-semibold">{results.length}</span>
              <span className="text-[var(--dd-muted)]">벌</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="dd-press flex h-10 items-center gap-2 rounded-full border border-[var(--dd-hairline)] px-4 text-[14px] font-medium lg:hidden"
              >
                <SlidersHorizontal size={18} />
                필터
                <span className="dd-num flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dd-ink)] px-1.5 text-[12px] text-white">
                  {active.length}
                </span>
              </button>
              <label className="relative flex h-10 items-center">
                <span className="sr-only">정렬</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-10 appearance-none rounded-full border border-[var(--dd-hairline)] bg-white pl-4 pr-9 text-[14px] font-medium outline-none focus:border-[var(--dd-ink)]"
                >
                  {SORTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <CaretDown size={14} className="pointer-events-none absolute right-3.5" />
              </label>
            </div>
          </div>

          {active.length > 0 && (
            <div className="dd-scroll-x -mx-6 flex gap-2 overflow-x-auto px-6 py-4 lg:mx-0 lg:flex-wrap lg:px-0">
              {active.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.clear}
                  className="dd-press flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[var(--dd-strong)] pl-3 pr-2 text-[13px] font-medium"
                >
                  {a.label}
                  <X size={14} aria-label="필터 해제" />
                </button>
              ))}
              <button type="button" onClick={() => setF({ todayOnly: false, categories: [], sizes: [], colors: [], price: null, occasions: [] })} className="shrink-0 px-2 text-[13px] underline underline-offset-4">
                모두 해제
              </button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 pt-2 md:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => onOpenProduct(p.id)} saved={p.id === "wrap-midi"} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-[16px] font-semibold">조건에 맞는 옷이 없어요</p>
              <button type="button" onClick={() => setF({ ...f, todayOnly: false })} className="mt-3 text-[14px] underline underline-offset-4">
                내일 받을 수 있는 옷까지 보기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 필터 바텀 시트 */}
      {sheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="필터 닫기" onClick={() => setSheet(false)} className="dd-scrim absolute inset-0 bg-black/50" />
          <div className="dd-sheet-up absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-[16px] bg-white">
            <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-[var(--dd-hairline)]">
              <span aria-hidden className="absolute top-2 h-1 w-9 rounded-full bg-[var(--dd-hairline)]" />
              <button type="button" aria-label="필터 닫기" onClick={() => setSheet(false)} className="absolute left-3 flex h-11 w-11 items-center justify-center">
                <X size={20} />
              </button>
              <span className="text-[16px] font-semibold">필터</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              <FilterPanel f={f} setF={setF} />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[var(--dd-hairline)] px-6 py-4">
              <button type="button" onClick={() => setF(INITIAL)} className="text-[15px] font-medium underline underline-offset-4">
                초기화
              </button>
              <PrimaryButton onClick={() => setSheet(false)} className="flex-1">
                <span className="dd-num">{results.length}벌 보기</span>
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({ f, setF }: { f: Filters; setF: (f: Filters) => void }) {
  return (
    <div className="divide-y divide-[var(--dd-hairline)]">
      <div className="flex items-center justify-between gap-3 py-5 lg:pt-0">
        <span className="text-[16px] font-semibold">오늘 수령 가능만</span>
        <Toggle
          checked={f.todayOnly}
          onChange={(v) => setF({ ...f, todayOnly: v })}
          label="오늘 수령 가능만 보기"
          size="lg"
          onClassName="bg-[var(--dd-ink)]"
          offClassName="bg-[var(--dd-border-strong)]"
        />
      </div>

      <Group title="카테고리">
        <ul className="space-y-1">
          {CATEGORIES.map((c) => {
            const on = f.categories.includes(c);
            return (
              <li key={c}>
                <button type="button" onClick={() => setF({ ...f, categories: toggle(f.categories, c) })} className="flex h-10 w-full items-center gap-3 text-left text-[15px]">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border ${on ? "border-[var(--dd-ink)] bg-[var(--dd-ink)] text-white" : "border-[var(--dd-border-strong)]"}`}>
                    {on && <Check size={14} weight="bold" />}
                  </span>
                  <span className="flex-1">{c}</span>
                  <span className="dd-num text-[13px] text-[var(--dd-muted)]">{apply({ ...f, categories: [c] }, "추천순").length}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="사이즈">
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((s) => {
            const on = f.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => setF({ ...f, sizes: toggle(f.sizes, s) })}
                className={`dd-press h-11 rounded-[8px] border text-[14px] font-medium ${on ? "border-[var(--dd-ink)] bg-[var(--dd-ink)] text-white" : "border-[var(--dd-hairline)]"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="색상">
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {COLORS.map((c) => {
            const on = f.colors.includes(c.name);
            return (
              <button key={c.name} type="button" aria-pressed={on} onClick={() => setF({ ...f, colors: toggle(f.colors, c.name) })} className="flex flex-col items-center gap-1.5">
                <span
                  className={`h-8 w-8 rounded-full border ${on ? "ring-2 ring-[var(--dd-ink)] ring-offset-2" : ""}`}
                  style={{ background: c.hex, borderColor: "rgba(0,0,0,0.08)" }}
                />
                <span className={`whitespace-nowrap text-[12px] ${on ? "font-semibold" : "text-[var(--dd-muted)]"}`}>{c.name}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="1일 대여료">
        <div className="flex flex-col gap-1">
          {PRICE_BANDS.map((b) => {
            const on = f.price === b.key;
            return (
              <button key={b.key} type="button" onClick={() => setF({ ...f, price: on ? null : b.key })} className="flex h-10 items-center gap-3 text-left text-[15px]">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${on ? "border-[6px] border-[var(--dd-ink)]" : "border-[var(--dd-border-strong)]"}`} />
                {b.label}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="입을 자리">
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <Chip key={o} on={f.occasions.includes(o)} onClick={() => setF({ ...f, occasions: toggle(f.occasions, o) })}>
              {o}
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5">
      <p className="mb-3 text-[16px] font-semibold">{title}</p>
      {children}
    </div>
  );
}
