"use client";

import { Badge, Button, Card, CardHead, Cell, PageHead, Row, Stat, Table } from "@/projects/platform/studyspot/components/admin/admin-ui";
import {
  CONTENT_KIND_LABEL,
  DEVICE_STATUS_LABEL,
  DEVICE_STATUS_TONE,
  dateOnly,
  dateTime,
  won,
  type AdminNavigate,
  type Tone,
} from "@/projects/platform/studyspot/lib/navigation";
import { BRANCHES, CONTENT_ITEMS, FAULT_LOGS, IOT_DEVICES } from "@/projects/platform/studyspot/lib/mock-data";
import type { DeviceStatus } from "@/projects/platform/studyspot/lib/types";

const GANGNAM = BRANCHES.find((branch) => branch.id === "gangnam")!;

const FACILITY_USAGE: { label: string; pct: number }[] = [
  { label: "자유석", pct: 74 },
  { label: "고정석", pct: 100 },
  { label: "스터디룸", pct: 58 },
];

const SEVERITY_TONE: Record<(typeof FAULT_LOGS)[number]["severity"], Tone> = {
  critical: "negative",
  warn: "warning",
  info: "neutral",
};

const SEVERITY_LABEL: Record<(typeof FAULT_LOGS)[number]["severity"], string> = {
  critical: "긴급",
  warn: "주의",
  info: "안내",
};

const DEVICE_STATUS_ORDER: DeviceStatus[] = ["normal", "warning", "error", "offline"];

export function DashboardScreen({ onNavigate }: { onNavigate: AdminNavigate }) {
  const deviceCounts = DEVICE_STATUS_ORDER.map((status) => ({
    status,
    count: IOT_DEVICES.filter((device) => device.status === status).length,
  }));

  const publishedContent = CONTENT_ITEMS.filter((item) => item.status === "published").slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        eyebrow="점주 관리자 콘솔"
        title="운영 대시보드"
        desc={`${GANGNAM.name}의 오늘 이용 현황, 예약 현황, 매출 현황을 한눈에 확인하세요.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="오늘 이용객 수" value="186명" delta="+12%" note="전일 대비" />
        <Stat label="좌석 이용률" value="74%" note={`자유석 ${GANGNAM.freeSeatTotal - GANGNAM.freeSeatAvailable} / ${GANGNAM.freeSeatTotal}석`} />
        <Stat label="오늘 예약 건수" value="32건" delta="+5건" note="전일 대비" />
        <Stat label="이번 달 매출" value={won(GANGNAM.monthlyRevenue)} delta="+8%" note="전월 대비" emphasis />
      </div>

      <Card>
        <CardHead title="시설 이용 통계" desc="시설 유형별 오늘 좌석/룸 이용률" />
        <div className="flex flex-col gap-4">
          {FACILITY_USAGE.map((facility) => (
            <div key={facility.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-[var(--ss-ink)]">{facility.label}</span>
                <span className="ss-mono text-[13px] text-[var(--ss-mute)]">{facility.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--ss-surface)]">
                <div
                  className="h-2 rounded-full bg-[var(--ss-ink)]"
                  style={{ width: `${facility.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 items-start">
        <Card>
          <CardHead
            title="IoT 장비 현황 요약"
            desc={`${GANGNAM.name} 등록 장비 ${IOT_DEVICES.length}대`}
            action={
              <Button variant="ghost" size="sm" onClick={() => onNavigate("devices")}>
                전체보기
              </Button>
            }
          />
          <ul className="flex flex-col gap-3">
            {deviceCounts.map(({ status, count }) => (
              <li key={status} className="flex items-center justify-between border-b border-[var(--ss-hairline)] pb-3 last:border-b-0 last:pb-0">
                <Badge tone={DEVICE_STATUS_TONE[status]} dot>
                  {DEVICE_STATUS_LABEL[status]}
                </Badge>
                <span className="ss-mono text-[14px] font-medium text-[var(--ss-ink)]">{count}대</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead title="최근 장애 알림" desc="장비 이상 감지 및 점검 이력" />
          <ul className="flex flex-col gap-3">
            {FAULT_LOGS.slice(0, 4).map((log) => (
              <li key={log.id} className="flex items-start justify-between gap-3 border-b border-[var(--ss-hairline)] pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-[var(--ss-ink)]">{log.message}</p>
                  <p className="ss-mono mt-1 text-[12px] text-[var(--ss-mute)]">{dateTime(log.occurredAt)}</p>
                </div>
                <Badge tone={SEVERITY_TONE[log.severity]}>{SEVERITY_LABEL[log.severity]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHead
          title="게시 중인 콘텐츠"
          desc="현재 노출 중인 공지, 이벤트, 배너"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate("content")}>
              전체보기
            </Button>
          }
        />
        <Table head={["종류", "제목", "게시 기간", "노출"]} minWidth={520}>
          {publishedContent.map((item) => (
            <Row key={item.id}>
              <Cell muted>{CONTENT_KIND_LABEL[item.kind]}</Cell>
              <Cell strong>{item.title}</Cell>
              <Cell mono muted nowrap>
                {dateOnly(item.startAt)} ~ {dateOnly(item.endAt)}
              </Cell>
              <Cell>
                <Badge tone={item.visible ? "positive" : "neutral"}>{item.visible ? "노출중" : "숨김"}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
