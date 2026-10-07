"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, CircleNotch, FileArrowUp, Info } from "@phosphor-icons/react";
import { SAMPLE_FILE } from "@/projects/platform/drawqty/lib/plan-data";
import { fmtSize } from "@/projects/platform/drawqty/lib/format";
import { useStore } from "@/projects/platform/drawqty/lib/store";
import { APPROX_NOTICE, Button, Checkbox, Segmented } from "@/projects/platform/drawqty/components/site/ui";
import type { DrawingKind, UploadedFile } from "@/projects/platform/drawqty/lib/types";

export type UploadPhase = "empty" | "uploading" | "ready" | "analyzing";

const ANALYSIS_STEPS = ["도면 레이어 분석", "외벽, 슬래브 인식", "층고 반영"];

export function UploadScreen({
  initialPhase,
  freezeStep,
  onDone,
}: {
  initialPhase: UploadPhase;
  /* 스크린샷용: 분석 화면을 이 단계에서 멈춘다 */
  freezeStep?: number;
  onDone: () => void;
}) {
  const { file, setFile, kind, setKind, targets, setTargets, registerUpload } = useStore();
  const [phase, setPhase] = useState<UploadPhase>(initialPhase);
  const [progress, setProgress] = useState(initialPhase === "uploading" ? 0 : 100);
  const [pending, setPending] = useState<UploadedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(freezeStep ?? 0);
  const inputRef = useRef<HTMLInputElement>(null);

  function beginUpload(next: UploadedFile) {
    setPending(next);
    setProgress(0);
    setPhase("uploading");
  }

  useEffect(() => {
    if (phase !== "uploading" || !pending) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return Math.min(p + 17, 100);
      });
    }, 130);
    return () => clearInterval(t);
  }, [phase, pending]);

  useEffect(() => {
    if (phase === "uploading" && pending && progress >= 100) {
      const t = setTimeout(() => {
        setFile(pending);
        setPhase("ready");
      }, 220);
      return () => clearTimeout(t);
    }
  }, [phase, pending, progress, setFile]);

  useEffect(() => {
    if (phase !== "analyzing" || freezeStep !== undefined) return;
    const timers = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2700),
      setTimeout(onDone, 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase, freezeStep, onDone]);

  function pickFile(f: File | undefined) {
    if (!f) return;
    beginUpload({
      name: f.name,
      sizeMb: Math.max(0.1, Math.round((f.size / 1048576) * 10) / 10),
      floors: SAMPLE_FILE.floors,
      layers: SAMPLE_FILE.layers,
    });
  }

  const canStart = phase === "ready" && !!file && (targets.scaffold || targets.shoring);

  if (phase === "analyzing") {
    return (
      <div className="dq-enter mx-auto w-full max-w-[640px] py-6 sm:py-12">
        <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[28px] sm:leading-9">도면을 분석하고 있어요</h1>
        <p className="mt-2 truncate text-[14px] text-[var(--dq-ink-3)]">{file?.name ?? SAMPLE_FILE.name}</p>
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-[var(--dq-soft-2)]">
          <div className="dq-progress h-full rounded-full bg-[var(--dq-brand)]" style={{ width: `${Math.min(100, Math.round(((step + 0.4) / 3) * 100))}%` }} />
        </div>
        <ol className="mt-6 divide-y divide-[var(--dq-line)] border-y border-[var(--dq-line)]">
          {ANALYSIS_STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex min-h-[56px] items-center gap-3">
                {done ? (
                  <CheckCircle size={22} weight="fill" className="shrink-0 text-[var(--dq-green)]" />
                ) : active ? (
                  <CircleNotch size={22} className="shrink-0 animate-spin text-[var(--dq-brand)] motion-reduce:animate-none" />
                ) : (
                  <span className="h-[22px] w-[22px] shrink-0 rounded-full border border-[var(--dq-line-strong)]" />
                )}
                <span className={`text-[15px] ${active ? "font-semibold" : done ? "text-[var(--dq-ink-2)]" : "text-[var(--dq-ink-3)]"}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="dq-enter">
      <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[28px] sm:leading-9">도면 업로드</h1>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
        <section className="lg:col-span-7">
          <input
            ref={inputRef}
            type="file"
            accept=".dwg"
            className="sr-only"
            tabIndex={-1}
            aria-label="DWG 파일 선택"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          {phase === "ready" && file ? (
            <div className="rounded-[12px] border border-[var(--dq-line)] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[var(--dq-soft-2)] text-[var(--dq-ink-2)]">
                  <FileArrowUp size={26} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold" title={file.name}>
                    {file.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-[var(--dq-green-fg)]">
                    <CheckCircle size={16} weight="fill" />
                    업로드를 마쳤어요
                  </p>
                </div>
                <Button
                  kind="text"
                  onClick={() => {
                    setFile(null);
                    setPhase("empty");
                  }}
                >
                  다시 선택
                </Button>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--dq-soft-2)]">
                <div className="h-full w-full rounded-full bg-[var(--dq-green)]" />
              </div>
              <dl className="mt-6 grid grid-cols-1 divide-y divide-[var(--dq-line)] border-t border-[var(--dq-line)] text-[14px] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <Info2 label="파일 크기" value={fmtSize(file.sizeMb)} />
                <Info2 label="층수" value={file.floors} />
                <Info2 label="도면 레이어 (개)" value={String(file.layers)} />
              </dl>
            </div>
          ) : phase === "uploading" && pending ? (
            <div className="rounded-[12px] border border-[var(--dq-line)] p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[var(--dq-soft-2)] text-[var(--dq-ink-2)]">
                  <FileArrowUp size={26} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold">{pending.name}</p>
                  <p className="mt-0.5 text-[13px] text-[var(--dq-ink-3)]">업로드 중, {Math.min(progress, 100)}%</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--dq-soft-2)]">
                <div className="dq-progress h-full rounded-full bg-[var(--dq-brand)]" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex min-h-[320px] flex-col items-start justify-center rounded-[12px] border-2 lg:min-h-[430px] border-dashed p-6 sm:p-10 ${
                dragging ? "border-[var(--dq-brand)] bg-[var(--dq-soft)]" : "border-[var(--dq-line-strong)] bg-[var(--dq-surface)]"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[var(--dq-soft-2)] text-[var(--dq-ink-2)]">
                <FileArrowUp size={30} />
              </span>
              <p className="mt-5 text-[18px] font-semibold leading-7 tracking-[-0.01em]">DWG 파일을 끌어다 놓거나 선택해 주세요</p>
              <p className="mt-1 text-[13px] text-[var(--dq-ink-3)]">.dwg, 최대 50 MB</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button kind="ghost" onClick={() => inputRef.current?.click()}>
                  파일 선택
                </Button>
                <Button kind="primary" onClick={() => beginUpload(SAMPLE_FILE)}>
                  예시 도면으로 체험하기
                </Button>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-[12px] border border-[var(--dq-line)] p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-[16px] font-semibold leading-6">산출 설정</h2>

          <div className="mt-5">
            <p className="mb-2 text-[13px] font-medium text-[var(--dq-ink-2)]">도면 종류</p>
            <Segmented<DrawingKind>
              value={kind}
              onChange={setKind}
              options={[
                { value: "건축도면", label: "건축도면" },
                { value: "구조도면", label: "구조도면" },
              ]}
            />
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-medium text-[var(--dq-ink-2)]">산출 대상</p>
            <div className="mt-1 divide-y divide-[var(--dq-line)]">
              <Checkbox checked={targets.scaffold} onChange={(v) => setTargets({ ...targets, scaffold: v })}>
                시스템비계
              </Checkbox>
              <Checkbox checked={targets.shoring} onChange={(v) => setTargets({ ...targets, shoring: v })}>
                시스템동바리
              </Checkbox>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-[8px] bg-[var(--dq-soft)] px-3.5 py-3 text-[13px] leading-5 text-[var(--dq-ink-2)]">
            <Info size={18} className="mt-px shrink-0 text-[var(--dq-ink-3)]" />
            <span>{APPROX_NOTICE}</span>
          </div>

          <Button
            className="mt-6 w-full"
            disabled={!canStart}
            onClick={() => {
              registerUpload();
              setStep(0);
              setPhase("analyzing");
            }}
          >
            물량 산출 시작
          </Button>
        </aside>
      </div>
    </div>
  );
}

function Info2({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-0 py-3 sm:px-4 sm:py-0 sm:first:pl-0">
      <dt className="text-[12px] text-[var(--dq-ink-3)]">{label}</dt>
      <dd className="mt-1 text-[15px] font-semibold">{value}</dd>
    </div>
  );
}
