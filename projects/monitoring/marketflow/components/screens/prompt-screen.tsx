"use client";

import { useMemo, useState } from "react";
import { FloppyDisk, Plus } from "@phosphor-icons/react";
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
  SearchInput,
  Select,
  Table,
  Textarea,
  Timeline,
} from "@/projects/monitoring/marketflow/components/ui";
import { customers, promptTemplates as initial } from "@/projects/monitoring/marketflow/lib/mock-data";
import { CONTENT_TYPE_LABEL } from "@/projects/monitoring/marketflow/lib/navigation";
import type { ContentType, PromptTemplate } from "@/projects/monitoring/marketflow/lib/types";

const MODEL_OPTIONS = ["정밀 생성 모델 (고품질)", "빠른 응답 모델", "이미지 생성 모델", "아바타 영상 생성 모델"];
const TYPE_FILTERS: ("전체" | ContentType)[] = ["전체", "blog", "cardnews", "short"];

function emptyTemplate(): PromptTemplate {
  return {
    id: `pt-new-${Date.now()}`,
    name: "",
    contentType: "blog",
    model: MODEL_OPTIONS[0],
    systemPrompt: "",
    tone: "",
    temperature: 0.5,
    versions: [{ id: "v1", version: "v1", at: "2025-09-08", author: "박서연", changelog: "최초 작성" }],
    updatedAt: "2025-09-08",
  };
}

export function PromptScreen() {
  const [templates, setTemplates] = useState<PromptTemplate[]>(initial);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"전체" | ContentType>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorText, setEditorText] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState<PromptTemplate>(emptyTemplate());

  const filtered = useMemo(
    () =>
      templates.filter((t) => {
        if (search && !t.name.includes(search)) return false;
        if (typeFilter !== "전체" && t.contentType !== typeFilter) return false;
        return true;
      }),
    [templates, search, typeFilter],
  );

  const selected = templates.find((t) => t.id === selectedId);

  function open(t: PromptTemplate) {
    setSelectedId(t.id);
    setEditorText(t.systemPrompt);
  }

  function saveVersion() {
    if (!selected) return;
    const versionNum = selected.versions.length + 1;
    const version = { id: `pv-${selected.id}-${versionNum}`, version: `v${versionNum}`, at: "2025-09-08", author: "박서연", changelog: "프롬프트 본문 수정" };
    setTemplates((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, systemPrompt: editorText, versions: [version, ...t.versions], updatedAt: "2025-09-08" } : t)),
    );
  }

  function saveNewTemplate() {
    if (!draft.name.trim()) return;
    setTemplates((prev) => [{ ...draft }, ...prev]);
    setNewOpen(false);
    setDraft(emptyTemplate());
  }

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="PROMPT LIBRARY"
        title="AI 프롬프트 관리"
        desc="콘텐츠 유형, 브랜드별 프롬프트 템플릿을 관리하고, AI 모델을 선택하며, 변경 이력을 버전으로 추적합니다."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => setNewOpen(true)}>
            새 템플릿 만들기
          </Button>
        }
      />

      <Card padded={false} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <Field label="검색">
            <SearchInput value={search} onChange={setSearch} placeholder="템플릿 이름 검색" />
          </Field>
        </div>
        <div className="w-full sm:w-[180px]">
          <Field label="콘텐츠 유형">
            <Select
              value={typeFilter === "전체" ? "전체" : CONTENT_TYPE_LABEL[typeFilter]}
              options={["전체", ...TYPE_FILTERS.slice(1).map((t) => CONTENT_TYPE_LABEL[t as ContentType])]}
              onChange={(label) => {
                const found = (Object.keys(CONTENT_TYPE_LABEL) as ContentType[]).find((k) => CONTENT_TYPE_LABEL[k] === label);
                setTypeFilter(found ?? "전체");
              }}
            />
          </Field>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5">
          <Table head={["템플릿명", "유형", "브랜드", "AI 모델", "최근 수정"]} align={["left", "left", "left", "left", "right"]} minWidth={640}>
            {filtered.map((t) => {
              const brand = customers.find((c) => c.id === t.customerId);
              return (
                <Row key={t.id} onClick={() => open(t)}>
                  <Cell strong>{t.name}</Cell>
                  <Cell>
                    <Badge>{CONTENT_TYPE_LABEL[t.contentType]}</Badge>
                  </Cell>
                  <Cell muted>{brand ? brand.name : "공통"}</Cell>
                  <Cell muted>{t.model}</Cell>
                  <Cell align="right" mono muted>
                    {t.updatedAt}
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </div>
      </Card>

      <Drawer open={!!selected} title={selected?.name ?? ""} subtitle={selected ? CONTENT_TYPE_LABEL[selected.contentType] : undefined} onClose={() => setSelectedId(null)}>
        {selected && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="적용 브랜드">
                <Input value={customers.find((c) => c.id === selected.customerId)?.name ?? "공통 (전체 브랜드)"} onChange={() => undefined} />
              </Field>
              <Field label="AI 모델">
                <Select
                  value={selected.model}
                  options={MODEL_OPTIONS}
                  onChange={(v) => setTemplates((prev) => prev.map((t) => (t.id === selected.id ? { ...t, model: v } : t)))}
                />
              </Field>
            </div>

            <Field label="톤" hint="이 템플릿이 지향하는 어투">
              <Input value={selected.tone} onChange={(v) => setTemplates((prev) => prev.map((t) => (t.id === selected.id ? { ...t, tone: v } : t)))} />
            </Field>

            <Field label={`창의성 (temperature) | ${selected.temperature.toFixed(2)}`} hint="낮을수록 일관되고 보수적인 결과, 높을수록 다양하고 실험적인 결과">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={selected.temperature}
                onChange={(e) =>
                  setTemplates((prev) => prev.map((t) => (t.id === selected.id ? { ...t, temperature: Number(e.target.value) } : t)))
                }
                className="h-1.5 w-full accent-[var(--mf-primary)]"
              />
            </Field>

            <Field label="시스템 프롬프트">
              <Textarea value={editorText} onChange={setEditorText} rows={7} />
            </Field>
            <Button size="sm" icon={<FloppyDisk size={14} />} onClick={saveVersion}>
              새 버전으로 저장
            </Button>

            <div>
              <CardHead title="프롬프트 버전 이력" desc={`총 ${selected.versions.length}개 버전`} />
              <Timeline
                steps={selected.versions.map((v) => ({
                  label: `${v.version} | ${v.author}`,
                  at: v.at,
                  done: true,
                  note: v.changelog,
                }))}
              />
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={newOpen}
        title="새 프롬프트 템플릿"
        onClose={() => setNewOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setNewOpen(false)}>취소</Button>
            <Button onClick={saveNewTemplate}>템플릿 저장</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="템플릿 이름" required>
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="예: 블로그 - 캠페인 공지형" />
          </Field>
          <Field label="콘텐츠 유형">
            <Select
              value={CONTENT_TYPE_LABEL[draft.contentType]}
              options={(["blog", "cardnews", "short"] as ContentType[]).map((t) => CONTENT_TYPE_LABEL[t])}
              onChange={(label) => {
                const found = (Object.keys(CONTENT_TYPE_LABEL) as ContentType[]).find((k) => CONTENT_TYPE_LABEL[k] === label);
                if (found) setDraft((d) => ({ ...d, contentType: found }));
              }}
            />
          </Field>
          <Field label="적용 브랜드">
            <Select
              value={customers.find((c) => c.id === draft.customerId)?.name ?? "공통 (전체 브랜드)"}
              options={["공통 (전체 브랜드)", ...customers.map((c) => c.name)]}
              onChange={(name) => {
                const found = customers.find((c) => c.name === name);
                setDraft((d) => ({ ...d, customerId: found?.id }));
              }}
            />
          </Field>
          <Field label="AI 모델">
            <Select value={draft.model} options={MODEL_OPTIONS} onChange={(v) => setDraft((d) => ({ ...d, model: v }))} />
          </Field>
          <Field label="톤">
            <Input value={draft.tone} onChange={(v) => setDraft((d) => ({ ...d, tone: v }))} placeholder="예: 신뢰감 있고 담백한 정보 전달형" />
          </Field>
          <Field label="시스템 프롬프트">
            <Textarea value={draft.systemPrompt} onChange={(v) => setDraft((d) => ({ ...d, systemPrompt: v }))} rows={5} />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
