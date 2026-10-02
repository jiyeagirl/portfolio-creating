"use client";

import { useState } from "react";
import { CalendarBlank, Plus, Target } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  ChannelTag,
  DefList,
  Drawer,
  Eyebrow,
  Field,
  InitialAvatar,
  Input,
  Meter,
  PageHead,
  Row,
  Select,
  Table,
  Tabs,
  Textarea,
  Thumb,
} from "@/projects/monitoring/brandpilot/components/ui";
import { campaigns, contents, people } from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_STATUS_TONE,
  CHANNEL_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  type Navigate,
} from "@/projects/monitoring/brandpilot/lib/navigation";
import type { Campaign, CampaignStatus } from "@/projects/monitoring/brandpilot/lib/types";

type Tab = "all" | CampaignStatus;

export function CampaignsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [tab, setTab] = useState<Tab>("all");
  const [detail, setDetail] = useState<Campaign | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [owner, setOwner] = useState(people[0].name);

  const list = tab === "all" ? campaigns : campaigns.filter((c) => c.status === tab);
  const related = detail ? contents.filter((c) => c.campaignId === detail.id) : [];

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="운영"
        title="캠페인 관리"
        desc="캠페인별 목표와 일정, 담당자를 관리하고 관련 콘텐츠를 하나로 묶습니다. 진행률은 목표 대비 달성 기준입니다."
        actions={
          <Button size="md" onClick={() => setNewOpen(true)} icon={<Plus size={14} />}>
            캠페인 만들기
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "all" as Tab, label: "전체", count: campaigns.length },
          ...(["active", "upcoming", "ended"] as CampaignStatus[]).map((s) => ({
            key: s as Tab,
            label: CAMPAIGN_STATUS_LABEL[s],
            count: campaigns.filter((c) => c.status === s).length,
          })),
        ]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={CAMPAIGN_STATUS_TONE[c.status]}>
                    {CAMPAIGN_STATUS_LABEL[c.status]}
                  </Badge>
                  {c.channels.map((ch) => (
                    <ChannelTag key={ch} channel={ch} label={CHANNEL_LABEL[ch]} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDetail(c)}
                  className="mt-2.5 block text-left text-[16px] font-semibold leading-6 tracking-[-0.02em] text-[var(--bp-ink)]"
                >
                  {c.name}
                </button>
                <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-5 text-[var(--bp-body)]">
                  <Target size={13} className="mt-1 shrink-0 text-[var(--bp-mute)]" />
                  {c.goal}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[12.5px] text-[var(--bp-mute)]">목표 달성률</span>
                <span className="bp-mono text-[13px] font-medium text-[var(--bp-ink)]">
                  {c.progress}%
                </span>
              </div>
              <div className="mt-1.5">
                <Meter
                  value={c.progress}
                  tone={c.status === "ended" ? "success" : c.progress < 30 ? "warn" : "accent"}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--bp-hairline)] pt-4">
              <span className="flex items-center gap-2 text-[12.5px] text-[var(--bp-body)]">
                <InitialAvatar name={c.owner} size={22} />
                {c.owner}
              </span>
              <span className="bp-mono flex items-center gap-1.5 text-[12px] text-[var(--bp-mute)]">
                <CalendarBlank size={12} />
                {c.startsAt} - {c.endsAt}
              </span>
              <span className="bp-mono text-[12px] text-[var(--bp-mute)]">
                콘텐츠 {c.contentCount}건
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHead title="캠페인 일람" desc="예산과 일정을 한 표에서 비교합니다" />
        {/* 태블릿(1024)에서 사이드바를 빼면 실제 컬럼 폭이 약 680px다. 6열이면 넘쳐서
            예산은 콘텐츠 셀의 보조 줄로 내리고 기간은 연도를 뺀 형식으로 줄였다
            (design.md "표 밀도 · 컬럼 예산"). 연도는 상세 드로어에서 전체로 보여준다. */}
        <Table
          head={["캠페인", "담당자", "기간", "콘텐츠", "상태"]}
          align={["left", "left", "left", "right", "left"]}
          minWidth={640}
        >
          {campaigns.map((c) => (
            <Row key={c.id} onClick={() => setDetail(c)}>
              <Cell strong>
                <span className="block truncate">{c.name}</span>
                <span className="mt-0.5 block truncate text-[12px] font-normal text-[var(--bp-mute)]">
                  {c.goal}
                </span>
              </Cell>
              <Cell nowrap>{c.owner}</Cell>
              <Cell mono muted nowrap>
                {c.startsAt.slice(5)} - {c.endsAt.slice(5)}
              </Cell>
              <Cell align="right" mono nowrap>
                <span className="block">{c.contentCount}건</span>
                <span className="mt-0.5 block text-[11.5px] font-normal text-[var(--bp-mute)]">
                  {c.budgetLabel}
                </span>
              </Cell>
              <Cell>
                <Badge tone={CAMPAIGN_STATUS_TONE[c.status]}>{CAMPAIGN_STATUS_LABEL[c.status]}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={detail !== null}
        title={detail?.name ?? ""}
        subtitle={detail ? `${detail.owner} · ${detail.startsAt} - ${detail.endsAt}` : undefined}
        onClose={() => setDetail(null)}
      >
        {detail && (
          <div className="space-y-5">
            <div className="rounded-[6px] bg-[var(--bp-soft)] p-4">
              <Eyebrow>목표</Eyebrow>
              <p className="mt-2 text-[13.5px] leading-6 text-[var(--bp-body)]">{detail.goal}</p>
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12.5px] text-[var(--bp-mute)]">달성률</span>
                  <span className="bp-mono text-[13px] font-medium text-[var(--bp-ink)]">
                    {detail.progress}%
                  </span>
                </div>
                <div className="mt-1.5">
                  <Meter value={detail.progress} />
                </div>
              </div>
            </div>

            <DefList
              columns={1}
              items={[
                { label: "상태", value: CAMPAIGN_STATUS_LABEL[detail.status] },
                { label: "담당자", value: detail.owner },
                { label: "기간", value: `${detail.startsAt} - ${detail.endsAt}` },
                { label: "예산", value: detail.budgetLabel },
                {
                  label: "채널",
                  value: detail.channels.map((ch) => CHANNEL_LABEL[ch]).join(", "),
                },
              ]}
            />

            <div>
              <Eyebrow>관련 콘텐츠 {related.length}건</Eyebrow>
              <ul className="mt-3 space-y-2.5">
                {related.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate("editor", c.id);
                        setDetail(null);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-[6px] border border-[var(--bp-hairline)] p-2.5 text-left transition-colors hover:bg-[var(--bp-soft)]"
                    >
                      <Thumb photo={c.photo} alt={c.title} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-[var(--bp-ink)]">
                          {c.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-[var(--bp-mute)]">
                          {CHANNEL_LABEL[c.channel]}
                        </span>
                      </span>
                      <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={newOpen}
        title="캠페인 만들기"
        subtitle="목표를 수치로 적으면 진행률을 자동으로 계산합니다"
        onClose={() => setNewOpen(false)}
        footer={
          <Button full onClick={() => setNewOpen(false)}>
            캠페인 생성
          </Button>
        }
      >
        <div className="space-y-4">
          <Field label="캠페인명" required>
            <Input value={name} onChange={setName} placeholder="초여름 수분 집중 캠페인" />
          </Field>
          <Field label="목표" required hint="숫자를 포함하면 달성률이 자동 계산됩니다">
            <Textarea value={goal} onChange={setGoal} rows={3} placeholder="인스타 저장수 8천 확보" />
          </Field>
          <Field label="담당자" required>
            <Select value={owner} options={people.map((p) => p.name)} onChange={setOwner} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="시작일">
              <Input value="2026-05-11" />
            </Field>
            <Field label="종료일">
              <Input value="2026-06-30" />
            </Field>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
