"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowsClockwise, Export, Prohibit, X } from "@phosphor-icons/react";
import {
  ADMIN_RESERVATIONS,
  PASS_BY_TIER,
  expertById,
  formatWon,
} from "@/projects/platform/lumi/lib/mock-data";
import type { AdminReservation } from "@/projects/platform/lumi/lib/types";
import {
  FilterChips,
  Metric,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
  Tag,
} from "@/projects/platform/lumi/components/admin/admin-ui";
import { ExpertAvatar } from "@/projects/platform/lumi/components/ui";

type StateFilter = "all" | AdminReservation["state"];

const STATE_TONE: Record<AdminReservation["state"], "neutral" | "accent" | "live" | "success" | "danger"> = {
  대기: "accent",
  진행중: "live",
  완료: "success",
  취소: "neutral",
  노쇼: "danger",
};

const PER_PAGE = 6;

export function AdminReservations() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<StateFilter>("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [handled, setHandled] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim();
    return ADMIN_RESERVATIONS.filter((row) => {
      if (state !== "all" && row.state !== state) return false;
      if (!q) return true;
      return (
        row.id.includes(q) ||
        row.memberName.includes(q) ||
        row.memberPhone.includes(q) ||
        expertById(row.expertId).name.includes(q)
      );
    });
  }, [query, state]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const open = ADMIN_RESERVATIONS.find((r) => r.id === openId) ?? null;

  /* 드로어는 Esc로도 닫힌다. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const counts = (key: AdminReservation["state"]) =>
    ADMIN_RESERVATIONS.filter((r) => r.state === key).length;

  return (
    <>
      <PageHead
        title="예약 · 상담 관리"
        description="예약 상태와 진행 상황을 확인하고 취소, 노쇼, 상담권 복구를 처리합니다."
        actions={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--lm-surface)]"
          >
            <Export size={14} />
            내역 내보내기
          </button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="오늘 예약" value="214" unit="건" note="예약 142 · 즉시 72" />
        <Metric label="진행 중" value="26" unit="건" note="평균 대기 4분" />
        <Metric label="노쇼율" value="2.5" unit="%" note="지난주 3.1%" />
        <Metric label="평균 상담 시간" value="27.4" unit="분" note="Standard 기준" />
      </div>

      <Panel
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="예약번호, 회원명, 연락처, 상담사"
            />
            <FilterChips<StateFilter>
              value={state}
              onChange={(v) => {
                setState(v);
                setPage(1);
              }}
              options={[
                { key: "all", label: "전체", count: ADMIN_RESERVATIONS.length },
                { key: "대기", label: "대기", count: counts("대기") },
                { key: "진행중", label: "진행중", count: counts("진행중") },
                { key: "완료", label: "완료", count: counts("완료") },
                { key: "취소", label: "취소", count: counts("취소") },
                { key: "노쇼", label: "노쇼", count: counts("노쇼") },
              ]}
            />
          </div>
        }
        title="예약 목록"
        note="행을 누르면 상담 기록과 처리 이력이 열립니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead>
              <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                <th className="px-5 py-3 font-semibold">예약번호</th>
                <th className="px-3 py-3 font-semibold">일시</th>
                <th className="px-3 py-3 font-semibold">회원</th>
                <th className="px-3 py-3 font-semibold">상담사</th>
                <th className="px-3 py-3 font-semibold">상담권</th>
                <th className="px-3 py-3 font-semibold">경로</th>
                <th className="px-3 py-3 text-right font-semibold">금액</th>
                <th className="px-5 py-3 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--lm-border)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-bold">조건에 맞는 예약이 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--lm-muted)]">
                      상태 필터를 전체로 바꾸거나 검색어를 지워 보세요.
                    </p>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setOpenId(row.id)}
                    className="cursor-pointer text-[13px] hover:bg-[var(--lm-surface)]"
                  >
                    <td className="lm-num px-5 py-3 font-semibold">{row.id}</td>
                    <td className="lm-num px-3 py-3">{row.scheduledAt}</td>
                    <td className="px-3 py-3">
                      <p className="font-semibold">{row.memberName}</p>
                      <p className="lm-num text-[11.5px] text-[var(--lm-muted)]">
                        {row.memberPhone}
                      </p>
                    </td>
                    <td className="px-3 py-3">{expertById(row.expertId).name}</td>
                    <td className="lm-num px-3 py-3 text-[var(--lm-muted)]">
                      {PASS_BY_TIER[row.tier].name} {PASS_BY_TIER[row.tier].minutes}분
                    </td>
                    <td className="px-3 py-3 text-[var(--lm-muted)]">{row.channel}</td>
                    <td className="lm-num px-3 py-3 text-right">{formatWon(row.amount)}원</td>
                    <td className="px-5 py-3">
                      <Tag tone={STATE_TONE[row.state]}>{handled[row.id] ?? row.state}</Tag>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {open && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setOpenId(null)}
            className="flex-1 bg-[rgba(13,11,28,0.35)]"
          />
          <aside className="h-full w-full max-w-[420px] overflow-y-auto border-l border-[var(--lm-border)] bg-[var(--lm-elevated)] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="lm-num text-[12.5px] text-[var(--lm-muted)]">{open.id}</p>
                <h2 className="mt-1 text-[19px] font-bold tracking-tight">예약 상세</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="닫기"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--lm-surface)]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[var(--lm-surface)] p-4">
              <ExpertAvatar expert={expertById(open.expertId)} size={40} />
              <div>
                <p className="text-[14px] font-bold">{expertById(open.expertId).name}</p>
                <p className="lm-num text-[12px] text-[var(--lm-muted)]">
                  {PASS_BY_TIER[open.tier].name} {PASS_BY_TIER[open.tier].minutes}분 ·{" "}
                  {open.channel}
                </p>
              </div>
              <span className="ml-auto">
                <Tag tone={STATE_TONE[open.state]}>{handled[open.id] ?? open.state}</Tag>
              </span>
            </div>

            <dl className="lm-num mt-5 space-y-3 text-[13px]">
              {[
                { label: "회원", value: `${open.memberName} (${open.memberPhone})` },
                { label: "예약 일시", value: open.scheduledAt },
                { label: "사용 시간", value: open.usedMinutes > 0 ? `${open.usedMinutes}분` : "-" },
                { label: "결제 금액", value: `${formatWon(open.amount)}원` },
                { label: "메모", value: open.note },
              ].map((item) => (
                <div key={item.label} className="flex justify-between gap-6">
                  <dt className="shrink-0 text-[var(--lm-muted)]">{item.label}</dt>
                  <dd className="text-right font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-6 text-[13.5px] font-bold">처리 이력</h3>
            <ol className="mt-3 space-y-3">
              {[
                { time: "07.28 18:02", text: "회원 예약 생성, 상담권 1장 차감" },
                { time: "07.28 19:50", text: "예약 10분 전 알림 발송" },
                {
                  time: "07.28 20:00",
                  text:
                    open.state === "노쇼"
                      ? "회원 미응답 8분, 노쇼 자동 판정"
                      : "안심번호 연결 시도",
                },
              ].map((item) => (
                <li key={item.time} className="flex gap-3">
                  <span className="lm-num w-[76px] shrink-0 text-[11.5px] text-[var(--lm-muted)]">
                    {item.time}
                  </span>
                  <span className="text-[12.5px] leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ol>

            <div className="mt-7 space-y-2">
              <button
                type="button"
                onClick={() => setHandled((prev) => ({ ...prev, [open.id]: "취소" }))}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--lm-accent)] py-3 text-[13.5px] font-bold text-[var(--lm-accent-fg)] active:translate-y-[1px]"
              >
                <Prohibit size={14} />
                예약 취소 처리
              </button>
              <button
                type="button"
                onClick={() => setHandled((prev) => ({ ...prev, [open.id]: "완료" }))}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--lm-border)] py-3 text-[13.5px] font-bold text-[var(--lm-ink)] active:translate-y-[1px]"
              >
                <ArrowsClockwise size={14} />
                상담권 복구하고 완료 처리
              </button>
              {handled[open.id] && (
                <p className="pt-1 text-center text-[12px] font-semibold text-[var(--lm-success)]">
                  {handled[open.id]}(으)로 변경했습니다. 회원과 상담사에게 안내가 발송됩니다.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
