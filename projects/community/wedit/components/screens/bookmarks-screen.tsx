"use client";

import { useState } from "react";
import Image from "next/image";
import { BookmarkSimple, Scales } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { pexelsPhoto, VENDORS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import { EmptyState } from "@/projects/community/wedit/components/ui";
import { VendorCard } from "@/projects/community/wedit/components/vendor-card";

const SAVED_COMPARISON = { title: "스튜디오 비교", ids: ["v1", "v2"], savedAt: "2025.10.25" };

export function BookmarksScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [tab, setTab] = useState<"bookmarks" | "compare">("bookmarks");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["v1", "v3", "v5"]);

  const bookmarked = VENDORS.filter((v) => bookmarkedIds.includes(v.id));
  const comparisonVendors = VENDORS.filter((v) => SAVED_COMPARISON.ids.includes(v.id));

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="관심 업체"
        onBack={() => onNavigate("mypage")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
      />

      <div className="flex gap-2 px-5 pt-4">
        <button
          type="button"
          onClick={() => setTab("bookmarks")}
          className={`flex-1 rounded-full py-2 text-[12.5px] font-semibold ${
            tab === "bookmarks" ? "bg-[var(--wd-ink)] text-white" : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
          }`}
        >
          북마크 {bookmarked.length}
        </button>
        <button
          type="button"
          onClick={() => setTab("compare")}
          className={`flex-1 rounded-full py-2 text-[12.5px] font-semibold ${
            tab === "compare" ? "bg-[var(--wd-ink)] text-white" : "border border-[var(--wd-border)] bg-white text-[var(--wd-body)]"
          }`}
        >
          비교함
        </button>
      </div>

      {tab === "bookmarks" &&
        (bookmarked.length === 0 ? (
          <EmptyState icon={<BookmarkSimple size={24} weight="duotone" />} title="북마크한 업체가 없어요" body="마음에 드는 업체를 북마크에 담아보세요." />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 px-5">
            {bookmarked.map((v) => (
              <VendorCard
                key={v.id}
                vendor={v}
                onClick={() => onNavigate("vendorDetail", { id: v.id })}
                bookmarked
                onToggleBookmark={() => setBookmarkedIds((prev) => prev.filter((id) => id !== v.id))}
              />
            ))}
          </div>
        ))}

      {tab === "compare" &&
        (comparisonVendors.length === 0 ? (
          <EmptyState icon={<Scales size={24} weight="duotone" />} title="저장된 비교함이 없어요" body="탐색에서 업체를 비교하고 저장해보세요." />
        ) : (
          <div className="mt-4 px-5">
            <button
              type="button"
              onClick={() => onNavigate("compare", { ids: SAVED_COMPARISON.ids })}
              className="flex w-full flex-col gap-3 rounded-2xl border border-[var(--wd-border)] bg-white p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] font-semibold text-[var(--wd-ink)]">{SAVED_COMPARISON.title}</p>
                <span className="text-[11px] text-[var(--wd-muted)]">{SAVED_COMPARISON.savedAt} 저장</span>
              </div>
              <div className="flex gap-2">
                {comparisonVendors.map((v) => (
                  <div key={v.id} className="relative h-14 flex-1 overflow-hidden rounded-xl">
                    <Image
                      src={pexelsPhoto(v.photoId, 200, 140)}
                      alt={v.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                      style={v.photoCrop ? { objectPosition: v.photoCrop } : undefined}
                    />
                  </div>
                ))}
              </div>
            </button>
          </div>
        ))}
    </div>
  );
}
