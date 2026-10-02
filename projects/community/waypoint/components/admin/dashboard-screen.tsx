"use client";

import { ShieldCheck, UserMinus, UsersThree } from "@phosphor-icons/react";
import { BarChart, Card, CardHead, PageHead, RankBars, Row, Stat, Table, Cell } from "@/projects/community/waypoint/components/admin/admin-ui";
import {
  ADMIN_MEMBERS,
  DASHBOARD_CATEGORY_SHARE,
  DASHBOARD_DEAL_TREND,
  DASHBOARD_MEMBER_TREND,
  REPORTS,
} from "@/projects/community/waypoint/lib/mock-data";

export function DashboardScreen({ onOpenReports }: { onOpenReports: () => void }) {
  const totalMembers = 6380;
  const todaySignups = 34;
  const dealsThisMonth = DASHBOARD_DEAL_TREND[DASHBOARD_DEAL_TREND.length - 1].value;
  const pendingReports = REPORTS.filter((r) => r.status === "대기").length;
  const suspended = ADMIN_MEMBERS.filter((m) => m.status === "정지").length;

  const recentPending = REPORTS.filter((r) => r.status === "대기").slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="Overview"
        title="관리자 대시보드"
        desc="가입, 거래, 신고 현황을 한눈에 확인합니다. 2025년 10월 오픈 이후 누적 데이터입니다."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="전체 회원 수" value={totalMembers.toLocaleString("ko-KR")} delta="+286" note="전일 대비" />
        <Stat label="오늘 가입자" value={`${todaySignups}명`} delta="+6" note="전일 대비" />
        <Stat label="이번 달 거래 건수" value={`${dealsThisMonth.toLocaleString("ko-KR")}건`} delta="+19.9%" note="전월 대비" />
        <Stat label="신고 현황" value={`${pendingReports}건`} note="대기중" />
        <Stat label="차단 회원 수" value={`${suspended}명`} note="누적" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="월별 가입자 추이" desc="2025년 10월부터 2026년 2월까지" />
          <BarChart data={DASHBOARD_MEMBER_TREND} format={(v) => `${v.toLocaleString("ko-KR")}명`} />
        </Card>
        <Card>
          <CardHead title="월별 거래 건수 추이" desc="2025년 10월부터 2026년 2월까지" />
          <BarChart data={DASHBOARD_DEAL_TREND} format={(v) => `${v.toLocaleString("ko-KR")}건`} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Card>
          <CardHead title="카테고리별 거래 비중" desc="2026년 2월 누적" />
          <RankBars data={DASHBOARD_CATEGORY_SHARE} />
        </Card>

        <Card>
          <CardHead
            title="최근 접수된 신고"
            desc="대기중인 신고 중 최근 4건"
            action={
              <button type="button" onClick={onOpenReports} className="text-[13px] font-medium text-[var(--wp-accent-ink)]">
                전체 보기
              </button>
            }
          />
          <Table head={["유형", "대상", "신고자", "접수일"]}>
            {recentPending.map((r) => (
              <Row key={r.id}>
                <Cell strong>{r.type}</Cell>
                <Cell muted>{r.targetLabel}</Cell>
                <Cell>{r.reporterNickname}</Cell>
                <Cell mono muted nowrap>
                  {r.createdAt}
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-[8px] border border-[var(--wp-border)] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wp-success-soft)] text-[var(--wp-success)]">
            <ShieldCheck size={17} weight="fill" />
          </span>
          <div>
            <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">92.4%</p>
            <p className="text-[12px] text-[var(--wp-muted)]">듀얼 인증 완료율</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[8px] border border-[var(--wp-border)] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wp-accent-soft)] text-[var(--wp-accent-ink)]">
            <UsersThree size={17} weight="fill" />
          </span>
          <div>
            <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">1,120건</p>
            <p className="text-[12px] text-[var(--wp-muted)]">웨이스팟 거래 성사</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[8px] border border-[var(--wp-border)] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wp-warn-soft)] text-[var(--wp-warn)]">
            <UserMinus size={17} weight="fill" />
          </span>
          <div>
            <p className="tabular-nums text-[15px] font-semibold text-[var(--wp-ink)]">{suspended}명</p>
            <p className="text-[12px] text-[var(--wp-muted)]">정지 처리 회원</p>
          </div>
        </div>
      </div>
    </div>
  );
}
