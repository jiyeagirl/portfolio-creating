"use client";

import { useState } from "react";
import { Check, PawPrint, ShoppingBag, Ticket, X } from "@phosphor-icons/react";
import { ADMIN_MEMBERS, COUPONS, formatWon } from "@/projects/commerce/pawfit/lib/mock-data";
import type { AdminMemberRow } from "@/projects/commerce/pawfit/lib/types";
import {
  Drawer,
  FilterChips,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
} from "@/projects/commerce/pawfit/components/admin/admin-ui";

type Segment = "all" | "multi-pet" | "no-order";

const PER_PAGE = 6;

function matchesSegment(member: AdminMemberRow, segment: Segment): boolean {
  if (segment === "multi-pet") return member.petCount >= 2;
  if (segment === "no-order") return member.orderCount === 0;
  return true;
}

export function AdminMembers() {
  const [members] = useState<AdminMemberRow[]>(ADMIN_MEMBERS);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<Segment>("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [couponId, setCouponId] = useState(COUPONS[0]?.id ?? "");
  const [issued, setIssued] = useState(false);

  const segmentOptions: { key: Segment; label: string; count: number }[] = [
    { key: "all", label: "전체", count: members.length },
    {
      key: "multi-pet",
      label: "반려동물 2마리 이상",
      count: members.filter((m) => matchesSegment(m, "multi-pet")).length,
    },
    {
      key: "no-order",
      label: "미주문",
      count: members.filter((m) => matchesSegment(m, "no-order")).length,
    },
  ];

  const filtered = members.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    return matchesSearch && matchesSegment(m, segment);
  });

  const pageStart = (page - 1) * PER_PAGE;
  const pageRows = filtered.slice(pageStart, pageStart + PER_PAGE);
  const openMember = members.find((m) => m.id === openId) ?? null;

  const changeSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const changeSegment = (key: Segment) => {
    setSegment(key);
    setPage(1);
  };

  const openDrawer = (id: string) => {
    setOpenId(id);
    setCouponId(COUPONS[0]?.id ?? "");
    setIssued(false);
  };

  const issueCoupon = () => {
    if (!couponId) return;
    setIssued(true);
  };

  const selectedCoupon = COUPONS.find((c) => c.id === couponId) ?? null;

  return (
    <>
      <PageHead
        title="회원 관리"
        description="회원 정보와 반려동물, 주문 이력을 조회하고 쿠폰을 지급합니다."
      />

      <Panel
        title="회원 목록"
        note="이름 또는 이메일로 검색하고, 행을 눌러 상세 정보를 확인하세요"
        actions={<SearchInput value={search} onChange={changeSearch} placeholder="이름 또는 이메일 검색" />}
      >
        <div className="border-b border-[var(--pf-hairline)] px-5 py-4">
          <FilterChips<Segment> options={segmentOptions} value={segment} onChange={changeSegment} />
        </div>

        <div className="overflow-x-auto pf-scroll-x">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[var(--pf-hairline)] text-[11.5px] text-[var(--pf-muted)]">
                <th className="px-5 py-3 font-semibold">이름</th>
                <th className="px-3 py-3 font-semibold">이메일</th>
                <th className="px-3 py-3 font-semibold">등록 반려동물</th>
                <th className="px-3 py-3 font-semibold">주문 수</th>
                <th className="px-3 py-3 font-semibold">누적 결제액</th>
                <th className="px-5 py-3 font-semibold">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--pf-hairline)]">
              {pageRows.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => openDrawer(member.id)}
                  className="cursor-pointer text-[13px] transition-colors hover:bg-[var(--pf-surface-soft)]"
                >
                  <td className="px-5 py-3.5 font-semibold">{member.name}</td>
                  <td className="px-3 py-3.5 text-[var(--pf-muted)]">{member.email}</td>
                  <td className="pf-num px-3 py-3.5">{member.petCount}마리</td>
                  <td className="pf-num px-3 py-3.5">{member.orderCount}건</td>
                  <td className="pf-num px-3 py-3.5 font-semibold">{formatWon(member.totalSpent)}원</td>
                  <td className="pf-num px-5 py-3.5 text-[var(--pf-muted)]">{member.joinedAt}</td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[var(--pf-muted)]">
                    조건에 맞는 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {openMember && (
        <Drawer onClose={() => setOpenId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="pf-num text-[12.5px] text-[var(--pf-muted)]">{openMember.id}</p>
              <h2 className="mt-1 text-[19px] font-semibold tracking-tight">{openMember.name}</h2>
              <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">{openMember.email}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--pf-surface-soft)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <dl className="mt-5 space-y-3 rounded-[8px] border border-[var(--pf-hairline)] p-4 text-[13px]">
            <div className="flex justify-between gap-6">
              <dt className="text-[var(--pf-muted)]">가입일</dt>
              <dd className="pf-num text-right font-semibold">{openMember.joinedAt}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-[var(--pf-muted)]">누적 결제액</dt>
              <dd className="pf-num text-right font-semibold">{formatWon(openMember.totalSpent)}원</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-[var(--pf-hairline)] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-ink)]">
              <PawPrint size={16} weight="fill" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold">반려동물 프로필</p>
              <p className="pf-num mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
                등록된 반려동물 {openMember.petCount}마리
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-[8px] border border-[var(--pf-hairline)] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-ink)]">
              <ShoppingBag size={16} weight="fill" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold">주문 이력</p>
              <p className="pf-num mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
                {openMember.orderCount === 0
                  ? "아직 주문 내역이 없습니다"
                  : `주문 ${openMember.orderCount}건, 누적 ${formatWon(openMember.totalSpent)}원`}
              </p>
            </div>
          </div>

          <h3 className="mt-6 flex items-center gap-1.5 text-[13.5px] font-semibold">
            <Ticket size={15} className="text-[var(--pf-muted)]" />
            쿠폰 지급
          </h3>

          <div className="mt-3 rounded-[8px] border border-[var(--pf-hairline)] p-4">
            <label className="block">
              <span className="text-[12.5px] font-semibold text-[var(--pf-muted)]">지급할 쿠폰</span>
              <select
                value={couponId}
                onChange={(e) => {
                  setCouponId(e.target.value);
                  setIssued(false);
                }}
                className="mt-1.5 w-full rounded-[8px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--pf-ink)]"
              >
                {COUPONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            {selectedCoupon && (
              <p className="pf-num mt-2 text-[12px] text-[var(--pf-muted)]">
                {formatWon(selectedCoupon.minAmount)}원 이상 구매 시 사용 가능, {selectedCoupon.expiresAt}까지
              </p>
            )}

            <button
              type="button"
              onClick={issueCoupon}
              className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[var(--pf-ink)] py-2.5 text-[13px] font-semibold text-[var(--pf-on-primary)] transition-transform active:scale-[0.97]"
            >
              지급하기
            </button>

            {issued && (
              <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--pf-success)]">
                <Check size={13} weight="bold" />
                쿠폰이 지급되었습니다.
              </p>
            )}
          </div>
        </Drawer>
      )}
    </>
  );
}
