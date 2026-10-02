"use client";

import { useState } from "react";
import { CheckCircle, ChatText, PencilSimple, Prohibit, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  ChannelTag,
  Drawer,
  Eyebrow,
  EmptyState,
  Field,
  InitialAvatar,
  PageHead,
  Preview,
  Tabs,
  Textarea,
  Thumb,
  Timeline,
} from "@/projects/monitoring/brandpilot/components/ui";
import { approvalEvents, contents } from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CHANNEL_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  shortAt,
  type Navigate,
} from "@/projects/monitoring/brandpilot/lib/navigation";
import type { ApprovalAction, ContentItem } from "@/projects/monitoring/brandpilot/lib/types";

type Tab = "review" | "approved" | "rejected";

const ACTION_LABEL: Record<ApprovalAction, string> = {
  requested: "검토 요청",
  approved: "승인",
  rejected: "반려",
  comment: "댓글",
  revised: "수정 반영",
};

export function ApprovalsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [tab, setTab] = useState<Tab>("review");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [comment, setComment] = useState("");

  const byTab: Record<Tab, ContentItem[]> = {
    review: contents.filter((c) => c.status === "review"),
    approved: contents.filter((c) => c.status === "approved"),
    rejected: contents.filter((c) => c.status === "rejected"),
  };
  const list = byTab[tab];

  const events = selected ? approvalEvents.filter((e) => e.contentId === selected.id) : [];

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="콘텐츠"
        title="승인 워크플로우"
        desc="검토 요청부터 승인, 반려, 재수정까지 한 흐름으로 기록합니다. 버전별 이력이 남아 어떤 지적이 언제 반영됐는지 되짚을 수 있습니다."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">검토 대기</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {byTab.review.length}건
          </p>
          <p className="mt-2 text-[12px] text-[var(--bp-mute)]">평균 대기 1.4일</p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">이번 주 승인</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {byTab.approved.length}건
          </p>
          <p className="mt-2 text-[12px] text-[var(--bp-success-deep)]">평균 소요 4시간</p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">반려</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {byTab.rejected.length}건
          </p>
          <p className="mt-2 text-[12px] text-[var(--bp-danger-deep)]">가이드 위반이 주 원인</p>
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "review" as Tab, label: "검토 대기", count: byTab.review.length },
          { key: "approved" as Tab, label: "승인 완료", count: byTab.approved.length },
          { key: "rejected" as Tab, label: "반려", count: byTab.rejected.length },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={20} weight="fill" />}
          title="대기 중인 항목이 없습니다"
          desc="새 검토 요청이 들어오면 여기에 표시됩니다."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <Card key={c.id} padded={false} className="overflow-hidden">
              <button type="button" onClick={() => setSelected(c)} className="block w-full text-left">
                <Preview photo={c.photo} alt={c.title} ratio="16 / 10" rounded={0} />
              </button>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(c)}
                    className="min-w-0 flex-1 text-left text-[14px] font-medium leading-5 text-[var(--bp-ink)]"
                  >
                    {c.title}
                  </button>
                  <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-[var(--bp-mute)]">
                  {c.caption}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <ChannelTag channel={c.channel} label={CHANNEL_LABEL[c.channel]} />
                  <span className="bp-mono text-[12px] text-[var(--bp-mute)]">v{c.version}</span>
                  {c.guideIssues > 0 && (
                    <span className="flex items-center gap-1 text-[12px] text-[var(--bp-danger-deep)]">
                      <WarningCircle size={12} weight="fill" />
                      가이드 {c.guideIssues}건
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--bp-hairline)] pt-3">
                  <span className="flex items-center gap-1.5 text-[12px] text-[var(--bp-mute)]">
                    <InitialAvatar name={c.author} size={20} />
                    {c.author}
                  </span>
                  <span className="bp-mono text-[12px] text-[var(--bp-mute)]">
                    {shortAt(c.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={selected !== null}
        title={selected?.title ?? ""}
        subtitle={selected ? `${selected.campaignName} · v${selected.version}` : undefined}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setSelected(null)} icon={<CheckCircle size={14} weight="fill" />}>
              승인
            </Button>
            <Button variant="danger" onClick={() => setSelected(null)} icon={<Prohibit size={14} />}>
              반려
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (selected) onNavigate("editor", selected.id);
                setSelected(null);
              }}
              icon={<PencilSimple size={14} />}
            >
              편집기 열기
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-5">
            <Preview photo={selected.photo} alt={selected.title} ratio="16 / 10" />

            <div>
              <Eyebrow>카피</Eyebrow>
              <p className="mt-2 text-[13.5px] leading-6 text-[var(--bp-body)]">{selected.caption}</p>
              <p className="bp-mono mt-2 text-[12.5px] leading-5 text-[var(--bp-accent-deep)]">
                {selected.hashtags.join(" ")}
              </p>
            </div>

            {selected.guideIssues > 0 && (
              <div className="flex gap-2.5 rounded-[6px] bg-[var(--bp-danger-soft)] px-3.5 py-3">
                <WarningCircle
                  size={15}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--bp-danger-deep)]"
                />
                <p className="text-[12.5px] leading-5 text-[var(--bp-danger-deep)]">
                  브랜드 가이드 위반 {selected.guideIssues}건이 감지됐습니다. 편집기에서 해당 표현을
                  수정한 뒤 다시 요청해 주세요.
                </p>
              </div>
            )}

            <div>
              <Eyebrow>승인 이력</Eyebrow>
              <div className="mt-3">
                {events.length > 0 ? (
                  <Timeline
                    steps={events.map((e) => ({
                      label: ACTION_LABEL[e.action],
                      at: shortAt(e.at),
                      done: true,
                      actor: `${e.actor} · v${e.version}`,
                      note: e.body,
                    }))}
                  />
                ) : (
                  <p className="text-[13px] text-[var(--bp-mute)]">아직 기록된 이력이 없습니다.</p>
                )}
              </div>
            </div>

            <Field label="검토 의견">
              <Textarea
                value={comment}
                onChange={setComment}
                rows={3}
                placeholder="수정이 필요한 부분을 구체적으로 적어주세요"
              />
            </Field>
          </div>
        )}
      </Drawer>

      <Card>
        <CardHead title="전체 승인 활동" desc="모든 콘텐츠의 최근 승인 관련 기록입니다" />
        <ul className="space-y-4">
          {approvalEvents.map((e) => {
            const c = contents.find((x) => x.id === e.contentId);
            return (
              <li key={e.id} className="flex gap-3 border-b border-[var(--bp-hairline)] pb-4 last:border-b-0 last:pb-0">
                <InitialAvatar name={e.actor} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 text-[13.5px] text-[var(--bp-body)]">
                    <span className="font-medium text-[var(--bp-ink)]">{e.actor}</span>
                    <Badge
                      tone={
                        e.action === "approved"
                          ? "success"
                          : e.action === "rejected"
                            ? "danger"
                            : e.action === "comment"
                              ? "neutral"
                              : "warn"
                      }
                    >
                      {ACTION_LABEL[e.action]}
                    </Badge>
                    <span className="bp-mono text-[12px] text-[var(--bp-mute)]">v{e.version}</span>
                  </p>
                  {c && (
                    <button
                      type="button"
                      onClick={() => onNavigate("editor", c.id)}
                      className="mt-1 flex items-center gap-2 text-left"
                    >
                      <Thumb photo={c.photo} alt={c.title} size={20} rounded={4} />
                      <span className="truncate text-[12.5px] text-[var(--bp-accent-deep)]">
                        {c.title}
                      </span>
                    </button>
                  )}
                  {e.body && (
                    <p className="mt-1.5 flex gap-1.5 text-[12.5px] leading-5 text-[var(--bp-body)]">
                      <ChatText size={13} className="mt-0.5 shrink-0 text-[var(--bp-mute)]" />
                      {e.body}
                    </p>
                  )}
                </div>
                <span className="bp-mono shrink-0 text-[12px] text-[var(--bp-mute)]">
                  {shortAt(e.at)}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
