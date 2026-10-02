"use client";

import { HeartBreak } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/platform/lumi/lib/navigation";
import { expertById } from "@/projects/platform/lumi/lib/mock-data";
import { ExpertRow } from "@/projects/platform/lumi/components/expert-card";
import { AppBar, EmptyState } from "@/projects/platform/lumi/components/ui";

export function FavoritesScreen({
  favorites,
  onNavigate,
  onToggleFavorite,
}: {
  favorites: string[];
  onNavigate: NavigateFn;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="lm-enter pb-10">
      <AppBar
        title="찜한 상담사"
        subtitle={`${favorites.length}명`}
        onBack={() => onNavigate("mypage")}
      />

      {favorites.length === 0 ? (
        <EmptyState
          icon={<HeartBreak size={26} />}
          title="찜한 상담사가 없어요"
          body="마음에 드는 상담사를 찜해 두면 상담 가능 상태가 될 때 알림을 보내 드립니다."
          action="상담사 보러 가기"
          onAction={() => onNavigate("experts")}
        />
      ) : (
        <div className="space-y-2.5 p-5">
          {favorites.map((id) => {
            const expert = expertById(id);
            return (
              <ExpertRow
                key={id}
                expert={expert}
                liked
                onOpen={() => onNavigate("expertDetail", id)}
                onToggleLike={() => onToggleFavorite(id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
