"use client";

import { useEffect, useState } from "react";
import { FloppyDisk, LockSimple } from "@phosphor-icons/react";
import { Button, Modal, type Tone } from "@/projects/platform/eduon/components/console/console-ui";
import { SAMPLE_CLIP, photoUrl } from "@/projects/platform/eduon/lib/mock-data";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { Course } from "@/projects/platform/eduon/lib/types";
import { CourseForm } from "@/projects/platform/eduon/components/studio/course-form";
import { StatusPanel } from "@/projects/platform/eduon/components/studio/status-panel";
import { SPEED_MB, TICK_MS, UploadPanel } from "@/projects/platform/eduon/components/studio/upload-panel";
import {
  QUALITIES,
  checklist,
  draftFrom,
  initialFor,
  transcodeOverall,
  type Draft,
  type Mode,
  type TranscodeState,
  type UploadState,
} from "@/projects/platform/eduon/components/studio/studio-model";

/** 변환 진행 한 틱(250ms) 증가량. 화질 하나에 약 8초 */
const TRANSCODE_STEP = 3.2;
/** 업로드 완료 뒤 변환 대기열에서 시작까지 */
const QUEUE_MS = 1400;

function ep1Status(upload: UploadState, t: TranscodeState): { label: string; tone: Tone } {
  if (upload.status === "idle") return { label: "영상 없음", tone: "gray" };
  if (upload.status === "uploading") return { label: "업로드 중", tone: "blue" };
  if (upload.status === "paused") return { label: "중단", tone: "gray" };
  const o = transcodeOverall(t);
  if (o === "완료") return { label: "완료", tone: "green" };
  if (o === "실패") return { label: "변환 실패", tone: "red" };
  if (o === "변환 중") return { label: "변환 중", tone: "blue" };
  return { label: "변환 대기", tone: "gray" };
}

export function StudioScreen({ course, mode, toast }: { course: Course; mode: Mode; toast: (msg: string) => void }) {
  const store = useStore();
  const [init] = useState(() => initialFor(mode, course));
  const [upload, setUpload] = useState<UploadState>(init.upload);
  const [transcode, setTranscode] = useState<TranscodeState>(init.transcode);
  const [override, setOverride] = useState<Partial<Course> | null>(init.override);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);

  const view: Course = override ? { ...course, ...override } : course;
  const [draft, setDraftState] = useState<Draft>(() => draftFrom(view));
  const setDraft = (fn: (d: Draft) => Draft) => setDraftState(fn);

  const canEdit = course.instructor === "한지오" && course.publish === "비공개" && course.review !== "승인";
  const readOnly =
    !canEdit || view.review === "검수 대기" || view.review === "승인" || view.review === "반려" || (view.review === "보완 요청" && !editing);

  /* 업로드 진행: 선형, 250ms 틱 */
  useEffect(() => {
    if (upload.status !== "uploading") return;
    const id = window.setInterval(() => {
      setUpload((u) => {
        if (u.status !== "uploading") return u;
        const pct = u.pct + ((SPEED_MB * TICK_MS) / 1000 / u.sizeMb) * 100;
        return pct >= 100 ? { ...u, pct: 100, status: "done" } : { ...u, pct };
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [upload.status]);

  /* 변환 대기열: 업로드가 끝나면 대기 → 변환 중을 한 화질씩 */
  const active = QUALITIES.find((q) => transcode.outputs[q] === "변환 중");
  const next = QUALITIES.find((q) => transcode.outputs[q] === "대기");
  const failed = transcodeOverall(transcode) === "실패";
  useEffect(() => {
    if (upload.status !== "done" || active || !next || failed) return;
    const id = window.setTimeout(() => {
      setTranscode((t) => ({ ...t, outputs: { ...t.outputs, [next]: "변환 중" }, pct: { ...t.pct, [next]: 0 } }));
    }, QUEUE_MS);
    return () => window.clearTimeout(id);
  }, [upload.status, active, next, failed]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setTranscode((t) => {
        if (t.outputs[active] !== "변환 중") return t;
        const p = t.pct[active] + TRANSCODE_STEP;
        return p >= 100
          ? { ...t, outputs: { ...t.outputs, [active]: "완료" }, pct: { ...t.pct, [active]: 100 } }
          : { ...t, pct: { ...t.pct, [active]: p } };
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [active]);

  const checks = checklist(draft, upload, transcode, view.review);

  const patch = (): Partial<Course> => ({
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    topic: draft.topic,
    level: draft.level,
    episodes: draft.episodes.filter((e) => e.title.trim()),
    productionMethod: draft.productionMethod,
    tools: draft.tools,
    subtitles: draft.subtitleFile ? ["한국어"] : [],
    rightsFiles: draft.rightsFiles,
    transcode: transcodeOverall(transcode),
    outputs: transcode.outputs,
  });

  const submit = () => {
    store.submitCourse(course.id, patch());
    setOverride(null);
    toast("검수 제출했어요. 운영자 검수 목록에 올라갔어요");
  };

  const resubmit = () => {
    if (override) {
      /* 시연용 보완 요청 상태를 store에 먼저 기록해야 재제출이 v2와 재제출 이력으로 남는다 */
      store.updateCourse(course.id, {
        review: override.review,
        version: override.version,
        submittedAt: override.submittedAt,
        reviewLog: override.reviewLog,
        revisionNote: override.revisionNote,
      });
    }
    store.submitCourse(course.id, { ...patch(), revisionNote: undefined });
    setOverride(null);
    setEditing(false);
    toast(`v${view.version + 1} 재제출했어요`);
  };

  const saveDraft = () => {
    store.updateCourse(course.id, patch());
    toast("임시 저장했어요");
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col xl:flex-row xl:items-start">
      <main className="order-2 min-w-0 flex-1 px-4 py-6 sm:px-8 xl:order-1 xl:pr-8">
        {/* xl 이상은 우측 처리 현황까지 폭을 채워 두 열 사이에 빈 띠가 생기지 않게 한다 */}
        <div className="max-w-[720px] xl:max-w-none">
          <div className="mb-6 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="eo-text-balance text-[20px] font-semibold leading-[28px] text-[var(--eo-ink)]">{view.title}</h1>
              <div className="mt-1 truncate text-[12px] tabular-nums text-[var(--eo-ink-3)]">
                {course.id.toUpperCase()} | {view.series} | {course.addedAt} 등록
              </div>
            </div>
            {canEdit && !readOnly && (
              <Button icon={<FloppyDisk size={14} />} onClick={saveDraft}>
                임시 저장
              </Button>
            )}
            {canEdit && readOnly && (
              <span className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-[var(--eo-ink-3)]">
                <LockSimple size={14} />
                {view.review === "보완 요청" ? "수정 전" : "검수 중 잠김"}
              </span>
            )}
          </div>

          <CourseForm
            draft={draft}
            setDraft={setDraft}
            readOnly={readOnly}
            revision={view.review === "보완 요청"}
            photo={view.photo}
            ep1Status={ep1Status(upload, transcode)}
            onPoster={() => toast("포스터를 교체했어요")}
            uploadSlot={
              canEdit || upload.status !== "idle" ? (
                <UploadPanel
                  upload={upload}
                  readOnly={readOnly}
                  onPick={(name, sizeMb) => setUpload({ status: "uploading", pct: 0, fileName: name, sizeMb })}
                  onSample={() => setUpload((u) => ({ ...u, status: "uploading", pct: 0 }))}
                  onPause={() => setUpload((u) => ({ ...u, status: "paused" }))}
                  onResume={() => setUpload((u) => ({ ...u, status: "uploading" }))}
                  onReplace={() => {
                    setUpload((u) => ({ ...u, status: "idle", pct: 0 }));
                    setTranscode({ outputs: { "1080p": "대기", "720p": "대기", "480p": "대기" }, pct: { "1080p": 0, "720p": 0, "480p": 0 }, error: null, retries: 0 });
                  }}
                />
              ) : null
            }
          />
        </div>
      </main>

      <aside
        aria-label="처리 현황"
        className="order-1 border-b border-[var(--eo-line)] px-4 sm:px-8 xl:order-2 xl:w-[344px] xl:shrink-0 xl:border-b-0 xl:border-l xl:px-0"
      >
        <div className="max-w-[720px] xl:max-w-none">
          <StatusPanel
            view={view}
            upload={upload}
            transcode={transcode}
            checks={checks}
            editing={editing}
            canEdit={canEdit}
            onRetry={() => {
              setTranscode((t) => ({
                ...t,
                outputs: { ...t.outputs, "1080p": "변환 중" },
                pct: { ...t.pct, "1080p": 0 },
                error: null,
                retries: t.retries + 1,
              }));
              toast("1080p 재처리를 시작했어요");
            }}
            onSubmit={submit}
            onEdit={() => setEditing(true)}
            onResubmit={resubmit}
            onPreview={() => setPreview(true)}
          />
        </div>
      </aside>

      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="1강 변환본 미리보기"
        footer={
          <Button variant="primary" onClick={() => setPreview(false)}>
            닫기
          </Button>
        }
      >
        <video src={SAMPLE_CLIP} poster={photoUrl(250, 960, 540)} controls playsInline className="aspect-video w-full rounded-[8px] bg-[var(--eo-ink)]" />
        <div className="mt-2 text-[12px] tabular-nums text-[var(--eo-ink-3)]">720p | 변환본</div>
      </Modal>
    </div>
  );
}
