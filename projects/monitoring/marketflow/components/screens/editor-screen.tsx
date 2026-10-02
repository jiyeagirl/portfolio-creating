"use client";

import { useMemo, useState } from "react";
import { CheckCircle, ChatCircleDots, PencilSimple, XCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  ContentThumb,
  DefList,
  Modal,
  PageHead,
  SearchInput,
  Tabs,
  Textarea,
  Timeline,
} from "@/projects/monitoring/marketflow/components/ui";
import { contentItems as initialItems, customers } from "@/projects/monitoring/marketflow/lib/mock-data";
import { CONTENT_TYPE_LABEL, STATUS_LABEL, STATUS_TONE } from "@/projects/monitoring/marketflow/lib/navigation";
import type { ContentItem, ContentStatus } from "@/projects/monitoring/marketflow/lib/types";

type FilterKey = "all" | ContentStatus;

const TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: STATUS_LABEL.pending },
  { key: "draft", label: STATUS_LABEL.draft },
  { key: "scheduled", label: STATUS_LABEL.scheduled },
  { key: "published", label: STATUS_LABEL.published },
  { key: "rejected", label: STATUS_LABEL.rejected },
];

function cloneItems() {
  return initialItems.map((item) => ({
    ...item,
    channels: [...item.channels],
    keywords: [...item.keywords],
    body: [...item.body],
    versions: item.versions.map((v) => ({ ...v })),
    comments: item.comments.map((c) => ({ ...c })),
  }));
}

export function EditorScreen() {
  const [items, setItems] = useState<ContentItem[]>(() => cloneItems());
  const [tab, setTab] = useState<FilterKey>("pending");
  const [search, setSearch] = useState("");
  const firstPending = items.find((i) => i.status === "pending");
  const [selectedId, setSelectedId] = useState(firstPending?.id ?? items[0].id);
  const [editTitle, setEditTitle] = useState(false);
  const [actionOpen, setActionOpen] = useState<"approve" | "reject" | "request-changes" | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (tab !== "all" && item.status !== tab) return false;
        if (search && !item.title.includes(search)) return false;
        return true;
      }),
    [items, tab, search],
  );

  const selected = items.find((i) => i.id === selectedId) ?? filtered[0] ?? items[0];
  const customer = customers.find((c) => c.id === selected.customerId);

  function updateSelected(patch: Partial<ContentItem>) {
    setItems((prev) => prev.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)));
  }

  function submitAction(action: "approve" | "reject" | "request-changes") {
    const at = "2025-09-08T09:32:00";
    const nextStatus: ContentStatus =
      action === "approve" ? (selected.channels.length ? "scheduled" : "published") : action === "reject" ? "rejected" : "pending";
    const comment = {
      id: `cm-${selected.id}-${selected.comments.length + 1}`,
      author: "박서연",
      at,
      action,
      text:
        commentDraft ||
        (action === "approve" ? "확인했습니다. 승인합니다." : action === "reject" ? "반려합니다. 사유를 확인해주세요." : "수정 요청드립니다."),
    };
    updateSelected({
      status: action === "reject" ? "rejected" : action === "approve" ? nextStatus : "pending",
      comments: [...selected.comments, comment],
      rejectReason: action === "reject" ? comment.text : selected.rejectReason,
    });
    setActionOpen(null);
    setCommentDraft("");
  }

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="EDITOR & APPROVAL"
        title="콘텐츠 에디터 / 승인"
        desc="AI가 생성한 콘텐츠를 검수하고, 승인, 반려, 수정 요청을 남길 수 있습니다. 모든 변경은 버전으로 기록됩니다."
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[380px_1fr]">
        <Card padded={false} className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[var(--mf-hairline)] p-4">
            <SearchInput value={search} onChange={setSearch} placeholder="제목 검색" />
            <Tabs value={tab} items={TABS} onChange={setTab} />
          </div>
          <ul className="max-h-[640px] divide-y divide-[var(--mf-hairline)] overflow-y-auto">
            {filtered.length === 0 && <li className="p-6 text-center text-[13px] text-[var(--mf-mute)]">해당 조건의 콘텐츠가 없습니다</li>}
            {filtered.map((item) => {
              const c = customers.find((cc) => cc.id === item.customerId);
              const active = item.id === selected.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setEditTitle(false);
                    }}
                    className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${active ? "bg-[var(--mf-soft)]" : "hover:bg-[var(--mf-soft)]"}`}
                  >
                    <ContentThumb photo={item.thumbnail} title={item.title} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--mf-ink)]">{item.title}</p>
                      <p className="mt-0.5 truncate text-[11.5px] text-[var(--mf-mute)]">
                        {c?.name} | {CONTENT_TYPE_LABEL[item.type]}
                      </p>
                      <div className="mt-1.5">
                        <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {editTitle ? (
                  <input
                    autoFocus
                    value={selected.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                    onBlur={() => setEditTitle(false)}
                    className="w-full rounded-[6px] border border-[var(--mf-hairline-strong)] px-2 py-1 text-[18px] font-semibold text-[var(--mf-ink)] outline-none"
                  />
                ) : (
                  <button type="button" onClick={() => setEditTitle(true)} className="group flex items-center gap-2 text-left">
                    <h2 className="text-[18px] font-semibold leading-6 text-[var(--mf-ink)]">{selected.title}</h2>
                    <PencilSimple size={13} className="shrink-0 text-[var(--mf-mute)] opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                )}
                <p className="mt-1.5 text-[12.5px] text-[var(--mf-mute)]">
                  {customer?.name} | {CONTENT_TYPE_LABEL[selected.type]} | 담당 {selected.assignee}
                </p>
              </div>
              <Badge tone={STATUS_TONE[selected.status]}>{STATUS_LABEL[selected.status]}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
              <ContentThumb photo={selected.thumbnail} title={selected.title} size={140} rounded={8} />
              <div className="flex flex-col gap-2.5">
                {selected.body.map((line, i) => (
                  <Textarea key={i} value={line} rows={2} onChange={(next) => {
                    const nextBody = [...selected.body];
                    nextBody[i] = next;
                    updateSelected({ body: nextBody });
                  }} />
                ))}
              </div>
            </div>

            {selected.status === "rejected" && selected.rejectReason && (
              <div className="mt-4 rounded-[8px] border border-[var(--mf-danger-soft)] bg-[var(--mf-danger-soft)] p-3">
                <p className="text-[12.5px] font-medium text-[var(--mf-danger-deep)]">반려 사유</p>
                <p className="mt-1 text-[13px] leading-5 text-[var(--mf-danger-deep)]">{selected.rejectReason}</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--mf-hairline)] pt-5">
              <Button icon={<CheckCircle size={15} weight="bold" />} onClick={() => setActionOpen("approve")} disabled={selected.status === "published"}>
                승인
              </Button>
              <Button variant="secondary" icon={<ChatCircleDots size={15} />} onClick={() => setActionOpen("request-changes")}>
                수정 요청
              </Button>
              <Button variant="danger" icon={<XCircle size={15} weight="bold" />} onClick={() => setActionOpen("reject")}>
                반려
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <CardHead title="버전 관리 / 변경 이력" desc={`총 ${selected.versions.length}개 버전`} />
              <Timeline
                steps={selected.versions.map((v) => ({
                  label: `${v.label} | ${v.author}`,
                  at: v.at.slice(0, 16).replace("T", " "),
                  done: true,
                  note: v.summary,
                }))}
              />
            </Card>

            <Card>
              <CardHead title="관리자 코멘트" desc={`${selected.comments.length}개 코멘트`} />
              {selected.comments.length === 0 ? (
                <p className="text-[13px] text-[var(--mf-mute)]">아직 코멘트가 없습니다.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {selected.comments.map((c) => (
                    <li key={c.id} className="rounded-[8px] border border-[var(--mf-hairline)] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-[var(--mf-ink)]">{c.author}</p>
                        <Badge tone={c.action === "approve" ? "ink" : c.action === "reject" ? "danger" : "warn"}>
                          {c.action === "approve" ? "승인" : c.action === "reject" ? "반려" : c.action === "request-changes" ? "수정 요청" : "코멘트"}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-5 text-[var(--mf-body)]">{c.text}</p>
                      <p className="mt-1.5 mf-mono text-[11px] text-[var(--mf-mute)]">{c.at.slice(0, 16).replace("T", " ")}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card soft>
            <CardHead title="콘텐츠 정보" />
            <DefList
              columns={2}
              items={[
                { label: "발행 채널", value: selected.channels.join(", ") },
                { label: "키워드", value: selected.keywords.join(", ") },
                { label: "AI 생성 점수", value: `${selected.aiScore}점` },
                {
                  label: "예약/발행 일시",
                  value: (selected.scheduledAt ?? selected.publishedAt ?? "미지정")?.slice(0, 16).replace("T", " "),
                },
              ]}
            />
          </Card>
        </div>
      </div>

      <Modal
        open={actionOpen !== null}
        title={actionOpen === "approve" ? "콘텐츠 승인" : actionOpen === "reject" ? "콘텐츠 반려" : "수정 요청"}
        onClose={() => setActionOpen(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setActionOpen(null)}>
              취소
            </Button>
            <Button
              variant={actionOpen === "reject" ? "danger" : "primary"}
              onClick={() => actionOpen && submitAction(actionOpen)}
            >
              {actionOpen === "approve" ? "승인 확정" : actionOpen === "reject" ? "반려 확정" : "수정 요청 보내기"}
            </Button>
          </div>
        }
      >
        <p className="text-[13px] leading-5 text-[var(--mf-mute)]">
          {selected.title}
          {actionOpen === "approve" && " 콘텐츠를 승인합니다. 채널이 설정된 경우 예약 상태로 전환됩니다."}
          {actionOpen === "reject" && " 콘텐츠를 반려합니다. 담당자에게 반려 사유가 전달됩니다."}
          {actionOpen === "request-changes" && " 콘텐츠에 대한 수정 요청을 담당자에게 전달합니다."}
        </p>
        <div className="mt-3">
          <Textarea
            value={commentDraft}
            onChange={setCommentDraft}
            rows={3}
            placeholder={actionOpen === "reject" ? "반려 사유를 입력하세요" : "코멘트를 입력하세요 (선택)"}
          />
        </div>
      </Modal>
    </div>
  );
}
