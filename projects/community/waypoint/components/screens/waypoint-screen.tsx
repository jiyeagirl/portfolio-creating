"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CaretLeft, CheckCircle, SlidersHorizontal } from "@phosphor-icons/react";
import { Badge, Chip, SectionTitle, WaypointCard } from "@/projects/community/waypoint/components/ui";
import { WAYPOINT_SPOTS, picsumId } from "@/projects/community/waypoint/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/waypoint/lib/navigation";
import type { WaypointSpotType } from "@/projects/community/waypoint/lib/types";

const TYPES: WaypointSpotType[] = ["지하철역", "편의점", "카페", "스터디카페"];

export function WaypointScreen({ onNavigate }: { onNavigate: (key: BottomNavKey) => void }) {
  const [filter, setFilter] = useState<WaypointSpotType | "전체">("전체");
  const [spots, setSpots] = useState(WAYPOINT_SPOTS);
  const [sharedId, setSharedId] = useState<string | null>(null);

  function toggleFavorite(id: string) {
    setSpots((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  }
  function share(id: string) {
    setSharedId(id);
    window.setTimeout(() => setSharedId((cur) => (cur === id ? null : cur)), 1800);
  }

  const favorites = spots.filter((s) => s.favorite);
  const filtered = useMemo(
    () => (filter === "전체" ? spots : spots.filter((s) => s.type === filter)),
    [filter, spots],
  );

  return (
    <div className="waypoint relative flex h-full flex-col bg-[var(--wp-canvas)]">
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="relative h-[128px] w-full">
          <Image src={picsumId(391, 700, 260)} alt="웨이스팟" fill sizes="360px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/20" />
          <div className="absolute inset-x-4 top-[59px] flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              aria-label="지도로 돌아가기"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[var(--wp-ink)] transition-opacity active:opacity-60"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-bold text-white">웨이스팟</h1>
              <p className="mt-1 text-[12.5px] text-white/85">안전하게 만날 수 있는 거래 장소</p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[var(--wp-ink)]">
              <SlidersHorizontal size={16} />
            </span>
          </div>
        </div>

        <div className="px-4 pt-5">
          {favorites.length > 0 && (
            <div className="mb-6">
              <SectionTitle title="즐겨찾기 웨이스팟" />
              <div className="space-y-3">
                {favorites.map((s) => (
                  <WaypointCard
                    key={s.id}
                    spot={s}
                    onToggleFavorite={() => toggleFavorite(s.id)}
                    onShare={() => share(s.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <SectionTitle title="주변 웨이스팟" action={<Badge tone="accent">자동 추천</Badge>} />
          <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip label="전체" active={filter === "전체"} onClick={() => setFilter("전체")} />
            {TYPES.map((t) => (
              <Chip key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((s) => (
              <div key={s.id} className="relative">
                <WaypointCard spot={s} onToggleFavorite={() => toggleFavorite(s.id)} onShare={() => share(s.id)} />
                {sharedId === s.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-1.5 rounded-full bg-[var(--wp-ink)] px-4 py-2 text-[12.5px] font-medium text-white shadow-[var(--wp-shadow-pop)]"
                  >
                    <CheckCircle size={14} weight="fill" className="text-[var(--wp-success)]" />
                    상대방에게 위치를 공유했어요
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
