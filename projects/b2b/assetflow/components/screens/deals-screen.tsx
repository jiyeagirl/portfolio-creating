"use client";

import { useMemo, useState } from "react";
import {
  DownloadSimple,
  FilePdf,
  FileXls,
  Handshake,
  Receipt,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Table,
  Tabs,
  Timeline,
} from "@/projects/b2b/assetflow/components/ui";
import { deals } from "@/projects/b2b/assetflow/lib/mock-data";
import {
  STAGE_LABEL,
  STAGE_ORDER,
  STAGE_TONE,
  manwon,
  won,
  type Navigate,
} from "@/projects/b2b/assetflow/lib/navigation";
import type { DealStage } from "@/projects/b2b/assetflow/lib/types";

type Filter = "all" | DealStage;

const STAGE_ICON = {
  contract: Handshake,
  wipe: ShieldCheck,
  pickup: Truck,
  settlement: Receipt,
  done: Handshake,
};

const PER_PAGE = 5;

export function DealsScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("최근 확정순");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(deals[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = deals.filter((deal) => {
      const matchStage = filter === "all" || deal.stage === filter;
      const matchQuery =
        !q ||
        deal.code.toLowerCase().includes(q) ||
        deal.assetName.toLowerCase().includes(q) ||
        deal.reseller.toLowerCase().includes(q);
      return matchStage && matchQuery;
    });
    return [...base].sort((a, b) =>
      sort === "금액 높은순"
        ? b.amount - a.amount
        : sort === "금액 낮은순"
          ? a.amount - b.amount
          : b.confirmedAt.localeCompare(a.confirmedAt),
    );
  }, [filter, query, sort]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const deal = deals.find((d) => d.id === selected) ?? deals[0];
  const stageIndex = STAGE_ORDER.indexOf(deal.stage);
  const inProgress = deals.filter((d) => d.stage !== "done");
  const totalAmount = deals.reduce((sum, d) => sum + d.amount, 0);

  const apply = (next: () => void) => {
    next();
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="거래 관리"
        title="확정 거래 진행 현황"
        desc="계약, 데이터 파기, 회수, 정산까지 단계별로 추적합니다. 각 단계에서 발행된 문서는 언제든 다시 받을 수 있습니다."
        actions={
          <Button variant="secondary" size="md" icon={<DownloadSimple size={14} />}>
            거래 내역 내보내기
          </Button>
        }
      />

      {/* 단계별 요약 */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-[var(--af-hairline)] bg-[var(--af-hairline)] lg:grid-cols-5">
        {STAGE_ORDER.map((stage) => {
          const Icon = STAGE_ICON[stage];
          const count = deals.filter((d) => d.stage === stage).length;
          const amount = deals.filter((d) => d.stage === stage).reduce((s, d) => s + d.amount, 0);
          const active = filter === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => apply(() => setFilter(active ? "all" : stage))}
              aria-pressed={active}
              className={`p-5 text-left transition-colors ${
                active ? "bg-[var(--af-soft-2)]" : "bg-[var(--af-canvas)] hover:bg-[var(--af-soft)]"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[12.5px] text-[var(--af-mute)]">
                <Icon size={13} weight="bold" />
                {STAGE_LABEL[stage]}
              </span>
              <span className="mt-2 block af-mono text-[22px] font-semibold leading-7 tracking-[-0.03em] text-[var(--af-ink)]">
                {count}건
              </span>
              <span className="mt-1 block af-mono text-[12px] text-[var(--af-body)]">
                {amount > 0 ? manwon(amount) : "-"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start">
        <Card>
          <CardHead
            title="거래 목록"
            desc={`전체 ${deals.length}건 | 진행 중 ${inProgress.length}건 | 누적 ${manwon(totalAmount)}`}
          />

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <SearchInput
                value={query}
                onChange={(next) => apply(() => setQuery(next))}
                placeholder="거래 번호, 자산명, 리셀러 검색"
              />
            </div>
            <div className="sm:w-[168px]">
              <Select
                value={sort}
                options={["최근 확정순", "금액 높은순", "금액 낮은순"]}
                onChange={setSort}
              />
            </div>
          </div>

          <Tabs
            value={filter}
            onChange={(next) => apply(() => setFilter(next))}
            items={[
              { key: "all" as Filter, label: "전체", count: deals.length },
              ...STAGE_ORDER.map((stage) => ({
                key: stage as Filter,
                label: STAGE_LABEL[stage],
                count: deals.filter((d) => d.stage === stage).length,
              })),
            ]}
          />

          <div className="mt-4">
            <Table
              head={["거래 번호", "자산", "리셀러", "금액", "단계", "완료 예정"]}
              align={["left", "left", "left", "right", "left", "right"]}
            >
              {paged.map((item) => (
                <Row
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  active={item.id === selected}
                >
                  <Cell mono strong nowrap>
                    {item.code}
                  </Cell>
                  <Cell>
                    <span className="block text-[13px] font-medium text-[var(--af-ink)]">
                      {item.assetName}
                    </span>
                    <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                      {item.quantity}대
                    </span>
                  </Cell>
                  <Cell>{item.reseller}</Cell>
                  <Cell align="right" mono strong nowrap>
                    {won(item.amount)}
                  </Cell>
                  <Cell>
                    <Badge tone={STAGE_TONE[item.stage]}>{STAGE_LABEL[item.stage]}</Badge>
                  </Cell>
                  <Cell align="right" mono muted nowrap>
                    {item.expectedAt}
                  </Cell>
                </Row>
              ))}
            </Table>

            {paged.length === 0 && (
              <p className="py-12 text-center text-[13.5px] text-[var(--af-mute)]">
                조건에 맞는 거래가 없습니다. 검색어나 단계 필터를 바꿔 보세요.
              </p>
            )}

            <Pagination
              page={page}
              total={filtered.length}
              perPage={PER_PAGE}
              onChange={setPage}
            />
          </div>
        </Card>

        {/* 선택 거래 상세 */}
        <div className="space-y-6">
          <Card>
            <CardHead
              title="계약 진행 현황"
              desc={`${deal.code} | ${deal.assetName} ${deal.quantity}대`}
              action={<Badge tone={STAGE_TONE[deal.stage]}>{STAGE_LABEL[deal.stage]}</Badge>}
            />

            {/* 단계 진행 바 */}
            <ol className="mb-5 flex items-center">
              {STAGE_ORDER.map((stage, index) => {
                const reached = index <= stageIndex;
                return (
                  <li key={stage} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full af-mono text-[11px] font-medium ${
                        reached
                          ? "bg-[var(--af-primary)] text-[var(--af-on-primary)]"
                          : "border border-[var(--af-hairline)] bg-[var(--af-canvas)] text-[var(--af-mute)]"
                      }`}
                      title={STAGE_LABEL[stage]}
                    >
                      {index + 1}
                    </span>
                    {index < STAGE_ORDER.length - 1 && (
                      <span
                        className={`mx-1 h-px flex-1 ${
                          index < stageIndex ? "bg-[var(--af-primary)]" : "bg-[var(--af-hairline)]"
                        }`}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            <DefList
              columns={1}
              items={[
                { label: "리셀러", value: deal.reseller },
                { label: "거래 금액", value: <span className="af-mono">{won(deal.amount)}</span> },
                {
                  label: "수수료 (2.4%)",
                  value: <span className="af-mono">{won(Math.round(deal.amount * 0.024))}</span>,
                },
                {
                  label: "정산 예정액",
                  value: (
                    <span className="af-mono font-semibold">
                      {won(Math.round(deal.amount * 0.976))}
                    </span>
                  ),
                },
                { label: "확정일", value: deal.confirmedAt },
                { label: "완료 예정", value: deal.expectedAt },
              ]}
            />

            <div className="mt-5 border-t border-[var(--af-hairline)] pt-5">
              <p className="mb-3 text-[13px] font-medium text-[var(--af-ink)]">단계별 이력</p>
              <Timeline steps={deal.timeline} />
            </div>

            {deal.stage !== "done" && (
              <div className="mt-5 flex gap-2">
                <Button variant="danger" size="md" full>
                  취소 요청
                </Button>
                <Button size="md" full onClick={() => onNavigate("reports")}>
                  진행 상황 공유
                </Button>
              </div>
            )}
          </Card>

          <Card padded={false}>
            <div className="flex items-center justify-between border-b border-[var(--af-hairline)] px-5 py-4">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--af-ink)]">
                거래 문서
              </h2>
              <Button variant="ghost" size="sm" icon={<DownloadSimple size={12} />}>
                전체 받기
              </Button>
            </div>
            <ul>
              {deal.documents.map((doc) => (
                <li
                  key={doc.name}
                  className="flex items-center gap-3 border-b border-[var(--af-hairline)] px-5 py-3.5 last:border-b-0"
                >
                  <span className="shrink-0 text-[var(--af-body)]">
                    {doc.kind === "XLSX" ? <FileXls size={20} /> : <FilePdf size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-[var(--af-ink)]">
                      {doc.name}
                    </span>
                    <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                      {doc.kind} | {doc.size} | {doc.issuedAt}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`${doc.name} 다운로드`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] text-[var(--af-body)] transition-colors hover:bg-[var(--af-soft)]"
                  >
                    <DownloadSimple size={13} />
                  </button>
                </li>
              ))}
            </ul>
            {deal.stage !== "done" && (
              <p className="border-t border-[var(--af-hairline)] bg-[var(--af-soft)] px-5 py-3 text-[12px] leading-[18px] text-[var(--af-mute)]">
                인수인계 확인서와 세금계산서는 회수/정산 단계에서 자동 발행됩니다.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
