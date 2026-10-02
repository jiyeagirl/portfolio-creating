"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, FloppyDisk } from "@phosphor-icons/react";
import {
  Badge,
  Card,
  CardHead,
  Drawer,
  PageHead,
  Segmented,
  Toggle,
} from "@/projects/b2b/genderinsight/components/ui";
import { QUESTIONS, QUESTION_AREAS, QUESTION_TEMPLATES } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { Question, QuestionAreaId } from "@/projects/b2b/genderinsight/lib/types";

export function AdminQuestions() {
  const [bank, setBank] = useState<Question[]>(QUESTIONS);
  const [areaId, setAreaId] = useState<QuestionAreaId>(QUESTION_AREAS[0].id);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const questionsInArea = useMemo(
    () => bank.filter((q) => q.areaId === areaId).sort((a, b) => a.order - b.order),
    [bank, areaId],
  );

  const move = (question: Question, direction: -1 | 1) => {
    setBank((prev) => {
      const inArea = prev.filter((q) => q.areaId === question.areaId).sort((a, b) => a.order - b.order);
      const index = inArea.findIndex((q) => q.id === question.id);
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= inArea.length) return prev;
      const a = inArea[index];
      const b = inArea[targetIndex];
      return prev.map((q) => {
        if (q.id === a.id) return { ...q, order: b.order };
        if (q.id === b.id) return { ...q, order: a.order };
        return q;
      });
    });
  };

  const toggleRequired = (id: string) => {
    setBank((prev) => prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q)));
  };

  const previewTemplate = QUESTION_TEMPLATES.find((t) => t.id === previewTemplateId);

  return (
    <div className="gi-enter space-y-8">
      <PageHead eyebrow="진단 문항 관리" title="문항 관리" desc="영역별 문항 구성과 문항 템플릿을 관리합니다." />

      <div>
        <CardHead title="문항 템플릿" desc="진단 생성 시 선택할 수 있는 문항 세트입니다" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUESTION_TEMPLATES.map((template) => (
            <Card key={template.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-semibold tracking-[-0.01em] text-[var(--gi-ink)]">
                  {template.name}
                </p>
                <Badge tone="neutral">{template.questionCount}문항</Badge>
              </div>
              <p className="mt-2 text-[12.5px] leading-5 text-[var(--gi-mute)]">{template.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--gi-hairline)] pt-3">
                <p className="text-[11.5px] text-[var(--gi-mute)]">
                  진단 {template.usedByAssessments}건에 사용중, {template.updatedAt} 수정
                </p>
                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(template.id)}
                  className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--gi-accent-deep)]"
                >
                  <Eye size={13} />
                  미리보기
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-0">
          <CardHead title="영역별 문항 구성" desc="문항 순서를 바꾸고 필수 여부를 설정하세요" />
        </div>
        <div className="px-5">
          <Segmented
            value={areaId}
            onChange={setAreaId}
            items={QUESTION_AREAS.map((area) => ({ key: area.id, label: area.label }))}
          />
        </div>
        <ul className="mt-2 px-5 pb-5">
          {questionsInArea.map((q, index) => (
            <li key={q.id} className="flex items-start gap-3 border-b border-[var(--gi-hairline)] py-4 last:border-b-0">
              <span className="gi-mono mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--gi-soft-2)] text-[11px] text-[var(--gi-mute)]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] leading-5 text-[var(--gi-ink)]">{q.prompt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={q.type === "scale" ? "info" : "neutral"}>
                    {q.type === "scale" ? "척도형 (5점)" : "객관식"}
                  </Badge>
                  {q.type === "choice" && (
                    <span className="text-[11.5px] text-[var(--gi-mute)]">보기 {q.choices?.length}개</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-1.5 text-[12px] text-[var(--gi-body)]">
                  필수
                  <Toggle on={q.required} onChange={() => toggleRequired(q.id)} label={`${q.prompt} 필수 여부`} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    aria-label="위로 이동"
                    disabled={index === 0}
                    onClick={() => move(q, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-[var(--gi-hairline)] text-[var(--gi-body)] disabled:opacity-30"
                  >
                    <ArrowUp size={11} />
                  </button>
                  <button
                    type="button"
                    aria-label="아래로 이동"
                    disabled={index === questionsInArea.length - 1}
                    onClick={() => move(q, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-[var(--gi-hairline)] text-[var(--gi-body)] disabled:opacity-30"
                  >
                    <ArrowDown size={11} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Drawer
        open={previewTemplate !== undefined}
        title={previewTemplate ? `${previewTemplate.name} 미리보기` : ""}
        subtitle={previewTemplate ? `${previewTemplate.questionCount}문항 / 5개 영역` : undefined}
        onClose={() => setPreviewTemplateId(null)}
        footer={
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--gi-accent-deep)]"
          >
            <FloppyDisk size={14} />
            새 템플릿으로 저장
          </button>
        }
      >
        {previewTemplate && (
          <div className="space-y-6">
            {QUESTION_AREAS.filter((area) => previewTemplate.areaIds.includes(area.id)).map((area) => (
              <div key={area.id}>
                <p className="text-[13px] font-semibold text-[var(--gi-ink)]">{area.label}</p>
                <ol className="mt-2 space-y-2">
                  {bank
                    .filter((q) => q.areaId === area.id)
                    .sort((a, b) => a.order - b.order)
                    .slice(0, previewTemplate.id === "t2" ? 2 : undefined)
                    .map((q) => (
                      <li key={q.id} className="rounded-[6px] border border-[var(--gi-hairline)] px-3 py-2.5">
                        <p className="text-[13px] leading-5 text-[var(--gi-body)]">{q.prompt}</p>
                        {q.required && (
                          <span className="mt-1 inline-block text-[11px] text-[var(--gi-danger-deep)]">필수 문항</span>
                        )}
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
