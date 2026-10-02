"use client";

import { useMemo, useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { Badge, Card, EquipmentThumb, PageHead, Segmented, Select, SearchInput } from "@/projects/b2b/buildbid/components/ui";
import { equipmentList } from "@/projects/b2b/buildbid/lib/mock-data";
import { CATEGORY_LABEL, STATUS_LABEL, STATUS_TONE, manwon, type Navigate } from "@/projects/b2b/buildbid/lib/navigation";
import type { EquipmentCategory } from "@/projects/b2b/buildbid/lib/types";

const CATEGORY_FILTERS: ("전체" | EquipmentCategory)[] = ["전체", "excavator", "crane", "loader", "dumpTruck", "forklift", "roller"];
const BIDDABLE = new Set(["bidding1", "bidding2"]);

export function ListingsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"전체" | EquipmentCategory>("전체");
  const [availability, setAvailability] = useState<"all" | "biddable">("all");
  const [region, setRegion] = useState("전체 지역");
  const [watched, setWatched] = useState<Set<string>>(new Set(["e5"]));

  const regions = useMemo(() => ["전체 지역", ...Array.from(new Set(equipmentList.map((e) => e.region)))], []);

  const visible = equipmentList.filter((eq) => {
    if (eq.status === "draft") return false;
    if (category !== "전체" && eq.category !== category) return false;
    if (availability === "biddable" && !BIDDABLE.has(eq.status)) return false;
    if (region !== "전체 지역" && eq.region !== region) return false;
    if (query && !`${eq.name} ${eq.model} ${eq.maker} ${eq.code}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const toggleWatch = (id: string) => {
    setWatched((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHead eyebrow="장비 목록" title="거래 가능 장비" desc="조건에 맞는 장비를 찾아 입찰에 참여하세요." />

      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="lg:w-[320px]">
            <SearchInput value={query} onChange={setQuery} placeholder="장비명, 모델명, 코드로 검색" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={region} options={regions} onChange={(next) => setRegion(next)} />
            <Segmented
              value={availability}
              items={[
                { key: "all", label: "전체" },
                { key: "biddable", label: "입찰 가능" },
              ]}
              onChange={setAvailability}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--bb-hairline)] pt-4">
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                category === c ? "bg-[var(--bb-ink)] font-semibold text-white" : "bg-[var(--bb-canvas-parchment)] text-[var(--bb-body)] hover:bg-[var(--bb-neutral-soft)]"
              }`}
            >
              {c === "전체" ? "전체" : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </Card>

      <p className="text-[13px] text-[var(--bb-mute)]">총 {visible.length}건</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((eq) => {
          const canBid = BIDDABLE.has(eq.status);
          const isWatched = watched.has(eq.id);
          return (
            <button
              key={eq.id}
              type="button"
              onClick={() => onNavigate("detail", eq.id)}
              className="flex flex-col items-start rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas)] p-5 text-left transition-colors hover:border-[var(--bb-primary)]"
            >
              <div className="flex w-full items-start justify-between gap-3">
                <EquipmentThumb photo={eq.photo} alt={eq.name} size={52} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatch(eq.id);
                  }}
                  aria-label={isWatched ? "관심 해제" : "관심 등록"}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                    isWatched ? "border-[var(--bb-danger-soft)] bg-[var(--bb-danger-soft)] text-[var(--bb-danger-deep)]" : "border-[var(--bb-hairline)] text-[var(--bb-mute)] hover:bg-[var(--bb-canvas-parchment)]"
                  }`}
                >
                  <Heart size={14} weight={isWatched ? "fill" : "regular"} />
                </button>
              </div>

              <p className="mt-3 text-[15px] font-semibold leading-5 text-[var(--bb-ink)]">{eq.name}</p>
              <p className="bb-mono mt-1 text-[12px] text-[var(--bb-mute)]">{eq.code} | {eq.maker} {eq.model}</p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Badge tone="neutral">{eq.manufacturedYear}년식</Badge>
                <Badge tone="neutral">{eq.grade}등급</Badge>
                <Badge tone="neutral">{eq.region}</Badge>
              </div>

              <div className="mt-4 flex w-full items-end justify-between border-t border-[var(--bb-hairline)] pt-3">
                <div>
                  <p className="text-[11px] text-[var(--bb-mute)]">AI 예상 시세</p>
                  <p className="bb-mono text-[17px] font-semibold text-[var(--bb-ink)]">{manwon(eq.autoPrice)}</p>
                </div>
                <div className="text-right">
                  <Badge tone={STATUS_TONE[eq.status]}>{STATUS_LABEL[eq.status]}</Badge>
                  <p className={`mt-1.5 text-[11px] font-semibold ${canBid ? "text-[var(--bb-info-deep)]" : "text-[var(--bb-mute)]"}`}>
                    {canBid ? "입찰 가능" : "입찰 불가"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="rounded-[18px] border border-dashed border-[var(--bb-hairline)] p-12 text-center text-[13px] text-[var(--bb-mute)]">
          조건에 맞는 장비가 없습니다. 필터를 조정해 보세요.
        </div>
      )}
    </div>
  );
}
