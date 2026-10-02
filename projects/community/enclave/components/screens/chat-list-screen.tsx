"use client";

import Image from "next/image";
import { BottomNav } from "@/projects/community/enclave/components/bottom-nav";
import { Avatar, Badge, EmptyState } from "@/projects/community/enclave/components/ui";
import { CHAT_THREADS, PRODUCTS, picsumId, resolveResident } from "@/projects/community/enclave/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/enclave/lib/navigation";
import type { ChatThread } from "@/projects/community/enclave/lib/types";

function statusTone(status: ChatThread["dealStatus"]) {
  if (status === "거래완료") return "neutral" as const;
  if (status === "예약중") return "warn" as const;
  return "accent" as const;
}

export function ChatListScreen({
  onOpenChat,
  onNavigate,
}: {
  onOpenChat: (threadId: string) => void;
  onNavigate: (key: BottomNavKey) => void;
}) {
  const threads = [...CHAT_THREADS].sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1));

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-surface)]">
      <header className="px-5 pb-3 pt-[59px]">
        <h1 className="text-[21px] font-bold tracking-[-0.01em] text-[var(--ec-ink)]">채팅</h1>
      </header>

      <div className="flex-1 overflow-y-auto ec-scroll pb-[92px]">
        {threads.length === 0 ? (
          <div className="px-6 pt-10">
            <EmptyState title="아직 채팅이 없어요" body="관심있는 상품에 채팅을 걸어보세요" />
          </div>
        ) : (
          <ul className="divide-y divide-[var(--ec-border)] px-2">
            {threads.map((t) => {
              const counterpart = resolveResident(t.counterpartId);
              const product = PRODUCTS.find((p) => p.id === t.productId);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onOpenChat(t.id)}
                    className="flex w-full items-center gap-3 px-3 py-3.5 text-left transition-colors active:bg-[var(--ec-surface-soft)]"
                  >
                    <span className="relative shrink-0">
                      <Avatar size={46} tone="neutral" />
                      {t.unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--ec-accent)] px-1 tabular-nums text-[10px] font-semibold text-white ring-2 ring-[var(--ec-surface)]">
                          {t.unreadCount}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[14.5px] font-semibold text-[var(--ec-ink)]">{counterpart.nickname}</p>
                        <span className="tabular-nums text-[11px] text-[var(--ec-muted)]">{t.lastMessageAt.slice(11)}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <Badge tone={statusTone(t.dealStatus)}>{t.dealStatus}</Badge>
                        {product && <p className="truncate text-[11.5px] text-[var(--ec-muted)]">{product.title}</p>}
                      </div>
                      <p className="mt-1 truncate text-[13px] text-[var(--ec-body)]">{t.lastMessage}</p>
                    </div>
                    {product && (
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-[var(--ec-surface-sunken)]">
                        <Image src={picsumId(product.photoId, 100, 100)} alt={product.title} fill sizes="44px" className="object-cover" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <BottomNav active="chatList" onNavigate={onNavigate} />
    </div>
  );
}
