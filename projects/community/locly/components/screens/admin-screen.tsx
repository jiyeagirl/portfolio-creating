"use client";

import { useMemo, useState } from "react";
import {
  Buildings,
  CalendarCheck,
  ChartBar,
  ChatsCircle,
  Gauge,
  HandsClapping,
  MagnifyingGlass,
  ShieldCheck,
  Storefront,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import {
  ADMIN_EVENT_APPROVALS,
  ADMIN_MEMBERS,
  ADMIN_REPORTS,
  ADMIN_STATS,
  ADMIN_STORE_APPROVALS,
  CIVIC_PROPOSALS,
  POLLS,
  STORES,
} from "@/projects/community/locly/lib/mock-data";
import type { AdminApproval, AdminMember } from "@/projects/community/locly/lib/types";
import { Avatar, Badge } from "@/projects/community/locly/components/layout/ui";

const SECTIONS = [
  { key: "overview", label: "개요", icon: Gauge },
  { key: "members", label: "회원 관리", icon: UsersThree },
  { key: "posts", label: "게시글 · 신고", icon: ChatsCircle },
  { key: "events", label: "행사 관리", icon: CalendarCheck },
  { key: "stores", label: "동네가게 관리", icon: Storefront },
  { key: "civic", label: "주민참여 관리", icon: HandsClapping },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

function ApprovalTone(status: AdminApproval["status"]) {
  if (status === "승인") return "success" as const;
  if (status === "반려") return "danger" as const;
  return "warning" as const;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
      <p className="text-[12.5px] font-medium text-[var(--locly-muted)]">{label}</p>
      <p className="mt-2 font-mono text-[26px] font-bold tracking-tight text-[var(--locly-ink)]">{value}</p>
      {sub && <p className="mt-1 text-[12px] text-[var(--locly-success)]">{sub}</p>}
    </div>
  );
}

export function AdminScreen() {
  const [section, setSection] = useState<SectionKey>("overview");
  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [reports, setReports] = useState(ADMIN_REPORTS);
  const [eventApprovals, setEventApprovals] = useState(ADMIN_EVENT_APPROVALS);
  const [storeApprovals, setStoreApprovals] = useState(ADMIN_STORE_APPROVALS);
  const [proposalStatus, setProposalStatus] = useState<Record<string, string>>({});

  const filteredMembers = useMemo(
    () =>
      ADMIN_MEMBERS.filter(
        (m) => m.name.includes(memberQuery) || m.email.toLowerCase().includes(memberQuery.toLowerCase()),
      ),
    [memberQuery],
  );

  const maxBoardValue = Math.max(...ADMIN_STATS.popularBoards.map((b) => b.value));
  const maxWeekly = Math.max(...ADMIN_STATS.weeklyVisits);
  const storesWithReviews = STORES.filter((s) => s.reviews.length > 0).flatMap((s) =>
    s.reviews.map((r) => ({ store: s.name, ...r })),
  );

  return (
    <div className="mx-auto flex max-w-[1360px] gap-8 px-6 pb-24 pt-8 lg:px-10">
      <aside className="hidden w-[220px] shrink-0 flex-col gap-1 lg:flex">
        <div className="mb-4 flex items-center gap-2 px-2">
          <ShieldCheck size={20} className="text-[var(--locly-accent)]" />
          <p className="text-[15px] font-bold text-[var(--locly-ink)]">운영자 콘솔</p>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
              section === s.key
                ? "bg-[var(--locly-ink)] text-[var(--locly-bg)]"
                : "text-[var(--locly-muted)] hover:bg-[var(--locly-surface)] hover:text-[var(--locly-ink)]"
            }`}
          >
            <s.icon size={16} />
            {s.label}
          </button>
        ))}
      </aside>

      <div className="min-w-0 flex-1">
        <div className="locly-scrollbar-none mb-6 flex items-center gap-2 overflow-x-auto lg:hidden">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
                section === s.key ? "bg-[var(--locly-ink)] text-[var(--locly-bg)]" : "border border-[var(--locly-border)] text-[var(--locly-muted)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {section === "overview" && (
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">운영 개요</h1>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="총 회원수" value={ADMIN_STATS.totalMembers.toLocaleString()} sub={`+${ADMIN_STATS.newMembersThisWeek} 이번 주`} />
              <StatCard label="총 게시글" value={ADMIN_STATS.totalPosts.toLocaleString()} sub={`오늘 +${ADMIN_STATS.postsToday}`} />
              <StatCard label="오늘 방문자" value={ADMIN_STATS.visitsToday.toLocaleString()} />
              <StatCard label="대기 중인 신고" value={String(reports.filter((r) => r.status === "대기").length)} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
                <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-[var(--locly-ink)]">
                  <ChartBar size={16} />
                  최근 7일 방문 추이
                </p>
                <div className="mt-4 flex items-end gap-2.5">
                  {ADMIN_STATS.weeklyVisits.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                      <div
                        className="w-full rounded-t-md bg-[var(--locly-accent)]"
                        style={{ height: `${(v / maxWeekly) * 96}px` }}
                      />
                      <span className="font-mono text-[10.5px] text-[var(--locly-muted)]">
                        {["월", "화", "수", "목", "금", "토", "일"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
                <p className="text-[13.5px] font-bold text-[var(--locly-ink)]">인기 게시판</p>
                <div className="mt-4 flex flex-col gap-3">
                  {ADMIN_STATS.popularBoards.map((b) => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-[12.5px]">
                        <span className="text-[var(--locly-ink)]">{b.label}</span>
                        <span className="font-mono text-[var(--locly-muted)]">{b.value.toLocaleString()}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--locly-surface)]">
                        <div
                          className="h-full rounded-full bg-[var(--locly-accent)]"
                          style={{ width: `${(b.value / maxBoardValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "members" && (
          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">회원 관리</h1>
              <div className="flex items-center gap-2 rounded-lg border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-3 py-2">
                <MagnifyingGlass size={15} className="text-[var(--locly-muted)]" />
                <input
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder="이름 또는 이메일 검색"
                  className="w-48 bg-transparent text-[13px] outline-none placeholder:text-[var(--locly-muted)]"
                />
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--locly-border)]">
              <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--locly-border)] bg-[var(--locly-surface)] text-[12px] font-semibold text-[var(--locly-muted)]">
                    <th className="px-4 py-3">회원</th>
                    <th className="px-4 py-3">역할</th>
                    <th className="px-4 py-3">가입일</th>
                    <th className="px-4 py-3">게시글</th>
                    <th className="px-4 py-3">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="cursor-pointer transition-colors hover:bg-[var(--locly-surface)]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={member.name} size={28} />
                          <div>
                            <p className="font-medium text-[var(--locly-ink)]">{member.name}</p>
                            <p className="text-[11.5px] text-[var(--locly-muted)]">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--locly-ink)]">{member.role}</td>
                      <td className="px-4 py-3 font-mono text-[12.5px] text-[var(--locly-muted)]">{member.joinedAt}</td>
                      <td className="px-4 py-3 font-mono text-[var(--locly-ink)]">{member.posts}</td>
                      <td className="px-4 py-3">
                        <Badge tone={member.status === "정상" ? "success" : member.status === "제한" ? "warning" : "danger"}>
                          {member.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 text-[12.5px] text-[var(--locly-muted)]">
              <span className="rounded-md bg-[var(--locly-ink)] px-2.5 py-1 font-mono text-[var(--locly-bg)]">1</span>
              <span className="rounded-md px-2.5 py-1 font-mono">2</span>
              <span className="rounded-md px-2.5 py-1 font-mono">3</span>
            </div>
          </div>
        )}

        {section === "posts" && (
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">게시글 · 신고 관리</h1>

            <p className="mt-6 text-[13.5px] font-bold text-[var(--locly-ink)]">신고 접수함</p>
            <div className="mt-3 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
              {reports.map((report) => (
                <div key={report.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[var(--locly-ink)]">{report.targetTitle}</p>
                    <p className="mt-1 text-[12px] text-[var(--locly-muted)]">
                      사유 · {report.reason} · 신고자 {report.reporter} · {report.createdAt}
                    </p>
                  </div>
                  {report.status === "대기" ? (
                    <button
                      onClick={() =>
                        setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: "처리완료" } : r)))
                      }
                      className="shrink-0 rounded-full bg-[var(--locly-ink)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--locly-bg)]"
                    >
                      처리 완료로 변경
                    </button>
                  ) : (
                    <Badge tone="success">처리완료</Badge>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 text-[13.5px] font-bold text-[var(--locly-ink)]">전체 게시글</p>
            <p className="mt-1 text-[12.5px] text-[var(--locly-muted)]">
              커뮤니티 화면과 동일한 데이터를 사용합니다. 삭제/공지 등록은 커뮤니티 상세에서 처리해요.
            </p>
          </div>
        )}

        {section === "events" && (
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">행사 관리</h1>
            <p className="mt-1 text-[13.5px] text-[var(--locly-muted)]">
              공식 행사 등록 및 주민 등록 행사 승인을 관리합니다
            </p>
            <div className="mt-5 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
              {eventApprovals.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[var(--locly-ink)]">{item.name}</p>
                    <p className="mt-1 text-[12px] text-[var(--locly-muted)]">
                      {item.category} · 신청자 {item.requester} · {item.requestedAt}
                    </p>
                  </div>
                  {item.status === "대기" ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() =>
                          setEventApprovals((prev) => prev.map((e) => (e.id === item.id ? { ...e, status: "승인" } : e)))
                        }
                        className="rounded-full bg-[var(--locly-success)] px-3.5 py-1.5 text-[12px] font-semibold text-white"
                      >
                        승인
                      </button>
                      <button
                        onClick={() =>
                          setEventApprovals((prev) => prev.map((e) => (e.id === item.id ? { ...e, status: "반려" } : e)))
                        }
                        className="rounded-full border border-[var(--locly-border)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--locly-muted)]"
                      >
                        반려
                      </button>
                    </div>
                  ) : (
                    <Badge tone={ApprovalTone(item.status)}>{item.status}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "stores" && (
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">동네가게 관리</h1>

            <p className="mt-6 text-[13.5px] font-bold text-[var(--locly-ink)]">가게 등록 승인</p>
            <div className="mt-3 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
              {storeApprovals.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[var(--locly-ink)]">{item.name}</p>
                    <p className="mt-1 text-[12px] text-[var(--locly-muted)]">
                      {item.category} · 신청자 {item.requester} · {item.requestedAt}
                    </p>
                  </div>
                  {item.status === "대기" ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() =>
                          setStoreApprovals((prev) => prev.map((s) => (s.id === item.id ? { ...s, status: "승인" } : s)))
                        }
                        className="rounded-full bg-[var(--locly-success)] px-3.5 py-1.5 text-[12px] font-semibold text-white"
                      >
                        승인
                      </button>
                      <button
                        onClick={() =>
                          setStoreApprovals((prev) => prev.map((s) => (s.id === item.id ? { ...s, status: "반려" } : s)))
                        }
                        className="rounded-full border border-[var(--locly-border)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--locly-muted)]"
                      >
                        반려
                      </button>
                    </div>
                  ) : (
                    <Badge tone={ApprovalTone(item.status)}>{item.status}</Badge>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 text-[13.5px] font-bold text-[var(--locly-ink)]">이벤트 · 후기 관리</p>
            <div className="mt-3 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
              {storesWithReviews.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={r.author} size={26} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-[var(--locly-ink)]">
                      <span className="font-semibold">{r.store}</span> · {r.content}
                    </p>
                  </div>
                  <button className="shrink-0 text-[12px] font-medium text-[var(--locly-muted)] hover:text-[var(--locly-danger)]">
                    숨김 처리
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "civic" && (
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--locly-ink)]">주민참여 관리</h1>

            <p className="mt-6 text-[13.5px] font-bold text-[var(--locly-ink)]">정책 제안 처리</p>
            <div className="mt-3 flex flex-col divide-y divide-[var(--locly-border)] rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)]">
              {CIVIC_PROPOSALS.map((proposal) => {
                const current = proposalStatus[proposal.id] ?? proposal.status;
                return (
                  <div key={proposal.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-[var(--locly-ink)]">{proposal.title}</p>
                      <p className="mt-1 text-[12px] text-[var(--locly-muted)]">
                        {proposal.author} · 공감 {proposal.agree} · {proposal.createdAt}
                      </p>
                    </div>
                    <select
                      value={current}
                      onChange={(e) => setProposalStatus((prev) => ({ ...prev, [proposal.id]: e.target.value }))}
                      className="shrink-0 rounded-full border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] px-3 py-1.5 text-[12px] font-semibold text-[var(--locly-ink)]"
                    >
                      <option value="접수">접수</option>
                      <option value="검토중">검토중</option>
                      <option value="답변완료">답변완료</option>
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-[var(--locly-ink)]">설문 · 투표 결과</p>
              <button className="rounded-full bg-[var(--locly-accent)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--locly-accent-foreground)]">
                새 설문 생성
              </button>
            </div>
            {POLLS.map((poll) => {
              const max = Math.max(...poll.options.map((o) => o.votes));
              return (
                <div key={poll.id} className="mt-3 rounded-2xl border border-[var(--locly-border)] bg-[var(--locly-surface-elevated)] p-5">
                  <p className="text-[13.5px] font-semibold text-[var(--locly-ink)]">{poll.title}</p>
                  <p className="mt-1 text-[12px] text-[var(--locly-muted)]">
                    마감 {poll.deadline} · 총 {poll.totalVotes.toLocaleString()}표
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    {poll.options.map((option) => (
                      <div key={option.label}>
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="text-[var(--locly-ink)]">{option.label}</span>
                          <span className="font-mono text-[var(--locly-muted)]">{option.votes.toLocaleString()}표</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--locly-surface)]">
                          <div className="h-full rounded-full bg-[var(--locly-accent)]" style={{ width: `${(option.votes / max) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={() => setSelectedMember(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-[380px] flex-col bg-[var(--locly-bg)] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-[var(--locly-ink)]">회원 상세</p>
              <button onClick={() => setSelectedMember(null)} className="text-[var(--locly-muted)] hover:text-[var(--locly-ink)]">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Avatar name={selectedMember.name} size={48} />
              <div>
                <p className="text-[15px] font-bold text-[var(--locly-ink)]">{selectedMember.name}</p>
                <p className="text-[12.5px] text-[var(--locly-muted)]">{selectedMember.email}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col divide-y divide-[var(--locly-border)] rounded-xl border border-[var(--locly-border)]">
              <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                <span className="text-[var(--locly-muted)]">역할</span>
                <span className="font-medium text-[var(--locly-ink)]">{selectedMember.role}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                <span className="text-[var(--locly-muted)]">가입일</span>
                <span className="font-mono text-[var(--locly-ink)]">{selectedMember.joinedAt}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                <span className="text-[var(--locly-muted)]">작성 게시글</span>
                <span className="font-mono text-[var(--locly-ink)]">{selectedMember.posts}건</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                <span className="text-[var(--locly-muted)]">상태</span>
                <Badge tone={selectedMember.status === "정상" ? "success" : selectedMember.status === "제한" ? "warning" : "danger"}>
                  {selectedMember.status}
                </Badge>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-full border border-[var(--locly-border)] py-2.5 text-[13px] font-semibold text-[var(--locly-ink)]">
                권한 변경
              </button>
              <button className="flex-1 rounded-full bg-[var(--locly-danger)] py-2.5 text-[13px] font-semibold text-white">
                이용 제한
              </button>
            </div>
            <p className="mt-auto flex items-center gap-1.5 pt-6 text-[11.5px] text-[var(--locly-muted)]">
              <Buildings size={13} />
              LOCLY 운영자 콘솔
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
