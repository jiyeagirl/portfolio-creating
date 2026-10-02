"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Cell, DefList, Drawer, Field, PageHead, Row, Select, Table, Tabs } from "@/projects/community/waypoint/components/admin/admin-ui";
import { REPORTS } from "@/projects/community/waypoint/lib/mock-data";
import type { Report } from "@/projects/community/waypoint/lib/types";

const TABS: (Report["status"] | "전체")[] = ["전체", "대기", "처리중", "완료"];
const PENALTIES: Report["penalty"][] = ["경고", "7일 정지", "30일 정지", "영구정지", "조치없음"];

function statusTone(status: Report["status"]) {
  return status === "대기" ? ("warn" as const) : status === "처리중" ? ("accent" as const) : ("neutral" as const);
}

export function ReportsScreen() {
  const [tab, setTab] = useState<Report["status"] | "전체">("전체");
  const [reports, setReports] = useState(REPORTS);
  const [active, setActive] = useState<Report | null>(null);
  const [penalty, setPenalty] = useState<NonNullable<Report["penalty"]>>("경고");
  const [memo, setMemo] = useState("");

  const filtered = useMemo(() => reports.filter((r) => (tab === "전체" ? true : r.status === tab)), [tab, reports]);

  function openDetail(r: Report) {
    setActive(r);
    setPenalty(r.penalty ?? "경고");
    setMemo(r.memo ?? "");
  }

  function resolve() {
    if (!active) return;
    setReports((prev) => prev.map((r) => (r.id === active.id ? { ...r, status: "완료", penalty, memo } : r)));
    setActive(null);
  }

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Reports" title="신고 관리" desc="사기의심, 허위매물, 비매너 신고를 접수하고 제재 이력을 관리합니다." />

      <Tabs
        value={tab}
        onChange={setTab}
        items={TABS.map((t) => ({ key: t, label: t, count: t === "전체" ? reports.length : reports.filter((r) => r.status === t).length }))}
      />

      <Card padded={false} className="p-5">
        <Table head={["유형", "대상", "신고자", "피신고자", "접수일", "상태"]} minWidth={700}>
          {filtered.map((r) => (
            <Row key={r.id} onClick={() => openDetail(r)}>
              <Cell strong>{r.type}</Cell>
              <Cell muted>{r.targetLabel}</Cell>
              <Cell>{r.reporterNickname}</Cell>
              <Cell>{r.reportedNickname}</Cell>
              <Cell mono muted nowrap>{r.createdAt}</Cell>
              <Cell><Badge tone={statusTone(r.status)}>{r.status}</Badge></Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.type ?? ""}
        subtitle={active ? `접수일 ${active.createdAt}` : undefined}
        footer={
          active &&
          active.status !== "완료" && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setActive(null)}>취소</Button>
              <Button onClick={resolve}>처리완료로 저장</Button>
            </div>
          )
        }
      >
        {active && (
          <div className="space-y-6">
            <DefList
              items={[
                { label: "대상 유형", value: active.targetType },
                { label: "대상", value: active.targetLabel },
                { label: "신고자", value: active.reporterNickname },
                { label: "피신고자", value: active.reportedNickname },
                { label: "현재 상태", value: <Badge tone={statusTone(active.status)}>{active.status}</Badge> },
              ]}
            />
            {active.status === "완료" ? (
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-[var(--wp-ink)]">처리 메모</p>
                <p className="text-[13.5px] leading-6 text-[var(--wp-body)]">{active.memo}</p>
                {active.penalty && (
                  <div className="mt-2">
                    <Badge tone={active.penalty === "조치없음" ? "neutral" : "danger"}>{active.penalty}</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="제재 수위">
                  <Select value={penalty} options={PENALTIES as string[]} onChange={(v) => setPenalty(v as NonNullable<Report["penalty"]>)} />
                </Field>
                <Field label="처리 메모" hint="회원 이력에 함께 기록됩니다">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={4}
                    placeholder="확인한 내용과 처리 사유를 입력하세요"
                    className="w-full rounded-[6px] border border-[var(--wp-border)] bg-[var(--wp-surface)] px-3 py-2 text-[13.5px] leading-5 text-[var(--wp-ink)] outline-none focus:border-[var(--wp-border-strong)]"
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
