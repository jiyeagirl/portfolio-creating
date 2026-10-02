"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Clock, CopySimple, Robot, ShieldWarning, TrendUp } from "@phosphor-icons/react";
import { Badge, Button, Card, EmptyState, PageHead, Segmented, Stat, Tabs } from "@/projects/b2b/orderlog/components/ui";
import { anomalies } from "@/projects/b2b/orderlog/lib/mock-data";
import { RISK_LABEL, RISK_TONE, type Navigate } from "@/projects/b2b/orderlog/lib/navigation";
import type { Anomaly } from "@/projects/b2b/orderlog/lib/types";

const KIND_LABEL: Record<Anomaly["kind"], string> = {
  duplicate: "중복 발주",
  price_spike: "단가 급변",
  permission: "권한 이상",
};

const KIND_ICON: Record<Anomaly["kind"], React.ComponentType<{ size?: number; weight?: "bold" }>> = {
  duplicate: CopySimple,
  price_spike: TrendUp,
  permission: ShieldWarning,
};

type KindFilter = "all" | Anomaly["kind"];
type ReviewFilter = "all" | "pending" | "done";

export function AnomalyScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [review, setReview] = useState<ReviewFilter>("all");

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      if (kind !== "all" && a.kind !== kind) return false;
      if (review === "pending" && a.reviewed) return false;
      if (review === "done" && !a.reviewed) return false;
      return true;
    });
  }, [kind, review]);

  const pendingCount = anomalies.filter((a) => !a.reviewed).length;
  const highCount = anomalies.filter((a) => a.riskLevel === "high").length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="AI 탐지"
        title="AI 이상 발주 센터"
        desc="AI가 감지한 중복 발주, 단가 급변, 권한 이상 건만 모아 위험도 순으로 보여줍니다."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="미검토 건" value={`${pendingCount}건`} note="즉시 확인 필요" emphasis />
        <Stat label="위험도 높음" value={`${highCount}건`} note="이번 달 누적" />
        <Stat label="이번 달 탐지 총건" value={`${anomalies.length}건`} note="전체 유형 합계" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          value={kind}
          onChange={setKind}
          items={[
            { key: "all" as KindFilter, label: "전체" },
            { key: "duplicate" as KindFilter, label: "중복 발주" },
            { key: "price_spike" as KindFilter, label: "단가 급변" },
            { key: "permission" as KindFilter, label: "권한 이상" },
          ]}
        />
        <Segmented
          value={review}
          onChange={setReview}
          items={[
            { key: "all" as ReviewFilter, label: "전체" },
            { key: "pending" as ReviewFilter, label: "미검토" },
            { key: "done" as ReviewFilter, label: "검토완료" },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Robot size={20} />}
          title="해당 조건의 이상 발주가 없습니다"
          desc="필터를 조정하면 다른 유형의 AI 탐지 결과를 볼 수 있습니다."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((a) => {
            const Icon = KIND_ICON[a.kind];
            return (
              <Card key={a.id} className="flex flex-col gap-3.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[var(--ot-surface-soft)] text-[var(--ot-body)]">
                      <Icon size={15} weight="bold" />
                    </span>
                    <span className="text-[12.5px] font-medium text-[var(--ot-mute)]">{KIND_LABEL[a.kind]}</span>
                  </span>
                  <Badge tone={RISK_TONE[a.riskLevel]}>위험도 {RISK_LABEL[a.riskLevel]}</Badge>
                </div>

                <div>
                  <p className="text-[14.5px] font-semibold leading-5 text-[var(--ot-ink)]">{a.title}</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-[var(--ot-body)]">{a.detail}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--ot-mute)]">
                  <span className="ot-mono">{a.orderCode}</span>
                  <span>{a.companyName}</span>
                  <span>{a.itemName}</span>
                  <span className="ot-mono font-medium text-[var(--ot-ink)]">{a.scoreDelta}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--ot-hairline)] pt-3.5">
                  <span className="flex items-center gap-1.5 text-[12px] text-[var(--ot-mute)]">
                    {a.reviewed ? (
                      <>
                        <CheckCircle size={13} weight="fill" className="text-[var(--ot-success)]" />
                        {a.reviewer} 검토완료
                      </>
                    ) : (
                      <>
                        <Clock size={13} />
                        {a.detectedAt} 감지
                      </>
                    )}
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => onNavigate("thread", a.orderId)}>
                    스레드에서 보기
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
