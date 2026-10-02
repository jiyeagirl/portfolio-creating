"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, FloppyDisk, PaperPlaneTilt } from "@phosphor-icons/react";
import { Button } from "@/projects/b2b/genderinsight/components/ui";
import { ParticipantShell } from "@/projects/b2b/genderinsight/components/layout/participant-shell";
import { AREA_LABEL, SURVEY_FLOW_QUESTIONS } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { ParticipantScreen } from "@/projects/b2b/genderinsight/lib/navigation";

const SCALE_POINTS = [1, 2, 3, 4, 5];

export function SurveyScreen({ onNavigate }: { onNavigate: (next: ParticipantScreen) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string | null>>({});
  const [error, setError] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  const total = SURVEY_FLOW_QUESTIONS.length;
  const question = SURVEY_FLOW_QUESTIONS[index];
  const progress = Math.round(((index + 1) / total) * 100);
  const answer = answers[question.id] ?? null;

  const setAnswer = (value: number | string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setError("");
  };

  const goNext = () => {
    if (question.required && (answer === null || answer === "")) {
      setError("필수 문항입니다. 응답을 선택해주세요.");
      return;
    }
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setError("");
    } else {
      submit();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setError("");
    }
  };

  const saveDraft = () => {
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 2200);
  };

  const submit = () => {
    const missingIndex = SURVEY_FLOW_QUESTIONS.findIndex(
      (q) => q.required && (answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === ""),
    );
    if (missingIndex !== -1) {
      setIndex(missingIndex);
      setError("아직 응답하지 않은 필수 문항이 있습니다.");
      return;
    }
    onNavigate("complete");
  };

  return (
    <ParticipantShell progress={progress}>
      <div className="gi-enter" key={question.id}>
        <div className="flex items-center justify-between">
          <p className="gi-mono text-[12px] uppercase tracking-[0.08em] text-[var(--gi-mute)]">
            {AREA_LABEL[question.areaId]}
          </p>
          <p className="gi-mono text-[12px] text-[var(--gi-mute)]">
            문항 {index + 1} / {total}
          </p>
        </div>

        <h1 className="mt-3 text-[20px] font-semibold leading-8 tracking-[-0.02em] text-[var(--gi-ink)]">
          {question.prompt}
          {question.required && <span className="ml-1.5 text-[var(--gi-danger)]">*</span>}
        </h1>

        <div className="mt-8">
          {question.type === "scale" ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                {SCALE_POINTS.map((point) => (
                  <button
                    key={point}
                    type="button"
                    onClick={() => setAnswer(point)}
                    aria-pressed={answer === point}
                    className={`flex h-14 flex-1 items-center justify-center rounded-[8px] border text-[15px] font-semibold transition-colors ${
                      answer === point
                        ? "border-[var(--gi-accent)] bg-[var(--gi-accent)] text-white"
                        : "border-[var(--gi-hairline)] text-[var(--gi-ink)] hover:bg-[var(--gi-soft)]"
                    }`}
                  >
                    {point}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--gi-mute)]">
                <span>{question.scaleLabels?.[0]}</span>
                <span>{question.scaleLabels?.[1]}</span>
              </div>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {question.choices?.map((choice) => (
                <li key={choice}>
                  <button
                    type="button"
                    onClick={() => setAnswer(choice)}
                    aria-pressed={answer === choice}
                    className={`flex w-full items-center justify-between gap-3 rounded-[8px] border px-4 py-3.5 text-left text-[14px] transition-colors ${
                      answer === choice
                        ? "border-[var(--gi-accent)] bg-[var(--gi-accent-soft)] text-[var(--gi-accent-deep)]"
                        : "border-[var(--gi-hairline)] text-[var(--gi-ink)] hover:bg-[var(--gi-soft)]"
                    }`}
                  >
                    {choice}
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        answer === choice ? "border-[var(--gi-accent)]" : "border-[var(--gi-hairline-strong)]"
                      }`}
                    >
                      {answer === choice && <span className="h-1.5 w-1.5 rounded-full bg-[var(--gi-accent)]" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="mt-4 text-[12.5px] text-[var(--gi-danger-deep)]">{error}</p>}

        {savedToast && (
          <p className="mt-4 rounded-[6px] border border-[var(--gi-info-soft)] bg-[var(--gi-info-soft)] px-3 py-2 text-[12.5px] text-[var(--gi-info-deep)]">
            임시 저장되었습니다. 나중에 이어서 응답할 수 있습니다.
          </p>
        )}

        <div className="mt-9 flex items-center gap-2">
          <Button variant="secondary" icon={<ArrowLeft size={14} />} disabled={index === 0} onClick={goPrev}>
            이전
          </Button>
          <Button variant="ghost" icon={<FloppyDisk size={14} />} onClick={saveDraft}>
            임시 저장
          </Button>
          <div className="ml-auto">
            {index < total - 1 ? (
              <Button icon={<ArrowRight size={14} weight="bold" />} onClick={goNext}>
                다음
              </Button>
            ) : (
              <Button icon={<PaperPlaneTilt size={14} weight="bold" />} onClick={goNext}>
                제출하기
              </Button>
            )}
          </div>
        </div>
      </div>
    </ParticipantShell>
  );
}
