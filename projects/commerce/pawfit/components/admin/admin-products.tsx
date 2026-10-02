"use client";

import { useMemo, useState } from "react";
import type { StaticImageData } from "next/image";
import { Plus, X } from "@phosphor-icons/react";
import { ADMIN_PRODUCTS, PRODUCT_BY_ID, formatWon } from "@/projects/commerce/pawfit/lib/mock-data";
import type { AdminProductRow, BrandTint, ProductCategory, Species } from "@/projects/commerce/pawfit/lib/types";
import {
  Drawer,
  FilterChips,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
  Tag,
} from "@/projects/commerce/pawfit/components/admin/admin-ui";
import { GhostButton, PrimaryButton, ProductTile, inputClass } from "@/projects/commerce/pawfit/components/ui";

type CategoryFilter = "all" | ProductCategory;

const CATEGORIES: ProductCategory[] = ["니트", "레인코트", "하네스", "반다나", "부츠", "잠옷"];

const SPECIES_LABEL: Record<Species, string> = { dog: "강아지", cat: "고양이" };
const SPECIES_LIST: Species[] = ["dog", "cat"];

const PER_PAGE = 6;

function tileFor(
  row: AdminProductRow,
): { tint: BrandTint; colorways: { name: string; hex: string }[]; image?: StaticImageData } {
  const product = PRODUCT_BY_ID[row.id];
  if (product) return { tint: product.brandTint, colorways: product.colorways, image: product.image };
  return { tint: "cream", colorways: [] };
}

function speciesLabel(list: Species[]): string {
  if (list.length === 0) return "미지정";
  return list.map((s) => SPECIES_LABEL[s]).join(", ");
}

type ProductDraft = {
  name: string;
  category: ProductCategory;
  price: string;
  stock: string;
};

const BLANK_DRAFT: ProductDraft = {
  name: "",
  category: "니트",
  price: "",
  stock: "",
};

export function AdminProducts() {
  const [rows, setRows] = useState<AdminProductRow[]>(ADMIN_PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [exposedOnly, setExposedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editExposed, setEditExposed] = useState(true);
  const [editRecommendedFor, setEditRecommendedFor] = useState<Species[]>([]);

  const [addOpen, setAddOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<ProductDraft>(BLANK_DRAFT);
  const [productSeq, setProductSeq] = useState(rows.length + 1);

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (exposedOnly && !row.exposed) return false;
      if (!q) return true;
      return row.name.includes(q);
    });
  }, [rows, query, category, exposedOnly]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openRow = rows.find((r) => r.id === openId) ?? null;

  const counts = (key: CategoryFilter) =>
    key === "all" ? rows.length : rows.filter((r) => r.category === key).length;

  const openEdit = (row: AdminProductRow) => {
    setOpenId(row.id);
    setEditName(row.name);
    setEditPrice(String(row.price));
    setEditStock(String(row.stock));
    setEditExposed(row.exposed);
    setEditRecommendedFor(row.recommendedFor);
  };

  const closeEdit = () => setOpenId(null);

  const saveEdit = () => {
    if (!openId) return;
    const price = parseInt(editPrice.replace(/[^0-9]/g, ""), 10) || 0;
    const stock = parseInt(editStock.replace(/[^0-9]/g, ""), 10) || 0;
    setRows((prev) =>
      prev.map((r) =>
        r.id === openId
          ? { ...r, name: editName, price, stock, exposed: editExposed, recommendedFor: editRecommendedFor }
          : r,
      ),
    );
    closeEdit();
  };

  const quickToggleExposed = () => {
    if (!openId) return;
    setRows((prev) =>
      prev.map((r) => (r.id === openId ? { ...r, exposed: !r.exposed } : r)),
    );
    setEditExposed((v) => !v);
  };

  const toggleRecommended = (species: Species) => {
    setEditRecommendedFor((prev) =>
      prev.includes(species) ? prev.filter((s) => s !== species) : [...prev, species],
    );
  };

  const submitAdd = () => {
    const price = parseInt(addDraft.price.replace(/[^0-9]/g, ""), 10) || 0;
    const stock = parseInt(addDraft.stock.replace(/[^0-9]/g, ""), 10) || 0;
    const id = `admin-new-${productSeq}`;
    setProductSeq((n) => n + 1);
    const newRow: AdminProductRow = {
      id,
      name: addDraft.name || "새 상품",
      category: addDraft.category,
      price,
      stock,
      exposed: true,
      recommendedFor: ["dog", "cat"],
      updatedAt: "2026-07-30",
    };
    setRows((prev) => [newRow, ...prev]);
    setAddDraft(BLANK_DRAFT);
    setAddOpen(false);
    setPage(1);
  };

  return (
    <>
      <PageHead
        title="상품 관리"
        description="상품 등록과 수정, 재고와 노출 여부, 사이즈 추천 대상 설정을 한 화면에서 관리합니다."
        actions={
          <GhostButton full={false} onClick={() => setAddOpen((v) => !v)}>
            <span className="flex items-center gap-1.5">
              <Plus size={14} weight="bold" />
              상품 등록
            </span>
          </GhostButton>
        }
      />

      {addOpen && (
        <Panel className="mb-4" title="상품 등록" note="이름, 카테고리, 가격, 재고를 입력합니다">
          <div className="space-y-4 px-5 py-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">이름</span>
              <input
                className={inputClass}
                value={addDraft.name}
                onChange={(e) => setAddDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="포근한 겨울 니트"
              />
            </label>

            <div>
              <span className="text-[13px] font-semibold">카테고리</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAddDraft((d) => ({ ...d, category: cat }))}
                    aria-pressed={addDraft.category === cat}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                      addDraft.category === cat
                        ? "bg-[var(--pf-ink)] text-[var(--pf-on-primary)]"
                        : "border border-[var(--pf-hairline)] text-[var(--pf-muted)] hover:text-[var(--pf-ink)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold">가격(원)</span>
                <input
                  type="number"
                  className={inputClass}
                  value={addDraft.price}
                  onChange={(e) => setAddDraft((d) => ({ ...d, price: e.target.value }))}
                  placeholder="32000"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold">재고</span>
                <input
                  type="number"
                  className={inputClass}
                  value={addDraft.stock}
                  onChange={(e) => setAddDraft((d) => ({ ...d, stock: e.target.value }))}
                  placeholder="40"
                />
              </label>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <PrimaryButton full={false} onClick={submitAdd}>
                상품 등록
              </PrimaryButton>
              <GhostButton
                full={false}
                onClick={() => {
                  setAddOpen(false);
                  setAddDraft(BLANK_DRAFT);
                }}
              >
                취소
              </GhostButton>
            </div>
          </div>
        </Panel>
      )}

      <Panel
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="상품명 검색"
            />
            <FilterChips<CategoryFilter>
              value={category}
              onChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
              options={[
                { key: "all", label: "전체", count: counts("all") },
                ...CATEGORIES.map((cat) => ({ key: cat as CategoryFilter, label: cat, count: counts(cat) })),
              ]}
            />
            <button
              type="button"
              onClick={() => {
                setExposedOnly((v) => !v);
                setPage(1);
              }}
              aria-pressed={exposedOnly}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                exposedOnly
                  ? "bg-[var(--pf-ink)] text-[var(--pf-on-primary)]"
                  : "border border-[var(--pf-hairline)] text-[var(--pf-muted)] hover:text-[var(--pf-ink)]"
              }`}
            >
              노출 상품만
            </button>
          </div>
        }
        title="상품 목록"
        note="행을 누르면 상세 정보를 수정하고 노출 여부를 전환할 수 있습니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead>
              <tr className="border-b border-[var(--pf-hairline)] text-[11.5px] text-[var(--pf-muted)]">
                <th className="px-5 py-3 font-semibold">상품</th>
                <th className="px-3 py-3 font-semibold">카테고리</th>
                <th className="px-3 py-3 font-semibold">가격</th>
                <th className="px-3 py-3 font-semibold">재고</th>
                <th className="px-3 py-3 font-semibold">추천 대상</th>
                <th className="px-5 py-3 font-semibold">노출여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--pf-hairline)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-semibold">조건에 맞는 상품이 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--pf-muted)]">
                      카테고리 필터를 전체로 바꾸거나 검색어를 지워 보세요.
                    </p>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const tile = tileFor(row);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => openEdit(row)}
                      className="cursor-pointer text-[13px] hover:bg-[var(--pf-surface-card)]"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <ProductTile
                            category={row.category}
                            tint={tile.tint}
                            colorways={tile.colorways}
                            image={tile.image}
                            alt={row.name}
                            size={40}
                          />
                          <span className="font-semibold">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[var(--pf-muted)]">{row.category}</td>
                      <td className="pf-num px-3 py-3 font-semibold">{formatWon(row.price)}원</td>
                      <td className="pf-num px-3 py-3">{row.stock}</td>
                      <td className="px-3 py-3 text-[var(--pf-muted)]">{speciesLabel(row.recommendedFor)}</td>
                      <td className="px-5 py-3">
                        <Tag tone={row.exposed ? "success" : "neutral"}>{row.exposed ? "게시중" : "숨김"}</Tag>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {openRow && (
        <Drawer onClose={closeEdit}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <ProductTile
                category={openRow.category}
                tint={tileFor(openRow).tint}
                colorways={tileFor(openRow).colorways}
                image={tileFor(openRow).image}
                alt={openRow.name}
                size={48}
              />
              <div>
                <p className="pf-num text-[12px] text-[var(--pf-muted)]">{openRow.id}</p>
                <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight">상품 상세</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={closeEdit}
              aria-label="닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--pf-surface-card)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">이름</span>
              <input className={inputClass} value={editName} onChange={(e) => setEditName(e.target.value)} />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold">가격(원)</span>
                <input
                  type="number"
                  className={inputClass}
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold">재고</span>
                <input
                  type="number"
                  className={inputClass}
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                />
              </label>
            </div>

            <div>
              <span className="text-[13px] font-semibold">노출여부</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[true, false].map((exposed) => (
                  <button
                    key={String(exposed)}
                    type="button"
                    onClick={() => setEditExposed(exposed)}
                    aria-pressed={editExposed === exposed}
                    className={`rounded-full py-2 text-[12.5px] font-semibold transition-colors ${
                      editExposed === exposed
                        ? "bg-[var(--pf-ink)] text-[var(--pf-on-primary)]"
                        : "border border-[var(--pf-hairline)] text-[var(--pf-muted)] hover:text-[var(--pf-ink)]"
                    }`}
                  >
                    {exposed ? "게시중" : "숨김"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[13px] font-semibold">추천 대상</span>
              <div className="mt-2 flex gap-2">
                {SPECIES_LIST.map((species) => (
                  <button
                    key={species}
                    type="button"
                    onClick={() => toggleRecommended(species)}
                    aria-pressed={editRecommendedFor.includes(species)}
                    className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                      editRecommendedFor.includes(species)
                        ? "bg-[var(--pf-ink)] text-[var(--pf-on-primary)]"
                        : "border border-[var(--pf-hairline)] text-[var(--pf-muted)] hover:text-[var(--pf-ink)]"
                    }`}
                  >
                    {SPECIES_LABEL[species]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <PrimaryButton full={false} onClick={saveEdit}>
                저장
              </PrimaryButton>
              <GhostButton full={false} onClick={quickToggleExposed}>
                {openRow.exposed ? "숨기기" : "노출하기"}
              </GhostButton>
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}
