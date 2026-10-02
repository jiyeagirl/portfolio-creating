"use client";

import { useMemo, useState } from "react";
import { FileText, MagnifyingGlass, SealCheck } from "@phosphor-icons/react";
import {
  ADMIN_MEMBERS,
  CERT_REQUESTS,
  COMPANIES,
  formatDate,
} from "@/projects/community/linkon/lib/mock-data";
import type { AdminMember, CertRequest } from "@/projects/community/linkon/lib/types";
import {
  Badge,
  Chip,
  BrandMark,
  InitialMark,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/projects/community/linkon/components/layout/ui";
import {
  AdminSection,
  DefinitionRow,
  Drawer,
  TableAction,
  TableShell,
  Td,
  Th,
} from "@/projects/community/linkon-admin/components/admin-ui";

const STATUS_TONE = {
  활성: "success",
  승인대기: "warning",
  반려: "danger",
  비활성: "neutral",
} as const;

export function AdminMembers() {
  const [members, setMembers] = useState<AdminMember[]>(ADMIN_MEMBERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"전체" | AdminMember["status"]>("전체");
  const [selected, setSelected] = useState<AdminMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((member) => {
      if (status !== "전체" && member.status !== status) return false;
      if (!q) return true;
      return (
        member.company.toLowerCase().includes(q) ||
        member.contact.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q)
      );
    });
  }, [members, query, status]);

  const update = (id: string, patch: Partial<AdminMember>, message: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
    setToast(message);
  };

  const company = selected?.companyId ? COMPANIES.find((c) => c.id === selected.companyId) : undefined;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="flex items-center gap-2 rounded-xl bg-[var(--lk-success-soft)] px-4 py-3 text-[13px] font-semibold text-[var(--lk-success)]">
          <SealCheck size={15} weight="fill" />
          {toast}
          <button onClick={() => setToast(null)} className="ml-auto underline">
            닫기
          </button>
        </div>
      )}

      <AdminSection
        title="회원 목록"
        description={`총 ${members.length}명 중 ${filtered.length}명 표시`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-3.5 py-2.5">
            <MagnifyingGlass size={16} className="text-[var(--lk-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="기업명, 담당자, 이메일 검색"
              aria-label="회원 검색"
              className="w-full bg-transparent text-[13.5px] text-[var(--lk-ink)] outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["전체", "활성", "승인대기", "반려", "비활성"] as const).map((item) => (
              <Chip key={item} active={status === item} onClick={() => setStatus(item)}>
                {item}
              </Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass size={20} />}
            title="검색 결과가 없습니다"
            description="검색어 또는 상태 필터를 바꿔보세요."
          />
        ) : (
          <TableShell
            minWidth={1040}
            head={
              <>
                <Th>기업명</Th>
                <Th>담당자</Th>
                <Th>이메일</Th>
                <Th>권한</Th>
                <Th>산업 분야</Th>
                <Th>가입일</Th>
                <Th>최근 접속</Th>
                <Th>상태</Th>
                <Th className="text-right">관리</Th>
              </>
            }
          >
            {filtered.map((member) => (
              <tr key={member.id} className="transition-colors hover:bg-[var(--lk-bg)]">
                <Td className="font-semibold">
                  <button
                    onClick={() => setSelected(member)}
                    className="hover:text-[var(--lk-accent)]"
                  >
                    {member.company}
                  </button>
                </Td>
                <Td>{member.contact}</Td>
                <Td className="text-[var(--lk-muted)]">{member.email}</Td>
                <Td className="text-[var(--lk-muted)]">{member.role}</Td>
                <Td className="text-[var(--lk-muted)]">{member.industry}</Td>
                <Td className="lk-num text-[var(--lk-muted)]">{formatDate(member.joinedAt)}</Td>
                <Td className="lk-num text-[var(--lk-muted)]">{formatDate(member.lastActive)}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[member.status]}>{member.status}</Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    {member.status === "승인대기" ? (
                      <>
                        <TableAction
                          tone="accent"
                          onClick={() => update(member.id, { status: "활성" }, `${member.company} 가입을 승인했습니다.`)}
                        >
                          승인
                        </TableAction>
                        <TableAction
                          tone="danger"
                          onClick={() => update(member.id, { status: "반려" }, `${member.company} 가입을 반려했습니다.`)}
                        >
                          반려
                        </TableAction>
                      </>
                    ) : (
                      <>
                        <TableAction onClick={() => setSelected(member)}>상세</TableAction>
                        <TableAction
                          tone="danger"
                          onClick={() =>
                            update(
                              member.id,
                              { status: member.status === "비활성" ? "활성" : "비활성" },
                              member.status === "비활성"
                                ? `${member.company} 계정을 다시 활성화했습니다.`
                                : `${member.company} 계정을 비활성화했습니다.`,
                            )
                          }
                        >
                          {member.status === "비활성" ? "활성화" : "비활성화"}
                        </TableAction>
                      </>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </TableShell>
        )}
      </AdminSection>

      <Drawer
        open={Boolean(selected)}
        title="회원 상세"
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <div className="flex flex-wrap gap-2">
              <PrimaryButton
                size="sm"
                onClick={() =>
                  update(
                    selected.id,
                    { role: selected.role === "기업 담당자" ? "기업 대표" : "기업 담당자" },
                    `${selected.company} 권한을 변경했습니다.`,
                  )
                }
              >
                권한 변경
              </PrimaryButton>
              <SecondaryButton
                size="sm"
                onClick={() =>
                  update(
                    selected.id,
                    { status: selected.status === "비활성" ? "활성" : "비활성" },
                    selected.status === "비활성"
                      ? `${selected.company} 계정을 활성화했습니다.`
                      : `${selected.company} 계정을 비활성화했습니다.`,
                  )
                }
              >
                {selected.status === "비활성" ? "계정 활성화" : "계정 비활성화"}
              </SecondaryButton>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {company ? (
                <BrandMark logo={company.logo} size={48} />
              ) : (
                <InitialMark mark={selected.company.slice(0, 2)} tone="neutral" size={48} />
              )}
              <div>
                <p className="text-[16px] font-bold text-[var(--lk-ink)]">{selected.company}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--lk-muted)]">
                  {selected.contact} {selected.role}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)] px-4">
              <DefinitionRow label="이메일" value={selected.email} />
              <DefinitionRow label="산업 분야" value={selected.industry} />
              <DefinitionRow label="가입일" value={formatDate(selected.joinedAt)} />
              <DefinitionRow label="최근 접속" value={formatDate(selected.lastActive)} />
              <DefinitionRow
                label="상태"
                value={<Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>}
              />
            </dl>

            {company && (
              <div>
                <p className="text-[13.5px] font-bold text-[var(--lk-ink)]">기업 정보</p>
                <dl className="mt-2 divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)] px-4">
                  <DefinitionRow label="소속 기관" value={company.institution} />
                  <DefinitionRow label="선정 사업" value={company.program} />
                  <DefinitionRow label="협업 상태" value={company.collabStatus} />
                  <DefinitionRow label="지역" value={company.region} />
                  <DefinitionRow label="인원" value={`${company.employees}명`} />
                </dl>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--lk-muted)]">
                  {company.oneLiner}
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

const CERT_TONE = {
  심사대기: "warning",
  보완요청: "danger",
  승인: "success",
  반려: "danger",
} as const;

export function AdminCerts() {
  const [requests, setRequests] = useState<CertRequest[]>(CERT_REQUESTS);
  const [selected, setSelected] = useState<CertRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const decide = (id: string, status: CertRequest["status"], message: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected(null);
    setRejecting(false);
    setRejectReason("");
    setToast(message);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="flex items-center gap-2 rounded-xl bg-[var(--lk-success-soft)] px-4 py-3 text-[13px] font-semibold text-[var(--lk-success)]">
          <SealCheck size={15} weight="fill" />
          {toast}
          <button onClick={() => setToast(null)} className="ml-auto underline">
            닫기
          </button>
        </div>
      )}

      <AdminSection
        title="인증 서류 관리"
        description="사업자등록증과 선정 증빙을 확인한 뒤 승인 또는 반려를 처리합니다."
      >
        <TableShell
          minWidth={1040}
          head={
            <>
              <Th>기업명</Th>
              <Th>사업자등록번호</Th>
              <Th>대표자</Th>
              <Th>소속 기관</Th>
              <Th>선정 구분</Th>
              <Th>제출 서류</Th>
              <Th>제출일</Th>
              <Th>상태</Th>
              <Th className="text-right">심사</Th>
            </>
          }
        >
          {requests.map((request) => (
            <tr key={request.id} className="transition-colors hover:bg-[var(--lk-bg)]">
              <Td className="font-semibold">{request.company}</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{request.bizNumber}</Td>
              <Td>{request.ceo}</Td>
              <Td className="text-[var(--lk-muted)]">{request.institution}</Td>
              <Td className="text-[var(--lk-muted)]">{request.type}</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{request.documents.length}건</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{formatDate(request.submittedAt)}</Td>
              <Td>
                <Badge tone={CERT_TONE[request.status]}>{request.status}</Badge>
              </Td>
              <Td className="text-right">
                <TableAction tone="accent" onClick={() => setSelected(request)}>
                  서류 확인
                </TableAction>
              </Td>
            </tr>
          ))}
        </TableShell>
      </AdminSection>

      <Drawer
        open={Boolean(selected)}
        title="인증 서류 심사"
        onClose={() => {
          setSelected(null);
          setRejecting(false);
        }}
        footer={
          selected && (
            <div className="space-y-3">
              {rejecting && (
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="반려 사유를 입력하세요. 신청 기업에게 그대로 전달됩니다."
                  className={`${inputClass} resize-none`}
                />
              )}
              <div className="flex flex-wrap gap-2">
                <PrimaryButton
                  size="sm"
                  onClick={() => decide(selected.id, "승인", `${selected.company} 인증을 승인했습니다.`)}
                >
                  승인
                </PrimaryButton>
                <SecondaryButton
                  size="sm"
                  onClick={() =>
                    decide(selected.id, "보완요청", `${selected.company}에 서류 보완을 요청했습니다.`)
                  }
                >
                  보완 요청
                </SecondaryButton>
                {rejecting ? (
                  <button
                    onClick={() =>
                      rejectReason.trim()
                        ? decide(selected.id, "반려", `${selected.company} 인증을 반려했습니다.`)
                        : undefined
                    }
                    disabled={!rejectReason.trim()}
                    className="rounded-full bg-[var(--lk-danger)] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
                  >
                    반려 확정
                  </button>
                ) : (
                  <button
                    onClick={() => setRejecting(true)}
                    className="rounded-full border border-[var(--lk-danger)] px-4 py-2 text-[13px] font-semibold text-[var(--lk-danger)]"
                  >
                    반려
                  </button>
                )}
              </div>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <p className="text-[17px] font-bold text-[var(--lk-ink)]">{selected.company}</p>
              <p className="lk-num mt-1 text-[13px] text-[var(--lk-muted)]">
                제출일 {formatDate(selected.submittedAt)}
              </p>
            </div>

            <div>
              <p className="text-[13.5px] font-bold text-[var(--lk-ink)]">사업자 정보</p>
              <dl className="mt-2 divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)] px-4">
                <DefinitionRow label="사업자등록번호" value={selected.bizNumber} />
                <DefinitionRow label="대표자" value={selected.ceo} />
              </dl>
            </div>

            <div>
              <p className="text-[13.5px] font-bold text-[var(--lk-ink)]">기관 정보</p>
              <dl className="mt-2 divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)] px-4">
                <DefinitionRow label="소속 기관" value={selected.institution} />
                <DefinitionRow label="선정 사업" value={selected.program} />
                <DefinitionRow label="선정 구분" value={selected.type} />
              </dl>
            </div>

            <div>
              <p className="text-[13.5px] font-bold text-[var(--lk-ink)]">담당자</p>
              <dl className="mt-2 divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)] px-4">
                <DefinitionRow label="이름" value={`${selected.manager.name} ${selected.manager.role}`} />
                <DefinitionRow label="연락처" value={selected.manager.phone} />
                <DefinitionRow label="이메일" value={selected.manager.email} />
              </dl>
            </div>

            <div>
              <p className="text-[13.5px] font-bold text-[var(--lk-ink)]">제출 서류</p>
              <ul className="mt-2 space-y-2">
                {selected.documents.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-center gap-3 rounded-xl border border-[var(--lk-border)] px-4 py-3"
                  >
                    <FileText size={17} className="shrink-0 text-[var(--lk-accent)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                        {doc.name}
                      </span>
                      <span className="lk-num block text-[12px] text-[var(--lk-muted)]">
                        {doc.kind} {doc.size}
                      </span>
                    </span>
                    <TableAction tone="accent">열람</TableAction>
                  </li>
                ))}
              </ul>
              {selected.documents.every((d) => d.kind !== "사업자등록증") && (
                <p className="mt-3 rounded-lg bg-[var(--lk-warning-soft)] px-4 py-3 text-[12.5px] font-semibold text-[var(--lk-warning)]">
                  사업자등록증이 제출되지 않았습니다. 보완 요청이 필요합니다.
                </p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
