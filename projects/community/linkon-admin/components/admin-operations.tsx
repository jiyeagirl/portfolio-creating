"use client";

import { useState } from "react";
import { Megaphone, Plus, SealCheck } from "@phosphor-icons/react";
import {
  ADMIN_REPORTS,
  ADMIN_STATS,
  BOARD_POSTS,
  COLLAB_REQUESTS,
  COMPANIES,
  EVENTS,
  FEED_POSTS,
  PROGRAMS_LIST,
  companyById,
  formatDate,
  formatRelativeTime,
} from "@/projects/community/linkon/lib/mock-data";
import type { AdminReport, EventItem } from "@/projects/community/linkon/lib/types";
import {
  Badge,
  Chip,
  BrandMark,
  Field,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StatTile,
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

function applicantsFor(event: EventItem) {
  return COMPANIES.slice(0, Math.min(6, event.applied)).map((company, index) => ({
    company,
    appliedAt: `2026-07-${String(20 + (index % 6)).padStart(2, "0")}`,
    attended: index % 3 !== 2,
  }));
}

export function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>(EVENTS);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", date: "2026-09-10", capacity: "40", place: "" });
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const createEvent = () => {
    if (!draft.title.trim()) return;
    setEvents([
      {
        id: `local-e-${Date.now()}`,
        title: draft.title.trim(),
        type: "네트워킹",
        host: "나인창업지원재단",
        date: draft.date,
        time: "14:00 - 17:00",
        place: draft.place.trim() || "나인창업지원재단 3층 대회의실",
        capacity: Number(draft.capacity) || 40,
        applied: 0,
        status: "모집중",
        image: EVENTS[0].image,
      },
      ...events,
    ]);
    setDraft({ title: "", date: "2026-09-10", capacity: "40", place: "" });
    setCreating(false);
    setToast("행사를 등록했습니다.");
  };

  const setCapacity = (id: string, next: number) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, capacity: next } : e)));
  };

  return (
    <div className="space-y-10">
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
        title="행사 관리"
        description="네트워킹 데이, IR, 세미나 일정과 신청자를 관리합니다."
        action={
          <PrimaryButton size="sm" onClick={() => setCreating((v) => !v)}>
            <Plus size={15} weight="bold" />
            행사 등록
          </PrimaryButton>
        }
      >
        {creating && (
          <div className="mb-4 grid gap-4 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="행사명" required>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="예: 9월 입주기업 네트워킹 데이"
                className={inputClass}
              />
            </Field>
            <Field label="일자">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className={`${inputClass} lk-num`}
              />
            </Field>
            <Field label="모집 인원">
              <input
                value={draft.capacity}
                onChange={(e) => setDraft({ ...draft, capacity: e.target.value.replace(/[^0-9]/g, "") })}
                inputMode="numeric"
                className={`${inputClass} lk-num`}
              />
            </Field>
            <Field label="장소">
              <input
                value={draft.place}
                onChange={(e) => setDraft({ ...draft, place: e.target.value })}
                placeholder="장소를 입력하세요"
                className={inputClass}
              />
            </Field>
            <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-4">
              <PrimaryButton size="sm" onClick={createEvent}>
                등록
              </PrimaryButton>
              <SecondaryButton size="sm" onClick={() => setCreating(false)}>
                취소
              </SecondaryButton>
            </div>
          </div>
        )}

        <TableShell
          head={
            <>
              <Th>행사명</Th>
              <Th>구분</Th>
              <Th>일자</Th>
              <Th>장소</Th>
              <Th className="text-right">신청 현황</Th>
              <Th>모집 인원</Th>
              <Th>상태</Th>
              <Th className="text-right">관리</Th>
            </>
          }
        >
          {events.map((event) => (
            <tr key={event.id} className="transition-colors hover:bg-[var(--lk-bg)]">
              <Td className="font-semibold">{event.title}</Td>
              <Td className="text-[var(--lk-muted)]">{event.type}</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{formatDate(event.date)}</Td>
              <Td className="text-[var(--lk-muted)]">{event.place}</Td>
              <Td className="w-[160px] text-right">
                <span className="lk-num text-[13px] font-semibold text-[var(--lk-ink)]">
                  {event.applied} / {event.capacity}
                </span>
                <span className="mt-1.5 block">
                  <ProgressBar value={event.applied} max={event.capacity} />
                </span>
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCapacity(event.id, Math.max(1, event.capacity - 5))}
                    aria-label="모집 인원 감소"
                    className="h-7 w-7 rounded-full border border-[var(--lk-border)] text-[13px] font-bold text-[var(--lk-muted)] hover:border-[var(--lk-accent)]"
                  >
                    -
                  </button>
                  <span className="lk-num w-9 text-center text-[13px] font-semibold">
                    {event.capacity}
                  </span>
                  <button
                    onClick={() => setCapacity(event.id, event.capacity + 5)}
                    aria-label="모집 인원 증가"
                    className="h-7 w-7 rounded-full border border-[var(--lk-border)] text-[13px] font-bold text-[var(--lk-muted)] hover:border-[var(--lk-accent)]"
                  >
                    +
                  </button>
                </div>
              </Td>
              <Td>
                <Badge
                  tone={
                    event.status === "모집중"
                      ? "success"
                      : event.status === "모집마감"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {event.status}
                </Badge>
              </Td>
              <Td className="text-right">
                <TableAction tone="accent" onClick={() => setSelected(event)}>
                  신청자 관리
                </TableAction>
              </Td>
            </tr>
          ))}
        </TableShell>
      </AdminSection>

      <AdminSection
        title="프로그램 관리"
        description="장기 운영 프로그램의 일정과 신청 현황입니다."
        action={
          <SecondaryButton size="sm" onClick={() => setToast("프로그램 등록 양식을 열었습니다.")}>
            <Plus size={15} weight="bold" />
            프로그램 등록
          </SecondaryButton>
        }
      >
        <TableShell
          head={
            <>
              <Th>프로그램명</Th>
              <Th>운영 기간</Th>
              <Th>대상</Th>
              <Th className="text-right">신청 / 정원</Th>
              <Th>상태</Th>
              <Th className="text-right">관리</Th>
            </>
          }
        >
          {PROGRAMS_LIST.map((program) => (
            <tr key={program.id} className="transition-colors hover:bg-[var(--lk-bg)]">
              <Td className="font-semibold">{program.title}</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{program.period}</Td>
              <Td className="text-[var(--lk-muted)]">{program.target}</Td>
              <Td className="lk-num text-right">
                {program.applied} / {program.capacity}
              </Td>
              <Td>
                <Badge tone={program.status === "모집중" ? "success" : program.status === "운영중" ? "accent" : "neutral"}>
                  {program.status}
                </Badge>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <TableAction onClick={() => setToast(`${program.title} 일정을 수정했습니다.`)}>
                    일정 관리
                  </TableAction>
                  <TableAction
                    tone="accent"
                    onClick={() => setToast(`${program.title} 공지를 신청 기업에 발송했습니다.`)}
                  >
                    공지 발송
                  </TableAction>
                </div>
              </Td>
            </tr>
          ))}
        </TableShell>
      </AdminSection>

      <Drawer
        open={Boolean(selected)}
        title="신청자 관리"
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <PrimaryButton size="sm" full onClick={() => setToast("참석 명단을 저장했습니다.")}>
              참석 여부 저장
            </PrimaryButton>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-[16px] font-bold text-[var(--lk-ink)]">{selected.title}</p>
              <p className="lk-num mt-1 text-[13px] text-[var(--lk-muted)]">
                {formatDate(selected.date)} {selected.time} {selected.place}
              </p>
            </div>
            <dl className="divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)] px-4">
              <DefinitionRow label="모집 인원" value={`${selected.capacity}명`} />
              <DefinitionRow label="신청 인원" value={`${selected.applied}명`} />
              <DefinitionRow label="주관" value={selected.host} />
            </dl>
            <div>
              <p className="text-[13.5px] font-bold text-[var(--lk-ink)]">신청 기업</p>
              <ul className="mt-2 divide-y divide-[var(--lk-border)] rounded-xl border border-[var(--lk-border)]">
                {applicantsFor(selected).map(({ company, appliedAt, attended }) => {
                  const key = `${selected.id}-${company.id}`;
                  const checked = attendance[key] ?? attended;
                  return (
                    <li key={company.id} className="flex items-center gap-3 px-4 py-3">
                      <BrandMark logo={company.logo} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                          {company.name}
                        </span>
                        <span className="lk-num block text-[12px] text-[var(--lk-muted)]">
                          신청 {appliedAt}
                        </span>
                      </span>
                      <button
                        onClick={() => setAttendance((prev) => ({ ...prev, [key]: !checked }))}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                          checked
                            ? "bg-[var(--lk-success-soft)] text-[var(--lk-success)]"
                            : "bg-[var(--lk-surface)] text-[var(--lk-muted)]"
                        }`}
                      >
                        {checked ? "참석" : "미참석"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export function AdminNetwork() {
  const matched = COLLAB_REQUESTS.filter((c) => c.status === "성사").length;
  const inProgress = COLLAB_REQUESTS.filter((c) => c.status === "논의중" || c.status === "제안").length;

  const connections = COMPANIES.slice(0, 6).map((company, index) => ({
    company,
    partners: COMPANIES.filter((c) => c.id !== company.id).slice(index, index + 2),
    count: 2 + (index % 4),
  }));

  return (
    <div className="space-y-10">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="성사된 협업" value={matched} unit="건" delta="이번 분기 +3건" />
        <StatTile label="진행 중 협의" value={inProgress} unit="건" />
        <StatTile label="누적 매칭" value={ADMIN_STATS.collabMatches} unit="건" />
        <StatTile label="네트워킹 참여율" value={ADMIN_STATS.networkParticipation} unit="%" />
      </div>

      <AdminSection title="협업 요청 내역" description="기업 간 제안부터 종료까지의 진행 상태입니다.">
        <TableShell
          head={
            <>
              <Th>제안 기업</Th>
              <Th>대상 기업</Th>
              <Th>협업 주제</Th>
              <Th>요청일</Th>
              <Th>상태</Th>
              <Th className="text-right">관리</Th>
            </>
          }
        >
          {COLLAB_REQUESTS.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-[var(--lk-bg)]">
              <Td className="font-semibold">{item.from}</Td>
              <Td className="font-semibold">{item.to}</Td>
              <Td className="text-[var(--lk-muted)]">{item.topic}</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{formatDate(item.createdAt)}</Td>
              <Td>
                <Badge
                  tone={item.status === "성사" ? "success" : item.status === "종료" ? "neutral" : "accent"}
                >
                  {item.status}
                </Badge>
              </Td>
              <Td className="text-right">
                <TableAction>진행 기록</TableAction>
              </Td>
            </tr>
          ))}
        </TableShell>
      </AdminSection>

      <AdminSection title="기업 간 연결 현황" description="협업 이력이 있는 기업의 연결 관계입니다.">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {connections.map(({ company, partners, count }) => (
            <li
              key={company.id}
              className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5"
            >
              <div className="flex items-center gap-3">
                <BrandMark logo={company.logo} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-bold text-[var(--lk-ink)]">{company.name}</p>
                  <p className="lk-num text-[12px] text-[var(--lk-muted)]">연결 {count}곳</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {partners.map((partner) => (
                  <li key={partner.id} className="flex items-center gap-2.5">
                    <BrandMark logo={partner.logo} size={26} />
                    <span className="truncate text-[13px] text-[var(--lk-ink)]">{partner.name}</span>
                    <span className="ml-auto shrink-0 text-[12px] text-[var(--lk-muted)]">
                      {partner.industry}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </AdminSection>
    </div>
  );
}

const REPORT_TONE = {
  처리대기: "warning",
  처리완료: "success",
  반려: "neutral",
} as const;

export function AdminCommunity() {
  const [tab, setTab] = useState<"게시글" | "댓글" | "신고">("게시글");
  const [reports, setReports] = useState<AdminReport[]>(ADMIN_REPORTS);
  const [toast, setToast] = useState<string | null>(null);

  const comments = FEED_POSTS.flatMap((post) =>
    post.comments.map((comment) => ({ comment, post })),
  ).concat(
    BOARD_POSTS.flatMap((post) =>
      post.comments.map((comment) => ({
        comment: {
          id: `${post.id}-${comment.author}`,
          companyId: "",
          author: comment.author,
          content: comment.content,
          createdAt: comment.createdAt,
        },
        post: { id: post.id, content: post.title } as never,
      })),
    ),
  );

  const handleReport = (id: string, status: AdminReport["status"], message: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
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

      <div className="flex flex-wrap gap-2">
        {(["게시글", "댓글", "신고"] as const).map((item) => (
          <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
            {item} 관리
          </Chip>
        ))}
      </div>

      {tab === "게시글" && (
        <AdminSection title="게시글 관리" description="네트워킹 피드와 정보게시판 글을 함께 관리합니다.">
          <TableShell
            head={
              <>
                <Th>구분</Th>
                <Th>내용</Th>
                <Th>작성 주체</Th>
                <Th>등록일</Th>
                <Th className="text-right">반응</Th>
                <Th className="text-right">관리</Th>
              </>
            }
          >
            {FEED_POSTS.slice(0, 5).map((post) => {
              const company = companyById(post.companyId)!;
              return (
                <tr key={post.id} className="transition-colors hover:bg-[var(--lk-bg)]">
                  <Td>
                    <Badge tone="accent">피드</Badge>
                  </Td>
                  <Td className="max-w-[360px] truncate">{post.content}</Td>
                  <Td className="font-semibold">{company.name}</Td>
                  <Td className="lk-num text-[var(--lk-muted)]">{formatDate(post.createdAt)}</Td>
                  <Td className="lk-num text-right text-[var(--lk-muted)]">
                    좋아요 {post.likes} 댓글 {post.comments.length}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <TableAction onClick={() => setToast("게시글을 상단에 고정했습니다.")}>고정</TableAction>
                      <TableAction tone="danger" onClick={() => setToast("게시글을 숨김 처리했습니다.")}>
                        숨김
                      </TableAction>
                    </div>
                  </Td>
                </tr>
              );
            })}
            {BOARD_POSTS.slice(0, 4).map((post) => (
              <tr key={post.id} className="transition-colors hover:bg-[var(--lk-bg)]">
                <Td>
                  <Badge tone="neutral">게시판</Badge>
                </Td>
                <Td className="max-w-[360px] truncate">{post.title}</Td>
                <Td className="font-semibold">{post.authorOrg}</Td>
                <Td className="lk-num text-[var(--lk-muted)]">{formatDate(post.createdAt)}</Td>
                <Td className="lk-num text-right text-[var(--lk-muted)]">
                  조회 {post.views.toLocaleString()} 댓글 {post.comments.length}
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <TableAction onClick={() => setToast("게시글을 수정했습니다.")}>수정</TableAction>
                    <TableAction tone="danger" onClick={() => setToast("게시글을 숨김 처리했습니다.")}>
                      숨김
                    </TableAction>
                  </div>
                </Td>
              </tr>
            ))}
          </TableShell>
        </AdminSection>
      )}

      {tab === "댓글" && (
        <AdminSection title="댓글 관리" description="최근 등록된 댓글입니다.">
          <TableShell
            head={
              <>
                <Th>작성자</Th>
                <Th>댓글 내용</Th>
                <Th>등록</Th>
                <Th className="text-right">관리</Th>
              </>
            }
          >
            {comments.slice(0, 8).map(({ comment }, index) => (
              <tr key={`${comment.id}-${index}`} className="transition-colors hover:bg-[var(--lk-bg)]">
                <Td className="font-semibold">{comment.author}</Td>
                <Td className="max-w-[420px] truncate text-[var(--lk-muted)]">{comment.content}</Td>
                <Td className="lk-num text-[var(--lk-muted)]">
                  {formatRelativeTime(comment.createdAt)}
                </Td>
                <Td className="text-right">
                  <TableAction tone="danger" onClick={() => setToast("댓글을 삭제했습니다.")}>
                    삭제
                  </TableAction>
                </Td>
              </tr>
            ))}
          </TableShell>
        </AdminSection>
      )}

      {tab === "신고" && (
        <AdminSection title="신고 처리" description="접수된 신고를 확인하고 조치합니다.">
          <TableShell
            head={
              <>
                <Th>대상</Th>
                <Th>유형</Th>
                <Th>신고 사유</Th>
                <Th>신고자</Th>
                <Th>접수일</Th>
                <Th>상태</Th>
                <Th className="text-right">처리</Th>
              </>
            }
          >
            {reports.map((report) => (
              <tr key={report.id} className="transition-colors hover:bg-[var(--lk-bg)]">
                <Td className="font-semibold">{report.target}</Td>
                <Td className="text-[var(--lk-muted)]">{report.targetType}</Td>
                <Td className="max-w-[280px] truncate text-[var(--lk-muted)]">{report.reason}</Td>
                <Td className="text-[var(--lk-muted)]">{report.reporter}</Td>
                <Td className="lk-num text-[var(--lk-muted)]">{formatDate(report.createdAt)}</Td>
                <Td>
                  <Badge tone={REPORT_TONE[report.status]}>{report.status}</Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <TableAction
                      tone="accent"
                      onClick={() => handleReport(report.id, "처리완료", "신고를 처리했습니다.")}
                    >
                      조치
                    </TableAction>
                    <TableAction
                      onClick={() => handleReport(report.id, "반려", "신고를 반려했습니다.")}
                    >
                      반려
                    </TableAction>
                  </div>
                </Td>
              </tr>
            ))}
          </TableShell>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-5 py-4">
            <Megaphone size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--lk-accent)]" />
            <p className="text-[13px] leading-relaxed text-[var(--lk-muted)]">
              동일 기업에 신고가 3건 이상 누적되면 자동으로 활동 제한이 검토됩니다. 조치 결과는 신고자와
              대상 기업 모두에게 통보됩니다.
            </p>
          </div>
        </AdminSection>
      )}
    </div>
  );
}
