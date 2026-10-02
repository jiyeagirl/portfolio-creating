"use client";

import { useMemo, useState } from "react";
import { Copy, Plus, Trash } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  Cell,
  Checkbox,
  DefList,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  SearchInput,
  Segmented,
  Select,
  Table,
  Tabs,
  Textarea,
} from "@/projects/b2b/genderinsight/components/ui";
import {
  ASSESSMENTS,
  BUSINESS_UNITS,
  QUESTION_TEMPLATES,
} from "@/projects/b2b/genderinsight/lib/mock-data";
import type { Assessment, AssessmentStatus, BusinessUnit } from "@/projects/b2b/genderinsight/lib/types";

const STATUS_TONE: Record<AssessmentStatus, "neutral" | "info" | "ink"> = {
  준비중: "neutral",
  진행중: "info",
  종료: "ink",
};

const STATUS_TABS: (AssessmentStatus | "전체")[] = ["전체", "준비중", "진행중", "종료"];

const emptyDraft = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  templateId: QUESTION_TEMPLATES[0].id,
  visibility: "공개" as "공개" | "비공개",
  units: [] as BusinessUnit[],
};

export function AdminAssessments() {
  const [list, setList] = useState<Assessment[]>(ASSESSMENTS);
  const [statusFilter, setStatusFilter] = useState<AssessmentStatus | "전체">("전체");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [detail, setDetail] = useState<Assessment | null>(null);

  const filtered = useMemo(
    () =>
      list.filter(
        (a) =>
          (statusFilter === "전체" || a.status === statusFilter) &&
          (query.trim() === "" || a.name.includes(query.trim())),
      ),
    [list, statusFilter, query],
  );

  const toggleUnit = (unit: BusinessUnit) => {
    setDraft((prev) => ({
      ...prev,
      units: prev.units.includes(unit) ? prev.units.filter((u) => u !== unit) : [...prev.units, unit],
    }));
  };

  const createAssessment = () => {
    if (!draft.name.trim() || !draft.startDate || !draft.endDate || draft.units.length === 0) return;
    const next: Assessment = {
      id: `a${Date.now()}`,
      name: draft.name.trim(),
      description: draft.description.trim() || "설명이 등록되지 않았습니다.",
      status: "준비중",
      visibility: draft.visibility,
      startDate: draft.startDate,
      endDate: draft.endDate,
      targetUnits: draft.units,
      targetCount: 0,
      responseCount: 0,
      templateId: draft.templateId,
      createdAt: "2026-01-28",
      createdBy: "박서연",
    };
    setList((prev) => [next, ...prev]);
    setDraft(emptyDraft);
    setCreateOpen(false);
  };

  const duplicate = (assessment: Assessment) => {
    const copy: Assessment = {
      ...assessment,
      id: `a${Date.now()}`,
      name: `${assessment.name} (복제본)`,
      status: "준비중",
      responseCount: 0,
      createdAt: "2026-01-28",
    };
    setList((prev) => [copy, ...prev]);
  };

  const remove = (id: string) => {
    setList((prev) => prev.filter((a) => a.id !== id));
    setDetail(null);
  };

  const changeStatus = (id: string, status: AssessmentStatus) => {
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setDetail((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  return (
    <div className="gi-enter space-y-6">
      <PageHead
        eyebrow="진단 관리"
        title="진단 관리"
        desc="진단을 생성하고 기간, 대상, 공개 범위, 진행 상태를 관리합니다."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => setCreateOpen(true)}>
            진단 생성
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={statusFilter}
          onChange={setStatusFilter}
          items={STATUS_TABS.map((tab) => ({
            key: tab,
            label: tab,
            count: tab === "전체" ? list.length : list.filter((a) => a.status === tab).length,
          }))}
        />
        <div className="w-full sm:w-[260px]">
          <SearchInput value={query} onChange={setQuery} placeholder="진단명 검색" />
        </div>
      </div>

      <Card padded={false}>
        <div className="px-5 pt-5">
          <Table head={["진단명", "상태", "공개", "진행 기간", "대상", "참여율"]} minWidth={640}>
            {filtered.map((a) => (
              <Row key={a.id} onClick={() => setDetail(a)}>
                <Cell strong>{a.name}</Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                </Cell>
                <Cell muted>{a.visibility}</Cell>
                <Cell muted nowrap>
                  <span className="gi-mono">
                    {a.startDate} ~ {a.endDate}
                  </span>
                </Cell>
                <Cell muted>{a.targetUnits.join(", ")}</Cell>
                <Cell align="right" mono>
                  {a.targetCount === 0 ? "-" : `${Math.round((a.responseCount / a.targetCount) * 100)}%`}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
        <div className="px-5 pb-5" />
      </Card>

      <Drawer open={createOpen} title="진단 생성" subtitle="진단명과 진행 조건을 입력하세요" onClose={() => setCreateOpen(false)}>
        <div className="space-y-5">
          <Field label="진단명" required>
            <Input value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} placeholder="예: 2026년 상반기 정기 성인지감수성 진단" />
          </Field>
          <Field label="설명">
            <Textarea value={draft.description} onChange={(v) => setDraft((p) => ({ ...p, description: v }))} placeholder="진단 목적과 대상을 간단히 설명하세요" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="시작일" required>
              <Input type="date" value={draft.startDate} onChange={(v) => setDraft((p) => ({ ...p, startDate: v }))} />
            </Field>
            <Field label="종료일" required>
              <Input type="date" value={draft.endDate} onChange={(v) => setDraft((p) => ({ ...p, endDate: v }))} />
            </Field>
          </div>
          <Field label="문항 템플릿">
            <Select
              value={draft.templateId}
              options={QUESTION_TEMPLATES.map((t) => t.id)}
              onChange={(v) => setDraft((p) => ({ ...p, templateId: v }))}
            />
            <p className="mt-1.5 text-[12px] text-[var(--gi-mute)]">
              {QUESTION_TEMPLATES.find((t) => t.id === draft.templateId)?.name} /{" "}
              {QUESTION_TEMPLATES.find((t) => t.id === draft.templateId)?.questionCount}문항
            </p>
          </Field>
          <Field label="대상 조직" hint="산하 사업장 단위로 진단 대상 범위를 선택합니다" required>
            <div className="grid grid-cols-2 gap-2">
              {BUSINESS_UNITS.map((unit) => (
                <Checkbox key={unit} checked={draft.units.includes(unit)} onChange={() => toggleUnit(unit)} label={unit} />
              ))}
            </div>
          </Field>
          <Field label="공개 설정" hint="비공개로 설정하면 대상자 외에는 진단 존재 여부가 노출되지 않습니다">
            <Segmented
              value={draft.visibility}
              onChange={(v) => setDraft((p) => ({ ...p, visibility: v }))}
              items={[
                { key: "공개", label: "공개" },
                { key: "비공개", label: "비공개" },
              ]}
            />
          </Field>
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" full onClick={() => setCreateOpen(false)}>
            취소
          </Button>
          <Button full onClick={createAssessment}>
            생성하기
          </Button>
        </div>
      </Drawer>

      <Drawer
        open={detail !== null}
        title={detail?.name ?? ""}
        subtitle={detail ? `${detail.createdBy} 생성, ${detail.createdAt}` : undefined}
        onClose={() => setDetail(null)}
        footer={
          detail && (
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Copy size={14} />} onClick={() => duplicate(detail)}>
                복제
              </Button>
              <Button variant="danger" icon={<Trash size={14} />} onClick={() => remove(detail.id)}>
                삭제
              </Button>
            </div>
          )
        }
      >
        {detail && (
          <div className="space-y-5">
            <p className="text-[13px] leading-6 text-[var(--gi-body)]">{detail.description}</p>
            <Field label="진행 상태">
              <Segmented
                value={detail.status}
                onChange={(v) => changeStatus(detail.id, v)}
                items={[
                  { key: "준비중", label: "준비중" },
                  { key: "진행중", label: "진행중" },
                  { key: "종료", label: "종료" },
                ]}
              />
            </Field>
            <DefList
              items={[
                { label: "공개 범위", value: detail.visibility },
                { label: "진행 기간", value: <span className="gi-mono">{detail.startDate} ~ {detail.endDate}</span> },
                { label: "대상 조직", value: detail.targetUnits.join(", ") },
                { label: "문항 템플릿", value: QUESTION_TEMPLATES.find((t) => t.id === detail.templateId)?.name ?? "-" },
                { label: "대상 인원", value: `${detail.targetCount}명` },
                { label: "응답 인원", value: `${detail.responseCount}명` },
              ]}
              columns={1}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
