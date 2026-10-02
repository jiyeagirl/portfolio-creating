"use client";

import { useMemo, useState } from "react";
import { CheckCircle, EyeSlash, Warning } from "@phosphor-icons/react";
import { ADMIN_REPORTS, BOARDS, POSTS, boardLabel } from "@/projects/community/locly/lib/mock-data";
import type { AdminReport } from "@/projects/community/locly/lib/types";
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
  Tabs,
  formatAdminDate,
} from "@/projects/community/locly-admin/components/admin-ui";

const PAGE_SIZE = 6;

export function AdminPosts() {
  const [tab, setTab] = useState<"reports" | "posts">("reports");
  const [reports, setReports] = useState(ADMIN_REPORTS);
  const [selected, setSelected] = useState<AdminReport | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);

  const [query, setQuery] = useState("");
  const [board, setBoard] = useState("all");
  const [page, setPage] = useState(1);

  const pending = reports.filter((r) => r.status === "대기");

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTS.filter(
      (post) =>
        (!q || post.title.toLowerCase().includes(q) || post.author.toLowerCase().includes(q)) &&
        (board === "all" || post.board === board),
    ).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [query, board]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filteredPosts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function resolve(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "처리완료" } : r)));
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHead
        title="게시글 · 신고 관리"
        lead="주민이 접수한 신고를 확인해 처리하고, 게시판에 올라온 글을 직접 관리합니다."
        action={
          <StatusBadge tone={pending.length > 0 ? "wait" : "ok"}>
            미처리 신고 {pending.length}건
          </StatusBadge>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "reports", label: "신고 관리", count: reports.length },
          { key: "posts", label: "게시글 관리", count: POSTS.length },
        ]}
      />

      {tab === "reports" && (
        <Panel padded={false}>
          <Table head={["신고 대상", "사유", "신고자", "접수일", "상태", ""]}>
            {reports.map((report) => (
              <Row key={report.id} onClick={() => setSelected(report)}>
                <Cell strong>
                  <span className="flex items-center gap-2">
                    {report.status === "대기" && (
                      <Warning size={15} weight="fill" className="shrink-0 text-[var(--lc-warning)]" />
                    )}
                    <span className="line-clamp-1 max-w-[380px]">{report.targetTitle}</span>
                  </span>
                </Cell>
                <Cell>{report.reason}</Cell>
                <Cell>{report.reporter}</Cell>
                <Cell>{report.createdAt}</Cell>
                <Cell>
                  <StatusBadge tone={report.status === "대기" ? "wait" : "ok"}>
                    {report.status}
                  </StatusBadge>
                </Cell>
                <Cell align="right">
                  <AdminButton size="sm" variant="quiet">
                    처리
                  </AdminButton>
                </Cell>
              </Row>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "posts" && (
        <Panel padded={false}>
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--lc-hairline)] px-6 py-4">
            <SearchField value={query} onChange={setQuery} placeholder="제목 또는 작성자 검색" />
            <Select
              label="게시판 필터"
              value={board}
              onChange={setBoard}
              options={[
                { value: "all", label: "게시판 전체" },
                ...BOARDS.map((b) => ({ value: b.key, label: b.label })),
              ]}
            />
          </div>

          <Table head={["제목", "게시판", "작성자", "작성일", "조회", "상태", ""]}>
            {rows.map((post) => {
              const isHidden = hidden.includes(post.id);
              return (
                <Row key={post.id}>
                  <Cell strong>
                    <span className="line-clamp-1 max-w-[360px]">{post.title}</span>
                  </Cell>
                  <Cell>{boardLabel(post.board)}</Cell>
                  <Cell>{post.author}</Cell>
                  <Cell>{formatAdminDate(post.createdAt)}</Cell>
                  <Cell>{post.views.toLocaleString()}</Cell>
                  <Cell>
                    <StatusBadge tone={isHidden ? "danger" : post.isNotice ? "info" : "ok"}>
                      {isHidden ? "숨김" : post.isNotice ? "공지" : "게시중"}
                    </StatusBadge>
                  </Cell>
                  <Cell align="right">
                    <AdminButton
                      size="sm"
                      variant={isHidden ? "secondary" : "quiet"}
                      onClick={() =>
                        setHidden((prev) =>
                          isHidden ? prev.filter((id) => id !== post.id) : [...prev, post.id],
                        )
                      }
                    >
                      {isHidden ? (
                        "게시 복구"
                      ) : (
                        <>
                          <EyeSlash size={14} />
                          숨김
                        </>
                      )}
                    </AdminButton>
                  </Cell>
                </Row>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-[14px] text-[var(--lc-muted)]">
                  조건에 맞는 게시글이 없습니다.
                </td>
              </tr>
            )}
          </Table>

          <Pagination
            page={current}
            pageCount={pageCount}
            total={filteredPosts.length}
            onChange={setPage}
          />
        </Panel>
      )}

      <Drawer
        open={!!selected}
        title="신고 처리"
        subtitle={selected ? `접수 ${selected.createdAt} · ${selected.reporter}` : undefined}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <>
              <AdminButton onClick={() => resolve(selected.id)}>신고 반려</AdminButton>
              <AdminButton variant="danger" onClick={() => resolve(selected.id)}>
                <EyeSlash size={15} />
                게시글 숨김 처리
              </AdminButton>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="rounded-[12px] bg-[var(--lc-surface-card)] p-5">
              <p className="text-[13px] text-[var(--lc-muted)]">신고 대상</p>
              <p className="mt-2 text-[15px] font-medium leading-[1.5] text-[var(--lc-ink)]">
                {selected.targetTitle}
              </p>
            </div>

            <div className="mt-6">
              <DetailRow label="신고 사유">{selected.reason}</DetailRow>
              <DetailRow label="신고자">{selected.reporter}</DetailRow>
              <DetailRow label="접수일">{selected.createdAt}</DetailRow>
              <DetailRow label="처리 상태">
                <StatusBadge tone={selected.status === "대기" ? "wait" : "ok"}>
                  {selected.status}
                </StatusBadge>
              </DetailRow>
              <DetailRow label="동일 대상 누적 신고">
                {selected.status === "대기" ? "2건" : "1건"}
              </DetailRow>
            </div>

            <div className="mt-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--lc-muted-soft)]">
                처리 메모
              </p>
              <textarea
                rows={4}
                placeholder="처리 사유를 남기면 신고자에게 결과 알림이 발송됩니다."
                className="mt-3 w-full resize-none rounded-[8px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] p-4 text-[14px] leading-[1.6] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-muted-soft)] focus:border-[var(--lc-primary)]"
              />
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-[8px] bg-[var(--lc-surface-soft)] p-4">
              <CheckCircle size={16} className="mt-0.5 shrink-0 text-[var(--lc-teal)]" />
              <p className="text-[13px] leading-[1.55] text-[var(--lc-body)]">
                숨김 처리된 게시글은 작성자 본인에게만 보이며, 7일 내 이의 신청이 없으면 자동으로
                삭제됩니다.
              </p>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
