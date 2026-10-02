"use client";

import { useMemo, useState } from "react";
import { ChatCircleDots, Prohibit, ShieldWarning, Timer } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Stat,
  Table,
  Tabs,
} from "@/projects/b2b/assetflow/components/ui";
import { adminTrades, disputes } from "@/projects/b2b/assetflow/lib/admin-data";
import { manwon, won, type Tone } from "@/projects/b2b/assetflow/lib/navigation";

type Filter = "all" | "입찰" | "거래" | "분쟁";

const STATE_TONE: Record<string, Tone> = {
  "입찰 진행": "info",
  "계약 진행": "warn",
  "회수 대기": "info",
  "정산 대기": "info",
  "거래 완료": "ink",
  분쟁: "danger",
};

const PER_PAGE = 6;

export function AdminTrades() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<(typeof adminTrades)[number] | null>(null);
  const [action, setAction] = useState("거래 승인");
  const [disputeOpen, setDisputeOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminTrades.filter((trade) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "입찰"
            ? trade.round === 1
            : filter === "분쟁"
              ? trade.state === "분쟁"
              : trade.round === 2 && trade.state !== "분쟁";
      const matchQuery =
        !q ||
        trade.code.toLowerCase().includes(q) ||
        trade.company.toLowerCase().includes(q) ||
        trade.asset.toLowerCase().includes(q) ||
        trade.reseller.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const bidding = adminTrades.filter((t) => t.round === 1);
  const trading = adminTrades.filter((t) => t.round === 2 && t.state !== "분쟁");
  const disputed = adminTrades.filter((t) => t.state === "분쟁");
  const totalAmount = adminTrades.reduce((sum, t) => sum + t.amount, 0);
  const dispute = disputes[0];

  const apply = (next: () => void) => {
    next();
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="거래 운영"
        title="입찰 | 거래 관리"
        desc="진행 중인 입찰을 모니터링하고 거래를 승인하거나 취소합니다. 분쟁이 접수되면 양측 자료를 대조해 처리합니다."
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={<ShieldWarning size={14} />}
            onClick={() => setDisputeOpen(true)}
          >
            분쟁 {disputed.length}건
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="진행 중 입찰" value={`${bidding.length}건`} delta="+4" note="마감 24시간 내 1건" />
        <Stat label="진행 중 거래" value={`${trading.length}건`} delta="+2" note="계약~정산 단계" />
        <Stat label="분쟁" value={`${disputed.length}건`} delta="조치 필요" note="조사 중" emphasis />
        <Stat label="모니터링 총액" value={manwon(totalAmount)} delta="+18.2%" note="전월 대비" />
      </div>

      <Card>
        <CardHead title="입찰 | 거래 모니터링" desc={`전체 ${adminTrades.length}건`} />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={(next) => apply(() => setQuery(next))}
              placeholder="거래 번호, 기업, 리셀러, 자산 검색"
            />
          </div>
        </div>

        <Tabs
          value={filter}
          onChange={(next) => apply(() => setFilter(next))}
          items={[
            { key: "all" as Filter, label: "전체", count: adminTrades.length },
            { key: "입찰" as Filter, label: "입찰", count: bidding.length },
            { key: "거래" as Filter, label: "거래", count: trading.length },
            { key: "분쟁" as Filter, label: "분쟁", count: disputed.length },
          ]}
        />

        <div className="mt-4">
          <Table
            head={["코드", "기업", "리셀러", "자산", "수량", "금액", "단계", "상태", ""]}
            align={["left", "left", "left", "left", "right", "right", "center", "left", "right"]}
          >
            {paged.map((trade) => (
              <Row key={trade.id} onClick={() => setTarget(trade)}>
                <Cell mono strong nowrap>
                  {trade.code}
                </Cell>
                <Cell>{trade.company}</Cell>
                <Cell>{trade.reseller === "-" ? <span className="text-[var(--af-mute)]">입찰 중</span> : trade.reseller}</Cell>
                <Cell>{trade.asset}</Cell>
                <Cell align="right" mono nowrap>
                  {trade.qty}대
                </Cell>
                <Cell align="right" mono strong nowrap>
                  {won(trade.amount)}
                </Cell>
                <Cell align="center" mono nowrap>
                  {trade.round}차
                </Cell>
                <Cell>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={STATE_TONE[trade.state]} dot={trade.state === "입찰 진행"}>
                      {trade.state}
                    </Badge>
                    {trade.flag && (
                      <span className="af-mono text-[11.5px] text-[var(--af-warn-deep)]">
                        {trade.flag}
                      </span>
                    )}
                  </span>
                </Cell>
                <Cell align="right">
                  <Button
                    variant={trade.state === "분쟁" ? "danger" : "ghost"}
                    size="sm"
                    onClick={() => (trade.state === "분쟁" ? setDisputeOpen(true) : setTarget(trade))}
                  >
                    {trade.state === "분쟁" ? "처리" : "관리"}
                  </Button>
                </Cell>
              </Row>
            ))}
          </Table>

          {paged.length === 0 && (
            <p className="py-12 text-center text-[13.5px] text-[var(--af-mute)]">
              조건에 맞는 거래가 없습니다. 검색어나 필터를 바꿔 보세요.
            </p>
          )}

          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <Card>
        <CardHead
          title="분쟁 처리"
          desc="양측 주장과 제출 자료를 대조해 판단합니다. 처리 결과는 양측에 동시에 통보됩니다."
          action={<Badge tone="danger">{dispute.state}</Badge>}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start">
          <DefList
            columns={1}
            items={[
              { label: "거래 번호", value: <span className="af-mono">{dispute.code}</span> },
              { label: "접수 일시", value: <span className="af-mono">{dispute.opened}</span> },
              { label: "기업", value: dispute.company },
              { label: "리셀러", value: dispute.reseller },
              { label: "사유", value: dispute.reason },
              { label: "담당", value: dispute.owner },
            ]}
          />

          <div>
            <p className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] px-4 py-3 text-[13px] leading-6 text-[var(--af-body)]">
              {dispute.detail}
            </p>
            <ul className="mt-4 space-y-3">
              {dispute.log.map((entry) => (
                <li key={`${entry.at}-${entry.who}`} className="flex gap-3">
                  <ChatCircleDots
                    size={15}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-[var(--af-mute)]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="text-[13px] font-medium text-[var(--af-ink)]">{entry.who}</p>
                      <p className="af-mono text-[11.5px] text-[var(--af-mute)]">{entry.at}</p>
                    </div>
                    <p className="mt-0.5 text-[12.5px] leading-[18px] text-[var(--af-body)]">
                      {entry.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                자료 요청
              </Button>
              <Button variant="secondary" size="sm">
                수량 조정 중재
              </Button>
              <Button size="sm" onClick={() => setDisputeOpen(true)}>
                처리 결과 등록
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 거래 승인 / 취소 */}
      <Drawer
        open={target !== null}
        title="거래 관리"
        subtitle={target ? `${target.code} | ${target.company}` : undefined}
        onClose={() => setTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setTarget(null)}>
              닫기
            </Button>
            <Button full onClick={() => setTarget(null)}>
              {action} 처리
            </Button>
          </div>
        }
      >
        {target && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Badge tone={STATE_TONE[target.state]}>{target.state}</Badge>
              <Badge tone="neutral">{target.round}차</Badge>
            </div>

            <DefList
              columns={1}
              items={[
                { label: "거래 번호", value: <span className="af-mono">{target.code}</span> },
                { label: "기업", value: target.company },
                { label: "리셀러", value: target.reseller === "-" ? "입찰 진행 중" : target.reseller },
                { label: "자산", value: `${target.asset} ${target.qty}대` },
                { label: "금액", value: <span className="af-mono">{won(target.amount)}</span> },
                {
                  label: "플랫폼 수수료",
                  value: <span className="af-mono">{won(Math.round(target.amount * 0.056))}</span>,
                },
                { label: "마감", value: <span className="af-mono">{target.closesAt}</span> },
              ]}
            />

            {target.state === "입찰 진행" && (
              <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-link-soft)] px-3.5 py-3">
                <Timer size={14} className="mt-px shrink-0 text-[var(--af-link-deep)]" />
                <p className="text-[12px] leading-[18px] text-[var(--af-link-deep)]">
                  입찰이 진행 중입니다. 마감 전 강제 종료는 기업 요청이 있을 때만 처리하세요.
                </p>
              </div>
            )}

            <Field label="처리 작업" hint="선택한 작업은 이력에 기록되고 양측에 통보됩니다.">
              <Select
                value={action}
                options={["거래 승인", "거래 취소", "입찰 마감 연장", "입찰 강제 종료", "정산 보류"]}
                onChange={setAction}
              />
            </Field>

            <Field label="사유">
              <textarea
                rows={3}
                defaultValue=""
                placeholder="처리 사유를 입력하세요"
                className="w-full resize-none rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-canvas)] px-3 py-2.5 text-[14px] leading-6 text-[var(--af-ink)] outline-none transition-colors placeholder:text-[var(--af-mute)] focus:border-[var(--af-hairline-strong)]"
              />
            </Field>

            {action === "거래 취소" && (
              <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-error-soft)] px-3.5 py-3">
                <Prohibit size={14} className="mt-px shrink-0 text-[var(--af-error-deep)]" />
                <p className="text-[12px] leading-[18px] text-[var(--af-error-deep)]">
                  취소하면 계약이 파기되고 리셀러 이력에 취소 건으로 남습니다. 되돌릴 수 없습니다.
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 분쟁 처리 결과 */}
      <Drawer
        open={disputeOpen}
        title="분쟁 처리 결과 등록"
        subtitle={`${dispute.code} | ${dispute.company} ↔ ${dispute.reseller}`}
        onClose={() => setDisputeOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setDisputeOpen(false)}>
              취소
            </Button>
            <Button full onClick={() => setDisputeOpen(false)}>
              결과 등록하고 통보
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="rounded-[6px] border border-[var(--af-error-soft)] bg-[var(--af-error-soft)] p-4">
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--af-error-deep)]">
              <ShieldWarning size={13} weight="fill" />
              {dispute.reason}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--af-error-deep)]">
              {dispute.detail}
            </p>
          </div>

          <Field label="판단" required>
            <Select
              value="리셀러 주장 일부 인정 | 수량 조정"
              options={[
                "리셀러 주장 일부 인정 | 수량 조정",
                "기업 주장 인정 | 전량 회수 요구",
                "리셀러 주장 인정 | 원안 유지",
                "추가 조사 필요",
              ]}
            />
          </Field>

          <Field label="조정 금액" hint="원래 21,600,000원에서 미회수 12대분을 차감합니다.">
            <div className="flex items-center gap-2">
              <span className="af-mono flex h-10 flex-1 items-center rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] px-3 text-[14px] text-[var(--af-ink)]">
                16,800,000원
              </span>
              <Badge tone="danger">-4,800,000원</Badge>
            </div>
          </Field>

          <Field label="후속 조치">
            <div className="space-y-2">
              {[
                "리셀러 경고 1회 부여",
                "기업에 조정 계약서 재발행",
                "정산 보류 해제",
              ].map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[6px] border border-[var(--af-hairline)] px-3.5 py-2.5"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 shrink-0 accent-[var(--af-primary)]"
                  />
                  <span className="text-[13px] text-[var(--af-body)]">{item}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
