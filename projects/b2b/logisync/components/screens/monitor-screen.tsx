"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  CenterTag,
  Code,
  Dot,
  I,
  MiniBars,
  PageHead,
  Panel,
  Photo,
  Segmented,
  toneColor,
} from "@/projects/b2b/logisync/components/ui";
import { CENTERS, FAILURE_LOGS, HOUR_LABELS, INCIDENTS } from "@/projects/b2b/logisync/lib/mock-data";
import { LINK_TONE, fmt } from "@/projects/b2b/logisync/lib/navigation";
import type { Center, Incident, LinkStatus, Tone } from "@/projects/b2b/logisync/lib/types";

const INCIDENT_TONE: Record<Incident["level"], Tone> = { 장애: "danger", 지연: "warn", 경고: "info" };
const STATE_TONE: Record<Incident["state"], Tone> = { "대응 중": "danger", 모니터링: "info", 해결: "ok" };

type Filter = "all" | LinkStatus;

export function MonitorScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [auto, setAuto] = useState(true);
  const counts = (s: LinkStatus) => CENTERS.filter((c) => c.status === s).length;
  const board = CENTERS.filter((c) => filter === "all" || c.status === filter).sort(
    (a, b) => order(a.status) - order(b.status),
  );
  const totalSuccess = CENTERS.reduce((s, c) => s + c.success, 0);
  const totalFail = CENTERS.reduce((s, c) => s + c.fail, 0);

  return (
    <div className="space-y-8">
      <PageHead
        code="01 수집"
        title="데이터 수집 상태 모니터링"
        desc="물류센터별 연계 상태와 최근 수집 시각, 성공과 실패 건수를 나타냅니다."
        actions={
          <>
            <button
              type="button"
              onClick={() => setAuto((v) => !v)}
              aria-pressed={auto}
              className="ls-swap flex h-10 items-center gap-2 rounded-[10px] bg-[var(--ls-surface)] px-3.5 text-[12px] font-semibold text-[var(--ls-body-strong)] shadow-[var(--ls-shadow)] hover:bg-[var(--ls-elevated)]"
            >
              <Dot tone={auto ? "ok" : "neutral"} live={auto} />
              {auto ? "10초마다 자동 갱신" : "자동 갱신 꺼짐"}
            </button>
            <Button variant="primary" icon="solar:bell-bing-linear">
              알림 규칙
            </Button>
          </>
        }
      />

      {/* 상태 요약: 카드 없이 숫자만. 상태 색은 숫자 자체에 준다. */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_repeat(2,minmax(0,1.5fr))]">
        {(["정상", "지연", "장애"] as LinkStatus[]).map((s) => (
          <div key={s} className="rounded-2xl bg-[var(--ls-surface)] p-5 shadow-[var(--ls-shadow)]">
            <p className="flex items-center gap-2 text-[12px] text-[var(--ls-muted)]">
              <Dot tone={LINK_TONE[s]} />
              {s} (센터)
            </p>
            <p className="ls-figure mt-2 text-[32px] leading-10" style={{ color: s === "정상" ? "var(--ls-ink)" : toneColor(LINK_TONE[s]) }}>
              {counts(s)}
            </p>
          </div>
        ))}
        <div className="rounded-2xl bg-[var(--ls-surface)] p-5 shadow-[var(--ls-shadow)]">
          <p className="text-[12px] text-[var(--ls-muted)]">오늘 수집 성공 (건)</p>
          <p className="ls-figure mt-2 text-[32px] leading-10 text-[var(--ls-ink)]">{fmt(totalSuccess)}</p>
        </div>
        <div className="rounded-2xl bg-[var(--ls-surface)] p-5 shadow-[var(--ls-shadow)]">
          <p className="text-[12px] text-[var(--ls-muted)]">오늘 수집 실패 (건)</p>
          <p className="ls-figure mt-2 text-[32px] leading-10 text-[var(--ls-danger-fg)]">{fmt(totalFail)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={filter}
          onChange={setFilter}
          items={[
            { key: "all", label: `전체 ${CENTERS.length}` },
            { key: "장애", label: `장애 ${counts("장애")}` },
            { key: "지연", label: `지연 ${counts("지연")}` },
            { key: "정상", label: `정상 ${counts("정상")}` },
          ]}
        />
        <p className="ls-num text-[12px] text-[var(--ls-muted)]">마지막 갱신 14:36:02</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {board.map((c) => (
          <StatusTile key={c.id} center={c} />
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title="장애 및 지연 이력" action={<Button size="sm" variant="ghost">전체 보기</Button>} flush>
          <ol>
            {INCIDENTS.map((inc) => (
              <li key={inc.id} className="grid grid-cols-[4px_minmax(0,1fr)] border-b border-[var(--ls-hairline-soft)]">
                <span style={{ background: toneColor(INCIDENT_TONE[inc.level], "base") }} />
                <div className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={INCIDENT_TONE[inc.level]} dot={false}>
                        {inc.level}
                      </Badge>
                      <span className="ls-code text-[11px] text-[var(--ls-muted)]">{inc.id}</span>
                    </div>
                    <p className="mt-1.5 text-[14px] font-semibold text-[var(--ls-ink)]">{inc.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[12px] text-[var(--ls-body)]">
                      <CenterTag id={inc.centerId} />
                      <span className="ls-num">
                        {inc.startedAt} 시작 | {inc.duration}
                      </span>
                      <span>담당 {inc.owner}</span>
                    </p>
                  </div>
                  <Badge tone={STATE_TONE[inc.state]}>{inc.state}</Badge>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="오류 발생 현황">
          <ul className="space-y-4">
            {FAILURE_LOGS.map((f) => (
              <li key={f.id} className="flex gap-3">
                <I
                  icon={f.resolved ? "solar:check-circle-linear" : "solar:danger-circle-linear"}
                  size={18}
                  className={f.resolved ? "text-[var(--ls-ok-fg)]" : "text-[var(--ls-danger-fg)]"}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Code className="text-[11px]">{f.code}</Code>
                    <span className="ls-num text-[12px] text-[var(--ls-muted)]">{f.at}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-5 text-[var(--ls-body-strong)]">{f.message}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ls-muted)]">
                    {f.centerId} | 영향 {fmt(f.affected)}건 | {f.resolved ? "자동 복구" : "미해결"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function order(s: LinkStatus) {
  return s === "장애" ? 0 : s === "지연" ? 1 : 2;
}

function StatusTile({ center: c }: { center: Center }) {
  const tone = LINK_TONE[c.status];
  const rate = (c.success / (c.success + c.fail)) * 100;
  const latency = c.latencySec < 60 ? `${c.latencySec}초` : `${Math.round(c.latencySec / 60)}분`;
  const alarm = tone !== "ok";
  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-[var(--ls-shadow)]" style={{ background: alarm ? toneColor(tone, "bg") : "var(--ls-surface)" }}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: toneColor(tone, "base") }} />
      <div className="flex items-start justify-between gap-3">
        <Photo id={c.photo} alt={`${c.name} 물류 동선`} w={112} h={112} sizes="56px" className={`h-14 w-14 shrink-0 rounded-xl ${alarm ? "" : "grayscale"}`} />
        <div className="min-w-0 flex-1">
          <p className="ls-code text-[28px] font-bold leading-8 text-[var(--ls-ink)]">{c.id}</p>
          <p className="mt-1 truncate text-[14px] text-[var(--ls-body-strong)]">{c.name}</p>
        </div>
        <span className="flex items-center gap-2 text-[14px] font-bold" style={{ color: toneColor(tone) }}>
          <Dot tone={tone} live={alarm} size={9} />
          {c.status}
        </span>
      </div>

      <p className="mt-2 min-h-[36px] text-[12px] leading-[18px]" style={{ color: alarm ? toneColor(tone) : "var(--ls-muted)" }}>
        {c.statusNote ?? `${c.system} | ${c.method} | ${c.cycle} 주기로 정상 수집 중`}
      </p>

      <dl className="mt-4 grid grid-cols-4 gap-3">
        {[
          ["최근 수집", c.lastSyncAgo],
          ["성공", fmt(c.success)],
          ["실패", fmt(c.fail)],
          ["지연", latency],
        ].map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[11px] text-[var(--ls-muted)]">{k}</dt>
            <dd
              className="ls-num mt-0.5 truncate text-[15px] font-bold"
              style={{ color: k === "실패" && c.fail > 100 ? "var(--ls-danger-fg)" : "var(--ls-ink)" }}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-[var(--ls-muted)]">
          <span>성공률</span>
          <span className="ls-num text-[var(--ls-body-strong)]">{rate.toFixed(2)}%</span>
        </div>
        <MiniBars data={c.hourly} labels={HOUR_LABELS} tone={alarm ? tone : undefined} />
      </div>

      {alarm && (
        <div className="mt-5 flex gap-2">
          <Button size="sm" variant="primary" icon="solar:restart-linear">
            재연결 시도
          </Button>
          <Button size="sm" variant="outline">
            담당자 호출
          </Button>
        </div>
      )}
    </article>
  );
}
