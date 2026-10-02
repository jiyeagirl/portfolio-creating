"use client";

import { useMemo, useState } from "react";
import { Plus, Rss, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  SearchInput,
  Select,
  Table,
  Toggle,
} from "@/projects/monitoring/marketflow/components/ui";
import { dataSources as initial } from "@/projects/monitoring/marketflow/lib/mock-data";
import type { DataSource, DataSourceType } from "@/projects/monitoring/marketflow/lib/types";

const TYPE_LABEL: Record<DataSourceType, string> = { rss: "RSS", api: "API", news: "뉴스 API" };
const INTERVAL_OPTIONS = ["30분마다", "1시간마다", "2시간마다", "3시간마다", "하루 1회"];

function emptySource(): DataSource {
  return {
    id: `ds-new-${Date.now()}`,
    name: "",
    type: "rss",
    url: "",
    category: "",
    keywords: [],
    interval: INTERVAL_OPTIONS[1],
    status: "active",
    lastCollectedAt: "-",
    itemsToday: 0,
    itemsTotal: 0,
    history: [],
  };
}

export function CollectionScreen() {
  const [sources, setSources] = useState<DataSource[]>(initial);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState<DataSource>(emptySource());
  const [keywordInput, setKeywordInput] = useState("");

  const filtered = useMemo(() => sources.filter((s) => !search || s.name.includes(search) || s.category.includes(search)), [sources, search]);
  const selected = sources.find((s) => s.id === selectedId);

  function toggleStatus(id: string) {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s)),
    );
  }

  function saveNew() {
    if (!draft.name.trim() || !draft.url.trim()) return;
    const keywords = keywordInput.split(",").map((k) => k.trim()).filter(Boolean);
    setSources((prev) => [{ ...draft, keywords }, ...prev]);
    setNewOpen(false);
    setDraft(emptySource());
    setKeywordInput("");
  }

  const totalToday = sources.reduce((sum, s) => sum + s.itemsToday, 0);
  const errorCount = sources.filter((s) => s.status === "error").length;

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="DATA COLLECTION"
        title="데이터 수집 관리"
        desc="RSS, 뉴스, API 소스를 등록하고 수집 키워드, 주기, 이력을 관리합니다. 수집된 데이터는 자동화 워크플로우의 트리거로 사용됩니다."
        actions={
          <Button icon={<Plus size={14} weight="bold" />} onClick={() => setNewOpen(true)}>
            소스 등록
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-[13px] text-[var(--mf-mute)]">등록된 소스</p>
          <p className="mt-2 text-[22px] font-semibold text-[var(--mf-ink)]">{sources.length}개</p>
        </Card>
        <Card>
          <p className="text-[13px] text-[var(--mf-mute)]">오늘 수집 건수</p>
          <p className="mt-2 text-[22px] font-semibold text-[var(--mf-ink)]">{totalToday}건</p>
        </Card>
        <Card className={errorCount > 0 ? "border-[var(--mf-danger-soft)] bg-[var(--mf-danger-soft)]" : ""}>
          <p className={`text-[13px] ${errorCount > 0 ? "text-[var(--mf-danger-deep)]" : "text-[var(--mf-mute)]"}`}>오류 발생 소스</p>
          <p className={`mt-2 text-[22px] font-semibold ${errorCount > 0 ? "text-[var(--mf-danger-deep)]" : "text-[var(--mf-ink)]"}`}>{errorCount}개</p>
        </Card>
      </div>

      <Card padded={false} className="p-4">
        <Field label="검색">
          <SearchInput value={search} onChange={setSearch} placeholder="소스명, 카테고리 검색" />
        </Field>
      </Card>

      <Card padded={false}>
        <div className="p-5">
          <Table head={["소스", "유형", "카테고리", "수집 주기", "오늘/누적", "상태"]} align={["left", "left", "left", "left", "left", "left"]} minWidth={680}>
            {filtered.map((s) => (
              <Row key={s.id} onClick={() => setSelectedId(s.id)}>
                <Cell strong>
                  <span className="flex items-center gap-2">
                    <Rss size={14} className="text-[var(--mf-mute)]" />
                    {s.name}
                  </span>
                </Cell>
                <Cell muted>{TYPE_LABEL[s.type]}</Cell>
                <Cell muted>{s.category}</Cell>
                <Cell muted>{s.interval}</Cell>
                <Cell mono muted>
                  {s.itemsToday}건 / {s.itemsTotal.toLocaleString("ko-KR")}건
                </Cell>
                <Cell>
                  <Badge tone={s.status === "active" ? "ink" : s.status === "error" ? "danger" : "neutral"} dot={s.status === "active"}>
                    {s.status === "active" ? "수집중" : s.status === "error" ? "오류" : "일시중지"}
                  </Badge>
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Drawer open={!!selected} title={selected?.name ?? ""} subtitle={selected?.category} onClose={() => setSelectedId(null)}>
        {selected && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between rounded-[8px] border border-[var(--mf-hairline)] p-4">
              <div>
                <p className="text-[13px] font-medium text-[var(--mf-ink)]">수집 활성화</p>
                <p className="mt-0.5 text-[12px] text-[var(--mf-mute)]">비활성화하면 워크플로우 트리거도 함께 멈춥니다</p>
              </div>
              <Toggle on={selected.status === "active"} onChange={() => toggleStatus(selected.id)} label={`${selected.name} 수집 활성화`} />
            </div>

            {selected.status === "error" && (
              <div className="flex items-start gap-2 rounded-[8px] border border-[var(--mf-danger-soft)] bg-[var(--mf-danger-soft)] p-3">
                <WarningCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--mf-danger-deep)]" />
                <p className="text-[13px] leading-5 text-[var(--mf-danger-deep)]">
                  {selected.history.find((h) => h.status === "failed")?.note ?? "최근 수집에 실패했습니다. 연동 정보를 확인해주세요."}
                </p>
              </div>
            )}

            <DefList
              items={[
                { label: "유형", value: TYPE_LABEL[selected.type] },
                { label: "수집 주기", value: selected.interval },
                { label: "마지막 수집", value: selected.lastCollectedAt === "-" ? "-" : selected.lastCollectedAt.slice(0, 16).replace("T", " ") },
                { label: "누적 수집 건수", value: `${selected.itemsTotal.toLocaleString("ko-KR")}건` },
              ]}
            />

            <Field label="연동 주소(URL)">
              <Input value={selected.url} onChange={() => undefined} />
            </Field>

            <Field label="수집 키워드">
              <div className="flex flex-wrap gap-2">
                {selected.keywords.map((k) => (
                  <Badge key={k}>{k}</Badge>
                ))}
              </div>
            </Field>

            <div>
              <CardHead title="수집 이력" desc={`최근 ${selected.history.length}건`} />
              <ul className="flex flex-col gap-2">
                {selected.history.map((h) => (
                  <li
                    key={h.id}
                    className={`flex items-center justify-between gap-3 rounded-[6px] border p-3 text-[12.5px] ${
                      h.status === "failed" ? "border-[var(--mf-danger-soft)] bg-[var(--mf-danger-soft)]" : "border-[var(--mf-hairline)]"
                    }`}
                  >
                    <span className="mf-mono text-[var(--mf-mute)]">{h.at.slice(0, 16).replace("T", " ")}</span>
                    <span className={h.status === "failed" ? "text-[var(--mf-danger-deep)]" : "text-[var(--mf-body)]"}>
                      {h.status === "failed" ? h.note ?? "수집 실패" : `${h.itemsCollected}건 수집`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={newOpen}
        title="새 데이터 소스 등록"
        onClose={() => setNewOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setNewOpen(false)}>취소</Button>
            <Button onClick={saveNew}>등록하기</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="소스 이름" required>
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="예: 펫케어 트렌드 뉴스 RSS" />
          </Field>
          <Field label="유형">
            <Select value={TYPE_LABEL[draft.type]} options={Object.values(TYPE_LABEL)} onChange={(label) => {
              const found = (Object.keys(TYPE_LABEL) as DataSourceType[]).find((k) => TYPE_LABEL[k] === label);
              if (found) setDraft((d) => ({ ...d, type: found }));
            }} />
          </Field>
          <Field label="연동 주소(URL)" required>
            <Input value={draft.url} onChange={(v) => setDraft((d) => ({ ...d, url: v }))} placeholder="https://feeds.example.kr/rss" />
          </Field>
          <Field label="카테고리">
            <Input value={draft.category} onChange={(v) => setDraft((d) => ({ ...d, category: v }))} placeholder="예: 펫케어" />
          </Field>
          <Field label="수집 키워드" hint="쉼표로 구분">
            <Input value={keywordInput} onChange={setKeywordInput} placeholder="키워드1, 키워드2" />
          </Field>
          <Field label="수집 주기">
            <Select value={draft.interval} options={INTERVAL_OPTIONS} onChange={(v) => setDraft((d) => ({ ...d, interval: v }))} />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
