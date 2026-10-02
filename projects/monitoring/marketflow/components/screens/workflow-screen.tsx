"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Database,
  MagicWand,
  PaperPlaneTilt,
  Plus,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Drawer,
  Field,
  Input,
  PageHead,
  Select,
  Toggle,
} from "@/projects/monitoring/marketflow/components/ui";
import { workflows as initialWorkflows } from "@/projects/monitoring/marketflow/lib/mock-data";
import type { Workflow, WorkflowStep, WorkflowStepType } from "@/projects/monitoring/marketflow/lib/types";

const STEP_ICON: Record<WorkflowStepType, React.ComponentType<{ size?: number; weight?: "bold" }>> = {
  collect: Database,
  generate: MagicWand,
  approve: CheckCircle,
  publish: PaperPlaneTilt,
  notify: Bell,
};

const STEP_LABEL: Record<WorkflowStepType, string> = {
  collect: "데이터 수집",
  generate: "AI 생성",
  approve: "승인",
  publish: "발행",
  notify: "알림",
};

const STEP_TYPES: WorkflowStepType[] = ["collect", "generate", "approve", "publish", "notify"];
const TRIGGER_OPTIONS = ["RSS 수집 (30분마다)", "일정 예약 (매일 09:00)", "API 웹훅 (이벤트 발생 시)", "이벤트 (발행 후 24시간)"];

function StepChain({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => {
        const Icon = STEP_ICON[step.type];
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-[8px] border border-[var(--mf-hairline)] bg-[var(--mf-soft)] px-3 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--mf-primary-soft)] text-[var(--mf-primary-active)]">
                <Icon size={14} weight="bold" />
              </span>
              <div>
                <p className="text-[12.5px] font-medium leading-4 text-[var(--mf-ink)]">{step.label}</p>
                <p className="max-w-[180px] truncate text-[11px] leading-4 text-[var(--mf-mute)]">{step.detail}</p>
              </div>
            </div>
            {index < steps.length - 1 && <ArrowRight size={13} className="shrink-0 text-[var(--mf-mute)]" />}
          </div>
        );
      })}
    </div>
  );
}

function emptyWorkflow(): Workflow {
  return {
    id: `wf-new-${Date.now()}`,
    name: "",
    description: "",
    status: "paused",
    trigger: TRIGGER_OPTIONS[0],
    steps: [],
    successRate: 0,
    lastRunAt: "-",
    runsToday: 0,
    history: [],
  };
}

export function WorkflowScreen() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [draft, setDraft] = useState<Workflow>(emptyWorkflow());
  const [stepType, setStepType] = useState<WorkflowStepType>("collect");
  const [stepLabel, setStepLabel] = useState("");
  const [stepDetail, setStepDetail] = useState("");

  const selected = workflows.find((w) => w.id === selectedId);

  function toggleStatus(id: string) {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w)),
    );
  }

  function addStepToDraft() {
    if (!stepLabel.trim()) return;
    setDraft((d) => ({
      ...d,
      steps: [...d.steps, { id: `s-${d.steps.length + 1}-${Date.now()}`, type: stepType, label: stepLabel, detail: stepDetail || STEP_LABEL[stepType] }],
    }));
    setStepLabel("");
    setStepDetail("");
  }

  function removeStep(id: string) {
    setDraft((d) => ({ ...d, steps: d.steps.filter((s) => s.id !== id) }));
  }

  function saveDraft() {
    if (!draft.name.trim() || draft.steps.length === 0) return;
    setWorkflows((prev) => [{ ...draft, status: "paused" }, ...prev]);
    setBuilderOpen(false);
    setDraft(emptyWorkflow());
  }

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="AUTOMATION"
        title="자동화 워크플로우"
        desc="데이터 수집부터 AI 생성, 승인, 발행까지 이어지는 파이프라인을 노코드로 구성하고 실행 이력을 확인합니다."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => setBuilderOpen(true)}>
            새 워크플로우 만들기
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {workflows.map((wf) => (
          <Card key={wf.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[var(--mf-ink)]">{wf.name}</h3>
                  <Badge tone={wf.status === "active" ? "ink" : wf.status === "error" ? "danger" : "neutral"} dot={wf.status === "active"}>
                    {wf.status === "active" ? "실행중" : wf.status === "error" ? "오류" : "일시중지"}
                  </Badge>
                </div>
                <p className="mt-1 max-w-[62ch] text-[13px] leading-5 text-[var(--mf-body)]">{wf.description}</p>
                <p className="mt-1.5 text-[12px] text-[var(--mf-mute)]">트리거: {wf.trigger}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <div className="text-right">
                  <p className="mf-mono text-[13px] font-medium text-[var(--mf-ink)]">{wf.successRate}%</p>
                  <p className="text-[11px] text-[var(--mf-mute)]">성공률</p>
                </div>
                <Toggle on={wf.status === "active"} onChange={() => toggleStatus(wf.id)} label={`${wf.name} 활성화`} />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto pb-1">
              <StepChain steps={wf.steps} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--mf-hairline)] pt-4">
              <p className="text-[12px] text-[var(--mf-mute)]">
                오늘 {wf.runsToday}회 실행 | 마지막 실행 {wf.lastRunAt === "-" ? "없음" : wf.lastRunAt.slice(0, 16).replace("T", " ")}
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(wf.id)}
                className="text-[12.5px] font-medium text-[var(--mf-primary)] hover:underline"
              >
                실행 이력 보기
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Drawer open={!!selected} title={selected?.name ?? ""} subtitle={selected?.trigger} onClose={() => setSelectedId(null)}>
        {selected && (
          <div className="flex flex-col gap-6">
            <div className="overflow-x-auto pb-1">
              <StepChain steps={selected.steps} />
            </div>

            <Card soft>
              <CardHead title="요약" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[18px] font-semibold text-[var(--mf-ink)]">{selected.successRate}%</p>
                  <p className="text-[11.5px] text-[var(--mf-mute)]">성공률</p>
                </div>
                <div>
                  <p className="text-[18px] font-semibold text-[var(--mf-ink)]">{selected.runsToday}</p>
                  <p className="text-[11.5px] text-[var(--mf-mute)]">오늘 실행</p>
                </div>
                <div>
                  <p className="text-[18px] font-semibold text-[var(--mf-ink)]">{selected.history.length}</p>
                  <p className="text-[11.5px] text-[var(--mf-mute)]">최근 기록</p>
                </div>
              </div>
            </Card>

            <div>
              <CardHead title="실행 이력 / 오류 로그" />
              <ul className="flex flex-col gap-2">
                {selected.history.map((run) => (
                  <li
                    key={run.id}
                    className={`flex items-start gap-3 rounded-[8px] border p-3 ${
                      run.status === "failed" ? "border-[var(--mf-danger-soft)] bg-[var(--mf-danger-soft)]" : "border-[var(--mf-hairline)]"
                    }`}
                  >
                    {run.status === "failed" ? (
                      <WarningCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--mf-danger-deep)]" />
                    ) : (
                      <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--mf-primary-active)]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className={`mf-mono text-[12px] ${run.status === "failed" ? "text-[var(--mf-danger-deep)]" : "text-[var(--mf-mute)]"}`}>
                          {run.at.slice(0, 16).replace("T", " ")}
                        </p>
                        <span className="mf-mono text-[11px] text-[var(--mf-mute)]">{run.duration}</span>
                      </div>
                      <p className={`mt-1 text-[13px] leading-5 ${run.status === "failed" ? "text-[var(--mf-danger-deep)]" : "text-[var(--mf-body)]"}`}>
                        {run.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={builderOpen}
        title="새 워크플로우 만들기"
        subtitle="트리거를 정하고 단계를 순서대로 추가하세요"
        onClose={() => setBuilderOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setBuilderOpen(false)}>취소</Button>
            <Button onClick={saveDraft} disabled={!draft.name.trim() || draft.steps.length === 0}>워크플로우 저장</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <Field label="워크플로우 이름" required>
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="예: 뷰티 신제품 카드뉴스 자동화" />
          </Field>
          <Field label="설명">
            <Input value={draft.description} onChange={(v) => setDraft((d) => ({ ...d, description: v }))} placeholder="이 워크플로우가 하는 일을 한 문장으로" />
          </Field>
          <Field label="트리거">
            <Select value={draft.trigger} options={TRIGGER_OPTIONS} onChange={(v) => setDraft((d) => ({ ...d, trigger: v }))} />
          </Field>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--mf-ink)]">단계 구성</p>
            {draft.steps.length === 0 ? (
              <p className="rounded-[8px] border border-dashed border-[var(--mf-hairline-strong)] px-4 py-6 text-center text-[12.5px] text-[var(--mf-mute)]">
                아직 추가된 단계가 없습니다
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {draft.steps.map((step) => {
                  const Icon = STEP_ICON[step.type];
                  return (
                    <li key={step.id} className="flex items-center gap-3 rounded-[8px] border border-[var(--mf-hairline)] p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--mf-primary-soft)] text-[var(--mf-primary-active)]">
                        <Icon size={15} weight="bold" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[var(--mf-ink)]">{step.label}</p>
                        <p className="truncate text-[11.5px] text-[var(--mf-mute)]">{step.detail}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="단계 삭제"
                        onClick={() => removeStep(step.id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[var(--mf-mute)] hover:bg-[var(--mf-soft)]"
                      >
                        <X size={13} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Card soft>
            <p className="mb-3 text-[12.5px] font-medium text-[var(--mf-ink)]">단계 추가</p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {STEP_TYPES.map((type) => {
                  const Icon = STEP_ICON[type];
                  const active = stepType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setStepType(type)}
                      aria-pressed={active}
                      className={`flex h-9 w-9 items-center justify-center rounded-[6px] border transition-colors ${
                        active ? "border-[var(--mf-primary)] bg-[var(--mf-primary)] text-white" : "border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]"
                      }`}
                      aria-label={STEP_LABEL[type]}
                      title={STEP_LABEL[type]}
                    >
                      <Icon size={15} weight="bold" />
                    </button>
                  );
                })}
              </div>
              <Input value={stepLabel} onChange={setStepLabel} placeholder={`${STEP_LABEL[stepType]} 단계 이름`} />
              <Input value={stepDetail} onChange={setStepDetail} placeholder="세부 설정 (예: RSS 키워드 3개)" />
              <Button variant="secondary" size="sm" icon={<Plus size={13} weight="bold" />} onClick={addStepToDraft}>
                단계 추가
              </Button>
            </div>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}
