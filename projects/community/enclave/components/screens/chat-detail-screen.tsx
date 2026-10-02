"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretLeft, Image as ImageIcon, Package, PaperPlaneRight } from "@phosphor-icons/react";
import { formatWon } from "@/projects/community/enclave/components/ui";
import { CHAT_THREADS, PRODUCTS, picsumId, resolveResident } from "@/projects/community/enclave/lib/mock-data";
import type { ChatMessage, ChatThread } from "@/projects/community/enclave/lib/types";

const DEAL_STATUSES: ChatThread["dealStatus"][] = ["거래중", "예약중", "거래완료"];

export function ChatDetailScreen({ threadId, onBack }: { threadId: string; onBack: () => void }) {
  const thread = CHAT_THREADS.find((t) => t.id === threadId) ?? CHAT_THREADS[0];
  const counterpart = resolveResident(thread.counterpartId);
  const product = PRODUCTS.find((p) => p.id === thread.productId);
  const [dealStatus, setDealStatus] = useState(thread.dealStatus);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages);

  function send() {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, type: "text", from: "me", text: draft.trim(), at: "지금" },
    ]);
    setDraft("");
  }

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-canvas)]">
      <header className="border-b border-[var(--ec-border)] bg-[var(--ec-surface)] pt-[59px]">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--ec-ink)] transition-colors active:bg-[var(--ec-surface-soft)]"
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-semibold text-[var(--ec-ink)]">{counterpart.nickname}</p>
            <p className="truncate text-[11px] text-[var(--ec-muted)]">
              {counterpart.dong} {counterpart.ho} | 이웃평판 {counterpart.reputationScore}점
            </p>
          </div>
        </div>
        {product && (
          <div className="flex items-center gap-2.5 border-t border-[var(--ec-border)] px-3.5 py-2.5">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[8px] bg-[var(--ec-surface-sunken)]">
              <Image src={picsumId(product.photoId, 80, 80)} alt={product.title} fill sizes="36px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-[var(--ec-ink)]">{product.title}</p>
              <p className="tabular-nums text-[12.5px] font-semibold text-[var(--ec-ink)]">{formatWon(product.price)}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {DEAL_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDealStatus(s)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    dealStatus === s ? "bg-[var(--ec-accent)] text-white" : "bg-[var(--ec-surface-soft)] text-[var(--ec-body)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto ec-scroll px-4 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="border-t border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 pb-[26px] pt-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="사진 전송"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--ec-body)] transition-colors active:bg-[var(--ec-surface-soft)]"
          >
            <ImageIcon size={19} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="메시지 보내기"
            className="h-10 flex-1 rounded-full border border-[var(--ec-border-strong)] bg-[var(--ec-canvas)] px-4 text-[14px] text-[var(--ec-ink)] outline-none placeholder:text-[var(--ec-muted)] focus:border-[var(--ec-accent)]"
          />
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            aria-label="전송"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ec-accent)] text-white transition-transform active:scale-90 disabled:opacity-40"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-[var(--ec-surface-soft)] px-3 py-1 text-[11.5px] text-[var(--ec-muted)]">
          {message.text}
        </span>
      </div>
    );
  }

  const mine = message.from === "me";

  if (message.type === "priceOffer") {
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[76%] rounded-[16px] border border-[var(--ec-border)] bg-[var(--ec-surface)] p-3.5 ${mine ? "rounded-tr-[4px]" : "rounded-tl-[4px]"}`}>
          <p className="text-[11px] font-medium text-[var(--ec-muted)]">가격 제안</p>
          <p className="mt-0.5 tabular-nums text-[16px] font-bold text-[var(--ec-ink)]">{formatWon(message.offerPrice ?? 0)}</p>
        </div>
      </div>
    );
  }

  if (message.type === "lockerShare") {
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[76%] rounded-[16px] border border-[var(--ec-accent)] bg-[var(--ec-accent-soft)] p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ec-accent-ink)]">
            <Package size={13} weight="fill" />
            무인택배함 공유
          </div>
          <p className="mt-1 text-[14px] font-semibold text-[var(--ec-ink)]">{message.lockerLabel}</p>
          <div className="mt-1.5 grid grid-cols-6 gap-[3px]">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} className={`h-2 w-2 rounded-[2px] ${i % 3 === 0 ? "bg-[var(--ec-accent)]" : "bg-[var(--ec-surface)]"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "image") {
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <span className="relative h-[140px] w-[140px] overflow-hidden rounded-[16px] bg-[var(--ec-surface-sunken)]">
          <Image src={picsumId(91, 300, 300)} alt="전송된 사진" fill sizes="140px" className="object-cover" />
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-1.5 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && <span className="mb-0.5 shrink-0 text-[10px] text-[var(--ec-muted)]">{message.at}</span>}
      <div
        className={`max-w-[76%] rounded-[16px] px-3.5 py-2.5 text-[14px] leading-[20px] ${
          mine
            ? "rounded-tr-[4px] bg-[var(--ec-accent)] text-white"
            : "rounded-tl-[4px] border border-[var(--ec-border)] bg-[var(--ec-surface)] text-[var(--ec-ink)]"
        }`}
      >
        {message.text}
      </div>
      {mine && <span className="mb-0.5 shrink-0 text-[10px] text-[var(--ec-muted)]">{message.at}</span>}
    </div>
  );
}
