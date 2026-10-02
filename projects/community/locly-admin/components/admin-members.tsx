"use client";

import { useMemo, useState } from "react";
import { Prohibit, ShieldCheck, UserCircle } from "@phosphor-icons/react";
import { ADMIN_MEMBERS } from "@/projects/community/locly/lib/mock-data";
import type { AdminMember } from "@/projects/community/locly/lib/types";
import { Avatar } from "@/projects/community/locly/components/site/ui";
import {
  AdminButton,
  AdminPageHead,
  Cell,
  DetailRow,
  Drawer,
  Pagination,
  Panel,
  Row,
  SearchField,
  Select,
  StatusBadge,
  Table,
} from "@/projects/community/locly-admin/components/admin-ui";
import type { AdminTone } from "@/projects/community/locly-admin/components/admin-ui";

const STATUS_TONE: Record<AdminMember["status"], AdminTone> = {
  정상: "ok",
  제한: "danger",
  탈퇴: "neutral",
};

const ROLE_TONE: Record<AdminMember["role"], AdminTone> = {
  주민: "neutral",
  공식계정: "info",
  운영자: "info",
};

const PAGE_SIZE = 6;

export function AdminMembers() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminMember | null>(null);
  const [members, setMembers] = useState(ADMIN_MEMBERS);

  const filtered = useMemo(
    () =>
      members.filter((member) => {
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q || member.name.toLowerCase().includes(q) || member.email.toLowerCase().includes(q);
        return (
          matchQuery &&
          (status === "all" || member.status === status) &&
          (role === "all" || member.role === role)
        );
      }),
    [members, query, status, role],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function setMemberStatus(id: string, next: AdminMember["status"]) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: next } : m)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev));
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHead
        title="회원 관리"
        lead="가입한 주민 계정을 조회하고 권한과 이용 제한을 관리합니다. 공식계정은 구청·주민센터 담당자에게만 부여합니다."
        action={<AdminButton variant="primary">공식계정 발급</AdminButton>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "전체 회원", value: members.length, tone: "neutral" as const },
          {
            label: "이용 제한",
            value: members.filter((m) => m.status === "제한").length,
            tone: "danger" as const,
          },
          {
            label: "공식계정",
            value: members.filter((m) => m.role === "공식계정").length,
            tone: "info" as const,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[12px] border border-[var(--lc-hairline)] px-6 py-5"
          >
            <p className="text-[14px] text-[var(--lc-muted)]">{item.label}</p>
            <p className="text-[20px] font-semibold text-[var(--lc-ink)]">{item.value}</p>
          </div>
        ))}
      </div>

      <Panel padded={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--lc-hairline)] px-6 py-4">
          <SearchField value={query} onChange={setQuery} placeholder="닉네임 또는 이메일 검색" />
          <Select
            label="상태 필터"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "상태 전체" },
              { value: "정상", label: "정상" },
              { value: "제한", label: "제한" },
              { value: "탈퇴", label: "탈퇴" },
            ]}
          />
          <Select
            label="권한 필터"
            value={role}
            onChange={setRole}
            options={[
              { value: "all", label: "권한 전체" },
              { value: "주민", label: "주민" },
              { value: "공식계정", label: "공식계정" },
              { value: "운영자", label: "운영자" },
            ]}
          />
        </div>

        <Table head={["회원", "이메일", "권한", "가입일", "게시글", "상태", ""]}>
          {rows.map((member) => (
            <Row key={member.id} onClick={() => setSelected(member)}>
              <Cell strong>
                <span className="flex items-center gap-3">
                  <Avatar name={member.name} size={30} />
                  {member.name}
                </span>
              </Cell>
              <Cell>{member.email}</Cell>
              <Cell>
                <StatusBadge tone={ROLE_TONE[member.role]}>{member.role}</StatusBadge>
              </Cell>
              <Cell>{member.joinedAt}</Cell>
              <Cell>{member.posts}</Cell>
              <Cell>
                <StatusBadge tone={STATUS_TONE[member.status]}>{member.status}</StatusBadge>
              </Cell>
              <Cell align="right">
                <AdminButton size="sm" variant="quiet">
                  상세
                </AdminButton>
              </Cell>
            </Row>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-16 text-center text-[14px] text-[var(--lc-muted)]">
                조건에 맞는 회원이 없습니다.
              </td>
            </tr>
          )}
        </Table>

        <Pagination page={current} pageCount={pageCount} total={filtered.length} onChange={setPage} />
      </Panel>

      <Drawer
        open={!!selected}
        title={selected?.name ?? ""}
        subtitle={selected?.email}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <>
              <AdminButton onClick={() => setSelected(null)}>닫기</AdminButton>
              {selected.status === "제한" ? (
                <AdminButton variant="primary" onClick={() => setMemberStatus(selected.id, "정상")}>
                  <ShieldCheck size={15} />
                  제한 해제
                </AdminButton>
              ) : (
                <AdminButton variant="danger" onClick={() => setMemberStatus(selected.id, "제한")}>
                  <Prohibit size={15} />
                  이용 제한
                </AdminButton>
              )}
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="flex items-center gap-4 rounded-[12px] bg-[var(--lc-surface-card)] p-5">
              <Avatar name={selected.name} size={48} />
              <div>
                <p className="text-[15px] font-medium text-[var(--lc-ink)]">{selected.name}</p>
                <p className="mt-1 text-[13px] text-[var(--lc-muted)]">
                  가입 {selected.joinedAt} · 게시글 {selected.posts}개
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--lc-muted-soft)]">
                계정 정보
              </p>
              <div className="mt-3">
                <DetailRow label="상태">
                  <StatusBadge tone={STATUS_TONE[selected.status]}>{selected.status}</StatusBadge>
                </DetailRow>
                <DetailRow label="권한">
                  <StatusBadge tone={ROLE_TONE[selected.role]}>{selected.role}</StatusBadge>
                </DetailRow>
                <DetailRow label="이메일">{selected.email}</DetailRow>
                <DetailRow label="가입일">{selected.joinedAt}</DetailRow>
                <DetailRow label="작성 게시글">{selected.posts}개</DetailRow>
                <DetailRow label="최근 접속">2026.07.27 09:41</DetailRow>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--lc-muted-soft)]">
                운영 기록
              </p>
              <div className="mt-4 flex flex-col gap-4">
                {(selected.status === "제한"
                  ? [
                      { date: "2026.07.20", text: "광고성 게시글 반복 등록으로 30일 이용 제한" },
                      { date: "2026.07.14", text: "신고 3건 누적 경고 발송" },
                    ]
                  : [
                      { date: "2026.07.26", text: "커뮤니티 가이드 위반 이력 없음" },
                      { date: "2024.03.12", text: "휴대폰 본인확인으로 가입 완료" },
                    ]
                ).map((log) => (
                  <div key={log.date} className="flex gap-3">
                    <UserCircle size={16} className="mt-0.5 shrink-0 text-[var(--lc-muted-soft)]" />
                    <div>
                      <p className="text-[14px] leading-[1.5] text-[var(--lc-body)]">{log.text}</p>
                      <p className="mt-1 text-[12px] text-[var(--lc-muted-soft)]">{log.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
