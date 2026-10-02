"use client";

import { useMemo, useState } from "react";
import { CopySimple, FolderOpen, PencilSimple, Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  Cell,
  ChannelTag,
  EmptyState,
  FilterChips,
  PageHead,
  Pagination,
  Preview,
  Row,
  SearchInput,
  Segmented,
  Select,
  Table,
  Thumb,
} from "@/projects/monitoring/brandpilot/components/ui";
import { campaigns, contents } from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CHANNEL_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  shortAt,
  type Navigate,
} from "@/projects/monitoring/brandpilot/lib/navigation";
import type { ContentStatus } from "@/projects/monitoring/brandpilot/lib/types";

type View = "grid" | "table";
type StatusFilter = "all" | ContentStatus;

const PER_PAGE = 6;

export function LibraryScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [view, setView] = useState<View>("grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [campaign, setCampaign] = useState("전체 캠페인");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      contents.filter((c) => {
        if (status !== "all" && c.status !== status) return false;
        if (campaign !== "전체 캠페인" && c.campaignName !== campaign) return false;
        if (query && !c.title.includes(query) && !c.caption.includes(query)) return false;
        return true;
      }),
    [query, status, campaign],
  );

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function reset(next: () => void) {
    next();
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="콘텐츠"
        title="콘텐츠 라이브러리"
        desc="지금까지 만든 콘텐츠를 모아 봅니다. 성과가 좋았던 콘텐츠를 복제해 다음 캠페인의 출발점으로 씁니다."
        actions={
          <Segmented
            value={view}
            onChange={setView}
            items={[
              { key: "grid" as View, label: "그리드" },
              { key: "table" as View, label: "표" },
            ]}
          />
        }
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full max-w-[280px]">
            <SearchInput
              value={query}
              onChange={(v) => reset(() => setQuery(v))}
              placeholder="제목, 카피 검색"
            />
          </div>
          <div className="w-full max-w-[220px]">
            <Select
              value={campaign}
              options={["전체 캠페인", ...campaigns.map((c) => c.name)]}
              onChange={(v) => reset(() => setCampaign(v))}
            />
          </div>
          <span className="bp-mono ml-auto text-[12.5px] text-[var(--bp-mute)]">
            {filtered.length}건
          </span>
        </div>

        <FilterChips
          value={status}
          onChange={(v) => reset(() => setStatus(v))}
          items={[
            { key: "all" as StatusFilter, label: "전체", count: contents.length },
            ...(
              ["draft", "review", "approved", "scheduled", "published", "rejected"] as ContentStatus[]
            ).map((s) => ({
              key: s as StatusFilter,
              label: STATUS_LABEL[s],
              count: contents.filter((c) => c.status === s).length,
            })),
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={20} />}
          title="조건에 맞는 콘텐츠가 없습니다"
          desc="필터를 바꾸거나 검색어를 지워보세요."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                reset(() => {
                  setQuery("");
                  setStatus("all");
                  setCampaign("전체 캠페인");
                })
              }
            >
              필터 초기화
            </Button>
          }
        />
      ) : view === "grid" ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((c) => (
              <Card key={c.id} padded={false} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => onNavigate("editor", c.id)}
                  className="block w-full text-left"
                >
                  <Preview photo={c.photo} alt={c.title} ratio="4 / 3" rounded={0} />
                </button>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate("editor", c.id)}
                      className="min-w-0 flex-1 text-left text-[14px] font-medium leading-5 text-[var(--bp-ink)]"
                    >
                      {c.title}
                    </button>
                    <Badge tone={STATUS_TONE[c.status]} pulse={c.status === "generating"}>
                      {STATUS_LABEL[c.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-[var(--bp-mute)]">
                    {c.caption}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <ChannelTag channel={c.channel} label={CHANNEL_LABEL[c.channel]} />
                    <span className="bp-mono text-[12px] text-[var(--bp-mute)]">v{c.version}</span>
                    {c.aiGenerated && (
                      <Sparkle size={12} weight="fill" className="text-[var(--bp-accent)]" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--bp-hairline)] pt-3">
                    <span className="truncate text-[12px] text-[var(--bp-mute)]">{c.campaignName}</span>
                    <span className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        aria-label="복제"
                        className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--bp-mute)] transition-colors hover:bg-[var(--bp-soft-2)] hover:text-[var(--bp-ink)]"
                      >
                        <CopySimple size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label="편집"
                        onClick={() => onNavigate("editor", c.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--bp-mute)] transition-colors hover:bg-[var(--bp-soft-2)] hover:text-[var(--bp-ink)]"
                      >
                        <PencilSimple size={13} />
                      </button>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </>
      ) : (
        <Card>
          <Table
            head={["콘텐츠", "채널", "캠페인", "버전", "생성일", "상태"]}
            align={["left", "left", "left", "right", "right", "left"]}
            minWidth={780}
          >
            {paged.map((c) => (
              <Row key={c.id} onClick={() => onNavigate("editor", c.id)}>
                <Cell strong>
                  <span className="flex items-center gap-2.5">
                    <Thumb photo={c.photo} alt={c.title} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate">{c.title}</span>
                      <span className="mt-0.5 block truncate text-[12px] font-normal text-[var(--bp-mute)]">
                        {c.productLine}
                      </span>
                    </span>
                  </span>
                </Cell>
                <Cell nowrap>
                  <ChannelTag channel={c.channel} label={CHANNEL_LABEL[c.channel]} />
                </Cell>
                <Cell muted>{c.campaignName}</Cell>
                <Cell align="right" mono>
                  v{c.version}
                </Cell>
                <Cell align="right" mono muted nowrap>
                  {shortAt(c.createdAt)}
                </Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[c.status]} pulse={c.status === "generating"}>
                    {STATUS_LABEL[c.status]}
                  </Badge>
                </Cell>
              </Row>
            ))}
          </Table>
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </Card>
      )}
    </div>
  );
}
