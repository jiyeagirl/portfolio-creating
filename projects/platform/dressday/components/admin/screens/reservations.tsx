"use client";

import { useState } from "react";
import { CaretDown, DownloadSimple, FunnelSimple, MagnifyingGlass, Phone } from "@phosphor-icons/react";
import {
  RESERVATIONS,
  RES_STATUSES,
  RES_TONE,
  JOB_TONE,
  countBy,
  day,
  getCustomer,
  getReservation,
  getRider,
  short,
  type Leg,
  type ResStatus,
  type Reservation,
} from "@/projects/platform/dressday/lib/admin-data";
import { getProduct, num } from "@/projects/platform/dressday/lib/catalog";
import {
  Badge,
  Button,
  Drawer,
  InfoBlock,
  PageHead,
  Pagination,
  ProductThumb,
  SelectInput,
  TableWrap,
  Tabs,
  Td,
  Th,
  rowClass,
} from "@/projects/platform/dressday/components/admin/admin-ui";

type TabKey = "전체" | ResStatus;
const PAGE = 12;

function legLine(l: Leg) {
  const rider = getRider(l.riderId);
  if (!l.jobId) return "배차 취소";
  if (!rider) return `${l.jobId} | 라이더 미배정`;
  const at = l.doneAt ? `${l.doneAt} 완료` : l.departedAt ? `${l.departedAt} 출발` : l.assignedAt ? `${l.assignedAt} 배정` : "";
  return `${l.jobId} | ${rider.name}${at ? ` | ${at}` : ""}`;
}

function ReservationDrawer({ r, onClose }: { r: Reservation; onClose: () => void }) {
  const c = getCustomer(r.customerId);
  const p = getProduct(r.productId);
  const [next, setNext] = useState<ResStatus>(r.status);
  const steps: [string, string | undefined][] = [
    ["예약 확정", `${short(r.createdDate)} ${r.createdTime}`],
    ["검수, 포장", r.packedAt],
    ["라이더 배정", r.delivery.assignedAt],
    ["라이더 픽업", r.delivery.departedAt],
    ["배송 완료", r.delivery.doneAt],
  ];

  return (
    <Drawer
      open
      onClose={onClose}
      width={560}
      title={
        <span className="flex items-center gap-3">
          <span className="dd-code">{r.id}</span>
          <Badge tone={RES_TONE[r.status]} dot={r.status === "배송 중"}>
            {r.status}
          </Badge>
        </span>
      }
      footer={
        <>
          <Button variant="danger">예약 취소</Button>
          <Button variant="ink">변경 저장</Button>
        </>
      }
    >
      <InfoBlock
        title="고객 정보"
        aside={
          <Button size="sm" variant="ghost" icon={<Phone size={14} />}>
            연락
          </Button>
        }
        rows={[
          ["이름", c?.name],
          ["연락처", <span key="p" className="dd-num">{c?.phone}</span>],
          ["누적 대여 (회)", <span key="n" className="dd-num">{c?.rentals}</span>],
        ]}
      />

      <section className="border-b border-[var(--dd-hairline-soft)] py-5">
        <h3 className="text-[14px] font-semibold leading-5 text-[var(--dd-ink)]">상품</h3>
        <div className="mt-3 flex items-center gap-4">
          <ProductThumb product={p} size={64} />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-6 text-[var(--dd-ink)]">{p.name}</p>
            <p className="text-[13px] leading-5 text-[var(--dd-muted)]">
              {p.label} | {p.category} | {p.color}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[13px] leading-5 text-[var(--dd-body)]">
              <span className="rounded-full bg-[var(--dd-strong)] px-2 py-0.5 text-[12px] font-semibold text-[var(--dd-ink)]">{r.size}</span>
              <span className="dd-code">{r.unit}</span>
            </p>
          </div>
        </div>
      </section>

      <InfoBlock
        title="이용 일정"
        rows={[
          ["수령", <span key="a" className="dd-num">{day(r.start)} {r.delivery.window}</span>],
          ["반납 (회수)", <span key="b" className="dd-num">{day(r.end)} {r.pickup.window}</span>],
          ["대여 기간", <span key="c" className="dd-num">{r.days}일</span>],
        ]}
      />

      <InfoBlock
        title="배송 정보"
        rows={[
          ["주소", `서울 ${r.gu} ${r.address}`],
          [
            "배송",
            <span key="d" className="flex flex-wrap items-center gap-2">
              <span className="dd-num">{legLine(r.delivery)}</span>
              {r.delivery.jobId && <Badge tone={JOB_TONE[r.delivery.state]}>{r.delivery.state}</Badge>}
            </span>,
          ],
          [
            "회수",
            <span key="p" className="flex flex-wrap items-center gap-2">
              <span className="dd-num">{legLine(r.pickup)}</span>
              {r.pickup.jobId && <Badge tone={JOB_TONE[r.pickup.state]}>{r.pickup.state}</Badge>}
            </span>,
          ],
        ]}
      />

      {r.status !== "취소" && (
        <section className="border-b border-[var(--dd-hairline-soft)] py-5">
          <h3 className="text-[14px] font-semibold leading-5 text-[var(--dd-ink)]">진행 기록</h3>
          <ol className="mt-3 grid grid-cols-5 gap-2">
            {steps.map(([label, at]) => (
              <li key={label} className="min-w-0">
                <span className={`block h-1 rounded-full ${at ? "bg-[var(--dd-ink)]" : "bg-[var(--dd-strong)]"}`} />
                <span className={`mt-2 block truncate text-[12px] leading-4 ${at ? "font-medium text-[var(--dd-ink)]" : "text-[var(--dd-muted-soft)]"}`}>{label}</span>
                <span className="dd-num block text-[12px] leading-4 text-[var(--dd-muted)]">{at ?? "대기"}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="border-b border-[var(--dd-hairline-soft)] py-5">
        <h3 className="text-[14px] font-semibold leading-5 text-[var(--dd-ink)]">결제 정보</h3>
        <dl className="mt-3 space-y-2 text-[14px] leading-5">
          {(
            [
              [`대여료 (${r.days}일)`, r.rent],
              ["배송, 회수비", r.ship],
              ["보증금 (반납 검수 후 환불)", r.deposit],
              ["쿠폰 할인", -r.coupon],
            ] as [string, number][]
          )
            .filter(([, v]) => v !== 0)
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-[var(--dd-muted)]">{k}</dt>
                <dd className="dd-num text-[var(--dd-ink)]">
                  {v < 0 ? "−" : ""}
                  {num(Math.abs(v))}
                </dd>
              </div>
            ))}
          <div className="flex justify-between gap-4 border-t border-[var(--dd-hairline)] pt-3">
            <dt className="font-semibold text-[var(--dd-ink)]">결제 금액 (원)</dt>
            <dd className="dd-num text-[16px] font-semibold text-[var(--dd-ink)]">{num(r.total)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-[13px]">
            <dt className="text-[var(--dd-muted)]">결제 수단</dt>
            <dd className="text-[var(--dd-body)]">{r.method}</dd>
          </div>
        </dl>
      </section>

      <section className="pt-5">
        <h3 className="text-[14px] font-semibold leading-5 text-[var(--dd-ink)]">상태 변경</h3>
        <label className="relative mt-3 block">
          <select
            aria-label="예약 상태"
            value={next}
            onChange={(e) => setNext(e.target.value as ResStatus)}
            className="h-10 w-full appearance-none rounded-[8px] border border-[var(--dd-hairline)] bg-white pl-3 pr-9 text-[14px] text-[var(--dd-ink)] outline-none focus:border-2 focus:border-[var(--dd-ink)] focus:pl-[11px]"
          >
            {RES_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dd-ink)]" />
        </label>
        {r.cancelReason && <p className="mt-2 text-[13px] text-[var(--dd-error)]">취소 사유: {r.cancelReason}</p>}
      </section>
    </Drawer>
  );
}

export function Reservations({ detail }: { detail?: string }) {
  const [tab, setTab] = useState<TabKey>("전체");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(getReservation(detail)?.id ?? null);

  const counts = countBy(RESERVATIONS, (r) => r.status);
  const rows = tab === "전체" ? RESERVATIONS : RESERVATIONS.filter((r) => r.status === tab);
  const visible = rows.slice((page - 1) * PAGE, page * PAGE);
  const open = getReservation(openId);

  return (
    <div className="space-y-6">
      <PageHead
        title="예약 관리"
        actions={
          <>
            <Button variant="secondary" icon={<DownloadSimple size={16} />}>
              내보내기
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex h-10 w-full max-w-[320px] items-center">
          <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 text-[var(--dd-muted)]" />
          <input
            aria-label="예약 검색"
            placeholder="예약번호, 고객명, 연락처"
            className="h-full w-full rounded-[8px] border border-[var(--dd-hairline)] pl-9 pr-3 text-[14px] outline-none placeholder:text-[var(--dd-muted-soft)] focus:border-2 focus:border-[var(--dd-ink)]"
          />
        </label>
        <div className="w-[140px]">
          <SelectInput defaultValue="전체 지역" options={["전체 지역", "성동구", "광진구", "마포구", "용산구", "강남구", "서초구", "송파구", "영등포구"]} />
        </div>
        <Button variant="secondary" icon={<FunnelSimple size={16} />}>
          필터
        </Button>
      </div>

      <div>
        <Tabs<TabKey>
          value={tab}
          onChange={(k) => {
            setTab(k);
            setPage(1);
          }}
          items={[{ key: "전체", label: "전체", count: RESERVATIONS.length }, ...RES_STATUSES.map((s) => ({ key: s as TabKey, label: s, count: counts[s] ?? 0 }))]}
        />
        <TableWrap>
          <thead>
            <tr>
              <Th>예약번호</Th>
              <Th>고객</Th>
              <Th>상품</Th>
              <Th>이용 일정</Th>
              <Th align="right">결제 금액 (원)</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const c = getCustomer(r.customerId);
              const p = getProduct(r.productId);
              return (
                <tr key={r.id} className={rowClass(r.id === openId)} onClick={() => setOpenId(r.id)}>
                  <Td>
                    <button type="button" className="dd-code text-left text-[var(--dd-ink)]" onClick={() => setOpenId(r.id)}>
                      {r.id}
                    </button>
                    <span className="dd-num block text-[12px] text-[var(--dd-muted)]">
                      {short(r.createdDate)} {r.createdTime}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[var(--dd-ink)]">{c?.name}</span>
                    <span className="dd-num block text-[12px] text-[var(--dd-muted)]">{c?.phone}</span>
                  </Td>
                  <Td>
                    <span className="flex min-w-0 items-center gap-3">
                      <ProductThumb product={p} size={32} />
                      <span className="min-w-0">
                        <span className="block max-w-[220px] truncate text-[var(--dd-ink)]" title={p.name}>
                          {p.name}
                        </span>
                        <span className="block text-[12px] text-[var(--dd-muted)]">
                          {r.size} | <span className="dd-code">{r.unit || "재고 해제"}</span>
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <span className="dd-num block whitespace-nowrap text-[var(--dd-ink)]">
                      {short(r.start)} {r.delivery.window.slice(0, 5)} → {short(r.end)} {r.pickup.window.slice(0, 5)}
                    </span>
                    <span className="block text-[12px] text-[var(--dd-muted)]">
                      {r.gu} | {r.days}일
                    </span>
                  </Td>
                  <Td align="right">
                    <span className={r.status === "취소" ? "text-[var(--dd-muted-soft)] line-through" : "text-[var(--dd-ink)]"}>{num(r.total)}</span>
                  </Td>
                  <Td>
                    <Badge tone={RES_TONE[r.status]} dot={r.status === "배송 중"}>
                      {r.status}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
        <Pagination page={page} pageSize={PAGE} total={rows.length} onChange={setPage} />
      </div>

      {open && <ReservationDrawer key={open.id} r={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
