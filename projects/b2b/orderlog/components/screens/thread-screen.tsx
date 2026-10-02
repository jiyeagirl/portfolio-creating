"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarX,
  CheckCircle,
  FileText,
  PaperPlaneTilt,
  Paperclip,
  Robot,
  UserSwitch,
} from "@phosphor-icons/react";
import { Badge, Button, Card, DefList, InitialAvatar, Textarea } from "@/projects/b2b/orderlog/components/ui";
import { orders, priceSnapshots, threadEvents } from "@/projects/b2b/orderlog/lib/mock-data";
import {
  RISK_LABEL,
  RISK_TONE,
  ROLE_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  type Navigate,
  won,
} from "@/projects/b2b/orderlog/lib/navigation";
import type { Role, ThreadEvent } from "@/projects/b2b/orderlog/lib/types";

const ROLE_TONE: Record<Role, "ink" | "accent" | "neutral"> = {
  master: "ink",
  buyer: "accent",
  supplier: "neutral",
  vendor: "neutral",
};

function EventCard({
  icon,
  tone,
  label,
  event,
}: {
  icon: React.ReactNode;
  tone: "info" | "warn" | "success" | "neutral";
  label: string;
  event: ThreadEvent;
}) {
  const toneClass = {
    info: "border-[var(--ot-accent-soft)] bg-[var(--ot-accent-soft)]",
    warn: "border-[var(--ot-warn-soft)] bg-[var(--ot-warn-soft)]",
    success: "border-[var(--ot-success-soft)] bg-[var(--ot-success-soft)]",
    neutral: "border-[var(--ot-hairline)] bg-[var(--ot-surface-soft)]",
  }[tone];
  const iconToneClass = {
    info: "bg-[var(--ot-accent)] text-white",
    warn: "bg-[var(--ot-warn)] text-white",
    success: "bg-[var(--ot-success)] text-white",
    neutral: "bg-[var(--ot-ink)] text-white",
  }[tone];

  return (
    <div className={`flex gap-3 rounded-[10px] border px-4 py-3.5 ${toneClass}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] ${iconToneClass}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="text-[13px] font-medium text-[var(--ot-ink)]">
            {label} <span className="font-normal text-[var(--ot-body)]">/ {event.actor}</span>
          </p>
          <p className="ot-mono text-[11px] text-[var(--ot-mute)]">{event.at}</p>
        </div>
        {event.body && <p className="mt-1 text-[13px] leading-5 text-[var(--ot-body)]">{event.body}</p>}
        {event.meta && (
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {Object.entries(event.meta).map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-1.5 text-[12px]">
                <dt className="text-[var(--ot-mute)]">{k}</dt>
                <dd className="ot-mono font-medium text-[var(--ot-ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

function ChatBubble({ event, own }: { event: ThreadEvent; own: boolean }) {
  return (
    <div className={`flex gap-2.5 ${own ? "flex-row-reverse" : ""}`}>
      <InitialAvatar name={event.actor} tone={ROLE_TONE[event.actorRole]} />
      <div className={`min-w-0 max-w-[74%] ${own ? "items-end text-right" : ""}`}>
        <p className={`mb-1 flex items-center gap-1.5 text-[12px] text-[var(--ot-mute)] ${own ? "flex-row-reverse" : ""}`}>
          <span className="font-medium text-[var(--ot-body)]">{event.actor}</span>
          <span>{ROLE_LABEL[event.actorRole]}</span>
        </p>
        {event.body && (
          <div
            className={`inline-block rounded-[10px] px-3.5 py-2.5 text-left text-[13.5px] leading-5 ${
              own ? "bg-[var(--ot-accent)] text-white" : "bg-[var(--ot-surface-soft)] text-[var(--ot-ink)]"
            }`}
          >
            {event.body}
          </div>
        )}
        {event.attachment && (
          <div
            className={`mt-1.5 inline-flex items-center gap-2.5 rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] p-2 text-left ${
              own ? "flex-row-reverse" : ""
            }`}
          >
            {event.attachment.kind === "image" && event.attachment.photo !== undefined ? (
              <Image
                src={`https://picsum.photos/id/${event.attachment.photo}/72/72`}
                alt={event.attachment.name}
                width={44}
                height={44}
                className="rounded-[6px] object-cover"
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--ot-surface-soft)] text-[var(--ot-body)]">
                <FileText size={18} />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-medium text-[var(--ot-ink)]">{event.attachment.name}</span>
              <span className="block text-[11px] text-[var(--ot-mute)]">{event.attachment.size}</span>
            </span>
          </div>
        )}
        <p className="mt-1 ot-mono text-[11px] text-[var(--ot-mute)]">{event.at}</p>
      </div>
    </div>
  );
}

export function ThreadScreen({
  orderId,
  role,
  onNavigate,
  onBack,
}: {
  orderId: string;
  role: Role;
  onNavigate: Navigate;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState("");
  const order = orders.find((o) => o.id === orderId) ?? orders[0];
  const events = threadEvents
    .filter((e) => e.orderId === order.id)
    .sort((a, b) => (a.at < b.at ? -1 : 1));
  const relatedSnapshot = priceSnapshots.find((s) => s.itemName === order.itemName);

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-3 flex items-center gap-1.5 text-[12.5px] text-[var(--ot-mute)] hover:text-[var(--ot-body)]"
        >
          <ArrowLeft size={13} />
          대시보드로
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--ot-hairline)] pb-6">
          <div>
            <p className="ot-mono text-[12px] font-medium text-[var(--ot-accent)]">{order.code}</p>
            <h1 className="mt-1 text-[22px] font-semibold leading-8 tracking-[-0.02em] text-[var(--ot-ink)]">
              {order.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
              <Badge tone={RISK_TONE[order.riskLevel]}>AI 위험도 {RISK_LABEL[order.riskLevel]}</Badge>
              <span className="text-[12.5px] text-[var(--ot-mute)]">
                {order.buyer} → {order.supplier} → {order.vendor}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={<UserSwitch size={14} />}>
              담당자 변경
            </Button>
            <Button size="md" icon={<PaperPlaneTilt size={14} weight="bold" />}>
              최종 승인 요청
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] items-start">
        <Card padded className="flex flex-col">
          <div className="max-h-[720px] space-y-4 overflow-y-auto pr-1">
            {events.map((event) => {
              switch (event.type) {
                case "order_created":
                  return <EventCard key={event.id} icon={<PaperPlaneTilt size={15} weight="bold" />} tone="info" label="발주 등록" event={event} />;
                case "due_change_request":
                  return <EventCard key={event.id} icon={<CalendarX size={15} weight="bold" />} tone="warn" label="납기 변경 요청" event={event} />;
                case "due_change_response":
                  return <EventCard key={event.id} icon={<CalendarCheck size={15} weight="bold" />} tone="success" label="납기 변경 승인" event={event} />;
                case "approval_request":
                  return <EventCard key={event.id} icon={<PaperPlaneTilt size={15} weight="bold" />} tone="info" label="승인 요청" event={event} />;
                case "approval_done":
                  return <EventCard key={event.id} icon={<CheckCircle size={15} weight="bold" />} tone="success" label="승인 완료" event={event} />;
                case "assignee_change":
                  return <EventCard key={event.id} icon={<UserSwitch size={15} weight="bold" />} tone="neutral" label="담당자 변경" event={event} />;
                case "ai_alert":
                  return (
                    <div key={event.id} className="flex gap-3 rounded-[10px] border border-[var(--ot-danger-soft)] bg-[var(--ot-danger-soft)] px-4 py-3.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[var(--ot-danger)] text-white">
                        <Robot size={15} weight="bold" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-[13px] font-medium text-[var(--ot-danger-deep)]">AI 이상 탐지 / {event.actor}</p>
                          <p className="ot-mono text-[11px] text-[var(--ot-mute)]">{event.at}</p>
                        </div>
                        {event.body && <p className="mt-1 text-[13px] leading-5 text-[var(--ot-ink)]">{event.body}</p>}
                        {event.meta && (
                          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                            {Object.entries(event.meta).map(([k, v]) => (
                              <div key={k} className="flex items-baseline gap-1.5 text-[12px]">
                                <dt className="text-[var(--ot-mute)]">{k}</dt>
                                <dd className="ot-mono font-medium text-[var(--ot-danger-deep)]">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        <button
                          type="button"
                          onClick={() => onNavigate("anomaly")}
                          className="mt-2 text-[12px] font-medium text-[var(--ot-danger-deep)] underline underline-offset-2"
                        >
                          AI 이상 발주 센터에서 검토
                        </button>
                      </div>
                    </div>
                  );
                default:
                  return <ChatBubble key={event.id} event={event} own={event.actorRole === role} />;
              }
            })}
          </div>

          <div className="mt-5 border-t border-[var(--ot-hairline)] pt-4">
            <Textarea value={draft} onChange={setDraft} placeholder="댓글을 입력하세요. 파일을 첨부하거나 승인을 요청할 수 있습니다." rows={2} />
            <div className="mt-2.5 flex items-center justify-between">
              <button type="button" className="flex items-center gap-1.5 text-[12.5px] text-[var(--ot-mute)] hover:text-[var(--ot-body)]">
                <Paperclip size={14} />
                파일 첨부
              </button>
              <Button size="sm" disabled={!draft.trim()}>
                등록
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="mb-3 text-[13px] font-semibold text-[var(--ot-ink)]">발주 정보</p>
            <DefList
              items={[
                { label: "품목", value: `${order.itemName} (${order.itemCode})` },
                { label: "수량", value: `${order.quantity.toLocaleString("ko-KR")}${order.unit}` },
                { label: "스냅샷 단가", value: won(order.snapshotPrice) },
                { label: "금액", value: won(order.amount) },
                { label: "납기", value: order.dueDate },
                { label: "담당자", value: order.assignee },
                { label: "최종 갱신", value: order.updatedAt },
              ]}
              columns={1}
            />
          </Card>

          {relatedSnapshot && (
            <Card soft>
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ot-ink)]">
                <CalendarCheck size={14} />
                단가 스냅샷 고정 안내
              </p>
              <p className="text-[12.5px] leading-5 text-[var(--ot-body)]">
                이 발주는 <span className="ot-mono font-medium">{won(order.snapshotPrice)}</span>로 고정되어,
                {relatedSnapshot.effectiveDate}부 예약된 신규 단가{" "}
                <span className="ot-mono font-medium">{won(relatedSnapshot.toPrice)}</span>와 무관하게 정산됩니다.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("items")}
                className="mt-2 text-[12px] font-medium text-[var(--ot-accent)]"
              >
                품목/단가 스냅샷에서 보기
              </button>
            </Card>
          )}

          <Card>
            <p className="mb-3 text-[13px] font-semibold text-[var(--ot-ink)]">참여자</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <InitialAvatar name={order.buyer} tone="accent" size={30} />
                <span className="text-[13px]">
                  <span className="block font-medium text-[var(--ot-ink)]">{order.buyer}</span>
                  <span className="text-[12px] text-[var(--ot-mute)]">원청</span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <InitialAvatar name={order.supplier} size={30} />
                <span className="text-[13px]">
                  <span className="block font-medium text-[var(--ot-ink)]">{order.supplier}</span>
                  <span className="text-[12px] text-[var(--ot-mute)]">납품처</span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <InitialAvatar name={order.vendor} size={30} />
                <span className="text-[13px]">
                  <span className="block font-medium text-[var(--ot-ink)]">{order.vendor}</span>
                  <span className="text-[12px] text-[var(--ot-mute)]">거래처</span>
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
