"use client";

import { useState } from "react";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { Badge, memberTone } from "@/projects/b2b/teefinder/components/ui";
import {
  Btn,
  EmptyRow,
  FormField,
  KeyValue,
  PageHeader,
  SidePanel,
  TableShell,
  Td,
  TextArea,
  Th,
} from "@/projects/b2b/teefinder/components/admin/admin-ui";

export function ApprovalsScreen() {
  const { members, setMemberStatus } = useStore();
  const pending = members.filter((m) => m.status === "승인 대기");
  /* 최근 처리 내역: 승인 또는 반려가 끝난 회원 최근순 */
  const handled = members
    .filter((m) => m.status === "정상" || m.status === "반려")
    .sort((x, y) => y.joinedAt.localeCompare(x.joinedAt))
    .slice(0, 4);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [tried, setTried] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = pending.find((m) => m.id === selectedId) ?? pending[0] ?? null;

  function done(message: string) {
    setToast(message);
    setSelectedId(null);
    setRejecting(false);
    setReason("");
    setTried(false);
    setTimeout(() => setToast(null), 3200);
  }

  return (
    <div>
      <PageHeader title="가입 승인" meta={`승인 대기 ${pending.length}건`} />

      {toast && (
        <div
          role="status"
          className="tf-slide mb-4 rounded-[6px] bg-[var(--tf-green-bg)] px-4 py-2.5 text-[13px] font-medium text-[var(--tf-green-fg)]"
        >
          {toast}
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <TableShell minWidth={600}>
          <thead>
            <tr>
              <Th>이름 / 연락처</Th>
              <Th>회원권 번호</Th>
              <Th>신청일</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--tf-line)]">
            {pending.length === 0 && <EmptyRow colSpan={4} text="승인 대기 중인 신청이 없습니다" />}
            {pending.map((m) => {
              const active = selected?.id === m.id;
              return (
                <tr
                  key={m.id}
                  onClick={() => {
                    setSelectedId(m.id);
                    setRejecting(false);
                    setReason("");
                    setTried(false);
                  }}
                  className={`cursor-pointer transition-colors hover:bg-[var(--tf-canvas)] ${
                    active ? "bg-[var(--tf-soft)] hover:bg-[var(--tf-soft)]" : ""
                  }`}
                >
                  <Td>
                    <div className="font-medium">{m.name}</div>
                    <div className="mt-0.5 text-[12px] text-[var(--tf-ink-3)]">{m.phone}</div>
                  </Td>
                  <Td className="tf-mono text-[12.5px]">{m.membershipNo}</Td>
                  <Td className="text-[13px] tabular-nums text-[var(--tf-ink-2)]">{m.joinedAt}</Td>
                  <Td>
                    <Badge tone={memberTone(m.status)} compact>
                      {m.status}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>

        {selected ? (
          <SidePanel
            key={selected.id}
            title="신청 상세"
            footer={
              rejecting ? (
                <>
                  <Btn onClick={() => setRejecting(false)}>취소</Btn>
                  <Btn
                    kind="danger"
                    className="flex-1"
                    onClick={() => {
                      setTried(true);
                      if (reason.trim() === "") return;
                      setMemberStatus(selected.id, "반려", reason.trim());
                      done(`${selected.name}님의 신청을 반려했습니다. 회원 앱에 사유가 안내됩니다.`);
                    }}
                  >
                    반려 확정
                  </Btn>
                </>
              ) : (
                <>
                  <Btn onClick={() => setRejecting(true)}>반려</Btn>
                  <Btn
                    kind="primary"
                    className="flex-1"
                    onClick={() => {
                      setMemberStatus(selected.id, "정상");
                      done(`${selected.name}님을 승인했습니다. 회원 앱의 승인 대기 화면이 해제됩니다.`);
                    }}
                  >
                    승인
                  </Btn>
                </>
              )
            }
          >
            <dl className="divide-y divide-[var(--tf-line)]">
              <KeyValue label="이름">{selected.name}</KeyValue>
              <KeyValue label="연락처">{selected.phone}</KeyValue>
              <KeyValue label="회원권 번호">
                <span className="tf-mono text-[12.5px]">{selected.membershipNo}</span>
              </KeyValue>
              <KeyValue label="회원권 종류">{selected.membershipLabel}</KeyValue>
              <KeyValue label="신청일">{selected.joinedAt}</KeyValue>
            </dl>
            {rejecting && (
              <FormField
                label="반려 사유"
                required
                error={tried && reason.trim() === "" ? "반려 사유를 입력해 주세요" : undefined}
              >
                <TextArea value={reason} onChange={setReason} rows={4} placeholder="회원 앱에 그대로 안내됩니다" />
              </FormField>
            )}
          </SidePanel>
        ) : (
          <div className="rounded-[8px] border border-dashed border-[var(--tf-line)] px-6 py-16 text-center text-[13.5px] text-[var(--tf-ink-3)]">
            선택할 신청이 없습니다
          </div>
        )}
      </div>

      <section className="mt-6 max-w-[760px]">
        <h2 className="pb-2 text-[14px] font-semibold">최근 처리 내역</h2>
        <ul className="divide-y divide-[var(--tf-line)] rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
          {handled.map((m) => (
            <li key={m.id} className="flex items-center gap-4 px-4 py-3 text-[13px]">
              <span className="w-[64px] shrink-0 tabular-nums text-[var(--tf-ink-3)]">{m.joinedAt.slice(5)}</span>
              <span className="w-[72px] shrink-0 font-medium">{m.name}</span>
              <Badge tone={memberTone(m.status)} compact>
                {m.status === "정상" ? "승인" : "반려"}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-[var(--tf-ink-2)]">
                {m.status === "반려" ? m.rejectReason : m.membershipLabel}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
