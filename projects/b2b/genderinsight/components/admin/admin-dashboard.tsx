"use client";

import { ArrowRight, EnvelopeSimple, Plus, UsersThree } from "@phosphor-icons/react";
import {
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  CompareChart,
  PageHead,
  Row,
  Stat,
  Table,
  Cell,
} from "@/projects/b2b/genderinsight/components/ui";
import {
  ADMIN_USERS,
  ASSESSMENTS,
  DEPARTMENT_RESPONSE,
  PARTICIPANTS,
  RANK_RESPONSE,
  RESPONSE_TREND,
} from "@/projects/b2b/genderinsight/lib/mock-data";
import type { AssessmentStatus } from "@/projects/b2b/genderinsight/lib/types";
import type { AdminScreen } from "@/projects/b2b/genderinsight/lib/navigation";

const STATUS_TONE: Record<AssessmentStatus, "neutral" | "info" | "ink"> = {
  준비중: "neutral",
  진행중: "info",
  종료: "ink",
};

export function AdminDashboard({ onNavigate }: { onNavigate: (next: AdminScreen) => void }) {
  const activeAssessments = ASSESSMENTS.filter((a) => a.status === "진행중");
  const totalTarget = ASSESSMENTS.reduce((sum, a) => sum + a.targetCount, 0);
  const totalResponse = ASSESSMENTS.reduce((sum, a) => sum + a.responseCount, 0);
  const responseRate = Math.round((totalResponse / totalTarget) * 100);
  const sent = PARTICIPANTS.filter((p) => p.status !== "미발송").length;
  const pending = PARTICIPANTS.filter((p) => p.status !== "응답완료");
  const recent = [...ASSESSMENTS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 4);
  const admin = ADMIN_USERS[0];
  const peakDay = RESPONSE_TREND.reduce((max, d) => (d.count > max.count ? d : max), RESPONSE_TREND[0]);

  return (
    <div className="gi-enter space-y-8">
      <PageHead
        eyebrow="관리자 대시보드"
        title={`안녕하세요, ${admin.name}님`}
        desc="오늘 기준 진단 운영 현황을 한눈에 확인하세요."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => onNavigate("assessments")}>
            진단 생성
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="진행 중인 진단"
          value={`${activeAssessments.length}건`}
          note={activeAssessments.map((a) => a.name).join(", ")}
          emphasis
        />
        <Stat label="전체 참여율" value={`${responseRate}%`} delta={`+${totalResponse}명 응답`} note={`대상 ${totalTarget}명`} />
        <Stat label="이메일 발송 완료" value={`${sent}명`} note={`전체 대상 ${PARTICIPANTS.length}명 중`} />
        <Stat label="미응답자" value={`${pending.length}명`} note="리마인드 발송 대상" />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead
            title="부서별 응답률"
            desc="대상 인원 대비 응답 인원"
            action={
              <button
                type="button"
                onClick={() => onNavigate("responses")}
                className="flex items-center gap-1 text-[12.5px] text-[var(--gi-accent-deep)]"
              >
                응답 현황 보기
                <ArrowRight size={12} />
              </button>
            }
          />
          <CompareChart
            data={DEPARTMENT_RESPONSE.map((d) => ({ label: d.department, target: d.target, actual: d.responded }))}
          />
        </Card>
        <Card className="lg:col-span-2">
          <CardHead title="직급별 응답률" desc="대상 인원 대비 응답 인원" />
          <CompareChart
            data={RANK_RESPONSE.map((d) => ({ label: d.rank, target: d.target, actual: d.responded }))}
            height={176}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead
            title="기간별 참여 추이"
            desc="2025년 하반기 정기 진단 (2025.11.03 ~ 2025.11.21)"
            action={<Badge tone="info">최고 {peakDay.date} / {peakDay.count}명</Badge>}
          />
          <BarChart data={RESPONSE_TREND.map((d) => ({ label: d.date, value: d.count }))} format={(v) => `${v}명`} />
        </Card>
        <Card className="lg:col-span-2" soft>
          <CardHead
            title="미응답자 현황"
            desc="응답률이 낮은 순"
            action={
              <button
                type="button"
                onClick={() => onNavigate("responses")}
                className="flex items-center gap-1 text-[12.5px] text-[var(--gi-accent-deep)]"
              >
                전체 보기
                <ArrowRight size={12} />
              </button>
            }
          />
          <ul className="space-y-3">
            {pending.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gi-accent-soft)] text-[12px] font-medium text-[var(--gi-accent-deep)]">
                    <UsersThree size={14} weight="bold" />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-[var(--gi-ink)]">{p.name}</p>
                    <p className="text-[12px] text-[var(--gi-mute)]">
                      {p.department} / {p.rank}
                    </p>
                  </div>
                </div>
                <Badge tone={p.status === "발송완료" ? "warn" : "danger"}>{p.status}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-[6px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] px-3 py-2.5 text-[12px] text-[var(--gi-body)]">
            <EnvelopeSimple size={14} className="shrink-0 text-[var(--gi-mute)]" />
            리마인드 이메일은 응답 현황 화면에서 일괄 발송할 수 있습니다.
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHead title="최근 생성된 진단" desc="생성일 기준 최신순" />
        </div>
        <div className="px-5 pb-5">
          <Table head={["진단명", "상태", "진행 기간", "대상", "참여율"]} minWidth={560}>
            {recent.map((a) => (
              <Row key={a.id} onClick={() => onNavigate("assessments")}>
                <Cell strong>{a.name}</Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                </Cell>
                <Cell muted nowrap>
                  <span className="gi-mono">
                    {a.startDate} ~ {a.endDate}
                  </span>
                </Cell>
                <Cell muted>{a.targetUnits.join(", ")}</Cell>
                <Cell align="right" mono>
                  {a.targetCount === 0 ? "-" : `${Math.round((a.responseCount / a.targetCount) * 100)}%`}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>
    </div>
  );
}
