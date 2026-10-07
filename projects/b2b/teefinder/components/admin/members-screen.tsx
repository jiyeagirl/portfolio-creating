"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { getCourse } from "@/projects/b2b/teefinder/lib/mock-data";
import { Badge, memberTone } from "@/projects/b2b/teefinder/components/ui";
import type { MemberStatus } from "@/projects/b2b/teefinder/lib/types";
import {
  Btn,
  EmptyRow,
  FilterTabs,
  FormField,
  KeyValue,
  PageHeader,
  Pagination,
  SidePanel,
  TableShell,
  Td,
  TextArea,
  TextInput,
  Th,
} from "@/projects/b2b/teefinder/components/admin/admin-ui";

type Filter = "전체" | MemberStatus;
const PAGE_SIZE = 10;

export function MembersScreen() {
  const { members, setMemberStatus } = useStore();
  const [filter, setFilter] = useState<Filter>("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reasonMode, setReasonMode] = useState(false);
  const [reason, setReason] = useState("");
  const [tried, setTried] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { 전체: members.length };
    for (const m of members) c[m.status] = (c[m.status] ?? 0) + 1;
    return c;
  }, [members]);

  const filtered = useMemo(
    () =>
      members.filter(
        (m) =>
          (filter === "전체" || m.status === filter) &&
          (query.trim() === "" || m.name.includes(query.trim()) || m.phone.includes(query.trim())),
      ),
    [members, filter, query],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const selected = members.find((m) => m.id === selectedId) ?? rows[0] ?? null;

  function pick(id: string) {
    setSelectedId(id);
    setReasonMode(false);
    setReason("");
    setTried(false);
  }

  return (
    <div>
      <PageHeader title="회원 관리" meta={`전체 회원 ${members.length}명`} />

      <FilterTabs
        value={filter}
        onChange={(v) => {
          setFilter(v);
          setPage(1);
        }}
        options={(["전체", "정상", "승인 대기", "반려", "이용 정지"] as Filter[]).map((f) => ({
          value: f,
          label: f,
          count: counts[f] ?? 0,
        }))}
      />

      <div className="flex items-center justify-between gap-3 py-4">
        <label className="relative block w-[280px]">
          <span className="sr-only">이름 또는 연락처 검색</span>
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--tf-ink-3)]"
          />
          <TextInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="이름 또는 연락처" className="pl-9" />
        </label>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <TableShell minWidth={640}>
            <thead>
              <tr>
                <Th>이름 / 연락처</Th>
                <Th>회원권 정보</Th>
                <Th>가입일</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-line)]">
              {rows.length === 0 && <EmptyRow colSpan={4} text="조건에 맞는 회원이 없습니다" />}
              {rows.map((m) => {
                const active = selected?.id === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => pick(m.id)}
                    className={`cursor-pointer transition-colors hover:bg-[var(--tf-canvas)] ${
                      active ? "bg-[var(--tf-soft)] hover:bg-[var(--tf-soft)]" : ""
                    }`}
                  >
                    <Td>
                      <div className="font-medium">{m.name}</div>
                      <div className="mt-0.5 text-[12px] text-[var(--tf-ink-3)]">{m.phone}</div>
                    </Td>
                    <Td>
                      <div className="max-w-[200px] truncate" title={m.membershipLabel}>
                        {m.membershipLabel}
                      </div>
                      <div className="tf-mono mt-0.5 text-[12px] text-[var(--tf-ink-3)]">{m.membershipNo}</div>
                    </Td>
                    <Td className="text-[13px] tabular-nums text-[var(--tf-ink-2)]">{m.joinedAt}</Td>
                    <Td>
                      <Badge tone={memberTone(m.status)} compact>
                        {m.status}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
          <Pagination
            page={current}
            pageCount={pageCount}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </div>

        {selected && (
          <SidePanel
            key={selected.id}
            title="회원 상세"
            footer={
              selected.status === "정상" || selected.status === "이용 정지" ? (
                reasonMode ? (
                  <>
                    <Btn onClick={() => setReasonMode(false)}>취소</Btn>
                    <Btn
                      kind={selected.status === "정상" ? "danger" : "primary"}
                      className="flex-1"
                      onClick={() => {
                        setTried(true);
                        if (reason.trim() === "") return;
                        if (selected.status === "정상") setMemberStatus(selected.id, "이용 정지", reason.trim());
                        else setMemberStatus(selected.id, "정상");
                        setReasonMode(false);
                        setReason("");
                        setTried(false);
                      }}
                    >
                      {selected.status === "정상" ? "이용 정지 확정" : "정지 해제 확정"}
                    </Btn>
                  </>
                ) : (
                  <Btn
                    kind={selected.status === "정상" ? "ghost" : "primary"}
                    className="flex-1"
                    onClick={() => setReasonMode(true)}
                  >
                    {selected.status === "정상" ? "이용 정지" : "정지 해제"}
                  </Btn>
                )
              ) : undefined
            }
          >
            <div className="flex items-center justify-between">
              <p className="text-[17px] font-semibold tracking-[-0.01em]">{selected.name}</p>
              <Badge tone={memberTone(selected.status)} compact>
                {selected.status}
              </Badge>
            </div>
            <dl className="divide-y divide-[var(--tf-line)]">
              <KeyValue label="연락처">{selected.phone}</KeyValue>
              <KeyValue label="회원권">{selected.membershipLabel}</KeyValue>
              <KeyValue label="회원권 번호">
                <span className="tf-mono text-[12.5px]">{selected.membershipNo}</span>
              </KeyValue>
              <KeyValue label="가입일">{selected.joinedAt}</KeyValue>
              <KeyValue label="즐겨찾기">
                {selected.favoriteCourseIds.length === 0 ? (
                  "없음"
                ) : (
                  <span className="flex flex-wrap justify-end gap-x-2 gap-y-0.5">
                    {selected.favoriteCourseIds.map((id, i, all) => (
                      <span key={id} className="whitespace-nowrap">
                        {getCourse(id).name}
                        {i < all.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </span>
                )}
              </KeyValue>
              {selected.rejectReason && <KeyValue label="반려 사유">{selected.rejectReason}</KeyValue>}
              {selected.suspendReason && <KeyValue label="정지 사유">{selected.suspendReason}</KeyValue>}
            </dl>
            {reasonMode && (
              <FormField
                label={selected.status === "정상" ? "정지 사유" : "해제 사유"}
                required
                error={tried && reason.trim() === "" ? "사유를 입력해 주세요" : undefined}
              >
                <TextArea value={reason} onChange={setReason} rows={3} />
              </FormField>
            )}
          </SidePanel>
        )}
      </div>
    </div>
  );
}
