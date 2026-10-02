"use client";

import { ArrowRight, CalendarBlank, Database, MagicWand, Sparkle } from "@phosphor-icons/react";
import {
  BarChart,
  Badge,
  Card,
  CardHead,
  ContentThumb,
  PageHead,
  RankBars,
  Stat,
  Timeline,
} from "@/projects/monitoring/marketflow/components/ui";
import {
  activityLog,
  channelPublishShare,
  contentItems,
  customers,
  weeklyGeneratedContent,
  workflows,
} from "@/projects/monitoring/marketflow/lib/mock-data";
import { CONTENT_TYPE_LABEL, STATUS_LABEL, STATUS_TONE, type Navigate } from "@/projects/monitoring/marketflow/lib/navigation";

function timeAgo(iso: string) {
  const diffMs = new Date("2025-09-08T09:32:00").getTime() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}분 전`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.round(hours / 24)}일 전`;
}

export function DashboardScreen({ onNavigate }: { onNavigate: Navigate }) {
  const pending = contentItems.filter((c) => c.status === "pending");
  const publishedThisWeek = weeklyGeneratedContent.reduce((sum, d) => sum + d.value, 0);
  const aiSuccessRate = Math.round(
    (contentItems.reduce((sum, c) => sum + c.aiScore, 0) / contentItems.length) * 10,
  ) / 10;
  const newCustomersThisMonth = customers.filter((c) => c.createdAt >= "2025-08-01").length;

  const quickActions = [
    { key: "generate" as const, label: "새 콘텐츠 생성", desc: "AI로 블로그, 카드뉴스, 숏폼 생성", icon: MagicWand },
    { key: "calendar" as const, label: "발행 일정 확인", desc: "이번 주 예약 발행 캘린더", icon: CalendarBlank },
    { key: "workflow" as const, label: "워크플로우 점검", desc: "오류 발생 자동화 확인", icon: Sparkle },
    { key: "collection" as const, label: "수집 현황 보기", desc: "RSS, API 수집 이력 조회", icon: Database },
  ];

  return (
    <div className="mf-enter flex flex-col gap-8">
      <PageHead
        eyebrow="OPS DASHBOARD"
        title="관리자 대시보드"
        desc="콘텐츠 생성부터 승인, 발행까지의 파이프라인 현황을 한눈에 확인합니다."
        actions={
          <button
            type="button"
            onClick={() => onNavigate("generate")}
            className="inline-flex h-10 items-center gap-1.5 rounded-[6px] bg-[var(--mf-primary)] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[var(--mf-primary-active)]"
          >
            <MagicWand size={15} weight="bold" />
            콘텐츠 생성하기
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="이번 주 생성 콘텐츠" value={`${publishedThisWeek}건`} delta="+18%" note="전주 대비" emphasis />
        <Stat label="승인 대기" value={`${pending.length}건`} note="평균 대기 6.4시간" />
        <Stat label="AI 생성 성공률" value={`${aiSuccessRate}%`} delta="+2.1%" note="지난 30일" />
        <Stat label="신규 고객 (이번 달)" value={`${newCustomersThisMonth}건`} note={`전체 ${customers.length}개사 운영중`} />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead title="주간 콘텐츠 생성 추이" desc="최근 7일간 생성된 콘텐츠 수 (초안 포함)" />
          <BarChart data={weeklyGeneratedContent.map((d) => ({ label: d.label, value: d.value, emphasis: d.label === "9/8" }))} format={(v) => `${v}건`} />
        </Card>
        <Card>
          <CardHead title="채널별 게시 현황" desc="최근 30일 발행 완료 기준" />
          <RankBars data={channelPublishShare} />
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card padded={false}>
          <div className="flex items-center justify-between gap-4 p-5 pb-0">
            <CardHead title="승인 대기 현황" desc={`${pending.length}건이 검토를 기다리고 있습니다`} />
            <button
              type="button"
              onClick={() => onNavigate("editor")}
              className="mb-4 inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-[var(--mf-primary)] hover:underline"
            >
              전체 보기
              <ArrowRight size={13} />
            </button>
          </div>
          <ul className="divide-y divide-[var(--mf-hairline)] px-5 pb-2">
            {pending.slice(0, 5).map((item) => {
              const customer = customers.find((c) => c.id === item.customerId);
              return (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <ContentThumb photo={item.thumbnail} title={item.title} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[var(--mf-ink)]">{item.title}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[var(--mf-mute)]">
                      {customer?.name} | {CONTENT_TYPE_LABEL[item.type]} | {item.assignee}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHead title="최근 활동 로그" desc="사람과 자동화가 함께 남긴 최신 기록" />
          <Timeline
            steps={activityLog.slice(0, 6).map((entry) => ({
              label: `${entry.actor} | ${entry.action}`,
              at: timeAgo(entry.at),
              done: true,
              note: entry.target,
            }))}
          />
        </Card>
      </div>

      <Card>
        <CardHead title="자동화 파이프라인 상태" desc="워크플로우별 오늘 실행 현황" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {workflows.map((wf) => (
            <button
              key={wf.id}
              type="button"
              onClick={() => onNavigate("workflow")}
              className="rounded-[8px] border border-[var(--mf-hairline)] p-4 text-left transition-colors hover:bg-[var(--mf-soft)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13.5px] font-medium leading-5 text-[var(--mf-ink)]">{wf.name}</p>
                <Badge
                  tone={wf.status === "active" ? "ink" : wf.status === "error" ? "danger" : "neutral"}
                  dot={wf.status === "active"}
                >
                  {wf.status === "active" ? "실행중" : wf.status === "error" ? "오류" : "일시중지"}
                </Badge>
              </div>
              <p className="mt-2 text-[12px] text-[var(--mf-mute)]">
                오늘 {wf.runsToday}회 실행 | 성공률 {wf.successRate}%
              </p>
            </button>
          ))}
        </div>
      </Card>

      <Card soft>
        <CardHead title="빠른 실행" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => onNavigate(action.key)}
                className="flex flex-col items-start gap-3 rounded-[8px] border border-[var(--mf-hairline)] bg-[var(--mf-canvas)] p-4 text-left transition-colors hover:border-[var(--mf-hairline-strong)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--mf-primary-soft)] text-[var(--mf-primary-active)]">
                  <Icon size={17} weight="bold" />
                </span>
                <span>
                  <span className="block text-[13.5px] font-medium text-[var(--mf-ink)]">{action.label}</span>
                  <span className="mt-0.5 block text-[12px] leading-4 text-[var(--mf-mute)]">{action.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
