"use client";

import { useState } from "react";
import { Check, Plus, X } from "@phosphor-icons/react";
import { ADMIN_EVENT_APPROVALS, EVENTS } from "@/projects/community/locly/lib/mock-data";
import type { AdminApproval } from "@/projects/community/locly/lib/types";
import {
  APPROVAL_TONE,
  AdminButton,
  AdminPageHead,
  Cell,
  Drawer,
  Field,
  Panel,
  Row,
  StatusBadge,
  Table,
  Tabs,
} from "@/projects/community/locly-admin/components/admin-ui";

export function AdminEvents() {
  const [tab, setTab] = useState<"approvals" | "official">("approvals");
  const [approvals, setApprovals] = useState(ADMIN_EVENT_APPROVALS);
  const [creating, setCreating] = useState(false);

  const pending = approvals.filter((a) => a.status === "대기");
  const official = EVENTS.filter((e) => e.official);

  function decide(id: string, status: AdminApproval["status"]) {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHead
        title="행사 관리"
        lead="구청·주민센터가 주관하는 공식 행사를 등록하고, 주민이 신청한 행사를 검토해 승인합니다."
        action={
          <AdminButton variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} weight="bold" />
            공식 행사 등록
          </AdminButton>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "approvals", label: "주민 행사 승인", count: pending.length },
          { key: "official", label: "공식 행사", count: official.length },
        ]}
      />

      {tab === "approvals" && (
        <Panel padded={false}>
          <Table head={["행사명", "분류", "신청자", "신청일", "상태", "처리"]}>
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

      {tab === "official" && (
        <Panel padded={false}>
          <Table head={["행사명", "일정", "장소", "신청 현황", "후기", ""]}>
            {official.map((event) => {
              const rate = Math.round((event.applied / event.capacity) * 100);
              return (
                <Row key={event.id}>
                  <Cell strong>
                    <span className="flex items-center gap-2">
                      {event.title}
                      {event.pinned && <StatusBadge tone="info">상단고정</StatusBadge>}
                    </span>
                  </Cell>
                  <Cell>
                    {event.date} {event.time}
                  </Cell>
                  <Cell>{event.location}</Cell>
                  <Cell>
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--lc-surface-card)]">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${Math.min(100, rate)}%`,
                            backgroundColor: rate >= 90 ? "var(--lc-error)" : "var(--lc-ink)",
                          }}
                        />
                      </span>
                      <span className="whitespace-nowrap text-[13px] text-[var(--lc-muted)]">
                        {event.applied}/{event.capacity}
                      </span>
                    </span>
                  </Cell>
                  <Cell>{event.reviews.length}건</Cell>
                  <Cell align="right">
                    <AdminButton size="sm" variant="quiet">
                      수정
                    </AdminButton>
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </Panel>
      )}

      <Drawer
        open={creating}
        title="공식 행사 등록"
        subtitle="등록 즉시 주민 사이트 지역행사 목록에 공식 배지와 함께 노출됩니다."
        onClose={() => setCreating(false)}
        footer={
          <>
            <AdminButton onClick={() => setCreating(false)}>취소</AdminButton>
            <AdminButton variant="primary" onClick={() => setCreating(false)}>
              등록하기
            </AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <Field label="행사명" placeholder="예: 2026 나인동 여름밤 야시장" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="시작일" placeholder="2026-08-14" />
            <Field label="종료일" placeholder="2026-08-16" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="시간" placeholder="18:00 - 22:00" />
            <Field label="모집 정원" placeholder="300" />
          </div>
          <Field label="장소" placeholder="나인천 수변공원 일대" />
          <Field label="분류" placeholder="문화 / 마켓 / 교육 / 건강" hint="주민 사이트의 필터 항목과 동일하게 입력합니다." />
          <Field
            label="행사 소개"
            placeholder="행사 취지와 프로그램 구성을 주민이 이해할 수 있게 적어주세요."
            textarea
          />
        </div>
      </Drawer>
    </div>
  );
}
