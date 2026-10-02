"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise, ArrowsClockwise } from "@phosphor-icons/react";
import { ERP_LOGS } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { ErpModule, ErpSyncLog } from "@/projects/commerce/snowpeak/lib/types";
import {
  Badge,
  Button,
  Card,
  Cell,
  DefList,
  Drawer,
  PageHead,
  Row,
  Table,
  Timeline,
} from "@/projects/commerce/snowpeak/components/admin/admin-ui";
import type { Tone } from "@/projects/commerce/snowpeak/lib/navigation";

const MODULES: ErpModule[] = ["예약", "결제", "상품", "재고", "회원", "매출", "정산"];

const STATUS_TONE: Record<ErpSyncLog["status"], Tone> = {
  성공: "success",
  실패: "danger",
  대기: "warn",
};

function latestLog(module: ErpModule): ErpSyncLog {
  return ERP_LOGS.filter((log) => log.module === module).sort((a, b) => b.syncedAt.localeCompare(a.syncedAt))[0];
}

export function AdminErp() {
  const [openId, setOpenId] = useState<string | null>(null);

  const logs = useMemo(() => [...ERP_LOGS].sort((a, b) => b.syncedAt.localeCompare(a.syncedAt)), []);

  const openLog = ERP_LOGS.find((log) => log.id === openId) ?? null;
  const relatedLogs = openLog
    ? ERP_LOGS.filter((log) => log.module === openLog.module).sort((a, b) => b.syncedAt.localeCompare(a.syncedAt))
    : [];

  const failedOrPending = ERP_LOGS.filter((log) => log.status !== "성공").length;

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="ERP 연동"
        title="운영 시스템 연동 현황"
        desc="예약, 결제, 상품, 재고, 회원, 매출, 정산 데이터가 리조트 ERP와 어떻게 맞물려 동기화되는지 모듈별 상태와 로그로 확인합니다."
        actions={
          <Button variant="primary" icon={<ArrowsClockwise size={14} weight="bold" />}>
            전체 동기화
          </Button>
        }
      />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">모듈별 연동 상태</h2>
          {failedOrPending > 0 && (
            <span className="sp-num text-[12px] text-[var(--sp-mute)]">주의 필요 로그 {failedOrPending}건</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {MODULES.map((module) => {
            const log = latestLog(module);
            return (
              <Card key={module} className="flex flex-col gap-2.5">
                <p className="text-[13px] font-medium text-[var(--sp-ink)]">{module}</p>
                <Badge tone={STATUS_TONE[log.status]}>{log.status}</Badge>
                <p className="sp-num text-[11px] leading-4 text-[var(--sp-mute)]">{log.syncedAt}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--sp-ink)]">연동 로그 및 오류 관리</h2>
          <p className="mt-1 text-[13px] leading-5 text-[var(--sp-mute)]">
            실패하거나 대기 중인 로그 행을 누르면 상세 내역과 재동기화 조치를 확인할 수 있습니다.
          </p>
        </div>

        <Table
          head={["모듈", "상태", "동기화 시각", "처리건수", "메시지"]}
          align={["left", "left", "left", "right", "left"]}
          minWidth={680}
        >
          {logs.map((log) => {
            const actionable = log.status !== "성공";
            return (
              <Row key={log.id} onClick={actionable ? () => setOpenId(log.id) : undefined} active={log.id === openId}>
                <Cell>
                  <Badge tone="neutral">{log.module}</Badge>
                </Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[log.status]}>{log.status}</Badge>
                </Cell>
                <Cell mono nowrap muted>
                  {log.syncedAt}
                </Cell>
                <Cell align="right" mono>
                  {log.recordCount}
                </Cell>
                <Cell muted>{log.message}</Cell>
              </Row>
            );
          })}
        </Table>
      </Card>

      <Drawer
        open={openLog !== null}
        title={openLog ? `${openLog.module} 연동 로그` : ""}
        subtitle={openLog?.id}
        onClose={() => setOpenId(null)}
        footer={
          openLog && (
            <Button variant="primary" icon={<ArrowClockwise size={14} weight="bold" />}>
              재동기화
            </Button>
          )
        }
      >
        {openLog && (
          <div className="space-y-6">
            <DefList
              items={[
                { label: "모듈", value: openLog.module },
                { label: "상태", value: <Badge tone={STATUS_TONE[openLog.status]}>{openLog.status}</Badge> },
                { label: "동기화 시각", value: <span className="sp-num">{openLog.syncedAt}</span> },
                { label: "처리건수", value: <span className="sp-num">{openLog.recordCount}건</span> },
              ]}
              columns={1}
            />

            <div>
              <p className="text-[13px] font-medium text-[var(--sp-ink)]">오류 메시지</p>
              <p className="mt-1.5 rounded-[6px] border border-[var(--sp-border)] bg-[var(--sp-surface-soft)] px-3 py-2.5 text-[13px] leading-5 text-[var(--sp-body)]">
                {openLog.message}
              </p>
            </div>

            <div>
              <p className="mb-3 text-[13px] font-medium text-[var(--sp-ink)]">{openLog.module} 모듈 최근 동기화 이력</p>
              <Timeline
                steps={relatedLogs.map((log) => ({
                  label: log.message,
                  at: log.syncedAt,
                  done: log.status === "성공",
                  note: `처리 ${log.recordCount}건 | 상태 ${log.status}`,
                }))}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
