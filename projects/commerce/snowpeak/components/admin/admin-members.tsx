"use client";

import { useState } from "react";
import {
  ADMIN_MEMBERS,
  ADMIN_RESERVATIONS,
  formatWon,
} from "@/projects/commerce/snowpeak/lib/mock-data";
import type { AdminMemberRow, MembershipTier, ReservationStatus } from "@/projects/commerce/snowpeak/lib/types";
import type { Tone } from "@/projects/commerce/snowpeak/lib/navigation";
import {
  Badge,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Segmented,
  Select,
  Table,
} from "@/projects/commerce/snowpeak/components/admin/admin-ui";

const PER_PAGE = 10;

const TIER_LIST: MembershipTier[] = ["화이트", "실버", "골드", "블랙"];

const TIER_TONE: Record<MembershipTier, Tone> = {
  화이트: "neutral",
  실버: "info",
  골드: "warn",
  블랙: "ink",
};

const STATUS_TONE: Record<ReservationStatus, Tone> = {
  예약대기: "warn",
  확정: "info",
  체크인: "success",
  체크아웃: "neutral",
  취소: "danger",
  환불완료: "neutral",
};

type ActivityFilter = "all" | "active" | "dormant";

function matchesActivity(member: AdminMemberRow, filter: ActivityFilter): boolean {
  if (filter === "active") return !member.dormant;
  if (filter === "dormant") return member.dormant;
  return true;
}

/** 회원 데이터에 연결된 별도 관리자 계정 타입이 없어, 기능 예시로만 고정 목업을 둔다. */
const ADMIN_ACCOUNTS: { name: string; email: string; role: "슈퍼관리자" | "운영팀"; lastLogin: string }[] = [
  { name: "오민서", email: "minseo.oh@snowpeak.com", role: "슈퍼관리자", lastLogin: "2023-10-15 09:40" },
  { name: "배도현", email: "dohyun.bae@snowpeak.com", role: "운영팀", lastLogin: "2023-10-14 18:12" },
  { name: "심유정", email: "yoojung.sim@snowpeak.com", role: "운영팀", lastLogin: "2023-10-13 11:05" },
];

export function AdminMembers() {
  const [members, setMembers] = useState<AdminMemberRow[]>(ADMIN_MEMBERS);
  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = members.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = q.length === 0 || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    return matchesSearch && matchesActivity(m, activityFilter);
  });

  const pageStart = (page - 1) * PER_PAGE;
  const pageRows = filtered.slice(pageStart, pageStart + PER_PAGE);
  const openMember = members.find((m) => m.id === openId) ?? null;
  const memberReservations = openMember
    ? ADMIN_RESERVATIONS.filter((r) => r.guestName === openMember.name)
    : [];

  const changeSearch = (next: string) => {
    setSearch(next);
    setPage(1);
  };

  const changeActivity = (next: ActivityFilter) => {
    setActivityFilter(next);
    setPage(1);
  };

  const updateTier = (id: string, tier: MembershipTier) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, tier } : m)));
  };

  return (
    <>
      <PageHead
        eyebrow="회원 관리"
        title="회원 및 등급 운영"
        desc="회원 목록을 조회하고, 등급 변경과 예약 이력, 휴면 여부를 상세 패널에서 함께 관리합니다."
      />

      <Card className="mt-6">
        <CardHead title="회원 목록" desc={`전체 ${members.length}명 중 ${filtered.length}명 표시`} />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Segmented<ActivityFilter>
            value={activityFilter}
            onChange={changeActivity}
            items={[
              { key: "all", label: "전체" },
              { key: "active", label: "활동" },
              { key: "dormant", label: "휴면" },
            ]}
          />
          <div className="sm:w-[260px]">
            <SearchInput value={search} onChange={changeSearch} placeholder="이름 또는 이메일 검색" />
          </div>
        </div>

        <Table
          head={["이름", "이메일", "등급", "예약건수", "누적결제액", "가입일"]}
          align={["left", "left", "left", "right", "right", "left"]}
          minWidth={640}
        >
          {pageRows.map((m) => (
            <Row key={m.id} onClick={() => setOpenId(m.id)} active={m.id === openId}>
              <Cell strong nowrap>
                <span className="flex items-center gap-2">
                  {m.name}
                  {m.dormant && <Badge tone="neutral">휴면</Badge>}
                </span>
              </Cell>
              <Cell muted>{m.email}</Cell>
              <Cell>
                <Badge tone={TIER_TONE[m.tier]}>{m.tier}</Badge>
              </Cell>
              <Cell align="right" mono nowrap>
                {m.reservationCount}건
              </Cell>
              <Cell align="right" mono nowrap strong>
                {formatWon(m.totalSpent)}원
              </Cell>
              <Cell mono nowrap muted>
                {m.joinedAt}
              </Cell>
            </Row>
          ))}
        </Table>

        {pageRows.length === 0 && (
          <p className="py-12 text-center text-[13.5px] text-[var(--sp-mute)]">
            조건에 맞는 회원이 없습니다. 검색어나 필터를 확인해 주세요.
          </p>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Card>

      <Card className="mt-6">
        <CardHead title="관리자 권한 관리" desc="백오피스 접근 권한을 가진 관리자 계정입니다." />
        <ul>
          {ADMIN_ACCOUNTS.map((acc) => (
            <li
              key={acc.email}
              className="flex items-center justify-between gap-4 border-b border-[var(--sp-border)] py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium text-[var(--sp-ink)]">{acc.name}</p>
                <p className="mt-0.5 truncate text-[12px] text-[var(--sp-mute)]">{acc.email}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="sp-num text-[12px] text-[var(--sp-mute)]">{acc.lastLogin}</span>
                <Badge tone={acc.role === "슈퍼관리자" ? "ink" : "info"}>{acc.role}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Drawer
        open={openMember !== null}
        title={openMember?.name ?? ""}
        subtitle={openMember?.email}
        onClose={() => setOpenId(null)}
      >
        {openMember && (
          <>
            <DefList
              columns={2}
              items={[
                { label: "이름", value: openMember.name },
                { label: "이메일", value: openMember.email },
                { label: "전화번호", value: <span className="sp-num">{openMember.phone}</span> },
                { label: "가입일", value: <span className="sp-num">{openMember.joinedAt}</span> },
                { label: "예약건수", value: <span className="sp-num">{openMember.reservationCount}건</span> },
                { label: "누적결제액", value: <span className="sp-num">{formatWon(openMember.totalSpent)}원</span> },
                {
                  label: "활동 상태",
                  value: <Badge tone={openMember.dormant ? "neutral" : "success"}>{openMember.dormant ? "휴면" : "활동"}</Badge>,
                },
              ]}
            />

            <div className="mt-6">
              <p className="mb-2 text-[13px] font-medium text-[var(--sp-ink)]">회원 등급 관리</p>
              <Select
                value={openMember.tier}
                options={TIER_LIST}
                onChange={(next) => updateTier(openMember.id, next as MembershipTier)}
              />
            </div>

            <div className="mt-6 border-t border-[var(--sp-border)] pt-6">
              <p className="mb-3 text-[13px] font-medium text-[var(--sp-ink)]">예약 이력 조회</p>
              {memberReservations.length === 0 ? (
                <p className="text-[13px] text-[var(--sp-mute)]">예약 이력이 없습니다.</p>
              ) : (
                <Table head={["예약번호", "상품", "금액", "상태"]} align={["left", "left", "right", "left"]} minWidth={420}>
                  {memberReservations.map((r) => (
                    <Row key={r.id}>
                      <Cell mono nowrap>
                        {r.confirmationNo}
                      </Cell>
                      <Cell muted>{r.productName}</Cell>
                      <Cell align="right" mono nowrap>
                        {formatWon(r.amount)}원
                      </Cell>
                      <Cell>
                        <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                      </Cell>
                    </Row>
                  ))}
                </Table>
              )}
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
