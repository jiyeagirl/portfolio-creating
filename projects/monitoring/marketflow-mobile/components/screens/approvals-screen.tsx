"use client";

import { useMemo, useState } from "react";
import { ArrowsDownUp, FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";
import {
  Card,
  ContentTypeBadge,
  EmptyState,
  FilterChip,
  ScreenHeader,
  SearchInput,
  StatusBadge,
} from "@/projects/monitoring/marketflow-mobile/components/ui";
import { formatDateShort } from "@/projects/monitoring/marketflow-mobile/lib/format";
import { picsumUrl } from "@/projects/monitoring/marketflow-mobile/lib/image";
import { assignees, contentItems, getAssigneeById, getBrandById } from "@/projects/monitoring/marketflow-mobile/lib/mock-data";
import type { MarketflowMobileNavigate } from "@/projects/monitoring/marketflow-mobile/lib/navigation";
import {
  CHANNEL_LABEL,
  type ApprovalStatus,
  type ChannelId,
  type ContentType,
} from "@/projects/monitoring/marketflow-mobile/lib/types";

type TypeFilter = ContentType | "all";
type ChannelFilter = ChannelId | "all";
type AssigneeFilter = string | "all";
type SortKey = "deadline" | "recent";

const TYPE_OPTIONS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "blog", label: "블로그" },
  { key: "card-news", label: "카드뉴스" },
  { key: "short-form", label: "숏폼" },
];

const ALL_CHANNELS: ChannelId[] = ["naver-blog", "instagram", "youtube-shorts", "facebook", "kakao-channel"];

export function ApprovalsScreen({
  getStatus,
  onNavigate,
}: {
  getStatus: (id: string) => ApprovalStatus;
  onNavigate: MarketflowMobileNavigate;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [sort, setSort] = useState<SortKey>("deadline");
  const [sheetOpen, setSheetOpen] = useState(false);

  const inboxItems = useMemo(
    () =>
      contentItems.filter((item) => {
        const status = getStatus(item.id);
        return status === "pending" || status === "changes-requested" || status === "rejected";
      }),
    [getStatus],
  );

  const filtered = useMemo(() => {
    const list = inboxItems.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (channelFilter !== "all" && !item.channelIds.includes(channelFilter)) return false;
      if (assigneeFilter !== "all" && item.assigneeId !== assigneeFilter) return false;
      if (search.trim() && !item.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
    return [...list].sort((a, b) =>
      sort === "deadline"
        ? a.scheduledAt.localeCompare(b.scheduledAt)
        : b.createdAt.localeCompare(a.createdAt),
    );
  }, [inboxItems, typeFilter, channelFilter, assigneeFilter, search, sort]);

  const activeExtraFilters = (channelFilter !== "all" ? 1 : 0) + (assigneeFilter !== "all" ? 1 : 0);

  function resetFilters() {
    setChannelFilter("all");
    setAssigneeFilter("all");
    setSort("deadline");
  }

  return (
    <div>
      <ScreenHeader title="승인함" subtitle={`${inboxItems.length}건 확인 필요`} />

      <div className="flex flex-col gap-3 px-4 pt-4">
        <SearchInput value={search} onChange={setSearch} placeholder="콘텐츠 제목 검색" icon={<MagnifyingGlass size={16} />} />

        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TYPE_OPTIONS.map((option) => (
            <FilterChip
              key={option.key}
              label={option.label}
              active={typeFilter === option.key}
              onClick={() => setTypeFilter(option.key)}
            />
          ))}
          <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--mfm-hairline)]" />
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] px-3.5 py-2 text-[12.5px] font-medium text-[var(--mfm-body)]"
          >
            <FunnelSimple size={14} />
            필터
            {activeExtraFilters > 0 && (
              <span className="mfm-tabular flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--mfm-primary)] px-1 text-[9.5px] font-bold leading-none text-[var(--mfm-on-primary)]">
                {activeExtraFilters}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSort((prev) => (prev === "deadline" ? "recent" : "deadline"))}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] px-3.5 py-2 text-[12.5px] font-medium text-[var(--mfm-body)]"
          >
            <ArrowsDownUp size={14} />
            {sort === "deadline" ? "마감임박순" : "최신등록순"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-28 pt-4">
        {filtered.length === 0 && (
          <EmptyState
            icon={<MagnifyingGlass size={22} />}
            title="검색 결과가 없어요"
            body="다른 검색어나 필터 조건을 사용해보세요."
          />
        )}
        {filtered.map((item) => {
          const brand = getBrandById(item.brandId);
          const assignee = getAssigneeById(item.assigneeId);
          const status = getStatus(item.id);
          return (
            <Card
              key={item.id}
              as="button"
              onClick={() => onNavigate("contentReview", item.id)}
              className="flex gap-3 px-3.5 py-3.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={picsumUrl(item.heroImageId, 96, 96)}
                alt=""
                className="h-14 w-14 shrink-0 rounded-[10px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-[13.5px] font-semibold leading-[1.35] text-[var(--mfm-ink)]">
                    {item.title}
                  </p>
                  <span className="shrink-0">
                    <StatusBadge status={status} />
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <ContentTypeBadge type={item.type} />
                  <span className="text-[11px] text-[var(--mfm-muted-soft)]">{brand?.name}</span>
                </div>
                <p className="mfm-tabular mt-1.5 text-[11px] text-[var(--mfm-muted)]">
                  {assignee?.name} | 발행예정 {formatDateShort(item.scheduledAt)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {sheetOpen && (
        <div className="absolute inset-0 z-30">
          <button
            type="button"
            aria-label="필터 닫기"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-[var(--mfm-surface)] px-5 pb-8 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-bold text-[var(--mfm-ink)]">필터</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="닫기"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--mfm-muted)] hover:bg-[var(--mfm-surface-soft)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-[12px] font-semibold text-[var(--mfm-muted)]">채널</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="전체" active={channelFilter === "all"} onClick={() => setChannelFilter("all")} />
                  {ALL_CHANNELS.map((channel) => (
                    <FilterChip
                      key={channel}
                      label={CHANNEL_LABEL[channel]}
                      active={channelFilter === channel}
                      onClick={() => setChannelFilter(channel)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12px] font-semibold text-[var(--mfm-muted)]">담당자</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="전체" active={assigneeFilter === "all"} onClick={() => setAssigneeFilter("all")} />
                  {assignees.map((person) => (
                    <FilterChip
                      key={person.id}
                      label={person.name}
                      active={assigneeFilter === person.id}
                      onClick={() => setAssigneeFilter(person.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={resetFilters}
                className="h-11 flex-1 rounded-[8px] border border-[var(--mfm-hairline)] text-[13.5px] font-semibold text-[var(--mfm-body)] active:bg-[var(--mfm-surface-soft)]"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="h-11 flex-1 rounded-[8px] bg-[var(--mfm-primary)] text-[13.5px] font-semibold text-[var(--mfm-on-primary)] active:bg-[var(--mfm-primary-active)]"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
