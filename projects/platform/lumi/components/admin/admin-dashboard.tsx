"use client";

import { ArrowRight, Broadcast, Warning } from "@phosphor-icons/react";
import {
  ADMIN_HOURLY,
  ADMIN_LIVE_FEED,
  ADMIN_RESERVATIONS,
  ADMIN_TIER_MIX,
  ADMIN_TODAY,
  PASS_BY_TIER,
  formatWon,
  expertById,
} from "@/projects/platform/lumi/lib/mock-data";
import {
  HourlyBars,
  Metric,
  PageHead,
  Panel,
  ShareBar,
  Tag,
} from "@/projects/platform/lumi/components/admin/admin-ui";
import type { AdminTab } from "@/projects/platform/lumi/components/admin/admin-app";

export function AdminDashboard({ onGo }: { onGo: (tab: AdminTab) => void }) {
  const running = ADMIN_RESERVATIONS.filter((r) => r.state === "진행중" || r.state === "대기");

  const todo = [
    {
      label: "상담사 승인 심사",
      value: "4건",
      note: "가장 오래된 신청 6일 경과",
      tab: "experts" as AdminTab,
    },
    {
      label: "노쇼 처리 대기",
      value: "3건",
      note: "상담권 복구 승인 필요",
      tab: "reservations" as AdminTab,
    },
    {
      label: "정산 지급 승인",
      value: "74건",
      note: `${formatWon(ADMIN_TODAY.payoutDue)}원`,
      tab: "settlements" as AdminTab,
    },
  ];

  return (
    <>
      <PageHead
        title="대시보드"
        description="오늘 상담 운영 현황과 처리해야 할 일을 한 화면에서 확인합니다. 기준 시각 2026년 7월 28일 21시 40분."
        actions={
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--lm-live-soft)] px-3 py-1.5 text-[12.5px] font-bold text-[var(--lm-live)]">
            <Broadcast size={13} weight="fill" />
            실시간 상담 {ADMIN_TODAY.liveSessions}건
          </span>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Metric
          label="오늘 상담 건수"
          value={ADMIN_TODAY.sessions.toLocaleString("ko-KR")}
          unit="건"
          delta={ADMIN_TODAY.sessionsDelta}
          note="어제 대비"
        />
        <Metric
          label="오늘 매출"
          value={formatWon(ADMIN_TODAY.revenue)}
          unit="원"
          delta={ADMIN_TODAY.revenueDelta}
          note="어제 대비"
        />
        <Metric
          label="상담 완료율"
          value={`${ADMIN_TODAY.completionRate}`}
          unit="%"
          note={`취소 4.1% · 노쇼 2.5%`}
        />
        <Metric
          label="예약 현황"
          value={ADMIN_TODAY.reservations.toLocaleString("ko-KR")}
          unit="건"
          note={`대기 ${ADMIN_TODAY.reservationsPending}건`}
        />
        <Metric
          label="신규 회원"
          value={ADMIN_TODAY.newMembers.toLocaleString("ko-KR")}
          unit="명"
          delta={ADMIN_TODAY.newMembersDelta}
          note="어제 대비"
        />
        <Metric
          label="정산 예정 금액"
          value={formatWon(ADMIN_TODAY.payoutDue)}
          unit="원"
          note={`상담사 ${ADMIN_TODAY.payoutCount}명 · 7월 31일 지급`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="시간대별 상담 건수"
          note="오늘 09시부터 22시까지, 단위는 건"
        >
          <HourlyBars data={ADMIN_HOURLY} />
        </Panel>

        <Panel title="상담권 등급별 비중" note="오늘 완료된 상담 기준">
          <ShareBar
            data={ADMIN_TIER_MIX.map((item) => ({
              label: `${PASS_BY_TIER[item.tier].name} ${PASS_BY_TIER[item.tier].minutes}분`,
              share: item.share,
              note: `${item.sessions}건`,
            }))}
          />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="실시간 상담 현황"
          note={`진행 중 ${ADMIN_TODAY.liveSessions}건 · 대기 ${ADMIN_TODAY.waiting}건 · 이슈 ${ADMIN_TODAY.issues}건`}
          actions={
            <button
              type="button"
              onClick={() => onGo("reservations")}
              className="flex items-center gap-1 text-[12.5px] font-semibold text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
            >
              예약 관리로
              <ArrowRight size={12} weight="bold" />
            </button>
          }
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                <th className="px-5 py-2.5 font-semibold">예약번호</th>
                <th className="px-3 py-2.5 font-semibold">상담사</th>
                <th className="px-3 py-2.5 font-semibold">회원</th>
                <th className="px-3 py-2.5 font-semibold">상담권</th>
                <th className="px-3 py-2.5 font-semibold">경과</th>
                <th className="px-5 py-2.5 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--lm-border)]">
              {running.map((row) => (
                <tr key={row.id} className="text-[13px]">
                  <td className="lm-num px-5 py-3 font-semibold">{row.id}</td>
                  <td className="px-3 py-3">{expertById(row.expertId).name}</td>
                  <td className="px-3 py-3 text-[var(--lm-muted)]">{row.memberName}</td>
                  <td className="lm-num px-3 py-3 text-[var(--lm-muted)]">
                    {PASS_BY_TIER[row.tier].name}
                  </td>
                  <td className="lm-num px-3 py-3 text-[var(--lm-muted)]">
                    {row.usedMinutes > 0 ? `${row.usedMinutes}분` : "대기"}
                  </td>
                  <td className="px-5 py-3">
                    <Tag tone={row.state === "진행중" ? "live" : "neutral"}>{row.state}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="운영 로그" note="최근 30분">
          <ol className="space-y-0 px-5 py-2">
            {ADMIN_LIVE_FEED.map((item, index) => (
              <li key={item.time} className="flex gap-3 py-2.5">
                <span className="lm-num w-10 shrink-0 pt-0.5 text-[11.5px] text-[var(--lm-muted)]">
                  {item.time}
                </span>
                <span className="relative flex flex-col items-center">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.state === "danger"
                        ? "bg-[var(--lm-danger)]"
                        : item.state === "warn"
                          ? "bg-[var(--lm-live)]"
                          : "bg-[var(--lm-border)]"
                    }`}
                  />
                  {index < ADMIN_LIVE_FEED.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-[var(--lm-border)]" aria-hidden />
                  )}
                </span>
                <span className="text-[12.5px] leading-relaxed text-[var(--lm-ink)]">
                  {item.text}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel
        className="mt-4"
        title="오늘 처리해야 할 일"
        note="담당자가 확인하지 않으면 상담사와 회원에게 바로 영향이 갑니다"
      >
        <ul className="divide-y divide-[var(--lm-border)]">
          {todo.map((item) => (
            <li key={item.label} className="flex items-center gap-4 px-5 py-4">
              <Warning size={16} weight="fill" className="shrink-0 text-[var(--lm-live)]" />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold">{item.label}</p>
                <p className="lm-num mt-0.5 text-[12.5px] text-[var(--lm-muted)]">{item.note}</p>
              </div>
              <span className="lm-num text-[15px] font-bold">{item.value}</span>
              <button
                type="button"
                onClick={() => onGo(item.tab)}
                className="rounded-lg border border-[var(--lm-border)] px-3 py-1.5 text-[12.5px] font-semibold transition-colors hover:bg-[var(--lm-surface)]"
              >
                처리하기
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
