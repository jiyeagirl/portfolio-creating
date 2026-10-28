"use client";

import { useState, type ReactNode } from "react";
import { FilePdf, Plus, Subtitles, Trash, X } from "@phosphor-icons/react";
import { Button, Field, StatusBadge, Thumb, inputCls, type Tone } from "@/projects/platform/eduon/components/console/console-ui";
import { clock } from "@/projects/platform/eduon/lib/format";
import {
  CONSENT_FILE,
  CONSENT_FIXED,
  FILE_SIZE,
  LEVELS,
  METHODS,
  SUBTITLE_FILE,
  SUBTITLE_FIXED,
  TOPICS,
  type Draft,
} from "@/projects/platform/eduon/components/studio/studio-model";

function Block({ title, meta, children }: { title: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--eo-line)] py-6 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-baseline gap-2">
        <h2 className="text-[15px] font-semibold leading-[22px] text-[var(--eo-ink)]">{title}</h2>
        {meta && <span className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

function Segmented<T extends string>({ options, value, onChange, disabled }: { options: readonly T[]; value: T; onChange: (v: T) => void; disabled: boolean }) {
  return (
    <div role="radiogroup" className="inline-flex h-9 rounded-[8px] border border-[var(--eo-line-2)] p-0.5">
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={disabled}
            onClick={() => onChange(o)}
            className={`min-w-[56px] rounded-[6px] px-3 text-[13px] transition-colors disabled:cursor-not-allowed ${
              on ? "bg-[var(--eo-ink-btn)] font-semibold text-white" : "font-medium text-[var(--eo-ink-2)] enabled:hover:bg-[var(--eo-soft)] enabled:active:bg-[var(--eo-soft-2)]"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function FileRow({
  icon,
  name,
  meta,
  flagged,
  readOnly,
  onReplace,
  onRemove,
}: {
  icon: ReactNode;
  name: string;
  meta: string;
  flagged: boolean;
  readOnly: boolean;
  onReplace?: () => void;
  onRemove?: () => void;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--eo-soft)] text-[var(--eo-ink-2)]">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-[var(--eo-ink)]" title={name}>
          {name}
        </div>
        <div className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">{meta}</div>
      </div>
      {flagged && <StatusBadge tone="orange">보완 필요</StatusBadge>}
      {!readOnly && onReplace && (
        <Button size="sm" variant={flagged ? "primary" : "ghost"} onClick={onReplace}>
          교체
        </Button>
      )}
      {!readOnly && onRemove && (
        <button
          type="button"
          aria-label={`${name} 삭제`}
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[var(--eo-ink-3)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]"
        >
          <Trash size={16} />
        </button>
      )}
    </li>
  );
}

export function CourseForm({
  draft,
  setDraft,
  readOnly,
  revision,
  photo,
  ep1Status,
  uploadSlot,
  onPoster,
}: {
  draft: Draft;
  setDraft: (fn: (d: Draft) => Draft) => void;
  readOnly: boolean;
  /** 보완 요청 상태. 지적된 첨부에 보완 필요 표시 */
  revision: boolean;
  photo: number | string | null;
  ep1Status: { label: string; tone: Tone };
  uploadSlot: ReactNode;
  onPoster: () => void;
}) {
  const [toolInput, setToolInput] = useState("");
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const addTool = () => {
    const t = toolInput.trim();
    if (!t || draft.tools.includes(t)) return;
    set("tools", [...draft.tools, t]);
    setToolInput("");
  };

  return (
    <div className="min-w-0">
      <Block title="기본 정보">
        <div className="grid gap-4">
          <Field label="강좌 및 영상 제목" required>
            <input className={inputCls} value={draft.title} readOnly={readOnly} maxLength={40} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="소개" required error={!readOnly && draft.summary.trim().length < 20 ? `20자 이상 필요 (현재 ${draft.summary.trim().length}자)` : undefined}>
            <textarea
              className={`${inputCls} h-auto min-h-[88px] resize-y py-2 leading-[20px]`}
              value={draft.summary}
              readOnly={readOnly}
              maxLength={300}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <div className="mb-1.5 text-[12px] font-medium text-[var(--eo-ink-2)]">주제</div>
              <Segmented options={TOPICS} value={draft.topic} onChange={(v) => set("topic", v)} disabled={readOnly} />
            </div>
            <div>
              <div className="mb-1.5 text-[12px] font-medium text-[var(--eo-ink-2)]">난이도</div>
              <Segmented options={LEVELS} value={draft.level} onChange={(v) => set("level", v)} disabled={readOnly} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="제작방식">
              <select className={inputCls} value={draft.productionMethod} disabled={readOnly} onChange={(e) => set("productionMethod", e.target.value)}>
                {(METHODS.includes(draft.productionMethod) ? METHODS : [draft.productionMethod, ...METHODS]).map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <div className="min-w-0">
              <div className="mb-1.5 text-[12px] font-medium text-[var(--eo-ink-2)]">사용 도구</div>
              <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-[8px] border border-[var(--eo-line-2)] px-1.5 py-1">
                {draft.tools.map((t) => (
                  <span key={t} className="inline-flex h-6 items-center gap-1 rounded-[6px] bg-[var(--eo-soft-2)] pl-2 pr-1 text-[12px] font-medium text-[var(--eo-ink)]">
                    {t}
                    {!readOnly && (
                      <button
                        type="button"
                        aria-label={`${t} 빼기`}
                        onClick={() => set("tools", draft.tools.filter((x) => x !== t))}
                        className="flex h-4 w-4 items-center justify-center rounded-[4px] text-[var(--eo-ink-3)] hover:bg-[var(--eo-line)]"
                      >
                        <X size={10} weight="bold" />
                      </button>
                    )}
                  </span>
                ))}
                {!readOnly && (
                  <input
                    aria-label="사용 도구 추가"
                    value={toolInput}
                    placeholder="도구 추가"
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        addTool();
                      }
                    }}
                    onBlur={addTool}
                    className="h-6 min-w-[72px] flex-1 bg-transparent px-1 text-[13px] outline-none placeholder:text-[var(--eo-ink-3)]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block title="포스터">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Thumb photo={photo} title={draft.title} className="w-full rounded-[8px] sm:w-[288px]" />
          <div className="min-w-0">
            <div className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">poster_ad_01.jpg | 1920x1080 | 16:9</div>
            {!readOnly && (
              <Button size="sm" className="mt-2" onClick={onPoster}>
                포스터 변경
              </Button>
            )}
          </div>
        </div>
      </Block>

      <Block title="회차와 영상" meta={`${draft.episodes.length}강`}>
        <ul className="mb-4 divide-y divide-[var(--eo-line)] border-y border-[var(--eo-line)]">
          {draft.episodes.map((ep, i) => {
            const isFirst = ep.no === 1;
            const hasVideo = isFirst ? ep1Status.label !== "영상 없음" : ep.seconds > 0;
            const status = isFirst ? ep1Status : hasVideo ? { label: "완료", tone: "green" as Tone } : { label: "영상 없음", tone: "gray" as Tone };
            return (
              <li key={ep.no} className="flex items-center gap-3 py-2.5">
                <span className="w-8 shrink-0 text-[13px] font-semibold tabular-nums text-[var(--eo-ink-2)]">{ep.no}강</span>
                <div className="min-w-0 flex-1">
                  <input
                    aria-label={`${ep.no}강 제목`}
                    className={`${inputCls} ${readOnly ? "border-transparent px-0" : ""}`}
                    value={ep.title}
                    readOnly={readOnly}
                    placeholder="회차 제목"
                    onChange={(e) => set("episodes", draft.episodes.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  />
                  <div className="eo-mono mt-0.5 hidden truncate text-[11px] text-[var(--eo-ink-3)] sm:block">
                    {hasVideo ? `ai_video_intro_0${ep.no}.mp4` : "영상 미등록"}
                  </div>
                </div>
                <span className="hidden w-12 shrink-0 text-right text-[13px] tabular-nums text-[var(--eo-ink-2)] sm:block">{hasVideo ? clock(ep.seconds) : "0:00"}</span>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                {!readOnly && !hasVideo && !isFirst && (
                  <button
                    type="button"
                    aria-label={`${ep.no}강 삭제`}
                    onClick={() => set("episodes", draft.episodes.filter((_, j) => j !== i).map((x, j) => ({ ...x, no: j + 1 })))}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[var(--eo-ink-3)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {!readOnly && (
          <Button
            size="sm"
            variant="ghost"
            className="-ml-2 mb-4"
            icon={<Plus size={14} />}
            onClick={() => set("episodes", [...draft.episodes, { no: draft.episodes.length + 1, title: "", seconds: 0 }])}
          >
            회차 추가
          </Button>
        )}
        {uploadSlot}
      </Block>

      <Block title="자막과 권리자료" meta={`${(draft.subtitleFile ? 1 : 0) + draft.rightsFiles.length}개`}>
        <div className="text-[12px] font-medium text-[var(--eo-ink-2)]">한국어 자막</div>
        <ul className="mb-4 divide-y divide-[var(--eo-line)]">
          {draft.subtitleFile ? (
            <FileRow
              icon={<Subtitles size={16} />}
              name={draft.subtitleFile}
              meta={`SRT | ${FILE_SIZE[draft.subtitleFile] ?? "44 KB"} | 3강 전체`}
              flagged={revision && draft.subtitleFile === SUBTITLE_FILE}
              readOnly={readOnly}
              onReplace={() => set("subtitleFile", SUBTITLE_FIXED)}
            />
          ) : (
            <li className="flex items-center gap-3 py-2.5 text-[13px] text-[var(--eo-ink-3)]">
              자막 없음
              {!readOnly && (
                <Button size="sm" className="ml-auto" onClick={() => set("subtitleFile", SUBTITLE_FILE)}>
                  첨부
                </Button>
              )}
            </li>
          )}
        </ul>
        <div className="text-[12px] font-medium text-[var(--eo-ink-2)]">권리자료</div>
        <ul className="divide-y divide-[var(--eo-line)]">
          {draft.rightsFiles.map((f) => (
            <FileRow
              key={f}
              icon={<FilePdf size={16} />}
              name={f}
              meta={`PDF | ${FILE_SIZE[f] ?? "280 KB"}`}
              flagged={revision && f === CONSENT_FILE}
              readOnly={readOnly}
              onReplace={f === CONSENT_FILE ? () => set("rightsFiles", draft.rightsFiles.map((x) => (x === CONSENT_FILE ? CONSENT_FIXED : x))) : undefined}
              onRemove={draft.rightsFiles.length > 1 && f !== CONSENT_FILE ? () => set("rightsFiles", draft.rightsFiles.filter((x) => x !== f)) : undefined}
            />
          ))}
        </ul>
        {!readOnly && !draft.rightsFiles.includes("저작권 확인서.pdf") && (
          <Button size="sm" variant="ghost" className="-ml-2 mt-2" icon={<Plus size={14} />} onClick={() => set("rightsFiles", [...draft.rightsFiles, "저작권 확인서.pdf"])}>
            자료 첨부
          </Button>
        )}
      </Block>
    </div>
  );
}
