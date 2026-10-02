"use client";

/* 08 운영 대시보드 — 강조 화면(spec.md 7절 3순위).
   "무엇이 얼마나 등록됐는가"(좌) 와 "지금 사람 손이 필요한 게 무엇인가"(우) 를 나눠 배치한다. */

import { ArrowSquareOut, Broadcast, Database, Flag } from "@phosphor-icons/react";
import {
  BarChart,
  Badge,
  Button,
  Card,
  CardHead,
  PageHead,
  RankBars,
  Stat,
  StatusStack,
  Timeline,
} from "@/projects/youngin/real/components/admin/ui";
import {
  ADMIN_SUMMARY,
  DISTRICT_COVERAGE,
  FACILITY_COVERAGE,
  RECENT_ACTIVITY,
  REGISTRATION_TREND,
  REPORT_COUNTS,
} from "@/projects/youngin/real/lib/mock-data";
import type { AdminScreen } from "@/projects/youngin/real/lib/navigation";

const KIND_TONE = {
  등록: "info",
  수정: "neutral",
  반영: "ink",
  삭제: "danger",
} as const;

export function DashboardScreen({ onNavigate }: { onNavigate: (next: AdminScreen) => void }) {
  const pending = REPORT_COUNTS.filter((r) => r.status === "접수" || r.status === "검토").reduce(
    (sum, r) => sum + r.count,
    0,
  );

  return (
    <div className="cp-enter space-y-8">
      <PageHead
        eyebrow="OO시 생활안전 QR 안내 서비스"
        title="운영 대시보드"
        desc="공공데이터 기준일과 사용자 신고를 함께 보고, 손이 필요한 항목부터 처리합니다. 아래 수치는 QR 지점 62곳에 연결된 전체 데이터 기준입니다."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<ArrowSquareOut size={14} weight="bold" />}
              onClick={() => onNavigate("data")}
            >
              데이터 관리
            </Button>
            <Button icon={<Flag size={14} weight="bold" />} onClick={() => onNavigate("reports")}>
              신고 {pending}건 처리
            </Button>
          </>
        }
      />

      {/* 등록 현황 요약 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={ADMIN_SUMMARY.facilities.label}
          value={`${ADMIN_SUMMARY.facilities.total.toLocaleString()}곳`}
          delta={`+${ADMIN_SUMMARY.facilities.added}`}
          note="이번 달 신규"
        />
        <Stat
          label={ADMIN_SUMMARY.stores.label}
          value={`${ADMIN_SUMMARY.stores.total.toLocaleString()}곳`}
          delta={`+${ADMIN_SUMMARY.stores.added}`}
          note="이번 달 신규"
        />
        <Stat
          label={ADMIN_SUMMARY.festivals.label}
          value={`${ADMIN_SUMMARY.festivals.total}건`}
          delta={`+${ADMIN_SUMMARY.festivals.added}`}
          note="이번 달 신규"
        />
        <Stat
          emphasis
          label="처리 대기 신고"
          value={`${pending}건`}
          delta={`전체 ${ADMIN_SUMMARY.reports.total}건`}
          note="접수, 검토 단계"
        />
      </section>

      {/* 추이 + 신고 현황 — 좌우 높이가 달라 items-start 를 준다 */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            title="월별 데이터 등록 추이"
            desc="시설과 매장 등록, 수정 건수를 합산한 값"
            action={<Badge tone="neutral">최근 6개월</Badge>}
          />
          <BarChart data={REGISTRATION_TREND} format={(v) => `${v}건`} />
          <p className="cp-num mt-4 border-t border-[var(--cp-hairline)] pt-3 text-[12px] text-[var(--cp-mute)]">
            6월은 12일까지 집계 / 5월 급증은 공공데이터포털 상반기 배포분 일괄 대조 때문입니다
          </p>
        </Card>

        <Card>
          <CardHead
            title="오류 신고 현황"
            desc="접수부터 완료까지 4단계"
            action={
              <Button size="sm" variant="ghost" onClick={() => onNavigate("reports")}>
                열기
              </Button>
            }
          />
          <StatusStack data={REPORT_COUNTS} />
          <div className="mt-5 space-y-2 border-t border-[var(--cp-hairline)] pt-4">
            {[
              { label: "평균 처리 기간", value: "2.4일" },
              { label: "이번 주 접수", value: "6건" },
              { label: "반려", value: "0건" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[var(--cp-body)]">{item.label}</span>
                <span className="cp-num text-[13px] font-medium text-[var(--cp-ink)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 최근 수정 내역 + 커버리지 */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            title="최근 수정 내역"
            desc="등록, 수정, 신고 반영, 노출 중지가 시간순으로 쌓입니다"
            action={
              <Button size="sm" variant="secondary" onClick={() => onNavigate("data")}>
                전체 이력
              </Button>
            }
          />
          <Timeline
            steps={RECENT_ACTIVITY.map((item) => ({
              label: item.title,
              at: item.at,
              done: true,
              note: item.note,
              by: item.by,
            }))}
          />
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--cp-hairline)] pt-4">
            {(Object.keys(KIND_TONE) as (keyof typeof KIND_TONE)[]).map((kind) => (
              <Badge key={kind} tone={KIND_TONE[kind]}>
                {kind} {RECENT_ACTIVITY.filter((a) => a.kind === kind).length}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead
              title="상권별 등록 현황"
              desc="점포 수 기준"
              action={<Database size={15} weight="bold" className="text-[var(--cp-mute)]" />}
            />
            <RankBars data={DISTRICT_COVERAGE} />
          </Card>

          <Card>
            <CardHead
              title="시설 유형별 검증 현황"
              desc="현장 실사로 확인된 비율"
              action={<Broadcast size={15} weight="bold" className="text-[var(--cp-mute)]" />}
            />
            <RankBars data={FACILITY_COVERAGE} />
            <p className="cp-num mt-4 border-t border-[var(--cp-hairline)] pt-3 text-[12px] text-[var(--cp-mute)]">
              미검증 51곳은 다음 실사 일정에 배정됩니다
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
