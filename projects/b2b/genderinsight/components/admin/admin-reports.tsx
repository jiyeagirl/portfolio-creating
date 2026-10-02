"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, FilePdf, Plus, Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  Drawer,
  Field,
  PageHead,
  Row,
  Segmented,
  Select,
  Table,
  Tabs,
  Toggle,
} from "@/projects/b2b/genderinsight/components/ui";
import { ASSESSMENTS, AUDIT_LOG, REPORTS } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { ReportItem, ReportKind, ReportStatus } from "@/projects/b2b/genderinsight/lib/types";

const STATUS_TONE: Record<ReportStatus, "neutral" | "info" | "ink"> = {
  대기: "neutral",
  생성중: "info",
  생성완료: "ink",
};

export function AdminReports() {
  const [list, setList] = useState<ReportItem[]>(REPORTS);
  const [kindFilter, setKindFilter] = useState<ReportKind | "전체">("전체");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [generateOpen, setGenerateOpen] = useState(false);
  const [genAssessmentId, setGenAssessmentId] = useState(ASSESSMENTS[0].id);
  const [genKind, setGenKind] = useState<ReportKind>("조직");
  const [genAiSummary, setGenAiSummary] = useState(true);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => list.filter((r) => kindFilter === "전체" || r.kind === kindFilter),
    [list, kindFilter],
  );

  const reportHistory = AUDIT_LOG.filter((entry) => entry.action.includes("리포트")).slice(0, 3);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const download = (item: ReportItem) => {
    if (item.status !== "생성완료") return;
    setList((prev) => prev.map((r) => (r.id === item.id ? { ...r, downloadCount: r.downloadCount + 1 } : r)));
    setToast(`${item.targetName} 리포트를 다운로드했습니다.`);
    window.setTimeout(() => setToast(""), 2400);
  };

  const bulkDownload = () => {
    if (selected.size === 0) return;
    setList((prev) =>
      prev.map((r) => (selected.has(r.id) && r.status === "생성완료" ? { ...r, downloadCount: r.downloadCount + 1 } : r)),
    );
    setToast(`선택한 리포트 ${selected.size}건을 일괄 다운로드했습니다.`);
    setSelected(new Set());
    window.setTimeout(() => setToast(""), 2400);
  };

  const startGeneration = () => {
    const assessment = ASSESSMENTS.find((a) => a.id === genAssessmentId);
    if (!assessment) return;
    const id = `r${Date.now()}`;
    const newItem: ReportItem = {
      id,
      kind: genKind,
      targetName: genKind === "조직" ? `${assessment.name} 종합` : "선택 참여자 일괄",
      assessmentId: genAssessmentId,
      status: "생성중",
      aiSummary: genAiSummary,
      downloadCount: 0,
    };
    setList((prev) => [newItem, ...prev]);
    setGenerateOpen(false);
    window.setTimeout(() => {
      setList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "생성완료", generatedAt: "2026-01-28" } : r)),
      );
    }, 1800);
  };

  return (
    <div className="gi-enter space-y-6">
      <PageHead
        eyebrow="리포트 관리"
        title="리포트 관리"
        desc="개인 / 조직 리포트를 생성하고 AI 요약, 다운로드 이력을 관리합니다."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => setGenerateOpen(true)}>
            리포트 생성
          </Button>
        }
      />

      {reportHistory.length > 0 && (
        <Card soft>
          <CardHead title="최근 생성 이력" desc="리포트 관련 관리자 활동" />
          <ul className="space-y-2">
            {reportHistory.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
                <span className="text-[var(--gi-body)]">
                  <span className="font-medium text-[var(--gi-ink)]">{entry.actor}</span>
                  {"  "}
                  {entry.action}: {entry.target}
                </span>
                <span className="gi-mono text-[var(--gi-mute)]">{entry.at}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={kindFilter}
          onChange={setKindFilter}
          items={[
            { key: "전체", label: "전체", count: list.length },
            { key: "개인", label: "개인", count: list.filter((r) => r.kind === "개인").length },
            { key: "조직", label: "조직", count: list.filter((r) => r.kind === "조직").length },
          ]}
        />
        <Button
          variant="secondary"
          size="sm"
          icon={<DownloadSimple size={13} weight="bold" />}
          disabled={selected.size === 0}
          onClick={bulkDownload}
        >
          선택 일괄 다운로드 ({selected.size})
        </Button>
      </div>

      {toast && (
        <div className="gi-enter rounded-[6px] border border-[var(--gi-info-soft)] bg-[var(--gi-info-soft)] px-3 py-2 text-[12.5px] text-[var(--gi-info-deep)]">
          {toast}
        </div>
      )}

      <Card padded={false}>
        <div className="px-5 pt-5 pb-5">
          <Table head={["선택", "대상", "유형", "AI 요약", "상태", "다운로드", "액션"]} minWidth={680}>
            {filtered.map((r) => (
              <Row key={r.id}>
                <Cell>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selected.has(r.id)}
                    onClick={() => toggleSelect(r.id)}
                    className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                      selected.has(r.id) ? "border-[var(--gi-accent)] bg-[var(--gi-accent)]" : "border-[var(--gi-hairline-strong)]"
                    }`}
                  >
                    {selected.has(r.id) && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6.2 5 8.7l4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </Cell>
                <Cell strong>
                  {r.targetName}
                  <span className="mt-0.5 block text-[11.5px] font-normal text-[var(--gi-mute)]">
                    {ASSESSMENTS.find((a) => a.id === r.assessmentId)?.name}
                  </span>
                </Cell>
                <Cell muted>{r.kind}</Cell>
                <Cell>
                  {r.aiSummary ? (
                    <span className="flex items-center gap-1 text-[12px] text-[var(--gi-accent-deep)]">
                      <Sparkle size={12} weight="bold" />
                      포함
                    </span>
                  ) : (
                    <span className="text-[12px] text-[var(--gi-mute)]">미포함</span>
                  )}
                </Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </Cell>
                <Cell align="right" mono>
                  {r.downloadCount}회
                </Cell>
                <Cell align="right">
                  <button
                    type="button"
                    disabled={r.status !== "생성완료"}
                    onClick={() => download(r)}
                    className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--gi-accent-deep)] disabled:cursor-not-allowed disabled:text-[var(--gi-mute)]"
                  >
                    <FilePdf size={13} />
                    다운로드
                  </button>
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Drawer open={generateOpen} title="리포트 생성" subtitle="대상 진단과 유형을 선택하세요" onClose={() => setGenerateOpen(false)}>
        <div className="space-y-5">
          <Field label="대상 진단" required>
            <Select value={genAssessmentId} onChange={setGenAssessmentId} options={ASSESSMENTS.map((a) => a.id)} />
          </Field>
          <Field label="리포트 유형">
            <Segmented
              value={genKind}
              onChange={setGenKind}
              items={[
                { key: "조직", label: "조직 리포트" },
                { key: "개인", label: "개인 리포트 일괄" },
              ]}
            />
          </Field>
          <div className="flex items-center justify-between rounded-[6px] border border-[var(--gi-hairline)] px-3 py-2.5">
            <div>
              <p className="text-[13px] text-[var(--gi-ink)]">AI 결과 요약 포함</p>
              <p className="text-[12px] text-[var(--gi-mute)]">종합 분석 인사이트를 리포트에 함께 담습니다</p>
            </div>
            <Toggle on={genAiSummary} onChange={() => setGenAiSummary((prev) => !prev)} label="AI 결과 요약 포함" />
          </div>
          <p className="text-[12px] leading-5 text-[var(--gi-mute)]">
            PDF는 자동으로 생성되며, 생성이 완료되면 상태가 대기에서 생성완료로 바뀝니다.
          </p>
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" full onClick={() => setGenerateOpen(false)}>
            취소
          </Button>
          <Button full onClick={startGeneration}>
            생성 시작
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
