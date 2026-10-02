"use client";

import { ArrowDown, ArrowUp, Eye, Flag, NotePencil, UsersThree } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  ADMIN_EVENT_APPROVALS,
  ADMIN_REPORTS,
  ADMIN_STATS,
  ADMIN_STORE_APPROVALS,
  CIVIC_PROPOSALS,
  POSTS,
  boardLabel,
} from "@/projects/community/locly/lib/mock-data";
import {
  AdminButton,
  AdminPageHead,
  AreaChart,
  BarList,
  Panel,
  StatusBadge,
  formatAdminDate,
} from "@/projects/community/locly-admin/components/admin-ui";
import type { AdminSection } from "@/projects/community/locly-admin/components/admin-ui";

const DAY_LABELS = ["7/21", "7/22", "7/23", "7/24", "7/25", "7/26", "7/27"];

function StatTile({
  icon: TileIcon,
  label,
  value,
  delta,
  trend,
}: {
  icon: Icon;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}) {
  return (
    <div className="rounded-[12px] border border-[var(--lc-hairline)] bg-[var(--lc-canvas)] p-6">
      <div className="flex items-center gap-2 text-[var(--lc-muted)]">
        <TileIcon size={16} />
        <p className="text-[13px]">{label}</p>
      </div>
      <p className="mt-4 text-[30px] font-semibold leading-none tracking-[-0.02em] text-[var(--lc-ink)]">
        {value}
      </p>
      <p
        className={`mt-3 inline-flex items-center gap-1 text-[13px] font-medium ${
          trend === "up" ? "text-[var(--lc-success)]" : "text-[var(--lc-error)]"
        }`}
      >
        {trend === "up" ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
        {delta}
      </p>
    </div>
  );
}

export function AdminOverview({ onSection }: { onSection: (section: AdminSection) => void }) {
  const pendingReports = ADMIN_REPORTS.filter((r) => r.status === "대기");
  const pendingEvents = ADMIN_EVENT_APPROVALS.filter((a) => a.status === "대기");
  const pendingStores = ADMIN_STORE_APPROVALS.filter((a) => a.status === "대기");
  const pendingCivic = CIVIC_PROPOSALS.filter((p) => p.status !== "답변완료");
  const pendingTotal =
    pendingReports.length + pendingEvents.length + pendingStores.length + pendingCivic.length;

  const recentPosts = [...POSTS]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  const queue: { label: string; count: number; section: AdminSection; detail: string }[] = [
    {
      label: "신고 처리 대기",
      count: pendingReports.length,
      section: "posts",
      detail: pendingReports[0]?.reason ?? "대기 중인 신고 없음",
    },
    {
      label: "주민 행사 승인 대기",
      count: pendingEvents.length,
      section: "events",
      detail: pendingEvents[0]?.name ?? "대기 중인 요청 없음",
    },
    {
      label: "가게 등록 승인 대기",
      count: pendingStores.length,
      section: "stores",
      detail: pendingStores[0]?.name ?? "대기 중인 요청 없음",
    },
    {
      label: "정책 제안 답변 대기",
      count: pendingCivic.length,
      section: "civic",
      detail: pendingCivic[0]?.title ?? "대기 중인 제안 없음",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHead
        title="운영 현황"
        lead="나인동 LOCLY 커뮤니티의 오늘 지표와 처리해야 할 항목을 한 화면에서 확인합니다."
        action={
          <div className="flex items-center gap-2">
            <StatusBadge tone={pendingTotal > 0 ? "wait" : "ok"}>
              처리 대기 {pendingTotal}건
            </StatusBadge>
            <AdminButton onClick={() => onSection("posts")}>신고함 열기</AdminButton>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={UsersThree}
          label="전체 회원"
          value={ADMIN_STATS.totalMembers.toLocaleString()}
          delta={`이번 주 +${ADMIN_STATS.newMembersThisWeek}명`}
          trend="up"
        />
        <StatTile
          icon={NotePencil}
          label="누적 게시글"
          value={ADMIN_STATS.totalPosts.toLocaleString()}
          delta={`오늘 +${ADMIN_STATS.postsToday}건`}
          trend="up"
        />
        <StatTile
          icon={Eye}
          label="오늘 방문"
          value={ADMIN_STATS.visitsToday.toLocaleString()}
          delta="어제 대비 -6.9%"
          trend="down"
        />
        <StatTile
          icon={Flag}
          label="미처리 신고"
          value={String(pendingReports.length)}
          delta="평균 처리 4.2시간"
          trend="up"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="주간 방문자 추이" meta="7/21 – 7/27">
          <AreaChart values={ADMIN_STATS.weeklyVisits} labels={DAY_LABELS} />
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--lc-hairline)] pt-5">
            {[
              { label: "주간 합계", value: ADMIN_STATS.weeklyVisits.reduce((a, b) => a + b, 0) },
              {
                label: "일 평균",
                value: Math.round(
                  ADMIN_STATS.weeklyVisits.reduce((a, b) => a + b, 0) / ADMIN_STATS.weeklyVisits.length,
                ),
              },
              { label: "최고 (7/26)", value: Math.max(...ADMIN_STATS.weeklyVisits) },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[13px] text-[var(--lc-muted)]">{item.label}</p>
                <p className="mt-1.5 text-[18px] font-medium text-[var(--lc-ink)]">
                  {item.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="인기 게시판" meta="최근 30일 조회">
          <BarList items={ADMIN_STATS.popularBoards} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="처리 대기" meta={`${pendingTotal}건`} padded={false}>
          <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
            {queue.map((item) => (
              <button
                key={item.label}
                onClick={() => onSection(item.section)}
                className="flex items-center gap-4 px-6 py-4 text-left transition-colors active:bg-[var(--lc-surface-soft)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[var(--lc-ink)]">{item.label}</p>
                  <p className="mt-1 truncate text-[13px] text-[var(--lc-muted)]">{item.detail}</p>
                </div>
                <StatusBadge tone={item.count > 0 ? "wait" : "ok"}>{item.count}</StatusBadge>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="최근 등록된 게시글" meta="실시간" padded={false}>
          <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-[var(--lc-ink)]">{post.title}</p>
                  <p className="mt-1 text-[13px] text-[var(--lc-muted)]">
                    {post.author} · {boardLabel(post.board)} · 조회 {post.views.toLocaleString()}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] text-[var(--lc-muted-soft)]">
                  {formatAdminDate(post.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
