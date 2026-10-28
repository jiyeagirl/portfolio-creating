"use client";

import { useState } from "react";
import { useStore, type Scenario } from "@/projects/platform/eduon/lib/store";
import { SUB_STATUS_LABEL } from "@/projects/platform/eduon/lib/access";
import { won } from "@/projects/platform/eduon/lib/format";
import type { AdminSubscription, BillingRecord, PaymentEvent } from "@/projects/platform/eduon/lib/types";
import { Button, DetailPanel, Row, StatusBadge, Tabs, type Tone } from "@/projects/platform/eduon/components/console/console-ui";
import {
  ENTITLEMENT_TONE,
  PanelSection,
  rowCls,
  SUB_TONE,
  SummaryLine,
  Td,
  Th,
  Timeline,
} from "@/projects/platform/eduon/components/admin/admin-ui";

export type BillingTab = "subs" | "events";
export const BILLING_TABS: readonly BillingTab[] = ["subs", "events"];

const SCENARIOS: Scenario[] = ["갱신 성공", "갱신 실패", "만료", "환불"];

const VERIFY_TONE: Record<PaymentEvent["verify"], Tone> = { 통과: "green", 실패: "red", 중복: "gray" };

const KIND_TONE: Record<BillingRecord["kind"], Tone> = {
  "최초 결제": "green",
  "정기 갱신": "green",
  "구매 복원": "blue",
  "갱신 해지": "gray",
  "갱신 실패": "orange",
  만료: "red",
  환불: "red",
};

export function BillingScreen({
  query,
  initialSelected,
  initialTab,
  notify,
}: {
  query: string;
  initialSelected: string | null;
  initialTab: BillingTab | null;
  notify: (m: string) => void;
}) {
  const { adminSubs, events, hydrated } = useStore();
  const [tab, setTab] = useState<BillingTab>(initialTab ?? "subs");
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const q = query.trim().toLowerCase();
  const subs = q ? adminSubs.filter((s) => [s.name, s.email, s.id].some((v) => v.toLowerCase().includes(q))) : adminSubs;
  const sortedEvents = [...events].sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : a.receivedAt > b.receivedAt ? -1 : 0));
  const evts = q ? sortedEvents.filter((e) => [e.id, e.subId, e.type].some((v) => v.toLowerCase().includes(q))) : sortedEvents;

  const current = tab === "subs" && selected ? adminSubs.find((s) => s.id === selected) : undefined;

  return (
    <>
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <SummaryLine
          items={[
            { label: "활성 구독 (건)", value: adminSubs.filter((s) => s.status === "active" || s.status === "cancelled").length },
            { label: "갱신 실패 (건)", value: adminSubs.filter((s) => s.status === "failed").length, tone: "orange" },
            { label: "권한 확인 필요 (건)", value: adminSubs.filter((s) => s.entitlement === "확인 필요").length, tone: "orange" },
            { label: "이벤트 재확인 필요 (건)", value: events.filter((e) => e.result === "재확인 필요").length, tone: "red" },
          ]}
        />

        <Tabs
          className="mt-4"
          value={tab}
          onChange={(t) => setTab(t)}
          tabs={[
            { key: "subs", label: "구독", count: subs.length },
            { key: "events", label: "결제 이벤트", count: evts.length },
          ]}
        />

        {tab === "subs" ? (
          <SubsTable rows={subs} selected={selected} onSelect={setSelected} hydrated={hydrated} />
        ) : (
          <EventsTable rows={evts} subs={adminSubs} notify={notify} />
        )}
      </div>

      {current && <SubDetail key={current.id} sub={current} onClose={() => setSelected(null)} notify={notify} />}
    </>
  );
}

function SubsTable({ rows, selected, onSelect, hydrated }: { rows: AdminSubscription[]; selected: string | null; onSelect: (id: string) => void; hydrated: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[var(--eo-line)]">
            <Th>계정</Th>
            <Th className="w-[88px]">상태</Th>
            <Th className="w-[128px]">유효기간</Th>
            <Th className="w-[96px]">권한 반영</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className={rowCls(s.id === selected)} onClick={() => onSelect(s.id)}>
              <Td>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-[var(--eo-ink)]">{s.email}</span>
                    {s.isMe && (
                      <span className="shrink-0 rounded-[4px] border border-[var(--eo-line-2)] px-1.5 text-[11px] leading-[18px] text-[var(--eo-ink-2)]">테스트 계정</span>
                    )}
                  </div>
                  <div className="truncate text-[12px] text-[var(--eo-ink-3)]">
                    <span className="whitespace-nowrap">{s.name}</span> | <span className="eo-mono">{s.id}</span>
                  </div>
                </div>
              </Td>
              <Td>
                <StatusBadge tone={SUB_TONE[s.status]}>{SUB_STATUS_LABEL[s.status]}</StatusBadge>
              </Td>
              <Td>
                <div className="whitespace-nowrap tabular-nums">{s.periodEnd}</div>
                <div className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">시작 {s.periodStart}</div>
              </Td>
              <Td>
                <StatusBadge tone={ENTITLEMENT_TONE[s.entitlement]}>{s.entitlement}</StatusBadge>
              </Td>
            </tr>
          ))}
          {hydrated && rows.length === 0 && (
            <tr>
              <td colSpan={4}className="py-12 text-center text-[var(--eo-ink-3)]">
                조건에 맞는 구독이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function EventsTable({ rows, subs, notify }: { rows: PaymentEvent[]; subs: AdminSubscription[]; notify: (m: string) => void }) {
  const { reprocessEvent } = useStore();
  const [checked, setChecked] = useState<string[]>([]);
  const nameOf = (subId: string) => subs.find((s) => s.id === subId)?.name;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[var(--eo-line)]">
            <Th className="w-[168px]">이벤트 ID</Th>
            <Th className="w-[128px]">수신 시각</Th>
            <Th className="w-[120px]">유형</Th>
            <Th className="w-[88px]">검증</Th>
            <Th>처리 결과</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => {
            const needs = e.result === "재확인 필요";
            const isChecked = checked.includes(e.id);
            return (
              <tr key={e.id} className="border-b border-[var(--eo-line)] transition-colors hover:bg-[var(--eo-soft)]">
                <Td>
                  <div className="eo-mono whitespace-nowrap text-[var(--eo-ink)]">{e.id}</div>
                  <div className="whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">
                    <span className="eo-mono">{e.subId}</span>
                  </div>
                </Td>
                <Td>
                  <div className="whitespace-nowrap tabular-nums">{e.receivedAt.slice(0, 12)}</div>
                  <div className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">{e.receivedAt.slice(13)}</div>
                </Td>
                <Td>
                  <div className="whitespace-nowrap">{e.type}</div>
                  {nameOf(e.subId) && <div className="whitespace-nowrap text-[12px] text-[var(--eo-ink-3)]">{nameOf(e.subId)}</div>}
                </Td>
                <Td>
                  <StatusBadge tone={VERIFY_TONE[e.verify]}>{e.verify}</StatusBadge>
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-medium ${
                          needs ? "text-[var(--eo-red-fg)]" : e.result === "중복 수신, 추가 처리 없음" ? "text-[var(--eo-ink-2)]" : "text-[var(--eo-ink)]"
                        }`}
                      >
                        {needs && isChecked ? "재확인 완료, 재처리 대기" : e.result}
                      </div>
                      <div className="text-[12px] leading-[18px] text-[var(--eo-ink-3)]">{e.detail}</div>
                    </div>
                    {needs && (
                      <div className="flex shrink-0 gap-1.5">
                        <Button
                          size="sm"
                          disabled={isChecked}
                          onClick={() => {
                            setChecked((c) => [...c, e.id]);
                            notify("결제사 승인 내역을 다시 조회했습니다. 응답 정상");
                          }}
                        >
                          재확인
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={!isChecked}
                          onClick={() => {
                            reprocessEvent(e.id);
                            notify("재처리했습니다. 구독 권한이 반영됩니다.");
                          }}
                        >
                          재처리
                        </Button>
                      </div>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SubDetail({ sub: s, onClose, notify }: { sub: AdminSubscription; onClose: () => void; notify: (m: string) => void }) {
  const { runScenario } = useStore();
  const closed = s.status === "expired" || s.status === "refunded";

  return (
    <DetailPanel
      open
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="truncate">{s.email}</span>
          <StatusBadge tone={SUB_TONE[s.status]}>{SUB_STATUS_LABEL[s.status]}</StatusBadge>
        </span>
      }
      meta={
        <>
          <span className="whitespace-nowrap">{s.name}</span> | <span className="eo-mono">{s.id}</span>
          {s.isMe && " | 사용자 화면 테스트 계정"}
        </>
      }
    >
      <PanelSection title="구독 정보">
        <dl>
          <Row label="결제 수단">웹 카드 정기결제</Row>
          <Row label="상품">월 구독 | {won(29000)}원</Row>
          <Row label="유효기간">
            <span className="tabular-nums">
              {s.periodStart} ~ {s.periodEnd}
            </span>
          </Row>
          <Row label="권한 반영">
            <StatusBadge tone={ENTITLEMENT_TONE[s.entitlement]}>{s.entitlement}</StatusBadge>
          </Row>
          <Row label="결제 정보">카드번호 미보관, 결제사 토큰으로만 처리</Row>
        </dl>
      </PanelSection>

      <PanelSection title="수동 반영">
        <div className="grid grid-cols-2 gap-2">
          {SCENARIOS.map((sc) => {
            return (
              <Button
                key={sc}
                variant={sc === "환불" ? "danger" : "secondary"}
                disabled={closed}
                onClick={() => {
                  runScenario(s.id, sc);
                  notify(s.isMe ? `${sc} 반영. 사용자 화면 내 구독과 강의 잠금이 바뀝니다.` : `${sc} 시나리오를 반영했습니다`);
                }}
              >
                {sc}
              </Button>
            );
          })}
        </div>
        {closed && <p className="mt-2 text-[12px] text-[var(--eo-ink-3)]">종료된 구독은 시나리오 대상이 아님</p>}
      </PanelSection>

      <PanelSection title="결제, 갱신, 해지 이력" aside={<span className="text-[12px] text-[var(--eo-ink-3)]">금액 (원)</span>}>
        <ul className="divide-y divide-[var(--eo-line)]">
          {s.history.map((h) => (
            <li key={h.id + h.at} className="flex items-start gap-3 py-2.5">
              <StatusBadge tone={KIND_TONE[h.kind]}>{h.kind}</StatusBadge>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px]">{h.result}</span>
                  <span className="whitespace-nowrap text-[13px] tabular-nums">{h.amount === null ? "" : `${h.amount < 0 ? "-" : ""}${won(Math.abs(h.amount))}`}</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px] text-[var(--eo-ink-3)]">
                  <span className="eo-mono">{h.id}</span>
                  <span className="whitespace-nowrap tabular-nums">{h.at}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PanelSection>

      <PanelSection title="구독 권한 변경 이력">
        <Timeline
          items={s.entitlementLog.map((l) => ({
            at: l.at,
            title: l.change,
            note: l.by,
            tone: l.change.includes("회수") || l.change.includes("만료") ? "red" : l.change.includes("실패") || l.change.includes("보류") || l.change.includes("유예") ? "orange" : "green",
          }))}
        />
      </PanelSection>
    </DetailPanel>
  );
}
