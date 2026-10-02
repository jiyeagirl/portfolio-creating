"use client";

import { useState } from "react";
import { Bell, PaperPlaneTilt } from "@phosphor-icons/react";
import {
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  CompareChart,
  PageHead,
  Row,
  Select,
  Stat,
  Table,
} from "@/projects/b2b/genderinsight/components/ui";
import {
  ASSESSMENTS,
  DEPARTMENT_RESPONSE,
  PARTICIPANTS,
  RANK_RESPONSE,
  RESPONSE_TREND,
} from "@/projects/b2b/genderinsight/lib/mock-data";

export function AdminResponses() {
  const [assessmentId, setAssessmentId] = useState("a2");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sentToast, setSentToast] = useState(false);

  const assessment = ASSESSMENTS.find((a) => a.id === assessmentId) ?? ASSESSMENTS[0];
  const cohort = PARTICIPANTS.filter((p) => p.assessmentId === assessmentId);
  const pending = cohort.filter((p) => p.status !== "응답완료");
  const rate = cohort.length === 0 ? 0 : Math.round(((cohort.length - pending.length) / cohort.length) * 100);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sendReminder = () => {
    if (selected.size === 0) return;
    setSentToast(true);
    setSelected(new Set());
    setTimeout(() => setSentToast(false), 2600);
  };

  return (
    <div className="gi-enter space-y-8">
      <PageHead
        eyebrow="응답 현황 관리"
        title="응답 현황"
        desc="진단별 실시간 응답률과 미응답자를 확인하고 리마인드를 발송합니다."
        actions={
          <Select value={assessmentId} onChange={setAssessmentId} options={ASSESSMENTS.map((a) => a.id)} />
        }
      />
      <p className="-mt-4 text-[13px] text-[var(--gi-mute)]">{assessment.name}</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="응답률" value={`${rate}%`} emphasis />
        <Stat label="응답 완료" value={`${cohort.length - pending.length}명`} note={`대상 ${cohort.length}명`} />
        <Stat label="미응답" value={`${pending.length}명`} note="리마인드 발송 대상" />
        <Stat label="진행 기간" value={`${assessment.startDate.slice(5)} ~ ${assessment.endDate.slice(5)}`} />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="부서별 응답률" desc="2025년 하반기 정기 진단 기준" />
          <CompareChart data={DEPARTMENT_RESPONSE.map((d) => ({ label: d.department, target: d.target, actual: d.responded }))} />
        </Card>
        <Card>
          <CardHead title="직급별 응답률" desc="2025년 하반기 정기 진단 기준" />
          <CompareChart data={RANK_RESPONSE.map((d) => ({ label: d.rank, target: d.target, actual: d.responded }))} />
        </Card>
      </div>

      <Card>
        <CardHead title="기간별 응답 추이" desc="일별 신규 응답 인원" />
        <BarChart data={RESPONSE_TREND.map((d) => ({ label: d.date, value: d.count }))} format={(v) => `${v}명`} />
      </Card>

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-0">
          <CardHead title="미응답자 목록" desc={`${assessment.name} 기준`} />
          <Button
            size="sm"
            icon={<PaperPlaneTilt size={13} weight="bold" />}
            disabled={selected.size === 0}
            onClick={sendReminder}
          >
            선택 리마인드 발송 ({selected.size})
          </Button>
        </div>
        {sentToast && (
          <div className="gi-enter mx-5 mt-3 rounded-[6px] border border-[var(--gi-info-soft)] bg-[var(--gi-info-soft)] px-3 py-2 text-[12.5px] text-[var(--gi-info-deep)]">
            리마인드 이메일을 발송했습니다.
          </div>
        )}
        <div className="px-5 pt-4 pb-5">
          <Table head={["선택", "이름", "사업장", "상태", "마지막 발송일", "액션"]} minWidth={620}>
            {pending.map((p) => (
              <Row key={p.id}>
                <Cell>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selected.has(p.id)}
                    onClick={() => toggle(p.id)}
                    className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                      selected.has(p.id)
                        ? "border-[var(--gi-accent)] bg-[var(--gi-accent)]"
                        : "border-[var(--gi-hairline-strong)]"
                    }`}
                  >
                    {selected.has(p.id) && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6.2 5 8.7l4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </Cell>
                <Cell strong>
                  {p.name}
                  <span className="mt-0.5 block text-[11.5px] font-normal text-[var(--gi-mute)]">
                    {p.department} / {p.rank}
                  </span>
                </Cell>
                <Cell muted>{p.unit}</Cell>
                <Cell>
                  <Badge tone={p.status === "발송완료" ? "warn" : "danger"}>{p.status}</Badge>
                </Cell>
                <Cell muted mono nowrap>
                  {p.invitedAt ?? "-"}
                </Cell>
                <Cell align="right">
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--gi-accent-deep)]"
                  >
                    <Bell size={12} />
                    선택
                  </button>
                </Cell>
              </Row>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[13px] text-[var(--gi-mute)]">
                  미응답자가 없습니다.
                </td>
              </tr>
            )}
          </Table>
        </div>
      </Card>
    </div>
  );
}
