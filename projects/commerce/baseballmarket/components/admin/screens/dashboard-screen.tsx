"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import {
  Badge,
  BarChart,
  Card,
  ShareBar,
  Stat,
  TeamMark,
  TrendChart,
} from "@/projects/commerce/baseballmarket/components/ui";
import {
  CATEGORY_SHARE,
  KPI,
  RECENT_INQUIRIES,
  REPORTS,
  TEAM_ACTIVITY,
  TICKET_TREND,
  team,
} from "@/projects/commerce/baseballmarket/lib/mock-data";

/* 운영 대시보드. 좌우 높이가 다른 그리드라 items-start를 준다 (design.md 표 밀도 절). */

export function DashboardScreen() {
  const pending = REPORTS.filter((r) => r.state === "미처리").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="가입 회원" value={KPI.members.toLocaleString("ko-KR")} delta={KPI.membersDelta} unit="명" />
        <Stat label="등록 매물" value={KPI.listings.toLocaleString("ko-KR")} delta={KPI.listingsDelta} unit="건" />
        <Stat label="거래 성사율" value={String(KPI.closeRate)} delta={KPI.closeRateDelta} unit="%" />
        <Stat
          label="이번 달 거래액"
          value={`${Math.round(KPI.gmv / 100_000_000)}.${String(Math.round((KPI.gmv % 100_000_000) / 10_000_000))}`}
          delta={KPI.gmvDelta}
          unit="억원"
        />
      </div>

      <div className="grid items-start gap-2.5 xl:grid-cols-3">
        <Card tone="canvas" className="xl:col-span-2">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
                티켓 거래 추이
              </h3>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--bm-muted)]">
                주간 성사 건수, 최근 12주
              </p>
            </div>
            <span className="bm-num inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--bm-link-deep)]">
              <ArrowUpRight size={13} weight="bold" />
              97% 증가
            </span>
          </div>
          <TrendChart data={TICKET_TREND} />
        </Card>

        <Card tone="canvas">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
            카테고리별 거래 비중
          </h3>
          <p className="mt-1 text-[13px] leading-[19px] text-[var(--bm-muted)]">
            이번 달 성사 건수 기준
          </p>
          <div className="mt-5">
            <ShareBar data={CATEGORY_SHARE} />
          </div>
        </Card>
      </div>

      <div className="grid items-start gap-2.5 xl:grid-cols-3">
        <Card tone="canvas" className="xl:col-span-2">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
            구단별 활성도
          </h3>
          <p className="mt-1 mb-5 text-[13px] leading-[19px] text-[var(--bm-muted)]">
            매물 등록, 채팅, 게시글을 합산한 지수
          </p>
          <BarChart
            data={TEAM_ACTIVITY.map((t) => ({ label: team(t.team).name, value: t.value }))}
          />
        </Card>

        <div className="space-y-2.5">
          <Card tone="canvas">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
                신고 접수 현황
              </h3>
              {pending > 0 && <Badge tone="danger">미처리 {pending}건</Badge>}
            </div>
            <ul className="mt-4 space-y-3">
              {REPORTS.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background:
                        r.state === "미처리"
                          ? "var(--bm-error)"
                          : r.state === "검토중"
                            ? "var(--bm-warning)"
                            : "var(--bm-hairline-strong)",
                    }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium leading-[19px] text-[var(--bm-body-strong)]">
                      {r.targetLabel}
                    </span>
                    <span className="bm-num block truncate text-[12px] leading-[17px] text-[var(--bm-muted)]">
                      {r.reason} | {r.createdAt.slice(5)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card tone="canvas">
            <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
              최근 문의
            </h3>
            <ul className="mt-4 space-y-3">
              {RECENT_INQUIRIES.map((q) => (
                <li key={q.id} className="flex items-start gap-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium leading-[19px] text-[var(--bm-body-strong)]">
                      {q.subject}
                    </span>
                    <span className="block truncate text-[12px] leading-[17px] text-[var(--bm-muted)]">
                      {q.user} | {q.at}
                    </span>
                  </span>
                  {q.state === "미답변" && <Badge tone="warning">미답변</Badge>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card tone="soft">
        <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
          구단 활성 상위 5곳
        </h3>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-5">
          {TEAM_ACTIVITY.slice(0, 5).map((t) => (
            <div key={t.team} className="rounded-[8px] bg-[var(--bm-canvas)] p-4">
              <TeamMark id={t.team} size={28} />
              <p className="mt-2.5 truncate text-[13px] font-semibold leading-[19px] text-[var(--bm-ink)]">
                {team(t.team).name}
              </p>
              <p className="bm-num mt-0.5 text-[13px] leading-[19px] text-[var(--bm-muted)]">
                지수 {t.value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
