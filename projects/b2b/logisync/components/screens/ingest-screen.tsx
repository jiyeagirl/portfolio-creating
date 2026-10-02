"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Cell,
  CenterTag,
  Code,
  Drawer,
  I,
  KeyValue,
  MiniBars,
  PageHead,
  Panel,
  Photo,
  Row,
  Select,
  Table,
  Toggle,
} from "@/projects/b2b/logisync/components/ui";
import { CENTERS, HOUR_LABELS, INGEST_RUNS, PIPELINE } from "@/projects/b2b/logisync/lib/mock-data";
import { LINK_TONE, fmt, type View } from "@/projects/b2b/logisync/lib/navigation";
import type { Center, IngestRun, Tone } from "@/projects/b2b/logisync/lib/types";

const RUN_TONE: Record<IngestRun["status"], Tone> = { 완료: "ok", "진행 중": "info", 지연: "warn", 실패: "danger" };

const METHOD_ICON: Record<Center["method"], string> = {
  API: "solar:code-square-linear",
  DB: "solar:database-linear",
  파일: "solar:file-text-linear",
};

export function IngestScreen({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [editing, setEditing] = useState<Center | null>(null);
  const [requested, setRequested] = useState<string[]>([]);

  return (
    <div className="space-y-10">
      <PageHead
        code="01 수집"
        title="데이터 수집 및 연계"
        oneLine
        desc="센터마다 다른 WMS와 작업 시스템을 각자의 방식으로 연결하고, 모든 레코드에 원천 시스템과 수집 시점을 함께 기록합니다."
        actions={
          <>
            <Button variant="outline" icon="solar:monitor-linear" onClick={() => onNavigate("monitor")}>
              상태 모니터링
            </Button>
            <Button variant="primary" icon="solar:add-square-linear">
              센터 연계 추가
            </Button>
          </>
        }
      />

      <Pipeline />

      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-medium leading-7 text-[var(--ls-ink)]">센터별 연계</h2>
          </div>
          <p className="hidden items-center gap-1.5 text-[12px] text-[var(--ls-muted)] sm:flex">
            <I icon="solar:chart-2-linear" size={14} />
            최근 12시간 시간대별 수집 건수
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {CENTERS.map((c) => (
            <CenterCard
              key={c.id}
              center={c}
              requested={requested.includes(c.id)}
              onRequest={() => setRequested((r) => [...r, c.id])}
              onEdit={() => setEditing(c)}
            />
          ))}
        </div>
      </div>

      <Panel title="최근 수집 이력" flush action={<Button size="sm" variant="ghost" icon="solar:history-linear">전체 이력</Button>}>
        <Table
          head={["배치 ID", "센터", "데이터", "시작", "수집 건수", "소요", "상태"]}
          align={["left", "left", "left", "left", "right", "right", "left"]}
          minWidth={900}
        >
          {INGEST_RUNS.map((r) => (
            <Row key={r.id}>
              <Cell>
                <span className="ls-code text-[12px] text-[var(--ls-ink)]">{r.id}</span>
              </Cell>
              <Cell>
                <CenterTag id={r.centerId} />
              </Cell>
              <Cell>{r.domain}</Cell>
              <Cell>
                <span className="ls-num">{r.startedAt}</span>
              </Cell>
              <Cell align="right">
                <span className="ls-num font-semibold text-[var(--ls-ink)]">{fmt(r.records)}</span>
              </Cell>
              <Cell align="right">
                <span className="ls-num">{r.duration}</span>
              </Cell>
              <Cell>
                <Badge tone={RUN_TONE[r.status]}>{r.status}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </Panel>

      <CenterSettings center={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

// 문제 있는 센터가 접힌 상태에서도 보이도록 장애, 지연, 정상 순으로 정렬한다.
const STATUS_ORDER: Record<Center["status"], number> = { 장애: 0, 지연: 1, 정상: 2 };
const SOURCES_SORTED = [...CENTERS].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
const SOURCES_FOLDED = 3;

function Pipeline() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? SOURCES_SORTED : SOURCES_SORTED.slice(0, SOURCES_FOLDED);
  const hidden = SOURCES_SORTED.length - SOURCES_FOLDED;

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
      <div className="rounded-2xl bg-[var(--ls-surface)] px-5 py-4 shadow-[var(--ls-shadow)]">
        <div className="flex items-center justify-between">
          <p className="ls-eyebrow text-[var(--ls-muted)]">연계 센터 {CENTERS.length}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex items-center gap-0.5 text-[12px] text-[var(--ls-body)] transition-colors hover:text-[var(--ls-ink)]"
          >
            {expanded ? "접기" : `${hidden}개 더 보기`}
            <I icon={expanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} size={14} />
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {visible.map((c) => (
            <li key={c.id} className="flex items-center gap-3 text-[13px]">
              <span className="w-[42px] shrink-0">
                <CenterTag id={c.id} withName={false} />
              </span>
              <I icon={METHOD_ICON[c.method]} size={14} className="text-[var(--ls-muted)]" />
              <span className="min-w-0 flex-1 truncate text-[var(--ls-body)]">{c.method}</span>
              <span className="ls-num shrink-0 text-[12px] text-[var(--ls-muted)]">{c.cycle}</span>
              <Badge tone={LINK_TONE[c.status]} dot={false}>
                {c.status}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      {PIPELINE.map((p, i) => (
        <div key={p.code} className="relative flex flex-col gap-2 rounded-2xl bg-[var(--ls-surface)] px-5 py-4 shadow-[var(--ls-shadow)]">
          <div className="flex items-center justify-between">
            <p className="ls-eyebrow text-[var(--ls-muted)]">
              {String(i + 1).padStart(2, "0")}
            </p>
            {i < PIPELINE.length - 1 && <I icon="solar:alt-arrow-right-linear" size={16} className="text-[var(--ls-disabled)]" />}
          </div>
          <div>
            <p className="text-[13px] text-[var(--ls-body-strong)]">{p.label} (건)</p>
            <p className="ls-figure mt-1 whitespace-nowrap text-[26px] leading-8 text-[var(--ls-ink)]">{fmt(p.value)}</p>
            <p className="mt-2 truncate text-[12px] leading-[18px] text-[var(--ls-body)]" title={p.note}>
              {p.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CenterCard({
  center: c,
  requested,
  onRequest,
  onEdit,
}: {
  center: Center;
  requested: boolean;
  onRequest: () => void;
  onEdit: () => void;
}) {
  const tone = LINK_TONE[c.status];
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-[var(--ls-surface)] shadow-[var(--ls-shadow)]">
      <div className="relative">
        <Photo id={c.photo} alt={`${c.name} 물류 동선`} w={720} h={300} sizes="(min-width: 1536px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-[148px] w-full" />
        <div className="absolute left-4 top-4">
          <Badge tone={tone}>{c.status}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold leading-6 text-[var(--ls-ink)]">{c.name}</h3>
            <p className="mt-1 text-[12px] text-[var(--ls-muted)]">{c.region}</p>
          </div>
          <Code className="text-[11px]">{c.id}</Code>
        </div>

        {c.statusNote && (
          <p className="mt-3 flex items-start gap-2 text-[12px] leading-[18px]" style={{ color: tone === "danger" ? "var(--ls-danger-fg)" : "var(--ls-warn-fg)" }}>
            <I icon="solar:danger-triangle-linear" size={14} className="mt-0.5" />
            {c.statusNote}
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-[var(--ls-canvas)] p-3">
          <div>
            <p className="text-[11px] text-[var(--ls-muted)]">연계</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[var(--ls-body-strong)]">
              <I icon={METHOD_ICON[c.method]} size={14} />
              <span className="truncate">{c.method}</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--ls-muted)]">수집 주기</p>
            <p className="mt-0.5 text-[13px] text-[var(--ls-body-strong)]">{c.cycle}</p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--ls-muted)]">마지막 수집</p>
            <p className="ls-num mt-0.5 text-[13px] text-[var(--ls-body-strong)]">{c.lastSync}</p>
          </div>
        </div>

        <p className="mt-3 text-[12px] text-[var(--ls-body)]">
          원천 시스템 <span className="text-[var(--ls-body-strong)]">{c.system}</span>
          <span className="mx-2 text-[var(--ls-disabled)]">|</span>
          코드 형식 <span className="ls-code text-[var(--ls-body-strong)]">{c.codeSample}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.domains.map((d) => (
            <span key={d} className="rounded-full bg-[var(--ls-elevated)] px-2.5 py-0.5 text-[11px] text-[var(--ls-body-strong)]">
              {d}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <MiniBars data={c.hourly} labels={HOUR_LABELS} tone={tone === "ok" ? undefined : tone} />
        </div>

        <div className="mt-5 flex gap-2 pt-1">
          <Button size="sm" variant={requested ? "ghost" : "secondary"} icon={requested ? "solar:check-circle-linear" : "solar:refresh-linear"} onClick={onRequest} disabled={requested}>
            {requested ? "수집 요청됨" : "수동 수집"}
          </Button>
          <Button size="sm" variant="ghost" icon="solar:settings-linear" onClick={onEdit}>
            연계 설정
          </Button>
        </div>
      </div>
    </article>
  );
}

function CenterSettings({ center, onClose }: { center: Center | null; onClose: () => void }) {
  return (
    <Drawer
      open={!!center}
      onClose={onClose}
      eyebrow={center ? `${center.id} 연계` : undefined}
      title={center ? `${center.name} 연계 설정` : ""}
      footer={
        <>
          <Button variant="primary" onClick={onClose}>
            저장
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </>
      }
    >
      {center && <CenterSettingsBody key={center.id} center={center} />}
    </Drawer>
  );
}

function CenterSettingsBody({ center }: { center: Center }) {
  const [cycle, setCycle] = useState(center.cycle);
  const [flags, setFlags] = useState({ keepRaw: true, stampTime: true, dedupe: true, autoRetry: center.status !== "장애" });
  const flip = (k: keyof typeof flags) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div className="space-y-8">
      <KeyValue
        rows={[
          ["원천 시스템", center.system],
          ["연계 방식", center.method],
          ["연계 주소", <span key="e" className="ls-code text-[12px]">{endpointOf(center)}</span>],
          ["최근 지연", <span key="l" className="ls-num">{center.latencySec < 60 ? `${center.latencySec}초` : `${Math.round(center.latencySec / 60)}분`}</span>],
        ]}
      />

      <div>
        <p className="mb-2 text-[13px] font-bold text-[var(--ls-ink)]">수집 주기</p>
        <Select label="수집 주기" value={cycle} onChange={setCycle} options={["실시간", "5분", "10분", "15분", "30분", "1시간"]} />
      </div>

      <div>
        <p className="mb-1 text-[13px] font-bold text-[var(--ls-ink)]">원천 기록과 검증</p>
        <ul className="divide-y divide-[var(--ls-hairline-soft)]">
          {(
            [
              ["keepRaw", "원천 레코드 원문 보존", "원천 데이터 추적 화면의 원본 레코드로 쓰입니다"],
              ["stampTime", "수집 시점 기록", "수신 시각과 원천 발생 시각을 함께 저장"],
              ["dedupe", "식별키 중복 검증", "센터 | 유형 | 일자 | 문서번호 | 라인"],
              ["autoRetry", "실패 시 자동 재시도", "최대 3회, 5분 간격"],
            ] as const
          ).map(([k, t, d]) => (
            <li key={k} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-[13px] text-[var(--ls-body-strong)]">{t}</p>
                <p className="mt-0.5 text-[12px] text-[var(--ls-muted)]">{d}</p>
              </div>
              <Toggle on={flags[k]} onChange={() => flip(k)} label={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function endpointOf(c: Center) {
  switch (c.method) {
    case "API":
      return `${c.id.toLowerCase()}-wms.internal / 입출고 실적`;
    case "DB":
      return `${c.id.toLowerCase()}-db.internal / 입출고 이력 뷰`;
    case "파일":
      return `${c.id.toLowerCase()}-file.internal / 30분 배치 파일`;
  }
}
