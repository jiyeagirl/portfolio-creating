"use client";

import { useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { Badge, Button, Card, CardHead, PageHead, Row, Cell, Table, Tabs } from "@/projects/monitoring/petlive/components/admin/admin-ui";
import { ERP_RECORDS, LOGS } from "@/projects/monitoring/petlive/lib/mock-data";
import { LOG_KIND_LABEL, dateTime, type AdminNavigate } from "@/projects/monitoring/petlive/lib/navigation";
import type { LogKind } from "@/projects/monitoring/petlive/lib/types";

const SEVERITY_TONE = {
  info: "info",
  warn: "warning",
  critical: "negative",
} as const;

const SEVERITY_LABEL: Record<string, string> = {
  info: "정보",
  warn: "주의",
  critical: "심각",
};

const ERP_STATUS_LABEL = {
  synced: "동기화 완료",
  pending: "대기 중",
  failed: "실패",
} as const;

const ERP_STATUS_TONE = {
  synced: "positive",
  pending: "neutral",
  failed: "negative",
} as const;

export function LogsScreen({}: { onNavigate: AdminNavigate }) {
  const [tab, setTab] = useState<"all" | LogKind>("all");
  const [exported, setExported] = useState(false);

  const filtered = useMemo(() => LOGS.filter((log) => tab === "all" || log.kind === tab), [tab]);

  const counts = useMemo(
    () => ({
      all: LOGS.length,
      event: LOGS.filter((l) => l.kind === "event").length,
      login: LOGS.filter((l) => l.kind === "login").length,
      connection: LOGS.filter((l) => l.kind === "connection").length,
      error: LOGS.filter((l) => l.kind === "error").length,
    }),
    [],
  );

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="관리자 콘솔"
        title="로그 관리 | ERP 연동"
        desc="이벤트, 로그인, 디바이스 연결, 장애 로그를 통합 조회하고 ERP 연동 현황을 확인하세요."
        actions={
          <Button
            variant="secondary"
            icon={<DownloadSimple size={15} weight="bold" />}
            onClick={() => {
              setExported(true);
              setTimeout(() => setExported(false), 2200);
            }}
          >
            {exported ? "내보내기 완료" : "Excel로 내보내기"}
          </Button>
        }
      />

      <Card padded={false}>
        <div className="px-5 pt-5">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { key: "all", label: "전체", count: counts.all },
              { key: "event", label: "이벤트", count: counts.event },
              { key: "login", label: "로그인", count: counts.login },
              { key: "connection", label: "디바이스 연결", count: counts.connection },
              { key: "error", label: "장애 | 오류", count: counts.error },
            ]}
          />
        </div>
        <div className="p-5">
          <Table head={["종류", "메시지", "주체", "심각도", "시각"]} minWidth={640}>
            {filtered.map((log) => (
              <Row key={log.id}>
                <Cell muted>{LOG_KIND_LABEL[log.kind]}</Cell>
                <Cell strong>{log.message}</Cell>
                <Cell muted>{log.actor}</Cell>
                <Cell>
                  <Badge tone={SEVERITY_TONE[log.severity]}>{SEVERITY_LABEL[log.severity]}</Badge>
                </Cell>
                <Cell muted mono nowrap>
                  {dateTime(log.at)}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHead
            title="ERP 연동 현황"
            desc="회원 등급, 결제 정보, 디바이스 자산 데이터를 사내 ERP 시스템과 매일 새벽 동기화합니다."
          />
        </div>
        <div className="p-5">
          <Table head={["회원", "이메일", "연동 항목", "상태", "최근 동기화"]} minWidth={620}>
            {ERP_RECORDS.map((record) => (
              <Row key={record.id}>
                <Cell strong>{record.memberName}</Cell>
                <Cell muted>{record.memberEmail}</Cell>
                <Cell muted>{record.field}</Cell>
                <Cell>
                  <Badge tone={ERP_STATUS_TONE[record.status]} dot>
                    {ERP_STATUS_LABEL[record.status]}
                  </Badge>
                </Cell>
                <Cell muted mono nowrap>
                  {dateTime(record.syncedAt)}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>
    </div>
  );
}
