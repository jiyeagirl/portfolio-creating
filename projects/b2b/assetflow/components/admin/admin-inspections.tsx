"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Equals, UserFocus } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  Input,
  Meter,
  PageHead,
  Row,
  SearchInput,
  Select,
  Stat,
  Table,
  Tabs,
} from "@/projects/b2b/assetflow/components/ui";
import {
  adminInspections,
  gradeChangeLog,
  inspectors,
} from "@/projects/b2b/assetflow/lib/admin-data";
import type { Tone } from "@/projects/b2b/assetflow/lib/navigation";

type Filter = "all" | "배정 대기" | "방문 예정" | "리포트 작성 중" | "승인 대기" | "승인 완료";

const STATE_TONE: Record<string, Tone> = {
  "배정 대기": "warn",
  "방문 예정": "info",
  "리포트 작성 중": "info",
  "승인 대기": "warn",
  "승인 완료": "ink",
};

const FILTERS: Filter[] = ["배정 대기", "방문 예정", "리포트 작성 중", "승인 대기", "승인 완료"];

export function AdminInspections() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [assign, setAssign] = useState<(typeof adminInspections)[number] | null>(null);
  const [inspector, setInspector] = useState(inspectors[0].name);
  const [visitDate, setVisitDate] = useState("2026-07-30");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminInspections.filter((item) => {
      const matchFilter = filter === "all" || item.state === filter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.asset.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  const waiting = adminInspections.filter((i) => i.state === "배정 대기").length;
  const approving = adminInspections.filter((i) => i.state === "승인 대기").length;
  const totalQty = adminInspections.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="검수 운영"
        title="자산 | 검수 관리"
        desc="검수 신청을 검수원에게 배정하고, 제출된 리포트를 승인합니다. 승인 즉시 최종 입찰이 열립니다."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="검수 신청" value={`${adminInspections.length}건`} delta="+3" note="이번 주" />
        <Stat label="배정 대기" value={`${waiting}건`} delta="조치 필요" note="72시간 초과 1건" emphasis />
        <Stat label="승인 대기" value={`${approving}건`} delta="+1" note="리포트 검토" />
        <Stat label="검수 대상 수량" value={`${totalQty.toLocaleString("ko-KR")}대`} delta="+312" note="지난주 대비" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-start">
        <div className="space-y-6">
          <Card>
            <CardHead title="검수 신청 목록" desc="희망일 기준으로 정렬됩니다." />

            <div className="mb-4">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="검수 코드, 기업명, 자산명 검색"
              />
            </div>

            <Tabs
              value={filter}
              onChange={setFilter}
              items={[
                { key: "all" as Filter, label: "전체", count: adminInspections.length },
                ...FILTERS.map((state) => ({
                  key: state as Filter,
                  label: state,
                  count: adminInspections.filter((i) => i.state === state).length,
                })),
              ]}
            />

            <div className="mt-4">
              <Table
                head={["코드 | 기업", "자산", "수량", "검수원", "기한", "상태", ""]}
                align={["left", "left", "right", "left", "right", "left", "right"]}
                minWidth={620}
              >
                {filtered.map((item) => (
                  <Row key={item.id}>
                    <Cell nowrap>
                      <span className="af-mono block text-[13px] font-medium text-[var(--af-ink)]">
                        {item.code}
                      </span>
                      <span className="block text-[11.5px] text-[var(--af-mute)]">
                        {item.company}
                      </span>
                    </Cell>
                    <Cell>
                      <span className="block text-[13px] text-[var(--af-body)]">{item.asset}</span>
                      <span className="block text-[11.5px] text-[var(--af-mute)]">{item.site}</span>
                    </Cell>
                    <Cell align="right" mono nowrap>
                      {item.qty}대
                    </Cell>
                    <Cell nowrap>
                      {item.inspector === "-" ? (
                        <span className="text-[var(--af-warn-deep)]">미배정</span>
                      ) : (
                        item.inspector
                      )}
                    </Cell>
                    <Cell align="right" mono muted nowrap>
                      {item.due}
                    </Cell>
                    <Cell>
                      <Badge tone={STATE_TONE[item.state]}>{item.state}</Badge>
                    </Cell>
                    <Cell align="right">
                      <Button
                        variant={item.state === "배정 대기" ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setAssign(item)}
                      >
                        {item.state === "배정 대기"
                          ? "배정"
                          : item.state === "승인 대기"
                            ? "승인"
                            : "상세"}
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </Table>

              {filtered.length === 0 && (
                <p className="py-12 text-center text-[13.5px] text-[var(--af-mute)]">
                  조건에 맞는 검수 건이 없습니다. 검색어나 상태 필터를 바꿔 보세요.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHead
              title="상태 변경 이력"
              desc="검수 결과로 등급이 조정된 기록입니다. 조정 사유는 기업에도 그대로 전달됩니다."
            />
            <Table
              head={["일시", "코드", "등급 변화", "검수원", "사유"]}
              align={["left", "left", "center", "left", "left"]}
              minWidth={520}
            >
              {gradeChangeLog.map((log) => {
                const changed = log.from !== log.to;
                const better = changed && log.to < log.from;
                const Icon = !changed ? Equals : better ? ArrowUp : ArrowDown;
                const tone = !changed
                  ? "text-[var(--af-mute)]"
                  : better
                    ? "text-[var(--af-link-deep)]"
                    : "text-[var(--af-error-deep)]";
                return (
                  <Row key={`${log.at}-${log.code}`}>
                    <Cell mono muted nowrap>
                      {log.at}
                    </Cell>
                    <Cell mono strong nowrap>
                      {log.code}
                    </Cell>
                    <Cell align="center">
                      <span className={`inline-flex items-center gap-1.5 af-mono text-[13px] ${tone}`}>
                        {log.from}
                        <Icon size={11} weight="bold" />
                        {log.to}
                      </span>
                    </Cell>
                    <Cell>{log.by}</Cell>
                    <Cell muted>{log.reason}</Cell>
                  </Row>
                );
              })}
            </Table>
          </Card>
        </div>

        <Card>
          <CardHead
            title="검수원 배정 현황"
            desc="담당 지역과 현재 진행 건수입니다. 여유가 있는 검수원부터 배정하세요."
          />
          <ul className="space-y-4">
            {inspectors.map((person) => {
              const load = Math.round((person.load / person.capacity) * 100);
              return (
                <li key={person.name}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--af-soft-2)] text-[var(--af-body)]">
                      <UserFocus size={14} weight="bold" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium text-[var(--af-ink)]">{person.name}</p>
                      <p className="text-[12px] text-[var(--af-mute)]">{person.region}</p>
                    </div>
                    <span className="af-mono shrink-0 text-[13px] text-[var(--af-body)]">
                      {person.load} / {person.capacity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Meter value={load} tone={load >= 80 ? "warn" : "ink"} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
            <p className="text-[13px] font-medium text-[var(--af-ink)]">배정 규칙</p>
            <ul className="mt-2.5 space-y-1.5">
              {[
                "담당 지역이 일치하는 검수원을 우선 배정",
                "진행 건수가 정원의 80%를 넘으면 배정 대상에서 제외",
                "신청 후 48시간 내 미배정 시 운영자에게 알림",
                "동일 기업 연속 3회 배정은 자동으로 다른 검수원에게 분산",
              ].map((rule) => (
                <li key={rule} className="flex gap-2 text-[12.5px] leading-5 text-[var(--af-body)]">
                  <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[var(--af-hairline-strong)]" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Drawer
        open={assign !== null}
        title={assign?.state === "승인 대기" ? "검수 리포트 승인" : "검수원 배정"}
        subtitle={assign ? `${assign.code} | ${assign.company} | ${assign.asset}` : undefined}
        onClose={() => setAssign(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setAssign(null)}>
              취소
            </Button>
            <Button full onClick={() => setAssign(null)}>
              {assign?.state === "승인 대기" ? "승인하고 최종 입찰 열기" : "배정 확정"}
            </Button>
          </div>
        }
      >
        {assign && (
          <div className="space-y-5">
            <DefList
              columns={1}
              items={[
                { label: "검수 코드", value: <span className="af-mono">{assign.code}</span> },
                { label: "기업", value: assign.company },
                { label: "자산", value: `${assign.asset} ${assign.qty}대` },
                { label: "장소", value: assign.site },
                { label: "신청일", value: assign.requestedAt },
                { label: "기한", value: assign.due },
              ]}
            />

            {assign.state === "승인 대기" ? (
              <>
                <div className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
                  <p className="text-[13px] font-medium text-[var(--af-ink)]">제출된 리포트 요약</p>
                  <p className="mt-2 text-[12.5px] leading-5 text-[var(--af-body)]">
                    신고 등급 B와 현장 확인 결과가 일치합니다. 충전기 전량 포함이 확인되어 자동
                    시세를 356,000원에서 361,000원으로 소폭 상향했습니다.
                  </p>
                </div>
                <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-link-soft)] px-3.5 py-3">
                  <CheckCircle size={14} weight="fill" className="mt-px shrink-0 text-[var(--af-link-deep)]" />
                  <p className="text-[12px] leading-[18px] text-[var(--af-link-deep)]">
                    승인하면 1차 입찰에 참여한 리셀러 전원에게 알림이 발송되고 48시간 동안 최종
                    입찰이 진행됩니다.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Field label="담당 검수원" required hint="담당 지역이 일치하는 검수원이 위에 표시됩니다.">
                  <Select
                    value={inspector}
                    options={inspectors.map((p) => `${p.name} | ${p.region} (${p.load}/${p.capacity})`)}
                    onChange={(next) => setInspector(next.split(" | ")[0])}
                  />
                </Field>
                <Field label="방문 예정일" required>
                  <Input value={visitDate} onChange={setVisitDate} type="date" />
                </Field>
                <div className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--af-ink)]">
                    배정 후 진행
                    <ArrowRight size={12} />
                  </p>
                  <ol className="mt-2.5 space-y-1.5">
                    {[
                      `${inspector} 검수원에게 배정 알림 발송`,
                      "기업 담당자에게 방문일 확정 안내",
                      "현장 검수 후 리포트 제출",
                      "운영자 승인 시 최종 입찰 개시",
                    ].map((step, index) => (
                      <li key={step} className="flex gap-2 text-[12.5px] leading-5 text-[var(--af-body)]">
                        <span className="af-mono shrink-0 text-[var(--af-mute)]">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
