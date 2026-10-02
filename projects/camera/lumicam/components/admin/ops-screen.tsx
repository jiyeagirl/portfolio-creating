"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { PageHead, Stat, Card, CardHead, Table, Row, Cell, Badge, Button, Tabs, BarChart, Meter, type Tone } from "@/projects/camera/lumicam/components/admin/ui";
import { downloadStats, activityStats, gpuStatus, renderLogs, errorLogs, releaseNotes } from "@/projects/camera/lumicam/lib/mock-data";

const LOG_TABS = [
  { key: "render", label: "렌더링 로그" },
  { key: "error", label: "오류 로그" },
] as const;

type LogTab = (typeof LOG_TABS)[number]["key"];

const RENDER_STATUS_TONE: Record<string, Tone> = { 정상: "accent", 저하: "warn", 실패: "danger" };

export function OpsScreen() {
  const [logTab, setLogTab] = useState<LogTab>("render");

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="운영"
        title="시스템 운영"
        desc="GPU 렌더링 상태, 필터 다운로드/이용 통계, 오류 로그와 앱 배포 현황을 한 곳에서 확인합니다."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="렌더 큐" value={`${gpuStatus.renderQueue}건`} note={`업데이트 ${gpuStatus.updatedAt}`} />
        <Stat label="평균 GPU 처리시간" value={`${gpuStatus.avgGpuMs}ms`} />
        <Stat label="프레임 드롭률" value={`${gpuStatus.frameDropRate}%`} />
        <Stat label="LUT 캐시 히트율" value={`${gpuStatus.cacheHitRate}%`} />
      </div>

      <Card>
        <CardHead
          title="필터 캐시 관리"
          desc="디바이스 로컬에 캐시된 3D LUT를 원격에서 무효화할 수 있습니다."
          action={
            <Button variant="secondary" size="sm" icon={<Icon icon="solar:restart-linear" width={13} />}>
              전체 캐시 무효화
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-1.5 text-[12px] text-[var(--lc-mute)]">캐시 히트율</p>
            <Meter value={gpuStatus.cacheHitRate} />
          </div>
          <div>
            <p className="mb-1.5 text-[12px] text-[var(--lc-mute)]">평균 LUT 로드 시간</p>
            <p className="text-[13px] font-medium tabular-nums text-[var(--lc-ink)]">42ms</p>
          </div>
          <div>
            <p className="mb-1.5 text-[12px] text-[var(--lc-mute)]">캐시 용량 사용</p>
            <p className="text-[13px] font-medium tabular-nums text-[var(--lc-ink)]">18.4MB / 64MB</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHead title="필터 다운로드 통계" desc="필름/필터 팩별 누적 다운로드(단위: K)" />
          <BarChart data={downloadStats} format={(v) => `${v}K`} />
        </Card>
        <Card>
          <CardHead title="사용자 이용 현황" desc="2022년 3월 출시 이후 월별 추이" />
          <Table head={["월", "DAU", "촬영 수"]} minWidth={360}>
            {activityStats.map((row) => (
              <Row key={row.month}>
                <Cell strong>{row.month}</Cell>
                <Cell mono>{row.dau.toLocaleString()}</Cell>
                <Cell mono muted>
                  {row.shots.toLocaleString()}
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>
      </div>

      <Card>
        <Tabs value={logTab} items={LOG_TABS as unknown as { key: LogTab; label: string }[]} onChange={setLogTab} />
        <div className="pt-4">
          {logTab === "render" ? (
            <Table head={["시각", "디바이스", "필름", "GPU 처리시간", "프레임 드롭", "상태"]} minWidth={680}>
              {renderLogs.map((log) => (
                <Row key={log.id}>
                  <Cell mono muted>
                    {log.at}
                  </Cell>
                  <Cell>{log.device}</Cell>
                  <Cell muted>{log.filmId}</Cell>
                  <Cell mono align="right">
                    {log.gpuMs}ms
                  </Cell>
                  <Cell mono align="right">
                    {log.frameDrops}
                  </Cell>
                  <Cell>
                    <Badge tone={RENDER_STATUS_TONE[log.status]}>{log.status}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          ) : (
            <Table head={["시각", "코드", "메시지", "디바이스", "처리"]} minWidth={720}>
              {errorLogs.map((log) => (
                <Row key={log.id}>
                  <Cell mono muted>
                    {log.at}
                  </Cell>
                  <Cell mono>{log.code}</Cell>
                  <Cell muted>{log.message}</Cell>
                  <Cell muted>{log.device}</Cell>
                  <Cell>
                    <Badge tone={log.resolved ? "accent" : "danger"}>{log.resolved ? "해결됨" : "미해결"}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          )}
        </div>
      </Card>

      <Card>
        <CardHead title="앱 버전 및 리소스 배포 관리" desc="정식/베타 채널별 배포 이력과 적용률" />
        <Table head={["버전", "배포일", "채널", "노트", "적용률"]} minWidth={720}>
          {releaseNotes.map((r) => (
            <Row key={r.version}>
              <Cell strong mono>
                {r.version}
              </Cell>
              <Cell mono muted>
                {r.releasedAt}
              </Cell>
              <Cell>
                <Badge tone={r.channel === "정식" ? "accent" : "neutral"}>{r.channel}</Badge>
              </Cell>
              <Cell muted>{r.notes}</Cell>
              <Cell align="right" mono>
                {r.adoption}%
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
