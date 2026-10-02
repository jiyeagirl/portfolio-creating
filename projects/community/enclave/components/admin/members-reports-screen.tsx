"use client";

import { useMemo, useState } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  Cell,
  DefList,
  Drawer,
  Field,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Table,
  Tabs,
} from "@/projects/community/enclave/components/admin/admin-ui";
import { ADMIN_MEMBERS, REPORTS } from "@/projects/community/enclave/lib/mock-data";
import type { AdminMember, Report } from "@/projects/community/enclave/lib/types";

const PER_PAGE = 8;
const PENALTIES: NonNullable<Report["penalty"]>[] = ["경고", "7일 정지", "30일 정지", "영구정지", "조치없음"];

function VerifyMark({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle size={15} weight="fill" className="text-[var(--ec-accent)]" />
  ) : (
    <XCircle size={15} className="text-[var(--ec-muted)]" />
  );
}

function memberStatusTone(status: AdminMember["status"]) {
  return status === "정상" ? ("accent" as const) : status === "주의" ? ("warn" as const) : ("danger" as const);
}

function reportStatusTone(status: Report["status"]) {
  return status === "대기" ? ("warn" as const) : status === "처리중" ? ("accent" as const) : ("neutral" as const);
}

export function MembersReportsScreen() {
  const [section, setSection] = useState<"회원 관리" | "신고 관리">("회원 관리");

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="Members & Reports"
        title="회원 / 신고 관리"
        desc="단지 인증 상태와 이웃평판을 기준으로 회원을 관리하고, 접수된 신고를 처리합니다. 운영자가 가장 많이 사용하는 화면입니다."
      />
      <Tabs
        value={section}
        onChange={setSection}
        items={[
          { key: "회원 관리", label: "회원 관리" },
          { key: "신고 관리", label: "신고 관리", count: REPORTS.filter((r) => r.status === "대기").length },
        ]}
      />
      {section === "회원 관리" ? <MembersPanel /> : <ReportsPanel />}
    </div>
  );
}

function MembersPanel() {
  const [tab, setTab] = useState<AdminMember["status"] | "전체">("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<AdminMember | null>(null);

  const filtered = useMemo(() => {
    return ADMIN_MEMBERS.filter((m) => (tab === "전체" ? true : m.status === tab)).filter((m) =>
      query ? m.nickname.includes(query) : true,
    );
  }, [tab, query]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    전체: ADMIN_MEMBERS.length,
    정상: ADMIN_MEMBERS.filter((m) => m.status === "정상").length,
    주의: ADMIN_MEMBERS.filter((m) => m.status === "주의").length,
    정지: ADMIN_MEMBERS.filter((m) => m.status === "정지").length,
  };

  return (
    <div className="space-y-5">
      <Tabs
        value={tab}
        onChange={(v) => {
          setTab(v);
          setPage(1);
        }}
        items={[
          { key: "전체", label: "전체", count: counts.전체 },
          { key: "정상", label: "정상", count: counts.정상 },
          { key: "주의", label: "주의", count: counts.주의 },
          { key: "정지", label: "정지", count: counts.정지 },
        ]}
      />

      <div className="max-w-[320px]">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="닉네임 검색" />
      </div>

      <Card padded={false} className="p-5">
        <Table head={["닉네임", "동/호수", "단지", "가입일", "이메일인증", "단지인증", "이웃평판", "거래수", "상태"]} minWidth={840}>
          {paged.map((m) => (
            <Row key={m.id} onClick={() => setActive(m)}>
              <Cell strong>{m.nickname}</Cell>
              <Cell mono muted nowrap>{m.dong !== "-" ? `${m.dong} ${m.ho}` : m.ho}</Cell>
              <Cell muted>{m.complexName}</Cell>
              <Cell mono muted nowrap>{m.joinedAt}</Cell>
              <Cell align="center"><VerifyMark ok={m.emailVerified} /></Cell>
              <Cell align="center"><VerifyMark ok={m.complexVerified} /></Cell>
              <Cell mono align="right">{m.reputationScore}점</Cell>
              <Cell mono align="right">{m.dealCount}</Cell>
              <Cell align="center">
                <Badge tone={memberStatusTone(m.status)}>{m.status}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Card>

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.nickname ?? ""}
        subtitle={active ? `회원 ID ${active.id}` : undefined}
        footer={
          active && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary">경고 발송</Button>
              <Button variant="danger">정지 처리</Button>
            </div>
          )
        }
      >
        {active && (
          <div className="space-y-6">
            <DefList
              items={[
                { label: "상태", value: <Badge tone={memberStatusTone(active.status)}>{active.status}</Badge> },
                { label: "소속 단지", value: active.complexName },
                { label: "동/호수", value: active.dong !== "-" ? `${active.dong} ${active.ho}` : active.ho },
                { label: "가입일", value: active.joinedAt },
                { label: "이웃평판", value: `${active.reputationScore}점` },
                { label: "거래완료", value: `${active.dealCount}건` },
                { label: "누적 신고", value: `${active.reportCount}건` },
              ]}
            />
            <div>
              <p className="mb-2 text-[13px] font-medium text-[var(--ec-ink)]">인증 현황</p>
              <DefList
                columns={1}
                items={[
                  { label: "이메일 인증", value: active.emailVerified ? "완료" : "미완료" },
                  { label: "단지 인증 (관리비 고지서)", value: active.complexVerified ? "완료" : "미완료" },
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function ReportsPanel() {
  const [tab, setTab] = useState<Report["status"] | "전체">("전체");
  const [reports, setReports] = useState(REPORTS);
  const [active, setActive] = useState<Report | null>(null);
  const [penalty, setPenalty] = useState<NonNullable<Report["penalty"]>>("경고");
  const [memo, setMemo] = useState("");

  const filtered = useMemo(() => reports.filter((r) => (tab === "전체" ? true : r.status === tab)), [tab, reports]);

  function openDetail(r: Report) {
    setActive(r);
    setPenalty(r.penalty ?? "경고");
    setMemo(r.memo ?? "");
  }

  function resolve() {
    if (!active) return;
    setReports((prev) => prev.map((r) => (r.id === active.id ? { ...r, status: "완료", penalty, memo } : r)));
    setActive(null);
  }

  return (
    <div className="space-y-5">
      <Tabs
        value={tab}
        onChange={setTab}
        items={(["전체", "대기", "처리중", "완료"] as const).map((t) => ({
          key: t,
          label: t,
          count: t === "전체" ? reports.length : reports.filter((r) => r.status === t).length,
        }))}
      />

      <Card padded={false} className="p-5">
        <Table head={["유형", "대상", "신고자", "피신고자", "접수일", "상태"]} minWidth={720}>
          {filtered.map((r) => (
            <Row key={r.id} onClick={() => openDetail(r)}>
              <Cell strong>{r.type}</Cell>
              <Cell muted>{r.targetLabel}</Cell>
              <Cell>{r.reporterNickname}</Cell>
              <Cell>{r.reportedNickname}</Cell>
              <Cell mono muted nowrap>{r.createdAt}</Cell>
              <Cell><Badge tone={reportStatusTone(r.status)}>{r.status}</Badge></Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.type ?? ""}
        subtitle={active ? `접수일 ${active.createdAt}` : undefined}
        footer={
          active &&
          active.status !== "완료" && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setActive(null)}>취소</Button>
              <Button onClick={resolve}>처리완료로 저장</Button>
            </div>
          )
        }
      >
        {active && (
          <div className="space-y-6">
            <DefList
              items={[
                { label: "대상 유형", value: active.targetType },
                { label: "대상", value: active.targetLabel },
                { label: "신고자", value: active.reporterNickname },
                { label: "피신고자", value: active.reportedNickname },
                { label: "현재 상태", value: <Badge tone={reportStatusTone(active.status)}>{active.status}</Badge> },
              ]}
            />
            {active.status === "완료" ? (
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-[var(--ec-ink)]">처리 메모</p>
                <p className="text-[13.5px] leading-6 text-[var(--ec-body)]">{active.memo}</p>
                {active.penalty && (
                  <div className="mt-2">
                    <Badge tone={active.penalty === "조치없음" ? "neutral" : "danger"}>{active.penalty}</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="제재 수위">
                  <Select value={penalty} options={PENALTIES} onChange={(v) => setPenalty(v as NonNullable<Report["penalty"]>)} />
                </Field>
                <Field label="처리 메모" hint="회원 이력에 함께 기록됩니다">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={4}
                    placeholder="확인한 내용과 처리 사유를 입력하세요"
                    className="w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 py-2 text-[13.5px] leading-5 text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
