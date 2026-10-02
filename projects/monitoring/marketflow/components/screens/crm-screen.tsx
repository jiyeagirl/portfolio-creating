"use client";

import { useMemo, useState } from "react";
import { ChartLineUp, Plus, Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  BrandTile,
  Button,
  Card,
  CardHead,
  Cell,
  ContentThumb,
  DefList,
  Drawer,
  Field,
  Input,
  Meter,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Table,
  Textarea,
} from "@/projects/monitoring/marketflow/components/ui";
import { contentItems, customers as initialCustomers } from "@/projects/monitoring/marketflow/lib/mock-data";
import {
  CONTENT_TYPE_LABEL,
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUS_TONE,
  CUSTOMER_TIER_TONE,
  STATUS_LABEL,
  STATUS_TONE,
} from "@/projects/monitoring/marketflow/lib/navigation";
import type { Customer, CustomerStatus, CustomerTier } from "@/projects/monitoring/marketflow/lib/types";

const TIER_OPTIONS: (CustomerTier | "전체")[] = ["전체", "스타터", "프로", "엔터프라이즈"];
const STATUS_OPTIONS: (CustomerStatus | "전체")[] = ["전체", "active", "trial", "paused", "churned"];
const PER_PAGE = 7;

function emptyCustomer(): Customer {
  return {
    id: `cu-new-${Date.now()}`,
    name: "",
    industry: "",
    tier: "스타터",
    status: "trial",
    contractStart: "2025-09-08",
    contractEnd: "2025-10-08",
    monthlyQuota: 10,
    usedThisMonth: 0,
    manager: { name: "", email: "", phone: "" },
    brandTone: "",
    channels: [],
    notes: [],
    createdAt: "2025-09-08",
  };
}

export function CrmScreen() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<(typeof TIER_OPTIONS)[number]>("전체");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("전체");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "new" | null>(null);
  const [draft, setDraft] = useState<Customer>(emptyCustomer());
  const [noteDraft, setNoteDraft] = useState("");
  const [reportState, setReportState] = useState<"idle" | "loading" | "done">("idle");

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        if (search && !c.name.includes(search) && !c.industry.includes(search)) return false;
        if (tierFilter !== "전체" && c.tier !== tierFilter) return false;
        if (statusFilter !== "전체" && c.status !== statusFilter) return false;
        return true;
      }),
    [customers, search, tierFilter, statusFilter],
  );

  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selected = customers.find((c) => c.id === selectedId);
  const selectedContent = selected ? contentItems.filter((c) => c.customerId === selected.id) : [];

  function openDetail(id: string) {
    setSelectedId(id);
    setDrawerMode("view");
    setReportState("idle");
  }

  function openNew() {
    setDraft(emptyCustomer());
    setDrawerMode("new");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedId(null);
    setNoteDraft("");
    setReportState("idle");
  }

  function saveNew() {
    if (!draft.name.trim()) return;
    setCustomers((prev) => [{ ...draft }, ...prev]);
    closeDrawer();
  }

  function addNote() {
    if (!noteDraft.trim() || !selected) return;
    const note = { id: `n-${selected.id}-${selected.notes.length + 1}`, at: "2025-09-08", author: "박서연", content: noteDraft };
    setCustomers((prev) => prev.map((c) => (c.id === selected.id ? { ...c, notes: [note, ...c.notes] } : c)));
    setNoteDraft("");
  }

  function generateReport() {
    setReportState("loading");
    window.setTimeout(() => setReportState("done"), 800);
  }

  const reportStats = selected
    ? {
        total: selectedContent.length,
        published: selectedContent.filter((c) => c.status === "published").length,
        avgScore: selectedContent.length
          ? Math.round((selectedContent.reduce((s, c) => s + c.aiScore, 0) / selectedContent.length) * 10) / 10
          : 0,
        topChannel:
          Object.entries(
            selectedContent.reduce<Record<string, number>>((acc, c) => {
              c.channels.forEach((ch) => (acc[ch] = (acc[ch] ?? 0) + 1));
              return acc;
            }, {}),
          ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-",
      }
    : null;

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="CUSTOMER RELATIONSHIP"
        title="고객 관리 (CRM)"
        desc="계약 중인 고객사의 이용 현황과 콘텐츠 이력, 상담 메모를 한 곳에서 관리합니다."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={openNew}>
            고객사 등록
          </Button>
        }
      />

      <Card padded={false} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <Field label="검색">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="고객사명, 산업군 검색" />
          </Field>
        </div>
        <div className="w-full sm:w-[160px]">
          <Field label="플랜">
            <Select value={tierFilter} options={TIER_OPTIONS} onChange={(v) => { setTierFilter(v as typeof tierFilter); setPage(1); }} />
          </Field>
        </div>
        <div className="w-full sm:w-[160px]">
          <Field label="상태">
            <Select
              value={statusFilter === "전체" ? "전체" : CUSTOMER_STATUS_LABEL[statusFilter as CustomerStatus]}
              options={["전체", ...STATUS_OPTIONS.slice(1).map((s) => CUSTOMER_STATUS_LABEL[s as CustomerStatus])]}
              onChange={(label) => {
                const found = (Object.keys(CUSTOMER_STATUS_LABEL) as CustomerStatus[]).find((k) => CUSTOMER_STATUS_LABEL[k] === label);
                setStatusFilter(found ?? "전체");
                setPage(1);
              }}
            />
          </Field>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5">
          <Table head={["고객사", "플랜", "상태", "이번 달 사용량", "담당자", "계약 종료"]} align={["left", "left", "left", "left", "left", "right"]} minWidth={680}>
            {pageItems.map((c) => (
              <Row key={c.id} onClick={() => openDetail(c.id)}>
                <Cell strong>
                  <span className="flex items-center gap-2.5">
                    <BrandTile name={c.name} size={30} />
                    <span>
                      <span className="block">{c.name}</span>
                      <span className="block text-[11.5px] font-normal text-[var(--mf-mute)]">{c.industry}</span>
                    </span>
                  </span>
                </Cell>
                <Cell>
                  <Badge tone={CUSTOMER_TIER_TONE[c.tier]}>{c.tier}</Badge>
                </Cell>
                <Cell>
                  <Badge tone={CUSTOMER_STATUS_TONE[c.status]}>{CUSTOMER_STATUS_LABEL[c.status]}</Badge>
                </Cell>
                <Cell>
                  <span className="flex w-[130px] flex-col gap-1">
                    <span className="mf-mono text-[12px] text-[var(--mf-body)]">
                      {c.usedThisMonth}/{c.monthlyQuota}건
                    </span>
                    <Meter value={(c.usedThisMonth / c.monthlyQuota) * 100} tone={c.usedThisMonth >= c.monthlyQuota ? "warn" : "ink"} />
                  </span>
                </Cell>
                <Cell muted>{c.manager.name}</Cell>
                <Cell align="right" mono muted>
                  {c.contractEnd}
                </Cell>
              </Row>
            ))}
          </Table>
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <Drawer
        open={drawerMode === "view" && !!selected}
        title={selected?.name ?? ""}
        subtitle={selected?.industry}
        onClose={closeDrawer}
      >
        {selected && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={CUSTOMER_TIER_TONE[selected.tier]}>{selected.tier}</Badge>
              <Badge tone={CUSTOMER_STATUS_TONE[selected.status]}>{CUSTOMER_STATUS_LABEL[selected.status]}</Badge>
            </div>

            <Card soft>
              <CardHead title="계약 / 이용 현황" />
              <DefList
                items={[
                  { label: "계약 기간", value: `${selected.contractStart} ~ ${selected.contractEnd}` },
                  { label: "월 콘텐츠 한도", value: `${selected.monthlyQuota}건` },
                  { label: "이번 달 사용량", value: `${selected.usedThisMonth}건` },
                  { label: "연동 채널", value: selected.channels.join(", ") || "없음" },
                  { label: "담당자", value: `${selected.manager.name} | ${selected.manager.phone}` },
                  { label: "담당자 이메일", value: selected.manager.email },
                ]}
              />
              <div className="mt-3">
                <Meter value={(selected.usedThisMonth / selected.monthlyQuota) * 100} tone={selected.usedThisMonth >= selected.monthlyQuota ? "warn" : "ink"} />
              </div>
            </Card>

            <Card>
              <CardHead title="브랜드 톤앤매너" />
              <p className="text-[13px] leading-6 text-[var(--mf-body)]">{selected.brandTone}</p>
            </Card>

            <Card>
              <CardHead
                title="AI 맞춤 리포트"
                desc="이 고객사의 콘텐츠 성과를 요약합니다"
                action={
                  <Button size="sm" variant="secondary" icon={<Sparkle size={13} />} onClick={generateReport} disabled={reportState === "loading"}>
                    {reportState === "loading" ? "생성 중..." : "리포트 생성"}
                  </Button>
                }
              />
              {reportState === "done" && reportStats && (
                <div className="mf-enter grid grid-cols-2 gap-3">
                  <div className="rounded-[6px] border border-[var(--mf-hairline)] p-3">
                    <p className="text-[11.5px] text-[var(--mf-mute)]">총 생성 콘텐츠</p>
                    <p className="mt-1 text-[18px] font-semibold text-[var(--mf-ink)]">{reportStats.total}건</p>
                  </div>
                  <div className="rounded-[6px] border border-[var(--mf-hairline)] p-3">
                    <p className="text-[11.5px] text-[var(--mf-mute)]">발행 완료</p>
                    <p className="mt-1 text-[18px] font-semibold text-[var(--mf-ink)]">{reportStats.published}건</p>
                  </div>
                  <div className="rounded-[6px] border border-[var(--mf-hairline)] p-3">
                    <p className="text-[11.5px] text-[var(--mf-mute)]">평균 AI 점수</p>
                    <p className="mt-1 text-[18px] font-semibold text-[var(--mf-ink)]">{reportStats.avgScore}점</p>
                  </div>
                  <div className="rounded-[6px] border border-[var(--mf-hairline)] p-3">
                    <p className="flex items-center gap-1 text-[11.5px] text-[var(--mf-mute)]">
                      <ChartLineUp size={12} />
                      주력 채널
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-[var(--mf-ink)]">{reportStats.topChannel}</p>
                  </div>
                </div>
              )}
              {reportState === "idle" && <p className="text-[12.5px] text-[var(--mf-mute)]">리포트 생성 버튼을 눌러 최근 성과를 요약합니다.</p>}
            </Card>

            <Card padded={false}>
              <div className="p-5 pb-0">
                <CardHead title="생성 콘텐츠" desc={`총 ${selectedContent.length}건`} />
              </div>
              <ul className="divide-y divide-[var(--mf-hairline)] px-5 pb-3">
                {selectedContent.length === 0 && <li className="py-4 text-[13px] text-[var(--mf-mute)]">아직 생성된 콘텐츠가 없습니다.</li>}
                {selectedContent.slice(0, 6).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <ContentThumb photo={item.thumbnail} title={item.title} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--mf-ink)]">{item.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-[var(--mf-mute)]">{CONTENT_TYPE_LABEL[item.type]}</p>
                    </div>
                    <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHead title="메모 / 상담 이력" />
              <div className="flex gap-2">
                <Textarea value={noteDraft} onChange={setNoteDraft} rows={2} placeholder="상담 내용을 기록하세요" />
              </div>
              <div className="mt-2">
                <Button size="sm" variant="secondary" onClick={addNote}>
                  메모 추가
                </Button>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {selected.notes.map((n) => (
                  <li key={n.id} className="rounded-[8px] border border-[var(--mf-hairline)] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px] font-medium text-[var(--mf-ink)]">{n.author}</p>
                      <p className="mf-mono text-[11px] text-[var(--mf-mute)]">{n.at}</p>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-5 text-[var(--mf-body)]">{n.content}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </Drawer>

      <Drawer open={drawerMode === "new"} title="고객사 등록" subtitle="신규 고객사 정보를 입력하세요" onClose={closeDrawer} footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeDrawer}>취소</Button>
          <Button onClick={saveNew}>등록하기</Button>
        </div>
      }>
        <div className="flex flex-col gap-4">
          <Field label="고객사명" required>
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="예: L물류" />
          </Field>
          <Field label="산업군" required>
            <Input value={draft.industry} onChange={(v) => setDraft((d) => ({ ...d, industry: v }))} placeholder="예: 물류, 유통" />
          </Field>
          <Field label="플랜">
            <Select value={draft.tier} options={["스타터", "프로", "엔터프라이즈"]} onChange={(v) => setDraft((d) => ({ ...d, tier: v as CustomerTier }))} />
          </Field>
          <Field label="월 콘텐츠 한도">
            <Input value={String(draft.monthlyQuota)} type="number" onChange={(v) => setDraft((d) => ({ ...d, monthlyQuota: Number(v) || 0 }))} />
          </Field>
          <Field label="담당자 이름">
            <Input value={draft.manager.name} onChange={(v) => setDraft((d) => ({ ...d, manager: { ...d.manager, name: v } }))} />
          </Field>
          <Field label="담당자 이메일">
            <Input value={draft.manager.email} onChange={(v) => setDraft((d) => ({ ...d, manager: { ...d.manager, email: v } }))} />
          </Field>
          <Field label="담당자 연락처">
            <Input value={draft.manager.phone} onChange={(v) => setDraft((d) => ({ ...d, manager: { ...d.manager, phone: v } }))} />
          </Field>
          <Field label="브랜드 톤앤매너">
            <Textarea value={draft.brandTone} onChange={(v) => setDraft((d) => ({ ...d, brandTone: v }))} rows={3} />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
