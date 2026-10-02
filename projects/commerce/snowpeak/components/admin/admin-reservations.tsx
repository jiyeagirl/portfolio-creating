"use client";

import { useState } from "react";
import {
  ADMIN_RESERVATIONS,
  formatWon,
} from "@/projects/commerce/snowpeak/lib/mock-data";
import type {
  AdminReservationRow,
  CartItemKind,
  ReservationStatus,
} from "@/projects/commerce/snowpeak/lib/types";
import type { Tone } from "@/projects/commerce/snowpeak/lib/navigation";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Table,
  Tabs,
  Timeline,
} from "@/projects/commerce/snowpeak/components/admin/admin-ui";

const PER_PAGE = 10;

const STATUS_LIST: ReservationStatus[] = ["예약대기", "확정", "체크인", "체크아웃", "취소", "환불완료"];

const STATUS_TONE: Record<ReservationStatus, Tone> = {
  예약대기: "warn",
  확정: "info",
  체크인: "success",
  체크아웃: "neutral",
  취소: "danger",
  환불완료: "neutral",
};

const KIND_LABEL: Record<CartItemKind, string> = {
  room: "객실",
  lift: "리프트권",
  season: "시즌권",
  rental: "렌탈",
  package: "패키지",
};
const KIND_ORDER: CartItemKind[] = ["room", "lift", "season", "rental", "package"];
const KIND_OPTIONS = ["전체", ...KIND_ORDER.map((k) => KIND_LABEL[k])];

type StatusFilter = "all" | ReservationStatus;

const NORMAL_STAGES: { key: ReservationStatus; label: string; at: (r: AdminReservationRow) => string }[] = [
  { key: "예약대기", label: "예약 접수", at: (r) => r.createdAt },
  { key: "확정", label: "예약 확정", at: (r) => r.createdAt },
  { key: "체크인", label: "체크인", at: (r) => r.checkIn },
  { key: "체크아웃", label: "체크아웃", at: (r) => r.checkOut },
];

function buildTimeline(r: AdminReservationRow): { label: string; at: string; done: boolean; note?: string }[] {
  if (r.status === "취소") {
    return [
      { label: "예약 접수", at: r.createdAt, done: true },
      { label: "예약 취소", at: "-", done: true, note: "관리자 처리로 예약이 취소되었습니다." },
    ];
  }
  if (r.status === "환불완료") {
    return [
      { label: "예약 접수", at: r.createdAt, done: true },
      { label: "예약 확정", at: r.createdAt, done: true },
      { label: "환불 완료", at: "-", done: true, note: "결제 금액이 환불 처리되었습니다." },
    ];
  }
  const currentIndex = NORMAL_STAGES.findIndex((s) => s.key === r.status);
  return NORMAL_STAGES.map((stage, index) => ({
    label: stage.label,
    at: index <= currentIndex ? stage.at(r) : "예정",
    done: index <= currentIndex,
  }));
}

export function AdminReservations() {
  const [reservations, setReservations] = useState<AdminReservationRow[]>(ADMIN_RESERVATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [kindLabel, setKindLabel] = useState("전체");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const kindFilter = KIND_ORDER.find((k) => KIND_LABEL[k] === kindLabel) ?? null;

  const filtered = reservations.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 || r.guestName.toLowerCase().includes(q) || r.confirmationNo.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesKind = kindFilter === null || r.kind === kindFilter;
    return matchesSearch && matchesStatus && matchesKind;
  });

  const pageStart = (page - 1) * PER_PAGE;
  const pageRows = filtered.slice(pageStart, pageStart + PER_PAGE);
  const openReservation = reservations.find((r) => r.id === openId) ?? null;

  const changeSearch = (next: string) => {
    setSearch(next);
    setPage(1);
  };

  const changeStatusFilter = (next: StatusFilter) => {
    setStatusFilter(next);
    setPage(1);
  };

  const changeKind = (next: string) => {
    setKindLabel(next);
    setPage(1);
  };

  const updateStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <>
      <PageHead
        eyebrow="예약 관리"
        title="예약 목록 및 처리"
        desc="전 상품군의 예약을 검색하고, 상세 정보 확인부터 승인/취소/환불 처리까지 한 화면에서 진행합니다."
      />

      <Card className="mt-6">
        <CardHead title="예약 목록" desc={`전체 ${reservations.length}건 중 ${filtered.length}건 표시`} />

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchInput value={search} onChange={changeSearch} placeholder="예약자명 또는 예약번호 검색" />
          </div>
          <div className="lg:w-[160px]">
            <Select value={kindLabel} options={KIND_OPTIONS} onChange={changeKind} />
          </div>
        </div>

        <Tabs<StatusFilter>
          value={statusFilter}
          onChange={changeStatusFilter}
          items={[
            { key: "all", label: "전체", count: reservations.length },
            ...STATUS_LIST.map((status) => ({
              key: status,
              label: status,
              count: reservations.filter((r) => r.status === status).length,
            })),
          ]}
        />

        <div className="mt-4">
          <Table
            head={["예약번호", "예약자", "상품", "체크인~체크아웃", "금액", "상태"]}
            align={["left", "left", "left", "left", "right", "left"]}
            minWidth={680}
          >
            {pageRows.map((r) => (
              <Row key={r.id} onClick={() => setOpenId(r.id)} active={r.id === openId}>
                <Cell mono nowrap strong>
                  {r.confirmationNo}
                </Cell>
                <Cell nowrap>{r.guestName}</Cell>
                <Cell>{r.productName}</Cell>
                <Cell mono nowrap muted>
                  {r.checkIn} ~ {r.checkOut}
                </Cell>
                <Cell align="right" mono nowrap strong>
                  {formatWon(r.amount)}원
                </Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </Cell>
              </Row>
            ))}
          </Table>

          {pageRows.length === 0 && (
            <p className="py-12 text-center text-[13.5px] text-[var(--sp-mute)]">
              조건에 맞는 예약이 없습니다. 검색어나 필터를 확인해 주세요.
            </p>
          )}

          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <Drawer
        open={openReservation !== null}
        title={openReservation?.confirmationNo ?? ""}
        subtitle={openReservation?.productName}
        onClose={() => setOpenId(null)}
        footer={
          openReservation && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                full
                disabled={openReservation.status !== "예약대기"}
                onClick={() => updateStatus(openReservation.id, "확정")}
              >
                예약 승인
              </Button>
              <Button
                variant="danger"
                size="md"
                full
                disabled={openReservation.status === "취소" || openReservation.status === "환불완료"}
                onClick={() => updateStatus(openReservation.id, "취소")}
              >
                예약 취소
              </Button>
              <Button
                variant="secondary"
                size="md"
                full
                disabled={openReservation.status !== "취소"}
                onClick={() => updateStatus(openReservation.id, "환불완료")}
              >
                환불 처리
              </Button>
            </div>
          )
        }
      >
        {openReservation && (
          <>
            <DefList
              columns={2}
              items={[
                { label: "예약번호", value: <span className="sp-num">{openReservation.confirmationNo}</span> },
                { label: "예약자", value: `${openReservation.guestName} | ${openReservation.guestPhone}` },
                { label: "상품 유형", value: KIND_LABEL[openReservation.kind] },
                { label: "상품명", value: openReservation.productName },
                { label: "체크인", value: <span className="sp-num">{openReservation.checkIn}</span> },
                { label: "체크아웃", value: <span className="sp-num">{openReservation.checkOut}</span> },
                { label: "결제 금액", value: <span className="sp-num">{formatWon(openReservation.amount)}원</span> },
                { label: "예약 채널", value: openReservation.channel },
                { label: "접수일", value: <span className="sp-num">{openReservation.createdAt}</span> },
              ]}
            />

            <div className="mt-6">
              <p className="mb-2 text-[13px] font-medium text-[var(--sp-ink)]">예약 상태 변경</p>
              <Select
                value={openReservation.status}
                options={STATUS_LIST}
                onChange={(next) => updateStatus(openReservation.id, next as ReservationStatus)}
              />
            </div>

            <div className="mt-6 border-t border-[var(--sp-border)] pt-6">
              <p className="mb-3 text-[13px] font-medium text-[var(--sp-ink)]">예약 이력</p>
              <Timeline steps={buildTimeline(openReservation)} />
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
