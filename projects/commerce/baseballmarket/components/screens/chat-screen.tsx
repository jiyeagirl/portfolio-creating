"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  PaperPlaneRight,
  Plus,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  DefList,
  Eyebrow,
  Input,
} from "@/projects/commerce/baseballmarket/components/ui";
import { ListingRow } from "@/projects/commerce/baseballmarket/components/listing-card";
import {
  CHAT_LOG,
  CHAT_THREADS,
  KRW,
  listing,
  photo,
  seller,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { ChatThread } from "@/projects/commerce/baseballmarket/lib/types";

/* 채팅 + 거래 진행. spec 3.6의 상태 기계(문의 → 가격제안 → 예약중 → 결제완료 → 배송중 →
   거래완료)를 대화 우측 패널의 스테퍼로 드러낸다. 상태가 대화에 묻히지 않게 하는 것이 목적. */

const STAGES: ChatThread["stage"][] = [
  "문의",
  "가격제안",
  "예약중",
  "결제완료",
  "배송중",
  "거래완료",
];

export function ChatScreen({ onOpenListing }: { onOpenListing: (id: string) => void }) {
  const [activeId, setActiveId] = useState(CHAT_THREADS[0].id);
  const [draft, setDraft] = useState("");

  const thread = CHAT_THREADS.find((t) => t.id === activeId) ?? CHAT_THREADS[0];
  const l = listing(thread.listingId);
  const peer = seller(thread.peerId);
  const log = CHAT_LOG[thread.id] ?? [
    { id: "x1", from: "system" as const, text: "안전거래로 보호되는 대화입니다.", at: "" },
    { id: "x2", from: "peer" as const, text: thread.lastMessage, at: thread.lastAt },
  ];
  const stageIdx = STAGES.indexOf(thread.stage);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-8 lg:py-14">
      <Eyebrow>채팅</Eyebrow>
      <h1 className="mt-3 text-[32px] font-medium leading-[38px] tracking-[-0.03em] text-[var(--bm-ink)]">
        진행 중인 거래 {CHAT_THREADS.filter((t) => t.stage !== "거래완료").length}건
      </h1>

      <div className="mt-8 grid gap-5 lg:grid-cols-12">
        {/* 목록 */}
        <div className="lg:col-span-4">
          <div className="space-y-1.5">
            {CHAT_THREADS.map((t) => {
              const tl = listing(t.listingId);
              const on = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={`bm-swap flex w-full items-center gap-3 rounded-[12px] p-3.5 text-left ${
                    on ? "bg-[var(--bm-surface-strong)]" : "bg-[var(--bm-surface-card)] bm-press"
                  }`}
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[6px] bg-[var(--bm-surface-strong)]">
                    <Image
                      src={photo(tl.photoId, 120, 120)}
                      alt={tl.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                        {seller(t.peerId).nickname}
                      </span>
                      <span className="ml-auto shrink-0 text-[12px] leading-[17px] text-[var(--bm-muted-soft)]">
                        {t.lastAt}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] leading-[19px] text-[var(--bm-muted)]">
                      {t.lastMessage}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5">
                      <Badge tone={t.stage === "거래완료" ? "neutral" : "team"}>{t.stage}</Badge>
                      {t.unread > 0 && (
                        <span className="bm-num inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--bm-error)] px-1.5 text-[11px] font-semibold text-white">
                          {t.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 대화 */}
        <div className="lg:col-span-5">
          <div className="flex h-[640px] flex-col rounded-[12px] border border-[var(--bm-hairline)] bg-[var(--bm-canvas)]">
            <header className="flex items-center gap-3 border-b border-[var(--bm-hairline)] px-5 py-4">
              <Avatar name={peer.nickname} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">
                  {peer.nickname}
                </p>
                <p className="bm-num truncate text-[12px] leading-[17px] text-[var(--bm-muted)]">
                  응답률 {peer.responseRate}% | 평균 {peer.responseMin}분
                </p>
              </div>
              <Badge tone="success">안전거래</Badge>
            </header>

            <div className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5">
              {log.map((m) => {
                if (m.from === "system") {
                  return (
                    <p
                      key={m.id}
                      className="mx-auto max-w-[300px] rounded-[6px] bg-[var(--bm-surface)] px-3 py-2 text-center text-[12px] leading-[18px] text-[var(--bm-muted)]"
                    >
                      {m.text}
                    </p>
                  );
                }
                if (m.kind === "listing") {
                  return (
                    <div key={m.id} className="max-w-[85%] rounded-[12px] bg-[var(--bm-surface-card)] p-3">
                      <ListingRow listing={l} onOpen={() => onOpenListing(l.id)} />
                    </div>
                  );
                }
                if (m.kind === "offer") {
                  return (
                    <div key={m.id} className="ml-auto max-w-[75%]">
                      <div className="rounded-[12px] bg-[var(--bm-ink)] p-4 text-[var(--bm-on-ink)]">
                        <p className="text-[12px] uppercase tracking-[0.12em] opacity-60">가격 제안</p>
                        <p className="bm-num mt-1.5 text-[22px] font-medium leading-[28px]">
                          {KRW(m.amount ?? 0)}
                        </p>
                        <p className="bm-num mt-1 text-[12px] leading-[17px] opacity-70">
                          정가 {KRW(l.price)}에서 {KRW(l.price - (m.amount ?? 0))} 낮춤
                        </p>
                      </div>
                      <p className="bm-num mt-1 text-right text-[11px] text-[var(--bm-muted-soft)]">
                        {m.at}
                      </p>
                    </div>
                  );
                }
                const mine = m.from === "me";
                return (
                  <div key={m.id} className={mine ? "ml-auto max-w-[75%]" : "max-w-[75%]"}>
                    <p
                      className={`rounded-[12px] px-3.5 py-2.5 text-[14px] leading-[22px] ${
                        mine
                          ? "bg-[var(--bm-ink)] text-[var(--bm-on-ink)]"
                          : "bg-[var(--bm-surface-card)] text-[var(--bm-body-strong)]"
                      }`}
                    >
                      {m.text}
                    </p>
                    <p
                      className={`bm-num mt-1 text-[11px] text-[var(--bm-muted-soft)] ${
                        mine ? "text-right" : ""
                      }`}
                    >
                      {m.at}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--bm-hairline)] px-4 py-3.5">
              <div className="mb-2.5 flex gap-2">
                <button
                  type="button"
                  className="bm-press rounded-full bg-[var(--bm-surface-card)] px-3 py-1.5 text-[12px] font-semibold text-[var(--bm-body-strong)]"
                >
                  가격 제안
                </button>
                <button
                  type="button"
                  className="bm-press rounded-full bg-[var(--bm-surface-card)] px-3 py-1.5 text-[12px] font-semibold text-[var(--bm-body-strong)]"
                >
                  상품 카드 보내기
                </button>
                <button
                  type="button"
                  className="bm-press rounded-full bg-[var(--bm-surface-card)] px-3 py-1.5 text-[12px] font-semibold text-[var(--bm-body-strong)]"
                >
                  거래 상태 변경
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="첨부"
                  className="bm-press flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[var(--bm-surface-card)] text-[var(--bm-body)]"
                >
                  <Plus size={17} />
                </button>
                <div className="flex-1">
                  <Input value={draft} onChange={setDraft} placeholder="메시지를 입력하세요" />
                </div>
                <button
                  type="button"
                  aria-label="보내기"
                  className="bm-press-ink flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[var(--bm-ink)] text-[var(--bm-on-ink)]"
                >
                  <PaperPlaneRight size={17} weight="fill" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 거래 진행 패널 */}
        <div className="lg:col-span-3">
          <div className="space-y-2.5">
            <Card tone="card" padded={false} className="p-4">
              <ListingRow listing={l} onOpen={() => onOpenListing(l.id)} />
            </Card>

            <Card tone="soft">
              <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                거래 진행
              </p>
              <ol className="mt-4 space-y-0">
                {STAGES.map((st, i) => {
                  const done = i < stageIdx;
                  const now = i === stageIdx;
                  return (
                    <li key={st} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: done || now ? "var(--bm-ink)" : "var(--bm-surface-strong)",
                            color: done || now ? "var(--bm-on-ink)" : "var(--bm-muted)",
                          }}
                        >
                          {done ? (
                            <CheckCircle size={12} weight="fill" />
                          ) : (
                            <span className="bm-num text-[10px] font-semibold">{i + 1}</span>
                          )}
                        </span>
                        {i < STAGES.length - 1 && (
                          <span
                            className="my-1 w-px flex-1"
                            style={{
                              minHeight: 18,
                              background: done ? "var(--bm-ink)" : "var(--bm-hairline-strong)",
                            }}
                          />
                        )}
                      </div>
                      <span
                        className={`pb-1 text-[13px] leading-[20px] ${
                          now
                            ? "font-semibold text-[var(--bm-ink)]"
                            : done
                              ? "text-[var(--bm-body)]"
                              : "text-[var(--bm-muted-soft)]"
                        }`}
                      >
                        {st}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Card>

            {thread.offer && (
              <Card tone="card">
                <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                  받은 제안
                </p>
                <p className="bm-num mt-2 text-[24px] font-medium leading-[30px] text-[var(--bm-ink)]">
                  {KRW(thread.offer)}
                </p>
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <Button size="sm" full>
                    수락
                  </Button>
                  <Button size="sm" variant="secondary" full>
                    거절
                  </Button>
                </div>
              </Card>
            )}

            <Card tone="soft">
              <p className="flex items-center gap-2 text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                <ShieldCheck size={15} />
                안전거래
              </p>
              <div className="mt-3.5">
                <DefList
                  rows={[
                    { label: "결제 금액", value: <span className="bm-num">{KRW(l.price)}</span> },
                    { label: "수수료", value: <span className="bm-num">{KRW(Math.round(l.price * 0.03))}</span> },
                    { label: "정산 예정", value: "구매 확정 후 1영업일" },
                  ]}
                />
              </div>
              <div className="mt-4">
                <Button full size="md">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={15} />
                    배송 정보 입력
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
