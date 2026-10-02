"use client";

import { useState } from "react";
import {
  ArrowsLeftRight,
  Circle,
  Clock,
  Eye,
  Gavel,
  Prohibit,
  SealCheck,
  Timer,
  Truck,
} from "@phosphor-icons/react";
import {
  AssetThumb,
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  PageHead,
  Row,
  Stat,
  Table,
} from "@/projects/b2b/assetflow/components/ui";
import { assets, biddingDeadlines, bidsOf } from "@/projects/b2b/assetflow/lib/mock-data";
import { remainLabel, won, type Navigate } from "@/projects/b2b/assetflow/lib/navigation";
import type { Bid } from "@/projects/b2b/assetflow/lib/types";

const GRADE_TONE = {
  플래티넘: "ink",
  골드: "warn",
  실버: "neutral",
} as const;

/** 실시간 입찰 현황 피드. mock 이벤트 로그. */
const FEED: Record<string, { at: string; who: string; text: string; kind: "up" | "join" | "out" }[]> = {
  a1: [
    { at: "14:22", who: "D리커머스", text: "448,000원 제시, 최고가 갱신", kind: "up" },
    { at: "11:05", who: "E테크사이클", text: "436,000원 제시", kind: "up" },
    { at: "09:48", who: "K테크바이", text: "입찰 참여 취소", kind: "out" },
    { at: "어제 17:48", who: "F아이티리퍼브", text: "421,000원 제시", kind: "up" },
    { at: "어제 09:31", who: "G디바이스", text: "405,000원 제시", kind: "up" },
    { at: "07. 25 16:12", who: "H리유즈", text: "392,000원 제시, 입찰 시작", kind: "join" },
  ],
  a7: [
    { at: "10:40", who: "D리커머스", text: "796,000원 제시, 최고가 갱신", kind: "up" },
    { at: "어제 19:02", who: "J글로벌트레이드", text: "781,000원 제시", kind: "up" },
    { at: "어제 13:55", who: "E테크사이클", text: "768,000원 제시", kind: "up" },
    { at: "07. 25 15:20", who: "F아이티리퍼브", text: "754,000원 제시, 입찰 시작", kind: "join" },
  ],
  a10: [
    { at: "09:14", who: "F아이티리퍼브", text: "103,000원 제시, 최고가 갱신", kind: "up" },
    { at: "어제 14:36", who: "G디바이스", text: "98,000원 제시", kind: "up" },
    { at: "07. 25 11:48", who: "H리유즈", text: "92,000원 제시, 입찰 시작", kind: "join" },
  ],
};

export function BiddingScreen({ assetId, onNavigate }: { assetId?: string; onNavigate: Navigate }) {
  const open = assets.filter((a) => a.status === "bidding1");
  const [selected, setSelected] = useState(
    assetId && open.some((a) => a.id === assetId) ? assetId : open[0].id,
  );
  const [compare, setCompare] = useState<Bid | null>(null);

  const asset = open.find((a) => a.id === selected) ?? open[0];
  const list = bidsOf(asset.id, 1);
  const deadline = biddingDeadlines[asset.id];
  const top = list[0];
  const gap = top ? Math.round(((top.unitPrice - asset.autoPrice) / asset.autoPrice) * 1000) / 10 : 0;
  const spread = list.length > 1 ? list[0].unitPrice - list[list.length - 1].unitPrice : 0;
  const urgent = deadline.remainMinutes < 720;
  const feed = FEED[asset.id] ?? [];

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="1차 입찰"
        title="리셀러 견적 비교"
        desc="마감 전까지 리셀러가 자유롭게 가격을 올릴 수 있습니다. 마감 후 원하는 리셀러를 직접 선정하거나, 검수를 거쳐 최종 입찰로 넘길 수 있습니다."
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => onNavigate("assetDetail", asset.id)}>
              자산 상세
            </Button>
            <Button size="md" onClick={() => onNavigate("inspection", asset.id)}>
              검수 후 최종 입찰
            </Button>
          </>
        }
      />

      {/* 진행 중 자산 선택 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {open.map((item) => {
          const itemTop = bidsOf(item.id, 1)[0];
          const itemDeadline = biddingDeadlines[item.id];
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-[8px] border p-4 text-left transition-colors ${
                active
                  ? "border-[var(--af-primary)] bg-[var(--af-soft)]"
                  : "border-[var(--af-hairline)] bg-[var(--af-canvas)] hover:bg-[var(--af-soft)]"
              }`}
            >
              <AssetThumb
                category={item.category}
                photo={item.photo}
                name={item.name}
                size={40}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-[var(--af-ink)]">
                  {item.name}
                </span>
                <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                  {item.quantity}대 | {bidsOf(item.id, 1).length}개사 참여
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="af-mono block text-[13px] font-medium text-[var(--af-ink)]">
                  {itemTop ? won(itemTop.unitPrice) : "-"}
                </span>
                <span
                  className={`af-mono block text-[11.5px] ${
                    itemDeadline.remainMinutes < 720
                      ? "font-medium text-[var(--af-warn-deep)]"
                      : "text-[var(--af-mute)]"
                  }`}
                >
                  {remainLabel(itemDeadline.remainMinutes)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 마감 헤더 */}
      <Card padded={false} className="overflow-hidden">
        <div
          className={`flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 ${
            urgent
              ? "border-[var(--af-warn-soft)] bg-[var(--af-warn-soft)]"
              : "border-[var(--af-hairline)] bg-[var(--af-soft)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                urgent
                  ? "bg-[var(--af-warn-deep)] text-white"
                  : "bg-[var(--af-primary)] text-[var(--af-on-primary)]"
              }`}
            >
              <Timer size={16} weight="bold" />
            </span>
            <div>
              <p
                className={`text-[13px] ${
                  urgent ? "text-[var(--af-warn-deep)]" : "text-[var(--af-mute)]"
                }`}
              >
                입찰 마감까지
              </p>
              <p
                className={`af-mono text-[19px] font-semibold leading-7 tracking-[-0.02em] ${
                  urgent ? "text-[var(--af-warn-deep)]" : "text-[var(--af-ink)]"
                }`}
              >
                {remainLabel(deadline.remainMinutes)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
              <Clock size={13} weight="bold" />
              마감 <span className="af-mono">{deadline.closesAt}</span>
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
              <Eye size={13} weight="bold" />
              관심 <span className="af-mono">{deadline.watchers}개사</span>
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[var(--af-body)]">
              <Gavel size={13} weight="bold" />
              참여 <span className="af-mono">{list.length}개사</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[var(--af-hairline)] sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">현재 최고가 (대당)</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
              {top ? won(top.unitPrice) : "-"}
            </p>
            <p className="mt-1.5 text-[12px] text-[var(--af-body)]">{top?.reseller}</p>
          </div>
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">예상 총액</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
              {top ? won(top.unitPrice * asset.quantity) : "-"}
            </p>
            <p className="mt-1.5 af-mono text-[12px] text-[var(--af-body)]">{asset.quantity}대 기준</p>
          </div>
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">자동 시세 대비</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-link-deep)]">
              +{gap}%
            </p>
            <p className="mt-1.5 af-mono text-[12px] text-[var(--af-body)]">
              자동 시세 {won(asset.autoPrice)}
            </p>
          </div>
          <div className="bg-[var(--af-canvas)] p-5">
            <p className="text-[13px] text-[var(--af-mute)]">최고/최저 차이</p>
            <p className="mt-2 af-mono text-[24px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
              {won(spread)}
            </p>
            <p className="mt-1.5 text-[12px] text-[var(--af-body)]">대당 기준</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
        <Card>
          <CardHead
            title="리셀러 견적 비교"
            desc="가격만이 아니라 회수 소요일, 파기 증명서 발급 여부, 조건까지 함께 비교하세요."
            action={<Badge tone="info" dot>진행 중</Badge>}
          />
          {/* 파기 증명은 리셀러명 옆 아이콘으로, 총액은 대당 가격 보조 줄로 합쳤다.
              열을 더 늘리면 선정 버튼이 잘려 나간다. */}
          <Table
            head={["순위", "리셀러", "대당 가격", "시세 대비", "회수", ""]}
            align={["center", "left", "right", "right", "right", "right"]}
          >
            {list.map((bid, index) => {
              const bidGap =
                Math.round(((bid.unitPrice - asset.autoPrice) / asset.autoPrice) * 1000) / 10;
              return (
                <Row key={bid.id} active={index === 0}>
                  <Cell align="center" mono strong={index === 0}>
                    {index + 1}
                  </Cell>
                  <Cell>
                    <span className="flex items-center gap-2">
                      <span className="text-[13.5px] font-medium text-[var(--af-ink)]">
                        {bid.reseller}
                      </span>
                      <Badge tone={GRADE_TONE[bid.resellerGrade]}>{bid.resellerGrade}</Badge>
                      {bid.certifiedWipe ? (
                        <SealCheck
                          size={14}
                          weight="fill"
                          className="shrink-0 text-[var(--af-link)]"
                          aria-label="데이터 파기 증명서 발급"
                        />
                      ) : (
                        <Prohibit
                          size={13}
                          className="shrink-0 text-[var(--af-mute)]"
                          aria-label="데이터 파기 증명서 미발급"
                        />
                      )}
                    </span>
                    <span className="af-mono mt-0.5 block text-[11.5px] text-[var(--af-mute)]">
                      {bid.submittedAt} 제시
                    </span>
                  </Cell>
                  <Cell align="right" strong nowrap>
                    <span className="af-mono">{won(bid.unitPrice)}</span>
                    <span className="af-mono block text-[11.5px] font-normal text-[var(--af-mute)]">
                      총 {won(bid.unitPrice * asset.quantity)}
                    </span>
                  </Cell>
                  <Cell align="right" nowrap>
                    <span
                      className={`af-mono ${
                        bidGap >= 0 ? "text-[var(--af-link-deep)]" : "text-[var(--af-error-deep)]"
                      }`}
                    >
                      {bidGap > 0 ? "+" : ""}
                      {bidGap}%
                    </span>
                  </Cell>
                  <Cell align="right" mono nowrap>
                    {bid.pickupDays}일
                  </Cell>
                  <Cell align="right">
                    <span className="flex justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => setCompare(bid)}>
                        조건
                      </Button>
                      <Button
                        variant={index === 0 ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => onNavigate("deals")}
                      >
                        선정
                      </Button>
                    </span>
                  </Cell>
                </Row>
              );
            })}
          </Table>

          <div className="mt-4 flex items-start gap-2 rounded-[6px] bg-[var(--af-soft)] px-3.5 py-3">
            <ArrowsLeftRight size={14} className="mt-px shrink-0 text-[var(--af-mute)]" />
            <p className="text-[12px] leading-[18px] text-[var(--af-body)]">
              최고가와 2위의 차이는 대당 {won(list[0].unitPrice - (list[1]?.unitPrice ?? list[0].unitPrice))}
              입니다. 회수 소요일이 짧고 파기 증명서를 발급하는 리셀러를 고르면 내부 절차가 줄어듭니다.
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead title="실시간 입찰 현황" desc="가격 제시와 철회가 발생한 순서" />
            <ol className="relative space-y-4">
              {feed.map((event, index) => (
                <li key={`${event.at}-${event.who}`} className="flex gap-3">
                  <span className="relative flex flex-col items-center">
                    <Circle
                      size={9}
                      weight="fill"
                      className={
                        event.kind === "out"
                          ? "text-[var(--af-error)]"
                          : index === 0
                            ? "text-[var(--af-link)]"
                            : "text-[var(--af-hairline-strong)]"
                      }
                    />
                    {index < feed.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-[var(--af-hairline)]" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="text-[13.5px] font-medium text-[var(--af-ink)]">{event.who}</p>
                      <p className="af-mono text-[11.5px] text-[var(--af-mute)]">{event.at}</p>
                    </div>
                    <p
                      className={`mt-0.5 text-[12.5px] leading-[18px] ${
                        event.kind === "out"
                          ? "text-[var(--af-error-deep)]"
                          : "text-[var(--af-body)]"
                      }`}
                    >
                      {event.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Stat
              label="평균 제시가 (대당)"
              value={won(Math.round(list.reduce((s, b) => s + b.unitPrice, 0) / list.length))}
              delta={`${list.length}개사`}
              note="참여 리셀러 평균"
            />
            <Stat
              label="평균 회수 소요"
              value={`${Math.round((list.reduce((s, b) => s + b.pickupDays, 0) / list.length) * 10) / 10}일`}
              delta={`최단 ${Math.min(...list.map((b) => b.pickupDays))}일`}
              note="확정 후 반출까지"
            />
          </div>
        </div>
      </div>

      <Drawer
        open={compare !== null}
        title={compare ? `${compare.reseller} 입찰 조건` : ""}
        subtitle={compare ? `${asset.code} | ${asset.name}` : undefined}
        onClose={() => setCompare(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setCompare(null)}>
              닫기
            </Button>
            <Button
              full
              onClick={() => {
                setCompare(null);
                onNavigate("deals");
              }}
            >
              이 리셀러로 확정
            </Button>
          </div>
        }
      >
        {compare && (
          <div className="space-y-5">
            <div className="rounded-[8px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-5">
              <p className="text-[13px] text-[var(--af-mute)]">제시 총액</p>
              <p className="mt-1.5 af-mono text-[26px] font-semibold leading-8 tracking-[-0.03em] text-[var(--af-ink)]">
                {won(compare.unitPrice * asset.quantity)}
              </p>
              <p className="af-mono mt-1 text-[12.5px] text-[var(--af-body)]">
                대당 {won(compare.unitPrice)} × {asset.quantity}대
              </p>
            </div>

            <DefList
              columns={1}
              items={[
                { label: "리셀러 등급", value: compare.resellerGrade },
                { label: "제시 시각", value: <span className="af-mono">{compare.submittedAt}</span> },
                {
                  label: "회수 소요",
                  value: (
                    <span className="flex items-center justify-end gap-1.5">
                      <Truck size={13} />
                      확정 후 {compare.pickupDays}일
                    </span>
                  ),
                },
                {
                  label: "데이터 파기 증명서",
                  value: compare.certifiedWipe ? "발급" : "미발급",
                },
                {
                  label: "자동 시세 대비",
                  value: (
                    <span className="af-mono text-[var(--af-link-deep)]">
                      +{Math.round(((compare.unitPrice - asset.autoPrice) / asset.autoPrice) * 1000) / 10}%
                    </span>
                  ),
                },
                {
                  label: "순위",
                  value: `${list.findIndex((b) => b.id === compare.id) + 1}위 / ${list.length}개사`,
                },
              ]}
            />

            <div>
              <p className="text-[13px] font-medium text-[var(--af-ink)]">제시 조건</p>
              <p className="mt-1.5 rounded-[6px] border border-[var(--af-hairline)] px-3.5 py-3 text-[13px] leading-6 text-[var(--af-body)]">
                {compare.note || "별도 제시 조건 없음"}
              </p>
            </div>

            {!compare.certifiedWipe && (
              <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-warn-soft)] px-3.5 py-3">
                <Prohibit size={14} className="mt-px shrink-0 text-[var(--af-warn-deep)]" />
                <p className="text-[12px] leading-[18px] text-[var(--af-warn-deep)]">
                  이 리셀러는 데이터 파기 증명서를 발급하지 않습니다. 저장장치가 포함된 자산이라면
                  내부 파기 절차를 별도로 진행해야 합니다.
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
