"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretLeft } from "@phosphor-icons/react";
import { Badge, Chip, EmptyState, formatWon } from "@/projects/community/waypoint/components/ui";
import { CHAT_THREADS, PRODUCTS, SELLERS, picsumId } from "@/projects/community/waypoint/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/waypoint/lib/navigation";
import type { ChatThread } from "@/projects/community/waypoint/lib/types";

const FILTERS: { key: ChatThread["dealStatus"] | "전체"; label: string }[] = [
  { key: "전체", label: "전체" },
  { key: "거래중", label: "거래중" },
  { key: "예약중", label: "예약중" },
  { key: "거래완료", label: "거래완료" },
];

export function ChatListScreen({
  onOpenChat,
  onNavigate,
}: {
  onOpenChat: (threadId: string) => void;
  onNavigate: (key: BottomNavKey) => void;
}) {
  const [filter, setFilter] = useState<ChatThread["dealStatus"] | "전체">("전체");
  const threads = filter === "전체" ? CHAT_THREADS : CHAT_THREADS.filter((t) => t.dealStatus === filter);

  return (
    <div className="waypoint relative flex h-full flex-col bg-[var(--wp-surface)]">
      <div className="shrink-0 pt-[59px]">
        <div className="flex items-center gap-1.5 px-4 pb-3">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="지도로 돌아가기"
            className="-ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--wp-ink)] transition-opacity active:opacity-60"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <h1 className="text-[22px] font-bold text-[var(--wp-ink)]">채팅</h1>
        </div>
        <div className="flex gap-1.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <Chip key={f.key} label={f.label} active={filter === f.key} onClick={() => setFilter(f.key)} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        {threads.length === 0 ? (
          <div className="px-5 pt-6">
            <EmptyState title="진행 중인 대화가 없어요" body="관심있는 상품에 채팅을 걸어보세요" />
          </div>
        ) : (
          <div className="divide-y divide-[var(--wp-border)]">
            {threads.map((thread) => {
              const product = PRODUCTS.find((p) => p.id === thread.productId)!;
              const seller = SELLERS.find((s) => s.id === thread.counterpartId)!;
              const statusTone = thread.dealStatus === "거래중" ? "accent" : thread.dealStatus === "예약중" ? "warn" : "neutral";
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => onOpenChat(thread.id)}
                  className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors active:bg-[var(--wp-surface-soft)]"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-[var(--wp-surface-sunken)]">
                    <Image src={picsumId(product.photoId, 120, 120)} alt={product.title} fill sizes="48px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[14.5px] font-semibold text-[var(--wp-ink)]">{seller.nickname}</p>
                      <Badge tone={statusTone}>{thread.dealStatus}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-[12.5px] text-[var(--wp-muted)]">
                      {product.title} | {formatWon(product.price)}
                    </p>
                    <p className="mt-1 truncate text-[13px] text-[var(--wp-body)]">{thread.lastMessage}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="tabular-nums text-[11px] text-[var(--wp-muted)]">
                      {thread.lastMessageAt.slice(11)}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--wp-accent)] px-1.5 text-[10.5px] font-semibold text-white">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
