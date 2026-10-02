"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  Select,
  Table,
  Tabs,
} from "@/projects/platform/studyspot/components/admin/admin-ui";
import {
  CONTENT_KIND_LABEL,
  CONTENT_STATUS_LABEL,
  CONTENT_STATUS_TONE,
  dateOnly,
  type HqNavigate,
} from "@/projects/platform/studyspot/lib/navigation";
import { BRANCHES, HQ_CONTENT } from "@/projects/platform/studyspot/lib/mock-data";
import type { ContentItem, ContentKind } from "@/projects/platform/studyspot/lib/types";

/** mock "오늘" 고정값. 게시 시작일이 이보다 미래면 예약 게시로 안내한다. */
const TODAY = "2025-06-15";

const ALL_SCOPE_LABEL = "전체 지점";
const KIND_OPTIONS = Object.values(CONTENT_KIND_LABEL);
const SCOPE_OPTIONS = [ALL_SCOPE_LABEL, ...BRANCHES.map((branch) => branch.name)];

type TabKey = "all" | ContentKind;

const TEXTAREA_CLASS =
  "min-h-[104px] w-full resize-none rounded-[6px] border border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] px-3 py-2.5 text-[14px] leading-5 text-[var(--ss-ink)] outline-none transition-colors placeholder:text-[var(--ss-mute)] focus:border-[var(--ss-ink)]";

interface FormState {
  kind: ContentKind;
  title: string;
  body: string;
  branchScope: string;
  startDate: string;
  endDate: string;
}

const EMPTY_FORM: FormState = {
  kind: "notice",
  title: "",
  body: "",
  branchScope: "all",
  startDate: "",
  endDate: "",
};

function scopeLabel(branchScope: string) {
  if (branchScope === "all") return ALL_SCOPE_LABEL;
  return BRANCHES.find((branch) => branch.id === branchScope)?.name ?? branchScope;
}

function toForm(item: ContentItem): FormState {
  return {
    kind: item.kind,
    title: item.title,
    body: item.body,
    branchScope: item.branchScope,
    startDate: item.startAt.slice(0, 10),
    endDate: item.endAt.slice(0, 10),
  };
}

const HISTORY = [...HQ_CONTENT].sort((a, b) => b.startAt.localeCompare(a.startAt));

export function ContentScreen({}: { onNavigate: HqNavigate }) {
  const [tab, setTab] = useState<TabKey>("all");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const tabItems = [
    { key: "all" as TabKey, label: "전체", count: HQ_CONTENT.length },
    ...(Object.keys(CONTENT_KIND_LABEL) as ContentKind[]).map((kind) => ({
      key: kind as TabKey,
      label: CONTENT_KIND_LABEL[kind],
      count: HQ_CONTENT.filter((item) => item.kind === kind).length,
    })),
  ];

  const filtered = tab === "all" ? HQ_CONTENT : HQ_CONTENT.filter((item) => item.kind === tab);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId("new");
  };

  const openEdit = (item: ContentItem) => {
    setForm(toForm(item));
    setEditingId(item.id);
  };

  const closeDrawer = () => setEditingId(null);

  const isScheduled = form.startDate !== "" && form.startDate > TODAY;
  const isNew = editingId === "new";

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        eyebrow="본사 관리자 콘솔"
        title="콘텐츠 관리"
        desc="공지사항, 이벤트, 배너, FAQ를 전 지점에 일괄 배포하거나 특정 지점만 지정해 노출할 수 있습니다."
        actions={
          <Button onClick={openCreate} size="sm">
            새 콘텐츠 배포
          </Button>
        }
      />

      <Tabs value={tab} items={tabItems} onChange={setTab} />

      <Card padded={false}>
        <div className="p-5">
          <Table head={["제목", "배포 범위", "게시 기간", "상태"]} minWidth={600}>
            {filtered.map((item) => (
              <Row key={item.id} onClick={() => openEdit(item)}>
                <Cell strong>{item.title}</Cell>
                <Cell muted>{scopeLabel(item.branchScope)}</Cell>
                <Cell mono muted nowrap>
                  {dateOnly(item.startAt)} ~ {dateOnly(item.endAt)}
                </Cell>
                <Cell>
                  <Badge tone={CONTENT_STATUS_TONE[item.status]} dot>
                    {CONTENT_STATUS_LABEL[item.status]}
                  </Badge>
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Card>
        <CardHead title="게시 이력" desc="본사에서 배포한 콘텐츠의 게시 시점 기록" />
        <ul className="flex flex-col gap-3">
          {HISTORY.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 border-b border-[var(--ss-hairline)] pb-3 last:border-b-0 last:pb-0"
            >
              <p className="min-w-0 truncate text-[13.5px] text-[var(--ss-body)]">
                <span className="font-medium text-[var(--ss-ink)]">{item.title}</span>
                {`이(가) ${dateOnly(item.startAt)}에 게시되었습니다`}
              </p>
              <Badge tone={CONTENT_STATUS_TONE[item.status]}>{CONTENT_STATUS_LABEL[item.status]}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Drawer
        open={editingId !== null}
        title={isNew ? "새 콘텐츠 배포" : "콘텐츠 편집"}
        subtitle={isNew ? "전 지점 또는 특정 지점을 지정해 새 콘텐츠를 배포합니다." : "배포 범위와 게시 기간을 수정합니다."}
        onClose={closeDrawer}
        footer={
          <div className="flex items-center justify-between gap-2">
            {!isNew && (
              <Button variant="danger" onClick={closeDrawer}>
                삭제
              </Button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="secondary" onClick={closeDrawer}>
                취소
              </Button>
              <Button onClick={closeDrawer}>{isNew ? "배포" : "저장"}</Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="종류">
            <Select
              value={CONTENT_KIND_LABEL[form.kind]}
              options={KIND_OPTIONS}
              onChange={(next) => {
                const matched = (Object.keys(CONTENT_KIND_LABEL) as ContentKind[]).find(
                  (kind) => CONTENT_KIND_LABEL[kind] === next,
                );
                setForm((prev) => ({ ...prev, kind: matched ?? prev.kind }));
              }}
            />
          </Field>

          <Field label="제목">
            <Input
              value={form.title}
              onChange={(next) => setForm((prev) => ({ ...prev, title: next }))}
              placeholder="예: 전 지점 여름철 냉방 운영 기준 안내"
            />
          </Field>

          <Field label="내용">
            <textarea
              value={form.body}
              onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
              placeholder="지점 운영자와 이용자에게 노출될 본문을 입력하세요."
              className={TEXTAREA_CLASS}
            />
          </Field>

          <Field label="배포 범위" hint="전체 지점으로 배포하거나, 특정 지점 하나만 지정할 수 있습니다.">
            <Select
              value={scopeLabel(form.branchScope)}
              options={SCOPE_OPTIONS}
              onChange={(next) => {
                if (next === ALL_SCOPE_LABEL) {
                  setForm((prev) => ({ ...prev, branchScope: "all" }));
                  return;
                }
                const matched = BRANCHES.find((branch) => branch.name === next);
                setForm((prev) => ({ ...prev, branchScope: matched?.id ?? "all" }));
              }}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="게시 시작일">
              <Input
                type="date"
                value={form.startDate}
                onChange={(next) => setForm((prev) => ({ ...prev, startDate: next }))}
              />
            </Field>
            <Field label="게시 종료일">
              <Input
                type="date"
                value={form.endDate}
                onChange={(next) => setForm((prev) => ({ ...prev, endDate: next }))}
              />
            </Field>
          </div>

          {isScheduled && (
            <div className="flex items-center gap-2 rounded-[6px] bg-[var(--ss-info-soft)] px-3 py-2.5">
              <Badge tone="info">예약 게시</Badge>
              <p className="text-[12px] leading-4 text-[var(--ss-info)]">
                게시 시작일이 되면 자동으로 게시 중 상태로 전환됩니다.
              </p>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
