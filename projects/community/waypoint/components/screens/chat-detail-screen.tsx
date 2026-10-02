"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  CaretLeft,
  DotsThreeVertical,
  Image as ImageIcon,
  MapPinLine,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { Badge, WaypointCard, formatWon } from "@/projects/community/waypoint/components/ui";
import { CHAT_THREADS, PRODUCTS, SELLERS, WAYPOINT_SPOTS, picsumId } from "@/projects/community/waypoint/lib/mock-data";
import type { ChatMessage } from "@/projects/community/waypoint/lib/types";

export function ChatDetailScreen({ threadId, onBack }: { threadId: string; onBack: () => void }) {
  const thread = CHAT_THREADS.find((t) => t.id === threadId) ?? CHAT_THREADS[0];
  const product = PRODUCTS.find((p) => p.id === thread.productId)!;
  const seller = SELLERS.find((s) => s.id === thread.counterpartId)!;
  const nearbySpot = WAYPOINT_SPOTS.find((s) => s.id === product.waypointSpotId) ?? WAYPOINT_SPOTS[0];

  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: `local-${prev.length}`, type: "text", from: "me", text: draft.trim(), at: "지금" }]);
    setDraft("");
  }

  function shareWaypoint() {
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, type: "waypointShare", from: "me", waypointSpotId: nearbySpot.id, at: "지금" },
    ]);
  }

  return (
    <div className="waypoint relative flex h-full flex-col bg-[var(--wp-canvas)]">
      <header className="sticky top-0 z-20 border-b border-[var(--wp-border)] bg-[var(--wp-surface)] pt-[59px]">
        <div className="flex h-[52px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--wp-ink)]"
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-[var(--wp-ink)]">{seller.nickname}</p>
            <p className="truncate text-[11px] text-[var(--wp-muted)]">신뢰지수 {seller.trustScore} | 응답률 {seller.responseRate}%</p>
          </div>
          <button type="button" aria-label="더보기" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--wp-body)]">
            <DotsThreeVertical size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2.5 border-t border-[var(--wp-border)] px-3 py-2.5">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[9px] bg-[var(--wp-surface-sunken)]">
            <Image src={picsumId(product.photoId, 80, 80)} alt={product.title} fill sizes="32px" className="object-cover" />
          </span>
          <p className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--wp-body)]">{product.title}</p>
          <p className="shrink-0 tabular-nums text-[12.5px] font-semibold text-[var(--wp-ink)]">{formatWon(product.price)}</p>
          <Badge tone={thread.dealStatus === "거래완료" ? "neutral" : thread.dealStatus === "예약중" ? "warn" : "accent"}>
            {thread.dealStatus}
          </Badge>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-[86px] right-4 z-20">
        <motion.button
          type="button"
          onClick={shareWaypoint}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-2 rounded-full bg-[var(--wp-success)] px-4 py-3 text-[13.5px] font-semibold text-white shadow-[var(--wp-shadow-pop)]"
        >
          <MapPinLine size={18} weight="fill" />
          웨이스팟 공유
        </motion.button>
      </div>

      <div className="border-t border-[var(--wp-border)] bg-[var(--wp-surface)] px-3 pb-[26px] pt-2.5">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="사진 전송" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--wp-body)]">
            <ImageIcon size={19} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="메시지 보내기"
            className="h-10 flex-1 rounded-full border border-[var(--wp-border)] bg-[var(--wp-surface-soft)] px-4 text-[13.5px] text-[var(--wp-ink)] outline-none placeholder:text-[var(--wp-muted)] focus:border-[var(--wp-accent)]"
          />
          <button
            type="button"
            onClick={send}
            aria-label="전송"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--wp-accent)] text-white"
          >
            <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-[var(--wp-surface-soft)] px-3 py-1.5 text-[11.5px] text-[var(--wp-muted)]">
          {message.text}
        </span>
      </div>
    );
  }

  const mine = message.from === "me";

  if (message.type === "waypointShare") {
    const spot = WAYPOINT_SPOTS.find((s) => s.id === message.waypointSpotId);
    if (!spot) return null;
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[260px]">
          <WaypointCard spot={spot} />
          <p className={`mt-1 text-[10.5px] text-[var(--wp-muted)] ${mine ? "text-right" : ""}`}>{message.at}</p>
        </div>
      </div>
    );
  }

  if (message.type === "image") {
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div>
          <span className="relative block h-[150px] w-[150px] overflow-hidden rounded-[16px] bg-[var(--wp-surface-sunken)]">
            <Image src={picsumId(76, 300, 300)} alt="전송된 사진" fill sizes="150px" className="object-cover" />
          </span>
          <p className={`mt-1 text-[10.5px] text-[var(--wp-muted)] ${mine ? "text-right" : ""}`}>{message.at}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-1.5 ${mine ? "flex-row-reverse" : ""}`}>
        <div
          className={`max-w-[240px] rounded-[16px] px-3.5 py-2.5 text-[13.5px] leading-[19px] ${
            mine
              ? "rounded-br-[4px] bg-[var(--wp-accent)] text-white"
              : "rounded-bl-[4px] bg-[var(--wp-surface)] text-[var(--wp-ink)] border border-[var(--wp-border)]"
          }`}
        >
          {message.text}
        </div>
        <span className="shrink-0 text-[10px] text-[var(--wp-muted)]">{message.at}</span>
      </div>
    </div>
  );
}
