"use client";

import { useState } from "react";
import { ArrowLeft, DownloadSimple, Sparkle } from "@phosphor-icons/react";
import { Badge, Button, RankBars, ScoreScale } from "@/projects/b2b/genderinsight/components/ui";
import { ParticipantShell } from "@/projects/b2b/genderinsight/components/layout/participant-shell";
import { AREA_LABEL, PERSONAL_RESULT } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { ParticipantScreen } from "@/projects/b2b/genderinsight/lib/navigation";

export function ResultScreen({ onNavigate }: { onNavigate: (next: ParticipantScreen) => void }) {
  const [downloaded, setDownloaded] = useState(false);
  const result = PERSONAL_RESULT;

  const download = () => {
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  };

  return (
    <ParticipantShell>
      <div className="gi-enter">
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="flex items-center gap-1 text-[12.5px] text-[var(--gi-mute)]"
        >
          <ArrowLeft size={13} />
          로그인 화면으로
        </button>

        <p className="mt-4 gi-mono text-[12px] uppercase tracking-[0.08em] text-[var(--gi-mute)]">
          개인 결과 및 리포트
        </p>
        <h1 className="mt-2 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-[var(--gi-ink)]">
          {result.assessmentName}
        </h1>
        <p className="mt-1.5 text-[13px] text-[var(--gi-mute)]">
          {result.participantName}, {result.department} / {result.rank}, 제출일{" "}
          <span className="gi-mono">{result.submittedAt}</span>
        </p>

        <div className="mt-6 rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] text-[var(--gi-mute)]">종합 점수</p>
              <p className="mt-1 text-[36px] font-semibold leading-none tracking-[-0.04em] text-[var(--gi-ink)]">
                {result.overallScore.toFixed(1)}
                <span className="text-[16px] font-normal text-[var(--gi-mute)]"> / 5.0</span>
              </p>
            </div>
            <Badge tone="ink">전사 평균 이상</Badge>
          </div>
          <div className="mt-4">
            <ScoreScale score={result.overallScore} />
          </div>
        </div>

        <div className="mt-6 rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] p-6">
          <p className="text-[14px] font-semibold text-[var(--gi-ink)]">영역별 점수</p>
          <div className="mt-4">
            <RankBars
              data={[...result.areaScores]
                .sort((a, b) => b.score - a.score)
                .map((s) => ({
                  label: AREA_LABEL[s.areaId],
                  value: s.score,
                  caption: `${s.score.toFixed(1)} / 5.0`,
                }))}
            />
          </div>
        </div>

        <div className="mt-6 rounded-[8px] border border-[var(--gi-accent)] bg-[var(--gi-accent-soft)] p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--gi-accent)] text-white">
              <Sparkle size={16} weight="bold" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[var(--gi-accent-deep)]">AI 결과 요약</p>
              <p className="mt-2 text-[13.5px] leading-6 text-[var(--gi-ink)]">{result.aiSummary}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] p-6">
          <p className="text-[14px] font-semibold text-[var(--gi-ink)]">개인 맞춤 피드백</p>
          <ul className="mt-3 space-y-2.5">
            {result.feedback.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-6 text-[var(--gi-body)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--gi-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <Button full size="lg" icon={<DownloadSimple size={15} weight="bold" />} onClick={download}>
            개인 리포트 PDF 다운로드
          </Button>
          {downloaded && (
            <p className="gi-enter mt-3 rounded-[6px] border border-[var(--gi-info-soft)] bg-[var(--gi-info-soft)] px-3 py-2 text-center text-[12.5px] text-[var(--gi-info-deep)]">
              PDF 다운로드를 시작했습니다.
            </p>
          )}
        </div>
      </div>
    </ParticipantShell>
  );
}
