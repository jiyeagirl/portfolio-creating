"use client";

import { useMemo, useState } from "react";
import { Car, Lock, LockOpen, X } from "@phosphor-icons/react";
import { ADMIN_MEMBERS } from "@/projects/platform/veli/lib/mock-data";
import type { AdminMember, AdminMemberStatus, PassTier } from "@/projects/platform/veli/lib/types";
import {
  Drawer,
  FilterChips,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
  Tag,
} from "@/projects/platform/veli/components/admin/admin-ui";

type StatusFilter = "all" | AdminMemberStatus;

const STATUS_TONE: Record<AdminMemberStatus, "success" | "danger" | "warning"> = {
  정상: "success",
  정지: "danger",
  탈퇴예정: "warning",
};

const TIER_LABEL: Record<PassTier, string> = {
  lite: "라이트",
  standard: "스탠다드",
  premium: "프리미엄",
};

const TIER_ORDER: PassTier[] = ["lite", "standard", "premium"];

const PER_PAGE = 6;

export function AdminMembers() {
  const [rows, setRows] = useState<AdminMember[]>(ADMIN_MEMBERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (!q) return true;
      return (
        row.name.includes(q) ||
        row.phoneMasked.includes(q) ||
        row.vehicleNumber.includes(q) ||
        row.safeNumber.includes(q)
      );
    });
  }, [rows, query, status]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const open = rows.find((r) => r.id === openId) ?? null;

  const counts = (key: AdminMemberStatus) => rows.filter((r) => r.status === key).length;

  const setTier = (id: string, tier: PassTier) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, passTier: tier } : r)));
  };

  const toggleSuspend = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "정지" ? "정상" : "정지" } : r,
      ),
    );
  };

  return (
    <>
      <PageHead
        title="회원 관리"
        description="회원 정보와 차량, 안심번호 매핑을 조회하고 이용권 상태와 계정 정지 여부를 처리합니다."
      />

      <Panel
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="이름, 연락처, 차량번호, 안심번호"
            />
            <FilterChips<StatusFilter>
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={[
                { key: "all", label: "전체", count: rows.length },
                { key: "정상", label: "정상", count: counts("정상") },
                { key: "정지", label: "정지", count: counts("정지") },
                { key: "탈퇴예정", label: "탈퇴예정", count: counts("탈퇴예정") },
              ]}
            />
          </div>
        }
        title="회원 목록"
        note="행을 누르면 이용권 변경과 계정 정지 처리를 할 수 있습니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead>
              <tr className="border-b border-[var(--vl-border)] text-[11.5px] text-[var(--vl-muted)]">
                <th className="px-5 py-3 font-semibold">이름</th>
                <th className="px-3 py-3 font-semibold">연락처</th>
                <th className="px-3 py-3 font-semibold">차량번호</th>
                <th className="px-3 py-3 font-semibold">안심번호</th>
                <th className="px-3 py-3 font-semibold">이용권</th>
                <th className="px-3 py-3 font-semibold">상태</th>
                <th className="px-5 py-3 font-semibold">최근활동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vl-border)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-bold">조건에 맞는 회원이 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--vl-muted)]">
                      상태 필터를 전체로 바꾸거나 검색어를 지워 보세요.
                    </p>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setOpenId(row.id)}
                    className="cursor-pointer text-[13px] hover:bg-[var(--vl-surface)]"
                  >
                    <td className="px-5 py-3 font-semibold">{row.name}</td>
                    <td className="vl-num px-3 py-3 text-[var(--vl-muted)]">{row.phoneMasked}</td>
                    <td className="vl-num px-3 py-3">{row.vehicleNumber}</td>
                    <td className="vl-num px-3 py-3 text-[var(--vl-muted)]">{row.safeNumber}</td>
                    <td className="px-3 py-3">{TIER_LABEL[row.passTier]}</td>
                    <td className="px-3 py-3">
                      <Tag tone={STATUS_TONE[row.status]}>{row.status}</Tag>
                    </td>
                    <td className="vl-num px-5 py-3 text-[var(--vl-muted)]">{row.lastActiveAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {open && (
        <Drawer onClose={() => setOpenId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="vl-num text-[12.5px] text-[var(--vl-muted)]">{open.id}</p>
              <h2 className="mt-1 text-[19px] font-bold tracking-tight">회원 상세</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--vl-surface)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] bg-[var(--vl-surface)] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] text-[13px] font-bold text-[var(--vl-accent)]">
              {open.name.slice(0, 1)}
            </span>
            <div>
              <p className="text-[14px] font-bold">{open.name}</p>
              <p className="vl-num text-[12px] text-[var(--vl-muted)]">{open.phoneMasked}</p>
            </div>
            <span className="ml-auto">
              <Tag tone={STATUS_TONE[open.status]}>{open.status}</Tag>
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "차량번호", value: open.vehicleNumber, num: true },
              { label: "안심번호", value: open.safeNumber, num: true },
              { label: "이용권", value: TIER_LABEL[open.passTier], num: false },
              { label: "가입일", value: open.joinedAt, num: true },
              { label: "최근활동", value: open.lastActiveAt, num: true },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--vl-muted)]">{item.label}</dt>
                <dd className={`text-right font-semibold ${item.num ? "vl-num" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-[13.5px] font-bold">이용권 등급 변경</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {TIER_ORDER.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTier(open.id, tier)}
                aria-pressed={open.passTier === tier}
                className={`rounded-full py-2 text-[12.5px] font-bold transition-colors ${
                  open.passTier === tier
                    ? "bg-[var(--vl-accent)] text-[var(--vl-accent-fg)]"
                    : "border border-[var(--vl-border)] text-[var(--vl-muted)] hover:text-[var(--vl-ink)]"
                }`}
              >
                {TIER_LABEL[tier]}
              </button>
            ))}
          </div>

          <h3 className="mt-6 flex items-center gap-1.5 text-[13.5px] font-bold">
            <Car size={15} className="text-[var(--vl-muted)]" />
            활동 이력
          </h3>
          <ol className="mt-3 space-y-3">
            {[
              { time: `${open.joinedAt} 09:12`, text: "회원 가입, 차량번호와 안심번호 최초 매핑" },
              { time: `${open.lastActiveAt} 08:40`, text: "마지막 로그인" },
              { time: `${open.lastActiveAt} 08:41`, text: "안심번호 통화내역 조회" },
              { time: "2026-07-06 09:00", text: `${TIER_LABEL[open.passTier]} 이용권 정기 결제 완료` },
            ].map((item) => (
              <li key={item.time} className="flex gap-3">
                <span className="vl-num w-[112px] shrink-0 text-[11.5px] text-[var(--vl-muted)]">
                  {item.time}
                </span>
                <span className="text-[12.5px] leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-7">
            <button
              type="button"
              onClick={() => toggleSuspend(open.id)}
              className={`flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-[13.5px] font-bold active:scale-[0.97] ${
                open.status === "정지"
                  ? "bg-[var(--vl-accent)] text-[var(--vl-accent-fg)]"
                  : "border border-[var(--vl-danger)] text-[var(--vl-danger)]"
              }`}
            >
              {open.status === "정지" ? <LockOpen size={14} /> : <Lock size={14} />}
              {open.status === "정지" ? "계정 정지 해제" : "계정 정지 처리"}
            </button>
          </div>
        </Drawer>
      )}
    </>
  );
}
