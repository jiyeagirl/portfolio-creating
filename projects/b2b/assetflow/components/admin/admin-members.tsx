"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Prohibit, TrendUp, UserCirclePlus } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Stat,
  Table,
  Tabs,
} from "@/projects/b2b/assetflow/components/ui";
import { adminMembers, memberActivity } from "@/projects/b2b/assetflow/lib/admin-data";
import { manwon, type Tone } from "@/projects/b2b/assetflow/lib/navigation";

type Filter = "all" | "기업" | "리셀러" | "pending";

const STATE_TONE: Record<string, Tone> = {
  정상: "ink",
  "승인 대기": "warn",
  "이용 제한": "danger",
};

const TIER_TONE: Record<string, Tone> = {
  Enterprise: "ink",
  Business: "info",
  Standard: "neutral",
  플래티넘: "ink",
  골드: "warn",
  실버: "neutral",
};

const TIERS = ["Enterprise", "Business", "Standard", "플래티넘", "골드", "실버"];
const PER_PAGE = 6;

export function AdminMembers() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<(typeof adminMembers)[number] | null>(null);
  const [tier, setTier] = useState(TIERS[0]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminMembers.filter((m) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "pending"
            ? m.state !== "정상"
            : m.kind === filter;
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.biz.includes(q) ||
        m.manager.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const companies = adminMembers.filter((m) => m.kind === "기업");
  const resellers = adminMembers.filter((m) => m.kind === "리셀러");
  const pending = adminMembers.filter((m) => m.state !== "정상");

  const apply = (next: () => void) => {
    next();
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="회원 관리"
        title="기업 | 리셀러 관리"
        desc="가입 승인, 등급 조정, 이용 제한을 처리합니다. 등급은 분기 거래액과 분쟁 이력을 기준으로 조정합니다."
        actions={
          <Button variant="secondary" size="md" icon={<UserCirclePlus size={14} />}>
            수동 가입 등록
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="가입 기업" value={`${companies.length}개사`} delta="+2" note="이번 달 신규" />
        <Stat label="가입 리셀러" value={`${resellers.length}개사`} delta="+0" note="이번 달 신규" />
        <Stat
          label="승인 대기"
          value={`${adminMembers.filter((m) => m.state === "승인 대기").length}건`}
          delta="조치 필요"
          note="서류 검토 대기"
          emphasis
        />
        <Stat
          label="이용 제한"
          value={`${adminMembers.filter((m) => m.state === "이용 제한").length}개사`}
          delta="-1"
          note="지난달 대비"
        />
      </div>

      <Card>
        <CardHead title="회원 목록" desc={`전체 ${adminMembers.length}개사`} />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={(next) => apply(() => setQuery(next))}
              placeholder="기업명, 사업자번호, 담당자 검색"
            />
          </div>
        </div>

        <Tabs
          value={filter}
          onChange={(next) => apply(() => setFilter(next))}
          items={[
            { key: "all" as Filter, label: "전체", count: adminMembers.length },
            { key: "기업" as Filter, label: "기업", count: companies.length },
            { key: "리셀러" as Filter, label: "리셀러", count: resellers.length },
            { key: "pending" as Filter, label: "조치 필요", count: pending.length },
          ]}
        />

        <div className="mt-4">
          <Table
            head={["구분", "회원명", "사업자번호", "등급", "가입일", "거래", "누적 금액", "상태", ""]}
            align={["left", "left", "left", "left", "right", "right", "right", "left", "right"]}
          >
            {paged.map((member) => (
              <Row key={member.id} onClick={() => setTarget(member)}>
                <Cell muted nowrap>
                  {member.kind}
                </Cell>
                <Cell>
                  <span className="block text-[13px] font-medium text-[var(--af-ink)]">
                    {member.name}
                  </span>
                  <span className="block text-[11.5px] text-[var(--af-mute)]">
                    담당 {member.manager}
                  </span>
                </Cell>
                <Cell mono muted nowrap>
                  {member.biz}
                </Cell>
                <Cell>
                  <Badge tone={TIER_TONE[member.tier] ?? "neutral"}>{member.tier}</Badge>
                </Cell>
                <Cell align="right" mono muted nowrap>
                  {member.joinedAt}
                </Cell>
                <Cell align="right" mono nowrap>
                  {member.deals}건
                </Cell>
                <Cell align="right" mono strong nowrap>
                  {member.amount > 0 ? manwon(member.amount) : "-"}
                </Cell>
                <Cell>
                  <Badge tone={STATE_TONE[member.state]}>{member.state}</Badge>
                </Cell>
                <Cell align="right">
                  <Button variant="ghost" size="sm">
                    관리
                  </Button>
                </Cell>
              </Row>
            ))}
          </Table>

          {paged.length === 0 && (
            <p className="py-12 text-center text-[13.5px] text-[var(--af-mute)]">
              조건에 맞는 회원이 없습니다. 검색어나 필터를 바꿔 보세요.
            </p>
          )}

          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <Card>
        <CardHead title="회원 관리 이력" desc="승인, 등급 변경, 이용 제한 처리 기록" />
        <Table head={["일시", "처리자", "작업", "대상", "사유"]} align={["left", "left", "left", "left", "left"]}>
          {memberActivity.map((log) => (
            <Row key={`${log.at}-${log.target}`}>
              <Cell mono muted nowrap>
                {log.at}
              </Cell>
              <Cell>{log.actor}</Cell>
              <Cell strong nowrap>
                {log.action}
              </Cell>
              <Cell>{log.target}</Cell>
              <Cell muted>{log.note}</Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={target !== null}
        title={target?.name ?? ""}
        subtitle={target ? `${target.kind} | ${target.biz}` : undefined}
        onClose={() => setTarget(null)}
        footer={
          <div className="flex gap-2">
            {target?.state === "승인 대기" ? (
              <>
                <Button variant="danger" full onClick={() => setTarget(null)}>
                  반려
                </Button>
                <Button full onClick={() => setTarget(null)}>
                  가입 승인
                </Button>
              </>
            ) : target?.state === "이용 제한" ? (
              <>
                <Button variant="secondary" full onClick={() => setTarget(null)}>
                  닫기
                </Button>
                <Button full onClick={() => setTarget(null)}>
                  제한 해제
                </Button>
              </>
            ) : (
              <>
                <Button variant="danger" full onClick={() => setTarget(null)}>
                  이용 제한
                </Button>
                <Button full onClick={() => setTarget(null)}>
                  등급 변경 저장
                </Button>
              </>
            )}
          </div>
        }
      >
        {target && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Badge tone={STATE_TONE[target.state]}>{target.state}</Badge>
              <Badge tone={TIER_TONE[target.tier] ?? "neutral"}>{target.tier}</Badge>
            </div>

            <DefList
              columns={1}
              items={[
                { label: "구분", value: target.kind },
                { label: "사업자등록번호", value: <span className="af-mono">{target.biz}</span> },
                { label: "가입일", value: target.joinedAt },
                { label: "담당자", value: target.manager },
                { label: "누적 거래", value: `${target.deals}건` },
                {
                  label: "누적 금액",
                  value: <span className="af-mono">{target.amount > 0 ? manwon(target.amount) : "-"}</span>,
                },
              ]}
            />

            {target.state === "승인 대기" ? (
              <div className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
                <p className="text-[13px] font-medium text-[var(--af-ink)]">제출 서류 검토</p>
                <ul className="mt-2.5 space-y-2">
                  {[
                    { k: "사업자등록증", ok: true },
                    { k: "법인 인감증명서", ok: true },
                    { k: "정산 계좌 사본", ok: false },
                  ].map((doc) => (
                    <li key={doc.k} className="flex items-center justify-between text-[12.5px]">
                      <span className="text-[var(--af-body)]">{doc.k}</span>
                      <span
                        className={`flex items-center gap-1.5 ${
                          doc.ok ? "text-[var(--af-link-deep)]" : "text-[var(--af-warn-deep)]"
                        }`}
                      >
                        {doc.ok ? <CheckCircle size={13} weight="fill" /> : <Prohibit size={13} />}
                        {doc.ok ? "확인 완료" : "미제출"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Field label="등급 조정" hint="등급에 따라 수수료율과 정산 주기가 달라집니다.">
                <Select value={tier} options={TIERS} onChange={setTier} />
              </Field>
            )}

            {target.state === "이용 제한" && (
              <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-error-soft)] px-3.5 py-3">
                <Prohibit size={14} className="mt-px shrink-0 text-[var(--af-error-deep)]" />
                <p className="text-[12px] leading-[18px] text-[var(--af-error-deep)]">
                  입찰 후 철회 3회로 30일 이용 제한이 적용됐습니다. 2026. 08. 21 자동 해제됩니다.
                </p>
              </div>
            )}

            {target.state === "정상" && target.deals > 40 && (
              <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-link-soft)] px-3.5 py-3">
                <TrendUp size={14} className="mt-px shrink-0 text-[var(--af-link-deep)]" />
                <p className="text-[12px] leading-[18px] text-[var(--af-link-deep)]">
                  최근 분기 거래액이 상위 10%입니다. 다음 등급 심사 대상입니다.
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
