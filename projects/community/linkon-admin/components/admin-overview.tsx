"use client";

import {
  ChatCircleDots,
  ClipboardText,
  Handshake,
  Note,
  TrendUp,
  UserCheck,
  Users,
} from "@phosphor-icons/react";
import {
  ADMIN_MEMBERS,
  ADMIN_STATS,
  BOARD_POSTS,
  CERT_REQUESTS,
  COLLAB_REQUESTS,
  formatDate,
  formatRelativeTime,
} from "@/projects/community/linkon/lib/mock-data";
import { Badge, StatTile } from "@/projects/community/linkon/components/layout/ui";
import {
  AdminSection,
  BarRow,
  TableAction,
  TableShell,
  Td,
  Th,
} from "@/projects/community/linkon-admin/components/admin-ui";

const WEEK_LABELS = ["7.21", "7.22", "7.23", "7.24", "7.25", "7.26", "7.27"];

export function AdminDashboard({ onOpenCerts }: { onOpenCerts: () => void }) {
  const maxWeekly = Math.max(...ADMIN_STATS.weeklyActive);
  const pending = CERT_REQUESTS.filter((c) => c.status === "심사대기" || c.status === "보완요청");
  const recentSignups = [...ADMIN_MEMBERS]
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="전체 회원"
          value={ADMIN_STATS.totalMembers}
          unit="명"
          delta={`이번 달 +${ADMIN_STATS.memberDelta}명`}
          icon={<Users size={17} />}
        />
        <StatTile
          label="승인 대기 기업"
          value={ADMIN_STATS.pendingCerts}
          unit="건"
          icon={<UserCheck size={17} />}
        />
        <StatTile
          label="이번 달 신규 가입"
          value={ADMIN_STATS.newThisMonth}
          unit="곳"
          delta="전월 대비 +8곳"
          icon={<TrendUp size={17} />}
        />
        <StatTile
          label="성사된 협업"
          value={ADMIN_STATS.collabMatches}
          unit="건"
          delta="분기 누적"
          icon={<Handshake size={17} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[14px] font-bold text-[var(--lk-ink)]">일간 활성 사용자</p>
              <p className="mt-1 text-[12.5px] text-[var(--lk-muted)]">최근 7일 로그인 기준</p>
            </div>
            <p className="lk-num text-[26px] font-bold leading-none text-[var(--lk-ink)]">
              {ADMIN_STATS.dau}
              <span className="ml-1 text-[13px] font-semibold text-[var(--lk-muted)]">명</span>
            </p>
          </div>
          <div className="mt-7 flex h-[150px] items-end gap-3">
            {ADMIN_STATS.weeklyActive.map((value, index) => (
              <div key={WEEK_LABELS[index]} className="flex flex-1 flex-col items-center gap-2">
                <span className="lk-num text-[11.5px] font-semibold text-[var(--lk-muted)]">{value}</span>
                <span
                  className={`w-full rounded-t-md ${
                    index === ADMIN_STATS.weeklyActive.length - 1
                      ? "bg-[var(--lk-accent)]"
                      : "bg-[var(--lk-accent-soft)]"
                  }`}
                  style={{ height: `${(value / maxWeekly) * 110}px` }}
                />
                <span className="lk-num text-[11.5px] text-[var(--lk-muted)]">{WEEK_LABELS[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">커뮤니티 현황</p>
            <dl className="mt-4 space-y-3">
              {[
                { label: "누적 게시글", value: ADMIN_STATS.posts, icon: Note },
                { label: "누적 댓글", value: ADMIN_STATS.comments, icon: ChatCircleDots },
                { label: "프로그램 신청", value: ADMIN_STATS.programApplications, icon: ClipboardText },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lk-surface)] text-[var(--lk-accent)]">
                    <item.icon size={16} weight="fill" />
                  </span>
                  <dt className="flex-1 text-[13.5px] text-[var(--lk-muted)]">{item.label}</dt>
                  <dd className="lk-num text-[16px] font-bold text-[var(--lk-ink)]">
                    {item.value.toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">네트워킹 참여율</p>
            <p className="lk-num mt-3 text-[30px] font-bold leading-none text-[var(--lk-ink)]">
              {ADMIN_STATS.networkParticipation}
              <span className="ml-1 text-[15px] font-semibold text-[var(--lk-muted)]">%</span>
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
              최근 90일 내 채팅, 협업 제안, 행사 참여 중 하나 이상을 한 회원사 비율입니다.
            </p>
          </div>
        </div>
      </div>

      <AdminSection
        title="승인 대기 기업"
        description="제출 순서대로 표시되며, 서류를 열어 바로 심사할 수 있습니다."
        action={<TableAction tone="accent" onClick={onOpenCerts}>인증 서류 관리로 이동</TableAction>}
      >
        <TableShell
          head={
            <>
              <Th>기업명</Th>
              <Th>소속 기관</Th>
              <Th>선정 구분</Th>
              <Th>제출일</Th>
              <Th>상태</Th>
            </>
          }
        >
          {pending.map((request) => (
            <tr key={request.id}>
              <Td className="font-semibold">{request.company}</Td>
              <Td className="text-[var(--lk-muted)]">{request.institution}</Td>
              <Td className="text-[var(--lk-muted)]">{request.type}</Td>
              <Td className="lk-num text-[var(--lk-muted)]">{formatDate(request.submittedAt)}</Td>
              <Td>
                <Badge tone={request.status === "심사대기" ? "warning" : "danger"}>
                  {request.status}
                </Badge>
              </Td>
            </tr>
          ))}
        </TableShell>
      </AdminSection>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminSection title="최근 가입 현황">
          <ul className="divide-y divide-[var(--lk-border)] rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)]">
            {recentSignups.map((member) => (
              <li key={member.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[var(--lk-ink)]">
                    {member.company}
                  </p>
                  <p className="truncate text-[12.5px] text-[var(--lk-muted)]">
                    {member.contact} {member.industry}
                  </p>
                </div>
                <span className="lk-num shrink-0 text-[12.5px] text-[var(--lk-muted)]">
                  {formatDate(member.joinedAt)}
                </span>
                <Badge
                  tone={
                    member.status === "활성"
                      ? "success"
                      : member.status === "승인대기"
                        ? "warning"
                        : member.status === "반려"
                          ? "danger"
                          : "neutral"
                  }
                >
                  {member.status}
                </Badge>
              </li>
            ))}
          </ul>
        </AdminSection>

        <AdminSection title="최근 협업 요청">
          <ul className="divide-y divide-[var(--lk-border)] rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)]">
            {COLLAB_REQUESTS.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[var(--lk-ink)]">{item.topic}</p>
                  <p className="truncate text-[12.5px] text-[var(--lk-muted)]">
                    제안 {item.from} · 대상 {item.to}
                  </p>
                </div>
                <span className="lk-num shrink-0 text-[12.5px] text-[var(--lk-muted)]">
                  {formatDate(item.createdAt)}
                </span>
                <Badge
                  tone={item.status === "성사" ? "success" : item.status === "종료" ? "neutral" : "accent"}
                >
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        </AdminSection>
      </div>
    </div>
  );
}

export function AdminStats() {
  const maxIndustry = Math.max(...ADMIN_STATS.industrySignups.map((i) => i.count));
  const topPosts = [...BOARD_POSTS].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-10">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="DAU" value={ADMIN_STATS.dau} unit="명" delta="전주 대비 +9.2%" />
        <StatTile label="MAU" value={ADMIN_STATS.mau} unit="명" delta="전월 대비 +6.4%" />
        <StatTile label="네트워킹 참여율" value={`${ADMIN_STATS.networkParticipation}`} unit="%" />
        <StatTile label="성사된 협업" value={ADMIN_STATS.collabMatches} unit="건" />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminSection title="산업 분야별 가입 현황" description="누적 승인 기업 기준입니다.">
          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-6 py-5">
            {ADMIN_STATS.industrySignups.map((item) => (
              <BarRow
                key={item.industry}
                label={item.industry}
                value={item.count}
                max={maxIndustry}
                suffix="곳"
              />
            ))}
          </div>
        </AdminSection>

        <AdminSection title="인기 기업" description="프로필 조회수와 협업 성사 건수 기준입니다.">
          <TableShell
            minWidth={380}
            head={
              <>
                <Th>순위</Th>
                <Th>기업명</Th>
                <Th className="text-right">협업</Th>
                <Th className="text-right">프로필 조회</Th>
              </>
            }
          >
            {ADMIN_STATS.topCompanies.map((company, index) => (
              <tr key={company.name}>
                <Td className="lk-num w-12 font-bold text-[var(--lk-accent)]">{index + 1}</Td>
                <Td className="font-semibold">{company.name}</Td>
                <Td className="lk-num text-right">{company.collabs}건</Td>
                <Td className="lk-num text-right text-[var(--lk-muted)]">
                  {company.views.toLocaleString()}
                </Td>
              </tr>
            ))}
          </TableShell>
        </AdminSection>
      </div>

      <AdminSection title="인기 게시글" description="최근 30일 조회수 기준 상위 5건입니다.">
        <TableShell
          head={
            <>
              <Th>제목</Th>
              <Th>카테고리</Th>
              <Th>작성 기관</Th>
              <Th className="text-right">조회</Th>
              <Th className="text-right">북마크</Th>
              <Th className="text-right">등록일</Th>
            </>
          }
        >
          {topPosts.map((post) => (
            <tr key={post.id}>
              <Td className="max-w-[320px] truncate font-semibold">{post.title}</Td>
              <Td>
                <Badge tone="neutral">{post.category}</Badge>
              </Td>
              <Td className="text-[var(--lk-muted)]">{post.authorOrg}</Td>
              <Td className="lk-num text-right">{post.views.toLocaleString()}</Td>
              <Td className="lk-num text-right text-[var(--lk-muted)]">{post.bookmarks}</Td>
              <Td className="lk-num text-right text-[var(--lk-muted)]">
                {formatRelativeTime(post.createdAt)}
              </Td>
            </tr>
          ))}
        </TableShell>
      </AdminSection>
    </div>
  );
}
