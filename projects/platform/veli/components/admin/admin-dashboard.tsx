"use client";

import { Broadcast, PhoneCall, Warning } from "@phosphor-icons/react";
import {
  ADMIN_HOURLY_CALLS,
  ADMIN_INCIDENTS,
  DASHBOARD_STATS,
  PASS_TIER_SHARE,
  SIGNUP_TREND,
  formatWon,
} from "@/projects/platform/veli/lib/mock-data";
import type { Incident } from "@/projects/platform/veli/lib/types";
import {
  HourlyBars,
  Metric,
  PageHead,
  Panel,
  ShareBar,
  Tag,
  TrendBars,
} from "@/projects/platform/veli/components/admin/admin-ui";

const LEVEL_TONE: Record<Incident["level"], "danger" | "warning" | "neutral"> = {
  심각: "danger",
  경고: "warning",
  정보: "neutral",
};

const CTI_TONE = DASHBOARD_STATS.ctiStatus === "정상" ? "success" : "warning";

export function AdminDashboard() {
  const sortedIncidents = [...ADMIN_INCIDENTS].sort((a, b) => {
    if (a.resolved === b.resolved) return 0;
    return a.resolved ? 1 : -1;
  });

  return (
    <>
      <PageHead
        title="관리자 대시보드"
        description="회원, 안심번호, 통화, 결제 지표를 한 화면에서 확인하고 장애 신호를 놓치지 않도록 모니터링합니다."
        actions={
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--vl-accent)]/25 bg-[var(--vl-accent)]/[0.06] px-3 py-1.5 text-[12.5px] font-bold text-[var(--vl-accent)]">
            <Broadcast size={13} weight="fill" />
            실시간 통화 {DASHBOARD_STATS.liveCallsNow}건
          </span>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="전체 회원 수"
          value={DASHBOARD_STATS.totalMembers.toLocaleString("ko-KR")}
          unit="명"
          note={`오늘 신규 ${DASHBOARD_STATS.newSignupsToday}명`}
        />
        <Metric
          label="발급된 안심번호"
          value={DASHBOARD_STATS.issuedNumbers.toLocaleString("ko-KR")}
          unit="개"
          note={`사용중 ${DASHBOARD_STATS.activeNumbers.toLocaleString("ko-KR")} / 미배정 ${DASHBOARD_STATS.unassignedNumbers.toLocaleString("ko-KR")}`}
        />
        <Metric
          label="오늘 통화 건수"
          value={DASHBOARD_STATS.todayCalls.toLocaleString("ko-KR")}
          unit="건"
          note={`통화 성공률 ${DASHBOARD_STATS.callSuccessRate}%`}
        />
        <Metric
          label="이달 이용권 매출"
          value={formatWon(DASHBOARD_STATS.passSalesThisMonth)}
          unit="원"
          note="라이트 / 스탠다드 / 프리미엄 합산"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="시간대별 통화 건수" note="오늘 00시부터 22시까지, 단위는 건">
          <HourlyBars data={ADMIN_HOURLY_CALLS} />
        </Panel>

        <Panel
          title="실시간 운영 현황"
          note="CTI 서버와 통화 대기열 상태입니다"
        >
          <div className="space-y-4 px-5 py-5">
            <div className="flex items-center justify-between rounded-[8px] border border-[var(--vl-border)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <PhoneCall size={16} className="text-[var(--vl-accent)]" />
                <div>
                  <p className="text-[13px] font-semibold">CTI 벤더</p>
                  <p className="vl-num text-[12px] text-[var(--vl-muted)]">
                    {DASHBOARD_STATS.ctiVendor}
                  </p>
                </div>
              </div>
              <Tag tone={CTI_TONE}>{DASHBOARD_STATS.ctiStatus}</Tag>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] border border-[var(--vl-border)] px-4 py-3">
                <p className="text-[12px] font-semibold text-[var(--vl-muted)]">진행 중인 통화</p>
                <p className="vl-num mt-1.5 text-[20px] font-bold">
                  {DASHBOARD_STATS.liveCallsNow}
                  <span className="ml-1 text-[13px] font-semibold text-[var(--vl-muted)]">건</span>
                </p>
              </div>
              <div className="rounded-[8px] border border-[var(--vl-border)] px-4 py-3">
                <p className="text-[12px] font-semibold text-[var(--vl-muted)]">연결 대기</p>
                <p className="vl-num mt-1.5 text-[20px] font-bold">
                  {DASHBOARD_STATS.pendingConnections}
                  <span className="ml-1 text-[13px] font-semibold text-[var(--vl-muted)]">건</span>
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Panel title="이용권 등급별 비중" note="현재 활성 구독 기준">
          <ShareBar data={PASS_TIER_SHARE} />
        </Panel>

        <Panel title="신규 가입 추이" note="최근 5개월, 단위는 명">
          <TrendBars data={SIGNUP_TREND} />
        </Panel>
      </div>

      <Panel
        className="mt-4"
        title="장애 알림"
        note="CTI 회선과 결제 연동에서 감지된 이벤트입니다"
      >
        <ul className="divide-y divide-[var(--vl-border)]">
          {sortedIncidents.map((incident) => (
            <li key={incident.id} className="flex items-center gap-4 px-5 py-4">
              <Warning
                size={16}
                weight="fill"
                className={
                  incident.resolved
                    ? "shrink-0 text-[var(--vl-muted-soft)]"
                    : "shrink-0 text-[var(--vl-warning)]"
                }
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold">{incident.title}</p>
                <p className="vl-num mt-0.5 text-[12px] text-[var(--vl-muted)]">
                  {incident.occurredAt}
                </p>
              </div>
              <Tag tone={LEVEL_TONE[incident.level]}>{incident.level}</Tag>
              <Tag tone={incident.resolved ? "success" : "neutral"}>
                {incident.resolved ? "해결됨" : "미해결"}
              </Tag>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
