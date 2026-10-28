"use client";

import type { ReactNode } from "react";
import { ArrowClockwise, ChatCircleText, CheckCircle, Circle, PaperPlaneTilt, PencilSimple, Play } from "@phosphor-icons/react";
import { Button, StatusBadge, Thumb } from "@/projects/platform/eduon/components/console/console-ui";
import type { Course, Quality } from "@/projects/platform/eduon/lib/types";
import { Bar } from "@/projects/platform/eduon/components/studio/upload-panel";
import {
  FAIL_REASON,
  PUBLISH_TONE,
  QUALITIES,
  REVIEW_TONE,
  TRANSCODE_TONE,
  transcodeOverall,
  type Check,
  type TranscodeState,
  type UploadState,
} from "@/projects/platform/eduon/components/studio/studio-model";

/*
 * 변환본 미리보기 프레임. picsum 고정 id, 직접 열어 확인했다.
 * 250 피아노 건반 위에 놓인 빈티지 레인지파인더 카메라 클로즈업 → AI 광고 영상 1강의 제품 컷.
 * 포스터(355, 진열된 빈티지 카메라 여러 대)와 다른 사진이라 한 화면 중복이 없다.
 */
const PREVIEW_PHOTO = 250;

const SPEC: Record<Quality, string> = {
  "1080p": "1920x1080 | 6.2 Mbps",
  "720p": "1280x720 | 3.4 Mbps",
  "480p": "854x480 | 1.6 Mbps",
};

function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--eo-line)] py-5 xl:px-5">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-[13px] font-semibold text-[var(--eo-ink)]">{title}</h3>
        {aside && <div className="ml-auto flex items-center gap-2">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

export function StatusPanel({
  view,
  upload,
  transcode,
  checks,
  editing,
  canEdit,
  onRetry,
  onSubmit,
  onEdit,
  onResubmit,
  onPreview,
}: {
  view: Course;
  upload: UploadState;
  transcode: TranscodeState;
  checks: Check[];
  editing: boolean;
  /** c13처럼 이 강사가 고칠 수 있는 강좌인지 */
  canEdit: boolean;
  onRetry: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  onResubmit: () => void;
  onPreview: () => void;
}) {
  const overall = transcodeOverall(transcode);
  const doneCount = checks.filter((c) => c.ok).length;
  const allOk = doneCount === checks.length;
  const submitted = view.review !== "작성 중";
  const lastRevision = [...view.reviewLog].reverse().find((l) => l.action === "보완 요청");
  const note = view.revisionNote ?? lastRevision?.note;
  const previewReady = transcode.outputs["720p"] === "완료" || transcode.outputs["480p"] === "완료";

  return (
    <div>
      <div className="flex items-center gap-2 pb-4 pt-5 xl:px-5">
        <h2 className="text-[15px] font-semibold leading-[22px] text-[var(--eo-ink)]">처리 현황</h2>
      </div>

      <Section title="검수" aside={<span className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">제출본 v{view.version}</span>}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={REVIEW_TONE[view.review]}>{view.review}</StatusBadge>
          <StatusBadge tone={PUBLISH_TONE[view.publish]}>{view.publish}</StatusBadge>
          <span className="ml-auto whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">
            {submitted ? `제출 ${view.submittedAt}` : "미제출"}
          </span>
        </div>

        {view.review === "보완 요청" && note && (
          <div className="mt-4 rounded-[8px] border-l-2 border-[var(--eo-orange)] bg-[var(--eo-soft)] px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--eo-ink-3)]">
              <ChatCircleText size={14} className="shrink-0 text-[var(--eo-orange)]" />
              <span className="font-medium text-[var(--eo-ink-2)]">{lastRevision?.who ?? "운영자"}</span>
              <span className="ml-auto whitespace-nowrap tabular-nums">{lastRevision?.at}</span>
            </div>
            <p className="eo-text-pretty mt-1.5 text-[13px] leading-[20px] text-[var(--eo-ink)]">{note}</p>
            {canEdit && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" icon={<PencilSimple size={14} />} disabled={editing} onClick={onEdit}>
                  수정
                </Button>
                <Button size="sm" variant="primary" icon={<PaperPlaneTilt size={14} />} disabled={!editing || !allOk} onClick={onResubmit}>
                  재제출
                </Button>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section title="화질 변환" aside={<StatusBadge tone={TRANSCODE_TONE[overall]}>{overall}</StatusBadge>}>
        {upload.status !== "done" ? (
          <div className="text-[12px] text-[var(--eo-ink-3)]">업로드 완료 후 시작</div>
        ) : null}
        <ul className={upload.status !== "done" ? "mt-2" : ""}>
          {QUALITIES.map((q) => {
            const s = transcode.outputs[q];
            return (
              <li key={q} className="border-b border-[var(--eo-line)] py-2.5 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold tabular-nums text-[var(--eo-ink)]">{q}</div>
                    <div className="truncate text-[12px] tabular-nums text-[var(--eo-ink-3)]">{SPEC[q]}</div>
                  </div>
                  {s === "변환 중" && (
                    <span className="w-9 shrink-0 text-right text-[12px] font-medium tabular-nums text-[var(--eo-blue-fg)]">{Math.floor(transcode.pct[q])}%</span>
                  )}
                  <StatusBadge tone={TRANSCODE_TONE[s]}>{s}</StatusBadge>
                </div>
                {s === "변환 중" && (
                  <div className="mt-2">
                    <Bar value={transcode.pct[q]} tone="blue" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {overall === "실패" && transcode.error && (
          <div className="mt-3 rounded-[8px] bg-[var(--eo-red-bg)] px-3.5 py-3">
            <div className="flex items-center gap-2">
              <span className="eo-mono text-[var(--eo-red-fg)]">{transcode.error}</span>
              <span className="ml-auto whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-red-fg)]">20:06</span>
            </div>
            <p className="mt-1 text-[13px] text-[var(--eo-ink)]">{FAIL_REASON}</p>
            {canEdit && (
              <Button size="sm" variant="danger" className="mt-3" icon={<ArrowClockwise size={14} />} onClick={onRetry}>
                재처리
              </Button>
            )}
          </div>
        )}
        {transcode.retries > 0 && (
          <div className="mt-2 text-[12px] tabular-nums text-[var(--eo-ink-3)]">재처리 {transcode.retries}회 | 1080p만 다시 변환</div>
        )}
      </Section>

      <Section title="변환본 미리보기" aside={previewReady ? <span className="text-[12px] text-[var(--eo-ink-3)]">720p | 14:26</span> : undefined}>
        {previewReady ? (
          <button
            type="button"
            onClick={onPreview}
            aria-label="변환본 미리보기 재생"
            className="group relative block w-full overflow-hidden rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--eo-blue)]"
          >
            <Thumb photo={PREVIEW_PHOTO} title="1강 미리보기" className="w-full rounded-[8px]" />
            <span className="absolute inset-0 bg-[rgba(20,24,32,0.18)] transition-colors group-hover:bg-[rgba(20,24,32,0.3)]" />
            <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--eo-ink)]">
              <Play size={18} weight="fill" />
            </span>
            <span className="absolute bottom-2 right-2 rounded-[4px] bg-[rgba(20,24,32,0.72)] px-1.5 text-[11px] font-medium tabular-nums leading-[18px] text-white">14:26</span>
          </button>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-[8px] bg-[var(--eo-soft)] text-[12px] text-[var(--eo-ink-3)]">변환 완료 전</div>
        )}
      </Section>

      <Section
        title="필수 입력 점검"
        aside={
          <span className="text-[12px] font-medium tabular-nums text-[var(--eo-ink-2)]">
            {doneCount} / {checks.length}
          </span>
        }
      >
        <ul className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-2 xl:grid-cols-1">
          {checks.map((c) => (
            <li key={c.key} className="flex items-center gap-2 text-[13px]">
              {c.ok ? (
                <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--eo-green)]" />
              ) : (
                <Circle size={16} className="shrink-0 text-[var(--eo-line-2)]" />
              )}
              <span className={c.ok ? "text-[var(--eo-ink)]" : "text-[var(--eo-ink-3)]"}>{c.label}</span>
            </li>
          ))}
        </ul>
        {canEdit && view.review === "작성 중" && (
          <Button variant="primary" className="mt-4 w-full" icon={<PaperPlaneTilt size={14} />} disabled={!allOk} onClick={onSubmit}>
            검수 제출
          </Button>
        )}
        {view.review === "검수 대기" && (
          <div className="mt-4 flex h-9 items-center justify-center rounded-[8px] bg-[var(--eo-soft)] text-[13px] font-medium text-[var(--eo-ink-2)]">
            운영자 검수를 기다리고 있어요
          </div>
        )}
      </Section>

      <Section title="검토 이력">
        {view.reviewLog.length === 0 ? (
          <div className="text-[12px] text-[var(--eo-ink-3)]">제출 이력이 없어요</div>
        ) : (
          <ol className="relative">
            {[...view.reviewLog].reverse().map((l, i, arr) => (
              <li key={`${l.at}-${l.action}`} className="relative flex gap-3 pb-4 last:pb-0">
                {i < arr.length - 1 && <span className="absolute left-[3.5px] top-3 h-full w-px bg-[var(--eo-line)]" />}
                <span
                  className={`relative mt-[6px] h-2 w-2 shrink-0 rounded-full ${
                    l.action === "보완 요청" ? "bg-[var(--eo-orange)]" : l.action.startsWith("승인") ? "bg-[var(--eo-green)]" : l.action === "게시 중단" ? "bg-[var(--eo-red)]" : "bg-[var(--eo-gray)]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-semibold text-[var(--eo-ink)]">{l.action}</span>
                    <span className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">v{l.version}</span>
                    <span className="ml-auto whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">{l.at}</span>
                  </div>
                  <div className="text-[12px] text-[var(--eo-ink-3)]">{l.who}</div>
                  {l.note && <p className="eo-text-pretty mt-1 text-[12px] leading-[18px] text-[var(--eo-ink-2)]">{l.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </div>
  );
}
