"use client";

import "@/projects/platform/eduon/styles/eduon.css";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowCounterClockwise, DotsThreeVertical } from "@phosphor-icons/react";
import { useToast } from "@/projects/platform/eduon/components/console/console-ui";
import { STUDIO_DRAFT } from "@/projects/platform/eduon/lib/mock-data";
import { STUDIO_STATES, pick } from "@/projects/platform/eduon/lib/navigation";
import { StoreProvider, useStore } from "@/projects/platform/eduon/lib/store";
import { ContentList, type ListGroup } from "@/projects/platform/eduon/components/studio/content-list";
import { StudioScreen } from "@/projects/platform/eduon/components/studio/studio-screen";
import type { Mode } from "@/projects/platform/eduon/components/studio/studio-model";

const INSTRUCTOR = "한지오";
const COMPANY = "A미디어";

function DemoMenu({ onReset }: { onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="화면 상태"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--eo-ink-2)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]"
      >
        <DotsThreeVertical size={20} weight="bold" />
      </button>
      {open && (
        <div className="eo-fade absolute right-0 top-11 z-40 w-[208px] rounded-[10px] border border-[var(--eo-line)] bg-white p-1.5 shadow-[var(--eo-pop-shadow)]">
          <div className="px-2.5 pb-1 pt-1.5 text-[12px] font-medium text-[var(--eo-ink-3)]">화면 상태</div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onReset();
            }}
            className="flex h-9 w-full items-center gap-2 rounded-[6px] px-2.5 text-left text-[13px] font-medium text-[var(--eo-ink)] hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)]"
          >
            <ArrowCounterClockwise size={16} />
            처음 상태로
          </button>
        </div>
      )}
    </div>
  );
}

function Studio() {
  const store = useStore();
  const params = useSearchParams();
  const paramState = pick(STUDIO_STATES, params.get("state"));
  const toast = useToast();
  const [selected, setSelected] = useState(STUDIO_DRAFT.id);
  const [nonce, setNonce] = useState(0);
  /** 처음 상태로 뒤에는 ?state=와 상관없이 빈 업로드부터 시작 */
  const [forced, setForced] = useState<Mode | null>(null);

  const draft = store.course(STUDIO_DRAFT.id) ?? STUDIO_DRAFT;
  const course = store.course(selected) ?? draft;

  /* ?state=review|revision 시연은 화면 안에서만 상태를 덮어쓰므로 좌측 목록도 같은 상태로 보여 준다 */
  const draftMode = forced ?? paramState;
  const shown = (c: typeof draft) =>
    c.id !== STUDIO_DRAFT.id || c.review !== "작성 중"
      ? c
      : draftMode === "review"
        ? { ...c, review: "검수 대기" as const }
        : draftMode === "revision"
          ? { ...c, review: "보완 요청" as const }
          : c;
  const groups: ListGroup[] = [
    {
      label: "내 강좌",
      courses: store.courses
        .map(shown)
        .filter((c) => c.instructor === INSTRUCTOR)
        .sort((a, b) => (a.id === STUDIO_DRAFT.id ? -1 : b.id === STUDIO_DRAFT.id ? 1 : b.addedAt.localeCompare(a.addedAt))),
    },
    { label: `${COMPANY} 팀`, courses: store.courses.filter((c) => c.producer === COMPANY && c.instructor !== INSTRUCTOR) },
  ];

  const mode: Mode =
    course.id !== STUDIO_DRAFT.id ? "stored" : (forced ?? paramState ?? (draft.review !== "작성 중" ? "stored" : "uploading"));

  return (
    <div className="eduon-console flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[var(--eo-line)] bg-white px-4 sm:px-6">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--eo-side)] text-[13px] font-bold text-[var(--eo-brand)]">E</span>
        <span className="min-w-0 truncate text-[15px] leading-[22px]">
          <span className="font-bold text-[var(--eo-ink)]">EduOn</span>
          <span className="ml-1.5 font-medium text-[var(--eo-ink-2)]">강사 스튜디오</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-2 whitespace-nowrap text-[13px]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--eo-soft-2)] text-[12px] font-semibold text-[var(--eo-ink-2)]">한</span>
            <span className="font-semibold text-[var(--eo-ink)]">{INSTRUCTOR}</span>
            <span className="hidden text-[var(--eo-ink-3)] sm:inline">| {COMPANY}</span>
          </span>
          <DemoMenu
            onReset={() => {
              store.resetDemo();
              setSelected(STUDIO_DRAFT.id);
              setForced("idle");
              setNonce((n) => n + 1);
              toast.show("처음 상태로 되돌렸어요");
            }}
          />
        </div>
      </header>

      <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-stretch">
        <ContentList groups={groups} selected={selected} onSelect={setSelected} />
        {/* store가 localStorage를 읽은 뒤 한 번 다시 마운트해 시작 상태를 저장된 강좌 기준으로 잡는다 */}
        <StudioScreen key={`${selected}-${store.hydrated ? 1 : 0}-${nonce}`} course={course} mode={mode} toast={toast.show} />
      </div>
      {toast.node}
    </div>
  );
}

export function StudioApp() {
  return (
    <StoreProvider>
      <Studio />
    </StoreProvider>
  );
}
