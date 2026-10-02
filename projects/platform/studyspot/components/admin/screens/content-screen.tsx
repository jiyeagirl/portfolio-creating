"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  Cell,
  Segmented,
  Select,
  Table,
  Tabs,
} from "@/projects/platform/studyspot/components/admin/admin-ui";
import { CONTENT_ITEMS } from "@/projects/platform/studyspot/lib/mock-data";
import type { ContentItem, ContentKind } from "@/projects/platform/studyspot/lib/types";
import {
  CONTENT_KIND_LABEL,
  CONTENT_STATUS_LABEL,
  CONTENT_STATUS_TONE,
  dateOnly,
  type AdminNavigate,
} from "@/projects/platform/studyspot/lib/navigation";

/** textarea는 admin-ui.tsx의 비공개 INPUT_CLASS를 그대로 옮길 수 없어 근사치로 맞춘다. */
const TEXTAREA_CLASS =
  "min-h-[96px] w-full resize-none rounded-[6px] border border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] px-3 py-2.5 text-[14px] text-[var(--ss-ink)] outline-none transition-colors placeholder:text-[var(--ss-mute)] focus:border-[var(--ss-ink)]";

const BRANCH_ITEMS = CONTENT_ITEMS.filter((item) => item.branchScope === "gangnam");

const KIND_ORDER: ContentKind[] = ["notice", "event", "banner", "faq", "popup"];
const KIND_OPTIONS = KIND_ORDER.map((kind) => CONTENT_KIND_LABEL[kind]);

type ContentTab = ContentKind | "all";
type VisibilityKey = "visible" | "hidden";

function labelToKind(label: string): ContentKind {
  const found = KIND_ORDER.find((kind) => CONTENT_KIND_LABEL[kind] === label);
  return found ?? "notice";
}

export function ContentScreen({}: { onNavigate: AdminNavigate }) {
  const [activeTab, setActiveTab] = useState<ContentTab>("all");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  const [kind, setKind] = useState<ContentKind>("notice");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visible, setVisible] = useState(true);

  const isCreating = editingId === "new";
  const drawerOpen = editingId !== null;

  const openCreate = () => {
    setKind("notice");
    setTitle("");
    setBody("");
    setStartDate("");
    setEndDate("");
    setVisible(true);
    setEditingId("new");
  };

  const openEdit = (item: ContentItem) => {
    setKind(item.kind);
    setTitle(item.title);
    setBody(item.body);
    setStartDate(item.startAt.slice(0, 10));
    setEndDate(item.endAt.slice(0, 10));
    setVisible(item.visible);
    setEditingId(item.id);
  };

  const closeDrawer = () => setEditingId(null);

  const tabItems = [
    { key: "all" as ContentTab, label: "전체", count: BRANCH_ITEMS.length },
    ...KIND_ORDER.map((k) => ({
      key: k as ContentTab,
      label: CONTENT_KIND_LABEL[k],
      count: BRANCH_ITEMS.filter((item) => item.kind === k).length,
    })),
  ];

  const filteredItems = activeTab === "all" ? BRANCH_ITEMS : BRANCH_ITEMS.filter((item) => item.kind === activeTab);

  const previewBody = body
    ? body.length > 60
      ? `${body.slice(0, 60)}...`
      : body
    : "내용을 입력하면 미리보기에 표시됩니다.";

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="점주 관리자 콘솔"
        title="콘텐츠 관리"
        desc="강남 본점의 공지사항, 이벤트, 배너, FAQ, 팝업을 등록하고 게시 기간과 노출 여부를 관리합니다."
        actions={
          <Button onClick={openCreate}>새 콘텐츠 등록</Button>
        }
      />

      <Tabs value={activeTab} items={tabItems} onChange={setActiveTab} />

      <Card padded={false}>
        <div className="p-5">
          <Table minWidth={560} head={["종류", "제목", "게시 기간", "상태", "노출"]}>
            {filteredItems.map((item) => (
              <Row key={item.id} onClick={() => openEdit(item)}>
                <Cell muted nowrap>{CONTENT_KIND_LABEL[item.kind]}</Cell>
                <Cell strong>{item.title}</Cell>
                <Cell mono nowrap muted>
                  {dateOnly(item.startAt)} ~ {dateOnly(item.endAt)}
                </Cell>
                <Cell>
                  <Badge tone={CONTENT_STATUS_TONE[item.status]}>{CONTENT_STATUS_LABEL[item.status]}</Badge>
                </Cell>
                <Cell>
                  <Badge tone={item.visible ? "positive" : "neutral"}>{item.visible ? "노출" : "숨김"}</Badge>
                </Cell>
              </Row>
            ))}
          </Table>
          {filteredItems.length === 0 && (
            <p className="py-10 text-center text-[13px] text-[var(--ss-mute)]">
              해당 종류의 콘텐츠가 없습니다.
            </p>
          )}
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isCreating ? "새 콘텐츠 등록" : "콘텐츠 수정"}
        subtitle={isCreating ? "게시 기간과 노출 여부를 설정하세요" : `${CONTENT_KIND_LABEL[kind]} 항목 수정`}
        footer={
          <div className={`flex items-center gap-3 ${isCreating ? "justify-end" : "justify-between"}`}>
            {!isCreating && (
              <Button variant="danger" onClick={closeDrawer}>
                삭제
              </Button>
            )}
            <Button onClick={closeDrawer}>저장</Button>
          </div>
        }
      >
        <div className="space-y-5">
          <Field label="종류">
            <Select value={CONTENT_KIND_LABEL[kind]} options={KIND_OPTIONS} onChange={(next) => setKind(labelToKind(next))} />
          </Field>

          <Field label="제목">
            <Input value={title} onChange={setTitle} placeholder="콘텐츠 제목을 입력하세요" />
          </Field>

          <Field label="내용">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="콘텐츠 본문을 입력하세요"
              className={TEXTAREA_CLASS}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="게시 시작일">
              <Input type="date" value={startDate} onChange={setStartDate} />
            </Field>
            <Field label="게시 종료일">
              <Input type="date" value={endDate} onChange={setEndDate} />
            </Field>
          </div>

          <Field label="노출 여부">
            <Segmented<VisibilityKey>
              value={visible ? "visible" : "hidden"}
              items={[
                { key: "visible", label: "노출" },
                { key: "hidden", label: "숨김" },
              ]}
              onChange={(next) => setVisible(next === "visible")}
            />
          </Field>

          <div>
            <p className="text-[13px] font-medium text-[var(--ss-ink)]">미리보기</p>
            <div className="mt-2 rounded-[8px] border border-[var(--ss-hairline)] bg-[var(--ss-canvas-soft)] p-4">
              <Badge tone="info">{CONTENT_KIND_LABEL[kind]}</Badge>
              <p className="mt-2 text-[14px] font-semibold leading-5 text-[var(--ss-ink)]">
                {title || "제목을 입력하세요"}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[var(--ss-mute)]">{previewBody}</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
