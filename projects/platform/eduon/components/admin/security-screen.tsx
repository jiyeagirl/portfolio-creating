"use client";

import { useState } from "react";
import { Check, Eye, Prohibit, UsersThree } from "@phosphor-icons/react";
import { NOW } from "@/projects/platform/eduon/lib/mock-data";
import {
  ACCESS_LOGS,
  BACKUPS,
  FINDING_STAGES,
  HIGH_RISK_REQUESTS,
  RECOVERY_TESTS,
  ROLE_MATRIX,
  SECURITY_FINDINGS,
  VENDOR_ACCESS,
  type AccessLogEntry,
  type ApprovalState,
  type BackupStatus,
  type Grant,
  type HighRiskRequest,
  type RecoveryTest,
  type SecurityFinding,
  type VendorAccess,
} from "@/projects/platform/eduon/lib/admin-data";
import { Button, DetailPanel, Modal, Row, StatusBadge, Tabs, type Tone } from "@/projects/platform/eduon/components/console/console-ui";
import { PanelSection, rowCls, SectionTitle, Td, Th, Timeline } from "@/projects/platform/eduon/components/admin/admin-ui";

export type SecurityTab = "roles" | "logs" | "verify";
export const SECURITY_TABS: readonly SecurityTab[] = ["roles", "logs", "verify"];

const SEVERITY_TONE: Record<SecurityFinding["severity"], Tone> = { 높음: "red", 중간: "orange", 낮음: "gray" };
const STAGE_TONE: Record<SecurityFinding["stage"], Tone> = { 발견: "orange", 수정: "blue", 재검증: "blue", 종료: "green" };
const REQUEST_TONE: Record<HighRiskRequest["status"], Tone> = { "이중 승인 대기": "orange", "승인 완료": "green", 반려: "red" };
const APPROVAL_TONE: Record<ApprovalState, string> = {
  승인: "text-[var(--eo-green-fg)]",
  대기: "text-[var(--eo-orange-fg)]",
  반려: "text-[var(--eo-red-fg)]",
};
const VENDOR_TONE: Record<VendorAccess["status"], Tone> = { "사용 중": "blue", 만료: "red", 회수: "gray" };
const LOG_TONE: Record<AccessLogEntry["result"], Tone> = { 허용: "green", 차단: "red", "승인 대기": "orange" };
const BACKUP_TONE: Record<BackupStatus["result"], Tone> = { 성공: "green", 지연: "orange", 실패: "red" };

export function SecurityScreen({
  query,
  initialTab,
  initialSelected,
  extraLogs,
  notify,
}: {
  query: string;
  initialTab: SecurityTab | null;
  initialSelected: string | null;
  extraLogs: AccessLogEntry[];
  notify: (m: string) => void;
}) {
  const [tab, setTab] = useState<SecurityTab>(initialTab ?? "roles");
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const finding = tab === "verify" && selected ? SECURITY_FINDINGS.find((f) => f.id === selected) : undefined;

  return (
    <>
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <div className="flex items-center gap-4">
          <Tabs
            className="min-w-0 flex-1"
            value={tab}
            onChange={setTab}
            tabs={[
              { key: "roles", label: "권한 및 승인" },
              { key: "logs", label: "접근 기록" },
              { key: "verify", label: "검증 및 복구" },
            ]}
          />
        </div>

        {tab === "roles" && <RolesTab notify={notify} />}
        {tab === "logs" && <LogsTab query={query} extra={extraLogs} />}
        {tab === "verify" && <VerifyTab query={query} selected={selected} onSelect={setSelected} />}
      </div>

      {finding && <FindingDetail key={finding.id} f={finding} onClose={() => setSelected(null)} />}
    </>
  );
}

/* 권한 및 승인 */

function GrantCell({ g }: { g: Grant }) {
  const map: Record<Grant, { Icon: typeof Check; cls: string }> = {
    허용: { Icon: Check, cls: "text-[var(--eo-ink)]" },
    조회만: { Icon: Eye, cls: "text-[var(--eo-ink-2)]" },
    차단: { Icon: Prohibit, cls: "text-[var(--eo-red-fg)]" },
    "이중 승인": { Icon: UsersThree, cls: "text-[var(--eo-orange-fg)]" },
  };
  const { Icon, cls } = map[g];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${cls}`}>
      <Icon size={14} weight={g === "허용" ? "bold" : "regular"} />
      {g}
    </span>
  );
}

function RolesTab({ notify }: { notify: (m: string) => void }) {
  const [vendors, setVendors] = useState<VendorAccess[]>(VENDOR_ACCESS);
  const [revoke, setRevoke] = useState<VendorAccess | null>(null);

  return (
    <div className="pt-6">
      <div className="grid items-start gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section>
          <SectionTitle>역할별 접근 범위</SectionTitle>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--eo-line)]">
                <Th>영역</Th>
                <Th className="w-[104px]">콘텐츠 운영자</Th>
                <Th className="w-[96px]">최고관리자</Th>
              </tr>
            </thead>
            <tbody>
              {ROLE_MATRIX.map((r) => (
                <tr key={r.area} className="border-b border-[var(--eo-line)]">
                  <Td className="py-2.5 text-[var(--eo-ink)]">{r.area}</Td>
                  <Td className="py-2.5">
                    <GrantCell g={r.operator} />
                  </Td>
                  <Td className="py-2.5">
                    <GrantCell g={r.super} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <SectionTitle aside={<span className="text-[12px] text-[var(--eo-ink-3)]">서로 다른 두 승인권자 필요</span>}>고위험 요청</SectionTitle>
          <ul className="border-t border-[var(--eo-line)]">
            {HIGH_RISK_REQUESTS.map((r) => (
              <li key={r.id} className="border-b border-[var(--eo-line)] py-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] text-[var(--eo-ink-3)]">
                      <span className="eo-mono">{r.id}</span> | {r.kind}
                    </div>
                    <div className="mt-0.5 text-[14px] font-semibold leading-[20px] text-[var(--eo-ink)]">{r.title}</div>
                    <div className="mt-0.5 text-[12px] text-[var(--eo-ink-2)]">
                      <span className="whitespace-nowrap">{r.requester}</span> | <span className="whitespace-nowrap tabular-nums">{r.requestedAt}</span> | {r.reason}
                    </div>
                  </div>
                  <StatusBadge tone={REQUEST_TONE[r.status]} wide>
                    {r.status}
                  </StatusBadge>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {r.approvals.map((a, i) => (
                    <div key={a.name} className="rounded-[8px] bg-[var(--eo-soft)] px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[var(--eo-ink-3)]">{i + 1}차 승인</span>
                        <span className={`text-[12px] font-semibold ${APPROVAL_TONE[a.state]}`}>{a.state}</span>
                      </div>
                      <div className="mt-0.5 flex items-baseline justify-between gap-2">
                        <span className="whitespace-nowrap text-[13px] font-medium">
                          {a.name} <span className="font-normal text-[var(--eo-ink-3)]">{a.role}</span>
                        </span>
                        <span className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">{a.at ? a.at.slice(6) : "대기 중"}</span>
                      </div>
                      {a.note && <div className="mt-1 text-[12px] text-[var(--eo-red-fg)]">{a.note}</div>}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <SectionTitle>개발사 접근</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--eo-line)]">
                <Th className="w-[180px]">업체</Th>
                <Th>목적, 범위</Th>
                <Th className="w-[128px]">만료</Th>
                <Th className="w-[88px]">상태</Th>
                <Th className="w-[200px]">회수</Th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-[var(--eo-line)] hover:bg-[var(--eo-soft)]">
                  <Td>
                    <div className="whitespace-nowrap font-medium">{v.company}</div>
                    <div className="eo-mono whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">{v.account}</div>
                  </Td>
                  <Td>
                    <div>{v.purpose}</div>
                    <div className="text-[12px] text-[var(--eo-ink-3)]">{v.scope}</div>
                  </Td>
                  <Td>
                    <div className="whitespace-nowrap tabular-nums">{v.end}</div>
                    <div className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">시작 {v.start}</div>
                  </Td>
                  <Td>
                    <StatusBadge tone={VENDOR_TONE[v.status]}>{v.status}</StatusBadge>
                  </Td>
                  <Td>
                    {v.status === "사용 중" ? (
                      <Button size="sm" variant="danger" onClick={() => setRevoke(v)}>
                        회수
                      </Button>
                    ) : (
                      <span className="text-[12px] leading-[18px] text-[var(--eo-ink-3)]">{v.closedNote}</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={revoke !== null}
        onClose={() => setRevoke(null)}
        title="개발사 접근 회수"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRevoke(null)}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!revoke) return;
                setVendors((list) => list.map((v) => (v.id === revoke.id ? { ...v, status: "회수", closedNote: `서윤하 회수 ${NOW}` } : v)));
                notify(`${revoke.company} 접근을 회수했습니다`);
                setRevoke(null);
              }}
            >
              회수
            </Button>
          </>
        }
      >
        {revoke && (
          <dl>
            <Row label="업체">{revoke.company}</Row>
            <Row label="계정">
              <span className="eo-mono">{revoke.account}</span>
            </Row>
            <Row label="범위">{revoke.scope}</Row>
            <Row label="만료 예정">
              <span className="tabular-nums">{revoke.end}</span>
            </Row>
          </dl>
        )}
      </Modal>
    </div>
  );
}

/* 접근 기록 */

type LogFilter = "all" | AccessLogEntry["result"];

function LogsTab({ query, extra }: { query: string; extra: AccessLogEntry[] }) {
  const [filter, setFilter] = useState<LogFilter>("all");
  const q = query.trim();
  const all = [...extra, ...ACCESS_LOGS];
  const searched = q ? all.filter((l) => [l.actor, l.actorRole, l.target, l.action].some((v) => v.includes(q))) : all;
  const rows = filter === "all" ? searched : searched.filter((l) => l.result === filter);
  const count = (r: AccessLogEntry["result"]) => searched.filter((l) => l.result === r).length;

  const chips: Array<{ key: LogFilter; label: string; n: number }> = [
    { key: "all", label: "전체", n: searched.length },
    { key: "차단", label: "차단", n: count("차단") },
    { key: "승인 대기", label: "승인 대기", n: count("승인 대기") },
    { key: "허용", label: "허용", n: count("허용") },
  ];

  return (
    <div className="pt-5">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {chips.map((c) => {
          const on = c.key === filter;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(c.key)}
              className={`flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[12px] transition-colors ${
                on ? "bg-[var(--eo-ink-btn)] font-semibold text-white" : "border border-[var(--eo-line-2)] font-medium text-[var(--eo-ink-2)] hover:bg-[var(--eo-soft)]"
              }`}
            >
              {c.label}
              <span className={`tabular-nums ${on ? "text-white/70" : "text-[var(--eo-ink-3)]"}`}>{c.n}</span>
            </button>
          );
        })}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--eo-line)]">
              <Th className="w-[128px]">시각</Th>
              <Th className="w-[160px]">수행자</Th>
              <Th>대상</Th>
              <Th className="w-[136px]">작업</Th>
              <Th className="w-[88px]">결과</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className={`border-b border-[var(--eo-line)] hover:bg-[var(--eo-soft)] ${extra.some((e) => e.id === l.id) ? "bg-[#fdf4f4]" : ""}`}>
                <Td>
                  <div className="whitespace-nowrap tabular-nums">{l.at.slice(0, 12)}</div>
                  <div className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">{l.at.slice(13)}</div>
                </Td>
                <Td>
                  <div className={`whitespace-nowrap font-medium ${l.actor.startsWith("vendor_") ? "eo-mono" : ""}`}>{l.actor}</div>
                  <div className="whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">{l.actorRole}</div>
                </Td>
                <Td>
                  <div className="truncate" title={l.target}>
                    {l.target}
                  </div>
                  <div className="eo-mono text-[12px] text-[var(--eo-ink-3)]">{l.id}</div>
                </Td>
                <Td className="whitespace-nowrap">{l.action}</Td>
                <Td>
                  <StatusBadge tone={LOG_TONE[l.result]}>{l.result}</StatusBadge>
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[var(--eo-ink-3)]">
                  조건에 맞는 기록이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 검증 및 복구 */

function StageTrack({ stage }: { stage: SecurityFinding["stage"] }) {
  const idx = FINDING_STAGES.indexOf(stage);
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-[3px]" aria-hidden>
        {FINDING_STAGES.map((s, i) => (
          <span key={s} className={`h-1.5 w-4 rounded-full ${i <= idx ? (stage === "종료" ? "bg-[var(--eo-green)]" : "bg-[var(--eo-blue)]") : "bg-[var(--eo-soft-2)]"}`} />
        ))}
      </div>
      <StatusBadge tone={STAGE_TONE[stage]}>{stage}</StatusBadge>
    </div>
  );
}

function VerifyTab({ query, selected, onSelect }: { query: string; selected: string | null; onSelect: (id: string) => void }) {
  const q = query.trim();
  const rows = q ? SECURITY_FINDINGS.filter((f) => [f.item, f.owner, f.id].some((v) => v.includes(q))) : SECURITY_FINDINGS;
  const open = SECURITY_FINDINGS.filter((f) => f.stage !== "종료").length;

  return (
    <div className="pt-6">
      <section>
        <SectionTitle aside={<span className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">열린 항목 {open} / 전체 {SECURITY_FINDINGS.length}</span>}>
          보안 점검 항목
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--eo-line)]">
                <Th>항목</Th>
                <Th className="w-[88px]">심각도</Th>
                <Th className="w-[88px]">담당자</Th>
                <Th className="w-[160px]">단계</Th>
                <Th className="w-[96px]">구분</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id} className={rowCls(f.id === selected)} onClick={() => onSelect(f.id)}>
                  <Td>
                    <div className="truncate font-medium" title={f.item}>
                      {f.item}
                    </div>
                    <div className="text-[12px] text-[var(--eo-ink-3)]">
                      <span className="eo-mono">{f.id}</span> | 발견 <span className="tabular-nums">{f.dates.발견?.slice(0, 12)}</span>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge tone={SEVERITY_TONE[f.severity]}>{f.severity}</StatusBadge>
                  </Td>
                  <Td className="whitespace-nowrap">{f.owner}</Td>
                  <Td>
                    <StageTrack stage={f.stage} />
                  </Td>
                  <Td className="whitespace-nowrap text-[var(--eo-ink-2)]">{f.source}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 grid items-start gap-x-10 gap-y-10 2xl:grid-cols-2">
        <section className="min-w-0">
          <SectionTitle>백업 상태</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--eo-line)]">
                  <Th>대상</Th>
                  <Th className="w-[128px]">주기</Th>
                  <Th className="w-[128px]">최근 실행</Th>
                  <Th className="w-[80px]">결과</Th>
                  <Th className="w-[64px]" align="right">
                    보관
                  </Th>
                </tr>
              </thead>
              <tbody>
                {BACKUPS.map((b) => (
                  <tr key={b.target} className="border-b border-[var(--eo-line)]">
                    <Td className="whitespace-nowrap font-medium">{b.target}</Td>
                    <Td className="whitespace-nowrap text-[var(--eo-ink-2)]">{b.schedule}</Td>
                    <Td className="whitespace-nowrap tabular-nums">{b.lastAt.slice(6)}</Td>
                    <Td>
                      <StatusBadge tone={BACKUP_TONE[b.result]}>{b.result}</StatusBadge>
                    </Td>
                    <Td className="whitespace-nowrap text-right tabular-nums">{b.retention}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="min-w-0">
          <SectionTitle aside={<Legend />}>복구 시험, 목표 대비 측정</SectionTitle>
          <ul className="border-t border-[var(--eo-line)]">
            {RECOVERY_TESTS.map((t) => (
              <RecoveryRow key={t.id} t={t} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <span className="flex items-center gap-3 text-[12px] text-[var(--eo-ink-3)]">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-4 rounded-full bg-[var(--eo-ink-2)]" />
        측정
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-px bg-[var(--eo-ink)]" />
        목표
      </span>
    </span>
  );
}

function CompareBar({ label, target, measured }: { label: string; target: number; measured: number }) {
  const max = Math.max(target, measured) * 1.15;
  const over = measured > target;
  return (
    <div className="grid grid-cols-[148px_minmax(0,1fr)_96px] items-center gap-3">
      <span className="whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">{label}</span>
      <div className="relative h-1.5 rounded-full bg-[var(--eo-soft-2)]">
        <div className={`h-full rounded-full ${over ? "bg-[var(--eo-red)]" : "bg-[var(--eo-ink-2)]"}`} style={{ width: `${(measured / max) * 100}%` }} />
        <span className="absolute -top-[5px] h-4 w-px bg-[var(--eo-ink)]" style={{ left: `${(target / max) * 100}%` }} />
      </div>
      <span className="whitespace-nowrap text-right text-[12px] tabular-nums">
        <span className={`font-semibold ${over ? "text-[var(--eo-red-fg)]" : "text-[var(--eo-ink)]"}`}>{measured.toLocaleString("ko-KR")}</span>
        <span className="text-[var(--eo-ink-3)]"> / {target.toLocaleString("ko-KR")}</span>
      </span>
    </div>
  );
}

function RecoveryRow({ t }: { t: RecoveryTest }) {
  const ok = t.rtoMeasured <= t.rtoTarget && t.rpoMeasured <= t.rpoTarget;
  return (
    <li className="border-b border-[var(--eo-line)] py-3.5">
      <div className="mb-2.5 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <span className="whitespace-nowrap text-[13px] font-medium">{t.target}</span>
          <span className="ml-2 text-[12px] text-[var(--eo-ink-3)]">
            <span className="eo-mono">{t.id}</span> | <span className="tabular-nums">{t.testedAt}</span> | {t.owner}
          </span>
        </div>
        <StatusBadge tone={ok ? "green" : "red"}>{ok ? "목표 충족" : "목표 미달"}</StatusBadge>
      </div>
      <div className="space-y-2">
        <CompareBar label="복구 시간 RTO (분)" target={t.rtoTarget} measured={t.rtoMeasured} />
        <CompareBar label="손실 허용 RPO (분)" target={t.rpoTarget} measured={t.rpoMeasured} />
      </div>
    </li>
  );
}

function FindingDetail({ f, onClose }: { f: SecurityFinding; onClose: () => void }) {
  const idx = FINDING_STAGES.indexOf(f.stage);
  return (
    <DetailPanel
      open
      onClose={onClose}
      title={f.item}
      meta={
        <>
          <span className="eo-mono">{f.id}</span> | {f.source} | 담당 {f.owner}
        </>
      }
    >
      <PanelSection title="상태">
        <dl>
          <Row label="심각도">
            <StatusBadge tone={SEVERITY_TONE[f.severity]}>{f.severity}</StatusBadge>
          </Row>
          <Row label="현재 단계">
            <StageTrack stage={f.stage} />
          </Row>
          <Row label="구분">{f.source}</Row>
          <Row label="조치">{f.action}</Row>
        </dl>
      </PanelSection>
      <PanelSection title="단계 이력">
        <Timeline
          items={FINDING_STAGES.map((s, i) => ({
            at: f.dates[s] ?? (i === idx + 1 ? "다음 단계" : "예정"),
            title: s,
            tone: f.dates[s] ? (s === "발견" ? "orange" : s === "종료" ? "green" : "blue") : "gray",
          }))}
        />
      </PanelSection>
    </DetailPanel>
  );
}
