"use client";

import { useMemo, useState } from "react";
import { BellRinging, ChatCircleText, DeviceMobile, EnvelopeSimple } from "@phosphor-icons/react";
import { Badge, Cell, EmptyState, PageHead, Row, SearchInput, Segmented, Stat, Table, Tabs } from "@/projects/b2b/orderlog/components/ui";
import { notifications } from "@/projects/b2b/orderlog/lib/mock-data";
import { SEVERITY_LABEL, SEVERITY_TONE } from "@/projects/b2b/orderlog/lib/navigation";
import type { Channel, Severity } from "@/projects/b2b/orderlog/lib/types";

const CHANNEL_LABEL: Record<Channel, string> = {
  kakao: "알림톡",
  sms: "SMS",
  push: "앱 알림",
};

const CHANNEL_ICON: Record<Channel, React.ComponentType<{ size?: number }>> = {
  kakao: ChatCircleText,
  sms: EnvelopeSimple,
  push: DeviceMobile,
};

const STATUS_TONE = {
  발송완료: "success",
  발송실패: "danger",
  대기중: "neutral",
} as const;

type ChannelFilter = "all" | Channel;
type SeverityFilter = "all" | Severity;

export function NotificationsScreen() {
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (channel !== "all" && n.channel !== channel) return false;
      if (severity !== "all" && n.severity !== severity) return false;
      if (query && !n.title.includes(query) && !n.detail.includes(query)) return false;
      return true;
    });
  }, [channel, severity, query]);

  const urgentCount = notifications.filter((n) => n.severity === "urgent").length;
  const failedCount = notifications.filter((n) => n.status === "발송실패").length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="알림"
        title="스마트 알림 센터"
        desc="알림톡, SMS, 앱 알림을 심각도별로 모아 확인하고 발송 로그를 조회합니다."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="긴급 알림" value={`${urgentCount}건`} note="이번 주" emphasis />
        <Stat label="전체 발송" value={`${notifications.length}건`} note="최근 7일" />
        <Stat label="발송 실패" value={`${failedCount}건`} note="재발송 필요" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={channel}
          onChange={setChannel}
          items={[
            { key: "all" as ChannelFilter, label: "전체" },
            { key: "kakao" as ChannelFilter, label: "알림톡" },
            { key: "sms" as ChannelFilter, label: "SMS" },
            { key: "push" as ChannelFilter, label: "앱 알림" },
          ]}
        />
        <div className="flex items-center gap-2.5">
          <Segmented
            value={severity}
            onChange={setSeverity}
            items={[
              { key: "all" as SeverityFilter, label: "전체" },
              { key: "normal" as SeverityFilter, label: "일반" },
              { key: "caution" as SeverityFilter, label: "주의" },
              { key: "urgent" as SeverityFilter, label: "긴급" },
            ]}
          />
          <div className="w-[200px]">
            <SearchInput value={query} onChange={setQuery} placeholder="제목, 내용 검색" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BellRinging size={20} />} title="조건에 맞는 알림이 없습니다" desc="필터를 조정해 다른 알림 로그를 확인해 보세요." />
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]">
          <div className="p-5">
            <Table
              head={["채널", "알림", "대상", "발송 시각", "심각도", "상태"]}
              align={["left", "left", "left", "left", "left", "left"]}
              minWidth={720}
            >
              {filtered.map((n) => {
                const Icon = CHANNEL_ICON[n.channel];
                return (
                  <Row key={n.id}>
                    <Cell nowrap>
                      <span className="flex items-center gap-1.5 text-[12.5px] text-[var(--ot-body)]">
                        <Icon size={13} />
                        {CHANNEL_LABEL[n.channel]}
                      </span>
                    </Cell>
                    <Cell strong>
                      <span className="flex items-center gap-1.5">
                        {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ot-accent)]" />}
                        <span>
                          <span className="block">{n.title}</span>
                          <span className="block text-[12px] font-normal text-[var(--ot-mute)]">{n.detail}</span>
                        </span>
                      </span>
                    </Cell>
                    <Cell muted nowrap>
                      {n.target}
                    </Cell>
                    <Cell mono nowrap muted>
                      {n.sentAt}
                    </Cell>
                    <Cell>
                      <Badge tone={SEVERITY_TONE[n.severity]}>{SEVERITY_LABEL[n.severity]}</Badge>
                    </Cell>
                    <Cell>
                      <Badge tone={STATUS_TONE[n.status]}>{n.status}</Badge>
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
