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
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Table,
  Tabs,
} from "@/projects/community/waypoint/components/admin/admin-ui";
import { ADMIN_MEMBERS } from "@/projects/community/waypoint/lib/mock-data";
import type { AdminMember } from "@/projects/community/waypoint/lib/types";

const PER_PAGE = 8;

function VerifyMark({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle size={15} weight="fill" className="text-[var(--wp-success)]" />
  ) : (
    <XCircle size={15} className="text-[var(--wp-muted)]" />
  );
}

export function MembersScreen() {
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
    <div className="space-y-6">
      <PageHead eyebrow="Members" title="회원 관리" desc="본인인증, 듀얼 GPS 인증, 신뢰지수를 기준으로 회원 상태를 관리합니다." />

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
        <Table head={["닉네임", "가입일", "본인인증", "집인증", "회사인증", "신뢰지수", "거래수", "상태"]} minWidth={720}>
          {paged.map((m) => (
            <Row key={m.id} onClick={() => setActive(m)}>
              <Cell strong>{m.nickname}</Cell>
              <Cell mono muted nowrap>{m.joinedAt}</Cell>
              <Cell align="center"><VerifyMark ok={m.phoneVerified} /></Cell>
              <Cell align="center"><VerifyMark ok={m.homeVerified} /></Cell>
              <Cell align="center"><VerifyMark ok={m.workVerified} /></Cell>
              <Cell mono align="right">{m.trustScore}</Cell>
              <Cell mono align="right">{m.dealCount}</Cell>
              <Cell align="center">
                <Badge tone={m.status === "정상" ? "success" : m.status === "주의" ? "warn" : "danger"}>{m.status}</Badge>
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
                { label: "상태", value: <Badge tone={active.status === "정상" ? "success" : active.status === "주의" ? "warn" : "danger"}>{active.status}</Badge> },
                { label: "가입일", value: active.joinedAt },
                { label: "신뢰지수", value: `${active.trustScore}점` },
                { label: "거래완료", value: `${active.dealCount}건` },
                { label: "누적 신고", value: `${active.reportCount}건` },
              ]}
            />
            <div>
              <p className="mb-2 text-[13px] font-medium text-[var(--wp-ink)]">인증 현황</p>
              <DefList
                columns={1}
                items={[
                  { label: "휴대폰 본인인증", value: active.phoneVerified ? "완료" : "미완료" },
                  { label: "집 동네 GPS 인증", value: active.homeVerified ? "완료" : "미완료" },
                  { label: "회사 동네 GPS 인증", value: active.workVerified ? "완료" : "미완료" },
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
