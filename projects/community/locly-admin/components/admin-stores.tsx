"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Plus, TrashSimple, X } from "@phosphor-icons/react";
import { ADMIN_STORE_APPROVALS, STORES } from "@/projects/community/locly/lib/mock-data";
import type { AdminApproval } from "@/projects/community/locly/lib/types";
import { StarRating } from "@/projects/community/locly/components/site/ui";
import {
  APPROVAL_TONE,
  AdminButton,
  AdminPageHead,
  Cell,
  Drawer,
  Field,
  Panel,
  Row,
  SearchField,
  StatusBadge,
  Table,
  Tabs,
} from "@/projects/community/locly-admin/components/admin-ui";

/** Every review across every store, newest first — the moderation queue view. */
const ALL_REVIEWS = STORES.flatMap((store) =>
  store.reviews.map((review, i) => ({
    id: `${store.id}-r${i}`,
    store: store.name,
    category: store.category,
    ...review,
  })),
).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export function AdminStores() {
  const [tab, setTab] = useState<"approvals" | "stores" | "reviews">("approvals");
  const [approvals, setApprovals] = useState(ADMIN_STORE_APPROVALS);
  const [query, setQuery] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);
  const [promoStore, setPromoStore] = useState<(typeof STORES)[number] | null>(null);

  const pending = approvals.filter((a) => a.status === "대기");
  const stores = STORES.filter((store) => {
    const q = query.trim().toLowerCase();
    return !q || store.name.toLowerCase().includes(q) || store.address.toLowerCase().includes(q);
  });
  const reviews = ALL_REVIEWS.filter((r) => !removed.includes(r.id));

  function decide(id: string, status: AdminApproval["status"]) {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHead
        title="동네 가게 관리"
        lead="사장님이 신청한 가게 등록을 검토하고, 진행 중인 이벤트와 주민 후기를 관리합니다."
        action={
          <StatusBadge tone={pending.length > 0 ? "wait" : "ok"}>
            승인 대기 {pending.length}건
          </StatusBadge>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "approvals", label: "등록 승인", count: approvals.length },
          { key: "stores", label: "등록 가게", count: STORES.length },
          { key: "reviews", label: "후기 관리", count: reviews.length },
        ]}
      />

      {tab === "approvals" && (
        <Panel padded={false}>
          <Table head={["가게명", "분류", "신청자", "신청일", "상태", "처리"]}>
            {approvals.map((item) => (
              <Row key={item.id}>
                <Cell strong>{item.name}</Cell>
                <Cell>{item.category}</Cell>
                <Cell>{item.requester}</Cell>
                <Cell>{item.requestedAt}</Cell>
                <Cell>
                  <StatusBadge tone={APPROVAL_TONE[item.status]}>{item.status}</StatusBadge>
                </Cell>
                <Cell align="right">
                  {item.status === "대기" ? (
                    <span className="flex justify-end gap-2">
                      <AdminButton size="sm" variant="danger" onClick={() => decide(item.id, "반려")}>
                        <X size={13} weight="bold" />
                        반려
                      </AdminButton>
                      <AdminButton size="sm" variant="primary" onClick={() => decide(item.id, "승인")}>
                        <Check size={13} weight="bold" />
                        승인
                      </AdminButton>
                    </span>
                  ) : (
                    <AdminButton size="sm" variant="quiet" onClick={() => decide(item.id, "대기")}>
                      처리 취소
                    </AdminButton>
                  )}
                </Cell>
              </Row>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "stores" && (
        <Panel padded={false}>
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--lc-hairline)] px-6 py-4">
            <SearchField value={query} onChange={setQuery} placeholder="가게명 또는 주소 검색" />
          </div>
          <Table head={["가게", "분류", "평점", "후기", "진행 이벤트", ""]}>
            {stores.map((store) => (
              <Row key={store.id}>
                <Cell strong>
                  <span className="flex items-center gap-3">
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[6px]">
                      <Image src={store.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate">{store.name}</span>
                      <span className="block truncate text-[12px] font-normal text-[var(--lc-muted-soft)]">
                        {store.address}
                      </span>
                    </span>
                  </span>
                </Cell>
                <Cell>{store.category}</Cell>
                <Cell>
                  <span className="flex items-center gap-2">
                    <StarRating rating={store.rating} size={12} />
                    <span className="text-[13px] font-medium text-[var(--lc-ink)]">{store.rating}</span>
                  </span>
                </Cell>
                <Cell>{store.reviewCount}건</Cell>
                <Cell>
                  {store.promo ? (
                    <span className="line-clamp-1 max-w-[220px]">{store.promo}</span>
                  ) : (
                    <span className="text-[var(--lc-muted-soft)]">없음</span>
                  )}
                </Cell>
                <Cell align="right">
                  <AdminButton size="sm" variant="quiet" onClick={() => setPromoStore(store)}>
                    <Plus size={13} weight="bold" />
                    이벤트
                  </AdminButton>
                </Cell>
              </Row>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-[14px] text-[var(--lc-muted)]">
                  조건에 맞는 가게가 없습니다.
                </td>
              </tr>
            )}
          </Table>
        </Panel>
      )}

      {tab === "reviews" && (
        <Panel padded={false}>
          <div className="flex flex-col divide-y divide-[var(--lc-hairline-soft)]">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-5 px-6 py-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-medium text-[var(--lc-ink)]">{review.store}</span>
                    <StatusBadge>{review.category}</StatusBadge>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.55] text-[var(--lc-body)]">{review.content}</p>
                  <p className="mt-2 text-[13px] text-[var(--lc-muted-soft)]">
                    {review.author} · {review.createdAt}
                  </p>
                </div>
                <AdminButton
                  size="sm"
                  variant="danger"
                  onClick={() => setRemoved((prev) => [...prev, review.id])}
                >
                  <TrashSimple size={13} />
                  숨김
                </AdminButton>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="px-6 py-16 text-center text-[14px] text-[var(--lc-muted)]">
                표시할 후기가 없습니다.
              </p>
            )}
          </div>
        </Panel>
      )}

      <Drawer
        open={!!promoStore}
        title="가게 이벤트 등록"
        subtitle={promoStore ? `${promoStore.name} · ${promoStore.category}` : undefined}
        onClose={() => setPromoStore(null)}
        footer={
          <>
            <AdminButton onClick={() => setPromoStore(null)}>취소</AdminButton>
            <AdminButton variant="primary" onClick={() => setPromoStore(null)}>
              등록하기
            </AdminButton>
          </>
        }
      >
        {promoStore && (
          <div className="flex flex-col gap-5">
            {promoStore.promo && (
              <div className="rounded-[12px] bg-[var(--lc-surface-card)] p-5">
                <p className="text-[13px] text-[var(--lc-muted)]">현재 진행 중</p>
                <p className="mt-2 text-[15px] font-medium text-[var(--lc-ink)]">{promoStore.promo}</p>
              </div>
            )}
            <Field label="이벤트명" placeholder="예: 평일 점심 아메리카노 1,000원 할인" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="시작일" placeholder="2026-08-01" />
              <Field label="종료일" placeholder="2026-08-31" />
            </div>
            <Field
              label="상세 안내"
              placeholder="적용 조건과 제외 대상을 함께 적어주세요."
              textarea
              hint="등록한 내용은 동네가게 상세 화면 상단에 노출됩니다."
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
