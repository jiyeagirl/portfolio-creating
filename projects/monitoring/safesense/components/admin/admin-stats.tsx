"use client";

import { BarChart, Card, CardHead, PageHead, Stat } from "@/projects/monitoring/safesense/components/admin/ui";

const MONTHLY = [
  { label: "3월", value: 18 },
  { label: "4월", value: 22 },
  { label: "5월", value: 15 },
  { label: "6월", value: 19 },
  { label: "7월", value: 26, emphasis: true },
];

const SITE_INCIDENTS = [
  { label: "A건설 강남", value: 14, caption: "14건 / 34명" },
  { label: "B산업 인천", value: 5, caption: "5건 / 21명" },
  { label: "C중공업 부산", value: 7, caption: "7건 / 18명" },
];

const TYPE_RATIO = [
  { label: "낙상", value: 42 },
  { label: "강한 충격", value: 33 },
  { label: "장시간 정지", value: 25 },
];

export function AdminStats() {
  const maxSite = Math.max(...SITE_INCIDENTS.map((s) => s.value));

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="ANALYTICS"
        title="통계 분석"
        desc="기간별 이벤트 통계와 현장별 사고 현황을 리포트로 확인합니다."
      />

      <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] sm:grid-cols-3">
        <Stat label="이번 달 위험 이벤트" value="26건" delta="+7" note="지난달 대비" emphasis />
        <Stat label="평균 대응 시간" value="6분 40초" delta="-1분 12초" note="지난달 대비" />
        <Stat label="근로자 1인당 평균 근무시간" value="7:52" note="일 평균" />
      </div>

      <Card>
        <CardHead title="월별 위험 이벤트 추이" desc="최근 5개월 합산" />
        <div className="p-5 pt-0">
          <BarChart data={MONTHLY} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-[1px] bg-[var(--ss-border)] lg:grid-cols-2">
        <Card>
          <CardHead title="현장별 사고 현황" desc="누적 이벤트 건수" />
          <ul className="space-y-3 p-5 pt-0">
            {SITE_INCIDENTS.map((s) => (
              <li key={s.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12.5px] font-semibold text-[var(--ss-foreground)]">{s.label}</span>
                  <span className="ss-mono text-[11px] text-[var(--ss-muted)]">{s.caption}</span>
                </div>
                <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-full bg-[var(--ss-panel-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--ss-accent)]"
                    style={{ width: `${(s.value / maxSite) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead title="이벤트 유형 비율" desc="이번 달 합산, 백분율" />
          <ul className="space-y-3 p-5 pt-0">
            {TYPE_RATIO.map((t) => (
              <li key={t.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12.5px] font-semibold text-[var(--ss-foreground)]">{t.label}</span>
                  <span className="ss-mono text-[11px] text-[var(--ss-muted)]">{t.value}%</span>
                </div>
                <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-full bg-[var(--ss-panel-2)]">
                  <div className="h-full rounded-full bg-[var(--ss-border-strong)]" style={{ width: `${t.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
