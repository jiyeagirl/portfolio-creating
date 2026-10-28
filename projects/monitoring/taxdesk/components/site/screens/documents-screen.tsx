"use client";

import { useState } from "react";
import {
  ArrowRight,
  Camera,
  CaretDown,
  ChatCircleDots,
  FileText,
  Paperclip,
  PaperPlaneRight,
  Question,
  SealWarning,
  Sparkle,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import {
  CHAT,
  EVIDENCE_SLOTS,
  OCR_FIELDS,
  type ChatMessage,
  type EvidenceSlot,
} from "@/projects/monitoring/taxdesk/lib/mock-data";
import { EVIDENCE_TONE } from "@/projects/monitoring/taxdesk/lib/status";
import type { SiteScreen } from "@/projects/monitoring/taxdesk/lib/navigation";
import { StatusChip } from "@/projects/monitoring/taxdesk/components/status";
import { FlowRail, FlowSteps } from "@/projects/monitoring/taxdesk/components/site/site-chrome";
import { Button, Container } from "@/projects/monitoring/taxdesk/components/site/ui";

/* ---------- 영수증 (처리 전후 비교용 문서 렌더) ---------- */

export function Receipt({ raw = false }: { raw?: boolean }) {
  return (
    <div
      className={`relative w-full whitespace-nowrap bg-[#fdfdfb] px-[9%] py-[8%] text-[#2a2a2a] ${raw ? "rotate-[4.2deg] scale-[0.9]" : ""}`}
      style={{ fontSize: 7 }}
    >
      <p className="whitespace-nowrap text-center text-[1.3em] font-bold">현금영수증</p>
      <div className="mt-[6%] space-y-[3%] text-[1em] leading-[1.5]">
        <p className="flex justify-between">
          <span>거래일시</span>
          <span>2025-11-18 15:42</span>
        </p>
        <p className="flex justify-between">
          <span>상호</span>
          <span>I포장산업</span>
        </p>
        <p className="flex justify-between">
          <span>사업자번호</span>
          <span className={raw ? "blur-[1.2px]" : ""}>318-27-60415</span>
        </p>
        <p className="border-t border-dashed border-[#bdbdbd] pt-[4%]">케이크 상자 2호 x 200</p>
        <p>제과 포장지 롤 x 6</p>
        <p className="flex justify-between border-t border-dashed border-[#bdbdbd] pt-[4%]">
          <span>공급가액</span>
          <span>286,000</span>
        </p>
        <p className="flex justify-between">
          <span>부가세</span>
          <span>28,600</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>합계</span>
          <span>314,600</span>
        </p>
      </div>
      {raw && <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/25" />}
    </div>
  );
}

/* ---------- AI 안내 ---------- */

function AiMessage({ m }: { m: Extract<ChatMessage, { from: "ai" }> }) {
  const [pick, setPick] = useState(m.industryPick?.find((p) => p.selected)?.code);
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--td-ink)] text-white">
        <Sparkle size={14} weight="fill" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-[23px]">{m.text}</p>
        {m.bullets && (
          <ul className="mt-2 space-y-1 text-[14px] leading-[21px] text-[var(--td-ink-2)]">
            {m.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--td-ink-3)]" />
                {b}
              </li>
            ))}
          </ul>
        )}
        {m.industryPick && (
          <div className="mt-3 overflow-hidden rounded-[12px] border border-[var(--td-line)] bg-white">
            {m.industryPick.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setPick(p.code)}
                className="flex w-full items-start gap-3 border-b border-[var(--td-line-soft)] p-3 text-left last:border-b-0"
              >
                <span
                  className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                    pick === p.code ? "border-[var(--td-blue)]" : "border-[#c7c7cc]"
                  }`}
                >
                  {pick === p.code && <span className="h-2 w-2 rounded-full bg-[var(--td-blue)]" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold">
                    {p.name} <span className="td-mono font-normal text-[var(--td-ink-3)]">{p.code}</span>
                  </span>
                  <span className="block text-[13px] leading-[19px] text-[var(--td-ink-3)]">{p.reason}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        {m.needsReview && (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--td-act-fg)]">
            <SealWarning size={16} weight="fill" />
            세무사 확인 필요
          </p>
        )}
        {m.sources && (
          <ul className="mt-2.5 space-y-1">
            {m.sources.map((s) => (
              <li key={s.title} className="flex items-center gap-1.5 text-[12px] text-[var(--td-ink-3)]">
                <FileText size={13} className="shrink-0" />
                <span className="min-w-0 truncate">{s.title}</span>
                <span className="shrink-0">| {s.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* 체크리스트를 넓게 쓰도록 안내 채팅은 버튼으로 여는 우측 드로어에 둔다 (2026-10-28 사용자 수정) */
function AiDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <button
        type="button"
        aria-label="안내 닫기"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <section
        aria-label="준비자료 안내"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(420px,100%)] flex-col bg-[var(--td-parch)] transition-transform duration-[240ms] ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
          <div>
            <h2 className="text-[17px] font-semibold">준비자료 안내</h2>
            <p className="mt-0.5 text-[12px] text-[var(--td-ink-3)]">세액은 세무사가 확정해요</p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--td-ink-2)] hover:bg-white"
          >
            <X size={18} />
          </button>
        </div>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-5">
        {CHAT.map((m, i) =>
          m.from === "user" ? (
            <p
              key={i}
              className="ml-auto max-w-[80%] rounded-[16px] rounded-br-[4px] bg-[var(--td-blue)] px-4 py-2.5 text-[15px] leading-[22px] text-white"
            >
              {m.text}
            </p>
          ) : (
            <AiMessage key={i} m={m} />
          ),
        )}
      </div>
      <div className="px-4 pb-4">
        <div className="flex h-12 items-center gap-2 rounded-full border border-[var(--td-line)] bg-white pl-5 pr-1.5">
          <input
            placeholder="준비자료에 대해 물어보세요"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--td-ink-3)]"
          />
          <button
            type="button"
            aria-label="보내기"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--td-ink)] text-white"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </button>
        </div>
      </div>
      </section>
    </>
  );
}

/* ---------- 체크리스트 ---------- */

function ReadErrorDetail() {
  return (
    <div className="mt-4 grid gap-5 border-t border-[var(--td-line-soft)] pt-4 sm:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-[13px] font-semibold">자동 규격 처리</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <figure>
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[8px] bg-[#5b5650]">
              <div className="w-[78%]">
                <Receipt raw />
              </div>
            </div>
            <figcaption className="mt-1.5 text-[12px] text-[var(--td-ink-3)]">원본 3.8MB</figcaption>
          </figure>
          <figure>
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[8px] bg-[var(--td-parch)]">
              <div className="w-[78%] ring-1 ring-[var(--td-line)]">
                <Receipt />
              </div>
            </div>
            <figcaption className="mt-1.5 text-[12px] text-[var(--td-ink-3)]">처리본 PDF 412KB</figcaption>
          </figure>
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--td-ink-2)]">
          <li>회전 보정 4.2도</li>
          <li>해상도 1,600px</li>
          <li>PDF 변환</li>
          <li>용량 89% 압축</li>
        </ul>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold">인식값 확인</p>
        <div className="mt-2 divide-y divide-[var(--td-line-soft)] rounded-[8px] border border-[var(--td-line)]">
          {OCR_FIELDS.map((f) => {
            const low = f.confidence < 60;
            return (
              <div key={f.label} className={`flex items-center gap-2 px-3 py-2 ${low ? "bg-[var(--td-stop-bg)]" : ""}`}>
                <span className="w-[76px] shrink-0 text-[12px] text-[var(--td-ink-3)]">{f.label}</span>
                <input
                  defaultValue={f.value}
                  className={`min-w-0 flex-1 bg-transparent text-[14px] outline-none ${low ? "font-semibold text-[var(--td-stop-fg)]" : ""}`}
                />
                <span className={`shrink-0 text-[11.5px] ${low ? "text-[var(--td-stop-fg)]" : "text-[var(--td-ink-3)]"}`}>
                  {f.confidence}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[13px] leading-[19px] text-[var(--td-stop-fg)]">
          사업자번호 한 자리가 흐려 읽지 못했어요. 영수증을 보고 고쳐 주세요.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm">인식값 저장</Button>
          <Button size="sm" variant="ghost">
            <Camera size={16} />
            다시 촬영
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlotRow({ slot }: { slot: EvidenceSlot }) {
  const [open, setOpen] = useState(slot.state === "읽기 오류");
  const expandable = slot.state === "읽기 오류";
  return (
    <li className="py-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 text-[16px] font-semibold">
            {slot.title}
            {!slot.required && <span className="text-[13px] font-normal text-[var(--td-ink-3)]">선택</span>}
          </p>
          <p className="mt-0.5 text-[14px] text-[var(--td-ink-3)]">{slot.hint}</p>
        </div>
        <StatusChip tone={EVIDENCE_TONE[slot.state]}>{slot.state}</StatusChip>
      </div>

      {slot.files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {slot.files.map((f) => (
            <li key={f.name} className="flex items-center gap-2 text-[14px]">
              <Paperclip size={15} className="shrink-0 text-[var(--td-ink-3)]" />
              <span className="min-w-0 truncate">{f.name}</span>
              <span className="shrink-0 text-[12px] text-[var(--td-ink-3)]">
                {f.size}
                {f.pages ? ` | ${f.pages}쪽` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}

      {slot.state === "보완 요청" && (
        <p className="mt-3 rounded-[8px] bg-[var(--td-act-bg)] px-3 py-2 text-[13px] leading-[19px] text-[var(--td-act-fg)]">
          배달앱B 정산서 (11월 ~ 12월)와 중개수수료 세금계산서가 더 필요해요
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant={slot.state === "미제출" || slot.state === "보완 요청" ? "primary" : "ghost"}>
          <UploadSimple size={15} />
          파일 올리기
        </Button>
        <Button size="sm" variant="ghost">
          <Camera size={15} />
          촬영
        </Button>
        {expandable && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="ml-auto flex items-center gap-1 text-[13px] font-semibold text-[var(--td-blue)]"
          >
            처리 결과
            <CaretDown size={13} className={open ? "rotate-180" : ""} />
          </button>
        )}
      </div>
      {expandable && open && <ReadErrorDetail />}
    </li>
  );
}

function Checklist() {
  const groups = ["매출", "매입", "카드 내역", "기타 증빙"] as const;
  const done = EVIDENCE_SLOTS.filter((s) => s.state === "제출").length;
  return (
    <section className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[17px] font-semibold">증빙 체크리스트</h2>
        <p className="text-[14px] text-[var(--td-ink-3)]">
          제출 {done} / {EVIDENCE_SLOTS.length}
        </p>
      </div>
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-[var(--td-line-soft)]">
        <div className="bg-[var(--td-ink)]" style={{ width: `${(done / EVIDENCE_SLOTS.length) * 100}%` }} />
      </div>

      {groups.map((g) => (
        <div key={g} className="mt-6">
          <p className="text-[13px] font-semibold text-[var(--td-ink-3)]">{g}</p>
          <ul className="divide-y divide-[var(--td-line-soft)] border-b border-[var(--td-line-soft)]">
            {EVIDENCE_SLOTS.filter((s) => s.group === g).map((s) => (
              <SlotRow key={s.id} slot={s} />
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-6 hidden items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-[var(--td-line)] py-8 text-[14px] text-[var(--td-ink-3)] md:flex">
        <UploadSimple size={20} />
        파일을 끌어다 놓으면 항목을 자동으로 분류해요
      </div>
    </section>
  );
}

export function DocumentsScreen({
  initialTab,
  onNavigate,
}: {
  initialTab: "ai" | "upload";
  onNavigate: (s: SiteScreen) => void;
}) {
  const [aiOpen, setAiOpen] = useState(initialTab === "ai");
  return (
    <div className="pb-28 md:pb-16">
      {/* 데스크톱은 왼쪽 세로 레일, 그보다 좁으면 상단 가로 단계 */}
      <div className="border-b border-[var(--td-line)] lg:hidden">
        <Container className="flex h-14 items-center">
          <FlowSteps screen="documents" onNavigate={onNavigate} />
        </Container>
      </div>
      <Container className="grid items-start gap-12 pt-8 lg:grid-cols-[200px_1fr] lg:pt-12">
        <aside className="hidden lg:block">
          <FlowRail screen="documents" onNavigate={onNavigate} />
        </aside>
        <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold leading-[32px] md:text-[32px] md:leading-[40px]">증빙 제출</h1>
            <p className="mt-1 text-[15px] text-[var(--td-ink-3)]">D베이커리 망원점 | 2025년 2기 확정신고</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setAiOpen(true)}>
              <Question size={17} />
              준비자료 안내
            </Button>
            <div className="hidden md:block">
              <Button onClick={() => onNavigate("sign")}>
                의뢰 확인으로
                <ArrowRight size={16} weight="bold" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-[880px]">
          <Checklist />
        </div>
        </div>
      </Container>

      <button
        type="button"
        aria-label="준비자료 안내 열기"
        onClick={() => setAiOpen(true)}
        className="fixed bottom-[96px] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--td-ink)] text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-transform duration-150 active:translate-y-px md:bottom-8 md:right-8"
      >
        <ChatCircleDots size={26} weight="fill" />
      </button>
      <AiDrawer open={aiOpen} onClose={() => setAiOpen(false)} />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--td-line)] bg-white px-6 pb-4 pt-3 md:hidden">
        <Button size="lg" className="w-full" onClick={() => onNavigate("sign")}>
          의뢰 확인으로
        </Button>
      </div>
    </div>
  );
}
