"use client";

/*
 * 관리자 화면 전용 부품. 콘솔 공용 부품(console-ui)에 없는 것만 둔다.
 * 표는 행 아래 헤어라인 한 줄, hover는 배경 틴트, 셀 세로 패딩 12px (design.md 표 밀도).
 */

import type { ReactNode } from "react";
import { CaretLeft, CaretRight, LockSimple } from "@phosphor-icons/react";
import { Button, StatusBadge, type Tone } from "@/projects/platform/eduon/components/console/console-ui";
import type { AccessLogEntry } from "@/projects/platform/eduon/lib/admin-data";
import type { Entitlement, ReviewStatus, PublishStatus, SubStatus, TranscodeStatus } from "@/projects/platform/eduon/lib/types";

export const REVIEW_TONE: Record<ReviewStatus, Tone> = { "작성 중": "gray", "검수 대기": "blue", "보완 요청": "orange", 승인: "green", 반려: "red" };
export const PUBLISH_TONE: Record<PublishStatus, Tone> = { 비공개: "gray", 공개: "green", "게시 중단": "gray" };
export const TRANSCODE_TONE: Record<TranscodeStatus, Tone> = { 대기: "gray", "변환 중": "blue", 완료: "green", 실패: "red" };
export const SUB_TONE: Record<Exclude<SubStatus, "free">, Tone> = { active: "green", cancelled: "gray", failed: "orange", expired: "red", refunded: "red" };
export const ENTITLEMENT_TONE: Record<Entitlement, Tone> = { "반영 완료": "green", "확인 필요": "orange", "반영 중": "blue", "회수 완료": "gray" };

/** 표 헤더 셀 */
export function Th({ children, className = "", align = "left" }: { children?: ReactNode; className?: string; align?: "left" | "right" | "center" }) {
  return (
    <th
      scope="col"
      className={`h-9 whitespace-nowrap bg-[var(--eo-soft)] px-3 text-[12px] font-medium text-[var(--eo-ink-3)] first:pl-4 last:pr-4 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
      } ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-3 py-3 align-middle first:pl-4 last:pr-4 ${className}`}>{children}</td>;
}

/** 표 행. 선택된 행은 한 톤 진한 면 */
export function rowCls(selected: boolean, clickable = true) {
  return `border-b border-[var(--eo-line)] transition-colors ${clickable ? "cursor-pointer" : ""} ${
    selected ? "bg-[var(--eo-soft-2)]" : clickable ? "hover:bg-[var(--eo-soft)]" : ""
  }`;
}

/** 한 줄 지표. 카드 없이 세로 헤어라인으로 나눈다. 단위는 라벨에 */
export function SummaryLine({ items, aside }: { items: Array<{ label: string; value: number; tone?: Tone }>; aside?: ReactNode }) {
  const color: Record<Tone, string> = {
    green: "text-[var(--eo-ink)]",
    blue: "text-[var(--eo-ink)]",
    gray: "text-[var(--eo-ink)]",
    orange: "text-[var(--eo-orange-fg)]",
    red: "text-[var(--eo-red-fg)]",
  };
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--eo-line)] pb-5">
      <dl className="flex flex-wrap items-stretch gap-y-3">
        {items.map((it, i) => (
          <div key={it.label} className={`pr-8 ${i > 0 ? "border-l border-[var(--eo-line)] pl-8" : ""}`}>
            <dt className="whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">{it.label}</dt>
            <dd className={`mt-1 text-[24px] font-semibold leading-[32px] tabular-nums ${color[it.tone ?? "gray"]}`}>{it.value.toLocaleString("ko-KR")}</dd>
          </div>
        ))}
      </dl>
      {aside}
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex min-h-8 items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold leading-[22px] text-[var(--eo-ink)]">{children}</h2>
      {aside}
    </div>
  );
}

/** 상세 패널 안 구획 */
export function PanelSection({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="border-b border-[var(--eo-line)] px-6 py-5 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-[var(--eo-ink)]">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** 이력 타임라인 */
export function Timeline({ items }: { items: Array<{ at: string; title: ReactNode; note?: ReactNode; tone?: Tone }> }) {
  const dot: Record<Tone, string> = {
    green: "bg-[var(--eo-green)]",
    blue: "bg-[var(--eo-blue)]",
    orange: "bg-[var(--eo-orange)]",
    red: "bg-[var(--eo-red)]",
    gray: "bg-[var(--eo-gray)]",
  };
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li key={`${it.at}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
          {i < items.length - 1 && <span className="absolute left-[3px] top-3 h-full w-px bg-[var(--eo-line)]" />}
          <span className={`relative mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full ${dot[it.tone ?? "gray"]}`} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-[13px] font-medium text-[var(--eo-ink)]">{it.title}</span>
              <span className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">{it.at}</span>
            </div>
            {it.note && <p className="mt-0.5 text-[12px] leading-[18px] text-[var(--eo-ink-2)]">{it.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** 페이지 이동. 범위 숫자는 en dash */
export function Pager({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  return (
    <div className="flex items-center justify-between gap-3 pt-3 text-[12px] text-[var(--eo-ink-3)]">
      <span className="tabular-nums">
        {from}–{to} / {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--eo-ink-2)] hover:bg-[var(--eo-soft)] disabled:opacity-35"
        >
          <CaretLeft size={14} />
        </button>
        <span className="min-w-[44px] text-center tabular-nums text-[var(--eo-ink-2)]">
          {page + 1} / {pages}
        </span>
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pages - 1}
          onClick={() => onPage(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--eo-ink-2)] hover:bg-[var(--eo-soft)] disabled:opacity-35"
        >
          <CaretRight size={14} />
        </button>
      </div>
    </div>
  );
}

/** 콘텐츠 운영자가 제한 메뉴에 들어왔을 때. 시도 자체가 접근 기록에 남는다 */
export function NoAccess({ area, log, onRequest, requested }: { area: string; log: AccessLogEntry | undefined; onRequest: () => void; requested: boolean }) {
  return (
    <div className="max-w-[640px] pt-6">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--eo-soft-2)] text-[var(--eo-ink-2)]">
          <LockSimple size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-semibold leading-[24px] text-[var(--eo-ink)]">{area}은 최고관리자 권한이 필요합니다</h2>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="primary" onClick={onRequest} disabled={requested}>
              {requested ? "요청 완료" : "권한 요청"}
            </Button>
          </div>
        </div>
      </div>
      {log && (
        <div className="mt-8">
          <p className="mb-2 text-[12px] font-medium text-[var(--eo-ink-3)]">이번 접근 기록</p>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-y border-[var(--eo-line)] py-3 text-[13px]">
            <span className="whitespace-nowrap tabular-nums text-[var(--eo-ink-3)]">{log.at}</span>
            <span className="min-w-0 truncate text-[var(--eo-ink)]">
              <span className="whitespace-nowrap font-medium">{log.actor}</span>
              <span className="text-[var(--eo-ink-3)]"> | {log.actorRole} | {log.target} {log.action}</span>
            </span>
            <StatusBadge tone="red">{log.result}</StatusBadge>
          </div>
        </div>
      )}
    </div>
  );
}
