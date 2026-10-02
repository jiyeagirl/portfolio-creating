"use client";

import { House, Package, ShieldCheck } from "@phosphor-icons/react";
import { BarChart, Card, CardHead, PageHead, RankBars, Row, Stat, Table, Cell } from "@/projects/community/enclave/components/admin/admin-ui";
import {
  ADMIN_COMPLEXES,
  ADMIN_MEMBERS,
  DASHBOARD_CATEGORY_SHARE,
  DASHBOARD_DEAL_TREND,
  DASHBOARD_MEMBER_TREND,
  REPORTS,
} from "@/projects/community/enclave/lib/mock-data";

export function DashboardScreen({ onOpenReports }: { onOpenReports: () => void }) {
  const totalMembers = DASHBOARD_MEMBER_TREND[DASHBOARD_MEMBER_TREND.length - 1].value;
  const dealsThisMonth = DASHBOARD_DEAL_TREND[DASHBOARD_DEAL_TREND.length - 1].value;
  const pendingReports = REPORTS.filter((r) => r.status === "대기").length;
  const suspended = ADMIN_MEMBERS.filter((m) => m.status === "정지").length;
  const activeComplexes = ADMIN_COMPLEXES.filter((c) => c.verifyStatus === "승인완료").length;

  const recentPending = REPORTS.filter((r) => r.status === "대기").slice(0, 4);
  const lockerCount = ADMIN_COMPLEXES.reduce((sum, c) => sum + c.lockerCount, 0);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="Overview"
        title="관리자 대시보드"
        desc="가입, 거래, 단지 인증, 신고 현황을 한눈에 확인합니다. 2025년 3월 오픈 이후 누적 데이터입니다."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="전체 회원 수" value={totalMembers.toLocaleString("ko-KR")} delta="+218" note="전월 대비" />
        <Stat label="인증 완료 단지" value={`${activeComplexes}곳`} note="누적" />
        <Stat label="이번 달 거래 건수" value={`${dealsThisMonth.toLocaleString("ko-KR")}건`} delta="+29.2%" note="전월 대비" />
        <Stat label="신고 현황" value={`${pendingReports}건`} note="대기중" />
        <Stat label="정지 처리 회원" value={`${suspended}명`} note="누적" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="월별 가입자 추이" desc="2025년 3월부터 6월까지" />
          <BarChart data={DASHBOARD_MEMBER_TREND} format={(v) => `${v.toLocaleString("ko-KR")}명`} />
        </Card>
        <Card>
          <CardHead title="월별 거래 건수 추이" desc="2025년 3월부터 6월까지" />
          <BarChart data={DASHBOARD_DEAL_TREND} format={(v) => `${v.toLocaleString("ko-KR")}건`} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Card>
          <CardHead title="카테고리별 거래 비중" desc="2025년 6월 누적" />
          <RankBars data={DASHBOARD_CATEGORY_SHARE} />
        </Card>

        <Card>
          <CardHead
            title="최근 접수된 신고"
            desc="대기중인 신고 중 최근 4건"
            action={
              <button type="button" onClick={onOpenReports} className="text-[13px] font-medium text-[var(--ec-accent-ink)]">
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
        <div className="flex items-center gap-3 rounded-[8px] border border-[var(--ec-border)] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]">
            <ShieldCheck size={17} weight="fill" />
          </span>
          <div>
            <p className="tabular-nums text-[15px] font-semibold text-[var(--ec-ink)]">86.7%</p>
            <p className="text-[12px] text-[var(--ec-muted)]">단지 인증 완료율</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[8px] border border-[var(--ec-border)] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]">
            <Package size={17} weight="fill" />
          </span>
          <div>
            <p className="tabular-nums text-[15px] font-semibold text-[var(--ec-ink)]">{lockerCount}개</p>
            <p className="text-[12px] text-[var(--ec-muted)]">운영중인 무인택배함</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[8px] border border-[var(--ec-border)] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ec-warn-soft)] text-[var(--ec-warn)]">
            <House size={17} weight="fill" />
          </span>
          <div>
            <p className="tabular-nums text-[15px] font-semibold text-[var(--ec-ink)]">
              {ADMIN_COMPLEXES.filter((c) => c.verifyStatus === "승인대기").length}곳
            </p>
            <p className="text-[12px] text-[var(--ec-muted)]">단지 인증 승인 대기</p>
          </div>
        </div>
      </div>
    </div>
  );
}
