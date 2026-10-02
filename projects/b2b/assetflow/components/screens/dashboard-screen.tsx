"use client";

import {
  ArrowRight,
  Bell,
  Clock,
  FileMagnifyingGlass,
  Gavel,
  Handshake,
  Megaphone,
} from "@phosphor-icons/react";
import {
  AssetThumb,
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  PageHead,
  Row,
  Stat,
  Table,
  Timeline,
} from "@/projects/b2b/assetflow/components/ui";
import {
  assets,
  biddingDeadlines,
  bidsOf,
  deals,
  monthlyTrade,
  notices,
  TODAY,
} from "@/projects/b2b/assetflow/lib/mock-data";
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  STAGE_LABEL,
  STAGE_TONE,
  manwon,
  remainLabel,
  won,
  type Navigate,
} from "@/projects/b2b/assetflow/lib/navigation";

const NOTICE_ICON = {
  bid: Gavel,
  inspection: FileMagnifyingGlass,
  deal: Handshake,
  notice: Megaphone,
};

export function DashboardScreen({ onNavigate }: { onNavigate: Navigate }) {
  const liveBids = assets.filter((a) => a.status === "bidding1" || a.status === "bidding2");
  const recent = [...assets]
    .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
    .slice(0, 5);
  const activeDeal = deals.find((d) => d.stage === "pickup") ?? deals[0];

  const expected = liveBids.reduce((sum, asset) => {
    const round = asset.status === "bidding2" ? 2 : 1;
    const top = bidsOf(asset.id, round)[0];
    return sum + (top?.unitPrice ?? asset.autoPrice) * asset.quantity;
  }, 0);
  const confirmedAmount = deals
    .filter((d) => d.stage !== "done")
    .reduce((sum, d) => sum + d.amount, 0);

  const holdingCount = assets.reduce((sum, a) => sum + a.quantity, 0);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow={`${TODAY} 기준`}
        title="자산 처분 현황"
        desc="보유 자산과 진행 중인 입찰, 확정 거래를 한 화면에서 확인합니다. 자동 시세는 매일 오전 6시에 갱신됩니다."
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => onNavigate("reports")}>
              리포트 보기
            </Button>
            <Button size="md" onClick={() => onNavigate("register")}>
              자산 등록
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="보유 자산" value={`${holdingCount.toLocaleString("ko-KR")}대`} delta={`${assets.length}개 품목`} note="등록 완료 기준" />
        <Stat label="진행 중 입찰" value={`${liveBids.length}건`} delta="+2" note="어제 대비" />
        <Stat label="예상 매각 금액" value={manwon(expected)} delta="+12.4%" note="현재 최고가 기준" emphasis />
        <Stat label="확정 거래 잔액" value={manwon(confirmedAmount)} delta={`${deals.filter((d) => d.stage !== "done").length}건`} note="정산 전 금액" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] items-start">
        <div className="space-y-6">
          <Card>
            <CardHead
              title="진행 중인 입찰"
              desc="마감이 가까운 순서입니다. 마감 후에는 최고가 리셀러가 자동으로 선정되지 않고 직접 확정해야 합니다."
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate("bidding")}>
                  전체 보기
                  <ArrowRight size={12} />
                </Button>
              }
            />
            {/* 좁은 컬럼이라 수량/참여 개사는 자산 셀 보조 줄로 내렸다.
                열을 늘리면 마감까지가 잘려서 가장 중요한 정보가 사라진다. */}
            <Table
              head={["자산", "최고가 (대당)", "시세 대비", "마감까지"]}
              align={["left", "right", "right", "right"]}
            >
              {liveBids
                .sort(
                  (a, b) =>
                    (biddingDeadlines[a.id]?.remainMinutes ?? 0) -
                    (biddingDeadlines[b.id]?.remainMinutes ?? 0),
                )
                .map((asset) => {
                  const round = asset.status === "bidding2" ? 2 : 1;
                  const list = bidsOf(asset.id, round);
                  const top = list[0];
                  const deadline = biddingDeadlines[asset.id];
                  const gap = top
                    ? Math.round(((top.unitPrice - asset.autoPrice) / asset.autoPrice) * 1000) / 10
                    : 0;
                  const urgent = (deadline?.remainMinutes ?? 9999) < 720;
                  return (
                    <Row key={asset.id} onClick={() => onNavigate("bidding", asset.id)}>
                      <Cell>
                        <span className="flex items-center gap-3">
                          <AssetThumb
                            category={asset.category}
                            photo={asset.photo}
                            name={asset.name}
                            size={36}
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-[13.5px] font-medium text-[var(--af-ink)]">
                              {asset.name}
                            </span>
                            <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                              {asset.code} | {round}차 | {asset.quantity}대 | {list.length}개사
                            </span>
                          </span>
                        </span>
                      </Cell>
                      <Cell align="right" strong nowrap>
                        <span className="af-mono">{top ? won(top.unitPrice) : "-"}</span>
                        <span className="af-mono block text-[11.5px] font-normal text-[var(--af-mute)]">
                          총 {top ? manwon(top.unitPrice * asset.quantity) : "-"}
                        </span>
                      </Cell>
                      <Cell align="right" nowrap>
                        <span
                          className={
                            gap >= 0
                              ? "af-mono text-[var(--af-link-deep)]"
                              : "af-mono text-[var(--af-error-deep)]"
                          }
                        >
                          {gap > 0 ? "+" : ""}
                          {gap}%
                        </span>
                      </Cell>
                      <Cell align="right" nowrap>
                        <span className="inline-flex items-center gap-1.5">
                          {urgent && (
                            <Clock size={12} weight="bold" className="text-[var(--af-warn-deep)]" />
                          )}
                          <span
                            className={`af-mono ${urgent ? "font-medium text-[var(--af-warn-deep)]" : ""}`}
                          >
                            {remainLabel(deadline?.remainMinutes ?? 0)}
                          </span>
                        </span>
                      </Cell>
                    </Row>
                  );
                })}
            </Table>
          </Card>

          <Card>
            <CardHead
              title="최근 등록 자산"
              desc="등록 직후 자동 시세가 산출되고, 검수를 신청하면 최종 입찰로 넘어갑니다."
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate("assetDetail")}>
                  자산 상세
                  <ArrowRight size={12} />
                </Button>
              }
            />
            <Table
              head={["자산", "수량", "등급", "자동 시세 (대당)", "상태"]}
              align={["left", "right", "center", "right", "left"]}
            >
              {recent.map((asset) => (
                <Row key={asset.id} onClick={() => onNavigate("assetDetail", asset.id)}>
                  <Cell>
                    <span className="flex items-center gap-3">
                      <AssetThumb
                        category={asset.category}
                        photo={asset.photo}
                        name={asset.name}
                        size={32}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium text-[var(--af-ink)]">
                          {asset.name}
                        </span>
                        <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                          {CATEGORY_LABEL[asset.category]} | {asset.maker} {asset.model} |{" "}
                          {asset.registeredAt} 등록
                        </span>
                      </span>
                    </span>
                  </Cell>
                  <Cell align="right" mono nowrap>
                    {asset.quantity}대
                  </Cell>
                  <Cell align="center" mono strong>
                    {asset.grade}
                  </Cell>
                  <Cell align="right" mono strong nowrap>
                    {won(asset.autoPrice)}
                  </Cell>
                  <Cell>
                    <Badge tone={STATUS_TONE[asset.status]} dot={asset.status === "bidding1"}>
                      {STATUS_LABEL[asset.status]}
                    </Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead
              title="거래 진행 타임라인"
              desc={`${activeDeal.code} | ${activeDeal.assetName}`}
              action={
                <Button variant="ghost" size="sm" onClick={() => onNavigate("deals")}>
                  거래 관리
                </Button>
              }
            />
            <div className="mb-4 flex items-center justify-between rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] px-3.5 py-3">
              <div>
                <p className="text-[13px] text-[var(--af-mute)]">{activeDeal.reseller}</p>
                <p className="mt-0.5 text-[16px] font-semibold tracking-[-0.02em] text-[var(--af-ink)]">
                  {won(activeDeal.amount)}
                </p>
              </div>
              <Badge tone={STAGE_TONE[activeDeal.stage]}>{STAGE_LABEL[activeDeal.stage]}</Badge>
            </div>
            <Timeline steps={activeDeal.timeline} />
          </Card>

          <Card>
            <CardHead title="월별 매각 금액" desc="최근 6개월, 정산 완료 기준" />
            <BarChart
              data={monthlyTrade.map((m, i) => ({
                label: m.month,
                value: m.amount,
                emphasis: i === monthlyTrade.length - 1,
              }))}
              format={manwon}
            />
          </Card>

          <Card padded={false}>
            <div className="flex items-center justify-between border-b border-[var(--af-hairline)] px-5 py-4">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-[var(--af-ink)]">
                <Bell size={14} weight="bold" />
                알림 / 공지
              </h2>
              <Badge tone="info">{notices.filter((n) => n.unread).length}건 새 알림</Badge>
            </div>
            <ul>
              {notices.map((notice) => {
                const Icon = NOTICE_ICON[notice.kind];
                return (
                  <li
                    key={notice.id}
                    className="flex gap-3 border-b border-[var(--af-hairline)] px-5 py-3.5 last:border-b-0"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] text-[var(--af-body)]">
                      <Icon size={13} weight="bold" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium leading-5 text-[var(--af-ink)]">
                        {notice.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-[18px] text-[var(--af-body)]">
                        {notice.detail}
                      </p>
                      <p className="mt-1 af-mono text-[11.5px] text-[var(--af-mute)]">{notice.at}</p>
                    </div>
                    {notice.unread && (
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--af-link)]" />
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
