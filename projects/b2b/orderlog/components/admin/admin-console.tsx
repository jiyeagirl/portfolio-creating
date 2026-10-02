"use client";

import { useState } from "react";
import { ClockCounterClockwise, Robot, ShieldCheck, UsersThree } from "@phosphor-icons/react";
import {
  Badge,
  Cell,
  InitialAvatar,
  PageHead,
  Row,
  SearchInput,
  Table,
  Tabs,
  Toggle,
} from "@/projects/b2b/orderlog/components/ui";
import { adminAccounts, aiRules, auditLogs, companies } from "@/projects/b2b/orderlog/lib/mock-data";
import { ROLE_LABEL } from "@/projects/b2b/orderlog/lib/navigation";

const ACCOUNT_STATUS_TONE = {
  활성: "success",
  정지: "danger",
  초대중: "warn",
} as const;

const TIER_TONE = {
  핵심: "info",
  일반: "neutral",
  관찰: "warn",
} as const;

const RULE_KIND_LABEL = {
  duplicate: "중복 발주",
  price_spike: "단가 급변",
  permission: "권한 이상",
} as const;

type Tab = "accounts" | "companies" | "rules" | "logs";

export function AdminConsole() {
  const [tab, setTab] = useState<Tab>("accounts");
  const [query, setQuery] = useState("");
  const [rules, setRules] = useState(aiRules);

  const filteredAccounts = adminAccounts.filter(
    (a) => a.companyName.includes(query) || a.manager.includes(query),
  );

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="관리자"
        title="관리자 백오피스"
        desc="계정, 권한, 거래처, AI 룰, 접근 로그를 마스터 권한으로 관리합니다. 원청/납품처/거래처 콘솔과는 별도의 주소와 계정으로 접근하는 운영 전용 화면입니다."
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "accounts" as Tab, label: "계정/권한", count: adminAccounts.length },
          { key: "companies" as Tab, label: "거래처", count: companies.length },
          { key: "rules" as Tab, label: "AI 룰", count: rules.length },
          { key: "logs" as Tab, label: "로그 조회", count: auditLogs.length },
        ]}
      />

      {tab === "accounts" && (
        <div className="space-y-4">
          <div className="w-[240px]">
            <SearchInput value={query} onChange={setQuery} placeholder="회사명, 담당자 검색" />
          </div>
          <div className="overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]">
            <div className="p-5">
              <Table
                head={["담당자", "회사명", "권한", "최근 로그인", "상태"]}
                align={["left", "left", "left", "left", "left"]}
                minWidth={560}
              >
                {filteredAccounts.map((a) => (
                  <Row key={a.id}>
                    <Cell strong>
                      <span className="flex items-center gap-2.5">
                        <InitialAvatar name={a.manager} size={26} />
                        {a.manager}
                      </span>
                    </Cell>
                    <Cell>{a.companyName}</Cell>
                    <Cell>
                      <Badge tone="info">{ROLE_LABEL[a.role]}</Badge>
                    </Cell>
                    <Cell mono muted nowrap>
                      {a.lastLoginAt}
                    </Cell>
                    <Cell>
                      <Badge tone={ACCOUNT_STATUS_TONE[a.status]}>{a.status}</Badge>
                    </Cell>
                  </Row>
                ))}
              </Table>
            </div>
          </div>
        </div>
      )}

      {tab === "companies" && (
        <div className="overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]">
          <div className="p-5">
            <Table head={["회사명", "역할", "사업자번호", "등급"]} align={["left", "left", "left", "left"]} minWidth={480}>
              {companies.map((c) => (
                <Row key={c.id}>
                  <Cell strong>
                    <span className="flex items-center gap-2.5">
                      <InitialAvatar name={c.name} tone="ink" size={26} />
                      {c.name}
                    </span>
                  </Cell>
                  <Cell>{ROLE_LABEL[c.role]}</Cell>
                  <Cell mono muted>
                    {c.bizNo}
                  </Cell>
                  <Cell>
                    <Badge tone={TIER_TONE[c.tier]}>{c.tier}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </div>
      )}

      {tab === "rules" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start justify-between gap-4 rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] p-5 shadow-[var(--ot-shadow)]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[var(--ot-surface-soft)] text-[var(--ot-body)]">
                  <Robot size={16} weight="bold" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-[14px] font-medium text-[var(--ot-ink)]">
                    {rule.name}
                    <Badge tone="neutral">{RULE_KIND_LABEL[rule.kind]}</Badge>
                  </p>
                  <p className="mt-1 text-[12.5px] leading-5 text-[var(--ot-body)]">{rule.description}</p>
                  <p className="mt-2 flex items-center gap-3 text-[12px] text-[var(--ot-mute)]">
                    <span className="ot-mono">기준: {rule.threshold}</span>
                    <span className="ot-mono">누적 탐지 {rule.triggeredCount}건</span>
                  </p>
                </div>
              </div>
              <Toggle
                on={rule.enabled}
                label={`${rule.name} 사용 여부`}
                onChange={() =>
                  setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)))
                }
              />
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div className="overflow-hidden rounded-[10px] border border-[var(--ot-hairline)] bg-[var(--ot-surface)] shadow-[var(--ot-shadow)]">
          <div className="p-5">
            <Table head={["시각", "행위자", "액션", "대상", "IP"]} align={["left", "left", "left", "left", "left"]} minWidth={640}>
              {auditLogs.map((log) => (
                <Row key={log.id}>
                  <Cell mono nowrap muted>
                    {log.at}
                  </Cell>
                  <Cell strong>{log.actor}</Cell>
                  <Cell>{log.action}</Cell>
                  <Cell mono muted>
                    {log.target}
                  </Cell>
                  <Cell mono muted>
                    {log.ip}
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 border-t border-[var(--ot-hairline)] pt-6 text-[12.5px] text-[var(--ot-mute)]">
        <span className="flex items-center gap-1.5">
          <UsersThree size={14} />
          활성 계정 {adminAccounts.filter((a) => a.status === "활성").length}명
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          AI 룰 {rules.filter((r) => r.enabled).length}/{rules.length} 사용중
        </span>
        <span className="flex items-center gap-1.5">
          <ClockCounterClockwise size={14} />
          최근 90일 로그 보관
        </span>
      </div>
    </div>
  );
}
