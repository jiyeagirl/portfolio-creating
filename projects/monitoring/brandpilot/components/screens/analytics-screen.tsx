"use client";

import { useState } from "react";
import { DownloadSimple, Sparkle, TrendUp } from "@phosphor-icons/react";
import {
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  ChannelTag,
  DonutChart,
  LineChart,
  PageHead,
  RankBars,
  Row,
  Segmented,
  Stat,
  Table,
  Thumb,
} from "@/projects/monitoring/brandpilot/components/ui";
import {
  aiInsights,
  campaignReach,
  channelStats,
  contentTypeShare,
  monthlyEngagement,
  monthlyReach,
  topContents,
} from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CHANNEL_LABEL,
  compact,
  num,
  type Navigate,
} from "@/projects/monitoring/brandpilot/lib/navigation";

type Metric = "reach" | "posts";

export function AnalyticsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [metric, setMetric] = useState<Metric>("reach");

  const totalReach = channelStats.reduce((sum, c) => sum + c.reach, 0);
  const totalPosts = channelStats.reduce((sum, c) => sum + c.posts, 0);
  const best = monthlyReach.reduce((top, m) => (m.reach > top.reach ? m : top), monthlyReach[0]);
  const avgEngagement =
    channelStats.reduce((sum, c) => sum + c.engagement, 0) / channelStats.length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="현황"
        title="성과 분석"
        desc="채널별 도달과 참여율, 콘텐츠 유형 비중, AI가 찾아낸 패턴을 한 화면에서 확인합니다. 기간은 2026년 1월부터 4월까지입니다."
        actions={
          <Button size="md" variant="secondary" icon={<DownloadSimple size={14} />}>
            리포트 다운로드
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="총 도달" value={compact(totalReach)} delta="+18.4%" note="전월 대비" />
        <Stat
          label="평균 참여율"
          value={`${avgEngagement.toFixed(1)}%`}
          delta="+1.2%p"
          note="전월 대비"
          emphasis
        />
        <Stat label="발행 콘텐츠" value={`${totalPosts}건`} delta="+12건" note="전월 대비" />
        <Stat label="저장수 합계" value={compact(19_260)} delta="+24.1%" note="전월 대비" />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <CardHead
            title="월별 추이"
            desc={`4개월 누적 도달 ${compact(monthlyReach.reduce((s, m) => s + m.reach, 0))}`}
            action={
              <Segmented
                value={metric}
                onChange={setMetric}
                items={[
                  { key: "reach" as Metric, label: "도달" },
                  { key: "posts" as Metric, label: "발행" },
                ]}
              />
            }
          />
          <BarChart
            data={monthlyReach.map((m) => ({
              label: m.month,
              value: metric === "reach" ? m.reach : m.posts,
              emphasis: m.month === best.month,
            }))}
            format={metric === "reach" ? compact : (v) => `${v}건`}
            height={200}
          />
          <p className="mt-4 border-t border-[var(--bp-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--bp-body)]">
            {best.month}이 {compact(best.reach)}으로 가장 높았습니다. 봄 나들이 헤어 숏폼이
            확산된 영향입니다.
          </p>
        </Card>

        <Card>
          <CardHead title="콘텐츠 유형 비중" desc="1월부터 4월까지 발행 건수 기준" />
          <DonutChart
            data={contentTypeShare}
            centerLabel="유형"
            centerValue={`${contentTypeShare.length}종`}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Card>
          <CardHead title="채널별 성과" desc="도달과 참여율을 함께 봅니다" />
          {/* 이 카드는 2열 그리드 안이라 실제 컬럼 폭이 약 480px다. 열을 5개로 두면
              마지막 열이 잘려서 "전월 대비"는 도달 셀의 보조 줄로 내렸다
              (design.md "표 밀도 · 컬럼 예산"). */}
          <Table
            head={["채널", "도달", "참여율", "발행"]}
            align={["left", "right", "right", "right"]}
            minWidth={420}
          >
            {channelStats.map((c) => (
              <Row key={c.channel}>
                <Cell strong nowrap>
                  <ChannelTag channel={c.channel} label={CHANNEL_LABEL[c.channel]} />
                </Cell>
                <Cell align="right" mono nowrap>
                  <span className="block">{compact(c.reach)}</span>
                  <span
                    className={`mt-0.5 block text-[11.5px] font-normal ${
                      c.delta.startsWith("+")
                        ? "text-[var(--bp-success-deep)]"
                        : "text-[var(--bp-danger-deep)]"
                    }`}
                  >
                    {c.delta}
                  </span>
                </Cell>
                <Cell align="right" mono>
                  {c.engagement}%
                </Cell>
                <Cell align="right" mono>
                  {c.posts}
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHead title="참여율 추이" desc="전체 채널 평균" />
          <LineChart
            data={monthlyEngagement.map((m) => ({ label: m.month, value: m.value }))}
            formatValue={(v) => `${v}%`}
            height={200}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHead
            title="성과 상위 콘텐츠"
            desc="도달 기준"
            action={
              <button
                type="button"
                onClick={() => onNavigate("library")}
                className="text-[12.5px] text-[var(--bp-accent)]"
              >
                라이브러리 열기
              </button>
            }
          />
          <ul className="space-y-4">
            {topContents.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onNavigate("editor", c.id)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="bp-mono w-4 shrink-0 text-[13px] text-[var(--bp-mute)]">
                    {i + 1}
                  </span>
                  <Thumb photo={c.photo} alt={c.title} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-[var(--bp-ink)]">
                      {c.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[12px] text-[var(--bp-mute)]">
                      <ChannelTag channel={c.channel} label={CHANNEL_LABEL[c.channel]} />
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="bp-mono block text-[13px] font-medium text-[var(--bp-ink)]">
                      {compact(c.reach ?? 0)}
                    </span>
                    <span className="bp-mono block text-[11.5px] text-[var(--bp-mute)]">
                      저장 {num(c.saves ?? 0)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead
            title="AI 인사이트"
            desc="데이터에서 찾은 반복 패턴"
            action={<Sparkle size={15} weight="fill" className="text-[var(--bp-accent)]" />}
          />
          <ul className="space-y-4">
            {aiInsights.map((insight) => (
              <li
                key={insight.id}
                className="border-b border-[var(--bp-hairline)] pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13.5px] font-medium leading-5 text-[var(--bp-ink)]">
                    {insight.title}
                  </p>
                  <Badge tone={insight.impact === "높음" ? "accent" : "neutral"}>
                    {insight.impact}
                  </Badge>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--bp-body)]">
                  {insight.detail}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHead title="캠페인별 도달 기여도" desc="1월부터 4월까지 누적" />
        <RankBars
          data={campaignReach.map((c) => ({
            label: c.label,
            value: c.value,
            caption: compact(c.value),
          }))}
        />
        <p className="mt-4 flex items-center gap-1.5 border-t border-[var(--bp-hairline)] pt-4 text-[12.5px] text-[var(--bp-body)]">
          <TrendUp size={13} weight="bold" />
          숏폼 비중이 높은 캠페인이 상위를 차지했습니다.
        </p>
      </Card>
    </div>
  );
}
