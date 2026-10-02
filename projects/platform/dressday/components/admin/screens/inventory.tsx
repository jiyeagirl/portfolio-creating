"use client";

import { useState } from "react";
import { Barcode, MagnifyingGlass } from "@phosphor-icons/react";
import { UNITS, UNIT_STATUSES, UNIT_TONE, countBy, type UnitStatus } from "@/projects/platform/dressday/lib/admin-data";
import { PRODUCTS, getProduct } from "@/projects/platform/dressday/lib/catalog";
import {
  Badge,
  Button,
  PageHead,
  Pagination,
  ProductThumb,
  SelectInput,
  TableWrap,
  Td,
  Th,
  toneFg,
} from "@/projects/platform/dressday/components/admin/admin-ui";

type Filter = "전체" | UnitStatus;
const PAGE = 12;

export function Inventory() {
  const [filter, setFilter] = useState<Filter>("전체");
  const [page, setPage] = useState(1);
  const counts = countBy(UNITS, (u) => u.status);
  const rows = filter === "전체" ? UNITS : UNITS.filter((u) => u.status === filter);
  const visible = rows.slice((page - 1) * PAGE, page * PAGE);

  const cells: { key: Filter; n: number }[] = [{ key: "전체", n: UNITS.length }, ...UNIT_STATUSES.map((s) => ({ key: s as Filter, n: counts[s] ?? 0 }))];

  return (
    <div className="space-y-6">
      <PageHead
        title="재고 관리"
        actions={
          <Button variant="ink" icon={<Barcode size={16} />}>
            태그 스캔
          </Button>
        }
      />

      {/* 상태별 개수: 누르면 표가 걸러진다 */}
      <div className="dd-scroll-x overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-8 rounded-[14px] border border-[var(--dd-hairline)]">
          {cells.map(({ key, n }, i) => {
            const on = filter === key;
            const tone = key === "전체" ? null : UNIT_TONE[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setFilter(key);
                  setPage(1);
                }}
                className={`relative px-4 py-3 text-left ${i > 0 ? "border-l border-[var(--dd-hairline)]" : ""} ${on ? "bg-[var(--dd-soft)]" : ""} ${
                  i === 0 ? "rounded-l-[14px]" : i === cells.length - 1 ? "rounded-r-[14px]" : ""
                }`}
              >
                <span className="flex items-center gap-1.5 text-[13px] text-[var(--dd-muted)]">
                  {tone && <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: toneFg(tone) }} />}
                  {key}
                </span>
                <span className="dd-num mt-0.5 block text-[22px] font-semibold leading-8 text-[var(--dd-ink)]">{n}</span>
                {on && <span aria-hidden className="absolute inset-x-4 bottom-0 h-[2px] bg-[var(--dd-ink)]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex h-10 w-full max-w-[300px] items-center">
          <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 text-[var(--dd-muted)]" />
          <input
            aria-label="재고 태그 검색"
            placeholder="재고 태그, 상품명"
            className="h-full w-full rounded-[8px] border border-[var(--dd-hairline)] pl-9 pr-3 text-[14px] outline-none placeholder:text-[var(--dd-muted-soft)] focus:border-2 focus:border-[var(--dd-ink)]"
          />
        </label>
        <div className="w-[200px]">
          <SelectInput defaultValue="전체 상품" options={["전체 상품", ...PRODUCTS.map((p) => p.name)]} />
        </div>
        <div className="w-[120px]">
          <SelectInput defaultValue="전체 사이즈" options={["전체 사이즈", "XS", "S", "M", "L", "XL"]} />
        </div>
      </div>

      <div>
        <TableWrap>
          <thead>
            <tr>
              <Th>재고 태그</Th>
              <Th>상품</Th>
              <Th>사이즈</Th>
              <Th>상태</Th>
              <Th>현재 위치</Th>
              <Th>최근 변경</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((u) => {
              const p = getProduct(u.productId);
              return (
                <tr key={u.tag}>
                  <Td>
                    <span className="dd-code text-[var(--dd-ink)]">{u.tag}</span>
                  </Td>
                  <Td>
                    <span className="flex min-w-0 items-center gap-3">
                      <ProductThumb product={p} size={28} />
                      <span className="min-w-0">
                        <span className="block max-w-[240px] truncate text-[var(--dd-ink)]" title={p.name}>
                          {p.name}
                        </span>
                        <span className="block text-[12px] text-[var(--dd-muted)]">
                          {p.category} | {p.color}
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <span className="rounded-[6px] bg-[var(--dd-strong)] px-2 py-0.5 text-[12px] font-semibold text-[var(--dd-ink)]">{u.size}</span>
                  </Td>
                  <Td>
                    <Badge tone={UNIT_TONE[u.status]}>{u.status}</Badge>
                  </Td>
                  <Td>
                    <span className="text-[var(--dd-ink)]">{u.location}</span>
                    {u.reservationId && <span className="dd-code block text-[12px] text-[var(--dd-muted)]">{u.reservationId}</span>}
                  </Td>
                  <Td className="dd-num whitespace-nowrap">{u.updated}</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
        <Pagination page={page} pageSize={PAGE} total={rows.length} onChange={setPage} />
      </div>
    </div>
  );
}
