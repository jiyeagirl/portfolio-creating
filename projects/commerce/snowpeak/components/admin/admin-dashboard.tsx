"use client";

import { Plus } from "@phosphor-icons/react";
import {
  ADMIN_INVENTORY,
  ADMIN_RESERVATIONS,
  NOTICES,
  formatWon,
} from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItemKind, NoticeTag, ReservationStatus } from "@/projects/commerce/snowpeak/lib/types";
import type { Tone } from "@/projects/commerce/snowpeak/lib/navigation";
import {
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  Meter,
  PageHead,
  Row,
  Stat,
  Table,
} from "@/projects/commerce/snowpeak/components/admin/admin-ui";

/** 이 목업에서 "오늘"로 취급하는 기준일. admin-shell.tsx 헤더의 하드코딩 날짜와 동일하게 맞춘다. */
const TODAY = "2023-10-15";

const KIND_LABEL: Record<CartItemKind, string> = {
  room: "객실",
  lift: "리프트권",
  season: "시즌권",
  rental: "렌탈",
  package: "패키지",
};
const KIND_ORDER: CartItemKind[] = ["room", "lift", "season", "rental", "package"];

const STATUS_TONE: Record<ReservationStatus, Tone> = {
  예약대기: "warn",
  확정: "info",
  체크인: "success",
  체크아웃: "neutral",
  취소: "danger",
  환불완료: "neutral",
};

const NOTICE_TONE: Record<NoticeTag, Tone> = {
  이벤트: "info",
  공지: "neutral",
  점검: "warn",
};

export function AdminDashboard() {
  const todayCount = ADMIN_RESERVATIONS.filter((r) => r.createdAt === TODAY).length;
  const pendingCount = ADMIN_RESERVATIONS.filter((r) => r.status === "예약대기").length;
  const cancelRefundCount = ADMIN_RESERVATIONS.filter(
    (r) => r.status === "취소" || r.status === "환불완료",
  ).length;
  const validAmount = ADMIN_RESERVATIONS.filter(
    (r) => r.status !== "취소" && r.status !== "환불완료",
  ).reduce((sum, r) => sum + r.amount, 0);

  const roomRows = ADMIN_INVENTORY.filter((i) => i.category === "객실");
  const roomTotal = roomRows.reduce((sum, i) => sum + i.totalStock, 0);
  const roomAvailable = roomRows.reduce((sum, i) => sum + i.available, 0);
  const roomUsedRate = Math.round(((roomTotal - roomAvailable) / roomTotal) * 100);

  const gearRows = ADMIN_INVENTORY.filter((i) => i.category === "장비");
  const gearTotal = gearRows.reduce((sum, i) => sum + i.totalStock, 0);
  const gearAvailable = gearRows.reduce((sum, i) => sum + i.available, 0);
  const gearUsedRate = Math.round(((gearTotal - gearAvailable) / gearTotal) * 100);

  const revenueByKind = KIND_ORDER.map((kind) => ({
    kind,
    amount: ADMIN_RESERVATIONS.filter(
      (r) => r.kind === kind && r.status !== "취소" && r.status !== "환불완료",
    ).reduce((sum, r) => sum + r.amount, 0),
  }));
  const topKind = revenueByKind.reduce(
    (max, cur) => (cur.amount > max.amount ? cur : max),
    revenueByKind[0],
  );
  const chartData = revenueByKind.map((d) => ({
    label: KIND_LABEL[d.kind],
    value: d.amount,
    emphasis: d.kind === topKind.kind,
  }));

  const recent = [...ADMIN_RESERVATIONS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <>
      <PageHead
        eyebrow="대시보드"
        title="리조트 운영 현황"
        desc="오늘 예약, 객실/장비 가동률, 상품 유형별 매출 추이와 실시간 예약을 한 화면에서 확인합니다."
      />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="오늘 예약" value={`${todayCount}건`} note={TODAY} />
        <Stat label="예약대기" value={`${pendingCount}건`} note="승인 대기 중" />
        <Stat
          label="유효 예약 매출"
          value={`${formatWon(validAmount)}원`}
          note="취소/환불 제외 누적"
          emphasis
        />
        <Stat label="취소/환불" value={`${cancelRefundCount}건`} note="누적 기준" />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHead title="매출 통계" desc="상품 유형별 누적 매출, 취소/환불 제외" />
            <BarChart data={chartData} format={(v) => `${formatWon(v)}원`} />
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardHead title="객실 이용률" desc={`가용 ${roomAvailable}실 / 전체 ${roomTotal}실`} />
              <p className="sp-num text-[28px] font-semibold leading-8 tracking-[-0.03em] text-[var(--sp-ink)]">
                {roomUsedRate}%
              </p>
              <div className="mt-3">
                <Meter value={roomUsedRate} tone={roomUsedRate >= 70 ? "warn" : "info"} />
              </div>
            </Card>
            <Card>
              <CardHead title="장비 대여 현황" desc={`가용 ${gearAvailable}개 / 전체 ${gearTotal}개`} />
              <p className="sp-num text-[28px] font-semibold leading-8 tracking-[-0.03em] text-[var(--sp-ink)]">
                {gearUsedRate}%
              </p>
              <div className="mt-3">
                <Meter value={gearUsedRate} tone={gearUsedRate >= 70 ? "warn" : "info"} />
              </div>
            </Card>
          </div>

          <Card>
            <CardHead title="실시간 예약 모니터링" desc="가장 최근에 접수된 예약 순" />
            <Table head={["예약자", "상품", "금액", "상태"]} align={["left", "left", "right", "left"]} minWidth={480}>
              {recent.map((r) => (
                <Row key={r.id}>
                  <Cell strong nowrap>
                    {r.guestName}
                  </Cell>
                  <Cell muted>{r.productName}</Cell>
                  <Cell align="right" mono nowrap>
                    {formatWon(r.amount)}원
                  </Cell>
                  <Cell>
                    <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead
              title="공지사항 관리"
              desc="사용자 앱에 노출 중인 공지"
              action={
                <Button variant="secondary" size="sm" icon={<Plus size={13} />}>
                  새 공지 작성
                </Button>
              }
            />
            <ul>
              {NOTICES.map((n) => (
                <li key={n.id} className="border-b border-[var(--sp-border)] py-4 first:pt-0 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={NOTICE_TONE[n.tag]}>{n.tag}</Badge>
                    <span className="sp-num text-[12px] text-[var(--sp-mute)]">{n.date}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] font-medium leading-5 text-[var(--sp-ink)]">{n.title}</p>
                  <p className="mt-1 text-[12.5px] leading-5 text-[var(--sp-body)]">{n.body}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
