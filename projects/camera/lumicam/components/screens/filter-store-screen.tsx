"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { picsum } from "@/projects/camera/lumicam/lib/films";
import { filterPacks } from "@/projects/camera/lumicam/lib/mock-data";
import type { LumicamNavigate } from "@/projects/camera/lumicam/lib/navigation";

const TABS = [
  { key: "popular", label: "인기 필터" },
  { key: "new", label: "신규 필터" },
  { key: "owned", label: "보유 필터" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function FilterStoreScreen({ onNavigate }: { onNavigate: LumicamNavigate }) {
  const [tab, setTab] = useState<TabKey>("popular");
  const [ownedIds, setOwnedIds] = useState(() => new Set(filterPacks.filter((p) => p.owned).map((p) => p.id)));

  const items = useMemo(() => {
    if (tab === "owned") return filterPacks.filter((p) => ownedIds.has(p.id));
    if (tab === "new") return filterPacks.filter((p) => p.tags.includes("신규"));
    return [...filterPacks].sort((a, b) => Number(b.downloads.replace("K", "")) - Number(a.downloads.replace("K", "")));
  }, [tab, ownedIds]);

  function acquire(id: string) {
    setOwnedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex h-full w-full flex-col bg-[var(--lc-canvas)]">
      <ScreenHeader
        title="필터 스토어"
        subtitle={`보유 필터 ${ownedIds.size}개`}
        onBack={() => onNavigate("camera")}
        className="bg-[var(--lc-canvas)] border-[var(--lc-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--lc-ink)]"
        subtitleClassName="text-[11px] tabular-nums text-[var(--lc-mute)]"
        backButtonClassName="text-[var(--lc-ink)] hover:bg-[var(--lc-surface-soft)]"
      />

      <div className="flex gap-1.5 px-5 pt-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              tab === t.key
                ? "bg-[var(--lc-ink)] text-[var(--lc-on-ink)]"
                : "border border-[var(--lc-border)] text-[var(--lc-body)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-[var(--lc-border)] text-center">
            <p className="text-[13px] text-[var(--lc-mute)]">아직 보유한 필터가 없어요</p>
            <button
              type="button"
              onClick={() => setTab("popular")}
              className="text-[12px] font-medium text-[var(--lc-accent-soft-ink)]"
            >
              인기 필터 보러가기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((pack) => {
              const owned = ownedIds.has(pack.id);
              return (
                <div key={pack.id} className="overflow-hidden rounded-[12px] border border-[var(--lc-border)] bg-[var(--lc-surface)]">
                  <div className="relative h-24 w-full overflow-hidden">
                    <Image
                      src={picsum(pack.photoId, 260, 200)}
                      alt={pack.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                      style={{ filter: pack.previewFilter }}
                    />
                    <div className="absolute left-1.5 top-1.5 flex flex-wrap gap-1">
                      {pack.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-black/45 px-1.5 py-0.5 text-[9.5px] font-medium text-white backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[12.5px] font-semibold text-[var(--lc-ink)]">{pack.name}</p>
                    <p className="mt-0.5 truncate text-[10.5px] text-[var(--lc-mute)]">{pack.tagline}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10.5px] text-[var(--lc-mute)]">
                      <Icon icon="solar:star-bold" width={10} className="text-[var(--lc-accent)]" />
                      <span className="tabular-nums">{pack.rating}</span>
                      <span>|</span>
                      <span className="tabular-nums">{pack.downloads}</span>
                    </div>
                    {owned ? (
                      <div className="mt-2 flex items-center justify-center gap-1 rounded-[6px] bg-[var(--lc-surface-soft)] py-1.5 text-[11px] font-medium text-[var(--lc-body)]">
                        <Icon icon="solar:check-circle-bold" width={12} className="text-[var(--lc-accent)]" />
                        보유중
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => acquire(pack.id)}
                        className="mt-2 flex w-full items-center justify-center gap-1 rounded-[6px] bg-[var(--lc-ink)] py-1.5 text-[11px] font-semibold text-[var(--lc-on-ink)]"
                      >
                        <Icon icon="solar:download-minimalistic-linear" width={12} />
                        {pack.price}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
