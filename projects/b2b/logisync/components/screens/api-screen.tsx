"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Cell,
  Code,
  Drawer,
  I,
  KeyValue,
  PageHead,
  SpecBand,
  SpecCell,
  Panel,
  Row,
  Table,
  Tabs,
} from "@/projects/b2b/logisync/components/ui";
import { APIS, API_KEYS, API_LOGS } from "@/projects/b2b/logisync/lib/mock-data";
import { fmt } from "@/projects/b2b/logisync/lib/navigation";
import type { ApiEndpoint, ApiStatus, Tone } from "@/projects/b2b/logisync/lib/types";

const API_TONE: Record<ApiStatus, Tone> = { 운영: "ok", 점검: "info", 오류: "danger", 예정: "neutral" };
const METHOD_TONE: Record<ApiEndpoint["method"], { bg: string; fg: string }> = {
  GET: { bg: "var(--ls-info-bg)", fg: "var(--ls-info-fg)" },
  POST: { bg: "var(--ls-ok-bg)", fg: "var(--ls-ok-fg)" },
  PUT: { bg: "var(--ls-warn-bg)", fg: "var(--ls-warn-fg)" },
};
const GROUPS = ["데이터 수신", "통합 조회", "기준정보 연계", "외부 연동"] as const;
type Group = "all" | (typeof GROUPS)[number];

function codeTone(code: number): Tone {
  if (code >= 500) return "danger";
  if (code >= 400) return code === 409 ? "warn" : "danger";
  return "ok";
}

export function ApiScreen() {
  const [group, setGroup] = useState<Group>("all");
  const [open, setOpen] = useState<ApiEndpoint | null>(null);
  const rows = useMemo(() => APIS.filter((a) => group === "all" || a.group === group), [group]);
  const live = APIS.filter((a) => a.status !== "예정");
  const calls = live.reduce((s, a) => s + a.calls24h, 0);

  return (
    <div className="space-y-8">
      <PageHead
        title="데이터 연계 API 관리"
        actions={
          <>
            <Button variant="outline" icon="file-text">
              API 문서
            </Button>
            <Button variant="primary" icon="key">
              API 키 발급
            </Button>
          </>
        }
      />

      <SpecBand cols={4}>
        <SpecCell label="24시간 호출" unit="건" value={fmt(calls)} />
        <SpecCell label="p95 중앙값" unit="ms" value="96" />
        <SpecCell label="오류율" unit="%" value="0.31" highlight />
        <SpecCell label="연결 클라이언트" unit="곳" value="14" />
      </SpecBand>

      <Panel flush>
        <div className="px-6 pt-5">
          <Tabs
            value={group}
            onChange={setGroup}
            items={[
              { key: "all", label: "전체", count: APIS.length },
              ...GROUPS.map((g) => ({ key: g as Group, label: g, count: APIS.filter((a) => a.group === g).length })),
            ]}
          />
        </div>
        <div className="pt-2">
          <Table head={["API 명", "엔드포인트", "24시간 호출 (건)", "최근 호출", "p95 (ms) / 오류율 (%)", "상태"]} align={["left", "left", "right", "left", "right", "left"]} minWidth={980}>
            {rows.map((a) => (
              <Row key={a.id} onClick={() => setOpen(a)}>
                <Cell>
                  <p className="text-[var(--ls-ink)]">{a.name}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--ls-muted)]">
                    <span className="ls-code">{a.id}</span> | {a.consumer}
                  </p>
                </Cell>
                <Cell>
                  <span className="flex items-center gap-2">
                    <Method m={a.method} />
                    <span className="ls-code max-w-[260px] truncate text-[12px] text-[var(--ls-body-strong)]">{a.path}</span>
                  </span>
                </Cell>
                <Cell align="right">
                  <span className="ls-num font-semibold text-[var(--ls-ink)]">{a.status === "예정" ? "없음" : fmt(a.calls24h)}</span>
                </Cell>
                <Cell>
                  <span className="ls-num">{a.lastCall}</span>
                </Cell>
                <Cell align="right">
                  {a.status === "예정" ? (
                    <span className="text-[var(--ls-muted)]">측정 전</span>
                  ) : (
                    <span className="ls-num">
                      {fmt(a.p95)}
                      <span className="mx-1.5 text-[var(--ls-disabled)]">/</span>
                      <span style={{ color: a.errorRate > 1 ? "var(--ls-danger-fg)" : "var(--ls-muted)" }}>{a.errorRate.toFixed(1)}</span>
                    </span>
                  )}
                </Cell>
                <Cell>
                  <Badge tone={API_TONE[a.status]}>{a.status}</Badge>
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Panel>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel title="연계 이력" flush action={<Badge tone="ok">실시간</Badge>}>
          <ol className="ls-code mx-4 mb-4 rounded-xl bg-[var(--ls-canvas)] py-2 text-[12px] leading-5">
            {API_LOGS.map((l) => (
              <li key={l.at} className="grid grid-cols-[96px_44px_minmax(0,1fr)_40px_56px] items-baseline gap-3 px-6 py-2 md:grid-cols-[104px_48px_minmax(0,1fr)_40px_56px]">
                <span className="text-[var(--ls-muted)]">{l.at}</span>
                <span className="text-[var(--ls-body-strong)]">{l.method}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[var(--ls-ink)]" title={l.path}>
                    {l.path}
                  </span>
                  <span className="block truncate text-[11px] text-[var(--ls-muted)]">{l.client}</span>
                </span>
                <span className="text-right font-bold" style={{ color: `var(--ls-${codeTone(l.code)}-fg)` }}>
                  {l.code}
                </span>
                <span className="text-right text-[var(--ls-muted)]">{l.ms}ms</span>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="space-y-6">
          <Panel title="API 키" flush>
            <ul>
              {API_KEYS.map((k) => (
                <li key={k.name} className="flex items-center gap-3 border-b border-[var(--ls-hairline-soft)] px-6 last:border-b-0 py-3">
                  <I icon="key" size={18} className="text-[var(--ls-muted)]" />
                  <div className="min-w-0 flex-1">
                    <p className="ls-code text-[13px] text-[var(--ls-ink)]">{k.name}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[var(--ls-muted)]">
                      {k.owner} | 발급 {k.created}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Code className="text-[10px]">{k.scope}</Code>
                    <p className="mt-1 text-[11px] text-[var(--ls-muted)]">{k.lastUsed}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="외부 시스템 연동 준비">
            <ol className="space-y-4">
              {[
                ["K사 ERP", "전표 연동 스키마 합의 완료, 테스트 서버 연결 중", 2],
                ["L사 SCM", "수요 계획 피드 요건 협의 중", 1],
              ].map(([name, note, step]) => (
                <li key={name as string}>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-[var(--ls-ink)]">{name}</p>
                    <span className="ls-num text-[12px] text-[var(--ls-muted)]">{step} / 4 단계</span>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="h-[6px] rounded-full" style={{ background: i < (step as number) ? "var(--ls-ink)" : "var(--ls-elevated)" }} />
                    ))}
                  </div>
                  <p className="mt-2 text-[12px] text-[var(--ls-body)]">{note}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>

      <ApiDrawer api={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function Method({ m }: { m: ApiEndpoint["method"] }) {
  return (
    <span className="ls-code w-11 shrink-0 rounded-[6px] py-px text-center text-[10px] font-bold" style={{ background: METHOD_TONE[m].bg, color: METHOD_TONE[m].fg }}>
      {m}
    </span>
  );
}

function ApiDrawer({ api, onClose }: { api: ApiEndpoint | null; onClose: () => void }) {
  return (
    <Drawer
      open={!!api}
      onClose={onClose}
      eyebrow={api?.id}
      title={api?.name ?? ""}
      footer={
        <>
          <Button variant="primary" icon="play" onClick={onClose}>
            테스트 호출
          </Button>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </>
      }
    >
      {api && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 rounded-xl bg-[var(--ls-canvas)] px-3 py-3">
            <Method m={api.method} />
            <span className="ls-code break-all text-[13px] text-[var(--ls-ink)]">{api.path}</span>
          </div>
          <KeyValue
            rows={[
              ["분류", api.group],
              ["상태", <Badge key="s" tone={API_TONE[api.status]}>{api.status}</Badge>],
              ["사용처", api.consumer],
              ["24시간 호출", <span key="c" className="ls-num">{fmt(api.calls24h)}</span>],
              ["인증", "API 키 + 인증서"],
              ["호출 한도", "분당 3,000회"],
            ]}
          />
          <div>
            <p className="mb-2 text-[12px] text-[var(--ls-muted)]">응답 예시</p>
            <pre className="ls-code ls-scroll overflow-x-auto rounded-xl bg-[var(--ls-canvas)] p-4 text-[12px] leading-5 text-[var(--ls-body-strong)]">
{`{
  "id": "UT-2604-0418822",
  "movement": "OUTBOUND",
  "std_item_code": "LS-000192",
  "qty": 24,
  "unit": "EA",
  "site": "PTK",
  "status": "출고완료",
  "occurred_at": "2026-04-15T13:52:00+09:00",
  "lineage": {
    "source_system": "PTK-WMS",
    "source_ref": "OUT-55108/002",
    "collected_at": "2026-04-15T14:02:40+09:00"
  }
}`}
            </pre>
          </div>
        </div>
      )}
    </Drawer>
  );
}
