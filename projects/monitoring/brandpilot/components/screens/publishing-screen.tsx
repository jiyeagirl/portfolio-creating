"use client";

import { useState } from "react";
import { ArrowClockwise, CalendarBlank, Clock, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  ChannelTag,
  Drawer,
  Eyebrow,
  Field,
  Input,
  PageHead,
  Row,
  Segmented,
  Select,
  Table,
  Thumb,
} from "@/projects/monitoring/brandpilot/components/ui";
import { contents, scheduledPosts } from "@/projects/monitoring/brandpilot/lib/mock-data";
import { CHANNEL_LABEL, type Navigate } from "@/projects/monitoring/brandpilot/lib/navigation";
import type { ScheduledPost } from "@/projects/monitoring/brandpilot/lib/types";

type View = "calendar" | "list";

const STATUS_META = {
  scheduled: { label: "예약됨", tone: "warn" as const },
  published: { label: "게시 완료", tone: "success" as const },
  failed: { label: "게시 실패", tone: "danger" as const },
};

/** 2026년 4월 달력. 4월 1일이 수요일이라 앞에 3칸을 비운다. */
const APR_LEAD = 3;
const APR_DAYS = 30;

export function PublishingScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [view, setView] = useState<View>("calendar");
  const [detail, setDetail] = useState<ScheduledPost | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [date, setDate] = useState("2026-04-28");
  const [time, setTime] = useState("18:00");
  const [target, setTarget] = useState(contents[0].title);

  const scheduled = scheduledPosts.filter((p) => p.status === "scheduled");
  const published = scheduledPosts.filter((p) => p.status === "published");
  const failed = scheduledPosts.filter((p) => p.status === "failed");

  const byDay = new Map<number, ScheduledPost[]>();
  scheduledPosts.forEach((p) => {
    const [y, m, d] = p.at.split(" ")[0].split("-").map(Number);
    if (y === 2026 && m === 4) {
      const list = byDay.get(d) ?? [];
      list.push(p);
      byDay.set(d, list);
    }
  });

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="운영"
        title="SNS 게시 관리"
        desc="예약 게시와 즉시 게시를 한 곳에서 관리합니다. 캘린더로 채널별 발행 간격을 확인하고 비어 있는 날을 채웁니다."
        actions={
          <>
            <Segmented
              value={view}
              onChange={setView}
              items={[
                { key: "calendar" as View, label: "캘린더" },
                { key: "list" as View, label: "목록" },
              ]}
            />
            <Button size="md" onClick={() => setNewOpen(true)} icon={<CalendarBlank size={14} />}>
              게시 예약
            </Button>
          </>
        }
      />

      {failed.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--bp-danger-soft)] bg-[var(--bp-danger-soft)] px-4 py-3">
          <WarningCircle size={16} weight="fill" className="shrink-0 text-[var(--bp-danger-deep)]" />
          <p className="min-w-0 flex-1 text-[13.5px] text-[var(--bp-danger-deep)]">
            {failed[0].title} 게시가 실패했습니다. 인스타그램 액세스 토큰이 만료된 것으로
            확인됩니다.
          </p>
          <Button size="sm" variant="danger" icon={<ArrowClockwise size={13} />}>
            재시도
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">예약 대기</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {scheduled.length}건
          </p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">이번 달 게시 완료</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {published.length}건
          </p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">게시 실패</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-danger-deep)]">
            {failed.length}건
          </p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">발행 공백 최장</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            6일
          </p>
        </div>
      </div>

      {view === "calendar" ? (
        <Card>
          <CardHead title="2026년 4월" desc="날짜를 눌러 예약된 게시를 확인합니다" />
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-[6px] border border-[var(--bp-hairline)] bg-[var(--bp-hairline)]">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div
                key={d}
                className="bg-[var(--bp-soft)] py-2 text-center text-[12px] font-medium text-[var(--bp-mute)]"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: APR_LEAD }).map((_, i) => (
              <div key={`lead-${i}`} className="min-h-[92px] bg-[var(--bp-soft)]" />
            ))}
            {Array.from({ length: APR_DAYS }, (_, i) => i + 1).map((day) => {
              const posts = byDay.get(day) ?? [];
              return (
                <div key={day} className="min-h-[92px] bg-[var(--bp-canvas)] p-1.5">
                  <p className="bp-mono mb-1 text-[11px] text-[var(--bp-mute)]">{day}</p>
                  <div className="space-y-1">
                    {posts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setDetail(p)}
                        className="flex w-full items-center gap-1 rounded-[4px] bg-[var(--bp-accent-soft)] px-1.5 py-1 text-left"
                      >
                        <span className="truncate text-[11px] font-medium leading-4 text-[var(--bp-accent-deep)]">
                          {p.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[var(--bp-mute)]">
            <Clock size={13} />
            4월 17일부터 23일까지 예약이 비어 있습니다. 발행 간격이 벌어지지 않게 채워주세요.
          </p>
        </Card>
      ) : (
        <Card>
          <CardHead title="게시 목록" desc="예약과 발행 이력을 함께 봅니다" />
          <Table
            head={["콘텐츠", "채널", "게시 일시", "상태"]}
            align={["left", "left", "right", "left"]}
            minWidth={620}
          >
            {scheduledPosts.map((p) => (
              <Row key={p.id} onClick={() => setDetail(p)}>
                <Cell strong>
                  <span className="flex items-center gap-2.5">
                    <Thumb photo={p.photo} alt={p.title} size={32} />
                    {p.title}
                  </span>
                </Cell>
                <Cell nowrap>
                  <ChannelTag channel={p.channel} label={CHANNEL_LABEL[p.channel]} />
                </Cell>
                <Cell align="right" mono nowrap>
                  {p.at}
                </Cell>
                <Cell>
                  <Badge tone={STATUS_META[p.status].tone}>{STATUS_META[p.status].label}</Badge>
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>
      )}

      <Drawer
        open={detail !== null}
        title={detail?.title ?? ""}
        subtitle={detail ? `${CHANNEL_LABEL[detail.channel]} · ${detail.at}` : undefined}
        onClose={() => setDetail(null)}
        footer={
          detail?.status === "failed" ? (
            <Button full onClick={() => setDetail(null)} icon={<ArrowClockwise size={14} />}>
              게시 재시도
            </Button>
          ) : detail?.status === "scheduled" ? (
            <div className="flex gap-2">
              <Button full onClick={() => setDetail(null)} icon={<PaperPlaneTilt size={14} weight="bold" />}>
                지금 바로 게시
              </Button>
              <Button variant="secondary" onClick={() => setDetail(null)}>
                예약 취소
              </Button>
            </div>
          ) : undefined
        }
      >
        {detail && (
          <div className="space-y-5">
            <Thumb photo={detail.photo} alt={detail.title} size={200} rounded={8} className="w-full" />
            <div className="rounded-[6px] bg-[var(--bp-soft)] p-4">
              <Eyebrow>게시 상태</Eyebrow>
              <div className="mt-2">
                <Badge tone={STATUS_META[detail.status].tone}>{STATUS_META[detail.status].label}</Badge>
              </div>
              {detail.status === "failed" && (
                <p className="mt-3 text-[12.5px] leading-5 text-[var(--bp-danger-deep)]">
                  인스타그램 액세스 토큰 만료로 실패했습니다. 채널 연결을 갱신한 뒤 재시도하세요.
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              full
              onClick={() => {
                onNavigate("editor", detail.contentId);
                setDetail(null);
              }}
            >
              편집기에서 열기
            </Button>
          </div>
        )}
      </Drawer>

      <Drawer
        open={newOpen}
        title="게시 예약"
        subtitle="승인 완료된 콘텐츠만 예약할 수 있습니다"
        onClose={() => setNewOpen(false)}
        footer={
          <Button full onClick={() => setNewOpen(false)} icon={<CalendarBlank size={14} />}>
            예약 등록
          </Button>
        }
      >
        <div className="space-y-4">
          <Field label="콘텐츠" required>
            <Select
              value={target}
              options={contents.filter((c) => c.status === "approved").map((c) => c.title)}
              onChange={setTarget}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="게시일" required>
              <Input value={date} onChange={setDate} />
            </Field>
            <Field label="시각" required>
              <Input value={time} onChange={setTime} />
            </Field>
          </div>
          <div className="rounded-[6px] bg-[var(--bp-accent-soft)] px-3.5 py-3">
            <p className="text-[12.5px] leading-5 text-[var(--bp-accent-deep)]">
              이 채널의 최근 3개월 데이터 기준으로 화요일 18시에서 20시 사이 도달이 가장 높았습니다.
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
