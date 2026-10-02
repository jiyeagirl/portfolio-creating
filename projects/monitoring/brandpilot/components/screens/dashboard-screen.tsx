"use client";

import { ArrowRight, Sparkle, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  ChannelTag,
  Eyebrow,
  InitialAvatar,
  Meter,
  Stat,
  Thumb,
} from "@/projects/monitoring/brandpilot/components/ui";
import {
  aiRecommendations,
  campaigns,
  contents,
  currentUser,
  quickActions,
  recentActivity,
  scheduledPosts,
} from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CHANNEL_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  compact,
  shortAt,
  type Navigate,
} from "@/projects/monitoring/brandpilot/lib/navigation";

export function DashboardScreen({ onNavigate }: { onNavigate: Navigate }) {
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const pendingReview = contents.filter((c) => c.status === "review");
  const scheduled = scheduledPosts.filter((p) => p.status === "scheduled");
  const failed = scheduledPosts.filter((p) => p.status === "failed");
  const recentContents = [...contents]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--bp-hairline)] pb-6">
        <div>
          <Eyebrow>2026년 4월 22일 수요일</Eyebrow>
          <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--bp-ink)]">
            {currentUser.name}님, 오늘 처리할 일이 {pendingReview.length + failed.length}건 있습니다.
          </h1>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-[var(--bp-body)]">
            진행중 캠페인 {activeCampaigns.length}개, 승인 대기 {pendingReview.length}건, 예약 대기{" "}
            {scheduled.length}건이 남아 있습니다.
          </p>
        </div>
        <Button
          size="md"
          onClick={() => onNavigate("generate")}
          icon={<Sparkle size={15} weight="fill" />}
        >
          AI 콘텐츠 생성
        </Button>
      </div>

      {failed.length > 0 && (
        <button
          type="button"
          onClick={() => onNavigate("publishing")}
          className="flex w-full items-center gap-3 rounded-[8px] border border-[var(--bp-danger-soft)] bg-[var(--bp-danger-soft)] px-4 py-3 text-left transition-colors hover:bg-[#f3c8cb]"
        >
          <WarningCircle size={16} weight="fill" className="shrink-0 text-[var(--bp-danger-deep)]" />
          <span className="min-w-0 flex-1 text-[13.5px] text-[var(--bp-danger-deep)]">
            인스타그램 예약 게시 {failed.length}건이 실패했습니다. 캠페인 노출 공백이 6일째입니다.
          </span>
          <ArrowRight size={14} className="shrink-0 text-[var(--bp-danger-deep)]" />
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="진행중 캠페인" value={`${activeCampaigns.length}개`} note="종료 예정 2건 포함" />
        <Stat
          label="승인 대기"
          value={`${pendingReview.length}건`}
          delta={`+${pendingReview.length}`}
          note="어제 대비"
          emphasis
        />
        <Stat label="예약된 게시" value={`${scheduled.length}건`} note="4월 29일까지" />
        <Stat label="4월 누적 도달" value={compact(2_460_000)} delta="+15.0%" note="전월 대비" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => onNavigate(action.key)}
            className="group rounded-[8px] border border-[var(--bp-hairline)] bg-[var(--bp-canvas)] p-4 text-left transition-colors hover:border-[var(--bp-accent)] hover:bg-[var(--bp-accent-soft)]"
          >
            <p className="flex items-center justify-between gap-2 text-[14px] font-medium text-[var(--bp-ink)]">
              {action.label}
              <ArrowRight
                size={14}
                className="shrink-0 text-[var(--bp-mute)] transition-colors group-hover:text-[var(--bp-accent-deep)]"
              />
            </p>
            <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--bp-mute)]">{action.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHead
              title="최근 콘텐츠"
              desc="최근 생성되거나 수정된 순서입니다"
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("library")}
                  className="text-[12.5px] text-[var(--bp-accent)]"
                >
                  라이브러리 전체 보기
                </button>
              }
            />
            <ul className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2">
              {recentContents.map((c) => (
                <li key={c.id} className="border-b border-[var(--bp-hairline)] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onNavigate("editor", c.id)}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <Thumb photo={c.photo} alt={c.title} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-[var(--bp-ink)]">
                        {c.title}
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <ChannelTag channel={c.channel} label={CHANNEL_LABEL[c.channel]} />
                        {c.aiGenerated && (
                          <Sparkle size={12} weight="fill" className="text-[var(--bp-accent)]" />
                        )}
                      </span>
                    </span>
                    <Badge tone={STATUS_TONE[c.status]} pulse={c.status === "generating"}>
                      {STATUS_LABEL[c.status]}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="진행중 캠페인" desc="목표 달성률 기준" />
            <ul className="space-y-4">
              {activeCampaigns.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("campaigns")}
                    className="w-full text-left"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-[14px] font-medium text-[var(--bp-ink)]">{c.name}</span>
                      <span className="bp-mono text-[13px] text-[var(--bp-body)]">{c.progress}%</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-[var(--bp-mute)]">
                      {c.owner} · 콘텐츠 {c.contentCount}건 · {c.endsAt} 종료
                    </p>
                    <div className="mt-2">
                      <Meter value={c.progress} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead title="AI 추천 작업" desc="지금 하면 효과가 큰 순서입니다" />
            <ul className="space-y-3">
              {aiRecommendations.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(r.screen)}
                    className="w-full rounded-[6px] border border-[var(--bp-hairline)] p-3.5 text-left transition-colors hover:border-[var(--bp-accent)]"
                  >
                    <p className="flex items-start gap-2 text-[13.5px] font-medium leading-5 text-[var(--bp-ink)]">
                      <Sparkle
                        size={13}
                        weight="fill"
                        className="mt-0.5 shrink-0 text-[var(--bp-accent)]"
                      />
                      {r.title}
                    </p>
                    <p className="mt-1.5 pl-5 text-[12.5px] leading-5 text-[var(--bp-mute)]">
                      {r.detail}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="예약된 게시" desc="가장 가까운 순서" />
            <ul className="space-y-3">
              {scheduled.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Thumb photo={p.photo} alt={p.title} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--bp-ink)]">{p.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[12px] text-[var(--bp-mute)]">
                      <ChannelTag channel={p.channel} label={CHANNEL_LABEL[p.channel]} />
                    </p>
                  </div>
                  <span className="bp-mono shrink-0 text-[12px] text-[var(--bp-body)]">
                    {shortAt(p.at)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="최근 활동" />
            <ul className="space-y-3.5">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-2.5">
                  <InitialAvatar
                    name={a.actor === "AI 어시스턴트" ? "AI" : a.actor}
                    size={24}
                    tone={a.actor === "AI 어시스턴트" ? "accent" : "neutral"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] leading-5 text-[var(--bp-body)]">
                      <span className="font-medium text-[var(--bp-ink)]">{a.actor}</span>님이 {a.action}
                    </p>
                    <p className="bp-mono mt-0.5 text-[11px] text-[var(--bp-mute)]">{a.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
