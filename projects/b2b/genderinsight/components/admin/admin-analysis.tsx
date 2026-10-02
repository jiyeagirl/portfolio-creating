"use client";

import { useState } from "react";
import { Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  Card,
  CardHead,
  PageHead,
  RankBars,
  Segmented,
  Select,
} from "@/projects/b2b/genderinsight/components/ui";
import {
  AREA_SCORES,
  ASSESSMENTS,
  AREA_LABEL,
  DEPARTMENT_AREA_SCORES,
  QUESTION_AREAS,
  RANK_AREA_SCORES,
} from "@/projects/b2b/genderinsight/lib/mock-data";
import type { QuestionAreaId } from "@/projects/b2b/genderinsight/lib/types";

export function AdminAnalysis() {
  const [assessmentId, setAssessmentId] = useState("a1");
  const [areaId, setAreaId] = useState<QuestionAreaId>("decision");

  const assessment = ASSESSMENTS.find((a) => a.id === assessmentId) ?? ASSESSMENTS[0];
  const lowest = [...AREA_SCORES].sort((a, b) => a.score - b.score)[0];
  const highest = [...AREA_SCORES].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="gi-enter space-y-8">
      <PageHead
        eyebrow="결과 분석"
        title="결과 분석"
        desc="영역별 점수와 부서, 직급 비교를 통해 조직의 성인지감수성 수준을 분석합니다."
        actions={<Select value={assessmentId} onChange={setAssessmentId} options={ASSESSMENTS.map((a) => a.id)} />}
      />
      <p className="-mt-4 text-[13px] text-[var(--gi-mute)]">{assessment.name}</p>

      <Card>
        <CardHead
          title="영역별 평균 점수"
          desc="5점 척도 기준 전사 평균"
          action={<Badge tone="warn">최저 {AREA_LABEL[lowest.areaId]}</Badge>}
        />
        <RankBars
          data={[...AREA_SCORES]
            .sort((a, b) => b.score - a.score)
            .map((s) => ({ label: AREA_LABEL[s.areaId], value: s.score, caption: `${s.score.toFixed(1)} / 5.0` }))}
        />
      </Card>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <CardHead title="영역별 부서 / 직급 비교" desc="비교할 영역을 선택하세요" />
          <Segmented
            value={areaId}
            onChange={setAreaId}
            items={QUESTION_AREAS.map((area) => ({ key: area.id, label: area.label }))}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHead title="부서별 비교 분석" desc={QUESTION_AREAS.find((a) => a.id === areaId)?.label} />
            <RankBars
              data={[...DEPARTMENT_AREA_SCORES]
                .sort((a, b) => b.scores[areaId] - a.scores[areaId])
                .map((d) => ({ label: d.department, value: d.scores[areaId], caption: `${d.scores[areaId].toFixed(1)} / 5.0` }))}
            />
          </Card>
          <Card>
            <CardHead title="직급별 비교 분석" desc={QUESTION_AREAS.find((a) => a.id === areaId)?.label} />
            <RankBars
              data={[...RANK_AREA_SCORES]
                .sort((a, b) => b.scores[areaId] - a.scores[areaId])
                .map((r) => ({ label: r.rank, value: r.scores[areaId], caption: `${r.scores[areaId].toFixed(1)} / 5.0` }))}
            />
          </Card>
        </div>
      </div>

      <Card className="border-[var(--gi-accent)]" soft>
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--gi-accent)] text-white">
            <Sparkle size={16} weight="bold" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[var(--gi-ink)]">AI 기반 종합 분석 인사이트</p>
            <p className="mt-2 text-[13.5px] leading-6 text-[var(--gi-body)]">
              전사 평균 {(AREA_SCORES.reduce((s, a) => s + a.score, 0) / AREA_SCORES.length).toFixed(1)}점으로
              지난 진단 대비 개선 흐름을 보이고 있습니다. {AREA_LABEL[highest.areaId]} 영역은{" "}
              {highest.score.toFixed(1)}점으로 가장 높게 나타나 예방 교육과 신고 절차 안내가 효과를 내고
              있는 것으로 보입니다. 반면 {AREA_LABEL[lowest.areaId]} 영역은 {lowest.score.toFixed(1)}점으로
              가장 낮아, 주요 회의체와 승진 심사 과정의 성별 균형 점검이 우선 개선 과제로 제안됩니다.
              기술연구팀과 현장운영팀은 두 영역 모두에서 전사 평균을 밑돌아 부서 단위 후속 워크숍이
              필요합니다.
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                `${AREA_LABEL[lowest.areaId]} 영역이 전 부서에서 가장 낮게 나타나 개선 우선순위로 제안됩니다`,
                "인사팀, 경영지원팀은 전 영역에서 전사 평균을 상회했습니다",
                "직급이 올라갈수록 의사결정 참여 형평성 체감도가 다소 낮아지는 경향이 있습니다",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12.5px] leading-5 text-[var(--gi-body)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--gi-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
