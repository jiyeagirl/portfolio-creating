"use client";

import { useState } from "react";
import { MagnifyingGlass, Phone, ProhibitInset } from "@phosphor-icons/react";
import { CUSTOMERS, CUSTOMER_TONE, RES_TONE, getCustomer, short, type Customer } from "@/projects/platform/dressday/lib/admin-data";
import { getProduct, num } from "@/projects/platform/dressday/lib/catalog";
import {
  Avatar,
  Badge,
  Button,
  PageHead,
  Pagination,
  Panel,
  ProductThumb,
  SelectInput,
  TableWrap,
  Tabs,
  Td,
  Th,
} from "@/projects/platform/dressday/components/admin/admin-ui";

type DetailTab = "history" | "payments";
const PAGE = 12;

const KIND_TONE = { 결제: "wait", "보증금 환불": "done", "취소 환불": "stop", "추가 비용": "act" } as const;

function CustomerDetail({ c }: { c: Customer }) {
  const [tab, setTab] = useState<DetailTab>("history");
  const refunds = c.payments.filter((p) => p.amount < 0).length;
  // 이력 표 금액(보증금 포함 결제액)과 같은 기준. 취소 건은 전액 환불이라 뺀다
  const paid = c.history.filter((h) => h.status !== "취소").reduce((a, h) => a + h.total, 0);

  return (
    <Panel className="p-6">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={c.name} size={52} dark />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-semibold leading-7 text-[var(--dd-ink)]">{c.name}</h2>
            <Badge tone={CUSTOMER_TONE[c.status]}>{c.status}</Badge>
          </div>
          <p className="dd-num mt-0.5 text-[13px] leading-5 text-[var(--dd-muted)]">
            {c.phone} | 서울 {c.gu} | 가입 {c.joined.replaceAll("-", ".")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={<Phone size={14} />}>
            연락
          </Button>
          <Button size="sm" variant="danger" icon={<ProhibitInset size={14} />}>
            이용 제한
          </Button>
        </div>
      </div>

      {c.restricted && (
        <p className="mt-4 rounded-[8px] bg-[var(--dd-stop-bg)] px-3 py-2 text-[13px] text-[var(--dd-stop-fg)]">이용 제한: {c.restricted}</p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-y-4 border-y border-[var(--dd-hairline)] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[var(--dd-hairline)]">
        {[
          ["누적 대여 (회)", num(c.rentals)],
          ["누적 결제 (원)", num(paid)],
          ["보증금, 취소 환불 (건)", num(refunds)],
          ["최근 이용", c.lastUse ? short(c.lastUse) : "없음"],
        ].map(([k, v]) => (
          <div key={k} className="px-4 first:pl-0">
            <dt className="text-[12px] text-[var(--dd-muted)]">{k}</dt>
            <dd className="dd-num mt-0.5 text-[20px] font-semibold text-[var(--dd-ink)]">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <Tabs<DetailTab>
          value={tab}
          onChange={setTab}
          items={[
            { key: "history", label: "예약 및 렌탈 이력", count: c.history.length },
            { key: "payments", label: "결제 및 환불 이력", count: c.payments.length },
          ]}
        />
        {tab === "history" ? (
          <TableWrap minWidth={600}>
            <thead>
              <tr>
                <Th>예약번호</Th>
                <Th>상품</Th>
                <Th>기간</Th>
                <Th align="right">결제 금액 (원)</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {c.history.map((h) => {
                const p = getProduct(h.productId);
                return (
                  <tr key={h.id}>
                    <Td>
                      <span className="dd-code text-[var(--dd-ink)]">{h.id}</span>
                    </Td>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <ProductThumb product={p} size={24} />
                        <span className="min-w-0">
                          <span className="block max-w-[200px] truncate text-[var(--dd-ink)]" title={p.name}>
                            {p.name}
                          </span>
                          <span className="block text-[12px] text-[var(--dd-muted)]">{h.size}</span>
                        </span>
                      </span>
                    </Td>
                    <Td className="dd-num whitespace-nowrap">{h.period}</Td>
                    <Td align="right">
                      <span className={h.status === "취소" ? "text-[var(--dd-muted-soft)] line-through" : "text-[var(--dd-ink)]"}>{num(h.total)}</span>
                    </Td>
                    <Td>
                      <Badge tone={RES_TONE[h.status]}>{h.status}</Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        ) : (
          <TableWrap minWidth={600}>
            <thead>
              <tr>
                <Th>일시</Th>
                <Th>구분</Th>
                <Th>예약번호</Th>
                <Th>수단</Th>
                <Th align="right">금액 (원)</Th>
              </tr>
            </thead>
            <tbody>
              {c.payments.map((p, i) => (
                <tr key={`${p.id}-${p.kind}-${i}`}>
                  <Td className="dd-num whitespace-nowrap">{p.date}</Td>
                  <Td>
                    <Badge tone={KIND_TONE[p.kind]}>{p.kind}</Badge>
                  </Td>
                  <Td>
                    <span className="dd-code">{p.id}</span>
                  </Td>
                  <Td>
                    <span className="block max-w-[180px] truncate" title={p.method}>
                      {p.method}
                    </span>
                  </Td>
                  <Td align="right">
                    <span className={p.amount < 0 ? "text-[var(--dd-done-fg)]" : "text-[var(--dd-ink)]"}>
                      {p.amount < 0 ? "−" : ""}
                      {num(Math.abs(p.amount))}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-[var(--dd-hairline)] pt-5">
        <label className="block w-[200px]">
          <span className="text-[13px] font-medium text-[var(--dd-ink)]">이용 상태</span>
          <span className="mt-1.5 block">
            <SelectInput defaultValue={c.status === "이용 제한" ? "이용 제한" : "정상 이용"} options={["정상 이용", "이용 제한", "휴면 처리"]} />
          </span>
        </label>
        <Button variant="ink">저장</Button>
      </div>
    </Panel>
  );
}

export function Customers({ customer }: { customer?: string }) {
  const [selected, setSelected] = useState(getCustomer(customer)?.id ?? "c1");
  const [page, setPage] = useState(1);
  // 이용 제한 고객이 첫 페이지 3번째 행에 오게 한다 (상태 배지가 정보를 갖는 행)
  const ordered = (() => {
    const restricted = CUSTOMERS.filter((c) => c.status === "이용 제한");
    const rest = CUSTOMERS.filter((c) => c.status !== "이용 제한");
    return [...rest.slice(0, 2), ...restricted, ...rest.slice(2)];
  })();
  const visible = ordered.slice((page - 1) * PAGE, page * PAGE);
  const current = getCustomer(selected) ?? CUSTOMERS[0];

  return (
    <div className="space-y-6">
      <PageHead
        title="고객 관리"
      />

      <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside>
          <label className="relative flex h-10 items-center">
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 text-[var(--dd-muted)]" />
            <input
              aria-label="고객 검색"
              placeholder="이름, 연락처"
              className="h-full w-full rounded-[8px] border border-[var(--dd-hairline)] pl-9 pr-3 text-[14px] outline-none placeholder:text-[var(--dd-muted-soft)] focus:border-2 focus:border-[var(--dd-ink)]"
            />
          </label>
          <ul className="mt-3 divide-y divide-[var(--dd-hairline-soft)] border-y border-[var(--dd-hairline)]">
            {visible.map((c) => {
              const on = c.id === selected;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.id)}
                    aria-current={on ? "true" : undefined}
                    className={`flex w-full items-center gap-3 px-2 py-2.5 text-left ${on ? "bg-[var(--dd-soft)]" : ""}`}
                  >
                    <Avatar name={c.name} size={32} dark={on} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium leading-5 text-[var(--dd-ink)]">{c.name}</span>
                      <span className="dd-num block text-[12px] leading-4 text-[var(--dd-muted)]">
                        {c.phone} | {c.gu}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      {c.status !== "이용 중" && <Badge tone={CUSTOMER_TONE[c.status]}>{c.status}</Badge>}
                      <span className="dd-num text-[11px] text-[var(--dd-muted)]">대여 {c.rentals}회</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Pagination page={page} pageSize={PAGE} total={CUSTOMERS.length} onChange={setPage} />
        </aside>

        <CustomerDetail key={current.id} c={current} />
      </div>
    </div>
  );
}
